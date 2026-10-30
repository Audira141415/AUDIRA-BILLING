import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { NetflowService } from './netflow.service';

@Controller('netflow')
export class NetflowController {
  constructor(private readonly netflowService: NetflowService) {}

  @Get('stats')
  async getStats() {
    return this.netflowService.getStats();
  }

  @Get('flows')
  async getLiveFlows(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 25;
    return this.netflowService.getLiveFlows(lim);
  }

  @Get('top-talkers')
  async getTopTalkers() {
    return this.netflowService.getTopTalkers();
  }

  @Get('ddos-alerts')
  async getDdosAlerts() {
    return this.netflowService.getDdosAlerts();
  }

  @Get('flowspec-rules')
  async getFlowspecRules() {
    return this.netflowService.getFlowspecRules();
  }

  @Post('flowspec/apply')
  async applyFlowspec(
    @Body()
    body: {
      prefix: string;
      action: 'DISCARD' | 'RATE_LIMIT' | 'REDIRECT_SCRUBBING';
      rateLimitMbps?: number;
      protocol?: string;
      dstPort?: number;
    },
  ) {
    return this.netflowService.applyFlowspec(body);
  }

  @Post('flowspec/:id/withdraw')
  async withdrawFlowspec(@Param('id') id: string) {
    return this.netflowService.withdrawFlowspec(id);
  }
}
