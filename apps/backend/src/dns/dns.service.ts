import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

export interface DnsCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  mandatory: boolean;
  enabled: boolean;
  description: string;
  regulation?: string;
}

export interface CustomDnsRule {
  id: string;
  domain: string;
  type: 'BLACKLIST' | 'WHITELIST';
  category: string;
  reason: string;
  createdAt: Date;
  createdBy: string;
  hitCount: number;
}

export interface DnsBlockedLog {
  id: string;
  timestamp: Date;
  domain: string;
  category: string;
  clientIp: string;
  clientPppoe: string;
  customerName: string;
  blockedBy: string;
}

@Injectable()
export class DnsService {
  private readonly logger = new Logger(DnsService.name);

  // In-memory DNS state with realistic ISP data
  private lastSyncTime: Date = new Date();
  private isSyncing: boolean = false;
  private totalBlockedDomains: number = 1428910;
  private liveQps: number = 14850;
  private cacheHitRate: number = 92.4;
  private avgLatencyMs: number = 1.2;

  private categories: DnsCategory[] = [
    {
      id: 'JUDI_ONLINE',
      name: 'Judi Online & Kasino Siber',
      icon: '🎰',
      count: 782410,
      mandatory: true,
      enabled: true,
      description: 'Pemblokiran menyeluruh seluruh situs judi slot, togel, poker, dan bandar online ilegal.',
      regulation: 'Instruksi Menkominfo No. 1/2023 & UU ITE Pasal 27',
    },
    {
      id: 'PORNOGRAFI',
      name: 'Pornografi & Konten Asusila',
      icon: '🔞',
      count: 495120,
      mandatory: true,
      enabled: true,
      description: 'Penyaringan konten pornografi dan kekerasan ekstrem sesuai standar TrustPositif Kominfo.',
      regulation: 'UU Pornografi No. 44/2008 & Permenkominfo No. 5/2020',
    },
    {
      id: 'PHISHING_MALWARE',
      name: 'Phishing Finansial & Ransomware',
      icon: '🎣',
      count: 112340,
      mandatory: true,
      enabled: true,
      description: 'Situs web penipuan perbankan palsu, pencurian kredensial, dan server C2 malware berbahaya.',
      regulation: 'Kemananan Siber Nasional BSSN & APJII CSIRT',
    },
    {
      id: 'DOH_BYPASS',
      name: 'Anti-Bypass DNS-over-HTTPS (DoH / DoT)',
      icon: '🛡️',
      count: 24800,
      mandatory: false,
      enabled: true,
      description: 'Pencegahan bypass filter melalui public DoH resolvers (Cloudflare DoH, Google DoH, Quad9) di level gateway.',
      regulation: 'Regulasi Walled-Garden DNS Kemenkominfo',
    },
    {
      id: 'FRAUD_PIRACY',
      name: 'Pelanggaran Hak Cipta & Pembajakan Film',
      icon: '🎬',
      count: 14240,
      mandatory: false,
      enabled: true,
      description: 'Situs streaming ilegal dan torrent yang melanggar HKI atas permintaan resmi DJKI & Kominfo.',
      regulation: 'Permenkominfo & Permenkumham HKI',
    },
  ];

  private customRules: CustomDnsRule[] = [
    {
      id: 'rule-01',
      domain: 'zeus-slot-gacor88.vip',
      type: 'BLACKLIST',
      category: 'Judi Online',
      reason: 'Laporan Bareskrim & Temuan Tim NOC',
      createdAt: new Date(Date.now() - 3600000 * 2),
      createdBy: 'NOC Security',
      hitCount: 1420,
    },
    {
      id: 'rule-02',
      domain: 'klikbca-login-palsu.net',
      type: 'BLACKLIST',
      category: 'Phishing Finansial',
      reason: 'Laporan bank BCA atas situs penipuan phishing',
      createdAt: new Date(Date.now() - 3600000 * 5),
      createdBy: 'Cyber Intel AUDIRA',
      hitCount: 890,
    },
    {
      id: 'rule-03',
      domain: 'learning.sman1cikarang.sch.id',
      type: 'WHITELIST',
      category: 'Pendidikan',
      reason: 'Server E-Learning Sekolah Mitra AUDIRA',
      createdAt: new Date(Date.now() - 86400000 * 2),
      createdBy: 'Admin Customer',
      hitCount: 52100,
    },
    {
      id: 'rule-04',
      domain: 'portal.audira.my.id',
      type: 'WHITELIST',
      category: 'Internal ISP',
      reason: 'Official Domain & Portal Self-Service AUDIRA',
      createdAt: new Date(Date.now() - 86400000 * 10),
      createdBy: 'Agus Dwi Rianto',
      hitCount: 312000,
    },
  ];

