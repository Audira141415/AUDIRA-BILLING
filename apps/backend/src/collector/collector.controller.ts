import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { CollectorService } from './collector.service';

@Controller('collector')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @Get('invoices')
  async getDueInvoices(@Query('search') search?: string) {
    return this.collectorService.getDueInvoices(search);
  }

  @Get('shift')
  async getActiveShift(
    @Query('collectorId') collectorId = 'COLLECTOR-01',
    @Query('collectorName') collectorName = 'Bpk. Ahmad (Kolektor RT-04)',
  ) {
    return this.collectorService.getActiveShift(collectorId, collectorName);
  }

  @Post('collect')
  async collectPayment(
    @Body()
    body: {
      invoiceId: string;
      collectorId: string;
      collectorName?: string;
      amountPaid: number;
      notes?: string;
    },
  ) {
    return this.collectorService.collectCashPayment(body);
  }

  @Post('shift/handover')
  async handoverShift(@Body() body: { shiftId: string; notes?: string }) {
    return this.collectorService.handoverShiftCash(body.shiftId, body.notes);
  }

  @Get('stats')
  async getStats(@Query('collectorId') collectorId?: string) {
    return this.collectorService.getCollectorStats(collectorId);
  }
}
