# 📱 Quick Guide: Check-In Teknisi

## 🔑 Login
```
URL: http://localhost:3002/login

Teknisi 1:
Email: ahmad.rizki@audira.net
Password: password123

Teknisi 2:
Email: rudi.hartono@audira.net  
Password: password123

Teknisi 3:
Email: eko.prasetyo@audira.net
Password: password123
```

## 🎯 Workflow

### 1️⃣ Check-In
1. Buka: http://localhost:3002/technician-checkin
2. Lihat jadwal hari ini
3. Klik "Check In - Mulai Pekerjaan"
4. Izinkan akses GPS
5. ✅ Check-in berhasil!

### 2️⃣ Navigasi
1. Klik tombol "Navigasi"
2. Google Maps terbuka
3. Follow route ke lokasi

### 3️⃣ Upload Foto
1. Klik "Upload Foto"
2. Pilih foto (bisa multiple)
3. Foto ter-upload

### 4️⃣ Check-Out
1. Klik "Check Out"
2. Confirm
3. ✅ Pekerjaan selesai!

## 📊 Status Pekerjaan

| Status | Deskripsi |
|--------|-----------|
| Belum Mulai | Belum ada action |
| Ditugaskan | Siap untuk check-in |
| Sedang Dikerjakan | Teknisi sudah check-in |
| Selesai | Teknisi sudah check-out |

## 🚨 Troubleshooting

**GPS tidak berfungsi?**
- Allow location access di browser
- Check settings → Privacy → Location

**Tombol Check-In tidak muncul?**
- Pastikan status = "Ditugaskan"
- Refresh halaman

**Data kosong?**
- Pastikan backend running (port 4000)
- Run: `node apps\backend\create-workorder-data.js`

## 📞 Support

Ada masalah? Hubungi admin atau tim support.

---
**System:** PJT Billing by Audira
**Role:** TECHNICIAN
