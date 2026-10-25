import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingCronService } from './billing.cron.service';
import { ReceiptPdfService } from './receipt-pdf.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { EmailModule } from '../email/email.module';
import { PaymentGatewayService } from './payment-gateway.service';
import { SalesModule } from '../sales/sales.module';
import { RadiusModule } from '../radius/radius.module';
import { MikrotikModule } from '../mikrotik/mikrotik.module';

@Module({
  imports: [PrismaModule, WhatsAppModule, EmailModule, SalesModule, RadiusModule, MikrotikModule],
  controllers: [BillingController],
  providers: [BillingService, BillingCronService, PaymentGatewayService, ReceiptPdfService],
  exports: [BillingService, PaymentGatewayService, ReceiptPdfService, BillingCronService],
})
export class BillingModule {}

