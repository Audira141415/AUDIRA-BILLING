const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating work order dummy data...');

  try {
    // Get existing users (technicians)
    let technicians = await prisma.user.findMany({
      where: {
        role: { in: ['TECHNICIAN', 'NOC'] }
      },
      take: 3
    });

    // If no technicians exist, create them
    if (technicians.length === 0) {
      console.log('Creating technicians...');
      const technicianData = [
        { email: 'ahmad.rizki@audira.net', name: 'Ahmad Rizki', role: 'TECHNICIAN' },
        { email: 'rudi.hartono@audira.net', name: 'Rudi Hartono', role: 'TECHNICIAN' },
        { email: 'eko.prasetyo@audira.net', name: 'Eko Prasetyo', role: 'TECHNICIAN' },
      ];

      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password123', 10);

      for (const tech of technicianData) {
        await prisma.user.create({
          data: {
            ...tech,
            password: hashedPassword,
            phone: '081234567' + Math.floor(Math.random() * 900 + 100),
          }
        });
      }

      technicians = await prisma.user.findMany({
        where: { role: 'TECHNICIAN' }
      });
    }

    // Get existing customers
    const customers = await prisma.customer.findMany({
      take: 5
    });

    if (customers.length === 0) {
      console.log('❌ No customers found. Please run create-dummy-data.js first');
      return;
    }

    console.log(`Found ${customers.length} customers and ${technicians.length} technicians`);

    // Create work orders
    const now = new Date();
    const workOrders = [
      {
        customerId: customers[0].id,
        technicianId: technicians[0].id,
        type: 'installation',
        priority: 'high',
        status: 'in-progress',
        title: 'Instalasi Baru - Paket 50 Mbps',
        description: 'Instalasi router dan ONT untuk pelanggan baru. Pemasangan di lantai 2 ruang kerja.',
        scheduledAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        startedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        location: customers[0].address || 'Jakarta',
        latitude: -6.2088,
        longitude: 106.8456,
        notes: 'Customer request cable management rapi. Sudah siapkan lubang untuk kabel.',
        photos: [
          'https://picsum.photos/seed/work1/400/300',
          'https://picsum.photos/seed/work2/400/300',
          'https://picsum.photos/seed/work3/400/300',
        ]
      },
      {
        customerId: customers[1].id,
        technicianId: technicians[1].id,
        type: 'repair',
        priority: 'urgent',
        status: 'assigned',
        title: 'Perbaikan Koneksi Lambat',
        description: 'Pelanggan melaporkan kecepatan internet sangat lambat sejak kemarin malam',
        scheduledAt: new Date(now.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
        location: customers[1].address || 'Jakarta',
        latitude: -6.1944,
        longitude: 106.8229,
      },
      {
        customerId: customers[2].id,
        technicianId: technicians[2].id,
        type: 'maintenance',
        priority: 'medium',
        status: 'completed',
        title: 'Maintenance Rutin - ONT Check',
        description: 'Pemeriksaan rutin perangkat ONT dan kualitas sinyal',
        scheduledAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // yesterday
        startedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 22 * 60 * 60 * 1000),
        location: customers[2].address || 'Jakarta',
        latitude: -6.2615,
        longitude: 106.7810,
        notes: 'Sinyal ONT bagus, sudah dibersihkan dan dicek semua kabel.',
        photos: [
          'https://picsum.photos/seed/maint1/400/300',
          'https://picsum.photos/seed/maint2/400/300',
        ],
        rating: 5,
        feedback: 'Teknisi sangat profesional dan ramah'
      },
      {
        customerId: customers[3].id,
        technicianId: technicians[0].id,
        type: 'repair',
        priority: 'high',
        status: 'on-route',
        title: 'Perbaikan Putus Total',
        description: 'Internet mati total sejak pagi. Indikator LOS menyala merah.',
        scheduledAt: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes from now
        location: customers[3].address || 'Jakarta',
        latitude: -6.2297,
        longitude: 106.8265,
      },
      {
        customerId: customers[4].id,
        technicianId: technicians[1].id,
        type: 'inspection',
        priority: 'low',
        status: 'pending',
        title: 'Survey Lokasi - Calon Pelanggan',
        description: 'Survey kelayakan pemasangan untuk calon pelanggan baru',
        scheduledAt: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 2 days from now
        location: customers[4].address || 'Jakarta',
        latitude: -6.1751,
        longitude: 106.8650,
      },
      {
        customerId: customers[0].id,
        technicianId: technicians[2].id,
        type: 'maintenance',
        priority: 'medium',
        status: 'pending',
        title: 'Upgrade Paket ke 100 Mbps',
        description: 'Customer request upgrade paket dari 50 Mbps ke 100 Mbps',
        scheduledAt: new Date(now.getTime() + 72 * 60 * 60 * 1000), // 3 days from now
        location: customers[0].address || 'Jakarta',
        latitude: -6.2088,
        longitude: 106.8456,
      },
      {
        customerId: customers[1].id,
        technicianId: technicians[0].id,
        type: 'installation',
        priority: 'high',
        status: 'completed',
        title: 'Instalasi WiFi Extender',
        description: 'Pemasangan WiFi extender tambahan untuk area lantai 3',
        scheduledAt: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
        startedAt: new Date(now.getTime() - 47 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 45 * 60 * 60 * 1000),
        location: customers[1].address || 'Jakarta',
        latitude: -6.1944,
        longitude: 106.8229,
        notes: 'Extender terpasang dengan baik, signal coverage sudah optimal',
        photos: [
          'https://picsum.photos/seed/ext1/400/300',
        ],
        rating: 4,
      },
    ];

    let created = 0;
    for (const wo of workOrders) {
      await prisma.workOrder.create({
        data: wo
      });
      created++;
    }

    console.log(`✅ ${created} work orders created`);

    // Summary
    const statusCount = await prisma.workOrder.groupBy({
      by: ['status'],
      _count: true,
    });

    console.log('\n📊 Summary:');
    console.log(`   - Total Work Orders: ${created}`);
    statusCount.forEach(s => {
      console.log(`   - ${s.status}: ${s._count}`);
    });
    console.log(`   - With Photos: ${workOrders.filter(w => w.photos && w.photos.length > 0).length}`);
    console.log(`   - Completed with Rating: ${workOrders.filter(w => w.rating).length}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
