import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingCronService } from './billing.cron.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly billingCron: BillingCronService,
    private readonly paymentGateway: PaymentGatewayService,
    private readonly whatsappService: WhatsAppService,
  ) {}

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

        // Send WhatsApp confirmation
        await this.whatsappService.sendPaymentConfirmation(invoice.customer, payment);
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
}
