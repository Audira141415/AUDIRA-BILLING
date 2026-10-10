import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { AuditService, AuditAction } from '../audit/audit.service';
import * as midtransClient from 'midtrans-client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private snap: any;
  private coreApi: any;

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private auditService: AuditService,
  ) {
    // Initialize Midtrans Snap
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    // Initialize Midtrans Core API (for VA, QRIS, etc.)
    this.coreApi = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  /**
   * Create payment with multiple payment methods
   */
  async createPayment(data: {
    invoiceId: string;
    customerId: string;
    amount: number;
    paymentMethod?: 'snap' | 'va' | 'qris' | 'ewallet';
    bank?: string; // For VA: bca, bni, mandiri, permata
    ewallet?: string; // For e-wallet: gopay, shopeepay, ovo
  }) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { customer: true },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const customer = invoice.customer;
    const orderId = `INV-${invoice.invoiceNumber}-${Date.now()}`;

    try {
      let result;

      switch (data.paymentMethod) {
        case 'va':
          result = await this.createVirtualAccount(orderId, data.amount, customer, data.bank);
          break;
        case 'qris':
          result = await this.createQRIS(orderId, data.amount, customer);
          break;
        case 'ewallet':
          result = await this.createEwallet(orderId, data.amount, customer, data.ewallet);
          break;
        default:
          result = await this.createSnapPayment(orderId, data.amount, customer, invoice);
      }

      // Update invoice with payment details
      await this.prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          paymentUrl: result.redirectUrl || result.vaNumber || result.qrString,
        },
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to create payment for invoice ${data.invoiceId}:`, error);
      throw error;
    }
  }

  /**
   * Create Snap payment (multiple payment methods)
   */
  private async createSnapPayment(orderId: string, amount: number, customer: any, invoice: any) {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      item_details: [
        {
          id: invoice.id,
          price: amount,
          quantity: 1,
          name: `Invoice ${invoice.invoiceNumber}`,
        },
      ],
      enabled_payments: [
        'credit_card',
        'bca_va',
        'bni_va',
        'bri_va',
        'permata_va',
        'other_va',
        'gopay',
        'shopeepay',
        'qris',
      ],
    };

    const transaction = await this.snap.createTransaction(parameter);

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId,
    };
  }

  /**
   * Create Virtual Account payment
   */
  private async createVirtualAccount(orderId: string, amount: number, customer: any, bank: string) {
    const parameter = {
      payment_type: 'bank_transfer',
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      bank_transfer: {
        bank: bank || 'bca', // Default to BCA
      },
    };

    const transaction = await this.coreApi.charge(parameter);

    return {
      orderId,
      vaNumber: transaction.va_numbers?.[0]?.va_number,
      bank: transaction.va_numbers?.[0]?.bank,
      expiryTime: transaction.expiry_time,
    };
  }

  /**
   * Create QRIS payment
   */
  private async createQRIS(orderId: string, amount: number, customer: any) {
    const parameter = {
      payment_type: 'qris',
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    };

    const transaction = await this.coreApi.charge(parameter);

    return {
      orderId,
      qrString: transaction.actions?.[0]?.url,
      expiryTime: transaction.expiry_time,
    };
  }

  /**
   * Create E-wallet payment (GoPay, ShopeePay, OVO)
   */
  private async createEwallet(orderId: string, amount: number, customer: any, ewallet: string) {
    const parameter = {
      payment_type: ewallet === 'gopay' ? 'gopay' : 'shopeepay',
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    };

    if (ewallet === 'gopay') {
      parameter['gopay'] = {
        enable_callback: true,
        callback_url: `${process.env.CUSTOMER_PORTAL_URL}/payments/callback`,
      };
    }

    const transaction = await this.coreApi.charge(parameter);

    return {
      orderId,
      deeplink: transaction.actions?.[0]?.url,
      qrCode: transaction.actions?.[1]?.url,
      expiryTime: transaction.expiry_time,
    };
  }

  /**
   * Setup auto-debit/recurring payment
   */
  async setupRecurringPayment(customerId: string, cardToken: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Save card token for recurring payments
    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        // Add field in schema: recurringPaymentToken
        // recurringPaymentToken: cardToken,
      },
    });

    return {
      success: true,
      message: 'Recurring payment setup successfully',
    };
  }

  /**
   * Process recurring payment
   */
  async processRecurringPayment(customerId: string, amount: number, invoiceId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // TODO: Implement recurring charge with saved card token

    return {
      success: true,
      message: 'Recurring payment processed',
    };
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(orderId: string) {
    try {
      const status = await this.coreApi.transaction.status(orderId);
      return status;
    } catch (error) {
      this.logger.error(`Failed to check status for ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel payment
   */
  async cancelPayment(orderId: string) {
    try {
      const result = await this.coreApi.transaction.cancel(orderId);
      return result;
    } catch (error) {
      this.logger.error(`Failed to cancel payment ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(orderId: string, amount?: number) {
    try {
      const parameter = amount ? { amount } : {};
      const result = await this.coreApi.transaction.refund(orderId, parameter);
      return result;
    } catch (error) {
      this.logger.error(`Failed to refund payment ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Handle payment notification/webhook from Midtrans
   */
  async handlePaymentNotification(notification: any) {
    try {
      const orderId = notification.order_id;
      const transactionStatus = notification.transaction_status;
      const fraudStatus = notification.fraud_status;

      this.logger.log(`Payment notification received for ${orderId}: ${transactionStatus}`);

      // Extract invoice number from order ID (format: INV-{invoiceNumber}-{timestamp})
      const invoiceNumber = orderId.split('-').slice(1, -1).join('-');

      const invoice = await this.prisma.invoice.findFirst({
        where: { invoiceNumber },
        include: { customer: true },
      });

      if (!invoice) {
        this.logger.error(`Invoice not found for order ${orderId}`);
        return { success: false, message: 'Invoice not found' };
      }

      // Handle different transaction statuses
      if (transactionStatus === 'capture') {
        if (fraudStatus === 'accept') {
          await this.markInvoiceAsPaid(invoice, notification);
        }
      } else if (transactionStatus === 'settlement') {
        await this.markInvoiceAsPaid(invoice, notification);
      } else if (transactionStatus === 'pending') {
        this.logger.log(`Payment pending for ${orderId}`);
      } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
        this.logger.log(`Payment ${transactionStatus} for ${orderId}`);
      }

      return { success: true, message: 'Notification processed' };
    } catch (error) {
      this.logger.error('Failed to handle payment notification:', error);
      throw error;
    }
  }

  /**
   * Mark invoice as paid and send confirmation email
   */
  private async markInvoiceAsPaid(invoice: any, notification: any) {
    try {
      // Update invoice status
      await this.prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: invoice.amount,
          paymentMethod: notification.payment_type || 'midtrans',
          paymentDate: new Date(),
          status: 'success',
          transactionId: notification.transaction_id,
        },
      });

      // Log payment success
      await this.auditService.log({
        action: AuditAction.PAYMENT_SUCCESS,
        userEmail: invoice.customer.email,
        entityType: 'Payment',
        entityId: payment.id,
        details: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.amount,
          paymentMethod: notification.payment_type,
          transactionId: notification.transaction_id,
        },
        status: 'SUCCESS',
      });

      this.logger.log(`Invoice ${invoice.invoiceNumber} marked as PAID`);

      // Send payment confirmation email
      if (invoice.customer.email) {
        try {
          await this.emailService.sendPaymentConfirmation({
            to: invoice.customer.email,
            customerName: invoice.customer.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            paymentDate: new Date().toLocaleDateString('id-ID'),
            paymentMethod: this.formatPaymentMethod(notification.payment_type),
          });
          this.logger.log(`Payment confirmation email sent to ${invoice.customer.email}`);
        } catch (emailError) {
          this.logger.error(`Failed to send payment confirmation email: ${emailError.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to mark invoice as paid: ${error.message}`);
      throw error;
    }
  }

  /**
   * Format payment method for display
   */
  private formatPaymentMethod(paymentType: string): string {
    const methods = {
      'credit_card': 'Kartu Kredit',
      'bank_transfer': 'Transfer Bank',
      'bca_va': 'BCA Virtual Account',
      'bni_va': 'BNI Virtual Account',
      'bri_va': 'BRI Virtual Account',
      'permata_va': 'Permata Virtual Account',
      'gopay': 'GoPay',
      'shopeepay': 'ShopeePay',
      'qris': 'QRIS',
    };
    return methods[paymentType] || paymentType;
  }
}
