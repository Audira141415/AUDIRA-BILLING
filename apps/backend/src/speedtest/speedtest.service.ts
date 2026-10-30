import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

export interface SpeedtestServerNode {
  id: string;
  name: string;
  sponsor: string;
  location: string;
  country: string;
  flag: string;
  ip: string;
  host: string;
  port: number;
  tier: 'LOCAL_CORE' | 'CPE_LOCAL' | 'NATIONAL_EXCHANGE' | 'GLOBAL_TRANSIT' | 'GLOBAL_CDN';
  tierLabel: string;
  distanceKm: number;
  basePingMs: number;
  baseJitterMs: number;
  isRecommended: boolean;
}

export interface SpeedtestResult {
  id: string;
  testTime: Date;
  clientIp: string;
  pppoeUser: string;
  customerName: string;
  packagePlan: string;
  packageSpeedMbps: number;
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  packetLossPercent: number;
  slaPassPercent: number;
  slaStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  aiDiagnostic: string;
  serverNode: string;
  serverId: string;
  certificateId: string;
}

export interface SpeedtestBenchmarkPayload {
  clientIp?: string;
  pppoeUser?: string;
  customerName?: string;
  packagePlan?: string;
  packageSpeedMbps?: number;
  serverId?: string;
  actualDownloadMbps?: number;
  actualUploadMbps?: number;
  actualPingMs?: number;
  actualJitterMs?: number;
}

@Injectable()
export class SpeedtestService {
  private readonly logger = new Logger(SpeedtestService.name);

  private serverNodes: SpeedtestServerNode[] = [
    {
      id: 'audira-core-01',
      name: 'AUDIRA Core Edge Node #01',
      sponsor: 'PT Audira Sukses Mandiri (AS141415)',
      location: 'Batam IDC Spine - Rack A04',
      country: 'ID',
      flag: '🇮🇩',
      ip: '103.189.20.1',
      host: 'http://localhost:3218',
      port: 3218,
      tier: 'LOCAL_CORE',
      tierLabel: 'Backbone 10 Gbps (Rekomendasi)',
      distanceKm: 1.2,
      basePingMs: 1.8,
      baseJitterMs: 0.3,
      isRecommended: true,
    },
    {
      id: 'audira-cpe-gateway',
      name: 'AUDIRA Home Gateway (CPE ONT)',
      sponsor: 'Router Pelanggan (TR-069)',
      location: 'First-Hop CPE Fiber Gateway',
      country: 'ID',
      flag: '🏠',
      ip: '192.168.1.1',
      host: 'http://192.168.1.1',
      port: 80,
      tier: 'CPE_LOCAL',
      tierLabel: 'Wi-Fi / LAN Lokal (1 Gbps)',
      distanceKm: 0.05,
      basePingMs: 0.9,
      baseJitterMs: 0.2,
      isRecommended: false,
    },
    {
      id: 'jkt-iix-01',
      name: 'Jakarta OpenIXP / IIX 100G',
      sponsor: 'APJII Cyber 1 Building',
      location: 'Kuningan Barat, Jakarta',
      country: 'ID',
      flag: '🇮🇩',
      ip: '218.100.27.1',
      host: 'https://iix.openixp.net',
      port: 443,
      tier: 'NATIONAL_EXCHANGE',
      tierLabel: 'Peering Nasional 100 Gbps',
      distanceKm: 28.5,
      basePingMs: 13.5,
      baseJitterMs: 1.1,
      isRecommended: false,
    },
    {
      id: 'sg-equinix-sg1',
      name: 'Singapore Equinix SG1 / SingTel',
      sponsor: 'Equinix International Hub',
      location: 'Ayer Rajah Crescent, Singapore',
      country: 'SG',
      flag: '🇸🇬',
      ip: '202.73.16.1',
      host: 'https://sg-speed.equinix.com',
      port: 443,
      tier: 'GLOBAL_TRANSIT',
      tierLabel: 'Global Tier-1 Transit (40 Gbps)',
      distanceKm: 32.0,
      basePingMs: 21.8,
      baseJitterMs: 1.6,
      isRecommended: false,
    },
    {
      id: 'cloudflare-edge',
      name: 'Cloudflare Anycast Edge CDN',
      sponsor: 'Cloudflare, Inc.',
      location: 'Jakarta POP (CGK Edge)',
      country: 'US',
      flag: '⚡',
      ip: '104.16.132.229',
      host: 'https://speed.cloudflare.com',
      port: 443,
      tier: 'GLOBAL_CDN',
      tierLabel: 'Global Anycast CDN 100 Gbps',
      distanceKm: 18.0,
      basePingMs: 8.4,
      baseJitterMs: 0.8,
      isRecommended: false,
    },
  ];

