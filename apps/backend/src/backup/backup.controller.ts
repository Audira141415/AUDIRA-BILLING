import { Controller, Get, Post, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from './backup.service';
import * as fs from 'fs';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  /**
   * Trigger manual backup
   * POST /backup/create
   */
  @Post('create')
  async createBackup() {
    return this.backupService.createBackup();
  }

  /**
   * List all backups
   * GET /backup/list
   */
  @Get('list')
  async listBackups() {
    const backups = await this.backupService.listBackups();
    return {
      backups,
      count: backups.length,
      totalSize: backups.reduce((sum, b) => sum + b.size, 0),
    };
  }

  /**
   * Delete specific backup
   * DELETE /backup/:filename
   */
  @Delete(':filename')
  async deleteBackup(@Param('filename') filename: string) {
    return this.backupService.deleteBackup(filename);
  }

  /**
   * Download backup file
   * GET /backup/download/:filename
   */
  @Get('download/:filename')
  async downloadBackup(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = this.backupService.getBackupPath(filename);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'Backup file not found',
      });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: 'Failed to download backup',
        });
      }
    });
  }

  /**
   * Restore database from backup
   * POST /backup/restore/:filename
   */
  @Post('restore/:filename')
  async restoreBackup(@Param('filename') filename: string) {
    return this.backupService.restoreBackup(filename);
  }

  /**
   * Clean old backups manually
   * POST /backup/clean
   */
  @Post('clean')
  async cleanOldBackups() {
    const deletedCount = await this.backupService.cleanOldBackups();
    return {
      success: true,
      deletedCount,
      message: `Cleaned ${deletedCount} old backup(s)`,
    };
  }
}
