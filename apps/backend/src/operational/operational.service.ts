import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperationalService {
  constructor(private prisma: PrismaService) {}

  async findAllTickets() {
    return this.prisma.ticket.findMany({
      include: {
        customer: true,
        technician: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllTechnicians() {
    return this.prisma.technician.findMany({
      include: {
        tickets: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getStats() {
    const tickets = await this.prisma.ticket.findMany();
    const technicians = await this.prisma.technician.findMany();

    return {
      openTickets: tickets.filter(t => t.status === 'open').length,
      inProgressTickets: tickets.filter(t => t.status === 'in-progress').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
      rejectedTickets: tickets.filter(t => t.status === 'rejected').length,
      availableTechnicians: technicians.filter(t => t.status === 'available').length,
      totalTechnicians: technicians.length
    };
  }

  async findTicket(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        customer: true,
        technician: true
      }
    });
  }

  async createTicket(data: any) {
    return this.prisma.ticket.create({
      data: {
        ticketNumber: data.ticketNumber,
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        status: 'open',
        customerId: data.customerId
      }
    });
  }

  async createTechnician(data: any) {
    return this.prisma.technician.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status || 'available',
        skills: data.skills || []
      }
    });
  }

  async updateTicket(id: string, data: any) {
    return this.prisma.ticket.update({
      where: { id },
      data
    });
  }

  async assignTicket(ticketId: string, technicianId: string) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        technicianId,
        status: 'in-progress'
      }
    });
  }
}
