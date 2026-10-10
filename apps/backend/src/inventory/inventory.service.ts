import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Create new equipment
  async createEquipment(data: {
    type: string;
    serialNumber?: string;
    brand?: string;
    model?: string;
    macAddress?: string;
    purchaseDate?: Date;
    warrantyUntil?: Date;
    vendor?: string;
    notes?: string;
    location?: string;
  }) {
    return await this.prisma.equipment.create({
      data: {
        ...data,
        status: 'available',
      },
    });
  }

  // Get all equipment
  async getAllEquipment(filters?: {
    type?: string;
    status?: string;
    customerId?: string;
  }) {
    const where: any = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    if (filters?.customerId) where.customerId = filters.customerId;

    return await this.prisma.equipment.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        maintenanceLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get equipment by ID
  async getEquipmentById(id: string) {
    return await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        customer: true,
        maintenanceLogs: {
          include: {
            technician: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Update equipment
  async updateEquipment(id: string, data: Partial<{
    type: string;
    serialNumber: string;
    brand: string;
    model: string;
    macAddress: string;
    status: string;
    purchaseDate: Date;
    warrantyUntil: Date;
    vendor: string;
    notes: string;
    location: string;
  }>) {
    return await this.prisma.equipment.update({
      where: { id },
      data,
    });
  }

  // Delete equipment
  async deleteEquipment(id: string) {
    // First delete all maintenance logs
    await this.prisma.maintenanceLog.deleteMany({
      where: { equipmentId: id },
    });

    return await this.prisma.equipment.delete({
      where: { id },
    });
  }

  // Assign equipment to customer
  async assignToCustomer(equipmentId: string, customerId: string) {
    return await this.prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        customerId,
        status: 'assigned',
      },
    });
  }

  // Unassign equipment from customer
  async unassignFromCustomer(equipmentId: string) {
    return await this.prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        customerId: null,
        status: 'available',
      },
    });
  }

  // Get equipment by customer
  async getEquipmentByCustomer(customerId: string) {
    return await this.prisma.equipment.findMany({
      where: { customerId },
      include: {
        maintenanceLogs: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });
  }

  // Get available equipment
  async getAvailableEquipment(type?: string) {
    const where: any = { status: 'available' };
    if (type) where.type = type;

    return await this.prisma.equipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get equipment statistics
  async getStatistics() {
    const total = await this.prisma.equipment.count();
    const available = await this.prisma.equipment.count({
      where: { status: 'available' },
    });
    const assigned = await this.prisma.equipment.count({
      where: { status: 'assigned' },
    });
    const maintenance = await this.prisma.equipment.count({
      where: { status: 'maintenance' },
    });
    const damaged = await this.prisma.equipment.count({
      where: { status: 'damaged' },
    });

    // Count by type
    const byType = await this.prisma.equipment.groupBy({
      by: ['type'],
      _count: true,
    });

    // Warranty expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringWarranty = await this.prisma.equipment.count({
      where: {
        warrantyUntil: {
          gte: new Date(),
          lte: thirtyDaysFromNow,
        },
      },
    });

    return {
      total,
      available,
      assigned,
      maintenance,
      damaged,
      byType,
      expiringWarranty,
    };
  }

  // Create maintenance log
  async createMaintenanceLog(data: {
    equipmentId: string;
    type: string;
    description: string;
    cost?: number;
    technicianId?: string;
    scheduledAt: Date;
    notes?: string;
  }) {
    // Update equipment status to maintenance
    await this.prisma.equipment.update({
      where: { id: data.equipmentId },
      data: { status: 'maintenance' },
    });

    return await this.prisma.maintenanceLog.create({
      data: {
        ...data,
        status: 'scheduled',
      },
    });
  }

  // Get maintenance logs
  async getMaintenanceLogs(filters?: {
    equipmentId?: string;
    status?: string;
    technicianId?: string;
  }) {
    const where: any = {};

    if (filters?.equipmentId) where.equipmentId = filters.equipmentId;
    if (filters?.status) where.status = filters.status;
    if (filters?.technicianId) where.technicianId = filters.technicianId;

    return await this.prisma.maintenanceLog.findMany({
      where,
      include: {
        equipment: {
          select: {
            id: true,
            type: true,
            serialNumber: true,
            brand: true,
            model: true,
          },
        },
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  // Update maintenance log
  async updateMaintenanceLog(id: string, data: Partial<{
    type: string;
    description: string;
    cost: number;
    technicianId: string;
    scheduledAt: Date;
    completedAt: Date;
    status: string;
    notes: string;
  }>) {
    const log = await this.prisma.maintenanceLog.update({
      where: { id },
      data,
    });

    // If maintenance is completed, update equipment status back to available
    if (data.status === 'completed') {
      await this.prisma.equipment.update({
        where: { id: log.equipmentId },
        data: { status: 'available' },
      });
    }

    return log;
  }

  // Complete maintenance
  async completeMaintenance(id: string) {
    const log = await this.prisma.maintenanceLog.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Update equipment status
    await this.prisma.equipment.update({
      where: { id: log.equipmentId },
      data: { status: 'available' },
    });

    return log;
  }

  // Get upcoming maintenance schedule
  async getUpcomingMaintenance() {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return await this.prisma.maintenanceLog.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: sevenDaysFromNow,
        },
        status: {
          in: ['scheduled', 'in-progress'],
        },
      },
      include: {
        equipment: true,
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  // Search equipment
  async searchEquipment(query: string) {
    return await this.prisma.equipment.findMany({
      where: {
        OR: [
          { type: { contains: query, mode: 'insensitive' } },
          { serialNumber: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
          { macAddress: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        customer: {
          select: { id: true, name: true },
        },
      },
      take: 20,
    });
  }

  // Bulk import equipment
  async bulkImport(equipmentList: Array<{
    type: string;
    serialNumber?: string;
    brand?: string;
    model?: string;
    macAddress?: string;
    purchaseDate?: Date;
    warrantyUntil?: Date;
    vendor?: string;
  }>) {
    const created = [];
    
    for (const equipment of equipmentList) {
      try {
        const result = await this.prisma.equipment.create({
          data: {
            ...equipment,
            status: 'available',
          },
        });
        created.push(result);
      } catch (error) {
        console.error('Failed to import equipment:', equipment, error);
      }
    }

    return {
      total: equipmentList.length,
      created: created.length,
      failed: equipmentList.length - created.length,
      items: created,
    };
  }
}
