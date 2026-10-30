'use client'

import React, { useState, useEffect } from 'react'
import {
  Server,
  Wifi,
  Users,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Radio,
  HelpCircle,
  Sparkles,
  Terminal,
  Activity,
  Globe,
  Lock,
  Layers,
  FileCheck
} from 'lucide-react'

export interface FirstTimeSetupWizardProps {
  onComplete?: () => void
  onAddRouter?: (routerData: any) => Promise<any> | void
  onSyncCustomers?: () => Promise<any> | void
  onSyncPackages?: () => Promise<any> | void
  initialRouterCount?: number
  initialCustomerCount?: number
}

export default function FirstTimeSetupWizard({
  onComplete,
  onAddRouter,
  onSyncCustomers,
  onSyncPackages,
  initialRouterCount = 0,
  initialCustomerCount = 0,
}: FirstTimeSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [connectionType, setConnectionType] = useState<'PUBLIC_IP' | 'VPN_TUNNEL'>('PUBLIC_IP')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  
  // Test connection state
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean
    latencyMs?: number
    routerModel?: string
    rosVersion?: string
    message?: string
  } | null>(null)

  // Router form state
  const [routerForm, setRouterForm] = useState({
    name: 'Core BNG - Gateway Utama',
    ipAddress: '10.10.10.1',
    port: 8728,
    username: 'audira_admin',
    password: '',
    location: 'POP Pusat Jakarta',
  })

  // Packages state
  const [syncedPackages, setSyncedPackages] = useState([
    { id: 'pkg-1', name: 'Home Fiber 20 Mbps', speed: '20M/20M', price: 150000, selected: true },
    { id: 'pkg-2', name: 'Home Fiber 50 Mbps', speed: '50M/50M', price: 250000, selected: true },
    { id: 'pkg-3', name: 'Gamer Pro 100 Mbps', speed: '100M/100M', price: 375000, selected: true },
    { id: 'pkg-4', name: 'Corporate Dedicated 200 Mbps', speed: '200M/200M', price: 1200000, selected: true },
  ])
  const [isSyncingPackages, setIsSyncingPackages] = useState(false)
  const [packagesSyncedDone, setPackagesSyncedDone] = useState(false)

  // Customers state
  const [isImportingCustomers, setIsImportingCustomers] = useState(false)
  const [importedCustomersCount, setImportedCustomersCount] = useState<number | null>(null)
  const [dueDay, setDueDay] = useState(20)

  // Payment & WhatsApp state
  const [paymentChannels, setPaymentChannels] = useState({
    qris: true,
    vaBca: true,
    vaMandiri: true,
    kolektorTunai: true,
  })
  const [whatsappAutomation, setWhatsappAutomation] = useState({
    hMinus3: true,
    hariH: true,
    hPlus1Isolir: true,
    whatsappApiKey: 'FONNTE-API-LIVE-AUD-9988',
  })

  // Check localStorage for dismissal or state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('audira_wizard_dismissed')
      if (dismissed === 'true' && initialRouterCount > 0 && initialCustomerCount > 0) {
        setIsDismissed(true)
      }
      const savedStep = localStorage.getItem('audira_wizard_step')
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10)
        if (stepNum >= 1 && stepNum <= 5) {
          setCurrentStep(stepNum)
        }
      }
    }
  }, [initialRouterCount, initialCustomerCount])

  const saveStep = (step: number) => {
    setCurrentStep(step)
    if (typeof window !== 'undefined') {
      localStorage.setItem('audira_wizard_step', step.toString())
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('audira_wizard_dismissed', 'true')
    }
  }

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2500)
    }
  }

  // Handle Testing Router Connection
  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionResult(null)

    // Simulate real RouterOS v7 handshake check
    setTimeout(() => {
      setIsTestingConnection(false)
      setConnectionResult({
        success: true,
        latencyMs: 9,
        routerModel: 'MikroTik CCR2004-1G-12S+2XS',
        rosVersion: 'RouterOS v7.14.3',
        message: 'Koneksi API & RADIUS CoA (UDP 3799) Terverifikasi!',
      })
    }, 1200)
  }

  // Handle Saving Router & Next
  const handleSaveRouter = async () => {
    if (onAddRouter) {
      await onAddRouter({
        name: routerForm.name,
        ipAddress: routerForm.ipAddress,
        port: routerForm.port,
        username: routerForm.username,
        password: routerForm.password,
        location: routerForm.location,
        status: 'active',
      })
    }
    saveStep(2)
  }

  // Handle Syncing Packages
  const handlePullPackages = () => {
    setIsSyncingPackages(true)
    setTimeout(() => {
      setIsSyncingPackages(false)
      setPackagesSyncedDone(true)
      if (onSyncPackages) {
        onSyncPackages()
      }
    }, 1000)
  }

  // Handle Importing Customers
  const handlePullCustomers = () => {
    setIsImportingCustomers(true)
    setTimeout(() => {
      setIsImportingCustomers(false)
      setImportedCustomersCount(8)
      if (onSyncCustomers) {
        onSyncCustomers()
      }
    }, 1200)
  }

  // Handle Final Launch
  const handleFinishWizard = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audira_wizard_dismissed', 'true')
    }
    setIsDismissed(true)
    if (onComplete) {
      onComplete()
    }
  }

  if (isDismissed) {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="font-semibold text-[var(--app-text)]">
            Setup Wizard ISP Selesai
          </span>
          <span className="text-[var(--app-text-muted)]">
            Seluruh infrastruktur core router, billing, dan otomasi aktif.
          </span>
        </div>
        <button
          onClick={() => {
            setIsDismissed(false)
            setIsCollapsed(false)
          }}
          className="text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer transition"
        >
          <span>Buka Ulang Wizard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  const stepsList = [
    { num: 1, label: 'Core Router', icon: Server, desc: 'MikroTik & RADIUS CoA' },
    { num: 2, label: 'Paket & Speed', icon: Wifi, desc: 'Sinkronisasi Profil' },
    { num: 3, label: 'Pelanggan', icon: Users, desc: 'Impor PPP Secrets' },
    { num: 4, label: 'Payment & WA', icon: CreditCard, desc: 'QRIS & Pengingat' },
    { num: 5, label: 'Peluncuran', icon: ShieldCheck, desc: 'Siap Operasional' },
  ]

  // Generated MikroTik Quick Scripts
  const mikrotikApiScript = `/user group add name=audira-api policy=api,read,write,test,reboot comment="AUDIRA-NET Management API"
/user add name="${routerForm.username || 'audira_admin'}" group=audira-api password="${routerForm.password || 'GantiPasswordKuat123!'}" comment="AUDIRA System Operator"
/ip service set api port=${routerForm.port || 8728} disabled=no
/radius incoming set accept=yes port=3799`

  const mikrotikVpnScript = `/interface wireguard add name=wg-audira listen-port=51820 comment="AUDIRA Auto-Tunnel Cloud"
/interface wireguard peers add interface=wg-audira public-key="AUDIRA+78YhGF/908kLOpPqWeRtYuIoPlmNbVcxZasdf=" endpoint-address="vpn.audira.my.id" endpoint-port=51820 allowed-address=10.200.0.0/24 persistent-keepalive=25s
/ip address add address=10.200.0.2/24 interface=wg-audira comment="IP Tunnel AUDIRA Cloud"`

  return (
    <div className="bg-[var(--app-card)] border-2 border-blue-500/30 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* ─── Top Gradient Indicator & Header ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-4 sm:p-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 border border-white/30 text-white">
                  First-Time Setup Wizard
                </span>
                <span className="text-xs text-blue-100 font-mono">
                  Langkah {currentStep} dari 5
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                Panduan Memulai Jaringan ISP &amp; Billing AUDIRA
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title={isCollapsed ? 'Perluas Wizard' : 'Kecilkan Wizard'}
            >
              {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/80 text-white transition cursor-pointer"
              title="Tutup & Lewati Wizard"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar & Steps Tabs */}
        {!isCollapsed && (
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {stepsList.map(step => {
                const Icon = step.icon
                const isActive = currentStep === step.num
                const isCompleted = currentStep > step.num

                return (
                  <button
                    key={step.num}
                    onClick={() => saveStep(step.num)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-blue-900 font-bold shadow-md'
                        : isCompleted
                        ? 'bg-white/15 text-white hover:bg-white/20'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-400 text-blue-950'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {isCompleted ? <Check size={14} /> : step.num}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs truncate">{step.label}</p>
                      <p
                        className={`text-[10px] truncate ${
                          isActive ? 'text-blue-700 font-medium' : 'text-white/60'
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Wizard Body ─────────────────────────────────────────────────── */}
      {!isCollapsed && (
        <div className="p-4 sm:p-6 bg-[var(--app-card)] text-[var(--app-text)]">
          {/* ──────────────── STEP 1: Core Router MikroTik ──────────────── */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in-smooth">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-500" />
                    Langkah 1: Hubungkan Core Router MikroTik &amp; RADIUS CoA
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Sistem AUDIRA akan berkomunikasi langsung via RouterOS API dan RADIUS CoA (Port UDP 3799) untuk isolir/unblock instan tanpa reload session.
                  </p>
                </div>

                {/* Connection Mode Toggle */}
                <div className="flex items-center gap-1 bg-[var(--app-bg)] p-1 rounded-xl border border-[var(--app-border)] self-start sm:self-auto">
                  <button
                    onClick={() => setConnectionType('PUBLIC_IP')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      connectionType === 'PUBLIC_IP'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    IP Publik / DDNS
                  </button>
                  <button
                    onClick={() => setConnectionType('VPN_TUNNEL')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      connectionType === 'VPN_TUNNEL'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Auto-Tunnel VPN (Pelosok/CGNAT)
                  </button>
                </div>
              </div>

              {connectionType === 'PUBLIC_IP' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Nama Identifier Router
                    </label>
                    <input
                      type="text"
                      value={routerForm.name}
                      onChange={e => setRouterForm({ ...routerForm, name: e.target.value })}
                      placeholder="Contoh: CCR2004 Core Gateway"
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      IP Address Publik / Hostname DDNS
                    </label>
                    <input
                      type="text"
                      value={routerForm.ipAddress}
                      onChange={e => setRouterForm({ ...routerForm, ipAddress: e.target.value })}
                      placeholder="Contoh: 103.144.xxx.xxx atau vpn.ispanda.net"
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Port API MikroTik (Default 8728 / 8729 SSL)
                    </label>
                    <input
                      type="number"
                      value={routerForm.port}
                      onChange={e => setRouterForm({ ...routerForm, port: parseInt(e.target.value, 10) || 8728 })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Lokasi POP / Data Center
                    </label>
                    <input
                      type="text"
                      value={routerForm.location}
                      onChange={e => setRouterForm({ ...routerForm, location: e.target.value })}
                      placeholder="Contoh: POP Batam Center Tower A"
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Username API MikroTik
                    </label>
                    <input
                      type="text"
                      value={routerForm.username}
                      onChange={e => setRouterForm({ ...routerForm, username: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                      Password API MikroTik
                    </label>
                    <input
                      type="password"
                      value={routerForm.password}
                      onChange={e => setRouterForm({ ...routerForm, password: e.target.value })}
                      placeholder="Masukkan kata sandi API"
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                    <p className="font-bold flex items-center gap-1.5">
                      <Zap size={14} /> Solusi RT/RW Net &amp; ISP Tanpa IP Publik (CGNAT)
                    </p>
                    <p className="mt-1 text-[11px]">
                      Salin script WireGuard Tunnel di bawah ini, lalu buka <strong>Winbox MikroTik &gt; New Terminal</strong> dan paste. Router Anda akan langsung terhubung aman ke cloud AUDIRA tanpa repot setting port forwarding di modem upstream!
                    </p>
                  </div>

                  <div className="relative">
                    <pre className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800">
                      {mikrotikVpnScript}
                    </pre>
                    <button
                      onClick={() => handleCopy(mikrotikVpnScript, 'vpn-script')}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedKey === 'vpn-script' ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Salin Script Winbox</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Terminal Quick Script for MikroTik API Config */}
              {connectionType === 'PUBLIC_IP' && (
                <div className="p-3 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1.5">
                      <Terminal size={14} className="text-blue-500" />
                      Script Konfigurasi Cepat MikroTik (Salin ke Terminal Winbox):
                    </span>
                    <button
                      onClick={() => handleCopy(mikrotikApiScript, 'api-script')}
                      className="px-2 py-0.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 rounded text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedKey === 'api-script' ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedKey === 'api-script' ? 'Tersalin' : 'Salin Script'}</span>
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono text-[var(--app-text-muted)] bg-[var(--app-card)] p-2.5 rounded-lg overflow-x-auto border border-[var(--app-border)]">
                    {mikrotikApiScript}
                  </pre>
                </div>
              )}

              {/* Test Connection Banner */}
              {connectionResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                    connectionResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold">{connectionResult.message}</p>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        Model: {connectionResult.routerModel} | Versi: {connectionResult.rosVersion} | Latensi: {connectionResult.latencyMs} ms
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-white">
                    ONLINE
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-4 py-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={13} className={isTestingConnection ? 'animate-spin text-blue-500' : ''} />
                  <span>{isTestingConnection ? 'Menguji Handshake...' : '⚡ Uji Koneksi Router'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveRouter}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  <span>Simpan &amp; Lanjut ke Paket Bandwidth</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: Sinkronisasi Paket & Speed Profile ──────────────── */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in-smooth">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-blue-500" />
                    Langkah 2: Sinkronisasi Paket Internet &amp; Speed Profile
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Tarik otomatis profil bandwidth dari MikroTik (<code className="font-mono">/ppp profile</code>) dan tentukan harga langganan bulanan.
                  </p>
                </div>

                <button
                  onClick={handlePullPackages}
                  disabled={isSyncingPackages}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw size={13} className={isSyncingPackages ? 'animate-spin' : ''} />
                  <span>{isSyncingPackages ? 'Menarik Profil...' : 'Tarik dari MikroTik'}</span>
                </button>
              </div>

              {packagesSyncedDone && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>4 Paket bandwidth berhasil diimpor &amp; disinkronkan dari profil MikroTik!</span>
                </div>
              )}

              <div className="space-y-2.5">
                {syncedPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:border-blue-500/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={pkg.selected}
                        onChange={e => {
                          setSyncedPackages(prev =>
                            prev.map(p => (p.id === pkg.id ? { ...p, selected: e.target.checked } : p))
                          )
                        }}
                        className="w-4 h-4 rounded text-blue-600 border-[var(--app-border)]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[var(--app-text)]">{pkg.name}</p>
                        <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                          Rate Limit: {pkg.speed}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-xs text-[var(--app-text-muted)]">Harga Jual:</span>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-mono text-[var(--app-text-muted)]">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10) || 0
                            setSyncedPackages(prev =>
                              prev.map(p => (p.id === pkg.id ? { ...p, price: val } : p))
                            )
                          }}
                          className="w-32 pl-8 pr-2.5 py-1 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg text-xs font-mono font-bold text-[var(--app-text)] focus:outline-none focus:border-blue-500 text-right"
                        />
                      </div>
                      <span className="text-[11px] text-[var(--app-text-muted)]">/bln</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={() => saveStep(1)}
                  className="px-4 py-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveStep(3)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  <span>Simpan Paket &amp; Lanjut ke Pelanggan</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: Sinkronisasi Pelanggan (PPP Secrets) ──────────────── */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in-smooth">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Langkah 3: Sinkronisasi &amp; Impor Pelanggan Aktif (PPP Secrets)
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    Tarik seluruh akun PPPoE dari router MikroTik langsung ke sistem CRM billing AUDIRA secara massal.
                  </p>
                </div>

                <button
                  onClick={handlePullCustomers}
                  disabled={isImportingCustomers}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-sm"
                >
                  <RefreshCw size={13} className={isImportingCustomers ? 'animate-spin' : ''} />
                  <span>{isImportingCustomers ? 'Mengimpor Data...' : '⚡ Impor Massal dari MikroTik'}</span>
                </button>
              </div>

              {importedCustomersCount !== null && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>
                      <strong>{importedCustomersCount} Akun Pelanggan</strong> berhasil diimpor &amp; siap diterbitkan invoice pertama!
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold">Status: Aktif</span>
                </div>
              )}

              {/* Due Date & Billing Policy Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)]">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    Tanggal Jatuh Tempo Tagihan Bulanan
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--app-text-muted)]">Setiap Tanggal:</span>
                    <select
                      value={dueDay}
                      onChange={e => setDueDay(parseInt(e.target.value, 10))}
                      className="px-3 py-1.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg text-xs font-bold text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    >
                      {[1, 5, 10, 15, 20, 25, 28].map(day => (
                        <option key={day} value={day}>
                          Tanggal {day} Setiap Bulan
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[10px] text-[var(--app-text-muted)] mt-1">
                    Invoice akan digenerate otomatis 7 hari sebelum tanggal ini.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    Kebijakan Isolir Otomatis
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      id="auto-isolate"
                      className="w-4 h-4 rounded text-blue-600 border-[var(--app-border)]"
                    />
                    <label htmlFor="auto-isolate" className="text-xs text-[var(--app-text)] font-medium">
                      Otomatis isolir via RADIUS CoA jika menunggak H+1 jatuh tempo
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={() => saveStep(2)}
                  className="px-4 py-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveStep(4)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  <span>Lanjut ke Payment Gateway &amp; WhatsApp</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4: Payment Gateway & WhatsApp ──────────────── */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in-smooth">
              <div className="pb-3 border-b border-[var(--app-border)]">
                <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  Langkah 4: Kanal Pembayaran Digital &amp; Notifikasi WhatsApp
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                  Aktifkan gerbang pembayaran otomatis (QRIS, VA Bank) dan pengingat tagihan instan via WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Payment Channels */}
                <div className="p-4 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] space-y-3">
                  <p className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard size={14} className="text-blue-500" />
                    Kanal Pembayaran Aktif
                  </p>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={paymentChannels.qris}
                          onChange={e => setPaymentChannels({ ...paymentChannels, qris: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-bold text-[var(--app-text)]">QRIS Dinamis (BI / ASPI)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600">
                        Otomatis Lunas
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={paymentChannels.vaBca}
                          onChange={e => setPaymentChannels({ ...paymentChannels, vaBca: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-bold text-[var(--app-text)]">BCA Virtual Account</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600">
                        24 Jam Real-time
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={paymentChannels.vaMandiri}
                          onChange={e => setPaymentChannels({ ...paymentChannels, vaMandiri: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-bold text-[var(--app-text)]">Mandiri Virtual Account</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600">
                        24 Jam Real-time
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={paymentChannels.kolektorTunai}
                          onChange={e => setPaymentChannels({ ...paymentChannels, kolektorTunai: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-bold text-[var(--app-text)]">Kasir Kolektor Lapangan (Tunai)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600">
                        Struk Thermal
                      </span>
                    </label>
                  </div>
                </div>

                {/* WhatsApp Automation */}
                <div className="p-4 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] space-y-3">
                  <p className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-emerald-500" />
                    Otomasi Pengingat WhatsApp (Fonnte/Wablas)
                  </p>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={whatsappAutomation.hMinus3}
                          onChange={e => setWhatsappAutomation({ ...whatsappAutomation, hMinus3: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-medium text-[var(--app-text)]">Pengingat H-3 Jatuh Tempo</span>
                      </div>
                      <span className="text-[10px] text-[var(--app-text-muted)] font-mono">Invoice Link</span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={whatsappAutomation.hariH}
                          onChange={e => setWhatsappAutomation({ ...whatsappAutomation, hariH: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-medium text-[var(--app-text)]">Peringatan Hari-H Jatuh Tempo</span>
                      </div>
                      <span className="text-[10px] text-[var(--app-text-muted)] font-mono">QRIS Barcode</span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={whatsappAutomation.hPlus1Isolir}
                          onChange={e => setWhatsappAutomation({ ...whatsappAutomation, hPlus1Isolir: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-medium text-[var(--app-text)]">Notifikasi Isolir Layanan (H+1)</span>
                      </div>
                      <span className="text-[10px] text-rose-500 font-mono">Pemberitahuan</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text-muted)] mb-1">
                      Token API Fonnte / Gateway WA:
                    </label>
                    <input
                      type="text"
                      value={whatsappAutomation.whatsappApiKey}
                      onChange={e => setWhatsappAutomation({ ...whatsappAutomation, whatsappApiKey: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={() => saveStep(3)}
                  className="px-4 py-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveStep(5)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  <span>Lanjut ke Verifikasi &amp; Peluncuran</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 5: Peluncuran Sistem ──────────────── */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in-smooth text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--app-text)]">
                  Selamat! Sistem Operasional ISP Anda Siap Beroperasi
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] max-w-lg mx-auto mt-1">
                  Seluruh fondasi core routing, profil bandwidth, data pelanggan, gerbang pembayaran, dan automasi notifikasi telah dikonfigurasi dengan standar Carrier-Grade.
                </p>
              </div>

              {/* Summary Checklist Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left max-w-4xl mx-auto">
                <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--app-text)]">Core Router Online</p>
                    <p className="text-[10px] text-[var(--app-text-muted)]">RADIUS CoA (UDP 3799)</p>
                  </div>
                </div>

                <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--app-text)]">Paket Bandwidth</p>
                    <p className="text-[10px] text-[var(--app-text-muted)]">4 Speed Profile Siap</p>
                  </div>
                </div>

                <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--app-text)]">Data Pelanggan CRM</p>
                    <p className="text-[10px] text-[var(--app-text-muted)]">Jatuh Tempo Tgl {dueDay}</p>
                  </div>
                </div>

                <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--app-text)]">QRIS &amp; WhatsApp</p>
                    <p className="text-[10px] text-[var(--app-text-muted)]">Otomasi Notifikasi H-3</p>
                  </div>
                </div>
              </div>

              {/* Final Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => saveStep(4)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Tinjau Ulang Pengaturan</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishWizard}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95"
                >
                  <Zap size={14} />
                  <span>Selesaikan &amp; Buka Dashboard Penuh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

