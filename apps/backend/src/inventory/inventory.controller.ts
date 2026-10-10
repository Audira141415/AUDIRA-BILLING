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
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Create equipment
  @Post('equipment')
  async createEquipment(@Body() data: any) {
    try {
      const equipment = await this.inventoryService.createEquipment(data);
      return {
        success: true,
        message: 'Equipment created successfully',
        equipment,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all equipment
  @Get('equipment')
  async getAllEquipment(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
  ) {
    const equipment = await this.inventoryService.getAllEquipment({
      type,
      status,
      customerId,
    });
    return {
      success: true,
      equipment,
    };
  }

  // Get equipment by ID
  @Get('equipment/:id')
  async getEquipmentById(@Param('id') id: string) {
    const equipment = await this.inventoryService.getEquipmentById(id);
    return {
      success: true,
      equipment,
    };
  }

  // Update equipment
  @Put('equipment/:id')
  async updateEquipment(@Param('id') id: string, @Body() data: any) {
    try {
      const equipment = await this.inventoryService.updateEquipment(id, data);
      return {
        success: true,
        message: 'Equipment updated successfully',
        equipment,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Delete equipment
  @Delete('equipment/:id')
  async deleteEquipment(@Param('id') id: string) {
    try {
      await this.inventoryService.deleteEquipment(id);
      return {
        success: true,
        message: 'Equipment deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Assign equipment to customer
  @Post('equipment/:id/assign')
  async assignToCustomer(
    @Param('id') equipmentId: string,
    @Body() data: { customerId: string },
  ) {
    try {
      const equipment = await this.inventoryService.assignToCustomer(
        equipmentId,
        data.customerId,
      );
      return {
        success: true,
        message: 'Equipment assigned successfully',
        equipment,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Unassign equipment from customer
  @Post('equipment/:id/unassign')
  async unassignFromCustomer(@Param('id') equipmentId: string) {
    try {
      const equipment = await this.inventoryService.unassignFromCustomer(equipmentId);
      return {
        success: true,
        message: 'Equipment unassigned successfully',
        equipment,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get equipment by customer
  @Get('customer/:customerId/equipment')
  async getEquipmentByCustomer(@Param('customerId') customerId: string) {
    const equipment = await this.inventoryService.getEquipmentByCustomer(customerId);
    return {
      success: true,
      equipment,
    };
  }

  // Get available equipment
  @Get('available')
  async getAvailableEquipment(@Query('type') type?: string) {
    const equipment = await this.inventoryService.getAvailableEquipment(type);
    return {
      success: true,
      equipment,
    };
  }

  // Get statistics
  @Get('stats')
  async getStatistics() {
    const stats = await this.inventoryService.getStatistics();
    return {
      success: true,
      stats,
    };
  }

  // Create maintenance log
  @Post('maintenance')
  async createMaintenanceLog(@Body() data: any) {
    try {
      const log = await this.inventoryService.createMaintenanceLog(data);
      return {
        success: true,
        message: 'Maintenance scheduled successfully',
        log,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get maintenance logs
  @Get('maintenance')
  async getMaintenanceLogs(
    @Query('equipmentId') equipmentId?: string,
    @Query('status') status?: string,
    @Query('technicianId') technicianId?: string,
  ) {
    const logs = await this.inventoryService.getMaintenanceLogs({
      equipmentId,
      status,
      technicianId,
    });
    return {
      success: true,
      logs,
    };
  }

  // Update maintenance log
  @Put('maintenance/:id')
  async updateMaintenanceLog(@Param('id') id: string, @Body() data: any) {
    try {
      const log = await this.inventoryService.updateMaintenanceLog(id, data);
      return {
        success: true,
        message: 'Maintenance log updated successfully',
        log,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Complete maintenance
  @Post('maintenance/:id/complete')
  async completeMaintenance(@Param('id') id: string) {
    try {
      const log = await this.inventoryService.completeMaintenance(id);
      return {
        success: true,
        message: 'Maintenance completed successfully',
        log,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get upcoming maintenance
  @Get('maintenance/upcoming')
  async getUpcomingMaintenance() {
    const logs = await this.inventoryService.getUpcomingMaintenance();
    return {
      success: true,
      logs,
    };
  }

  // Search equipment
  @Get('search')
  async searchEquipment(@Query('q') query: string) {
    const equipment = await this.inventoryService.searchEquipment(query);
    return {
      success: true,
      equipment,
    };
  }

  // Bulk import
  @Post('equipment/bulk-import')
  async bulkImport(@Body() data: { equipment: any[] }) {
    try {
      const result = await this.inventoryService.bulkImport(data.equipment);
      return {
        success: true,
        message: 'Bulk import completed',
        result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
