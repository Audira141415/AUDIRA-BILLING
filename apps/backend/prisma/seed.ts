import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple seed...');

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@audira.net',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      phone: '+6281234567890',
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create Billing User
  const billingUser = await prisma.user.create({
    data: {
      email: 'billing@audira.net',
      name: 'Billing User',
      password: await bcrypt.hash('billing123', 10),
      role: 'BILLING',
      phone: '+6281234567891',
    },
  });
  console.log('✅ Billing user created:', billingUser.email);

  // Create Customer 1
  const customer1 = await prisma.customer.create({
    data: {
      email: 'customer@example.com',
      name: 'John Customer',
      password: await bcrypt.hash('customer123', 10),
      phone: '+6281234567892',
      address: 'Jl. Example No. 123',
      internetNumber: 'INT001',
      ipAddress: '192.168.1.100',
      installedModem: 'TP-Link Archer C6',
      modemSerial: 'SN12345678',
      installationDate: new Date('2024-01-15'),
    },
  });
  console.log('✅ Customer 1 created:', customer1.email);

  // Create Customer 2
  const customer2 = await prisma.customer.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Customer',
      password: await bcrypt.hash('customer123', 10),
      phone: '+6281234567893',
      address: 'Jl. Sample No. 456',
      internetNumber: 'INT002',
      ipAddress: '192.168.1.101',
      installedModem: 'Huawei HG8245H',
      modemSerial: 'SN87654321',
      installationDate: new Date('2024-02-20'),
    },
  });
  console.log('✅ Customer 2 created:', customer2.email);

  // Create Mikrotik 1
  const mikrotik1 = await prisma.mikrotik.create({
    data: {
      name: 'Mikrotik Main',
      ipAddress: '192.168.88.1',
      username: 'admin',
      password: 'mikrotik123',
      port: 8728,
    },
  });
  console.log('✅ Mikrotik 1 created:', mikrotik1.name);

  // Create Mikrotik 2
  const mikrotik2 = await prisma.mikrotik.create({
    data: {
      name: 'Mikrotik Backup',
      ipAddress: '192.168.88.2',
      username: 'admin',
      password: 'mikrotik456',
      port: 8728,
    },
  });
  console.log('✅ Mikrotik 2 created:', mikrotik2.name);

  console.log('\n✨ Seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.customer.count()} customers`);
  console.log(`   - ${await prisma.mikrotik.count()} mikrotiks`);
  console.log('\n🔑 Login Credentials:');
  console.log('   Admin: admin@audira.net / admin123');
  console.log('   Billing: billing@audira.net / billing123');
  console.log('   Customer 1: customer@example.com / customer123');
  console.log('   Customer 2: jane@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
