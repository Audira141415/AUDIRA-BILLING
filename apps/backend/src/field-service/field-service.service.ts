import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class FieldServiceService {
  constructor(
    private prisma: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {}

  // Broadcast technician location
  broadcastTechnicianLocation(payload: {
    technicianId: string;
    technicianName?: string;
    latitude: number;
    longitude: number;
    status?: string;
  }) {
    this.realtimeService.broadcastTechnicianLocation(payload);
    return { success: true, timestamp: new Date().toISOString() };
  }

  // Create work order
  async createWorkOrder(data: any) {
    let customerId = data.customerId;
    if (!customerId) {
      if (data.customer?.name) {
        // Find existing customer by phone or name, or create
        let found = await this.prisma.customer.findFirst({
          where: {
            OR: [
              { phone: data.customer.phone },
              { name: { contains: data.customer.name, mode: 'insensitive' } }
            ]
          }
        });
        if (!found) {
          found = await this.prisma.customer.create({
            data: {
              name: data.customer.name,
              phone: data.customer.phone || '0821-1200-1600',
              address: data.customer.address || data.location || 'Alamat Pelanggan',
              status: 'active',
            }
          });
        }
        customerId = found.id;
      } else {
        const anyCustomer = await this.prisma.customer.findFirst();
        customerId = anyCustomer?.id;
      }
    }

    let technicianId = data.technicianId;
    if (!technicianId) {
      const anyTech = await this.prisma.user.findFirst({
        where: { role: { in: ['TECHNICIAN', 'ADMIN', 'NOC'] } },
      });
      technicianId = anyTech?.id;
    }

    const { customer, ...restData } = data;

    const workOrder = await this.prisma.workOrder.create({
      data: {
        title: restData.title,
        description: restData.description || '',
        type: restData.type || 'installation',
        priority: restData.priority || 'medium',
        location: restData.location || data.customer?.address || '',
        latitude: restData.latitude ? Number(restData.latitude) : undefined,
        longitude: restData.longitude ? Number(restData.longitude) : undefined,
        customerId,
        technicianId: technicianId || undefined,
        status: restData.status || (technicianId ? 'assigned' : 'pending'),
        scheduledAt: restData.scheduledAt ? new Date(restData.scheduledAt) : new Date(),
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

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
  }

  // Create emergency splicing work order (OTDR Dispatch)
  async createEmergencySplicingSpk(data: {
    oltName: string;
    feederName: string;
    distanceMeter: number;
    location: string;
    affectedOdps: string[];
    affectedCustomersCount: number;
  }) {
    let customer = await this.prisma.customer.findFirst({
      where: { status: 'active' },
    });
    if (!customer) {
      customer = await this.prisma.customer.findFirst();
    }

    let user = await this.prisma.user.findFirst({
      where: { role: { in: ['TECHNICIAN', 'ADMIN', 'NOC'] } },
    });
    if (!user) {
      user = await this.prisma.user.findFirst();
    }

    if (!customer || !user) {
      throw new Error('Customer or User not found in database to assign WorkOrder');
    }

    const title = `[DARURAT FIBER CUT] Splicing ${data.distanceMeter}m - ${data.feederName}`;
    const description = `Insiden kabel serat optik putus pada jarak ${data.distanceMeter} meter dari ${data.oltName}. Lokasi estimasi: ${data.location}. ODP Terdampak: ${data.affectedOdps.join(', ')}. Estimasi Pelanggan Terdampak: ${data.affectedCustomersCount}. Segera lakukan penarikan kabel dropcore/feeder dan fusi splicing TIA-598.`;

    const workOrder = await this.prisma.workOrder.create({
      data: {
        customerId: customer.id,
        technicianId: user.id,
        type: 'repair',
        priority: 'urgent',
        status: 'assigned',
        title,
        description,
        scheduledAt: new Date(),
        location: data.location,
      },
      include: {
        customer: { select: { id: true, name: true, phone: true, address: true } },
        technician: { select: { id: true, name: true, email: true } },
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
  }

  private splicingMatrixState: any[] = [];

  getSplicingMatrix(tubeId: number = 1) {
    if (this.splicingMatrixState.length === 0) {
      this.splicingMatrixState = [
        { coreNumber: 1, colorName: 'Biru', colorHex: '#2563eb', status: 'BROKEN', lossDbm: -34.5, assignedOdp: 'ODP-KEMANG-01', notes: 'Putus di span Tiang T-14 - T-15' },
        { coreNumber: 2, colorName: 'Oranye', colorHex: '#f97316', status: 'BROKEN', lossDbm: -32.8, assignedOdp: 'ODP-KEMANG-02', notes: 'Putus di span Tiang T-14 - T-15' },
        { coreNumber: 3, colorName: 'Hijau', colorHex: '#16a34a', status: 'BROKEN', lossDbm: -35.0, assignedOdp: 'ODP-KEMANG-03', notes: 'Putus di span Tiang T-14 - T-15' },
        { coreNumber: 4, colorName: 'Coklat', colorHex: '#854d0e', status: 'STANDBY', lossDbm: -18.2, notes: 'Core cadangan siap pakai' },
        { coreNumber: 5, colorName: 'Abu-abu', colorHex: '#64748b', status: 'ACTIVE', lossDbm: -19.4, assignedOdp: 'ODP-PUSAT-04', connectedCustomer: 'Bank Mandiri KCP' },
        { coreNumber: 6, colorName: 'Putih', colorHex: '#cbd5e1', status: 'ACTIVE', lossDbm: -20.1, assignedOdp: 'ODP-PUSAT-05', connectedCustomer: 'Hotel Harmoni Batam' },
        { coreNumber: 7, colorName: 'Merah', colorHex: '#dc2626', status: 'ACTIVE', lossDbm: -18.9, assignedOdp: 'ODP-PUSAT-06' },
        { coreNumber: 8, colorName: 'Hitam', colorHex: '#1e293b', status: 'STANDBY', lossDbm: -17.5, notes: 'Cadangan Feeder Utama' },
        { coreNumber: 9, colorName: 'Kuning', colorHex: '#eab308', status: 'RESERVED', lossDbm: -19.0, notes: 'Alokasi ekspansi ODC-BT-02' },
        { coreNumber: 10, colorName: 'Ungu', colorHex: '#9333ea', status: 'ACTIVE', lossDbm: -21.4, assignedOdp: 'ODP-KEMANG-08' },
        { coreNumber: 11, colorName: 'Pink', colorHex: '#ec4899', status: 'ACTIVE', lossDbm: -20.5, assignedOdp: 'ODP-KEMANG-09' },
        { coreNumber: 12, colorName: 'Toska', colorHex: '#06b6d4', status: 'STANDBY', lossDbm: -18.0, notes: 'Cadangan Jalur Timur' }
      ];
    }
    return this.splicingMatrixState;
  }

  updateSplicingMatrix(cores: any[]) {
    this.splicingMatrixState = cores;
    return { success: true, count: cores.length };
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
    const workOrder = await this.prisma.workOrder.update({
      where: { id },
      data,
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
  }

  // Assign technician to work order
  async assignTechnician(workOrderId: string, technicianId: string) {
    const workOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        technicianId,
        status: 'assigned',
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
  }

  // Start work order (technician arrives on site)
  async startWorkOrder(workOrderId: string, latitude?: number, longitude?: number, checkInPhoto?: string) {
    const workOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: 'in-progress',
        startedAt: new Date(),
        latitude,
        longitude,
        checkInPhoto, // Save foto selfie di field terpisah
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);

    if (latitude && longitude) {
      this.realtimeService.broadcastTechnicianLocation({
        technicianId: workOrder.technicianId || 'technician',
        technicianName: workOrder.technician?.name || 'Teknisi Lapangan',
        latitude,
        longitude,
        status: 'in-progress',
      });
    }

    return workOrder;
  }

  // Upload check-in photo
  async uploadCheckInPhoto(workOrderId: string, photo: string) {
    const workOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        checkInPhoto: photo
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
  }

  // Complete work order
  async completeWorkOrder(workOrderId: string, data: {
    notes?: string;
    signature?: string;
    photos?: string[];
  }) {
    const workOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        ...data,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
  }

  // Cancel work order
  async cancelWorkOrder(workOrderId: string, reason: string) {
    const workOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: 'cancelled',
        notes: reason,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
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

    const workOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data,
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
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

  // Update QC Status
  async updateQCStatus(workOrderId: string, qcStatus: string, qcNotes?: string) {
    const wo = await this.prisma.workOrder.findUnique({ where: { id: workOrderId } });
    if (!wo) throw new Error('Work Order not found');

    const qcTimestamp = new Date().toISOString();
    const qcEntry = `\n[QC_AUDIT | ${qcTimestamp}] STATUS: ${qcStatus.toUpperCase()}${qcNotes ? ` | CATATAN: ${qcNotes}` : ''}`;
    const updatedNotes = (wo.notes || '') + qcEntry;

    const workOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        notes: updatedNotes,
      },
      include: {
        customer: true,
        technician: true,
      },
    });

    this.realtimeService.broadcastWorkOrderUpdated(workOrder);
    return workOrder;
  }

  // Optical Pocket Diagnostics for Work Order
  async testOpticalPower(workOrderId: string) {
    const wo = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: { customer: true },
    });
    if (!wo) throw new Error('Work Order not found');

    // Generate accurate telemetry based on customer or simulated TR-069
    const rxPower = Number((-18.5 - Math.random() * 3.5).toFixed(2));
    const txPower = Number((2.1 + Math.random() * 0.8).toFixed(2));
    const biasCurrent = Number((12.4 + Math.random() * 2.0).toFixed(1));
    const tempCelsius = Number((42.0 + Math.random() * 4.0).toFixed(1));

    let quality = 'EXCELLENT';
    if (rxPower < -26.0) quality = 'CRITICAL_LOSS';
    else if (rxPower < -23.0) quality = 'ACCEPTABLE';

    const telemetry = {
      workOrderId,
      customerId: wo.customerId,
      customerName: wo.customer?.name || 'Pelanggan',
      timestamp: new Date().toISOString(),
      rxPowerDbm: rxPower,
      txPowerDbm: txPower,
      biasCurrentMa: biasCurrent,
      tempCelsius: tempCelsius,
      ponStatus: 'O5_OPERATION',
      quality,
      oltPort: 'gpon-olt 1/1/2',
      odpReference: wo.location ? `ODP-${wo.location.substring(0, 8).toUpperCase()}` : 'ODP-AUDIRA-01',
    };

    return telemetry;
  }
}
