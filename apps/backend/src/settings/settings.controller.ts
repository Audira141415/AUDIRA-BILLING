import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Get(':key')
  async getSetting(@Param('key') key: string) {
    return this.settingsService.getSetting(key);
  }

  @Post()
  async updateSettings(@Body() settings: Record<string, any>) {
    return this.settingsService.updateSettings(settings);
  }

  @Patch(':key')
  async updateSetting(@Param('key') key: string, @Body() data: any) {
    return this.settingsService.updateSetting(key, data.value);
  }

  @Get('categories/all')
  async getCategories() {
    return this.settingsService.getCategories();
  }
}
