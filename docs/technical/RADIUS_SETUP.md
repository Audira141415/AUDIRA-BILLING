# 🔐 RADIUS Integration - AudiraNET

## Overview
RADIUS (Remote Authentication Dial-In User Service) untuk centralized authentication, authorization, dan accounting (AAA) untuk PPPoE users di MikroTik.

---

## Architecture

```
Customer → MikroTik (NAS) → RADIUS Server → MySQL/PostgreSQL
                                ↓
                          Accounting Logs
                          Session Management
                          Bandwidth Control (CoA)
```

---

## Installation Steps

### 1. Install FreeRADIUS

#### Windows (via WSL2):
```bash
wsl --install
wsl
sudo apt update
sudo apt install freeradius freeradius-mysql freeradius-utils
```

#### Linux:
```bash
sudo apt update
sudo apt install freeradius freeradius-mysql freeradius-utils
```

### 2. Configure Database

**Create RADIUS Database**:
```sql
CREATE DATABASE radius;
CREATE USER 'radius'@'localhost' IDENTIFIED BY 'radiuspassword';
GRANT ALL ON radius.* TO 'radius'@'localhost';
FLUSH PRIVILEGES;
```

**Import Schema**:
```bash
sudo mysql -u root radius < /etc/freeradius/3.0/mods-config/sql/main/mysql/schema.sql
```

### 3. Configure FreeRADIUS

**Edit `/etc/freeradius/3.0/mods-available/sql`**:
```
sql {
    driver = "rlm_sql_mysql"
    dialect = "mysql"
    
    server = "localhost"
    port = 3306
    login = "radius"
    password = "radiuspassword"
    radius_db = "radius"
    
    read_clients = yes
    client_table = "nas"
}
```

**Enable SQL Module**:
```bash
sudo ln -s /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/
```

**Edit `/etc/freeradius/3.0/sites-available/default`**:
```
authorize {
    sql
    -ldap
}

accounting {
    sql
}

session {
    sql
}

post-auth {
    sql
    Post-Auth-Type REJECT {
        sql
    }
}
```

**Edit `/etc/freeradius/3.0/radiusd.conf`**:
```
# Add MikroTik dictionary
$INCLUDE /etc/freeradius/3.0/dictionary
$INCLUDE /etc/freeradius/3.0/dictionary.mikrotik
```

### 4. Configure NAS (MikroTik)

**Add RADIUS Client**:
```sql
INSERT INTO nas (nasname, shortname, type, ports, secret, server, community, description) 
VALUES ('192.168.1.1', 'mikrotik-1', 'mikrotik', NULL, 'secretkey123', NULL, NULL, 'Main MikroTik Router');
```

**MikroTik Configuration**:
```
/radius
add address=192.168.1.100 secret=secretkey123 service=ppp

/ppp profile
set default use-compression=no use-encryption=no use-vj-compression=no use-mpls=no
add name=radius-profile use-compression=no use-encryption=no use-mpls=no local-address=10.10.10.1 remote-address=radius-pool

/ppp aaa
set use-radius=yes accounting=yes interim-update=5m
```

### 5. Add PPPoE Users

**radcheck table** (username/password):
```sql
INSERT INTO radcheck (username, attribute, op, value) VALUES
('customer1', 'Cleartext-Password', ':=', 'password123'),
('customer2', 'Cleartext-Password', ':=', 'password456');
```

**radreply table** (bandwidth limits):
```sql
-- 10 Mbps profile
INSERT INTO radreply (username, attribute, op, value) VALUES
('customer1', 'Mikrotik-Rate-Limit', ':=', '10M/10M'),
('customer1', 'Mikrotik-Address-List', ':=', 'premium');

-- 5 Mbps profile  
INSERT INTO radreply (username, attribute, op, value) VALUES
('customer2', 'Mikrotik-Rate-Limit', ':=', '5M/5M'),
('customer2', 'Mikrotik-Address-List', ':=', 'standard');
```

### 6. Test RADIUS

**Test Authentication**:
```bash
radtest customer1 password123 localhost 0 testing123
```

**Expected Output**:
```
Sent Access-Request Id 123 from 0.0.0.0:12345 to 127.0.0.1:1812 length 77
        User-Name = "customer1"
        User-Password = "password123"
Received Access-Accept Id 123 from 127.0.0.1:1812 to 0.0.0.0:0 length 44
        Mikrotik-Rate-Limit = "10M/10M"
```

### 7. Start FreeRADIUS

```bash
# Debug mode
sudo freeradius -X

# Production mode
sudo systemctl start freeradius
sudo systemctl enable freeradius
```

---

## Database Schema

### Main Tables:

