import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTOs
export class CreateServiceDto {
  @IsString()
  name: string;

  @IsEnum(['pppoe', 'hotspot'])
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['pppoe', 'hotspot'])
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;
}

export class ServiceQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['pppoe', 'hotspot', 'all'])
  type?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended', 'all'])
  status?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsEnum(['name', 'createdAt', 'type'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string = 'desc';
}

export class BulkImportServiceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  services: CreateServiceDto[];
}

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async getServices(query: ServiceQueryDto) {
    const { page, limit, search, type, status, customerId, packageId, sortBy, sortOrder } = query;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Type filter
    if (type && type !== 'all') {
      where.type = type;
    }

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Customer filter
    if (customerId) {
      where.customerId = customerId;
    }

    // Package filter
    if (packageId) {
      where.packageId = packageId;
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          package: {
            select: {
              id: true,
              name: true,
              price: true,
              speed: true,
            },
          },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getServiceDetail(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            status: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            price: true,
            speed: true,
            description: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(data: CreateServiceDto) {
    // Validate customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validate package exists if provided
    if (data.packageId) {
      const packageExists = await this.prisma.package.findUnique({
        where: { id: data.packageId },
      });

      if (!packageExists) {
        throw new NotFoundException('Package not found');
      }
    }

    // Check if username already exists (if provided)
    if (data.username) {
      const existingService = await this.prisma.service.findUnique({
        where: { username: data.username },
      });

      if (existingService) {
        throw new BadRequestException('Username already exists');
      }
    }

    const service = await this.prisma.service.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        username: data.username,
        password: data.password,
        status: data.status || 'active',
        customerId: data.customerId,
        packageId: data.packageId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            speed: true,
          },
        },
      },
    });

    return service;
  }

  async updateService(id: string, data: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check if username is being changed and if new username already exists
    if (data.username && data.username !== service.username) {
      const existingService = await this.prisma.service.findUnique({
        where: { username: data.username },
      });

      if (existingService) {
        throw new BadRequestException('Username already exists');
      }
    }

    // Validate customer exists if being changed
    if (data.customerId && data.customerId !== service.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: data.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    // Validate package exists if being changed
    if (data.packageId !== undefined && data.packageId !== service.packageId) {
      if (data.packageId) {
        const packageExists = await this.prisma.package.findUnique({
          where: { id: data.packageId },
        });

        if (!packageExists) {
          throw new NotFoundException('Package not found');
        }
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.customerId !== undefined) updateData.customerId = data.customerId;
    if (data.packageId !== undefined) updateData.packageId = data.packageId;

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            speed: true,
          },
        },
      },
    });

    return updatedService;
  }

  async deleteService(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Soft delete - just change status to inactive
    const deletedService = await this.prisma.service.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return {
      message: 'Service deleted successfully (soft delete)',
      status: deletedService.status,
    };
  }

  async getServiceStatistics() {
    const [total, active, inactive, suspended, byType] = await Promise.all([
      this.prisma.service.count(),
      this.prisma.service.count({ where: { status: 'active' } }),
      this.prisma.service.count({ where: { status: 'inactive' } }),
      this.prisma.service.count({ where: { status: 'suspended' } }),
      this.prisma.service.groupBy({
        by: ['type'],
        _count: {
          id: true,
        },
      }),
    ]);

    const typeBreakdown = byType.reduce((acc, item) => {
      acc[item.type] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      suspended,
      pppoe: typeBreakdown['pppoe'] || 0,
      hotspot: typeBreakdown['hotspot'] || 0,
    };
  }

  async bulkImportServices(data: BulkImportServiceDto) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const serviceData of data.services) {
      try {
        await this.createService(serviceData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          service: serviceData.name,
          error: error.message,
        });
      }
    }

    return results;
  }

  async getServicesByCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const services = await this.prisma.service.findMany({
      where: { customerId },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            price: true,
            speed: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return services;
  }

  async getServicesByPackage(packageId: string) {
    const packageExists = await this.prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageExists) {
      throw new NotFoundException('Package not found');
    }

    const services = await this.prisma.service.findMany({
      where: { packageId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return services;
  }
}

