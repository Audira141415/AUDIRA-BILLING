import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FieldServiceService {
  constructor(private prisma: PrismaService) {}

  // Create work order
  async createWorkOrder(data: {
    customerId: string;
    technicianId: string;
    type: string;
    priority?: string;
    title: string;
    description: string;
    scheduledAt: Date;
    location?: string;
    latitude?: number;
    longitude?: number;
  }) {
    return await this.prisma.workOrder.create({
      data: {
        ...data,
        status: 'pending',
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true, address: true },
        },
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Get all work orders
  async getAllWorkOrders(filters?: {
    status?: string;
    technicianId?: string;
    customerId?: string;
    type?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.technicianId) where.technicianId = filters.technicianId;
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.type) where.type = filters.type;
    if (filters?.priority) where.priority = filters.priority;

    if (filters?.startDate || filters?.endDate) {
      where.scheduledAt = {};
      if (filters.startDate) where.scheduledAt.gte = filters.startDate;
      if (filters.endDate) where.scheduledAt.lte = filters.endDate;
    }

    return await this.prisma.workOrder.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true, address: true },
        },
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  // Get work order by ID
  async getWorkOrderById(id: string) {
    return await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Update work order
  async updateWorkOrder(
    id: string,
    data: Partial<{
      type: string;
      priority: string;
      status: string;
      title: string;
      description: string;
      scheduledAt: Date;
      location: string;
      latitude: number;
      longitude: number;
      notes: string;
    }>,
  ) {
    return await this.prisma.workOrder.update({
      where: { id },
      data,
      include: {
        customer: true,
        technician: true,
      },
    });
  }

  // Assign technician to work order
  async assignTechnician(workOrderId: string, technicianId: string) {
    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        technicianId,
        status: 'assigned',
      },
    });
  }

  // Start work order (technician arrives on site)
  async startWorkOrder(workOrderId: string, latitude?: number, longitude?: number, checkInPhoto?: string) {
    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: 'in-progress',
        startedAt: new Date(),
        latitude,
        longitude,
        checkInPhoto, // Save foto selfie di field terpisah
      },
    });
  }

  // Upload check-in photo
  async uploadCheckInPhoto(workOrderId: string, photo: string) {
    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        checkInPhoto: photo
      }
    });
  }

  // Complete work order
  async completeWorkOrder(workOrderId: string, data: {
    notes?: string;
    signature?: string;
    photos?: string[];
  }) {
    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        ...data,
      },
    });
  }

  // Cancel work order
  async cancelWorkOrder(workOrderId: string, reason: string) {
    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: 'cancelled',
        notes: reason,
      },
    });
  }

  // Update work order status
  async updateStatus(workOrderId: string, status: string) {
    const data: any = { status };

    if (status === 'in-progress' && !data.startedAt) {
      data.startedAt = new Date();
    }

    if (status === 'completed' && !data.completedAt) {
      data.completedAt = new Date();
    }

    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data,
    });
  }

  // Upload photos
  async uploadPhotos(workOrderId: string, photoUrls: string[]) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    const existingPhotos = workOrder?.photos || [];
    const updatedPhotos = [...existingPhotos, ...photoUrls];

    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: { photos: updatedPhotos },
    });
  }

  // Add signature
  async addSignature(workOrderId: string, signatureBase64: string) {
    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: { signature: signatureBase64 },
    });
  }

  // Add customer feedback
  async addFeedback(workOrderId: string, rating: number, feedback: string) {
    return await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: { rating, feedback },
    });
  }

  // Get work orders by technician
  async getWorkOrdersByTechnician(technicianId: string, status?: string) {
    const where: any = { technicianId };
    if (status) where.status = status;

    return await this.prisma.workOrder.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true, address: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  // Get today's work orders for technician
  async getTodayWorkOrders(technicianId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.prisma.workOrder.findMany({
      where: {
        technicianId,
        scheduledAt: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['pending', 'assigned', 'on-route', 'in-progress'],
        },
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true, address: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  // Get statistics
  async getStatistics(technicianId?: string) {
    const where: any = technicianId ? { technicianId } : {};

    const total = await this.prisma.workOrder.count({ where });
    const pending = await this.prisma.workOrder.count({
      where: { ...where, status: 'pending' },
    });
    const assigned = await this.prisma.workOrder.count({
      where: { ...where, status: 'assigned' },
    });
    const inProgress = await this.prisma.workOrder.count({
      where: { ...where, status: 'in-progress' },
    });
    const completed = await this.prisma.workOrder.count({
      where: { ...where, status: 'completed' },
    });
    const cancelled = await this.prisma.workOrder.count({
      where: { ...where, status: 'cancelled' },
    });

    // Calculate average completion time
    const completedOrders = await this.prisma.workOrder.findMany({
      where: { ...where, status: 'completed', startedAt: { not: null } },
      select: { startedAt: true, completedAt: true },
    });

    let avgCompletionTime = 0;
    if (completedOrders.length > 0) {
      const totalTime = completedOrders.reduce((sum, order) => {
        if (order.startedAt && order.completedAt) {
          return sum + (order.completedAt.getTime() - order.startedAt.getTime());
        }
        return sum;
      }, 0);
      avgCompletionTime = Math.round(totalTime / completedOrders.length / 60000); // in minutes
    }

    // Get average rating
    const ratings = await this.prisma.workOrder.findMany({
      where: { ...where, rating: { not: null } },
      select: { rating: true },
    });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
        : 0;

    return {
      total,
      pending,
      assigned,
      inProgress,
      completed,
      cancelled,
      avgCompletionTime,
      avgRating: avgRating.toFixed(1),
    };
  }

  // Get upcoming scheduled work orders
  async getUpcomingWorkOrders(days: number = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.prisma.workOrder.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: futureDate,
        },
        status: {
          in: ['pending', 'assigned'],
        },
      },
      include: {
        customer: {
          select: { id: true, name: true, phone: true, address: true },
        },
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  // Calculate route optimization (simple nearest-neighbor algorithm)
  async optimizeRoute(workOrderIds: string[]) {
    const workOrders = await this.prisma.workOrder.findMany({
      where: { id: { in: workOrderIds } },
      include: {
        customer: {
          select: { name: true, address: true },
        },
      },
    });

    // Filter work orders with coordinates
    const ordersWithCoords = workOrders.filter((wo) => wo.latitude && wo.longitude);

    if (ordersWithCoords.length === 0) {
      return workOrders;
    }

    // Simple nearest-neighbor algorithm
    const optimized = [];
    let current = ordersWithCoords[0];
    optimized.push(current);
    const remaining = ordersWithCoords.slice(1);

    while (remaining.length > 0) {
      let nearest = remaining[0];
      let minDistance = this.calculateDistance(
        current.latitude!,
        current.longitude!,
        nearest.latitude!,
        nearest.longitude!,
      );

      for (let i = 1; i < remaining.length; i++) {
        const distance = this.calculateDistance(
          current.latitude!,
          current.longitude!,
          remaining[i].latitude!,
          remaining[i].longitude!,
        );

        if (distance < minDistance) {
          nearest = remaining[i];
          minDistance = distance;
        }
      }

      optimized.push(nearest);
      remaining.splice(remaining.indexOf(nearest), 1);
      current = nearest;
    }

    return optimized;
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get work order history for customer
  async getCustomerHistory(customerId: string) {
    return await this.prisma.workOrder.findMany({
      where: { customerId },
      include: {
        technician: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get check-in history
  async getCheckInHistory(date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const workOrders = await this.prisma.workOrder.findMany({
      where: {
        startedAt: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      include: {
        customer: {
          select: { id: true, name: true, address: true },
        },
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    return workOrders.map(wo => ({
      id: wo.id,
      workOrderId: wo.id,
      workOrderTitle: wo.title,
      technicianName: wo.technician?.name || 'Unknown',
      customerName: wo.customer?.name || 'Unknown',
      startedAt: wo.startedAt,
      completedAt: wo.completedAt,
      latitude: wo.latitude,
      longitude: wo.longitude,
      status: wo.status,
      checkInPhoto: wo.checkInPhoto, // Foto selfie check-in terpisah
    }));
  }
}
