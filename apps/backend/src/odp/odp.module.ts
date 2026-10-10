import { Module } from '@nestjs/common';
import { OdpController } from './odp.controller';
import { OdpService } from './odp.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OdpController],
  providers: [OdpService],
  exports: [OdpService],
})
export class OdpModule {}
