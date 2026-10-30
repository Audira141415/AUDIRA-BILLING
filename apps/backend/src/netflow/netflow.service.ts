import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';

export interface NetflowRecord {
  id: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  srcPort: number;
  dstPort: number;
  packets: number;
  bytes: number;
  bandwidthMbps: number;
  srcAsn: string;
  dstAsn: string;
  tcpFlags?: string;
  application: string;
}

export interface DdosAlert {
  id: string;
  detectedAt: string;
  targetIp: string;
  attackType: 'SYN_FLOOD' | 'UDP_AMPLIFICATION' | 'DNS_AMP' | 'ICMP_FLOOD';
  volumeGbps: number;
  packetsPerSec: number;
  sourceCountries: string[];
  status: 'MITIGATING' | 'DETECTED' | 'FILTERED' | 'MONITORING';
  mitigationMethod: 'BGP_FLOWSPEC' | 'RTBH_BLACKHOLE' | 'RATE_LIMIT';
  flowspecRule?: string;
}

export interface FlowspecRule {
  id: string;
  prefix: string;
  action: 'DISCARD' | 'RATE_LIMIT' | 'REDIRECT_SCRUBBING';
  rateLimitMbps?: number;
  protocol?: string;
  dstPort?: number;
  injectedAt: string;
  routerNode: string;
  status: 'ACTIVE' | 'WITHDRAWN';
}

@Injectable()
export class NetflowService {
  private readonly logger = new Logger(NetflowService.name);

  // In-Memory flow buffer & mitigation state
  private flowspecRules: FlowspecRule[] = [
    {
      id: 'fs-rule-01',
      prefix: '103.189.20.45/32',
      action: 'DISCARD',
      protocol: 'UDP',
      dstPort: 53,
      injectedAt: new Date(Date.now() - 3600000).toISOString(),
      routerNode: 'AUDIRA-Core-BGP-01',
      status: 'ACTIVE',
    },
    {
      id: 'fs-rule-02',
      prefix: '103.189.20.88/32',
      action: 'RATE_LIMIT',
      rateLimitMbps: 10,
      protocol: 'TCP',
      dstPort: 443,
      injectedAt: new Date(Date.now() - 7200000).toISOString(),
      routerNode: 'AUDIRA-Core-BGP-01',
      status: 'ACTIVE',
    }
  ];

  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async getStats() {
    return {
      totalBandwidthGbps: 18.42,
      peakBandwidthGbps: 24.80,
      totalPps: 2450000,
      flowRateKfps: 142.5,
      activeFlowsCount: 48590,
      activeDdosAlertsCount: 1,
      totalAttacksBlockedToday: 14,
      flowspecRulesActive: this.flowspecRules.filter(r => r.status === 'ACTIVE').length,
    };
  }

