import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { RegisterPartnerDto } from './dto/register-partner.dto';
import {
  RequestWithdrawalDto,
  ApproveWithdrawalDto,
  RejectWithdrawalDto,
} from './dto/withdrawal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * 1. Public Endpoint: Pendaftaran mandiri mitra sales
   */
  @Post('register')
  async register(@Body() dto: RegisterPartnerDto) {
    return this.salesService.registerPartner(dto);
  }

  /**
   * 2. Admin: KPI Statistik Sales & Komisi
   */
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BILLING')
  async getAdminStats() {
    return this.salesService.getAdminStats();
  }

  /**
   * 3. Admin: Daftar semua mitra sales
   */
  @Get('admin/partners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BILLING')
  async getAllPartners(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.salesService.getAllPartners(status, search);
  }

  /**
   * 4. Admin: Update status mitra (Approve / Suspend / Rejected)
   */
  @Patch('admin/partners/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BILLING')
  async updatePartnerStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.salesService.updatePartnerStatus(id, status, notes);
  }

  /**
   * 5. Admin: Daftar pengajuan pencairan dana (Withdrawals)
   */
  @Get('admin/withdrawals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BILLING')
  async getWithdrawals(@Query('status') status?: string) {
    return this.salesService.getWithdrawals(status);
  }

  /**
   * 6. Admin: Setujui pencairan dana & simpan bukti transfer
   */
  @Post('admin/withdrawals/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BILLING')
  async approveWithdrawal(
    @Param('id') id: string,
    @Body() dto: ApproveWithdrawalDto,
    @Req() req: any,
  ) {
    const adminId = req.user?.id || 'admin';
    return this.salesService.approveWithdrawal(id, adminId, dto);
  }

  /**
   * 7. Admin: Tolak pencairan dana & kembalikan saldo
   */
  @Post('admin/withdrawals/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BILLING')
  async rejectWithdrawal(
    @Param('id') id: string,
    @Body() dto: RejectWithdrawalDto,
    @Req() req: any,
  ) {
    const adminId = req.user?.id || 'admin';
    return this.salesService.rejectWithdrawal(id, adminId, dto);
  }

  /**
   * 8. Admin: Riwayat mutasi buku kas komisi (Ledger)
   */
  @Get('admin/ledger')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BILLING')
  async getLedger(@Query('partnerId') partnerId?: string) {
    return this.salesService.getCommissionLedger(partnerId);
  }

  /**
   * 9. Mitra: Pengajuan pencairan saldo dari portal
   */
  @Post('partner/:partnerId/withdraw')
  async requestWithdrawal(
    @Param('partnerId') partnerId: string,
    @Body() dto: RequestWithdrawalDto,
  ) {
    return this.salesService.requestWithdrawal(partnerId, dto);
  }
}