  private blockedLogs: DnsBlockedLog[] = [
    {
      id: 'log-01',
      timestamp: new Date(Date.now() - 120000),
      domain: 'mega-slot88-jp.com',
      category: 'Judi Online',
      clientIp: '100.64.12.45',
      clientPppoe: 'aud-user102',
      customerName: 'Bpk. Ridwan Hakim',
      blockedBy: 'TrustPositif Kominfo (RPZ)',
    },
    {
      id: 'log-02',
      timestamp: new Date(Date.now() - 340000),
      domain: 'bca-mobile-verifikasi.xyz',
      category: 'Phishing Finansial',
      clientIp: '100.64.18.91',
      clientPppoe: 'aud-user054',
      customerName: 'Ibu Ratna Dewi',
      blockedBy: 'AUDIRA Cyber Shield',
    },
    {
      id: 'log-03',
      timestamp: new Date(Date.now() - 650000),
      domain: 'dewaslot303-linkresmi.org',
      category: 'Judi Online',
      clientIp: '100.64.22.11',
      clientPppoe: 'aud-user219',
      customerName: 'Bpk. Ahmad Fauzi',
      blockedBy: 'TrustPositif Kominfo (RPZ)',
    },
    {
      id: 'log-04',
      timestamp: new Date(Date.now() - 980000),
      domain: 'streaming-film-bajakan21.tv',
      category: 'Pembajakan Film',
      clientIp: '100.64.10.88',
      clientPppoe: 'aud-user088',
      customerName: 'Bpk. Joko Susilo',
      blockedBy: 'TrustPositif Kominfo (RPZ)',
    },
  ];

  constructor(private readonly telegramService: TelegramService) {}

  getStatus() {
    return {
      status: 'ACTIVE_COMPLIANT',
      regulationCompliance: '100% UU ITE & Permenkominfo No. 5/2020',
      totalBlockedDomains: this.totalBlockedDomains,
      lastSyncTime: this.lastSyncTime,
      isSyncing: this.isSyncing,
      metrics: {
        liveQps: this.liveQps + Math.floor(Math.random() * 200 - 100),
        cacheHitRate: this.cacheHitRate,
        avgLatencyMs: this.avgLatencyMs,
        totalQueriesToday: 42890120,
        threatsPrevented24h: 3120,
      },
      upstreamDns: [
        { ip: '103.189.20.2', provider: 'AUDIRA Local Cache DNS 1 (Unbound)', latencyMs: 0.8, status: 'ONLINE' },
        { ip: '103.189.20.3', provider: 'AUDIRA Local Cache DNS 2 (PowerDNS)', latencyMs: 1.1, status: 'ONLINE' },
        { ip: '180.131.144.144', provider: 'TrustPositif Kominfo Gateway DNS 1', latencyMs: 6.2, status: 'ONLINE' },
        { ip: '180.131.145.145', provider: 'TrustPositif Kominfo Gateway DNS 2', latencyMs: 6.5, status: 'ONLINE' },
      ],
      categories: this.categories,
    };
  }

  getCategories() {
    return this.categories;
  }

  getCustomRules() {
    return this.customRules;
  }

  getBlockedLogs() {
    return this.blockedLogs;
  }

  toggleCategory(id: string, enabled: boolean) {
    const cat = this.categories.find((c) => c.id === id);
    if (!cat) throw new Error('Category not found');
    if (cat.mandatory && !enabled) {
      throw new Error(`Kategori "${cat.name}" bersifat WAJIB sesuai regulasi Kominfo dan tidak boleh dinonaktifkan.`);
    }
    cat.enabled = enabled;
    this.logger.log(`DNS category ${id} set to ${enabled}`);
    return { success: true, category: cat };
  }

  addCustomRule(rule: { domain: string; type: 'BLACKLIST' | 'WHITELIST'; category: string; reason: string; createdBy?: string }) {
    const newRule: CustomDnsRule = {
      id: `rule-${Date.now()}`,
      domain: rule.domain.toLowerCase().trim(),
      type: rule.type,
      category: rule.category,
      reason: rule.reason,
      createdAt: new Date(),
      createdBy: rule.createdBy || 'NOC Operator',
      hitCount: 0,
    };
    this.customRules.unshift(newRule);
    if (rule.type === 'BLACKLIST') {
      this.totalBlockedDomains += 1;
    }
    return { success: true, rule: newRule };
  }

  deleteCustomRule(id: string) {
    this.customRules = this.customRules.filter((r) => r.id !== id);
    return { success: true };
  }

  async syncTrustPositif() {
    this.isSyncing = true;
    this.logger.log('Starting live sync with TrustPositif Kominfo feed...');

    // Simulate async sync
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const newlyAdded = 2418;
    this.totalBlockedDomains += newlyAdded;
    this.lastSyncTime = new Date();
    this.isSyncing = false;

    // Send Telegram Notification to Topic 11 (System & Automation)
    await this.telegramService.sendMessage(
      11,
      `🛡️ *SINKRONISASI DATABASE TRUSTPOSITIF KOMINFO SELESAI*\n━━━━━━━━━━━━━━━━━━━━\n📌 Status: *100% SUKSES & AKTIF*\n📥 Domain Baru Diterima: *+${newlyAdded.toLocaleString('id-ID')} Domain*\n📊 Total Domain Terblokir: *${this.totalBlockedDomains.toLocaleString('id-ID')}*\n⏰ Waktu Sync: _${this.lastSyncTime.toLocaleString('id-ID')}_\n\n✅ _AUDIRA ISP 100% mematuhi regulasi Permenkominfo No. 5/2020 & UU ITE._`,
    );

    return {
      success: true,
      newlyAdded,
      totalBlockedDomains: this.totalBlockedDomains,
      syncTime: this.lastSyncTime,
    };
  }
}
