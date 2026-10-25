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
      // 1. Reminder for invoices due in 3 days (H-3 dengan Link Bayar Instan)
      const dueIn3Days = await this.billingService.getInvoicesDueIn(3);
      for (const invoice of dueIn3Days) {
        // Send WhatsApp H-3 via Fonnte Engine
        await this.whatsappService.sendHMinus3Reminder(invoice.customer, invoice);
        
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
      this.logger.log(`Sent ${dueIn3Days.length} H-3 reminders for invoices due in 3 days`);

      // 2. Reminder for invoices due in 1 day (H-1)
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

      // 3. Reminder for invoices due today (Hari H dengan QRIS Dinamis Langsung di Chat)
      const dueToday = await this.billingService.getInvoicesDueIn(0);
      for (const invoice of dueToday) {
        // Send WhatsApp Hari-H with QRIS via Fonnte Engine
        await this.whatsappService.sendHariHReminder(invoice.customer, invoice);
        
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
      this.logger.log(`Sent ${dueToday.length} Hari-H QRIS reminders for invoices due today`);
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

  async manualSendH3Reminders() {
    this.logger.log('[Manual Trigger] Mengirim WhatsApp H-3 ke pelanggan due in 3 days...');
    const dueIn3Days = await this.billingService.getInvoicesDueIn(3);
    const results = [];
    for (const invoice of dueIn3Days) {
      const res = await this.whatsappService.sendHMinus3Reminder(invoice.customer, invoice);
      results.push({ customer: invoice.customer.name, phone: invoice.customer.phone, status: res });
    }
    return { count: dueIn3Days.length, results };
  }

  async manualSendHariHReminders() {
    this.logger.log('[Manual Trigger] Mengirim WhatsApp Hari-H QRIS ke pelanggan due today...');
    const dueToday = await this.billingService.getInvoicesDueIn(0);
    const results = [];
    for (const invoice of dueToday) {
      const res = await this.whatsappService.sendHariHReminder(invoice.customer, invoice);
      results.push({ customer: invoice.customer.name, phone: invoice.customer.phone, status: res });
    }
    return { count: dueToday.length, results };
  }

  /**
   * Cek Otomatis Janji Bayar yang Kedaluwarsa (Setiap 30 Menit)
   * Mengembalikan pelanggan ke mode ISOLIR jika lewat batas waktu belum bayar!
   */
  @Cron('*/30 * * * *', {
    name: 'check-expired-grace-periods',
    timeZone: 'Asia/Jakarta',
  })
  async checkExpiredGracePeriods() {
    try {
      this.logger.log('[Janji Bayar Cron] Memeriksa masa dispensasi pelanggan...');
      const now = new Date();

      const expiredCustomers = await this.prisma.customer.findMany({
        where: {
          isGracePeriod: true,
          promiseDate: {
            lt: now,
          },
        },
        include: {
          invoices: {
            where: {
              status: { in: ['UNPAID', 'OVERDUE', 'pending'] },
            },
          },
        },
      });

      for (const customer of expiredCustomers) {
        if (customer.invoices.length > 0) {
          this.logger.warn(`[Janji Bayar Expired] Pelanggan ${customer.name} belum membayar setelah batas waktu dispensasi. Mengisolir kembali...`);
          
          await this.prisma.customer.update({
            where: { id: customer.id },
            data: {
              isGracePeriod: false,
              status: 'suspended',
            },
          });

          // Kick sesi agar masuk ke walled garden
          const username = customer.internetNumber || customer.phone || customer.email || '';
          if (username) {
            try {
              await this.billingService.suspendService(customer.id, 'Batas janji bayar telah terlewati');
            } catch (e) {}
          }

          // Kirim notifikasi peringatan WhatsApp
          try {
            await this.whatsappService.sendMessage({
              phone: customer.phone,
              message:
                `⚠️ *PEMBERITAHUAN: DISPENSASI JANJI BAYAR TELAH BERAKHIR*\n\n` +
                `Halo *${customer.name}*,\n` +
                `Batas waktu dispensasi janji bayar Anda telah berakhir dan sistem belum mendeteksi pembayaran tagihan Anda.\n\n` +
                `Layanan internet Anda telah dialihkan kembali ke status *ISOLIR*. Mohon segera lakukan pembayaran agar internet langsung aktif kembali seketika (Auto-CoA).\n\n` +
                `Terima kasih.\n*AUDIRA Digital Network*`,
            });
          } catch (err) {}
        } else {
          // Tagihan sudah lunas, hapus flag dispensasi
          await this.prisma.customer.update({
            where: { id: customer.id },
            data: { isGracePeriod: false },
          });
        }
      }
    } catch (err: any) {
      this.logger.error('Error saat memeriksa expired grace periods:', err.message);
    }
  }
}
