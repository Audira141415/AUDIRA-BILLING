import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating admin user...');

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@audira.net' }
    });

    if (existing) {
      console.log('⚠️  User admin@audira.net already exists!');
      console.log('   Deleting and recreating...');
      await prisma.user.delete({
        where: { email: 'admin@audira.net' }
      });
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin AudiraBilling',
        email: 'admin@audira.net',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      },
    });

    console.log('\n✅ ADMIN USER CREATED SUCCESSFULLY!');
    console.log('======================================');
    console.log('📧 Email   : admin@audira.net');
    console.log('🔑 Password: admin123');
    console.log('👑 Role    : admin');
    console.log('======================================\n');
    console.log('✅ Silakan login di: http://localhost:3000/login\n');

  } catch (error) {
    console.error('❌ Error creating user:', error);
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
