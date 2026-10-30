import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * 📡 Daftar Seluruh Kanal Pembayaran Aktif & Konfigurasi Biaya Admin
   */
  @Get('channels')
  getChannels() {
    return {
      success: true,
      channels: this.paymentService.getChannels(),
    };
  }

  /**
   * ⚡ Inisialisasi Transaksi Pembayaran Multi-Kanal (VA, QRIS, E-Wallet, Retail)
   */
  @Post('create')
  async createPayment(
    @Body()
    data: {
      invoiceId: string;
      customerId?: string;
      amount?: number;
      paymentMethod?: 'snap' | 'va' | 'qris' | 'ewallet' | 'retail';
      bank?: string;
      ewallet?: string;
      retail?: string;
    },
  ) {
    return this.paymentService.createPayment(data);
  }

  /**
   * ⚡ Alias Endpoint Charge Transaksi
   */
  @Post('charge')
  async chargePayment(
    @Body()
    data: {
      invoiceId: string;
      customerId?: string;
      amount?: number;
      paymentMethod?: 'snap' | 'va' | 'qris' | 'ewallet' | 'retail';
      bank?: string;
      ewallet?: string;
      retail?: string;
    },
  ) {
    return this.paymentService.createPayment(data);
  }

  /**
   * 🔍 Periksa Status Pembayaran Real-Time
   */
  @Get('status/:orderId')
  async checkStatus(@Param('orderId') orderId: string) {
    return this.paymentService.checkPaymentStatus(orderId);
  }

  /**
   * 🛡️ Webhook Midtrans Publik dengan Verifikasi Signature SHA-512 & RADIUS CoA
   */
  @Post('webhook/midtrans')
  @HttpCode(HttpStatus.OK)
  async handleMidtransWebhook(
    @Body() notification: any,
    @Headers('x-signature-key') headerSignature?: string,
  ) {
    return this.paymentService.handlePaymentNotification(notification, headerSignature);
  }

  /**
   * 🛡️ Webhook Tripay Publik dengan Verifikasi HMAC-SHA256 Timing-Safe
   */
  @Post('webhook/tripay')
  @HttpCode(HttpStatus.OK)
  async handleTripayWebhook(
    @Body() payload: any,
    @Headers('x-callback-signature') signature?: string,
  ) {
    const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return this.paymentService.handleTripayWebhook(rawBody, signature);
  }

  /**
   * 🔄 Pembatalan Pembayaran
   */
  @Post('cancel/:orderId')
  async cancelPayment(@Param('orderId') orderId: string) {
    return this.paymentService.cancelPayment(orderId);
  }

  /**
   * 💸 Refund Pembayaran
   */
  @Post('refund/:orderId')
  async refundPayment(
    @Param('orderId') orderId: string,
    @Body() data: { amount?: number },
  ) {
    return this.paymentService.refundPayment(orderId, data.amount);
  }

  /**
   * 💳 Pendaftaran Token Recurring
   */
  @Post('recurring/setup')
  async setupRecurring(@Body() data: { customerId: string; cardToken: string }) {
    return this.paymentService.setupRecurringPayment(data.customerId, data.cardToken);
  }

  /**
   * ⚡ Eksekusi Tagihan Berulang
   */
  @Post('recurring/process')
  async processRecurring(
    @Body() data: { customerId: string; amount: number; invoiceId: string },
  ) {
    return this.paymentService.processRecurringPayment(data.customerId, data.amount, data.invoiceId);
  }
}
