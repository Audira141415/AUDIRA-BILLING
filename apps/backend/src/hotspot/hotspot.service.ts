import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotspotService {
  private readonly logger = new Logger(HotspotService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Buat profil paket hotspot baru (Kecepatan, Durasi, Harga)
   */
  async createProfile(data: {
    name: string;
    price: number;
    duration: number; // Menit
    rateLimit?: string;
    sharedUsers?: number;
  }) {
    return this.prisma.hotspotProfile.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        rateLimit: data.rateLimit || '2M/2M',
        sharedUsers: data.sharedUsers || 1,
      },
    });
  }

  /**
   * Ambil daftar semua profil paket hotspot
   */
  async getProfiles() {
    let profiles = await this.prisma.hotspotProfile.findMany({
      include: {
        _count: {
          select: { vouchers: true },
        },
      },
      orderBy: { price: 'asc' },
    });

    // Seed profil default jika belum ada sama sekali
    if (profiles.length === 0) {
      await this.prisma.hotspotProfile.createMany({
        data: [
          { name: 'Paket 2 Jam Hemat', price: 3000, duration: 120, rateLimit: '3M/3M' },
          { name: 'Paket Harian (24 Jam)', price: 10000, duration: 1440, rateLimit: '5M/5M' },
          { name: 'Paket Mingguan (7 Hari)', price: 35000, duration: 10080, rateLimit: '5M/5M' },
          { name: 'Paket Bulanan Santai', price: 80000, duration: 43200, rateLimit: '7M/7M' },
        ],
      });
      profiles = await this.prisma.hotspotProfile.findMany({
        include: { _count: { select: { vouchers: true } } },
        orderBy: { price: 'asc' },
      });
    }

    return profiles;
  }

  /**
   * Generate Voucher Hotspot Massal (Batch Generation)
   */
  async generateVouchers(data: {
    profileId: string;
    count: number;
    prefix?: string;
  }) {
    const profile = await this.prisma.hotspotProfile.findUnique({
      where: { id: data.profileId },
    });

    if (!profile) {
      throw new NotFoundException('Profil paket hotspot tidak ditemukan');
    }

    const count = Math.min(Math.max(data.count || 10, 1), 500); // Maksimal 500 voucher per batch
    const batchCode = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const prefix = (data.prefix || 'ADR').toUpperCase();

    const voucherData = [];
    const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Karakter tanpa angka 0, 1, huruf I, O agar tidak membingungkan pembeli

    for (let i = 0; i < count; i++) {
      let randomCode = '';
      for (let j = 0; j < 5; j++) {
        randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const uniqueCode = `${prefix}${randomCode}`;

      voucherData.push({
        code: uniqueCode,
        username: uniqueCode.toLowerCase(),
        password: uniqueCode.toLowerCase(),
        profileId: profile.id,
        batchCode,
        status: 'ACTIVE',
      });
    }

    await this.prisma.hotspotVoucher.createMany({
      data: voucherData,
      skipDuplicates: true,
    });

    this.logger.log(`Generated ${count} hotspot vouchers in batch ${batchCode} for profile ${profile.name}`);

    return {
      success: true,
      message: `Berhasil membuat ${count} voucher hotspot dalam batch ${batchCode}`,
      batchCode,
      profileName: profile.name,
      price: profile.price,
      count,
    };
  }

  /**
   * Ambil data voucher per batch untuk dicetak di Print Studio
   */
  async getBatchVouchers(batchCode: string) {
    const vouchers = await this.prisma.hotspotVoucher.findMany({
      where: { batchCode },
      include: { profile: true },
      orderBy: { createdAt: 'asc' },
    });

    if (vouchers.length === 0) {
      throw new NotFoundException(`Batch ${batchCode} tidak ditemukan`);
    }

    return {
      batchCode,
      profile: vouchers[0].profile,
      total: vouchers.length,
      vouchers: vouchers.map((v) => ({
        id: v.id,
        code: v.code,
        username: v.username,
        password: v.password,
        status: v.status,
        loginUrl: `http://hotspot.audira.net/login?username=${v.username}&password=${v.password}`,
        qrData: `http://hotspot.audira.net/login?username=${v.username}&password=${v.password}`,
      })),
    };
  }

  /**
   * Statistik Ringkasan Hotspot Studio
   */
  async getStats() {
    const [totalVouchers, activeVouchers, usedVouchers, profilesCount] = await Promise.all([
      this.prisma.hotspotVoucher.count(),
      this.prisma.hotspotVoucher.count({ where: { status: 'ACTIVE' } }),
      this.prisma.hotspotVoucher.count({ where: { status: 'USED' } }),
      this.prisma.hotspotProfile.count(),
    ]);

    // Estimasi potensi pendapatan dari voucher
    const vouchers = await this.prisma.hotspotVoucher.findMany({
      include: { profile: true },
    });
    const totalPotentialRevenue = vouchers.reduce((sum, v) => sum + (v.profile?.price || 0), 0);
    const realizedRevenue = vouchers
      .filter((v) => v.status === 'USED')
      .reduce((sum, v) => sum + (v.profile?.price || 0), 0);

    // Ambil 5 batch cetak terakhir
    const recentBatches = await this.prisma.hotspotVoucher.groupBy({
      by: ['batchCode', 'profileId'],
      _count: { id: true },
      orderBy: { batchCode: 'desc' },
      take: 5,
    });

    return {
      totalVouchers,
      activeVouchers,
      usedVouchers,
      profilesCount,
      totalPotentialRevenue,
      realizedRevenue,
      recentBatches,
    };
  }
}
