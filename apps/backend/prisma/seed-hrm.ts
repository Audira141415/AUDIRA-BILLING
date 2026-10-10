import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HRM data...');

  // Create Employees
  const employees = [
    {
      employeeNumber: 'EMP001',
      fullName: 'Budi Santoso',
      nickname: 'Budi',
      gender: 'male',
      birthDate: new Date('1990-05-15'),
      birthPlace: 'Jakarta',
      maritalStatus: 'married',
      phone: '081234567890',
      email: 'budi.santoso@company.com',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      department: 'NOC',
      position: 'Network Engineer',
      employmentType: 'permanent',
      joinDate: new Date('2020-01-10'),
      baseSalary: 8000000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP002',
      fullName: 'Siti Nurhaliza',
      nickname: 'Siti',
      gender: 'female',
      birthDate: new Date('1992-08-20'),
      birthPlace: 'Bandung',
      maritalStatus: 'single',
      phone: '081234567891',
      email: 'siti.nurhaliza@company.com',
      address: 'Jl. Asia Afrika No. 45, Bandung',
      department: 'CS',
      position: 'Customer Service Officer',
      employmentType: 'permanent',
      joinDate: new Date('2019-06-15'),
      baseSalary: 6000000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP003',
      fullName: 'Ahmad Yani',
      nickname: 'Ahmad',
      gender: 'male',
      birthDate: new Date('1988-03-12'),
      birthPlace: 'Surabaya',
      maritalStatus: 'married',
      phone: '081234567892',
      email: 'ahmad.yani@company.com',
      address: 'Jl. Tunjungan No. 78, Surabaya',
      department: 'Technician',
      position: 'Field Technician',
      employmentType: 'permanent',
      joinDate: new Date('2018-03-20'),
      baseSalary: 5500000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP004',
      fullName: 'Dewi Lestari',
      nickname: 'Dewi',
      gender: 'female',
      birthDate: new Date('1995-11-08'),
      birthPlace: 'Yogyakarta',
      maritalStatus: 'single',
      phone: '081234567893',
      email: 'dewi.lestari@company.com',
      address: 'Jl. Malioboro No. 56, Yogyakarta',
      department: 'Billing',
      position: 'Billing Officer',
      employmentType: 'permanent',
      joinDate: new Date('2021-02-01'),
      baseSalary: 6500000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP005',
      fullName: 'Rudi Hartono',
      nickname: 'Rudi',
      gender: 'male',
      birthDate: new Date('1993-07-25'),
      birthPlace: 'Medan',
      maritalStatus: 'married',
      phone: '081234567894',
      email: 'rudi.hartono@company.com',
      address: 'Jl. Gatot Subroto No. 90, Medan',
      department: 'Finance',
      position: 'Finance Manager',
      employmentType: 'permanent',
      joinDate: new Date('2017-09-10'),
      baseSalary: 12000000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP006',
      fullName: 'Maya Sari',
      nickname: 'Maya',
      gender: 'female',
      birthDate: new Date('1994-04-18'),
      birthPlace: 'Semarang',
      maritalStatus: 'single',
      phone: '081234567895',
      email: 'maya.sari@company.com',
      address: 'Jl. Pandanaran No. 34, Semarang',
      department: 'HR',
      position: 'HR Officer',
      employmentType: 'permanent',
      joinDate: new Date('2020-07-15'),
      baseSalary: 7000000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP007',
      fullName: 'Andi Wijaya',
      nickname: 'Andi',
      gender: 'male',
      birthDate: new Date('1991-12-30'),
      birthPlace: 'Makassar',
      maritalStatus: 'married',
      phone: '081234567896',
      email: 'andi.wijaya@company.com',
      address: 'Jl. AP Pettarani No. 67, Makassar',
      department: 'IT',
      position: 'Software Developer',
      employmentType: 'permanent',
      joinDate: new Date('2019-11-20'),
      baseSalary: 9000000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP008',
      fullName: 'Rina Kusuma',
      nickname: 'Rina',
      gender: 'female',
      birthDate: new Date('1996-09-05'),
      birthPlace: 'Denpasar',
      maritalStatus: 'single',
      phone: '081234567897',
      email: 'rina.kusuma@company.com',
      address: 'Jl. Sunset Road No. 12, Denpasar',
      department: 'CS',
      position: 'Customer Service Supervisor',
      employmentType: 'contract',
      joinDate: new Date('2022-01-10'),
      baseSalary: 7500000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP009',
      fullName: 'Hendra Gunawan',
      nickname: 'Hendra',
      gender: 'male',
      birthDate: new Date('1987-06-22'),
      birthPlace: 'Palembang',
      maritalStatus: 'married',
      phone: '081234567898',
      email: 'hendra.gunawan@company.com',
      address: 'Jl. Sudirman No. 89, Palembang',
      department: 'Technician',
      position: 'Senior Technician',
      employmentType: 'permanent',
      joinDate: new Date('2016-05-15'),
      baseSalary: 7000000,
      status: 'active',
    },
    {
      employeeNumber: 'EMP010',
      fullName: 'Lisa Marlina',
      nickname: 'Lisa',
      gender: 'female',
      birthDate: new Date('1998-02-14'),
      birthPlace: 'Jakarta',
      maritalStatus: 'single',
      phone: '081234567899',
      email: 'lisa.marlina@company.com',
      address: 'Jl. Kebon Jeruk No. 23, Jakarta Barat',
      department: 'Billing',
      position: 'Junior Billing Officer',
      employmentType: 'contract',
      joinDate: new Date('2023-03-01'),
      baseSalary: 5000000,
      status: 'active',
    },
  ];

  console.log('📝 Creating employees...');
  const createdEmployees = [];
  
  // First, get or create admin user for userId reference
  let adminUser = await prisma.user.findFirst({
    where: { email: 'admin@audira.com' }
  });
  
  if (!adminUser) {
    console.log('  ⚠ Admin user not found, creating one...');
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@audira.com',
        password: '$2b$10$YourHashedPasswordHere', // This should be a proper hash
        name: 'Admin',
        role: 'ADMIN',
      }
    });
  }
  
  for (const emp of employees) {
    // Create a user for each employee
    const user = await prisma.user.create({
      data: {
        email: emp.email,
        password: '$2b$10$YourHashedPasswordHere', // Default password
        name: emp.fullName,
        role: 'TECHNICIAN', // Default role, adjust as needed
      }
    });
    
    const employee = await prisma.employee.create({ 
      data: {
        ...emp,
        userId: user.id,
      }
    });
    createdEmployees.push(employee);
    console.log(`  ✓ Created employee: ${employee.fullName}`);
  }

  // Create Salaries
  console.log('\n💰 Creating salary records...');
  const currentDate = new Date();
  const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  for (const emp of createdEmployees) {
    const allowances = Math.floor(emp.baseSalary * 0.15); // 15% tunjangan
    const overtime = Math.floor(Math.random() * 1000000); // Random overtime
    const bonus = Math.random() > 0.7 ? Math.floor(emp.baseSalary * 0.1) : 0; // 30% chance bonus
    const deductions = Math.floor(emp.baseSalary * 0.05); // 5% potongan
    const totalSalary = emp.baseSalary + allowances + overtime + bonus - deductions;

    await prisma.salary.create({
      data: {
        employeeId: emp.id,
        period: currentPeriod,
        baseSalary: emp.baseSalary,
        allowances,
        overtime,
        bonus,
        deductions,
        totalSalary,
        status: Math.random() > 0.5 ? 'paid' : 'pending',
        paidAt: Math.random() > 0.5 ? new Date() : null,
      },
    });
    console.log(`  ✓ Created salary for: ${emp.fullName}`);
  }

  // Create Leave Requests
  console.log('\n📅 Creating leave requests...');
  const leaveTypes = ['annual', 'sick', 'unpaid', 'emergency'];
  const leaveStatuses = ['pending', 'approved', 'rejected'];
  
  for (let i = 0; i < 15; i++) {
    const emp = createdEmployees[Math.floor(Math.random() * createdEmployees.length)];
    const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const status = leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)];

    await prisma.leave.create({
      data: {
        employeeId: emp.id,
        leaveType,
        startDate,
        endDate,
        totalDays,
        reason: `${leaveType} leave request`,
        status,
        approvedBy: status !== 'pending' ? 'admin' : null,
        approvedAt: status !== 'pending' ? new Date() : null,
      },
    });
    console.log(`  ✓ Created ${leaveType} leave for: ${emp.fullName}`);
  }

  // Create Work Schedules
  console.log('\n🕐 Creating work schedules...');
  const shiftTypes = ['morning', 'afternoon', 'night'];
  const shiftTimes = {
    morning: { start: '08:00', end: '17:00' },
    afternoon: { start: '14:00', end: '22:00' },
    night: { start: '22:00', end: '06:00' },
  };

  for (let i = 0; i < 7; i++) {
    const scheduleDate = new Date(currentDate);
    scheduleDate.setDate(scheduleDate.getDate() + i);

    for (const emp of createdEmployees.slice(0, 5)) { // First 5 employees
      const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
      const times = shiftTimes[shiftType];

      await prisma.workSchedule.create({
        data: {
          employeeId: emp.id,
          date: scheduleDate,
          shiftType,
          startTime: times.start,
          endTime: times.end,
          location: Math.random() > 0.7 ? 'Remote' : 'Office',
        },
      });
    }
    console.log(`  ✓ Created schedules for: ${scheduleDate.toDateString()}`);
  }

  // Create Performance Reviews
  console.log('\n📊 Creating performance reviews...');
  const reviewTypes = ['monthly', 'quarterly', 'annual'];
  
  for (let i = 0; i < 8; i++) {
    const emp = createdEmployees[i];
    const productivity = 70 + Math.floor(Math.random() * 30);
    const quality = 70 + Math.floor(Math.random() * 30);
    const attendance = 75 + Math.floor(Math.random() * 25);
    const discipline = 75 + Math.floor(Math.random() * 25);
    const teamwork = 70 + Math.floor(Math.random() * 30);
    const initiative = 65 + Math.floor(Math.random() * 35);
    const overallScore = Math.floor((productivity + quality + attendance + discipline + teamwork + initiative) / 6);

    await prisma.performance.create({
      data: {
        employeeId: emp.id,
        period: currentPeriod,
        reviewType: reviewTypes[Math.floor(Math.random() * reviewTypes.length)],
        productivity,
        quality,
        attendance,
        discipline,
        teamwork,
        initiative,
        overallScore,
        achievements: `Good performance in ${emp.department} department`,
        improvements: 'Continue to develop technical skills',
        goals: 'Achieve higher productivity targets',
        reviewedBy: 'admin',
        status: 'approved',
      },
    });
    console.log(`  ✓ Created performance review for: ${emp.fullName}`);
  }

  console.log('\n✅ HRM data seeding completed!');
  console.log(`   - ${createdEmployees.length} employees`);
  console.log(`   - ${createdEmployees.length} salary records`);
  console.log('   - 15 leave requests');
  console.log('   - 35 work schedules');
  console.log('   - 8 performance reviews');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding HRM data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
