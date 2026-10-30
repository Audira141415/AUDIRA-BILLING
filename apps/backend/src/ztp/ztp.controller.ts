import { Controller, Get, Post, Body } from '@nestjs/common';
import { ZtpService } from './ztp.service';

@Controller('ztp')
export class ZtpController {
  constructor(private readonly ztpService: ZtpService) {}

  @Get('queue')
  getDiscoveryQueue() {
    return this.ztpService.getDiscoveryQueue();
  }

  @Get('history')
  getHistory() {
    return this.ztpService.getHistory();
  }

  @Post('provision')
  async autoProvision(
    @Body()
    body: {
      discoveryId: string;
      customerName: string;
      internetNumber: string;
      packagePlan: string;
      wifiSsid?: string;
      wifiPassword?: string;
      technicianName?: string;
    },
  ) {
    return this.ztpService.autoProvision(body);
  }
}
