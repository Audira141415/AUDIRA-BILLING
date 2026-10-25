import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { RealtimeService } from './realtime.service';

export class TestBroadcastDto {
  @IsString()
  type: 'payment' | 'ticket' | 'alert' | 'refresh';

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

@Controller('realtime')
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Get('status')
  getStatus() {
    return this.realtimeService.getStatus();
  }

  @Post('test-broadcast')
  @HttpCode(HttpStatus.OK)
  testBroadcast(@Body() body: TestBroadcastDto) {
    switch (body.type) {
      case 'payment':
        this.realtimeService.broadcastPaymentReceived({
          invoiceId: 'TEST-INV-001',
          invoiceNumber: body.invoiceNumber || 'INV/2026/10/0001',
          customerName: body.customerName || 'Bpk. Agus Dwi Rianto',
          amount: body.amount || 250000,
          paymentMethod: body.paymentMethod || 'QRIS (Midtrans)',
        });
        return { success: true, message: 'Broadcasted payment_received event' };

      case 'ticket':
        this.realtimeService.broadcastTicketUpdated({
          ticketId: 'TEST-TCK-001',
          ticketNumber: 'TCK-202610-099',
          title: body.title || 'Loss of Signal (LOS) - Red PON OLT-01',
          status: body.status || 'ASSIGNED',
          priority: 'HIGH',
          customerName: body.customerName || 'Bpk. Agus Dwi Rianto',
        });
        return { success: true, message: 'Broadcasted ticket_updated event' };

      case 'alert':
        this.realtimeService.broadcastNetworkAlert({
          device: body.device || 'RB4011-CORE-GATEWAY',
          type: 'MIKROTIK',
          status: 'WARNING',
          message: body.message || 'CPU Usage exceeded 85% on ether1-trunk',
          severity: 'HIGH',
        });
        return { success: true, message: 'Broadcasted network_alert event' };

      case 'refresh':
      default:
        this.realtimeService.broadcastDashboardRefresh('test_trigger');
        return { success: true, message: 'Broadcasted dashboard_refresh event' };
    }
  }
}
