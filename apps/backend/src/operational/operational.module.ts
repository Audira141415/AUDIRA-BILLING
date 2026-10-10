import { Module } from '@nestjs/common';
import { OperationalController } from './operational.controller';
import { OperationalService } from './operational.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OperationalController],
  providers: [OperationalService],
  exports: [OperationalService]
})
export class OperationalModule {}