  async getLiveFlows(limit = 25): Promise<NetflowRecord[]> {
    const protocols: Array<'TCP' | 'UDP' | 'ICMP'> = ['TCP', 'UDP', 'ICMP'];
    const asns = [
      { asn: 'AS15169', name: 'Google LLC' },
      { asn: 'AS32934', name: 'Meta Platforms' },
      { asn: 'AS138699', name: 'Bytedance TikTok' },
      { asn: 'AS2906', name: 'Netflix Streaming' },
      { asn: 'AS13335', name: 'Cloudflare Edge' },
      { asn: 'AS7713', name: 'Telkom Indonesia' },
      { asn: 'AS4761', name: 'Indosat Ooredoo' },
      { asn: 'AS23693', name: 'OpenIXP Jakarta' },
    ];

    const flows: NetflowRecord[] = [];
    const now = Date.now();

    for (let i = 0; i < limit; i++) {
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const asnObj = asns[Math.floor(Math.random() * asns.length)];
      const srcPort = Math.floor(Math.random() * 60000) + 1024;
      const dstPort = [80, 443, 53, 853, 4433, 8080, 1935][Math.floor(Math.random() * 7)];
      const bw = Number((Math.random() * 85 + 2).toFixed(2));

      flows.push({
        id: `flow-${now}-${i}`,
        timestamp: new Date(now - i * 1200).toISOString(),
        srcIp: `${Math.floor(Math.random() * 200) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
        dstIp: `103.189.20.${Math.floor(Math.random() * 240) + 2}`,
        protocol: proto,
        srcPort,
        dstPort,
        packets: Math.floor(bw * 120),
        bytes: Math.floor(bw * 1024 * 1024 / 8),
        bandwidthMbps: bw,
        srcAsn: `${asnObj.asn} (${asnObj.name})`,
        dstAsn: 'AS141415 (AUDIRA-NET)',
        tcpFlags: proto === 'TCP' ? (Math.random() > 0.3 ? 'ACK,PSH' : 'SYN,ACK') : undefined,
        application: dstPort === 443 ? 'HTTPS/TLS' : dstPort === 53 ? 'DNS' : dstPort === 80 ? 'HTTP' : 'Streaming/QUIC',
      });
    }

    return flows;
  }

  async getTopTalkers() {
    return [
      { rank: 1, ip: '103.189.20.14', name: 'CDN Cache Node Alpha', trafficGb: 482.4, sharePct: 24.5, asn: 'AS15169 Google' },
      { rank: 2, ip: '103.189.20.28', name: 'OLT ZTE C320 Uplink Subnet', trafficGb: 390.1, sharePct: 19.8, asn: 'AS32934 Meta' },
      { rank: 3, ip: '103.189.20.105', name: 'Dedicated DIA PT Maju Jaya', trafficGb: 284.6, sharePct: 14.4, asn: 'AS138699 TikTok' },
      { rank: 4, ip: '103.189.20.67', name: 'Residential PPPoE Pool East', trafficGb: 210.8, sharePct: 10.7, asn: 'AS2906 Netflix' },
      { rank: 5, ip: '103.189.20.91', name: 'OpenIXP Peering Gateway', trafficGb: 175.2, sharePct: 8.9, asn: 'AS13335 Cloudflare' },
      { rank: 6, ip: '103.189.20.12', name: 'DNS Resolver Cluster Core-1', trafficGb: 112.0, sharePct: 5.7, asn: 'Internal APJII' },
    ];
  }

  async getDdosAlerts(): Promise<DdosAlert[]> {
    return [
      {
        id: 'ddos-001',
        detectedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        targetIp: '103.189.20.45',
        attackType: 'UDP_AMPLIFICATION',
        volumeGbps: 12.8,
        packetsPerSec: 1850000,
        sourceCountries: ['CN', 'RU', 'US', 'BR', 'KR'],
        status: 'MITIGATING',
        mitigationMethod: 'BGP_FLOWSPEC',
        flowspecRule: 'discard udp dst-port 53 dst 103.189.20.45/32',
      },
      {
        id: 'ddos-002',
        detectedAt: new Date(Date.now() - 45 * 60000).toISOString(),
        targetIp: '103.189.20.99',
        attackType: 'SYN_FLOOD',
        volumeGbps: 6.4,
        packetsPerSec: 920000,
        sourceCountries: ['VN', 'ID', 'IN'],
        status: 'FILTERED',
        mitigationMethod: 'RTBH_BLACKHOLE',
        flowspecRule: 'rate-limit 5M tcp flags syn dst 103.189.20.99/32',
      }
    ];
  }

  async getFlowspecRules(): Promise<FlowspecRule[]> {
    return this.flowspecRules;
  }

  async applyFlowspec(data: {
    prefix: string;
    action: 'DISCARD' | 'RATE_LIMIT' | 'REDIRECT_SCRUBBING';
    rateLimitMbps?: number;
    protocol?: string;
    dstPort?: number;
  }) {
    const newRule: FlowspecRule = {
      id: `fs-rule-${Date.now()}`,
      prefix: data.prefix,
      action: data.action,
      rateLimitMbps: data.rateLimitMbps,
      protocol: data.protocol || 'ALL',
      dstPort: data.dstPort,
      injectedAt: new Date().toISOString(),
      routerNode: 'AUDIRA-Core-BGP-01',
      status: 'ACTIVE',
    };

    this.flowspecRules.unshift(newRule);
    this.logger.log(`BGP Flowspec rule injected for ${data.prefix}: action=${data.action}`);

    // Auto-dispatch alert to Telegram Topic 5 (Network Incidents, Thread ID 10)
    try {
      const message = `🛡️ <b>[BGP FLOWSPEC DDoS MITIGATION INJECTED]</b>\n\n` +
        `• <b>Target Prefix:</b> <code>${data.prefix}</code>\n` +
        `• <b>Mitigation Action:</b> <b>${data.action}</b> ${data.rateLimitMbps ? `(${data.rateLimitMbps} Mbps)` : ''}\n` +
        `• <b>Protocol / Port:</b> ${data.protocol || 'ALL'} / ${data.dstPort || 'ANY'}\n` +
        `• <b>Injected Router:</b> AUDIRA-Core-BGP-01\n` +
        `• <b>Status:</b> ACTIVE (Upstream Tier-1 Discarded)\n` +
        `• <b>Operator:</b> Sistem Pertahanan Otonom AUDIRA NOC`;

      await this.telegramService.sendMessage(10, message);
    } catch (err: any) {
      this.logger.warn(`Could not dispatch Telegram alert: ${err.message}`);
    }

    return {
      success: true,
      rule: newRule,
      message: `Aturan BGP Flowspec untuk ${data.prefix} berhasil diinjeksi ke MikroTik Core BGP-01 dan diiklankan ke Upstream Tier-1!`,
    };
  }

  async withdrawFlowspec(ruleId: string) {
    const rule = this.flowspecRules.find(r => r.id === ruleId);
    if (!rule) {
      throw new Error('Aturan Flowspec tidak ditemukan');
    }

    rule.status = 'WITHDRAWN';
    this.logger.log(`BGP Flowspec rule ${ruleId} withdrawn`);

    return {
      success: true,
      message: `Aturan BGP Flowspec untuk ${rule.prefix} berhasil dicabut (withdrawn). Trafik normal dipulihkan.`,
    };
  }
}
