import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import {
  BookOpen,
  Search,
  ChevronRight,
  Code,
  Terminal,
  Database,
  Zap,
  FileText,
  Globe,
  Shield,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Server,
  Radio,
  Router,
  Activity,
  Cpu,
  Send,
  Layers,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

interface DocSubsection {
  id: string;
  title: string;
  badge?: string;
  moduleRoute?: string;
  moduleLabel?: string;
  content: string;
  code?: string;
}

interface DocSection {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  subsections: DocSubsection[];
}

const BUILTIN_DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Bagian 1: Getting Started & Arsitektur Monorepo',
    subtitle: 'Port Map, Docker, Prisma 44 Tabel, 50 Modul NestJS & Isolasi AVD ISP',
    icon: Zap,
    subsections: [
      {
        id: 'monorepo-overview',
        title: 'Arsitektur Monorepo & Standar Port Resmi',
        badge: 'ARCHITECTURE V4',
        moduleRoute: '/debug/test-api',
        moduleLabel: 'Buka API Diagnostic Suite',
        content: `AUDIRA-NET & BILLING dibangun di atas arsitektur Carrier-Grade Monorepo yang memisahkan secara tegas layer Web Admin NOC, Backend API NestJS, Customer Self-Service Portal, dan Mobile Client Flutter.

Standar Port Resmi Produksi & Development:
• Web Admin NOC Frontend (Next.js): http://localhost:3217
• Carrier-Grade Backend API (NestJS 50 Modul): http://localhost:3218
• Customer Self-Service Portal: http://localhost:3001
• PostgreSQL Container (sebilling-postgres): Port 5455 (Host) -> 5432 (Container)
• Redis Cache & BullMQ Queue: Port 6379

Seluruh komunikasi antara Frontend (3217) dan Backend (3218) diamankan menggunakan JWT RS256/HS256 Bearer Token serta WebSocket Gateway real-time untuk notifikasi pembayaran, tiket NOC, dan alert optik.`,
        code: `# Peta Port Resmi AUDIRA-NET-BILLING
NEXT_PUBLIC_API_URL="http://localhost:3218"
FRONTEND_PORT=3217
BACKEND_PORT=3218
CUSTOMER_PORTAL_PORT=3001

# Koneksi Database PostgreSQL (Container: sebilling-postgres)
DATABASE_URL="postgresql://postgres:postgres@localhost:5455/audira_billing?schema=public"
REDIS_URL="redis://localhost:6379"`,
      },
      {
        id: 'docker-prisma-setup',
        title: 'Instalasi Docker, Prisma 44 Tabel & 50 Modul NestJS',
        badge: '44 PRISMA MODELS',
        moduleRoute: '/backup',
        moduleLabel: 'Buka Snapshot Vault',
        content: `Database utama menggunakan PostgreSQL pada container Docker bernama sebilling-postgres di port 5455. Skema Prisma ORM mencakup 44 tabel terintegrasi yang melayani 50 modul NestJS:

Cakupan 44 Tabel Prisma ORM & 50 Modul NestJS:
1. Core & RBAC: User, Role, Permission, AuditLog, SystemSetting, BackupSnapshot
2. CRM & Billing: Customer, Package, Service, Invoice, Payment, PromiseToPay, TaxInvoice
3. Network & BNG: MikrotikRouter, BngClusterNode, IpamPool, CgnatPortMapping, RadiusCoaLog
4. FTTH & GPON: OltChassis, OltPonPort, OdpNode, OdcCabinet, OtdrTraceRecord, ZtpQueueItem
5. CPE & Telemetry: GenieAcsDevice, Tr069Campaign, MrtgTrafficSample, SpeedtestResult, ESlacertificate
6. Security & Compliance: DnsRpzZone, NetflowRecord, BgpFlowspecRule, KominfoBorangReport, TelegramTopicRoute
7. Operations, HRM & ERP: Ticket, MassOutageIncident, WorkOrder, Technician, InventoryItem, Employee, Payroll`,
        code: `# 1. Jalankan container PostgreSQL (sebilling-postgres:5455) & Redis (:6379)
docker compose up -d

# 2. Sinkronisasi 44 Tabel Prisma ORM & Generate Client
cd AUDIRA-BILLING/apps/backend
npx prisma migrate deploy
npx prisma generate

# 3. Jalankan Backend API di Port 3218 & Frontend Admin di Port 3217
pnpm --filter backend dev   # Listening on http://localhost:3218
pnpm --filter frontend dev  # Listening on http://localhost:3217`,
      },
      {
        id: 'emulator-isolation',
        title: 'Direktif Isolasi Android Emulator (AVD ISP)',
        badge: 'STRICT GOVERNANCE',
        moduleRoute: '/pengaturan',
        moduleLabel: 'Pengaturan Sistem',
        content: `Sesuai kebijakan Multi-Project Android Emulator Isolation Directive pada ekosistem pengembangan AUDIRA:

1. Target Emulator Wajib: Aplikasi mobile klien Flutter AUDIRA-NET hanya boleh dijalankan pada Android Virtual Device (AVD) bernama "ISP".
2. Isolasi Ketat Proyek Lain: Emulator dengan AVD bernama "MDA" (Comic Reader) atau "DC" (Data Center OS) adalah milik proyek paralel dan dilarang keras disentuh, di-reverse port, atau dihentikan.
3. Skrip Peluncur Resmi: Gunakan skrip start_app.bat pada root repositori yang secara otomatis memvalidasi nama AVD menggunakan perintah adb emu avd name sebelum melakukan port forwarding ke backend 3218.`,
        code: `:: Validasi Otomatis AVD "ISP" pada start_app.bat
for /f "tokens=1" %%d in ('adb devices ^| findstr /r "emulator-[0-9]*"') do (
  for /f "delims=" %%a in ('adb -s %%d emu avd name 2^>nul') do (
    if /I "%%a"=="ISP" (
      echo [TARGET MATCH] Menjalankan AUDIRA-NET pada %%d (AVD: ISP)
      adb -s %%d reverse tcp:3218 tcp:3218
    ) else (
      echo [SKIP] Melewatkan %%d karena milik proyek lain (AVD: %%a)
    )
  )
)`,
      },
    ],
  },
  {
    id: 'carrier-sops',
    title: 'Bagian 2: 16 SOP Operasional Jaringan Carrier-Grade',
    subtitle: 'Standar Eksekusi NOC & Field Engineering (audira-isp-network-ops)',
    icon: Shield,
    subsections: [
      {
        id: 'sop-ipam-cgnat',
        title: 'SOP 1-2: IPAM & Forensik CGNAT Kepatuhan UU ITE / Kominfo',
        badge: 'UU ITE & PBA 512',
        moduleRoute: '/ipam',
        moduleLabel: 'Buka Modul IPAM & CGNAT',
        content: `Berdasarkan regulasi Permenkominfo dan UU ITE, setiap penyelenggara ISP wajib mampu melacak pengguna di balik satu IP Publik (CGNAT) secara akurat:

• Alokasi Port-Block (Deterministic NAT / PBA): Setiap pelanggan PPPoE pada subnet CGNAT (100.64.0.0/10) dialokasikan blok 512 port deterministik (contoh: 100.64.12.45 -> 103.189.20.10:1024-1535) sehingga rasio pembagian 1 IP Publik maksimal 1:32 atau 1:64 pelanggan.
• Retensi Log 5-Tuple Minimal 90 Hari: Mencatat Timestamp (NTP Pool.ntp.org Asia/Jakarta), Source Private IP, Source Port, Translated Public IP, Translated Port, dan Session ID PPPoE.
• Kalkulator Forensik Cepat: Saat aparat penegak hukum atau CERT mengirimkan laporan penyalahgunaan IP Publik + Port + Timestamp, buka modul /ipam untuk mengidentifikasi ID Pelanggan dalam waktu < 3 detik.`,
        code: `# Aturan MikroTik Deterministic CGNAT (PBA 512 Port per Subscriber)
/ip firewall nat
add chain=srcnat src-address=100.64.12.10 protocol=tcp \\
    action=src-nat to-addresses=103.189.20.10 to-ports=1024-1535 \\
    comment="CGNAT-PBA SUB-0010 (UU ITE Compliant)"`,
      },
      {
        id: 'sop-mrtg-peering',
        title: 'SOP 3-4: MRTG 95th Percentile & Kalkulator Biaya BGP Peering',
        badge: '95TH PERCENTILE',
        moduleRoute: '/mrtg',
        moduleLabel: 'Buka Telemetry MRTG',
        content: `Standar industri penagihan kapasitas bandwidth upstream (IIX APJII, OpenIXP, CDIX, dan IP Transit Internasional SG) menggunakan metode Burstable 95th Percentile:

• Pengambilan Sampel 5-Menit: SNMP Poller mengumpulkan trafik In/Out setiap 5 menit (8.640 sampel per bulan).
• Pemotongan 5% Puncak Tertinggi (Top 5% Spike): 432 sampel tertinggi diabaikan, dan sampel ke-8.208 menjadi dasar tagihan komitmen (Committed Data Rate / CDR).
• Ambang Peringatan Peak Hour (19:00 - 23:00 WIB):
  - Utilisasi > 70% (WARNING): Pantau antrean trafik gim dan streaming.
  - Utilisasi > 85% (CRITICAL): Segera aktifkan BGP Traffic Engineering (AS-Path Prepend / Local Preference) ke link backup.`,
        code: `# Contoh BGP Traffic Engineering saat Link Utama >85% pada Peak Hour
/routing filter rule
add chain=UPSTREAM-OUT rule="if (dst in 0.0.0.0/0) { set bgp-path-prepend 2; accept; }"`,
      },
      {
        id: 'sop-otdr-tia598',
        title: 'SOP 5-6: Kalkulator OTDR, Standar Warna TIA-598 & Waveform .SOR',
        badge: 'FTTH FIBER OPTIC',
        moduleRoute: '/otdr',
        moduleLabel: 'Buka Kalkulator OTDR',
        content: `Ketika terjadi putus kabel serat optik (Fiber Cut / LOS Massal), tim Splicer dan NOC menggunakan kalkulator jarak optik dan kode warna internasional TIA/EIA-598-C:

• Indeks Bias (IOR) G.652D / G.657A: Gunakan n = 1.4682 pada panjang gelombang 1310nm / 1550nm dengan faktor slack/heliks kabel udara 3% hingga 5% untuk memetakan koordinat GPS tiang putus.
• Urutan 12 Warna Tube & Core (TIA-598):
  1. Biru (Blue)  | 2. Oranye (Orange) | 3. Hijau (Green) | 4. Cokelat (Brown)
  5. Abu-abu (Slate) | 6. Putih (White) | 7. Merah (Red) | 8. Hitam (Black)
  9. Kuning (Yellow) | 10. Ungu (Violet) | 11. Pink (Rose) | 12. Toska (Aqua)
• Anggaran Redaman (Optical Link Budget):
  - Splitter 1:8 = ~10.5 dB | Splitter 1:16 = ~13.8 dB
  - Fusion Splice = < 0.08 dB/titik | Konektor SC/UPC = < 0.3 dB
  - Target Rx Power ONT Pelanggan: -15.0 dBm s/d -24.0 dBm (Batas kritis LOS: -27.0 dBm).`,
        code: `// Rumus Kalkulasi Jarak Fisik Tiang dari Jarak Optik OTDR
const opticalDistanceKm = 4.820; // Bacaan dari waveform .SOR OTDR
const slackFactor = 0.045;       // 4.5% kelonggaran gulungan tiang (figure-8)
const physicalRouteDistanceKm = opticalDistanceKm * (1 - slackFactor); // 4.603 km`,
      },
      {
        id: 'sop-janji-bayar-dns',
        title: 'SOP 7-8: Mesin Janji Bayar (CoA <2s) & DNS TrustPositif Kominfo',
        badge: 'RADIUS COA 3799',
        moduleRoute: '/janji-bayar',
        moduleLabel: 'Buka Mesin Janji Bayar',
        content: `Otomasi layanan pelanggan dan kepatuhan regulasi DNS nasional:

1. Mesin Janji Bayar (Promise-to-Pay / Ekstensi Isolir 24-48 Jam):
   • Pelanggan yang terisolir dapat mengajukan Janji Bayar via aplikasi/WhatsApp atau melalui CS.
   • Sistem mengirimkan paket RADIUS Change of Authorization (CoA) UDP Port 3799 ke BRAS MikroTik untuk mengubah profil dari ISOLIR kembali ke paket asli dalam waktu < 2 detik tanpa memutus sesi fisik ONT.
   • Jika tagihan belum lunas saat countdown habis, cron otomatis mengembalikan profil ke ISOLIR.

2. DNS Filtering RPZ TrustPositif Kominfo (/dns-trustpositif):
   • Sinkronisasi terjadwal daftar jutaan domain negatif Kominfo ke dalam Response Policy Zone (RPZ) Unbound / PowerDNS.
   • Dilengkapi aturan MikroTik Destination NAT (Port 53 TCP/UDP Force Redirect) dan pemblokiran DoH/DoT liar agar pelanggan tidak dapat mem-bypass filter DNS ISP.`,
        code: `# Force Redirect Seluruh Trafik DNS Pelanggan ke Resolver TrustPositif AUDIRA
/ip firewall nat
add chain=dstnat protocol=udp dst-port=53 src-address=100.64.0.0/10 \\
    action=dst-nat to-addresses=10.254.0.53 to-ports=53 comment="FORCE-DNS-TRUSTPOSITIF"
add chain=dstnat protocol=tcp dst-port=53 src-address=100.64.0.0/10 \\
    action=dst-nat to-addresses=10.254.0.53 to-ports=53`,
      },
      {
        id: 'sop-speedtest-ztp',
        title: 'SOP 9-10: Speedtest 10Gbps E-SLA & Zero-Touch Provisioning (ZTP 2.1s)',
        badge: 'E-SLA & ZTP OMCI',
        moduleRoute: '/ztp',
        moduleLabel: 'Buka Modul ZTP OLT',
        content: `Standar pengujian mutu layanan korporat dan aktivasi perangkat baru di lapangan:

1. Speedtest 10Gbps & Sertifikat E-SLA (/speedtest):
   • Pengujian multi-stream terkalibrasi terhadap 5 target: Local BNG Core, IIX APJII Jakarta, OpenIXP, Singapore Equinix SG1, dan Global Tier-1.
   • Menghasilkan dokumen Sertifikat E-SLA resmi (Throughput, Jitter, Latency, Packet Loss, dan Uptime 99.95%) untuk lampiran tagihan pelanggan Dedicated/B2B.

2. Zero-Touch Provisioning / ZTP OLT (/ztp):
   • Memindai antrean Unconfigured ONU (Serial Number ZTEG... / HWTC...) di seluruh port GPON OLT ZTE C320 dan Huawei MA5800.
   • Hanya dengan 1 klik, sistem menginjeksi TCONT, GEMPORT, Line Profile, VLAN PPPoE, dan kredensial pelanggan dalam rata-rata waktu eksekusi 2.1 detik.`,
        code: `# Contoh Injeksi Otomatis ZTP pada OLT ZTE C320
interface gpon-olt_1/2/4
  onu 8 type ZTE-F670L sn ZTEGC8910B22
!
pon-onu-mng gpon-onu_1/2/4:8
  service HSI gemport 1 vlan 1204
  wan-ip 1 mode pppoe username cust-1088@audira.net password *** vlan-profile VLAN1204 host 1`,
      },
      {
        id: 'sop-outage-churn-tr069',
        title: 'SOP 11-13: Mass Outage WA Broadcast, AI Churn Radar & GenieACS TR-069',
        badge: 'AI & CWMP TR-069',
        moduleRoute: '/mass-outage',
        moduleLabel: 'Buka Mass Outage Detector',
        content: `Protokol penanganan insiden massal, retensi pelanggan berbasis AI, dan manajemen CPE jarak jauh:

1. Mass Outage Detector & 1-Click WhatsApp Broadcast (/mass-outage):
   • Mengkorelasikan event DyingGasp vs LOS (Loss of Signal). Jika >= 4 ONU pada ODP/PON yang sama mengalami LOS serentak, sistem menandai insiden FIBER_CUT_BACKBONE.
   • Mengirimkan pesan WhatsApp pemberitahuan gangguan & estimasi pemulihan (ETR) ke seluruh pelanggan terdampak dengan jeda anti-ban otomatis.

2. AI Predictive Churn Radar (/churn-radar):
   • Menghitung skor risiko berhenti berlangganan (0-100%) dari kombinasi degradasi sinyal optik (<-26.5 dBm), frekuensi komplain tiket, dan riwayat keterlambatan bayar.

3. GenieACS TR-069 Remote Wi-Fi & Firmware Campaign (/genieacs):
   • Mengubah SSID & Password Wi-Fi 2.4GHz/5GHz pelanggan secara instan lewat protokol CWMP tanpa kunjungan teknisi, serta menjadwalkan pembaruan firmware ONT massal pada pukul 02:00-04:00 WIB.`,
        code: `// Payload GenieACS CWMP Task untuk Mengubah SSID & Password Wi-Fi Pelanggan
POST http://10.254.0.60:7557/devices/202BC1-F670L-ZTEGC8192A01/tasks?connection_request
{
  "name": "setParameterValues",
  "parameterValues": [
    ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", "AUDIRA_SUPER_5G", "xsd:string"],
    ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", "AudiraAman2026!", "xsd:string"]
  ]
}`,
      },
      {
        id: 'sop-netflow-bng-kominfo-telegram',
        title: 'SOP 14-16: NetFlow DDoS Shield, Multi-NAS BNG, Kominfo 5-Borang & Telegram 14-Topic',
        badge: 'BGP FLOWSPEC & KOMINFO',
        moduleRoute: '/netflow',
        moduleLabel: 'Buka NetFlow & BGP Shield',
        content: `Perlindungan infrastruktur backbone, klasterisasi BNG, dan pelaporan regulasi tahunan:

1. NetFlow v9 & BGP Flowspec DDoS Shield (/netflow):
   • Menganalisis distribusi trafik per AS-Number (Google, Meta, Akamai, Cloudflare, Valve) dan mendeteksi serangan volumetrik UDP/SYN Flood.
   • Menerapkan aturan BGP Flowspec / Remote Triggered Black Hole (RTBH Community 65535:666) ke router upstream dalam < 1 detik saat terjadi serangan DDoS.

2. Multi-NAS Anycast BNG Cluster (/mikrotik-cluster):
   • Menyeimbangkan ribuan sesi PPPoE secara aktif-aktif di antara BRAS-East dan BRAS-West dengan waktu failover VRRP/OSPF < 800ms.

3. Generator e-Pelaporan 5-Borang Ditjen PPI Kominfo (/kominfo-report) & Telegram 14-Topic Hub (/telegram-hub):
   • Mengekspor 5 borang resmi penyelenggara Jartaplok Packet Switched (KBLI 61999): Data Pelanggan, BHP/USO, QoS Standar, Sebaran ODP Kecamatan, dan Kapasitas Core.
   • Mengarahkan setiap jenis alert ke 14 topik forum Telegram Supergroup secara presisi menggunakan parameter message_thread_id.`,
        code: `# Pengiriman Alert Spesifik ke Telegram Forum Topic #2 (OLT & PON Alarm)
POST http://localhost:3218/telegram/send
{
  "topicId": 2,
  "message_thread_id": 102,
  "severity": "CRITICAL",
  "text": "[LOS ALARM] ODP-BDG-014 mengalami penurunan sinyal -28.9 dBm pada 12 ONT."
}`,
      },
    ],
  },
  {
    id: 'rest-api-webhook',
    title: 'Bagian 3: Referensi REST API & Webhook',
    subtitle: 'Auth JWT, Pelanggan, Billing CoA, MikroTik, GenieACS, Speedtest & WA Bot',
    icon: Code,
    subsections: [
      {
        id: 'api-auth-jwt',
        title: '1. Autentikasi JWT & RBAC Guard',
        badge: 'AUTH API',
        moduleRoute: '/audit-logs',
        moduleLabel: 'Lihat Audit Trail Login',
        content: `Seluruh endpoint terproteksi pada Backend API (http://localhost:3218) mewajibkan header Authorization: Bearer <token>. Token berlaku selama 7 hari dan mencatat aktivitas login ke dalam tabel AuditLog.`,
        code: `// 1. Login Admin / NOC Operator
POST http://localhost:3218/auth/login
Content-Type: application/json

{
  "email": "admin@audira.net",
  "password": "SuperSecurePassword123!"
}

// 2. Contoh Respons Sukses (200 OK)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr-superadmin-01",
    "name": "Agus Dwi Rianto",
    "email": "admin@audira.net",
    "role": "SUPER_ADMIN"
  }
}`,
      },
      {
        id: 'api-billing-coa',
        title: '2. Pelanggan, Billing & Webhook Auto-Unblock CoA (<2s)',
        badge: 'BILLING & COA',
        moduleRoute: '/keuangan',
        moduleLabel: 'Buka Modul Keuangan',
        content: `Saat pembayaran diterima melalui Payment Gateway (QRIS / Virtual Account) atau dikonfirmasi kasir, sistem otomatis menandai invoice PAID, mengirim kuitansi WhatsApp, dan menembakkan paket RADIUS CoA ke MikroTik untuk membuka isolir pelanggan dalam < 2 detik.`,
        code: `// Ambil Daftar Pelanggan & Statistik
GET http://localhost:3218/pelanggan
GET http://localhost:3218/pelanggan/stats

// Proses Pembayaran & Trigger Auto-Unblock RADIUS CoA
POST http://localhost:3218/keuangan/payments
Content-Type: application/json

{
  "invoiceId": "INV-2026-07-0012",
  "amount": 350000,
  "paymentMethod": "QRIS_DYNAMIC",
  "autoUnblockCoa": true
}

// Eksekusi Janji Bayar (Unblock Sementara 24/48 Jam)
POST http://localhost:3218/janji-bayar/activate
{
  "customerId": "CUST-00918",
  "durationHours": 48,
  "reason": "Menunggu gajian tanggal 28"
}`,
      },
      {
        id: 'api-mikrotik-genieacs-speedtest',
        title: '3. MikroTik RouterOS, GenieACS TR-069 & Speedtest 5-Node API',
        badge: 'NETWORK API',
        moduleRoute: '/mikrotik',
        moduleLabel: 'Buka Manajemen MikroTik',
        content: `Endpoint integrasi langsung untuk manajemen sesi PPPoE/Hotspot di MikroTik, pembacaan parameter optik ONT melalui GenieACS CWMP, serta eksekusi benchmark Speedtest 10Gbps.`,
        code: `// 1. MikroTik Router & Cluster BNG
GET  http://localhost:3218/mikrotik
POST http://localhost:3218/mikrotik/:id/test-connection

// 2. GenieACS TR-069 CPE Operations
GET  http://localhost:3218/genieacs/devices
POST http://localhost:3218/genieacs/devices/:sn/wifi
{
  "ssid24": "AUDIRA_HOME_2.4G",
  "ssid5": "AUDIRA_HOME_5G",
  "password": "PasswordBaru2026"
}

// 3. Speedtest 5-Node & E-SLA Generator
GET  http://localhost:3218/speedtest/servers
POST http://localhost:3218/speedtest/run
{
  "serverNodeId": "iix-apjii-jkt",
  "customerId": "CUST-CORP-001"
}`,
      },
      {
        id: 'api-whatsapp-bot-commands',
        title: '4. Referensi Perintah WhatsApp Interactive Bot Pelanggan & Teknisi',
        badge: 'WHATSAPP BOT',
        moduleRoute: '/whatsapp',
        moduleLabel: 'Buka WhatsApp Gateway',
        content: `Gateway WhatsApp AUDIRA mendukung perintah interaktif dua arah (self-service) bagi pelanggan terdaftar maupun teknisi lapangan:

• !tagihan <ID_Pelanggan> : Mengecek rincian tagihan berjalan beserta tautan pembayaran QRIS/VA instan.
• !ceksinyal <ID_Pelanggan> : Menarik data real-time Rx Optical Power (dBm), suhu ONT, dan jumlah perangkat terhubung dari OLT/GenieACS.
• !reboot <ID_Pelanggan> : Mengirim perintah TR-069 Reboot RPC ke ONT pelanggan untuk menyegarkan sesi koneksi.
• !wifi <SSID_Baru> <Password_Baru> : Mengganti nama Wi-Fi dan kata sandi ONT langsung dari chat WhatsApp pelanggan.`,
        code: `# Contoh Webhook Payload Masuk dari WhatsApp Gateway ke Backend Port 3218
POST http://localhost:3218/whatsapp/webhook
Content-Type: application/json

{
  "from": "6281234567890@s.whatsapp.net",
  "command": "!ceksinyal",
  "args": ["CUST-00918"],
  "timestamp": 1753517400
}

# Balasan Otomatis Bot (< 1.5 Detik):
# "[AUDIRA FIBER TELEMETRY]
# Pelanggan: Budi Santoso (CUST-00918)
# Status Sesi: ONLINE (BRAS-East • IP 100.64.18.42)
# Redaman Optik Rx: -18.45 dBm (SANGAT NORMAL)
# Perangkat Terhubung: 7 Perangkat Aktif"`,
      },
    ],
  },
];

