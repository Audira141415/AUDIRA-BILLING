import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('mikrotik')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MikrotikController {
  constructor(private readonly mikrotikService: MikrotikService) {}

  @Get()
  async findAll() {
    return this.mikrotikService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mikrotikService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.mikrotikService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.mikrotikService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mikrotikService.remove(id);
  }

  @Post(':id/test-connection')
  async testConnection(@Param('id') id: string) {
    return this.mikrotikService.testConnection(id);
  }

  @Get(':id/interfaces')
  async getInterfaces(@Param('id') id: string) {
    return this.mikrotikService.getInterfaces(id);
  }
}
