import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { MikrotikModule } from './mikrotik/mikrotik.module';
import { PelangganModule } from './pelanggan/pelanggan.module';
import { KeuanganModule } from './keuangan/keuangan.module';
import { OperationalModule } from './operational/operational.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { EmailModule } from './email/email.module';
import { BillingModule } from './billing/billing.module';
import { RadiusModule } from './radius/radius.module';
import { ProvisioningModule } from './provisioning/provisioning.module';
import { PaymentModule } from './payment/payment.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ReferralModule } from './referral/referral.module';
import { InventoryModule } from './inventory/inventory.module';
import { FieldServiceModule } from './field-service/field-service.module';
import { NotificationModule } from './notification/notification.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantModule } from './tenant/tenant.module';
import { ReportsModule } from './reports/reports.module';
import { BackupModule } from './backup/backup.module';
import { AuditModule } from './audit/audit.module';
import { ModemModule } from './modem/modem.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GenieacsModule } from './genieacs/genieacs.module';
import { FranchiseModule } from './franchise/franchise.module';
import { OdpModule } from './odp/odp.module';
import { SettingsModule } from './settings/settings.module';
import { DocumentationModule } from './documentation/documentation.module';
import { TelegramModule } from './telegram/telegram.module';
import { DnsModule } from './dns/dns.module';
import { SpeedtestModule } from './speedtest/speedtest.module';
import { ZtpModule } from './ztp/ztp.module';
import { EmployeeModule } from './employee/employee.module';
import { SalaryModule } from './salary/salary.module';
import { LeaveModule } from './leave/leave.module';
import { ScheduleModule as WorkScheduleModule } from './schedule/schedule.module';
import { PerformanceModule } from './performance/performance.module';
import { SanitizeInputMiddleware } from './common/middleware/sanitize-input.middleware';
import { CustomerModule } from './customer/customer.module';
import { AdminCustomerModule } from './admin/customer/admin-customer.module';
import { PackageModule } from './package/package.module';
import { ServiceModule } from './service/service.module';
import { InvoiceModule } from './invoice/invoice.module';
import { TicketModule } from './ticket/ticket.module';
import { SalesModule } from './sales/sales.module';
import { HotspotModule } from './hotspot/hotspot.module';
import { BoosterModule } from './booster/booster.module';
import { CollectorModule } from './collector/collector.module';
import { OltModule } from './olt/olt.module';
import { RealtimeModule } from './realtime/realtime.module';
import { IncidentModule } from './incident/incident.module';
import { RetensiModule } from './retensi/retensi.module';
import { NetflowModule } from './netflow/netflow.module';
import { TunnelModule } from './tunnel/tunnel.module';

@Module({
  imports: [
    RealtimeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    HealthModule,
    DashboardModule,
    AuthModule,
    CustomerModule,
    AdminCustomerModule,
    PackageModule,
    ServiceModule,
    InvoiceModule,
    TicketModule,
    SalesModule,
    HotspotModule,
    BoosterModule,
    CollectorModule,
    OltModule,
    MikrotikModule,
    TunnelModule,
    PelangganModule,
    KeuanganModule,
    OperationalModule,
    WhatsAppModule,
    EmailModule,
    BillingModule,
    RadiusModule,
    ProvisioningModule,
    PaymentModule,
    MonitoringModule,
    ReferralModule,
    InventoryModule,
    FieldServiceModule,
    AttendanceModule,
    NotificationModule,
    AnalyticsModule,
    TenantModule,
    ReportsModule,
    BackupModule,
    AuditModule,
    ModemModule,
    GenieacsModule,
    FranchiseModule,
    OdpModule,
    SettingsModule,
    DocumentationModule,
    TelegramModule,
    // ISP Advanced Infrastructure Modules
    DnsModule,
    SpeedtestModule,
    ZtpModule,
    IncidentModule,
    RetensiModule,
    NetflowModule,
    // HRM Modules
    EmployeeModule,
    SalaryModule,
    LeaveModule,
    WorkScheduleModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply sanitization middleware to all routes
    consumer.apply(SanitizeInputMiddleware).forRoutes('*');
  }
}
