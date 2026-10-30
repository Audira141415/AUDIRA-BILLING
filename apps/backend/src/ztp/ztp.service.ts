import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

export interface DiscoveredONU {
  id: string;
  serialNumber: string;
  macAddress: string;
  vendorModel: string;
  oltId: string;
  oltName: string;
  ponPort: string;
  opticalRxDbm: number;
  discoveredAt: Date;
  status: 'PENDING_ASSIGNMENT' | 'PROVISIONING' | 'ACTIVE';
}

export interface ZtpProvisionHistory {
  id: string;
  timestamp: Date;
  serialNumber: string;
  macAddress: string;
  oltName: string;
  ponPort: string;
  onuId: number;
  vlanId: number;
  customerId: string;
  customerName: string;
  pppoeUser: string;
  wifiSsid: string;
  opticalRxDbm: number;
  technicianName: string;
  durationSeconds: number;
  status: 'SUCCESS' | 'FAILED';
}

@Injectable()
export class ZtpService {
  private readonly logger = new Logger(ZtpService.name);

  private discoveryQueue: DiscoveredONU[] = [
    {
      id: 'disc-01',
      serialNumber: 'ZTEG-CA892014',
      macAddress: '48:D2:24:CA:89:20',
      vendorModel: 'ZTE F670L (Dual Band AC1200)',
      oltId: 'olt-01',
      oltName: 'OLT-HUAWEI-MA5608T-POP-BARAT',
      ponPort: 'PON 0/1/3',
      opticalRxDbm: -19.25,
      discoveredAt: new Date(Date.now() - 180000),
      status: 'PENDING_ASSIGNMENT',
    },
    {
      id: 'disc-02',
      serialNumber: 'HWTC-89102451',
      macAddress: 'E4:68:A3:89:10:24',
      vendorModel: 'Huawei HG8245H5 (GE/FE/WiFi)',
      oltId: 'olt-01',
      oltName: 'OLT-HUAWEI-MA5608T-POP-BARAT',
      ponPort: 'PON 0/1/4',
      opticalRxDbm: -21.40,
      discoveredAt: new Date(Date.now() - 450000),
      status: 'PENDING_ASSIGNMENT',
    },
    {
      id: 'disc-03',
      serialNumber: 'VSOL-99214401',
      macAddress: '00:1E:E3:99:21:44',
      vendorModel: 'V-SOL V2801SG (XPON 1GE Bridge)',
      oltId: 'olt-02',
      oltName: 'OLT-ZTE-C320-POP-TIMUR',
      ponPort: 'PON 0/2/1',
      opticalRxDbm: -18.80,
      discoveredAt: new Date(Date.now() - 720000),
      status: 'PENDING_ASSIGNMENT',
    },
  ];

  private history: ZtpProvisionHistory[] = [
    {
      id: 'ztp-hist-01',
      timestamp: new Date(Date.now() - 3600000 * 2),
      serialNumber: 'ZTEG-C8879102',
      macAddress: '48:D2:24:C8:87:91',
      oltName: 'OLT-HUAWEI-MA5608T-POP-BARAT',
      ponPort: 'PON 0/1/2',
      onuId: 14,
      vlanId: 200,
      customerId: 'cust-1029',
      customerName: 'Bpk. Ridwan Hakim',
      pppoeUser: 'aud-ridwan102',
      wifiSsid: 'AUDIRA-Ridwan-Home',
      opticalRxDbm: -18.60,
      technicianName: 'Agung Wicaksono',
      durationSeconds: 2.3,
      status: 'SUCCESS',
    },
    {
      id: 'ztp-hist-02',
      timestamp: new Date(Date.now() - 86400000 * 1),
      serialNumber: 'HWTC-55219904',
      macAddress: 'E4:68:A3:55:21:99',
      oltName: 'OLT-ZTE-C320-POP-TIMUR',
      ponPort: 'PON 0/1/1',
      onuId: 8,
      vlanId: 100,
      customerId: 'cust-1011',
      customerName: 'Ibu Ratna Dewi',
      pppoeUser: 'aud-ratna054',
      wifiSsid: 'AUDIRA-Ratna-Family',
      opticalRxDbm: -19.45,
      technicianName: 'Budi Santoso',
      durationSeconds: 2.6,
      status: 'SUCCESS',
    },
  ];

  constructor(private readonly telegramService: TelegramService) {}

  getDiscoveryQueue() {
    return {
      success: true,
      count: this.discoveryQueue.length,
      queue: this.discoveryQueue,
    };
  }

  getHistory() {
    return {
      success: true,
      totalSuccess: this.history.filter((h) => h.status === 'SUCCESS').length,
      avgDurationSeconds: 2.4,
      history: this.history,
    };
  }

  async autoProvision(payload: {
    discoveryId: string;
    customerName: string;
    internetNumber: string;
    packagePlan: string;
    wifiSsid?: string;
    wifiPassword?: string;
    technicianName?: string;
  }) {
    const item = this.discoveryQueue.find((d) => d.id === payload.discoveryId);
    if (!item) {
      throw new Error('Modem ONT tidak ditemukan di antrean discovery queue');
    }

    this.logger.log(`Starting Zero-Touch Provisioning for SN: ${item.serialNumber} -> ${payload.customerName}`);
    item.status = 'PROVISIONING';

    // Simulate 3-Step Microsecond Automated Pipeline
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const pppoeUser = `aud-${payload.customerName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}${Math.floor(10 + Math.random() * 90)}`;
    const ssid = payload.wifiSsid || `AUDIRA-${payload.customerName.split(' ')[0]}-WiFi`;
    const onuId = Math.floor(1 + Math.random() * 64);
    const vlanId = 200;

    const record: ZtpProvisionHistory = {
      id: `ztp-${Date.now()}`,
      timestamp: new Date(),
      serialNumber: item.serialNumber,
      macAddress: item.macAddress,
      oltName: item.oltName,
      ponPort: item.ponPort,
      onuId,
      vlanId,
      customerId: `cust-${Date.now()}`,
      customerName: payload.customerName,
      pppoeUser,
      wifiSsid: ssid,
      opticalRxDbm: item.opticalRxDbm,
      technicianName: payload.technicianName || 'Teknisi Lapangan AUDIRA',
      durationSeconds: 2.1,
      status: 'SUCCESS',
    };

    // Remove from queue and add to history
    this.discoveryQueue = this.discoveryQueue.filter((d) => d.id !== payload.discoveryId);
    this.history.unshift(record);

    // Send Telegram Notification to Topic 8 (Installation & Activation)
    await this.telegramService.notifyInstallationActivation({
      customerName: payload.customerName,
      internetNumber: payload.internetNumber,
      ontSn: item.serialNumber,
      opticalRxDbm: item.opticalRxDbm,
      technicianName: payload.technicianName || 'Teknisi Lapangan AUDIRA',
    });

    return {
      success: true,
      message: 'Zero-Touch Provisioning Berhasil (100% Otomatis OLT + MikroTik + TR-069)',
      pipelineResults: {
        step1_olt: {
          status: 'SUCCESS',
          message: `ONU ID #${onuId} registered on ${item.ponPort} (VLAN ${vlanId})`,
        },
        step2_mikrotik: {
          status: 'SUCCESS',
          message: `PPPoE Secret ${pppoeUser} created on Core Router (Profile: ${payload.packagePlan})`,
        },
        step3_tr069: {
          status: 'SUCCESS',
          message: `WiFi SSID "${ssid}" & WPA2 pushed via GenieACS TR-069`,
        },
      },
      record,
    };
  }
}
