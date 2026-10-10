import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Revenue analytics
  @Get('revenue')
  async getRevenueAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.analyticsService.getRevenueAnalytics(start, end);
  }

  // Revenue forecast
  @Get('forecast')
  async forecastRevenue(@Query('months') months?: string) {
    const monthsNum = months ? parseInt(months) : 3;
    return await this.analyticsService.forecastRevenue(monthsNum);
  }

  // Churn prediction
  @Get('churn')
  async predictChurn() {
    return await this.analyticsService.predictChurn();
  }

  // Sales funnel
  @Get('funnel')
  async getSalesFunnel() {
    return await this.analyticsService.getSalesFunnel();
  }

  // Profit margin
  @Get('profit')
  async getProfitMargin() {
    return await this.analyticsService.getProfitMarginAnalysis();
  }

  // Customer lifetime value
  @Get('clv')
  async getCustomerLifetimeValue() {
    return await this.analyticsService.getCustomerLifetimeValue();
  }

  // Dashboard summary
  @Get('dashboard')
  async getDashboardSummary() {
    return await this.analyticsService.getDashboardSummary();
  }
}
