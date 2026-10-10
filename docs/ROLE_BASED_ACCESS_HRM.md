# Role-Based Access Control - HRM Module

## Overview
Sistem HRM mendukung 2 level akses:
1. **ADMIN** - Full access ke semua data dan fitur
2. **EMPLOYEE** (TECHNICIAN, NOC, CS, BILLING) - Hanya bisa akses data pribadi

## Hook useAuth

File: `src/hooks/useAuth.ts`

```typescript
const { 
  user,           // User object dengan id, email, name, role, employeeId
  isAdmin,        // () => boolean - Check if user is ADMIN
  isEmployee,     // () => boolean - Check if user is employee
  canEditAllData, // () => boolean - Admin only
  getEmployeeId,  // () => string | null - Get current user's employeeId
} = useAuth();
```

## Implementasi per Halaman

### 1. Data Karyawan (/karyawan)

**Admin:** Lihat & edit semua karyawan
**Employee:** Hanya lihat profile sendiri

```typescript
import { useAuth } from '../hooks/useAuth';

export default function Karyawan() {
  const { isAdmin, getEmployeeId } = useAuth();
  
  // Load data
  const loadEmployees = async () => {
    if (isAdmin()) {
      // Admin: load all employees
      const data = await api.employee.getAll();
      setEmployees(data);
    } else {
      // Employee: load only own profile
      const employeeId = getEmployeeId();
      if (employeeId) {
        const data = await api.employee.getProfile(employeeId);
        setEmployees([data]);
      }
    }
  };
  
  // Hide buttons for employees
  {isAdmin() && (
    <button onClick={handleCreate}>Tambah Karyawan</button>
  )}
```

### 2. Gaji & Payroll (/gaji)

**Admin:** Lihat & kelola semua slip gaji, generate payroll
**Employee:** Hanya lihat slip gaji sendiri

```typescript
const loadSalaries = async () => {
  if (isAdmin()) {
    const data = await api.salary.getAll();
    setSalaries(data);
  } else {
    const employeeId = getEmployeeId();
    if (employeeId) {
      const data = await api.salary.getByEmployee(employeeId);
      setSalaries(data);
    }
  }
};

// Conditional rendering
{isAdmin() && (
  <>
    <button onClick={handleCreate}>Tambah Slip Gaji</button>
    <button onClick={handleBulkCreate}>Generate Payroll</button>
  </>
)}

// Employee hanya bisa print slip gaji sendiri
<button onClick={() => handlePrint(salary)}>
  <Printer /> Print
</button>
```

### 3. Pengajuan Cuti (/cuti)

**Admin:** Lihat semua cuti, approve/reject
**Employee:** Submit cuti sendiri, lihat status cuti sendiri

```typescript
const loadLeaves = async () => {
  if (isAdmin()) {
    const data = await api.leave.getAll();
    setLeaves(data);
  } else {
    const employeeId = getEmployeeId();
    const data = await api.leave.getAll(undefined, employeeId);
    setLeaves(data);
  }
};

// Admin: show approve/reject buttons
{isAdmin() && leave.status === 'pending' && (
  <>
    <button onClick={() => handleApprove(leave.id)}>Approve</button>
    <button onClick={() => handleReject(leave.id)}>Reject</button>
  </>
)}

// Employee: show create button
{isEmployee() && (
  <button onClick={handleCreate}>Ajukan Cuti</button>
)}
```

### 4. Jadwal Kerja (/jadwal-kerja)

**Admin:** Kelola jadwal semua karyawan, bulk schedule
**Employee:** Hanya lihat jadwal sendiri

```typescript
const loadSchedules = async () => {
  if (isAdmin()) {
    const data = await api.schedule.getAll(selectedEmployee, selectedDate, selectedDate);
    setSchedules(data);
  } else {
    const employeeId = getEmployeeId();
    const data = await api.schedule.getAll(employeeId, selectedDate, selectedDate);
    setSchedules(data);
  }
};

// Hide bulk schedule button for employees
{isAdmin() && (
  <button onClick={handleBulkCreate}>Bulk Schedule</button>
)}
```

### 5. Kinerja (/kinerja)

**Admin:** Buat & approve performance review semua karyawan
**Employee:** Hanya lihat review sendiri

```typescript
const loadPerformances = async () => {
  if (isAdmin()) {
    const data = await api.performance.getAll();
    setPerformances(data);
  } else {
    const employeeId = getEmployeeId();
    const data = await api.performance.getAll(employeeId);
    setPerformances(data);
  }
};

// Admin only: create & approve
{isAdmin() && (
  <>
    <button onClick={handleCreate}>Buat Review</button>
    <button onClick={() => handleApprove(perf.id)}>Approve</button>
  </>
)}
```

