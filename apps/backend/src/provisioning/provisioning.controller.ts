import { Controller, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProvisioningService } from './provisioning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('provisioning')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvisioningController {
  constructor(private readonly provisioningService: ProvisioningService) {}

  @Post('provision/:customerId')
  async provision(@Param('customerId') customerId: string) {
    return this.provisioningService.provisionCustomer(customerId);
  }

  @Delete('deprovision/:customerId')
  async deprovision(@Param('customerId') customerId: string) {
    return this.provisioningService.deprovisionCustomer(customerId);
  }

  @Put('bandwidth/:customerId')
  async updateBandwidth(
    @Param('customerId') customerId: string,
    @Body() data: { packageId: string },
  ) {
    return this.provisioningService.updateBandwidth(customerId, data.packageId);
  }

  @Post('suspend/:customerId')
  async suspend(@Param('customerId') customerId: string) {
    return this.provisioningService.suspendCustomer(customerId);
  }

  @Post('unsuspend/:customerId')
  async unsuspend(@Param('customerId') customerId: string) {
    return this.provisioningService.unsuspendCustomer(customerId);
  }
}
