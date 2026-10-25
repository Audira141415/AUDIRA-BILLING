import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OdpService } from './odp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('odp')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OdpController {
  constructor(private readonly odpService: OdpService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.odpService.findAll(search);
  }

  @Get('stats')
  async getStats() {
    return this.odpService.getStats();
  }

  @Get('topology')
  async getTopology() {
    return this.odpService.getTopology();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.odpService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.odpService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.odpService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.odpService.remove(id);
  }

  @Get(':id/ports')
  async getOdpPorts(@Param('id') id: string) {
    return this.odpService.getOdpPorts(id);
  }

  @Post(':id/ports/:portNumber/assign')
  async assignPort(
    @Param('id') id: string,
    @Param('portNumber') portNumber: string,
    @Body() data: any,
  ) {
    return this.odpService.assignPort(id, parseInt(portNumber, 10), data);
  }

  @Post(':id/ports/:portNumber/release')
  async releasePort(
    @Param('id') id: string,
    @Param('portNumber') portNumber: string,
  ) {
    return this.odpService.releasePort(id, parseInt(portNumber, 10));
  }

  @Get('geo/nearest')
  async findNearest(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.odpService.findNearest(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : 500,
    );
  }
}
