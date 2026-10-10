# Email Notification System

## Status
✅ **IMPLEMENTED**

## Overview
Sistem email terintegrasi untuk notifikasi billing dan pembayaran sebagai backup dari WhatsApp notification.

## Features Implemented

### 1. Email Service (`apps/backend/src/email/email.service.ts`)
- **SMTP Integration**: Support Gmail, Office365, dan SMTP server lainnya
- **HTML Templates**: Template email profesional dengan Handlebars
- **Fallback System**: Jika template tidak tersedia, gunakan simple HTML

### 2. Email Types

#### Invoice Email
- Dikirim otomatis saat invoice dibuat
- Detail: Nomor invoice, periode, jumlah tagihan, tanggal jatuh tempo
- Template: `templates/email/invoice.hbs`

#### Payment Confirmation Email
- Dikirim otomatis saat pembayaran berhasil
- Detail: Nomor invoice, jumlah, tanggal, metode pembayaran
- Template: `templates/email/payment-confirmation.hbs`

#### Payment Reminder Email
- Dikirim otomatis 3 hari, 1 hari, dan hari-H sebelum jatuh tempo
- Detail: Peringatan jatuh tempo, sisa hari
- Template: `templates/email/payment-reminder.hbs`

#### Welcome Email
- Dikirim saat customer baru didaftarkan
- Berisi: Username, password awal, link customer portal

#### Generic Email
- Untuk notifikasi custom/umum

## Configuration (.env)

```env
# Email (SMTP)
SMTP_HOST="smtp.gmail.com"          # Gmail SMTP
SMTP_PORT="587"                      # TLS port
SMTP_SECURE="false"                  # Use TLS (false) or SSL (true)
SMTP_USER="your-email@gmail.com"     # Email pengirim
SMTP_PASS="your-app-password"        # App password (bukan password email biasa)
SMTP_FROM="noreply@audiranet.com"    # Nama pengirim
```

### Setup Gmail App Password
1. Buka Google Account Settings
2. Security → 2-Step Verification (harus diaktifkan)
3. Security → App passwords
4. Generate app password untuk "Mail"
5. Copy password dan paste ke `SMTP_PASS`

### Alternative SMTP Providers
```env
# Office 365
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"

# Outlook
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"

# Yahoo
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"

# Custom SMTP
SMTP_HOST="mail.yourcompany.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourcompany.com"
```

## Integration Points

### 1. Billing Service
```typescript
// Auto-send email saat invoice dibuat
await this.emailService.sendInvoiceEmail({
  to: customer.email,
  customerName: customer.name,
  invoiceNumber,
  amount,
  dueDate: dueDate.toLocaleDateString('id-ID'),
  period: month,
});
```

### 2. Payment Service
```typescript
// Auto-send email saat pembayaran berhasil
await this.emailService.sendPaymentConfirmation({
  to: invoice.customer.email,
  customerName: invoice.customer.name,
  invoiceNumber: invoice.invoiceNumber,
  amount: invoice.amount,
  paymentDate: new Date().toLocaleDateString('id-ID'),
  paymentMethod: 'QRIS',
});
```

### 3. Billing Cron Service
```typescript
// Auto-send reminder 3 hari, 1 hari, dan hari-H
await this.emailService.sendPaymentReminder({
  to: invoice.customer.email,
  customerName: invoice.customer.name,
  invoiceNumber: invoice.invoiceNumber,
  amount: invoice.amount,
  dueDate: invoice.dueDate.toLocaleDateString('id-ID'),
  daysUntilDue: 3,
});
```

### 4. Payment Webhook
```typescript
// POST /payment/webhook/midtrans
// Otomatis terima notifikasi dari Midtrans
// Update invoice status dan kirim email konfirmasi
```

## Email Templates

### Template Structure
```
apps/backend/templates/email/
├── invoice.hbs              # Invoice notification
├── payment-confirmation.hbs # Payment success
└── payment-reminder.hbs     # Payment reminder
```

### Template Variables
```handlebars
{{customerName}}    - Nama customer
{{invoiceNumber}}   - Nomor invoice
{{amount}}          - Jumlah tagihan (formatted)
{{dueDate}}         - Tanggal jatuh tempo
{{period}}          - Periode tagihan
{{paymentDate}}     - Tanggal pembayaran
{{paymentMethod}}   - Metode pembayaran
{{daysUntilDue}}    - Sisa hari sampai jatuh tempo
{{portalUrl}}       - Link customer portal
```

## Testing

### Test Email Service
```bash
# Di backend
cd apps/backend
npm run start:dev
```

### Test Endpoint (via Postman/Thunder Client)
```bash
POST http://localhost:4000/payment/webhook/midtrans
Content-Type: application/json

{
  "order_id": "INV-INV-2024-0001-1234567890",
  "transaction_status": "settlement",
  "payment_type": "qris",
  "transaction_id": "TXN123456",
  "fraud_status": "accept"
}
```

## Error Handling

### Email Gagal Terkirim
- System tetap continue (tidak crash)
- Log error ke console
- Customer tetap terima WhatsApp notification sebagai fallback

### SMTP Connection Issues
```typescript
// Cek log di terminal backend
// Error contoh:
"Failed to send invoice email: connect ECONNREFUSED"
// Fix: Cek SMTP_HOST, SMTP_PORT, firewall
```

## Monitoring

### Email Logs
```bash
# Terminal backend akan show:
[EmailService] Invoice email sent to customer@example.com
[EmailService] Payment confirmation email sent to customer@example.com
[EmailService] Failed to send invoice email: Invalid credentials
```

## Production Checklist

- [ ] Setup SMTP credentials di `.env`
- [ ] Test kirim email invoice
- [ ] Test kirim email payment confirmation
- [ ] Test kirim email reminder
- [ ] Setup email quota/limits (Gmail: 500/day, Office365: 10,000/day)
- [ ] Monitor email delivery rate
- [ ] Setup SPF/DKIM records untuk production domain
- [ ] Consider email service provider (SendGrid, AWS SES, Mailgun)

## Future Enhancements

### Phase 2
- [ ] Email queue system (Bull/Redis)
- [ ] Email template editor di admin panel
- [ ] Email analytics (open rate, click rate)
- [ ] Attachable PDF invoice
- [ ] Multiple language support
- [ ] Email scheduling/delayed send
- [ ] Unsubscribe management

### Phase 3
- [ ] Advanced email service (SendGrid, AWS SES)
- [ ] Email tracking pixels
- [ ] A/B testing email templates
- [ ] Customer email preferences
- [ ] Rich email analytics dashboard

## API Endpoints

### Manual Email Trigger (untuk testing)
```typescript
// TODO: Tambahkan endpoint manual trigger
POST /email/test/invoice
POST /email/test/payment-confirmation
POST /email/test/reminder
```

## Dependencies
- `nodemailer`: ^6.9.0 - SMTP client
- `@types/nodemailer`: ^6.4.0 - TypeScript types
- `handlebars`: ^4.7.0 - Template engine

## Notes
- Email dikirim asynchronous (tidak blocking)
- Jika email gagal, customer masih dapat WhatsApp notification
- HTML templates fully responsive (mobile-friendly)
- Semua email include unsubscribe footer (for compliance)
