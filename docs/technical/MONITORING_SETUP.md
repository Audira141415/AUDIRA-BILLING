# 📊 Advanced Monitoring - AudiraNET

## Overview
Comprehensive network monitoring system untuk ISP dengan real-time metrics, alerting, dan performance tracking.

---

## Stack Options

### Option 1: LibreNMS (Recommended untuk ISP)
- **Pros**: ISP-focused, auto-discovery, graphing, alerting
- **Cons**: Requires dedicated server
- **Best for**: Production ISP environment

### Option 2: Grafana + InfluxDB + Telegraf  
- **Pros**: Flexible, beautiful dashboards, lightweight
- **Cons**: Manual configuration
- **Best for**: Custom monitoring needs

### Option 3: Zabbix
- **Pros**: Enterprise-grade, extensive features
- **Cons**: Complex setup
- **Best for**: Large deployments

---

## Implementation: Grafana Stack

### 1. Install InfluxDB (Time-series Database)

**Docker Compose** (Add to existing `docker-compose.yml`):
```yaml
services:
  influxdb:
    image: influxdb:2.7
    container_name: audiranet-influxdb
    ports:
      - "8086:8086"
    volumes:
      - influxdb-data:/var/lib/influxdb2
    environment:
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_USERNAME=admin
      - DOCKER_INFLUXDB_INIT_PASSWORD=adminpassword
      - DOCKER_INFLUXDB_INIT_ORG=audiranet
      - DOCKER_INFLUXDB_INIT_BUCKET=monitoring
      - DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=your-super-secret-token

  grafana:
    image: grafana/grafana:latest
    container_name: audiranet-grafana
    ports:
      - "3002:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-worldmap-panel
    depends_on:
      - influxdb

volumes:
  influxdb-data:
  grafana-data:
```

### 2. Setup Telegraf (Metrics Collector)

**telegraf.conf**:
```toml
[agent]
  interval = "10s"
  round_interval = true
  metric_batch_size = 1000
  metric_buffer_limit = 10000
  flush_interval = "10s"

[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "your-super-secret-token"
  organization = "audiranet"
  bucket = "monitoring"

# SNMP monitoring untuk MikroTik
[[inputs.snmp]]
  agents = ["192.168.1.1:161"]
  version = 2
  community = "public"
  interval = "30s"
  
  [[inputs.snmp.field]]
    name = "hostname"
    oid = "RFC1213-MIB::sysName.0"
    is_tag = true
  
  [[inputs.snmp.field]]
    name = "uptime"
    oid = "DISMAN-EVENT-MIB::sysUpTimeInstance"
  
  # CPU Usage
  [[inputs.snmp.field]]
    name = "cpu_usage"
    oid = ".1.3.6.1.2.1.25.3.3.1.2"
  
  # Memory
  [[inputs.snmp.field]]
    name = "memory_total"
    oid = ".1.3.6.1.2.1.25.2.3.1.5"
  
  # Interface traffic
  [[inputs.snmp.table]]
    name = "interface"
    inherit_tags = ["hostname"]
    oid = "IF-MIB::ifTable"
    
    [[inputs.snmp.table.field]]
      name = "ifName"
      oid = "IF-MIB::ifName"
      is_tag = true
    
    [[inputs.snmp.table.field]]
      name = "ifInOctets"
      oid = "IF-MIB::ifInOctets"
    
    [[inputs.snmp.table.field]]
      name = "ifOutOctets"
      oid = "IF-MIB::ifOutOctets"

# Ping monitoring
[[inputs.ping]]
  urls = ["192.168.1.1", "8.8.8.8"]
  count = 4
  ping_interval = 10.0
  timeout = 2.0

# HTTP endpoint monitoring  
[[inputs.http_response]]
  urls = ["http://localhost:4000/health"]
  response_timeout = "5s"
  method = "GET"

# PostgreSQL monitoring
[[inputs.postgresql]]
  address = "host=localhost user=postgres password=postgres dbname=sebilling"
  
# System metrics
[[inputs.cpu]]
[[inputs.mem]]
[[inputs.disk]]
[[inputs.net]]
```

### 3. Enable SNMP on MikroTik

```routeros
/snmp
set enabled=yes contact="admin@audiranet.id" location="Data Center"

/snmp community
set [ find default=yes ] addresses=192.168.1.0/24
```

### 4. Create Node.js Monitoring Service

