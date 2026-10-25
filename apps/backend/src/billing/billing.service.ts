import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SalesService } from '../sales/sales.service';
import { RadiusService } from '../radius/radius.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private salesService: SalesService,
    private radiusService: RadiusService,
    private mikrotikService: MikrotikService,
    private whatsappService: WhatsAppService,
  ) {}

  /**
   * Generate monthly invoice for a customer
   */
  async generateInvoice(customerId: string, month: string): Promise<any> {
    try {
      // Get customer details
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      if (customer.status !== 'active') {
        this.logger.warn(`Customer ${customerId} is not active, skipping invoice`);
        return null;
      }

      // Check if invoice already exists for this month
      const existingInvoice = await this.prisma.invoice.findFirst({
        where: {
          customerId,
          month,
        },
      });

      if (existingInvoice) {
        this.logger.warn(`Invoice already exists for ${customerId} - ${month}`);
        return existingInvoice;
      }

      // Calculate due date (e.g., 5th of next month)
      const [year, monthNum] = month.split('-').map(Number);
      const dueDate = new Date(year, monthNum, 5); // 5th of next month

      // Generate invoice number
      const invoiceNumber = await this.generateInvoiceNumber();

      // Get package price (assuming customer has package relation)
      const amount = 300000; // Default amount, should come from package

      // Create invoice
      const invoice = await this.prisma.invoice.create({
        data: {
          invoiceNumber,
          customerId,
          amount,
          dueDate,
          month,
          status: 'PENDING',
          description: `Tagihan Internet - ${month}`,
        },
      });

      this.logger.log(`Invoice created: ${invoiceNumber} for customer ${customer.name}`);
      
      // Send invoice email
      if (customer.email) {
        try {
          await this.emailService.sendInvoiceEmail({
            to: customer.email,
            customerName: customer.name,
            invoiceNumber,
            amount,
            dueDate: dueDate.toLocaleDateString('id-ID'),
            period: month,
          });
          this.logger.log(`Invoice email sent to ${customer.email}`);
        } catch (emailError) {
          this.logger.error(`Failed to send invoice email: ${emailError.message}`);
          // Continue even if email fails
        }
      }
      
      return invoice;
    } catch (error) {
      this.logger.error(`Failed to generate invoice for ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Generate unique invoice number
   */
  async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Count invoices this month
    const count = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(year, date.getMonth(), 1),
          lt: new Date(year, date.getMonth() + 1, 1),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${year}${month}-${sequence}`;
  }

  /**
   * Get all invoices due for payment
   */
  async getInvoicesDueIn(days: number): Promise<any[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        customer: true,
      },
    });
  }

  /**
   * Get overdue invoices
   */
  async getOverdueInvoices(daysOverdue: number): Promise<any[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysOverdue);

    return this.prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: targetDate,
        },
      },
      include: {
        customer: true,
      },
    });
  }

  /**
   * Suspend customer service
   */
  async suspendService(customerId: string, reason: string): Promise<any> {
    try {
      const updated = await this.prisma.customer.update({
        where: { id: customerId },
        data: {
          status: 'suspended',
        },
      });

      this.logger.log(`Service suspended for customer ${customerId}: ${reason}`);
      
      // TODO: Disable PPPoE account in MikroTik
      
      return updated;
    } catch (error) {
      this.logger.error(`Failed to suspend service for ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Unsuspend customer service after payment + RADIUS CoA / Instant Session Kick
   */
  async unsuspendService(customerId: string): Promise<any> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      const updated = await this.prisma.customer.update({
        where: { id: customerId },
        data: {
          status: 'active',
        },
      });

      this.logger.log(`Service unsuspended for customer ${customer.name} (${customerId})`);

      // ─── RADIUS CoA / MikroTik Session Kick ("Bayar, Langsung Nyala") ───
      const username = customer.internetNumber || customer.phone || customer.email || '';
      if (username) {
        try {
          this.logger.log(`[CoA Auto-Unblock] Mengirim sinyal CoA / Kick Session untuk pelanggan: ${customer.name} (${username})`);
          
          // 1. Eksekusi RADIUS Disconnect / CoA
          await this.radiusService.disconnectUser(username);

          // 2. Eksekusi RouterOS Kick Session Fallback
          await this.mikrotikService.kickActiveSession(username);

          this.logger.log(`[CoA Sukses] Sesi lama ${username} diputus. Modem klien akan reconnect otomatis ke paket normal dalam 3-5 detik!`);
        } catch (coaErr: any) {
          this.logger.warn(`[CoA Warning] Gagal kirim sinyal CoA otomatis: ${coaErr.message}`);
        }
      }

      return updated;
    } catch (error) {
      this.logger.error(`Failed to unsuspend service for ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Manual CoA / Reconnect Sesi Pelanggan On-Demand (Admin Action)
   */
  async reconnectCustomerSession(customerId: string): Promise<any> {
    let customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      customer = await this.prisma.customer.findFirst({
        where: { internetNumber: customerId },
      });
    }

    if (!customer) {
      throw new Error('Customer not found');
    }

    const username = customer.internetNumber || customer.phone || customer.email || '';
    if (!username) {
      throw new Error('Pelanggan tidak memiliki ID internet / username PPPoE');
    }

    // Kirim sinyal CoA & kick
    await this.radiusService.disconnectUser(username);
    const kickResult = await this.mikrotikService.kickActiveSession(username);

    return {
      success: true,
      message: `Paket CoA berhasil dikirim! Sesi ${username} diputus dan modem pelanggan sedang reconnect otomatis.`,
      details: kickResult,
    };
  }

  /**
   * Set Janji Bayar / Dispensasi Isolir Sementara (Grace Period)
   */
  async setGracePeriod(customerId: string, promiseDateStr: string, notes?: string): Promise<any> {
    let customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      customer = await this.prisma.customer.findFirst({
        where: { internetNumber: customerId },
      });
    }

    if (!customer) {
      throw new Error('Customer not found');
    }

    const promiseDate = new Date(promiseDateStr);

    // 1. Update status customer ke active & simpan promiseDate
    const updated = await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        isGracePeriod: true,
        promiseDate,
        graceNotes: notes || 'Permohonan dispensasi janji bayar',
        status: 'active',
      },
    });

    // 2. Trigger CoA / Reconnect Sesi Modem Pelanggan agar langsung aktif
    const username = customer.internetNumber || customer.phone || customer.email || '';
    if (username) {
      try {
        await this.radiusService.disconnectUser(username);
        await this.mikrotikService.kickActiveSession(username);
        this.logger.log(`[Grace Period CoA] Sesi ${username} diputus, modem tersambung ke profil normal dispensasi.`);
      } catch (err: any) {
        this.logger.warn(`Gagal kirim CoA saat grace period: ${err.message}`);
      }
    }

    // 3. Kirim konfirmasi WhatsApp komitmen janji bayar
    try {
      const formattedDate = promiseDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      await this.whatsappService.sendMessage({
        phone: customer.phone,
        message:
          `🤝 *PERSETUJUAN JANJI BAYAR (DISPENSASI ISOLIR)*\n\n` +
          `Halo *${customer.name}*,\n` +
          `Permohonan dispensasi janji bayar internet Anda telah disetujui sampai dengan tanggal:\n` +
          `📅 *Batas Waktu*: ${formattedDate}\n\n` +
          `Layanan internet Anda telah diaktifkan kembali. Mohon lakukan pelunasan tagihan sebelum batas waktu tersebut agar layanan tidak terisolir otomatis kembali oleh sistem.\n\n` +
          `Terima kasih atas pengertian dan kerjasamanya.\n*AUDIRA Digital Network*`,
      });
    } catch (waErr: any) {
      this.logger.warn(`Gagal kirim WA Janji Bayar: ${waErr.message}`);
    }

    return {
      success: true,
      message: `Dispensasi janji bayar berhasil diberikan hingga ${promiseDate.toLocaleDateString('id-ID')}. Internet pelanggan telah diaktifkan kembali via CoA.`,
      customer: updated,
    };
  }

  /**
   * Batalkan Janji Bayar dan kembalikan ke isolir
   */
  async cancelGracePeriod(customerId: string): Promise<any> {
    let customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      customer = await this.prisma.customer.findFirst({
        where: { internetNumber: customerId },
      });
    }

    if (!customer) {
      throw new Error('Customer not found');
    }

    const updated = await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        isGracePeriod: false,
        status: 'suspended',
      },
    });

    return this.suspendService(customer.id, 'Dispensasi janji bayar dibatalkan');
  }

  /**
   * Process payment confirmation
   */
  async confirmPayment(invoiceId: string, paymentData: any): Promise<any> {
    try {
      // Update invoice status
      const invoice = await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
        include: {
          customer: true,
        },
      });

      // Create payment record
      const payment = await this.prisma.transaction.create({
        data: {
          customerId: invoice.customerId,
          invoiceId: invoice.id,
          amount: invoice.amount,
          type: 'payment',
          method: paymentData.method || 'Online Payment',
          status: 'success',
          description: `Pembayaran ${invoice.invoiceNumber}`,
          paymentGatewayRef: paymentData.transactionId,
        },
      });

      // Unsuspend service if suspended
      if (invoice.customer.status === 'suspended') {
        await this.unsuspendService(invoice.customerId);
      }

      // Trigger bonus komisi mitra sales jika ada
      try {
        await this.salesService.triggerPsbCommission(invoice.id, invoice.customerId);
      } catch (salesErr: any) {
        this.logger.warn(`Gagal memproses komisi sales untuk invoice ${invoice.id}: ${salesErr.message}`);
      }

      this.logger.log(`Payment confirmed for invoice ${invoice.invoiceNumber}`);

      // 🤖 Kirim WhatsApp otomatis konfirmasi lunas + lampiran PDF kwitansi resmi AUDIRA
      try {
        await this.whatsappService.sendPaymentReceivedWithReceipt(invoice.customer, invoice, payment);
      } catch (waErr: any) {
        this.logger.warn(`Gagal mengirim WhatsApp konfirmasi kwitansi: ${waErr.message}`);
      }
      
      return { invoice, payment };
    } catch (error) {
      this.logger.error(`Failed to confirm payment for ${invoiceId}:`, error.message);
      throw error;
    }
  }
}
