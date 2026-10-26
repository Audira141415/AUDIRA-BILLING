import { Controller, Post, Body, Get, Param, Res, HttpStatus, Headers } from '@nestjs/common';
import { Response } from 'express';
import { BillingService } from './billing.service';
import { BillingCronService } from './billing.cron.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { ReceiptPdfService } from './receipt-pdf.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly billingCron: BillingCronService,
    private readonly paymentGateway: PaymentGatewayService,
    private readonly receiptPdfService: ReceiptPdfService,
    private readonly whatsappService: WhatsAppService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 🤖 Daftar Seluruh Tagihan & Data Customer Real-time
   * Dipakai oleh antarmuka WhatsApp Billing Scheduler UI
   */
  @Get('invoices-all')
  async getAllInvoices() {
    return this.prisma.invoice.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            internetNumber: true,
            status: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }

  /**
   * 🤖 Ringkasan Metrik Pelanggan untuk Scheduler
   */
  @Get('scheduler-summary')
  async getSchedulerSummary() {
    const totalCustomers = await this.prisma.customer.count();
    const activeCustomers = await this.prisma.customer.count({ where: { status: 'active' } });
    const pendingInvoices = await this.prisma.invoice.count({ where: { status: 'PENDING' } });
    const paidInvoices = await this.prisma.invoice.count({ where: { status: 'PAID' } });

    return {
      totalCustomers,
      activeCustomers,
      pendingInvoices,
      paidInvoices,
    };
  }

  /**
   * Unduh / Preview Berkas PDF Kwitansi Resmi AUDIRA
   * Endpoint publik/terverifikasi untuk lampiran WhatsApp Fonnte & Portal
   */
  @Get(['invoices/:id/receipt-pdf', 'receipt/:id/pdf'])
  async getReceiptPdf(@Param('id') invoiceId: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.receiptPdfService.generateReceiptPdf(invoiceId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="Kwitansi-${invoiceId}.pdf"`,
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (err: any) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: err.message || 'Kwitansi PDF tidak dapat dibuat',
      });
    }
  }

  /**
   * 🤖 Manual Trigger: Jalankan pengiriman WhatsApp H-3 ke pelanggan
   */
  @Post('scheduler/run-h3')
  async triggerH3Scheduler() {
    return this.billingCron.manualSendH3Reminders();
  }

  /**
   * 🤖 Manual Trigger: Jalankan pengiriman WhatsApp Hari-H (QRIS) ke pelanggan
   */
  @Post('scheduler/run-hari-h')
  async triggerHariHScheduler() {
    return this.billingCron.manualSendHariHReminders();
  }

  /**
   * Manual trigger to generate invoices (for testing)
   */
  @Post('generate-invoices')
  async generateInvoices() {
    await this.billingCron.manualGenerateInvoices();
    return { message: 'Invoice generation triggered' };
  }

  /**
   * Manual trigger to send reminders (for testing)
   */
  @Post('send-reminders')
  async sendReminders() {
    await this.billingCron.manualSendReminders();
    return { message: 'Reminder sending triggered' };
  }

  /**
   * Create payment for an invoice
   */
  @Post('create-payment')
  async createPayment(@Body() data: { invoiceId: string }) {
    // Get invoice details
    const invoice = await this.billingService['prisma'].invoice.findUnique({
      where: { id: data.invoiceId },
      include: { customer: true },
    });

    if (!invoice) {
      return { success: false, message: 'Invoice not found' };
    }

    // Create payment transaction
    const payment = await this.paymentGateway.createPayment({
      invoiceId: invoice.id,
      amount: invoice.amount,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      customerPhone: invoice.customer.phone,
    });

    return payment;
  }

  /**
   * Create QRIS payment (QR Code)
   */
  @Post('create-qris-payment')
  async createQRISPayment(@Body() data: { invoiceId: string }) {
    // Get invoice details
    const invoice = await this.billingService['prisma'].invoice.findUnique({
      where: { id: data.invoiceId },
      include: { customer: true },
    });

    if (!invoice) {
      return { success: false, message: 'Invoice not found' };
    }

    // Create QRIS payment
    const payment = await this.paymentGateway.createQRISPayment({
      invoiceId: invoice.id,
      amount: invoice.amount,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      customerPhone: invoice.customer.phone,
    });

    return payment;
  }

  /**
   * Create Virtual Account payment
   */
  @Post('create-va-payment')
  async createVAPayment(@Body() data: { invoiceId: string; bank: string }) {
    // Get invoice details
    const invoice = await this.billingService['prisma'].invoice.findUnique({
      where: { id: data.invoiceId },
      include: { customer: true },
    });

    if (!invoice) {
      return { success: false, message: 'Invoice not found' };
    }

    // Validate bank
    const validBanks = ['bca', 'bni', 'bri', 'permata'];
    if (!validBanks.includes(data.bank.toLowerCase())) {
      return { 
        success: false, 
        message: 'Invalid bank. Supported: BCA, BNI, BRI, Permata' 
      };
    }

    // Create VA payment
    const payment = await this.paymentGateway.createVAPayment({
      invoiceId: invoice.id,
      amount: invoice.amount,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      customerPhone: invoice.customer.phone,
      bank: data.bank.toLowerCase(),
    });

    return payment;
  }

  /**
   * Webhook handler for Midtrans payment notifications
   */
  @Post('webhook/midtrans')
  async handleMidtransWebhook(@Body() notification: {
    order_id: string;
    transaction_status: string;
    payment_type: string;
    transaction_id: string;
    fraud_status?: string;
    gross_amount?: string;
  }) {
    try {
      // Verify notification
      const isValid = this.paymentGateway.verifyNotification(notification);
      if (!isValid) {
        return { success: false, message: 'Invalid notification' };
      }

      // Process notification
      const result = this.paymentGateway.processNotification(notification);

      if (result.status === 'success') {
        // Confirm payment
        const { invoice, payment } = await this.billingService.confirmPayment(result.orderId, {
          method: notification.payment_type,
          transactionId: notification.transaction_id,
        });

        // Send WhatsApp confirmation with official AUDIRA PDF receipt
        await this.whatsappService.sendPaymentReceivedWithReceipt(invoice.customer, invoice, payment);
      }

      return { success: true, message: 'Notification processed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Check payment status
   */
  @Get('payment-status/:orderId')
  async checkPaymentStatus(@Param('orderId') orderId: string) {
    const status = await this.paymentGateway.checkStatus(orderId);
    return status;
  }

  /**
   * Manual CoA / Reconnect Sesi Pelanggan On-Demand ("Bayar, Langsung Nyala")
   */
  @Post('coa/reconnect/:customerId')
  async reconnectSession(@Param('customerId') customerId: string) {
    return this.billingService.reconnectCustomerSession(customerId);
  }

  /**
   * Set Janji Bayar / Dispensasi Isolir Sementara
   */
  @Post('grace-period/:customerId')
  async setGracePeriod(
    @Param('customerId') customerId: string,
    @Body('promiseDate') promiseDate: string,
    @Body('notes') notes?: string,
  ) {
    return this.billingService.setGracePeriod(customerId, promiseDate, notes);
  }

  /**
   * Batalkan Janji Bayar dan isolir kembali
   */
  @Post('grace-period/:customerId/cancel')
  async cancelGracePeriod(@Param('customerId') customerId: string) {
    return this.billingService.cancelGracePeriod(customerId);
  }

  /**
   * 📊 Dynamic Invoice Breakdown (Biaya Pokok, PPN 11%, Sewa ONT, Diskon)
   */
  @Get('invoices/:id/breakdown')
  async getInvoiceBreakdown(@Param('id') invoiceId: string) {
    return this.billingService.getInvoiceBreakdown(invoiceId);
  }

  /**
   * ⚡ Instant Payment Checkout with Autonomous RADIUS CoA Unblock
   * Menghilangkan isolir dan memulihkan sesi pelanggan dalam < 2 detik
   */
  @Post('invoices/:id/pay')
  async payInvoice(
    @Param('id') invoiceId: string,
    @Body() body: {
      method?: string;
      transactionId?: string;
      amount?: number;
      idempotencyKey?: string;
    },
    @Headers('x-idempotency-key') headerIdempotencyKey?: string,
  ) {
    const idempotencyKey = body.idempotencyKey || headerIdempotencyKey;
    return this.billingService.payInvoiceWithCoa(invoiceId, {
      ...body,
      idempotencyKey,
    });
  }
}

