import { Module } from '@nestjs/common';
import { AdminCustomerController } from './admin-customer.controller';
import { AdminCustomerService } from './admin-customer.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminCustomerController],
  providers: [AdminCustomerService],
  exports: [AdminCustomerService],
})
export class AdminCustomerModule {}
