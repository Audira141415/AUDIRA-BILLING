import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  /**
   * GET /tickets - Get all tickets with pagination and filters
   */
  @Get()
  async getTickets(@Query() query: any) {
    return this.ticketService.getTickets(query);
  }

  /**
   * GET /tickets/feed - Get all tickets as a flat list
   */
  @Get('feed')
  async getTicketFeed() {
    return this.ticketService.getAllTicketsList();
  }

  /**
   * POST /tickets/customer-report - Report trouble ticket from mobile app
   */
  @Post(['customer-report', 'report'])
  async createCustomerReport(@Body() body: any) {
    return this.ticketService.createCustomerReport(body);
  }

  /**
   * GET /tickets/statistics/overview - Get ticket statistics
   */
  @Get('statistics/overview')
  async getStatistics() {
    return this.ticketService.getTicketStatistics();
  }

  /**
   * GET /tickets/unassigned - Get unassigned tickets
   */
  @Get('unassigned')
  async getUnassignedTickets() {
    return this.ticketService.getUnassignedTickets();
  }

  /**
   * GET /tickets/technicians/available - Get available technicians
   */
  @Get('technicians/available')
  async getAvailableTechnicians() {
    return this.ticketService.getAvailableTechnicians();
  }

  /**
   * GET /tickets/customer/:customerId - Get tickets by customer
   */
  @Get('customer/:customerId')
  async getTicketsByCustomer(@Param('customerId') customerId: string) {
    return this.ticketService.getTicketsByCustomer(customerId);
  }

  /**
   * GET /tickets/technician/:technicianId - Get tickets by technician
   */
  @Get('technician/:technicianId')
  async getTicketsByTechnician(@Param('technicianId') technicianId: string) {
    return this.ticketService.getTicketsByTechnician(technicianId);
  }

  /**
   * GET /tickets/:id - Get ticket detail
   */
  @Get(':id')
  async getTicketDetail(@Param('id') id: string) {
    return this.ticketService.getTicketDetail(id);
  }

  /**
   * POST /tickets - Create new ticket
   */
  @Post()
  async createTicket(@Body() data: any) {
    return this.ticketService.createTicket(data);
  }

  /**
   * POST /tickets/bulk-create - Bulk create tickets
   */
  @Post('bulk-create')
  async bulkCreateTickets(@Body() data: { tickets: any[] }) {
    return this.ticketService.bulkCreateTickets(data.tickets);
  }

  /**
   * POST /tickets/:id/assign - Assign ticket to technician
   */
  @Post(':id/assign')
  async assignTicket(@Param('id') id: string, @Body() data: any) {
    return this.ticketService.assignTicket(id, data);
  }

  /**
   * PATCH /tickets/:id/status - Update ticket status
   */
  @Patch(':id/status')
  async updateTicketStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.ticketService.updateTicketStatus(id, data.status);
  }

  /**
   * PUT /tickets/:id - Update ticket
   */
  @Put(':id')
  async updateTicket(@Param('id') id: string, @Body() data: any) {
    return this.ticketService.updateTicket(id, data);
  }

  /**
   * DELETE /tickets/:id - Delete ticket
   */
  @Delete(':id')
  async deleteTicket(@Param('id') id: string) {
    return this.ticketService.deleteTicket(id);
  }
}
