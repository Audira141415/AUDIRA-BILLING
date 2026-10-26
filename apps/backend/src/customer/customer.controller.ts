import {
  Controller,
  Get,
  Put,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * GET /customer/telemetry
   * Get real-time connection telemetry, optical signal (dBm), FUP usage, and active maintenance
   */
  @Get('telemetry')
  async getTelemetry(@Req() req: Request, @Query('customerId') queryCustomerId?: string) {
    const customerId = queryCustomerId || req.user?.['sub'];
    return this.customerService.getTelemetry(customerId);
  }

  /**
   * GET /customer/dashboard
   * Get customer dashboard with statistics
   */
  @Get('dashboard')
  async getDashboard(@Req() req: Request) {
    const customerId = req.user['sub'];
    return this.customerService.getDashboard(customerId);
  }

  /**
   * GET /customer/profile
   * Get customer profile information
   */
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const customerId = req.user['sub'];
    return this.customerService.getProfile(customerId);
  }

  /**
   * PUT /customer/profile or PATCH /customer/profile
   * Update customer profile
   */
  @Put('profile')
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: Request,
    @Body() updateData: {
      name?: string;
      phone?: string;
      address?: string;
    },
  ) {
    const customerId = req.user['sub'];
    return this.customerService.updateProfile(customerId, updateData);
  }

  /**
   * POST /customer/change-password
   * Change customer password
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() req: Request,
    @Body() data: { currentPassword?: string; newPassword?: string },
  ) {
    const customerId = req.user['sub'];
    return this.customerService.changePassword(customerId, data);
  }

  /**
   * GET /customer/invoices
   * Get customer invoices with pagination
   */
  @Get('invoices')
  async getInvoices(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const customerId = req.user['sub'];
    return this.customerService.getInvoices(
      customerId,
      parseInt(page) || 1,
      parseInt(limit) || 10,
      status,
    );
  }

  /**
   * GET /customer/invoices/:id
   * Get invoice detail
   */
  @Get('invoices/:id')
  async getInvoiceDetail(@Req() req: Request, @Param('id') invoiceId: string) {
    const customerId = req.user['sub'];
    return this.customerService.getInvoiceDetail(customerId, invoiceId);
  }

  /**
   * GET /customer/packages
   * Get available packages
   */
  @Get('packages')
  async getAvailablePackages() {
    return this.customerService.getAvailablePackages();
  }

  /**
   * GET /customer/package/current
   * Get customer's current package
   */
  @Get('package/current')
  async getCurrentPackage(@Req() req: Request) {
    const customerId = req.user['sub'];
    return this.customerService.getCurrentPackage(customerId);
  }

  /**
   * GET /customer/tickets
   * Get customer tickets with pagination
   */
  @Get('tickets')
  async getTickets(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const customerId = req.user['sub'];
    return this.customerService.getTickets(
      customerId,
      parseInt(page) || 1,
      parseInt(limit) || 10,
      status,
    );
  }

  /**
   * GET /customer/tickets/:id
   * Get ticket detail
   */
  @Get('tickets/:id')
  async getTicketDetail(@Req() req: Request, @Param('id') ticketId: string) {
    const customerId = req.user['sub'];
    return this.customerService.getTicketDetail(customerId, ticketId);
  }

  /**
   * POST /customer/tickets
   * Create new ticket
   */
  @Post('tickets')
  @HttpCode(HttpStatus.CREATED)
  async createTicket(
    @Req() req: Request,
    @Body() ticketData: {
      title: string;
      description: string;
      priority?: string;
    },
  ) {
    const customerId = req.user['sub'];
    return this.customerService.createTicket(customerId, ticketData);
  }
}
