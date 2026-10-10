import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsAppService,
    private mikrotik: MikrotikService,
  ) {}

  /**
   * Monitor network uptime every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async monitorNetworkUptime() {
    this.logger.log('Checking network uptime...');

    const routers = await this.prisma.mikrotik.findMany({
      where: { status: 'active' },
    });

    for (const router of routers) {
      try {
        const isUp = await this.checkRouterStatus(router.id);

        if (!isUp) {
          await this.handleNetworkDown(router);
        } else {
          await this.handleNetworkUp(router);
        }
      } catch (error) {
        this.logger.error(`Failed to check router ${router.name}:`, error.message);
      }
    }
  }

  /**
   * Monitor bandwidth usage every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async monitorBandwidthUsage() {
    this.logger.log('Checking bandwidth usage...');

    const customers = await this.prisma.customer.findMany({
      where: { status: 'active' },
      include: { packages: true },
    });

    for (const customer of customers) {
      try {
        const usage = await this.getCustomerBandwidthUsage(customer.id);

        // Check if usage exceeds threshold (e.g., 90%)
        const threshold = this.calculateThreshold(customer.packages[0]?.speed);
        if (usage > threshold) {
          await this.sendBandwidthAlert(customer, usage);
        }
      } catch (error) {
        this.logger.error(`Failed to check bandwidth for customer ${customer.id}:`, error.message);
      }
    }
  }

  /**
   * Check router status via ping or API
   */
  private async checkRouterStatus(routerId: string): Promise<boolean> {
    try {
      // Attempt to connect to router
      await this.mikrotik.testConnection(routerId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle network down event
   */
  private async handleNetworkDown(router: any) {
    this.logger.warn(`Router ${router.name} is DOWN!`);

    // Create incident log
    const existingIncident = await this.prisma.incident.findFirst({
      where: {
        routerId: router.id,
        status: 'open',
      },
    });

    if (!existingIncident) {
      await this.prisma.incident.create({
        data: {
          routerId: router.id,
          type: 'network_down',
          severity: 'critical',
          description: `Router ${router.name} is not responding`,
          status: 'open',
          detectedAt: new Date(),
        },
      });

      // Send WhatsApp alert to admin/NOC
      await this.sendNetworkDownAlert(router);
    }

    // Update router status
    await this.prisma.mikrotik.update({
      where: { id: router.id },
      data: { status: 'down' },
    });
  }

  /**
   * Handle network up event (recovery)
   */
  private async handleNetworkUp(router: any) {
    const incident = await this.prisma.incident.findFirst({
      where: {
        routerId: router.id,
        status: 'open',
      },
    });

    if (incident) {
      const downtime = new Date().getTime() - new Date(incident.detectedAt).getTime();
      const downtimeMinutes = Math.floor(downtime / 60000);

      // Close incident
      await this.prisma.incident.update({
        where: { id: incident.id },
        data: {
          status: 'resolved',
          resolvedAt: new Date(),
          downtime: downtimeMinutes,
        },
      });

      this.logger.log(`Router ${router.name} is back UP (downtime: ${downtimeMinutes} minutes)`);

      // Send recovery notification
      await this.sendNetworkRecoveryAlert(router, downtimeMinutes);
    }

    // Update router status
    await this.prisma.mikrotik.update({
      where: { id: router.id },
      data: { status: 'active' },
    });
  }

  /**
   * Get customer bandwidth usage from RADIUS accounting
   */
  private async getCustomerBandwidthUsage(customerId: string): Promise<number> {
    // TODO: Query RADIUS accounting data
    // For now, return mock data
    return Math.random() * 100; // GB
  }

  /**
   * Calculate bandwidth threshold
   */
  private calculateThreshold(speed: string): number {
    // Extract number from speed string (e.g., "10 Mbps" -> 10)
    const match = speed?.match(/(\d+)/);
    const speedMbps = match ? parseInt(match[1]) : 10;

    // Return 90% threshold in GB (assuming daily limit)
    return (speedMbps * 0.9 * 24 * 3600) / (8 * 1024); // Convert Mbps to GB per day
  }

  /**
   * Send network down alert
   */
  private async sendNetworkDownAlert(router: any) {
    const admins = await this.prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'NOC'] } },
    });

    for (const admin of admins) {
      if (admin.phone) {
        await this.whatsapp.sendMessage({
          phone: admin.phone,
          message: `🚨 *NETWORK DOWN ALERT*\n\nRouter: ${router.name}\nLocation: ${router.location}\nTime: ${new Date().toLocaleString('id-ID')}\n\nPlease check immediately!`,
        });
      }
    }
  }

  /**
   * Send network recovery alert
   */
  private async sendNetworkRecoveryAlert(router: any, downtimeMinutes: number) {
    const admins = await this.prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'NOC'] } },
    });

    for (const admin of admins) {
      if (admin.phone) {
        await this.whatsapp.sendMessage({
          phone: admin.phone,
          message: `✅ *NETWORK RECOVERED*\n\nRouter: ${router.name}\nDowntime: ${downtimeMinutes} minutes\nRecovered at: ${new Date().toLocaleString('id-ID')}`,
        });
      }
    }
  }

  /**
   * Send bandwidth usage alert
   */
  private async sendBandwidthAlert(customer: any, usage: number) {
    if (customer.phone) {
      await this.whatsapp.sendMessage({
        phone: customer.phone,
        message: `⚠️ Bandwidth usage Anda sudah mencapai ${usage.toFixed(2)} GB.\n\nPertimbangkan untuk upgrade paket jika diperlukan.`,
      });
    }
  }

  /**
   * Get monitoring statistics
   */
  async getMonitoringStats() {
    const totalRouters = await this.prisma.mikrotik.count();
    const activeRouters = await this.prisma.mikrotik.count({
      where: { status: 'active' },
    });
    const downRouters = await this.prisma.mikrotik.count({
      where: { status: 'down' },
    });

    const openIncidents = await this.prisma.incident.count({
      where: { status: 'open' },
    });

    const avgUptime = ((activeRouters / totalRouters) * 100).toFixed(2);

    return {
      totalRouters,
      activeRouters,
      downRouters,
      openIncidents,
      uptime: `${avgUptime}%`,
    };
  }
}
