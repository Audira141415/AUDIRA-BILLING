# QRIS Payment Integration

## Status
✅ **IMPLEMENTED**

## Overview
Integrasi pembayaran QRIS melalui Midtrans untuk memudahkan customer membayar tagihan menggunakan e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja, dll).

## Features Implemented

### 1. Backend API (`apps/backend/src/billing`)

#### Payment Gateway Service
- **`createQRISPayment()`**: Generate QRIS QR Code untuk pembayaran
- **`createVAPayment()`**: Generate Virtual Account (BCA, BNI, BRI, Permata)
- **`checkStatus()`**: Cek status pembayaran real-time

#### Billing Controller Endpoints
```typescript
POST /billing/create-qris-payment
Body: { invoiceId: string }
Response: {
  success: boolean,
  orderId: string,
  qrString: string,      // QR Code string untuk di-scan
  expiryTime: string,    // Waktu kadaluarsa
  transactionStatus: string
}

POST /billing/create-va-payment
Body: { invoiceId: string, bank: 'bca' | 'bni' | 'bri' | 'permata' }
Response: {
  success: boolean,
  orderId: string,
  vaNumber: string,      // Nomor Virtual Account
  bank: string,
  expiryTime: string
}

GET /billing/payment-status/:orderId
Response: {
  transaction_status: 'pending' | 'settlement' | 'cancel' | 'expire',
  payment_type: string,
  transaction_id: string
}
```

### 2. Frontend Component (`apps/customer-portal/src/components/QRISPayment.tsx`)

#### Features
- ✅ Auto-generate QR Code dari QRIS string
- ✅ Display amount dengan format Rupiah
- ✅ Auto-check payment status setiap 5 detik
- ✅ Instruksi pembayaran step-by-step
- ✅ Support semua e-wallet QRIS
- ✅ Countdown expiry time
- ✅ Refresh QR Code button
- ✅ Cancel payment option

#### Props Interface
```typescript
interface QRISPaymentProps {
  invoiceId: string;
  amount: number;
  onSuccess?: () => void;  // Callback saat payment berhasil
  onCancel?: () => void;   // Callback saat payment dibatalkan
}
```

## How It Works

### Payment Flow
```
1. Customer klik "Bayar dengan QRIS"
   ↓
2. Frontend call POST /billing/create-qris-payment
   ↓
3. Backend request ke Midtrans API
   ↓
4. Midtrans return QR Code string + order ID
   ↓
5. Frontend generate QR Code image dari string
   ↓
6. Customer scan QR dengan e-wallet app
   ↓
7. Frontend auto-check status setiap 5 detik
   ↓
8. Midtrans kirim webhook ke /billing/webhook/midtrans
   ↓
9. Backend update invoice status → PAID
   ↓
10. Backend send email confirmation
   ↓
11. Frontend detect status = settlement → onSuccess()
```

### Status Checking
- **Interval**: 5 seconds
- **Timeout**: 15 minutes (auto-stop)
- **Statuses**: 
  - `pending` → Menunggu pembayaran
  - `settlement` → Pembayaran berhasil
  - `cancel` → Dibatalkan
  - `expire` → Kadaluarsa

## Midtrans Configuration

### Setup Midtrans Account
1. Daftar di https://dashboard.midtrans.com
2. Pilih mode **Sandbox** untuk testing
3. Get Server Key dan Client Key
4. Set di `.env`:
```env
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION="false"
```

### Testing with Sandbox
Midtrans Sandbox menyediakan QR Code dummy untuk testing:
- Scan QR akan langsung berhasil (tanpa butuh saldo e-wallet)
- Webhook notification otomatis dikirim
- Perfect untuk development & testing

### Production Setup
```env
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="your-production-server-key"
MIDTRANS_CLIENT_KEY="your-production-client-key"
```

## Webhook Configuration

### Midtrans Dashboard Setup
1. Login ke https://dashboard.midtrans.com
2. Settings → Configuration
3. Payment Notification URL:
   ```
   https://your-domain.com/billing/webhook/midtrans
   ```
4. Enable **HTTP notification**

### Webhook Payload
```json
{
  "order_id": "invoice-uuid",
  "transaction_status": "settlement",
  "payment_type": "qris",
  "transaction_id": "midtrans-transaction-id",
  "fraud_status": "accept",
  "gross_amount": "300000"
}
```

## Usage Example

