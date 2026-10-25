import { Controller, Post, Get, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppBotService } from './whatsapp-bot.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly whatsappBotService: WhatsAppBotService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Status Koneksi Self-Hosted WAHA (Baileys Engine) & Cloud Fonnte
   */
  @Get('gateway/status')
  async getGatewayStatus() {
    return this.whatsappService.getWahaStatus();
  }

  /**
   * QR Code Live Pairing WhatsApp (WAHA Baileys Engine)
   */
  @Get('gateway/qr')
  async getGatewayQr() {
    return this.whatsappService.getWahaQrCode();
  }

  /**
   * Mulai Sesi WAHA Baileys
   */
  @Post('gateway/start')
  async startGatewaySession() {
    return this.whatsappService.startWahaSession();
  }

  /**
   * Webhook pesan masuk dari Fonnte / WhatsApp Gateway (Public, no JWT)
   */
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    // Fonnte sends payload: { sender: '628...', message: '...', name: '...' }
    const sender = body.sender || body.from || body.phone || '';
    const message = body.message || body.text || '';
    const name = body.name || '';

    return this.whatsappBotService.handleIncomingMessage(sender, message, name);
  }

  /**
   * 🤖 Test WhatsApp H-3 Jatuh Tempo (Link Bayar Instan)
   */
  @Post('test/h3-reminder')
  @HttpCode(HttpStatus.OK)
  async testH3Reminder(@Body() body: { phone: string; invoiceId?: string }) {
    let customer: any;
    let invoice: any;

    if (body.invoiceId) {
      invoice = await this.prisma.invoice.findFirst({
        where: { OR: [{ id: body.invoiceId }, { invoiceNumber: body.invoiceId }] },
        include: { customer: true },
      });
      if (invoice) {
        customer = { ...invoice.customer };
      }
    }

    if (!invoice) {
      customer = {
        name: 'Bpk. Agus Pratama',
        phone: body.phone || '081234567890',
        internetNumber: 'NET-353175',
        package: 'Gamer Ultra 50 Mbps',
      };
      invoice = {
        id: 'INV-DEMO-H3',
        invoiceNumber: 'INV-202610-3841',
        amount: 285000,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        month: 'Oktober 2026',
      };
    }

    if (body.phone) customer.phone = body.phone;
    return this.whatsappService.sendHMinus3Reminder(customer, invoice);
  }

  /**
   * 🤖 Test WhatsApp Hari-H Jatuh Tempo (QRIS Dinamis Langsung di Chat)
   */
  @Post('test/hari-h-reminder')
  @HttpCode(HttpStatus.OK)
  async testHariHReminder(@Body() body: { phone: string; invoiceId?: string }) {
    let customer: any;
    let invoice: any;

    if (body.invoiceId) {
      invoice = await this.prisma.invoice.findFirst({
        where: { OR: [{ id: body.invoiceId }, { invoiceNumber: body.invoiceId }] },
        include: { customer: true },
      });
      if (invoice) {
        customer = { ...invoice.customer };
      }
    }

    if (!invoice) {
      customer = {
        name: 'Bpk. Agus Pratama',
        phone: body.phone || '081234567890',
        internetNumber: 'NET-353175',
        package: 'Gamer Ultra 50 Mbps',
      };
      invoice = {
        id: 'INV-DEMO-HARI-H',
        invoiceNumber: 'INV-202610-3841',
        amount: 285000,
        dueDate: new Date(),
        month: 'Oktober 2026',
      };
    }

    if (body.phone) customer.phone = body.phone;
    return this.whatsappService.sendHariHReminder(customer, invoice);
  }

  /**
   * 🤖 Test WhatsApp Pembayaran Masuk + Lampiran PDF Kwitansi Resmi AUDIRA
   */
  @Post('test/payment-receipt')
  @HttpCode(HttpStatus.OK)
  async testPaymentReceipt(@Body() body: { phone: string; invoiceId?: string }) {
    let customer: any;
    let invoice: any;
    let payment: any;

    if (body.invoiceId) {
      invoice = await this.prisma.invoice.findFirst({
        where: { OR: [{ id: body.invoiceId }, { invoiceNumber: body.invoiceId }] },
        include: { customer: true, payments: true },
      });
      if (invoice) {
        customer = { ...invoice.customer };
        payment = invoice.payments[0] || {
          amount: invoice.amount,
          paymentMethod: 'qris',
          paymentDate: new Date(),
        };
      }
    }

    if (!invoice) {
      const sample = await this.prisma.invoice.findFirst({
        where: { status: 'PAID' },
        include: { customer: true, payments: true },
      });

      if (sample) {
        invoice = sample;
        customer = { ...sample.customer };
        payment = sample.payments[0] || {
          amount: sample.amount,
          paymentMethod: 'qris',
          paymentDate: sample.paidAt || new Date(),
        };
      } else {
        customer = {
          name: 'Bpk. Agus Pratama',
          phone: body.phone || '081234567890',
          internetNumber: 'NET-353175',
          address: 'Jl. Boulevard Harapan Indah No. 88, Bekasi',
        };
        invoice = {
          id: 'INV-DEMO-PAID',
          invoiceNumber: 'INV-202610-3841',
          amount: 285000,
          paidAt: new Date(),
          description: 'Tagihan Internet Fiber Optik - Gamer Ultra 50 Mbps',
        };
        payment = {
          amount: 285000,
          paymentMethod: 'qris',
          paymentDate: new Date(),
        };
      }
    }

    if (body.phone) customer.phone = body.phone;
    return this.whatsappService.sendPaymentReceivedWithReceipt(customer, invoice, payment);
  }

  @Post('test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async testMessage(@Body() data: { phone: string; message: string }) {
    return this.whatsappService.sendMessage(data);
  }

  @Post('send-invoice')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async sendInvoice(@Body() data: { customer: any; invoice: any }) {
    return this.whatsappService.sendInvoiceNotification(data.customer, data.invoice);
  }

  @Post('send-reminder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async sendReminder(@Body() data: { customer: any; invoice: any; daysLeft: number }) {
    return this.whatsappService.sendPaymentReminder(data.customer, data.invoice, data.daysLeft);
  }
}

