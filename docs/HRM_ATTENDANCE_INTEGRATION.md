# Integrasi Attendance dengan HRM Module

## Status Saat Ini

### ✅ Yang Sudah Ada:
1. **Backend Attendance API** (`apps/backend/src/attendance/`)
   - Check-in/Check-out endpoint
   - GPS tracking (latitude/longitude)
   - Photo capture (selfie)
   - Work duration calculation
   - Get by date, today, user history

2. **Frontend Attendance Pages:**
   - `/attendance` - Staff attendance page (check-in/out)
   - `/attendance-monitoring` - Admin monitoring page (real-time tracking + map)

3. **Database Model:** `Attendance` table
   ```prisma
   model Attendance {
     id            String    @id @default(uuid())
     userId        String
     user          User      @relation(fields: [userId], references: [id])
     date          DateTime  @default(now()) @db.Date
     checkInTime   DateTime?
     checkOutTime  DateTime?
     checkInPhoto  String?
     checkOutPhoto String?
     checkInLat    Float?
     checkInLong   Float?
     checkOutLat   Float?
     checkOutLong  Float?
     status        String    @default("present") // present, late, absent, leave, sick
     notes         String?
     workDuration  Int?      // Durasi dalam menit
     @@unique([userId, date])
   }
   ```

4. **Mobile App:** `AttendanceScreen.tsx` dengan camera + GPS

---

## 🔗 Integrasi yang Diperlukan

### 1. Link Attendance ke Employee

**Masalah:** Attendance saat ini link ke `User`, tapi HRM menggunakan `Employee` table.

**Solusi:** Tambahkan `employeeId` field di Attendance

```prisma
model Attendance {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  
  // NEW: Link ke Employee
  employeeId    String?
  employee      Employee? @relation(fields: [employeeId], references: [id])
  
  date          DateTime  @default(now()) @db.Date
  // ... rest of fields
}

model Employee {
  // ... existing fields
  attendances   Attendance[]  // Relation to attendance records
}
```

**Migration:**
```bash
cd apps/backend
npx prisma migrate dev --name link_attendance_to_employee
```

---

### 2. Sinkronisasi dengan Work Schedule

**Goal:** Auto-check apakah clock-in sesuai jadwal kerja

**Backend Service Update:**
```typescript
// attendance.service.ts
async checkIn(userId: string, photo?: string, lat?: number, long?: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: { employee: true }
  });
  
  if (!user?.employee) {
    throw new Error('Employee not found');
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // 1. Check work schedule
  const schedule = await this.prisma.workSchedule.findFirst({
    where: {
      employeeId: user.employee.id,
      date: new Date(today)
    }
  });
  
  // 2. Determine status (on-time / late)
  let status = 'present';
  if (schedule) {
    const scheduledTime = new Date(`${today}T${schedule.startTime}`);
    const checkInTime = new Date();
    const diff = (checkInTime.getTime() - scheduledTime.getTime()) / 1000 / 60; // minutes
    
    if (diff > 15) status = 'late'; // 15 minutes tolerance
  }
  
  // 3. Create attendance record
  return await this.prisma.attendance.create({
    data: {
      userId,
      employeeId: user.employee.id,
      checkInTime: new Date(),
      checkInPhoto: photo,
      checkInLat: lat,
      checkInLong: long,
      status,
      date: new Date(today)
    }
  });
}
```

---

### 3. Tambahkan Attendance ke HRM Dashboard

**Update `hrm-dashboard.tsx`:**

```typescript
// Add attendance stats
const [attendanceStats, setAttendanceStats] = useState({
  todayPresent: 0,
  todayLate: 0,
  todayAbsent: 0,
  avgAttendanceRate: 0,
  liveTracking: []
});

const loadAttendanceStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  const data = await api.attendance.getByDate(today);
  
  const present = data.filter(a => a.status === 'present').length;
  const late = data.filter(a => a.status === 'late').length;
  const absent = employeeStats.totalActive - (present + late);
  
  setAttendanceStats({
    todayPresent: present,
    todayLate: late,
    todayAbsent: absent,
    avgAttendanceRate: (present / employeeStats.totalActive) * 100,
    liveTracking: data.filter(a => a.checkInTime && !a.checkOutTime)
  });
};

// UI Card
<div className="bg-white p-6 rounded-lg shadow">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Kehadiran Hari Ini</h3>
    <Clock className="h-5 w-5 text-blue-600" />
  </div>
  <div className="grid grid-cols-3 gap-4">
    <div>
      <p className="text-2xl font-bold text-green-600">{attendanceStats.todayPresent}</p>
      <p className="text-sm text-gray-600">Hadir</p>
    </div>
    <div>
      <p className="text-2xl font-bold text-yellow-600">{attendanceStats.todayLate}</p>
      <p className="text-sm text-gray-600">Terlambat</p>
    </div>
    <div>
      <p className="text-2xl font-bold text-red-600">{attendanceStats.todayAbsent}</p>
      <p className="text-sm text-gray-600">Tidak Hadir</p>
    </div>
  </div>
  <div className="mt-4 pt-4 border-t">
    <a href="/attendance-monitoring" className="text-blue-600 hover:underline flex items-center gap-2">
      <MapPin className="h-4 w-4" />
      Lihat Pelacakan Langsung
    </a>
  </div>
</div>
```

