import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ServiceService, CreateServiceDto, UpdateServiceDto, ServiceQueryDto, BulkImportServiceDto } from './service.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getServices(@Query() query: ServiceQueryDto) {
    return this.serviceService.getServices(query);
  }

  @Get('statistics/overview')
  async getStatistics() {
    return this.serviceService.getServiceStatistics();
  }

  @Get('customer/:customerId')
  async getServicesByCustomer(@Param('customerId') customerId: string) {
    return this.serviceService.getServicesByCustomer(customerId);
  }

  @Get('package/:packageId')
  async getServicesByPackage(@Param('packageId') packageId: string) {
    return this.serviceService.getServicesByPackage(packageId);
  }

  @Get(':id')
  async getServiceDetail(@Param('id') id: string) {
    return this.serviceService.getServiceDetail(id);
  }

  @Post()
  async createService(@Body() data: CreateServiceDto) {
    return this.serviceService.createService(data);
  }

  @Post('bulk-import')
  async bulkImport(@Body() data: BulkImportServiceDto) {
    return this.serviceService.bulkImportServices(data);
  }

  @Put(':id')
  async updateService(@Param('id') id: string, @Body() data: UpdateServiceDto) {
    return this.serviceService.updateService(id, data);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return this.serviceService.deleteService(id);
  }
}

