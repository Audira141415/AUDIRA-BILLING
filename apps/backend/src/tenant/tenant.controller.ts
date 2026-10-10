import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tenant')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // Create tenant
  @Post()
  async createTenant(@Body() data: any) {
    return await this.tenantService.createTenant(data);
  }

  // Get all tenants
  @Get()
  async getAllTenants(@Query('parentTenantId') parentTenantId?: string) {
    return await this.tenantService.getAllTenants(parentTenantId);
  }

  // Get tenant by ID
  @Get(':id')
  async getTenantById(@Param('id') id: string) {
    return await this.tenantService.getTenantById(id);
  }

  // Get tenant by slug
  @Get('slug/:slug')
  async getTenantBySlug(@Param('slug') slug: string) {
    return await this.tenantService.getTenantBySlug(slug);
  }

  // Update tenant
  @Put(':id')
  async updateTenant(@Param('id') id: string, @Body() data: any) {
    return await this.tenantService.updateTenant(id, data);
  }

  // Delete tenant
  @Delete(':id')
  async deleteTenant(@Param('id') id: string) {
    return await this.tenantService.deleteTenant(id);
  }

  // Add user to tenant
  @Post(':id/users')
  async addUserToTenant(
    @Param('id') id: string,
    @Body() data: { userId: string; role: string; permissions: string[] }
  ) {
    return await this.tenantService.addUserToTenant(
      id,
      data.userId,
      data.role,
      data.permissions
    );
  }

  // Remove user from tenant
  @Delete(':id/users/:userId')
  async removeUserFromTenant(@Param('id') id: string, @Param('userId') userId: string) {
    await this.tenantService.removeUserFromTenant(id, userId);
    return { success: true };
  }

  // Get tenant users
  @Get(':id/users')
  async getTenantUsers(@Param('id') id: string) {
    return await this.tenantService.getTenantUsers(id);
  }

  // Set permission
  @Post(':id/permissions')
  async setPermission(
    @Param('id') id: string,
    @Body() data: { resource: string; action: string; role: string }
  ) {
    return await this.tenantService.setTenantPermission(
      id,
      data.resource,
      data.action,
      data.role
    );
  }

  // Get permissions
  @Get(':id/permissions')
  async getPermissions(@Param('id') id: string, @Query('role') role?: string) {
    return await this.tenantService.getTenantPermissions(id, role);
  }

  // Check permission
  @Post(':id/check-permission')
  async checkPermission(
    @Param('id') id: string,
    @Body() data: { userId: string; resource: string; action: string }
  ) {
    const hasPermission = await this.tenantService.hasPermission(
      id,
      data.userId,
      data.resource,
      data.action
    );
    return { hasPermission };
  }

  // Calculate commission
  @Post(':id/commissions/calculate')
  async calculateCommission(
    @Param('id') id: string,
    @Body() data: { amount: number; sourceType: string; sourceId: string }
  ) {
    return await this.tenantService.calculateCommission(
      id,
      data.amount,
      data.sourceType,
      data.sourceId
    );
  }

  // Get commissions
  @Get(':id/commissions')
  async getCommissions(@Param('id') id: string, @Query('status') status?: string) {
    return await this.tenantService.getTenantCommissions(id, status);
  }

  // Pay commission
  @Post('commissions/:commissionId/pay')
  async payCommission(@Param('commissionId') commissionId: string) {
    return await this.tenantService.payCommission(commissionId);
  }

  // Get statistics
  @Get(':id/statistics')
  async getStatistics(@Param('id') id: string) {
    return await this.tenantService.getTenantStatistics(id);
  }

  // Get hierarchy
  @Get('hierarchy/tree')
  async getHierarchy(@Query('tenantId') tenantId?: string) {
    return await this.tenantService.getTenantHierarchy(tenantId);
  }

  // Clone settings
  @Post(':id/clone-settings')
  async cloneSettings(
    @Param('id') id: string,
    @Body('sourceTenantId') sourceTenantId: string
  ) {
    await this.tenantService.cloneTenantSettings(sourceTenantId, id);
    return { success: true };
  }
}
