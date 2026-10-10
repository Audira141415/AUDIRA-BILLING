import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  InvoiceService,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceQueryDto,
  RecordPaymentDto,
} from './invoice.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async getInvoices(@Query() query: InvoiceQueryDto) {
    return this.invoiceService.getInvoices(query);
  }

  @Get('statistics/overview')
  async getStatistics() {
    return this.invoiceService.getInvoiceStatistics();
  }

  @Get('customer/:customerId')
  async getInvoicesByCustomer(@Param('customerId') customerId: string) {
    return this.invoiceService.getInvoicesByCustomer(customerId);
  }

  @Get(':id')
  async getInvoiceDetail(@Param('id') id: string) {
    return this.invoiceService.getInvoiceDetail(id);
  }

  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Post('bulk-create')
  async bulkCreateInvoices(@Body() data: { invoices: CreateInvoiceDto[] }) {
    return this.invoiceService.bulkCreateInvoices(data.invoices);
  }

  @Post(':id/payment')
  async recordPayment(
    @Param('id') id: string,
    @Body() recordPaymentDto: RecordPaymentDto,
  ) {
    return this.invoiceService.recordPayment(id, recordPaymentDto);
  }

  @Post('mark-overdue')
  async markAsOverdue() {
    return this.invoiceService.markAsOverdue();
  }

  @Put(':id')
  async updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: string) {
    return this.invoiceService.deleteInvoice(id);
  }
}
