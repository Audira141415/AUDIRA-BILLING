import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo customer...');

  // Hash password for demo123
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Create or update demo customer
  const customer = await prisma.customer.upsert({
    where: { email: 'customer@demo.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Demo Customer',
      email: 'customer@demo.com',
      phone: '08123456789',
      address: 'Jl. Demo No. 123, Jakarta',
      password: hashedPassword,
      status: 'active',
    },
  });

  console.log('✅ Demo customer created:', {
    email: customer.email,
    name: customer.name,
    password: 'demo123',
  });

  console.log('\n📋 Login credentials:');
  console.log('Email: customer@demo.com');
  console.log('Password: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
