import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenieacsService {
  constructor(private prisma: PrismaService) {}

  async getDevices(search?: string) {
    const devices = [
      {
        id: 'device-001',
        serialNumber: 'SN123456789',
        productClass: 'ONT',
        manufacturer: 'Huawei',
        model: 'HG8245H5',
        softwareVersion: 'V5R021C10S215',
        hardwareVersion: '168D.A',
        connectionRequestURL: 'http://192.168.1.1:7547',
        lastInform: new Date(),
        status: 'online',
        ipAddress: '192.168.1.1',
        macAddress: 'AA:BB:CC:DD:EE:FF',
      },
      {
        id: 'device-002',
        serialNumber: 'SN987654321',
        productClass: 'ONT',
        manufacturer: 'ZTE',
        model: 'F670L',
        softwareVersion: 'V8.0.10P6N1',
        hardwareVersion: 'V5.0',
        connectionRequestURL: 'http://192.168.1.2:7547',
        lastInform: new Date(Date.now() - 3600000),
        status: 'online',
        ipAddress: '192.168.1.2',
        macAddress: 'FF:EE:DD:CC:BB:AA',
      },
    ];

    if (search) {
      return devices.filter(d => 
        d.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        d.model.toLowerCase().includes(search.toLowerCase()) ||
        d.manufacturer.toLowerCase().includes(search.toLowerCase())
      );
    }

    return devices;
  }

  async getDevice(id: string) {
    const devices = await this.getDevices();
    return devices.find(d => d.id === id);
  }

  async refreshDevice(id: string) {
    return {
      success: true,
      message: `Device ${id} refresh initiated`,
      taskId: `task-${Date.now()}`,
    };
  }

  async rebootDevice(id: string) {
    return {
      success: true,
      message: `Device ${id} reboot initiated`,
      taskId: `task-${Date.now()}`,
    };
  }

  async factoryReset(id: string) {
    return {
      success: true,
      message: `Device ${id} factory reset initiated`,
      taskId: `task-${Date.now()}`,
    };
  }

  async getDeviceParameters(id: string) {
    return {
      deviceId: id,
      parameters: {
        'InternetGatewayDevice.DeviceInfo.SerialNumber': 'SN123456789',
        'InternetGatewayDevice.DeviceInfo.SoftwareVersion': 'V5R021C10S215',
        'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress': '103.xxx.xxx.xxx',
        'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID': 'MyWiFi',
        'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase': '********',
      },
    };
  }

  async setDeviceParameters(id: string, parameters: Record<string, any>) {
    return {
      success: true,
      message: `Parameters set for device ${id}`,
      taskId: `task-${Date.now()}`,
      parameters,
    };
  }

  async getStats() {
    return {
      totalDevices: 2,
      onlineDevices: 2,
      offlineDevices: 0,
      devicesByManufacturer: {
        Huawei: 1,
        ZTE: 1,
      },
      devicesByModel: {
        'HG8245H5': 1,
        'F670L': 1,
      },
      lastUpdate: new Date(),
    };
  }

  async getPresets() {
    return [
      {
        name: 'wifi_config',
        channel: 'WiFi Configuration',
        precondition: '{}',
        configurations: [
          { type: 'value', name: 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID', value: 'AudiraNet' },
        ],
      },
      {
        name: 'firmware_upgrade',
        channel: 'Firmware Upgrade',
        precondition: '{}',
        configurations: [
          { type: 'download', name: 'firmware', fileType: '1 Firmware Upgrade Image' },
        ],
      },
    ];
  }

  async createPreset(preset: any) {
    return {
      success: true,
      message: 'Preset created successfully',
      preset,
    };
  }

  async deletePreset(name: string) {
    return {
      success: true,
      message: `Preset ${name} deleted successfully`,
    };
  }
}