### Customer Portal Integration
```tsx
import QRISPayment from '@/components/QRISPayment';

function InvoiceDetailPage({ invoice }) {
  const [showQRIS, setShowQRIS] = useState(false);

  const handlePaymentSuccess = () => {
    alert('Pembayaran berhasil!');
    // Refresh invoice data
    router.reload();
  };

  return (
    <div>
      {showQRIS ? (
        <QRISPayment
          invoiceId={invoice.id}
          amount={invoice.amount}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowQRIS(false)}
        />
      ) : (
        <button onClick={() => setShowQRIS(true)}>
          Bayar dengan QRIS
        </button>
      )}
    </div>
  );
}
```

### Admin Frontend (Manual Trigger)
```tsx
const handleCreateQRIS = async (invoiceId: string) => {
  try {
    const response = await axios.post(
      'http://localhost:4000/billing/create-qris-payment',
      { invoiceId }
    );
    
    console.log('QR String:', response.data.qrString);
    console.log('Expiry:', response.data.expiryTime);
  } catch (error) {
    console.error('Failed to create QRIS:', error);
  }
};
```

## Supported E-Wallets
- ✅ GoPay
- ✅ OVO
- ✅ DANA
- ✅ ShopeePay
- ✅ LinkAja
- ✅ Bank apps with QRIS support

## Virtual Account Support
Selain QRIS, juga support VA:
```typescript
// BCA Virtual Account
POST /billing/create-va-payment
{ invoiceId, bank: 'bca' }

// BNI Virtual Account
POST /billing/create-va-payment
{ invoiceId, bank: 'bni' }

// BRI Virtual Account
POST /billing/create-va-payment
{ invoiceId, bank: 'bri' }

// Permata Virtual Account
POST /billing/create-va-payment
{ invoiceId, bank: 'permata' }
```

## Error Handling

### Common Errors
```typescript
// Midtrans not configured
{
  success: false,
  message: 'Payment gateway not configured'
}

// Invoice not found
{
  success: false,
  message: 'Invoice not found'
}

// Invalid bank (VA only)
{
  success: false,
  message: 'Invalid bank. Supported: BCA, BNI, BRI, Permata'
}
```

### Frontend Error Display
Component automatically handles:
- Loading state (spinner)
- Error state (red alert with retry button)
- Success state (auto-redirect via callback)
- Expired state (expired message)

## Testing Checklist

### Backend Testing
- [ ] POST /billing/create-qris-payment returns qrString
- [ ] POST /billing/create-va-payment returns vaNumber
- [ ] GET /billing/payment-status/:orderId returns status
- [ ] Webhook /billing/webhook/midtrans updates invoice
- [ ] Email confirmation sent after payment success

### Frontend Testing
- [ ] QR Code displays correctly
- [ ] Amount formatted as Rupiah
- [ ] Status auto-updates every 5 seconds
- [ ] onSuccess callback triggered when paid
- [ ] Refresh QR button works
- [ ] Cancel button works
- [ ] Expiry time displays correctly

### Integration Testing
1. Create invoice via admin
2. Customer open invoice detail
3. Click "Bayar dengan QRIS"
4. Scan QR with e-wallet (sandbox)
5. Verify status updates to "settlement"
6. Verify invoice marked as PAID
7. Verify email confirmation sent

## Production Checklist

- [ ] Midtrans production keys configured
- [ ] Webhook URL configured in Midtrans dashboard
- [ ] SSL certificate installed (HTTPS required)
- [ ] Test with real e-wallet in production mode
- [ ] Monitor webhook logs
- [ ] Setup payment reconciliation report
- [ ] Configure QR code expiry time (default 24 hours)

## Future Enhancements

### Phase 2
- [ ] Save QR code to database for re-display
- [ ] Push notification when payment received
- [ ] Payment history with QR archive
- [ ] Bulk invoice payment with single QR
- [ ] Custom expiry time per invoice

### Phase 3
- [ ] Alternative payment: Credit Card
- [ ] Alternative payment: Alfamart/Indomaret
- [ ] Alternative payment: PayLater (Kredivo, Akulaku)
- [ ] Auto-retry failed transactions
- [ ] Payment analytics dashboard

## Dependencies
- `midtrans-client`: ^1.4.3 - Midtrans SDK
- `qrcode`: ^1.5.3 - QR Code generator
- `@types/qrcode`: ^1.5.5 - TypeScript types
- `axios`: ^1.6.2 - HTTP client

## Notes
- QR Code valid for 15 minutes (configurable)
- Status checking stops after 15 minutes
- Webhook is primary source of payment confirmation
- Status polling is backup mechanism
- All QRIS transactions go through Midtrans
- Commission: ~0.7% per transaction (Midtrans)
