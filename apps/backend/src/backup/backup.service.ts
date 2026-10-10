import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = process.env.BACKUP_DIR || './backups';
  private readonly retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');

  constructor() {
    // Create backup directory if not exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      this.logger.log(`Backup directory created: ${this.backupDir}`);
    }
  }

  /**
   * Auto backup every day at 2 AM
   */
  @Cron('0 2 * * *', {
    name: 'daily-database-backup',
    timeZone: 'Asia/Jakarta',
  })
  async scheduledBackup() {
    this.logger.log('Starting scheduled database backup...');
    try {
      await this.createBackup();
      await this.cleanOldBackups();
    } catch (error) {
      this.logger.error('Scheduled backup failed:', error.message);
    }
  }

  /**
   * Create database backup
   */
  async createBackup(): Promise<{ success: boolean; filename?: string; path?: string; size?: number; error?: string }> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.sql`;
      const backupPath = path.join(this.backupDir, filename);

      // Get database connection details from DATABASE_URL
      const dbUrl = process.env.DATABASE_URL || '';
      const dbConfig = this.parseDatabaseUrl(dbUrl);

      if (!dbConfig) {
        throw new Error('Invalid DATABASE_URL configuration');
      }

      // Build pg_dump command
      const pgDumpCommand = `pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -F p -f "${backupPath}"`;

      this.logger.log(`Creating backup: ${filename}`);

      // Set PGPASSWORD environment variable for authentication
      const env = { ...process.env, PGPASSWORD: dbConfig.password };

      // Execute pg_dump
      await execPromise(pgDumpCommand, { env, maxBuffer: 1024 * 1024 * 100 }); // 100MB buffer

      // Get file size
      const stats = fs.statSync(backupPath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      this.logger.log(`Backup created successfully: ${filename} (${sizeInMB} MB)`);

      return {
        success: true,
        filename,
        path: backupPath,
        size: stats.size,
      };
    } catch (error) {
      this.logger.error('Backup creation failed:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Clean old backups based on retention policy
   */
  async cleanOldBackups(): Promise<number> {
    try {
      const files = fs.readdirSync(this.backupDir);
      const now = new Date().getTime();
      const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;

      let deletedCount = 0;

      for (const file of files) {
        if (!file.startsWith('backup-') || !file.endsWith('.sql')) {
          continue;
        }

        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > retentionMs) {
          fs.unlinkSync(filePath);
          deletedCount++;
          this.logger.log(`Deleted old backup: ${file}`);
        }
      }

      if (deletedCount > 0) {
        this.logger.log(`Cleaned ${deletedCount} old backup(s)`);
      }

      return deletedCount;
    } catch (error) {
      this.logger.error('Failed to clean old backups:', error.message);
      return 0;
    }
  }

  /**
   * List all backups
   */
  async listBackups(): Promise<Array<{ filename: string; size: number; createdAt: Date }>> {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backups = [];

      for (const file of files) {
        if (!file.startsWith('backup-') || !file.endsWith('.sql')) {
          continue;
        }

        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);

        backups.push({
          filename: file,
          size: stats.size,
          createdAt: stats.mtime,
        });
      }

      // Sort by date (newest first)
      backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return backups;
    } catch (error) {
      this.logger.error('Failed to list backups:', error.message);
      return [];
    }
  }

  /**
   * Delete specific backup
   */
  async deleteBackup(filename: string): Promise<{ success: boolean; error?: string }> {
    try {
      const filePath = path.join(this.backupDir, filename);

      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'Backup file not found' };
      }

      fs.unlinkSync(filePath);
      this.logger.log(`Backup deleted: ${filename}`);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to delete backup ${filename}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(filename: string): Promise<{ success: boolean; error?: string }> {
    try {
      const filePath = path.join(this.backupDir, filename);

      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'Backup file not found' };
      }

      // Get database connection details
      const dbUrl = process.env.DATABASE_URL || '';
      const dbConfig = this.parseDatabaseUrl(dbUrl);

      if (!dbConfig) {
        throw new Error('Invalid DATABASE_URL configuration');
      }

      // Build psql restore command
      const psqlCommand = `psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -f "${filePath}"`;

      this.logger.log(`Restoring backup: ${filename}`);

      // Set PGPASSWORD environment variable
      const env = { ...process.env, PGPASSWORD: dbConfig.password };

      // Execute psql restore
      await execPromise(psqlCommand, { env, maxBuffer: 1024 * 1024 * 100 });

      this.logger.log(`Backup restored successfully: ${filename}`);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to restore backup ${filename}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Download backup file
   */
  getBackupPath(filename: string): string | null {
    const filePath = path.join(this.backupDir, filename);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  }

  /**
   * Parse PostgreSQL connection URL
   */
  private parseDatabaseUrl(url: string): { host: string; port: string; user: string; password: string; database: string } | null {
    try {
      // Format: postgresql://user:password@host:port/database
      const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
      const match = url.match(regex);

      if (!match) {
        return null;
      }

      return {
        user: match[1],
        password: match[2],
        host: match[3],
        port: match[4],
        database: match[5],
      };
    } catch (error) {
      return null;
    }
  }
}
