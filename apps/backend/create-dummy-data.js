const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Creating dummy data...');

  const hash = await bcrypt.hash('customer123', 10);

  // Create customers
  const c1 = await prisma.customer.create({
    data: {
      name: 'PT Maju Jaya Digital',
      email: 'majujaya@test.com',
      phone: '081234567891',
      address: 'Jl. Sudirman No. 100, Jakarta',
      password: hash,
      internetNumber: 'ISP-001',
      installedModem: 'Huawei HG8245H5',
      modemSerial: 'HW12345678',
      installationDate: new Date('2024-01-15'),
    },
  });

  const c2 = await prisma.customer.create({
    data: {
      name: 'Andi Susanto',
      email: 'andi@test.com',
      phone: '081234567892',
      address: 'Jl. Gatot Subroto No. 25, Jakarta',
      password: hash,
      internetNumber: 'ISP-002',
      installedModem: 'ZTE F670L',
      modemSerial: 'ZTE87654321',
      installationDate: new Date('2024-02-20'),
    },
  });

  const c3 = await prisma.customer.create({
    data: {
      name: 'Siti Nurhaliza',
      email: 'siti@test.com',
      phone: '081234567893',
      address: 'Jl. Rasuna Said No. 50, Jakarta',
      password: hash,
      internetNumber: 'ISP-003',
      installedModem: 'Fiberhome HG6243C',
      modemSerial: 'FH11223344',
      installationDate: new Date('2024-03-10'),
    },
  });

  const c4 = await prisma.customer.create({
    data: {
      name: 'CV DigitalKreatif',
      email: 'digital@test.com',
      phone: '081234567894',
      address: 'Jl. HR Rasuna Said No. 75, Jakarta',
      password: hash,
      internetNumber: 'ISP-004',
      installedModem: 'Nokia G-140W-C',
      modemSerial: 'NK99887766',
      installationDate: new Date('2024-04-05'),
    },
  });

  const c5 = await prisma.customer.create({
    data: {
      name: 'Joko Widodo',
      email: 'joko@test.com',
      phone: '081234567895',
      address: 'Jl. MH Thamrin No. 15, Jakarta',
      password: hash,
      status: 'suspended',
      internetNumber: 'ISP-005',
      installedModem: 'TP-Link Archer C6',
      modemSerial: 'TP55443322',
      installationDate: new Date('2024-05-01'),
    },
  });

  console.log('✅ 5 customers created');

  // Create invoices
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202512-0001',
      customerId: c1.id,
      amount: 500000,
      dueDate: new Date('2025-12-15'),
      paidAt: new Date('2025-12-10'),
      status: 'PAID',
      month: '2025-12',
      description: 'Tagihan Internet Desember 2025',
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202512-0002',
      customerId: c2.id,
      amount: 350000,
      dueDate: new Date('2025-12-15'),
      status: 'PENDING',
      month: '2025-12',
      description: 'Tagihan Internet Desember 2025',
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202512-0003',
      customerId: c3.id,
      amount: 300000,
      dueDate: new Date('2025-12-12'),
      status: 'PENDING',
      month: '2025-12',
      description: 'Tagihan Internet Desember 2025',
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202512-0004',
      customerId: c4.id,
      amount: 750000,
      dueDate: new Date('2025-12-20'),
      status: 'PENDING',
      month: '2025-12',
      description: 'Tagihan Internet Desember 2025',
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202511-0005',
      customerId: c5.id,
      amount: 300000,
      dueDate: new Date('2025-11-30'),
      status: 'OVERDUE',
      month: '2025-11',
      description: 'Tagihan Internet November 2025',
    },
  });

  // Add history invoices
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202511-0001',
      customerId: c1.id,
      amount: 500000,
      dueDate: new Date('2025-11-15'),
      paidAt: new Date('2025-11-12'),
      status: 'PAID',
      month: '2025-11',
      description: 'Tagihan Internet November 2025',
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202510-0001',
      customerId: c1.id,
      amount: 500000,
      dueDate: new Date('2025-10-15'),
      paidAt: new Date('2025-10-10'),
      status: 'PAID',
      month: '2025-10',
      description: 'Tagihan Internet Oktober 2025',
    },
  });

  console.log('✅ 7 invoices created');

  // Create technicians
  const tech1 = await prisma.technician.create({
    data: {
      name: 'Budi Teknisi',
      phone: '082234567890',
      email: 'budi@audira.net',
    },
  });

  const tech2 = await prisma.technician.create({
    data: {
      name: 'Andi Jaringan',
      phone: '082234567891',
      email: 'andi@audira.net',
    },
  });

  console.log('✅ 2 technicians created');

  // Create tickets
  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-2025-0001',
      title: 'Internet lambat',
      description: 'Kecepatan internet tidak sesuai paket',
      priority: 'high',
      status: 'open',
      customerId: c1.id,
      technicianId: tech1.id,
    },
  });

  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-2025-0002',
      title: 'Tidak bisa akses website',
      description: 'Beberapa website tidak bisa dibuka',
      priority: 'medium',
      status: 'in_progress',
      customerId: c2.id,
      technicianId: tech1.id,
    },
  });

  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-2025-0003',
      title: 'Modem restart sendiri',
      description: 'Modem restart otomatis setiap 2 jam',
      priority: 'high',
      status: 'open',
      customerId: c3.id,
    },
  });

  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-2025-0004',
      title: 'Internet mati total',
      description: 'Internet tidak bisa digunakan',
      priority: 'high',
      status: 'in_progress',
      customerId: c4.id,
      technicianId: tech2.id,
    },
  });

  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-2025-0005',
      title: 'Request perpanjangan',
      description: 'Mohon perpanjang masa aktif',
      priority: 'medium',
      status: 'resolved',
      customerId: c5.id,
      technicianId: tech2.id,
    },
  });

  console.log('✅ 5 tickets created');

  console.log('\n🎉 Seed completed!');
  console.log('\n📊 Summary:');
  console.log('   - 5 Customers (4 active, 1 suspended)');
  console.log('   - 7 Invoices (2 PAID, 3 PENDING, 1 OVERDUE, 2 History)');
  console.log('   - 2 Technicians');
  console.log('   - 5 Tickets (2 open, 2 in_progress, 1 resolved)');
  console.log('\n🔑 Test Logins:');
  console.log('   majujaya@test.com / customer123');
  console.log('   andi@test.com / customer123');
  console.log('   siti@test.com / customer123');
}

seed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
