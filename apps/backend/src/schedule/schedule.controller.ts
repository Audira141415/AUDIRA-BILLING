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
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';



@Controller(['schedule', 'schedules'])
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getAll(
    @Query('employeeId') employeeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.scheduleService.getAll(employeeId, startDate, endDate);
  }

  @Get('stats')
  async getStats(@Query('date') date?: string) {
    return this.scheduleService.getStats(date);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.scheduleService.getOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.scheduleService.create(data);
  }

  @Post('bulk')
  async createBulk(@Body() data: any) {
    return this.scheduleService.createBulk(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.scheduleService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }
}
