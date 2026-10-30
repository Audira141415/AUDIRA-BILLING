import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TunnelService, TunnelConfig } from './tunnel.service';

@Controller('tunnel')
export class TunnelController {
  constructor(private readonly tunnelService: TunnelService) {}

  @Post('provision')
  async provisionTunnel(
    @Body() body: { routerName?: string; tenantId?: string; location?: string }
  ): Promise<TunnelConfig> {
    return await this.tunnelService.provisionTunnel(body);
  }

  @Get()
  async getTunnels(@Query('tenantId') tenantId?: string): Promise<TunnelConfig[]> {
    return await this.tunnelService.getTunnels(tenantId);
  }

  @Get(':id')
  async getTunnelById(@Param('id') id: string): Promise<TunnelConfig | null> {
    return await this.tunnelService.getTunnelById(id);
  }

  @Post(':id/test-handshake')
  async testHandshake(@Param('id') id: string) {
    return await this.tunnelService.testHandshake(id);
  }
}

