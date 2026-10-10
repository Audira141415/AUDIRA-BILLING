import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Revenue Report
   * GET /reports/revenue?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('revenue')
  @Roles('admin')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    return this.reportsService.getRevenueReport(start, end);
  }

  /**
   * Customer Growth Report
   * GET /reports/customer-growth?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('customer-growth')
  @Roles('admin', 'BILLING')
  async getCustomerGrowthReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    return this.reportsService.getCustomerGrowthReport(start, end);
  }

  /**
   * Payment Success Report
   * GET /reports/payment-success?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('payment-success')
  async getPaymentSuccessReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    return this.reportsService.getPaymentSuccessReport(start, end);
  }

  /**
   * Dashboard Summary
   * GET /reports/dashboard
   */
  @Get('dashboard')
  async getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  /**
   * Export Revenue Report to CSV
   * GET /reports/revenue/export?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('revenue/export')
  async exportRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const data = await this.reportsService.getRevenueReport(start, end);
    const csv = this.reportsService.exportToCSV(data, 'revenue-report');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.csv');
    res.send(csv);
  }

  /**
   * Export Customer Growth Report to CSV
   * GET /reports/customer-growth/export?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('customer-growth/export')
  async exportCustomerGrowthReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const data = await this.reportsService.getCustomerGrowthReport(start, end);
    const csv = this.reportsService.exportToCSV(data, 'customer-growth-report');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customer-growth-report.csv');
    res.send(csv);
  }

  /**
   * Export Payment Success Report to CSV
   * GET /reports/payment-success/export?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('payment-success/export')
  async exportPaymentSuccessReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const data = await this.reportsService.getPaymentSuccessReport(start, end);
    
    // Flatten payment methods for CSV
    const flatData = data.map(({ paymentMethods, ...rest }) => ({
      ...rest,
      paymentMethodsCount: paymentMethods.length,
      topPaymentMethod: paymentMethods[0]?.method || 'N/A',
    }));

    const csv = this.reportsService.exportToCSV(flatData, 'payment-success-report');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payment-success-report.csv');
    res.send(csv);
  }
}
