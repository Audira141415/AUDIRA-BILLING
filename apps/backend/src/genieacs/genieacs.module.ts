import { Module } from '@nestjs/common';
import { GenieacsController } from './genieacs.controller';
import { GenieacsService } from './genieacs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GenieacsController],
  providers: [GenieacsService],
  exports: [GenieacsService],
})
export class GenieacsModule {}
