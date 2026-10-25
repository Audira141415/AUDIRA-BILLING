import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { RegisterPartnerDto } from './dto/register-partner.dto';
import { RequestWithdrawalDto, ApproveWithdrawalDto, RejectWithdrawalDto } from './dto/withdrawal.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  /**
   * Format nomor telepon ke standar internasional Indonesia (62xxx)
   */
  private formatPhone(phone: string): string {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (!clean.startsWith('62')) {
      clean = '62' + clean;
    }
    return clean;
  }

  /**
   * Generate kode referral unik untuk mitra baru
   */
  private async generateUniqueCode(name: string): Promise<string> {
    const prefix = name
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 4)
      .toUpperCase() || 'ADR';

    for (let i = 0; i < 10; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = `${prefix}${randomSuffix}`;
      const existing = await this.prisma.salesPartner.findUnique({ where: { code } });
      if (!existing) return code;
    }
    return `ADR${Date.now().toString().slice(-6)}`;
  }

  /**
   * Pendaftaran mandiri mitra baru dari portal publik /sales/daftar
   */
  async registerPartner(dto: RegisterPartnerDto) {
    const formattedPhone = this.formatPhone(dto.phone);

    const existingPhone = await this.prisma.salesPartner.findUnique({
      where: { phone: formattedPhone },
    });
    if (existingPhone) {
      throw new BadRequestException('Nomor WhatsApp sudah terdaftar sebagai Mitra Sales.');
    }

    if (dto.email) {
      const existingEmail = await this.prisma.salesPartner.findUnique({
        where: { email: dto.email.toLowerCase() },
      });
      if (existingEmail) {
        throw new BadRequestException('Alamat email sudah terdaftar.');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const referralCode = await this.generateUniqueCode(dto.name);

    const partner = await this.prisma.salesPartner.create({
      data: {
        code: referralCode,
        name: dto.name,
        phone: formattedPhone,
        email: dto.email ? dto.email.toLowerCase() : null,
        password: hashedPassword,
        zone: dto.zone || null,
        bio: dto.bio || null,
        bankName: dto.bankName || null,
        bankAccount: dto.bankAccount || null,
        bankAccountName: dto.bankAccountName || null,
        status: 'PENDING',
        balance: 0,
        pendingBalance: 0,
      },
    });

    // Kirim notifikasi WhatsApp sambutan pendaftaran
    try {
      await this.whatsappService.sendMessage({
        phone: partner.phone,
        message:
          `Halo *${partner.name}*!\n\n` +
          `Terima kasih telah mendaftar sebagai *Mitra Sales AUDIRA Digital Network*.\n\n` +
          `📌 *Kode Referral Anda*: ${partner.code}\n` +
          `⏳ *Status*: Menunggu Verifikasi Admin\n\n` +
          `Tim AUDIRA akan segera memverifikasi akun Anda. Anda akan menerima pesan konfirmasi begitu akun diaktifkan.`,
      });
    } catch (err) {
      this.logger.warn(`Gagal mengirim WhatsApp pendaftaran ke ${partner.phone}: ${err.message}`);
    }

    return {
      success: true,
      message: 'Pendaftaran berhasil! Akun Anda sedang dalam proses verifikasi tim AUDIRA.',
      data: {
        id: partner.id,
        code: partner.code,
        name: partner.name,
        phone: partner.phone,
        status: partner.status,
      },
    };
  }

  /**
   * KPI Dashboard Ringkasan Sales Admin
   */
  async getAdminStats() {
    const [
      pendingPartners,
      pendingWithdrawals,
      activePartners,
      balanceAggregate,
      totalCommissionsPaid,
    ] = await Promise.all([
      this.prisma.salesPartner.count({ where: { status: 'PENDING' } }),
      this.prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.salesPartner.count({ where: { status: 'ACTIVE' } }),
      this.prisma.salesPartner.aggregate({ _sum: { balance: true } }),
      this.prisma.commissionLedger.aggregate({
        where: { type: 'CREDIT_PSB' },
        _sum: { amount: true },
      }),
    ]);

    return {
      success: true,
      data: {
        pendingPartners,
        pendingWithdrawals,
        activePartners,
        totalBalanceHeld: balanceAggregate._sum.balance || 0,
        totalCommissionsPaid: totalCommissionsPaid._sum.amount || 0,
      },
    };
  }

  /**
   * Ambil daftar semua mitra sales untuk admin
   */
  async getAllPartners(status?: string, search?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { zone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const partners = await this.prisma.salesPartner.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        name: true,
        phone: true,
        email: true,
        zone: true,
        status: true,
        balance: true,
        pendingBalance: true,
        bankName: true,
        bankAccount: true,
        bankAccountName: true,
        createdAt: true,
        _count: {
          select: {
            leads: true,
            commissions: true,
            withdrawals: true,
          },
        },
      },
    });

    return {
      success: true,
      data: partners,
    };
  }

  /**
   * Update status mitra (Approve / Suspend / Tolak)
   */
  async updatePartnerStatus(id: string, status: string, notes?: string) {
    const partner = await this.prisma.salesPartner.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Mitra sales tidak ditemukan.');
    }

    const updated = await this.prisma.salesPartner.update({
      where: { id },
      data: { status },
    });

    // Kirim notifikasi WhatsApp saat status berubah
    if (status === 'ACTIVE') {
      try {
        await this.whatsappService.sendMessage({
          phone: updated.phone,
          message:
            `🎉 *SELAMAT! AKUN MITRA SALES AUDIRA TELAH AKTIF!*\n\n` +
            `Halo *${updated.name}*,\n` +
            `Akun kemitraan Anda telah disetujui oleh manajemen AUDIRA.\n\n` +
            `🔑 *Kode Referral*: ${updated.code}\n` +
            `🌐 *Link Pendaftaran Pelanggan*: https://audira.my.id/daftar?ref=${updated.code}\n\n` +
            `Ajak tetangga dan rekan Anda untuk berlangganan internet cepat AUDIRA dan nikmati komisi di setiap pemasangan!`,
        });
      } catch (err) {
        this.logger.warn(`Gagal kirim WA approval: ${err.message}`);
      }
    }

    return {
      success: true,
      message: `Status mitra berhasil diperbarui menjadi ${status}`,
      data: updated,
    };
  }

  /**
   * Ambil daftar pengajuan pencairan dana (Withdrawals)
   */
  async getWithdrawals(status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const list = await this.prisma.withdrawalRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        salesPartner: {
          select: {
            id: true,
            name: true,
            phone: true,
            code: true,
            balance: true,
          },
        },
      },
    });

    return {
      success: true,
      data: list,
    };
  }

  /**
   * Persetujuan payout & upload bukti transfer
   */
  async approveWithdrawal(
    id: string,
    adminId: string,
    dto: ApproveWithdrawalDto,
  ) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { salesPartner: true },
    });

    if (!withdrawal) {
      throw new NotFoundException('Pengajuan pencairan tidak ditemukan.');
    }
    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException('Pengajuan ini telah diproses sebelumnya.');
    }

    // Eksekusi update status withdrawal & catat ledger
    const updated = await this.prisma.$transaction(async (tx) => {
      const wr = await tx.withdrawalRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          transferReceipt: dto.transferReceipt || null,
          notes: dto.notes || null,
          approvedBy: adminId,
          approvedAt: new Date(),
        },
      });

      // Catat ke ledger mutasi debit
      await tx.commissionLedger.create({
        data: {
          salesPartnerId: withdrawal.salesPartnerId,
          type: 'DEBIT_WITHDRAW',
          amount: withdrawal.amount,
          status: 'PAID',
          description: `Pencairan Komisi ke ${withdrawal.bankName} - ${withdrawal.bankAccount} a.n ${withdrawal.bankAccountName}`,
        },
      });

      return wr;
    });

    // Kirim bukti/konfirmasi WhatsApp ke Mitra
    try {
      await this.whatsappService.sendMessage({
        phone: withdrawal.salesPartner.phone,
        message:
          `✅ *PENCAIRAN KOMISI SELESAI!*\n\n` +
          `Halo *${withdrawal.salesPartner.name}*,\n` +
          `Pencairan dana sebesar *Rp ${withdrawal.amount.toLocaleString('id-ID')}* telah berhasil ditransfer ke rekening:\n` +
          `🏦 *Bank/E-Wallet*: ${withdrawal.bankName}\n` +
          `🔢 *No. Rekening*: ${withdrawal.bankAccount}\n` +
          `👤 *Nama*: ${withdrawal.bankAccountName}\n\n` +
          `Terima kasih atas dedikasi dan kolaborasi Anda bersama AUDIRA Digital Network!`,
      });
    } catch (err) {
      this.logger.warn(`Gagal kirim WA payout confirmation: ${err.message}`);
    }

    return {
      success: true,
      message: 'Pencairan komisi berhasil disetujui dan dicatat.',
      data: updated,
    };
  }

  /**
   * Penolakan pengajuan pencairan dana (Saldo dikembalikan)
   */
  async rejectWithdrawal(id: string, adminId: string, dto: RejectWithdrawalDto) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { salesPartner: true },
    });

    if (!withdrawal) {
      throw new NotFoundException('Pengajuan pencairan tidak ditemukan.');
    }
    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException('Pengajuan ini telah diproses sebelumnya.');
    }

    // Kembalikan saldo mitra
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.salesPartner.update({
        where: { id: withdrawal.salesPartnerId },
        data: { balance: { increment: withdrawal.amount } },
      });

      return tx.withdrawalRequest.update({
        where: { id },
        data: {
          status: 'REJECTED',
          notes: dto.reason,
          approvedBy: adminId,
          approvedAt: new Date(),
        },
      });
    });

    // Notifikasi WhatsApp alasan penolakan
    try {
      await this.whatsappService.sendMessage({
        phone: withdrawal.salesPartner.phone,
        message:
          `⚠️ *PEMBERITAHUAN PENCAIRAN SALDO*\n\n` +
          `Halo *${withdrawal.salesPartner.name}*,\n` +
          `Pengajuan pencairan dana Rp ${withdrawal.amount.toLocaleString('id-ID')} belum dapat diproses.\n\n` +
          `📌 *Alasan*: ${dto.reason}\n\n` +
          `Saldo komisi telah dikembalikan utuh ke dompet akun Anda. Silakan hubungi admin jika membutuhkan bantuan.`,
      });
    } catch (err) {
      this.logger.warn(`Gagal kirim WA penolakan payout: ${err.message}`);
    }

    return {
      success: true,
      message: 'Pengajuan pencairan telah ditolak dan saldo dikembalikan ke dompet mitra.',
      data: updated,
    };
  }

  /**
   * Riwayat Buku Kas Mutasi Komisi (Ledger)
   */
  async getCommissionLedger(partnerId?: string) {
    const where: any = {};
    if (partnerId) {
      where.salesPartnerId = partnerId;
    }

    const ledgers = await this.prisma.commissionLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        salesPartner: {
          select: {
            id: true,
            name: true,
            code: true,
            phone: true,
          },
        },
      },
    });

    return {
      success: true,
      data: ledgers,
    };
  }

  /**
   * Request pencairan dana dari sisi Mitra Sales
   */
  async requestWithdrawal(partnerId: string, dto: RequestWithdrawalDto) {
    const partner = await this.prisma.salesPartner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException('Mitra sales tidak ditemukan.');
    }
    if (partner.status !== 'ACTIVE') {
      throw new BadRequestException('Akun mitra Anda belum aktif atau sedang disuspend.');
    }
    if (partner.balance < dto.amount) {
      throw new BadRequestException(`Saldo dompet tidak mencukupi (Tersedia: Rp ${partner.balance.toLocaleString('id-ID')}).`);
    }

    // Transaksi potong saldo & buat tiket withdrawal
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.salesPartner.update({
        where: { id: partnerId },
        data: { balance: { decrement: dto.amount } },
      });

      return tx.withdrawalRequest.create({
        data: {
          salesPartnerId: partnerId,
          amount: dto.amount,
          bankName: dto.bankName,
          bankAccount: dto.bankAccount,
          bankAccountName: dto.bankAccountName,
          status: 'PENDING',
        },
      });
    });

    return {
      success: true,
      message: 'Permintaan pencairan berhasil diajukan dan sedang diverifikasi oleh tim Finance AUDIRA.',
      data: result,
    };
  }

  /**
   * Trigger Komisi PSB Otomatis saat Invoice Pertama / PSB Pelanggan LUNAS
   */
  async triggerPsbCommission(invoiceId: string, customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        salesPartner: true,
        packages: true,
      },
    });

    if (!customer || !customer.salesPartnerId || !customer.salesPartner) {
      return { triggered: false, reason: 'Pelanggan tidak terikat mitra sales' };
    }

    if (customer.salesPartner.status !== 'ACTIVE') {
      return { triggered: false, reason: 'Status mitra sales tidak aktif' };
    }

    // Cek apakah invoice ini sudah pernah diklaim di ledger
    const existingLedger = await this.prisma.commissionLedger.findFirst({
      where: {
        invoiceId,
        salesPartnerId: customer.salesPartnerId,
        type: 'CREDIT_PSB',
      },
    });

    if (existingLedger) {
      return { triggered: false, reason: 'Komisi untuk invoice ini sudah pernah dicatat' };
    }

    // Tentukan nominal komisi
    const pkg = customer.packages?.[0];
    const commissionAmount = pkg?.salesCommission && pkg.salesCommission > 0
      ? pkg.salesCommission
      : 50000; // Default Rp 50.000 per PSB

    await this.prisma.$transaction([
      this.prisma.commissionLedger.create({
        data: {
          salesPartnerId: customer.salesPartnerId,
          customerId: customer.id,
          packageId: pkg?.id || null,
          invoiceId,
          type: 'CREDIT_PSB',
          amount: commissionAmount,
          status: 'AVAILABLE',
          description: `Komisi PSB Pelanggan ${customer.name} (${pkg?.name || 'Paket Internet'})`,
        },
      }),
      this.prisma.salesPartner.update({
        where: { id: customer.salesPartnerId },
        data: { balance: { increment: commissionAmount } },
      }),
    ]);

    // Kirim notifikasi WhatsApp otomatis
    try {
      await this.whatsappService.sendMessage({
        phone: customer.salesPartner.phone,
        message:
          `🎉 *KABAR GEMBIRA - KOMISI PSB CAIR!*\n\n` +
          `Halo *${customer.salesPartner.name}*,\n` +
          `Pelanggan yang Anda referensikan: *${customer.name}* telah melunasi biaya instalasi/PSB.\n\n` +
          `💰 *Bonus Komisi*: Rp ${commissionAmount.toLocaleString('id-ID')}\n` +
          `💵 *Saldo Dompet Baru*: Rp ${(customer.salesPartner.balance + commissionAmount).toLocaleString('id-ID')}\n\n` +
          `Terima kasih atas kerja keras Anda bersama AUDIRA Digital Network!`,
      });
    } catch (err) {
      this.logger.warn(`Gagal kirim notifikasi komisi cair ke ${customer.salesPartner.phone}: ${err.message}`);
    }

    return {
      triggered: true,
      partner: customer.salesPartner.name,
      amount: commissionAmount,
    };
  }
}
