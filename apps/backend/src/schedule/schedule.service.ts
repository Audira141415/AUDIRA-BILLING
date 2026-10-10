import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async getAll(employeeId?: string, startDate?: string, endDate?: string) {
    const where: any = {};
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const schedules = await this.prisma.workSchedule.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeNumber: true,
            department: true,
            position: true,
            userId: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Manually fetch attendance for each schedule
    const schedulesWithAttendance = await Promise.all(
      schedules.map(async (schedule) => {
        const attendance = await this.prisma.attendance.findFirst({
          where: {
            employeeId: schedule.employeeId,
            date: schedule.date,
          },
          select: {
            id: true,
            checkInTime: true,
            checkOutTime: true,
            status: true,
            workDuration: true,
          },
        });

        return {
          ...schedule,
          attendance,
        };
      }),
    );

    return schedulesWithAttendance;
  }

  async getStats(date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    
    const total = await this.prisma.workSchedule.count({
      where: { date: targetDate },
    });

    const byShift = await this.prisma.workSchedule.groupBy({
      by: ['shiftType'],
      where: { date: targetDate },
      _count: true,
    });

    return {
      date: targetDate,
      total,
      byShift: byShift.map(s => ({
        shift: s.shiftType,
        count: s._count,
      })),
    };
  }

  async getOne(id: string) {
    return this.prisma.workSchedule.findUnique({
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
    return this.prisma.workSchedule.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        employee: true,
      },
    });
  }

  async createBulk(data: { date: string; schedules: any[] }) {
    const { date, schedules } = data;
    const targetDate = new Date(date);

    const created = await Promise.all(
      schedules.map((schedule) =>
        this.prisma.workSchedule.create({
          data: {
            employeeId: schedule.employeeId,
            date: targetDate,
            shiftType: schedule.shiftType,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            location: schedule.location,
            notes: schedule.notes,
          },
        }),
      ),
    );

    return {
      created: created.length,
      records: created,
    };
  }

  async update(id: string, data: any) {
    return this.prisma.workSchedule.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: {
        employee: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.workSchedule.delete({
      where: { id },
    });
  }
}
