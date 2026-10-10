import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Revenue Analytics
  async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
    const where: any = { status: 'paid' };
    
    if (startDate || endDate) {
      where.paidAt = {};
      if (startDate) where.paidAt.gte = startDate;
      if (endDate) where.paidAt.lte = endDate;
    }

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { customer: { include: { packages: true } } },
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const averageRevenue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    // Group by month
    const revenueByMonth = invoices.reduce((acc, inv) => {
      const month = new Date(inv.paidAt!).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
      });
      acc[month] = (acc[month] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    // Group by package
    const revenueByPackage = invoices.reduce((acc, inv) => {
      const packageName = inv.customer?.packages?.[0]?.name || 'Unknown';
      acc[packageName] = (acc[packageName] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      averageRevenue,
      invoiceCount: invoices.length,
      revenueByMonth,
      revenueByPackage,
    };
  }

  // Revenue Forecasting (Simple Linear Regression)
  async forecastRevenue(months: number = 3) {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: 'paid' },
      orderBy: { paidAt: 'asc' },
    });

    if (invoices.length < 2) {
      return { forecast: [], confidence: 0 };
    }

    // Group by month
    const monthlyRevenue: { month: number; revenue: number }[] = [];
    const grouped = invoices.reduce((acc, inv) => {
      const date = new Date(inv.paidAt!);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { month: date.getTime(), revenue: 0 };
      }
      acc[monthKey].revenue += inv.amount;
      return acc;
    }, {} as Record<string, { month: number; revenue: number }>);

    Object.values(grouped).forEach((v) => monthlyRevenue.push(v));

    // Calculate linear regression
    const n = monthlyRevenue.length;
    const sumX = monthlyRevenue.reduce((sum, item, i) => sum + i, 0);
    const sumY = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
    const sumXY = monthlyRevenue.reduce((sum, item, i) => sum + i * item.revenue, 0);
    const sumX2 = monthlyRevenue.reduce((sum, item, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast
    const forecast = [];
    const lastMonthIndex = n - 1;
    
    for (let i = 1; i <= months; i++) {
      const predictedRevenue = slope * (lastMonthIndex + i) + intercept;
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);
      
      forecast.push({
        month: futureDate.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
        }),
        predictedRevenue: Math.max(0, Math.round(predictedRevenue)),
      });
    }

    // Calculate R-squared for confidence
    const yMean = sumY / n;
    const ssTot = monthlyRevenue.reduce(
      (sum, item) => sum + Math.pow(item.revenue - yMean, 2),
      0
    );
    const ssRes = monthlyRevenue.reduce(
      (sum, item, i) => sum + Math.pow(item.revenue - (slope * i + intercept), 2),
      0
    );
    const rSquared = 1 - ssRes / ssTot;

    return {
      forecast,
      confidence: Math.round(rSquared * 100),
      trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
    };
  }

  // Churn Prediction
  async predictChurn() {
    const customers = await this.prisma.customer.findMany({
      include: {
        invoices: {
          orderBy: { dueDate: 'desc' },
          take: 6,
        },
      },
    });

    const churnRisk = customers.map((customer) => {
      let riskScore = 0;
      let reasons: string[] = [];

      // Factor 1: Overdue invoices
      const overdueCount = customer.invoices.filter(
        (inv) => inv.status === 'overdue'
      ).length;
      if (overdueCount > 0) {
        riskScore += overdueCount * 20;
        reasons.push(`${overdueCount} tagihan overdue`);
      }

      // Factor 2: Payment history
      const paidInvoices = customer.invoices.filter((inv) => inv.status === 'paid');
      const paymentRate = customer.invoices.length > 0
        ? (paidInvoices.length / customer.invoices.length) * 100
        : 100;
      
      if (paymentRate < 50) {
        riskScore += 30;
        reasons.push(`Payment rate rendah (${paymentRate.toFixed(0)}%)`);
      }

      // Factor 3: Recent activity (last invoice)
      const lastInvoice = customer.invoices[0];
      if (lastInvoice) {
        const daysSinceLastInvoice = Math.floor(
          (Date.now() - new Date(lastInvoice.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastInvoice > 60) {
          riskScore += 25;
          reasons.push(`Tidak ada aktivitas ${daysSinceLastInvoice} hari`);
        }
      }

      // Factor 4: Support tickets (if available)
      // This would require ticket data

      const riskLevel =
        riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

      return {
        customerId: customer.id,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        riskScore: Math.min(100, riskScore),
        riskLevel,
        reasons,
        lastActivity: lastInvoice?.createdAt || customer.createdAt,
      };
    });

    // Sort by risk score (highest first)
    churnRisk.sort((a, b) => b.riskScore - a.riskScore);

    return {
      highRisk: churnRisk.filter((c) => c.riskLevel === 'high'),
      mediumRisk: churnRisk.filter((c) => c.riskLevel === 'medium'),
      lowRisk: churnRisk.filter((c) => c.riskLevel === 'low'),
      summary: {
        total: customers.length,
        highRiskCount: churnRisk.filter((c) => c.riskLevel === 'high').length,
        mediumRiskCount: churnRisk.filter((c) => c.riskLevel === 'medium').length,
        lowRiskCount: churnRisk.filter((c) => c.riskLevel === 'low').length,
      },
    };
  }

  // Sales Funnel Analytics
  async getSalesFunnel() {
    const totalLeads = await this.prisma.customer.count();
    const activeCustomers = await this.prisma.customer.count({
      where: { status: 'active' },
    });
    const paidInvoices = await this.prisma.invoice.count({
      where: { status: 'paid' },
    });
    const referrals = await this.prisma.referral.count({
      where: { status: 'completed' },
    });

    // Calculate conversion rates
    const leadToCustomerRate =
      totalLeads > 0 ? (activeCustomers / totalLeads) * 100 : 0;
    const customerToPayingRate =
      activeCustomers > 0 ? (paidInvoices / activeCustomers) * 100 : 0;

    return {
      funnel: [
        { stage: 'Total Leads', count: totalLeads, percentage: 100 },
        {
          stage: 'Active Customers',
          count: activeCustomers,
          percentage: Math.round(leadToCustomerRate),
        },
        {
          stage: 'Paid Invoices',
          count: paidInvoices,
          percentage: Math.round(customerToPayingRate),
        },
        { stage: 'Referrals', count: referrals, percentage: 0 },
      ],
      conversionRates: {
        leadToCustomer: leadToCustomerRate.toFixed(2),
        customerToPaying: customerToPayingRate.toFixed(2),
      },
    };
  }

  // Profit Margin Analysis
  async getProfitMarginAnalysis() {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: 'paid' },
      include: {
        customer: {
          include: { packages: true },
        },
      },
    });

    // Calculate by package
    const profitByPackage = invoices.reduce((acc, inv) => {
      const packageName = inv.customer?.packages?.[0]?.name || 'Unknown';
      const price = inv.customer?.packages?.[0]?.price || 0;
      
      // Estimate cost (30% of price for operational costs)
      const estimatedCost = price * 0.3;
      const profit = price - estimatedCost;
      const margin = price > 0 ? (profit / price) * 100 : 0;

      if (!acc[packageName]) {
        acc[packageName] = {
          revenue: 0,
          cost: 0,
          profit: 0,
          margin: 0,
          count: 0,
        };
      }

      acc[packageName].revenue += price;
      acc[packageName].cost += estimatedCost;
      acc[packageName].profit += profit;
      acc[packageName].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate margins
    Object.keys(profitByPackage).forEach((pkg) => {
      const data = profitByPackage[pkg];
      data.margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
    });

    const totalRevenue = Object.values(profitByPackage).reduce(
      (sum: number, p: any) => sum + p.revenue,
      0
    );
    const totalCost = Object.values(profitByPackage).reduce(
      (sum: number, p: any) => sum + p.cost,
      0
    );
    const totalProfit = totalRevenue - totalCost;
    const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      byPackage: profitByPackage,
      overall: {
        revenue: totalRevenue,
        cost: totalCost,
        profit: totalProfit,
        margin: overallMargin.toFixed(2),
      },
    };
  }

  // Customer Lifetime Value (CLV)
  async getCustomerLifetimeValue() {
    const customers = await this.prisma.customer.findMany({
      include: {
        invoices: {
          where: { status: 'paid' },
        },
      },
    });

    const clvData = customers.map((customer) => {
      const totalSpent = customer.invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const invoiceCount = customer.invoices.length;
      const avgOrderValue = invoiceCount > 0 ? totalSpent / invoiceCount : 0;

      // Calculate months as customer
      const firstInvoice = customer.invoices[0];
      const monthsAsCustomer = firstInvoice
        ? Math.max(
            1,
            Math.floor(
              (Date.now() - new Date(firstInvoice.createdAt).getTime()) /
                (1000 * 60 * 60 * 24 * 30)
            )
          )
        : 1;

      // CLV = Average Order Value × Purchase Frequency × Customer Lifespan
      const purchaseFrequency = invoiceCount / monthsAsCustomer;
      const estimatedLifespan = 24; // months
      const clv = avgOrderValue * purchaseFrequency * estimatedLifespan;

      return {
        customerId: customer.id,
        customerName: customer.name,
        totalSpent,
        invoiceCount,
        avgOrderValue,
        monthsAsCustomer,
        clv: Math.round(clv),
      };
    });

    // Sort by CLV (highest first)
    clvData.sort((a, b) => b.clv - a.clv);

    const avgCLV =
      clvData.length > 0
        ? clvData.reduce((sum, c) => sum + c.clv, 0) / clvData.length
        : 0;

    return {
      topCustomers: clvData.slice(0, 10),
      averageCLV: Math.round(avgCLV),
      totalCustomers: customers.length,
    };
  }

  // Dashboard Summary
  async getDashboardSummary() {
    const [
      revenue,
      forecast,
      churn,
      funnel,
      profit,
    ] = await Promise.all([
      this.getRevenueAnalytics(),
      this.forecastRevenue(3),
      this.predictChurn(),
      this.getSalesFunnel(),
      this.getProfitMarginAnalysis(),
    ]);

    return {
      revenue: {
        total: revenue.totalRevenue,
        average: revenue.averageRevenue,
        invoiceCount: revenue.invoiceCount,
      },
      forecast: {
        nextMonth: forecast.forecast[0]?.predictedRevenue || 0,
        confidence: forecast.confidence,
        trend: forecast.trend,
      },
      churn: {
        highRisk: churn.summary.highRiskCount,
        mediumRisk: churn.summary.mediumRiskCount,
        totalCustomers: churn.summary.total,
      },
      funnel: {
        conversionRate: funnel.conversionRates.leadToCustomer,
        activeCustomers: funnel.funnel[1].count,
      },
      profit: {
        margin: profit.overall.margin,
        totalProfit: profit.overall.profit,
      },
    };
  }
}
