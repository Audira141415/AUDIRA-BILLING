# 🔧 FIX: Menu Sidebar Hilang Setelah Login

## ❌ Masalah
Setelah login berhasil, **menu sidebar kosong/hilang semua**.

## ✅ Penyebab & Solusi

### 1. **Role Case Mismatch**
**Masalah:** Database menyimpan role sebagai `'admin'` (lowercase), tapi menu memerlukan `'ADMIN'` (uppercase)

**Solusi:** AuthContext sudah diperbaiki untuk normalize role ke uppercase

### 2. **LocalStorage Corrupted**
**Masalah:** Data user di localStorage masih pakai format lama

**Solusi:** Clear localStorage dan login ulang

---

## 🚀 Cara Fix (Step by Step)

### Opsi 1: Clear Cache Manual

1. **Buka DevTools** (F12)
2. **Console Tab**
3. **Paste dan Enter:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```
4. **Login ulang** dengan:
   - Email: `admin@audira.net`
   - Password: `admin123`
5. ✅ **Menu muncul kembali!**

### Opsi 2: Gunakan Script

```powershell
.\clear-cache.bat
```

### Opsi 3: Debug Page

1. Buka: http://localhost:3000/debug-auth
2. Lihat info user & menu visibility
3. Klik "Clear & Logout" jika ada masalah
4. Login ulang

---

## 🔍 Cara Verifikasi Fix Berhasil

### 1. Check Console Log

Setelah login, di DevTools Console harus muncul:
```
✅ Login successful: admin@audira.net Role: ADMIN
👤 User loaded: admin@audira.net Role: ADMIN
🔍 Sidebar Debug: {
  user: { email: 'admin@audira.net', role: 'ADMIN' },
  totalMenus: 15,
  filteredMenus: 15,
  menuNames: ['Dashboard', 'Pelanggan', 'Paket', ...]
}
```

### 2. Check Sidebar

Menu yang harus muncul untuk role ADMIN:
- ✅ Dashboard
- ✅ Pelanggan
- ✅ Paket
- ✅ Layanan
- ✅ Keuangan
- ✅ Transaksi Saya
- ✅ Operational
- ✅ Infrastruktur
- ✅ Mikrotik
- ✅ GenieAcs
- ✅ Field Service
- ✅ Analytics
- ✅ Franchise
- ✅ Pengaturan
- ✅ Dokumentasi
- ✅ 🔧 Test API

---

## 🛠️ Yang Sudah Diperbaiki

### File: `AuthContext.tsx`
```typescript
// ✅ Normalize role saat load dari localStorage
const parsedUser = JSON.parse(storedUser)
if (parsedUser.role) {
  parsedUser.role = parsedUser.role.toUpperCase()
}

// ✅ Normalize role saat login
const userRole = (data.user.role || 'ADMIN').toUpperCase()
```

### File: `Sidebar.tsx`
```typescript
// ✅ Filter dengan case-insensitive comparison
const filteredMenuItems = menuItems.filter(item => {
  if (!item.roles || item.roles.length === 0) return true
  if (!user) return false
  return item.roles.some(role => 
    role.toUpperCase() === user.role.toUpperCase()
  )
})
```

---

## 📋 Troubleshooting Checklist

- [ ] **Backend running?** → `curl http://localhost:4000/health`
- [ ] **Frontend running?** → `http://localhost:3000`
- [ ] **User exists in DB?** → `cd apps/backend; npx ts-node check-users.ts`
- [ ] **Login berhasil?** → Check network tab, status 200
- [ ] **LocalStorage ada user?** → F12 → Application → Local Storage
- [ ] **Role uppercase?** → Console log harus show `role: "ADMIN"`
- [ ] **Menu filtered correctly?** → Console log show filtered menu count

---

## 🎯 Quick Commands

```powershell
# Check backend
curl http://localhost:4000/health

# Check users in DB
cd apps\backend
npx ts-node check-users.ts

# Clear browser cache (paste in Console)
localStorage.clear(); location.reload();

# Open debug page
start http://localhost:3000/debug-auth
```

---

## ✅ Expected Result

Setelah fix:
1. ✅ Login dengan `admin@audira.net` / `admin123`
2. ✅ Redirect ke homepage
3. ✅ Sidebar muncul dengan **SEMUA menu** (15 items)
4. ✅ Console log menampilkan user role: `ADMIN`
5. ✅ Bisa navigasi ke semua halaman

---

## 💡 Tips

### Jika masih tidak muncul:

1. **Hard Refresh:** Ctrl + Shift + R
2. **Incognito Mode:** Test di private window
3. **Check Console:** Lihat error di DevTools
4. **Debug Page:** Buka `/debug-auth` untuk detail info

### Developer Mode:

Jika ingin test tanpa login berulang, gunakan console:
```javascript
localStorage.setItem('user', JSON.stringify({
  id: 'dev-1',
  email: 'admin@audira.net',
  name: 'Admin AudiraBilling',
  role: 'ADMIN'
}))
localStorage.setItem('token', 'dev-token')
location.reload()
```

---

## 📝 Summary

**Root Cause:** Role mismatch (`admin` vs `ADMIN`)  
**Fix:** Normalize semua role ke uppercase  
**Action:** Clear localStorage + login ulang  
**Result:** ✅ Menu muncul semua!
