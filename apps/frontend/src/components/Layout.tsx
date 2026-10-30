import React, { ReactNode, createContext, useContext, useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Sidebar from './Sidebar'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Search,
  Command,
  Sun,
  Moon,
  Activity,
  Radio,
  ShieldCheck,
  ChevronRight,
  CornerDownLeft,
  X,
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  Router,
  Network,
  Cpu,
  AlertTriangle,
  Award,
  ArrowUpRight,
  GitBranch,
  Database,
  Terminal,
  BookOpen,
  Settings,
  Zap,
  Globe,
  Gauge,
} from 'lucide-react'

export const LayoutContext = createContext<boolean>(false)

interface LayoutProps {
  children: ReactNode
}

interface CommandItem {
  id: string
  title: string
  subtitle: string
  href: string
  category: 'Command Center' | 'Pelanggan & CRM' | 'Billing & Paket' | 'NOC & Infrastruktur' | 'Sistem & Otomasi'
  keywords: string
  badge?: string
  icon: React.ComponentType<{ className?: string }>
}

const COMMAND_ITEMS: CommandItem[] = [
  // Command Center
  {
    id: 'cmd-home',
    title: 'Executive Command Center (Root Dashboard)',
    subtitle: 'Ringkasan metrik MRR, invoice, pelanggan, dan radar NOC',
    href: '/',
    category: 'Command Center',
    keywords: 'dashboard home beranda utama mrr ringkasan index',
    badge: 'LIVE',
    icon: LayoutDashboard,
  },
  {
    id: 'cmd-analytics',
    title: 'Executive Revenue & Cohort Analytics',
    subtitle: 'Simulasi harga ARPU, analisis kohort retensi, dan proyeksi MRR',
    href: '/analytics',
    category: 'Command Center',
    keywords: 'analytics analitik arpu cohort revenue laporan grafik',
    badge: 'PRO',
    icon: Activity,
  },
  {
    id: 'cmd-noc-main',
    title: 'NOC Real-Time Command Center',
    subtitle: 'Peta kesehatan BNG, OLT, sesión PPPoE, dan diagnostik CoA',
    href: '/noc',
    category: 'Command Center',
    keywords: 'noc network operations center monitoring ping bng',
    badge: '24/7',
    icon: Radio,
  },
  {
    id: 'cmd-dash-billing',
    title: 'Dashboard Khusus Role Billing & Kasir',
    subtitle: 'Target penagihan harian, kolektibilitas, dan aging piutang',
    href: '/dashboard/billing',
    category: 'Command Center',
    keywords: 'dashboard billing kasir keuangan target koleksi',
    icon: Wallet,
  },
  {
    id: 'cmd-dash-noc',
    title: 'Dashboard Khusus Role NOC Engineer',
    subtitle: ' Insiden jaringan, utilisasi trafik, dan status perangkat core',
    href: '/dashboard/noc',
    category: 'Command Center',
    keywords: 'dashboard noc engineer teknisi jaringan',
    icon: Cpu,
  },

  // Pelanggan & CRM
  {
    id: 'cmd-pelanggan',
    title: 'Direktori Master Pelanggan FTTH',
    subtitle: 'Kelola seluruh pelanggan aktif, PPPoE, ODP, dan paket',
    href: '/pelanggan',
    category: 'Pelanggan & CRM',
    keywords: 'pelanggan customer pppoe daftar cari',
    icon: Users,
  },
  {
    id: 'cmd-suspend',
    title: 'Pelanggan Isolir & Mesin Janji Bayar (Grace Period)',
    subtitle: 'Buka isolir sementara 24/48 jam dengan FreeRADIUS CoA otomatis',
    href: '/pelanggan/suspend',
    category: 'Pelanggan & CRM',
    keywords: 'suspend isolir janji bayar grace period buka blokir',
    badge: 'CoA',
    icon: AlertTriangle,
  },
  {
    id: 'cmd-retensi',
    title: 'Radar Prediksi Churn & Degradasi Optik',
    subtitle: 'Deteksi dini pelanggan rawan berhenti dari redaman Rx & telat bayar',
    href: '/pelanggan/retensi',
    category: 'Pelanggan & CRM',
    keywords: 'retensi churn prediksi berhenti redaman',
    badge: 'RADAR',
    icon: Activity,
  },
  {
    id: 'cmd-loyalty',
    title: 'Loyalty Program & Point Reward Engine',
    subtitle: 'Manajemen tier pelanggan, poin bayar tepat waktu, dan penukaran',
    href: '/pelanggan/loyalty',
    category: 'Pelanggan & CRM',
    keywords: 'loyalty poin reward hadiah tier gold platinum',
    icon: Award,
  },
  {
    id: 'cmd-pending',
    title: 'Antrean Pasang Baru (PSB Pending)',
    subtitle: 'Verifikasi registrasi pelanggan baru dan penerbitan SPK instalasi',
    href: '/pelanggan/pending',
    category: 'Pelanggan & CRM',
    keywords: 'pending psb pasang baru instalasi verifikasi',
    icon: Users,
  },
  {
    id: 'cmd-expired',
    title: 'Pelanggan Expired & Putus Kontrak',
    subtitle: 'Daftar akun kedaluwarsa, penarikan ONT, dan re-aktivasi winback',
    href: '/pelanggan/expired',
    category: 'Pelanggan & CRM',
    keywords: 'expired nonaktif berhenti cabut modem winback',
    icon: Users,
  },

  // Billing & Paket
  {
    id: 'cmd-invoice',
    title: 'Manajemen Invoice & Kwitansi Thermal',
    subtitle: 'Generate tagihan bulanan, cetak struk 80mm, dan kirim WA massal',
    href: '/invoice',
    category: 'Billing & Paket',
    keywords: 'invoice tagihan faktur kwitansi bayar lunas',
    icon: FileText,
  },
  {
    id: 'cmd-rekonsiliasi',
    title: 'Rekonsiliasi Mutasi Bank Otomatis (BCA / Mandiri / BRI)',
    subtitle: 'Auto-matching CSV/teks mutasi rekening ke nomor invoice pelanggan',
    href: '/keuangan/rekonsiliasi',
    category: 'Billing & Paket',
    keywords: 'rekonsiliasi mutasi bank bca mandiri bri auto match',
    badge: 'AUTO',
    icon: Wallet,
  },
  {
    id: 'cmd-packages',
    title: 'Katalog Paket Internet & Profil Bandwidth',
    subtitle: 'Atur kecepatan simetris/dinamis, harga bulanan, dan profil MikroTik',
    href: '/packages-admin',
    category: 'Billing & Paket',
    keywords: 'paket internet harga kecepatan bandwidth mbps',
    icon: Zap,
  },
  {
    id: 'cmd-upgrade-req',
    title: 'Approval Upgrade / Downgrade Paket & Kalkulator Prorata',
    subtitle: 'Hitung selisih tagihan prorata otomatis dan push Rate-Limit CoA',
    href: '/packages-admin/upgrade-requests',
    category: 'Billing & Paket',
    keywords: 'upgrade downgrade pindah paket prorata coa',
    badge: 'PRORATA',
    icon: ArrowUpRight,
  },
  {
    id: 'cmd-kolektor',
    title: 'Shift Kolektor & Setoran Tunai Lapangan',
    subtitle: 'Buku kas penagihan door-to-door dan audit selisih setoran',
    href: '/kolektor',
    category: 'Billing & Paket',
    keywords: 'kolektor tunai cash setoran lapangan shift',
    icon: Wallet,
  },

  // NOC & Infrastruktur
  {
    id: 'cmd-traffic',
    title: 'Live MRTG Uplink Traffic & 95th Percentile Monitor',
    subtitle: 'Telemetri real-time BGP IP Transit, OpenIXP, IIX, dan OLT Trunk',
    href: '/infrastruktur/traffic',
    category: 'NOC & Infrastruktur',
    keywords: 'mrtg traffic bandwidth gbps uplink bgp iix openixp 95th',
    badge: '10G',
    icon: Activity,
  },
  {
    id: 'cmd-incidents',
    title: 'Mass Outage Incident Tracker & WA Broadcast',
    subtitle: 'Kelola tiket putus kabel (LOS/PON Down) dan broadcast WA terdampak',
    href: '/noc/incidents',
    category: 'NOC & Infrastruktur',
    keywords: 'outage insiden gangguan massal los pon down broadcast wa',
    badge: 'P1',
    icon: AlertTriangle,
  },
  {
    id: 'cmd-otdr',
    title: 'Kalkulator Jarak Putus Fiber OTDR & Matriks Splicing TIA-598',
    subtitle: 'Proyeksi koordinat GPS titik putus kabel optik & tabel 12/24/48 core',
    href: '/infrastruktur/otdr',
    category: 'NOC & Infrastruktur',
    keywords: 'otdr fiber optik putus core splicing warna tia 598',
    badge: 'FTTH',
    icon: Network,
  },
  {
    id: 'cmd-ipam',
    title: 'IPAM Subnet Manager & Forensik Log CGNAT (UU ITE / Kominfo)',
    subtitle: 'Lacak IP Publik + Port + Timestamp ke identitas pelanggan PPPoE',
    href: '/infrastruktur/ipam',
    category: 'NOC & Infrastruktur',
    keywords: 'ipam cgnat ip publik kominfo bareskrim forensik subnet',
    badge: 'LEGAL',
    icon: ShieldCheck,
  },
  {
    id: 'cmd-ztp',
    title: 'Zero-Touch Provisioning (ZTP) Auto-Discovery ONU',
    subtitle: 'Otorisasi 1-klik modem ONT ZTE/Huawei/FiberHome yang baru dicolok',
    href: '/infrastruktur/ztp',
    category: 'NOC & Infrastruktur',
    keywords: 'ztp onu ont olt provisioning zte huawei omci',
    badge: 'ZTP',
    icon: Cpu,
  },
  {
    id: 'cmd-modem',
    title: 'Monitoring Modem TR-069 / GenieACS & Redaman Optik',
    subtitle: 'Inspeksi sinyal Rx/Tx dBm, suhu laser, SSID WiFi, dan remote reboot',
    href: '/modem-monitor',
    category: 'NOC & Infrastruktur',
    keywords: 'modem ont tr069 genieacs redaman dbm wifi ssin reboot',
    icon: Radio,
  },
  {
    id: 'cmd-gis-map',
    title: 'Peta GIS Topologi Jaringan FTTH (OLT / ODC / ODP)',
    subtitle: 'Visualisasi jalur kabel backbone, distribusi, dan radius cakupan ODP',
    href: '/infrastruktur/map',
    category: 'NOC & Infrastruktur',
    keywords: 'map peta gis ftth olt odc odp koordinat',
    icon: Globe,
  },
  {
    id: 'cmd-speedtest',
    title: 'Speedtest & Probe Kualitas Jaringan (QoS / SLA)',
    subtitle: 'Uji throughput, jitter, packet loss ke IXP/CDN dan sertifikat SLA',
    href: '/infrastruktur/speedtest',
    category: 'NOC & Infrastruktur',
    keywords: 'speedtest qos latency ping sla throughput',
    icon: Gauge,
  },
  {
    id: 'cmd-mikrotik',
    title: 'Manajemen Router MikroTik & FreeRADIUS NAS',
    subtitle: 'Sinkronisasi PPPoE Secret, Simple Queue, dan resource CPU/RAM',
    href: '/mikrotik',
    category: 'NOC & Infrastruktur',
    keywords: 'mikrotik routeros radius nas pppoe winbox',
    icon: Router,
  },

  // Sistem & Otomasi
  {
    id: 'cmd-automation',
    title: 'Engine Otomasi, Cron Scheduler & Webhook Pipeline',
    subtitle: 'Jadwal auto-isolir, pengingat WA H-3, dan simulasi alur IF-THEN',
    href: '/automation',
    category: 'Sistem & Otomasi',
    keywords: 'automation otomasi cron scheduler webhook wa',
    icon: Cpu,
  },
  {
    id: 'cmd-franchise',
    title: 'Manajemen Mitra Cabang, Reseller & Pajak BHP/USO Kominfo',
    subtitle: 'Bagi hasil revenue share, kuota bandwidth subnet, dan kalkulator USO',
    href: '/franchise',
    category: 'Sistem & Otomasi',
    keywords: 'franchise mitra cabang reseller bhp uso kominfo',
    icon: GitBranch,
  },
  {
    id: 'cmd-backup',
    title: 'Database Backup, Restore & Disaster Recovery',
    subtitle: 'Snapshot PostgreSQL 15, retensi S3/R2, dan uji integritas SHA-256',
    href: '/backup',
    category: 'Sistem & Otomasi',
    keywords: 'backup restore database postgresql dump recovery',
    icon: Database,
  },
  {
    id: 'cmd-audit',
    title: 'Security Audit Trail & Forensik Aktivitas Admin',
    subtitle: 'Log perubahan data, diff JSON before/after, dan deteksi anomali',
    href: '/audit-logs',
    category: 'Sistem & Otomasi',
    keywords: 'audit log security keamanan riwayat aktivitas',
    icon: ShieldCheck,
  },
  {
    id: 'cmd-test-api',
    title: 'API Diagnostic Playground & Health Inspector',
    subtitle: 'Uji endpoint REST API Port 3218, custom payload, dan benchmark latensi',
    href: '/debug/test-api',
    category: 'Sistem & Otomasi',
    keywords: 'debug test api swagger endpoint health',
    icon: Terminal,
  },
  {
    id: 'cmd-docs',
    title: 'Pusat Dokumentasi & SOP Teknis ISP',
    subtitle: 'Panduan arsitektur sistem, kamus API, dan runbook operasional NOC',
    href: '/dokumentasi',
    category: 'Sistem & Otomasi',
    keywords: 'dokumentasi sop panduan manual help',
    icon: BookOpen,
  },
  {
    id: 'cmd-settings',
    title: 'Pengaturan Sistem & Konfigurasi Global ISP',
    subtitle: 'Profil perusahaan, gateway pembayaran Midtrans, dan WhatsApp Fonnte',
    href: '/pengaturan',
    category: 'Sistem & Otomasi',
    keywords: 'pengaturan settings konfigurasi sistem midtrans wa',
    icon: Settings,
  },
]

