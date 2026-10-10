# 📦 Deployment Documentation

Dokumentasi lengkap untuk memindahkan dan deploy aplikasi Sebilling ke PC/server baru.

---

## 📚 Daftar Dokumentasi

### 1. [QUICK_START_NEW_PC.md](./QUICK_START_NEW_PC.md) ⭐ **MULAI DI SINI**
**Panduan tercepat untuk setup di PC baru**
- Prerequisites yang dibutuhkan
- Langkah instalasi ringkas
- Quick troubleshooting
- **Estimasi waktu: 30-60 menit**

### 2. [COPY_CHECKLIST.md](./COPY_CHECKLIST.md) ✅ **CHECKLIST**
**Daftar file yang perlu dicopy**
- File WAJIB dicopy
- File TIDAK perlu dicopy (node_modules, dll)
- Environment variables
- Verification checklist
- Estimasi ukuran file

### 3. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 📖 **PANDUAN LENGKAP**
**Dokumentasi detail deployment**
- Setup di PC lokal
- Deploy ke production server (VPS)
- Konfigurasi environment lengkap
- Backup & restore strategy
- Security best practices
- Troubleshooting mendalam

---

## 🚀 Quick Start (3 Langkah)

### Di PC Lama:
```
1. Copy folder BillingByAudira (TANPA node_modules)
2. Backup database jika ada data penting
3. Catat environment variables (.env files)
```

### Di PC Baru:
```
1. Install Node.js v18+ dan Docker Desktop
2. Paste folder & jalankan setup.bat (as Admin)
3. Start services dengan start-all.bat
```

### Verify:
```powershell
.\verify-installation.bat
```

---

## 📋 File & Script Penting

### Batch Files (di root project):
- `setup.bat` - Setup otomatis untuk PC baru
- `verify-installation.bat` - Verifikasi instalasi
- `start-all.bat` - Start semua service
- `stop-all.bat` - Stop semua service
- `start-backend.bat` - Start backend saja
- `start-frontend.bat` - Start frontend saja
- `start-customer-portal.bat` - Start customer portal saja

### Environment Files (buat manual):
```
apps/backend/.env
apps/frontend/.env.local
apps/customer-portal/.env.local
```

---

## 🎯 Workflow Deployment

```
┌─────────────────┐
│   PC Lama       │
│  - Copy folder  │
│  - Backup DB    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Transfer       │
│  USB/Network    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PC Baru       │
│ - Install soft  │
│ - Run setup.bat │
│ - Start apps    │
└─────────────────┘
```

---

## 💾 Yang Perlu Dicopy

### ✅ WAJIB:
- Semua folder `apps/` (backend, frontend, customer-portal)
- `package.json` files
- `docker-compose.yml`
- Semua `.bat` files
- `prisma/` folder (schema & migrations)
- Semua source code (`src/` folders)

### ❌ JANGAN:
- `node_modules/` (akan di-install ulang)
- `dist/` dan `.next/` (akan di-build ulang)
- `.cache/`, `.turbo/` (cache files)

### 🔒 Backup Terpisah:
- `.env` files (jangan commit ke Git!)
- Database backup (`.sql` file)
- `uploads/` folder (jika ada data penting)

---

## 🧪 Testing

Setelah setup, test:
1. ✅ Backend: http://localhost:4000/health
2. ✅ Admin: http://localhost:3000 (admin@test.com / admin123)
3. ✅ Customer: http://localhost:3001 (customer@demo.com / demo123)

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| npm install error | `npm cache clean --force` |
| Docker not starting | Check Docker Desktop, restart PC |
| Port already in use | Kill process: `netstat -ano \| findstr :4000` |
| Database error | `docker-compose restart` |
| Module not found | Delete node_modules, npm install ulang |

---

## 📞 Quick Commands

```powershell
# Verify installation
.\verify-installation.bat

# Start everything
.\start-all.bat

# Stop everything
.\stop-all.bat

# Check Docker
docker ps

# Check ports
netstat -ano | findstr :4000
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# View logs
docker logs sebilling-postgres
docker logs sebilling-redis
```

---

## 📊 System Requirements

### Minimum:
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Disk**: 10 GB free space
- **OS**: Windows 10/11, Ubuntu 20.04+, macOS 11+

### Recommended:
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Disk**: 20 GB SSD
- **Internet**: Untuk download dependencies

---

## 🔐 Security Checklist (Production)

- [ ] Ubah JWT_SECRET ke random string
- [ ] Ubah database password
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Disable debug mode
- [ ] Setup backup automation
- [ ] Enable monitoring & logging
- [ ] Update CORS settings
- [ ] Review API authentication

---

## 📈 Performance Tips

### Development:
- Use SSD for faster npm install
- Enable Docker BuildKit
- Use npm ci instead of npm install (CI/CD)

### Production:
- Enable Redis caching
- Use PM2 for process management
- Setup load balancer (multiple instances)
- Enable CDN for static assets
- Database connection pooling

---

## 📱 Platform Specific

### Windows:
- Run PowerShell as Administrator
- Enable WSL2 for Docker
- Use .bat files

### Linux/macOS:
- Use bash scripts (.sh)
- Install Docker via package manager
- Check file permissions

---

## 🎯 Next Steps After Installation

1. ✅ Verify all services running
2. ✅ Test login (admin & customer)
3. ✅ Check database connection
4. ✅ Test main features
5. 📝 Customize branding & settings
6. 📊 Add real data
7. 🔐 Configure security
8. 🚀 Deploy to production (optional)

---

## 📞 Support

Jika menemui masalah:
1. Cek file troubleshooting di dokumentasi
2. Run `verify-installation.bat`
3. Check Docker & Node.js versions
4. Review error logs
5. Restart services: `.\restart-all.bat`

---

## 📅 Version Info

**Last Updated**: December 2, 2025  
**Application Version**: 1.0.0  
**Compatibility**: Node.js 18+, Docker 20+

---

**Happy Deploying! 🚀**

Untuk detail lengkap, baca dokumentasi di atas sesuai kebutuhan.
