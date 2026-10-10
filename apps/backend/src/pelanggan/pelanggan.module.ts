import { Module } from '@nestjs/common';
import { PelangganController } from './pelanggan.controller';
import { PelangganService } from './pelanggan.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PelangganController],
  providers: [PelangganService],
  exports: [PelangganService]
})
export class PelangganModule {}
