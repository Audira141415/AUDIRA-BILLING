import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('franchise')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Get()
  async findAll() {
    return this.franchiseService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.franchiseService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.franchiseService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.franchiseService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.franchiseService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.franchiseService.remove(id);
  }

  @Get(':id/customers')
  async getFranchiseCustomers(@Param('id') id: string) {
    return this.franchiseService.getFranchiseCustomers(id);
  }

  @Get(':id/revenue')
  async getFranchiseRevenue(@Param('id') id: string) {
    return this.franchiseService.getFranchiseRevenue(id);
  }
}
