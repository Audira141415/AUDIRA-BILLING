import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async getAll(status?: string) {
    const where = status ? { status } : {};
    
    return this.prisma.employee.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const total = await this.prisma.employee.count();
    const active = await this.prisma.employee.count({ where: { status: 'active' } });
    const inactive = await this.prisma.employee.count({ where: { status: 'inactive' } });
    const resigned = await this.prisma.employee.count({ where: { status: 'resigned' } });

    // Count by department
    const departments = await this.prisma.employee.groupBy({
      by: ['department'],
      _count: true,
      where: { status: 'active' },
    });

    // Count by employment type
    const employmentTypes = await this.prisma.employee.groupBy({
      by: ['employmentType'],
      _count: true,
      where: { status: 'active' },
    });

    return {
      total,
      active,
      inactive,
      resigned,
      byDepartment: departments.map(d => ({
        department: d.department,
        count: d._count,
      })),
      byEmploymentType: employmentTypes.map(t => ({
        type: t.employmentType,
        count: t._count,
      })),
    };
  }

  async getOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            phone: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    // Note: In real implementation, you should create User first
    // This is simplified version
    return this.prisma.employee.create({
      data: {
        ...data,
        joinDate: new Date(data.joinDate),
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.employee.update({
      where: { id },
      data: {
        ...data,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        user: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }

  async getProfile(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            phone: true,
          },
        },
        salaries: {
          orderBy: { period: 'desc' },
          take: 12, // Last 12 months
        },
        leaves: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        schedules: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
          orderBy: { date: 'desc' },
        },
        performances: {
          orderBy: { period: 'desc' },
          take: 4, // Last 4 reviews
        },
        resignations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return employee;
  }
}
