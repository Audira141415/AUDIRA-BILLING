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
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller(['performance', 'performances'])
@UseGuards(JwtAuthGuard, RolesGuard)
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  async getAll(
    @Query('employeeId') employeeId?: string,
    @Query('period') period?: string,
  ) {
    return this.performanceService.getAll(employeeId, period);
  }

  @Get('stats')
  async getStats() {
    return this.performanceService.getStats();
  }

  @Get('dashboard/:employeeId')
  async getDashboard(@Param('employeeId') employeeId: string) {
    return this.performanceService.getDashboard(employeeId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.performanceService.getOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.performanceService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.performanceService.update(id, data);
  }

  @Put(':id/submit')
  async submit(@Param('id') id: string) {
    return this.performanceService.submit(id);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string, @Body() data: any) {
    return this.performanceService.approve(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.performanceService.delete(id);
  }
}
