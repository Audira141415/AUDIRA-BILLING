import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('status')
  getStatus() {
    return {
      status: 'ONLINE',
      ...this.telegramService.getConfig(),
    };
  }

  @Get('topics')
  getTopics() {
    return {
      success: true,
      topics: this.telegramService.getTopics(),
    };
  }

  @Get('logs')
  getLogs() {
    return {
      success: true,
      logs: this.telegramService.getRecentLogs(),
    };
  }

  @Post('broadcast')
  async broadcastMessage(
    @Body()
    body: {
      topicNo: number | string;
      message: string;
      title?: string;
      parseMode?: 'Markdown' | 'HTML';
    },
  ) {
    const text = body.title
      ? `📢 *${body.title}*\n━━━━━━━━━━━━━━━━━━━━\n${body.message}`
      : body.message;

    return this.telegramService.sendMessage(body.topicNo, text, body.parseMode || 'Markdown');
  }

  @Post('test/:topicNo')
  async testTopic(@Param('topicNo') topicNo: string) {
    const topic = this.telegramService.findTopic(topicNo);
    if (!topic) {
      return { success: false, error: 'Topic not found' };
    }

    const testText = `🧪 *TES KONEKTIVITAS SISTEM*\n━━━━━━━━━━━━━━━━━━━━\nTopik: *${topic.name}*\nThread ID: \`${topic.threadId}\`\nStatus: *BERHASIL TERHUBUNG*\nWaktu: _${new Date().toLocaleString('id-ID')}_\n\n✅ Sistem Web Admin & Mobile App AUDIRA terverifikasi live!`;
    return this.telegramService.sendMessage(topic.no, testText);
  }

  @Post('simulate-scenario')
  async simulateScenario(
    @Body()
    body: {
      scenario: 'PAYMENT' | 'OUTAGE' | 'ODP_FULL' | 'OPTICAL_CRITICAL' | 'ACTIVATION' | 'TICKET' | 'FINANCE';
      customData?: any;
    },
  ) {
    const { scenario, customData = {} } = body;

    switch (scenario) {
      case 'PAYMENT': {
        const data = {
          customerName: customData.customerName || 'Bpk. Ahmad Fauzi',
          internetNumber: customData.internetNumber || 'NET-104829',
          invoiceNumber: customData.invoiceNumber || `INV-202610-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: customData.amount || 375000,
          method: customData.method || 'QRIS Dinamis Realtime (BCA/GoPay)',
          paidAt: new Date(),
        };
        const res = await this.telegramService.notifyBillingPayment(data);
        return { success: res.success, scenario, data, telegram: res };
      }

      case 'OUTAGE': {
        const incident = {
          title: customData.title || 'FIBER CUT UTAMA - KABEL DROPCORE PUTUS TERTABRAK TRUK',
          severity: customData.severity || 'CRITICAL',
          affectedArea: customData.affectedArea || 'Jl. Raya Cikarang KM 34 (Segmen Tiang TR-042 s/d ODC-01)',
          estimatedCustomers: customData.estimatedCustomers || 74,
          details: customData.details || 'Kabel optik 24 core terputus total. Tim Splicer Lapangan diberangkatkan dengan peralatan OTDR & Fusion Splicer. Estimasi MTTR: 90 menit.',
        };
        const res = await this.telegramService.notifyNetworkIncident(incident as any);
        return { success: res.success, scenario, data: incident, telegram: res };
      }

      case 'ODP_FULL': {
        const odp = {
          component: customData.component || 'ODP-CKG-04 (Splitter 1:8)',
          action: '⚠️ KAPASITAS PENUH (8/8 PORT TERPAKAI - 100%)',
          location: customData.location || 'Jl. Melati Indah Blok B4 RT 03/08 (Tiang Telkom #19)',
          notes: customData.notes || 'Permintaan pasang baru pelanggan masuk 3 calon pelanggan antre. Rekomendasi: Pasang ODP ekspansi baru (ODP-CKG-04B) dari FDT terdekat.',
        };
        const res = await this.telegramService.notifyInfrastructure(odp);
        return { success: res.success, scenario, data: odp, telegram: res };
      }

      case 'OPTICAL_CRITICAL': {
        const device = customData.device || 'ONT ZTE-F670L (Pelanggan: Bpk. Bambang Sutrisno - INET-001538)';
        const metrics = customData.metrics || '• RX Optical Power: *-29.85 dBm* (BATAS AMBANG KRITIS > -27 dBm)\n• TX Power: *+2.10 dBm*\n• Suhu ONT: *49°C*\n• Status PON: *Degraded (Banyak Packet Loss)*\n• Analisis AI: Tekukan kabel dropcore melengkung tajam atau konektor SC-UPC kotor.';
        const res = await this.telegramService.notifyNetworkStatus(device, 'CRITICAL', metrics);
        return { success: res.success, scenario, data: { device, metrics }, telegram: res };
      }

      case 'ACTIVATION': {
        const act = {
          customerName: customData.customerName || 'Ibu Ratna Kumalasari',
          internetNumber: customData.internetNumber || 'NET-109204',
          ontSn: customData.ontSn || 'ZTEG-CA892011',
          opticalRxDbm: customData.opticalRxDbm || -18.75,
          technicianName: customData.technicianName || 'Agung Wicaksono & Tim Lapangan',
        };
        const res = await this.telegramService.notifyInstallationActivation(act);
        return { success: res.success, scenario, data: act, telegram: res };
      }

      case 'TICKET': {
        const tck = {
          ticketId: customData.ticketId || `TCK-202610-${Math.floor(100 + Math.random() * 900)}`,
          customerName: customData.customerName || 'Bpk. Dedi Supriyadi',
          phone: customData.phone || '081298765432',
          priority: customData.priority || 'URGENT',
          subject: customData.subject || 'Lampu Indikator LOS Merah Berkedip Setelah Hujan Lebat',
        };
        const res = await this.telegramService.notifySupportTicket(tck);
        return { success: res.success, scenario, data: tck, telegram: res };
      }

      case 'FINANCE': {
        const fin = {
          period: customData.period || 'Hari Ini (27 Oktober 2026)',
          revenue: customData.revenue || 12500000,
          pending: customData.pending || 12500000,
          collectionRate: customData.collectionRate || 50.0,
        };
        const res = await this.telegramService.sendFinanceSummary(
          fin.period,
          fin.revenue,
          fin.pending,
          fin.collectionRate,
        );
        return { success: res.success, scenario, data: fin, telegram: res };
      }

      default:
        return { success: false, error: 'Unknown scenario' };
    }
  }
}
