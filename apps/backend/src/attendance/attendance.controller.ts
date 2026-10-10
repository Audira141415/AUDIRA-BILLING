import { Controller, Get, Post, Body, Query, Param, Patch, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Check-in (masuk kerja)
  @Post('check-in')
  @Roles('admin', 'BILLING', 'TECHNICIAN')
  async checkIn(
    @Body('userId') userId: string,
    @Body('checkInPhoto') checkInPhoto?: string,
    @Body('latitude') latitude?: number,
    @Body('longitude') longitude?: number,
  ) {
    return await this.attendanceService.checkIn(userId, checkInPhoto, latitude, longitude);
  }

  // Check-out (pulang kerja)
  @Post('check-out')
  @Roles('admin', 'BILLING', 'TECHNICIAN')
  async checkOut(
    @Body('userId') userId: string,
    @Body('checkOutPhoto') checkOutPhoto?: string,
    @Body('latitude') latitude?: number,
    @Body('longitude') longitude?: number,
  ) {
    return await this.attendanceService.checkOut(userId, checkOutPhoto, latitude, longitude);
  }

  // Get attendance by date
  @Get()
  @Roles('admin', 'BILLING')
  async getAttendance(
    @Query('date') date?: string,
  ) {
    if (date) {
      return await this.attendanceService.getAttendanceByDate(date);
    }
    return await this.attendanceService.getTodayAttendance();
  }

  @Get('date/:date')
  async getAttendanceByDate(@Param('date') date: string) {
    return await this.attendanceService.getAttendanceByDate(date);
  }

  // Get today's attendance
  @Get('today')
  async getTodayAttendance() {
    return await this.attendanceService.getTodayAttendance();
  }

  // Get user attendance history
  @Get('user/:userId')
  async getUserAttendance(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.attendanceService.getUserAttendance(userId, startDate, endDate);
  }

  // Get attendance status for today (for specific user)
  @Get('status/:userId')
  async getAttendanceStatus(@Param('userId') userId: string) {
    return await this.attendanceService.getAttendanceStatus(userId);
  }

  // Get attendance statistics
  @Get('stats')
  async getAttendanceStats(@Query('date') date?: string) {
    return await this.attendanceService.getAttendanceStats(date);
  }

  // Update attendance status (admin only)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.attendanceService.updateStatus(id, status);
  }
}
