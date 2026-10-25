import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RadiusService } from '../radius/radius.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BoosterService implements OnModuleInit {
  private readonly logger = new Logger(BoosterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly radiusService: RadiusService,
    private readonly mikrotikService: MikrotikService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultPackages();
  }

  /**
   * Auto-seed default booster packages if none exist
   */
  async seedDefaultPackages() {
    try {
      const count = await this.prisma.boosterPackage.count();
      if (count === 0) {
        await this.prisma.boosterPackage.createMany({
          data: [
            {
              name: 'Turbo Kilat 6 Jam (50 Mbps)',
              speed: '50M/50M',
              duration: 6,
              price: 5000,
              description: 'Percepatan instan untuk download file besar & video call berkecepatan tinggi.',
              isActive: true,
            },
            {
              name: 'Turbo Harian 24 Jam (50 Mbps)',
              speed: '50M/50M',
              duration: 24,
              price: 15000,
              description: 'Akses 50 Mbps seharian penuh tanpa FUP.',
              isActive: true,
            },
            {
              name: 'Turbo Gamer 24 Jam (100 Mbps)',
              speed: '100M/100M',
              duration: 24,
              price: 25000,
              description: 'Ultra fast 100 Mbps dengan prioritas latency terendah untuk gaming & streaming 4K.',
              isActive: true,
            },
            {
              name: 'Turbo Weekend 48 Jam (50 Mbps)',
              speed: '50M/50M',
              duration: 48,
              price: 28000,
              description: 'Paket akhir pekan Sabtu & Minggu internet ngebut sekeluarga.',
              isActive: true,
            },
          ],
        });
        this.logger.log('Seeded 4 default Turbo Bandwidth Booster packages');
      }
    } catch (err: any) {
      this.logger.warn(`Booster package seeding error: ${err.message}`);
    }
  }

  /**
   * Get all active booster packages
   */
  async getPackages() {
    return this.prisma.boosterPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  /**
   * Aktivasi Turbo Booster On-Demand untuk pelanggan
   */
  async activateBooster(data: { customerId: string; packageId: string; notes?: string }) {
    let customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
      include: { packages: true },
    });

    if (!customer) {
      customer = await this.prisma.customer.findFirst({
        where: { internetNumber: data.customerId },
        include: { packages: true },
      });
    }

    if (!customer) {
      throw new Error('Pelanggan tidak ditemukan');
    }

    const boosterPkg = await this.prisma.boosterPackage.findUnique({
      where: { id: data.packageId },
    });

    if (!boosterPkg) {
      throw new Error('Paket Booster tidak ditemukan');
    }

    // Tentukan original speed (default 10M/10M jika belum ada paket)
    const originalSpeed = customer.packages && customer.packages.length > 0
      ? customer.packages[0].speed || '10M/10M'
      : '10M/10M';

    const now = new Date();
    const expiresAt = new Date(now.getTime() + boosterPkg.duration * 60 * 60 * 1000);

    // 1. Simpan record CustomerBooster
    const booster = await this.prisma.customerBooster.create({
      data: {
        customerId: customer.id,
        packageId: boosterPkg.id,
        originalSpeed,
        startedAt: now,
        expiresAt,
        status: 'ACTIVE',
      },
      include: { package: true },
    });

    // 2. Kirim sinyal RADIUS CoA / MikroTik Speed Boost on the fly!
    const username = customer.internetNumber || customer.phone || customer.email || '';
    if (username) {
      try {
        await this.radiusService.changeBandwidth(username, boosterPkg.speed);
        await this.mikrotikService.kickActiveSession(username);
        this.logger.log(`[Turbo Booster] Kecepatan ${username} di-boost ke ${boosterPkg.speed} hingga ${expiresAt.toISOString()}`);
      } catch (coaErr: any) {
        this.logger.warn(`Gagal kirim CoA Booster: ${coaErr.message}`);
      }
    }

    // 3. Kirim konfirmasi WhatsApp ke pelanggan
    try {
      const expStr = expiresAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB, ' +
                     expiresAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      await this.whatsappService.sendMessage({
        phone: customer.phone,
        message:
          `🚀 *TURBO BANDWIDTH BOOSTER AKTIF!*\n\n` +
          `Halo *${customer.name}*,\n` +
          `Paket booster internet Anda telah berhasil diaktifkan:\n` +
          `📦 *Paket*: ${boosterPkg.name}\n` +
          `⚡ *Kecepatan Baru*: ${boosterPkg.speed}\n` +
          `⏳ *Berlaku Hingga*: ${expStr}\n\n` +
          `Nikmati internet super cepat tanpa batas kuota! Kecepatan akan kembali normal secara otomatis setelah masa aktif berakhir.\n\n` +
          `_AUDIRA Digital Network_`,
      });
    } catch (waErr: any) {
      this.logger.warn(`Gagal kirim WA Booster: ${waErr.message}`);
    }

    return {
      success: true,
      message: `Turbo Booster ${boosterPkg.name} berhasil diaktifkan untuk ${customer.name}`,
      booster,
    };
  }

  /**
   * Cek Booster aktif untuk pelanggan
   */
  async getActiveBooster(customerId: string) {
    let customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      customer = await this.prisma.customer.findFirst({ where: { internetNumber: customerId } });
    }
    if (!customer) return null;

    return this.prisma.customerBooster.findFirst({
      where: {
        customerId: customer.id,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
      include: { package: true },
      orderBy: { expiresAt: 'desc' },
    });
  }

  /**
   * Riwayat pembelian booster
   */
  async getBoosterHistory(limit = 50) {
    return this.prisma.customerBooster.findMany({
      take: limit,
      include: {
        customer: { select: { id: true, name: true, internetNumber: true, phone: true } },
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Statistik Booster
   */
  async getStats() {
    const totalCount = await this.prisma.customerBooster.count();
    const activeCount = await this.prisma.customerBooster.count({
      where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
    });

    const boosters = await this.prisma.customerBooster.findMany({
      include: { package: true },
    });

    const totalRevenue = boosters.reduce((sum, b) => sum + (b.package?.price || 0), 0);

    return {
      totalCount,
      activeCount,
      totalRevenue,
    };
  }

  /**
   * Cron Recurring: Cek booster yang telah kadaluarsa & kembalikan speed via CoA
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkExpiredBoosters() {
    const expiredList = await this.prisma.customerBooster.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lte: new Date() },
      },
      include: {
        customer: true,
        package: true,
      },
    });

    if (expiredList.length === 0) return;

    this.logger.log(`[Booster Cron] Memproses ${expiredList.length} booster yang habis masa aktif...`);

    for (const b of expiredList) {
      try {
        // 1. Update status ke EXPIRED
        await this.prisma.customerBooster.update({
          where: { id: b.id },
          data: { status: 'EXPIRED' },
        });

        // 2. Revert speed via CoA
        const username = b.customer.internetNumber || b.customer.phone || '';
        if (username) {
          await this.radiusService.changeBandwidth(username, b.originalSpeed);
          await this.mikrotikService.kickActiveSession(username);
          this.logger.log(`[Booster Cron] Kecepatan ${username} dikembalikan ke ${b.originalSpeed}`);
        }

        // 3. Notifikasi ramah via WhatsApp
        await this.whatsappService.sendMessage({
          phone: b.customer.phone,
          message:
            `⏱️ *MASA AKTIF TURBO BOOSTER BERAKHIR*\n\n` +
            `Halo *${b.customer.name}*,\n` +
            `Masa aktif paket ${b.package.name} Anda telah berakhir. Kecepatan internet Anda telah kembali ke profil normal (*${b.originalSpeed}*).\n\n` +
            `Ingin internet ngebut lagi? Anda dapat membeli booster kapan saja melalui portal pelanggan atau CS kami.\n\n` +
            `Terima kasih! 🙏\n_AUDIRA Digital Network_`,
        });
      } catch (err: any) {
        this.logger.error(`Error reverting booster ${b.id}:`, err.message);
      }
    }
  }
}
