import { Module } from '@nestjs/common';
import { HotspotController } from './hotspot.controller';
import { HotspotService } from './hotspot.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HotspotController],
  providers: [HotspotService],
  exports: [HotspotService],
})
export class HotspotModule {}
