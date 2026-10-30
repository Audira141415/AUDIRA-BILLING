import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Wifi,
  Zap,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Send,
  X,
  Sparkles,
  PhoneCall,
  Server,
  Download,
  Upload,
  Cpu,
  Clock,
  ExternalLink,
  Lock,
  Flame,
  Award,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  Package,
  Building2,
  Building,
  Cloud,
  Database,
  Languages,
  Bot,
  MessageSquare,
  Briefcase,
  FileText,
  BadgeCheck,
  Activity,
  Check,
  CreditCard,
  QrCode,
  Copy,
  Receipt,
  Gauge,
  Search,
  Radio,
  AlertTriangle,
  Printer,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import QRCode from 'qrcode';

interface PackageItem {
  id: string;
  name: string;
  speed: number;
  monthlyPrice: number;
  badge?: string;
  isPopular?: boolean;
  category: 'home' | 'business';
  description: string;
  features: string[];
}

const PACKAGES: PackageItem[] = [
  {
    id: 'home-20',
    name: 'Home Starter',
    speed: 20,
    monthlyPrice: 185000,
    category: 'home',
    description: 'Pilihan hemat untuk keluarga kecil, browsing, belajar online, dan streaming HD lancar.',
    features: [
      'Kecepatan Hingga 20 Mbps',
      '100% Unlimited Tanpa Batas FUP',
      'Ideal untuk 1-4 Perangkat',
      'Modem WiFi Fiber Optic Termasuk',
      'Dukungan Teknis Siaga 24/7',
      'Gratis Biaya Pasang (S&K Berlaku)',
    ],
  },
  {
    id: 'home-50',
    name: 'Gamer Ultra',
    speed: 50,
    monthlyPrice: 285000,
    badge: 'PALING POPULER',
    isPopular: true,
    category: 'home',
    description: 'Didesain khusus untuk online gaming kompetitif, video conference jernih, dan 4K streaming.',
    features: [
      'Kecepatan 50 Mbps Simetris 1:1',
      'Low Latency Priority Gaming Route',
      '100% Unlimited Tanpa Batas FUP',
      'Ideal untuk 5-10 Perangkat',
      'Dual-Band Gigabit Router (2.4G & 5G)',
      'Direct Peering OpenIXP & Cloudflare',
      'Prioritas Penanganan Gangguan',
    ],
  },
  {
    id: 'home-100',
    name: 'Pro Streamer',
    speed: 100,
    monthlyPrice: 450000,
    badge: 'PERFORMA MAKSIMAL',
    category: 'home',
    description: 'Koneksi ultra-cepat untuk konten kreator, live streamer, software engineer, dan smart home.',
    features: [
      'Kecepatan 100 Mbps Simetris 1:1',
      'Upload Kilat Tanpa Throttling',
      'Bebas Kuota FUP Selamanya',
      'Ideal untuk 10-20 Perangkat Aktif',
      'High-Power Dual Band Gigabit ONT',
      'Gratis IP Publik Dinamis Ramah Remote',
      'SLA 99.8% Garansi Stabilitas Jaringan',
    ],
  },
  {
    id: 'biz-100',
    name: 'SOHO Business',
    speed: 100,
    monthlyPrice: 750000,
    category: 'business',
    description: 'Solusi handal untuk cafe, coworking, kantor cabang, dan operasional bisnis harian.',
    features: [
      'Kecepatan 100 Mbps Dedicated Ratio 1:2',
      '1x IP Publik Statis (/32)',
      'MRTG Traffic Graph & Bandwidth Monitor',
      'Prioritas Bandwidth Jam Kerja (08:00 - 18:00)',
      'SLA 99.8% dengan Kompensasi Downtime',
      'Dedicated Account Manager & Tim NOC Khusus',
    ],
  },
  {
    id: 'biz-300',
    name: 'Enterprise Dedicated',
    speed: 300,
    monthlyPrice: 1950000,
    badge: 'CORPORATE SLA 99.9%',
    category: 'business',
    description: 'Koneksi dedicated 1:1 murni dengan redundansi uplink ganda untuk korporat & server data center.',
    features: [
      'Kecepatan 300 Mbps Dedicated 1:1 Murni',
      'Subnet IP Publik Statis (/29 - 5 Usable IPs)',
      'Redundant Fiber Ring Backbone',
      'SLA 99.9% Garansi Finansial',
      'Dukungan On-Site Respon < 2 Jam',
      'Laporan Trafik & Analisis Performa Bulanan',
    ],
  },
];

const COVERAGE_DATA = [
  { area: 'Jakarta Timur - Cakung & Pulogebang', status: 'ready', odp: 48, note: 'Tersedia FO 100%' },
  { area: 'Jakarta Timur - Duren Sawit & Klender', status: 'ready', odp: 36, note: 'Tersedia FO 100%' },
  { area: 'Bekasi Barat - Bintara & Kranji', status: 'ready', odp: 52, note: 'Tersedia FO 100%' },
  { area: 'Bekasi Utara - Harapan Indah', status: 'ready', odp: 64, note: 'Tersedia FO 100%' },
  { area: 'Bekasi Selatan - Galaxy & Pekayon', status: 'ready', odp: 40, note: 'Tersedia FO 100%' },
  { area: 'Depok - Margonda & Beji', status: 'ready', odp: 28, note: 'Tersedia FO 100%' },
  { area: 'Tangerang - Karawaci & BSD', status: 'expand', odp: 12, note: 'Perluasan Jaringan (Pre-Order)' },
  { area: 'Bogor - Cibinong', status: 'ready', odp: 22, note: 'Tersedia FO 100%' },
];

export interface IndustrySolution {
  id: 'finance' | 'health' | 'manufacturing' | 'hospitality';
  name: string;
  badge: string;
  icon: any;
  tagline: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  sla: string;
}

const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    id: 'finance',
    name: 'Perbankan & Fintech',
    badge: 'FINANCE & BANKING',
    icon: Building2,
    tagline: 'Konektivitas Ultra-Aman, Latensi < 2ms & Enkripsi Standar OJK',
    description: 'Jaringan leased line simetris privat dengan rute prioritas langsung ke server Bursa Efek Indonesia (BEI), Data Center Tier 3/4, dan gateway perbankan. Dilengkapi enkripsi IPSec hardware-based, zero packet loss, dan rute alternatif otomatis.',
    highlights: [
      'Dedicated Leased Line 1:1 Tanpa Bagi Bandwidth',
      'Jaminan Latensi < 2ms ke OpenIXP / IIX Jakarta',
      'Enkripsi Jaringan End-to-End (IPSec / MACsec)',
      'Subnet IP Publik Statis (/29 atau /28) Tersedia',
      'SLA Uptime 99.99% dengan Kompensasi Finansial Tertulis'
    ],
    specs: [
      { label: 'Jaminan SLA', value: '99.99%' },
      { label: 'Latensi Intra-Jkt', value: '< 2 ms' },
      { label: 'Rute Redundansi', value: 'Dual-Path BGP' },
      { label: 'Dukungan MTTR', value: '< 1 Jam' },
    ],
    sla: '99.99% Enterprise Financial SLA'
  },
  {
    id: 'health',
    name: 'Kesehatan & Rumah Sakit',
    badge: 'HEALTHCARE & SIMRS',
    icon: Activity,
    tagline: 'Bandwidth Prioritas SIMRS, PACS Radiologi, & Telemedicine',
    description: 'Infrastruktur internet fiber khusus fasilitas kesehatan untuk transmisi data citra medis DICOM/PACS berukuran besar tanpa jeda, sinkronisasi rekam medis elektronik (RME) cloud, dan bridging klaim asuransi / BPJS VClaim secara stabil.',
    highlights: [
      'High-Throughput Bursting untuk File Citra Radiologi',
      'Koneksi Stabil Khusus SIMRS & BPJS Bridging',
      'QoS Prioritas Khusus Telekonsultasi & Video HD',
      'Isolasi Jaringan Medis vs Wi-Fi Pengunjung / Pasien',
      'Teknisi Siaga Khusus Fasilitas Kesehatan 24/7'
    ],
    specs: [
      { label: 'Jaminan SLA', value: '99.9%' },
      { label: 'Paket Loss', value: '0.00%' },
      { label: 'QoS Profil', value: 'Voice/Med Priority' },
      { label: 'Dukungan On-Site', value: 'Prioritas Utama' },
    ],
    sla: '99.9% Healthcare Critical SLA'
  },
  {
    id: 'manufacturing',
    name: 'Manufaktur & Logistik',
    badge: 'INDUSTRY & LOGISTICS',
    icon: Server,
    tagline: 'Dual-Ring Fiber Redundant untuk Kawasan Industri & Gudang Pintar',
    description: 'Koneksi tangguh untuk pabrik, pergudangan modern, dan pelabuhan. Menjamin operasional ERP SAP/Oracle, sinkronisasi barcode inventory, live streaming puluhan kamera CCTV surveillance 4K, dan integrasi sensor IoT industri tanpa gangguan.',
    highlights: [
      'Infrastruktur Redundant Ring (Auto-Failover < 50ms)',
      'Dukungan Penarikan Jalur FO Outdoor Armor ke Kawasan Industri',
      'Optimasi CCTV Surveillance Cloud Streaming 4K',
      'Integrasi Sensor IoT & Smart Warehouse Barcode',
      'Monitoring Grafis Trafik MRTG Khusus IT Manager'
    ],
    specs: [
      { label: 'Jaminan SLA', value: '99.9%' },
      { label: 'Failover Time', value: '< 50 ms' },
      { label: 'Jangkauan Area', value: 'Kawasan Industri' },
      { label: 'Dukungan Teknis', value: 'NOC Dedicated' },
    ],
    sla: '99.9% Industrial Continuity SLA'
  },
  {
    id: 'hospitality',
    name: 'Hotel, Kampus & Coworking',
    badge: 'HOSPITALITY & CAMPUS',
    icon: Building,
    tagline: 'High-Density Wi-Fi, Social Login & Bandwidth Shaper Dinamis',
    description: 'Solusi lengkap manajemen internet untuk hotel bintang, universitas, mall, dan ruang kerja bersama. Didukung MikroTik User Manager, captive portal custom branding, pembagian bandwidth dinamis per tamu, dan isolasi antar perangkat.',
    highlights: [
      'Kapasitas Ribuan Perangkat Bersamaan (High-Density)',
      'Captive Portal Custom Branding Logo Perusahaan',
      'Otentikasi Voucher, SMS OTP, atau Social Media Login',
      'Dynamic Bandwidth Shaper per Pengguna',
      'Filtering Konten Positif & Proteksi Malware Terpusat'
    ],
    specs: [
      { label: 'Jaminan SLA', value: '99.8%' },
      { label: 'Kapasitas User', value: '5.000+ Concurrent' },
      { label: 'Captive Portal', value: 'Multi-Brand' },
      { label: 'Bandwidth QoS', value: 'Dynamic Per-Guest' },
    ],
    sla: '99.8% Hospitality Guest SLA'
  }
];

const ENTERPRISE_PILLARS = [
  {
    icon: Cloud,
    badge: 'MULTI-CLOUD & VPS',
    title: 'AUDIRA Cloud & Edge Compute',
    desc: 'Layanan Virtual Private Server (VPS) berperforma tinggi berbasis NVMe enterprise, Private Cloud untuk korporasi, serta GPU Inference Nodes untuk akselerasi kecerdasan buatan.',
    points: ['NVMe Storage IOPS Tinggi', 'Direct Peering ke Google Cloud & AWS', 'Snapshot & Backup Otomatis Harian', 'Aktivasi Instan dalam 60 Detik']
  },
  {
    icon: Database,
    badge: 'TIER 3 ARCHITECTURE',
    title: 'Data Center & Colocation Server',
    desc: 'Fasilitas penempatan server (Rack Unit & Caged) dengan standar keandalan Tier 3. Dilengkapi sistem pendingin presisi N+1, catu daya UPS ganda, generator backup, dan Meet-Me-Room netral.',
    points: ['Dual Grid PLN + Redundant Genset', 'Meet-Me-Room Netral Multi-Provider', 'Keamanan Biometrik & CCTV 24/7', 'Akses Kunjungan Teknis Bebas 24/7']
  },
  {
    icon: ShieldCheck,
    badge: 'MANAGED SECURITY',
    title: 'Clean Pipe & Anti-DDoS Mitigation',
    desc: 'Sistem proteksi lalu lintas data tingkat lanjut untuk menangkis serangan siber. Melindungi server korporat dari serangan DDoS volumetric hingga 100 Gbps, WAF, dan pengawasan tim SOC 24/7.',
    points: ['Mitigasi Serangan DDoS hingga 100 Gbps', 'Clean Pipe Filtering Real-Time', 'Next-Gen Firewall (NGFW) Terkelola', 'Laporan Analisis Serangan Bulanan']
  },
  {
    icon: Zap,
    badge: 'ON-DEMAND BANDWIDTH',
    title: 'Bandwidth on Demand (BoD Turbo)',
    desc: 'Tingkatkan kapasitas bandwidth secara fleksibel saat terjadi lonjakan trafik (peak season, event streaming, atau audit tahunan) secara instan via portal tanpa pergantian kabel fisik.',
    points: ['Aktivasi Instan via CoA (RFC 3576)', 'Bursting Fleksibel Harian / Mingguan', 'Monitoring Utilisasi MRTG Real-Time', 'Efisiensi Biaya Operasional Tanpa Over-Provisioning']
  }
];

const COMPLIANCE_STANDARDS = [
  {
    code: 'ISO/IEC 27001',
    name: 'Sistem Manajemen Keamanan Informasi',
    desc: 'Standar internasional untuk manajemen keamanan data, perlindungan kerahasiaan (confidentiality), dan pencegahan kebocoran data pelanggan.'
  },
  {
    code: 'ISO 9001:2015',
    name: 'Sistem Manajemen Mutu Layanan',
    desc: 'Penjaminan mutu operasional ISP berkesinambungan, proses pengaduan terukur, serta kepatuhan standar SLA ke seluruh pelanggan.'
  },
  {
    code: 'ISO 20000-1',
    name: 'Manajemen Layanan Teknologi Informasi (ITSM)',
    desc: 'Kerangka kerja operasional IT kelas dunia untuk manajemen insiden, eskalasi tiket gangguan, dan tata kelola infrastruktur jaringan.'
  },
  {
    code: 'PCI-DSS Compliance',
    name: 'Standar Keamanan Transaksi Kartu & Finansial',
    desc: 'Kepatuhan infrastruktur jaringan terhadap standar keamanan data industri perbankan dan pemrosesan pembayaran elektronik.'
  },
  {
    code: 'SLA 99.9% Finansial',
    name: 'Garansi Kompensasi Downtime Finansial',
    desc: 'Jaminan uptime jaringan 99.9% dengan klausul restitusi kompensasi pemotongan tagihan bulanan jika SLA gagal terpenuhi.'
  },
  {
    code: 'Tier 3 Facility Ready',
    name: 'Redundansi Daya & Jaringan Dual-Path',
    desc: 'Arsitektur distribusi daya N+1 tanpa single point of failure dengan dua jalur uplink fiber optik terpisah.'
  }
];

const PEERING_PARTNERS = [
  { name: 'OpenIXP (IDC Duren Tiga)', type: 'Direct Peering 10G', speed: '1 ms' },
  { name: 'IIX APJII (Gedung Cyber)', type: 'National Exchange', speed: '1 ms' },
  { name: 'SGIX Singapore', type: 'International Gateway', speed: '11 ms' },
  { name: 'Cloudflare Anycast', type: 'Edge Cache Node', speed: '1 ms' },
  { name: 'Google Global Cache', type: 'Direct Streaming', speed: '2 ms' },
  { name: 'Akamai Edge Server', type: 'CDN Accelerator', speed: '2 ms' },
  { name: 'MikroTik Certified Partner', type: 'Hardware Core', speed: 'RouterOS v7' },
  { name: 'BCA & Mandiri Peering', type: 'Secure Financial Route', speed: '< 2 ms' }
];

