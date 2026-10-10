import { Module } from '@nestjs/common';
import { FieldServiceController } from './field-service.controller';
import { FieldServiceService } from './field-service.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FieldServiceController],
  providers: [FieldServiceService],
  exports: [FieldServiceService],
})
export class FieldServiceModule {}
