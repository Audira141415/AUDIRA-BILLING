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
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  async getAll(@Query('status') status?: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.getAll(status, employeeId);
  }

  @Get('stats')
  async getStats() {
    return this.leaveService.getStats();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.leaveService.getOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.leaveService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.leaveService.update(id, data);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string, @Body() data: any) {
    return this.leaveService.approve(id, data);
  }

  @Put(':id/reject')
  async reject(@Param('id') id: string, @Body() data: any) {
    return this.leaveService.reject(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.leaveService.delete(id);
  }
}
