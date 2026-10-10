import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OdpService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { location: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.oDP.findMany({
      where,
    });
  }

  async getStats() {
    const odps = await this.prisma.oDP.findMany();

    const totalPorts = odps.reduce((sum, odp) => sum + (odp.capacity || 0), 0);
    const usedPorts = odps.reduce((sum, odp) => sum + (odp.usedPorts || 0), 0);

    return {
      total: odps.length,
      totalPorts,
      usedPorts,
      availablePorts: totalPorts - usedPorts,
      utilization: totalPorts > 0 ? Math.round((usedPorts / totalPorts) * 100) : 0,
      activeOdps: odps.filter(odp => odp.status === 'active').length,
    };
  }

  async getTopology() {
    const odps = await this.prisma.oDP.findMany();

    return {
      nodes: odps.map(odp => ({
        id: odp.id,
        name: odp.name,
        type: 'ODP',
        location: odp.location,
        coordinates: odp.latitude && odp.longitude ? { lat: odp.latitude, lng: odp.longitude } : null,
        status: odp.status,
        totalPorts: odp.capacity,
        usedPorts: odp.usedPorts,
      })),
      connections: [], // No customer relations in current schema
    };
  }

  async findOne(id: string) {
    return this.prisma.oDP.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.oDP.create({
      data: {
        name: data.name,
        location: data.location,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        capacity: data.totalPorts || 16,
        status: data.status || 'active',
        description: data.notes,
        usedPorts: 0,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.oDP.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.oDP.delete({
      where: { id },
    });
  }

  async getOdpPorts(id: string) {
    const odp = await this.prisma.oDP.findUnique({
      where: { id },
    });

    if (!odp) {
      return { ports: [] };
    }

    const ports = Array.from({ length: odp.capacity || 16 }, (_, i) => ({
      portNumber: i + 1,
      status: i < odp.usedPorts ? 'USED' : 'AVAILABLE',
      customer: null,
    }));

    return { ports };
  }

  async assignPort(id: string, data: any) {
    const odp = await this.prisma.oDP.findUnique({ where: { id } });
    if (odp) {
      await this.prisma.oDP.update({
        where: { id },
        data: { usedPorts: odp.usedPorts + 1 },
      });
    }

    return { success: true, message: 'Port assigned successfully' };
  }
}
