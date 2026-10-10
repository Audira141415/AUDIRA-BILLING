import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
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
   * Unsuspend customer service after payment
   */
  async unsuspendService(customerId: string): Promise<any> {
    try {
      const updated = await this.prisma.customer.update({
        where: { id: customerId },
        data: {
          status: 'active',
        },
      });

      this.logger.log(`Service unsuspended for customer ${customerId}`);
      
      // TODO: Enable PPPoE account in MikroTik
      
      return updated;
    } catch (error) {
      this.logger.error(`Failed to unsuspend service for ${customerId}:`, error.message);
      throw error;
    }
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

      this.logger.log(`Payment confirmed for invoice ${invoice.invoiceNumber}`);
      
      return { invoice, payment };
    } catch (error) {
      this.logger.error(`Failed to confirm payment for ${invoiceId}:`, error.message);
      throw error;
    }
  }
}
