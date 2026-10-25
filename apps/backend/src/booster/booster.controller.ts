import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BoosterService } from './booster.service';

@Controller('booster')
export class BoosterController {
  constructor(private readonly boosterService: BoosterService) {}

  @Get('packages')
  async getPackages() {
    return this.boosterService.getPackages();
  }

  @Post('activate')
  async activateBooster(
    @Body() body: { customerId: string; packageId: string; notes?: string },
  ) {
    return this.boosterService.activateBooster(body);
  }

  @Get('active/:customerId')
  async getActiveBooster(@Param('customerId') customerId: string) {
    return this.boosterService.getActiveBooster(customerId);
  }

  @Get('history')
  async getBoosterHistory(@Query('limit') limit?: number) {
    return this.boosterService.getBoosterHistory(limit ? Number(limit) : 50);
  }

  @Get('stats')
  async getStats() {
    return this.boosterService.getStats();
  }
}
