import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { KeuanganService } from './keuangan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('keuangan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KeuanganController {
  constructor(private readonly keuanganService: KeuanganService) {}

  // ─── Invoice Endpoints ───────────────────────────────────────────────

  @Get('invoices')
  @Roles('admin', 'BILLING')
  async findAllInvoices(@Query('customerId') customerId?: string) {
    return this.keuanganService.findAllInvoices(customerId);
  }

  @Get('invoices/summary')
  @Roles('admin', 'BILLING')
  async getSummaryByMonth() {
    return this.keuanganService.getSummaryByMonth();
  }

  @Get('stats')
  @Roles('admin', 'BILLING')
  async getStats() {
    return this.keuanganService.getStats();
  }

  @Get('invoices/:id')
  @Roles('admin', 'BILLING')
  async findInvoice(@Param('id') id: string) {
    return this.keuanganService.findInvoice(id);
  }

  @Post('invoices')
  @Roles('admin', 'BILLING')
  async createInvoice(@Body() data: any) {
    return this.keuanganService.createInvoice(data);
  }

  @Post('invoices/bulk-generate')
  @Roles('admin', 'BILLING')
  async bulkGenerateInvoices(@Body() body: { month: string }) {
    if (!body.month) {
      const now = new Date();
      body.month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    return this.keuanganService.bulkGenerateInvoices(body.month);
  }

  @Post('invoices/:id/mark-paid')
  @Roles('admin', 'BILLING')
  async markInvoicePaid(
    @Param('id') id: string,
    @Body() body: { paymentMethod?: string }
  ) {
    return this.keuanganService.markInvoicePaid(id, body.paymentMethod || 'Cash');
  }

  @Put('invoices/:id')
  @Roles('admin', 'BILLING')
  async updateInvoice(@Param('id') id: string, @Body() data: any) {
    return this.keuanganService.updateInvoice(id, data);
  }

  @Delete('invoices/:id')
  @Roles('admin', 'BILLING')
  async deleteInvoice(@Param('id') id: string) {
    return this.keuanganService.deleteInvoice(id);
  }

  // ─── Payment Endpoints ───────────────────────────────────────────────

  @Post('payments')
  @Roles('admin', 'BILLING')
  async createPayment(@Body() data: any) {
    return this.keuanganService.createPayment(data);
  }

  // ─── Customer Billing Status ─────────────────────────────────────────

  @Get('overdue')
  @Roles('admin', 'BILLING')
  async getOverdueCustomers(@Query('days') days?: string) {
    return this.keuanganService.getOverdueCustomers(days ? parseInt(days) : 0);
  }

  @Post('suspend/:customerId')
  @Roles('admin', 'BILLING')
  async suspendCustomer(
    @Param('customerId') customerId: string,
    @Body() body: { reason?: string }
  ) {
    return this.keuanganService.suspendCustomer(customerId, body.reason);
  }

  @Post('unsuspend/:customerId')
  @Roles('admin', 'BILLING')
  async unsuspendCustomer(@Param('customerId') customerId: string) {
    return this.keuanganService.unsuspendCustomer(customerId);
  }
}