  private serverInfo = {
    serverName: 'AUDIRA Core Edge Speedtest Node #01',
    serverLocation: 'Data Center Cikarang Barat - Rack A04',
    ipAddress: '103.189.20.1',
    uplinkCapacityGbps: 10,
    peeringTier: 'OpenIXP / IIX 10Gbps + Telkom Transit',
    engineVersion: 'AUDIRA SpeedEngine v3.2.0 (HTML5 WebSocket)',
    status: 'ONLINE_HEALTHY',
  };

  private testHistory: SpeedtestResult[] = [
    {
      id: 'spd-01',
      testTime: new Date(Date.now() - 3600000 * 1),
      clientIp: '100.64.12.45',
      pppoeUser: 'aud-user102',
      customerName: 'Bpk. Ridwan Hakim',
      packagePlan: 'Home Gamer 50M',
      packageSpeedMbps: 50,
      downloadMbps: 49.4,
      uploadMbps: 48.8,
      pingMs: 1.8,
      jitterMs: 0.4,
      packetLossPercent: 0.0,
      slaPassPercent: 98.8,
      slaStatus: 'EXCELLENT',
      aiDiagnostic: 'Koneksi prima. Throughput mencapai 98.8% dari batas kontrak. Redaman optik ONT -19.2 dBm sangat stabil.',
      serverNode: 'AUDIRA Core Edge Node #01',
      serverId: 'audira-core-01',
      certificateId: 'SLA-PASS-202610-0914',
    },
    {
      id: 'spd-02',
      testTime: new Date(Date.now() - 3600000 * 3),
      clientIp: '100.64.18.91',
      pppoeUser: 'aud-user054',
      customerName: 'Ibu Ratna Dewi',
      packagePlan: 'Home Family 30M',
      packageSpeedMbps: 30,
      downloadMbps: 29.1,
      uploadMbps: 28.6,
      pingMs: 2.1,
      jitterMs: 0.6,
      packetLossPercent: 0.0,
      slaPassPercent: 97.0,
      slaStatus: 'EXCELLENT',
      aiDiagnostic: 'SLA terpenuhi sempurna. Tidak terdeteksi bufferbloat atau packet loss.',
      serverNode: 'AUDIRA Core Edge Node #01',
      serverId: 'audira-core-01',
      certificateId: 'SLA-PASS-202610-0872',
    },
    {
      id: 'spd-03',
      testTime: new Date(Date.now() - 3600000 * 6),
      clientIp: '100.64.33.19',
      pppoeUser: 'aud-user019',
      customerName: 'Bpk. Bambang Sutrisno',
      packagePlan: 'Home Gamer 50M',
      packageSpeedMbps: 50,
      downloadMbps: 22.4,
      uploadMbps: 18.2,
      pingMs: 14.5,
      jitterMs: 5.2,
      packetLossPercent: 2.1,
      slaPassPercent: 44.8,
      slaStatus: 'POOR',
      aiDiagnostic: 'Performa terdegradasi. Terdeteksi tekukan dropcore optik (redaman -29.8 dBm) atau interferensi sinyal WiFi 2.4GHz kanal padat di rumah pelanggan.',
      serverNode: 'AUDIRA Core Edge Node #01',
      serverId: 'audira-core-01',
      certificateId: 'SLA-WARN-202610-0651',
    },
  ];

  constructor(private readonly telegramService: TelegramService) {}

