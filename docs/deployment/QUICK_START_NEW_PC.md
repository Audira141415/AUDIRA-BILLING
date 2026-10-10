# 🚀 Quick Start - Memindahkan ke PC Baru

## 📦 Yang Perlu Dicopy

### ✅ Copy folder ini (TANPA node_modules):
```
BillingByAudira/
├── apps/           (semua source code)
├── *.bat           (batch files)
├── package.json
├── docker-compose.yml
└── semua file config
```

### ❌ JANGAN copy:
```
node_modules/       (di semua folder)
dist/              (build files)
.next/             (build files)
```

---

## 🔧 Setup di PC Baru

### 1. Install Prerequisites

**Node.js** (v18+): https://nodejs.org/  
**Docker Desktop**: https://www.docker.com/products/docker-desktop

### 2. Extract & Setup

```powershell
# 1. Extract folder ke D:\BillingByAudira

# 2. Jalankan setup otomatis (as Administrator)
.\setup.bat

# Setup akan:
# - Install semua dependencies
# - Start Docker containers
# - Setup database
# - Seed demo data
```

### 3. Atau Setup Manual

```powershell
# Install dependencies
npm install
cd apps\backend && npm install
cd ..\frontend && npm install
cd ..\customer-portal && npm install
cd ..\..

# Start Docker
docker-compose up -d

# Setup database
cd apps\backend
npx prisma generate
npx prisma migrate deploy
node seed-demo-customer.js
cd ..\..
```

### 4. Start Services

```powershell
# Start semua service
.\start-all.bat

# Atau manual:
.\start-backend.bat
.\start-frontend.bat
.\start-customer-portal.bat
```

---

## 🧪 Test Installation

```powershell
# Verifikasi instalasi
.\verify-installation.bat
```

Open browser:
- **Admin**: http://localhost:3000 (admin@test.com / admin123)
- **Customer**: http://localhost:3001 (customer@demo.com / demo123)

---

## 📝 Create .env Files (Manual)

### apps/backend/.env
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sebilling?schema=public"
JWT_SECRET="your-secret-key"
REDIS_HOST=localhost
REDIS_PORT=6379
```

### apps/frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### apps/customer-portal/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🐛 Troubleshooting

**Problem**: npm install error  
**Solution**: `npm cache clean --force` then `npm install`

**Problem**: Docker not starting  
**Solution**: Check Docker Desktop running, restart PC

**Problem**: Port already in use  
**Solution**: `netstat -ano | findstr :4000` then kill process

**Problem**: Database connection error  
**Solution**: `docker-compose restart` then verify .env

---

## 📊 Full Documentation

- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Copy Checklist**: [COPY_CHECKLIST.md](COPY_CHECKLIST.md)
- **Customer Login Fix**: [CUSTOMER_LOGIN_FIX.md](CUSTOMER_LOGIN_FIX.md)

---

## ⏱️ Estimated Time

- Copy files: 5-10 min
- Install software: 15-20 min
- Setup & dependencies: 15-30 min
- **Total**: 35-60 minutes

---

**Ready to use!** 🎉
