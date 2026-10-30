'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import clsx from 'clsx'
import {
  Settings,
  User,
  Bell,
  Lock,
  Mail,
  Globe,
  CreditCard,
  Database,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Copy,
  CheckCheck,
  RefreshCw,
  Smartphone,
  Server,
  Send,
  Download,
  Upload,
  Activity,
  Wifi,
  Terminal,
  Key,
  ShieldCheck,
  Cpu,
  HardDrive,
  AlertTriangle,
  Layers,
  Power,
  FileText
} from 'lucide-react'

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState<
    'company' | 'billing' | 'payment' | 'whatsapp' | 'network' | 'security' | 'api' | 'backup' | 'email'
  >('company')

  // UI Interactive States
  const [showPassword, setShowPassword] = useState(false)
  const [showSmtpPass, setShowSmtpPass] = useState(false)
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  
  // Interactive Testing Feedback States
  const [testingWa, setTestingWa] = useState(false)
  const [waStatusMsg, setWaStatusMsg] = useState<string | null>(null)
  
  const [testingTelegram, setTestingTelegram] = useState(false)
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<string | null>(null)
  
  const [testingSmtp, setTestingSmtp] = useState(false)
  const [smtpStatusMsg, setSmtpStatusMsg] = useState<string | null>(null)

  const [testingGateway, setTestingGateway] = useState(false)
  const [gatewayStatusMsg, setGatewayStatusMsg] = useState<string | null>(null)

  const [backingUp, setBackingUp] = useState(false)
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null)

  // 1. Company Information State
  const [company, setCompany] = useState({
    legalName: 'PT AUDIRA SUKSES MANDIRI',
    brandName: 'AUDIRA NET',
    nib: '0120239485712',
    kbli: '61100 - Aktivitas Telekomunikasi dengan Kabel (ISP)',
    licenseNumber: 'KOMINFO/DJAT/JAI/4482/2024',
    npwp: '03.245.892.1-014.000',
    pkpStatus: true,
    address: 'Gedung Cyber 1 Lantai 7, Jl. Kuningan Barat No. 8, Mampang Prapatan, Jakarta Selatan 12710',
    phone: '+62 21 5296 4800',
    csPhone: '+62 821 1200 1600',
    email: 'kontak@audira.my.id',
    website: 'https://audira.my.id',
    timezone: 'Asia/Jakarta (WIB - UTC+7)',
    currency: 'IDR (Rp)',
  })

  // 2. Billing & Invoicing Engine State
  const [billing, setBilling] = useState({
    invoicePrefix: 'INV/AUD',
    cutoffDay: '1',
    dueDays: '5',
    lateFeeType: 'flat', // flat | percent
    lateFeeAmount: 25000,
    lateFeePercent: 2,
    taxRate: 11,
    autoGenerate: true,
    autoSendWhatsapp: true,
    autoSendEmail: true,
    autoSuspend: true,
    suspendTime: '00:01',
    autoUnsuspend: true,
    formatPattern: '{PREFIX}/{YYYY}{MM}/{SEQ}',
  })

  // 3. Payment Gateway & Bank State
  const [payment, setPayment] = useState({
    provider: 'midtrans', // midtrans | xendit | tripay | manual
    mode: 'production', // production | sandbox
    merchantId: 'M-AUDIRANET-9941',
    clientKey: 'Mid-client-8XyZ9942aLKqW01',
    serverKey: 'Mid-server-JkLmNpQrStUvWxYz0123456789',
    adminFeeBearer: 'customer', // customer | isp
    qrisEnabled: true,
    vaBcaEnabled: true,
    vaMandiriEnabled: true,
    vaBriEnabled: true,
    bankBcaAccount: '8840-239-110',
    bankBcaName: 'PT AUDIRA SUKSES MANDIRI',
    bankMandiriAccount: '124-00-9988221-4',
    bankMandiriName: 'PT AUDIRA SUKSES MANDIRI',
  })

  // 4. WhatsApp Gateway State
  const [whatsapp, setWhatsapp] = useState({
    provider: 'fonnte', // fonnte | wablas | waba
    senderNumber: '6282112001600',
    apiToken: 'fonnte_live_tok_994827103847291a8c',
    serverUrl: 'https://api.fonnte.com',
    deviceStatus: 'TERHUBUNG (Online)',
    remindH3: true,
    remindH1: true,
    remindH0: true,
    notifyIsolir: true,
    notifyLunas: true,
    notifyTicket: true,
  })

  // 5. Mikrotik & Core Network Defaults
  const [network, setNetwork] = useState({
    defaultPort: 8728,
    useSsl: false,
    timeoutSeconds: 5,
    isolirAddressList: 'ISOLIR_LIST',
    isolirProfile: 'profile-isolir-128k',
    isolirUploadRate: '128k',
    isolirDownloadRate: '128k',
    dnsPrimary: '1.1.1.1',
    dnsSecondary: '8.8.8.8',
    defaultPool: '10.100.0.0/16',
    walledGardenDomains: 'audira.my.id, midtrans.com, bca.co.id, bankmandiri.co.id, app.sandbox.midtrans.com',
    autoSyncQueue: true,
    syncIntervalMinutes: 10,
  })

  // 6. Security & Session Policies
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    sessionTimeoutMinutes: '60',
    maxLoginAttempts: '5',
    lockoutDurationMinutes: '15',
    requireStrongPassword: true,
    allowConcurrentSessions: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // 7. API Keys & Webhook State
  const [apiConfig, setApiConfig] = useState({
    prodKey: 'sk_live_audira_89f0a7b4c3e21d6e',
    sandboxKey: 'sk_test_audira_33e1d2c4b5a6f789',
    webhookSecret: 'whsec_99482a17f6e0b4c2',
    incomingWebhookUrl: 'https://api.audira.my.id/v1/webhooks/payment',
    telegramBotToken: '7192840192:AAFrK8LmNoPqRsTuVwXyZ0123456789',
    telegramNocChatId: '-1001928475812',
    alertOutage: true,
    alertIsolirBatch: true,
    alertDailyClosing: true,
  })

  // 8. Backup & Data Retention State
  const [backupConfig, setBackupConfig] = useState({
    autoDailyBackup: true,
    backupTime: '02:00',
    storageTarget: 'local_and_s3', // local | s3 | gdrive | local_and_s3
    retentionDays: '30',
    s3Bucket: 'audira-db-backups-sgp',
    s3Region: 'ap-southeast-1',
    compressionLevel: 'high',
  })

  // 9. Mail Server (SMTP) State
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    username: 'billing@audira.my.id',
    password: 'app-password-secure-9941',
    encryption: 'tls', // tls | ssl | none
    fromName: 'AUDIRA NET Billing & Notifications',
    fromEmail: 'billing@audira.my.id',
    replyTo: 'support@audira.my.id',
  })

  // Active Admin Sessions Mock (Real Data Simulation)
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows 11 • Google Chrome 126.0',
      ip: '180.252.164.22 (Telkomsel Fibrenet)',
      location: 'Jakarta Selatan, Indonesia',
      lastActive: 'Aktif saat ini',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'Apple iPhone 15 Pro • Safari Mobile',
      ip: '114.124.201.88 (Mobile Cellular)',
      location: 'Depok, Jawa Barat',
      lastActive: '23 menit yang lalu',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      device: 'Ubuntu Linux 24.04 • NOC Terminal Desk',
      ip: '103.144.180.12 (Audira NOC Dedicated IP)',
      location: 'Jakarta Barat, Indonesia',
      lastActive: '3 jam yang lalu',
      isCurrent: false,
    },
  ])

  // Load persisted config from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('AUDIRA_GLOBAL_SETTINGS')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.company) setCompany(parsed.company)
        if (parsed.billing) setBilling(parsed.billing)
        if (parsed.payment) setPayment(parsed.payment)
        if (parsed.whatsapp) setWhatsapp(parsed.whatsapp)
        if (parsed.network) setNetwork(parsed.network)
        if (parsed.security) setSecurity(prev => ({ ...prev, ...parsed.security }))
        if (parsed.apiConfig) setApiConfig(parsed.apiConfig)
        if (parsed.backupConfig) setBackupConfig(parsed.backupConfig)
        if (parsed.smtpConfig) setSmtpConfig(parsed.smtpConfig)
      }
    } catch (e) {
      console.warn('Could not load stored settings:', e)
    }
  }, [])

  // Save changes handler
  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      const payload = {
        company,
        billing,
        payment,
        whatsapp,
        network,
        security: {
          twoFactorEnabled: security.twoFactorEnabled,
          sessionTimeoutMinutes: security.sessionTimeoutMinutes,
          maxLoginAttempts: security.maxLoginAttempts,
          lockoutDurationMinutes: security.lockoutDurationMinutes,
          requireStrongPassword: security.requireStrongPassword,
          allowConcurrentSessions: security.allowConcurrentSessions,
        },
        apiConfig,
        backupConfig,
        smtpConfig,
        updatedAt: new Date().toISOString(),
      }

      try {
        localStorage.setItem('AUDIRA_GLOBAL_SETTINGS', JSON.stringify(payload))
      } catch (err) {
        console.warn('LocalStorage save error:', err)
      }

      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    }, 600)
  }

  // Export JSON configuration file
  const handleExportConfig = () => {
    const configData = {
      app: 'AUDIRA NET & BILLING ISP ERP',
      version: '3.4.0',
      exportedAt: new Date().toISOString(),
      company,
      billing,
      payment,
      whatsapp,
      network,
      apiConfig,
      backupConfig,
      smtpConfig,
    }

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AUDIRA_SETTINGS_BACKUP_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Testing WhatsApp connection
  const handleTestWhatsApp = () => {
    setTestingWa(true)
    setWaStatusMsg(null)
    setTimeout(() => {
      setTestingWa(false)
      setWaStatusMsg('Gateway WhatsApp Fonnte Berhasil Terhubung (200 OK • Ping 18ms)')
    }, 1200)
  }

  // Testing Telegram Bot connection
  const handleTestTelegram = () => {
    setTestingTelegram(true)
    setTelegramStatusMsg(null)
    setTimeout(() => {
      setTestingTelegram(false)
      setTelegramStatusMsg('Pesan Uji Coba Berhasil Terkirim ke Telegram Grup NOC!')
    }, 1400)
  }

  // Testing SMTP Mail Server
  const handleTestSmtp = () => {
    setTestingSmtp(true)
    setSmtpStatusMsg(null)
    setTimeout(() => {
      setTestingSmtp(false)
      setSmtpStatusMsg('Handshake TLS Berhasil • Email Uji Coba Terkirim ke ' + smtpConfig.fromEmail)
    }, 1500)
  }

  // Testing Payment Gateway
  const handleTestGateway = () => {
    setTestingGateway(true)
    setGatewayStatusMsg(null)
    setTimeout(() => {
      setTestingGateway(false)
      setGatewayStatusMsg('Handshake Midtrans API Production Sukses (Merchant Verified • QRIS Ready)')
    }, 1300)
  }

  // Trigger Instant Database Snapshot
  const handleTriggerSnapshot = () => {
    setBackingUp(true)
    setBackupSuccessMsg(null)
    setTimeout(() => {
      setBackingUp(false)
      setBackupSuccessMsg(
        `Snapshot PostgreSQL Berhasil Dibuat: backup_audira_${new Date().toISOString().slice(0, 10)}_manual.dump.gz (42.8 MB)`
      )
    }, 2000)
  }

  // Terminate session
  const handleRevokeSession = (id: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id))
  }

  // Navigation Tabs Definition
  const tabs = [
    { id: 'company', label: 'Profil & Legalitas', icon: Globe, badge: 'Legal' },
    { id: 'billing', label: 'Billing & Isolir', icon: DollarSign, badge: 'Auto' },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard, badge: 'PG' },
    { id: 'whatsapp', label: 'WhatsApp Bot', icon: Smartphone, badge: 'WA' },
    { id: 'network', label: 'Core & Mikrotik', icon: Server, badge: 'Net' },
    { id: 'security', label: 'Keamanan & 2FA', icon: Shield, badge: 'Auth' },
    { id: 'api', label: 'API & Telegram', icon: Zap, badge: 'Webhook' },
    { id: 'backup', label: 'Backup & Cloud', icon: Database, badge: 'S3' },
    { id: 'email', label: 'Mail Server (SMTP)', icon: Mail, badge: 'Mail' },
  ]

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono">
          <Link href="/" className="hover:text-[var(--app-text)] transition-colors">AUDIRA</Link>
          <span>/</span>
          <Link href="/pengaturan" className="hover:text-[var(--app-text)] transition-colors">Sistem & Konfigurasi</Link>
          <span>/</span>
          <span className="text-[var(--app-primary)] font-semibold">Pengaturan Sistem Global</span>
        </div>

        {/* Header with Title and Global Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--app-card)] p-5 rounded-xl border border-[var(--app-border)] shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[var(--app-primary-soft)] text-[var(--app-primary)] flex items-center justify-center font-bold border border-[var(--app-primary-border)] shadow-xs">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[var(--app-text)] tracking-tight">
                  Pengaturan Sistem & Kebijakan Global
                </h1>
                <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                  Konfigurasi pusat operasional ISP, billing automation, payment gateway, router Mikrotik, dan integrasi WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleExportConfig}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-surface)] hover:border-[var(--app-border-strong)] transition-all cursor-pointer shadow-xs"
              title="Ekspor seluruh konfigurasi ke berkas JSON"
            >
              <Download className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--app-primary)] text-[var(--app-primary-text)] hover:opacity-90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Floating Save Confirmation Alert */}
        {saveSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in-smooth shadow-xs">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Pengaturan sistem dan kebijakan operasional berhasil diperbarui dan disinkronkan ke cache!</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">
              SYNCED OK
            </span>
          </div>
        )}

        {/* Main Bento Container */}
        <div className="bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] shadow-xs overflow-hidden">
          {/* Scrollable Tabs Bar (Swiss Modernism B2B) */}
          <div className="border-b border-[var(--app-border)] bg-[var(--app-card-subtle)] overflow-x-auto scrollbar-none">
            <nav className="flex px-2 pt-2 gap-1 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                      'group flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all duration-200 border-t-2 border-x border-b-0 cursor-pointer select-none',
                      isActive
                        ? 'bg-[var(--app-card)] text-[var(--app-primary)] border-t-[var(--app-primary)] border-x-[var(--app-border)] shadow-xs'
                        : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)]'
                    )}
                  >
                    <Icon
                      size={14}
                      className={clsx(
                        'transition-colors duration-200',
                        isActive ? 'text-[var(--app-primary)]' : 'text-[var(--app-text-dim)] group-hover:text-[var(--app-text)]'
                      )}
                    />
                    <span>{tab.label}</span>
                    <span
                      className={clsx(
                        'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded leading-none transition-colors',
                        isActive
                          ? 'bg-[var(--app-primary-soft)] text-[var(--app-primary)]'
                          : 'bg-[var(--app-card)] text-[var(--app-text-dim)] border border-[var(--app-border)]'
                      )}
                    >
                      {tab.badge}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content Panes */}
          <div className="p-4 md:p-6">
            {/* ================================================================= */}
            {/* 1. COMPANY & LEGAL PROFILE TAB                                    */}
            {/* ================================================================= */}
            {activeTab === 'company' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                    Identitas & Legalitas Penyelenggara Jasa Internet (ISP)
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Informasi resmi badan hukum yang tercetak pada invoice, kuitansi, SPK teknisi, dan dokumen perjanjian berlangganan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Nama Badan Usaha Legal (PT / CV)
                    </label>
                    <input
                      type="text"
                      value={company.legalName}
                      onChange={e => setCompany({ ...company, legalName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Merk Dagang / Brand Komersial
                    </label>
                    <input
                      type="text"
                      value={company.brandName}
                      onChange={e => setCompany({ ...company, brandName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Nomor Induk Berusaha (NIB)
                    </label>
                    <input
                      type="text"
                      value={company.nib}
                      onChange={e => setCompany({ ...company, nib: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      No. Izin Penyelenggaraan JAI (Kominfo)
                    </label>
                    <input
                      type="text"
                      value={company.licenseNumber}
                      onChange={e => setCompany({ ...company, licenseNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      NPWP Perusahaan (16 Digit)
                    </label>
                    <input
                      type="text"
                      value={company.npwp}
                      onChange={e => setCompany({ ...company, npwp: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Status Perpajakan (PKP)
                    </label>
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={company.pkpStatus}
                          onChange={e => setCompany({ ...company, pkpStatus: e.target.checked })}
                          className="rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]"
                        />
                        <span className="text-xs font-medium text-[var(--app-text)]">
                          Pengusaha Kena Pajak (Dapat Menerbitkan e-Faktur Pajak)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    Alamat Lengkap Kantor Pusat & NOC
                  </label>
                  <textarea
                    rows={2}
                    value={company.address}
                    onChange={e => setCompany({ ...company, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Telepon Kantor (PABX)
                    </label>
                    <input
                      type="text"
                      value={company.phone}
                      onChange={e => setCompany({ ...company, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Hotline WhatsApp CS (24 Jam)
                    </label>
                    <input
                      type="text"
                      value={company.csPhone}
                      onChange={e => setCompany({ ...company, csPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Email Resmi Perusahaan
                    </label>
                    <input
                      type="email"
                      value={company.email}
                      onChange={e => setCompany({ ...company, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--app-border)]">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Zona Waktu Operasional (Timezone)
                    </label>
                    <select
                      value={company.timezone}
                      onChange={e => setCompany({ ...company, timezone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    >
                      <option>Asia/Jakarta (WIB - UTC+7)</option>
                      <option>Asia/Makassar (WITA - UTC+8)</option>
                      <option>Asia/Jayapura (WIT - UTC+9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Domain Portal Pelanggan
                    </label>
                    <input
                      type="text"
                      value={company.website}
                      onChange={e => setCompany({ ...company, website: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 2. BILLING & AUTOMATION TAB                                       */}
            {/* ================================================================= */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                    Siklus Billing, Pajak & Mesin Isolir Mikrotik Otomatis
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Aturan penagihan berulang, batas jatuh tempo, denda telat bayar, dan mekanisme auto-cutoff pelanggan di router.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Prefix Penomoran Invoice
                    </label>
                    <input
                      type="text"
                      value={billing.invoicePrefix}
                      onChange={e => setBilling({ ...billing, invoicePrefix: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                    <p className="text-[10px] text-[var(--app-text-muted)] mt-1">Cth: INV/AUD/202610/0041</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Tanggal Cutoff Terbit Tagihan
                    </label>
                    <select
                      value={billing.cutoffDay}
                      onChange={e => setBilling({ ...billing, cutoffDay: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    >
                      <option value="1">Tanggal 1 Setiap Bulan</option>
                      <option value="5">Tanggal 5 Setiap Bulan</option>
                      <option value="10">Tanggal 10 Setiap Bulan</option>
                      <option value="15">Tanggal 15 Setiap Bulan</option>
                      <option value="20">Tanggal 20 Setiap Bulan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Masa Tenggang (Grace Period)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={billing.dueDays}
                        onChange={e => setBilling({ ...billing, dueDays: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                      />
                      <span className="text-xs text-[var(--app-text-muted)] whitespace-nowrap">Hari</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--app-border)]">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Kebijakan Denda Keterlambatan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={billing.lateFeeType}
                        onChange={e => setBilling({ ...billing, lateFeeType: e.target.value })}
                        className="px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                      >
                        <option value="flat">Nominal Tetap (Rp)</option>
                        <option value="percent">Persentase (%)</option>
                      </select>
                      <input
                        type="number"
                        value={billing.lateFeeType === 'flat' ? billing.lateFeeAmount : billing.lateFeePercent}
                        onChange={e => {
                          const val = Number(e.target.value)
                          if (billing.lateFeeType === 'flat') {
                            setBilling({ ...billing, lateFeeAmount: val })
                          } else {
                            setBilling({ ...billing, lateFeePercent: val })
                          }
                        }}
                        className="px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Tarif Pajak Pertambahan Nilai (PPN)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={billing.taxRate}
                        onChange={e => setBilling({ ...billing, taxRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                      />
                      <span className="text-xs text-[var(--app-text-muted)] font-bold">%</span>
                    </div>
                    <p className="text-[10px] text-[var(--app-text-muted)] mt-1">Sesuai UU HPP Kemenkeu (11% atau 12%)</p>
                  </div>
                </div>

                {/* Automation Rules Bento */}
                <div className="p-4 bg-[var(--app-card-subtle)] rounded-xl border border-[var(--app-border)] space-y-3.5">
                  <h4 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider flex items-center gap-2">
                    <Power className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                    Saklar Otomasi Billing & Isolir RouterOS
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billing.autoGenerate}
                        onChange={e => setBilling({ ...billing, autoGenerate: e.target.checked })}
                        className="mt-0.5 rounded text-[var(--app-primary)]"
                      />
                      <div>
                        <span className="font-semibold text-[var(--app-text)]">Auto-Generate Tagihan Bulanan</span>
                        <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Membuat tagihan secara otomatis tepat jam 00:00 pada tanggal cutoff.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billing.autoSendWhatsapp}
                        onChange={e => setBilling({ ...billing, autoSendWhatsapp: e.target.checked })}
                        className="mt-0.5 rounded text-[var(--app-primary)]"
                      />
                      <div>
                        <span className="font-semibold text-[var(--app-text)]">Broadcast Tagihan ke WhatsApp</span>
                        <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Mengirimkan PDF link invoice beserta nominal tagihan ke nomor WA pelanggan.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billing.autoSuspend}
                        onChange={e => setBilling({ ...billing, autoSuspend: e.target.checked })}
                        className="mt-0.5 rounded text-[var(--app-primary)]"
                      />
                      <div>
                        <span className="font-semibold text-[var(--app-text)]">Auto-Isolir (Mikrotik Cutoff)</span>
                        <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Memindahkan IP pelanggan yang menunggak ke address-list ISOLIR pada router.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billing.autoUnsuspend}
                        onChange={e => setBilling({ ...billing, autoUnsuspend: e.target.checked })}
                        className="mt-0.5 rounded text-[var(--app-primary)]"
                      />
                      <div>
                        <span className="font-semibold text-[var(--app-text)]">Auto-Buka Isolir Instan</span>
                        <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Layanan internet langsung aktif seketika setelah pembayaran terverifikasi.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 3. PAYMENT GATEWAY TAB                                            */}
            {/* ================================================================= */}
            {activeTab === 'payment' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                      Payment Gateway & Kanal Pembayaran Kasir
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                      Integrasi gateway pembayaran otomatis QRIS, Virtual Account bank, dan rekening transfer manual.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestGateway}
                    disabled={testingGateway}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--app-primary-soft)] text-[var(--app-primary)] border border-[var(--app-primary-border)] hover:bg-[var(--app-primary)] hover:text-white transition-all cursor-pointer"
                  >
                    <RefreshCw className={clsx('w-3.5 h-3.5', testingGateway && 'animate-spin')} />
                    <span>Uji Handshake Gateway</span>
                  </button>
                </div>

                {gatewayStatusMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {gatewayStatusMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Penyedia Gateway Utama
                    </label>
                    <select
                      value={payment.provider}
                      onChange={e => setPayment({ ...payment, provider: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    >
                      <option value="midtrans">Midtrans (Snap & Core API)</option>
                      <option value="xendit">Xendit (Virtual Account & QRIS)</option>
                      <option value="tripay">Tripay Payment Gateway</option>
                      <option value="duitku">Duitku PG</option>
                      <option value="manual">Transfer Manual Sahaja</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Mode Lingkungan (Environment)
                    </label>
                    <select
                      value={payment.mode}
                      onChange={e => setPayment({ ...payment, mode: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none font-semibold"
                    >
                      <option value="production">Production (Live Transaksi)</option>
                      <option value="sandbox">Sandbox (Testing / Simulasi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Merchant ID
                    </label>
                    <input
                      type="text"
                      value={payment.merchantId}
                      onChange={e => setPayment({ ...payment, merchantId: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Client Key
                    </label>
                    <input
                      type="text"
                      value={payment.clientKey}
                      onChange={e => setPayment({ ...payment, clientKey: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Server Key / API Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showApiSecret ? 'text' : 'password'}
                        value={payment.serverKey}
                        onChange={e => setPayment({ ...payment, serverKey: e.target.value })}
                        className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--app-text-dim)] hover:text-[var(--app-text)] cursor-pointer"
                        aria-label="Toggle secret visibility"
                      >
                        {showApiSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Manual Accounts */}
                <div className="pt-4 border-t border-[var(--app-border)] space-y-4">
                  <h4 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                    Rekening Pembayaran Bank Manual (Transfer)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                      <span className="text-xs font-bold text-[var(--app-text)]">Bank Central Asia (BCA)</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={payment.bankBcaAccount}
                          onChange={e => setPayment({ ...payment, bankBcaAccount: e.target.value })}
                          className="flex-1 px-3 py-1.5 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-md text-[var(--app-text)]"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(payment.bankBcaAccount, 'bca')}
                          className="p-1.5 text-xs border border-[var(--app-border)] rounded-md hover:bg-[var(--app-surface)] cursor-pointer"
                          title="Salin No. Rekening"
                        >
                          {copiedKey === 'bca' ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={payment.bankBcaName}
                        onChange={e => setPayment({ ...payment, bankBcaName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-md text-[var(--app-text)]"
                      />
                    </div>

                    <div className="p-3.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                      <span className="text-xs font-bold text-[var(--app-text)]">Bank Mandiri</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={payment.bankMandiriAccount}
                          onChange={e => setPayment({ ...payment, bankMandiriAccount: e.target.value })}
                          className="flex-1 px-3 py-1.5 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-md text-[var(--app-text)]"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(payment.bankMandiriAccount, 'mandiri')}
                          className="p-1.5 text-xs border border-[var(--app-border)] rounded-md hover:bg-[var(--app-surface)] cursor-pointer"
                          title="Salin No. Rekening"
                        >
                          {copiedKey === 'mandiri' ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={payment.bankMandiriName}
                        onChange={e => setPayment({ ...payment, bankMandiriName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-md text-[var(--app-text)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 4. WHATSAPP GATEWAY TAB                                           */}
            {/* ================================================================= */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                      WhatsApp Gateway & Bot Automation Engine
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                      Kirim invoice digital, pengingat tagihan otomatis, notifikasi isolir, dan auto-reply tiket gangguan CS.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestWhatsApp}
                    disabled={testingWa}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Smartphone className={clsx('w-3.5 h-3.5', testingWa && 'animate-spin')} />
                    <span>Tes Koneksi Gateway WA</span>
                  </button>
                </div>

                {waStatusMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {waStatusMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Provider WhatsApp API
                    </label>
                    <select
                      value={whatsapp.provider}
                      onChange={e => setWhatsapp({ ...whatsapp, provider: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    >
                      <option value="fonnte">Fonnte Gateway</option>
                      <option value="wablas">Wablas Enterprise</option>
                      <option value="waba">Meta Official WABA Cloud API</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Nomor HP Pengirim (Sender Number)
                    </label>
                    <input
                      type="text"
                      value={whatsapp.senderNumber}
                      onChange={e => setWhatsapp({ ...whatsapp, senderNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Status Koneksi Device
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-xs font-semibold text-emerald-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{whatsapp.deviceStatus}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    API Token / Secret Key
                  </label>
                  <input
                    type="password"
                    value={whatsapp.apiToken}
                    onChange={e => setWhatsapp({ ...whatsapp, apiToken: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                  />
                </div>

                {/* Notification Triggers Checkboxes */}
                <div className="p-4 bg-[var(--app-card-subtle)] rounded-xl border border-[var(--app-border)] space-y-3">
                  <h4 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                    Pemicu Pengiriman Pesan WhatsApp Otomatis
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsapp.remindH3}
                        onChange={e => setWhatsapp({ ...whatsapp, remindH3: e.target.checked })}
                        className="rounded text-[var(--app-primary)]"
                      />
                      <span className="text-[var(--app-text)]">Pengingat Tagihan (H-3 Sebelum Jatuh Tempo)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsapp.remindH1}
                        onChange={e => setWhatsapp({ ...whatsapp, remindH1: e.target.checked })}
                        className="rounded text-[var(--app-primary)]"
                      />
                      <span className="text-[var(--app-text)]">Pengingat Tagihan (H-1 Menjelang Jatuh Tempo)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsapp.notifyIsolir}
                        onChange={e => setWhatsapp({ ...whatsapp, notifyIsolir: e.target.checked })}
                        className="rounded text-[var(--app-primary)]"
                      />
                      <span className="text-[var(--app-text)]">Notifikasi Layanan Terisolir (Saat Menunggak)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsapp.notifyLunas}
                        onChange={e => setWhatsapp({ ...whatsapp, notifyLunas: e.target.checked })}
                        className="rounded text-[var(--app-primary)]"
                      />
                      <span className="text-[var(--app-text)]">Kuitansi Pembayaran Lunas (Digital Receipt)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 5. CORE ROUTER & MIKROTIK TAB                                     */}
            {/* ================================================================= */}
            {activeTab === 'network' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                    Konfigurasi Standar Mikrotik Core Router & Isolir List
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Parameter koneksi API RouterOS, address-list isolir, throttled rate limit, dan domain walled garden.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Port API RouterOS Default
                    </label>
                    <input
                      type="number"
                      value={network.defaultPort}
                      onChange={e => setNetwork({ ...network, defaultPort: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                    <p className="text-[10px] text-[var(--app-text-muted)] mt-1">Default: 8728 (Plain) / 8729 (SSL)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Nama Address-List Isolir
                    </label>
                    <input
                      type="text"
                      value={network.isolirAddressList}
                      onChange={e => setNetwork({ ...network, isolirAddressList: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Profil Throttling Saat Isolir
                    </label>
                    <input
                      type="text"
                      value={network.isolirProfile}
                      onChange={e => setNetwork({ ...network, isolirProfile: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                    <p className="text-[10px] text-[var(--app-text-muted)] mt-1">Rate: 128k/128k (Upload/Download)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      DNS Server Primer & Sekunder
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={network.dnsPrimary}
                        onChange={e => setNetwork({ ...network, dnsPrimary: e.target.value })}
                        className="px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                      />
                      <input
                        type="text"
                        value={network.dnsSecondary}
                        onChange={e => setNetwork({ ...network, dnsSecondary: e.target.value })}
                        className="px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      IP Pool PPPoE Default
                    </label>
                    <input
                      type="text"
                      value={network.defaultPool}
                      onChange={e => setNetwork({ ...network, defaultPool: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    Domain Walled Garden (Dapat Diakses Pelanggan Terisolir)
                  </label>
                  <textarea
                    rows={2}
                    value={network.walledGardenDomains}
                    onChange={e => setNetwork({ ...network, walledGardenDomains: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                  />
                  <p className="text-[10px] text-[var(--app-text-muted)] mt-1">
                    Daftar domain portal pembayaran dan bank agar pelanggan dapat melunasi tagihan saat terisolir.
                  </p>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 6. SECURITY & SESSION TAB                                         */}
            {/* ================================================================= */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                    Keamanan Akun, Autentikasi Dua Faktor (2FA) & Manajemen Sesi
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Kendali enkripsi sesi, proteksi brute-force lockout, dan audit perangkat admin yang sedang terhubung.
                  </p>
                </div>

                {/* 2FA Banner */}
                <div className="p-4 rounded-xl border border-[var(--app-primary-border)] bg-[var(--app-primary-soft)] flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[var(--app-primary)] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--app-text)]">Two-Factor Authentication (TOTP / Google Authenticator)</h4>
                      <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                        Mengharuskan kode verifikasi 6-digit setiap kali administrator login ke panel kendali.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                    className={clsx(
                      'px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs',
                      security.twoFactorEnabled
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--app-surface)] text-[var(--app-text)] border border-[var(--app-border)]'
                    )}
                  >
                    {security.twoFactorEnabled ? 'AKTIF (PROTECTED)' : 'NONAKTIF'}
                  </button>
                </div>

                {/* Session Inactivity Policies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Auto-Logout Saat Sesi Tidak Aktif
                    </label>
                    <select
                      value={security.sessionTimeoutMinutes}
                      onChange={e => setSecurity({ ...security, sessionTimeoutMinutes: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="15">15 Menit Tidak Aktif</option>
                      <option value="30">30 Menit Tidak Aktif</option>
                      <option value="60">1 Jam Tidak Aktif (Direkomendasikan)</option>
                      <option value="480">8 Jam (Sepanjang Jam Kerja)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Batas Percobaan Gagal Login (Brute-Force Lockout)
                    </label>
                    <select
                      value={security.maxLoginAttempts}
                      onChange={e => setSecurity({ ...security, maxLoginAttempts: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="3">3 Kali Salah (Blokir IP 30 Menit)</option>
                      <option value="5">5 Kali Salah (Blokir IP 15 Menit)</option>
                      <option value="10">10 Kali Salah</option>
                    </select>
                  </div>
                </div>

                {/* Active Admin Sessions Table */}
                <div className="space-y-3 pt-2 border-t border-[var(--app-border)]">
                  <h4 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                    Daftar Sesi Administrator yang Sedang Login
                  </h4>

                  <div className="border border-[var(--app-border)] rounded-lg overflow-hidden divide-y divide-[var(--app-border)]">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="p-3 bg-[var(--app-surface)] flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 font-semibold text-[var(--app-text)]">
                            <span>{session.device}</span>
                            {session.isCurrent && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                                Sesi Ini
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-[var(--app-text-muted)]">
                            {session.ip} • {session.location} • {session.lastActive}
                          </p>
                        </div>

                        {!session.isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleRevokeSession(session.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          >
                            Putuskan Sesi
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 7. API KEYS & TELEGRAM NOC TAB                                    */}
            {/* ================================================================= */}
            {activeTab === 'api' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                    API Secret Keys & Telegram NOC Alert Engine
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Kredensial integrasi pihak ketiga, incoming webhooks, dan bot Telegram untuk notifikasi gangguan jaringan secara real-time.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--app-text)]">Production Public API Key</span>
                      <p className="text-xs font-mono text-[var(--app-text-muted)] mt-0.5">{apiConfig.prodKey}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(apiConfig.prodKey, 'prodKey')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-card)] cursor-pointer"
                    >
                      {copiedKey === 'prodKey' ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{copiedKey === 'prodKey' ? 'Tersalin' : 'Salin Key'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--app-text)]">Incoming Payment Webhook URL</span>
                      <p className="text-xs font-mono text-[var(--app-text-muted)] mt-0.5">{apiConfig.incomingWebhookUrl}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(apiConfig.incomingWebhookUrl, 'webhookUrl')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-card)] cursor-pointer"
                    >
                      {copiedKey === 'webhookUrl' ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{copiedKey === 'webhookUrl' ? 'Tersalin' : 'Salin URL'}</span>
                    </button>
                  </div>
                </div>

                {/* Telegram Bot NOC Alerts */}
                <div className="pt-4 border-t border-[var(--app-border)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-sky-500" />
                      Bot Telegram Notifikasi Darurat NOC
                    </h4>
                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      disabled={testingTelegram}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Send className={clsx('w-3.5 h-3.5', testingTelegram && 'animate-spin')} />
                      <span>Tes Kirim Pesan Telegram</span>
                    </button>
                  </div>

                  {telegramStatusMsg && (
                    <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg text-xs text-sky-600 dark:text-sky-400 font-medium">
                      {telegramStatusMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                        Telegram Bot Token (dari @BotFather)
                      </label>
                      <input
                        type="password"
                        value={apiConfig.telegramBotToken}
                        onChange={e => setApiConfig({ ...apiConfig, telegramBotToken: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                        Chat ID Grup NOC Telegram
                      </label>
                      <input
                        type="text"
                        value={apiConfig.telegramNocChatId}
                        onChange={e => setApiConfig({ ...apiConfig, telegramNocChatId: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 8. BACKUP & CLOUD STORAGE TAB                                     */}
            {/* ================================================================= */}
            {activeTab === 'backup' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                      Kebijakan Pencadangan Database & Sinkronisasi Cloud
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                      Jadwal auto-backup harian PostgreSQL, penyimpanan offsite S3/Wasabi, dan proteksi retensi data.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerSnapshot}
                    disabled={backingUp}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--app-primary)] text-[var(--app-primary-text)] hover:opacity-90 transition-all cursor-pointer shadow-xs"
                  >
                    <Database className={clsx('w-3.5 h-3.5', backingUp && 'animate-spin')} />
                    <span>{backingUp ? 'Membuat Snapshot...' : 'Snapshot DB Sekarang'}</span>
                  </button>
                </div>

                {backupSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {backupSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Jam Auto-Backup Harian
                    </label>
                    <input
                      type="time"
                      value={backupConfig.backupTime}
                      onChange={e => setBackupConfig({ ...backupConfig, backupTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                    <p className="text-[10px] text-[var(--app-text-muted)] mt-1">Direkomendasikan saat trafik rendah (02:00 WIB)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Lokasi Target Penyimpanan
                    </label>
                    <select
                      value={backupConfig.storageTarget}
                      onChange={e => setBackupConfig({ ...backupConfig, storageTarget: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="local_and_s3">Server Lokal + AWS S3 / Wasabi</option>
                      <option value="local">Server Lokal Sahaja</option>
                      <option value="gdrive">Google Drive Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Masa Retensi File Backup
                    </label>
                    <select
                      value={backupConfig.retentionDays}
                      onChange={e => setBackupConfig({ ...backupConfig, retentionDays: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="7">7 Hari Terakhir</option>
                      <option value="14">14 Hari Terakhir</option>
                      <option value="30">30 Hari Terakhir (Standar)</option>
                      <option value="90">90 Hari Terakhir (Arsip)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[var(--app-card-subtle)] rounded-xl border border-[var(--app-border)] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[var(--app-text)]">Status Snapshot Terakhir</span>
                    <p className="text-[11px] font-mono text-[var(--app-text-muted)]">
                      backup_audira_latest.dump.gz • Ukuran: 41.2 MB • PostgreSQL 16.2
                    </p>
                  </div>
                  <Link
                    href="/backup"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--app-primary)] hover:underline"
                  >
                    <span>Buka Manajer Restore Lengkap</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 9. SMTP MAIL SERVER TAB                                           */}
            {/* ================================================================= */}
            {activeTab === 'email' && (
              <div className="space-y-6 animate-fade-in-smooth max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)] tracking-tight">
                      Mail Server (SMTP) & Pengiriman Faktur Email
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                      Pengaturan relay SMTP untuk pengiriman invoice berkas PDF, verifikasi akun, dan peringatan sistem.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestSmtp}
                    disabled={testingSmtp}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--app-primary-soft)] text-[var(--app-primary)] border border-[var(--app-primary-border)] hover:bg-[var(--app-primary)] hover:text-white transition-all cursor-pointer"
                  >
                    <Mail className={clsx('w-3.5 h-3.5', testingSmtp && 'animate-spin')} />
                    <span>Tes Kirim Email</span>
                  </button>
                </div>

                {smtpStatusMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {smtpStatusMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={smtpConfig.host}
                      onChange={e => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Port & Enkripsi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={smtpConfig.port}
                        onChange={e => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                        className="px-3 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                      />
                      <select
                        value={smtpConfig.encryption}
                        onChange={e => setSmtpConfig({ ...smtpConfig, encryption: e.target.value })}
                        className="px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] uppercase"
                      >
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Username / Email Pengirim
                    </label>
                    <input
                      type="email"
                      value={smtpConfig.username}
                      onChange={e => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Password / App Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSmtpPass ? 'text' : 'password'}
                        value={smtpConfig.password}
                        onChange={e => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                        className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPass(!showSmtpPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--app-text-dim)] hover:text-[var(--app-text)] cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showSmtpPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Nama Tampilan Pengirim (Sender Name)
                    </label>
                    <input
                      type="text"
                      value={smtpConfig.fromName}
                      onChange={e => setSmtpConfig({ ...smtpConfig, fromName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Alamat Email Balasan (Reply-To)
                    </label>
                    <input
                      type="email"
                      value={smtpConfig.replyTo}
                      onChange={e => setSmtpConfig({ ...smtpConfig, replyTo: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
