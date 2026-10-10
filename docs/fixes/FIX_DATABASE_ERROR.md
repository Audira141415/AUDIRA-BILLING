# 🔧 FIX: Database Connection Error

## ❌ Error Message
```
Can't reach database server at `localhost:5433`
PrismaClientInitializationError
```

## 🎯 Root Cause
**PostgreSQL database tidak running** karena Docker Desktop tidak berjalan.

---

## ✅ SOLUSI (Step by Step)

### Opsi 1: Otomatis (Recommended)

**1. Start Docker Desktop:**
- Tekan `Windows Key`
- Ketik: `Docker Desktop`
- Klik untuk membuka
- **Tunggu sampai icon Docker di system tray menunjukkan "Running"** (warna hijau)
  - Biasanya 30-60 detik

**2. Jalankan script:**
```powershell
.\start-database.bat
```

**3. Verifikasi:**
```powershell
docker ps
```
Harus muncul:
- `sebilling-postgres` (running)
- `sebilling-redis` (running)

**4. Start backend:**
```powershell
cd apps\backend
npm run dev
```

---

### Opsi 2: Manual

**1. Start Docker Desktop** (sama seperti di atas)

**2. Start containers:**
```powershell
docker-compose up -d
```

**3. Cek status:**
```powershell
docker ps
```

**4. Start backend:**
```powershell
cd apps\backend
npm run dev
```

---

### Opsi 3: Quick Start (All-in-one)

**Jalankan setelah Docker Desktop running:**
```powershell
.\quick-start.bat
```

Script ini akan:
1. ✅ Start database
2. ✅ Seed admin user
3. ✅ Start backend
4. ✅ Start frontend
5. ✅ Open browser

---

## 🔍 Troubleshooting

### Problem 1: Docker Desktop tidak install

**Cek:**
```powershell
docker --version
```

**Jika error:**
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install
3. Restart komputer
4. Jalankan Docker Desktop

---

### Problem 2: Docker Desktop stuck "Starting..."

**Solusi:**
1. Close Docker Desktop
2. Task Manager → End all Docker processes
3. Buka Docker Desktop lagi
4. Tunggu hingga fully started

**Alternative:**
```powershell
# Restart Docker service
Restart-Service -Name com.docker.service -Force
```

---

### Problem 3: Container tidak start

**Cek logs:**
```powershell
docker-compose logs
```

**Reset containers:**
```powershell
docker-compose down
docker-compose up -d
```

**Force recreate:**
```powershell
docker-compose down -v
docker-compose up -d
```

---

### Problem 4: Port 5433 sudah dipakai

**Cek port:**
```powershell
netstat -ano | findstr :5433
```

**Jika ada process:**
```powershell
# Kill process (ganti <PID> dengan nomor yang muncul)
taskkill /PID <PID> /F
```

**Atau ubah port di `docker-compose.yml`:**
```yaml
ports:
  - "5434:5432"  # Ganti 5433 ke 5434
```

**Jangan lupa update `.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/sebilling?schema=public"
```

---

## 📋 Checklist Sebelum Start Backend

- [ ] Docker Desktop installed
- [ ] Docker Desktop running (icon hijau di system tray)
- [ ] `docker ps` menampilkan containers
- [ ] Port 5433 tidak digunakan process lain
- [ ] `.env` file ada di `apps/backend/`

---

## 🎯 Quick Commands

### Start Everything:
```powershell
# 1. Start Docker Desktop (manual)
# 2. Then run:
.\quick-start.bat
```

### Start Database Only:
```powershell
.\start-database.bat
```

### Stop Database:
```powershell
.\stop-database.bat
# atau
docker-compose down
```

### Restart Database:
```powershell
docker-compose restart
```

### View Logs:
```powershell
docker-compose logs -f
```

### Connect to Database (untuk testing):
```powershell
docker exec -it sebilling-postgres psql -U postgres -d sebilling
```

---

## 🔄 Full Reset (jika semua gagal)

```powershell
# 1. Stop semua
docker-compose down -v

# 2. Hapus volumes (HATI-HATI: data hilang!)
docker volume prune -f

# 3. Start ulang
docker-compose up -d

# 4. Tunggu 10 detik
timeout /t 10

# 5. Migrate & seed
cd apps\backend
npx prisma migrate deploy
npx prisma db seed

# 6. Start backend
npm run dev
```

---

## 💡 Tips

### Auto-start Docker on Boot

1. Docker Desktop Settings
2. General → "Start Docker Desktop when you log in"
3. ✅ Enable

### Keep Containers Running

Containers sudah dikonfigurasi dengan `restart: unless-stopped`, jadi akan auto-start saat Docker hidup.

### Check Health

```powershell
# Database ready?
docker exec sebilling-postgres pg_isready -U postgres

# Redis ready?
docker exec sebilling-redis redis-cli ping
```

---

## 📊 Expected Output

### After `docker ps`:
```
CONTAINER ID   IMAGE                 STATUS         PORTS
abc123def456   postgres:16-alpine    Up 2 minutes   0.0.0.0:5433->5432/tcp
xyz789ghi012   redis:7-alpine        Up 2 minutes   0.0.0.0:6379->6379/tcp
```

### After backend starts:
```
[Nest] 12345 - Database connected successfully
[Nest] 12345 - Application is running on: http://localhost:4000
```

---

## ✅ Summary

**Root Problem:** Docker Desktop tidak running  
**Solution:** Start Docker Desktop → Run `start-database.bat`  
**Verify:** `docker ps` shows 2 containers running  
**Then:** Start backend dengan `npm run dev`

**All-in-one:** Gunakan `quick-start.bat` setelah Docker ready!
