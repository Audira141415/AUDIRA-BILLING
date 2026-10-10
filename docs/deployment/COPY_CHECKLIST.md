# 📋 CHECKLIST: Files untuk Copy ke PC Baru

## ✅ WAJIB COPY - File Ini Harus Ada

### Root Project
```
BillingByAudira/
├── package.json                    ✅ WAJIB
├── package-lock.json              ✅ WAJIB
├── pnpm-workspace.yaml            ✅ WAJIB
├── docker-compose.yml             ✅ WAJIB
├── .gitignore                     ✅ Recommended
├── README.md                      ✅ Recommended
├── start-all.bat                  ✅ WAJIB
├── start-backend.bat              ✅ WAJIB
├── start-frontend.bat             ✅ WAJIB
├── start-customer-portal.bat      ✅ WAJIB
├── stop-all.bat                   ✅ WAJIB
└── restart-all.bat                ✅ WAJIB
```

### Backend (apps/backend/)
```
apps/backend/
├── package.json                   ✅ WAJIB
├── package-lock.json             ✅ WAJIB
├── tsconfig.json                  ✅ WAJIB
├── nest-cli.json                  ✅ WAJIB
├── .env                           ✅ WAJIB (buat baru di PC baru)
├── seed-demo-customer.js          ✅ WAJIB
├── prisma/
│   ├── schema.prisma              ✅ WAJIB
│   ├── seed.ts                    ✅ WAJIB
│   ├── seed-customer.ts           ✅ WAJIB
│   └── migrations/                ✅ WAJIB (semua file migration)
└── src/                           ✅ WAJIB (semua source code)
```

### Frontend Admin (apps/frontend/)
```
apps/frontend/
├── package.json                   ✅ WAJIB
├── package-lock.json             ✅ WAJIB
├── tsconfig.json                  ✅ WAJIB
├── next.config.js                 ✅ WAJIB
├── tailwind.config.js             ✅ WAJIB
├── postcss.config.js              ✅ WAJIB
├── .env.local                     ✅ WAJIB (buat baru)
└── src/                           ✅ WAJIB (semua source code)
```

### Customer Portal (apps/customer-portal/)
```
apps/customer-portal/
├── package.json                   ✅ WAJIB
├── package-lock.json             ✅ WAJIB
├── tsconfig.json                  ✅ WAJIB
├── next.config.js                 ✅ WAJIB
├── tailwind.config.js             ✅ WAJIB
├── postcss.config.js              ✅ WAJIB
├── .env.local                     ✅ WAJIB (buat baru)
└── src/                           ✅ WAJIB (semua source code)
```

### Mobile (apps/mobile/) - Opsional
```
apps/mobile/
├── package.json                   ⚪ Opsional
├── app.json                       ⚪ Opsional
├── tsconfig.json                  ⚪ Opsional
└── src/                           ⚪ Opsional
```

---

## ❌ TIDAK PERLU COPY - Akan Di-Generate Ulang

### Node Modules (SKIP - Akan di-install ulang)
```
❌ node_modules/                   (di root)
❌ apps/backend/node_modules/      
❌ apps/frontend/node_modules/     
❌ apps/customer-portal/node_modules/
❌ apps/mobile/node_modules/       
```

### Build Output (SKIP - Akan di-build ulang)
```
❌ apps/backend/dist/              (compiled backend)
❌ apps/frontend/.next/            (compiled frontend)
❌ apps/customer-portal/.next/     (compiled customer portal)
❌ apps/mobile/.expo/              
```

### Cache & Temp Files (SKIP)
```
❌ .npm/
❌ .cache/
❌ .turbo/
❌ *.log
❌ .DS_Store
❌ Thumbs.db
```

---

## 🔒 FILE RAHASIA - Backup Terpisah

### Environment Variables (Copy manual, jangan commit ke Git)
```
🔒 apps/backend/.env               → Backup terpisah
🔒 apps/frontend/.env.local        → Backup terpisah
🔒 apps/customer-portal/.env.local → Backup terpisah
```

**Contoh .env yang perlu dibuat di PC baru:**

#### apps/backend/.env
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sebilling?schema=public"
JWT_SECRET="your-secret-key-here"
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### apps/frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### apps/customer-portal/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 💾 DATA & UPLOADS - Backup Terpisah

### Database Backup
```
📊 Backup database (via aplikasi atau manual):
   - Login ke http://localhost:3000/backup
   - Klik "Create Backup"
   - Download file .sql
   
   Atau manual:
   docker exec sebilling-postgres pg_dump -U postgres sebilling > backup.sql
```

### Uploaded Files (jika ada)
```
📁 apps/backend/uploads/           → Backup terpisah jika ada file penting
   - Invoice PDFs
   - Customer documents
   - Profile pictures
```

---

## 📦 CARA COPY YANG BENAR

### Metode 1: ZIP/RAR (Paling Mudah)

1. **Di PC Lama:**
```powershell
# Compress folder (exclude node_modules)
# Gunakan WinRAR atau 7-Zip
# Add to archive: BillingByAudira.zip
# Exclude: node_modules, dist, .next
```

