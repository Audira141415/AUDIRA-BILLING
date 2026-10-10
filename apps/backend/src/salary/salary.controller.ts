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
import { SalaryService } from './salary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('salary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get()
  async getAll(
    @Query('period') period?: string,
    @Query('status') status?: string,
  ) {
    return this.salaryService.getAll(period, status);
  }

  @Get('stats')
  async getStats(@Query('period') period?: string) {
    return this.salaryService.getStats(period);
  }

  @Get('employee/:employeeId')
  async getByEmployee(@Param('employeeId') employeeId: string) {
    return this.salaryService.getByEmployee(employeeId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.salaryService.getOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.salaryService.create(data);
  }

  @Post('bulk')
  async createBulk(@Body() data: any) {
    return this.salaryService.createBulk(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.salaryService.update(id, data);
  }

  @Put(':id/pay')
  async markAsPaid(@Param('id') id: string, @Body() data: any) {
    return this.salaryService.markAsPaid(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.salaryService.delete(id);
  }
}
