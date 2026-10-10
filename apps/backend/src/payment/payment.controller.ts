import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @Roles('admin', 'BILLING', 'CUSTOMER')
  async createPayment(
    @Body()
    data: {
      invoiceId: string;
      customerId: string;
      amount: number;
      paymentMethod?: 'snap' | 'va' | 'qris' | 'ewallet';
      bank?: string;
      ewallet?: string;
    },
  ) {
    return this.paymentService.createPayment(data);
  }

  @Get('status/:orderId')
  async checkStatus(@Param('orderId') orderId: string) {
    return this.paymentService.checkPaymentStatus(orderId);
  }

  @Post('cancel/:orderId')
  @Roles('admin', 'BILLING')
  async cancelPayment(@Param('orderId') orderId: string) {
    return this.paymentService.cancelPayment(orderId);
  }

  @Post('refund/:orderId')
  @Roles('admin')
  async refundPayment(
    @Param('orderId') orderId: string,
    @Body() data: { amount?: number },
  ) {
    return this.paymentService.refundPayment(orderId, data.amount);
  }

  @Post('recurring/setup')
  async setupRecurring(
    @Body() data: { customerId: string; cardToken: string },
  ) {
    return this.paymentService.setupRecurringPayment(
      data.customerId,
      data.cardToken,
    );
  }

  @Post('recurring/process')
  async processRecurring(
    @Body() data: { customerId: string; amount: number; invoiceId: string },
  ) {
    return this.paymentService.processRecurringPayment(
      data.customerId,
      data.amount,
      data.invoiceId,
    );
  }

  @Post('webhook/midtrans')
  async handleMidtransWebhook(@Body() notification: any) {
    return this.paymentService.handlePaymentNotification(notification);
  }
}
