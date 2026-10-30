import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FieldServiceService } from './field-service.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('field-service')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FieldServiceController {
  constructor(private readonly fieldServiceService: FieldServiceService) {}

  // Create work order
  @Post('jobs')
  async createWorkOrder(@Body() data: any) {
    return await this.fieldServiceService.createWorkOrder(data);
  }

  // Create emergency splicing work order (OTDR Dispatch)
  @Post('emergency-splicing-spk')
  async createEmergencySplicingSpk(@Body() data: any) {
    return await this.fieldServiceService.createEmergencySplicingSpk(data);
  }

  // Get Splicing Matrix
  @Get('splicing-matrix')
  async getSplicingMatrix(@Query('tubeId') tubeId?: number) {
    return this.fieldServiceService.getSplicingMatrix(Number(tubeId) || 1);
  }

  // Update Splicing Matrix
  @Post('splicing-matrix')
  async updateSplicingMatrix(@Body('cores') cores: any[]) {
    return this.fieldServiceService.updateSplicingMatrix(cores);
  }

  // Get all work orders with filters
  @Get('jobs')
  async getAllWorkOrders(
    @Query('status') status?: string,
    @Query('technicianId') technicianId?: string,
    @Query('customerId') customerId?: string,
    @Query('type') type?: string,
    @Query('priority') priority?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (technicianId) filters.technicianId = technicianId;
    if (customerId) filters.customerId = customerId;
    if (type) filters.type = type;
    if (priority) filters.priority = priority;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return await this.fieldServiceService.getAllWorkOrders(filters);
  }

  // Get work order by ID
  @Get('jobs/:id')
  async getWorkOrderById(@Param('id') id: string) {
    return await this.fieldServiceService.getWorkOrderById(id);
  }

  // Update work order
  @Put('jobs/:id')
  async updateWorkOrder(@Param('id') id: string, @Body() data: any) {
    return await this.fieldServiceService.updateWorkOrder(id, data);
  }

  // Assign technician
  @Put('jobs/:id/assign')
  async assignTechnician(@Param('id') id: string, @Body('technicianId') technicianId: string) {
    return await this.fieldServiceService.assignTechnician(id, technicianId);
  }

  // Update status
  @Put('jobs/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.fieldServiceService.updateStatus(id, status);
  }

  // Start work order
  @Post('jobs/:id/start')
  async startWorkOrder(
    @Param('id') id: string,
    @Body('latitude') latitude?: number,
    @Body('longitude') longitude?: number,
    @Body('checkInPhoto') checkInPhoto?: string,
  ) {
    return await this.fieldServiceService.startWorkOrder(id, latitude, longitude, checkInPhoto);
  }

  // Upload check-in photo
  @Post('jobs/:id/check-in-photo')
  async uploadCheckInPhoto(@Param('id') id: string, @Body('photo') photo: string) {
    return await this.fieldServiceService.uploadCheckInPhoto(id, photo);
  }

  // Complete work order
  @Post('jobs/:id/complete')
  async completeWorkOrder(@Param('id') id: string, @Body() data: any) {
    return await this.fieldServiceService.completeWorkOrder(id, data);
  }

  // Cancel work order
  @Post('jobs/:id/cancel')
  async cancelWorkOrder(@Param('id') id: string, @Body('reason') reason: string) {
    return await this.fieldServiceService.cancelWorkOrder(id, reason);
  }

  // Upload photos
  @Post('jobs/:id/photos')
  async uploadPhotos(@Param('id') id: string, @Body('photoUrls') photoUrls: string[]) {
    return await this.fieldServiceService.uploadPhotos(id, photoUrls);
  }

  // Add signature
  @Post('jobs/:id/signature')
  async addSignature(@Param('id') id: string, @Body('signature') signature: string) {
    return await this.fieldServiceService.addSignature(id, signature);
  }

  // Add feedback
  @Post('jobs/:id/feedback')
  async addFeedback(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Body('feedback') feedback: string,
  ) {
    return await this.fieldServiceService.addFeedback(id, rating, feedback);
  }

  // Update live GPS location of technician
  @Post('technician/location')
  async updateTechnicianLocation(
    @Body() body: { technicianId: string; technicianName?: string; latitude: number; longitude: number; status?: string },
  ) {
    return this.fieldServiceService.broadcastTechnicianLocation(body);
  }

  // Get technician's work orders
  @Get('technician/:id/jobs')
  async getTechnicianWorkOrders(@Param('id') id: string, @Query('status') status?: string) {
    return await this.fieldServiceService.getWorkOrdersByTechnician(id, status);
  }

  // Get today's work orders for technician
  @Get('technician/:id/today')
  async getTodayWorkOrders(@Param('id') id: string) {
    return await this.fieldServiceService.getTodayWorkOrders(id);
  }

  // Get statistics
  @Get('stats')
  async getStatistics(@Query('technicianId') technicianId?: string) {
    return await this.fieldServiceService.getStatistics(technicianId);
  }

  // Get upcoming work orders
  @Get('upcoming')
  async getUpcomingWorkOrders(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 7;
    return await this.fieldServiceService.getUpcomingWorkOrders(daysNumber);
  }

  // Optimize route
  @Post('optimize-route')
  async optimizeRoute(@Body('workOrderIds') workOrderIds: string[]) {
    return await this.fieldServiceService.optimizeRoute(workOrderIds);
  }

  // Get customer work order history
  @Get('customer/:id/history')
  async getCustomerHistory(@Param('id') id: string) {
    return await this.fieldServiceService.getCustomerHistory(id);
  }

  // Get check-in history
  @Get('check-in-history')
  async getCheckInHistory(@Query('date') date?: string) {
    return await this.fieldServiceService.getCheckInHistory(date);
  }

  // Update QC Status & sign-off
  @Put('jobs/:id/qc')
  async updateQCStatus(
    @Param('id') id: string,
    @Body('qcStatus') qcStatus: string,
    @Body('qcNotes') qcNotes?: string,
  ) {
    return await this.fieldServiceService.updateQCStatus(id, qcStatus, qcNotes);
  }

  // Real-time Optical Power Measurement
  @Post('jobs/:id/optical-test')
  async testOpticalPower(@Param('id') id: string) {
    return await this.fieldServiceService.testOpticalPower(id);
  }
}
