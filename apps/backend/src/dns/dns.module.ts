import { Module } from '@nestjs/common';
import { DnsService } from './dns.service';
import { DnsController } from './dns.controller';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [DnsController],
  providers: [DnsService],
  exports: [DnsService],
})
export class DnsModule {}
