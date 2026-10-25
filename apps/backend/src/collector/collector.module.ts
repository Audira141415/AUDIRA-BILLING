import { Module } from '@nestjs/common';
import { CollectorController } from './collector.controller';
import { CollectorService } from './collector.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BillingModule } from '../billing/billing.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, BillingModule, WhatsAppModule],
  controllers: [CollectorController],
  providers: [CollectorService],
  exports: [CollectorService],
})
export class CollectorModule {}
