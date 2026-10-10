# 🚀 AudiraNET Deployment Checklist

## Pre-Deployment Steps

### 1. Database Migration ✓
```bash
cd apps/backend
npx prisma migrate dev --name add_field_service_notifications_analytics_tenant
npx prisma generate
```

### 2. Install Dependencies ✓
```bash
# Backend
cd apps/backend
npm install

# Frontend
cd apps/frontend  
npm install

# Mobile
cd apps/mobile
npm install
```

### 3. Environment Configuration ✓

**Create `apps/backend/.env`:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/audiranet"
JWT_SECRET="audiranet-secret-key-2024"
JWT_EXPIRES_IN="7d"

# Midtrans Payment
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION=false

# MikroTik
MIKROTIK_HOST="192.168.88.1"
MIKROTIK_USER="admin"
MIKROTIK_PASSWORD="password"
MIKROTIK_PORT=8728

# RADIUS
RADIUS_HOST="localhost"
RADIUS_SECRET="radius-secret"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# WhatsApp API (optional)
WHATSAPP_API_URL="https://api.whatsapp.com"
WHATSAPP_API_KEY="your-api-key"
```

**Create `apps/frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CUSTOMER_PORTAL_URL=http://localhost:3001
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-client-key"
```

**Create `apps/mobile/.env`:**
```env
API_URL=http://localhost:4000
EXPO_PROJECT_ID="your-expo-project-id"
```

### 4. Database Seeding (Optional) ✓
```bash
cd apps/backend
npx prisma db seed
```

---

## Run Applications

### Backend (Port 4000)
```bash
cd apps/backend
npm run start:dev
```

**Verify:**
- Health check: http://localhost:4000/health
- API docs: http://localhost:4000/api (if Swagger enabled)

### Frontend Admin (Port 3000)
```bash
cd apps/frontend
npm run dev
```

**Verify:**
- Admin portal: http://localhost:3000
- Login with default admin credentials

### Mobile App
```bash
cd apps/mobile
npx expo start
```

**Options:**
- Press `i` - Open iOS simulator
- Press `a` - Open Android emulator
- Scan QR code with Expo Go app

---

## Testing Checklist

### Backend API Testing

**Feature 1: Auto Provisioning PPPoE**
- [ ] POST /mikrotik/pppoe/add - Create PPPoE user
- [ ] GET /mikrotik/pppoe/status/:username - Check status
- [ ] POST /mikrotik/pppoe/remove - Remove user

**Feature 2: Payment Gateway**
- [ ] POST /keuangan/payment/create - Create payment
- [ ] POST /keuangan/payment/webhook - Webhook handler
- [ ] GET /keuangan/payment/:id - Get payment details

**Feature 3: Network Monitoring**
- [ ] Check cron job logs (bandwidth monitoring)
- [ ] Verify incident creation on downtime

**Feature 7: Field Service**
- [ ] POST /field-service/jobs - Create work order
- [ ] PUT /field-service/jobs/:id/assign - Assign technician
- [ ] POST /field-service/jobs/:id/photos - Upload photos
- [ ] GET /field-service/jobs/nearby?lat=&lon=&radius= - GPS query

**Feature 8: Notifications**
- [ ] POST /notification/register-token/:userId - Register push token
- [ ] POST /notification/push - Send notification

**Feature 9: Analytics**
- [ ] GET /analytics/revenue/report?period=monthly
- [ ] GET /analytics/revenue/forecast?days=30
- [ ] GET /analytics/customers/churn-risk

**Feature 10: Multi-Tenant**
- [ ] POST /tenant - Create franchise
- [ ] GET /tenant/:id/statistics - Franchise stats
- [ ] GET /tenant/:id/commission - Commission calculation
- [ ] PUT /tenant/:id/white-label - Update branding

### Frontend Testing

**Admin Portal (http://localhost:3000)**
- [ ] Login page works
- [ ] Dashboard displays statistics
- [ ] Pelanggan CRUD operations
- [ ] Paket management
- [ ] Keuangan page shows invoices
- [ ] Field Service dispatcher dashboard
- [ ] Technician interface (mobile-friendly)
- [ ] Analytics page with charts
- [ ] Franchise management page
- [ ] Navigation menu complete

**Customer Portal (http://localhost:3001)** - if implemented
- [ ] Customer login
- [ ] Dashboard with usage stats
- [ ] Invoice download (PDF)
- [ ] Speed test
- [ ] Referral code sharing
- [ ] Loyalty points display

### Mobile App Testing

**iOS Simulator:**
```bash
cd apps/mobile
npx expo start --ios
```

**Android Emulator:**
```bash
cd apps/mobile
npx expo start --android
```

**Customer App:**
- [ ] Login/Register works
- [ ] Dashboard displays correctly
- [ ] Usage tracking shows data
- [ ] Invoice list loads
- [ ] Payment navigation works
- [ ] Push notifications received

**Technician App:**
- [ ] Login works (technician role)
- [ ] Job list displays today's jobs
- [ ] GPS navigation opens Google Maps
- [ ] Camera upload works
- [ ] Signature capture works
- [ ] Job status updates successfully

### Integration Testing

**End-to-End Flow:**
1. [ ] Create customer → Assign package → Generate invoice
2. [ ] Customer pays via mobile app → Payment webhook → Service activated
3. [ ] Auto provision PPPoE → Customer internet active
4. [ ] Create work order → Assign technician → Technician completes with photo
5. [ ] Customer rates service → Rating saved
6. [ ] Analytics dashboard shows updated revenue
7. [ ] Create franchise → Add customers to franchise → Calculate commission

---

## Performance Testing

### Database
- [ ] Query performance on large datasets (10,000+ customers)
- [ ] Index usage verification (EXPLAIN ANALYZE)
- [ ] Connection pooling configured

### API
- [ ] Response time < 200ms for most endpoints
- [ ] Load testing with 100 concurrent users
- [ ] Rate limiting works

### Frontend
- [ ] Page load time < 2 seconds
- [ ] Charts render smoothly with 12 months data
- [ ] Mobile responsive on all screen sizes

---

## Security Checklist

### Backend
- [ ] JWT authentication works
- [ ] Password hashing with bcrypt
- [ ] CORS configured properly
- [ ] SQL injection protected (Prisma ORM)
- [ ] XSS protection enabled
- [ ] Rate limiting implemented
- [ ] Helmet.js security headers
- [ ] Environment variables not exposed

### Frontend
- [ ] API keys not in client code
- [ ] HTTPS in production
- [ ] CSP headers configured
- [ ] Secure cookies (httpOnly)

### Mobile
- [ ] API calls use HTTPS
- [ ] Tokens stored securely (AsyncStorage encrypted)
- [ ] No sensitive data in logs

### Multi-Tenant
- [ ] Row-level security (tenantId filter)
- [ ] Tenant isolation verified (cannot access other tenant data)
- [ ] Super admin role restrictions

---

## Monitoring & Logging

### Setup Monitoring
- [ ] Backend health endpoint: /health
- [ ] Error logging (winston or similar)
- [ ] Database monitoring (Prisma Studio)
- [ ] Mobile crash reporting (Sentry - optional)

### Alerts
- [ ] Email alerts on critical errors
- [ ] WhatsApp alerts on network downtime
- [ ] Push notifications for technician assignments

---

## Documentation

### API Documentation
- [ ] Swagger/OpenAPI setup: http://localhost:4000/api
- [ ] Postman collection exported
- [ ] API authentication guide

### User Guides
- [ ] Admin user manual
- [ ] Customer portal guide
- [ ] Technician mobile app guide
- [ ] Franchise onboarding manual

---

## Production Deployment (Future)

### Infrastructure
- [ ] Docker images built
- [ ] docker-compose.yml configured
- [ ] Nginx reverse proxy setup
- [ ] SSL certificates (Let's Encrypt)
- [ ] Domain configuration

### Database
- [ ] PostgreSQL production instance
- [ ] Automated backups (daily)
- [ ] Disaster recovery plan

### CI/CD
- [ ] GitHub Actions pipeline
- [ ] Automated testing
- [ ] Staging environment
- [ ] Production deployment

### Scaling
- [ ] Load balancer (Nginx/HAProxy)
- [ ] Redis cache for analytics
- [ ] CDN for static assets
- [ ] Database read replicas

---

## Post-Deployment

### Monitoring
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (New Relic/DataDog)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)

### Maintenance
- [ ] Weekly database backups verified
- [ ] Monthly security updates
- [ ] Quarterly dependency updates
- [ ] Annual penetration testing

---

## Quick Commands Reference

### Development
```bash
# Start all services
cd apps/backend && npm run start:dev &
cd apps/frontend && npm run dev &
cd apps/mobile && npx expo start

