import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PelangganService } from './pelanggan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('pelanggan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PelangganController {
  constructor(private readonly pelangganService: PelangganService) {}

  @Get()
  @Roles('admin', 'BILLING')
  async findAll() {
    return this.pelangganService.findAll();
  }

  @Get('stats')
  @Roles('admin', 'BILLING')
  async getStats() {
    return this.pelangganService.getStats();
  }

  @Get(':id')
  @Roles('admin', 'BILLING')
  async findOne(@Param('id') id: string) {
    return this.pelangganService.findOne(id);
  }

  @Post()
  @Roles('admin', 'BILLING')
  async create(@Body() data: any) {
    return this.pelangganService.create(data);
  }

  @Put(':id')
  @Roles('admin', 'BILLING')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.pelangganService.update(id, data);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.pelangganService.remove(id);
  }
}
