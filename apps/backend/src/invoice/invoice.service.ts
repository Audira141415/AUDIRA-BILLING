import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// DTOs
export class CreateInvoiceDto {
  customerId: string;
  amount: number;
  dueDate: Date | string;
  description?: string;
  month?: string;
  status?: string;
}

export class UpdateInvoiceDto {
  amount?: number;
  dueDate?: Date | string;
  status?: string;
  description?: string;
  month?: string;
  paidAt?: Date | string;
}

export class InvoiceQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  status?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string = 'createdAt';
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class RecordPaymentDto {
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  description?: string;
}

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async getInvoices(query: InvoiceQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      customerId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.InvoiceWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Customer filter
    if (customerId) {
      where.customerId = customerId;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              paymentMethod: true,
              paymentDate: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInvoiceDetail(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            status: true,
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!invoice) {
      throw new Error('Invoice tidak ditemukan');
    }

    return invoice;
  }

  async createInvoice(data: CreateInvoiceDto) {
    // Verify customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new Error('Customer tidak ditemukan');
    }

    // Generate invoice number
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await this.prisma.invoice.count();
    const invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: data.customerId,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        description: data.description,
        month: data.month,
        status: data.status || 'PENDING',
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    return {
      message: 'Invoice berhasil dibuat',
      invoice,
    };
  }

  async updateInvoice(id: string, data: UpdateInvoiceDto) {
    // Check if invoice exists
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      throw new Error('Invoice tidak ditemukan');
    }

    const updateData: Prisma.InvoiceUpdateInput = {};

    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.month !== undefined) updateData.month = data.month;
    if (data.paidAt !== undefined) updateData.paidAt = new Date(data.paidAt);

    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    return {
      message: 'Invoice berhasil diupdate',
      invoice,
    };
  }

  async deleteInvoice(id: string) {
    // Check if invoice exists
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new Error('Invoice tidak ditemukan');
    }

    await this.prisma.invoice.delete({
      where: { id },
    });

    return {
      message: 'Invoice berhasil dihapus',
    };
  }

  async getInvoiceStatistics() {
    const [
      totalInvoices,
      pendingInvoices,
      paidInvoices,
      overdueInvoices,
      totalRevenue,
      pendingRevenue,
    ] = await Promise.all([
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: 'PENDING' } }),
      this.prisma.invoice.count({ where: { status: 'PAID' } }),
      this.prisma.invoice.count({ where: { status: 'OVERDUE' } }),
      this.prisma.invoice.aggregate({
        _sum: { amount: true },
      }),
      this.prisma.invoice.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
      }),
    ]);

    return {
      total: totalInvoices,
      pending: pendingInvoices,
      paid: paidInvoices,
      overdue: overdueInvoices,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingRevenue: pendingRevenue._sum.amount || 0,
    };
  }

  async getInvoicesByCustomer(customerId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        payments: true,
      },
    });

    return invoices;
  }

  async recordPayment(invoiceId: string, data: RecordPaymentDto) {
    // Check if invoice exists
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error('Invoice tidak ditemukan');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        description: data.description,
        status: 'success',
      },
    });

    // Calculate total paid amount
    const totalPaid = await this.prisma.payment.aggregate({
      where: { invoiceId },
      _sum: { amount: true },
    });

    const paidAmount = totalPaid._sum.amount || 0;

    // Update invoice status if fully paid
    let updatedInvoice;
    if (paidAmount >= invoice.amount) {
      updatedInvoice = await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
        include: {
          customer: true,
          payments: true,
        },
      });
    } else {
      updatedInvoice = await this.prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          customer: true,
          payments: true,
        },
      });
    }

    return {
      message: 'Pembayaran berhasil dicatat',
      payment,
      invoice: updatedInvoice,
    };
  }

  async bulkCreateInvoices(invoices: CreateInvoiceDto[]) {
    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    for (const invoiceData of invoices) {
      try {
        const result = await this.createInvoice(invoiceData);
        results.success.push(result.invoice);
      } catch (error) {
        results.failed.push({
          data: invoiceData,
          error: error.message,
        });
      }
    }

    return {
      message: `Berhasil membuat ${results.success.length} invoice, gagal ${results.failed.length}`,
      ...results,
    };
  }

  async markAsOverdue() {
    const now = new Date();
    const result = await this.prisma.invoice.updateMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: now,
        },
      },
      data: {
        status: 'OVERDUE',
      },
    });

    return {
      message: `${result.count} invoice ditandai sebagai OVERDUE`,
      count: result.count,
    };
  }
}
