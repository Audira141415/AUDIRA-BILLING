import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GenieacsService } from './genieacs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('genieacs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GenieacsController {
  constructor(private readonly genieacsService: GenieacsService) {}

  @Get('devices')
  async getDevices(@Query('search') search?: string) {
    return this.genieacsService.getDevices(search);
  }

  @Get('devices/:id')
  async getDevice(@Param('id') id: string) {
    return this.genieacsService.getDevice(id);
  }

  @Post('devices/:id/refresh')
  async refreshDevice(@Param('id') id: string) {
    return this.genieacsService.refreshDevice(id);
  }

  @Post('devices/:id/reboot')
  async rebootDevice(@Param('id') id: string) {
    return this.genieacsService.rebootDevice(id);
  }

  @Get('devices/:id/optical')
  async getOpticalPower(@Param('id') id: string) {
    return this.genieacsService.getOpticalPower(id);
  }

  @Post('devices/:id/wifi')
  async updateWifi(
    @Param('id') id: string,
    @Body() data: { ssid24?: string; password24?: string; ssid5?: string; password5?: string }
  ) {
    return this.genieacsService.updateWifi(id, data);
  }

  @Get('devices/:id/clients')
  async getClients(@Param('id') id: string) {
    return this.genieacsService.getConnectedClients(id);
  }

  @Post('devices/:id/self-heal')
  async selfHeal(@Param('id') id: string) {
    return this.genieacsService.selfHeal(id);
  }

  @Post('devices/:id/factory-reset')
  async factoryReset(@Param('id') id: string) {
    return this.genieacsService.factoryReset(id);
  }

  @Get('devices/:id/parameters')
  async getDeviceParameters(@Param('id') id: string) {
    return this.genieacsService.getDeviceParameters(id);
  }

  @Post('devices/:id/parameters')
  async setDeviceParameters(
    @Param('id') id: string,
    @Body() parameters: Record<string, any>
  ) {
    return this.genieacsService.setDeviceParameters(id, parameters);
  }

  @Get('stats')
  async getStats() {
    return this.genieacsService.getStats();
  }

  @Get('presets')
  async getPresets() {
    return this.genieacsService.getPresets();
  }

  @Post('presets')
  async createPreset(@Body() preset: any) {
    return this.genieacsService.createPreset(preset);
  }

  @Delete('presets/:name')
  async deletePreset(@Param('name') name: string) {
    return this.genieacsService.deletePreset(name);
  }

  // --- FIRMWARE & BATCH CAMPAIGNS ---
  @Get('firmware/list')
  async getFirmwares() {
    return this.genieacsService.getFirmwares();
  }

  @Get('campaigns')
  async getCampaigns() {
    return this.genieacsService.getCampaigns();
  }

  @Post('campaigns/create')
  async createCampaign(@Body() data: any) {
    return this.genieacsService.createCampaign(data);
  }

  @Post('campaigns/:id/start')
  async startCampaign(@Param('id') id: string) {
    return this.genieacsService.startCampaign(id);
  }

  @Post('campaigns/:id/pause')
  async pauseCampaign(@Param('id') id: string) {
    return this.genieacsService.pauseCampaign(id);
  }

  @Post('campaigns/:id/rollback')
  async rollbackCampaign(@Param('id') id: string) {
    return this.genieacsService.rollbackCampaign(id);
  }
}

