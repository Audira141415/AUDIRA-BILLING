import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('incident')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get('list')
  async getIncidents(
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('search') search?: string,
  ) {
    return this.incidentService.getIncidents({ status, severity, search });
  }

  @Get('stats')
  async getStats() {
    return this.incidentService.getStats();
  }

  @Get(':id')
  async getIncident(@Param('id') id: string) {
    return this.incidentService.getIncidentById(id);
  }

  @Post('create')
  async createIncident(
    @Body()
    data: {
      title: string;
      severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
      impactArea: string;
      oltName: string;
      ponPort: string;
      odpNames: string[];
      affectedCount?: number;
      splicerTeam: string;
      estimatedResolution: string;
      rootCause?: string;
    },
  ) {
    return this.incidentService.createIncident(data);
  }

  @Post(':id/update-status')
  async updateStatus(
    @Param('id') id: string,
    @Body()
    data: {
      status: 'REPORTED' | 'INVESTIGATING' | 'SPLICING_IN_PROGRESS' | 'MONITORING' | 'RESOLVED';
      notes?: string;
      actor?: string;
    },
  ) {
    return this.incidentService.updateStatus(id, data);
  }

  @Post(':id/broadcast-wa')
  async broadcastWhatsApp(
    @Param('id') id: string,
    @Body() body?: { customMessage?: string },
  ) {
    return this.incidentService.broadcastWhatsApp(id, body?.customMessage);
  }

  @Post(':id/dispatch-telegram')
  async dispatchTelegram(
    @Param('id') id: string,
    @Body() body?: { notes?: string },
  ) {
    const inc = await this.incidentService.getIncidentById(id);
    return this.incidentService.dispatchToTelegramTopic(inc, 'STATUS_UPDATE', body?.notes);
  }
}