const ROUTE_TITLES: Record<string, { section: string; title: string }> = {
  '/': { section: 'Command Center', title: 'Executive Operations Cockpit' },
  '/analytics': { section: 'Command Center', title: 'Revenue & Cohort Analytics' },
  '/noc': { section: 'NOC & Jaringan', title: 'NOC Real-Time Command Center' },
  '/noc/incidents': { section: 'NOC & Jaringan', title: 'Mass Outage & Incident Broadcast' },
  '/pelanggan': { section: 'CRM Pelanggan', title: 'Direktori Master Pelanggan' },
  '/pelanggan/suspend': { section: 'CRM Pelanggan', title: 'Isolir & Mesin Janji Bayar (CoA)' },
  '/pelanggan/retensi': { section: 'CRM Pelanggan', title: 'AI Churn Prediction Radar' },
  '/pelanggan/loyalty': { section: 'CRM Pelanggan', title: 'Loyalty & Point Reward Engine' },
  '/pelanggan/pending': { section: 'CRM Pelanggan', title: 'Antrean Pasang Baru (PSB)' },
  '/pelanggan/expired': { section: 'CRM Pelanggan', title: 'Pelanggan Expired & Winback' },
  '/pelanggan/import': { section: 'CRM Pelanggan', title: 'Batch Import Pelanggan CSV/Excel' },
  '/invoice': { section: 'Billing & Kas', title: 'Manajemen Faktur & Tagihan' },
  '/invoice/semua': { section: 'Billing & Kas', title: 'Arsip Seluruh Invoice' },
  '/invoice/overdue': { section: 'Billing & Kas', title: 'Tagihan Jatuh Tempo (Overdue)' },
  '/keuangan': { section: 'Billing & Kas', title: 'Jurnal Keuangan & Arus Kas' },
  '/keuangan/rekonsiliasi': { section: 'Billing & Kas', title: 'Auto-Rekonsiliasi Mutasi Bank' },
  '/packages-admin': { section: 'Katalog Layanan', title: 'Katalog Paket Internet FTTH' },
  '/packages-admin/upgrade-requests': { section: 'Katalog Layanan', title: 'Approval Upgrade & Kalkulator Prorata' },
  '/infrastruktur/olt': { section: 'Infrastruktur FTTH', title: 'OLT GPON Optical Matrix' },
  '/infrastruktur/odp': { section: 'Infrastruktur FTTH', title: 'ODP Port Allocation & Splitter' },
  '/infrastruktur/ztp': { section: 'Infrastruktur FTTH', title: 'ZTP Auto-Provisioning ONU' },
  '/infrastruktur/ipam': { section: 'Infrastruktur FTTH', title: 'IPAM & Forensik CGNAT Kominfo' },
  '/infrastruktur/traffic': { section: 'Infrastruktur FTTH', title: 'Live MRTG & Uplink 95th Percentile' },
  '/infrastruktur/otdr': { section: 'Infrastruktur FTTH', title: 'Kalkulator Jarak Putus OTDR & Splicing' },
  '/infrastruktur/map': { section: 'Infrastruktur FTTH', title: 'Peta GIS Topologi Fiber Optik' },
  '/infrastruktur/speedtest': { section: 'Infrastruktur FTTH', title: 'Speedtest & QoS SLA Probe' },
  '/modem-monitor': { section: 'NOC & Jaringan', title: 'Telemetri Modem TR-069 / GenieACS' },
  '/mikrotik': { section: 'NOC & Jaringan', title: 'Manajemen Router MikroTik & NAS' },
  '/automation': { section: 'Sistem & Otomasi', title: 'Workflow Automation & Cron Engine' },
  '/franchise': { section: 'Kemitraan', title: 'Mitra Cabang, Reseller & BHP/USO' },
  '/backup': { section: 'Sistem & Otomasi', title: 'Backup, Restore & Disaster Recovery' },
  '/audit-logs': { section: 'Sistem & Otomasi', title: 'Security Audit Trail & Forensik' },
  '/debug/test-api': { section: 'Sistem & Otomasi', title: 'API Diagnostic Playground' },
  '/dokumentasi': { section: 'Sistem & Otomasi', title: 'Pusat Dokumentasi & Runbook ISP' },
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const isInsideLayout = useContext(LayoutContext)
  const { resolvedTheme, toggleTheme } = useTheme()

  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQuery, setCmdQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase()
    if (!q) return COMMAND_ITEMS
    return COMMAND_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    )
  }, [cmdQuery])

  useEffect(() => {
    setSelectedIndex(0)
  }, [cmdQuery, cmdOpen])

  useEffect(() => {
    if (isInsideLayout) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((prev) => !prev)
      } else if (e.key === 'Escape' && cmdOpen) {
        e.preventDefault()
        setCmdOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isInsideLayout, cmdOpen])

  useEffect(() => {
    if (cmdOpen) {
      setTimeout(() => inputRef.current?.focus(), 40)
    } else {
      setCmdQuery('')
    }
  }, [cmdOpen])

  // If already inside a persistent root Layout (from _app.tsx), pass children directly
  if (isInsideLayout) {
    return <>{children}</>
  }

  const currentRouteMeta = ROUTE_TITLES[router.pathname] || {
    section: 'AUDIRA Enterprise',
    title:
      router.pathname === '/'
        ? 'Executive Operations Cockpit'
        : router.pathname
            .split('/')
            .filter(Boolean)
            .map((seg) => seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
            .join(' • '),
  }

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (filteredCommands.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const chosen = filteredCommands[selectedIndex]
      if (chosen) {
        setCmdOpen(false)
        router.push(chosen.href)
      }
    }
  }

  return (
    <LayoutContext.Provider value={true}>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-200">
        <Sidebar />
        <main className="lg:ml-72 min-h-screen flex flex-col">
          {/* Sticky Enterprise Topbar */}
          <header className="sticky top-0 z-30 h-14 bg-[var(--app-card)]/90 backdrop-blur-md border-b border-[var(--app-border)] px-4 lg:px-8 flex items-center justify-between gap-3">
            {/* Left: Breadcrumb & Active View */}
            <div className="flex items-center gap-2 min-w-0 pl-10 lg:pl-0">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {currentRouteMeta.section}
              </span>
              <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-[var(--app-text-muted)] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[var(--app-text)] truncate">
                {currentRouteMeta.title}
              </span>
            </div>

            {/* Center: Global Command Palette Trigger (Ctrl+K) */}
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-[var(--app-bg)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-all w-44 sm:w-72 md:w-96 group"
              title="Buka Global Command Palette (Ctrl+K)"
            >
              <span className="flex items-center gap-2 text-xs truncate">
                <Search className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">Cari modul, PPPoE, IPAM, OTDR, Invoice...</span>
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--app-card)] border border-[var(--app-border)] font-mono text-[10px] font-semibold text-[var(--app-text-muted)] group-hover:border-blue-500/40">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            {/* Right: Carrier Telemetry Shortcuts & Theme Toggle */}
            <div className="flex items-center gap-2">
              <Link
                href="/infrastruktur/traffic"
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-semibold transition-colors"
                title="Monitor Trafik Uplink MRTG & 95th Percentile"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Uplink MRTG</span>
              </Link>

              <Link
                href="/noc/incidents"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-semibold transition-colors"
                title="Pusat Insiden Outage & WA Broadcast"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>NOC Radar</span>
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--app-bg)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors"
                title={resolvedTheme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div key={router.pathname} className="animate-fade-in-smooth flex-1">
            {children}
          </div>
        </main>

        {/* Global Command Palette Modal (Ctrl+K) */}
        {cmdOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setCmdOpen(false)}
          >
            <div
              className="w-full max-w-2xl rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleModalKeyDown}
            >
              {/* Search Input Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--app-border)] bg-[var(--app-bg)]/50">
                <Search className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                  placeholder="Ketik nama halaman, fitur (mis. OTDR, CGNAT, MRTG, ZTP, Rekonsiliasi, Janji Bayar)..."
                  className="w-full bg-transparent text-sm text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none"
                />
                {cmdQuery && (
                  <button
                    type="button"
                    onClick={() => setCmdQuery('')}
                    className="text-xs text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-1.5 py-0.5 rounded"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCmdOpen(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Command Results List */}
              <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[var(--app-border)]/40">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-semibold text-[var(--app-text)]">
                      Modul atau perintah tidak ditemukan untuk &ldquo;{cmdQuery}&rdquo;
                    </p>
                    <p className="text-xs text-[var(--app-text-muted)] mt-1">
                      Coba kata kunci seperti <span className="font-mono">mrtg</span>, <span className="font-mono">otdr</span>, <span className="font-mono">cgnat</span>, <span className="font-mono">isolir</span>, atau <span className="font-mono">rekonsiliasi</span>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCommands.map((item, idx) => {
                      const IconComp = item.icon
                      const isSelected = idx === selectedIndex
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => {
                            setCmdOpen(false)
                            router.push(item.href)
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-[var(--app-surface-2)] text-[var(--app-text)]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[var(--app-bg)] border border-[var(--app-border)] text-blue-500'
                              }`}
                            >
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold truncate">{item.title}</span>
                                {item.badge && (
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                      isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-[11px] truncate mt-0.5 ${
                                  isSelected ? 'text-blue-100' : 'text-[var(--app-text-muted)]'
                                }`}
                              >
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-white/15 text-white'
                                  : 'bg-[var(--app-bg)] text-[var(--app-text-muted)] border border-[var(--app-border)]'
                              }`}
                            >
                              {item.href}
                            </span>
                            <CornerDownLeft
                              className={`w-3.5 h-3.5 ${
                                isSelected ? 'text-white' : 'text-[var(--app-text-muted)] opacity-40'
                              }`}
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer Shortcuts */}
              <div className="px-4 py-2.5 border-t border-[var(--app-border)] bg-[var(--app-bg)] flex items-center justify-between text-[11px] text-[var(--app-text-muted)]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--app-card)] border border-[var(--app-border)] font-mono text-[10px]">
                      ↑↓
                    </kbd>{' '}
                    Navigasi
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--app-card)] border border-[var(--app-border)] font-mono text-[10px]">
                      Enter
                    </kbd>{' '}
                    Buka Modul
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--app-card)] border border-[var(--app-border)] font-mono text-[10px]">
                      Esc
                    </kbd>{' '}
                    Tutup
                  </span>
                </div>
                <span className="font-mono text-[10px]">
                  {filteredCommands.length} Modul Terindeks
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutContext.Provider>
  )
}
