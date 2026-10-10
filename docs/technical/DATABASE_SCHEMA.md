# AudiraBilling - Database Schema Documentation

## 📊 Overview
Complete database schema untuk 6 fitur prioritas tinggi AudiraBilling ISP Management System.

---

## 🏗️ Database Structure

### **Total Tables: 40+**

## 1️⃣ Customer Self-Service Portal (5 Tables)

### `customer_portal_access`
Portal login untuk pelanggan
- `username` - Login username (unique)
- `password` - Hashed password
- `lastLogin` - Track aktivitas login
- `loginCount` - Jumlah login

### `customer_notifications`
Notifikasi untuk pelanggan
- `type` - invoice, payment, ticket, promo, maintenance
- `channel` - email, whatsapp, sms, push
- `isRead` - Status baca
- `sentAt`, `readAt` - Timestamp tracking

### Enhanced `customers`
Extended dengan:
- `customerType` - residential, corporate, government
- `customerSegment` - vip, regular, trial
- `virtualAccount` - VA number unik per customer
- `qrisUrl` - QRIS dynamic per customer
- `autoSuspendDate` - Auto-suspend jika telat bayar

---

## 2️⃣ Automated Billing Engine (4 Tables)

### `invoices`
Invoice otomatis dengan pro-rata billing
- `invoiceNumber` - Unique invoice number
- `periodStart`, `periodEnd` - Billing period
- `dueDate`, `paidDate` - Payment tracking
- `subtotal`, `discount`, `tax`, `amount` - Calculation
- `isProratedBilling` - Flag untuk pro-rata

### `invoice_items`
Line items per invoice
- `description`, `quantity`, `unitPrice`
- `serviceId`, `packageId` - Link ke service

### `billing_reminders`
Automated reminder system
- `reminderType` - before_due_7, before_due_3, on_due_date, after_due_3
- `channel` - email, whatsapp, sms
- `status` - sent, failed, pending

### `billing_schedules`
Konfigurasi billing automation
- `dayOfMonth` - Tanggal billing (1-28)
- `dueDays` - Hari jatuh tempo setelah billing
- `autoGenerate`, `autoSuspend` - Automation flags
- `suspendAfterDays` - Grace period sebelum suspend

---

## 3️⃣ Payment Gateway Integration (4 Tables)

### `payments`
Payment transactions dengan gateway integration
- `method` - bank_transfer, qris, ewallet, credit_card, cash
- `provider` - midtrans, xendit, manual
- `externalId` - Transaction ID dari payment gateway
- `vaNumber`, `qrisUrl`, `paymentUrl` - Payment methods
- `isReconciled` - Auto-reconciliation flag
- `metadata` - Raw callback data (JSON)

### `payment_callbacks`
Webhook callbacks dari payment gateway
- `provider`, `externalId`, `event`
- `rawData` - Full payload (JSON)
- `isProcessed` - Processing status

### `payment_gateway_configs`
Konfigurasi payment providers
- `provider` - midtrans, xendit
- `apiKey`, `secretKey`, `merchantId`
- `callbackUrl`, `webhookUrl`

---

## 4️⃣ WhatsApp Business Integration (4 Tables)

### `whatsapp_configs`
WhatsApp provider configuration
- `provider` - wablas, fonnte, whapi
- `apiKey`, `phoneNumber`
- `webhookUrl` - Incoming message webhook

### `whatsapp_messages`
Sent messages tracking
- `type` - text, image, document
- `status` - pending, sent, delivered, read, failed
- `sentAt`, `deliveredAt`, `readAt` - Delivery tracking

### `whatsapp_templates`
Message templates dengan variables
- `category` - billing, support, promo, maintenance
- `variables` - [customer_name, invoice_number, amount]

### `whatsapp_broadcasts`
Bulk WhatsApp messaging
- `targetSegment` - all, vip, regular, overdue
- `totalRecipients`, `sentCount`, `failedCount`
- `status` - draft, scheduled, sending, completed

---

## 5️⃣ Network Monitoring Dashboard (5 Tables)

### `device_monitoring`
Real-time device metrics
- `cpuUsage`, `memoryUsage`, `diskUsage`, `temperature`
- `bandwidth` - JSON: { rx, tx }
- `uptime`, `latency`, `packetLoss`
- `isOnline` - Status online/offline

### `bandwidth_usage`
Customer bandwidth tracking
- `downloadBytes`, `uploadBytes`, `totalBytes` (BigInt)
- `peakDownload`, `peakUpload` - Peak speeds (Mbps)
- `sessionCount` - Daily sessions
- `date` - For daily aggregation

