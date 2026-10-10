import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  IsString, 
  IsInt, 
  IsOptional, 
  IsEnum, 
  Min, 
  IsNumber 
} from 'class-validator';

// DTOs
export class CreatePackageDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  speed: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;
}

export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  speed?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;
}

export class PackageQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(['active', 'inactive', 'all'])
  @IsOptional()
  status?: string = 'all';

  @IsEnum(['name', 'price', 'createdAt'])
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

@Injectable()
export class PackageService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all packages with pagination, search, and filters
   */
  async getPackages(query: PackageQueryDto) {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Search by name, speed, or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { speed: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [packages, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              services: true,
            },
          },
        },
      }),
      this.prisma.package.count({ where }),
    ]);

    // Get customer count for each package
    const packagesWithStats = await Promise.all(
      packages.map(async (pkg) => {
        const customerCount = await this.prisma.customer.count({
          where: {
            packages: {
              some: {
                id: pkg.id,
              },
            },
          },
        });

        return {
          ...pkg,
          customerCount,
          serviceCount: pkg._count.services,
          _count: undefined, // Remove _count from response
        };
      })
    );

    return {
      data: packagesWithStats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get package detail by ID
   */
  async getPackageDetail(packageId: string) {
    const packageData = await this.prisma.package.findUnique({
      where: { id: packageId },
      include: {
        services: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!packageData) {
      throw new NotFoundException('Package not found');
    }

    // Get statistics
    const customerCount = await this.prisma.customer.count({
      where: {
        packages: {
          some: {
            id: packageId,
          },
        },
      },
    });

    const activeCustomers = await this.prisma.customer.count({
      where: {
        packages: {
          some: {
            id: packageId,
          },
        },
        status: 'active',
      },
    });

    return {
      package: packageData,
      statistics: {
        totalCustomers: customerCount,
        activeCustomers,
        totalServices: packageData.services.length,
        monthlyRevenue: customerCount * packageData.price,
      },
    };
  }

  /**
   * Create new package
   */
  async createPackage(data: CreatePackageDto) {
    // Check if package name already exists
    const existingPackage = await this.prisma.package.findFirst({
      where: { name: data.name },
    });

    if (existingPackage) {
      throw new BadRequestException('Package name already exists');
    }

    const packageData = await this.prisma.package.create({
      data: {
        name: data.name,
        price: data.price,
        speed: data.speed,
        description: data.description,
        status: data.status || 'active',
      },
    });

    return packageData;
  }

  /**
   * Update package
   */
  async updatePackage(packageId: string, data: UpdatePackageDto) {
    // Check if package exists
    const packageData = await this.prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      throw new NotFoundException('Package not found');
    }

    // Check if new name conflicts with existing package
    if (data.name && data.name !== packageData.name) {
      const existingPackage = await this.prisma.package.findFirst({
        where: { 
          name: data.name,
          NOT: { id: packageId },
        },
      });

      if (existingPackage) {
        throw new BadRequestException('Package name already exists');
      }
    }

    // Build update data
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.speed !== undefined) updateData.speed = data.speed;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await this.prisma.package.update({
      where: { id: packageId },
      data: updateData,
    });

    return updated;
  }

  /**
   * Delete package (soft delete by setting status to inactive)
   */
  async deletePackage(packageId: string) {
    // Check if package exists
    const packageData = await this.prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      throw new NotFoundException('Package not found');
    }

    // Check if package has active customers
    const activeCustomers = await this.prisma.customer.count({
      where: {
        packages: {
          some: {
            id: packageId,
          },
        },
        status: 'active',
      },
    });

    if (activeCustomers > 0) {
      throw new BadRequestException(
        `Cannot delete package. ${activeCustomers} active customers are using this package.`
      );
    }

    // Soft delete by setting status to inactive
    await this.prisma.package.update({
      where: { id: packageId },
      data: { status: 'inactive' },
    });

    return { message: 'Package deleted successfully' };
  }

  /**
   * Get package statistics
   */
  async getPackageStatistics() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.package.count(),
      this.prisma.package.count({ where: { status: 'active' } }),
      this.prisma.package.count({ where: { status: 'inactive' } }),
    ]);

    // Get most popular packages by customer count
    const packages = await this.prisma.package.findMany({
      where: { status: 'active' },
    });

    const popularPackages = await Promise.all(
      packages.map(async (pkg) => {
        const customerCount = await this.prisma.customer.count({
          where: {
            packages: {
              some: {
                id: pkg.id,
              },
            },
            status: 'active',
          },
        });

        return {
          id: pkg.id,
          name: pkg.name,
          speed: pkg.speed,
          price: pkg.price,
          customerCount,
          revenue: customerCount * pkg.price,
        };
      })
    );

    // Sort by customer count
    popularPackages.sort((a, b) => b.customerCount - a.customerCount);

    // Calculate total revenue
    const totalRevenue = popularPackages.reduce((sum, pkg) => sum + pkg.revenue, 0);

    return {
      total,
      active,
      inactive,
      totalRevenue,
      popularPackages: popularPackages.slice(0, 5), // Top 5
    };
  }

  /**
   * Get available packages for customer selection
   */
  async getAvailablePackages() {
    const packages = await this.prisma.package.findMany({
      where: { status: 'active' },
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        price: true,
        speed: true,
        description: true,
      },
    });

    return packages;
  }

  /**
   * Bulk import packages
   */
  async bulkImportPackages(packagesData: CreatePackageDto[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (let i = 0; i < packagesData.length; i++) {
      try {
        await this.createPackage(packagesData[i]);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          data: packagesData[i],
          error: error.message,
        });
      }
    }

    return results;
  }
}
