import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingCronService } from './billing.cron.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { EmailModule } from '../email/email.module';
import { PaymentGatewayService } from './payment-gateway.service';

@Module({
  imports: [PrismaModule, WhatsAppModule, EmailModule],
  controllers: [BillingController],
  providers: [BillingService, BillingCronService, PaymentGatewayService],
  exports: [BillingService, PaymentGatewayService],
})
export class BillingModule {}
