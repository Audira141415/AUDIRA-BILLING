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
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller(['employee', 'employees'])
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async getAll(@Query('status') status?: string) {
    return this.employeeService.getAll(status);
  }

  @Get('stats')
  async getStats() {
    return this.employeeService.getStats();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.employeeService.getOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.employeeService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.employeeService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.employeeService.delete(id);
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    return this.employeeService.getProfile(id);
  }
}