---

### 4. Link di Jadwal Kerja → Attendance

**Update `jadwal-kerja.tsx`:**

```typescript
// Tambahkan kolom "Realisasi" di tabel jadwal
<th>Realisasi</th>

// Di body table
<td>
  {schedule.attendance ? (
    <div className="flex items-center gap-2">
      {schedule.attendance.checkInTime && (
        <span className="text-green-600">
          ✓ {new Date(schedule.attendance.checkInTime).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      )}
      {schedule.attendance.status === 'late' && (
        <span className="text-yellow-600 text-xs">(Terlambat)</span>
      )}
    </div>
  ) : (
    <span className="text-gray-400">Belum absen</span>
  )}
</td>
```

**Backend Update:**
```typescript
// schedule.controller.ts - Include attendance in getAll
async getAll(
  @Query('employeeId') employeeId?: string,
  @Query('startDate') startDate?: string,
  @Query('endDate') endDate?: string,
) {
  return await this.scheduleService.getAll(employeeId, startDate, endDate, {
    include: {
      employee: true,
      attendance: true // Include attendance data
    }
  });
}
```

---

### 5. Update Sidebar Menu

**Reorganize HRM Section:**

```typescript
{
  category: 'HRM',
  icon: Users,
  roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'],
  items: [
    { 
      name: 'HRM Dashboard', 
      href: '/hrm-dashboard', 
      icon: Activity, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] 
    },
    
    // ATTENDANCE SECTION
    { 
      name: 'Absensi Saya', 
      href: '/attendance', 
      icon: Clock, 
      roles: ['TECHNICIAN', 'NOC', 'CS', 'BILLING'],
      badge: 'Clock In/Out'
    },
    { 
      name: 'Pelacakan Langsung', 
      href: '/attendance-monitoring', 
      icon: MapPin, 
      roles: ['ADMIN'],
      badge: 'Live'
    },
    
    // EMPLOYEE MANAGEMENT
    { 
      name: 'Data Karyawan', 
      href: '/karyawan', 
      icon: Users, 
      roles: ['ADMIN'] 
    },
    
    // PAYROLL & BENEFITS
    { 
      name: 'Gaji & Payroll', 
      href: '/gaji', 
      icon: DollarSign, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] 
    },
    
    // LEAVE & SCHEDULE
    { 
      name: 'Pengajuan Cuti', 
      href: '/cuti', 
      icon: FileText, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] 
    },
    { 
      name: 'Jadwal Kerja', 
      href: '/jadwal-kerja', 
      icon: Calendar, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] 
    },
    
    // PERFORMANCE
    { 
      name: 'Kinerja', 
      href: '/kinerja', 
      icon: TrendingUp, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] 
    },
  ]
}
```

---

## 🎯 Implementation Checklist

### Backend:
- [ ] Add `employeeId` to Attendance model (migration)
- [ ] Update `attendance.service.ts` to sync with WorkSchedule
- [ ] Add `include: { attendance: true }` to schedule API
- [ ] Create endpoint `/attendance/stats` for dashboard

### Frontend:
- [ ] Update `hrm-dashboard.tsx` dengan attendance stats
- [ ] Update `jadwal-kerja.tsx` tampilkan realisasi attendance
- [ ] Update `attendance-monitoring.tsx` link ke employee detail
- [ ] Update Sidebar menu structure

### API Integration:
- [ ] Add attendance methods to `lib/api.ts`:
  ```typescript
  attendance: {
    getByDate: (date: string) => get(`/attendance/date/${date}`),
    getToday: () => get('/attendance/today'),
    getStats: () => get('/attendance/stats'),
    getByEmployee: (employeeId: string, startDate?: string, endDate?: string) => 
      get(`/attendance/user/${employeeId}`, { params: { startDate, endDate } }),
  }
  ```

---

## 📊 Final Result

### Admin View:
1. **HRM Dashboard** → Overview + Attendance stats + Live tracking link
2. **Pelacakan Langsung** → Real-time map dengan teknisi aktif
3. **Jadwal Kerja** → Tabel dengan kolom realisasi attendance
4. **Data Karyawan** → Detail karyawan + riwayat attendance

### Employee View:
1. **HRM Dashboard** → Personal stats (gaji, cuti, performance)
2. **Absensi Saya** → Clock in/out dengan foto + GPS
3. **Jadwal Kerja** → Lihat jadwal sendiri + realisasi
4. **Mobile App** → AttendanceScreen untuk check-in di lapangan

---

## 🚀 Quick Start

```bash
# 1. Database migration
cd apps/backend
npx prisma migrate dev --name link_attendance_to_employee

# 2. Restart backend
pnpm dev

# 3. Test integration
# - Login sebagai Admin
# - Buka HRM Dashboard
# - Lihat stats attendance
# - Klik "Pelacakan Langsung" → Map view
```

Apakah ingin saya implementasikan semua integrasi ini sekarang?
