import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  
  // User Management
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  
  // Customer Management
  CUSTOMER_CREATE = 'CUSTOMER_CREATE',
  CUSTOMER_UPDATE = 'CUSTOMER_UPDATE',
  CUSTOMER_DELETE = 'CUSTOMER_DELETE',
  
  // Payment Operations
  PAYMENT_CREATE = 'PAYMENT_CREATE',
  PAYMENT_UPDATE = 'PAYMENT_UPDATE',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUND = 'PAYMENT_REFUND',
  
  // Invoice Operations
  INVOICE_CREATE = 'INVOICE_CREATE',
  INVOICE_UPDATE = 'INVOICE_UPDATE',
  INVOICE_DELETE = 'INVOICE_DELETE',
  INVOICE_SEND = 'INVOICE_SEND',
  
  // Service Management
  SERVICE_PROVISION = 'SERVICE_PROVISION',
  SERVICE_DEPROVISION = 'SERVICE_DEPROVISION',
  SERVICE_SUSPEND = 'SERVICE_SUSPEND',
  SERVICE_UNSUSPEND = 'SERVICE_UNSUSPEND',
  SERVICE_BANDWIDTH_CHANGE = 'SERVICE_BANDWIDTH_CHANGE',
  
  // Backup Operations
  BACKUP_CREATE = 'BACKUP_CREATE',
  BACKUP_RESTORE = 'BACKUP_RESTORE',
  BACKUP_DELETE = 'BACKUP_DELETE',
  
  // System Operations
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
  EMAIL_SEND = 'EMAIL_SEND',
  WHATSAPP_SEND = 'WHATSAPP_SEND',
}

export interface AuditLogData {
  action: AuditAction;
  userId?: number;
  userEmail?: string;
  entityType?: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  status?: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData) {
    try {
      const auditLog = await this.prisma.$executeRawUnsafe(`
        INSERT INTO audit_logs (
          action, user_id, user_email, entity_type, entity_id, 
          details, ip_address, user_agent, status, error_message, created_at
        ) VALUES (
          '${data.action}',
          ${data.userId || null},
          ${data.userEmail ? `'${data.userEmail}'` : null},
          ${data.entityType ? `'${data.entityType}'` : null},
          ${data.entityId ? `'${data.entityId}'` : null},
          ${data.details ? `'${JSON.stringify(data.details).replace(/'/g, "''")}'` : null},
          ${data.ipAddress ? `'${data.ipAddress}'` : null},
          ${data.userAgent ? `'${data.userAgent}'` : null},
          '${data.status || 'SUCCESS'}',
          ${data.errorMessage ? `'${data.errorMessage.replace(/'/g, "''")}'` : null},
          NOW()
        )
      `);
      
      return auditLog;
    } catch (error) {
      // Don't throw errors from audit logging to avoid breaking main operations
      console.error('Audit log error:', error);
      return null;
    }
  }

  async getLogs(filters: {
    action?: AuditAction;
    userId?: number;
    entityType?: string;
    entityId?: string;
    status?: 'SUCCESS' | 'FAILED';
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    let whereClause = '1=1';
    
    if (filters.action) {
      whereClause += ` AND action = '${filters.action}'`;
    }
    if (filters.userId) {
      whereClause += ` AND user_id = ${filters.userId}`;
    }
    if (filters.entityType) {
      whereClause += ` AND entity_type = '${filters.entityType}'`;
    }
    if (filters.entityId) {
      whereClause += ` AND entity_id = '${filters.entityId}'`;
    }
    if (filters.status) {
      whereClause += ` AND status = '${filters.status}'`;
    }
    if (filters.startDate) {
      whereClause += ` AND created_at >= '${filters.startDate.toISOString()}'`;
    }
    if (filters.endDate) {
      whereClause += ` AND created_at <= '${filters.endDate.toISOString()}'`;
    }

    const logs = await this.prisma.$queryRawUnsafe(`
      SELECT * FROM audit_logs
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${skip}
    `);

    const countResult: any = await this.prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as total FROM audit_logs
      WHERE ${whereClause}
    `);

    const total = parseInt(countResult[0]?.total || '0');

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLogsByEntity(entityType: string, entityId: string) {
    const logs = await this.prisma.$queryRawUnsafe(`
      SELECT * FROM audit_logs
      WHERE entity_type = '${entityType}' AND entity_id = '${entityId}'
      ORDER BY created_at DESC
      LIMIT 100
    `);

    return logs;
  }

  async getRecentActivity(userId?: number, limit = 20) {
    let whereClause = '1=1';
    if (userId) {
      whereClause = `user_id = ${userId}`;
    }

    const logs = await this.prisma.$queryRawUnsafe(`
      SELECT * FROM audit_logs
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `);

    return logs;
  }

  async getActivityStats(startDate: Date, endDate: Date) {
    const stats = await this.prisma.$queryRawUnsafe(`
      SELECT 
        action,
        status,
        COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= '${startDate.toISOString()}'
        AND created_at <= '${endDate.toISOString()}'
      GROUP BY action, status
      ORDER BY count DESC
    `);

    return stats;
  }

  async getUserActivity(userId: number, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activity = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM audit_logs
      WHERE user_id = ${userId}
        AND created_at >= '${startDate.toISOString()}'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    return activity;
  }

  async cleanOldLogs(days = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.prisma.$executeRawUnsafe(`
      DELETE FROM audit_logs
      WHERE created_at < '${cutoffDate.toISOString()}'
    `);

    return result;
  }
}
