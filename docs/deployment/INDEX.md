# 📦 Deployment - Quick Access

## 🚀 Cara Memindahkan Aplikasi ke PC Baru

### 1️⃣ **Quick Start** ⭐ MULAI DI SINI
📄 [QUICK_START_NEW_PC.md](./QUICK_START_NEW_PC.md)

**Apa isinya:**
- Langkah tercepat setup di PC baru
- Prerequisites (Node.js, Docker)
- Setup otomatis dengan `setup.bat`
- Testing & verifikasi

**Waktu:** 30-60 menit

---

### 2️⃣ **Copy Checklist** ✅ CHECKLIST FILE
📄 [COPY_CHECKLIST.md](./COPY_CHECKLIST.md)

**Apa isinya:**
- ✅ File yang WAJIB dicopy
- ❌ File yang TIDAK perlu dicopy
- 🔒 File rahasia (.env)
- 💾 Database backup
- Verification checklist

**Ukuran:** ~150 MB (tanpa node_modules)

---

### 3️⃣ **Deployment Guide** 📖 PANDUAN LENGKAP
📄 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Apa isinya:**
- Setup di PC lokal (detail)
- Deploy ke production server (VPS)
- Environment configuration
- Security best practices
- Backup strategy
- Troubleshooting lengkap

**Untuk:** Advanced users & production deployment

---

## ⚡ Quick Commands

### Setup di PC Baru:
```powershell
# 1. Install Node.js & Docker
# 2. Extract folder project

# 3. Setup otomatis (as Administrator)
.\setup.bat

# 4. Verify instalasi
.\verify-installation.bat

# 5. Start services
.\start-all.bat
```

### Akses Aplikasi:
- Admin: http://localhost:3000 (admin@test.com / admin123)
- Customer: http://localhost:3001 (customer@demo.com / demo123)
- API: http://localhost:4000

---

## 📋 Workflow Singkat

```
PC Lama                PC Baru
   │                      │
   ├─ Copy folder ────────┤
   │  (tanpa node_modules)│
   │                      │
   ├─ Backup .env ────────┤
   │                      │
   ├─ Backup DB ──────────┤
   │                      │
   └──────────────────────┼─ Install Node.js
                          ├─ Install Docker
                          ├─ Run setup.bat
                          ├─ Start services
                          └─ Test ✅
```

---

## 🎯 File Penting

### Batch Files (di root):
- `setup.bat` - Setup otomatis
- `verify-installation.bat` - Cek instalasi
- `start-all.bat` - Start semua
- `stop-all.bat` - Stop semua

### Environment:
```
apps/backend/.env
apps/frontend/.env.local
apps/customer-portal/.env.local
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| npm install error | `npm cache clean --force` |
| Docker not starting | Restart Docker Desktop |
| Port in use | `netstat -ano \| findstr :4000` |
| DB connection error | `docker-compose restart` |

---

## 📞 Need Help?

1. Baca [QUICK_START_NEW_PC.md](./QUICK_START_NEW_PC.md)
2. Check [COPY_CHECKLIST.md](./COPY_CHECKLIST.md)
3. Detail di [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
4. Run `.\verify-installation.bat`

---

**Ready to Deploy! 🚀**

Estimasi waktu: 30-60 menit untuk setup lengkap.
