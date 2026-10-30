import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { TelegramService } from '../telegram/telegram.service';

export interface AffectedCustomer {
  id: string;
  name: string;
  phone: string;
  pppoeUser: string;
  odp: string;
  address: string;
  notifiedWa: boolean;
}

export interface IncidentTimelineEvent {
  time: string;
  title: string;
  desc: string;
  actor: string;
}

export interface OutageIncident {
  id: string;
  incidentNumber: string;
  title: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  status: 'REPORTED' | 'INVESTIGATING' | 'SPLICING_IN_PROGRESS' | 'MONITORING' | 'RESOLVED';
  impactArea: string;
  oltName: string;
  ponPort: string;
  odpNames: string[];
  affectedCount: number;
  affectedCustomers: AffectedCustomer[];
  splicerTeam: string;
  estimatedResolution: string;
  rootCause: string;
  createdAt: Date;
  resolvedAt?: Date;
  timeline: IncidentTimelineEvent[];
  whatsappBroadcastCount: number;
  telegramDispatched: boolean;
}

@Injectable()
export class IncidentService {
  private readonly logger = new Logger(IncidentService.name);

  // In-Memory store initialized with realistic carrier-grade incidents
  private incidents: OutageIncident[] = [
    {
      id: 'inc-01',
      incidentNumber: 'INC-20261027-001',
      title: 'Kabel Feeder 24-Core Putus Total (Truk Box) - Jl. Merdeka KM 4.2',
      severity: 'CRITICAL',
      status: 'SPLICING_IN_PROGRESS',
      impactArea: 'Kecamatan Merdeka Barat & Sekitarnya',
      oltName: 'OLT-HUAWEI-MA5608T-POP-BARAT',
      ponPort: 'PON 0/1/4',
      odpNames: ['ODP-MRD-01', 'ODP-MRD-02', 'ODP-MRD-03', 'ODP-MRD-04'],
      affectedCount: 42,
      affectedCustomers: [
        { id: 'c-101', name: 'Bpk. Hendra Wijaya', phone: '081234567890', pppoeUser: 'hendra_mrd01', odp: 'ODP-MRD-01', address: 'Jl. Merdeka No. 12', notifiedWa: true },
        { id: 'c-102', name: 'Ibu Ratna Sari', phone: '081398765432', pppoeUser: 'ratna_mrd01', odp: 'ODP-MRD-01', address: 'Jl. Merdeka No. 15', notifiedWa: true },
        { id: 'c-103', name: 'Warnet CyberNet Gaming', phone: '082199887766', pppoeUser: 'cybernet_mrd02', odp: 'ODP-MRD-02', address: 'Jl. Merdeka Ruko 3B', notifiedWa: true },
        { id: 'c-104', name: 'Klinik Medika Sehat', phone: '085711223344', pppoeUser: 'medika_mrd02', odp: 'ODP-MRD-02', address: 'Jl. Merdeka No. 40', notifiedWa: true },
        { id: 'c-105', name: 'Bpk. Bambang Sutrisno', phone: '081900112233', pppoeUser: 'bambang_mrd03', odp: 'ODP-MRD-03', address: 'Komplek Permata G-05', notifiedWa: true },
        { id: 'c-106', name: 'Ibu Siska Dewi', phone: '087855667788', pppoeUser: 'siska_mrd04', odp: 'ODP-MRD-04', address: 'Komplek Permata H-12', notifiedWa: false },
      ],
      splicerTeam: 'Tim Reaksi Cepat Alpha (Kurniawan & Rian)',
      estimatedResolution: 'Hari ini, 17:30 WIB (~90 Menit)',
      rootCause: 'Kabel Aerial 24C putus total tersangkut kontainer di Tiang T-18 depan SPBU Merdeka.',
      createdAt: new Date(Date.now() - 3600000 * 1.5),
      timeline: [
        { time: '13:15 WIB', title: 'Alarm Sinyal Los Otomatis', desc: 'Sistem NOC mendeteksi 42 sesi PPPoE drop serentak pada PON 0/1/4.', actor: 'NOC Auto-Radar' },
        { time: '13:25 WIB', title: 'Tembakan OTDR Berhasil', desc: 'OTDR port OLT menembak event putus pada jarak 1.450m (Tiang T-18).', actor: 'NOC Operator' },
        { time: '13:40 WIB', title: 'Tim Splicer Tiba di Lokasi', desc: 'Tim Reaksi Cepat Alpha tiba dan menyiapkan Joint Closure pengganti.', actor: 'Teknisi Lapangan' },
        { time: '14:10 WIB', title: 'Penyambungan Core 1-12 Selesai', desc: 'Tube 1 (Biru) selesai disambung, redaman rata-rata 0.03 dB.', actor: 'Teknisi Splicer' },
      ],
      whatsappBroadcastCount: 5,
      telegramDispatched: true,
    },
    {
      id: 'inc-02',
      incidentNumber: 'INC-20261027-002',
      title: 'Power Outage Genset PLN Trafo Meledak - ODC Melati',
      severity: 'MAJOR',
      status: 'INVESTIGATING',
      impactArea: 'Perumahan Melati Indah Blok A-D',
      oltName: 'OLT-ZTE-C320-POP-SELATAN',
      ponPort: 'PON 0/2/1',
      odpNames: ['ODP-MLT-01', 'ODP-MLT-02'],
      affectedCount: 18,
      affectedCustomers: [
        { id: 'c-201', name: 'Dr. Agus Santoso', phone: '081288776655', pppoeUser: 'agus_mlt01', odp: 'ODP-MLT-01', address: 'Jl. Melati Blok A/1', notifiedWa: true },
        { id: 'c-202', name: 'Ibu Widya Astuti', phone: '081377665544', pppoeUser: 'widya_mlt02', odp: 'ODP-MLT-02', address: 'Jl. Melati Blok B/8', notifiedWa: false },
      ],
      splicerTeam: 'Tim Elektrikal & Genset (Dani Pratama)',
      estimatedResolution: 'Hari ini, 16:45 WIB (~45 Menit)',
      rootCause: 'Gardu PLN meledak saat hujan deras, inverter backup ODC bertahan 45 menit sebelum drop.',
      createdAt: new Date(Date.now() - 1800000),
      timeline: [
        { time: '14:15 WIB', title: 'Daya Listrik AC Hilang', desc: 'Sensor tegangan ODC melaporkan peralihan ke baterai aki 48V.', actor: 'Telemetry Sensor' },
        { time: '14:32 WIB', title: 'Baterai Drop & Perangkat Mati', desc: 'Tegangan turun ke 42V, switch distribusi ODC shutdown.', actor: 'NOC System' },
      ],
      whatsappBroadcastCount: 1,
      telegramDispatched: true,
    },
    {
      id: 'inc-03',
      incidentNumber: 'INC-20261026-009',
      title: 'Pelemahan Redaman Optik Akibat Dropcore Tertekuk - ODP Mawar 03',
      severity: 'MINOR',
      status: 'RESOLVED',
      impactArea: 'Jl. Mawar RT 03/05',
      oltName: 'OLT-HUAWEI-MA5608T-POP-BARAT',
      ponPort: 'PON 0/1/1',
      odpNames: ['ODP-MWR-03'],
      affectedCount: 6,
      affectedCustomers: [
        { id: 'c-301', name: 'Bpk. Ahmad Fauzi', phone: '085699887711', pppoeUser: 'fauzi_mwr03', odp: 'ODP-MWR-03', address: 'Jl. Mawar No. 8', notifiedWa: true },
      ],
      splicerTeam: 'Tim Maintenance Reguler (Bayu & Eko)',
      estimatedResolution: 'Selesai (Resolved)',
      rootCause: 'Dropcore tertindih ranting pohon beringin yang patah.',
      createdAt: new Date(Date.now() - 86400000),
      resolvedAt: new Date(Date.now() - 79200000),
      timeline: [
        { time: '09:00 WIB', title: 'Laporan Diterima', desc: 'Redaman optik drop ke -29 dBm.', actor: 'ZTP Auto-Check' },
        { time: '10:15 WIB', title: 'Pemotongan Ranting & Proteksi Kabel', desc: 'Ranting dibersihkan dan kabel dipasang spiral wrap.', actor: 'Teknisi' },
        { time: '11:00 WIB', title: 'Redaman Normal Kembali', desc: 'Redaman stabil di -19.8 dBm.', actor: 'NOC Engineer' },
      ],
      whatsappBroadcastCount: 6,
      telegramDispatched: true,
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
    private readonly telegramService: TelegramService,
  ) {}

  /**
   * Ambil seluruh riwayat insiden gangguan massal
   */
  async getIncidents(query?: { status?: string; severity?: string; search?: string }) {
    let result = [...this.incidents];

    if (query?.status && query.status !== 'ALL') {
      result = result.filter((i) => i.status === query.status);
    }
    if (query?.severity && query.severity !== 'ALL') {
      result = result.filter((i) => i.severity === query.severity);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.incidentNumber.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.impactArea.toLowerCase().includes(q) ||
          i.odpNames.some((odp) => odp.toLowerCase().includes(q)),
      );
    }

    return result;
  }

