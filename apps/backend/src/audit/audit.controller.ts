import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { AuditService, AuditAction } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('logs')
  async getLogs(
    @Query('action') action?: AuditAction,
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('status') status?: 'SUCCESS' | 'FAILED',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getLogs({
      action,
      userId: userId ? parseInt(userId) : undefined,
      entityType,
      entityId,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get('entity/:entityType/:entityId')
  async getLogsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.getLogsByEntity(entityType, entityId);
  }

  @Get('recent')
  async getRecentActivity(
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getRecentActivity(
      userId ? parseInt(userId) : undefined,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('stats')
  async getActivityStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return this.auditService.getActivityStats(start, end);
  }

  @Get('user/:userId')
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('days') days?: string,
  ) {
    return this.auditService.getUserActivity(
      parseInt(userId),
      days ? parseInt(days) : 30,
    );
  }

  @Post('clean')
  async cleanOldLogs(@Query('days') days?: string) {
    const result = await this.auditService.cleanOldLogs(
      days ? parseInt(days) : 90,
    );
    
    return {
      success: true,
      deleted: result,
      message: `Cleaned audit logs older than ${days || 90} days`,
    };
  }
}
