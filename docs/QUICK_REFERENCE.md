# 🚀 Quick Reference - AudiraNET

**Panduan cepat untuk navigasi project yang sudah dibersihkan**

---

## ⚡ Quick Commands

### Development Commands
```bash
# Start ALL services (Docker + Backend + Frontend)
# Automatically starts Docker Desktop if not running!
start-all.bat

# Stop ALL services (includes Docker containers)
stop-all.bat

# Setup pertama kali (install + database)
setup.bat

# Quick start (alternative)
quick-start.bat
```

### What start-all.bat Does:
1. ✅ Checks & starts Docker Desktop
2. ✅ Starts PostgreSQL database (docker-compose up)
3. ✅ Checks & installs dependencies
4. ✅ Generates Prisma Client
5. ✅ Runs database migrations
6. ✅ Starts Backend & Frontend servers

**One command = Everything ready!** 🚀

### NPM Scripts (Root)
```bash
# Development mode (parallel)
pnpm dev

# Build all apps
pnpm build

# Start production
pnpm start

# Lint all apps
pnpm lint
```

---

## 📂 Project Structure

```
AudiraNET/
├── 📂 apps/
│   ├── backend/           # http://localhost:4000
│   ├── frontend/          # http://localhost:3000
│   ├── customer-portal/   # http://localhost:3001
│   └── mobile/            # Expo app
│
├── 📂 docs/
│   ├── deployment/        # Deployment guides
│   ├── technical/         # Technical docs
│   ├── implementation/    # Implementation status
│   └── fixes/             # Troubleshooting
│
└── 🔧 Scripts (.bat)
    ├── setup.bat          # First time setup
    ├── start-all.bat      # Start all
    ├── stop-all.bat       # Stop all
    └── quick-start.bat    # Quick start
```

---

## 📖 Documentation Map

### 🚀 Getting Started
| File | Description |
|------|-------------|
| `README.md` | Main overview & tech stack |
| `QUICK_START.md` | Quick start guide |
| `PROJECT_STRUCTURE.md` | Project structure overview |
| `CLEANUP_REPORT.md` | What was cleaned up |

### 📦 Deployment
| File | Location | Description |
|------|----------|-------------|
| Deployment Guide | `docs/deployment/DEPLOYMENT_GUIDE.md` | Complete deployment |
| Deployment Checklist | `docs/deployment/DEPLOYMENT_CHECKLIST.md` | Pre-deploy checklist |
| Production Checklist | `docs/deployment/PRODUCTION_CHECKLIST.md` | Production ready |
| New PC Setup | `docs/deployment/QUICK_START_NEW_PC.md` | Setup on new PC |
| Copy Checklist | `docs/deployment/COPY_CHECKLIST.md` | Files to copy |

### 🔧 Technical
| File | Location | Description |
|------|----------|-------------|
| Database Schema | `docs/technical/DATABASE_SCHEMA.md` | DB structure |
| Email System | `docs/technical/EMAIL_SYSTEM.md` | Email config |
| Logging System | `docs/technical/LOGGING_SYSTEM.md` | Logging setup |
| Backup System | `docs/technical/BACKUP_SYSTEM.md` | Backup config |
| Monitoring | `docs/technical/MONITORING_SETUP.md` | Monitoring setup |
| RADIUS Setup | `docs/technical/RADIUS_SETUP.md` | RADIUS config |
| QRIS Payment | `docs/technical/QRIS_PAYMENT.md` | Payment integration |

### 💡 Implementation
| File | Location | Description |
|------|----------|-------------|
| Implementation Status | `docs/implementation/IMPLEMENTATION_STATUS.md` | Current status |
| Implementation Summary | `docs/implementation/IMPLEMENTATION_SUMMARY.md` | Complete summary |
| ISP Features | `docs/implementation/ISP_FEATURES.md` | ISP features |
| Customer Portal | `docs/implementation/CUSTOMER_PORTAL_FEATURES.md` | Portal features |
| Advanced Features | `docs/implementation/ADVANCED_FEATURES_STATUS.md` | Advanced status |

### 🔨 Troubleshooting
| File | Location | Description |
|------|----------|-------------|
| Database Error | `docs/fixes/FIX_DATABASE_ERROR.md` | Fix DB errors |
| Menu Hilang | `docs/fixes/FIX_MENU_HILANG.md` | Fix missing menu |
| Customer Login | `docs/fixes/CUSTOMER_LOGIN_FIX.md` | Fix login issues |
| Login Kosong | `docs/fixes/SOLUSI_LOGIN_KOSONG.md` | Fix blank login |
| Fix Summary | `docs/fixes/FIX_SUMMARY.md` | All fixes |

---

## 🎯 Common Tasks

### Starting Development
1. First time: `setup.bat`
2. Daily: `start-all.bat` (starts everything including Docker!)
3. Stop: `stop-all.bat` (stops everything including Docker)

**No need to manually start Docker anymore!** 🎉

### Accessing Apps
- Admin Portal: http://localhost:3000
- Backend API: http://localhost:4000
- Customer Portal: http://localhost:3001
- API Health: http://localhost:4000/health
- Database: localhost:5433 (PostgreSQL)

### Database Tasks
```bash
cd apps\backend

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database
npx ts-node prisma/seed.ts

# Open Prisma Studio
npx prisma studio
```

### Troubleshooting
1. Check logs in terminal
2. See `docs/fixes/` folder
3. Verify environment variables in `.env`
4. Check database connection

---

## 🔍 Quick Find

### Need to...
- **Deploy to production?** → `docs/deployment/DEPLOYMENT_GUIDE.md`
- **Setup on new PC?** → `docs/deployment/QUICK_START_NEW_PC.md`
- **Fix an error?** → `docs/fixes/`
- **Understand features?** → `FEATURES.md`
- **See implementation?** → `docs/implementation/`
- **Configure technical stuff?** → `docs/technical/`
- **Understand structure?** → `PROJECT_STRUCTURE.md`

---

## 🎯 Essential Files

### Root Level (Must Know)
1. `README.md` - Start here
2. `QUICK_START.md` - Quick start
3. `start-all.bat` - Start everything
4. `stop-all.bat` - Stop everything

### Documentation Index
1. `docs/INDEX.md` - Documentation index
2. `docs/README.md` - Docs overview

### Scripts
1. `setup.bat` - First time setup
2. `start-all.bat` - Start all services
3. `stop-all.bat` - Stop all services
4. `quick-start.bat` - Quick start

---

## 💡 Tips

### Development
- Use `pnpm dev` untuk start semua apps sekaligus
- Port 4000 (backend), 3000 (admin), 3001 (customer)
- Check terminal logs untuk debugging

### Documentation
- Mulai dari `docs/INDEX.md`
- Gunakan Ctrl+F untuk cari dokumentasi
- Semua docs organized by category

### Batch Scripts
- Hanya ada 4 main scripts (simple)
- Run from root directory
- Check output untuk status

---

## 📞 Need Help?

1. Check `QUICK_START.md`
2. See `docs/fixes/` for common issues
3. Review `PROJECT_STRUCTURE.md`
4. Contact team

---

<div align="center">

**📚 [Full Documentation Index](./docs/INDEX.md)**

**Last Updated:** December 11, 2025

</div>
