import { Module } from '@nestjs/common';
import { NetflowService } from './netflow.service';
import { NetflowController } from './netflow.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [PrismaModule, TelegramModule],
  controllers: [NetflowController],
  providers: [NetflowService],
  exports: [NetflowService],
})
export class NetflowModule {}