### 6. HRM Dashboard (/hrm-dashboard)

**Admin:** Full stats dari semua karyawan
**Employee:** Personal stats (own salary, leave, performance)

```typescript
const loadStats = async () => {
  if (isAdmin()) {
    // Load all stats
    const [empStats, salStats, leaveStats, perfStats] = await Promise.all([
      api.employee.getStats(),
      api.salary.getStats(),
      api.leave.getStats(),
      api.performance.getStats(),
    ]);
    setStats({ employee: empStats, salary: salStats, ... });
  } else {
    // Load personal stats only
    const employeeId = getEmployeeId();
    const [profile, salaries, leaves, performances] = await Promise.all([
      api.employee.getProfile(employeeId),
      api.salary.getByEmployee(employeeId),
      api.leave.getAll(undefined, employeeId),
      api.performance.getAll(employeeId),
    ]);
    // Calculate personal stats
    setStats({
      salaryTotal: salaries.reduce((sum, s) => sum + s.totalSalary, 0),
      leaveCount: leaves.length,
      avgScore: performances.length > 0 ? ... : 0,
    });
  }
};
```

## Menu Sidebar

Update `Sidebar.tsx` untuk conditional rendering:

```typescript
// HRM menu section
{
  category: 'HRM',
  icon: Users,
  roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'], // Semua bisa akses
  items: [
    { name: 'HRM Dashboard', href: '/hrm-dashboard', icon: Activity, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] },
    { name: 'Data Karyawan', href: '/karyawan', icon: Users, 
      roles: ['ADMIN'] }, // Admin only untuk list
    { name: 'Profile Saya', href: '/my-profile', icon: Users, 
      roles: ['TECHNICIAN', 'NOC', 'CS', 'BILLING'] }, // Employee profile
    { name: 'Gaji Saya', href: '/gaji', icon: DollarSign, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] },
    { name: 'Cuti Saya', href: '/cuti', icon: FileText, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] },
    { name: 'Jadwal Kerja', href: '/jadwal-kerja', icon: Clock, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] },
    { name: 'Kinerja Saya', href: '/kinerja', icon: Activity, 
      roles: ['ADMIN', 'TECHNICIAN', 'NOC', 'CS', 'BILLING'] },
  ]
}
```

## Database: Link User ke Employee

Perlu menambahkan `employeeId` ke User saat login:

```typescript
// Backend: auth.service.ts
async login(email: string, password: string) {
  const user = await prisma.user.findUnique({ 
    where: { email },
    include: { employee: true } // Include employee relation
  });
  
  // Generate token dengan employeeId
  const token = jwt.sign({ 
    userId: user.id, 
    role: user.role,
    employeeId: user.employee?.id // Add employeeId to token
  }, secret);
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employeeId: user.employee?.id, // Return employeeId
    }
  };
}
```

## Testing Scenarios

### Sebagai Admin:
1. Login dengan akun admin
2. Akses menu HRM → semua menu visible
3. Buka "Data Karyawan" → lihat semua karyawan
4. Buka "Gaji & Payroll" → bisa generate payroll untuk semua
5. Buka "Pengajuan Cuti" → bisa approve/reject
6. Dashboard menampilkan stats keseluruhan

### Sebagai Teknisi/Employee:
1. Login dengan akun teknisi (email karyawan dari seed)
2. Akses menu HRM → hanya lihat menu personal
3. Buka "Profile Saya" → lihat data diri sendiri
4. Buka "Gaji Saya" → hanya lihat slip gaji sendiri
5. Buka "Cuti Saya" → bisa submit cuti baru, lihat status cuti sendiri
6. Buka "Jadwal Kerja" → hanya lihat jadwal sendiri
7. Dashboard menampilkan personal stats

## Next Steps untuk Implementasi Penuh

1. ✅ Hook `useAuth` sudah dibuat
2. ⏳ Update setiap halaman HRM dengan conditional logic
3. ⏳ Update backend auth untuk return employeeId
4. ⏳ Update menu sidebar dengan role filtering
5. ⏳ Buat halaman `/my-profile` untuk employee
6. ⏳ Testing dengan multiple users

---

**File yang sudah dibuat:**
- ✅ `/src/hooks/useAuth.ts` - Hook untuk role checking

**File yang perlu diupdate:**
- `/src/pages/karyawan.tsx`
- `/src/pages/gaji.tsx`
- `/src/pages/cuti.tsx`
- `/src/pages/jadwal-kerja.tsx`
- `/src/pages/kinerja.tsx`
- `/src/pages/hrm-dashboard.tsx`
- `/src/components/Sidebar.tsx`
- `/apps/backend/src/auth/auth.service.ts`

Apakah ingin saya implementasikan semua perubahan ini sekarang?