// Deterministic number formatting to avoid SSR vs Client locale hydration differences
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const TRANSLATIONS = {
  id: {
    // Nav
    navPlans: 'Paket Internet',
    navIndustry: 'Solusi Industri',
    navEnterprise: 'Enterprise & Cloud',
    navSla: 'Kepatuhan & SLA',
    navCoverage: 'Cek Jangkauan',
    navSimulator: 'Simulator',
    navTech: 'Teknologi',
    navFaq: 'FAQ',
    navPortal: 'Portal Pelanggan',
    navRegister: 'Pasang Baru',
    navRfq: 'B2B RFQ',
    // Status Bar
    nocStatus: 'NOC STATUS: NORMAL (99.98%)',
    peeringRoute: 'Peering: OpenIXP (1ms) | SGIX (11ms) | Cloudflare (1ms)',
    waCs: 'WhatsApp CS: +62 821-1200-1600',
    // Hero
    heroBadge: 'FIBER OPTIC 100% MURNI — TANPA FUP',
    heroTitlePre: 'Internet Fiber',
    heroTitleHighlight: 'Super Cepat',
    heroTitlePost: 'Tanpa Drama Kuota Habis.',
    heroDesc: 'Nikmati koneksi fiber optik simetris 1:1 berkecepatan tinggi. Bebas FUP, ping ultra-rendah untuk kompetitif gaming, streaming 4K tanpa buffering, didukung tim NOC lokal siaga 24/7.',
    heroCtaPlans: 'Pilih Paket Internet',
    heroCtaCoverage: 'Cek Jangkauan Area',
    heroCheckFup: '100% Bebas FUP',
    heroCheckSpeed: 'Kecepatan 1:1 Simetris',
    heroCheckRouter: 'Gratis Router WiFi',
    // Telemetry
    telemetryTitle: 'LIVE TELEMETRY POP AUDIRANET',
    telemetryUpdated: 'UPDATED: REALTIME',
    favPackage: 'PAKET TERFAVORIT',
    favName: 'Gamer Ultra 50 Mbps',
    perMonth: '/ bulan',
    orderBtn: 'Daftar',
    guaranteeQuote: 'Garansi uang kembali jika SLA uptime bulanan tidak terpenuhi.',
    // Peering
    peeringTitle: 'DIRECT CARRIER PEERING & INTERNET EXCHANGES',
    peeringSubtitle: 'Low Latency • BGP Dual-Homed • Tier-3 DC',
    // Simulator
    simTag: '[ INTERACTIVE EXPERIENCE TESTER ]',
    simTitle: 'Seberapa Cepat Kebutuhan Internet Anda?',
    simDesc: 'Geser indikator bandwidth di bawah untuk melihat estimasi waktu download game, upload video, dan kapasitas streaming di rumah Anda.',
    simTabSimulator: 'Simulator Kebutuhan Bandwidth',
    simTabSpeedtest: 'Uji Kecepatan Nyata & Sertifikat SLA',
    radarBtn: 'Radar Status & Pemeliharaan Jaringan',
    radarTitle: 'Pusat Status Jaringan & Radar Gangguan Area',
    radarSubtitle: 'Pemantauan Real-time Backbone Fiber Optic, BNG Anycast & POP AUDIRA',
    simSelect: 'PILIH BANDWIDTH:',
    simDownload: 'DOWNLOAD GAME 50 GB',
    simUpload: 'UPLOAD VIDEO 10 GB',
    simStream: 'STREAMING 4K HDR',
    simDownloadSub: 'Misal: GTA V, Valorant, Cyberpunk',
    simUploadSub: 'Simetris 1:1, cepat untuk YouTuber',
    simStreamSub: 'Nonton Netflix & YouTube tanpa buffering',
    simMinute: 'menit',
    simHour: 'jam',
    simDevices: 'perangkat bersamaan',
    // Packages
    pkgTag: '[ PILIHAN PAKET RESMI AUDIRANET ]',
    pkgTitle: 'Transparan, Tanpa Biaya Tersembunyi.',
    pkgDesc: 'Seluruh paket sudah termasuk biaya sewa modem WiFi fiber optic, bebas FUP, dan akses prioritas ke customer support.',
    catHome: 'Rumahan (Home)',
    catBusiness: 'Bisnis & Kantor',
    billMonthly: 'Bulanan',
    billYearly: 'Tahunan',
    save2Months: 'HEMAT 2 BLN',
    orderThisPlan: 'Pilih Paket Ini',
    // Coverage
    covTag: '[ SISTEM ODP FIBER OPTIC ]',
    covTitle: 'Cek Ketersediaan Area Fiber',
    covDesc: 'Cari nama kecamatan, kelurahan, atau perumahan Anda untuk melihat status kesiapan tiang ODP dan fiber optik kami.',
    covSearchPlaceholder: 'Ketik nama kelurahan, kecamatan, atau kota Anda...',
    covReady: 'FO READY',
    covPreorder: 'PRE-ORDER',
    covBtn: 'Daftar Di Area Ini',
    covEmpty: 'Area belum tercatat di data publik. Silakan chat WhatsApp admin kami untuk survei manual langsung ke lokasi!',
    // Industry
    indTag: '[ ENTERPRISE INDUSTRY VERTICALS ]',
    indTitle: 'Solusi Vertikal Sesuai Industri Anda',
    indDesc: 'Kami merancang arsitektur jaringan khusus dengan parameter SLA ketat, rute latensi prioritas, dan enkripsi tingkat enterprise untuk setiap sektor bisnis.',
    indRfqBtn: 'Minta Penawaran B2B',
    indConsultBtn: 'Konsultasi Solusi Arsitek',
    indSlaParam: 'PARAMETER GARANSI LAYANAN',
    indCarrierGrade: 'CARRIER-GRADE',
    indSlaGuaranteeDesc: 'Termasuk kontrak Service Level Agreement (SLA) bermaterai resmi dengan jaminan kompensasi finansial langsung jika terjadi gangguan.',
    // Enterprise
    entTag: '[ BEYOND CONNECTIVITY • DIGITAL ENTERPRISE ]',
    entTitle: 'Portofolio Solusi Digital Lengkap',
    entDesc: 'Lebih dari sekadar pipa internet, kami menyediakan ekosistem komputasi awan, fasilitas colocation pusat data, proteksi siber terkelola, dan bandwidth dinamis untuk mendorong transformasi digital perusahaan.',
    entConsultBtn: 'Minta Konsultasi Layanan',
    entSlaGuaranteed: 'SLA Terjamin',
    // Compliance
    compTag: '[ STANDAR KEPATUHAN & TATA KELOLA TINGGI ]',
    compTitle: 'Standar Kepatuhan ISO & Garansi Finansial',
    compDesc: 'Kepercayaan perbankan dan industri enterprise dibangun di atas kepatuhan standar internasional, audit keamanan berkala, dan garansi SLA finansial tanpa kompromi.',
    compAuditReady: 'Audit Ready',
    compVerified: 'Terverifikasi',
    // Tech
    techTag: '[ TEKNOLOGI & ARSITEKTUR JARINGAN ]',
    techTitle: 'Mengapa Memilih AudiraNET?',
    techDesc: 'Kami membangun infrastruktur jaringan mandiri dengan standar carrier-grade untuk menjamin performa tanpa kompromi.',
    // FAQ
    faqTag: '[ PERTANYAAN UMUM ]',
    faqTitle: 'Pertanyaan yang Sering Diajukan',
    faqDesc: 'Informasi penting seputar pemasangan, perangkat, kontrak, dan penagihan.',
    // CTA
    ctaTag: 'MULAI SEKARANG JUGA',
    ctaTitle: 'Tingkatkan Kecepatan Internet Rumah & Kantor Anda Hari Ini.',
    ctaDesc: 'Konsultasikan kebutuhan bandwidth Anda dengan tim teknisi AudiraNET. Dapatkan penawaran promo pasang baru dan bebas FUP selamanya.',
    ctaRegisterBtn: 'Daftar Pasang Baru Sekarang',
    ctaWaBtn: 'Chat WhatsApp Hotline',
    // VIRA AI
    viraTitle: 'Tanya VIRA AI',
    viraRole: '24/7 AI NOC',
    viraSubtitle: 'Virtual Intelligent Route Assistant',
    viraPlaceholder: 'Ketik pertanyaan untuk VIRA AI...',
    viraDisclaimer: 'Didukung AI Engine AUDIRA • Untuk kebutuhan mendesak hubungi WhatsApp NOC',
    viraDefaultMsg: 'Halo! Saya VIRA (Virtual Intelligent Route Assistant) dari AudiraNET. Ada yang bisa saya bantu terkait paket internet fiber, cek jangkauan ODP, SLA korporat, atau layanan Dedicated B2B?',
    viraQuick1: 'Cek Paket Internet & Harga',
    viraQuick2: 'Cek Jangkauan ODP Fiber',
    viraQuick3: 'Solusi Korporat & SLA 99.99%',
    viraQuick4: 'Minta Penawaran B2B (RFQ)',
    viraQuick5: 'Hubungi Tim NOC 24/7',
  },
  en: {
    // Nav
    navPlans: 'Internet Plans',
    navIndustry: 'Industry Solutions',
    navEnterprise: 'Enterprise & Cloud',
    navSla: 'Compliance & SLA',
    navCoverage: 'Coverage Check',
    navSimulator: 'Simulator',
    navTech: 'Technology',
    navFaq: 'FAQ',
    navPortal: 'Customer Portal',
    navRegister: 'Get Connected',
    navRfq: 'B2B RFQ',
    // Status Bar
    nocStatus: 'NOC STATUS: NORMAL (99.98%)',
    peeringRoute: 'Peering: OpenIXP (1ms) | SGIX (11ms) | Cloudflare (1ms)',
    waCs: 'WhatsApp Support: +62 821-1200-1600',
    // Hero
    heroBadge: '100% PURE FIBER OPTIC — ZERO FUP',
    heroTitlePre: 'High-Speed',
    heroTitleHighlight: 'Fiber Internet',
    heroTitlePost: 'Without Quota Caps or Throttling.',
    heroDesc: 'Experience symmetrical 1:1 gigabit fiber optic connectivity. Zero FUP restrictions, ultra-low gaming latency, 4K streaming without buffering, backed by 24/7 carrier NOC engineers.',
    heroCtaPlans: 'Choose Internet Plan',
    heroCtaCoverage: 'Check Area Coverage',
    heroCheckFup: '100% Uncapped (Zero FUP)',
    heroCheckSpeed: '1:1 Symmetrical Speed',
    heroCheckRouter: 'Free Gigabit WiFi Router',
    // Telemetry
    telemetryTitle: 'LIVE NOC TELEMETRY AUDIRANET',
    telemetryUpdated: 'UPDATED: REALTIME',
    favPackage: 'MOST POPULAR PLAN',
    favName: 'Gamer Ultra 50 Mbps',
    perMonth: '/ month',
    orderBtn: 'Order',
    guaranteeQuote: 'Full money-back guarantee if monthly SLA uptime is not met.',
    // Peering
    peeringTitle: 'DIRECT CARRIER PEERING & INTERNET EXCHANGES',
    peeringSubtitle: 'Low Latency • BGP Dual-Homed • Tier-3 DC',
    // Simulator
    simTag: '[ INTERACTIVE EXPERIENCE TESTER ]',
    simTitle: 'How Much Bandwidth Do You Actually Need?',
    simDesc: 'Slide the bandwidth indicator below to preview estimated game download durations, video upload speeds, and concurrent 4K streaming capacity.',
    simTabSimulator: 'Bandwidth Simulator',
    simTabSpeedtest: 'Live Speedtest & SLA Certificate',
    radarBtn: 'Network Health & Maintenance Radar',
    radarTitle: 'Network Health & Area Outage Radar',
    radarSubtitle: 'Real-time Monitoring of Backbone Fiber Optic, Anycast BNG & POP Nodes',
    simSelect: 'CHOOSE BANDWIDTH:',
    simDownload: '50 GB GAME DOWNLOAD',
    simUpload: '10 GB VIDEO UPLOAD',
    simStream: '4K HDR STREAMING',
    simDownloadSub: 'E.g.: GTA V, Valorant, Cyberpunk 2077',
    simUploadSub: '1:1 Symmetrical, fast for YouTubers & Creators',
    simStreamSub: 'Stream Netflix & YouTube 4K with zero buffer',
    simMinute: 'minutes',
    simHour: 'hours',
    simDevices: 'devices connected',
    // Packages
    pkgTag: '[ OFFICIAL AUDIRANET PACKAGES ]',
    pkgTitle: 'Transparent, No Hidden Fees.',
    pkgDesc: 'All plans include optical WiFi ONT rental, zero FUP throttling, and priority customer care access.',
    catHome: 'Home / Residential',
    catBusiness: 'Business & Office',
    billMonthly: 'Monthly',
    billYearly: 'Yearly (Annual)',
    save2Months: 'SAVE 2 MONTHS',
    orderThisPlan: 'Order This Plan',
    // Coverage
    covTag: '[ FIBER OPTIC ODP SYSTEM ]',
    covTitle: 'Check Fiber Area Availability',
    covDesc: 'Search for your sub-district, district, or housing complex to verify ODP pole status and optical fiber readiness.',
    covSearchPlaceholder: 'Type your area, sub-district, or city name...',
    covReady: 'FO READY',
    covPreorder: 'PRE-ORDER',
    covBtn: 'Register in This Area',
    covEmpty: 'Area not yet listed in public registry. Please chat with our WhatsApp support for an on-site manual survey!',
    // Industry
    indTag: '[ ENTERPRISE INDUSTRY VERTICALS ]',
    indTitle: 'Tailored Solutions for Your Industry',
    indDesc: 'We architect enterprise carrier networks with strict SLA metrics, priority sub-millisecond routes, and corporate-grade encryption.',
    indRfqBtn: 'Request B2B Quote',
    indConsultBtn: 'Consult Enterprise Architect',
    indSlaParam: 'SERVICE GUARANTEE PARAMETERS',
    indCarrierGrade: 'CARRIER-GRADE',
    indSlaGuaranteeDesc: 'Includes formal legal Service Level Agreement (SLA) contracts with financial restitution guarantees during disruptions.',
    // Enterprise
    entTag: '[ BEYOND CONNECTIVITY • DIGITAL ENTERPRISE ]',
    entTitle: 'Full Digital Enterprise Portfolio',
    entDesc: 'More than just internet bandwidth, we provide cloud compute infrastructure, Tier-3 colocation, managed cybersecurity, and on-demand burstable bandwidth.',
    entConsultBtn: 'Request Solution Inquiry',
    entSlaGuaranteed: 'SLA Guaranteed',
    // Compliance
    compTag: '[ STRICT COMPLIANCE & GOVERNANCE STANDARDS ]',
    compTitle: 'ISO Compliance & Financial SLA Guarantee',
    compDesc: 'Enterprise and banking trust is built on international standards, regular security audits, and financial SLA downtime compensation.',
    compAuditReady: 'Audit Ready',
    compVerified: 'Verified',
    // Tech
    techTag: '[ NETWORK TECHNOLOGY & ARCHITECTURE ]',
    techTitle: 'Why Choose AudiraNET?',
    techDesc: 'We build and maintain an independent carrier-grade network infrastructure for uncompromised operational performance.',
    // FAQ
    faqTag: '[ FREQUENTLY ASKED QUESTIONS ]',
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Essential details regarding installation, optical hardware, contract terms, and automated payments.',
    // CTA
    ctaTag: 'GET STARTED TODAY',
    ctaTitle: 'Upgrade Your Home & Business Internet Speed Today.',
    ctaDesc: 'Consult your bandwidth requirements with AudiraNET engineers. Enjoy new installation promotions with unlimited data forever.',
    ctaRegisterBtn: 'Register Connection Now',
    ctaWaBtn: 'Chat WhatsApp Hotline',
    // VIRA AI
    viraTitle: 'Ask VIRA AI',
    viraRole: '24/7 AI NOC',
    viraSubtitle: 'Virtual Intelligent Route Assistant',
    viraPlaceholder: 'Type your question for VIRA AI...',
    viraDisclaimer: 'Powered by AUDIRA AI Engine • For urgent network incidents contact WhatsApp NOC',
    viraDefaultMsg: 'Hello! I am VIRA (Virtual Intelligent Route Assistant) from AudiraNET. How may I assist you with fiber packages, ODP coverage, enterprise SLAs, or Dedicated B2B leased lines?',
    viraQuick1: 'Check Plans & Pricing',
    viraQuick2: 'Check Fiber ODP Coverage',
    viraQuick3: 'Enterprise Solutions & SLA 99.99%',
    viraQuick4: 'Request B2B Quote (RFQ)',
    viraQuick5: 'Contact 24/7 NOC Team',
  }
};

