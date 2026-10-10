# 🔐 Cara Menggunakan JWT Auth Guards

## Implementasi di Controller

### 1. Import Guards dan Decorators

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
```

### 2. Apply Guards ke Seluruh Controller

```typescript
@Controller('pelanggan')
@UseGuards(JwtAuthGuard, RolesGuard)  // Semua endpoints butuh auth
export class PelangganController {
  // ...
}
```

### 3. Apply Guards ke Specific Endpoints

```typescript
@Controller('public')
export class PublicController {
  
  // Endpoint public (tidak butuh auth)
  @Get('packages')
  async getPublicPackages() {
    return this.packagesService.findAll();
  }
  
  // Endpoint protected
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user; // { userId, email, role, name }
  }
}
```

### 4. Gunakan Role-Based Access Control

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  // Hanya admin yang bisa akses
  @Get('dashboard')
  @Roles('admin')
  async getDashboard() {
    return { ... };
  }
  
  // Admin atau billing staff bisa akses
  @Get('customers')
  @Roles('admin', 'BILLING')
  async getCustomers() {
    return { ... };
  }
  
  // Semua authenticated user bisa akses
  @Get('settings')
  async getSettings() {
    return { ... };
  }
}
```

### 5. Akses User Info di Handler

```typescript
import { Request } from '@nestjs/common';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  
  @Get('profile')
  async getProfile(@Request() req) {
    const user = req.user;
    // user = { userId, email, role, name, tenantId }
    
    return {
      id: user.userId,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
  
  @Get('invoices')
  async getUserInvoices(@Request() req) {
    const customerId = req.user.userId;
    return this.invoicesService.findByCustomer(customerId);
  }
}
```

## Contoh Implementasi Per Module

### ✅ Pelanggan/Customer Controller

```typescript
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PelangganService } from './pelanggan.service';

@Controller('pelanggan')
@UseGuards(JwtAuthGuard, RolesGuard)  // All endpoints require authentication
export class PelangganController {
  constructor(private readonly pelangganService: PelangganService) {}

  @Get()
  @Roles('admin', 'BILLING')  // Only admin and billing staff
  async findAll() {
    return this.pelangganService.findAll();
  }

  @Get('stats')
  @Roles('admin', 'BILLING')
  async getStats() {
    return this.pelangganService.getStats();
  }

  @Get(':id')
  @Roles('admin', 'BILLING', 'CUSTOMER')  // Customer can view their own
  async findOne(@Param('id') id: string, @Request() req) {
    // If customer, verify they're accessing their own data
    if (req.user.role === 'CUSTOMER' && req.user.userId !== id) {
      throw new ForbiddenException('Anda hanya bisa melihat data Anda sendiri');
    }
    return this.pelangganService.findOne(id);
  }

  @Post()
  @Roles('admin', 'BILLING')  // Only admin and billing can create
  async create(@Body() data: any) {
    return this.pelangganService.create(data);
  }

  @Put(':id')
  @Roles('admin', 'BILLING')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.pelangganService.update(id, data);
  }

  @Delete(':id')
  @Roles('admin')  // Only admin can delete
  async remove(@Param('id') id: string) {
    return this.pelangganService.remove(id);
  }
}
```

### ✅ Payment Controller

```typescript
import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @Roles('admin', 'BILLING', 'CUSTOMER')  // Customer can pay their own invoice
  async createPayment(@Body() data: any, @Request() req) {
    // If customer, verify they're paying their own invoice
    if (req.user.role === 'CUSTOMER' && req.user.userId !== data.customerId) {
      throw new ForbiddenException('Anda hanya bisa membayar invoice Anda sendiri');
    }
    return this.paymentService.createPayment(data);
  }

  @Get('status/:orderId')
  async checkStatus(@Param('orderId') orderId: string, @Request() req) {
    // Verify payment belongs to user if customer
    const payment = await this.paymentService.checkPaymentStatus(orderId);
    if (req.user.role === 'CUSTOMER' && payment.customerId !== req.user.userId) {
      throw new ForbiddenException('Akses ditolak');
    }
    return payment;
  }

  @Post('cancel/:orderId')
  @Roles('admin', 'BILLING')  // Only admin/billing can cancel
  async cancelPayment(@Param('orderId') orderId: string) {
    return this.paymentService.cancelPayment(orderId);
  }

  @Post('refund/:orderId')
  @Roles('admin')  // Only admin can refund
  async refundPayment(@Param('orderId') orderId: string, @Body() data: any) {
    return this.paymentService.refundPayment(orderId, data.amount);
  }
}
```

### ✅ Analytics Controller

```typescript
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  
  @Get('dashboard')
  @Roles('admin', 'BILLING')
  async getDashboard() {
    return this.analyticsService.getDashboardStats();
  }
  
  @Get('revenue')
  @Roles('admin')  // Only admin sees revenue
  async getRevenue() {
    return this.analyticsService.getRevenueReport();
  }
}
```

## Testing Auth dengan curl/Postman

### 1. Login untuk dapat token

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@audira.net", "password": "admin123"}'
```

Response:
```json
{
  "message": "Login berhasil",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "xxx",
    "email": "admin@audira.net",
    "role": "admin"
  }
}
```

### 2. Gunakan token untuk akses protected endpoint

```bash
curl -X GET http://localhost:4000/pelanggan \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Test tanpa token (harus dapat error 401)

```bash
curl -X GET http://localhost:4000/pelanggan
# Response: { "statusCode": 401, "message": "Token tidak valid..." }
```

### 4. Test dengan wrong role (harus dapat error 403)

```bash
# Login sebagai customer
curl -X POST http://localhost:4000/auth/login \
  -d '{"email": "customer@example.com", "password": "customer123"}'

# Coba akses admin endpoint (akan ditolak)
curl -X DELETE http://localhost:4000/pelanggan/xxx \
  -H "Authorization: Bearer <customer_token>"
# Response: { "statusCode": 403, "message": "Akses ditolak..." }
```

## Migration Strategy

### Phase 1: Protect Critical Endpoints
✅ Payment endpoints
✅ Customer data endpoints
✅ Invoice endpoints
✅ Admin endpoints

### Phase 2: Protect Moderate Priority
- Reports
- Analytics
- Settings
- Mikrotik management

### Phase 3: Public Endpoints
Leave these WITHOUT auth:
- Health check (/health)
- Login/Register (/auth/login, /auth/register)
- Public package listing (optional)
- Midtrans webhooks (use different validation)

## Error Handling

### 401 Unauthorized
- Token missing
- Token invalid
- Token expired
- User deleted

### 403 Forbidden
- Wrong role
- Insufficient permissions
- Accessing other user's data

## Best Practices

1. ✅ Always use both JwtAuthGuard and RolesGuard together
2. ✅ Be specific with roles (don't just use @Roles('admin'))
3. ✅ Validate user owns the resource before allowing access
4. ✅ Log authorization failures for security monitoring
5. ✅ Keep JWT_SECRET strong and rotated regularly
6. ✅ Set appropriate token expiry (not too long)

## Next Steps

After implementing guards:
1. Update all controllers to use guards
2. Test with different roles
3. Update API documentation
4. Train team on how to use
5. Monitor authentication logs
6. Setup alerts for suspicious activity
