import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  async getAll(period?: string, status?: string) {
    const where: any = {};
    if (period) where.period = period;
    if (status) where.status = status;

    return this.prisma.salary.findMany({
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

  async getStats(period?: string) {
    const where = period ? { period } : {};

    const total = await this.prisma.salary.count({ where });
    const pending = await this.prisma.salary.count({
      where: { ...where, status: 'pending' },
    });
    const paid = await this.prisma.salary.count({
      where: { ...where, status: 'paid' },
    });

    const totalAmount = await this.prisma.salary.aggregate({
      where,
      _sum: { totalSalary: true },
    });

    const paidAmount = await this.prisma.salary.aggregate({
      where: { ...where, status: 'paid' },
      _sum: { totalSalary: true },
    });

    const pendingAmount = await this.prisma.salary.aggregate({
      where: { ...where, status: 'pending' },
      _sum: { totalSalary: true },
    });

    return {
      total,
      pending,
      paid,
      totalAmount: totalAmount._sum.totalSalary || 0,
      paidAmount: paidAmount._sum.totalSalary || 0,
      pendingAmount: pendingAmount._sum.totalSalary || 0,
    };
  }

  async getByEmployee(employeeId: string) {
    return this.prisma.salary.findMany({
      where: { employeeId },
      orderBy: { period: 'desc' },
    });
  }

  async getOne(id: string) {
    return this.prisma.salary.findUnique({
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
    const { baseSalary, allowances, overtime, bonus, deductions } = data;
    const totalSalary = baseSalary + allowances + overtime + bonus - deductions;

    return this.prisma.salary.create({
      data: {
        ...data,
        totalSalary,
      },
      include: {
        employee: true,
      },
    });
  }

  async createBulk(data: { period: string; employeeIds: string[] }) {
    const { period, employeeIds } = data;
    
    // Get all active employees
    const employees = await this.prisma.employee.findMany({
      where: {
        id: { in: employeeIds },
        status: 'active',
      },
    });

    // Create salary records for each employee
    const salaryRecords = await Promise.all(
      employees.map((employee) => {
        const totalSalary = employee.baseSalary;
        return this.prisma.salary.create({
          data: {
            employeeId: employee.id,
            period,
            baseSalary: employee.baseSalary,
            allowances: 0,
            overtime: 0,
            bonus: 0,
            deductions: 0,
            totalSalary,
            status: 'pending',
          },
        });
      }),
    );

    return {
      created: salaryRecords.length,
      records: salaryRecords,
    };
  }

  async update(id: string, data: any) {
    const { baseSalary, allowances, overtime, bonus, deductions } = data;
    const totalSalary = baseSalary + allowances + overtime + bonus - deductions;

    return this.prisma.salary.update({
      where: { id },
      data: {
        ...data,
        totalSalary,
      },
      include: {
        employee: true,
      },
    });
  }

  async markAsPaid(id: string, data: any) {
    return this.prisma.salary.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: new Date(),
        paymentMethod: data.paymentMethod,
        paymentRef: data.paymentRef,
      },
      include: {
        employee: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.salary.delete({
      where: { id },
    });
  }
}
