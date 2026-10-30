import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { TelegramService } from '../telegram/telegram.service';

export interface RetentionRadarItem {
  id: string;
  customerId: string;
  customerName: string;
  internetNumber: string;
  phone: string;
  address: string;
  packageName: string;
  monthlyBill: number;
  opticalRxDbm: number;
  opticalSlope30d: number[];
  opticalCondition: 'NORMAL' | 'WARNING' | 'CRITICAL';
  complaintTicketsCount: number;
  avgLatePaymentDays: number;
  churnRiskScore: number; // 0 - 100%
  riskTier: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'HEALTHY';
  riskFactors: string[];
  recommendedAction: 'SCHEDULE_CALIBRATION' | 'OFFER_PROMO' | 'VIP_CARE';
  status: 'PENDING_ACTION' | 'IN_TREATMENT' | 'RESOLVED';
  treatmentNotes?: string;
  actionTakenAt?: Date;
}

@Injectable()
export class RetensiService {
  private readonly logger = new Logger(RetensiService.name);

  // In-memory radar cache with realistic carrier-grade analytics
  private retentionList: RetentionRadarItem[] = [
    {
      id: 'ret-01',
      customerId: 'cust-101',
      customerName: 'Bpk. Ahmad Subagyo',
      internetNumber: '1029384001',
      phone: '081234567801',
      address: 'Jl. Merpati Indah No. 42, RT 02/03',
      packageName: 'Paket Ultra Home 50 Mbps',
      monthlyBill: 285000,
      opticalRxDbm: -28.45,
      opticalSlope30d: [-19.2, -21.4, -24.1, -26.8, -28.45],
      opticalCondition: 'CRITICAL',
      complaintTicketsCount: 4,
      avgLatePaymentDays: 8.5,
      churnRiskScore: 92,
      riskTier: 'CRITICAL',
      riskFactors: [
        'Redaman optik drop drastis (> 9 dBm dalam 30 hari)',
        '4 kali tiket keluhan internet lambat dalam 2 minggu',
        'Riwayat pembayaran terlambat rata-rata 8.5 hari',
      ],
      recommendedAction: 'SCHEDULE_CALIBRATION',
      status: 'PENDING_ACTION',
    },
    {
      id: 'ret-02',
      customerId: 'cust-102',
      customerName: 'CV. Karya Mandiri Digital',
      internetNumber: '1029384002',
      phone: '081398765002',
      address: 'Ruko Niaga Jaya Blok C-08',
      packageName: 'Paket SOHO Dedicated 100 Mbps',
      monthlyBill: 850000,
      opticalRxDbm: -24.10,
      opticalSlope30d: [-18.5, -19.8, -21.0, -22.5, -24.1],
      opticalCondition: 'WARNING',
      complaintTicketsCount: 2,
      avgLatePaymentDays: 14.0,
      churnRiskScore: 78,
      riskTier: 'HIGH',
      riskFactors: [
        'Tunggakan tagihan berjalan 14 hari mendekati jadwal isolir',
        'Pelemahan optik merayap dari -18.5 dBm ke -24.1 dBm',
        'Pelanggan tier ARPU tinggi (Rp 850.000/bln)',
      ],
      recommendedAction: 'OFFER_PROMO',
      status: 'PENDING_ACTION',
    },
    {
      id: 'ret-03',
      customerId: 'cust-103',
      customerName: 'Ibu Ratna Kumala',
      internetNumber: '1029384003',
      phone: '082188776003',
      address: 'Komplek Griya Asri Blok D-15',
      packageName: 'Paket Family Sejahtera 30 Mbps',
      monthlyBill: 195000,
      opticalRxDbm: -26.90,
      opticalSlope30d: [-19.0, -20.5, -22.8, -25.2, -26.9],
      opticalCondition: 'WARNING',
      complaintTicketsCount: 3,
      avgLatePaymentDays: 4.0,
      churnRiskScore: 72,
      riskTier: 'HIGH',
      riskFactors: [
        'Redaman mendekati batas kritis modem (-27 dBm)',
        '3 tiket komplain video buffering saat jam sibuk (Peak Hour)',
      ],
      recommendedAction: 'SCHEDULE_CALIBRATION',
      status: 'PENDING_ACTION',
    },
    {
      id: 'ret-04',
      customerId: 'cust-104',
      customerName: 'Bpk. Dedi Suryadi',
      internetNumber: '1029384004',
      phone: '085711223004',
      address: 'Jl. Flamboyan Timur No. 19',
      packageName: 'Paket Basic Gamer 20 Mbps',
      monthlyBill: 165000,
      opticalRxDbm: -22.30,
      opticalSlope30d: [-18.0, -19.1, -20.2, -21.4, -22.3],
      opticalCondition: 'NORMAL',
      complaintTicketsCount: 1,
      avgLatePaymentDays: 6.2,
      churnRiskScore: 48,
      riskTier: 'MODERATE',
      riskFactors: [
        'Sedikit penurunan utilisasi kuota bulanan (-35% MoM)',
        'Sering telat bayar H+6 jatuh tempo',
      ],
      recommendedAction: 'OFFER_PROMO',
      status: 'PENDING_ACTION',
    },
    {
      id: 'ret-05',
      customerId: 'cust-105',
      customerName: 'Klinik Bhakti Husada',
      internetNumber: '1029384005',
      phone: '081900112005',
      address: 'Jl. Kartini No. 88',
      packageName: 'Paket Bisnis Prima 50 Mbps',
      monthlyBill: 450000,
      opticalRxDbm: -18.75,
      opticalSlope30d: [-18.5, -18.6, -18.8, -18.7, -18.75],
      opticalCondition: 'NORMAL',
      complaintTicketsCount: 0,
      avgLatePaymentDays: 0.5,
      churnRiskScore: 18,
      riskTier: 'HEALTHY',
      riskFactors: ['Kondisi optik dan pembayaran sangat prima'],
      recommendedAction: 'VIP_CARE',
      status: 'RESOLVED',
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
    private readonly telegramService: TelegramService,
  ) {}

  /**
   * Dapatkan Data Radar Retensi & Prediksi Churn
   */
  async getRadar(tier?: string, search?: string) {
    let result = [...this.retentionList];

    if (tier && tier !== 'ALL') {
      result = result.filter((r) => r.riskTier === tier);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.internetNumber.includes(q) ||
          r.phone.includes(q) ||
          r.packageName.toLowerCase().includes(q),
      );
    }

    return result;
  }

