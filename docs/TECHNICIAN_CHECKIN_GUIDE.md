# 🔐 Sistem Check-In/Out Teknisi

## 📋 Overview

Sistem check-in/out teknisi untuk tracking kehadiran dan pekerjaan lapangan dengan GPS tracking dan photo evidence.

## ✅ Fitur Lengkap

### 1. **Check-In dengan GPS**
- Teknisi check-in saat mulai pekerjaan
- Capture lokasi GPS otomatis (latitude, longitude)
- Record waktu check-in (startedAt)
- Update status work order ke "in-progress"

### 2. **Check-Out**
- Teknisi check-out saat selesai pekerjaan
- Record waktu selesai (completedAt)
- Update status work order ke "completed"
- Durasi pekerjaan otomatis terhitung

### 3. **Dashboard Teknisi**
- Tampilan mobile-friendly untuk teknisi lapangan
- Daftar pekerjaan hari ini
- Status pekerjaan real-time
- Info customer lengkap (nama, alamat, telpon)

### 4. **Photo Evidence**
- Upload foto bukti pekerjaan
- Multiple photo upload
- Gallery view dengan fullscreen preview
- Timestamp otomatis pada setiap foto

### 5. **Navigasi GPS**
- Tombol navigasi ke lokasi customer
- Integrasi Google Maps
- One-click navigation

## 🚀 Cara Menggunakan

### Login Sebagai Teknisi

**Kredensial:**
```
Email: ahmad.rizki@audira.net
Password: password123
```

**Alternatif teknisi lain:**
```
Email: rudi.hartono@audira.net
Password: password123

Email: eko.prasetyo@audira.net
Password: password123
```

### Akses Halaman Check-In

1. Login ke sistem: `http://localhost:3002/login`
2. Setelah login, akses: `http://localhost:3002/technician-checkin`
3. Atau klik menu "Check In/Out" di sidebar (khusus role TECHNICIAN)

### Workflow Check-In/Out

1. **Lihat Jadwal Hari Ini**
   - Halaman menampilkan semua pekerjaan yang dijadwalkan hari ini
   - Status: Belum Mulai, Ditugaskan, Sedang Dikerjakan, Selesai

2. **Check-In (Mulai Pekerjaan)**
   - Klik tombol "Check In - Mulai Pekerjaan"
   - System request akses GPS
   - Izinkan akses GPS
   - Check-in berhasil → Lokasi dan waktu terekam

3. **Navigasi ke Lokasi**
   - Setelah check-in, klik "Navigasi"
   - Google Maps terbuka dengan route ke lokasi customer

4. **Upload Foto Bukti**
   - Klik "Upload Foto"
   - Pilih foto dari device (multiple select)
   - Foto ter-upload ke system

5. **Check-Out (Selesaikan Pekerjaan)**
   - Klik tombol "Check Out"
   - Confirm completion
   - Waktu selesai terekam
   - Status work order berubah "Selesai"

## 📊 API Endpoints

### Get Today's Jobs
```
GET /field-service/technician/:technicianId/today
Headers: Authorization: Bearer <token>
Response: Array of work orders scheduled today
```

### Check-In (Start Work Order)
```
POST /field-service/jobs/:workOrderId/start
Headers: Authorization: Bearer <token>
Body: {
  "latitude": -6.2088,
  "longitude": 106.8456
}
Response: Updated work order with startedAt
```

### Check-Out (Complete Work Order)
```
POST /field-service/jobs/:workOrderId/complete
Headers: Authorization: Bearer <token>
Body: {
  "notes": "Pekerjaan selesai"
}
Response: Updated work order with completedAt
```

### Upload Photos
```
POST /field-service/jobs/:workOrderId/photos
Headers: Authorization: Bearer <token>
Body: {
  "photoUrls": ["url1", "url2", "url3"]
}
Response: Updated work order with photos
```

## 🗄️ Database Schema

