import { Module } from '@nestjs/common';
import { ZtpService } from './ztp.service';
import { ZtpController } from './ztp.controller';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [ZtpController],
  providers: [ZtpService],
  exports: [ZtpService],
})
export class ZtpModule {}
