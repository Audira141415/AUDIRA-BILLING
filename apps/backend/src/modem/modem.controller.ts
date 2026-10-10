import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ModemService } from './modem.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('modem')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModemController {
  constructor(private readonly modemService: ModemService) {}

  @Get('list')
  async getAllModems() {
    return this.modemService.getAllModems();
  }

  @Get('stats')
  async getStats() {
    return this.modemService.getModemStats();
  }

  @Get('by-type')
  async getByType() {
    return this.modemService.getModemsByType();
  }

  @Get('check/:customerId')
  async checkStatus(@Param('customerId') customerId: string) {
    return this.modemService.checkModemStatus(customerId);
  }
}
