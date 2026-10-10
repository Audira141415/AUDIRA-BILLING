import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RadiusService } from './radius.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('radius')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RadiusController {
  constructor(private readonly radiusService: RadiusService) {}

  /**
   * Create PPPoE user
   */
  @Post('users')
  async createUser(@Body() data: {
    username: string;
    password: string;
    profile?: string;
    rateLimit?: string;
    addressList?: string;
  }) {
    return this.radiusService.createUser(data);
  }

  /**
   * Test authentication
   */
  @Post('test-auth')
  async testAuth(@Body() data: { username: string; password: string }) {
    const success = await this.radiusService.testAuth(data.username, data.password);
    return { success, message: success ? 'Authentication successful' : 'Authentication failed' };
  }

  /**
   * Change bandwidth (CoA)
   */
  @Post('coa/bandwidth')
  async changeBandwidth(@Body() data: {
    username: string;
    speed: string;
    nasIp: string;
    nasSecret: string;
  }) {
    return this.radiusService.changeBandwidth(
      data.username,
      data.speed,
      data.nasIp,
      data.nasSecret,
    );
  }

  /**
   * Disconnect user
   */
  @Post('coa/disconnect')
  async disconnectUser(@Body() data: {
    username: string;
    nasIp: string;
    nasSecret: string;
  }) {
    return this.radiusService.disconnectUser(data.username, data.nasIp, data.nasSecret);
  }

  /**
   * Get active sessions
   */
  @Get('sessions')
  async getActiveSessions() {
    return this.radiusService.getActiveSessions();
  }

  /**
   * Get user statistics
   */
  @Get('stats/:username')
  async getUserStats(@Param('username') username: string) {
    return this.radiusService.getUserStats(username);
  }

  /**
   * Update user password
   */
  @Post('users/:username/password')
  async updatePassword(
    @Param('username') username: string,
    @Body() data: { newPassword: string },
  ) {
    return this.radiusService.updatePassword(username, data.newPassword);
  }

  /**
   * Delete user
   */
  @Delete('users/:username')
  async deleteUser(@Param('username') username: string) {
    return this.radiusService.deleteUser(username);
  }
}
