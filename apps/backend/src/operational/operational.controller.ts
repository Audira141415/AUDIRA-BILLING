import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OperationalService } from './operational.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('operational')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OperationalController {
  constructor(private readonly operationalService: OperationalService) {}

  @Get('tickets')
  async findAllTickets() {
    return this.operationalService.findAllTickets();
  }

  @Get('technicians')
  async findAllTechnicians() {
    return this.operationalService.findAllTechnicians();
  }

  @Get('stats')
  async getStats() {
    return this.operationalService.getStats();
  }

  @Get('tickets/:id')
  async findTicket(@Param('id') id: string) {
    return this.operationalService.findTicket(id);
  }

  @Post('tickets')
  async createTicket(@Body() data: any) {
    return this.operationalService.createTicket(data);
  }

  @Post('technicians')
  async createTechnician(@Body() data: any) {
    return this.operationalService.createTechnician(data);
  }

  @Put('tickets/:id')
  async updateTicket(@Param('id') id: string, @Body() data: any) {
    return this.operationalService.updateTicket(id, data);
  }

  @Put('tickets/:id/assign')
  async assignTicket(@Param('id') id: string, @Body() data: any) {
    return this.operationalService.assignTicket(id, data.technicianId);
  }
}
