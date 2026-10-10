import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('test')
  async testMessage(@Body() data: { phone: string; message: string }) {
    return this.whatsappService.sendMessage(data);
  }

  @Post('send-invoice')
  async sendInvoice(@Body() data: { customer: any; invoice: any }) {
    return this.whatsappService.sendInvoiceNotification(data.customer, data.invoice);
  }

  @Post('send-reminder')
  async sendReminder(@Body() data: { customer: any; invoice: any; daysLeft: number }) {
    return this.whatsappService.sendPaymentReminder(data.customer, data.invoice, data.daysLeft);
  }
}
