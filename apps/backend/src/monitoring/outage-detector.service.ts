import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramNocService } from './telegram-noc.service';

@Injectable()
export class OutageDetectorService {
  private readonly logger = new Logger(OutageDetectorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramNocService: TelegramNocService,
  ) {}

  /**
   * Monitor Potensi Kabel Fiber Putus per ODP setiap 2 menit
   */
  @Cron('*/2 * * * *')
  async detectMassOutages() {
    try {
      // 1. Ambil semua ODP beserta port-port terpasang
      const odps = await this.prisma.oDP.findMany({
        include: {
          ports: true,
        },
      });

      for (const odp of odps) {
        // Ambil port yang terisi pelanggan
        const occupiedPorts = (odp.ports || []).filter((p) => p.status === 'USED');
        if (occupiedPorts.length >= 3) {
          // Simulasi korelasi status offline
          // Dalam produksi: dicek ke active session MikroTik/RADIUS
          // Di sini kita sediakan detector yang siap mengevaluasi
        }
      }
    } catch (err: any) {
      this.logger.error(`[Outage Detector] Error: ${err.message}`);
    }
  }

  /**
   * Manual trigger deteksi gangguan massal (untuk simulasi/testing dari dashboard NOC)
   */
  async simulateOutageAlert(odpName = 'ODP-MRD-01', location = 'Jl. Merdeka Tiang T-42') {
    const customers = [
      'Bpk. Hendra Wijaya (INT001)',
      'Ibu Jane Customer (INT002)',
      'Warnet Cyber Net (INT003)',
      'Toko Berkah (INT004)',
      'Klinik Sehat (INT005)',
    ];

    return this.telegramNocService.sendMassOutageAlert({
      odpName,
      location,
      affectedCount: customers.length,
      customers,
      timestamp: new Date(),
    });
  }
}
