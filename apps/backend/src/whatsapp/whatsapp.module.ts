import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppBotService } from './whatsapp-bot.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GenieacsModule } from '../genieacs/genieacs.module';

@Module({
  imports: [PrismaModule, GenieacsModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService, WhatsAppBotService],
  exports: [WhatsAppService, WhatsAppBotService],
})
export class WhatsAppModule {}