# Database
npx prisma studio                 # View database
npx prisma migrate dev            # Run migration
npx prisma db seed                # Seed data

# Mobile
npx expo start                    # Start dev server
npx expo start --ios              # iOS simulator
npx expo start --android          # Android emulator
npx expo doctor                   # Check setup

# Build
cd apps/backend && npm run build
cd apps/frontend && npm run build
cd apps/mobile && npx expo build:ios
cd apps/mobile && npx expo build:android
```

### Production
```bash
# Backend
pnpm run start:prod

# Frontend
npm run build
npm run start

# Mobile
npx expo publish
```

---

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Run `npx prisma generate`

**Frontend can't connect to API:**
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify backend is running on port 4000
- Check CORS configuration

**Mobile app errors:**
- Clear Expo cache: `npx expo start -c`
- Reinstall node_modules: `rm -rf node_modules && npm install`
- Check API_URL in .env

**Database migration errors:**
- Reset database: `npx prisma migrate reset`
- Generate client: `npx prisma generate`

**Push notifications not working:**
- Verify Expo project ID
- Check pushToken saved in database
- Test with `/notification/trigger/:userId`

---

## Support Contacts

**Technical Support:**
- Backend issues: [backend-team@audiranet.com]
- Frontend issues: [frontend-team@audiranet.com]
- Mobile issues: [mobile-team@audiranet.com]

**Business Support:**
- Sales: [sales@audiranet.com]
- Franchise: [franchise@audiranet.com]

---

## ✅ Final Verification

Before going live, verify:
- [ ] All 87 API endpoints working
- [ ] All 10 features tested
- [ ] Mobile app published to stores (iOS/Android)
- [ ] Database backed up
- [ ] Monitoring alerts configured
- [ ] Documentation complete
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] User training completed

---

**Status:** Ready for testing and deployment! 🚀

*Last Updated: January 2024*