  /**
   * Detail satu insiden
   */
  async getIncidentById(id: string) {
    const inc = this.incidents.find((i) => i.id === id || i.incidentNumber === id);
    if (!inc) throw new Error('Insiden tidak ditemukan');
    return inc;
  }

  /**
   * Statistik KPI Insiden untuk Ringkasan Eksekutif NOC
   */
  async getStats() {
    const total = this.incidents.length;
    const active = this.incidents.filter((i) => i.status !== 'RESOLVED').length;
    const customersDown = this.incidents
      .filter((i) => i.status !== 'RESOLVED')
      .reduce((sum, i) => sum + i.affectedCount, 0);
    const inSplicing = this.incidents.filter((i) => i.status === 'SPLICING_IN_PROGRESS').length;

    return {
      totalIncidents: total,
      activeIncidents: active,
      customersDownTotal: customersDown,
      splicingInProgress: inSplicing,
      avgMttrMinutes: 78,
      lastUpdated: new Date(),
    };
  }

  /**
   * Buat Insiden Gangguan Massal Baru
   */
  async createIncident(data: {
    title: string;
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
    impactArea: string;
    oltName: string;
    ponPort: string;
    odpNames: string[];
    affectedCount?: number;
    splicerTeam: string;
    estimatedResolution: string;
    rootCause?: string;
  }) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const incNum = `INC-${dateStr}-${String(this.incidents.length + 1).padStart(3, '0')}`;

