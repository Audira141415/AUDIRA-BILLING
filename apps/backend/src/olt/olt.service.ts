import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OltService implements OnModuleInit {
  private readonly logger = new Logger(OltService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultOlts();
  }

  /**
   * Seed default OLT chassis & discovered unconfigured ONUs
   */
  async seedDefaultOlts() {
    try {
      const count = await this.prisma.oltDevice.count();
      if (count === 0) {
        const oltZte = await this.prisma.oltDevice.create({
          data: {
            name: 'OLT-ZTE-C320-Pusat',
            brand: 'ZTE',
            ipAddress: '10.10.10.2',
            snmpPort: 161,
            telnetPort: 23,
            sshPort: 22,
            username: 'admin',
            password: 'ztepassword',
            ponCount: 8,
            status: 'ONLINE',
            description: 'OLT Core ZTE C320 Card GTGO 8-Port GPON di Data Center Pusat',
          },
        });

        const oltVsol = await this.prisma.oltDevice.create({
          data: {
            name: 'OLT-VSOL-V1600G-POP01',
            brand: 'VSOL',
            ipAddress: '10.10.10.3',
            snmpPort: 161,
            telnetPort: 23,
            sshPort: 22,
            username: 'admin',
            password: 'vsolpassword',
            ponCount: 16,
            status: 'ONLINE',
            description: 'OLT Distribusi POP Timur 16-Port GPON',
          },
        });

        // Seed 2 Unregistered ONUs yang baru dicolok teknisi di tiang/rumah pelanggan
        await this.prisma.oltOnu.createMany({
          data: [
            {
              oltId: oltZte.id,
              ponPort: '1/1/2',
              serialNumber: 'ZTEGC89A2140',
              status: 'UNREGISTERED',
              rxPower: -18.7,
            },
            {
              oltId: oltZte.id,
              ponPort: '1/1/4',
              serialNumber: 'HWTC98234102',
              status: 'UNREGISTERED',
              rxPower: -19.2,
            },
          ],
        });

        this.logger.log('Seeded 2 OLT chassis and 2 discovered unconfigured ONUs');
      }
    } catch (err: any) {
      this.logger.warn(`OLT seeding error: ${err.message}`);
    }
  }

  /**
   * Ambil semua OLT beserta jumlah ONU
   */
  async getOlts() {
    return this.prisma.oltDevice.findMany({
      include: {
        _count: {
          select: {
            onus: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Dapatkan modem baru yang dicolok dan belum diregistrasi (Unregistered ONUs)
   */
  async getUnregisteredOnus(oltId?: string) {
    const where: any = { status: 'UNREGISTERED' };
    if (oltId) where.oltId = oltId;

    return this.prisma.oltOnu.findMany({
      where,
      include: {
        olt: { select: { id: true, name: true, brand: true, ipAddress: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Dapatkan modem yang sudah aktif terdaftar (Registered ONUs)
   */
  async getRegisteredOnus(oltId?: string) {
    const where: any = { status: 'REGISTERED' };
    if (oltId) where.oltId = oltId;

    return this.prisma.oltOnu.findMany({
      where,
      include: {
        olt: { select: { id: true, name: true, brand: true } },
      },
      orderBy: { registeredAt: 'desc' },
    });
  }

  /**
   * Zero-Touch 1-Klik Aktivasi & Auto-Binding ONU ke OLT
   */
  async registerOnu(data: {
    oltId: string;
    serialNumber: string;
    ponPort: string;
    customerName: string;
    customerId?: string;
    vlanId: number;
    profileName?: string;
  }) {
    const olt = await this.prisma.oltDevice.findUnique({
      where: { id: data.oltId },
    });

    if (!olt) {
      throw new Error('OLT tidak ditemukan');
    }

    // Hitung next ONU index di PON port tersebut
    const existingCount = await this.prisma.oltOnu.count({
      where: { oltId: data.oltId, ponPort: data.ponPort, status: 'REGISTERED' },
    });
    const onuIndex = existingCount + 1;
    const vlanId = Number(data.vlanId) || 100;

    // 1. Generate CLI Script Spesifik Vendor OLT (ZTE / Huawei / VSOL)
    let generatedScript = '';
    if (olt.brand === 'ZTE') {
      generatedScript = 
`! --- ZTE C320 AUTO-PROVISIONING SCRIPT ---
interface gpon-olt_${data.ponPort}
  onu ${onuIndex} type ALL sn ${data.serialNumber}
exit
interface gpon-onu_${data.ponPort}:${onuIndex}
  name ${data.customerName.replace(/\s+/g, '_')}
  tcont 1 profile 100M
  gemport 1 tcont 1
  service-port 1 vport 1 user-vlan ${vlanId} vlan ${vlanId}
exit
write`;
    } else if (olt.brand === 'HUAWEI') {
      generatedScript = 
`! --- HUAWEI MA5608T AUTO-PROVISIONING SCRIPT ---
interface gpon 0/${data.ponPort.split('/')[0] || '1'}
  ont add ${data.ponPort.split('/')[1] || '1'} ${onuIndex} sn-auth "${data.serialNumber}" omci ont-lineprofile-id 10 ont-srvprofile-id 10 desc "${data.customerName}"
  service-port vlan ${vlanId} gpon 0/${data.ponPort} ont ${onuIndex} gemport 1 multi-service user-vlan ${vlanId}
quit
save`;
    } else {
      // VSOL / HiOSO
      generatedScript = 
`! --- VSOL GPON ZERO-TOUCH SCRIPT ---
ont add ${data.ponPort} ${onuIndex} sn ${data.serialNumber} desc "${data.customerName}"
ont port vlan ${data.ponPort} ${onuIndex} eth 1 translation ${vlanId}
write`;
    }

    // 2. Update status ONU di database
    const updatedOnu = await this.prisma.oltOnu.upsert({
      where: {
        oltId_serialNumber: {
          oltId: data.oltId,
          serialNumber: data.serialNumber,
        },
      },
      update: {
        status: 'REGISTERED',
        onuIndex,
        customerName: data.customerName,
        customerId: data.customerId,
        vlanId,
        registeredAt: new Date(),
      },
      create: {
        oltId: data.oltId,
        serialNumber: data.serialNumber,
        ponPort: data.ponPort,
        status: 'REGISTERED',
        onuIndex,
        customerName: data.customerName,
        customerId: data.customerId,
        vlanId,
        registeredAt: new Date(),
      },
      include: { olt: true },
    });

    this.logger.log(`[OLT Zero-Touch] ONU ${data.serialNumber} berhasil diregistrasi di ${olt.name} Port ${data.ponPort}:${onuIndex} untuk ${data.customerName}`);

    return {
      success: true,
      message: `Modem ${data.serialNumber} berhasil di-binding ke ${olt.name} Port ${data.ponPort}:${onuIndex} untuk pelanggan ${data.customerName}`,
      onu: updatedOnu,
      generatedScript,
    };
  }

  /**
   * Statistik OLT & ONU
   */
  async getOltStats() {
    const totalOlts = await this.prisma.oltDevice.count();
    const registeredOnus = await this.prisma.oltOnu.count({ where: { status: 'REGISTERED' } });
    const unregisteredOnus = await this.prisma.oltOnu.count({ where: { status: 'UNREGISTERED' } });

    return {
      totalOlts,
      registeredOnus,
      unregisteredOnus,
    };
  }
}
