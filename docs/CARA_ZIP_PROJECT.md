# Panduan Zipping Project AUDIRA

## 🚀 Cara Membersihkan Project Sebelum Zip

### Opsi 1: Gunakan Script Otomatis (RECOMMENDED)
```bash
scripts\cleanup-before-zip.bat
```

Script ini akan otomatis menghapus:
- ✅ Semua `node_modules` (root + 4 apps)
- ✅ Build artifacts (`.next`, `dist`)
- ✅ Cache directories (`.pnpm`, `.expo`)
- ✅ File temporary (`_tmp_*`)
- ✅ File deprecated (`start-backend-simple.bat`)
- ✅ File test yang tidak perlu

**Waktu eksekusi:** 2-5 menit
**Pengurangan ukuran:** Dari ~2-3 GB menjadi ~50-100 MB

---

### Opsi 2: Manual Cleanup

Jika ingin manual, hapus direktori berikut:

#### 1. Node Modules (WAJIB HAPUS)
```
node_modules/                     # Root
apps/backend/node_modules/
apps/frontend/node_modules/
apps/customer-portal/node_modules/
apps/mobile/node_modules/
```

#### 2. Build Artifacts (WAJIB HAPUS)
```
apps/frontend/.next/
apps/customer-portal/.next/
apps/backend/dist/
```

#### 3. Cache Directories (DISARANKAN HAPUS)
```
.pnpm/
.expo/
apps/mobile/.expo/
```

#### 4. File Deprecated & Temporary (OPSIONAL)
```
start-backend-simple.bat
test-technician-login.js
_tmp_*
```

---

## 📦 Cara Zip Project

### Setelah Cleanup:
1. **Tutup semua terminal/command prompt**
2. **Jalankan scripts\cleanup-before-zip.bat**
3. **Tunggu sampai selesai**
4. **Zip dengan 7zip/WinRAR:**
   - Klik kanan folder `PJTBillingByAudira`
   - Pilih "Add to archive"
   - Format: ZIP atau 7z (recommended 7z untuk kompresi lebih baik)
   - Compression level: Ultra (untuk ukuran terkecil)

### Estimasi Ukuran File Zip:
- **Format ZIP:** ~20-30 MB
- **Format 7z (Ultra):** ~15-25 MB

---

## 🔄 Cara Restore Setelah Unzip

### Langkah-langkah:

#### 1. Extract Project
```bash
# Extract ke lokasi yang diinginkan, misalnya:
D:\PJTBillingByAudira
```

#### 2. Install Dependencies
Buka terminal/command prompt di folder project, lalu jalankan:
```bash
pnpm install
```

**Catatan:** Proses ini akan:
- Menginstall semua dependencies untuk root
- Menginstall dependencies untuk semua apps (backend, frontend, customer-portal, mobile)
- Memakan waktu 5-10 menit tergantung koneksi internet

#### 3. Build Backend
```bash
cd apps\backend
pnpm run build
cd ..\..
```

**Catatan:** Ini akan compile TypeScript backend ke JavaScript di folder `dist/`

#### 4. Jalankan Server
```bash
start-servers.bat
```

**Catatan:** Script ini akan:
- Start backend di port 4000
- Start frontend di port 3000
- Otomatis membuka browser ke http://localhost:3000

---

## ✅ Verifikasi Setelah Restore

### Cek Server Running:
```bash
# Buka terminal baru, jalankan:
netstat -ano | findstr "LISTENING" | findstr ":3000 :4000"
```

**Output yang benar:**
```
TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    [PID]
TCP    0.0.0.0:4000    0.0.0.0:0    LISTENING    [PID]
```

### Login Test:
- **URL:** http://localhost:3000
- **Admin:** admin@audira.net / admin123
- **Billing:** billing@audira.net / billing123

---

## 📋 Checklist Sebelum Transfer

- [ ] Server sudah dihentikan (`stop-servers.bat`)
- [ ] `scripts\cleanup-before-zip.bat` sudah dijalankan
- [ ] Ukuran folder < 150 MB (cek dengan PowerShell)
- [ ] File `.env` ada di root (kredensial database)
- [ ] File `prisma/schema.prisma` ada di apps/backend
- [ ] Semua batch files ada (start-servers.bat, stop-servers.bat, dll)
- [ ] File README.md ada dan lengkap

---

## ⚠️ PENTING: Jangan Zip Ini!

**JANGAN masukkan ke dalam ZIP:**
- ❌ `node_modules/` (semua lokasi)
- ❌ `.next/` (build Next.js)
- ❌ `dist/` (compiled backend)
- ❌ `.pnpm/` (pnpm cache)
- ❌ `.expo/` (expo cache)
- ❌ `_tmp_*` (temporary files)

**YANG HARUS di-ZIP:**
- ✅ Source code (`apps/backend/src`, `apps/frontend/src`, dll)
- ✅ Configuration files (`package.json`, `.env`, `tsconfig.json`)
- ✅ Prisma schema (`apps/backend/prisma/schema.prisma`)
- ✅ Batch scripts (`start-servers.bat`, `stop-servers.bat`)
- ✅ Documentation (`.md` files di root dan docs/)
- ✅ Docker config (`docker-compose.yml`)

---

## 🛠️ Troubleshooting

### Problem: "Cannot find module 'dist/src/main.js'"
**Solusi:**
```bash
cd apps\backend
pnpm run build
```

### Problem: "Port 3000 or 4000 already in use"
**Solusi:**
```bash
stop-servers.bat
# Tunggu 5 detik, lalu:
start-servers.bat
```

### Problem: "pnpm command not found"
**Solusi:**
```bash
npm install -g pnpm@8
```

### Problem: Zip error "Path too long"
**Solusi:**
- Pastikan sudah jalankan `scripts\cleanup-before-zip.bat`
- Gunakan 7zip (bukan Windows Explorer)
- Pindahkan folder ke lokasi dengan path lebih pendek (C:\Projects\)

---

## 📊 Estimasi Waktu

| Proses | Waktu |
|--------|-------|
| Cleanup | 2-5 menit |
| Zipping | 1-3 menit |
| Extract | 30 detik - 1 menit |
| pnpm install | 5-10 menit |
| Backend build | 30 detik - 1 menit |
| Start servers | 30 detik |
| **Total** | **10-20 menit** |

---

## 📞 Support

Jika ada masalah:
1. Cek file `README.md` di root project
2. Cek file `QUICK_START.md` untuk panduan lebih detail
3. Lihat logs di terminal backend/frontend untuk error messages
