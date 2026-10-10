import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import * as bcrypt from 'bcrypt';

// DTOs
export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  internetNumber?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  installedModem?: string;

  @IsString()
  @IsOptional()
  modemSerial?: string;

  @IsDateString()
  @IsOptional()
  installationDate?: Date;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  internetNumber?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  installedModem?: string;

  @IsString()
  @IsOptional()
  modemSerial?: string;

  @IsDateString()
  @IsOptional()
  installationDate?: Date;

  @IsString()
  @IsOptional()
  status?: string;
}

export class CustomerQueryDto {
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

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

@Injectable()
export class AdminCustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get paginated list of customers with search and filters
   */
  async getCustomers(query: CustomerQueryDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search by name, email, phone, internet number
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { internetNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await this.prisma.customer.count({ where });

    // Get paginated data with relations
    const customers = await this.prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        packages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          where: { status: 'unpaid' },
          select: { id: true },
        },
        tickets: {
          where: { status: { in: ['open', 'in_progress'] } },
          select: { id: true },
        },
      },
    });

    // Format response
    const formattedCustomers = customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
      internetNumber: customer.internetNumber,
      ipAddress: customer.ipAddress,
      installedModem: customer.installedModem,
      installationDate: customer.installationDate,
      createdAt: customer.createdAt,
      currentPackage: customer.packages[0] || null,
      unpaidInvoicesCount: customer.invoices.length,
      openTicketsCount: customer.tickets.length,
    }));

    return {
      data: formattedCustomers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get customer detail by ID
   */
  async getCustomerDetail(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        packages: {
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            technician: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Calculate statistics
    const totalInvoices = await this.prisma.invoice.count({
      where: { customerId },
    });

    const unpaidInvoices = await this.prisma.invoice.count({
      where: { customerId, status: 'unpaid' },
    });

    const totalTickets = await this.prisma.ticket.count({
      where: { customerId },
    });

    const openTickets = await this.prisma.ticket.count({
      where: { customerId, status: { in: ['open', 'in_progress'] } },
    });

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
        internetNumber: customer.internetNumber,
        ipAddress: customer.ipAddress,
        installedModem: customer.installedModem,
        modemSerial: customer.modemSerial,
        installationDate: customer.installationDate,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
      currentPackage: customer.packages[0] || null,
      statistics: {
        totalInvoices,
        unpaidInvoices,
        totalTickets,
        openTickets,
      },
      recentInvoices: customer.invoices,
      recentTickets: customer.tickets,
      recentTransactions: customer.transactions,
    };
  }

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomerDto) {
    // Check if email already exists
    if (data.email) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (existingCustomer) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Check if internet number already exists
    if (data.internetNumber) {
      const existingNumber = await this.prisma.customer.findUnique({
        where: { internetNumber: data.internetNumber },
      });

      if (existingNumber) {
        throw new BadRequestException('Internet number already exists');
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    // Create customer
    const customer = await this.prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: hashedPassword,
        internetNumber: data.internetNumber,
        ipAddress: data.ipAddress,
        installedModem: data.installedModem,
        modemSerial: data.modemSerial,
        installationDate: data.installationDate,
        status: data.status || 'active',
      },
    });

    return customer;
  }

  /**
   * Update customer
   */
  async updateCustomer(customerId: string, data: UpdateCustomerDto) {
    // Check if customer exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== existingCustomer.email) {
      const emailExists = await this.prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Check internet number uniqueness if being updated
    if (data.internetNumber && data.internetNumber !== existingCustomer.internetNumber) {
      const numberExists = await this.prisma.customer.findUnique({
        where: { internetNumber: data.internetNumber },
      });

      if (numberExists) {
        throw new BadRequestException('Internet number already exists');
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    // Update customer
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (hashedPassword) updateData.password = hashedPassword;
    if (data.internetNumber !== undefined) updateData.internetNumber = data.internetNumber;
    if (data.ipAddress !== undefined) updateData.ipAddress = data.ipAddress;
    if (data.installedModem !== undefined) updateData.installedModem = data.installedModem;
    if (data.modemSerial !== undefined) updateData.modemSerial = data.modemSerial;
    if (data.installationDate !== undefined) updateData.installationDate = data.installationDate;
    if (data.status !== undefined) updateData.status = data.status;

    const updatedCustomer = await this.prisma.customer.update({
      where: { id: customerId },
      data: updateData,
    });

    return updatedCustomer;
  }

  /**
   * Delete customer (soft delete by setting status to 'deleted')
   */
  async deleteCustomer(customerId: string) {
    // Check if customer exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // Soft delete: set status to 'deleted'
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { status: 'deleted' },
    });

    return { message: 'Customer deleted successfully' };
  }

  /**
   * Bulk import customers from CSV data
   */
  async bulkImportCustomers(customersData: CreateCustomerDto[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const [index, customerData] of customersData.entries()) {
      try {
        await this.createCustomer(customerData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: index + 1,
          data: customerData,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Get customer statistics
   */
  async getCustomerStatistics() {
    const totalCustomers = await this.prisma.customer.count({
      where: { status: { not: 'deleted' } },
    });

    const activeCustomers = await this.prisma.customer.count({
      where: { status: 'active' },
    });

    const inactiveCustomers = await this.prisma.customer.count({
      where: { status: 'inactive' },
    });

    const suspendedCustomers = await this.prisma.customer.count({
      where: { status: 'suspended' },
    });

    // Get customers created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomers = await this.prisma.customer.count({
      where: {
        status: { not: 'deleted' },
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Get customer by package distribution
    const packageDistribution = await this.prisma.package.groupBy({
      by: ['name'],
      where: {
        customerId: { not: null },
        customer: { status: 'active' },
      },
      _count: true,
    });

    // Get recent signups (last 7 days daily)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSignups = await this.prisma.customer.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { not: 'deleted' },
      },
      select: {
        createdAt: true,
      },
    });

    // Group by date
    const signupsByDate = recentSignups.reduce((acc, customer) => {
      const date = customer.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalCustomers,
      active: activeCustomers,
      inactive: inactiveCustomers,
      suspended: suspendedCustomers,
      new: newCustomers,
      packageDistribution,
      recentSignups: signupsByDate,
    };
  }
}
