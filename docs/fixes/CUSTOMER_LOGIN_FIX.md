# Customer Portal Login - FIXED ✅

## 🔧 Masalah yang Diperbaiki

**Issue**: Customer tidak bisa login dengan kredensial demo  
**Error**: "Email atau password salah"

## ✅ Solusi yang Diterapkan

### 1. **Perbaikan Seed Data**
- Email diubah dari `customer@test.com` → `customer@demo.com`
- Password diubah dari `customer123` → `demo123`
- Password di-hash dengan bcrypt (10 rounds)

**File**: `apps/backend/prisma/seed-customer.ts`

### 2. **Perbaikan Auth Controller**
- Removed default password fallback
- Proper password verification dengan bcrypt
- Better error handling untuk akun tanpa password

**File**: `apps/backend/src/auth/customer-auth.controller.ts`

### 3. **Database Seed**
Script baru dibuat untuk membuat customer demo:
**File**: `apps/backend/seed-demo-customer.js`

---

## 🚀 Kredensial Login

**Customer Portal**: http://localhost:3001

```
Email: customer@demo.com
Password: demo123
```

---

## 🧪 Testing

### Backend API Test:
```powershell
$body = @{ email = "customer@demo.com"; password = "demo123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:4000/auth/login/customer" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response**:
```json
{
  "message": "Login berhasil",
  "access_token": "eyJhbGci...",
  "customer": {
    "id": "...",
    "name": "Demo Customer",
    "email": "customer@demo.com",
    "phone": "08123456789",
    "address": "Jl. Demo No. 123, Jakarta",
    "status": "active"
  }
}
```

---

## 📝 Cara Menjalankan

### 1. Start Backend:
```powershell
cd D:\BillingByAudira\apps\backend
npm run dev
```

### 2. Start Customer Portal:
```powershell
cd D:\BillingByAudira\apps\customer-portal
npm run dev
```

### 3. Atau gunakan batch file:
```powershell
.\start-backend.bat
.\start-customer-portal.bat
```

---

## 🔍 Verifikasi

1. ✅ Backend endpoint `/auth/login/customer` working
2. ✅ Customer demo created di database
3. ✅ Password hashing bekerja dengan bcrypt
4. ✅ JWT token generation working
5. ✅ Frontend login form configured dengan kredensial yang benar

---

## 🛠️ Technical Details

### Password Hashing:
```javascript
const hashedPassword = await bcrypt.hash('demo123', 10);
// Saved to database: $2a$10$...
```

### Password Verification:
```typescript
const isPasswordValid = await bcrypt.compare(loginDto.password, customer.password);
```

### JWT Token Payload:
```typescript
{
  email: "customer@demo.com",
  sub: "customer-id",
  type: "customer",
  name: "Demo Customer",
  iat: timestamp,
  exp: timestamp + 7days
}
```

---

## 📊 Database Schema

Customer model sudah memiliki field:
- `email` (unique) - untuk login
- `password` (hashed) - bcrypt hash
- `name` - nama pelanggan
- `phone` - nomor telepon
- `address` - alamat
- `status` - active/inactive/suspended
- `internetNumber` - nomor internet (opsional)
- `ipAddress` - IP address modem (opsional)
- `installedModem` - jenis modem (opsional)
- `modemSerial` - serial modem (opsional)

---

## ⚠️ Troubleshooting

### Login Gagal - "Email atau password salah"
1. Pastikan backend running di port 4000
2. Pastikan customer sudah di-seed ke database
3. Gunakan kredensial yang benar: `customer@demo.com` / `demo123`

### Cannot Connect to Backend
1. Check backend running: `http://localhost:4000/health`
2. Check CORS settings di backend
3. Pastikan tidak ada firewall blocking port 4000

### Customer Portal Not Loading
1. Check customer portal running: `http://localhost:3001`
2. Clear browser cache and localStorage
3. Check console for errors

---

## 🎯 Status

**Login System**: ✅ **WORKING**  
**Last Tested**: December 2, 2025  
**Backend API**: ✅ Tested and verified  
**Customer Seeded**: ✅ customer@demo.com created  

---

## 📞 Next Steps

1. ✅ Login working - Test di browser
2. ⏳ Add more customer features:
   - View invoices
   - Payment history
   - Usage statistics
   - Modem status
   - Support tickets

3. ⏳ Production considerations:
   - Add email verification
   - Add password reset functionality
   - Add remember me feature
   - Add session management
   - Add rate limiting for login attempts

---

**Fix Complete!** 🎉  
Customer sekarang bisa login menggunakan `customer@demo.com` dan `demo123`.
