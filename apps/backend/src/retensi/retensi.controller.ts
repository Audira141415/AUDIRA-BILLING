import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RetensiService } from './retensi.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('retensi')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RetensiController {
  constructor(private readonly retensiService: RetensiService) {}

  @Get('radar')
  async getRadar(
    @Query('tier') tier?: string,
    @Query('search') search?: string,
  ) {
    return this.retensiService.getRadar(tier, search);
  }

  @Get('stats')
  async getStats() {
    return this.retensiService.getStats();
  }

  @Post(':id/action')
  async executeAction(
    @Param('id') id: string,
    @Body()
    body: {
      actionType: 'SCHEDULE_CALIBRATION' | 'OFFER_PROMO' | 'VIP_CARE';
      notes?: string;
      promoCode?: string;
    },
  ) {
    return this.retensiService.executeRetentionAction(id, body);
  }
}
