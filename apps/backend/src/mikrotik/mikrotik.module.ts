import { Module } from '@nestjs/common';
import { MikrotikController } from './mikrotik.controller';
import { MikrotikService } from './mikrotik.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MikrotikController],
  providers: [MikrotikService],
  exports: [MikrotikService]
})
export class MikrotikModule {}
