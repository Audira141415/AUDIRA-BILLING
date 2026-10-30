import { Module } from '@nestjs/common';
import { FieldServiceController } from './field-service.controller';
import { FieldServiceService } from './field-service.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [PrismaModule, RealtimeModule],
  controllers: [FieldServiceController],
  providers: [FieldServiceService],
  exports: [FieldServiceService],
})
export class FieldServiceModule {}