2. **Di PC Baru:**
```powershell
# Extract ZIP
# Copy ke D:\BillingByAudira
```

### Metode 2: Git Clone (Jika sudah push ke GitHub)

1. **Push dari PC Lama:**
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

2. **Clone di PC Baru:**
```powershell
git clone https://github.com/username/repo.git
cd repo
```

### Metode 3: USB/External Drive

1. **Copy ke USB:**
   - Copy folder BillingByAudira
   - JANGAN copy node_modules (terlalu besar)

2. **Paste di PC Baru:**
   - Paste ke lokasi yang diinginkan
   - Install ulang dependencies

---

## 🚀 QUICK START DI PC BARU

### 1. Setelah Copy Folder:

```powershell
# Masuk ke folder project
cd D:\BillingByAudira

# Install dependencies root
npm install

# Install dependencies backend
cd apps\backend
npm install

# Install dependencies frontend
cd ..\frontend
npm install

# Install dependencies customer portal
cd ..\customer-portal
npm install

# Kembali ke root
cd ..\..
```

### 2. Setup Docker:

```powershell
# Start PostgreSQL & Redis
docker-compose up -d

# Verify running
docker ps
```

### 3. Setup Database:

```powershell
cd apps\backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed demo data
node seed-demo-customer.js
```

### 4. Start Services:

```powershell
# Kembali ke root
cd ..\..

# Start semua service
.\start-all.bat
```

---

## ✅ VERIFICATION CHECKLIST

Setelah setup di PC baru, verify:

### Files Check:
- [ ] package.json ada di root
- [ ] docker-compose.yml ada
- [ ] Semua batch files (.bat) ada
- [ ] apps/backend/src/ ada dan lengkap
- [ ] apps/frontend/src/ ada dan lengkap
- [ ] apps/customer-portal/src/ ada dan lengkap
- [ ] apps/backend/prisma/schema.prisma ada
- [ ] apps/backend/prisma/migrations/ ada

### Environment Check:
- [ ] .env dibuat di apps/backend/
- [ ] .env.local dibuat di apps/frontend/
- [ ] .env.local dibuat di apps/customer-portal/

### Installation Check:
- [ ] npm install berhasil (no errors)
- [ ] docker-compose up -d berhasil
- [ ] Docker containers running (postgres + redis)
- [ ] npx prisma generate berhasil
- [ ] npx prisma migrate deploy berhasil

### Running Check:
- [ ] Backend running di http://localhost:4000
- [ ] Frontend running di http://localhost:3000
- [ ] Customer Portal running di http://localhost:3001
- [ ] Admin login works (admin@test.com / admin123)
- [ ] Customer login works (customer@demo.com / demo123)

---

## 📊 ESTIMASI UKURAN FILE

```
Folder Lengkap (TANPA node_modules):    ~150 MB
Folder + node_modules:                  ~800 MB
Database backup (.sql):                 ~1-10 MB (tergantung data)
Uploads folder:                         Varies (jika ada)

RECOMMENDED: Copy TANPA node_modules, install ulang
```

---

## 🐛 COMMON ISSUES

### Issue: "Cannot find module"
**Solution:**
```powershell
npm install
cd apps\backend && npm install
cd ..\frontend && npm install
cd ..\customer-portal && npm install
```

### Issue: "Docker not found"
**Solution:**
- Install Docker Desktop
- Restart PC
- Enable WSL2 (Windows Subsystem for Linux)

### Issue: "Port already in use"
**Solution:**
```powershell
# Check what's using the port
netstat -ano | findstr :4000

# Kill the process
taskkill /PID <PID> /F
```

### Issue: "Database connection failed"
**Solution:**
- Check Docker running: `docker ps`
- Check .env DATABASE_URL correct
- Restart Docker: `docker-compose restart`

---

## 📞 SUPPORT COMMANDS

```powershell
# Check Node version
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# List Docker containers
docker ps -a

# View Docker logs
docker logs sebilling-postgres

# Check open ports
netstat -ano | findstr :4000
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5433

# Check disk space
Get-PSDrive C

# Check process
Get-Process node
```

---

## 🎯 FINAL CHECKLIST

### Before Moving to New PC:
- [ ] Backup database (.sql file)
- [ ] Backup .env files (tulis manual jika perlu)
- [ ] Backup uploads folder (jika ada data penting)
- [ ] List semua credentials & API keys

### On New PC:
- [ ] Install Node.js (v18+)
- [ ] Install Docker Desktop
- [ ] Copy project folder (tanpa node_modules)
- [ ] Create .env files
- [ ] Run npm install
- [ ] Setup Docker
- [ ] Run migrations
- [ ] Restore database (jika ada backup)
- [ ] Test all services

### Verification:
- [ ] All services running
- [ ] Login works (admin & customer)
- [ ] Database connected
- [ ] All features working
- [ ] No errors in console

---

**Selesai! Aplikasi siap berjalan di PC baru** 🚀

**Total waktu setup: ~30-60 menit** (tergantung kecepatan internet untuk download dependencies)
