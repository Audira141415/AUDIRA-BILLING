import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  async getAll(employeeId?: string, period?: string) {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (period) where.period = period;

    return this.prisma.performance.findMany({
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
      orderBy: { period: 'desc' },
    });
  }

  async getStats() {
    const total = await this.prisma.performance.count();
    const draft = await this.prisma.performance.count({ where: { status: 'draft' } });
    const submitted = await this.prisma.performance.count({ where: { status: 'submitted' } });
    const approved = await this.prisma.performance.count({ where: { status: 'approved' } });

    const avgScores = await this.prisma.performance.aggregate({
      where: { status: 'approved' },
      _avg: {
        productivity: true,
        quality: true,
        attendance: true,
        discipline: true,
        teamwork: true,
        initiative: true,
        overallScore: true,
      },
    });

    return {
      total,
      draft,
      submitted,
      approved,
      averageScores: {
        productivity: avgScores._avg.productivity || 0,
        quality: avgScores._avg.quality || 0,
        attendance: avgScores._avg.attendance || 0,
        discipline: avgScores._avg.discipline || 0,
        teamwork: avgScores._avg.teamwork || 0,
        initiative: avgScores._avg.initiative || 0,
        overall: avgScores._avg.overallScore || 0,
      },
    };
  }

  async getDashboard(employeeId: string) {
    const reviews = await this.prisma.performance.findMany({
      where: { employeeId, status: 'approved' },
      orderBy: { period: 'desc' },
      take: 12, // Last 12 reviews
    });

    const latestReview = reviews[0];
    
    // Calculate trends
    const scoreTrend = reviews.map(r => ({
      period: r.period,
      score: r.overallScore,
    }));

    return {
      employee: await this.prisma.employee.findUnique({
        where: { id: employeeId },
        select: {
          fullName: true,
          employeeNumber: true,
          department: true,
          position: true,
        },
      }),
      latestReview,
      scoreTrend,
      totalReviews: reviews.length,
    };
  }

  async getOne(id: string) {
    return this.prisma.performance.findUnique({
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
    // Calculate overall score
    const scores = [
      data.productivity,
      data.quality,
      data.attendance,
      data.discipline,
      data.teamwork,
      data.initiative,
    ].filter(s => s !== null && s !== undefined);

    const overallScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

    return this.prisma.performance.create({
      data: {
        ...data,
        overallScore,
      },
      include: {
        employee: true,
      },
    });
  }

  async update(id: string, data: any) {
    // Recalculate overall score if metrics updated
    let overallScore = undefined;
    if (data.productivity || data.quality || data.attendance || 
        data.discipline || data.teamwork || data.initiative) {
      const existing = await this.prisma.performance.findUnique({ where: { id } });
      const scores = [
        data.productivity ?? existing.productivity,
        data.quality ?? existing.quality,
        data.attendance ?? existing.attendance,
        data.discipline ?? existing.discipline,
        data.teamwork ?? existing.teamwork,
        data.initiative ?? existing.initiative,
      ].filter(s => s !== null && s !== undefined);

      overallScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null;
    }

    return this.prisma.performance.update({
      where: { id },
      data: {
        ...data,
        overallScore,
      },
      include: {
        employee: true,
      },
    });
  }

  async submit(id: string) {
    return this.prisma.performance.update({
      where: { id },
      data: {
        status: 'submitted',
      },
      include: {
        employee: true,
      },
    });
  }

  async approve(id: string, data: any) {
    return this.prisma.performance.update({
      where: { id },
      data: {
        status: 'approved',
        reviewedBy: data.reviewedBy,
        reviewedAt: new Date(),
      },
      include: {
        employee: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.performance.delete({
      where: { id },
    });
  }
}
