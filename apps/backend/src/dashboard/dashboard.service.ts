import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // Get counts from database
    const [totalCustomers, activeCustomers, totalPackages, totalTransactions] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.count({ where: { status: 'active' } }),
      this.prisma.package.count({ where: { status: 'active' } }),
      this.prisma.transaction.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Calculate revenue (sum of all successful transactions this month)
    const revenueData = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'success',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const isolatedCustomers = await this.prisma.customer.count({
      where: { status: 'isolated' },
    });

    const inactiveCustomers = await this.prisma.customer.count({
      where: { status: 'inactive' },
    });

    return {
      revenue: {
        total: revenueData._sum.amount || 0,
        period: '-',
        daysRemaining: 3,
        activeUntil: '01 Desember 2025',
      },
      customers: {
        active: activeCustomers,
        isolated: isolatedCustomers,
        inactive: inactiveCustomers,
      },
      technicians: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      locations: {
        total: 1,
        active: 1,
        inactive: 0,
      },
      devices: {
        total: 1,
        mikrotik: 1,
        odp: 0,
      },
      customers_total: {
        total: totalCustomers,
        pppoe: totalCustomers,
        ipStatic: 0,
      },
    };
  }
}
