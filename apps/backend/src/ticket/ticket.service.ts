import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

// DTOs
export class CreateTicketDto {
  title: string;
  description?: string;
  priority?: string; // low, medium, high, urgent
  customerId?: string;
  technicianId?: string;
  category?: string;
}

export class UpdateTicketDto {
  title?: string;
  description?: string;
  priority?: string;
  status?: string; // open, in_progress, resolved, closed
  technicianId?: string;
}

export class TicketQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  status?: string; // all, open, in_progress, resolved, closed
  priority?: string; // all, low, medium, high, urgent
  customerId?: string;
  technicianId?: string;
  sortBy?: string = 'createdAt';
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class AssignTicketDto {
  technicianId: string;
}

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private prisma: PrismaService,
    private realtimeService: RealtimeService,
  ) {}

  /**
   * Get all tickets as a flat list
   */
  async getAllTicketsList() {
    return this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
      },
    });
  }

  /**
   * Get tickets with pagination, search, and filters
   */
  async getTickets(query: any = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const {
      search,
      status,
      priority,
      customerId,
      technicianId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Status filter
    if (status && status !== 'all' && status !== 'ALL') {
      const normalizedStatus = status === 'in-progress' ? 'in_progress' : status;
      where.status = normalizedStatus;
    }

    // Priority filter
    if (priority && priority !== 'all' && priority !== 'ALL') {
      where.priority = priority;
    }

    // Customer filter
    if (customerId) {
      where.customerId = customerId;
    }

    // Technician filter
    if (technicianId) {
      where.technicianId = technicianId;
    }

    // Get tickets with pagination
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
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
              phone: true,
              status: true,
            },
          },
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      data: tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get ticket detail by ID
   */
  async getTicketDetail(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            status: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            skills: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    return ticket;
  }

  /**
   * Create new ticket (Standard admin or internal)
   */
  async createTicket(data: CreateTicketDto) {
    let customerId = data.customerId;
    if (customerId) {
      let customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        customer = await this.prisma.customer.findFirst({
          where: {
            OR: [
              { phone: customerId },
              { internetNumber: customerId },
            ],
          },
        });
      }
      customerId = customer?.id;
    }

    if (data.technicianId) {
      const technician = await this.prisma.technician.findUnique({
        where: { id: data.technicianId },
      });
      if (!technician) {
        throw new BadRequestException('Teknisi tidak ditemukan');
      }
    }

    // Generate ticket number: TKT-YYYYMMDD-00001
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `TKT-${dateStr}-`;

    const lastTicket = await this.prisma.ticket.findFirst({
      where: {
        ticketNumber: { startsWith: prefix },
      },
      orderBy: { ticketNumber: 'desc' },
    });

    let ticketNumber: string;
    if (lastTicket) {
      const parts = lastTicket.ticketNumber.split('-');
      const lastNumber = parseInt(parts[parts.length - 1], 10);
      ticketNumber = `${prefix}${String(isNaN(lastNumber) ? 1 : lastNumber + 1).padStart(5, '0')}`;
    } else {
      ticketNumber = `${prefix}00001`;
    }

    // Create ticket
    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber,
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        status: 'open',
        customerId,
        technicianId: data.technicianId,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    // Broadcast realtime event
    try {
      this.realtimeService.broadcastTicketUpdated({
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        customerName: ticket.customer?.name,
        technicianId: ticket.technicianId || undefined,
        technicianName: ticket.technician?.name || undefined,
      });
    } catch (rtErr: any) {
      this.logger.warn(`Failed to broadcast ticket event: ${rtErr.message}`);
    }

    return {
      message: 'Ticket berhasil dibuat',
      ticket,
    };
  }

  /**
   * Dedicated Customer Trouble Report Endpoint (Mobile App Integration)
   */
  async createCustomerReport(data: any) {
    let customerId = data.customerId;
    let customer: any = null;

    if (customerId) {
      customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        customer = await this.prisma.customer.findFirst({
          where: {
            OR: [
              { phone: customerId },
              { internetNumber: customerId },
              { email: customerId },
            ],
          },
        });
      }
    }

    if (!customer && data.phone) {
      customer = await this.prisma.customer.findFirst({
        where: { phone: data.phone },
      });
    }

    if (!customer) {
      customer = await this.prisma.customer.findFirst({
        where: { status: 'active' },
      });
      if (!customer) {
        customer = await this.prisma.customer.findFirst();
      }
    }

    customerId = customer?.id || null;

    const category = data.category || 'Kendala Koneksi';
    const rawTitle = data.title || 'Laporan Gangguan Jaringan Pelanggan';
    const title = rawTitle.includes('[') ? rawTitle : `[${category}] ${rawTitle}`;

    // Priority: if category is 'Lampu LOS Merah', automatically set high
    let priority = data.priority || 'medium';
    if (category.toLowerCase().includes('los') || rawTitle.toLowerCase().includes('los')) {
      priority = 'high';
    }

    // Generate ticket number: TKT-YYYYMMDD-00001
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `TKT-${dateStr}-`;

    const lastTicket = await this.prisma.ticket.findFirst({
      where: {
        ticketNumber: { startsWith: prefix },
      },
      orderBy: { ticketNumber: 'desc' },
    });

    let ticketNumber: string;
    if (lastTicket) {
      const parts = lastTicket.ticketNumber.split('-');
      const lastNumber = parseInt(parts[parts.length - 1], 10);
      ticketNumber = `${prefix}${String(isNaN(lastNumber) ? 1 : lastNumber + 1).padStart(5, '0')}`;
    } else {
      ticketNumber = `${prefix}00001`;
    }

    const description = [
      data.description || 'Pelanggan melaporkan kendala koneksi melalui aplikasi AUDIRA-NET Mobile.',
      data.deviceInfo ? `Info Perangkat: ${data.deviceInfo}` : '',
      customer ? `Kontak: ${customer.name} (${customer.phone || '-'})` : '',
    ].filter(Boolean).join('\n');

    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        priority,
        status: 'open',
        customerId,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    // Broadcast realtime event to NOC & Techs
    try {
      this.realtimeService.broadcastTicketUpdated({
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        customerName: ticket.customer?.name,
        technicianId: ticket.technicianId || undefined,
        technicianName: ticket.technician?.name || undefined,
      });
    } catch (rtErr: any) {
      this.logger.warn(`Failed to broadcast ticket event: ${rtErr.message}`);
    }

    return {
      success: true,
      message: 'Tiket pengaduan berhasil diteruskan ke NOC dan teknisi siaga',
      ticket,
    };
  }

  /**
   * Update ticket
   */
  async updateTicket(id: string, data: UpdateTicketDto) {
    const existingTicket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    if (data.technicianId) {
      const technician = await this.prisma.technician.findUnique({
        where: { id: data.technicianId },
      });
      if (!technician) {
        throw new BadRequestException('Teknisi tidak ditemukan');
      }
    }

    let status = data.status;
    if (status) {
      status = status === 'in-progress' ? 'in_progress' : status;
    }

    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: status || existingTicket.status,
        technicianId: data.technicianId,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    // Broadcast realtime event
    try {
      this.realtimeService.broadcastTicketUpdated({
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        customerName: ticket.customer?.name,
        technicianId: ticket.technicianId || undefined,
        technicianName: ticket.technician?.name || undefined,
      });
    } catch (rtErr: any) {
      this.logger.warn(`Failed to broadcast ticket event: ${rtErr.message}`);
    }

    return {
      message: 'Ticket berhasil diupdate',
      ticket,
    };
  }

  /**
   * Delete ticket
   */
  async deleteTicket(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    await this.prisma.ticket.delete({
      where: { id },
    });

    return {
      message: 'Ticket berhasil dihapus',
    };
  }

  /**
   * Get ticket statistics
   */
  async getTicketStatistics() {
    const [
      total,
      open,
      inProgress,
      resolved,
      closed,
      lowPriority,
      mediumPriority,
      highPriority,
      urgentPriority,
      unassigned,
    ] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: 'open' } }),
      this.prisma.ticket.count({ where: { OR: [{ status: 'in-progress' }, { status: 'in_progress' }] } }),
      this.prisma.ticket.count({ where: { status: 'resolved' } }),
      this.prisma.ticket.count({ where: { status: 'closed' } }),
      this.prisma.ticket.count({ where: { priority: 'low' } }),
      this.prisma.ticket.count({ where: { priority: 'medium' } }),
      this.prisma.ticket.count({ where: { priority: 'high' } }),
      this.prisma.ticket.count({ where: { priority: 'urgent' } }),
      this.prisma.ticket.count({ where: { technicianId: null } }),
    ]);

    return {
      total,
      byStatus: {
        open,
        inProgress,
        resolved,
        closed,
      },
      byPriority: {
        low: lowPriority,
        medium: mediumPriority,
        high: highPriority,
        urgent: urgentPriority,
      },
      unassigned,
    };
  }

  /**
   * Get tickets by customer
   */
  async getTicketsByCustomer(customerId: string) {
    let resolvedCustomerId = customerId;
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { id: customerId },
          { phone: customerId },
          { internetNumber: customerId },
        ],
      },
    });

    if (customer) {
      resolvedCustomerId = customer.id;
    }

    const tickets = await this.prisma.ticket.findMany({
      where: { customerId: resolvedCustomerId },
      orderBy: { createdAt: 'desc' },
      include: {
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (tickets.length === 0) {
      return this.prisma.ticket.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    }

    return tickets;
  }

  /**
   * Get tickets by technician
   */
  async getTicketsByTechnician(technicianId: string) {
    return this.prisma.ticket.findMany({
      where: { technicianId },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  /**
   * Assign ticket to technician
   */
  async assignTicket(id: string, data: AssignTicketDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    const technician = await this.prisma.technician.findUnique({
      where: { id: data.technicianId },
    });

    if (!technician) {
      throw new BadRequestException('Teknisi tidak ditemukan');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        technicianId: data.technicianId,
        status: ticket.status === 'open' ? 'in_progress' : ticket.status,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    try {
      this.realtimeService.broadcastTicketUpdated({
        ticketId: updatedTicket.id,
        ticketNumber: updatedTicket.ticketNumber,
        title: updatedTicket.title,
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        customerName: updatedTicket.customer?.name,
        technicianId: updatedTicket.technicianId || undefined,
        technicianName: updatedTicket.technician?.name || undefined,
      });
    } catch (rtErr: any) {
      this.logger.warn(`Failed to broadcast ticket event: ${rtErr.message}`);
    }

    return {
      message: 'Ticket berhasil diassign ke teknisi',
      ticket: updatedTicket,
    };
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(id: string, status: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    const normalizedStatus = status === 'in-progress' ? 'in_progress' : status;
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(normalizedStatus)) {
      throw new BadRequestException('Status tidak valid');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: { status: normalizedStatus },
      include: {
        customer: true,
        technician: true,
      },
    });

    try {
      this.realtimeService.broadcastTicketUpdated({
        ticketId: updatedTicket.id,
        ticketNumber: updatedTicket.ticketNumber,
        title: updatedTicket.title,
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        customerName: updatedTicket.customer?.name,
        technicianId: updatedTicket.technicianId || undefined,
        technicianName: updatedTicket.technician?.name || undefined,
      });
    } catch (rtErr: any) {
      this.logger.warn(`Failed to broadcast ticket event: ${rtErr.message}`);
    }

    return {
      message: 'Status ticket berhasil diupdate',
      ticket: updatedTicket,
    };
  }

  /**
   * Bulk create tickets
   */
  async bulkCreateTickets(tickets: CreateTicketDto[]) {
    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    for (const ticketData of tickets) {
      try {
        const result = await this.createTicket(ticketData);
        results.success.push(result.ticket);
      } catch (error: any) {
        results.failed.push({
          data: ticketData,
          error: error.message,
        });
      }
    }

    return {
      message: `Berhasil membuat ${results.success.length} ticket, gagal ${results.failed.length}`,
      results,
    };
  }

  /**
   * Get unassigned tickets
   */
  async getUnassignedTickets() {
    return this.prisma.ticket.findMany({
      where: { technicianId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  /**
   * Get available technicians
   */
  async getAvailableTechnicians() {
    const technicians = await this.prisma.technician.findMany({
      where: { status: 'available' },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            tickets: {
              where: {
                status: { in: ['open', 'in_progress', 'in-progress'] },
              },
            },
          },
        },
      },
    });

    return technicians.map((tech) => ({
      ...tech,
      activeTickets: tech._count.tickets,
    }));
  }
}