**radcheck** - User credentials
```sql
username VARCHAR(64)
attribute VARCHAR(64) 
op VARCHAR(2)
value VARCHAR(253)
```

**radreply** - User attributes (bandwidth, etc)
```sql
username VARCHAR(64)
attribute VARCHAR(64)
op VARCHAR(2)
value VARCHAR(253)
```

**radacct** - Accounting/session logs
```sql
username VARCHAR(64)
nasipaddress VARCHAR(15)
acctstarttime DATETIME
acctstoptime DATETIME
acctsessiontime INT
acctinputoctets BIGINT
acctoutputoctets BIGINT
```

**radusergroup** - User group membership
```sql
username VARCHAR(64)
groupname VARCHAR(64)
priority INT
```

**radgroupcheck** - Group policies
```sql
groupname VARCHAR(64)
attribute VARCHAR(64)
op VARCHAR(2)
value VARCHAR(253)
```

**radgroupreply** - Group attributes
```sql
groupname VARCHAR(64)
attribute VARCHAR(64)
op VARCHAR(2)
value VARCHAR(253)
```

---

## Node.js Integration

### Install Dependencies:
```bash
npm install --save radius node-radius-client node-radius-utils
```

### Create RADIUS Service:
See `apps/backend/src/radius/radius.service.ts`

---

## CoA (Change of Authorization)

### Enable CoA in FreeRADIUS:
Edit `/etc/freeradius/3.0/sites-available/coa`:
```
server coa {
    listen {
        type = coa
        ipaddr = *
        port = 3799
        virtual_server = coa
    }
    
    recv-coa {
        ok
    }
    
    send-coa {
        ok
    }
}
```

### Use CoA to Change Bandwidth:
```bash
echo "User-Name=customer1,Mikrotik-Rate-Limit=20M/20M" | \
radclient 192.168.1.1:3799 coa secretkey123
```

---

## MikroTik Attributes

Common attributes untuk control:
- `Mikrotik-Rate-Limit` - Bandwidth limit (e.g., "10M/10M")
- `Mikrotik-Address-List` - Add to address list
- `Mikrotik-Recv-Limit` - Download limit in bytes
- `Mikrotik-Xmit-Limit` - Upload limit in bytes
- `Session-Timeout` - Auto disconnect after X seconds
- `Idle-Timeout` - Disconnect if idle X seconds

---

## Monitoring

**View Active Sessions**:
```sql
SELECT username, nasipaddress, acctstarttime, 
       TIMESTAMPDIFF(MINUTE, acctstarttime, NOW()) as duration_min,
       acctinputoctets, acctoutputoctets
FROM radacct 
WHERE acctstoptime IS NULL;
```

**View User Statistics**:
```sql
SELECT username,
       COUNT(*) as total_sessions,
       SUM(acctsessiontime) as total_time_sec,
       SUM(acctinputoctets + acctoutputoctets) as total_bytes
FROM radacct
WHERE username = 'customer1'
GROUP BY username;
```

---

## API Endpoints

Once implemented in backend:

```bash
# Create PPPoE user
POST /radius/users
{
  "username": "customer1",
  "password": "password123",
  "profile": "10mbps"
}

# Update bandwidth (CoA)
POST /radius/coa/bandwidth
{
  "username": "customer1",
  "speed": "20M/20M"
}

# Disconnect user
POST /radius/coa/disconnect
{
  "username": "customer1"
}

# Get active sessions
GET /radius/sessions

# Get user statistics
GET /radius/stats/:username
```

---

## Troubleshooting

**RADIUS not responding**:
```bash
sudo freeradius -X  # Debug mode
sudo tail -f /var/log/freeradius/radius.log
```

**MikroTik can't connect**:
- Check secret key matches
- Check firewall allows UDP 1812, 1813
- Test: `/radius print` in MikroTik

**User can't login**:
- Check radcheck table
- Test locally: `radtest username password localhost 0 testing123`
- Check accounting in radacct table

---

## Production Checklist

- [ ] FreeRADIUS installed and running
- [ ] MySQL/PostgreSQL configured
- [ ] NAS (MikroTik) added to nas table
- [ ] Test users created
- [ ] Bandwidth profiles configured
- [ ] CoA enabled for dynamic changes
- [ ] Accounting logs working
- [ ] Backup strategy for radius database
- [ ] Monitoring alerts configured
- [ ] API integration tested

---

## Security Best Practices

1. **Strong Secrets**: Use complex secret keys for NAS
2. **Firewall**: Limit RADIUS ports to MikroTik IPs only
3. **Encrypted Passwords**: Use hashed passwords, not cleartext
4. **Regular Backups**: Backup radius database daily
5. **Audit Logs**: Monitor authentication attempts
6. **Separate VLAN**: RADIUS server in management VLAN
