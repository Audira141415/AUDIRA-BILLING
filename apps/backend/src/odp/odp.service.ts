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

  /**
   * Ambil status fisik port 1..N dari ODP
   * Menginisialisasi port secara otomatis jika belum dibuat di database
   */
  async getOdpPorts(id: string) {
    const odp = await this.prisma.oDP.findUnique({
      where: { id },
      include: { ports: { orderBy: { portNumber: 'asc' } } },
    });

    if (!odp) {
      return { ports: [] };
    }

    const capacity = odp.capacity || 16;

    // Jika belum ada port di database, generate otomatis
    if (odp.ports.length === 0) {
      const portCreates = Array.from({ length: capacity }, (_, i) => ({
        odpId: id,
        portNumber: i + 1,
        status: 'AVAILABLE',
        opticalLoss: -18.5,
      }));
      await this.prisma.odpPort.createMany({ data: portCreates });
      
      const refreshed = await this.prisma.odpPort.findMany({
        where: { odpId: id },
        orderBy: { portNumber: 'asc' },
      });
      return { odp, ports: refreshed };
    }

    return { odp, ports: odp.ports };
  }

  /**
   * Alokasikan port fisik ODP ke pelanggan
   */
  async assignPort(
    odpId: string,
    portNumber: number,
    data: { customerId?: string; customerName?: string; opticalLoss?: number }
  ) {
    const port = await this.prisma.odpPort.upsert({
      where: { odpId_portNumber: { odpId, portNumber } },
      update: {
        status: 'USED',
        customerId: data.customerId || null,
        customerName: data.customerName || null,
        opticalLoss: data.opticalLoss || -19.2,
      },
      create: {
        odpId,
        portNumber,
        status: 'USED',
        customerId: data.customerId || null,
        customerName: data.customerName || null,
        opticalLoss: data.opticalLoss || -19.2,
      },
    });

    // Update counter usedPorts di ODP
    const usedCount = await this.prisma.odpPort.count({
      where: { odpId, status: 'USED' },
    });
    await this.prisma.oDP.update({
      where: { id: odpId },
      data: { usedPorts: usedCount },
    });

    return { success: true, message: `Port ${portNumber} berhasil dialokasikan`, port };
  }

  /**
   * Lepas port fisik ODP (menjadi KOSONG)
   */
  async releasePort(odpId: string, portNumber: number) {
    const port = await this.prisma.odpPort.update({
      where: { odpId_portNumber: { odpId, portNumber } },
      data: {
        status: 'AVAILABLE',
        customerId: null,
        customerName: null,
      },
    });

    const usedCount = await this.prisma.odpPort.count({
      where: { odpId, status: 'USED' },
    });
    await this.prisma.oDP.update({
      where: { id: odpId },
      data: { usedPorts: usedCount },
    });

    return { success: true, message: `Port ${portNumber} berhasil dilepas dan kembali KOSONG`, port };
  }

  /**
   * Cari ODP terdekat dengan port kosong berdasarkan koordinat GPS
   */
  async findNearest(latitude: number, longitude: number, maxRadiusMeter = 500) {
    const odps = await this.prisma.oDP.findMany({
      where: {
        status: 'active',
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        _count: {
          select: { ports: { where: { status: 'AVAILABLE' } } },
        },
      },
    });

    const results = odps
      .map((odp) => {
        // Haversine formula calculation
        const R = 6371e3; // Earth radius in meters
        const phi1 = (latitude * Math.PI) / 180;
        const phi2 = ((odp.latitude as number) * Math.PI) / 180;
        const deltaPhi = (((odp.latitude as number) - latitude) * Math.PI) / 180;
        const deltaLambda = (((odp.longitude as number) - longitude) * Math.PI) / 180;

        const a =
          Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
          Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMeter = Math.round(R * c);

        return {
          ...odp,
          distanceMeter,
          availablePorts: odp.capacity - odp.usedPorts,
        };
      })
      .filter((odp) => odp.distanceMeter <= maxRadiusMeter)
      .sort((a, b) => a.distanceMeter - b.distanceMeter);

    return results;
  }
}