    // Cari pelanggan dari database
    let realCustomers: AffectedCustomer[] = [];
    try {
      const dbCustomers = await this.prisma.customer.findMany({
        take: 30,
      });

      if (dbCustomers.length > 0) {
        realCustomers = dbCustomers.map((c: any) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          pppoeUser: c.internetNumber || c.phone,
          odp: c.odp || data.odpNames[0] || 'ODP-DISTRIBUSI',
          address: c.address || 'Alamat Terdaftar',
          notifiedWa: false,
        }));
      }
    } catch (e: any) {
      this.logger.warn(`Could not fetch db customers: ${e.message}`);
    }

    if (realCustomers.length === 0) {
      // Default fallback impacted customers
      realCustomers = [
        { id: `c-${Date.now()}-1`, name: 'Bpk. Hendra Wijaya', phone: '081234567890', pppoeUser: 'hendra_user', odp: data.odpNames[0] || 'ODP-01', address: 'Jl. Raya Area Insiden', notifiedWa: false },
        { id: `c-${Date.now()}-2`, name: 'Ibu Ratna Sari', phone: '081398765432', pppoeUser: 'ratna_user', odp: data.odpNames[0] || 'ODP-01', address: 'Jl. Raya Area Insiden', notifiedWa: false },
        { id: `c-${Date.now()}-3`, name: 'Warnet CyberNet', phone: '082199887766', pppoeUser: 'cybernet_user', odp: data.odpNames[0] || 'ODP-01', address: 'Ruko Pertokoan', notifiedWa: false },
      ];
    }

    const newInc: OutageIncident = {
      id: `inc-${Date.now()}`,
      incidentNumber: incNum,
      title: data.title,
      severity: data.severity,
      status: 'INVESTIGATING',
      impactArea: data.impactArea,
      oltName: data.oltName,
      ponPort: data.ponPort,
      odpNames: data.odpNames,
      affectedCount: data.affectedCount || realCustomers.length,
      affectedCustomers: realCustomers,
      splicerTeam: data.splicerTeam || 'Tim Siaga NOC',
      estimatedResolution: data.estimatedResolution || 'Estimasi 2 Jam',
      rootCause: data.rootCause || 'Sedang diinvestigasi oleh teknisi lapangan.',
      createdAt: now,
      timeline: [
        {
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          title: 'Insiden Didaftarkan ke Sistem',
          desc: `Tiket insiden massal ${incNum} dibuat. Tim teknisi ${data.splicerTeam} dimobilisasi.`,
          actor: 'NOC Commander',
        },
      ],
      whatsappBroadcastCount: 0,
      telegramDispatched: false,
    };

    this.incidents.unshift(newInc);

    // Otomatis kirim notifikasi pembukaan insiden ke Telegram Topic 5 (Network Incidents)
    try {
      await this.dispatchToTelegramTopic(newInc, 'NEW_INCIDENT');
      newInc.telegramDispatched = true;
    } catch (err: any) {
      this.logger.warn(`Failed to dispatch new incident to Telegram: ${err.message}`);
    }

    return newInc;
  }

  /**
   * Perbarui Status Siklus Insiden
   */
  async updateStatus(
    id: string,
    data: {
      status: 'REPORTED' | 'INVESTIGATING' | 'SPLICING_IN_PROGRESS' | 'MONITORING' | 'RESOLVED';
      notes?: string;
      actor?: string;
    },
  ) {
    const inc = await this.getIncidentById(id);
    inc.status = data.status;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    let eventTitle = `Status Diperbarui: ${data.status}`;
    if (data.status === 'SPLICING_IN_PROGRESS') eventTitle = 'Proses Splicing Kabel Sedang Berjalan';
    if (data.status === 'MONITORING') eventTitle = 'Penyambungan Selesai, Monitoring Redaman';
    if (data.status === 'RESOLVED') {
      eventTitle = 'Insiden Tuntas (Sinyal Normal)';
      inc.resolvedAt = now;
    }

    inc.timeline.push({
      time: timeStr,
      title: eventTitle,
      desc: data.notes || `Insiden diperbarui ke status ${data.status}.`,
      actor: data.actor || 'NOC Operator',
    });

    // Kirim update ke Telegram Topic 5
    try {
      await this.dispatchToTelegramTopic(inc, 'STATUS_UPDATE', data.notes);
    } catch (err) {}

    return inc;
  }

  /**
   * 1-Klik Broadcast Massal Notifikasi Pemeliharaan via WhatsApp ke Pelanggan Terdampak
   */
  async broadcastWhatsApp(id: string, customMessage?: string) {
    const inc = await this.getIncidentById(id);
    let successCount = 0;
    let failCount = 0;

    for (const cust of inc.affectedCustomers) {
      try {
        const msg =
          customMessage ||
          `🚨 *PEMBERITAHUAN GANGGUAN JARINGAN FIBER OPTIK*\n\n` +
          `Yth. Pelanggan *${cust.name}* (${cust.pppoeUser}),\n\n` +
          `Kami menginformasikan bahwa saat ini layanan internet di wilayah Anda (*${cust.odp}*) sedang mengalami kendala sementara:\n\n` +
          `📌 *Kendala*: ${inc.title}\n` +
          `📍 *Area Terdampak*: ${inc.impactArea}\n` +
          `⏱️ *Estimasi Selesai (ETA)*: ${inc.estimatedResolution}\n` +
          `🛠️ *Status Penanganan*: ${inc.status.replace(/_/g, ' ')}\n\n` +
          `Tim teknisi fiber optik kami saat ini sedang bekerja intensif di lokasi untuk memulihkan koneksi secepatnya. Layanan internet Anda akan kembali aktif secara otomatis tanpa perlu restart modem.\n\n` +
          `Mohon maaf atas ketidaknyamanan ini.\n` +
          `Terima kasih atas pengertian dan kesabaran Anda.\n\n` +
          `_Pusat Komando Operasional AUDIRA-NET_`;

        await this.whatsappService.sendMessage({
          phone: cust.phone,
          message: msg,
        });

        cust.notifiedWa = true;
        successCount++;
      } catch (err: any) {
        this.logger.warn(`Failed to send WA to ${cust.phone}: ${err.message}`);
        failCount++;
      }
    }

    inc.whatsappBroadcastCount += successCount;
    inc.timeline.push({
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      title: 'Broadcast WhatsApp Massal Terkirim',
      desc: `Berhasil mengirim pengumuman gangguan ke ${successCount} pelanggan terdampak (Gagal: ${failCount}).`,
      actor: 'WhatsApp Outage Engine',
    });

    return {
      success: true,
      totalTarget: inc.affectedCustomers.length,
      successCount,
      failCount,
      incident: inc,
    };
  }

  /**
   * Kirim format laporan insiden ke Supergroup Telegram Topic 5 (🚨 Network Incidents)
   */
  async dispatchToTelegramTopic(inc: OutageIncident, eventType: 'NEW_INCIDENT' | 'STATUS_UPDATE' | 'RESOLVED', extraNote?: string) {
    const timeStr = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    let headerBadge = '🚨 <b>GANGGUAN MASSAL DIBUKA (OUTAGE ACTIVE)</b>';
    if (inc.status === 'RESOLVED') headerBadge = '✅ <b>INSIDEN TELAH TUNTAS PULIH (RESOLVED)</b>';
    else if (eventType === 'STATUS_UPDATE') headerBadge = '🔄 <b>PEMBARUAN STATUS PENANGANAN GANGGUAN</b>';

    const text =
      `${headerBadge}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎫 <b>No. Tiket</b>: <code>${inc.incidentNumber}</code>\n` +
      `📌 <b>Judul</b>: <b>${inc.title}</b>\n` +
      `🔥 <b>Tingkat Keparahan</b>: <code>${inc.severity}</code>\n` +
      `⚡ <b>Status Terkini</b>: <b>${inc.status.replace(/_/g, ' ')}</b>\n\n` +
      `📍 <b>Area Terdampak</b>: ${inc.impactArea}\n` +
      `📡 <b>OLT & Port</b>: <code>${inc.oltName}</code> (${inc.ponPort})\n` +
      `📦 <b>ODP Terdampak</b>: ${inc.odpNames.join(', ')}\n` +
      `👥 <b>Pelanggan Padam</b>: <b>${inc.affectedCount} Pelanggan</b>\n` +
      `⏱️ <b>Estimasi Selesai (ETA)</b>: ${inc.estimatedResolution}\n` +
      `🛠️ <b>Tim Splicer</b>: ${inc.splicerTeam}\n` +
      `🔍 <b>Penyebab (Root Cause)</b>: <i>${inc.rootCause}</i>\n` +
      (extraNote ? `📝 <b>Catatan Tambahan</b>: ${extraNote}\n` : '') +
      `⏰ <b>Waktu Lapor</b>: ${timeStr} WIB\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `<i>Pusat Operasi Jaringan AUDIRA-NET</i>`;

    // Kirim spesifik ke Topic 5 (thread ID 10)
    return this.telegramService.sendMessage(5, text);
  }
}
