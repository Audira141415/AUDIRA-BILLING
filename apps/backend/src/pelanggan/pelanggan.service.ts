import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PelangganService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        packages: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getStats() {
    const total = await this.prisma.customer.count();
    const active = await this.prisma.customer.count({
      where: { status: 'active' }
    });
    const suspended = await this.prisma.customer.count({
      where: { status: 'suspended' }
    });
    const inactive = await this.prisma.customer.count({
      where: { status: 'inactive' }
    });

    return { total, active, suspended, inactive };
  }

  async findOne(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        packages: true,
        services: true,
        invoices: true,
        tickets: true
      }
    });
  }

  async create(data: any) {
    return this.prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status || 'active'
      }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.customer.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.customer.delete({
      where: { id }
    });
  }
}