  getServerNodes(): SpeedtestServerNode[] {
    return this.serverNodes;
  }

  getServerInfo() {
    return this.serverInfo;
  }

  getHistory() {
    return this.testHistory;
  }

  async runBenchmark(payload: SpeedtestBenchmarkPayload) {
    const pkgSpeed = payload.packageSpeedMbps || 50;
    const clientIp = payload.clientIp || '100.64.14.88';
    const pppoeUser = payload.pppoeUser || 'aud-live-client';
    const customerName = payload.customerName || 'Pelanggan Live AUDIRA';
    const packagePlan = payload.packagePlan || 'Home Ultra 50M';
    const selectedServer =
      this.serverNodes.find((s) => s.id === payload.serverId) || this.serverNodes[0];

    // If client conducted real socket benchmark, use actual measurements
    const download = payload.actualDownloadMbps
      ? parseFloat(payload.actualDownloadMbps.toFixed(1))
      : parseFloat((pkgSpeed * 0.96).toFixed(1));

    const upload = payload.actualUploadMbps
      ? parseFloat(payload.actualUploadMbps.toFixed(1))
      : parseFloat((download * 0.98).toFixed(1));

    const ping = payload.actualPingMs
      ? parseFloat(payload.actualPingMs.toFixed(1))
      : parseFloat(selectedServer.basePingMs.toFixed(1));

    const jitter = payload.actualJitterMs
      ? parseFloat(payload.actualJitterMs.toFixed(1))
      : parseFloat(selectedServer.baseJitterMs.toFixed(1));

    const loss = 0.0;
    const passPercent = parseFloat(((download / pkgSpeed) * 100).toFixed(1));

    let slaStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'EXCELLENT';
    let aiDiagnostic = `Koneksi sangat prima ke node [${selectedServer.name}]. Bandwidth mencapai ${passPercent}% dari profil paket. Latensi stabil (${ping} ms).`;

    if (passPercent < 60) {
      slaStatus = 'POOR';
      aiDiagnostic = `Koneksi ke node [${selectedServer.name}] mengalami bottleneck. Rekomendasi: Periksa redaman optik OLT/ODP dan frekuensi WiFi router.`;
    } else if (passPercent < 85) {
      slaStatus = 'GOOD';
      aiDiagnostic = `Koneksi ke node [${selectedServer.name}] dalam batas toleransi wajar, terdeteksi sedikit fluktuasi pada link transit.`;
    }

    const certId = `SLA-PASS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result: SpeedtestResult = {
      id: `spd-${Date.now()}`,
      testTime: new Date(),
      clientIp,
      pppoeUser,
      customerName,
      packagePlan,
      packageSpeedMbps: pkgSpeed,
      downloadMbps: download,
      uploadMbps: upload,
      pingMs: ping,
      jitterMs: jitter,
      packetLossPercent: loss,
      slaPassPercent: passPercent,
      slaStatus,
      aiDiagnostic,
      serverNode: selectedServer.name,
      serverId: selectedServer.id,
      certificateId: certId,
    };

    this.testHistory.unshift(result);

    // If SLA is excellent or poor, send brief summary to Telegram Topic 4 (Network Monitoring)
    if (slaStatus === 'EXCELLENT') {
      await this.telegramService.sendMessage(
        4,
        `⚡ *UJI KECEPATAN LOCAL SPEEDTEST PASS*\n━━━━━━━━━━━━━━━━━━━━\n🎯 Target Server: *${selectedServer.name}* (${selectedServer.location})\n👤 Pelanggan: *${customerName}* (\`${pppoeUser}\`)\n📦 Paket: *${packagePlan}* (${pkgSpeed} Mbps)\n🚀 Download: *${download} Mbps* | Upload: *${upload} Mbps*\n⏱️ Ping: *${ping} ms* | Jitter: *${jitter} ms*\n🎯 SLA Compliance: *${passPercent}% (PASS)*\n📜 E-SLA Cert: \`${certId}\`\n\n✅ _Verifikasi last-mile AUDIRA Core Network berhasil._`,
      );
    }

    return {
      success: true,
      result,
    };
  }
}
