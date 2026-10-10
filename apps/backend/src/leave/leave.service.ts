import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async getAll(status?: string, employeeId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;

    return this.prisma.leave.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeNumber: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const total = await this.prisma.leave.count();
    const pending = await this.prisma.leave.count({ where: { status: 'pending' } });
    const approved = await this.prisma.leave.count({ where: { status: 'approved' } });
    const rejected = await this.prisma.leave.count({ where: { status: 'rejected' } });

    // Count by leave type
    const byType = await this.prisma.leave.groupBy({
      by: ['leaveType'],
      _count: true,
      _sum: { totalDays: true },
    });

    return {
      total,
      pending,
      approved,
      rejected,
      byType: byType.map(t => ({
        type: t.leaveType,
        count: t._count,
        totalDays: t._sum.totalDays,
      })),
    };
  }

  async getOne(id: string) {
    return this.prisma.leave.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: any) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return this.prisma.leave.create({
      data: {
        ...data,
        startDate,
        endDate,
        totalDays,
      },
      include: {
        employee: true,
      },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      updateData.totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    return this.prisma.leave.update({
      where: { id },
      data: updateData,
      include: {
        employee: true,
      },
    });
  }

  async approve(id: string, data: any) {
    return this.prisma.leave.update({
      where: { id },
      data: {
        status: 'approved',
        approvedBy: data.approvedBy,
        approvedAt: new Date(),
      },
      include: {
        employee: true,
      },
    });
  }

  async reject(id: string, data: any) {
    return this.prisma.leave.update({
      where: { id },
      data: {
        status: 'rejected',
        approvedBy: data.approvedBy,
        approvedAt: new Date(),
        rejectedReason: data.reason,
      },
      include: {
        employee: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.leave.delete({
      where: { id },
    });
  }
}