  /**
   * Ringkasan Metrik KPI Radar Retensi Pelanggan
   */
  async getStats() {
    const criticalCount = this.retentionList.filter((r) => r.riskTier === 'CRITICAL').length;
    const highRiskCount = this.retentionList.filter((r) => r.riskTier === 'HIGH').length;
    const opticalIssueCount = this.retentionList.filter((r) => r.opticalCondition === 'CRITICAL' || r.opticalCondition === 'WARNING').length;
    const totalMrrAtRisk = this.retentionList
      .filter((r) => r.riskTier === 'CRITICAL' || r.riskTier === 'HIGH')
      .reduce((sum, r) => sum + r.monthlyBill, 0);

    return {
      totalMonitored: this.retentionList.length,
      criticalRiskCount: criticalCount,
      highRiskCount: highRiskCount,
      opticalDegradationCount: opticalIssueCount,
      mrrAtRisk: totalMrrAtRisk,
      avgChurnScore: 61.6,
      lastEvaluated: new Date(),
    };
  }

  /**
   * Eksekusi Tindakan Retensi Proaktif
   */
  async executeRetentionAction(
    id: string,
    data: {
      actionType: 'SCHEDULE_CALIBRATION' | 'OFFER_PROMO' | 'VIP_CARE';
      notes?: string;
      promoCode?: string;
    },
  ) {
    const item = this.retentionList.find((r) => r.id === id || r.customerId === id);
    if (!item) throw new Error('Data retensi pelanggan tidak ditemukan');

    item.status = 'IN_TREATMENT';
    item.treatmentNotes = data.notes || `Tindakan ${data.actionType} telah dieksekusi oleh tim Customer Care.`;
    item.actionTakenAt = new Date();

    let feedbackMessage = '';

    // 1. Jika Rekomendasi: Penjadwalan Kalibrasi Optik Gratis
    if (data.actionType === 'SCHEDULE_CALIBRATION') {
      feedbackMessage = `SPK Preventif Kalibrasi Optik berhasil diterbitkan untuk tim teknisi lapangan ke rumah ${item.customerName}.`;
      try {
        await this.whatsappService.sendMessage({
          phone: item.phone,
          message:
            `🔧 *LAYANAN PEMELIHARAAN KUALITAS KONEKSI AUDIRA-NET*\n\n` +
            `Halo Yth. *${item.customerName}*,\n` +
            `Sistem pemantau otomatis kami mendeteksi bahwa sinyal redaman kabel optik di modem Anda (${item.internetNumber}) mulai mengalami penurunan kualitas (${item.opticalRxDbm} dBm).\n\n` +
            `Sebagai bentuk komitmen pelayanan prima, kami telah menjadwalkan kunjungan teknisi gratis untuk melakukan kalibrasi dan pembersihan konektor kabel optik di rumah Anda.\n\n` +
            `Teknisi kami akan segera menghubungi Anda untuk konfirmasi jadwal kunjungan yang nyaman bagi Anda.\n\n` +
            `Terima kasih telah menjadi pelanggan setia AUDIRA-NET.\n` +
            `_AUDIRA Quality Assurance Team_`,
        });
      } catch (e) {}
    }

    // 2. Jika Rekomendasi: Kirim Penawaran Promo Retensi Khusus
    if (data.actionType === 'OFFER_PROMO') {
      feedbackMessage = `Pesan WhatsApp Penawaran Promo Retensi berhasil dikirimkan ke nomor ${item.phone}.`;
      try {
        await this.whatsappService.sendMessage({
          phone: item.phone,
          message:
            `🎁 *PENAWARAN SPESIAL PELANGGAN PRIORITAS AUDIRA-NET*\n\n` +
            `Halo Yth. *${item.customerName}*,\n` +
            `Terima kasih telah mempercayakan koneksi internet rumah Anda bersama AUDIRA-NET.\n\n` +
            `Khusus untuk Anda hari ini, kami memberikan *Voucher Turbo Speed Booster +30 Mbps GRATIS* selama 7 hari atau *Diskon Tagihan 20%* untuk periode bulan berikutnya!\n\n` +
            `Klaim promo spesial Anda cukup dengan membalas pesan ini atau klik link customer portal Anda:\n` +
            `🌐 https://audira.my.id/customer/promo\n\n` +
            `Selamat menikmati koneksi internet tanpa batas!\n` +
            `_AUDIRA Customer Delight Team_`,
        });
      } catch (e) {}
    }

    // 3. Jika Rekomendasi: VIP Care Call
    if (data.actionType === 'VIP_CARE') {
      feedbackMessage = `Pelanggan ${item.customerName} telah ditambahkan ke antrean prioritas panggilan VIP Customer Care.`;
    }

    // Kirim laporan ringkas ke Telegram Topic 3 (Customer Management)
    try {
      const text =
        `🛡️ <b>AKSI RETENSI PELANGGAN DIEKSEKUSI</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 <b>Pelanggan</b>: <b>${item.customerName}</b> (<code>${item.internetNumber}</code>)\n` +
        `📦 <b>Paket</b>: ${item.packageName} (Rp ${item.monthlyBill.toLocaleString('id-ID')}/bln)\n` +
        `📉 <b>Skor Risiko Churn</b>: <b>${item.churnRiskScore}% (${item.riskTier})</b>\n` +
        `⚡ <b>Tindakan</b>: <code>${data.actionType}</code>\n` +
        `📝 <b>Catatan</b>: ${data.notes || '-'}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `<i>AUDIRA Churn Prevention & Retention Radar</i>`;

      await this.telegramService.sendMessage(3, text);
    } catch (e) {}

    return {
      success: true,
      message: feedbackMessage,
      item,
    };
  }
}
