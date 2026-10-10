import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RevenueReport {
  period: string;
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  collectionRate: number;
}

export interface CustomerGrowthReport {
  period: string;
  newCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  churnedCustomers: number;
  totalCustomers: number;
  growthRate: number;
}

export interface PaymentSuccessReport {
  period: string;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  successRate: number;
  averagePaymentTime: number;
  paymentMethods: {
    method: string;
    count: number;
    amount: number;
  }[];
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Revenue Report - Monthly revenue analysis
   */
  async getRevenueReport(startDate: Date, endDate: Date): Promise<RevenueReport[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        payments: true,
      },
    });

    // Group by month
    const monthlyData = new Map<string, any>();

    invoices.forEach((invoice) => {
      const month = invoice.createdAt.toISOString().slice(0, 7); // YYYY-MM
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          period: month,
          totalRevenue: 0,
          totalInvoices: 0,
          paidInvoices: 0,
          pendingInvoices: 0,
          overdueInvoices: 0,
        });
      }

      const data = monthlyData.get(month);
      data.totalInvoices++;
      data.totalRevenue += invoice.amount;

      if (invoice.status === 'PAID') {
        data.paidInvoices++;
      } else if (invoice.status === 'PENDING') {
        data.pendingInvoices++;
        if (new Date(invoice.dueDate) < new Date()) {
          data.overdueInvoices++;
        }
      }
    });

    // Calculate collection rate
    const report: RevenueReport[] = Array.from(monthlyData.values()).map((data) => ({
      ...data,
      collectionRate: data.totalInvoices > 0 
        ? (data.paidInvoices / data.totalInvoices) * 100 
        : 0,
    }));

    return report.sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Customer Growth Report
   */
  async getCustomerGrowthReport(startDate: Date, endDate: Date): Promise<CustomerGrowthReport[]> {
    const customers = await this.prisma.customer.findMany({
      where: {
        createdAt: {
          lte: endDate,
        },
      },
    });

    // Group by month
    const monthlyData = new Map<string, any>();

    // Get date range months
    const months: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      months.push(current.toISOString().slice(0, 7));
      current.setMonth(current.getMonth() + 1);
    }

    // Initialize all months
    months.forEach((month) => {
      monthlyData.set(month, {
        period: month,
        newCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        churnedCustomers: 0,
        totalCustomers: 0,
      });
    });

    // Count customers
    customers.forEach((customer) => {
      const createdMonth = customer.createdAt.toISOString().slice(0, 7);
      
      months.forEach((month) => {
        const data = monthlyData.get(month);
        const monthDate = new Date(month + '-01');
        
        // New customers in this month
        if (createdMonth === month) {
          data.newCustomers++;
        }

        // Total customers up to this month
        if (customer.createdAt <= monthDate) {
          data.totalCustomers++;
          
          if (customer.status === 'active') {
            data.activeCustomers++;
          } else {
            data.inactiveCustomers++;
          }
        }
      });
    });

    // Calculate growth rate
    const report: CustomerGrowthReport[] = Array.from(monthlyData.values()).map((data, index, array) => {
      let growthRate = 0;
      if (index > 0) {
        const prevTotal = array[index - 1].totalCustomers;
        growthRate = prevTotal > 0 
          ? ((data.totalCustomers - prevTotal) / prevTotal) * 100 
          : 0;
      }

      return {
        ...data,
        growthRate,
      };
    });

    return report;
  }

  /**
   * Payment Success Report
   */
  async getPaymentSuccessReport(startDate: Date, endDate: Date): Promise<PaymentSuccessReport[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        invoice: true,
      },
    });

    // Group by month
    const monthlyData = new Map<string, any>();

    payments.forEach((payment) => {
      const month = payment.createdAt.toISOString().slice(0, 7);
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          period: month,
          totalPayments: 0,
          successfulPayments: 0,
          failedPayments: 0,
          totalPaymentTime: 0,
          paymentMethodsMap: new Map<string, { count: number; amount: number }>(),
        });
      }

      const data = monthlyData.get(month);
      data.totalPayments++;

      if (payment.status === 'success') {
        data.successfulPayments++;
        
        // Calculate payment time (invoice created to payment)
        const invoiceDate = new Date(payment.invoice.createdAt);
        const paymentDate = (payment as any).paymentDate ? new Date((payment as any).paymentDate) : new Date();
        const timeDiff = paymentDate.getTime() - invoiceDate.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        data.totalPaymentTime += daysDiff;
      } else {
        data.failedPayments++;
      }

      // Count payment methods
      const method = (payment as any).paymentMethod || 'unknown';
      if (!data.paymentMethodsMap.has(method)) {
        data.paymentMethodsMap.set(method, { count: 0, amount: 0 });
      }
      const methodData = data.paymentMethodsMap.get(method);
      methodData.count++;
      methodData.amount += payment.amount;
    });

    // Calculate success rate and average payment time
    const report: PaymentSuccessReport[] = Array.from(monthlyData.values()).map((data) => ({
      period: data.period,
      totalPayments: data.totalPayments,
      successfulPayments: data.successfulPayments,
      failedPayments: data.failedPayments,
      successRate: data.totalPayments > 0 
        ? (data.successfulPayments / data.totalPayments) * 100 
        : 0,
      averagePaymentTime: data.successfulPayments > 0 
        ? data.totalPaymentTime / data.successfulPayments 
        : 0,
      paymentMethods: Array.from(data.paymentMethodsMap.entries()).map(([method, stats]) => ({
        method,
        count: stats.count,
        amount: stats.amount,
      })),
    }));

    return report.sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Dashboard Summary - Overall metrics
   */
  async getDashboardSummary() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Current month revenue
    const monthRevenue = await this.prisma.invoice.aggregate({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
        status: 'PAID',
      },
      _sum: {
        amount: true,
      },
    });

    // Total customers
    const totalCustomers = await this.prisma.customer.count();
    const activeCustomers = await this.prisma.customer.count({
      where: { status: 'active' },
    });

    // Pending invoices
    const pendingInvoices = await this.prisma.invoice.count({
      where: { status: 'PENDING' },
    });

    // Overdue invoices
    const overdueInvoices = await this.prisma.invoice.count({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: now,
        },
      },
    });

    // Payment success rate (last 30 days)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentPayments = await this.prisma.payment.count({
      where: {
        createdAt: { gte: last30Days },
      },
    });
    const successfulPayments = await this.prisma.payment.count({
      where: {
        createdAt: { gte: last30Days },
        status: 'success',
      },
    });

    return {
      monthRevenue: monthRevenue._sum.amount || 0,
      totalCustomers,
      activeCustomers,
      inactiveCustomers: totalCustomers - activeCustomers,
      pendingInvoices,
      overdueInvoices,
      paymentSuccessRate: recentPayments > 0 
        ? (successfulPayments / recentPayments) * 100 
        : 0,
    };
  }

  /**
   * Export data to CSV format
   */
  exportToCSV(data: any[], filename: string): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      ),
    ];

    return csvRows.join('\n');
  }
}
