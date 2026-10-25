import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { TelegramNocService } from './telegram-noc.service';
import { OutageDetectorService } from './outage-detector.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly telegramNocService: TelegramNocService,
    private readonly outageDetectorService: OutageDetectorService,
  ) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStats() {
    return this.monitoringService.getMonitoringStats();
  }

  /**
   * Telegram Bot Webhook (Public, no JWT)
   */
  @Post('telegram/webhook')
  async handleTelegramWebhook(@Body() body: any) {
    const message = body.message || body.edited_message;
    if (message && message.text) {
      const chatId = message.chat?.id?.toString() || '';
      return this.telegramNocService.handleCommand(chatId, message.text);
    }
    return { ok: true };
  }

  /**
   * Manual CLI Command via API (Bisa dijalankan teknisi dari Web Dashboard)
   */
  @Post('telegram/command')
  async runCommand(@Body() body: { command: string; chatId?: string }) {
    return this.telegramNocService.handleCommand(body.chatId || 'admin-console', body.command);
  }

  /**
   * Simulasi Peringatan Gangguan Massal (ODP Fiber Cut Alert)
   */
  @Post('telegram/test-outage')
  async testOutageAlert(@Body() body?: { odpName?: string; location?: string }) {
    return this.outageDetectorService.simulateOutageAlert(body?.odpName, body?.location);
  }

  /**
   * Riwayat Gangguan Terdeteksi
   */
  @Get('telegram/outages')
  async getOutages() {
    return this.telegramNocService.getRecentOutages();
  }
}
