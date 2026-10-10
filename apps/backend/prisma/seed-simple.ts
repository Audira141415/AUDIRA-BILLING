import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple seed...');

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin AudiraBilling',
      email: 'admin@audira.net',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    },
  });

  console.log('✅ Users created');

  // 2. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'PT. Maju Jaya',
      email: 'admin@majujaya.com',
      phone: '021-1234567',
      address: 'Jl. Sudirman No. 100, Jakarta',
      status: 'active',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Bapak Andi Susanto',
      email: 'andi.susanto@gmail.com',
      phone: '081234567890',
      address: 'Jl. Gatot Subroto No. 25, Jakarta',
      status: 'active',
    },
  });

  console.log('✅ Customers created');

  // 3. Create Packages
  const package10M = await prisma.package.create({
    data: {
      name: 'Home 10 Mbps',
      speed: '10 Mbps',
      price: 200000,
      description: 'Paket rumahan 10 Mbps unlimited',
      status: 'active',
    },
  });

  const package20M = await prisma.package.create({
    data: {
      name: 'Home 20 Mbps',
      speed: '20 Mbps',
      price: 350000,
      description: 'Paket rumahan 20 Mbps unlimited',
      status: 'active',
    },
  });

  console.log('✅ Packages created');

  // 4. Create MikroTik Device
  const mikrotik1 = await prisma.mikrotik.create({
    data: {
      name: 'Core-Router-JKT01',
      ipAddress: '192.168.1.1',
      username: 'admin',
      password: 'password123',
      port: 8728,
      location: 'Jakarta Pusat',
      status: 'active',
    },
  });

  console.log('✅ MikroTik devices created');

  // 5. Create Services
  const service1 = await prisma.service.create({
    data: {
      customerId: customer1.id,
      packageId: package10M.id,
      status: 'active',
      ipAddress: '10.10.1.100',
      pppoeUsername: 'majujaya@audira',
      pppoePassword: 'pass123',
    },
  });

  console.log('✅ Services created');

  // 6. Create Invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      customerId: customer1.id,
      amount: package10M.price,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'unpaid',
    },
  });

  console.log('✅ Invoices created');

  // 7. Create Tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      customerId: customer1.id,
      title: 'Internet Lambat',
      description: 'Kecepatan internet tidak sesuai paket',
      priority: 'high',
      status: 'open',
    },
  });

  console.log('✅ Tickets created');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${(await prisma.user.count())} users`);
  console.log(`   - ${(await prisma.customer.count())} customers`);
  console.log(`   - ${(await prisma.package.count())} packages`);
  console.log(`   - ${(await prisma.mikrotik.count())} MikroTik devices`);
  console.log(`   - ${(await prisma.service.count())} services`);
  console.log(`   - ${(await prisma.invoice.count())} invoices`);
  console.log(`   - ${(await prisma.ticket.count())} tickets`);
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('   Admin: admin@audira.net / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
