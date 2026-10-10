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
  PackageService, 
  CreatePackageDto, 
  UpdatePackageDto, 
  PackageQueryDto 
} from './package.service';

@Controller('packages')
@UseGuards(JwtAuthGuard)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
  })
)
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  async getPackages(@Query() query: PackageQueryDto) {
    return this.packageService.getPackages(query);
  }

  @Get('statistics/overview')
  async getStatistics() {
    return this.packageService.getPackageStatistics();
  }

  @Get('available')
  async getAvailablePackages() {
    return this.packageService.getAvailablePackages();
  }

  @Get(':id')
  async getPackageDetail(@Param('id') id: string) {
    return this.packageService.getPackageDetail(id);
  }

  @Post()
  async createPackage(@Body() data: CreatePackageDto) {
    return this.packageService.createPackage(data);
  }

  @Post('bulk-import')
  async bulkImport(@Body('packages') packages: CreatePackageDto[]) {
    return this.packageService.bulkImportPackages(packages);
  }

  @Put(':id')
  async updatePackage(@Param('id') id: string, @Body() data: UpdatePackageDto) {
    return this.packageService.updatePackage(id, data);
  }

  @Delete(':id')
  async deletePackage(@Param('id') id: string) {
    return this.packageService.deletePackage(id);
  }
}
