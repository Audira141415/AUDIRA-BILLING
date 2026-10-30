import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // Check-in (masuk kerja)
  async checkIn(userId: string, checkInPhoto?: string, latitude?: number, longitude?: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user with employee relation
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true },
    });

    let effectiveUserId = userId;
    let effectiveEmployeeId = user?.employee?.id;

    if (!user) {
      const emp = await this.prisma.employee.findUnique({
        where: { id: userId },
        include: { user: true },
      });
      if (emp && emp.user) {
        user = emp.user as any;
        effectiveUserId = emp.user.id;
        effectiveEmployeeId = emp.id;
      } else {
        throw new Error('User atau Karyawan tidak ditemukan');
      }
    }

    // Check if already checked in today
    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        OR: [
          { userId: effectiveUserId },
          ...(effectiveEmployeeId ? [{ employeeId: effectiveEmployeeId }] : []),
        ],
        date: today,
      },
    });

    if (existingAttendance) {
      if (existingAttendance.checkInTime) {
        throw new Error('Anda sudah check-in hari ini');
      }
      // Update existing record
      return await this.prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkInTime: new Date(),
          checkInPhoto,
          checkInLat: latitude,
          checkInLong: longitude,
          status: await this.determineStatus(new Date(), effectiveEmployeeId),
        },
      });
    }

    // Create new attendance record
    return await this.prisma.attendance.create({
      data: {
        userId: effectiveUserId,
        employeeId: effectiveEmployeeId,
        date: today,
        checkInTime: new Date(),
        checkInPhoto,
        checkInLat: latitude,
        checkInLong: longitude,
        status: await this.determineStatus(new Date(), effectiveEmployeeId),
      },
    });
  }

  // Check-out (pulang kerja)
  async checkOut(userId: string, checkOutPhoto?: string, latitude?: number, longitude?: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        OR: [
          { userId },
          { employeeId: userId },
        ],
        date: today,
      },
    });

    if (!attendance) {
      throw new Error('Anda belum check-in hari ini');
    }

    if (attendance.checkOutTime) {
      throw new Error('Anda sudah check-out hari ini');
    }

    const checkOutTime = new Date();
    const workDuration = attendance.checkInTime
      ? Math.floor((checkOutTime.getTime() - attendance.checkInTime.getTime()) / 60000) // minutes
      : 0;

    return await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime,
        checkOutPhoto,
        checkOutLat: latitude,
        checkOutLong: longitude,
        workDuration,
      },
    });
  }

  // Get attendance by date
  async getAttendanceByDate(date: string) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
          },
        },
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
      orderBy: { checkInTime: 'asc' },
    });
  }

  // Get today's attendance
  async getTodayAttendance() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
          },
        },
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
      orderBy: { checkInTime: 'asc' },
    });
  }

  // Get user attendance history
  async getUserAttendance(userId: string, startDate?: string, endDate?: string) {
    const where: any = {
      OR: [
        { userId },
        { employeeId: userId },
      ],
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        where.date.lt = end;
      }
    }

    return await this.prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  // Get attendance status for today
  async getAttendanceStatus(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        OR: [
          { userId },
          { employeeId: userId },
        ],
        date: today,
      },
    });

    return {
      hasCheckedIn: !!attendance?.checkInTime,
      hasCheckedOut: !!attendance?.checkOutTime,
      checkInTime: attendance?.checkInTime || null,
      checkOutTime: attendance?.checkOutTime || null,
      workDuration: attendance?.workDuration || 0,
      status: attendance?.status || 'absent',
    };
  }

  // Get attendance statistics
  async getAttendanceStats(date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    });

    const totalEmployees = await this.prisma.user.count({
      where: {
        role: {
          in: ['TECHNICIAN', 'NOC', 'CS', 'BILLING', 'ADMIN'],
        },
      },
    });

    const present = attendances.filter(a => a.checkInTime).length;
    const late = attendances.filter(a => a.status === 'late').length;
    const absent = totalEmployees - present;
    const checkedOut = attendances.filter(a => a.checkOutTime).length;
    const stillWorking = present - checkedOut;

    return {
      totalEmployees,
      present,
      late,
      absent,
      checkedOut,
      stillWorking,
      attendanceRate: totalEmployees > 0 ? Math.round((present / totalEmployees) * 100) : 0,
    };
  }

  // Update attendance status (admin only)
  async updateStatus(id: string, status: string): Promise<any> {
    // Validate status
    const validStatuses = ['present', 'late', 'leave', 'sick'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be: present, late, leave, or sick');
    }

    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    return await this.prisma.attendance.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
          },
        },
      },
    });
  }

  // Helper: Determine attendance status based on check-in time
  private async determineStatus(checkInTime: Date, employeeId?: string): Promise<string> {
    // If no employeeId, use default logic (8:30 AM threshold)
    if (!employeeId) {
      const hour = checkInTime.getHours();
      const minute = checkInTime.getMinutes();
      if (hour > 8 || (hour === 8 && minute > 30)) {
        return 'late';
      }
      return 'present';
    }

    // Check work schedule for this employee
    const today = new Date(checkInTime);
    today.setHours(0, 0, 0, 0);

    const schedule = await this.prisma.workSchedule.findFirst({
      where: {
        employeeId,
        date: today,
      },
    });

    if (!schedule || !schedule.startTime) {
      // No schedule found, use default logic
      const hour = checkInTime.getHours();
      const minute = checkInTime.getMinutes();
      if (hour > 8 || (hour === 8 && minute > 30)) {
        return 'late';
      }
      return 'present';
    }

    // Parse scheduled start time (HH:mm format)
    const [schedHour, schedMin] = schedule.startTime.split(':').map(Number);
    const scheduledTime = new Date(checkInTime);
    scheduledTime.setHours(schedHour, schedMin, 0, 0);

    // Calculate difference in minutes
    const diffMinutes = (checkInTime.getTime() - scheduledTime.getTime()) / 1000 / 60;

    // Late if more than 15 minutes after scheduled time
    if (diffMinutes > 15) {
      return 'late';
    }

    return 'present';
  }
}
