# 🗄️ Database Backup System

## Overview
Automated PostgreSQL database backup and restore system with scheduled daily backups, retention policy, and manual backup/restore capabilities.

## Features

### ✅ Implemented Features

1. **Automated Daily Backups**
   - Runs daily at 2 AM (Asia/Jakarta timezone)
   - Uses PostgreSQL `pg_dump` utility
   - Creates plain-text SQL dumps
   - Auto-creates backup directory

2. **Manual Backup Operations**
   - Create backup on-demand via API
   - List all available backups
   - Download backup files
   - Delete specific backups
   - Restore database from backup

3. **Retention Policy**
   - Automatically deletes backups older than 30 days
   - Configurable retention period via `.env`
   - Manual cleanup trigger via API

4. **Backup Management UI**
   - React dashboard for backup management
   - View all backups with size and date
   - Download, restore, and delete backups
   - Summary cards showing total backups and storage

## Prerequisites

### ⚠️ IMPORTANT: Install PostgreSQL Client Tools

The backup system requires PostgreSQL client tools (`pg_dump` and `psql`) installed on your system:

**Windows:**
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run installer (you can install client tools only, no need for server)
3. Add PostgreSQL `bin` directory to system PATH:
   - Default path: `C:\Program Files\PostgreSQL\16\bin`
   - Add to Environment Variables → System Variables → Path

**Verify Installation:**
```powershell
pg_dump --version
psql --version
```

Both commands should return version information (e.g., `pg_dump (PostgreSQL) 16.x`).

## Configuration

### Environment Variables

Add to `apps/backend/.env`:

```env
# Database Backup Configuration
BACKUP_DIR="./backups"
BACKUP_RETENTION_DAYS="30"

# PostgreSQL Connection (already configured)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/isp_billing"
```

### Cron Schedule

Backup schedule is configured in `apps/backend/src/backup/backup.service.ts`:

```typescript
@Cron('0 2 * * *', { 
  name: 'daily-database-backup',
  timeZone: 'Asia/Jakarta' 
})
```

- **Schedule:** Daily at 2:00 AM
- **Timezone:** Asia/Jakarta (WIB)
- **Cron Format:** `0 2 * * *` (minute hour day month weekday)

**Change Schedule:**
- 3 AM: `0 3 * * *`
- Every 6 hours: `0 */6 * * *`
- Weekly (Sunday 2 AM): `0 2 * * 0`

## API Endpoints

### 1. Create Backup (Manual)

**POST** `/backup/create`

Creates immediate database backup.

**Request:**
```bash
curl -X POST http://localhost:4000/backup/create
```

**Response:**
```json
{
  "success": true,
  "filename": "backup-2024-12-02-103000.sql",
  "size": 45678901,
  "message": "Backup created successfully"
}
```

### 2. List Backups

**GET** `/backup/list`

Returns all available backup files.

**Request:**
```bash
curl http://localhost:4000/backup/list
```

**Response:**
```json
{
  "backups": [
    {
      "filename": "backup-2024-12-02-103000.sql",
      "size": 45678901,
      "createdAt": "2024-12-02T03:30:00.000Z"
    }
  ],
  "totalSize": 45678901,
  "count": 1
}
```

### 3. Download Backup

**GET** `/backup/download/:filename`

Downloads specific backup file.

**Request:**
```bash
curl -O http://localhost:4000/backup/download/backup-2024-12-02-103000.sql
```

### 4. Restore Backup

**POST** `/backup/restore/:filename`

Restores database from backup file.

**⚠️ WARNING:** This will overwrite the current database!

**Request:**
```bash
curl -X POST http://localhost:4000/backup/restore/backup-2024-12-02-103000.sql
```

**Response:**
```json
{
  "success": true,
  "message": "Database restored successfully from backup-2024-12-02-103000.sql"
}
```

### 5. Delete Backup

**DELETE** `/backup/:filename`

Deletes specific backup file.

**Request:**
```bash
curl -X DELETE http://localhost:4000/backup/backup-2024-12-02-103000.sql
```

**Response:**
```json
{
  "success": true,
  "message": "Backup deleted successfully"
}
```

### 6. Clean Old Backups

**POST** `/backup/clean`

Removes backups older than retention period (30 days).

**Request:**
```bash
curl -X POST http://localhost:4000/backup/clean
```

**Response:**
```json
{
  "deleted": 5,
  "message": "Cleaned 5 old backup files"
}
```

## Frontend UI

### Access Backup Dashboard

Navigate to: **http://localhost:3000/backup**

**Features:**
- View all backups with filename, size, and created date
- Summary cards showing total backups, total size, auto-backup status
- Create backup button for manual backups
- Download, restore, and delete actions for each backup
- Clean old backups button
- Refresh button to reload backup list

**Access Control:**
- Only users with **ADMIN** role can access backup dashboard
- Menu item visible in sidebar for admins only

## File Structure

```
apps/backend/
├── src/
│   └── backup/
│       ├── backup.service.ts      # Core backup logic
│       ├── backup.controller.ts   # API endpoints
│       └── backup.module.ts       # NestJS module
├── backups/                       # Backup files (auto-created)
│   └── backup-YYYY-MM-DD-HHMMSS.sql
└── .env                           # Configuration

apps/frontend/
└── src/
    └── pages/
        └── backup.tsx             # Backup management UI
```

## Backup Process

### Automated Backup Flow

1. **Cron Job Triggers** (2 AM daily)
   ```typescript
   @Cron('0 2 * * *')
   async scheduledBackup() {
     await this.createBackup();      // Create new backup
     await this.cleanOldBackups();   // Delete old backups
   }
   ```

