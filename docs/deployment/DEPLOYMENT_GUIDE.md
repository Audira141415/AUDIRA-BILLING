# 📦 Panduan Deployment ke PC Lain

## 🎯 Ringkasan Cepat

Aplikasi ini terdiri dari:
- **Backend** (NestJS) - Port 4000
- **Frontend** (Next.js Admin) - Port 3000
- **Customer Portal** (Next.js) - Port 3001
- **Database** (PostgreSQL) - Port 5433
- **Redis** - Port 6379

---

## 📋 Prasyarat di PC Baru

### 1. Install Software yang Dibutuhkan:

#### ✅ Node.js (v18 atau lebih tinggi)
```
Download: https://nodejs.org/
Verify: node --version
        npm --version
```

#### ✅ Docker Desktop (untuk PostgreSQL & Redis)
```
Download: https://www.docker.com/products/docker-desktop
Verify: docker --version
        docker-compose --version
```

#### ✅ Git (opsional, untuk version control)
```
Download: https://git-scm.com/
Verify: git --version
```

---

## 🚀 Metode 1: Transfer Manual (Tanpa Git)

### Step 1: Copy Project Folder

1. **Di PC Lama**:
   - Copy seluruh folder `BillingByAudira`
   - Gunakan USB drive atau network share
   - Ukuran: ~500MB (tanpa node_modules)

2. **Di PC Baru**:
   - Paste ke lokasi yang diinginkan (misal: `D:\BillingByAudira`)

### Step 2: Install Dependencies

```powershell
# Buka PowerShell as Administrator
cd D:\BillingByAudira

# Install dependencies untuk semua project
npm install

# Install dependencies untuk backend
cd apps\backend
npm install

# Install dependencies untuk frontend
cd ..\frontend
npm install

# Install dependencies untuk customer portal
cd ..\customer-portal
npm install

# Kembali ke root
cd ..\..
```

### Step 3: Setup Database dengan Docker

```powershell
# Di folder root project
cd D:\BillingByAudira

# Start Docker containers
docker-compose up -d

# Verify containers running
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE          PORTS                    NAMES
xxxxx          postgres:16    0.0.0.0:5433->5432/tcp   sebilling-postgres
xxxxx          redis:alpine   0.0.0.0:6379->6379/tcp   sebilling-redis
```

### Step 4: Setup Database Schema

```powershell
cd apps\backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed demo data
node seed-demo-customer.js
```

### Step 5: Start All Services

**Opsi A - Menggunakan Batch Files:**
```powershell
# Start semua service sekaligus
.\start-all.bat
```

**Opsi B - Manual (3 terminal terpisah):**

Terminal 1 - Backend:
```powershell
cd D:\BillingByAudira\apps\backend
npm run dev
```

Terminal 2 - Frontend Admin:
```powershell
cd D:\BillingByAudira\apps\frontend
npm run dev
```

Terminal 3 - Customer Portal:
```powershell
cd D:\BillingByAudira\apps\customer-portal
npm run dev
```

### Step 6: Verify Installation

Open browser:
- Frontend Admin: http://localhost:3000
- Customer Portal: http://localhost:3001
- Backend API: http://localhost:4000/health

---

## 🚀 Metode 2: Export/Import Database (Jika ada data)

### Di PC Lama - Export Database:

```powershell
# Export database
docker exec sebilling-postgres pg_dump -U postgres sebilling > backup.sql

# Atau gunakan backup dari aplikasi
# Navigate ke http://localhost:3000/backup
# Klik "Create Backup"
```

### Di PC Baru - Import Database:

```powershell
# Setelah docker containers running
docker exec -i sebilling-postgres psql -U postgres sebilling < backup.sql

# Atau restore via aplikasi
# Navigate ke http://localhost:3000/backup
# Upload file backup dan klik "Restore"
```

---

## 📁 File-File Penting yang Harus Disertakan

### ✅ Wajib Ada:
```
BillingByAudira/
├── apps/
│   ├── backend/
│   ├── frontend/
│   ├── customer-portal/
│   └── mobile/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── start-all.bat
├── start-backend.bat
├── start-frontend.bat
└── start-customer-portal.bat
```

### ❌ Tidak Perlu Dicopy (akan di-generate ulang):
```
node_modules/          (di semua folder)
apps/backend/dist/     (compiled files)
.next/                 (di frontend & customer-portal)
apps/backend/uploads/  (uploaded files - backup terpisah jika perlu)
```

---

## 🔧 Konfigurasi Environment Variables

