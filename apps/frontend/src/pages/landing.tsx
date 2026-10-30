import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Activity,
  Server,
  ShieldCheck,
  CreditCard,
  Wifi,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  Check,
  X,
  Radio,
  FileCheck,
  Cpu,
  Smartphone,
  Printer,
  Compass,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  Lock,
  Phone,
  Mail,
  User,
  Eye,
  EyeOff,
  UserCheck,
  Loader2,
  LogOut,
  Moon,
  Sun,
  Terminal,
  Network,
  Receipt,
  HelpCircle,
  ExternalLink
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user, login, logout, isLoading: authLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY')
  const [customerCount, setCustomerCount] = useState<number>(300)
  const [activeConsoleTab, setActiveConsoleTab] = useState<'RADIUS' | 'ODP' | 'STRUK' | 'DIAGNOSTIC'>('RADIUS')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Auth Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN')

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Register Form States
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regCompany, setRegCompany] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regPlan, setRegPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')

  // Pricing calculations
  const discountMultiplier = billingCycle === 'ANNUAL' ? 0.8 : 1.0
  const starterPrice = Math.round(99000 * discountMultiplier)
  const proPrice = Math.round(249000 * discountMultiplier)
  const enterprisePrice = Math.round(799000 * discountMultiplier)

  // Honest ROI formula based on customer volume
  const hoursSavedPerMonth = Math.round(customerCount * 0.15)
  const estimatedRevenuePerMonth = customerCount * 175000

  // Keyboard shortcut listener (Escape to close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && authModalOpen) {
        setAuthModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [authModalOpen])

  const openAuthModal = (tab: 'LOGIN' | 'REGISTER', plan: 'starter' | 'pro' | 'enterprise' = 'pro') => {
    setAuthModalTab(tab)
    if (plan) setRegPlan(plan)
    setLoginError('')
    setRegError('')
    setRegSuccess('')
    setAuthModalOpen(true)
  }

  const handleModalLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      await login(loginEmail, loginPassword)
      setAuthModalOpen(false)
      router.push('/')
    } catch (err: any) {
      setLoginError(err.message || 'Email atau kata sandi tidak valid. Periksa kembali akun Anda.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleQuickDemoLogin = async (email: string, pass: string) => {
    setLoginLoading(true)
    setLoginError('')
    setLoginEmail(email)
    setLoginPassword(pass)

    try {
      await login(email, pass)
      setAuthModalOpen(false)
      router.push('/')
    } catch (err: any) {
      setLoginError(err.message || 'Gagal login demo. Silakan coba lagi.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleModalRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    setRegError('')
    setRegSuccess('')

    if (regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi kata sandi tidak cocok.')
      setRegLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          name: regName,
          password: regPassword,
          role: 'BILLING',
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal diproses server.')
      }

      setRegSuccess('Registrasi berhasil. Masuk otomatis ke akun Anda...')
      
      setTimeout(async () => {
        try {
          await login(regEmail, regPassword)
          setAuthModalOpen(false)
          router.push('/')
        } catch {
          setAuthModalTab('LOGIN')
          setLoginEmail(regEmail)
          setLoginPassword(regPassword)
        }
      }, 1000)
    } catch (err: any) {
      setRegError(err.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setRegLoading(false)
    }
  }

  const faqs = [
    {
      q: 'Apakah saya membutuhkan IP Publik Statis untuk menghubungkan MikroTik ke AUDIRA?',
      a: 'Tidak wajib. Jika router MikroTik Anda berada di balik jaringan CGNAT atau modem ISP residensial tanpa IP Publik statis, AUDIRA menyediakan fitur Auto-Tunnel WireGuard Cloud bawaan. Anda cukup menempelkan skrip satu baris ke Terminal RouterOS Winbox, dan router langsung terhubung aman ke server AUDIRA.'
    },
    {
      q: 'Bagaimana cara migrasi dari Winbox yang sudah berjalan atau sistem billing lain?',
      a: 'Sangat praktis. AUDIRA menyediakan modul Import PPP Secrets Langsung dari MikroTik. Cukup masukkan kredensial API router, seluruh data username, password, dan profil paket pelanggan yang aktif di MikroTik akan otomatis disinkronkan ke database tanpa memutus koneksi internet pelanggan.'
    },
    {
      q: 'Bagaimana cara kerja pembayaran otomatis QRIS dan Unblock instan?',
      a: 'Saat invoice diterbitkan via WhatsApp atau aplikasi pelanggan, tagihan dilengkapi QRIS Dinamis standar BI dan ASPI. Ketika pembayaran terkonfirmasi, webhook payment gateway mengirimkan sinyal ke core billing, lalu sistem mengeksekusi paket RADIUS CoA (Port UDP 3799) ke MikroTik untuk membuka blokir seketika dalam waktu kurang dari 2 detik tanpa perlu me-reload router.'
    },
    {
      q: 'Apa saja 4 aplikasi yang termasuk dalam ekosistem AUDIRA?',
      a: 'Ekosistem AUDIRA mencakup empat antarmuka terintegrasi: (1) Web Admin Cockpit untuk kontrol billing dan NOC, (2) Aplikasi Mobile Pelanggan dengan diagnosis mandiri Dokter Jaringan, (3) Aplikasi Mobile Teknisi untuk manajemen SPK dan panduan rute ODP, serta (4) Aplikasi Kasir Kolektor Lapangan dengan fitur cetak struk printer thermal Bluetooth 58mm/80mm.'
    },
    {
      q: 'Apakah sistem AUDIRA bisa dibeli putus dengan lisensi On-Premise?',
      a: 'Bisa. Selain opsi langganan cloud SaaS, kami menyediakan Paket Enterprise On-Premise untuk ISP resmi atau institusi yang menghendaki kedaulatan data penuh pada server lokal atau private cloud sendiri, lengkap dengan modul kepatuhan Ditjen PPI Kominfo.'
    },
    {
      q: 'Berapa lama masa uji coba gratis dan apakah membutuhkan kartu kredit?',
      a: 'Uji coba gratis berlangsung selama 14 hari penuh dengan seluruh fitur Pro aktif. Anda tidak memerlukan kartu kredit. Cukup daftarkan nama usaha dan email Anda untuk langsung menguji sistem.'
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Head>
        <title>AUDIRA-NET: Software Billing &amp; Network Automation ISP Indonesia</title>
        <meta
          name="description"
          content="Sistem billing MikroTik, OLT, RADIUS CoA, dan operasional lapangan terpadu untuk ISP dan RT/RW Net di Indonesia. Dilengkapi WireGuard Auto-Tunnel, Peta GIS ODP, dan Kasir Struk Thermal."
        />
      </Head>

      {/* ─── Engineering Notice Bar (Precision Strip) ───────────────────── */}
      <div className="bg-[var(--app-card-subtle)] border-b border-[var(--app-border)] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-[var(--app-text-muted)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-bold text-[var(--app-text)]">AUDIRA CORE ENGINE v2.4</span>
            <span className="hidden md:inline text-[var(--app-border-strong)]">|</span>
            <span className="hidden md:inline">RADIUS CoA RFC 3576 &lt; 2s Execution</span>
            <span className="hidden lg:inline text-[var(--app-border-strong)]">|</span>
            <span className="hidden lg:inline">WireGuard Multi-Tenant BNG</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuthModal('REGISTER', 'pro')}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Uji Coba 14 Hari Tanpa Komitmen &rarr;
            </button>
            <button
              onClick={toggleTheme}
              className="p-1 rounded text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition cursor-pointer"
              title="Ganti Tema (Light / Dark)"
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 1. Header Navigation ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[var(--app-card)] border-b border-[var(--app-border)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primitive-navy-800)] dark:bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight font-mono text-[var(--app-text)]">
                  AUDIRA<span className="text-blue-600 dark:text-blue-400">-NET</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]">
                  BSS/OSS
                </span>
              </div>
              <p className="text-[10px] text-[var(--app-text-muted)] leading-none hidden sm:block">
                Network &amp; Billing Automation
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[var(--app-text-muted)]">
            <a href="#arsitektur" className="hover:text-[var(--app-text)] transition">Arsitektur</a>
            <a href="#ekosistem" className="hover:text-[var(--app-text)] transition">4 Aplikasi</a>
            <a href="#komparasi" className="hover:text-[var(--app-text)] transition">Bandingkan Solusi</a>
            <a href="#kalkulator" className="hover:text-[var(--app-text)] transition">Kalkulator ROI</a>
            <a href="#harga" className="hover:text-[var(--app-text)] transition">Paket Lisensi</a>
            <a href="#faq" className="hover:text-[var(--app-text)] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-mono font-medium text-[var(--app-text-muted)]">
                  {user.email}
                </span>
                <button
                  onClick={() => router.push('/')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Server size={14} />
                  <span>Buka Cockpit</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-[var(--app-text-muted)] hover:text-rose-500 border border-[var(--app-border)] transition cursor-pointer"
                  title="Keluar"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal('LOGIN')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] transition cursor-pointer"
                >
                  Masuk Cockpit
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('REGISTER', 'pro')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Coba Gratis 14 Hari</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── 2. Hero Section: Asymmetric Engineering Layout ─────────────── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Authoritative Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[11px] font-mono text-[var(--app-text-muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>CARRIER-GRADE ISP BSS/OSS PLATFORM</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--app-text)] leading-[1.15]">
                Sistem Operasi Billing &amp; Otomasi Jaringan MikroTik / FTTH Terpadu
              </h1>

              <p className="text-sm sm:text-base text-[var(--app-text-muted)] leading-relaxed max-w-2xl">
                Tinggalkan pencatatan manual dan ketergantungan script Winbox yang rentan macet. AUDIRA-NET menyatukan manajemen isolir real-time <strong>RADIUS CoA RFC 3576</strong>, WireGuard Auto-Tunnel untuk router tanpa IP Publik, peta spasial kabel optik ODP, pembayaran QRIS otomatis 24 jam, serta 4 aplikasi operasional mandiri.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => openAuthModal('REGISTER', 'pro')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Server size={15} />
                  <span>Mulai Uji Coba Gratis 14 Hari</span>
                </button>

                <button
                  onClick={() => openAuthModal('LOGIN')}
                  className="px-5 py-3 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Terminal size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>Akses Akun Demo 1-Klik</span>
                </button>

                <a
                  href="https://wa.me/6282112001600?text=Halo%20AUDIRA,%20saya%20ingin%20konsultasi%20implementasi%20sistem%20billing%20ISP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-[var(--app-card-subtle)] hover:bg-[var(--app-border)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  <Phone size={14} className="text-emerald-600" />
                  <span>Konsultasi (+62 821-1200-1600)</span>
                </a>
              </div>

              {/* Technical Capability Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-[var(--app-text-muted)] border-t border-[var(--app-border)]">
                <div>
                  <p className="font-bold text-[var(--app-text)]">MikroTik v6 &amp; v7</p>
                  <p className="text-[10px]">API &amp; RADIUS CoA</p>
                </div>
                <div>
                  <p className="font-bold text-[var(--app-text)]">&lt; 2s CoA ACK</p>
                  <p className="text-[10px]">Unblock isolir seketika</p>
                </div>
                <div>
                  <p className="font-bold text-[var(--app-text)]">WireGuard BNG</p>
                  <p className="text-[10px]">Bypass CGNAT tanpa IP Publik</p>
                </div>
                <div>
                  <p className="font-bold text-[var(--app-text)]">PSAK &amp; PPI</p>
                  <p className="text-[10px]">Standar Pajak &amp; Kominfo</p>
                </div>
              </div>
            </div>

            {/* Right Column: Tangible Live Network Console Mockup */}
            <div className="lg:col-span-5">
              <div className="bg-[var(--primitive-navy-950)] text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
                
                {/* Console Window Header */}
                <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[11px] text-slate-400 ml-2 font-semibold">
                      core-bng-router: audira-radius
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    LIVE TELEMETRY
                  </span>
                </div>

                {/* Console Subtabs */}
                <div className="bg-slate-900/60 px-3 py-1.5 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-[11px]">
                  <button
                    onClick={() => setActiveConsoleTab('RADIUS')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      activeConsoleTab === 'RADIUS'
                        ? 'bg-slate-800 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    RADIUS CoA
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('ODP')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      activeConsoleTab === 'ODP'
                        ? 'bg-slate-800 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ODP Spasial
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('STRUK')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      activeConsoleTab === 'STRUK'
                        ? 'bg-slate-800 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Struk Thermal
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('DIAGNOSTIC')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      activeConsoleTab === 'DIAGNOSTIC'
                        ? 'bg-slate-800 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Dokter Jaringan
                  </button>
                </div>

                {/* Console Screen Output */}
                <div className="p-4 space-y-2.5 text-[11px] min-h-[260px] flex flex-col justify-between">
                  {activeConsoleTab === 'RADIUS' && (
                    <div className="space-y-2 animate-fade-in-smooth">
                      <p className="text-slate-400">&gt; RADIUS CoA Socket: 10.10.10.1:3799 [UDP RFC 3576]</p>
                      <p className="text-amber-400">&gt; [EVENT] Webhook QRIS Dinamis BI paid: INV-202610-092 (Rp 250.000)</p>
                      <p className="text-cyan-400">&gt; [CoA-REQ] User: hendra_fiber | NAS-IP: 10.10.10.1 | Mikrotik-Rate-Limit: 50M/50M</p>
                      <p className="text-emerald-400">&gt; [CoA-ACK] Response code 44 (Success) in 1.28s</p>
                      <p className="text-slate-400">&gt; Status: UNBLOCKED. Sesi PPPoE tetap berjalan (Dynamic Rate-Limit aktif).</p>
                      <div className="mt-3 p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-300 flex justify-between">
                        <span>Aktif PPPoE: 482 Sesi</span>
                        <span className="text-emerald-400">Total B/W: 1.84 Gbps</span>
                      </div>
                    </div>
                  )}

                  {activeConsoleTab === 'ODP' && (
                    <div className="space-y-2 animate-fade-in-smooth font-sans">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800 font-mono text-[11px]">
                        <span className="text-cyan-300 font-bold">ODP-KMG-02 (Cluster Kemang)</span>
                        <span className="text-emerald-400 font-bold">8/8 PORT OK</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <p className="text-slate-400">Redaman Optik OLT</p>
                          <p className="text-sm font-bold text-emerald-400">-19.4 dBm (Normal)</p>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <p className="text-slate-400">Jarak Kabel Feeder</p>
                          <p className="text-sm font-bold text-slate-200">1.420 Meter</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Koordinat GPS: -6.229728, 106.829440 (Tersambung ke Google Maps Teknisi)
                      </p>
                    </div>
                  )}

                  {activeConsoleTab === 'STRUK' && (
                    <div className="space-y-1.5 animate-fade-in-smooth font-mono text-[10px] bg-slate-900 p-3 rounded border border-slate-800">
                      <p className="text-center font-bold text-slate-200">AUDIRA NETWORK - BUKTI BAYAR</p>
                      <p className="text-center text-slate-400 text-[9px]">LOKET KOLEKTOR RESMI #04</p>
                      <div className="border-t border-dashed border-slate-700 my-1 pt-1 text-slate-300 space-y-0.5">
                        <p>Pelanggan : Siti Rahmawati</p>
                        <p>ID Paket  : Home Fiber 30 Mbps</p>
                        <p>Periode   : Oktober 2026</p>
                        <p className="text-emerald-400 font-bold">TOTAL     : Rp 200.000 (LUNAS TUNAI)</p>
                      </div>
                      <p className="text-slate-400 text-[9px] pt-1">Cetak: Printer Thermal Bluetooth 58mm ESC/POS</p>
                    </div>
                  )}

                  {activeConsoleTab === 'DIAGNOSTIC' && (
                    <div className="space-y-1.5 animate-fade-in-smooth text-[10px] font-mono">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                        <span>1. Status Redaman Optik ONT</span>
                        <span className="text-emerald-400 font-bold">-18.8 dBm (Baik)</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                        <span>2. Sesi PPPoE Gateway</span>
                        <span className="text-emerald-400 font-bold">TERKONEKSI</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                        <span>3. Latensi DNS Core</span>
                        <span className="text-cyan-300 font-bold">8 ms (Normal)</span>
                      </div>
                      <p className="text-slate-400 text-[9px] pt-1">
                        Diagnosis mandiri via App Pelanggan tanpa perlu telepon CS.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Engine: NestJS + FreeRADIUS + Go</span>
                    <button
                      onClick={() => openAuthModal('LOGIN')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Buka Web Admin Cockpit &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. Architecture & Operational Circuit ──────────────────────── */}
      <section id="arsitektur" className="py-16 md:py-20 border-b border-[var(--app-border)] bg-[var(--app-card-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              TOPOLOGI &amp; ALIRAN DATA TERPADU
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-1">
              Bagaimana AUDIRA Mengontrol Jaringan Anda
            </h2>
            <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-2 leading-relaxed">
              Arsitektur terdistribusi menghubungkan router di lapangan, server RADIUS di cloud, payment gateway, dan perangkat mobile staf secara real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1 */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  LANGKAH 1
                </span>
                <Radio size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-[var(--app-text)]">
                Koneksi Router Tanpa IP Publik
              </h3>
              <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                Router MikroTik Anda dihubungkan ke AUDIRA BNG via Auto-Tunnel WireGuard dengan satu skrip terminal. Tidak perlu sewa IP Publik statis mahal ke upstream.
              </p>
              <div className="p-2.5 bg-[var(--app-bg)] rounded border border-[var(--app-border)] font-mono text-[10px] text-[var(--app-text-muted)]">
                /interface wireguard add name=audira-tun<br />
                /interface wireguard peers add endpoint=core.audira.net
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600">
                  LANGKAH 2
                </span>
                <CreditCard size={16} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-[var(--app-text)]">
                Otomatisasi Pembayaran 24 Jam
              </h3>
              <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                Invoice terkirim otomatis ke WhatsApp pelanggan dengan tautan QRIS Dinamis (ShopeePay, BCA, Mandiri, DANA, OVO). Uang langsung masuk rekening merchant Anda.
              </p>
              <div className="p-2.5 bg-[var(--app-bg)] rounded border border-[var(--app-border)] font-mono text-[10px] text-emerald-600">
                ● Webhook callback terverifikasi ASPI/BI<br />
                ● Mutasi otomatis tanpa konfirmasi struk manual
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600">
                  LANGKAH 3
                </span>
                <Cpu size={16} className="text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-[var(--app-text)]">
                Eksekusi RADIUS CoA Instan
              </h3>
              <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                Core server mengirim paket RADIUS CoA RFC 3576 untuk meng-upgrade speed profile dan membuka isolir dalam hitungan detik tanpa memutus sesi PPPoE yang sedang jalan.
              </p>
              <div className="p-2.5 bg-[var(--app-bg)] rounded border border-[var(--app-border)] font-mono text-[10px] text-indigo-600">
                ● Port UDP 3799 Change-of-Authorization<br />
                ● Latensi eksekusi rata-rata &lt; 1.5 detik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. The 4-App Ecosystem ────────────────────────────────────── */}
      <section id="ekosistem" className="py-16 md:py-20 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              INTEGRASI MULTI-PLATFORM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-1">
              4 Aplikasi untuk Seluruh Tim Operasional
            </h2>
            <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-2 leading-relaxed">
              Satu database tersinkronisasi menghubungkan tim kantor, petugas lapangan, kolektor iuran, dan pelanggan dalam satu platform kerja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* App 1: Web Admin */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Server size={16} />
                </div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">
                  1. Web Admin Cockpit
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                  Pusat kendali komprehensif untuk pemilik ISP dan tim NOC: monitoring multi-router MikroTik, grafik utilisasi bandwidth, batch invoicing, dan laporan akuntansi PSAK.
                </p>
              </div>
              <ul className="text-[11px] text-[var(--app-text)] space-y-1 pt-2 border-t border-[var(--app-border)]">
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-blue-600" />
                  <span>Multi-NAS BNG Router</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-blue-600" />
                  <span>Akuntansi Laba Rugi &amp; Neraca</span>
                </li>
              </ul>
            </div>

            {/* App 2: Mobile Pelanggan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Smartphone size={16} />
                </div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">
                  2. App Mobile Pelanggan
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                  Memberikan kemandirian kepada pelanggan: fitur Dokter Jaringan 1-Tap untuk cek redaman dan DNS sendiri, pembayaran QRIS, serta tombol minta grace period darurat.
                </p>
              </div>
              <ul className="text-[11px] text-[var(--app-text)] space-y-1 pt-2 border-t border-[var(--app-border)]">
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-600" />
                  <span>Dokter Jaringan Mandiri</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-600" />
                  <span>Bayar QRIS &amp; Riwayat Tagihan</span>
                </li>
              </ul>
            </div>

            {/* App 3: Mobile Teknisi */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Compass size={16} />
                </div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">
                  3. App Mobile Teknisi
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                  Alat kerja lapangan untuk instalasi pasang baru dan maintenance: terima SPK kerja tiket, panduan rute navigasi tiang ODP, dan unggah bukti foto redaman optik.
                </p>
              </div>
              <ul className="text-[11px] text-[var(--app-text)] space-y-1 pt-2 border-t border-[var(--app-border)]">
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-amber-600" />
                  <span>Peta Navigasi Tiang ODP</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-amber-600" />
                  <span>Presensi GPS &amp; Bukti Foto</span>
                </li>
              </ul>
            </div>

            {/* App 4: Mobile Kasir */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Printer size={16} />
                </div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">
                  4. App Kasir &amp; Kolektor
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                  Solusi penagihan tunai lapangan: kolektor dapat mencetak struk thermal Bluetooth (58mm/80mm), otomatis unblock isolir seketika, dan hitung komisi agen mitra.
                </p>
              </div>
              <ul className="text-[11px] text-[var(--app-text)] space-y-1 pt-2 border-t border-[var(--app-border)]">
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-indigo-600" />
                  <span>Cetak Struk ESC/POS</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-indigo-600" />
                  <span>Bagi Hasil Komisi Mitra</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. Technical Comparison Table: Precision Matrix ───────────── */}
      <section id="komparasi" className="py-16 md:py-20 border-b border-[var(--app-border)] bg-[var(--app-card-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              MATRIKS PERBANDINGAN FITUR
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-1">
              Bandingkan AUDIRA-NET dengan Sistem Konvensional
            </h2>
            <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-2 leading-relaxed">
              Evaluasi teknis antara metode billing radius lama, penyedia SaaS lain (seperti SeBilling), dan platform AUDIRA-NET.
            </p>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)] font-mono text-[11px]">
                  <th className="py-3.5 px-4 font-bold text-[var(--app-text)]">Parameter &amp; Kapabilitas</th>
                  <th className="py-3.5 px-4 font-bold text-[var(--app-text-muted)]">Radius Konvensional</th>
                  <th className="py-3.5 px-4 font-bold text-[var(--app-text-muted)]">SeBilling (PT Semesta)</th>
                  <th className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5">
                    AUDIRA-NET BSS/OSS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] font-sans">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[var(--app-text)]">Metode Eksekusi Isolir / Buka Blokir</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Script cron antrean lambat</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">RouterOS API Polling</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 bg-blue-500/5 font-mono">
                    RADIUS CoA RFC 3576 (&lt; 2 Detik Real-Time)
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[var(--app-text)]">Koneksi Router Tanpa IP Publik (Anti-CGNAT)</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Konfigurasi VPN manual rumit</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Tersedia Tunnel VPN</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 bg-blue-500/5 font-mono">
                    WireGuard Cloud Auto-Tunnel 1-Baris Skrip
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[var(--app-text)]">Peta Spasial ODP &amp; Kalkulator Redaman Optik</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Tidak tersedia</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Pin Google Maps sederhana</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 bg-blue-500/5">
                    Peta Spasial GeoJSON + dBm Redaman + Kalkulator OTDR
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[var(--app-text)]">Aplikasi Pelanggan &amp; Diagnosis Mandiri</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Tidak tersedia</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Tes ping standar</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 bg-blue-500/5">
                    Dokter Jaringan 1-Tap &amp; AI Tanya Audi
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[var(--app-text)]">Aplikasi Kasir Kolektor Struk Thermal</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Kwitansi nota tulis manual</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Mendukung printer thermal</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 bg-blue-500/5">
                    Struk ESC/POS Bluetooth + Bagi Hasil Komisi Agen
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[var(--app-text)]">Laporan Akuntansi Standar PSAK &amp; Pajak</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Tidak ada</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Pencatatan kas dasar</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 bg-blue-500/5">
                    Laba Rugi, Neraca, Jurnal, Faktur Pajak PPN
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[var(--app-text)]">Kedaulatan Lisensi &amp; Opsi Deployment</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Server lokal sendiri</td>
                  <td className="py-3 px-4 text-[var(--app-text-muted)]">Hanya SaaS Cloud</td>
                  <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5">
                    Dual Hybrid: Cloud SaaS ATAU Beli Putus On-Premise
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 6. Interactive ROI Calculator ─────────────────────────────── */}
      <section id="kalkulator" className="py-16 md:py-20 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              SIMULASI EFISIENSI OPERASIONAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-1">
              Kalkulator Efisiensi Penagihan
            </h2>
            <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-1">
              Geser jumlah pelanggan aktif Anda untuk melihat estimasi waktu kerja admin yang dihemat setiap bulan.
            </p>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[var(--app-text)]">
                  Jumlah Pelanggan Aktif:
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {customerCount} Pelanggan
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={customerCount}
                onChange={e => setCustomerCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[var(--app-bg)] rounded appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-[var(--app-text-muted)] font-mono mt-1">
                <span>50</span>
                <span>500</span>
                <span>1.000</span>
                <span>2.000 Pelanggan</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--app-border)] font-mono">
              <div className="p-3 bg-[var(--app-card-subtle)] rounded-lg border border-[var(--app-border)]">
                <p className="text-[10px] text-[var(--app-text-muted)] uppercase">Waktu Admin Dihemat</p>
                <p className="text-xl font-black text-emerald-600 mt-1">
                  ~{hoursSavedPerMonth} Jam / bln
                </p>
                <p className="text-[10px] text-[var(--app-text-muted)] font-sans mt-0.5">
                  Bebas dari rekonsiliasi mutasi manual
                </p>
              </div>

              <div className="p-3 bg-[var(--app-card-subtle)] rounded-lg border border-[var(--app-border)]">
                <p className="text-[10px] text-[var(--app-text-muted)] uppercase">Estimasi Penagihan</p>
                <p className="text-xl font-black text-[var(--app-text)] mt-1">
                  Rp {(estimatedRevenuePerMonth / 1000000).toFixed(1)} Juta
                </p>
                <p className="text-[10px] text-[var(--app-text-muted)] font-sans mt-0.5">
                  Asumsi ARPU Rp 175.000 / pelanggan
                </p>
              </div>

              <div className="p-3 bg-[var(--app-card-subtle)] rounded-lg border border-[var(--app-border)]">
                <p className="text-[10px] text-[var(--app-text-muted)] uppercase">Kecepatan Buka Isolir</p>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  &lt; 2 Detik
                </p>
                <p className="text-[10px] text-[var(--app-text-muted)] font-sans mt-0.5">
                  Otomatis via RADIUS CoA port 3799
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Transparent Pricing Plans ──────────────────────────────── */}
      <section id="harga" className="py-16 md:py-20 border-b border-[var(--app-border)] bg-[var(--app-card-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              PAKET &amp; INVESTASI TRANSPARAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text)]">
              Pilihan Lisensi Sesuai Skala Jaringan Anda
            </h2>
            <p className="text-xs text-[var(--app-text-muted)]">
              Seluruh paket menyertakan garansi update modul reguler dan dukungan teknis.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-3 py-1.5 rounded transition cursor-pointer ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('ANNUAL')}
                className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'ANNUAL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                <span>Tahunan</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500 text-white">
                  Hemat 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Starter Tier */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--app-text)]">Paket Starter</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]">
                    RT/RW Net
                  </span>
                </div>
                <p className="text-xs text-[var(--app-text-muted)] mt-1">
                  Untuk pengusaha internet lingkungan dan rintisan awal.
                </p>

                <div className="mt-4 pb-4 border-b border-[var(--app-border)] font-mono">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-[var(--app-text-muted)]">Rp</span>
                    <span className="text-2xl font-black text-[var(--app-text)]">
                      {starterPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-[var(--app-text-muted)]">/ bulan</span>
                  </div>
                  <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5">
                    Kapasitas hingga 100 pelanggan aktif
                  </p>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-[var(--app-text)]">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>1 Router MikroTik (WireGuard Auto-Tunnel)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Otomasi Isolir &amp; Sinkronisasi PPP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Payment Gateway QRIS Dinamis BI/ASPI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Pengingat WhatsApp Otomatis (Fonnte)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Aplikasi Mobile Pelanggan</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openAuthModal('REGISTER', 'starter')}
                className="mt-6 w-full py-2.5 rounded-lg text-xs font-bold text-center border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] transition cursor-pointer"
              >
                Mulai Uji Coba Starter
              </button>
            </div>

            {/* 2. Pro Tier */}
            <div className="bg-[var(--app-card)] border-2 border-blue-600 rounded-xl p-6 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white uppercase">
                Rekomendasi WISP
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--app-text)]">Paket Pro</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Klaster FTTH
                  </span>
                </div>
                <p className="text-xs text-[var(--app-text-muted)] mt-1">
                  Kekuatan otomasi jaringan untuk ISP dan pengelola klaster optik.
                </p>

                <div className="mt-4 pb-4 border-b border-[var(--app-border)] font-mono">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-[var(--app-text-muted)]">Rp</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {proPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-[var(--app-text-muted)]">/ bulan</span>
                  </div>
                  <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5">
                    Kapasitas hingga 500 pelanggan aktif
                  </p>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-[var(--app-text)]">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span><strong>Seluruh fitur Paket Starter</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Hingga 3 Router MikroTik Multi-NAS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>RADIUS CoA Real-Time (&lt; 2s Unblock)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Peta Spasial GIS ODP &amp; Kalkulator OTDR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Dokter Jaringan Mandiri &amp; AI Tanya Audi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Kasir Kolektor Struk Thermal Bluetooth</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openAuthModal('REGISTER', 'pro')}
                className="mt-6 w-full py-2.5 rounded-lg text-xs font-bold text-center bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition active:scale-98 cursor-pointer"
              >
                Mulai Uji Coba Pro (14 Hari Gratis)
              </button>
            </div>

            {/* 3. Enterprise / On-Premise */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--app-text)]">Enterprise / On-Premise</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600">
                    ISP Kominfo
                  </span>
                </div>
                <p className="text-xs text-[var(--app-text-muted)] mt-1">
                  Untuk ISP berizin resmi atau instalasi server private lokal.
                </p>

                <div className="mt-4 pb-4 border-b border-[var(--app-border)] font-mono">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-[var(--app-text-muted)]">Rp</span>
                    <span className="text-2xl font-black text-[var(--app-text)]">
                      {enterprisePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-[var(--app-text-muted)]">/ bulan</span>
                  </div>
                  <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5">
                    Pelanggan tanpa batas &amp; multi-POP
                  </p>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-[var(--app-text)]">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span><strong>Seluruh fitur Pro tanpa batas kuota</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Multi-NAS Anycast BNG &amp; NetFlow v9</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Modul Pelaporan Ditjen PPI Kominfo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Akuntansi Standar PSAK + Faktur Pajak PPN</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Modul Manajemen SDM &amp; Payroll Gaji</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Opsi Beli Putus Lisensi (Full Source Code)</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://wa.me/6282112001600?text=Halo%20AUDIRA,%20saya%20tertarik%20dengan%20Paket%20Enterprise%20On-Premise"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-2.5 rounded-lg text-xs font-bold text-center border border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition"
              >
                Hubungi Lisensi On-Premise
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 8. Technical FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="py-16 md:py-20 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              INFORMASI TEKNIS &amp; IMPLEMENTASI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-1">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={index}
                  className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-[var(--app-text-muted)] transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[var(--app-text-muted)] leading-relaxed border-t border-[var(--app-border)] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 9. Closing Action Banner ─────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[var(--primitive-navy-900)] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
            Mulai Otomasi Penagihan &amp; Jaringan ISP Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bergabunglah dengan operator internet yang telah memodernisasi infrastruktur mereka dengan AUDIRA-NET. Aktifkan akun uji coba dalam 1 menit.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('REGISTER', 'pro')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition active:scale-98 cursor-pointer"
            >
              Daftar Uji Coba Gratis 14 Hari
            </button>
            <a
              href="https://wa.me/6282112001600?text=Halo%20AUDIRA,%20saya%20siap%20mencoba%20sistem%20billing%20ISP"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Phone size={14} className="text-emerald-400" />
              <span>WhatsApp (+62 821-1200-1600)</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 10. Comprehensive Corporate & Operational Footer ─────────── */}
      <footer className="bg-slate-100 dark:bg-[#05070d] text-slate-600 dark:text-gray-400 text-xs py-14 border-t-2 border-slate-300 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand & Author (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black">
                  <Wifi className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                    Audira<span className="text-cyan-600 dark:text-cyan-400">NET</span>
                  </span>
                  <span className="block text-[9px] font-mono tracking-widest text-slate-500 dark:text-gray-400 uppercase">
                    Audira Multimedia Digital
                  </span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-xs">
                AudiraNET adalah ekosistem penyedia layanan internet fiber optik dan sistem manajemen ISP terpadu, dikembangkan di bawah naungan Audira Multimedia Digital / Audira Sukses Mandiri.
              </p>

              <div className="font-mono text-[11px] text-slate-600 dark:text-gray-400 space-y-1">
                <p>
                  Founder &amp; Author: <strong className="text-slate-900 dark:text-white font-bold">Agus Dwi Rianto (AUDIRA)</strong>
                </p>
                <p>
                  Official Website:{' '}
                  <a
                    href="https://audira.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    https://audira.my.id
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:agusdwirianto@gmail.com"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    agusdwirianto@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Column 2: LAYANAN INTERNET */}
            <div className="space-y-3">
              <h4 className="text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider text-xs">
                LAYANAN INTERNET
              </h4>
              <ul className="space-y-2 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => openAuthModal('REGISTER', 'starter')}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer"
                  >
                    Home Starter 20 Mbps
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAuthModal('REGISTER', 'pro')}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer"
                  >
                    Gamer Ultra 50 Mbps
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAuthModal('REGISTER', 'pro')}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer"
                  >
                    Pro Streamer 100 Mbps
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAuthModal('REGISTER', 'enterprise')}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer"
                  >
                    Dedicated Corporate
                  </button>
                </li>
                <li>
                  <a
                    href="#arsitektur"
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
                  >
                    Peta Jangkauan ODP
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: AKSES SISTEM */}
            <div className="space-y-3">
              <h4 className="text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider text-xs">
                AKSES SISTEM
              </h4>
              <ul className="space-y-2 font-medium">
                <li>
                  <a
                    href="http://localhost:3219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
                  >
                    <span>Portal Pelanggan</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 dark:text-gray-500" />
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAuthModal('LOGIN')}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer text-left"
                  >
                    <span>Dashboard Admin ISP</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 dark:text-gray-500" />
                  </button>
                </li>
                <li>
                  <a href="#kalkulator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    Speed Simulator
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    Bantuan &amp; FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: KONTAK OPERASIONAL */}
            <div className="space-y-3">
              <h4 className="text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider text-xs">
                KONTAK OPERASIONAL
              </h4>
              <div className="space-y-2.5 font-mono text-[11px] text-slate-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Jakarta &amp; Bekasi, Indonesia</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>
                    Hotline WA:{' '}
                    <a
                      href="https://wa.me/6282112001600"
                      target="_blank"
                      rel="noopener noreferrer"
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
                <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Network Status: All POP Online</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Compliance Bar */}
          <div className="mt-12 pt-8 border-t border-slate-300 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-slate-600 dark:text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} AUDIRA. All rights reserved. Proprietary Commercial Software.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                Syarat &amp; Ketentuan
              </Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                Kebijakan Privasi
              </Link>
              <span>|</span>
              <span>Designed with Precision Engineering Standards</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── 11. Modal Dialog: Login & Register ─────────────────────────── */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl max-w-lg w-full shadow-xl overflow-hidden animate-fade-in-smooth">
            
            {/* Modal Header Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-card-subtle)] p-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('LOGIN')
                    setLoginError('')
                    setRegError('')
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    authModalTab === 'LOGIN'
                      ? 'bg-[var(--app-card)] text-blue-600 dark:text-blue-400 shadow-xs border border-[var(--app-border)]'
                      : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  <UserCheck size={14} />
                  <span>Masuk ke Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('REGISTER')
                    setLoginError('')
                    setRegError('')
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    authModalTab === 'REGISTER'
                      ? 'bg-[var(--app-card)] text-blue-600 dark:text-blue-400 shadow-xs border border-[var(--app-border)]'
                      : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  <Cpu size={14} className="text-emerald-600" />
                  <span>Daftar Baru (14 Hari)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card)] transition cursor-pointer"
                title="Tutup (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* ─── TAB LOGIN ─── */}
              {authModalTab === 'LOGIN' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)]">
                      Masuk ke Cockpit AUDIRA-NET
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                      Gunakan kredensial terdaftar untuk mengelola router dan pelanggan.
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 text-xs">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleModalLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-2.5 text-[var(--app-text-muted)]" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={e => setLoginEmail(e.target.value)}
                          placeholder="admin@ispanda.id"
                          className="w-full pl-8 pr-3 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                        Kata Sandi
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-2.5 text-[var(--app-text-muted)]" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          placeholder="Masukkan kata sandi"
                          className="w-full pl-8 pr-8 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-2.5 top-2.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--app-text-muted)] pt-0.5">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-[var(--app-border)] text-blue-600" />
                        <span>Ingat sesi di perangkat ini</span>
                      </label>
                      <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Lupa kata sandi?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loginLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Memverifikasi Akun...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk Cockpit</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* 1-Tap Demo Access */}
                  <div className="pt-3 border-t border-[var(--app-border)]">
                    <p className="text-[10px] font-mono font-bold text-[var(--app-text-muted)] mb-2 uppercase">
                      Akses Cepat Demo Pengujian (1-Tap):
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('admin@audira.net', 'admin123')}
                        disabled={loginLoading}
                        className="p-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded text-left transition cursor-pointer"
                      >
                        <p className="font-bold text-[11px] text-[var(--app-text)] flex items-center gap-1">
                          <ShieldCheck size={12} className="text-blue-600" />
                          <span>Admin ISP</span>
                        </p>
                        <p className="text-[9px] text-[var(--app-text-muted)]">admin@audira.net</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('technician@audira.net', 'technician123')}
                        disabled={loginLoading}
                        className="p-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded text-left transition cursor-pointer"
                      >
                        <p className="font-bold text-[11px] text-[var(--app-text)] flex items-center gap-1">
                          <Compass size={12} className="text-amber-600" />
                          <span>Teknisi SPK</span>
                        </p>
                        <p className="text-[9px] text-[var(--app-text-muted)]">technician@audira.net</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB REGISTER ─── */}
              {authModalTab === 'REGISTER' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)]">
                      Registrasi Akun Baru (14 Hari Gratis)
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                      Uji coba mandiri tanpa komitmen dan tanpa kartu kredit.
                    </p>
                  </div>

                  {regError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 text-xs">
                      {regError}
                    </div>
                  )}

                  {regSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 text-xs flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{regSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleModalRegister} className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">
                          Nama Lengkap PIC
                        </label>
                        <div className="relative">
                          <User size={13} className="absolute left-2.5 top-2.5 text-[var(--app-text-muted)]" />
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={e => setRegName(e.target.value)}
                            placeholder="Agus Dwi"
                            className="w-full pl-7 pr-2.5 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">
                          Email Aktif
                        </label>
                        <div className="relative">
                          <Mail size={13} className="absolute left-2.5 top-2.5 text-[var(--app-text-muted)]" />
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={e => setRegEmail(e.target.value)}
                            placeholder="pic@ispanda.id"
                            className="w-full pl-7 pr-2.5 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">
                          Nomor WhatsApp
                        </label>
                        <div className="relative">
                          <Phone size={13} className="absolute left-2.5 top-2.5 text-[var(--app-text-muted)]" />
                          <input
                            type="tel"
                            required
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value)}
                            placeholder="081234567890"
                            className="w-full pl-7 pr-2.5 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">
                          Nama Perusahaan / Brand ISP
                        </label>
                        <input
                          type="text"
                          required
                          value={regCompany}
                          onChange={e => setRegCompany(e.target.value)}
                          placeholder="PT Sinergi Net"
                          className="w-full px-2.5 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">
                          Kata Sandi
                        </label>
                        <div className="relative">
                          <Lock size={13} className="absolute left-2.5 top-2.5 text-[var(--app-text-muted)]" />
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={e => setRegPassword(e.target.value)}
                            placeholder="Min. 8 karakter"
                            className="w-full pl-7 pr-7 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-2 top-2 text-[var(--app-text-muted)] hover:text-[var(--app-text)] cursor-pointer"
                          >
                            {showRegPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">
                          Ulangi Sandi
                        </label>
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={e => setRegConfirmPassword(e.target.value)}
                          placeholder="Ulangi sandi"
                          className="w-full px-2.5 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">
                        Pilihan Paket Uji Coba
                      </label>
                      <select
                        value={regPlan}
                        onChange={e => setRegPlan(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded text-xs font-semibold text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                      >
                        <option value="starter">Paket Starter (Maksimal 100 Pelanggan)</option>
                        <option value="pro">Paket Pro (Maksimal 500 Pelanggan + ODP GIS)</option>
                        <option value="enterprise">Paket Enterprise (Unlimited Pelanggan)</option>
                      </select>
                    </div>

                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        required
                        className="w-3.5 h-3.5 mt-0.5 text-blue-600 rounded border-[var(--app-border)]"
                      />
                      <label className="ml-2 text-[10px] text-[var(--app-text-muted)]">
                        Saya menyetujui Ketentuan Lisensi AUDIRA-NET.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {regLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Mendaftarkan Akun...</span>
                        </>
                      ) : (
                        <>
                          <span>Mulai Uji Coba 14 Hari Sekarang</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
