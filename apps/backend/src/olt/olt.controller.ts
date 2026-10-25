import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OltService } from './olt.service';

@Controller('olt')
export class OltController {
  constructor(private readonly oltService: OltService) {}

  @Get()
  async getOlts() {
    return this.oltService.getOlts();
  }

  @Get('stats')
  async getStats() {
    return this.oltService.getOltStats();
  }

  @Get('onus/unregistered')
  async getUnregisteredOnus(@Query('oltId') oltId?: string) {
    return this.oltService.getUnregisteredOnus(oltId);
  }

  @Get('onus/registered')
  async getRegisteredOnus(@Query('oltId') oltId?: string) {
    return this.oltService.getRegisteredOnus(oltId);
  }

  @Post('onus/register')
  async registerOnu(
    @Body()
    body: {
      oltId: string;
      serialNumber: string;
      ponPort: string;
      customerName: string;
      customerId?: string;
      vlanId: number;
      profileName?: string;
    },
  ) {
    return this.oltService.registerOnu(body);
  }
}
