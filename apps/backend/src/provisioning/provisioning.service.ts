import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';
import { RadiusService } from '../radius/radius.service';
import { AuditService, AuditAction } from '../audit/audit.service';

@Injectable()
export class ProvisioningService {
  private readonly logger = new Logger(ProvisioningService.name);

  constructor(
    private prisma: PrismaService,
    private mikrotik: MikrotikService,
    private radius: RadiusService,
    private auditService: AuditService,
  ) {}

  /**
   * Auto provision PPPoE account when customer is activated
   */
  async provisionCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { 
        packages: true,
        services: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get active package
    const activePackage = customer.packages[0];
    if (!activePackage) {
      throw new Error('Customer has no active package');
    }

    // Generate PPPoE credentials
    const username = this.generateUsername(customer);
    const password = this.generatePassword();

    try {
      // 1. Create RADIUS user
      await this.radius.createRadiusUser({
        username,
        password,
        rateLimit: activePackage.speed,
      });

      // 2. Create PPPoE secret in MikroTik (if configured)
      const mikrotikRouters = await this.prisma.mikrotik.findMany({
        where: { status: 'active' },
      });

      for (const router of mikrotikRouters) {
        await this.mikrotik.createPPPoESecret({
          mikrotikId: router.id,
          username,
          password,
          profile: activePackage.speed,
          service: 'pppoe',
        });
      }

      // 3. Update customer with credentials
      await this.prisma.customer.update({
        where: { id: customerId },
        data: {
          services: {
            create: {
              name: `PPPoE Service - ${username}`,
              type: 'pppoe',
              username,
              password,
              status: 'active',
              packageId: activePackage.id,
            },
          },
        },
      });

      this.logger.log(`Customer ${customer.name} provisioned successfully: ${username}`);

      return {
        success: true,
        username,
        password,
        message: 'Customer provisioned successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to provision customer ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Deprovision PPPoE account when customer is suspended/terminated
   */
  async deprovisionCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { services: true },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const pppoeService = customer.services.find(s => s.type === 'pppoe');
    if (!pppoeService) {
      throw new Error('No PPPoE service found for customer');
    }

    try {
      // 1. Disconnect active sessions
      const nasIp = process.env.RADIUS_NAS_IP || 'localhost';
      const nasSecret = process.env.RADIUS_NAS_SECRET || 'testing123';
      await this.radius.disconnectUser(pppoeService.username, nasIp, nasSecret);

      // 2. Delete from RADIUS
      await this.radius.deleteRadiusUser(pppoeService.username);

      // 3. Delete from MikroTik routers
      const mikrotikRouters = await this.prisma.mikrotik.findMany({
        where: { status: 'active' },
      });

      for (const router of mikrotikRouters) {
        await this.mikrotik.deletePPPoESecret({
          mikrotikId: router.id,
          username: pppoeService.username,
        });
      }

      // 4. Update service status
      await this.prisma.service.update({
        where: { id: pppoeService.id },
        data: { status: 'terminated' },
      });

      this.logger.log(`Customer ${customer.name} deprovisioned successfully`);

      return {
        success: true,
        message: 'Customer deprovisioned successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to deprovision customer ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Update bandwidth when customer upgrades/downgrades package
   */
  async updateBandwidth(customerId: string, newPackageId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { services: true },
    });

    const newPackage = await this.prisma.package.findUnique({
      where: { id: newPackageId },
    });

    if (!customer || !newPackage) {
      throw new Error('Customer or package not found');
    }

    const pppoeService = customer.services.find(s => s.type === 'pppoe' && s.status === 'active');
    if (!pppoeService) {
      throw new Error('No active PPPoE service found');
    }

    try {
      // Update bandwidth via RADIUS CoA (Change of Authorization)
      await this.radius.updateBandwidth({
        username: pppoeService.username,
        rateLimit: newPackage.speed,
      });

      this.logger.log(`Bandwidth updated for ${customer.name}: ${newPackage.speed}`);

      return {
        success: true,
        message: `Bandwidth updated to ${newPackage.speed}`,
      };
    } catch (error) {
      this.logger.error(`Failed to update bandwidth for ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Suspend customer service (soft disconnect)
   */
  async suspendCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { services: true },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const pppoeService = customer.services.find(s => s.type === 'pppoe' && s.status === 'active');
    if (!pppoeService) {
      throw new Error('No active PPPoE service found');
    }

    try {
      // Disconnect all active sessions
      const nasIp = process.env.RADIUS_NAS_IP || 'localhost';
      const nasSecret = process.env.RADIUS_NAS_SECRET || 'testing123';
      await this.radius.disconnectUser(pppoeService.username, nasIp, nasSecret);

      // Update service status
      await this.prisma.service.update({
        where: { id: pppoeService.id },
        data: { status: 'suspended' },
      });

      // Update customer status
      await this.prisma.customer.update({
        where: { id: customerId },
        data: { status: 'suspended' },
      });

      // Log service suspension
      await this.auditService.log({
        action: AuditAction.SERVICE_SUSPEND,
        userEmail: customer.email,
        entityType: 'Customer',
        entityId: customerId,
        details: {
          customerName: customer.name,
          serviceId: pppoeService.id,
          username: pppoeService.username,
        },
        status: 'SUCCESS',
      });

      this.logger.log(`Customer ${customer.name} suspended`);

      return {
        success: true,
        message: 'Customer suspended successfully',
      };
    } catch (error) {
      // Log failed suspension
      await this.auditService.log({
        action: AuditAction.SERVICE_SUSPEND,
        userEmail: customer.email,
        entityType: 'Customer',
        entityId: customerId,
        details: { customerName: customer.name },
        status: 'FAILED',
        errorMessage: error.message,
      });
      
      this.logger.error(`Failed to suspend customer ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Unsuspend customer service
   */
  async unsuspendCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { services: true },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const pppoeService = customer.services.find(s => s.type === 'pppoe' && s.status === 'suspended');
    if (!pppoeService) {
      throw new Error('No suspended PPPoE service found');
    }

    try {
      // Update service status
      await this.prisma.service.update({
        where: { id: pppoeService.id },
        data: { status: 'active' },
      });

      // Update customer status
      await this.prisma.customer.update({
        where: { id: customerId },
        data: { status: 'active' },
      });

      // Log service unsuspension
      await this.auditService.log({
        action: AuditAction.SERVICE_UNSUSPEND,
        userEmail: customer.email,
        entityType: 'Customer',
        entityId: customerId,
        details: {
          customerName: customer.name,
          serviceId: pppoeService.id,
          username: pppoeService.username,
        },
        status: 'SUCCESS',
      });

      this.logger.log(`Customer ${customer.name} unsuspended`);

      return {
        success: true,
        message: 'Customer unsuspended successfully',
      };
    } catch (error) {
      // Log failed unsuspension
      await this.auditService.log({
        action: AuditAction.SERVICE_UNSUSPEND,
        userEmail: customer.email,
        entityType: 'Customer',
        entityId: customerId,
        details: { customerName: customer.name },
        status: 'FAILED',
        errorMessage: error.message,
      });
      
      this.logger.error(`Failed to unsuspend customer ${customerId}:`, error.message);
      throw error;
    }
  }

  private generateUsername(customer: any): string {
    // Format: email prefix or phone number
    if (customer.email) {
      return customer.email.split('@')[0];
    }
    return customer.phone.replace(/[^0-9]/g, '');
  }

  private generatePassword(): string {
    // Generate random 12-character password
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
