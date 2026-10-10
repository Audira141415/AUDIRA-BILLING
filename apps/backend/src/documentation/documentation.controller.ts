import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('documentation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentationController {
  constructor(private readonly documentationService: DocumentationService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    return this.documentationService.findAll(category);
  }

  @Get('categories')
  async getCategories() {
    return this.documentationService.getCategories();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.documentationService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentationService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.documentationService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.documentationService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.documentationService.remove(id);
  }
}
