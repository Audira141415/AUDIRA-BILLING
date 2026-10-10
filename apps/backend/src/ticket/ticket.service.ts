import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// DTOs
class CreateTicketDto {
  title: string;
  description?: string;
  priority?: string; // low, medium, high, urgent
  customerId?: string;
  technicianId?: string;
}

class UpdateTicketDto {
  title?: string;
  description?: string;
  priority?: string;
  status?: string; // open, in-progress, resolved, closed
  technicianId?: string;
}

class TicketQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  status?: string; // all, open, in-progress, resolved, closed
  priority?: string; // all, low, medium, high, urgent
  customerId?: string;
  technicianId?: string;
  sortBy?: string = 'createdAt';
  sortOrder?: 'asc' | 'desc' = 'desc';
}

class AssignTicketDto {
  technicianId: string;
}

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get tickets with pagination, search, and filters
   */
  async getTickets(query: TicketQueryDto) {
    const {
      page = 1,
      limit = 10,
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
    if (status && status !== 'all') {
      where.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
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
   * Create new ticket
   */
  async createTicket(data: CreateTicketDto) {
    // Validate customer if provided
    if (data.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: data.customerId },
      });
      if (!customer) {
        throw new BadRequestException('Customer tidak ditemukan');
      }
    }

    // Validate technician if provided
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
      const lastNumber = parseInt(lastTicket.ticketNumber.split('-')[2]);
      ticketNumber = `${prefix}${String(lastNumber + 1).padStart(5, '0')}`;
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
        customerId: data.customerId,
        technicianId: data.technicianId,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    return {
      message: 'Ticket berhasil dibuat',
      ticket,
    };
  }

  /**
   * Update ticket
   */
  async updateTicket(id: string, data: UpdateTicketDto) {
    // Check if ticket exists
    const existingTicket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    // Validate technician if provided
    if (data.technicianId) {
      const technician = await this.prisma.technician.findUnique({
        where: { id: data.technicianId },
      });
      if (!technician) {
        throw new BadRequestException('Teknisi tidak ditemukan');
      }
    }

    // Update ticket
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        technicianId: data.technicianId,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    return {
      message: 'Ticket berhasil diupdate',
      ticket,
    };
  }

  /**
   * Delete ticket
   */
  async deleteTicket(id: string) {
    // Check if ticket exists
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
      this.prisma.ticket.count({ where: { status: 'in-progress' } }),
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
    const tickets = await this.prisma.ticket.findMany({
      where: { customerId },
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

    return tickets;
  }

  /**
   * Get tickets by technician
   */
  async getTicketsByTechnician(technicianId: string) {
    const tickets = await this.prisma.ticket.findMany({
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

    return tickets;
  }

  /**
   * Assign ticket to technician
   */
  async assignTicket(id: string, data: AssignTicketDto) {
    // Check if ticket exists
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    // Validate technician
    const technician = await this.prisma.technician.findUnique({
      where: { id: data.technicianId },
    });

    if (!technician) {
      throw new BadRequestException('Teknisi tidak ditemukan');
    }

    // Update ticket with technician
    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        technicianId: data.technicianId,
        status: ticket.status === 'open' ? 'in-progress' : ticket.status,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    return {
      message: 'Ticket berhasil diassign ke teknisi',
      ticket: updatedTicket,
    };
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(id: string, status: string) {
    // Check if ticket exists
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    // Validate status
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Status tidak valid');
    }

    // Update ticket status
    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        technician: true,
      },
    });

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
      success: [],
      failed: [],
    };

    for (const ticketData of tickets) {
      try {
        const result = await this.createTicket(ticketData);
        results.success.push(result.ticket);
      } catch (error) {
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
    const tickets = await this.prisma.ticket.findMany({
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

    return tickets;
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
                status: { in: ['open', 'in-progress'] },
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
