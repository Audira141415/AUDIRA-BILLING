# AudiraNET Mobile App

Mobile application untuk customer dan technician menggunakan React Native (Expo).

## Features

### Customer App
- ✅ Dashboard dengan usage stats
- ✅ Speed test integration
- ✅ Invoice management dengan QR payment
- ✅ Referral program tracking
- ✅ Live chat support
- ✅ Push notifications

### Technician App
- ✅ GPS navigation ke lokasi pelanggan
- ✅ Real-time job tracking
- ✅ Photo upload untuk proof of work
- ✅ Digital signature capture
- ✅ Work order management
- ✅ Map view dengan job markers

## Installation

```bash
cd apps/mobile
npm install
```

## Development

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Configuration

Edit `src/services/api.ts` untuk mengubah API URL:

```typescript
const API_URL = 'http://your-server-ip:4000';
```

## Build for Production

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## Permissions

App membutuhkan permissions:
- Location (GPS tracking untuk technician)
- Camera (foto pekerjaan)
- Media Library (upload foto)
- Notifications (push notifications)

## Dependencies

- React Navigation (routing)
- Expo Location (GPS)
- Expo Camera (camera access)
- Expo Image Picker (photo upload)
- React Native Maps (map view)
- Axios (API calls)
- AsyncStorage (local storage)
- Expo Notifications (push notifications)

## Screenshots

### Customer App
- Dashboard: Usage stats, quick actions, recent invoices
- Speed Test: Real-time speed testing
- Invoices: Payment with QR code
- Referral: Referral code sharing, stats

### Technician App
- Dashboard: Map view dengan job markers, today's jobs
- Job Detail: Photo upload, signature capture
- Navigation: Google Maps integration
