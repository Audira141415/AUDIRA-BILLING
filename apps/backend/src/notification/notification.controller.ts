import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('notification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Save device token
  @Post('register-token')
  async registerToken(@Body() data: { userId: string; token: string }) {
    await this.notificationService.saveDeviceToken(data.userId, data.token);
    return { success: true };
  }

  // Register device from mobile app
  @Post('register-device')
  async registerDevice(@Body() data: { token: string; platform: string; deviceId?: string }, @Body('userId') userId?: string) {
    // Extract userId from JWT token in real implementation
    const actualUserId = userId || 'current-user-id'; // Get from @CurrentUser() decorator
    await this.notificationService.saveDeviceToken(actualUserId, data.token);
    return { 
      success: true,
      message: 'Device registered successfully',
    };
  }

  // Send custom notification
  @Post('send')
  async sendNotification(@Body() data: any) {
    return await this.notificationService.sendPushNotification(data);
  }

  // Broadcast to all customers
  @Post('broadcast/customers')
  async broadcastToCustomers(@Body() data: { title: string; body: string; data?: any }) {
    await this.notificationService.broadcastToCustomers(data.title, data.body, data.data);
    return { success: true };
  }

  // Broadcast to all technicians
  @Post('broadcast/technicians')
  async broadcastToTechnicians(@Body() data: { title: string; body: string; data?: any }) {
    await this.notificationService.broadcastToTechnicians(data.title, data.body, data.data);
    return { success: true };
  }
}
