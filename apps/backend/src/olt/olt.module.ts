import { Module } from '@nestjs/common';
import { OltService } from './olt.service';
import { OltController } from './olt.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OltController],
  providers: [OltService],
  exports: [OltService],
})
export class OltModule {}
