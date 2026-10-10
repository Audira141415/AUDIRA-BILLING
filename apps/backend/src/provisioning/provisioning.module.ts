import { Module } from '@nestjs/common';
import { ProvisioningController } from './provisioning.controller';
import { ProvisioningService } from './provisioning.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MikrotikModule } from '../mikrotik/mikrotik.module';
import { RadiusModule } from '../radius/radius.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, MikrotikModule, RadiusModule, AuditModule],
  controllers: [ProvisioningController],
  providers: [ProvisioningService],
  exports: [ProvisioningService],
})
export class ProvisioningModule {}
