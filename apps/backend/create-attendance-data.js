const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDummyAttendance() {
  console.log('🌱 Creating dummy attendance data...');

  try {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Get or create users (karyawan)
    let users = await prisma.user.findMany({
      where: {
        role: { in: ['TECHNICIAN', 'NOC', 'CS', 'BILLING', 'ADMIN'] }
      },
      take: 10
    });

    // If no users, create some
    if (users.length === 0) {
      console.log('Creating users...');
      const usersData = [
        { email: 'admin@audira.net', name: 'Admin Utama', role: 'ADMIN', phone: '081234567890' },
        { email: 'ahmad.rizki@audira.net', name: 'Ahmad Rizki', role: 'TECHNICIAN', phone: '081234567891' },
        { email: 'rudi.hartono@audira.net', name: 'Rudi Hartono', role: 'TECHNICIAN', phone: '081234567892' },
        { email: 'eko.prasetyo@audira.net', name: 'Eko Prasetyo', role: 'TECHNICIAN', phone: '081234567893' },
        { email: 'siti.nurhaliza@audira.net', name: 'Siti Nurhaliza', role: 'CS', phone: '081234567894' },
        { email: 'budi.santoso@audira.net', name: 'Budi Santoso', role: 'NOC', phone: '081234567895' },
        { email: 'dewi.lestari@audira.net', name: 'Dewi Lestari', role: 'BILLING', phone: '081234567896' },
        { email: 'agus.setiawan@audira.net', name: 'Agus Setiawan', role: 'NOC', phone: '081234567897' },
      ];

      for (const userData of usersData) {
        await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          }
        });
      }

      users = await prisma.user.findMany({
        where: {
          role: { in: ['TECHNICIAN', 'NOC', 'CS', 'BILLING', 'ADMIN'] }
        }
      });
    }

    console.log(`Found ${users.length} users`);

    // Create attendance data for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Random times for check-in (07:00 - 09:00)
    const generateCheckInTime = () => {
      const hour = 7 + Math.floor(Math.random() * 2.5); // 7-9
      const minute = Math.floor(Math.random() * 60);
      const checkIn = new Date(today);
      checkIn.setHours(hour, minute, 0, 0);
      return checkIn;
    };

    // Random times for check-out (16:00 - 18:00)
    const generateCheckOutTime = (checkInTime) => {
      const checkOut = new Date(checkInTime);
      const hour = 16 + Math.floor(Math.random() * 2); // 16-17
      const minute = Math.floor(Math.random() * 60);
      checkOut.setHours(hour, minute, 0, 0);
      return checkOut;
    };

    // Sample selfie photos (placeholder URLs)
    const samplePhotos = [
      'https://i.pravatar.cc/300?img=1',
      'https://i.pravatar.cc/300?img=2',
      'https://i.pravatar.cc/300?img=3',
      'https://i.pravatar.cc/300?img=4',
      'https://i.pravatar.cc/300?img=5',
      'https://i.pravatar.cc/300?img=6',
      'https://i.pravatar.cc/300?img=7',
      'https://i.pravatar.cc/300?img=8',
    ];

    // Sample GPS coordinates (Jakarta area)
    const sampleLocations = [
      { lat: -6.2088, lng: 106.8456 },
      { lat: -6.2148, lng: 106.8451 },
      { lat: -6.2000, lng: 106.8500 },
      { lat: -6.2100, lng: 106.8400 },
    ];

    let attendanceCount = 0;

    // Create attendance records
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const scenario = Math.random();

      if (scenario < 0.7) { // 70% hadir tepat waktu
        const checkInTime = generateCheckInTime();
        const checkOutTime = scenario < 0.5 ? generateCheckOutTime(checkInTime) : null; // 50% sudah checkout
        const location = sampleLocations[i % sampleLocations.length];
        
        const workDuration = checkOutTime 
          ? Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / 60000) 
          : null;

        const status = checkInTime.getHours() > 8 || (checkInTime.getHours() === 8 && checkInTime.getMinutes() > 30)
          ? 'late'
          : 'present';

        await prisma.attendance.create({
          data: {
            userId: user.id,
            date: today,
            checkInTime,
            checkOutTime,
            checkInPhoto: samplePhotos[i % samplePhotos.length],
            checkOutPhoto: checkOutTime ? samplePhotos[(i + 1) % samplePhotos.length] : null,
            checkInLat: location.lat,
            checkInLong: location.lng,
            checkOutLat: checkOutTime ? location.lat + 0.001 : null,
            checkOutLong: checkOutTime ? location.lng + 0.001 : null,
            status,
            workDuration,
          }
        });

        attendanceCount++;
        console.log(`✅ ${user.name} - Check-in: ${checkInTime.toLocaleTimeString('id-ID')} ${checkOutTime ? `Check-out: ${checkOutTime.toLocaleTimeString('id-ID')}` : '(Masih kerja)'} - ${status === 'late' ? 'Terlambat' : 'Tepat waktu'}`);

      } else if (scenario < 0.85) { // 15% terlambat
        const checkInTime = new Date(today);
        checkInTime.setHours(9, 15 + Math.floor(Math.random() * 45), 0, 0); // 09:15 - 10:00
        const location = sampleLocations[i % sampleLocations.length];

        await prisma.attendance.create({
          data: {
            userId: user.id,
            date: today,
            checkInTime,
            checkInPhoto: samplePhotos[i % samplePhotos.length],
            checkInLat: location.lat,
            checkInLong: location.lng,
            status: 'late',
          }
        });

        attendanceCount++;
        console.log(`⚠️ ${user.name} - Terlambat check-in: ${checkInTime.toLocaleTimeString('id-ID')}`);

      } else { // 15% absent
        console.log(`❌ ${user.name} - Absent (tidak ada data absensi)`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   - Total Karyawan: ${users.length}`);
    console.log(`   - Hadir: ${attendanceCount}`);
    console.log(`   - Absent: ${users.length - attendanceCount}`);

    const stats = await prisma.attendance.findMany({
      where: { date: today }
    });
    const late = stats.filter(a => a.status === 'late').length;
    const checkedOut = stats.filter(a => a.checkOutTime !== null).length;
    const stillWorking = attendanceCount - checkedOut;

    console.log(`   - Terlambat: ${late}`);
    console.log(`   - Sudah Check-out: ${checkedOut}`);
    console.log(`   - Masih Kerja: ${stillWorking}`);

    console.log('\n✅ Dummy attendance data created successfully!');
    console.log('\n🌐 Access pages:');
    console.log('   Admin monitoring: http://localhost:3002/attendance-monitoring');
    console.log('   Employee check-in: http://localhost:3002/attendance');

  } catch (error) {
    console.error('❌ Error creating dummy data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDummyAttendance();