### Backend (.env)
File: `apps/backend/.env`

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sebilling?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (opsional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Midtrans Payment (opsional)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false

# WhatsApp (opsional)
FONNTE_TOKEN=your-fonnte-token
```

### Frontend (.env.local)
File: `apps/frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Customer Portal (.env.local)
File: `apps/customer-portal/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🐳 Docker Compose Configuration

File: `docker-compose.yml` (sudah ada)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: sebilling-postgres
    environment:
      POSTGRES_DB: sebilling
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    container_name: sebilling-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 🧪 Testing Setelah Install

### 1. Check Docker Containers:
```powershell
docker ps
```
Harus ada 2 containers: postgres dan redis

### 2. Check Backend:
```powershell
curl http://localhost:4000/health
```
Response: `{"status":"ok"}`

### 3. Test Login Admin:
```
URL: http://localhost:3000
Email: admin@test.com
Password: admin123
```

### 4. Test Login Customer:
```
URL: http://localhost:3001
Email: customer@demo.com
Password: demo123
```

---

## 🔒 Keamanan untuk Production

Jika deploy ke production server:

### 1. Ubah JWT Secret:
```env
JWT_SECRET="random-string-yang-sangat-panjang-dan-aman"
```

Generate dengan:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Ubah Database Password:
```env
DATABASE_URL="postgresql://postgres:STRONG_PASSWORD@localhost:5433/sebilling"
```

### 3. Enable HTTPS:
- Setup reverse proxy (Nginx/Apache)
- Install SSL certificate (Let's Encrypt)

### 4. Update CORS Settings:
File: `apps/backend/src/main.ts`
```typescript
app.enableCors({
  origin: ['https://yourdomain.com'],
  credentials: true,
});
```

---

## 🐛 Troubleshooting

### Problem: Docker tidak bisa start

**Solution**:
```powershell
# Stop all containers
docker-compose down

# Remove volumes (HATI-HATI: ini akan hapus data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Problem: Port sudah digunakan

**Solution**:
```powershell
# Check port 5433
netstat -ano | findstr :5433

# Kill process jika perlu
taskkill /PID <PID> /F

# Atau ubah port di docker-compose.yml
```

### Problem: npm install error

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Install ulang
npm install
```

### Problem: Database connection error

**Solution**:
```powershell
# Check PostgreSQL running
docker logs sebilling-postgres

# Test connection
docker exec -it sebilling-postgres psql -U postgres -d sebilling

# Verify DATABASE_URL di .env
```

### Problem: Prisma migration error

**Solution**:
```powershell
cd apps\backend

# Reset database (HATI-HATI: hapus semua data)
npx prisma migrate reset

# Atau deploy migration
npx prisma migrate deploy
```

---

## 📊 Checklist Deployment

### Pre-Deployment:
- [ ] Node.js installed (v18+)
- [ ] Docker Desktop installed & running
- [ ] Project folder copied ke PC baru

### Installation:
- [ ] `npm install` di root project
- [ ] `npm install` di apps/backend
- [ ] `npm install` di apps/frontend
- [ ] `npm install` di apps/customer-portal
- [ ] `docker-compose up -d` running
- [ ] Docker containers healthy

### Database Setup:
- [ ] `npx prisma generate` completed
- [ ] `npx prisma migrate deploy` completed
- [ ] Demo data seeded
- [ ] Database backup restored (jika ada)

### Service Start:
- [ ] Backend running (port 4000)
- [ ] Frontend running (port 3000)
- [ ] Customer Portal running (port 3001)

### Testing:
- [ ] Backend health check OK
- [ ] Admin login works
- [ ] Customer login works
- [ ] Semua fitur berfungsi normal

---

## 📞 Quick Commands Reference

```powershell
# Start everything
.\start-all.bat

# Stop everything
.\stop-all.bat

# Restart everything
.\restart-all.bat

# Check status
docker ps
netstat -ano | findstr :4000
netstat -ano | findstr :3000

# View logs
docker logs sebilling-postgres
docker logs sebilling-redis

# Database backup
docker exec sebilling-postgres pg_dump -U postgres sebilling > backup_$(Get-Date -Format 'yyyyMMdd').sql

# Database restore
docker exec -i sebilling-postgres psql -U postgres sebilling < backup.sql
```

---

## 🎯 Estimasi Waktu

| Tahap | Durasi |
|-------|--------|
| Copy files | 5-10 menit |
| Install Node.js & Docker | 15-20 menit |
| npm install semua dependencies | 10-15 menit |
| Setup Docker & Database | 5 menit |
| Run migrations & seed | 2 menit |
| Testing | 5 menit |
| **Total** | **40-60 menit** |

---

## 💾 Backup Strategy

### Backup Regular (otomatis via aplikasi):
1. Login ke admin panel (http://localhost:3000)
2. Navigate ke menu "Backup"
3. Klik "Create Backup"
4. Download file .sql

### Backup Manual:
```powershell
# Backup database
docker exec sebilling-postgres pg_dump -U postgres sebilling > backup.sql

# Backup uploads folder
Copy-Item -Recurse apps\backend\uploads backup_uploads

# Backup .env files
Copy-Item apps\backend\.env backup_env\backend.env
Copy-Item apps\frontend\.env.local backup_env\frontend.env
```

---

## 🌐 Deployment ke Server (Production)

### VPS/Cloud Server:

1. **Setup Server** (Ubuntu/Debian recommended):
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin
```

2. **Transfer Files**:
```bash
# Via Git
git clone https://github.com/yourusername/BillingByAudira.git

# Atau via SCP
scp -r BillingByAudira/ user@server:/opt/
```

3. **Build & Deploy**:
```bash
cd /opt/BillingByAudira

# Install dependencies
npm install

# Build applications
cd apps/backend && npm run build
cd ../frontend && npm run build
cd ../customer-portal && npm run build

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Setup Nginx Reverse Proxy**:
```nginx
# /etc/nginx/sites-available/sebilling
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4000;
    }
}
```

5. **Install SSL Certificate**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📱 Alternative: Deploy ke Vercel/Railway

### Vercel (untuk Frontend):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd apps/frontend
vercel

# Deploy customer portal
cd ../customer-portal
vercel
```

### Railway (untuk Backend + Database):
1. Connect GitHub repository
2. Deploy PostgreSQL service
3. Deploy Backend service
4. Set environment variables

---

## ✅ Kesimpulan

**Untuk PC Lokal**:
1. Copy folder project
2. Install Node.js & Docker
3. Run `npm install`
4. Run `docker-compose up -d`
5. Run migrations & seed
6. Start services dengan batch files

**Untuk Production Server**:
1. Setup VPS dengan Ubuntu
2. Install Node.js, Docker, Nginx
3. Clone/upload project
4. Build & deploy dengan PM2
5. Setup reverse proxy & SSL

Semua batch files dan configurations sudah ready, tinggal copy dan jalankan! 🚀