**apps/backend/src/monitoring/monitoring.service.ts**:
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private influxDB: InfluxDB;
  private writeApi: any;

  constructor() {
    this.influxDB = new InfluxDB({
      url: process.env.INFLUXDB_URL || 'http://localhost:8086',
      token: process.env.INFLUXDB_TOKEN,
    });

    this.writeApi = this.influxDB.getWriteApi(
      process.env.INFLUXDB_ORG || 'audiranet',
      process.env.INFLUXDB_BUCKET || 'monitoring',
    );
  }

  async recordMetric(measurement: string, fields: any, tags: any = {}) {
    const point = new Point(measurement);
    
    Object.entries(tags).forEach(([key, value]) => {
      point.tag(key, String(value));
    });
    
    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value === 'number') {
        point.floatField(key, value);
      } else {
        point.stringField(key, String(value));
      }
    });

    this.writeApi.writePoint(point);
    await this.writeApi.flush();
  }

  async recordCustomerActivity(customerId: string, action: string) {
    await this.recordMetric(
      'customer_activity',
      { action, count: 1 },
      { customer_id: customerId },
    );
  }

  async recordPayment(amount: number, method: string) {
    await this.recordMetric(
      'payment',
      { amount },
      { method },
    );
  }

  async recordTicket(priority: string, status: string) {
    await this.recordMetric(
      'ticket',
      { count: 1 },
      { priority, status },
    );
  }
}
```

---

## Grafana Dashboards

### Dashboard 1: Network Overview

**Panels**:
1. Router Uptime (stat)
2. Total Bandwidth Usage (graph)
3. Active PPPoE Sessions (stat)
4. Ping Latency (graph)
5. CPU & Memory Usage (gauge)
6. Top 10 Bandwidth Users (table)

**Query Examples**:
```flux
// Total bandwidth
from(bucket: "monitoring")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "interface")
  |> filter(fn: (r) => r._field == "ifInOctets" or r._field == "ifOutOctets")
  |> aggregateWindow(every: 1m, fn: mean)

// CPU Usage
from(bucket: "monitoring")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "snmp")
  |> filter(fn: (r) => r._field == "cpu_usage")
```

### Dashboard 2: Business Metrics

**Panels**:
1. Daily Revenue (graph)
2. Monthly Recurring Revenue (MRR) (stat)
3. New Customers (counter)
4. Churn Rate (gauge)
5. Payment Methods Distribution (pie chart)
6. Pending Invoices (table)

### Dashboard 3: Support & Operations

**Panels**:
1. Open Tickets (stat)
2. Average Resolution Time (stat)
3. Tickets by Priority (bar chart)
4. Technician Workload (table)
5. Customer Satisfaction Score (gauge)

---

## Alerting Rules

### Grafana Alerts:

**1. Router Down Alert**:
```
Query: ping latency > 0
Condition: No data for 2 minutes
Action: Send to WhatsApp + Email
```

**2. High CPU Usage**:
```
Query: cpu_usage > 80
Condition: Last 5 minutes
Action: Send notification
```

**3. Bandwidth Threshold**:
```
Query: interface traffic > 80% capacity
Condition: Last 10 minutes  
Action: Alert NOC team
```

**4. Payment Overdue**:
```
Query: count(overdue invoices) > 0
Condition: Daily check
Action: WhatsApp to billing team
```

---

## Integration with WhatsApp

**apps/backend/src/monitoring/monitoring.cron.ts**:
```typescript
@Cron('*/5 * * * *') // Every 5 minutes
async checkNetworkHealth() {
  const routers = await this.getRouterStatus();
  
  for (const router of routers) {
    if (!router.online) {
      await this.whatsappService.sendDowntimeAlert({
        phone: process.env.NOC_PHONE,
        message: `🚨 ALERT: Router ${router.name} is DOWN!`,
      });
    }
  }
}
```

---

## Metrics to Track

### Network Metrics:
- Router uptime
- CPU/Memory usage
- Interface bandwidth (in/out)
- Ping latency
- Packet loss
- Active PPPoE sessions
- DHCP lease count

### Business Metrics:
- Daily/Monthly revenue
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User)
- Churn rate
- New customer acquisition
- Payment success rate

### Support Metrics:
- Ticket count (open/closed)
- Average resolution time
- SLA compliance
- Customer satisfaction score
- Technician performance

### Application Metrics:
- API response time
- Database query performance
- Error rates
- User activity
- Payment gateway success rate

---

## Quick Start

```bash
# 1. Start monitoring stack
docker-compose up -d influxdb grafana

# 2. Access Grafana
http://localhost:3002
Login: admin/admin

# 3. Add InfluxDB datasource
URL: http://influxdb:8086
Organization: audiranet
Token: your-super-secret-token
Bucket: monitoring

# 4. Import dashboards
Grafana UI → Dashboards → Import → Upload JSON files

# 5. Configure alerts
Alerting → Notification channels → Add WhatsApp webhook
```

---

## Production Checklist

- [ ] InfluxDB running and accessible
- [ ] Grafana configured with datasources
- [ ] Telegraf collecting SNMP metrics
- [ ] MikroTik SNMP enabled
- [ ] Alert rules configured
- [ ] WhatsApp integration tested
- [ ] Email alerts configured
- [ ] Dashboards created
- [ ] Backup strategy for metrics data
- [ ] SSL/TLS enabled
- [ ] User access control configured

---

## Environment Variables

Add to `.env`:
```env
# InfluxDB
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-super-secret-token
INFLUXDB_ORG=audiranet
INFLUXDB_BUCKET=monitoring

# Grafana
GRAFANA_URL=http://localhost:3002
GRAFANA_API_KEY=your-grafana-api-key

# Alerts
NOC_PHONE=628123456789
ALERT_EMAIL=noc@audiranet.id
```

---

## API Endpoints

```bash
# Record custom metric
POST /monitoring/metric
{
  "measurement": "custom",
  "fields": { "value": 100 },
  "tags": { "source": "api" }
}

# Get network status
GET /monitoring/network-status

# Get business metrics
GET /monitoring/business-metrics?period=month
```

---

**Status**: Ready for implementation
**Est. Setup Time**: 2-4 hours
**Maintenance**: Low (automated)
