import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { DnsService } from './dns.service';

@Controller('dns')
export class DnsController {
  constructor(private readonly dnsService: DnsService) {}

  @Get('status')
  getStatus() {
    return this.dnsService.getStatus();
  }

  @Get('categories')
  getCategories() {
    return {
      success: true,
      categories: this.dnsService.getCategories(),
    };
  }

  @Get('custom-rules')
  getCustomRules() {
    return {
      success: true,
      rules: this.dnsService.getCustomRules(),
    };
  }

  @Get('blocked-logs')
  getBlockedLogs() {
    return {
      success: true,
      logs: this.dnsService.getBlockedLogs(),
    };
  }

  @Post('toggle-category')
  toggleCategory(@Body() body: { id: string; enabled: boolean }) {
    return this.dnsService.toggleCategory(body.id, body.enabled);
  }

  @Post('sync-trustpositif')
  async syncTrustPositif() {
    return this.dnsService.syncTrustPositif();
  }

  @Post('custom-rules')
  addCustomRule(@Body() body: { domain: string; type: 'BLACKLIST' | 'WHITELIST'; category: string; reason: string; createdBy?: string }) {
    return this.dnsService.addCustomRule(body);
  }

  @Delete('custom-rules/:id')
  deleteCustomRule(@Param('id') id: string) {
    return this.dnsService.deleteCustomRule(id);
  }
}
