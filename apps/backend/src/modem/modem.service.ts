import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ping from 'ping';

export interface ModemInfo {
  customerId: string;
  customerName: string;
  internetNumber: string;
  ipAddress: string;
  modemType: string;
  modemSerial: string;
  status: 'online' | 'offline' | 'unknown';
  lastSeen?: Date;
  responseTime?: number;
  installationDate?: Date;
}

@Injectable()
export class ModemService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all modems with their online/offline status
   */
  async getAllModems(): Promise<ModemInfo[]> {
    const customers = await this.prisma.customer.findMany({
      where: {
        ipAddress: { not: null },
      },
      select: {
        id: true,
        name: true,
        internetNumber: true,
        ipAddress: true,
        installedModem: true,
        modemSerial: true,
        installationDate: true,
      },
    });

    const modems: ModemInfo[] = [];

    for (const customer of customers) {
      let status: 'online' | 'offline' | 'unknown' = 'unknown';
      let responseTime: number | undefined;

      if (customer.ipAddress) {
        try {
          const result = await ping.promise.probe(customer.ipAddress, {
            timeout: 2,
            extra: ['-n', '1'], // Windows: send 1 packet
          });

          status = result.alive ? 'online' : 'offline';
          responseTime = result.alive ? (typeof result.time === 'number' ? result.time : parseFloat(String(result.time))) : undefined;
        } catch (error) {
          status = 'offline';
        }
      }

      modems.push({
        customerId: customer.id,
        customerName: customer.name,
        internetNumber: customer.internetNumber || '-',
        ipAddress: customer.ipAddress || '-',
        modemType: customer.installedModem || 'Unknown',
        modemSerial: customer.modemSerial || '-',
        status,
        responseTime,
        installationDate: customer.installationDate,
      });
    }

    return modems;
  }

  /**
   * Check single modem status by customer ID
   */
  async checkModemStatus(customerId: string): Promise<ModemInfo> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        internetNumber: true,
        ipAddress: true,
        installedModem: true,
        modemSerial: true,
        installationDate: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    let status: 'online' | 'offline' | 'unknown' = 'unknown';
    let responseTime: number | undefined;

    if (customer.ipAddress) {
      try {
        const result = await ping.promise.probe(customer.ipAddress, {
          timeout: 2,
          extra: ['-n', '1'],
        });

        status = result.alive ? 'online' : 'offline';
        responseTime = result.alive ? (typeof result.time === 'number' ? result.time : parseFloat(String(result.time))) : undefined;
      } catch (error) {
        status = 'offline';
      }
    }

    return {
      customerId: customer.id,
      customerName: customer.name,
      internetNumber: customer.internetNumber || '-',
      ipAddress: customer.ipAddress || '-',
      modemType: customer.installedModem || 'Unknown',
      modemSerial: customer.modemSerial || '-',
      status,
      responseTime,
      installationDate: customer.installationDate,
    };
  }

  /**
   * Get modem statistics
   */
  async getModemStats() {
    const modems = await this.getAllModems();

    const total = modems.length;
    const online = modems.filter((m) => m.status === 'online').length;
    const offline = modems.filter((m) => m.status === 'offline').length;
    const unknown = modems.filter((m) => m.status === 'unknown').length;

    // Group by modem type
    const byType: Record<string, number> = {};
    modems.forEach((m) => {
      byType[m.modemType] = (byType[m.modemType] || 0) + 1;
    });

    // Average response time
    const onlineModems = modems.filter((m) => m.responseTime !== undefined);
    const avgResponseTime =
      onlineModems.length > 0
        ? onlineModems.reduce((sum, m) => sum + (m.responseTime || 0), 0) / onlineModems.length
        : 0;

    return {
      total,
      online,
      offline,
      unknown,
      onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0,
      byType,
      avgResponseTime: Math.round(avgResponseTime * 10) / 10,
    };
  }

  /**
   * Get modems by type
   */
  async getModemsByType() {
    const customers = await this.prisma.customer.findMany({
      where: {
        installedModem: { not: null },
      },
      select: {
        installedModem: true,
      },
    });

    const typeCount: Record<string, number> = {};
    customers.forEach((c) => {
      if (c.installedModem) {
        typeCount[c.installedModem] = (typeCount[c.installedModem] || 0) + 1;
      }
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
    }));
  }
}
