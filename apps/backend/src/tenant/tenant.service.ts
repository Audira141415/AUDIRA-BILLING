import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  // Create tenant (franchise)
  async createTenant(data: {
    name: string;
    slug: string;
    contactEmail: string;
    contactPhone: string;
    type?: string;
    parentTenantId?: string;
    commissionRate?: number;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    domain?: string;
    address?: string;
  }) {
    // Check if slug is unique
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new BadRequestException('Slug already exists');
    }

    return await this.prisma.tenant.create({
      data,
    });
  }

  // Get all tenants
  async getAllTenants(parentTenantId?: string) {
    const where: any = {};
    if (parentTenantId) {
      where.parentTenantId = parentTenantId;
    }

    return await this.prisma.tenant.findMany({
      where,
      include: {
        parentTenant: true,
        childTenants: true,
        _count: {
          select: {
            customers: true,
            users: true,
          },
        },
      },
    });
  }

  // Get tenant by ID
  async getTenantById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        parentTenant: true,
        childTenants: true,
        customers: true,
        users: true,
        permissions: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  // Get tenant by slug
  async getTenantBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        parentTenant: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  // Update tenant
  async updateTenant(id: string, data: Partial<{
    name: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    domain: string;
    status: string;
    commissionRate: number;
    settings: any;
  }>) {
    return await this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  // Delete tenant
  async deleteTenant(id: string) {
    // Check if has child tenants
    const children = await this.prisma.tenant.count({
      where: { parentTenantId: id },
    });

    if (children > 0) {
      throw new BadRequestException('Cannot delete tenant with child franchises');
    }

    return await this.prisma.tenant.delete({
      where: { id },
    });
  }

  // Add user to tenant
  async addUserToTenant(tenantId: string, userId: string, role: string, permissions: string[]) {
    return await this.prisma.tenantUser.create({
      data: {
        tenantId,
        userId,
        role,
        permissions,
      },
    });
  }

  // Remove user from tenant
  async removeUserFromTenant(tenantId: string, userId: string) {
    await this.prisma.tenantUser.deleteMany({
      where: {
        tenantId,
        userId,
      },
    });
  }

  // Get tenant users
  async getTenantUsers(tenantId: string) {
    return await this.prisma.tenantUser.findMany({
      where: { tenantId },
    });
  }

  // Set tenant permissions
  async setTenantPermission(tenantId: string, resource: string, action: string, role: string) {
    return await this.prisma.tenantPermission.upsert({
      where: {
        tenantId_resource_action_role: {
          tenantId,
          resource,
          action,
          role,
        },
      },
      create: {
        tenantId,
        resource,
        action,
        role,
      },
      update: {},
    });
  }

  // Get tenant permissions
  async getTenantPermissions(tenantId: string, role?: string) {
    const where: any = { tenantId };
    if (role) {
      where.role = role;
    }

    return await this.prisma.tenantPermission.findMany({
      where,
    });
  }

  // Check permission
  async hasPermission(tenantId: string, userId: string, resource: string, action: string): Promise<boolean> {
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (!tenantUser) return false;

    const permission = await this.prisma.tenantPermission.findUnique({
      where: {
        tenantId_resource_action_role: {
          tenantId,
          resource,
          action,
          role: tenantUser.role,
        },
      },
    });

    return !!permission;
  }

  // Calculate commission
  async calculateCommission(tenantId: string, amount: number, sourceType: string, sourceId: string) {
    const tenant = await this.getTenantById(tenantId);
    
    if (!tenant.parentTenantId) {
      return null; // No parent, no commission
    }

    const commissionAmount = (amount * tenant.commissionRate) / 100;

    return await this.prisma.tenantCommission.create({
      data: {
        tenantId,
        parentTenantId: tenant.parentTenantId,
        amount: commissionAmount,
        percentage: tenant.commissionRate,
        sourceType,
        sourceId,
        status: 'pending',
      },
    });
  }

  // Get tenant commissions
  async getTenantCommissions(tenantId: string, status?: string) {
    const where: any = {
      OR: [
        { tenantId },
        { parentTenantId: tenantId },
      ],
    };

    if (status) {
      where.status = status;
    }

    return await this.prisma.tenantCommission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Pay commission
  async payCommission(commissionId: string) {
    return await this.prisma.tenantCommission.update({
      where: { id: commissionId },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });
  }

  // Get tenant statistics
  async getTenantStatistics(tenantId: string) {
    const [
      totalCustomers,
      activeCustomers,
      totalRevenue,
      pendingCommissions,
      paidCommissions,
      childTenants,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { tenantId } }),
      this.prisma.customer.count({ where: { tenantId, status: 'active' } }),
      this.prisma.invoice.aggregate({
        where: { customer: { tenantId }, status: 'paid' },
        _sum: { amount: true },
      }),
      this.prisma.tenantCommission.aggregate({
        where: { tenantId, status: 'pending' },
        _sum: { amount: true },
      }),
      this.prisma.tenantCommission.aggregate({
        where: { tenantId, status: 'paid' },
        _sum: { amount: true },
      }),
      this.prisma.tenant.count({ where: { parentTenantId: tenantId } }),
    ]);

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingCommissions: pendingCommissions._sum.amount || 0,
      paidCommissions: paidCommissions._sum.amount || 0,
      childTenants,
    };
  }

  // Get hierarchy tree
  async getTenantHierarchy(tenantId?: string) {
    const buildTree = async (parentId: string | null): Promise<any[]> => {
      const tenants = await this.prisma.tenant.findMany({
        where: { parentTenantId: parentId },
        include: {
          _count: {
            select: {
              customers: true,
              childTenants: true,
            },
          },
        },
      });

      return await Promise.all(
        tenants.map(async (tenant) => ({
          ...tenant,
          children: await buildTree(tenant.id),
        }))
      );
    };

    if (tenantId) {
      const tenant = await this.getTenantById(tenantId);
      return {
        ...tenant,
        children: await buildTree(tenantId),
      };
    }

    return await buildTree(null);
  }

  // Clone tenant settings
  async cloneTenantSettings(sourceTenantId: string, targetTenantId: string) {
    const source = await this.getTenantById(sourceTenantId);

    await this.updateTenant(targetTenantId, {
      primaryColor: source.primaryColor,
      secondaryColor: source.secondaryColor,
      settings: source.settings,
    });

    // Clone permissions
    const permissions = await this.getTenantPermissions(sourceTenantId);
    for (const perm of permissions) {
      await this.setTenantPermission(
        targetTenantId,
        perm.resource,
        perm.action,
        perm.role
      );
    }
  }
}
