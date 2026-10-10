import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminCustomerService, CreateCustomerDto, UpdateCustomerDto, CustomerQueryDto } from './admin-customer.service';

@Controller('admin/customers')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  transform: true, 
  whitelist: true,
  forbidNonWhitelisted: false,
  transformOptions: {
    enableImplicitConversion: true
  }
}))
export class AdminCustomerController {
  constructor(private readonly customerService: AdminCustomerService) {}

  /**
   * Get paginated list of customers with filters
   * GET /admin/customers?page=1&limit=10&search=john&status=active&sortBy=createdAt&sortOrder=desc
   */
  @Get()
  async getCustomers(@Query() query: CustomerQueryDto) {
    return this.customerService.getCustomers(query);
  }

  /**
   * Get customer detail by ID
   * GET /admin/customers/:id
   */
  @Get(':id')
  async getCustomerDetail(@Param('id') id: string) {
    return this.customerService.getCustomerDetail(id);
  }

  /**
   * Create new customer
   * POST /admin/customers
   */
  @Post()
  async createCustomer(@Body() data: CreateCustomerDto) {
    return this.customerService.createCustomer(data);
  }

  /**
   * Update customer
   * PUT /admin/customers/:id
   */
  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() data: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, data);
  }

  /**
   * Delete customer (soft delete)
   * DELETE /admin/customers/:id
   */
  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }

  /**
   * Bulk import customers from CSV
   * POST /admin/customers/bulk-import
   */
  @Post('bulk-import')
  async bulkImportCustomers(@Body() data: { customers: CreateCustomerDto[] }) {
    return this.customerService.bulkImportCustomers(data.customers);
  }

  /**
   * Get customer statistics
   * GET /admin/customers/statistics/overview
   */
  @Get('statistics/overview')
  async getStatistics() {
    return this.customerService.getCustomerStatistics();
  }
}
