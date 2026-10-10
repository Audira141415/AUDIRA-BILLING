import { Module } from '@nestjs/common';
import { ModemController } from './modem.controller';
import { ModemService } from './modem.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ModemController],
  providers: [ModemService],
  exports: [ModemService],
})
export class ModemModule {}