2. **Create Backup**
   - Parse DATABASE_URL to extract connection details
   - Generate filename: `backup-YYYY-MM-DD-HHMMSS.sql`
   - Execute pg_dump command:
     ```bash
     pg_dump -h localhost -p 5433 -U postgres -d isp_billing > backup.sql
     ```
   - Set PGPASSWORD environment variable for authentication

3. **Clean Old Backups**
   - List all `.sql` files in backup directory
   - Check file modification time
   - Delete files older than `BACKUP_RETENTION_DAYS`

### Manual Backup Flow

1. User clicks "Create Backup Now" in UI
2. Frontend calls `POST /backup/create`
3. Backend executes same process as automated backup
4. Returns backup filename and size
5. UI displays success message and refreshes list

### Restore Flow

1. User clicks "Restore" button for specific backup
2. Confirmation dialog warns about data overwrite
3. Frontend calls `POST /backup/restore/:filename`
4. Backend executes psql command:
   ```bash
   psql -h localhost -p 5433 -U postgres -d isp_billing < backup.sql
   ```
5. Database is restored to backup state
6. **IMPORTANT:** Restart backend server after restore

## Security Considerations

### 🔒 Best Practices

1. **Access Control**
   - Backup endpoints should be protected with authentication
   - Only ADMIN role should access backup functions
   - Consider IP whitelisting for backup endpoints

2. **Backup Storage**
   - Store backups on separate disk/partition
   - Consider encrypting backup files
   - Use offsite backup storage (S3, Google Cloud Storage)

3. **Password Security**
   - PGPASSWORD is set temporarily in environment
   - Never log database credentials
   - Use `.pgpass` file for production environments

4. **Retention Policy**
   - 30 days is suitable for development
   - Production may need longer retention (90-365 days)
   - Consider archiving old backups to cold storage

## Production Recommendations

### ☁️ Cloud Storage Integration

For production, integrate with cloud storage:

```typescript
// Example: Upload to AWS S3 after backup
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();
await s3.upload({
  Bucket: 'my-backups',
  Key: filename,
  Body: fs.createReadStream(backupPath),
}).promise();
```

### 📊 Monitoring & Alerts

Add monitoring for backup failures:

```typescript
// Example: Send alert on backup failure
try {
  await this.createBackup();
} catch (error) {
  await this.emailService.sendEmail({
    to: 'admin@company.com',
    subject: 'Database Backup Failed',
    text: `Backup failed at ${new Date()}: ${error.message}`,
  });
  throw error;
}
```

### 🔄 Backup Verification

Verify backups are restorable:

```typescript
// Example: Test restore to temporary database
async verifyBackup(filename: string) {
  const testDb = 'isp_billing_test';
  // Create test database
  // Restore backup to test database
  // Run simple queries to verify
  // Drop test database
}
```

## Troubleshooting

### Common Issues

**1. "pg_dump: command not found"**
- Solution: Install PostgreSQL client tools and add to PATH
- Verify: Run `pg_dump --version` in terminal

**2. "Permission denied" when creating backup directory**
- Solution: Ensure backend process has write permissions
- Check: Directory ownership and permissions

**3. "Connection refused" during backup**
- Solution: Verify PostgreSQL is running on correct host/port
- Check: DATABASE_URL in `.env` is correct

**4. Backup file is empty or very small**
- Solution: Check for errors in backup logs
- Verify: Database has data (`SELECT count(*) FROM ...`)

**5. Restore fails with "database is being accessed by other users"**
- Solution: Stop backend server before restoring
- Alternative: Use separate restore database

## Testing

### Manual Test Steps

1. **Create Backup:**
   ```bash
   curl -X POST http://localhost:4000/backup/create
   ```

2. **Verify Backup File:**
   ```bash
   ls -lh apps/backend/backups/
   ```

3. **Check Backup Content:**
   ```bash
   head -n 20 apps/backend/backups/backup-*.sql
   ```

4. **Test Restore (CAUTION):**
   ```bash
   # Create test data first
   # Then restore from older backup
   curl -X POST http://localhost:4000/backup/restore/backup-2024-12-02-103000.sql
   ```

5. **Test Auto-Cleanup:**
   ```bash
   # Wait for retention period or manually change file timestamps
   curl -X POST http://localhost:4000/backup/clean
   ```

## Maintenance

### Regular Tasks

- **Weekly:** Verify backups are being created
- **Monthly:** Test restore process with sample backup
- **Quarterly:** Review retention policy and adjust if needed
- **Annually:** Audit backup storage and cleanup procedures

## Future Enhancements

### Planned Features

1. **Incremental Backups**
   - Only backup changes since last full backup
   - Reduces backup size and time

2. **Compression**
   - Gzip backups to save storage space
   - `pg_dump -Fc` for custom format with compression

3. **Encryption**
   - Encrypt backups with GPG or AES
   - Secure backup files at rest

4. **Multi-Database Support**
   - Backup multiple databases in single operation
   - Separate retention policies per database

5. **Backup Notifications**
   - Email notification on successful backup
   - Alert on backup failures
   - Weekly backup summary report

## Summary

✅ **Implemented:**
- Automated daily backups at 2 AM
- Manual backup/restore API
- 30-day retention policy
- Backup management UI
- Download and delete backups

⚠️ **Requirements:**
- PostgreSQL client tools installed
- Sufficient disk space for backups
- ADMIN role to access backup features

📝 **Configuration:**
- `BACKUP_DIR` in `.env`
- `BACKUP_RETENTION_DAYS` in `.env`
- Cron schedule in `backup.service.ts`

---

**Status:** ✅ **Task 4 Complete**

**Next:** Task 5 - Comprehensive Logging System
