import { Module } from '@nestjs/common';
import { SpeedtestService } from './speedtest.service';
import { SpeedtestController } from './speedtest.controller';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [SpeedtestController],
  providers: [SpeedtestService],
  exports: [SpeedtestService],
})
export class SpeedtestModule {}