const INDUSTRY_SOLUTIONS_I18N = {
  finance: {
    name: { id: 'Perbankan & Fintech', en: 'Banking & Fintech' },
    tagline: {
      id: 'Konektivitas Ultra-Aman, Latensi < 2ms & Enkripsi Standar OJK',
      en: 'Ultra-Secure Connectivity, < 2ms Latency & OJK-Standard Encryption'
    },
    description: {
      id: 'Jaringan leased line simetris privat dengan rute prioritas langsung ke server Bursa Efek Indonesia (BEI), Data Center Tier 3/4, dan gateway perbankan. Dilengkapi enkripsi IPSec hardware-based, zero packet loss, dan rute alternatif otomatis.',
      en: 'Private symmetrical leased lines with direct priority routes to Indonesia Stock Exchange (IDX), Tier 3/4 Data Centers, and banking gateways. Equipped with hardware IPSec encryption, zero packet loss, and automated multi-homed BGP failover.'
    },
    sla: { id: '99.99% Enterprise Financial SLA', en: '99.99% Enterprise Financial SLA' }
  },
  health: {
    name: { id: 'Kesehatan & Rumah Sakit', en: 'Healthcare & Hospitals' },
    tagline: {
      id: 'Bandwidth Prioritas SIMRS, PACS Radiologi, & Telemedicine',
      en: 'Priority Bandwidth for SIMRS, PACS Radiology, & Telemedicine'
    },
    description: {
      id: 'Infrastruktur internet fiber khusus fasilitas kesehatan untuk transmisi data citra medis DICOM/PACS berukuran besar tanpa jeda, sinkronisasi rekam medis elektronik (RME) cloud, dan bridging klaim asuransi / BPJS VClaim secara stabil.',
      en: 'Dedicated optical fiber infrastructure for healthcare institutions enabling zero-lag PACS/DICOM medical image transfers, cloud Electronic Medical Records (EMR) synchronization, and stable BPJS VClaim insurance bridging.'
    },
    sla: { id: '99.9% Healthcare Critical SLA', en: '99.9% Healthcare Critical SLA' }
  },
  manufacturing: {
    name: { id: 'Manufaktur & Logistik', en: 'Manufacturing & Logistics' },
    tagline: {
      id: 'Dual-Ring Fiber Redundant untuk Kawasan Industri & Gudang Pintar',
      en: 'Dual-Ring Redundant Fiber for Industrial Estates & Smart Warehouses'
    },
    description: {
      id: 'Koneksi tangguh untuk pabrik, pergudangan modern, dan pelabuhan. Menjamin operasional ERP SAP/Oracle, sinkronisasi barcode inventory, live streaming puluhan kamera CCTV surveillance 4K, dan integrasi sensor IoT industri tanpa gangguan.',
      en: 'High-resilience network connectivity for factories, warehouses, and ports. Ensures nonstop SAP/Oracle ERP operations, real-time inventory barcode sync, 4K CCTV surveillance feeds, and industrial IoT sensor automation.'
    },
    sla: { id: '99.9% Industrial Continuity SLA', en: '99.9% Industrial Continuity SLA' }
  },
  hospitality: {
    name: { id: 'Hotel, Kampus & Coworking', en: 'Hospitality & Campuses' },
    tagline: {
      id: 'High-Density Wi-Fi, Social Login & Bandwidth Shaper Dinamis',
      en: 'High-Density Wi-Fi, Social Login & Dynamic Bandwidth Shaper'
    },
    description: {
      id: 'Solusi lengkap manajemen internet untuk hotel bintang, universitas, mall, dan ruang kerja bersama. Didukung MikroTik User Manager, captive portal custom branding, pembagian bandwidth dinamis per tamu, dan isolasi antar perangkat.',
      en: 'Turnkey internet management for star-rated hotels, universities, malls, and coworking spaces. Powered by MikroTik User Manager, custom branded captive portals, dynamic per-guest bandwidth shaping, and client isolation.'
    },
    sla: { id: '99.8% Hospitality Guest SLA', en: '99.8% Hospitality Guest SLA' }
  }
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<'home' | 'business'>('home');
  const [searchArea, setSearchArea] = useState('');
  const [simSpeed, setSimSpeed] = useState<number>(50);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(PACKAGES[1]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Tool Tab: Simulator vs Live Speedtest & SLA Certificate
  const [toolTab, setToolTab] = useState<'simulator' | 'speedtest'>('simulator');
  const [speedtesting, setSpeedtesting] = useState(false);
  const [speedtestProgress, setSpeedtestProgress] = useState(0);
  const [speedtestPhase, setSpeedtestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [speedtestResults, setSpeedtestResults] = useState<{
    ping: number;
    jitter: number;
    download: number;
    upload: number;
    server: string;
    ip: string;
    date: string;
    certId: string;
    sha256: string;
    complianceScore: string;
  } | null>(null);
  const [slaCertModalOpen, setSlaCertModalOpen] = useState(false);

  // Network Outage & Maintenance Radar Modal State
  const [radarModalOpen, setRadarModalOpen] = useState(false);
  const [radarTab, setRadarTab] = useState<'pops' | 'area' | 'dns'>('pops');
  const [radarAreaQuery, setRadarAreaQuery] = useState('');
  const [radarAreaResult, setRadarAreaResult] = useState<any>(null);
  const [dnsTestDomain, setDnsTestDomain] = useState('');
  const [dnsTestResult, setDnsTestResult] = useState<any>(null);
  const [isDnsTesting, setIsDnsTesting] = useState(false);
  const [opticSimRebooting, setOpticSimRebooting] = useState(false);
  const [opticSimSuccess, setOpticSimSuccess] = useState<string | null>(null);

  // Language state (ID / EN) with persistent localStorage synchronization
  const [lang, setLang] = useState<'id' | 'en'>('id');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('audira_lang') as 'id' | 'en';
      if (stored === 'id' || stored === 'en') {
        setLang(stored);
        const trans = TRANSLATIONS[stored];
        setAiMessages([
          {
            sender: 'bot',
            text: trans.viraDefaultMsg,
            time: 'Just now',
            quickReplies: [
              trans.viraQuick1,
              trans.viraQuick2,
              trans.viraQuick3,
              trans.viraQuick4,
              trans.viraQuick5,
            ]
          }
        ]);
      }
    } catch {}
  }, []);

  const handleSetLang = (newLang: 'id' | 'en') => {
    setLang(newLang);
    try {
      localStorage.setItem('audira_lang', newLang);
    } catch {}
    setAiMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        const trans = TRANSLATIONS[newLang];
        return [
          {
            sender: 'bot',
            text: trans.viraDefaultMsg,
            time: 'Just now',
            quickReplies: [
              trans.viraQuick1,
              trans.viraQuick2,
              trans.viraQuick3,
              trans.viraQuick4,
              trans.viraQuick5,
            ]
          }
        ];
      }
      return prev;
    });
  };

  const t = TRANSLATIONS[lang];

  // Enterprise & Industry solutions state
  const [selectedIndustry, setSelectedIndustry] = useState<string>('finance');
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqData, setRfqData] = useState({
    company: '',
    picName: '',
    email: '',
    phone: '',
    bandwidth: '500 Mbps Leased Line',
    serviceType: 'Dedicated Internet (1:1)',
    locations: '',
    notes: '',
  });

  // AI Web Concierge (VIRA - Virtual Intelligent Route Assistant)
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{
    sender: 'bot' | 'user';
    text: string;
    time: string;
    quickReplies?: string[];
  }>>([
    {
      sender: 'bot',
      text: TRANSLATIONS.id.viraDefaultMsg,
      time: 'Just now',
      quickReplies: [
        TRANSLATIONS.id.viraQuick1,
        TRANSLATIONS.id.viraQuick2,
        TRANSLATIONS.id.viraQuick3,
        TRANSLATIONS.id.viraQuick4,
        TRANSLATIONS.id.viraQuick5,
      ]
    }
  ]);

  // Dual-mode registration state
  const [orderMode, setOrderMode] = useState<'online' | 'whatsapp'>('online');
  const [onlineStep, setOnlineStep] = useState<'form' | 'payment' | 'success'>('form');
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [onlineError, setOnlineError] = useState('');
  const [copiedVa, setCopiedVa] = useState(false);

  // Form registration state (legacy WhatsApp)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    packageId: 'home-50',
    notes: '',
  });

  // Online registration & payment state
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    packageId: 'home-50',
    paymentMethod: 'qris' as 'qris' | 'va_bca' | 'va_mandiri' | 'va_bni' | 'va_bri',
    notes: '',
  });

  const [orderResult, setOrderResult] = useState<{
    customer: any;
    invoice: any;
    ticket: any;
    payment: any;
    access_token: string;
  } | null>(null);

  const [qrisQrDataUrl, setQrisQrDataUrl] = useState<string>('');

  // Simulated live metrics ticker
  const [livePing, setLivePing] = useState({ iix: 2, sg: 11, dns: 1, jitter: '0.4' });

  // Initialize mount safety
  useEffect(() => {
    setMounted(true);

    const timer = setInterval(() => {
      setLivePing({
        iix: Math.floor(Math.random() * 2) + 1,
        sg: Math.floor(Math.random() * 3) + 10,
        dns: 1,
        jitter: (Math.random() * 0.3 + 0.2).toFixed(1),
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Live 10Gbps Speedtest Runner & Digital SLA Performance Certifier
  const handleRunSpeedtest = () => {
    setSpeedtesting(true);
    setSpeedtestProgress(0);
    setSpeedtestPhase('ping');
    setSpeedtestResults(null);

    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setSpeedtestProgress(Math.min(current, 100));

      if (current < 25) {
        setSpeedtestPhase('ping');
      } else if (current < 65) {
        setSpeedtestPhase('download');
      } else if (current < 95) {
        setSpeedtestPhase('upload');
      } else {
        setSpeedtestPhase('complete');
      }

      if (current >= 100) {
        clearInterval(interval);
        setSpeedtesting(false);
        const targetSpeed = simSpeed || 50;
        const dl = Number((targetSpeed * (0.96 + Math.random() * 0.08)).toFixed(2));
        const ul = Number((targetSpeed * (0.95 + Math.random() * 0.07)).toFixed(2));
        const p = Number((1.1 + Math.random() * 0.4).toFixed(1));
        const j = Number((0.2 + Math.random() * 0.2).toFixed(1));
        const randHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        setSpeedtestResults({
          ping: p,
          jitter: j,
          download: dl,
          upload: ul,
          server: 'NOC JKT-IX Core Edge (IDC Duren Tiga / Cyber Building 10G)',
          ip: '103.189.20.14 (AUDIRA AS139xxx)',
          date: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'medium' }),
          certId: `SLA-JKT-${Math.floor(100000 + Math.random() * 900000)}`,
          sha256: `SHA256:${randHex.toUpperCase()}`,
          complianceScore: '100% EXCELLENT (CARRIER GRADE A+)'
        });
      }
    }, 120);
  };

  // Network Outage & Customer Area Health Inspector
  const handleCheckAreaHealth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = radarAreaQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes('net') || q.includes('08') || !isNaN(Number(q))) {
      // Customer ID or phone lookup
      setRadarAreaResult({
        type: 'customer',
        identifier: radarAreaQuery.toUpperCase(),
        name: 'Pelanggan Residensial / Korporat',
        status: 'ONLINE',
        plan: 'Gamer Ultra 50 Mbps Simetris',
        rxPower: -19.45,
        txPower: 2.40,
        oltPort: 'OLT-JKT-01 // PON-03/08',
        bngNode: 'BRAS-East (103.189.20.1)',
        ontModel: 'ZTE F670L Dual-Band GPON',
        maintenanceNote: 'Tidak ada gangguan kabel fiber optik di jalur ODP rumah Anda. Jaringan 100% normal dan stabil.'
      });
    } else {
      // Area keyword search
      const matched = COVERAGE_DATA.find((c) => c.area.toLowerCase().includes(q)) || {
        area: radarAreaQuery,
        status: 'ready',
        odp: 32,
        note: 'Tersedia FO 100%'
      };
      setRadarAreaResult({
        type: 'area',
        area: matched.area,
        status: 'NORMAL',
        uptime: '99.98%',
        odpActive: matched.odp,
        latency: '1.2 ms',
        packetLoss: '0.00%',
        maintenanceNote: 'Seluruh tiang ODP dan kabel distribusi di wilayah ini beroperasi optimal tanpa gangguan massal.'
      });
    }
  };

  // Public DNS Filtering & TrustPositif Domain Inspector
  const handleTestDnsSecurity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const d = dnsTestDomain.trim().toLowerCase();
    if (!d) return;

    setIsDnsTesting(true);
    setDnsTestResult(null);

    setTimeout(() => {
      setIsDnsTesting(false);
      const isBlocked = 
        d.includes('judi') || 
        d.includes('slot') || 
        d.includes('bet') || 
        d.includes('porn') || 
        d.includes('bokep') || 
        d.includes('phishing') || 
        d.includes('cheat');

      if (isBlocked) {
        setDnsTestResult({
          domain: d,
          isBlocked: true,
          category: d.includes('judi') || d.includes('slot') ? 'Judi Online / Perjudian Ilegal' : d.includes('phishing') ? 'Phishing & Penipuan Perbankan' : 'Konten Asusila & Negatif',
          action: 'DIBLOKIR TRUSTPOSITIF KOMINFO',
          resolvedIp: '10.10.10.1 (Walled Garden Kominfo Sinkhole)',
          latency: '0.8 ms',
          regulasi: 'Permen Kominfo No. 5/2021 & UU ITE No. 1/2024'
        });
      } else {
        setDnsTestResult({
          domain: d,
          isBlocked: false,
          category: 'Aman & Terverifikasi (Whitelisted)',
          action: 'RESOLVED (CLEAN PIPE DIRECT FIBER)',
          resolvedIp: d.includes('google') ? '142.250.190.46' : d.includes('bca') ? '202.158.80.35' : '104.21.48.91',
          latency: '1.1 ms',
          regulasi: 'Standar Bersih Kominfo & APJII'
        });
      }
    }, 600);
  };

  // TR-069 Self-Healing Simulation
  const handleRadarRebootSim = () => {
    setOpticSimRebooting(true);
    setOpticSimSuccess(null);
    setTimeout(() => {
      setOpticSimRebooting(false);
      setOpticSimSuccess('Sinyal TR-069 Reboot berhasil dikirim. Modem ONT me-refresh alokasi port & cache DNS dalam 60 detik.');
    }, 1200);
  };

  const filteredPackages = useMemo(() => {
    return PACKAGES.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const filteredCoverage = useMemo(() => {
    if (!searchArea.trim()) return COVERAGE_DATA;
    return COVERAGE_DATA.filter((c) =>
      c.area.toLowerCase().includes(searchArea.toLowerCase())
    );
  }, [searchArea]);

  const handleSelectCategory = (cat: 'home' | 'business') => {
    setSelectedCategory(cat);
    const defaultPkg =
      PACKAGES.find((p) => p.category === cat && p.isPopular) ||
      PACKAGES.find((p) => p.category === cat) ||
      null;
    if (defaultPkg) {
      setSelectedPackage(defaultPkg);
      setFormData((prev) => ({ ...prev, packageId: defaultPkg.id }));
      setRegForm((prev) => ({ ...prev, packageId: defaultPkg.id }));
    }
  };

  const handleSelectPackageCard = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setFormData((prev) => ({ ...prev, packageId: pkg.id }));
    setRegForm((prev) => ({ ...prev, packageId: pkg.id }));
  };

  const handleOpenOrder = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setFormData((prev) => ({ ...prev, packageId: pkg.id }));
    setRegForm((prev) => ({ ...prev, packageId: pkg.id }));
    setOrderMode('online');
    setOnlineStep('form');
    setOnlineError('');
    setOrderResult(null);
    setQrisQrDataUrl('');
    setOrderModalOpen(true);
  };

  const handleOnlineOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnlineLoading(true);
    setOnlineError('');

    const pkg = PACKAGES.find((p) => p.id === regForm.packageId) || selectedPackage;
    const pkgName = pkg ? `${pkg.name} (${pkg.speed} Mbps)` : 'AudiraNET Package';
    const pkgPrice = pkg ? (billingCycle === 'yearly' ? pkg.monthlyPrice * 10 : pkg.monthlyPrice) : 285000;

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const response = await fetch(`${apiBase}/auth/customer/register-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: regForm.name,
          phone: regForm.phone,
          email: regForm.email,
          password: regForm.password,
          address: regForm.address,
          packageId: regForm.packageId,
          packageName: pkgName,
          price: pkgPrice,
          speed: pkg ? pkg.speed : 50,
          notes: regForm.notes,
          paymentMethod: regForm.paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Pendaftaran gagal diproses oleh server');
      }

      setOrderResult(data);

      // Generate dynamic QRIS QR Code
      if (data.payment?.qrisString) {
        try {
          const qrUrl = await QRCode.toDataURL(data.payment.qrisString, {
            width: 280,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          });
          setQrisQrDataUrl(qrUrl);
        } catch (err) {
          console.error('Failed to generate QR code:', err);
        }
      }

      // Auto save login token to localStorage
      if (data.access_token && data.customer) {
        try {
          localStorage.setItem('customer', JSON.stringify(data.customer));
          localStorage.setItem('token', data.access_token);
        } catch {}
      }

      setOnlineStep('payment');
    } catch (err: any) {
      setOnlineError(err.message || 'Terjadi kesalahan saat memproses pendaftaran');
    } finally {
      setOnlineLoading(false);
    }
  };

  const handleConfirmOnlinePayment = async () => {
    if (!orderResult?.invoice?.id) return;
    setOnlineLoading(true);
    setOnlineError('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const response = await fetch(`${apiBase}/auth/customer/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: orderResult.invoice.id,
          paymentMethod: regForm.paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal memverifikasi status pembayaran');
      }

      setOnlineStep('success');
    } catch (err: any) {
      setOnlineError(err.message || 'Terjadi kendala saat memeriksa pembayaran');
    } finally {
      setOnlineLoading(false);
    }
  };

  const handleCopyVa = (vaNumber: string) => {
    try {
      navigator.clipboard.writeText(vaNumber);
      setCopiedVa(true);
      setTimeout(() => setCopiedVa(false), 2500);
    } catch {}
  };

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = PACKAGES.find((p) => p.id === formData.packageId) || selectedPackage;
    const pkgName = pkg ? `${pkg.name} (${pkg.speed} Mbps)` : 'AudiraNET Package';
    const text = `Halo Admin AudiraNET ISP, saya ingin mendaftar Pasang Baru Internet:%0A%0A` +
      `👤 *Nama*: ${encodeURIComponent(formData.name)}%0A` +
      `📱 *No WhatsApp*: ${encodeURIComponent(formData.phone)}%0A` +
      `📦 *Paket*: ${encodeURIComponent(pkgName)}%0A` +
      `📍 *Alamat Pemasangan*: ${encodeURIComponent(formData.address)}%0A` +
      `📝 *Catatan*: ${encodeURIComponent(formData.notes || '-')}%0A%0A` +
      `Mohon cek ketersediaan jaringan di lokasi saya. Terima kasih!`;
    window.open(`https://wa.me/6282112001600?text=${text}`, '_blank');
    setOrderModalOpen(false);
  };

  const handleSendRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Tim Enterprise Sales AudiraNET,%0A%0A` +
      `Saya ingin mengajukan *Request for Quote (RFQ) B2B Enterprise*:%0A%0A` +
      `🏢 *Perusahaan*: ${encodeURIComponent(rfqData.company)}%0A` +
      `👤 *PIC & Jabatan*: ${encodeURIComponent(rfqData.picName)}%0A` +
      `📱 *WhatsApp*: ${encodeURIComponent(rfqData.phone)}%0A` +
      `✉️ *Email Korporat*: ${encodeURIComponent(rfqData.email)}%0A` +
      `⚡ *Kapasitas Bandwidth*: ${encodeURIComponent(rfqData.bandwidth)}%0A` +
      `🛡️ *Kategori Layanan*: ${encodeURIComponent(rfqData.serviceType)}%0A` +
      `📍 *Lokasi Pemasangan*: ${encodeURIComponent(rfqData.locations)}%0A` +
      `📝 *Catatan Khusus SLA/Topologi*: ${encodeURIComponent(rfqData.notes || '-')}%0A%0A` +
      `Mohon tim Account Manager menghubungi kami untuk proposal penawaran resmi. Terima kasih.`;
    window.open(`https://wa.me/6282112001600?text=${text}`, '_blank');
    setRfqModalOpen(false);
  };

  const handleAiSendMessage = (overrideText?: string) => {
    const messageToSend = (overrideText || aiInput).trim();
    if (!messageToSend) return;

    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: messageToSend, time: timeNow };

    const lower = messageToSend.toLowerCase();
    let replyText = '';
    let quickReplies: string[] | undefined = undefined;

    if (lower.includes('paket') || lower.includes('harga') || lower.includes('biaya')) {
      replyText = 'AudiraNET menyediakan paket Fiber Optic 100% simetris 1:1 tanpa batas FUP:\n• Starter 20 Mbps: Rp 175.000/bln\n• Gamer Ultra 50 Mbps (Favorit): Rp 285.000/bln\n• Pro Streamer 100 Mbps: Rp 450.000/bln\n• Bisnis Dedicated 100-300 Mbps: Mulai Rp 850.000/bln.\n\nAnda bisa klik tombol di bawah untuk melihat pilihan paket.';
      quickReplies = ['Pilih Paket Gamer 50M', 'Minta Penawaran B2B (RFQ)', 'Cek Jangkauan ODP'];
    } else if (lower.includes('jangkauan') || lower.includes('odp') || lower.includes('area') || lower.includes('lokasi')) {
      replyText = 'Jaringan Fiber Optic AudiraNET aktif di Jakarta Timur (Cakung, Duren Sawit, Klender), Bekasi (Bintara, Harapan Indah, Galaxy), Depok, Bogor, dan Tangerang. Gunakan kolom pencarian di menu "Cek Jangkauan" untuk verifikasi ketersediaan tiang ODP.';
      quickReplies = ['Buka Cek Jangkauan', 'Hubungi CS WhatsApp', 'Cek Paket Internet & Harga'];
    } else if (lower.includes('sla') || lower.includes('korporat') || lower.includes('b2b') || lower.includes('enterprise') || lower.includes('perbankan')) {
      replyText = 'Untuk B2B Enterprise, AudiraNET menyediakan Dedicated Leased Line 1:1, sub-millisecond peering ke OpenIXP/IIX, Clean Pipe Anti-DDoS, dan garansi SLA finansial tertulis hingga 99.99%. Anda dapat mengajukan Request for Quote (RFQ) resmi sekarang.';
      quickReplies = ['Minta Penawaran B2B (RFQ)', 'Solusi Vertikal Industri', 'Hubungi Tim NOC 24/7'];
    } else if (lower.includes('noc') || lower.includes('cs') || lower.includes('hubungi') || lower.includes('kontak') || lower.includes('whatsapp')) {
      replyText = 'Tim NOC & Helpdesk AudiraNET siaga 24/7 di WhatsApp hotline +62 821-1200-1600 atau email agusdwirianto@gmail.com. Kami selalu siap membantu eskalasi jaringan dan konsultasi teknis.';
      quickReplies = ['Chat WhatsApp Sekarang', 'Cek Paket Internet & Harga', 'Minta Penawaran B2B (RFQ)'];
    } else if (lower.includes('rfq') || lower.includes('penawaran') || lower.includes('proposal')) {
      setRfqModalOpen(true);
      replyText = 'Formulir Request for Quote (RFQ) B2B Enterprise telah dibuka di layar Anda. Silakan lengkapi detail kebutuhan kapasitas bandwidth dan kebutuhan korporat Anda.';
      quickReplies = ['Solusi Vertikal Industri', 'Standar ISO & SLA 99.9%', 'Chat WhatsApp Sekarang'];
    } else {
      replyText = 'Terima kasih atas pertanyaannya! Tim AudiraNET menyediakan konektivitas fiber optik murni 1:1, solusi cloud & colocation tier-3, serta layanan managed security untuk rumah dan korporasi. Ada yang ingin Anda ketahui lebih lanjut?';
      quickReplies = ['Cek Paket Internet & Harga', 'Solusi Vertikal Industri', 'Minta Penawaran B2B (RFQ)', 'Chat WhatsApp Sekarang'];
    }

    setAiMessages((prev) => [
      ...prev,
      userMsg,
      {
        sender: 'bot',
        text: replyText,
        time: timeNow,
        quickReplies,
      },
    ]);
    setAiInput('');
  };

  const handleFooterPackageClick = (pkgId: string, category: 'home' | 'business') => {
    setSelectedCategory(category);
    const pkg = PACKAGES.find((p) => p.id === pkgId);
    if (pkg) {
      handleOpenOrder(pkg);
    } else {
      window.location.hash = '#paket';
    }
  };

  // Speed simulator calculations
  // Speed simulator calculations
  const simCalculations = useMemo(() => {
    const mbps = simSpeed;
    const mbPerSec = mbps / 8;
    const game50GbSec = (50 * 1024) / mbPerSec;
    const gameMin = Math.round(game50GbSec / 60);
    const upload10GbSec = (10 * 1024) / mbPerSec;
    const uploadMin = Math.round(upload10GbSec / 60);
    const streams4k = Math.max(1, Math.floor(mbps / 20));

    return {
      gameMin: gameMin < 60 ? `${gameMin} ${t.simMinute}` : `${(gameMin / 60).toFixed(1)} ${t.simHour}`,
      uploadMin: uploadMin < 60 ? `${uploadMin} ${t.simMinute}` : `${(uploadMin / 60).toFixed(1)} ${t.simHour}`,
      streams4k: `${streams4k} ${t.simDevices}`,
    };
  }, [simSpeed, t]);

  return (
    <>
      <Head>
        <title>{lang === 'id' ? 'AudiraNET — Internet Fiber Ultra Cepat Tanpa FUP & Layanan ISP Terpercaya' : 'AudiraNET — Ultra-Fast Fiber Internet Without FUP & Enterprise ISP'}</title>
        <meta
          name="description"
          content={lang === 'id' ? 'Nikmati internet fiber optic simetris 1:1 tanpa batas kuota FUP dari AudiraNET. Low latency gaming, streaming 4K, dan support NOC 24/7.' : 'Experience 1:1 symmetrical high-speed fiber internet without quota caps from AudiraNET. Low latency gaming, 4K streaming, and 24/7 NOC.'}
        />
        <meta name="keywords" content="ISP, Internet Fiber, AudiraNET, Pasang Wifi, Internet Tanpa FUP, Internet Cepat, Mikrotik ISP" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 font-sans selection:bg-cyan-400 selection:text-black transition-colors duration-200">
        {/* TOP STATUS BAR (High-Tech NOC Pulse) */}
        <div className="bg-slate-200 dark:bg-[#0b1220] border-b border-slate-300 dark:border-gray-800 text-xs py-2 px-4 transition-colors">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 font-mono text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 sm:gap-3 truncate">
              <button
                type="button"
                onClick={() => { setRadarModalOpen(true); setRadarTab('pops'); }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-400 font-bold shrink-0 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-all cursor-pointer shadow-xs"
                title="Klik untuk membuka Radar Gangguan & Status Jaringan"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                <span>{t.nocStatus}</span>
                <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-mono uppercase ml-1">RADAR LIVE</span>
              </button>
              <span className="hidden xl:inline text-slate-600 dark:text-gray-400 truncate">
                {t.peeringRoute}
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-5 text-slate-600 dark:text-gray-400 shrink-0">
              <a
                href="https://wa.me/6282112001600"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>{t.waCs}</span>
              </a>
              <Link
                href="/login"
                className="text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.navPortal}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* NAVIGATION BAR (Symmetrical 3-Column Layout: Dead-Centered with Guaranteed Zero Overlap) */}
        <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#070b14]/90 backdrop-blur-md border-b-2 border-slate-300 dark:border-gray-800 transition-colors">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Left: Brand Logo (Symmetrically balanced width) */}
            <div className="flex items-center shrink-0 w-auto xl:w-[260px]">
              <Link href="/" className="flex items-center gap-3 shrink-0 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white rounded-xl shadow-sm flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-all">
                  <Wifi className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </div>
                <div className="shrink-0">
                  <span className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-950 dark:text-white leading-none">
                    Audira<span className="text-cyan-500 dark:text-cyan-400">NET</span>
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-500 dark:text-gray-400 -mt-0.5 uppercase">
                    Fiber Broadband ISP
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links (Dead-Centered via Flex-1, Zero Overlap Guaranteed) */}
            <div className="hidden xl:flex items-center justify-center flex-1 gap-4 2xl:gap-6 text-xs 2xl:text-[13px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 px-2">
              <a href="#paket" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2 px-1 whitespace-nowrap">{t.navPlans}</a>
              <a href="#solusi-industri" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2 px-1 whitespace-nowrap">{t.navIndustry}</a>
              <a href="#enterprise" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2 px-1 whitespace-nowrap">{t.navEnterprise}</a>
              <a href="#kepatuhan" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2 px-1 whitespace-nowrap">{t.navSla}</a>
              <a href="#jangkauan" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2 px-1 whitespace-nowrap">{t.navCoverage}</a>
              <a href="#simulator" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2 px-1 whitespace-nowrap">{lang === 'id' ? 'Speedtest & Simulasi' : 'Speedtest & Tools'}</a>
              <a href="#faq" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2 px-1 whitespace-nowrap">{t.navFaq}</a>
            </div>

            {/* Right: Actions, Language Switcher, Theme & Pasang Baru (Symmetrically balanced width) */}
            <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 w-auto xl:w-[260px]">
              {/* Interactive Segmented Language Switcher Pill Toggle */}
              <div className="inline-flex items-center p-0.5 rounded-lg border-2 border-black dark:border-gray-700 bg-slate-100 dark:bg-[#0e1626] shadow-[2px_2px_0px_#000] shrink-0 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSetLang('id')}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-black transition-all shrink-0 cursor-pointer ${
                    lang === 'id'
                      ? 'bg-cyan-400 text-black shadow-sm'
                      : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                  title="Ganti ke Bahasa Indonesia"
                >
                  🇮🇩 ID
                </button>
                <button
                  type="button"
                  onClick={() => handleSetLang('en')}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-black transition-all shrink-0 cursor-pointer ${
                    lang === 'en'
                      ? 'bg-cyan-400 text-black shadow-sm'
                      : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  🇬🇧 EN
                </button>
              </div>

              {/* Dark/Light Mode Switcher */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark and Light Mode"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 border-black dark:border-gray-700 bg-slate-100 dark:bg-[#0e1626] hover:bg-slate-200 dark:hover:bg-gray-800 shadow-[2px_2px_0px_#000] flex items-center justify-center text-slate-800 dark:text-cyan-300 transition-all shrink-0 cursor-pointer"
              >
                {mounted && theme === 'light' ? (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-800" />
                ) : (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                )}
              </button>

              {/* Pasang Baru CTA Button */}
              <a
                href="#paket"
                className="hidden sm:inline-flex px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] text-xs font-black uppercase tracking-wider transition-all items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-black stroke-black" />
                <span>{t.navRegister}</span>
              </a>

              {/* Mobile Menu Hamburger Button (Visible on screens < xl) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg border-2 border-black dark:border-gray-700 bg-slate-100 dark:bg-[#0e1626] text-slate-800 dark:text-cyan-300 shadow-[2px_2px_0px_#000] transition-all shrink-0 cursor-pointer"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="xl:hidden border-t-2 border-slate-300 dark:border-gray-800 bg-white dark:bg-[#070b14] px-4 pt-3 pb-6 space-y-3 shadow-2xl">
              {/* Mobile Language Switcher Pill */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-800">
                <span className="font-mono text-xs font-bold uppercase text-slate-600 dark:text-gray-400">
                  {lang === 'id' ? 'Bahasa / Language:' : 'Language / Bahasa:'}
                </span>
                <div className="inline-flex items-center p-0.5 rounded-lg border-2 border-black dark:border-gray-700 bg-slate-100 dark:bg-[#0e1626] shadow-[2px_2px_0px_#000]">
                  <button
                    type="button"
                    onClick={() => handleSetLang('id')}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-black ${
                      lang === 'id' ? 'bg-cyan-400 text-black' : 'text-slate-600 dark:text-gray-400'
                    }`}
                  >
                    🇮🇩 ID
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetLang('en')}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-black ${
                      lang === 'en' ? 'bg-cyan-400 text-black' : 'text-slate-600 dark:text-gray-400'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-1 font-mono text-xs font-bold uppercase">
                <a
                  href="#paket"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{t.navPlans}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
                <a
                  href="#solusi-industri"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{t.navIndustry}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
                <a
                  href="#enterprise"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{t.navEnterprise}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
                <a
                  href="#kepatuhan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{t.navSla}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
                <a
                  href="#jangkauan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{t.navCoverage}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
                <a
                  href="#simulator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{t.navSimulator}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
                <a
                  href="#keunggulan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{t.navTech}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{t.navFaq}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-gray-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setRfqModalOpen(true);
                  }}
                  className="w-full text-center py-2.5 rounded-lg border-2 border-black dark:border-cyan-400 bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.navRfq}</span>
                </button>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border-2 border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-[#0e1626] text-slate-800 dark:text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.navPortal}</span>
                </Link>
                <a
                  href="http://localhost:3217"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2.5 rounded-lg border-2 border-slate-300 dark:border-gray-700 bg-white dark:bg-[#0e1626] text-slate-700 dark:text-gray-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>Dashboard Admin ISP</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://wa.me/6282112001600"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>Chat WhatsApp (+62 821-1200-1600)</span>
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b-2 border-slate-300 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline & Call To Action */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white dark:bg-[#0e1626] border-2 border-cyan-500 dark:border-cyan-400/60 shadow-[3px_3px_0px_#00dfd8]">
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-mono font-black text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                    {t.heroBadge}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white leading-[1.08] tracking-tight uppercase">
                  {t.heroTitlePre} <span className="text-cyan-600 dark:text-cyan-400 underline decoration-cyan-400 decoration-4">{t.heroTitleHighlight}</span> {t.heroTitlePost}
                </h1>

                <p className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed max-w-2xl font-normal">
                  {t.heroDesc}
                </p>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="#paket"
                    className="px-7 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-sm border-2 border-black shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_#000] transition-all flex items-center gap-2"
                  >
                    <span>{t.heroCtaPlans}</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </a>

                  <a
                    href="#jangkauan"
                    className="px-7 py-4 rounded-xl bg-white dark:bg-[#0e1626] hover:bg-slate-100 dark:hover:bg-[#152033] text-slate-900 dark:text-white font-bold uppercase tracking-wider text-sm border-2 border-black dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-[5px_5px_0px_#000] transition-all flex items-center gap-2"
                  >
                    <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <span>{t.heroCtaCoverage}</span>
                  </a>
                </div>

                {/* Feature Checkpoints */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-300 dark:border-gray-800 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{t.heroCheckFup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{t.heroCheckSpeed}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{t.heroCheckRouter}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive NOC Telemetry Widget */}
              <div className="lg:col-span-5">
                <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[8px_8px_0px_#000] relative">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"></div>
                      <span className="font-mono font-bold text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        {t.telemetryTitle}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400">{t.telemetryUpdated}</span>
                  </div>

                  {/* Telemetry Metric Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-100 dark:bg-[#070b14] p-3.5 rounded-xl border border-slate-300 dark:border-gray-800">
                      <span className="text-[11px] font-mono text-slate-600 dark:text-gray-400 block uppercase">LATENCY OPENIXP</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{livePing.iix}</span>
                        <span className="text-xs font-mono text-slate-500 dark:text-gray-400">ms</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400/90 font-mono">● Zero Packet Loss</span>
                    </div>

                    <div className="bg-slate-100 dark:bg-[#070b14] p-3.5 rounded-xl border border-slate-300 dark:border-gray-800">
                      <span className="text-[11px] font-mono text-slate-600 dark:text-gray-400 block uppercase">SGIX SINGAPORE</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">{livePing.sg}</span>
                        <span className="text-xs font-mono text-slate-500 dark:text-gray-400">ms</span>
                      </div>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400/90 font-mono">● Gaming Priority Route</span>
                    </div>

                    <div className="bg-slate-100 dark:bg-[#070b14] p-3.5 rounded-xl border border-slate-300 dark:border-gray-800">
                      <span className="text-[11px] font-mono text-slate-600 dark:text-gray-400 block uppercase">CLOUDFLARE DNS</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">{livePing.dns}</span>
                        <span className="text-xs font-mono text-slate-500 dark:text-gray-400">ms</span>
                      </div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400/90 font-mono">● Anycast Node Jakarta</span>
                    </div>

                    <div className="bg-slate-100 dark:bg-[#070b14] p-3.5 rounded-xl border border-slate-300 dark:border-gray-800">
                      <span className="text-[11px] font-mono text-slate-600 dark:text-gray-400 block uppercase">JITTER STABILITY</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-amber-600 dark:text-yellow-400 font-mono">{livePing.jitter}</span>
                        <span className="text-xs font-mono text-slate-500 dark:text-gray-400">ms</span>
                      </div>
                      <span className="text-[10px] text-amber-600 dark:text-yellow-400/90 font-mono">● Ultra Stable Fiber</span>
                    </div>
                  </div>

                  {/* Visual Speed Dial Preview */}
                  <div className="mt-5 p-4 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase">{t.favPackage}</p>
                      <h4 className="text-lg font-black text-slate-950 dark:text-white uppercase">{t.favName}</h4>
                      <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">Rp {formatNumber(285000)} {t.perMonth}</p>
                    </div>
                    <button
                      onClick={() => handleOpenOrder(PACKAGES[1])}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs rounded-lg border-2 border-black shadow-[3px_3px_0px_#000]"
                    >
                      {t.orderBtn}
                    </button>
                  </div>

                  {/* Trust Quote */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-800 flex items-center gap-3 text-xs text-slate-600 dark:text-gray-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{t.guaranteeQuote}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PEERING & GLOBAL CARRIERS MARQUEE (Carrier-Grade Tier-1 Connectivity) */}
        <section className="bg-slate-100 dark:bg-[#060a12] border-b-2 border-slate-300 dark:border-gray-800 py-6 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-cyan-400">
                {t.peeringTitle}
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] font-mono text-slate-500 dark:text-gray-500">
              {t.peeringSubtitle}
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {PEERING_PARTNERS.map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0e1626] border border-slate-300 dark:border-gray-800/80 hover:border-cyan-400 rounded-lg p-2.5 flex flex-col justify-between transition-all group hover:-translate-y-0.5"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-400 transition-colors">
                    {partner.name}
                  </span>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-gray-400">
                    <span className="truncate">{partner.type}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">{partner.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE BANDWIDTH SIMULATOR */}
        <section id="simulator" className="scroll-mt-24 py-20 bg-slate-100 dark:bg-[#0a0f1d] border-b-2 border-slate-300 dark:border-gray-800 relative transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {t.simTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.simTitle}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
                {t.simDesc}
              </p>
            </div>

            {/* Dual Mode Switcher: Simulator vs Speedtest SLA */}
            <div className="flex justify-center mt-10 mb-2">
              <div className="inline-flex p-1.5 bg-slate-200 dark:bg-[#070b14] border-2 border-black dark:border-gray-700 rounded-xl shadow-[3px_3px_0px_#000]">
                <button
                  type="button"
                  onClick={() => setToolTab('simulator')}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-mono text-xs font-black uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    toolTab === 'simulator'
                      ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                      : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{t.simTabSimulator}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setToolTab('speedtest')}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-mono text-xs font-black uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    toolTab === 'speedtest'
                      ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                      : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Gauge className="w-4 h-4" />
                  <span>{t.simTabSpeedtest}</span>
                  <span className="hidden sm:inline px-1.5 py-0.2 bg-emerald-500 text-white rounded text-[9px] font-bold">10G</span>
                </button>
              </div>
            </div>

            {toolTab === 'simulator' ? (
              <div className="mt-6 max-w-4xl mx-auto bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-10 shadow-[8px_8px_0px_#000]">
                {/* Slider Controller */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-600 dark:text-gray-400 uppercase font-bold">{t.simSelect}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400 font-mono">{simSpeed}</span>
                      <span className="text-sm font-mono text-slate-600 dark:text-gray-400">Mbps</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="10"
                    value={simSpeed}
                    onChange={(e) => setSimSpeed(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 border border-slate-300 dark:border-gray-700"
                  />

                  {/* Interactive Preset Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {[
                      { speed: 20, label: '20 Mbps (Starter)', pkgId: 'home-20', cat: 'home' },
                      { speed: 50, label: '50 Mbps (Gamer)', pkgId: 'home-50', cat: 'home' },
                      { speed: 100, label: '100 Mbps (Pro)', pkgId: 'home-100', cat: 'home' },
                      { speed: 300, label: '300 Mbps (Enterprise)', pkgId: 'biz-300', cat: 'business' },
                    ].map((preset) => {
                      const isCurrent = simSpeed === preset.speed;
                      return (
                        <button
                          key={preset.speed}
                          type="button"
                          onClick={() => {
                            setSimSpeed(preset.speed);
                            const matchedPkg = PACKAGES.find((p) => p.id === preset.pkgId);
                            if (matchedPkg) {
                              setSelectedCategory(preset.cat as 'home' | 'business');
                              setSelectedPackage(matchedPkg);
                              setFormData((prev) => ({ ...prev, packageId: matchedPkg.id }));
                              setRegForm((prev) => ({ ...prev, packageId: matchedPkg.id }));
                            }
                          }}
                          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all border-2 text-center cursor-pointer ${
                            isCurrent
                              ? 'bg-cyan-400 text-black border-black shadow-[2px_2px_0px_#000]'
                              : 'bg-slate-100 dark:bg-[#070b14] text-slate-600 dark:text-gray-400 border-slate-300 dark:border-gray-800 hover:border-cyan-400'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulation Result Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-gray-800">
                  <div className="bg-slate-100 dark:bg-[#070b14] p-5 rounded-xl border border-slate-300 dark:border-gray-800">
                    <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-950/70 border border-cyan-400 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mb-3">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-gray-400 block uppercase font-bold">{t.simDownload}</span>
                    <p className="text-2xl font-black text-slate-950 dark:text-white font-mono mt-1">{simCalculations.gameMin}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">{t.simDownloadSub}</p>
                  </div>

                  <div className="bg-slate-100 dark:bg-[#070b14] p-5 rounded-xl border border-slate-300 dark:border-gray-800">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/70 border border-purple-400 dark:border-purple-500/40 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-gray-400 block uppercase font-bold">{t.simUpload}</span>
                    <p className="text-2xl font-black text-slate-950 dark:text-white font-mono mt-1">{simCalculations.uploadMin}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">{t.simUploadSub}</p>
                  </div>

                  <div className="bg-slate-100 dark:bg-[#070b14] p-5 rounded-xl border border-slate-300 dark:border-gray-800">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-400 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-gray-400 block uppercase font-bold">{t.simStream}</span>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{simCalculations.streams4k}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">{t.simStreamSub}</p>
                  </div>
                </div>

                {/* Simulator Action to Package */}
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <span className="text-slate-600 dark:text-gray-400">
                    {lang === 'id' ? `Kecepatan ${simSpeed} Mbps cocok dengan rekomendasi paket AudiraNET.` : `Speed of ${simSpeed} Mbps matches an official AudiraNET package.`}
                  </span>
                  <a
                    href="#paket"
                    className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs border border-black shadow-[2px_2px_0px_#000] inline-flex items-center gap-1.5"
                  >
                    <span>{lang === 'id' ? 'Lihat Pilihan Paket ➔' : 'View Package Options ➔'}</span>
                  </a>
                </div>
              </div>
            ) : (
              /* LIVE 10G SPEEDTEST & SLA CERTIFICATION STUDIO */
              <div className="mt-6 max-w-4xl mx-auto bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-10 shadow-[8px_8px_0px_#000] space-y-6">
                {/* Speedtest Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-gray-800 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block">
                      SERVER NODE CARRIER EDGE 10G
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">
                      NOC JKT-IX (Direct Fiber Tier-3)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                      IDC Duren Tiga / Cyber Building 1 • OpenIXP & IIX Peering 1:1
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl font-mono text-xs space-y-1 shrink-0">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500 text-[10px] uppercase">Client IP:</span>
                      <span className="font-bold text-slate-900 dark:text-white">103.189.20.14</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500 text-[10px] uppercase">Carrier AS:</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">AS139xxx (AUDIRA-NET)</span>
                    </div>
                  </div>
                </div>

                {/* Live Speed Gauge & Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono text-center">
                  <div className="p-4 bg-slate-50 dark:bg-[#070b14] rounded-xl border border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">LATENSI PING</span>
                    <span className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
                      {speedtestResults?.ping ? `${speedtestResults.ping}` : speedtesting ? '1.2' : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">ms</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-[#070b14] rounded-xl border border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">JITTER</span>
                    <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                      {speedtestResults?.jitter ? `${speedtestResults.jitter}` : speedtesting ? '0.3' : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">ms</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-[#070b14] rounded-xl border border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1 flex items-center justify-center gap-1">
                      <Download className="w-3 h-3 text-emerald-500" /> DOWNLOAD
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {speedtestResults?.download ? `${speedtestResults.download}` : speedtesting ? ((speedtestProgress / 100) * simSpeed).toFixed(1) : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Mbps</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-[#070b14] rounded-xl border border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1 flex items-center justify-center gap-1">
                      <Upload className="w-3 h-3 text-blue-500" /> UPLOAD
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                      {speedtestResults?.upload ? `${speedtestResults.upload}` : speedtesting && speedtestPhase === 'upload' ? ((speedtestProgress / 100) * simSpeed).toFixed(1) : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Mbps</span>
                  </div>
                </div>

                {/* Progress Bar (during test) */}
                {speedtesting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                        {speedtestPhase === 'ping' && 'Mengukur Handshake & Latensi Ping...'}
                        {speedtestPhase === 'download' && 'Mengukur Throughput Download Carrier...'}
                        {speedtestPhase === 'upload' && 'Mengukur Throughput Upload Simetris 1:1...'}
                        {speedtestPhase === 'complete' && 'Memvalidasi Sertifikat Digital SLA...'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{speedtestProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden border border-slate-300 dark:border-gray-700">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 transition-all duration-150"
                        style={{ width: `${speedtestProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {!speedtesting && !speedtestResults && (
                    <button
                      type="button"
                      onClick={handleRunSpeedtest}
                      className="w-full sm:w-auto px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gauge className="w-4 h-4 stroke-[2.5]" />
                      <span>⚡ Mulai Uji Kecepatan 10Gbps Sekarang</span>
                    </button>
                  )}

                  {speedtestResults && !speedtesting && (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-black">
                          <Check className="w-6 h-6 stroke-[3]" />
                        </div>
                        <div>
                          <div className="font-mono font-black text-sm text-slate-900 dark:text-white">
                            Uji Kecepatan Berhasil • Skor SLA 100%
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                            Sertifikat ID: {speedtestResults.certId}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setSlaCertModalOpen(true)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Buka Sertifikat SLA</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRunSpeedtest}
                          className="px-4 py-2.5 bg-white dark:bg-[#070b14] hover:bg-slate-100 text-slate-800 dark:text-white font-mono text-xs font-bold rounded-xl border border-slate-300 dark:border-gray-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ulangi</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                    Standar Pengujian: IETF RFC 2544 / RFC 6349 Telco Compliance
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: PRICING & PACKAGES */}
        <section id="paket" className="scroll-mt-24 py-24 border-b-2 border-slate-300 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {t.pkgTag}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.pkgTitle}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
                {t.pkgDesc}
              </p>

              {/* Toggle Category & Billing Cycle */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                {/* Category Switcher */}
                <div className="inline-flex p-1 bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-xl shadow-[3px_3px_0px_#000]">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('home')}
                    className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedCategory === 'home'
                        ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                        : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {t.catHome}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('business')}
                    className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedCategory === 'business'
                        ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                        : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {t.catBusiness}
                  </button>
                </div>

                {/* Billing Cycle Switcher */}
                <div className="inline-flex p-1 bg-white dark:bg-[#0e1626] border border-slate-300 dark:border-gray-800 rounded-xl items-center shadow-sm">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-cyan-500 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {t.billMonthly}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'yearly'
                        ? 'bg-emerald-500 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>{t.billYearly}</span>
                    <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-black">
                      {t.save2Months}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className={`mt-14 grid grid-cols-1 md:grid-cols-2 ${filteredPackages.length > 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-4xl mx-auto'} gap-8 items-stretch`}>
              {filteredPackages.map((pkg) => {
                const isSelected = selectedPackage ? selectedPackage.id === pkg.id : pkg.isPopular;
                const price =
                  billingCycle === 'yearly'
                    ? Math.round((pkg.monthlyPrice * 10) / 12)
                    : pkg.monthlyPrice;

                return (
                  <div
                    key={pkg.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectPackageCard(pkg)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPackageCard(pkg);
                      }
                    }}
                    className={`group relative bg-white dark:bg-[#0e1626] border-2 rounded-2xl p-7 flex flex-col justify-between transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-cyan-500 dark:border-cyan-400 shadow-[8px_8px_0px_#00dfd8] ring-4 ring-cyan-400/30 -translate-y-1'
                        : 'border-black dark:border-gray-800 shadow-[6px_6px_0px_#000] hover:border-cyan-400/80 hover:shadow-[8px_8px_0px_rgba(0,223,216,0.25)] hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <div className="absolute -top-3.5 right-6 px-3 py-1 bg-cyan-400 text-black text-[10px] font-mono font-black uppercase tracking-wider rounded-md border-2 border-black shadow-[2px_2px_0px_#000]">
                        {pkg.badge}
                      </div>
                    )}

                    <div>
                      {/* Selection Radio Indicator Header */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-400 text-black shadow-sm'
                                : 'border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 text-transparent group-hover:border-cyan-400'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                          </div>
                          <span
                            className={`text-xs font-mono font-black uppercase tracking-wider transition-colors ${
                              isSelected
                                ? 'text-cyan-600 dark:text-cyan-400'
                                : 'text-slate-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'
                            }`}
                          >
                            {isSelected
                              ? (lang === 'id' ? 'PAKET DIPILIH' : 'SELECTED')
                              : (lang === 'id' ? 'KLIK UNTUK MEMILIH' : 'CLICK TO SELECT')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold shrink-0">
                          <Zap className="w-3.5 h-3.5 fill-cyan-500" />
                          <span>FIBER 1:1</span>
                        </div>
                      </div>

                      {/* Package Name & Speed */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-gray-400 tracking-wider">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-5xl font-black text-slate-950 dark:text-white font-mono">{pkg.speed}</span>
                        <span className="text-lg font-mono text-cyan-600 dark:text-cyan-400 font-bold">Mbps</span>
                      </div>

                      <p className="mt-3 text-xs text-slate-600 dark:text-gray-300 leading-relaxed min-h-[40px]">
                        {pkg.description}
                      </p>

                      {/* Price Section */}
                      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-gray-800">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-mono text-slate-500 dark:text-gray-400">Rp</span>
                          <span className="text-3xl font-black text-slate-950 dark:text-white font-mono">
                            {formatNumber(price)}
                          </span>
                          <span className="text-xs font-mono text-slate-500 dark:text-gray-400">{t.perMonth}</span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block mt-1 font-bold">
                            {lang === 'id' ? `Ditagih tahunan (Rp ${formatNumber(pkg.monthlyPrice * 10)}/thn)` : `Billed annually (Rp ${formatNumber(pkg.monthlyPrice * 10)}/yr)`}
                          </span>
                        )}
                      </div>

                      {/* Feature Bullet Points */}
                      <ul className="mt-6 space-y-3 text-xs font-medium text-slate-700 dark:text-gray-300">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8 pt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenOrder(pkg);
                        }}
                        className={`w-full py-3.5 px-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 border-2 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-white border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000]'
                            : 'bg-slate-100 hover:bg-cyan-50 text-slate-800 border-slate-300 dark:bg-slate-800 dark:hover:bg-gray-800 dark:text-white dark:border-slate-700 shadow-sm hover:border-cyan-400'
                        }`}
                      >
                        <span>
                          {isSelected
                            ? (lang === 'id' ? `Daftar Paket Ini (${pkg.name})` : `Order This Plan (${pkg.name})`)
                            : (lang === 'id' ? `Pilih Paket Ini (${pkg.name})` : `Select This Plan (${pkg.name})`)}
                        </span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Selected Package Summary Bar */}
            {selectedPackage && (
              <div className="mt-10 max-w-4xl mx-auto p-4 sm:p-5 bg-cyan-50/70 dark:bg-cyan-950/30 border-2 border-cyan-500 dark:border-cyan-400 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-cyan-400 text-black flex items-center justify-center font-black border-2 border-black shadow-[2px_2px_0px_#000] shrink-0">
                    <Zap className="w-6 h-6 fill-black" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-widest block">
                      {lang === 'id' ? 'STATUS: PAKET BERHASIL DIPILIH' : 'STATUS: PLAN SELECTED'}
                    </span>
                    <div className="font-mono font-black text-slate-950 dark:text-white text-base sm:text-lg flex flex-wrap items-center gap-2 mt-0.5">
                      <span>{selectedPackage.name}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-400 text-black text-xs font-bold">
                        {selectedPackage.speed} Mbps
                      </span>
                      <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                        • Rp {formatNumber(billingCycle === 'yearly' ? Math.round((selectedPackage.monthlyPrice * 10) / 12) : selectedPackage.monthlyPrice)} / {t.perMonth.replace('/', '').trim()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenOrder(selectedPackage)}
                  className="px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>{lang === 'id' ? 'Lanjut Pasang Baru Sekarang ➔' : 'Proceed With Registration ➔'}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: COVERAGE AREA CHECKER */}
        <section id="jangkauan" className="scroll-mt-24 py-24 bg-slate-100 dark:bg-[#0a0f1d] border-b-2 border-slate-300 dark:border-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                  {t.covTag}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                  {t.covTitle}
                </h2>
                <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t.covDesc}
                </p>

                {/* Search Input Box */}
                <div className="pt-2">
                  <label htmlFor="area-search" className="block text-xs font-mono uppercase text-slate-600 dark:text-gray-400 mb-2 font-bold">
                    {lang === 'id' ? 'Cari Wilayah / Kecamatan / Kota:' : 'Search Sub-District / City / Area:'}
                  </label>
                  <div className="relative">
                    <input
                      id="area-search"
                      type="text"
                      value={searchArea}
                      onChange={(e) => setSearchArea(e.target.value)}
                      placeholder={t.covSearchPlaceholder}
                      className="w-full bg-white dark:bg-[#070b14] border-2 border-slate-400 dark:border-gray-700 rounded-xl px-4 py-3.5 pl-11 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm font-sans"
                    />
                    <MapPin className="w-5 h-5 text-slate-400 dark:text-gray-400 absolute left-3.5 top-3.5" />
                    {searchArea && (
                      <button
                        onClick={() => setSearchArea('')}
                        className="text-xs text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white absolute right-3.5 top-4 font-mono font-bold"
                      >
                        RESET
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 text-xs text-slate-600 dark:text-gray-400 space-y-1 shadow-[3px_3px_0px_#000]">
                  <p className="font-bold text-slate-900 dark:text-white">{lang === 'id' ? '📍 Belum melihat area Anda?' : "📍 Don't see your area listed?"}</p>
                  <p>
                    {lang === 'id'
                      ? 'Hubungi tim survei kami melalui WhatsApp untuk permohonan penarikan jalur ODP baru ke perumahan atau kantor Anda.'
                      : 'Contact our survey team via WhatsApp to request new ODP fiber extension to your housing or office.'}
                  </p>
                </div>
              </div>

              {/* Coverage Results List */}
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[8px_8px_0px_#000]">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800 text-xs font-mono">
                    <span className="text-slate-600 dark:text-gray-400 uppercase font-bold">
                      {lang === 'id' ? 'DAFTAR KLASTER JARINGAN TERKINI' : 'LATEST NETWORK CLUSTERS'}
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      {filteredCoverage.length} {lang === 'id' ? 'WILAYAH DITEMUKAN' : 'AREAS FOUND'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-2">
                    {filteredCoverage.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-gray-400 font-mono text-sm">
                        {t.covEmpty}
                      </div>
                    ) : (
                      filteredCoverage.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 dark:bg-[#070b14] p-4 rounded-xl border border-slate-300 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 hover:border-slate-500 dark:hover:border-gray-700 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{item.area}</span>
                              {item.status === 'ready' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-400 font-bold">
                                  {t.covReady}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-100 dark:bg-yellow-950/80 border border-yellow-400 dark:border-yellow-500/50 text-yellow-800 dark:text-yellow-400 font-bold">
                                  {t.covPreorder}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-gray-400 font-mono mt-1 block">
                              {item.odp} ODP Aktif • {item.note}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const pkg = selectedPackage || PACKAGES[1];
                              setFormData((prev) => ({
                                ...prev,
                                address: item.area,
                                packageId: pkg.id,
                              }));
                              setRegForm((prev) => ({
                                ...prev,
                                address: item.area,
                                packageId: pkg.id,
                              }));
                              handleOpenOrder(pkg);
                            }}
                            className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                          >
                            {t.covBtn}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SOLUSI VERTIKAL INDUSTRI (INDUSTRY SOLUTIONS) */}
        <section id="solusi-industri" className="scroll-mt-24 py-24 bg-slate-100 dark:bg-[#080d19] border-b-2 border-slate-300 dark:border-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {t.indTag}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.indTitle}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
                {t.indDesc}
              </p>

              {/* Industry Switcher Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-6">
                {INDUSTRY_SOLUTIONS.map((ind) => {
                  const Icon = ind.icon;
                  const isActive = selectedIndustry === ind.id;
                  const localizedName = INDUSTRY_SOLUTIONS_I18N[ind.id as keyof typeof INDUSTRY_SOLUTIONS_I18N]?.name[lang] || ind.name;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => setSelectedIndustry(ind.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 border-2 ${
                        isActive
                          ? 'bg-cyan-400 text-black border-black shadow-[4px_4px_0px_#000]'
                          : 'bg-white dark:bg-[#0e1626] text-slate-700 dark:text-gray-300 border-slate-300 dark:border-gray-800 hover:border-cyan-400 shadow-sm'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-cyan-500'}`} />
                      <span>{localizedName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Industry Detail Showcase */}
            {(() => {
              const active = INDUSTRY_SOLUTIONS.find((s) => s.id === selectedIndustry) || INDUSTRY_SOLUTIONS[0];
              const Icon = active.icon;
              const activeI18n = INDUSTRY_SOLUTIONS_I18N[active.id as keyof typeof INDUSTRY_SOLUTIONS_I18N];
              const currentName = activeI18n ? activeI18n.name[lang] : active.name;
              const currentTagline = activeI18n ? activeI18n.tagline[lang] : active.tagline;
              const currentDesc = activeI18n ? activeI18n.description[lang] : active.description;
              const currentSla = activeI18n ? activeI18n.sla[lang] : active.sla;
              return (
                <div className="mt-12 bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_#000] relative">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Solution Narrative */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-400 dark:border-cyan-500/50 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-black uppercase">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{active.badge}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white uppercase leading-snug">
                        {currentTagline}
                      </h3>

                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                        {currentDesc}
                      </p>

                      <div className="space-y-2.5 pt-2">
                        {active.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-gray-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            setRfqData((prev) => ({
                              ...prev,
                              serviceType: `Dedicated Solution - ${currentName}`,
                              notes: `Kebutuhan SLA: ${currentSla}`,
                            }));
                            setRfqModalOpen(true);
                          }}
                          className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 stroke-[2.5]" />
                          <span>{t.indRfqBtn} ({currentName})</span>
                        </button>
                        <a
                          href="https://wa.me/6282112001600"
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-3 bg-slate-100 dark:bg-[#070b14] hover:bg-slate-200 dark:hover:bg-[#152033] text-slate-900 dark:text-white font-bold uppercase text-xs rounded-xl border-2 border-black dark:border-gray-700 hover:border-cyan-500 transition-all flex items-center gap-2"
                        >
                          <PhoneCall className="w-4 h-4 text-emerald-500" />
                          <span>{t.indConsultBtn}</span>
                        </a>
                      </div>
                    </div>

                    {/* Right Column: Spec Metrics & SLA Badge */}
                    <div className="lg:col-span-5 bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
                        <span className="font-mono text-xs font-bold uppercase text-slate-600 dark:text-gray-400">
                          {t.indSlaParam}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">
                          {t.indCarrierGrade}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {active.specs.map((spec, i) => (
                          <div key={i} className="bg-white dark:bg-[#0e1626] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
                            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block uppercase">
                              {spec.label}
                            </span>
                            <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-mono mt-1 block">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-400/50 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-cyan-800 dark:text-cyan-300 font-mono uppercase">
                          <ShieldCheck className="w-4 h-4 text-cyan-500" />
                          <span>{currentSla}</span>
                        </div>
                        <p className="text-slate-600 dark:text-gray-300 text-[11px] leading-relaxed">
                          {t.indSlaGuaranteeDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* SECTION: BEYOND CONNECTIVITY — ENTERPRISE CLOUD & MANAGED SERVICES */}
        <section id="enterprise" className="scroll-mt-24 py-24 border-b-2 border-slate-300 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {t.entTag}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.entTitle}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
                {t.entDesc}
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              {ENTERPRISE_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-7 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between hover:border-cyan-400 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                          <Icon className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <span className="px-3 py-1 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-cyan-300 font-mono text-[10px] font-bold uppercase rounded-md">
                          {pillar.badge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                        {pillar.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                        {pillar.desc}
                      </p>

                      <div className="mt-5 space-y-2 border-t border-slate-200 dark:border-gray-800 pt-4">
                        {pillar.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-gray-300 font-mono">
                            <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setRfqData((prev) => ({
                            ...prev,
                            serviceType: pillar.title,
                            notes: `Tertarik pada layanan ${pillar.title}`,
                          }));
                          setRfqModalOpen(true);
                        }}
                        className="text-xs font-mono font-bold uppercase text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>{t.entConsultBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500 uppercase">
                        {t.entSlaGuaranteed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION: KEPATUHAN, STANDAR ISO & GARANSI SLA FINANSIAL */}
        <section id="kepatuhan" className="scroll-mt-24 py-24 bg-slate-100 dark:bg-[#080d19] border-b-2 border-slate-300 dark:border-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                {t.compTag}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.compTitle}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
                {t.compDesc}
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMPLIANCE_STANDARDS.map((std, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {std.code}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white uppercase">
                      {std.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                      {std.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-gray-400">
                    <span>{t.compAuditReady}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.compVerified}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: WHY AUDIRANET (REAL ISP ARCHITECTURE) */}
        <section id="keunggulan" className="scroll-mt-24 py-24 border-b-2 border-slate-300 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {t.techTag}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.techTitle}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
                {t.techDesc}
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-7 shadow-[6px_6px_0px_#000]">
                <div className="w-12 h-12 rounded-xl bg-cyan-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mb-6">
                  <Globe className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase">Direct Peering Tier-1</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  Tersambung langsung ke Indonesia Internet Exchange (IIX), OpenIXP, CDG, Google Global Cache, Akamai, dan Cloudflare. Menghasilkan latency server lokal 1-3 ms.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-7 shadow-[6px_6px_0px_#000]">
                <div className="w-12 h-12 rounded-xl bg-emerald-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mb-6">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase">100% Bebas FUP Murni</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  Tidak ada penurunan kecepatan diam-diam di pertengahan bulan. Anda bebas mendownload dan mengupload file berukuran ratusan gigabyte tanpa was-was.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-7 shadow-[6px_6px_0px_#000]">
                <div className="w-12 h-12 rounded-xl bg-purple-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mb-6">
                  <Server className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase">RouterOS & TR-069 ACS</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  Dikelola dengan Mikrotik Enterprise Core dan GenieACS TR-069. Pemantauan redaman optik dBm dan konfigurasi WiFi dapat dibantu secara remote oleh teknisi.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-7 shadow-[6px_6px_0px_#000]">
                <div className="w-12 h-12 rounded-xl bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mb-6">
                  <Headphones className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase">Tim NOC Manusia 24/7</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  Tidak ada bot template yang berputar-putar. Komplain teknis langsung ditangani engineer jaringan berlisensi yang memahami rute mikrotik dan fiber cut.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-7 shadow-[6px_6px_0px_#000]">
                <div className="w-12 h-12 rounded-xl bg-rose-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mb-6">
                  <Flame className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase">Pembayaran Instan Otomatis</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  Bayar tagihan langsung via QRIS, Virtual Account BCA/Mandiri/BRI/BNI, serta Alfamart dan Indomaret terintegrasi Midtrans. Konfirmasi otomatis seketika.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-2xl p-7 shadow-[6px_6px_0px_#000]">
                <div className="w-12 h-12 rounded-xl bg-cyan-300 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mb-6">
                  <Award className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase">Self-Service Customer Portal</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  Pelanggan mendapatkan akun portal mandiri untuk memantau grafik pemakaian kuota, unduh faktur invoice PDF, cek speedtest, dan referral rewards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="scroll-mt-24 py-24 bg-slate-100 dark:bg-[#0a0f1d] border-b-2 border-slate-300 dark:border-gray-800 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {t.faqTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.faqTitle}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                {t.faqDesc}
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: {
                    id: 'Apakah benar-benar 100% tanpa batas FUP?',
                    en: 'Is it truly 100% uncapped with zero FUP?',
                  },
                  a: {
                    id: 'Benar sekali. AudiraNET tidak menerapkan FUP (Fair Usage Policy). Kecepatan internet Anda tetap konstan dari tanggal 1 sampai akhir bulan, berapa pun gigabyte kuota yang Anda gunakan.',
                    en: 'Absolutely. AudiraNET never applies any Fair Usage Policy (FUP). Your internet bandwidth remains constant from the first day to month end, regardless of how many gigabytes you transfer.',
                  },
                },
                {
                  q: {
                    id: 'Berapa lama proses pemasangan teknisi ke rumah?',
                    en: 'How long does technician on-site installation take?',
                  },
                  a: {
                    id: 'Jika lokasi Anda sudah terjangkau tiang ODP fiber AudiraNET, teknisi kami akan melakukan pemasangan maksimal dalam 1x24 jam setelah registrasi divalidasi.',
                    en: 'If your location is covered by an active AudiraNET ODP fiber pole, our field technicians will complete installation within 24 hours of validation.',
                  },
                },
                {
                  q: {
                    id: 'Perangkat apa saja yang dipinjamkan selama berlangganan?',
                    en: 'What hardware devices are provided during subscription?',
                  },
                  a: {
                    id: 'Anda mendapatkan 1 unit Modem Optical Network Terminal (ONT) Fiber Optic dengan WiFi Gigabit Dual-Band (2.4GHz & 5GHz) serta kabel patch cord fiber gratis.',
                    en: 'You receive 1 Gigabit Dual-Band WiFi ONT (2.4GHz & 5GHz) Optical Network Terminal modem plus free fiber optical drop cable and patch cords.',
                  },
                },
                {
                  q: {
                    id: 'Apakah ada kontrak minimal berlangganan?',
                    en: 'Is there a minimum contract duration?',
                  },
                  a: {
                    id: 'Kami menawarkan fleksibilitas langganan tanpa ikatan kontrak jangka panjang yang memberatkan. Pelanggan bebas berhenti berlangganan kapan saja dengan pemberitahuan 7 hari sebelumnya.',
                    en: 'We provide maximum flexibility without burdensome lock-in contracts. You may cancel service anytime with 7 days advance notice.',
                  },
                },
                {
                  q: {
                    id: 'Bagaimana cara membayar tagihan setiap bulan?',
                    en: 'How do I pay my monthly invoice?',
                  },
                  a: {
                    id: 'Tagihan akan dikirimkan otomatis melalui pesan WhatsApp resmi dan portal pelanggan. Anda dapat membayar melalui QRIS (Gopay, OVO, Dana, ShopeePay), Transfer Bank Virtual Account, atau gerai retail.',
                    en: 'Invoices are dispatched automatically via official WhatsApp notification and customer portal. Payments are accepted via QRIS, Virtual Accounts (BCA, Mandiri, BRI, BNI), and retail stores.',
                  },
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-xl overflow-hidden shadow-[4px_4px_0px_#000]"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-950 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <span>{item.q[lang]}</span>
                    {activeFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 dark:text-gray-400 shrink-0" />
                    )}
                  </button>
                  {activeFaq === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-700 dark:text-gray-300 border-t border-slate-200 dark:border-gray-800/60 pt-4 leading-relaxed font-normal">
                      {item.a[lang]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: CTA BANNER */}
        <section className="py-20 bg-gradient-to-r from-cyan-100 via-white to-blue-100 dark:from-blue-900/40 dark:via-[#070b14] dark:to-cyan-950/40 border-b-2 border-slate-300 dark:border-gray-800 relative transition-colors">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="px-3.5 py-1.5 rounded-md bg-cyan-400 text-black font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000]">
              {t.ctaTag}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {t.ctaTitle}
            </h2>
            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              {t.ctaDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleOpenOrder(selectedPackage || PACKAGES[1]);
                }}
                className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-sm rounded-xl border-2 border-black shadow-[6px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>{t.ctaRegisterBtn}</span>
              </button>

              <a
                href="https://wa.me/6282112001600?text=Halo%20Tim%20AudiraNET,%20saya%20ingin%20tanya%20informasi%20layanan%20internet%20fiber"
                target="_blank"
                rel="noreferrer"
                className="px-7 py-4 bg-white dark:bg-[#0e1626] hover:bg-slate-100 dark:hover:bg-[#152033] text-slate-950 dark:text-white font-bold uppercase text-sm rounded-xl border-2 border-black dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-[6px_6px_0px_#000] transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.ctaWaBtn}</span>
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-100 dark:bg-[#05070d] text-slate-600 dark:text-gray-400 text-xs py-16 border-t-2 border-slate-300 dark:border-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              {/* Brand & Author */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black">
                    <Wifi className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xl font-black uppercase text-slate-950 dark:text-white">
                      Audira<span className="text-cyan-600 dark:text-cyan-400">NET</span>
                    </span>
                    <span className="block text-[9px] font-mono tracking-widest text-slate-500 dark:text-gray-500 uppercase">
                      Audira Multimedia Digital
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-xs">
                  AudiraNET adalah ekosistem penyedia layanan internet fiber optik dan sistem manajemen ISP terpadu, dikembangkan di bawah naungan Audira Multimedia Digital / Audira Sukses Mandiri.
                </p>

                <div className="font-mono text-[11px] text-slate-600 dark:text-gray-400 space-y-1">
                  <p>Founder & Author: <strong className="text-slate-900 dark:text-white">Agus Dwi Rianto (AUDIRA)</strong></p>
                  <p>Official Website: <a href="https://audira.my.id" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">https://audira.my.id</a></p>
                  <p>Email: <a href="mailto:agusdwirianto@gmail.com" className="text-cyan-600 dark:text-cyan-400 hover:underline">agusdwirianto@gmail.com</a></p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-3">
                <h4 className="text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider text-xs">LAYANAN INTERNET</h4>
                <ul className="space-y-2 font-medium">
                  <li>
                    <button
                      onClick={() => handleFooterPackageClick('home-20', 'home')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
                    >
                      Home Starter 20 Mbps
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFooterPackageClick('home-50', 'home')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
                    >
                      Gamer Ultra 50 Mbps
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFooterPackageClick('home-100', 'home')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
                    >
                      Pro Streamer 100 Mbps
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFooterPackageClick('biz-300', 'business')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
                    >
                      Dedicated Corporate
                    </button>
                  </li>
                  <li>
                    <a
                      href="#jangkauan"
                      onClick={() => {
                        const input = document.getElementById('area-search');
                        if (input) input.focus();
                      }}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      Peta Jangkauan ODP
                    </a>
                  </li>
                </ul>
              </div>

              {/* Client & Portals */}
              <div className="space-y-3">
                <h4 className="text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider text-xs">AKSES SISTEM</h4>
                <ul className="space-y-2 font-medium">
                  <li>
                    <Link href="/login" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
                      <span>Portal Pelanggan</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 dark:text-gray-500" />
                    </Link>
                  </li>
                  <li>
                    <a href="http://localhost:3217" target="_blank" rel="noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
                      <span>Dashboard Admin ISP</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 dark:text-gray-500" />
                    </a>
                  </li>
                  <li><a href="#simulator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Speed Simulator</a></li>
                  <li><a href="#faq" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Bantuan & FAQ</a></li>
                </ul>
              </div>

              {/* Legal & Contacts */}
              <div className="space-y-3">
                <h4 className="text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider text-xs">KONTAK OPERASIONAL</h4>
                <div className="space-y-2 font-mono text-[11px] text-slate-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>Jakarta & Bekasi, Indonesia</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      Hotline WA:{' '}
                      <a
                        href="https://wa.me/6282112001600"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
                      >
                        +62 821-1200-1600
                      </a>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>Layanan NOC: 24 Jam / 7 Hari</span>
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                    Network Status: All POP Online
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-300 dark:border-gray-900 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-slate-600 dark:text-gray-400">
              <p>© 2026 AUDIRA. All rights reserved. Proprietary Commercial Software.</p>
              <p>Designed with Neo-Brutalism & Cyberpunk Standards • Anti-AI-Slop Certified</p>
            </div>
          </div>
        </footer>

        {/* REGISTRATION & ONLINE PAYMENT MODAL */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-cyan-400 rounded-2xl p-6 sm:p-7 max-w-xl w-full shadow-[10px_10px_0px_#000] relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="absolute top-5 right-5 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-lg bg-slate-200 dark:bg-gray-800 transition-colors"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  AUDIRANET &bull; PASANG BARU & AKTIVASI INSTAN
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {onlineStep === 'success' ? 'Registrasi & Pembayaran Sukses!' : 'Daftar Langganan AudiraNET'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                {onlineStep === 'success'
                  ? 'Akun internet Anda siap diaktifkan dan tiket teknisi telah dijadwalkan.'
                  : 'Pilih pembayaran online otomatis untuk aktivasi akun langsung, atau konsultasi manual via WhatsApp.'}
              </p>

              {/* Mode Switcher (Hide on success) */}
              {onlineStep !== 'success' && (
                <div className="flex border-2 border-black dark:border-gray-700 rounded-xl p-1 bg-slate-100 dark:bg-[#070b14] mt-4 mb-4">
                  <button
                    type="button"
                    onClick={() => { setOrderMode('online'); setOnlineError(''); }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                      orderMode === 'online'
                        ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                        : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ Bayar Online Instan (QRIS / VA)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOrderMode('whatsapp'); setOnlineError(''); }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                      orderMode === 'whatsapp'
                        ? 'bg-emerald-400 text-black shadow-[2px_2px_0px_#000]'
                        : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Jadwal via WhatsApp</span>
                  </button>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 1: ONLINE INSTANT REGISTRATION & PAYMENT (3 STEPS)   */}
              {/* ======================================================== */}
              {orderMode === 'online' && (
                <div>
                  {/* STEP 1: REGISTRATION FORM */}
                  {onlineStep === 'form' && (
                    <form onSubmit={handleOnlineOrderSubmit} className="space-y-3.5 text-xs font-mono">
                      {/* Active Package Summary Card */}
                      {(() => {
                        const pkg = PACKAGES.find((p) => p.id === regForm.packageId) || selectedPackage;
                        const finalPrice = pkg ? (billingCycle === 'yearly' ? pkg.monthlyPrice * 10 : pkg.monthlyPrice) : 285000;
                        return (
                          <div className="p-3.5 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 dark:bg-cyan-950/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block">
                                  PAKET DIPILIH
                                </span>
                                <div className="font-mono font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                                  <span>{pkg?.name || 'Paket Internet'}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-black text-[10px] font-bold">
                                    {pkg?.speed || 50} Mbps
                                  </span>
                                </div>
                              </div>
                              <div className="text-right font-mono">
                                <span className="text-[10px] text-slate-500 dark:text-gray-400 block">
                                  {billingCycle === 'yearly' ? 'Tagihan Tahunan (10 Bln)' : 'Tagihan Bulanan'}
                                </span>
                                <span className="text-base font-black text-cyan-600 dark:text-cyan-400">
                                  Rp {formatNumber(finalPrice)}
                                </span>
                              </div>
                            </div>

                            {/* Billing Cycle Switcher within Modal */}
                            <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 dark:text-gray-400 font-bold uppercase text-[10px]">
                                Siklus Tagihan:
                              </span>
                              <div className="inline-flex p-0.5 bg-white dark:bg-[#070b14] border border-slate-300 dark:border-gray-700 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => setBillingCycle('monthly')}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                    billingCycle === 'monthly'
                                      ? 'bg-cyan-500 text-white'
                                      : 'text-slate-600 dark:text-gray-400'
                                  }`}
                                >
                                  Bulanan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBillingCycle('yearly')}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                                    billingCycle === 'yearly'
                                      ? 'bg-emerald-500 text-white'
                                      : 'text-slate-600 dark:text-gray-400'
                                  }`}
                                >
                                  <span>Tahunan</span>
                                  <span className="text-[9px] bg-emerald-700 text-white px-1 rounded">HEMAT 2 BLN</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                            Nama Lengkap *
                          </label>
                          <input
                            type="text"
                            required
                            value={regForm.name}
                            onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                            placeholder="Contoh: Budi Santoso"
                            className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                            Nomor WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            value={regForm.phone}
                            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                            placeholder="0812xxxxxxxx"
                            className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                            Email Akun *
                          </label>
                          <input
                            type="email"
                            required
                            value={regForm.email}
                            onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                            placeholder="email@anda.com"
                            className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1 flex items-center justify-between">
                            <span>Password Portal *</span>
                            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal lowercase">(untuk login)</span>
                          </label>
                          <input
                            type="password"
                            required
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                            placeholder="Minimal 6 karakter..."
                            className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                          Ganti Pilihan Paket
                        </label>
                        <select
                          value={regForm.packageId}
                          onChange={(e) => {
                            const newId = e.target.value;
                            const targetPkg = PACKAGES.find((p) => p.id === newId);
                            if (targetPkg) {
                              setSelectedPackage(targetPkg);
                              setSelectedCategory(targetPkg.category);
                            }
                            setRegForm((prev) => ({ ...prev, packageId: newId }));
                            setFormData((prev) => ({ ...prev, packageId: newId }));
                          }}
                          className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-sans text-xs"
                        >
                          {PACKAGES.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {p.speed} Mbps (Rp {formatNumber(billingCycle === 'yearly' ? p.monthlyPrice * 10 : p.monthlyPrice)}/{billingCycle === 'yearly' ? 'thn' : 'bln'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                          Alamat Lengkap Pemasangan *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={regForm.address}
                          onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                          placeholder="Nama Jalan / Gang, Blok/No Rumah, RT/RW, Kelurahan, Kecamatan, Kota..."
                          className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                        />
                      </div>

                      {/* Payment Method Selector */}
                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5 flex items-center justify-between">
                          <span>Pilih Metode Pembayaran *</span>
                          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verifikasi Otomatis
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <label
                            onClick={() => setRegForm({ ...regForm, paymentMethod: 'qris' })}
                            className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-2 ${
                              regForm.paymentMethod === 'qris'
                                ? 'border-cyan-400 bg-cyan-400/10 dark:bg-cyan-950/40 text-black dark:text-white shadow-[2px_2px_0px_#000]'
                                : 'border-slate-300 dark:border-gray-700 hover:border-slate-400'
                            }`}
                          >
                            <QrCode className="w-4 h-4 text-cyan-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold block text-[11px] truncate">QRIS (Semua E-Wallet)</span>
                              <span className="text-[9px] text-slate-500 dark:text-gray-400 block truncate">BCA, Mandiri, GoPay, Dana</span>
                            </div>
                          </label>

                          <label
                            onClick={() => setRegForm({ ...regForm, paymentMethod: 'va_bca' })}
                            className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-2 ${
                              regForm.paymentMethod === 'va_bca'
                                ? 'border-cyan-400 bg-cyan-400/10 dark:bg-cyan-950/40 text-black dark:text-white shadow-[2px_2px_0px_#000]'
                                : 'border-slate-300 dark:border-gray-700 hover:border-slate-400'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 text-blue-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold block text-[11px] truncate">BCA Virtual Account</span>
                              <span className="text-[9px] text-slate-500 dark:text-gray-400 block truncate">Transfer ATM & KlikBCA</span>
                            </div>
                          </label>

                          <label
                            onClick={() => setRegForm({ ...regForm, paymentMethod: 'va_mandiri' })}
                            className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-2 ${
                              regForm.paymentMethod === 'va_mandiri'
                                ? 'border-cyan-400 bg-cyan-400/10 dark:bg-cyan-950/40 text-black dark:text-white shadow-[2px_2px_0px_#000]'
                                : 'border-slate-300 dark:border-gray-700 hover:border-slate-400'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold block text-[11px] truncate">Mandiri VA</span>
                              <span className="text-[9px] text-slate-500 dark:text-gray-400 block truncate">Livin by Mandiri</span>
                            </div>
                          </label>

                          <label
                            onClick={() => setRegForm({ ...regForm, paymentMethod: 'va_bri' })}
                            className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-2 ${
                              regForm.paymentMethod === 'va_bri'
                                ? 'border-cyan-400 bg-cyan-400/10 dark:bg-cyan-950/40 text-black dark:text-white shadow-[2px_2px_0px_#000]'
                                : 'border-slate-300 dark:border-gray-700 hover:border-slate-400'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold block text-[11px] truncate">BRI / BNI VA</span>
                              <span className="text-[9px] text-slate-500 dark:text-gray-400 block truncate">BRImo & BNI Mobile</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Error Banner */}
                      {onlineError && (
                        <div className="p-2.5 bg-rose-500/10 border-2 border-rose-500 rounded-lg text-rose-600 dark:text-rose-400 text-[11px]">
                          <strong>Gagal:</strong> {onlineError}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={onlineLoading}
                          className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          <Zap className="w-4 h-4 stroke-[2.5]" />
                          <span>
                            {onlineLoading ? 'Memproses Pendaftaran...' : '⚡ Lanjut ke Pembayaran Online'}
                          </span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 2: PAYMENT SCREEN (QRIS OR VIRTUAL ACCOUNT) */}
                  {onlineStep === 'payment' && (
                    <div className="space-y-4 font-mono text-xs">
                      {/* Invoice Summary Box */}
                      <div className="p-3.5 bg-slate-50 dark:bg-[#070b14] border-2 border-black dark:border-cyan-400 rounded-xl space-y-2 shadow-[3px_3px_0px_#000]">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-800">
                          <div>
                            <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase block">NO. INVOICE</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {orderResult?.invoice?.invoiceNumber}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-black animate-pulse">
                            MENUNGGU PEMBAYARAN
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase block">TOTAL PEMBAYARAN</span>
                            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                              Rp {formatNumber(orderResult?.invoice?.amount || 0)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase block">BATAS WAKTU</span>
                            <span className="text-xs font-bold text-rose-500 flex items-center gap-1 justify-end">
                              <Clock className="w-3.5 h-3.5" /> 15 Menit
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method Content */}
                      {regForm.paymentMethod === 'qris' ? (
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_#000]">
                          <div className="flex items-center gap-1.5 mb-2 font-mono text-[11px] font-black text-slate-800">
                            <QrCode className="w-4 h-4 text-cyan-600" />
                            <span>QRIS DYNAMIC STANDAR BANK INDONESIA</span>
                          </div>
                          {qrisQrDataUrl ? (
                            <img
                              src={qrisQrDataUrl}
                              alt="QRIS Barcode"
                              className="w-56 h-56 rounded-lg border border-slate-300 p-1"
                            />
                          ) : (
                            <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 text-xs">
                              Memuat Barcode QRIS...
                            </div>
                          )}
                          <p className="mt-2 text-[10px] text-center text-slate-600 max-w-xs font-sans">
                            Scan dengan <strong>BCA Mobile, Livin Mandiri, GoPay, OVO, Dana, ShopeePay, LinkAja</strong> atau m-Banking lain.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border-2 border-black dark:border-cyan-400 bg-slate-50 dark:bg-[#070b14] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-gray-400">
                              METODE TRANSFER
                            </span>
                            <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-cyan-400 text-black">
                              {orderResult?.payment?.bankName || 'VIRTUAL ACCOUNT'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block mb-1">
                              NOMOR VIRTUAL ACCOUNT
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-widest">
                                {orderResult?.payment?.vaNumber}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyVa(orderResult?.payment?.vaNumber)}
                                className="p-2 rounded-lg border-2 border-black bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold flex items-center gap-1 shadow-[2px_2px_0px_#000]"
                              >
                                {copiedVa ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedVa ? 'Tersalin' : 'Salin'}</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 border-t border-slate-200 dark:border-gray-800 pt-2 font-sans">
                            Pembayaran akan terverifikasi secara instan dalam 5-10 detik setelah Anda menyelesaikan transfer dari aplikasi bank.
                          </p>
                        </div>
                      )}

                      {/* Error Banner */}
                      {onlineError && (
                        <div className="p-2.5 bg-rose-500/10 border-2 border-rose-500 rounded-lg text-rose-600 dark:text-rose-400 text-[11px]">
                          <strong>Gagal:</strong> {onlineError}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={handleConfirmOnlinePayment}
                          disabled={onlineLoading}
                          className="w-full py-3.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase tracking-wider text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          <Zap className="w-4 h-4 stroke-[2.5]" />
                          <span>
                            {onlineLoading ? 'Memeriksa Verifikasi Pembayaran...' : '⚡ SAYA SUDAH MEMBAYAR (KONFIRMASI SEKARANG)'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineStep('form')}
                          className="w-full py-2 px-3 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-mono text-[11px] transition-colors"
                        >
                          &larr; Ubah Rincian Pendaftaran / Paket
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SUCCESS & ACTIVATION CONFIRMATION */}
                  {onlineStep === 'success' && (
                    <div className="py-2 space-y-4 text-center font-mono">
                      <div className="w-16 h-16 rounded-full bg-emerald-400/20 border-2 border-emerald-500 text-emerald-500 mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>

                      <div>
                        <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-black bg-emerald-400 text-black uppercase tracking-wider">
                          STATUS: LUNAS &bull; AKUN INTERNET AKTIF
                        </span>
                        <h4 className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1.5">
                          Selamat Datang di AudiraNET!
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-sm mx-auto font-sans">
                          Pembayaran pendaftaran awal Anda telah berhasil diverifikasi. Akun pelanggan Anda telah dibuat di sistem.
                        </p>
                      </div>

                      {/* Credentials Box */}
                      <div className="bg-slate-50 dark:bg-[#070b14] border-2 border-black dark:border-cyan-400 rounded-xl p-4 text-left font-mono text-xs space-y-2 shadow-[4px_4px_0px_#000]">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-800">
                          <span className="text-slate-500 dark:text-gray-400">ID Internet Pelanggan:</span>
                          <span className="font-black text-cyan-600 dark:text-cyan-400 text-sm tracking-wide">
                            {orderResult?.customer?.internetNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-800">
                          <span className="text-slate-500 dark:text-gray-400">Nama Pelanggan:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {orderResult?.customer?.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-800">
                          <span className="text-slate-500 dark:text-gray-400">No. Invoice Tagihan:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {orderResult?.invoice?.invoiceNumber} (LUNAS)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-gray-400">Tiket Teknisi Pasang Baru:</span>
                          <span className="font-bold text-amber-500">
                            {orderResult?.ticket?.ticketNumber}
                          </span>
                        </div>
                      </div>

                      {/* Technician Notice */}
                      <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-left font-mono text-[11px] text-slate-700 dark:text-cyan-200">
                        <p className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <span>
                            Tiket instalasi <strong>{orderResult?.ticket?.ticketNumber}</strong> telah diteruskan ke tim teknisi lapangan. Petugas akan menghubungi nomor WhatsApp Anda dalam 1x24 jam untuk konfirmasi jadwal penarikan kabel fiber optik.
                          </span>
                        </p>
                      </div>

                      {/* Direct Portal Dashboard Link */}
                      <div className="space-y-2 pt-1">
                        <Link
                          href={`/c/${orderResult?.customer?.internetNumber || ''}/dashboard`}
                          className="w-full py-3.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <span>🚀 Masuk ke Dashboard Pelanggan Anda</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            const text = `Halo Admin AudiraNET, saya telah berhasil mendaftar & bayar online pasang baru:%0A%0A` +
                              `🆔 *ID Internet*: ${orderResult?.customer?.internetNumber}%0A` +
                              `👤 *Nama*: ${orderResult?.customer?.name}%0A` +
                              `🧾 *No Invoice*: ${orderResult?.invoice?.invoiceNumber} (LUNAS)%0A` +
                              `🎫 *Tiket Pemasangan*: ${orderResult?.ticket?.ticketNumber}%0A%0A` +
                              `Mohon konfirmasi jadwal kunjungan teknisi. Terima kasih!`;
                            window.open(`https://wa.me/6282112001600?text=${text}`, '_blank');
                          }}
                          className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Kirim Konfirmasi Salinan ke WhatsApp NOC</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: WHATSAPP REGISTRATION (LEGACY FALLBACK)            */}
              {/* ======================================================== */}
              {orderMode === 'whatsapp' && (
                <form onSubmit={handleSendWhatsAppOrder} className="mt-4 space-y-3.5 text-xs font-mono">
                  <div>
                    <label htmlFor="reg-name" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama lengkap Anda..."
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-phone" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812xxxxxxxx"
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-package" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Pilihan Paket Internet *
                    </label>
                    <select
                      id="reg-package"
                      value={formData.packageId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        const targetPkg = PACKAGES.find((p) => p.id === newId);
                        if (targetPkg) {
                          setSelectedPackage(targetPkg);
                          setSelectedCategory(targetPkg.category);
                        }
                        setFormData((prev) => ({ ...prev, packageId: newId }));
                        setRegForm((prev) => ({ ...prev, packageId: newId }));
                      }}
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    >
                      {PACKAGES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.speed} Mbps (Rp {formatNumber(billingCycle === 'yearly' ? p.monthlyPrice * 10 : p.monthlyPrice)}/{billingCycle === 'yearly' ? 'thn' : 'bln'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reg-address" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Alamat Lengkap Pemasangan *
                    </label>
                    <textarea
                      id="reg-address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Jl. / Gang / No Rumah, RT/RW, Kelurahan, Kecamatan, Kota..."
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-notes" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Catatan Khusus (Opsional)
                    </label>
                    <input
                      id="reg-notes"
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Misal: Pasang akhir pekan / rumah pagar hitam"
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase tracking-wider text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Kirim & Konfirmasi ke WhatsApp Tim Sales</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 1: DIGITAL SLA PERFORMANCE & COMPLIANCE CERTIFICATE */}
        {/* ======================================================== */}
        {slaCertModalOpen && speedtestResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-cyan-400 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-[10px_10px_0px_#000] relative max-h-[92vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSlaCertModalOpen(false)}
                className="absolute top-5 right-5 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-lg bg-slate-200 dark:bg-gray-800"
                aria-label="Tutup Modal Sertifikat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Border & Watermark */}
              <div className="border-4 border-double border-slate-300 dark:border-cyan-500/40 p-6 sm:p-8 rounded-xl bg-slate-50 dark:bg-[#070b14] space-y-6 relative overflow-hidden">
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
                  <span className="text-[120px] font-black uppercase tracking-widest font-mono">AUDIRA</span>
                </div>

                {/* Header */}
                <div className="text-center space-y-2 border-b-2 border-slate-200 dark:border-gray-800 pb-5">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400 text-black font-black flex items-center justify-center">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <span className="font-mono font-black text-lg tracking-wider uppercase text-slate-900 dark:text-white">
                      PT AUDIRA SUKSES MANDIRI
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-cyan-600 dark:text-cyan-400">
                    DIGITAL SLA PERFORMANCE CERTIFICATE
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                    Sertifikasi Resmi Pengujian Throughput & Kepatuhan SLA IETF RFC 2544 / RFC 6349
                  </p>
                </div>

                {/* Cert ID & Timestamp */}
                <div className="grid grid-cols-2 gap-4 font-mono text-xs p-3 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">NOMOR SERTIFIKAT:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{speedtestResults.certId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">TANGGAL & WAKTU UJI:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{speedtestResults.date}</span>
                  </div>
                </div>

                {/* 4 Core Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                  <div className="p-3 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                    <span className="text-[9px] text-slate-500 uppercase block">LATENSI PING</span>
                    <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{speedtestResults.ping} ms</span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">SLA &lt; 15 ms (PASS)</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                    <span className="text-[9px] text-slate-500 uppercase block">JITTER</span>
                    <span className="text-xl font-black text-purple-600 dark:text-purple-400">{speedtestResults.jitter} ms</span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">SLA &lt; 5 ms (PASS)</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                    <span className="text-[9px] text-slate-500 uppercase block">DOWNLOAD</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{speedtestResults.download} Mbps</span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">SIMETRIS 1:1</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                    <span className="text-[9px] text-slate-500 uppercase block">UPLOAD</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">{speedtestResults.upload} Mbps</span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">SIMETRIS 1:1</span>
                  </div>
                </div>

                {/* Audit & Regulatory Data */}
                <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-gray-400 border-t border-slate-200 dark:border-gray-800 pt-4">
                  <div className="flex justify-between">
                    <span>Testing Gateway Node:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{speedtestResults.server}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client IP & Autonomous System:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{speedtestResults.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cryptographic Verification Hash:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{speedtestResults.sha256}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status Evaluasi Kepatuhan SLA:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{speedtestResults.complianceScore}</span>
                  </div>
                </div>

                {/* Seal & Signatures */}
                <div className="pt-6 border-t-2 border-slate-200 dark:border-gray-800 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 text-emerald-600 font-bold text-[10px] text-center uppercase tracking-tight">
                      ISO 9001<br/>SLA 100%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-400">
                      Terdaftar Resmi Ditjen PPI<br/>Kementerian Kominfo RI
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Disahkan secara Digital:</span>
                    <strong className="text-slate-900 dark:text-white block mt-0.5">Agus Dwi Rianto (AUDIRA)</strong>
                    <span className="text-[9px] text-slate-500 dark:text-gray-400">Founder & Author AudiraNET</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Resmi</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = `Sertifikat Kepatuhan SLA AudiraNET: %0AID: ${speedtestResults.certId}%0ADownload: ${speedtestResults.download} Mbps%0AUpload: ${speedtestResults.upload} Mbps%0APing: ${speedtestResults.ping} ms (100% Passed)`;
                    window.open(`https://wa.me/6282112001600?text=${text}`, '_blank');
                  }}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-mono text-xs font-bold rounded-xl border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Bagikan WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: NETWORK OUTAGE & AREA MAINTENANCE RADAR         */}
        {/* ======================================================== */}
        {radarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-cyan-400 rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-[10px_10px_0px_#000] relative max-h-[92vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setRadarModalOpen(false)}
                className="absolute top-5 right-5 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-lg bg-slate-200 dark:bg-gray-800"
                aria-label="Tutup Radar Jaringan"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  NOC CARRIER-GRADE RADAR & TELEMETRY
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {t.radarTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                {t.radarSubtitle}
              </p>

              {/* Radar Tab Switcher */}
              <div className="flex border-2 border-black dark:border-gray-700 rounded-xl p-1 bg-slate-100 dark:bg-[#070b14] mt-5 mb-5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setRadarTab('pops')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                    radarTab === 'pops'
                      ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                      : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Status Seluruh POP & Core</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRadarTab('area')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                    radarTab === 'area'
                      ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                      : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Cek Area & Redaman Modem</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRadarTab('dns')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                    radarTab === 'dns'
                      ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]'
                      : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Filter DNS Kominfo</span>
                </button>
              </div>

              {/* TAB 1: ALL POPS & CORE ROUTER STATUS */}
              {radarTab === 'pops' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { node: 'POP Jakarta Timur (Cakung)', status: 'OPERASIONAL 100%', lat: '1.1 ms', uptime: '99.99%', load: '48% Capacity' },
                      { node: 'POP Bekasi Barat (Bintara)', status: 'OPERASIONAL 100%', lat: '1.3 ms', uptime: '99.98%', load: '52% Capacity' },
                      { node: 'POP Depok (Margonda)', status: 'OPERASIONAL 100%', lat: '2.1 ms', uptime: '99.98%', load: '41% Capacity' },
                      { node: 'POP Tangerang (Karawaci)', status: 'OPERASIONAL 100%', lat: '2.4 ms', uptime: '99.97%', load: '36% Capacity' },
                      { node: 'Anycast Core BNG (103.189.20.1)', status: '4-NODE BALANCED', lat: '0.4 ms', uptime: '100.00%', load: 'VRRP VIP Active' },
                      { node: 'Clean Pipe Scrubbing DDoS', status: 'SHIELD ACTIVE', lat: '0.6 ms', uptime: '100.00%', load: 'BGP Flowspec Ready' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{item.node}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                          <span>Latensi: <strong className="text-slate-800 dark:text-gray-200">{item.lat}</strong></span>
                          <span>Uptime: <strong className="text-emerald-600">{item.uptime}</strong></span>
                          <span>{item.load}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-[11px] text-slate-700 dark:text-cyan-200 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>
                      Seluruh ring fiber optik backbone AUDIRA beroperasi normal dengan redundansi dual-path BGP routing. Tidak ada insiden pemutusan kabel massal aktif saat ini.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: CHECK AREA OR CUSTOMER OPTIC DIAGNOSTIC */}
              {radarTab === 'area' && (
                <div className="space-y-4 font-mono text-xs">
                  <form onSubmit={handleCheckAreaHealth} className="flex gap-2">
                    <input
                      type="text"
                      value={radarAreaQuery}
                      onChange={(e) => setRadarAreaQuery(e.target.value)}
                      placeholder="Masukkan nama kecamatan (misal: Cakung, Bintara) atau No. Internet (NET-100234)..."
                      className="flex-1 bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>Cek</span>
                    </button>
                  </form>

                  {/* Preset quick test chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500">Coba Tes Cepat:</span>
                    {['Cakung', 'Bintara', 'Harapan Indah', 'NET-100234'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setRadarAreaQuery(chip);
                          setTimeout(() => {
                            if (chip.includes('NET')) {
                              setRadarAreaResult({
                                type: 'customer',
                                identifier: chip,
                                name: 'Bpk. Budi Santoso',
                                status: 'ONLINE',
                                plan: 'Gamer Ultra 50 Mbps Simetris',
                                rxPower: -19.45,
                                txPower: 2.40,
                                oltPort: 'OLT-JKT-01 // PON-03/08',
                                bngNode: 'BRAS-East (103.189.20.1)',
                                ontModel: 'ZTE F670L Dual-Band GPON',
                                maintenanceNote: 'Kabel fiber optik menuju rumah Anda normal tanpa degradasi redaman.'
                              });
                            } else {
                              setRadarAreaResult({
                                type: 'area',
                                area: chip,
                                status: 'NORMAL',
                                uptime: '99.98%',
                                odpActive: 48,
                                latency: '1.2 ms',
                                packetLoss: '0.00%',
                                maintenanceNote: 'Seluruh tiang ODP dan kabel distribusi di wilayah ini beroperasi optimal tanpa gangguan.'
                              });
                            }
                          }, 50);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 border border-slate-300 dark:border-gray-700 hover:border-cyan-400"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {radarAreaResult && (
                    <div className="p-4 bg-slate-50 dark:bg-[#070b14] border-2 border-black dark:border-cyan-500/40 rounded-xl space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-800">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">TARGET AUDIT:</span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {radarAreaResult.identifier || radarAreaResult.area}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-400 text-black uppercase">
                          STATUS: {radarAreaResult.status}
                        </span>
                      </div>

                      {radarAreaResult.type === 'customer' ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div className="p-2.5 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                              <span className="text-[9px] text-slate-500 uppercase block">REDAMAN RX</span>
                              <span className="text-base font-black text-emerald-600">{radarAreaResult.rxPower} dBm</span>
                              <span className="text-[8px] text-slate-400 block">Sangat Sehat</span>
                            </div>
                            <div className="p-2.5 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                              <span className="text-[9px] text-slate-500 uppercase block">DAYA TX</span>
                              <span className="text-base font-black text-cyan-600">+{radarAreaResult.txPower} dBm</span>
                              <span className="text-[8px] text-slate-400 block">Optimal</span>
                            </div>
                            <div className="p-2.5 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                              <span className="text-[9px] text-slate-500 uppercase block">PERANGKAT ONT</span>
                              <span className="text-[10px] font-bold text-slate-900 dark:text-white block truncate">{radarAreaResult.ontModel}</span>
                              <span className="text-[8px] text-emerald-500 font-bold block">GPON O5</span>
                            </div>
                            <div className="p-2.5 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                              <span className="text-[9px] text-slate-500 uppercase block">GATEWAY BNG</span>
                              <span className="text-[10px] font-bold text-slate-900 dark:text-white block truncate">{radarAreaResult.bngNode}</span>
                              <span className="text-[8px] text-emerald-500 font-bold block">Anycast Active</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-gray-300">
                            {radarAreaResult.maintenanceNote}
                          </p>

                          {/* 1-Click TR-069 Reboot / Flush */}
                          <div className="pt-2 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Mengalami kendala throughput?</span>
                            <button
                              type="button"
                              onClick={handleRadarRebootSim}
                              disabled={opticSimRebooting}
                              className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[11px] font-black uppercase rounded-lg border border-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${opticSimRebooting ? 'animate-spin' : ''}`} />
                              <span>{opticSimRebooting ? 'Mengirim Sinyal...' : 'Refresh Sinyal TR-069'}</span>
                            </button>
                          </div>

                          {opticSimSuccess && (
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500 rounded-lg text-emerald-600 dark:text-emerald-400 text-[11px]">
                              {opticSimSuccess}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                              <span className="text-[9px] text-slate-500 uppercase block">Ketersediaan Uptime</span>
                              <span className="text-sm font-black text-emerald-600">{radarAreaResult.uptime}</span>
                            </div>
                            <div className="p-2 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                              <span className="text-[9px] text-slate-500 uppercase block">ODP Aktif</span>
                              <span className="text-sm font-black text-cyan-600">{radarAreaResult.odpActive} Titik</span>
                            </div>
                            <div className="p-2 bg-white dark:bg-[#0c1322] rounded-lg border border-slate-200 dark:border-gray-800">
                              <span className="text-[9px] text-slate-500 uppercase block">Latensi Area</span>
                              <span className="text-sm font-black text-slate-900 dark:text-white">{radarAreaResult.latency}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-gray-300">
                            {radarAreaResult.maintenanceNote}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DNS TRUSTPOSITIF FILTER INSPECTOR */}
              {radarTab === 'dns' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-[11px] text-slate-700 dark:text-cyan-200">
                    Sistem AUDIRA Clean Pipe mematuhi <strong>Permen Kominfo No. 5 Tahun 2021</strong> dengan menyaring domain judi online, phishing perbankan, dan konten berbahaya secara real-time ke Walled Garden Kominfo.
                  </div>

                  <form onSubmit={handleTestDnsSecurity} className="flex gap-2">
                    <input
                      type="text"
                      value={dnsTestDomain}
                      onChange={(e) => setDnsTestDomain(e.target.value)}
                      placeholder="Masukkan nama domain untuk dites (contoh: google.com, judislot.cc)..."
                      className="flex-1 bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                    <button
                      type="submit"
                      disabled={isDnsTesting}
                      className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isDnsTesting ? 'Memeriksa...' : 'Uji Domain'}</span>
                    </button>
                  </form>

                  {/* Preset quick test chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500">Coba Uji Cepat:</span>
                    {['google.com', 'bca.co.id', 'judionline-gacor.xyz', 'phishing-bank-fake.com'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setDnsTestDomain(chip);
                          setTimeout(() => {
                            const isBlocked = chip.includes('judi') || chip.includes('phishing');
                            setDnsTestResult({
                              domain: chip,
                              isBlocked,
                              category: chip.includes('judi') ? 'Judi Online / Perjudian Ilegal' : chip.includes('phishing') ? 'Phishing Perbankan' : 'Aman & Terverifikasi',
                              action: isBlocked ? 'DIBLOKIR TRUSTPOSITIF KOMINFO' : 'RESOLVED (CLEAN PIPE DIRECT FIBER)',
                              resolvedIp: isBlocked ? '10.10.10.1 (Walled Garden Kominfo Sinkhole)' : '142.250.190.46',
                              latency: '0.8 ms',
                              regulasi: 'Permen Kominfo No. 5/2021 & UU ITE No. 1/2024'
                            });
                          }, 50);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 border border-slate-300 dark:border-gray-700 hover:border-cyan-400"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {dnsTestResult && (
                    <div className={`p-4 rounded-xl border-2 space-y-2.5 ${
                      dnsTestResult.isBlocked
                        ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-800 dark:text-rose-200'
                        : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{dnsTestResult.domain}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          dnsTestResult.isBlocked ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-black'
                        }`}>
                          {dnsTestResult.action}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="opacity-70 uppercase block text-[9px]">Kategori Domain:</span>
                          <strong>{dnsTestResult.category}</strong>
                        </div>
                        <div>
                          <span className="opacity-70 uppercase block text-[9px]">Hasil Resolusi IP:</span>
                          <strong>{dnsTestResult.resolvedIp}</strong>
                        </div>
                      </div>
                      <div className="text-[10px] opacity-75 pt-1 border-t border-current/20">
                        Dasar Kepatuhan: {dnsTestResult.regulasi}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* B2B REQUEST FOR QUOTE (RFQ) MODAL */}
        {rfqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-cyan-400 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-[10px_10px_0px_#000] relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setRfqModalOpen(false)}
                className="absolute top-5 right-5 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-lg bg-slate-200 dark:bg-gray-800"
                aria-label="Tutup Modal RFQ"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  B2B ENTERPRISE &bull; REQUEST FOR QUOTE
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                Permintaan Penawaran Resmi (RFQ)
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                Kirim spesifikasi kebutuhan konektivitas korporat Anda. Account Manager AudiraNET akan menerbitkan proposal teknis & komersial dalam 1x24 jam.
              </p>

              <form onSubmit={handleSendRfq} className="mt-6 space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rfq-company" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Nama Perusahaan / Instansi *
                    </label>
                    <input
                      id="rfq-company"
                      type="text"
                      required
                      value={rfqData.company}
                      onChange={(e) => setRfqData({ ...rfqData, company: e.target.value })}
                      placeholder="PT. Nama Perusahaan..."
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-pic" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Nama PIC & Jabatan *
                    </label>
                    <input
                      id="rfq-pic"
                      type="text"
                      required
                      value={rfqData.picName}
                      onChange={(e) => setRfqData({ ...rfqData, picName: e.target.value })}
                      placeholder="Bpk/Ibu... (IT Manager)"
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rfq-email" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Email Korporat *
                    </label>
                    <input
                      id="rfq-email"
                      type="email"
                      required
                      value={rfqData.email}
                      onChange={(e) => setRfqData({ ...rfqData, email: e.target.value })}
                      placeholder="pic@company.co.id"
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-phone" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      No WhatsApp PIC *
                    </label>
                    <input
                      id="rfq-phone"
                      type="tel"
                      required
                      value={rfqData.phone}
                      onChange={(e) => setRfqData({ ...rfqData, phone: e.target.value })}
                      placeholder="0812xxxxxxxx"
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rfq-bw" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Kebutuhan Bandwidth *
                    </label>
                    <select
                      id="rfq-bw"
                      value={rfqData.bandwidth}
                      onChange={(e) => setRfqData({ ...rfqData, bandwidth: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    >
                      <option value="100 Mbps Dedicated (1:1)">100 Mbps Dedicated (1:1)</option>
                      <option value="200 Mbps Dedicated (1:1)">200 Mbps Dedicated (1:1)</option>
                      <option value="500 Mbps Leased Line (1:1)">500 Mbps Leased Line (1:1)</option>
                      <option value="1 Gbps Dedicated Metro-E">1 Gbps Dedicated Metro-E</option>
                      <option value="2 Gbps - 10 Gbps Carrier Port">2 Gbps - 10 Gbps Carrier Port</option>
                      <option value="Custom Enterprise Bandwidth">Custom Enterprise Bandwidth</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rfq-service" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                      Kategori Solusi *
                    </label>
                    <select
                      id="rfq-service"
                      value={rfqData.serviceType}
                      onChange={(e) => setRfqData({ ...rfqData, serviceType: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-sans text-sm"
                    >
                      <option value="Dedicated Internet (1:1)">Dedicated Internet (1:1 Leased Line)</option>
                      <option value="Multi-Cloud VPS & AI Inference">Multi-Cloud VPS & AI Inference</option>
                      <option value="Colocation Rack Unit Tier 3">Colocation Rack Unit Tier 3</option>
                      <option value="Clean Pipe & Anti-DDoS Mitigation">Clean Pipe & Anti-DDoS Mitigation</option>
                      <option value="Bandwidth on Demand (BoD Turbo)">Bandwidth on Demand (BoD Turbo)</option>
                      <option value="SD-WAN & Multi-Branch Interconnect">SD-WAN & Multi-Branch Interconnect</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="rfq-loc" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                    Lokasi Kantor / Cabang Pemasangan *
                  </label>
                  <textarea
                    id="rfq-loc"
                    required
                    rows={2}
                    value={rfqData.locations}
                    onChange={(e) => setRfqData({ ...rfqData, locations: e.target.value })}
                    placeholder="Alamat kantor pusat / daftar titik cabang..."
                    className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="rfq-notes" className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1">
                    Catatan Khusus (SLA, IP Statis, Redundansi BGP)
                  </label>
                  <input
                    id="rfq-notes"
                    type="text"
                    value={rfqData.notes}
                    onChange={(e) => setRfqData({ ...rfqData, notes: e.target.value })}
                    placeholder="Misal: Perlu IP Transit /29, Dual-Homed BGP, SLA 99.99%"
                    className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>Kirim RFQ B2B ke Enterprise Sales (+62 821-1200-1600)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI WEB CONCIERGE ("VIRA" - Interactive 24/7 AI Assistant inspired by Lintasarta's Talita) */}
        {aiChatOpen && (
          <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] bg-white dark:bg-[#0b1220] border-2 border-black dark:border-cyan-400 rounded-2xl shadow-[10px_10px_0px_#000] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* VIRA Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white flex items-center justify-between border-b-2 border-black dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-black border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_#000]">
                  <Bot className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm uppercase tracking-wide">VIRA</h4>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-400 text-black font-black uppercase">
                      {t.viraRole}
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-100 font-mono">
                    {t.viraSubtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAiChatOpen(false)}
                className="text-white hover:text-cyan-200 p-1 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                aria-label="Tutup VIRA AI Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VIRA Messages Scroll Container */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-[#070b14] text-xs font-sans max-h-[380px]">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 ${
                      msg.sender === 'user'
                        ? 'bg-cyan-500 text-white rounded-br-none border-2 border-black shadow-[2px_2px_0px_#000]'
                        : 'bg-white dark:bg-[#0e1626] text-slate-800 dark:text-gray-200 rounded-bl-none border-2 border-black dark:border-gray-800 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-xs">{msg.text}</p>
                    <span className="block text-[9px] font-mono opacity-60 mt-1 text-right">
                      {msg.time}
                    </span>
                  </div>

                  {/* Quick Reply Suggestion Chips */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.quickReplies.map((qr, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => {
                            if (qr.includes('WhatsApp')) {
                              window.open('https://wa.me/6282112001600', '_blank');
                            } else if (qr.includes('RFQ') || qr.includes('Penawaran')) {
                              setRfqModalOpen(true);
                            } else if (qr.includes('Gamer 50M')) {
                              setSelectedPackage(PACKAGES[1]);
                              setOrderModalOpen(true);
                            } else if (qr.includes('Jangkauan') || qr.includes('Coverage')) {
                              window.location.hash = '#jangkauan';
                            } else if (qr.includes('Industri') || qr.includes('Solution') || qr.includes('Enterprise')) {
                              window.location.hash = '#solusi-industri';
                            } else {
                              handleAiSendMessage(qr);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white dark:bg-[#0e1626] text-slate-800 dark:text-cyan-300 border border-slate-300 dark:border-gray-700 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-all shadow-sm"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* VIRA Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAiSendMessage();
              }}
              className="p-3 bg-white dark:bg-[#0b1220] border-t-2 border-slate-300 dark:border-gray-800 flex gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={t.viraPlaceholder}
                className="flex-1 bg-slate-100 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
              <button
                type="submit"
                className="p-2.5 bg-cyan-400 hover:bg-cyan-300 text-black rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all shrink-0"
                aria-label="Kirim Pesan ke VIRA"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}

        {/* FLOATING ACTION DOCK (VIRA AI Concierge & WhatsApp CS) */}
        <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
          {/* VIRA AI Concierge Button */}
          <button
            onClick={() => setAiChatOpen(!aiChatOpen)}
            className="p-3 sm:px-4 sm:py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] transition-all flex items-center gap-2 group"
            aria-label="Buka Chat AI VIRA"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-black stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <span className="hidden sm:inline font-mono font-black text-xs uppercase tracking-wider">
              {t.viraTitle}
            </span>
          </button>

          {/* WhatsApp CS Button */}
          <a
            href="https://wa.me/6282112001600?text=Halo%20Admin%20AudiraNET%2C%20saya%20ingin%20tanya%20layanan%20internet%20fiber"
            target="_blank"
            rel="noreferrer"
            className="p-3 sm:px-4 sm:py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] transition-all flex items-center gap-2 group"
            aria-label="Chat WhatsApp CS"
          >
            <PhoneCall className="w-5 h-5 fill-white stroke-none" />
            <span className="hidden sm:inline font-mono font-bold text-xs uppercase tracking-wider">
              WhatsApp CS
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
