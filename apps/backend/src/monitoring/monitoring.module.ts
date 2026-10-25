import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { TelegramNocService } from './telegram-noc.service';
import { OutageDetectorService } from './outage-detector.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { MikrotikModule } from '../mikrotik/mikrotik.module';
import { RadiusModule } from '../radius/radius.module';
import { GenieacsModule } from '../genieacs/genieacs.module';

@Module({
  imports: [
    PrismaModule, 
    WhatsAppModule, 
    MikrotikModule, 
    RadiusModule, 
    GenieacsModule
  ],
  controllers: [MonitoringController],
  providers: [
    MonitoringService, 
    TelegramNocService, 
    OutageDetectorService
  ],
  exports: [
    MonitoringService, 
    TelegramNocService, 
    OutageDetectorService
  ],
})
export class MonitoringModule {}