export default function Dokumentasi() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

  const [docSections, setDocSections] = useState<DocSection[]>(BUILTIN_DOC_SECTIONS);
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [activeSubsection, setActiveSubsection] = useState<string>('monorepo-overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiSyncStatus, setApiSyncStatus] = useState<'synced' | 'builtin'>('builtin');

  useEffect(() => {
    const fetchOptionalRemoteDocs = async () => {
      try {
        const res = await fetch(`${API_BASE}/documentation`);
        if (res.ok) {
          const data = await res.json();
          if (data?.sections && Array.isArray(data.sections) && data.sections.length > 0) {
            setApiSyncStatus('synced');
          }
        }
      } catch {
        setApiSyncStatus('builtin');
      }
    };
    fetchOptionalRemoteDocs();
  }, [API_BASE]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Cross-section search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    const matches: {
      sectionId: string;
      sectionTitle: string;
      sub: DocSubsection;
    }[] = [];

    for (const sec of docSections) {
      for (const sub of sec.subsections) {
        const hay = `${sub.title} ${sub.badge || ''} ${sub.content} ${sub.code || ''}`.toLowerCase();
        if (hay.includes(q)) {
          matches.push({
            sectionId: sec.id,
            sectionTitle: sec.title,
            sub,
          });
        }
      }
    }
    return matches;
  }, [searchTerm, docSections]);

  const currentSection = docSections.find((s) => s.id === activeSection) || docSections[0];
  const currentSubsection =
    currentSection?.subsections.find((s) => s.id === activeSubsection) ||
    currentSection?.subsections[0];

  const currentSubIndex = currentSection
    ? currentSection.subsections.findIndex((s) => s.id === currentSubsection?.id)
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Top Banner Header */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/30 text-[var(--app-primary)]">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--app-text)]">
                  Pusat Dokumentasi Arsitektur & 16 SOP Carrier-Grade
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {apiSyncStatus === 'synced' ? 'LIVE DOCS SYNCED' : 'CARRIER HANDBOOK V4.2'}
                </span>
              </div>
              <p className="text-sm text-[var(--app-text-muted)] mt-1">
                Panduan teknis resmi monorepo AUDIRA-NET-BILLING, standar port (<span className="font-mono">3217 / 3218 / 3001 / 5455 / 6379</span>), 16 SOP NOC, dan referensi REST API
              </p>
            </div>
          </div>

          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-[var(--app-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari SOP, port 3218, CoA, OTDR, CGNAT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
            />
          </div>
        </div>

        {/* Cross-Section Search Results Dropdown Panel */}
        {searchTerm.trim() !== '' && (
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">
                Hasil Pencarian Lintas Bagian ({searchResults.length} Ditemukan untuk &ldquo;{searchTerm}&rdquo;)
              </span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs font-semibold text-[var(--app-primary)] hover:underline"
              >
                Bersihkan Pencarian
              </button>
            </div>

            {searchResults.length === 0 ? (
              <p className="text-sm text-[var(--app-text-muted)] py-4 text-center">
                Tidak ditemukan topik yang cocok. Coba kata kunci seperti <span className="font-mono">5455</span>, <span className="font-mono">CGNAT</span>, <span className="font-mono">CoA</span>, atau <span className="font-mono">OTDR</span>.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map((item) => (
                  <button
                    key={`${item.sectionId}-${item.sub.id}`}
                    onClick={() => {
                      setActiveSection(item.sectionId);
                      setActiveSubsection(item.sub.id);
                      setSearchTerm('');
                    }}
                    className="text-left p-3.5 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] border border-[var(--app-border)] transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[var(--app-text)]">
                        {item.sub.title}
                      </span>
                      {item.sub.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--app-primary)]/15 text-[var(--app-primary)]">
                          {item.sub.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--app-text-muted)] mt-1 line-clamp-2">
                      {item.sub.content}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main 3-Column Documentation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 space-y-3">
            <div className="px-2 py-1 border-b border-[var(--app-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">
                Struktur Dokumentasi
              </span>
            </div>

            <nav className="space-y-2">
              {docSections.map((section) => {
                const IconComponent = section.icon;
                const isSecActive = activeSection === section.id;
                return (
                  <div key={section.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveSection(section.id);
                        if (section.subsections[0]) {
                          setActiveSubsection(section.subsections[0].id);
                        }
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        isSecActive
                          ? 'bg-[var(--app-primary)] text-white shadow-sm'
                          : 'bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-bg)] border border-[var(--app-border)]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="leading-snug">{section.title}</span>
                    </button>

                    {isSecActive && (
                      <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-[var(--app-primary)]/40 ml-3">
                        {section.subsections.map((sub) => {
                          const isSubActive = activeSubsection === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setActiveSubsection(sub.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between gap-2 ${
                                isSubActive
                                  ? 'bg-[var(--app-primary)]/15 text-[var(--app-primary)] font-semibold border border-[var(--app-primary)]/30'
                                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]'
                              }`}
                            >
                              <span className="truncate">{sub.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Center Article Viewer */}
          <div className="lg:col-span-8 xl:col-span-6 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 md:p-8">
            {currentSubsection && (
              <div>
                {/* Breadcrumb & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--app-text-muted)]">
                    <Layers className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                    <span>{currentSection.title}</span>
                  </div>
                  {currentSubsection.badge && (
                    <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-[var(--app-primary)]/15 text-[var(--app-primary)] border border-[var(--app-primary)]/30">
                      {currentSubsection.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-[var(--app-text)] mb-4">
                  {currentSubsection.title}
                </h2>

                {/* Direct Shortcut to Related Module */}
                {currentSubsection.moduleRoute && (
                  <div className="mb-6 p-3.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-[var(--app-text-muted)]">
                        Pintasan Modul Operasional Terkait:{' '}
                        <span className="font-mono text-[var(--app-text)]">
                          {currentSubsection.moduleRoute}
                        </span>
                      </span>
                    </div>
                    <Link
                      href={currentSubsection.moduleRoute}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--app-primary)] text-white text-xs font-semibold hover:opacity-90 shrink-0"
                    >
                      <span>{currentSubsection.moduleLabel || 'Buka Modul'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Content Body */}
                <div className="text-sm text-[var(--app-text)] whitespace-pre-line leading-relaxed space-y-4">
                  {currentSubsection.content}
                </div>

                {/* Code Snippet Block */}
                {currentSubsection.code && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-[var(--app-card-subtle)] border border-b-0 border-[var(--app-border)]">
                      <span className="text-xs font-mono font-semibold text-[var(--app-text-muted)] flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                        Konfigurasi / Contoh Eksekusi
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(currentSubsection.code!, currentSubsection.id)
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--app-card)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] text-xs font-mono transition-colors"
                      >
                        {copiedCode === currentSubsection.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Snippet
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-5 rounded-b-xl bg-[var(--app-bg)] border border-[var(--app-border)] text-xs font-mono text-[var(--app-text)] overflow-x-auto leading-relaxed">
                      <code>{currentSubsection.code}</code>
                    </pre>
                  </div>
                )}

                {/* Prev / Next Subsection Navigation */}
                <div className="mt-8 pt-5 border-t border-[var(--app-border)] flex items-center justify-between">
                  <div>
                    {currentSubIndex > 0 && (
                      <button
                        onClick={() =>
                          setActiveSubsection(
                            currentSection.subsections[currentSubIndex - 1].id
                          )
                        }
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] text-xs font-semibold"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Topik Sebelumnya
                      </button>
                    )}
                  </div>
                  <div>
                    {currentSubIndex < currentSection.subsections.length - 1 && (
                      <button
                        onClick={() =>
                          setActiveSubsection(
                            currentSection.subsections[currentSubIndex + 1].id
                          )
                        }
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--app-primary)] hover:opacity-90 text-white text-xs font-semibold"
                      >
                        Topik Selanjutnya
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Quick Links & Architecture Card */}
          <div className="lg:col-span-12 xl:col-span-3 space-y-4">
            {/* Official Port Map Summary */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-[var(--app-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">
                  Standar Port Resmi
                </h3>
              </div>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Web Admin</span>
                  <span className="font-bold text-emerald-400">:3217</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Backend API</span>
                  <span className="font-bold text-sky-400">:3218</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Customer Portal</span>
                  <span className="font-bold text-indigo-400">:3001</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">PostgreSQL DB</span>
                  <span className="font-bold text-amber-400">:5455</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Redis Cache</span>
                  <span className="font-bold text-rose-400">:6379</span>
                </div>
              </div>
            </div>

            {/* Direct NOC Module Shortcuts */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)] mb-3">
                Pintasan Modul Carrier-Grade
              </h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/debug/test-api"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                    API Diagnostic & Benchmark
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                </Link>

                <Link
                  href="/backup"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Disaster Recovery Vault
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                </Link>

                <Link
                  href="/audit-logs"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    RBAC Forensic Audit Trail
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                </Link>

                <Link
                  href="/ipam"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    IPAM & Forensik CGNAT
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                </Link>

                <Link
                  href="/telegram-hub"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-indigo-400" />
                    Telegram 14-Topic NOC Hub
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                </Link>
              </div>
            </div>

            {/* Official Support & Contact */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 text-xs space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-[var(--app-text)]">
                Kontak Resmi & Dukungan Teknis
              </h3>
              <p className="text-[var(--app-text-muted)] leading-relaxed">
                Dikembangkan oleh <strong className="text-[var(--app-text)]">Agus Dwi Rianto (AUDIRA)</strong> - Audira Multimedia Digital / Audira Sukses Mandiri.
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="https://audira.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)]"
                >
                  <span>Portal Resmi (audira.my.id)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                </a>
                <a
                  href="https://wa.me/6282112001600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)]"
                >
                  <span>WhatsApp Hotline (+62 821-1200-1600)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
