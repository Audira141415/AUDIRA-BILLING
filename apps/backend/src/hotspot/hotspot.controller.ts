import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HotspotService } from './hotspot.service';

@Controller('hotspot')
export class HotspotController {
  constructor(private readonly hotspotService: HotspotService) {}

  @Get('profiles')
  async getProfiles() {
    return this.hotspotService.getProfiles();
  }

  @Post('profiles')
  async createProfile(
    @Body() data: { name: string; price: number; duration: number; rateLimit?: string; sharedUsers?: number }
  ) {
    return this.hotspotService.createProfile(data);
  }

  @Post('vouchers/generate')
  async generateVouchers(
    @Body() data: { profileId: string; count: number; prefix?: string }
  ) {
    return this.hotspotService.generateVouchers(data);
  }

  @Get('vouchers/batch/:batchCode')
  async getBatchVouchers(@Param('batchCode') batchCode: string) {
    return this.hotspotService.getBatchVouchers(batchCode);
  }

  @Get('stats')
  async getStats() {
    return this.hotspotService.getStats();
  }
}