### `network_alerts`
Automated alerting system
- `alertType` - device_down, high_cpu, high_bandwidth, port_down
- `severity` - critical, warning, info
- `isResolved`, `resolvedAt` - Resolution tracking
- `notifiedUsers` - Array of user IDs

### `network_topologies`
Network visualization data
- `nodes` - JSON: devices with positions
- `edges` - JSON: connections between devices

---

## 6️⃣ Advanced CRM (8 Tables)

### `leads`
Sales pipeline management
- `source` - website, referral, canvassing, social_media
- `status` - new, contacted, qualified, proposal, won, lost
- `interestedPackage`, `budget`
- `assignedTo` - Sales/Marketing user
- `convertedToCustomer` - Conversion flag

### `lead_activities`
Lead interaction tracking
- `activityType` - call, email, meeting, note
- `performedBy` - User ID
- `performedAt` - Timestamp

### `customer_journeys`
Customer lifecycle tracking
- `stage` - lead, trial, active, churned
- `event` - signup, first_payment, upgrade, downgrade, churn

### `churn_predictions`
AI-powered churn prediction
- `riskScore` - 0-1 (0 = low risk, 1 = high risk)
- `riskLevel` - low, medium, high
- `factors` - JSON: contributing factors
- `recommendations` - JSON: suggested actions

### `marketing_campaigns`
Campaign management
- `type` - email, whatsapp, sms, mixed
- `targetSegment` - all, vip, regular, trial, churned
- `totalTargets`, `sentCount`, `deliveredCount`, `openedCount`, `clickedCount`

### `loyalty_points`
Customer loyalty program
- `points`, `type` - earn, redeem, expire
- `reason` - on_time_payment, referral, birthday
- `expiresAt` - Point expiration

### `referrals`
Referral program tracking
- `referrerId`, `referredId` - Customer relationships
- `status` - pending, converted, rewarded
- `rewardAmount`, `rewardedAt`

---

## 🔧 Enhanced Existing Tables

### `tickets` (Enhanced)
- Added: `category`, `resolvedAt`, `closedAt`
- New relations: `comments`, `attachments`

### `ticket_comments`
- Customer & technician communication
- `userType` - customer, technician, admin

### `ticket_attachments`
- File uploads (images, documents)
- `fileName`, `fileUrl`, `fileType`, `fileSize`

### `technicians` (Enhanced)
- Added: `rating`, `completedTickets`
- New relation: `locations` (GPS tracking)

### `technician_locations`
- Real-time GPS tracking
- `latitude`, `longitude`, `accuracy`

---

## 📈 Key Features

### Indexing Strategy
- Customer-centric: `customerId` indexed on most tables
- Status fields: For quick filtering
- Timestamp fields: For date-range queries
- External IDs: For payment gateway lookups

### Data Types
- **BigInt** for bandwidth (support TB+ usage)
- **Json** for flexible metadata storage
- **Float** for metrics (CPU, memory, scores)
- **DateTime** with timezone support

### Relationships
- **Cascade deletes** for dependent data
- **Set null** for optional relations
- **One-to-many** for hierarchical data
- **Many-to-many** via join tables

### Business Logic Support
- **Pro-rata billing** calculation
- **Auto-suspension** workflow
- **Churn prediction** analytics
- **Multi-channel** notifications
- **Real-time monitoring** metrics

---

## 🚀 Migration Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_priority_features

# Apply migration
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Studio (GUI)
npx prisma studio
```

---

## 📊 Estimated Storage

**Per 1000 customers/year:**
- Invoices: ~12,000 rows (~2 MB)
- Payments: ~12,000 rows (~3 MB)
- Bandwidth Usage: ~365,000 rows (~50 MB)
- Device Monitoring: ~8,760,000 rows (hourly) (~1.5 GB)
- Notifications: ~48,000 rows (~5 MB)
- WhatsApp Messages: ~144,000 rows (~20 MB)

**Total: ~1.6 GB/year per 1000 customers**

---

## 🔐 Security Considerations

1. **Password Hashing**: bcrypt/argon2 untuk passwords
2. **API Keys**: Encrypted at rest
3. **PII Data**: GDPR-compliant with soft deletes
4. **Audit Logs**: Track all critical operations
5. **Role-Based Access**: Via User model + middleware

---

## 📝 Next Steps

1. ✅ Schema design (DONE)
2. ⏳ Generate migration files
3. ⏳ Create seed data
4. ⏳ Build API endpoints (NestJS)
5. ⏳ Implement frontend UI (Next.js)
6. ⏳ Integration testing

---

**Last Updated**: November 30, 2025
**Version**: 1.0.0
**Database**: PostgreSQL 14+
