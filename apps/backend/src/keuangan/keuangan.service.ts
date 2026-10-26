import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeuanganService {
  constructor(private prisma: PrismaService) {}

  async findAllInvoices(customerId?: string) {
    return this.prisma.invoice.findMany({
      where: customerId ? { customerId } : undefined,
      include: {
        customer: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getStats() {
    const invoices = await this.prisma.invoice.findMany();

    // Status in DB is uppercase: PAID, PENDING, OVERDUE
    const totalRevenue = invoices
      .filter(i => i.status === 'PAID')
      .reduce((sum, i) => sum + i.amount, 0);

    const unpaidAmount = invoices
      .filter(i => i.status === 'PENDING')
      .reduce((sum, i) => sum + i.amount, 0);

    const overdueAmount = invoices
      .filter(i => i.status === 'OVERDUE')
      .reduce((sum, i) => sum + i.amount, 0);

    const paidCount = invoices.filter(i => i.status === 'PAID').length;
    const pendingCount = invoices.filter(i => i.status === 'PENDING').length;
    const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

    return {
      totalRevenue,
      unpaidAmount,
      overdueAmount,
      paidCount,
      pendingCount,
      overdueCount,
      totalInvoices: invoices.length,
      // Aliases for frontend compatibility
      paidInvoices: paidCount,
      unpaidInvoices: pendingCount,
      overdueInvoices: overdueCount,
    };
  }

  async findInvoice(id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        OR: [
          { id },
          { invoiceNumber: id }
        ]
      },
      include: {
        customer: true,
        payments: true
      }
    });
    if (!invoice) throw new NotFoundException('Invoice tidak ditemukan');
    return invoice;
  }

  async createInvoice(data: any) {
    // Generate invoice number if not provided
    if (!data.invoiceNumber) {
      data.invoiceNumber = await this.generateInvoiceNumber();
    }
    return this.prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        status: data.status || 'PENDING',
        description: data.description,
        month: data.month,
        customerId: data.customerId
      },
      include: { customer: true }
    });
  }

  async updateInvoice(id: string, data: any) {
    return this.prisma.invoice.update({
      where: { id },
      data,
      include: { customer: true }
    });
  }

  async deleteInvoice(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice tidak ditemukan');
    if (invoice.status === 'PAID') throw new BadRequestException('Invoice yang sudah dibayar tidak bisa dihapus');

    // Delete related payments first
    await this.prisma.payment.deleteMany({ where: { invoiceId: id } });
    return this.prisma.invoice.delete({ where: { id } });
  }

  async createPayment(data: any) {
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: data.invoiceId,
        amount: data.amount,
        paymentMethod: data.method,
        paymentDate: new Date(),
        status: data.status || 'success',
        transactionId: data.transactionId,
        description: data.description,
      }
    });

    // Update invoice status if payment is successful
    if (data.status === 'success' || !data.status) {
      await this.prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      });
    }

    return payment;
  }

  async markInvoicePaid(id: string, paymentMethod: string = 'Cash') {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { customer: true }
    });
    if (!invoice) throw new NotFoundException('Invoice tidak ditemukan');
    if (invoice.status === 'PAID') throw new BadRequestException('Invoice sudah dalam status PAID');

    // Create payment record
    await this.prisma.payment.create({
      data: {
        invoiceId: id,
        amount: invoice.amount,
        paymentMethod,
        paymentDate: new Date(),
        status: 'success',
        description: `Pembayaran manual: ${invoice.invoiceNumber}`,
      }
    });

    // Update invoice
    const updated = await this.prisma.invoice.update({
      where: { id },
      data: { status: 'PAID', paidAt: new Date() },
      include: { customer: true }
    });

    // If customer was suspended, reactive
    if (invoice.customer?.status === 'suspended') {
      await this.prisma.customer.update({
        where: { id: invoice.customerId },
        data: { status: 'active' }
      });
    }

    return updated;
  }

  async bulkGenerateInvoices(month: string) {
    const activeCustomers = await this.prisma.customer.findMany({
      where: { status: 'active' },
      include: { packages: true }
    });

    const [year, monthNum] = month.split('-').map(Number);
    const dueDate = new Date(year, monthNum, 5); // Jatuh tempo tanggal 5 bulan berikutnya

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const customer of activeCustomers) {
      try {
        // Check if invoice already exists for this month
        const existing = await this.prisma.invoice.findFirst({
          where: { customerId: customer.id, month }
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Get package price
        const packagePrice = customer.packages[0]?.price || 300000;

        const invoiceNumber = await this.generateInvoiceNumber();
        await this.prisma.invoice.create({
          data: {
            invoiceNumber,
            customerId: customer.id,
            amount: packagePrice,
            dueDate,
            month,
            status: 'PENDING',
            description: `Tagihan Internet - ${month}`,
          }
        });
        created++;
      } catch (err: any) {
        errors.push(`${customer.name}: ${err.message}`);
      }
    }

    return {
      success: true,
      month,
      totalCustomers: activeCustomers.length,
      created,
      skipped,
      errors,
      message: `Berhasil buat ${created} invoice, skip ${skipped} yang sudah ada`
    };
  }

  async getOverdueCustomers(daysOverdue: number = 0) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysOverdue);

    const overdueInvoices = await this.prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lt: daysOverdue === 0 ? new Date() : targetDate }
      },
      include: { customer: true },
      orderBy: { dueDate: 'asc' }
    });

    // Mark invoices as OVERDUE
    if (overdueInvoices.length > 0) {
      await this.prisma.invoice.updateMany({
        where: {
          status: 'PENDING',
          dueDate: { lt: new Date() }
        },
        data: { status: 'OVERDUE' }
      });
    }

    return overdueInvoices.map(inv => ({
      ...inv,
      daysOverdue: Math.floor((new Date().getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24))
    }));
  }

  async suspendCustomer(customerId: string, reason: string = 'Tagihan melewati jatuh tempo') {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Pelanggan tidak ditemukan');

    return this.prisma.customer.update({
      where: { id: customerId },
      data: { status: 'suspended' }
    });
  }

  async unsuspendCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Pelanggan tidak ditemukan');

    return this.prisma.customer.update({
      where: { id: customerId },
      data: { status: 'active' }
    });
  }

  async getSummaryByMonth() {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: 'PAID' },
      select: { month: true, amount: true }
    });

    const summaryMap: Record<string, number> = {};
    for (const inv of invoices) {
      const key = inv.month || 'unknown';
      summaryMap[key] = (summaryMap[key] || 0) + inv.amount;
    }

    // Return sorted by month
    return Object.entries(summaryMap)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

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
}
