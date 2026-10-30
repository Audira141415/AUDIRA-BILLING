import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface TelegramTopicInfo {
  no: number;
  name: string;
  desc: string;
  threadId: number;
  key: string;
}

export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '8874323451:AAFJXzKCyqPRkJTqjUR_sCh8EuraqlKOm4k',
  CHAT_ID: '-1004464075869', // Migrated Supergroup Chat ID
  LEGACY_CHAT_ID: '-5392184125',
  BOT_USERNAME: 'AudiraISPBot',
  SUPERGROUP_TITLE: 'AUDIRA ISP | Operations Center',
  INVITE_LINK: 'https://t.me/+Yx8qadYjUSsxZjQ1',
};

export const TELEGRAM_TOPICS: TelegramTopicInfo[] = [
  { no: 1, key: 'ANNOUNCEMENTS', name: '📢 Announcements', desc: 'Pengumuman internal', threadId: 2 },
  { no: 2, key: 'BILLING_PAYMENT', name: '💳 Billing & Payment', desc: 'Tagihan dan pembayaran', threadId: 4 },
  { no: 3, key: 'CUSTOMER_MANAGEMENT', name: '👥 Customer Management', desc: 'Registrasi dan pengelolaan pelanggan', threadId: 6 },
  { no: 4, key: 'NETWORK_MONITORING', name: '🌐 Network Monitoring', desc: 'Status jaringan dan perangkat', threadId: 8 },
  { no: 5, key: 'NETWORK_INCIDENTS', name: '🚨 Network Incidents', desc: 'Gangguan jaringan', threadId: 10 },
  { no: 6, key: 'SUPPORT_TICKETS', name: '🎫 Support Tickets', desc: 'Keluhan dan tiket pelanggan', threadId: 12 },
  { no: 7, key: 'FIELD_OPERATIONS', name: '🛠️ Field Operations', desc: 'Pekerjaan teknisi', threadId: 14 },
  { no: 8, key: 'INSTALLATION_ACTIVATION', name: '🔌 Installation & Activation', desc: 'Instalasi dan aktivasi pelanggan', threadId: 16 },
  { no: 9, key: 'INFRASTRUCTURE', name: '📡 Infrastructure', desc: 'Router, OLT, ODP, ODC, POP, dan infrastruktur lainnya sesuai kebutuhan', threadId: 18 },
  { no: 10, key: 'REPORTS_ANALYTICS', name: '📊 Reports & Analytics', desc: 'Laporan operasional dan statistik', threadId: 20 },
  { no: 11, key: 'SYSTEM_AUTOMATION', name: '⚙️ System & Automation', desc: 'Status bot, API, database, dan automasi', threadId: 22 },
  { no: 12, key: 'AI_ASSISTANT', name: '🤖 AI Assistant', desc: 'Analisis dan bantuan AI', threadId: 24 },
  { no: 13, key: 'CHANGE_MANAGEMENT', name: '📝 Change Management', desc: 'Perubahan konfigurasi dan pekerjaan terencana', threadId: 26 },
  { no: 14, key: 'FINANCE_SUMMARY', name: '💰 Finance Summary', desc: 'Ringkasan keuangan dengan akses terbatas', threadId: 28 },
];

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly baseUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}`;
  private messageHistory: Array<{
    id: string;
    topicNo: number;
    topicName: string;
    text: string;
    timestamp: Date;
    success: boolean;
  }> = [];

  getTopics(): TelegramTopicInfo[] {
    return TELEGRAM_TOPICS;
  }

  getConfig() {
    return {
      botUsername: TELEGRAM_CONFIG.BOT_USERNAME,
      chatId: TELEGRAM_CONFIG.CHAT_ID,
      legacyChatId: TELEGRAM_CONFIG.LEGACY_CHAT_ID,
      title: TELEGRAM_CONFIG.SUPERGROUP_TITLE,
      inviteLink: TELEGRAM_CONFIG.INVITE_LINK,
      topicCount: TELEGRAM_TOPICS.length,
      topics: TELEGRAM_TOPICS,
    };
  }

  getRecentLogs() {
    return this.messageHistory.slice(-50).reverse();
  }

  findTopic(topicIdentifier: number | string): TelegramTopicInfo | undefined {
    if (typeof topicIdentifier === 'number') {
      return TELEGRAM_TOPICS.find((t) => t.no === topicIdentifier);
    }
    const idNum = parseInt(topicIdentifier, 10);
    if (!isNaN(idNum)) {
      return TELEGRAM_TOPICS.find((t) => t.no === idNum);
    }
    const normalized = topicIdentifier.toUpperCase().trim();
    return TELEGRAM_TOPICS.find(
      (t) => t.key === normalized || t.name.toUpperCase().includes(normalized),
    );
  }

  async sendMessage(
    topicIdentifier: number | string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown',
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const topic = this.findTopic(topicIdentifier);
    const threadId = topic ? topic.threadId : undefined;
    const topicName = topic ? topic.name : 'General';
    const topicNo = topic ? topic.no : 0;

    try {
      const payload: any = {
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text,
        parse_mode: parseMode,
      };

      if (threadId) {
        payload.message_thread_id = threadId;
      }

      const res = await axios.post(`${this.baseUrl}/sendMessage`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      this.messageHistory.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        topicNo,
        topicName,
        text,
        timestamp: new Date(),
        success: true,
      });

      this.logger.log(`Telegram message sent to topic [${topicName}]: ${res.data?.ok}`);
      return { success: true, data: res.data?.result };
    } catch (err: any) {
      const errMsg = err.response?.data?.description || err.message;
      this.logger.error(`Failed to send Telegram message to [${topicName}]: ${errMsg}`);
      this.messageHistory.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        topicNo,
        topicName,
        text,
        timestamp: new Date(),
        success: false,
      });
      return { success: false, error: errMsg };
    }
  }

  // Topic 1: 📢 Announcements
  async sendAnnouncement(title: string, body: string, author = 'AUDIRA Management') {
    const text = `📢 *PENGUMUMAN RESMI AUDIRA*\n━━━━━━━━━━━━━━━━━━━━\n📌 *${title}*\n\n${body}\n\n👤 _Diterbitkan oleh: ${author}_\n📅 _${new Date().toLocaleString('id-ID')}_`;
    return this.sendMessage(1, text);
  }

  // Topic 2: 💳 Billing & Payment
  async notifyBillingPayment(details: {
    customerName: string;
    internetNumber: string;
    invoiceNumber: string;
    amount: number;
    method: string;
    paidAt: Date;
  }) {
    const text = `💳 *PEMBAYARAN DITERIMA*\n━━━━━━━━━━━━━━━━━━━━\n👤 Pelanggan: *${details.customerName}*\n🆔 No Internet: \`${details.internetNumber}\`\n📄 Invoice: \`${details.invoiceNumber}\`\n💰 Jumlah: *Rp ${details.amount.toLocaleString('id-ID')}*\n🏦 Metode: *${details.method}*\n⏰ Waktu: _${details.paidAt.toLocaleString('id-ID')}_\n\n✅ _Status: LUNAS & Sesi Bandwidth Segar (CoA Restored)_`;
    return this.sendMessage(2, text);
  }

  // Topic 3: 👥 Customer Management
  async notifyCustomerRegistration(details: {
    customerName: string;
    phone: string;
    packagePlan: string;
    address: string;
    odp?: string;
  }) {
    const text = `👥 *REGISTRASI PELANGGAN BARU*\n━━━━━━━━━━━━━━━━━━━━\n👤 Nama: *${details.customerName}*\n📱 Telepon: \`${details.phone}\`\n📦 Paket: *${details.packagePlan}*\n📍 Alamat: ${details.address}\n📡 ODP: \`${details.odp || 'Pending Allocation'}\`\n\n📝 _Status: Menunggu Penugasan Teknisi PSB_`;
    return this.sendMessage(3, text);
  }

  // Topic 4: 🌐 Network Monitoring
  async notifyNetworkStatus(device: string, status: 'NORMAL' | 'WARNING' | 'CRITICAL', metrics: string) {
    const icon = status === 'NORMAL' ? '🟢' : status === 'WARNING' ? '🟡' : '🔴';
    const text = `🌐 *TELEMETRI JARINGAN NOC*\n━━━━━━━━━━━━━━━━━━━━\nPerangkat: *${device}*\nStatus: ${icon} *${status}*\nMetrik:\n${metrics}\n\n⏰ _${new Date().toLocaleTimeString('id-ID')} WIB_`;
    return this.sendMessage(4, text);
  }

  // Topic 5: 🚨 Network Incidents
  async notifyNetworkIncident(incident: {
    title: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    affectedArea: string;
    estimatedCustomers: number;
    details: string;
  }) {
    const text = `🚨 *INCIDENT ALERT: ${incident.title.toUpperCase()}*\n━━━━━━━━━━━━━━━━━━━━\n⚠️ Severity: *${incident.severity}*\n📍 Wilayah Terdampak: *${incident.affectedArea}*\n👥 Estimasi Pelanggan: *${incident.estimatedCustomers} ONT*\n📋 Detail Kendala:\n${incident.details}\n\n🛠️ _Tim Tanggap Darurat NOC sedang menangani insiden._`;
    return this.sendMessage(5, text);
  }

  // Topic 6: 🎫 Support Tickets
  async notifySupportTicket(ticket: {
    ticketId: string;
    customerName: string;
    phone: string;
    subject: string;
    priority: string;
  }) {
    const text = `🎫 *TIKET KELUHAN MASUK*\n━━━━━━━━━━━━━━━━━━━━\nNomor Tiket: \`${ticket.ticketId}\`\nPelanggan: *${ticket.customerName}* (\`${ticket.phone}\`)\nPrioritas: *${ticket.priority}*\nPerihal: *${ticket.subject}*\n\n⏱️ _SLA Respons: < 30 Menit_`;
    return this.sendMessage(6, text);
  }

  // Topic 7: 🛠️ Field Operations
  async notifyFieldOperation(job: {
    jobId: string;
    technicianName: string;
    taskType: string;
    location: string;
    status: string;
  }) {
    const text = `🛠️ *LAPORAN TUGAS LAPANGAN*\n━━━━━━━━━━━━━━━━━━━━\nSPK: \`${job.jobId}\`\nTeknisi: *${job.technicianName}*\nTipe Pekerjaan: *${job.taskType}*\nLokasi: *${job.location}*\nStatus: *${job.status}*\n\n📍 _Geotagged & Presensi Valid_`;
    return this.sendMessage(7, text);
  }

  // Topic 8: 🔌 Installation & Activation
  async notifyInstallationActivation(data: {
    customerName: string;
    internetNumber: string;
    ontSn: string;
    opticalRxDbm: number;
    technicianName: string;
  }) {
    const text = `🔌 *AKTIVASI FTTH BERHASIL*\n━━━━━━━━━━━━━━━━━━━━\nPelanggan: *${data.customerName}*\nNo Internet: \`${data.internetNumber}\`\nModem ONT SN: \`${data.ontSn}\`\nRedaman Optik: *${data.opticalRxDbm} dBm* (Standar Sehat)\nTeknisi PSB: *${data.technicianName}*\n\n🎉 _Pelanggan resmi AKTIF di jaringan AUDIRA!_`;
    return this.sendMessage(8, text);
  }

  // Topic 9: 📡 Infrastructure
  async notifyInfrastructure(data: {
    component: string;
    action: string;
    location: string;
    notes: string;
  }) {
    const text = `📡 *PEMELIHARAAN INFRASTRUKTUR*\n━━━━━━━━━━━━━━━━━━━━\nKomponen: *${data.component}*\nAksi: *${data.action}*\nLokasi: *${data.location}*\nCatatan: ${data.notes}\n\n⚙️ _Sistem OLT / ODC / ODP Updated_`;
    return this.sendMessage(9, text);
  }

  // Topic 10: 📊 Reports & Analytics
  async sendReportSummary(title: string, summary: string) {
    const text = `📊 *LAPORAN & STATISTIK OPERASIONAL*\n━━━━━━━━━━━━━━━━━━━━\n📌 *${title}*\n\n${summary}\n\n📈 _Diperbarui otomatis oleh sistem BI AUDIRA._`;
    return this.sendMessage(10, text);
  }

  // Topic 11: ⚙️ System & Automation
  async notifySystemStatus(system: string, event: string, status: 'OK' | 'ERROR' | 'INFO') {
    const badge = status === 'OK' ? '✅' : status === 'ERROR' ? '❌' : 'ℹ️';
    const text = `⚙️ *LOG SISTEM & AUTOMATION*\n━━━━━━━━━━━━━━━━━━━━\nModul: *${system}*\nEvent: *${event}*\nStatus: ${badge} *${status}*\nTimestamp: _${new Date().toISOString()}_\n\n🤖 _AUDIRA Microservice Health Check_`;
    return this.sendMessage(11, text);
  }

  // Topic 12: 🤖 AI Assistant
  async sendAIAssistant(promptTitle: string, insight: string) {
    const text = `🤖 *AUDIRA AI INSIGHT & ASSISTANT*\n━━━━━━━━━━━━━━━━━━━━\nQuery: *${promptTitle}*\n\n💡 *Analisis & Rekomendasi:*\n${insight}\n\n🧠 _Powered by AUDIRA Intelligence Engine_`;
    return this.sendMessage(12, text);
  }

  // Topic 13: 📝 Change Management
  async notifyChangeManagement(rfc: {
    rfcId: string;
    title: string;
    scope: string;
    windowTime: string;
    pic: string;
  }) {
    const text = `📝 *CHANGE MANAGEMENT (RFC-PLANNED WORK)*\n━━━━━━━━━━━━━━━━━━━━\nID: \`${rfc.rfcId}\`\nPekerjaan: *${rfc.title}*\nCakupan: *${rfc.scope}*\nWindow Time: *${rfc.windowTime}*\nPIC: *${rfc.pic}*\n\n⚠️ _Pemberitahuan kepada seluruh unit operasional terkait potensi fluktuasi layanan._`;
    return this.sendMessage(13, text);
  }

  // Topic 14: 💰 Finance Summary
  async sendFinanceSummary(period: string, revenue: number, pending: number, collectionRate: number) {
    const text = `💰 *RINGKASAN FINANSIAL & KAS (RESTRICTED)*\n━━━━━━━━━━━━━━━━━━━━\nPeriode: *${period}*\n💵 Kas Masuk Lunas: *Rp ${revenue.toLocaleString('id-ID')}*\n⏳ Piutang Berjalan: *Rp ${pending.toLocaleString('id-ID')}*\n🎯 Collection Rate: *${collectionRate.toFixed(1)}%*\n\n🔒 _Akses Terbatas: Direksi & Manajemen Keuangan_`;
    return this.sendMessage(14, text);
  }
}
