import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { BillingService } from './billing.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class BillingCronService {
  private readonly logger = new Logger(BillingCronService.name);

  constructor(
    private prisma: PrismaService,
    private billingService: BillingService,
    private whatsappService: WhatsAppService,
    private emailService: EmailService,
  ) {}

  /**
   * Generate monthly invoices on the 1st of each month at 1 AM
   */
  @Cron('0 1 1 * *', {
    name: 'generate-monthly-invoices',
    timeZone: 'Asia/Jakarta',
  })
  async generateMonthlyInvoices() {
    this.logger.log('Starting monthly invoice generation...');

    try {
      // Get all active customers
      const activeCustomers = await this.prisma.customer.findMany({
        where: {
          status: 'active',
        },
      });

      this.logger.log(`Found ${activeCustomers.length} active customers`);

      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      let successCount = 0;
      let failCount = 0;

      for (const customer of activeCustomers) {
        try {
          const invoice = await this.billingService.generateInvoice(customer.id, month);
          
          if (invoice) {
            // Send WhatsApp notification
            await this.whatsappService.sendInvoiceNotification(customer, invoice);
            successCount++;
          }
        } catch (error) {
          this.logger.error(`Failed to generate invoice for ${customer.name}:`, error.message);
          failCount++;
        }
      }

      this.logger.log(
        `Monthly invoice generation completed: ${successCount} success, ${failCount} failed`,
      );
    } catch (error) {
      this.logger.error('Failed to generate monthly invoices:', error.message);
    }
  }

  /**
   * Send payment reminders daily at 9 AM
   */
  @Cron('0 9 * * *', {
    name: 'send-payment-reminders',
    timeZone: 'Asia/Jakarta',
  })
  async sendPaymentReminders() {
    this.logger.log('Starting payment reminder notifications...');

    try {
      // Reminder for invoices due in 3 days
      const dueIn3Days = await this.billingService.getInvoicesDueIn(3);
      for (const invoice of dueIn3Days) {
        // Send WhatsApp
        await this.whatsappService.sendPaymentReminder(invoice.customer, invoice, 3);
        
        // Send Email
        if (invoice.customer.email) {
          await this.emailService.sendPaymentReminder({
            to: invoice.customer.email,
            customerName: invoice.customer.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            dueDate: invoice.dueDate.toLocaleDateString('id-ID'),
            daysUntilDue: 3,
          });
        }
      }
      this.logger.log(`Sent ${dueIn3Days.length} reminders for invoices due in 3 days`);

      // Reminder for invoices due in 1 day
      const dueIn1Day = await this.billingService.getInvoicesDueIn(1);
      for (const invoice of dueIn1Day) {
        await this.whatsappService.sendPaymentReminder(invoice.customer, invoice, 1);
        
        if (invoice.customer.email) {
          await this.emailService.sendPaymentReminder({
            to: invoice.customer.email,
            customerName: invoice.customer.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            dueDate: invoice.dueDate.toLocaleDateString('id-ID'),
            daysUntilDue: 1,
          });
        }
      }
      this.logger.log(`Sent ${dueIn1Day.length} reminders for invoices due in 1 day`);

      // Reminder for invoices due today
      const dueToday = await this.billingService.getInvoicesDueIn(0);
      for (const invoice of dueToday) {
        await this.whatsappService.sendPaymentReminder(invoice.customer, invoice, 0);
        
        if (invoice.customer.email) {
          await this.emailService.sendPaymentReminder({
            to: invoice.customer.email,
            customerName: invoice.customer.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            dueDate: invoice.dueDate.toLocaleDateString('id-ID'),
            daysUntilDue: 0,
          });
        }
      }
      this.logger.log(`Sent ${dueToday.length} reminders for invoices due today`);
    } catch (error) {
      this.logger.error('Failed to send payment reminders:', error.message);
    }
  }

  /**
   * Send overdue notices and suspend services at 10 AM daily
   */
  @Cron('0 10 * * *', {
    name: 'handle-overdue-invoices',
    timeZone: 'Asia/Jakarta',
  })
  async handleOverdueInvoices() {
    this.logger.log('Handling overdue invoices...');

    try {
      // Warning for invoices overdue by 3 days
      const overdue3Days = await this.billingService.getOverdueInvoices(3);
      for (const invoice of overdue3Days) {
        await this.whatsappService.sendPaymentReminder(invoice.customer, invoice, -3);
      }
      this.logger.log(`Sent ${overdue3Days.length} overdue warnings (3 days)`);

      // Final warning for invoices overdue by 7 days
      const overdue7Days = await this.billingService.getOverdueInvoices(7);
      for (const invoice of overdue7Days) {
        await this.whatsappService.sendSuspensionWarning(invoice.customer, invoice);
      }
      this.logger.log(`Sent ${overdue7Days.length} suspension warnings (7 days)`);

      // Suspend services for invoices overdue by 10 days
      const overdue10Days = await this.billingService.getOverdueInvoices(10);
      let suspendedCount = 0;
      for (const invoice of overdue10Days) {
        if (invoice.customer.status !== 'suspended') {
          await this.billingService.suspendService(
            invoice.customerId,
            `Payment overdue: ${invoice.invoiceNumber}`,
          );
          suspendedCount++;
        }
      }
      this.logger.log(`Suspended ${suspendedCount} services for overdue payments`);
    } catch (error) {
      this.logger.error('Failed to handle overdue invoices:', error.message);
    }
  }

  /**
   * Manual trigger for testing (can be removed in production)
   */
  async manualGenerateInvoices() {
    this.logger.log('Manual invoice generation triggered');
    await this.generateMonthlyInvoices();
  }

  async manualSendReminders() {
    this.logger.log('Manual reminder send triggered');
    await this.sendPaymentReminders();
  }
}
