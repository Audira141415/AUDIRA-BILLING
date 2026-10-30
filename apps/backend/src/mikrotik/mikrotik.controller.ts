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

  // ==========================================
  // IPAM & FORENSIK CGNAT (UU ITE)
  // ==========================================

  @Get('ipam/pools')
  async getIpamPools() {
    return this.mikrotikService.getIpamPools();
  }

  @Get('ipam/allocations')
  async getIpamAllocations(@Body('search') search?: string) {
    return this.mikrotikService.getIpamAllocations(search);
  }

  @Post('ipam/forensic-search')
  async searchCgnatForensic(
    @Body()
    body: {
      publicIp: string;
      publicPort: number;
      protocol: string;
      timestamp: string;
    },
  ) {
    return this.mikrotikService.searchCgnatForensic(body);
  }

  // ==========================================
  // LIVE MRTG & UPLINK TELEMETRY
  // ==========================================

  @Get('traffic/live')
  async getLiveTraffic() {
    return this.mikrotikService.getLiveTraffic();
  }

  @Get('traffic/top-consumers')
  async getTopConsumers() {
    return this.mikrotikService.getTopConsumers();
  }

  @Post('traffic/kick-coa')
  async kickActiveSession(@Body() body: { username: string; mikrotikId?: string }) {
    return this.mikrotikService.kickActiveSession(body.username, body.mikrotikId);
  }
}

