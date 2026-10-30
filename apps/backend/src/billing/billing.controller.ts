import { Controller, Post, Body, Get, Param, Res, HttpStatus, Headers } from '@nestjs/common';
import { Response } from 'express';
import { BillingService } from './billing.service';
import { BillingCronService } from './billing.cron.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { ReceiptPdfService } from './receipt-pdf.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { WhatsAppBotService } from '../whatsapp/whatsapp-bot.service';
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
    private readonly whatsappBotService: WhatsAppBotService,
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
   * 📊 Seluruh Transaksi Keuangan & Penerimaan Real-time
   * Dipakai oleh halaman Web Admin Keuangan (/finance/pendapatan)
   */
  @Get('transactions-all')
  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            internetNumber: true,
          },
        },
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
   * 📋 Daftar Pelanggan yang Terisolir (Suspended) & Memerlukan Janji Bayar
   */
  @Get('suspended-customers')
  async getSuspendedCustomers() {
    return this.prisma.customer.findMany({
      where: {
        OR: [
          { status: 'suspended' },
          { isGracePeriod: true },
        ],
      },
      include: {
        packages: true,
        invoices: {
          where: {
            status: { in: ['UNPAID', 'OVERDUE', 'PENDING'] },
          },
          orderBy: { dueDate: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * 📋 Daftar Pelanggan yang Sedang Mendapatkan Dispensasi Janji Bayar (Grace Period)
   */
  @Get('grace-period/active')
  async getActiveGracePeriods() {
    return this.billingService.getActiveGracePeriods();
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

  /**
   * 🤖 Kirim Reminder WhatsApp Masal / Spesifik ke Pelanggan Jatuh Tempo
   */
  @Post('remind-due-customers')
  async remindDueCustomers(
    @Body()
    body: {
      date?: string;
      customerIds?: string[];
      invoiceIds?: string[];
      customMessage?: string;
      mode?: 'HARI_H' | 'H3' | 'CUSTOM';
      items?: Array<{
        customerName: string;
        phone: string;
        internetNumber: string;
        amount: number;
        invoiceNumber: string;
        dueDate: string;
      }>;
    },
  ) {
    const results = [];
    let sentCount = 0;
    let failedCount = 0;

    // 1. Process items directly if provided from frontend calendar
    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      for (const item of body.items) {
        try {
          const fakeCustomer = {
            name: item.customerName,
            phone: item.phone,
            internetNumber: item.internetNumber,
          };
          const fakeInvoice = {
            invoiceNumber: item.invoiceNumber,
            amount: item.amount,
            dueDate: item.dueDate,
          };

          if (body.customMessage) {
            let msg = body.customMessage
              .replace(/{nama}/g, item.customerName)
              .replace(/{internetNumber}/g, item.internetNumber)
              .replace(/{nominal}/g, Number(item.amount).toLocaleString('id-ID'))
              .replace(/{tanggal}/g, item.dueDate);
            await this.whatsappService.sendMessage({ phone: item.phone, message: msg });
          } else if (body.mode === 'H3') {
            await this.whatsappService.sendHMinus3Reminder(fakeCustomer, fakeInvoice);
          } else {
            await this.whatsappService.sendHariHReminder(fakeCustomer, fakeInvoice);
          }

          sentCount++;
          results.push({ name: item.customerName, phone: item.phone, status: 'SENT' });
        } catch (err: any) {
          failedCount++;
          results.push({ name: item.customerName, phone: item.phone, status: 'FAILED', error: err.message });
        }
      }
    } else {
      // 2. Query from Prisma DB
      const whereClause: any = {
        status: { in: ['PENDING', 'OVERDUE'] },
      };

      if (body.invoiceIds && body.invoiceIds.length > 0) {
        whereClause.id = { in: body.invoiceIds };
      } else if (body.customerIds && body.customerIds.length > 0) {
        whereClause.customerId = { in: body.customerIds };
      }

      const dbInvoices = await this.prisma.invoice.findMany({
        where: whereClause,
        include: { customer: true },
      });

      for (const inv of dbInvoices) {
        if (!inv.customer?.phone) continue;
        try {
          if (body.customMessage) {
            let msg = body.customMessage
              .replace(/{nama}/g, inv.customer.name)
              .replace(/{internetNumber}/g, inv.customer.internetNumber || '-')
              .replace(/{nominal}/g, Number(inv.amount).toLocaleString('id-ID'))
              .replace(/{tanggal}/g, inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('id-ID') : '-');
            await this.whatsappService.sendMessage({ phone: inv.customer.phone, message: msg });
          } else if (body.mode === 'H3') {
            await this.whatsappService.sendHMinus3Reminder(inv.customer, inv);
          } else {
            await this.whatsappService.sendHariHReminder(inv.customer, inv);
          }
          sentCount++;
          results.push({ name: inv.customer.name, phone: inv.customer.phone, status: 'SENT' });
        } catch (err: any) {
          failedCount++;
          results.push({ name: inv.customer.name, phone: inv.customer.phone, status: 'FAILED', error: err.message });
        }
      }
    }

    return {
      success: true,
      total: sentCount + failedCount,
      sentCount,
      failedCount,
      results,
    };
  }

  /**
   * 🤖 Kirim Reminder WhatsApp Single Customer
   */
  @Post('send-single-reminder')
  async sendSingleReminder(
    @Body()
    body: {
      phone: string;
      customerName: string;
      internetNumber?: string;
      amount?: number;
      invoiceNumber?: string;
      dueDate?: string;
      customMessage?: string;
      mode?: 'HARI_H' | 'H3' | 'CUSTOM';
    },
  ) {
    try {
      const customer = {
        name: body.customerName,
        phone: body.phone,
        internetNumber: body.internetNumber || '-',
      };
      const invoice = {
        invoiceNumber: body.invoiceNumber || 'INV-AUDIRA',
        amount: body.amount || 250000,
        dueDate: body.dueDate || new Date().toISOString(),
      };

      if (body.customMessage) {
        let msg = body.customMessage
          .replace(/{nama}/g, body.customerName)
          .replace(/{internetNumber}/g, body.internetNumber || '-')
          .replace(/{nominal}/g, Number(body.amount || 0).toLocaleString('id-ID'))
          .replace(/{tanggal}/g, body.dueDate || '-');
        await this.whatsappService.sendMessage({ phone: body.phone, message: msg });
        return { success: true, message: 'Pesan kustom berhasil dikirim via WhatsApp Gateway' };
      } else if (body.mode === 'H3') {
        return await this.whatsappService.sendHMinus3Reminder(customer, invoice);
      } else {
        return await this.whatsappService.sendHariHReminder(customer, invoice);
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 🤖 Manual Trigger Rutinitas Cron Pengingat Harian (H-3, H-1, Hari H, Overdue)
   */
  @Post('run-daily-reminders')
  async runDailyReminders() {
    await this.billingCron.sendPaymentReminders();
    return { success: true, message: 'Rutinitas pengingat tagihan harian berhasil dieksekusi di server!' };
  }

  /**
   * 🤖 Simulasi Chatbot WhatsApp Pelanggan (!tagihan, !ceksinyal, menu)
   */
  @Post('bot-simulate')
  async botSimulate(
    @Body()
    body: {
      phone: string;
      message: string;
      senderName?: string;
    },
  ) {
    const sender = body.phone || '08123456789';
    const text = body.message || '!tagihan';
    return this.whatsappBotService.handleIncomingMessage(sender, text, body.senderName);
  }
}

