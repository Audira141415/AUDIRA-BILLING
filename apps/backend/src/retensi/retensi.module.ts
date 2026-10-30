import { Module } from '@nestjs/common';
import { RetensiService } from './retensi.service';
import { RetensiController } from './retensi.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [PrismaModule, WhatsAppModule, TelegramModule],
  controllers: [RetensiController],
  providers: [RetensiService],
  exports: [RetensiService],
})
export class RetensiModule {}
