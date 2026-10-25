import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get customer dashboard statistics
   */
  async getDashboard(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        packages: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Get invoice statistics
    const invoices = await this.prisma.invoice.findMany({
      where: { customerId: customerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const totalInvoices = await this.prisma.invoice.count({
      where: { customerId: customerId },
    });

    const unpaidInvoices = await this.prisma.invoice.count({
      where: {
        customerId: customerId,
        status: 'unpaid',
      },
    });

    const totalUnpaid = await this.prisma.invoice.aggregate({
      where: {
        customerId: customerId,
        status: 'unpaid',
      },
      _sum: {
        amount: true,
      },
    });

    // Get ticket statistics
    const totalTickets = await this.prisma.ticket.count({
      where: { customerId: customerId },
    });

    const openTickets = await this.prisma.ticket.count({
      where: {
        customerId: customerId,
        status: { in: ['open', 'in_progress'] },
      },
    });

    // Get recent tickets
    const recentTickets = await this.prisma.ticket.findMany({
      where: { customerId: customerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    });

    const currentPackage = customer.packages && customer.packages.length > 0 ? customer.packages[0] : null;

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
      },
      package: currentPackage ? {
        id: currentPackage.id,
        name: currentPackage.name,
        speed: currentPackage.speed,
        price: currentPackage.price,
      } : null,
      invoices: {
        total: totalInvoices,
        unpaid: unpaidInvoices,
        totalUnpaidAmount: totalUnpaid._sum.amount || 0,
        recent: invoices.map(inv => ({
          id: inv.id,
          dueDate: inv.dueDate,
          amount: inv.amount,
          status: inv.status,
          createdAt: inv.createdAt,
        })),
      },
      tickets: {
        total: totalTickets,
        open: openTickets,
        recent: recentTickets,
      },
      bandwidthUsage: {
        // TODO: Integrate with Mikrotik for real-time data
        download: 0,
        upload: 0,
        total: 0,
        lastUpdated: new Date(),
      },
    };
  }

  /**
   * Get customer profile
   */
  async getProfile(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        packages: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const currentPackage = customer.packages && customer.packages.length > 0 ? customer.packages[0] : null;

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      internetNumber: customer.internetNumber,
      ipAddress: customer.ipAddress,
      installedModem: customer.installedModem,
      modemSerial: customer.modemSerial,
      installationDate: customer.installationDate,
      status: customer.status,
      createdAt: customer.createdAt,
      package: currentPackage ? {
        id: currentPackage.id,
        name: currentPackage.name,
        speed: currentPackage.speed,
        price: currentPackage.price,
        description: currentPackage.description,
      } : null,
    };
  }

  /**
   * Update customer profile
   */
  async updateProfile(customerId: string, updateData: {
    name?: string;
    phone?: string;
    address?: string;
  }) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const updated = await this.prisma.customer.update({
      where: { id: customerId },
      data: updateData,
      include: {
        packages: true,
      },
    });

    const currentPackage = updated.packages && updated.packages.length > 0 ? updated.packages[0] : null;

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      status: updated.status,
      package: currentPackage ? {
        id: currentPackage.id,
        name: currentPackage.name,
        speed: currentPackage.speed,
        price: currentPackage.price,
      } : null,
    };
  }

  /**
   * Get customer invoices with pagination
   */
  async getInvoices(customerId: string, page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where: any = { customerId: customerId };
    if (status) {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      data: invoices,
      pagination: meta,
      meta,
    };
  }

  /**
   * Get invoice detail
   */
  async getInvoiceDetail(customerId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        customerId: customerId,
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  /**
   * Get available packages
   */
  async getAvailablePackages() {
    return this.prisma.package.findMany({
      where: { status: 'active' },
      orderBy: { price: 'asc' },
    });
  }

  /**
   * Get customer's current package
   */
  async getCurrentPackage(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        packages: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer.packages && customer.packages.length > 0 ? customer.packages[0] : null;
  }

  /**
   * Get customer tickets
   */
  async getTickets(customerId: string, page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where: any = { customerId: customerId };
    if (status) {
      where.status = status;
    }

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          technician: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      data: tickets,
      pagination: meta,
      meta,
    };
  }

  /**
   * Get ticket detail
   */
  async getTicketDetail(customerId: string, ticketId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        customerId: customerId,
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        technician: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  /**
   * Create new ticket
   */
  async createTicket(customerId: string, ticketData: {
    title: string;
    description: string;
    priority?: string;
  }) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Generate ticket number
    const ticketCount = await this.prisma.ticket.count();
    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(ticketCount + 1).padStart(5, '0')}`;

    const ticket = await this.prisma.ticket.create({
      data: {
        customerId: customerId,
        ticketNumber: ticketNumber,
        title: ticketData.title,
        description: ticketData.description || '',
        priority: ticketData.priority || 'medium',
        status: 'open',
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return ticket;
  }

  /**
   * Change customer password
   */
  async changePassword(customerId: string, data: { currentPassword?: string; newPassword?: string }) {
    if (!data.newPassword || data.newPassword.length < 3) {
      throw new BadRequestException('Password baru minimal 3 karakter');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.password && data.currentPassword) {
      const isValid = await bcrypt.compare(data.currentPassword, customer.password);
      if (!isValid) {
        throw new BadRequestException('Password saat ini salah');
      }
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { password: hashedPassword },
    });

    return { message: 'Password berhasil diperbarui' };
  }
}