### WorkOrder Model
```prisma
model WorkOrder {
  id           String    @id @default(uuid())
  customerId   String
  technicianId String
  type         String    // installation, maintenance, repair
  priority     String    // low, medium, high, urgent
  status       String    // pending, assigned, on-route, in-progress, completed
  title        String
  description  String
  scheduledAt  DateTime  // Jadwal mulai
  startedAt    DateTime? // Check-in time
  completedAt  DateTime? // Check-out time
  latitude     Float?    // GPS check-in
  longitude    Float?    // GPS check-in
  location     String?
  notes        String?
  photos       String[]  // Array of photo URLs
  signature    String?
  rating       Int?
  feedback     String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

## 📱 UI Components

### File: `apps/frontend/src/pages/technician-checkin.tsx`

**Features:**
- Mobile-first responsive design
- Real-time status updates
- GPS location tracking
- One-click navigation
- Photo upload integration
- Customer contact info
- Work duration tracking

**Component Sections:**
1. **Header** - Technician profile, date
2. **Active Job Card** - Current job being worked on (green gradient)
3. **Today's Schedule** - List of all jobs today
4. **Job Details** - Customer info, address, priority, type

## 🔐 Role-Based Access

**Akses Menu Check-In:**
- ✅ TECHNICIAN - Full access
- ❌ ADMIN - No access (use Field Service page)
- ❌ NOC - No access (use Field Service page)
- ❌ BILLING - No access
- ❌ CS - No access

**Akses Field Service Dashboard:**
- ✅ ADMIN - Full access (dispatcher)
- ✅ NOC - Full access (dispatcher)
- ❌ TECHNICIAN - No access (use Check-In page)

## 📈 Tracking & Reporting

### Data Terekam:
1. **Check-In:**
   - Waktu mulai (startedAt)
   - Lokasi GPS (latitude, longitude)
   - Status change: assigned → in-progress

2. **Check-Out:**
   - Waktu selesai (completedAt)
   - Duration otomatis (completedAt - startedAt)
   - Status change: in-progress → completed

3. **Photo Evidence:**
   - Timestamp upload
   - URL foto
   - Linked to work order

### Reporting Features (Future):
- Daily attendance report
- Work duration analysis
- GPS route tracking
- Photo evidence review
- Performance metrics per technician

## 🧪 Testing

### Test Login
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:4000/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"ahmad.rizki@audira.net","password":"password123"}'
```

### Test Get Today's Jobs
```bash
# Replace <TOKEN> and <TECH_ID>
Invoke-RestMethod -Uri "http://localhost:4000/field-service/technician/<TECH_ID>/today" `
  -Headers @{"Authorization"="Bearer <TOKEN>"}
```

### Test Check-In
```bash
Invoke-RestMethod -Uri "http://localhost:4000/field-service/jobs/<JOB_ID>/start" `
  -Method POST `
  -Headers @{"Authorization"="Bearer <TOKEN>"; "Content-Type"="application/json"} `
  -Body '{"latitude":-6.2088,"longitude":106.8456}'
```

## 🎯 Status Workflow

```
pending (Belum Mulai)
    ↓
assigned (Ditugaskan ke teknisi)
    ↓
on-route (Teknisi dalam perjalanan)
    ↓
in-progress (CHECK-IN - Teknisi mulai kerja) ← GPS + Timestamp
    ↓
completed (CHECK-OUT - Pekerjaan selesai) ← Timestamp
```

## 🚨 Troubleshooting

### GPS Tidak Berfungsi
- Pastikan browser mengizinkan akses lokasi
- Check Chrome settings → Privacy → Location
- Gunakan HTTPS untuk production (GPS requires secure context)

### Check-In Gagal
- Cek apakah work order status = 'assigned'
- Pastikan teknisi sudah login
- Verify token valid

### Data Kosong
- Pastikan backend running (port 4000)
- Pastikan frontend running (port 3002)
- Run create-workorder-data.js untuk dummy data

## 📝 Summary

✅ **Backend:** Fully implemented
- GET /technician/:id/today
- POST /jobs/:id/start (check-in)
- POST /jobs/:id/complete (check-out)
- POST /jobs/:id/photos

✅ **Frontend:** Fully implemented
- technician-checkin.tsx (522 lines)
- Mobile-responsive design
- GPS integration
- Photo upload ready

✅ **Database:** Schema ready
- WorkOrder model with GPS fields
- Photo array support
- Timestamp tracking

✅ **Testing:** Credentials ready
- 3 technicians created
- 7 sample work orders
- Today's schedule populated

## 🎓 User Guide

**Untuk Teknisi:**
1. Login dengan kredensial teknisi
2. Buka halaman Check-In/Out
3. Lihat jadwal hari ini
4. Check-in saat tiba di lokasi
5. Upload foto bukti pekerjaan
6. Check-out saat selesai

**Untuk Admin/Dispatcher:**
1. Login dengan kredensial admin
2. Buka halaman Field Service
3. Assign work order ke teknisi
4. Monitor status real-time
5. Review completed work dengan foto

---

**System Status:** 🟢 FULLY OPERATIONAL
**Last Updated:** 2024
