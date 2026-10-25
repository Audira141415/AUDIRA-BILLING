import { Module } from '@nestjs/common';
import { BoosterController } from './booster.controller';
import { BoosterService } from './booster.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RadiusModule } from '../radius/radius.module';
import { MikrotikModule } from '../mikrotik/mikrotik.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, RadiusModule, MikrotikModule, WhatsAppModule],
  controllers: [BoosterController],
  providers: [BoosterService],
  exports: [BoosterService],
})
export class BoosterModule {}
