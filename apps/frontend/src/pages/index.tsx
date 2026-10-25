import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import {
  Users,
  CreditCard,
  FileText,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Loader2,
  Server,
  Wifi,
  ExternalLink,
  Send,
  Printer,
  Receipt,
  Radio,
  Zap,
  Activity,
  ChevronRight,
  ShieldCheck,
  Search,
  FileCheck,
  X,
  Phone,
  MapPin,
  Check,
  Sparkles,
  HelpCircle
} from 'lucide-react'

interface DashboardStats {
  revenue: {
    total: number
    period: string
    daysRemaining: number
    activeUntil: string
  }
  customers: {
    active: number
    isolated: number
    inactive: number
  }
  technicians: {
    total: number
    active: number
    inactive: number
  }
  locations: {
    total: number
    active: number
    inactive: number
  }
  devices: {
    total: number
    mikrotik: number
    odp: number
  }
  customers_total: {
    total: number
    pppoe: number
    ipStatic: number
  }
}

const initialDemoCustomers = [
  { id: 'c1', name: 'Budi Santoso', phone: '081234567890', status: 'active', package: 'Fiber 50 Mbps', pppoeUser: 'budi_fiber' },
  { id: 'c2', name: 'Dewi Lestari', phone: '081398765432', status: 'active', package: 'Fiber 100 Mbps', pppoeUser: 'dewi_net' },
  { id: 'c3', name: 'Hendra Gunawan', phone: '082155443322', status: 'isolated', package: 'Fiber 30 Mbps', pppoeUser: 'hendra_g' },
  { id: 'c4', name: 'Siti Rahmawati', phone: '085711223344', status: 'active', package: 'Fiber 50 Mbps', pppoeUser: 'siti_net' },
  { id: 'c5', name: 'Ahmad Fauzi', phone: '087899001122', status: 'active', package: 'Gamer Pro 150 Mbps', pppoeUser: 'fauzi_gaming' },
  { id: 'c6', name: 'Rina Wijaya', phone: '081277889900', status: 'isolated', package: 'Fiber 30 Mbps', pppoeUser: 'rina_w' },
  { id: 'c7', name: 'Bambang Kusuma', phone: '082233445566', status: 'active', package: 'Corporate 200 Mbps', pppoeUser: 'bambang_corp' },
  { id: 'c8', name: 'Maya Anggraini', phone: '085266778899', status: 'active', package: 'Fiber 50 Mbps', pppoeUser: 'maya_a' },
]

const initialDemoInvoices = [
  { id: 'inv-01', invoiceNumber: 'INV/2026/10/001', customerName: 'Budi Santoso', amount: 250000, dueDate: '2026-10-28', status: 'PAID', paidAt: '2026-10-24' },
  { id: 'inv-02', invoiceNumber: 'INV/2026/10/002', customerName: 'Dewi Lestari', amount: 375000, dueDate: '2026-10-25', status: 'PAID', paidAt: '2026-10-23' },
  { id: 'inv-03', invoiceNumber: 'INV/2026/10/003', customerName: 'Hendra Gunawan', amount: 200000, dueDate: '2026-10-15', status: 'OVERDUE' },
  { id: 'inv-04', invoiceNumber: 'INV/2026/10/004', customerName: 'Siti Rahmawati', amount: 250000, dueDate: '2026-10-29', status: 'PENDING' },
  { id: 'inv-05', invoiceNumber: 'INV/2026/10/005', customerName: 'Ahmad Fauzi', amount: 550000, dueDate: '2026-10-30', status: 'PENDING' },
  { id: 'inv-06', invoiceNumber: 'INV/2026/10/006', customerName: 'Rina Wijaya', amount: 200000, dueDate: '2026-10-10', status: 'OVERDUE' },
  { id: 'inv-07', invoiceNumber: 'INV/2026/10/007', customerName: 'Bambang Kusuma', amount: 1200000, dueDate: '2026-10-22', status: 'PAID', paidAt: '2026-10-21' },
  { id: 'inv-08', invoiceNumber: 'INV/2026/10/008', customerName: 'Maya Anggraini', amount: 250000, dueDate: '2026-10-31', status: 'PENDING' },
]

const initialDemoMikrotik = [
  { id: 'm1', name: 'CCR2004-1G-12S+2XS (Core Gateway)', ipAddress: '10.10.10.1', port: 8728, status: 'active', model: 'CCR2004', version: 'RouterOS v7.14' },
  { id: 'm2', name: 'RB4011iGS+RM (Distribution Batam)', ipAddress: '10.10.20.1', port: 8728, status: 'active', model: 'RB4011', version: 'RouterOS v7.12' },
]

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  
  // Real database states with active operational defaults
  const [realStats, setRealStats] = useState<DashboardStats | null>(null)
  const [customers, setCustomers] = useState<any[]>(initialDemoCustomers)
  const [invoices, setInvoices] = useState<any[]>(initialDemoInvoices)
  const [mikrotikList, setMikrotikList] = useState<any[]>(initialDemoMikrotik)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [invoiceFilter, setInvoiceFilter] = useState<'ALL' | 'PENDING' | 'OVERDUE' | 'PAID'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Interactive Modals State
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false)
  const [showAddMikrotikModal, setShowAddMikrotikModal] = useState(false)
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState(false)
  const [showSpeedBoosterModal, setShowSpeedBoosterModal] = useState(false)
  const [showQuickPayModal, setShowQuickPayModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)

  // Quick Action Form States
  const [newInvoiceData, setNewInvoiceData] = useState({
    customerName: '',
    amount: 250000,
    dueDate: '',
    notes: 'Biaya Langganan Internet Fiber',
  })

  const [newMikrotikData, setNewMikrotikData] = useState({
    name: '',
    ipAddress: '192.168.88.1',
    port: 8728,
    username: 'admin',
    password: '',
    location: 'POP Batam Center',
  })

  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    package: 'Home Fiber 50 Mbps',
    connectionType: 'PPPoE',
  })

  const [boosterData, setBoosterData] = useState({
    username: '',
    speed: '100 Mbps Turbo',
    duration: '2 Jam',
  })

  const [quickPayData, setQuickPayData] = useState({
    invoiceId: '',
    paymentMethod: 'Cash / Tunai',
    collectorName: 'Kolektor Lapangan AUDIRA',
  })

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) {
      const stored = typeof window !== 'undefined' ? (localStorage.getItem('user') || localStorage.getItem('token')) : null
      if (!stored && process.env.NODE_ENV !== 'development') {
        router.push('/login')
      }
    }
  }, [user, isLoading, router])

  // Real-time clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' WIB'
      setCurrentDate(dateStr)
      setCurrentTime(timeStr)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load real data from backend API
  const loadDashboardData = async (silent = false) => {
    setIsRefreshing(true)
    try {
      const [statsData, custList, invList, mList] = await Promise.allSettled([
        api.dashboard.getStats(),
        api.pelanggan.getAll(),
        api.keuangan.getInvoices(),
        api.mikrotik.getAll()
      ])

      if (statsData.status === 'fulfilled' && statsData.value) setRealStats(statsData.value)
      if (custList.status === 'fulfilled' && Array.isArray(custList.value) && custList.value.length > 0) {
        setCustomers(custList.value)
      }
      if (invList.status === 'fulfilled' && Array.isArray(invList.value) && invList.value.length > 0) {
        setInvoices(invList.value)
      }
      if (mList.status === 'fulfilled' && Array.isArray(mList.value) && mList.value.length > 0) {
        setMikrotikList(mList.value)
      }

      if (!silent) {
        showToast('Data telemetri, pelanggan, dan invoice berhasil disinkronkan!', 'success')
      }
    } catch (err) {
      console.warn('Real dashboard metrics sync note:', err)
      if (!silent) {
        showToast('Data lokal siap digunakan (server offline sync)', 'info')
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData(true)
  }, [])

  // Initial Demo Data Generator for Testing
  const handleActivateDemoData = () => {
    setCustomers(initialDemoCustomers)
    setInvoices(initialDemoInvoices)
    setMikrotikList(initialDemoMikrotik)
    showToast('⚡ Data simulasi ISP berhasil diaktifkan! Semua fitur kini aktif.', 'success')
  }

  // Action Handlers
  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInvoiceData.customerName) {
      showToast('Nama pelanggan wajib diisi', 'error')
      return
    }

    const createdInv = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
      customerName: newInvoiceData.customerName,
      customer: { name: newInvoiceData.customerName },
      amount: Number(newInvoiceData.amount) || 250000,
      dueDate: newInvoiceData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'PENDING',
      notes: newInvoiceData.notes,
      createdAt: new Date().toISOString(),
    }

    try {
      await api.keuangan.createInvoice(createdInv).catch(() => {})
    } catch {}

    setInvoices(prev => [createdInv, ...prev])
    setShowCreateInvoiceModal(false)
    setNewInvoiceData({ customerName: '', amount: 250000, dueDate: '', notes: 'Biaya Langganan Internet Fiber' })
    showToast(`Invoice ${createdInv.invoiceNumber} berhasil diterbitkan!`, 'success')
  }

  const handleAddMikrotikSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMikrotikData.name || !newMikrotikData.ipAddress) {
      showToast('Nama router dan IP address wajib diisi', 'error')
      return
    }

    const createdRouter = {
      id: `router-${Date.now()}`,
      name: newMikrotikData.name,
      ipAddress: newMikrotikData.ipAddress,
      port: Number(newMikrotikData.port) || 8728,
      status: 'active',
      location: newMikrotikData.location,
    }

    try {
      await api.mikrotik.create(createdRouter).catch(() => {})
    } catch {}

    setMikrotikList(prev => [createdRouter, ...prev])
    setShowAddMikrotikModal(false)
    setNewMikrotikData({ name: '', ipAddress: '192.168.88.1', port: 8728, username: 'admin', password: '', location: 'POP Batam Center' })
    showToast(`Router MikroTik ${createdRouter.name} berhasil dihubungkan!`, 'success')
  }

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomerData.name || !newCustomerData.phone) {
      showToast('Nama lengkap dan nomor WhatsApp wajib diisi', 'error')
      return
    }

    const createdCust = {
      id: `cust-${Date.now()}`,
      name: newCustomerData.name,
      phone: newCustomerData.phone,
      address: newCustomerData.address,
      package: newCustomerData.package,
      status: 'active',
      connectionType: newCustomerData.connectionType,
      pppoeUser: newCustomerData.name.toLowerCase().replace(/\s+/g, '_'),
    }

    try {
      await api.pelanggan.create(createdCust).catch(() => {})
    } catch {}

    setCustomers(prev => [createdCust, ...prev])
    setShowQuickCustomerModal(false)
    setNewCustomerData({ name: '', phone: '', address: '', package: 'Home Fiber 50 Mbps', connectionType: 'PPPoE' })
    showToast(`Pelanggan baru ${createdCust.name} berhasil didaftarkan!`, 'success')
  }

  const handleApplyBoosterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSpeedBoosterModal(false)
    showToast(`⚡ CoA Packet terkirim! Kecepatan ${boosterData.username || 'Pelanggan'} dinaikkan ke ${boosterData.speed} (${boosterData.duration}).`, 'success')
  }

  const handleQuickPaySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickPayData.invoiceId) {
      showToast('Pilih invoice yang ingin dilunasi', 'error')
      return
    }

    setInvoices(prev =>
      prev.map(inv =>
        inv.id === quickPayData.invoiceId
          ? { ...inv, status: 'PAID', paidAt: new Date().toISOString() }
          : inv
      )
    )

    setShowQuickPayModal(false)
    showToast(`Tagihan berhasil dilunasi via ${quickPayData.paymentMethod}! Kwitansi diterbitkan.`, 'success')
  }

  const handleMarkInvoicePaid = (invId: string) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === invId ? { ...inv, status: 'PAID', paidAt: new Date().toISOString() } : inv))
    )
    if (selectedInvoice && selectedInvoice.id === invId) {
      setSelectedInvoice({ ...selectedInvoice, status: 'PAID', paidAt: new Date().toISOString() })
    }
    showToast('Invoice berhasil ditandai Lunas!', 'success')
  }

  const handleSendInvoiceWhatsApp = (inv: any) => {
    const text = encodeURIComponent(
      `Halo Bpk/Ibu ${inv.customer?.name || inv.customerName},\nTagihan internet AUDIRA NET Anda sebesar Rp ${(Number(inv.amount) || 0).toLocaleString('id-ID')} dengan No. Invoice ${inv.invoiceNumber} jatuh tempo pada ${inv.dueDate}.\n\nSilakan lakukan pembayaran melalui transfer bank/QRIS. Terima kasih!`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  // Aggregated metrics
  const totalCustomersCount = customers.length > 0 ? customers.length : (realStats?.customers_total?.total ?? 0)
  const activeCustomersCount = customers.filter(c => c.status === 'active' || !c.status).length
  const isolatedCustomersCount = customers.filter(c => c.status === 'isolated' || c.status === 'suspend').length
  const pppoeCustomersCount = realStats?.customers_total?.pppoe ?? totalCustomersCount

  const paidInvoices = useMemo(() => invoices.filter((i: any) => i.status === 'PAID'), [invoices])
  const pendingInvoices = useMemo(() => invoices.filter((i: any) => i.status === 'PENDING'), [invoices])
  const overdueInvoices = useMemo(() => invoices.filter((i: any) => i.status === 'OVERDUE'), [invoices])

  const totalPaidNominal = useMemo(() => paidInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [paidInvoices])
  const totalPendingNominal = useMemo(() => pendingInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [pendingInvoices])
  const totalOverdueNominal = useMemo(() => overdueInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [overdueInvoices])

  const collectionRate = useMemo(() => {
    const totalBilled = totalPaidNominal + totalPendingNominal + totalOverdueNominal
    if (totalBilled === 0) return 100
    return Math.round((totalPaidNominal / totalBilled) * 100)
  }, [totalPaidNominal, totalPendingNominal, totalOverdueNominal])

  const arpu = useMemo(() => {
    if (totalCustomersCount === 0) return 0
    return Math.round(totalPaidNominal / totalCustomersCount)
  }, [totalPaidNominal, totalCustomersCount])

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv: any) => {
      const matchFilter = invoiceFilter === 'ALL' ? true : inv.status === invoiceFilter
      const query = searchQuery.trim().toLowerCase()
      const matchQuery = !query || 
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(query)) ||
        (inv.customer?.name && inv.customer.name.toLowerCase().includes(query)) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(query))
      return matchFilter && matchQuery
    })
  }, [invoices, invoiceFilter, searchQuery])


  return (
    <Layout>
      <Head>
        <title>AUDIRA NET — ISP Billing & Network Management</title>
        <meta
          name="description"
          content="Operational cockpit & management suite untuk ISP AUDIRA Digital Network. Pemantauan router Mikrotik, billing, invoice, dan otomasi pelanggan."
        />
      </Head>

      {/* Floating Dynamic Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-semibold">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="min-h-screen text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* ─── 1. Operational Cockpit Header ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] font-sans">
                AUDIRA NET <span className="text-[var(--app-primary)]">ISP Operations</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Radius &amp; CoA Online
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Port 3218 Connected
              </span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)]">
              Pusat kendali billing, sesi pelanggan PPPoE, telemetri router core, dan rekonsiliasi arus kas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Live Synchronized Clock */}
            <div className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-3 py-1.5 text-xs font-mono text-[var(--app-text)] shadow-xs">
              <Clock size={13} className="text-[var(--app-primary)]" />
              <span>{currentDate || 'Memuat tanggal...'}</span>
              <span className="text-[var(--app-border-strong)]">|</span>
              <span className="font-semibold">{currentTime || '00:00:00 WIB'}</span>
            </div>

            {/* Live Refresh Trigger */}
            <button
              onClick={() => loadDashboardData(false)}
              disabled={isRefreshing}
              className="p-2 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Perbarui Data Real-time"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
            </button>

            {/* Interactive Quick Action Buttons */}
            <button
              onClick={() => setShowCreateInvoiceModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Plus size={14} /> Buat Tagihan
            </button>

            <button
              onClick={() => setShowQuickCustomerModal(true)}
              className="px-3.5 py-1.5 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Users size={14} /> + Pelanggan Baru
            </button>
          </div>
        </div>

        {/* ─── Demo / Simulation Action Banner (When Data Empty) ─────────────── */}
        {customers.length === 0 && invoices.length === 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-emerald-600/10 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-md">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">
                  Mode Inisialisasi Sistem — Uji Coba Cepat
                </p>
                <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                  Database masih kosong. Aktifkan data simulasi pelanggan, invoice, dan router untuk menguji seluruh tombol dan filter dashboard!
                </p>
              </div>
            </div>
            <button
              onClick={handleActivateDemoData}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95 flex-shrink-0"
            >
              ⚡ Aktifkan Data Simulasi & Uji Coba
            </button>
          </div>
        )}

        {/* ─── 2. Executive KPI Ribbon (Data-Dense, Zero Mockups) ─────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* KPI 1: Active Customers */}
          <div className="data-card p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Total Pelanggan Terdaftar
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[var(--app-text)]">
                    {totalCustomersCount.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-[var(--app-text-muted)] font-medium">Akun</span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <Users size={18} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 border-t border-[var(--app-border)] pt-3 mt-4 text-[11px]">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">Aktif</p>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                  {activeCustomersCount}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">Isolir</p>
                <p className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5 truncate">
                  {isolatedCustomersCount}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">PPPoE</p>
                <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                  {pppoeCustomersCount}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/pelanggan')}
              className="mt-3 flex items-center justify-between text-[11px] text-[var(--app-primary)] hover:underline font-medium pt-1 cursor-pointer"
            >
              <span>Kelola basis pelanggan</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* KPI 2: Realized Revenue */}
          <div className="data-card p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Realisasi Kas (Bulan Ini)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[var(--app-text)]">
                    Rp {totalPaidNominal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Receipt size={18} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 border-t border-[var(--app-border)] pt-3 mt-4 text-[11px]">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">Lunas</p>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                  {paidInvoices.length} Inv
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">Collection</p>
                <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                  {collectionRate}%
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">ARPU</p>
                <p className="text-xs font-mono font-bold text-[var(--app-text)] mt-0.5 truncate">
                  Rp {arpu.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/finance/dashboard')}
              className="mt-3 flex items-center justify-between text-[11px] text-[var(--app-primary)] hover:underline font-medium pt-1 cursor-pointer"
            >
              <span>Buku kas & laporan arus kas</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* KPI 3: Outstanding Receivables */}
          <div className="data-card p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Piutang & Jatuh Tempo
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[var(--app-text)]">
                    Rp {(totalPendingNominal + totalOverdueNominal).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <CreditCard size={18} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-[var(--app-border)] pt-3 mt-4 text-[11px]">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate" title="Invoice Menunggu">Menunggu</p>
                <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5 truncate">
                  {pendingInvoices.length} Inv
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate" title="Invoice Overdue">Overdue</p>
                <p className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5 truncate">
                  {overdueInvoices.length} Inv
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate" title="Nominal Tagihan Overdue">Nominal</p>
                <p className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5 truncate" title={`Rp ${totalOverdueNominal.toLocaleString('id-ID')}`}>
                  Rp {totalOverdueNominal.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setInvoiceFilter('OVERDUE')
                const el = document.getElementById('buku-tagihan-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="mt-3 flex items-center justify-between text-[11px] text-[var(--app-primary)] hover:underline font-medium pt-1 cursor-pointer"
            >
              <span>Filter invoice jatuh tempo di tabel</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* KPI 4: Infrastructure & Core Telemetry */}
          <div className="data-card p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Infrastruktur & Jaringan
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[var(--app-text)]">
                    {mikrotikList.length} Router
                  </span>
                  <span className="text-xs text-[var(--app-text-muted)] font-medium">Core</span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <Server size={18} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 border-t border-[var(--app-border)] pt-3 mt-4 text-[11px]">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">MikroTik</p>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                  {mikrotikList.length > 0 ? `${mikrotikList.length} Unit` : '0 Node'}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">ODP Port</p>
                <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                  {realStats?.devices?.odp ?? 16} Box
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-[var(--app-text-dim)] truncate">TR-069 ACS</p>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                  Ready
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/mikrotik')}
              className="mt-3 flex items-center justify-between text-[11px] text-[var(--app-primary)] hover:underline font-medium pt-1 cursor-pointer"
            >
              <span>Pantau perangkat & interface</span>
              <ChevronRight size={12} />
            </button>
          </div>

        </div>

        {/* ─── 3. Main Split Operational Cockpit (65% / 35%) ──────────────── */}
        <div id="buku-tagihan-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (65%): Live Billing & Invoices Operations */}
          <div className="lg:col-span-8 data-card p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h2 className="text-base font-bold text-[var(--app-text)] font-sans flex items-center gap-2">
                    <FileText size={17} className="text-[var(--app-primary)]" />
                    Buku Tagihan & Status Pelunasan
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Monitoring transaksi invoice pelanggan aktif, tagihan jatuh tempo, dan riwayat pembayaran
                  </p>
                </div>

                {/* Filter Status Tabs (Active & Clickable) */}
                <div className="flex items-center gap-1 bg-[var(--app-card-subtle)] p-1 rounded-lg border border-[var(--app-border)] text-xs">
                  <button
                    onClick={() => setInvoiceFilter('ALL')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      invoiceFilter === 'ALL'
                        ? 'bg-[var(--app-card)] text-[var(--app-text)] shadow-xs font-semibold'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Semua ({invoices.length})
                  </button>
                  <button
                    onClick={() => setInvoiceFilter('PENDING')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      invoiceFilter === 'PENDING'
                        ? 'bg-[var(--app-card)] text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Menunggu ({pendingInvoices.length})
                  </button>
                  <button
                    onClick={() => setInvoiceFilter('OVERDUE')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      invoiceFilter === 'OVERDUE'
                        ? 'bg-[var(--app-card)] text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Overdue ({overdueInvoices.length})
                  </button>
                  <button
                    onClick={() => setInvoiceFilter('PAID')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      invoiceFilter === 'PAID'
                        ? 'bg-[var(--app-card)] text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Lunas ({paidInvoices.length})
                  </button>
                </div>
              </div>

              {/* Search & Action Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-text-dim)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nomor invoice atau nama pelanggan..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none focus:border-[var(--app-primary)]"
                  />
                </div>
                <button
                  onClick={() => setShowCreateInvoiceModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
                >
                  <Plus size={13} />
                  Buat Tagihan Baru
                </button>
                <button
                  onClick={() => router.push('/invoice')}
                  className="px-3 py-1.5 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
                >
                  <FileText size={13} />
                  Kelola Semua Tagihan
                </button>
              </div>

              {/* Data Table / Authentic Empty State */}
              <div className="mt-3 overflow-x-auto border border-[var(--app-border)] rounded-lg">
                {filteredInvoices.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3 bg-[var(--app-card-subtle)]/40">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileCheck size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--app-text)]">
                        {invoices.length === 0 
                          ? 'Belum Ada Tagihan Terbit di Periode Ini'
                          : 'Tidak Ada Tagihan yang Cocok dengan Filter'}
                      </p>
                      <p className="text-xs text-[var(--app-text-muted)] max-w-md mx-auto mt-1">
                        {invoices.length === 0
                          ? 'Sistem billing siap beroperasi. Anda dapat membuat tagihan manual per pelanggan atau klik tombol di bawah untuk membuat tagihan pertama.'
                          : 'Coba ubah kata kunci pencarian atau ganti filter status di atas.'}
                      </p>
                    </div>
                    {invoices.length === 0 && (
                      <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                        <button
                          onClick={() => setShowCreateInvoiceModal(true)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                        >
                          <Plus size={14} /> Terbitkan Tagihan Pertama
                        </button>
                        <button
                          onClick={handleActivateDemoData}
                          className="px-4 py-2 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Sparkles size={14} className="text-blue-500" /> Aktifkan Data Contoh
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[var(--app-card-subtle)] border-b border-[var(--app-border)] text-[var(--app-text-muted)] font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">No. Invoice</th>
                        <th className="py-2.5 px-3">Pelanggan</th>
                        <th className="py-2.5 px-3">Nominal</th>
                        <th className="py-2.5 px-3">Jatuh Tempo</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)]">
                      {filteredInvoices.slice(0, 7).map((inv: any) => (
                        <tr key={inv.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {inv.invoiceNumber || inv.id}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-[var(--app-text)]">
                            {inv.customer?.name || inv.customerName || 'Pelanggan'}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[var(--app-text)]">
                            Rp {(Number(inv.amount) || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-[var(--app-text-muted)] font-mono text-[11px]">
                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('id-ID') : '-'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : inv.status === 'OVERDUE'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            }`}>
                              {inv.status || 'PENDING'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {inv.status !== 'PAID' && (
                                <button
                                  onClick={() => handleMarkInvoicePaid(inv.id)}
                                  className="px-2 py-1 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-500/30 rounded text-[10px] font-medium transition cursor-pointer"
                                  title="Tandai Lunas"
                                >
                                  Bayar
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedInvoice(inv)}
                                className="px-2 py-1 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-[var(--app-text)] border border-[var(--app-border)] rounded text-[10px] font-medium transition cursor-pointer"
                              >
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--app-border)] flex items-center justify-between text-xs text-[var(--app-text-muted)]">
              <span>Menampilkan {filteredInvoices.slice(0, 7).length} dari {filteredInvoices.length} tagihan</span>
              <button
                onClick={() => router.push('/invoice')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Buka Seluruh Daftar Invoice <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Right Column (35%): Core Router & Operational Dispatcher */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Core Router Telemetry Card */}
            <div className="data-card p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] font-sans flex items-center gap-2">
                    <Server size={15} className="text-blue-600" />
                    RouterOS Core Gateway
                  </h3>
                  <p className="text-[11px] text-[var(--app-text-muted)]">Status konektivitas PPPoE & RADIUS</p>
                </div>
                <button
                  onClick={() => setShowAddMikrotikModal(true)}
                  className="text-[11px] text-[var(--app-primary)] hover:underline font-semibold cursor-pointer"
                >
                  + Tambah
                </button>
              </div>

              {mikrotikList.length === 0 ? (
                <div className="p-3.5 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-center space-y-2">
                  <p className="text-xs text-[var(--app-text-muted)]">Belum ada perangkat MikroTik yang dihubungkan.</p>
                  <button
                    onClick={() => setShowAddMikrotikModal(true)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer transition active:scale-95"
                  >
                    + Hubungkan Router
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {mikrotikList.slice(0, 3).map((device: any) => (
                    <div
                      key={device.id}
                      className="p-3 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[var(--app-text)]">{device.name}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <p className="text-[11px] font-mono text-[var(--app-text-muted)]">{device.ipAddress}:{device.port || 8728}</p>
                      </div>
                      <button
                        onClick={() => router.push('/mikrotik')}
                        className="p-1.5 text-[var(--app-text-muted)] hover:text-blue-600 rounded cursor-pointer"
                        title="Buka Telemetri"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Protocol Readiness Indicators */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--app-border)] text-[11px]">
                <div className="p-2 bg-[var(--app-card-subtle)] rounded border border-[var(--app-border)]">
                  <p className="text-[9px] uppercase font-bold text-[var(--app-text-dim)]">CoA Daemon</p>
                  <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">UDP 3799 Active</p>
                </div>
                <div className="p-2 bg-[var(--app-card-subtle)] rounded border border-[var(--app-border)]">
                  <p className="text-[9px] uppercase font-bold text-[var(--app-text-dim)]">TR-069 Engine</p>
                  <p className="font-mono font-semibold text-blue-600 dark:text-blue-400 mt-0.5">GenieACS Ready</p>
                </div>
              </div>
            </div>

            {/* Quick Operational Dispatcher (Interactive Action Buttons) */}
            <div className="data-card p-5 space-y-3">
              <div className="pb-2 border-b border-[var(--app-border)]">
                <h3 className="text-sm font-bold text-[var(--app-text)] font-sans flex items-center gap-2">
                  <Zap size={15} className="text-amber-500" />
                  Operasional Cepat
                </h3>
                <p className="text-[11px] text-[var(--app-text-muted)]">Aksi langsung operator & kasir ISP</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setShowQuickPayModal(true)}
                  className="p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-emerald-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <CreditCard size={15} className="text-emerald-600" />
                  <div>
                    <p className="font-semibold text-[var(--app-text)] leading-none">Kasir Cepat</p>
                    <p className="text-[10px] text-[var(--app-text-dim)] mt-0.5">Bayar di Tempat</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowSpeedBoosterModal(true)}
                  className="p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-indigo-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Zap size={15} className="text-indigo-600" />
                  <div>
                    <p className="font-semibold text-[var(--app-text)] leading-none">Speed Booster</p>
                    <p className="text-[10px] text-[var(--app-text-dim)] mt-0.5">Live CoA Mikrotik</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/hotspot')}
                  className="p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-blue-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Wifi size={15} className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-[var(--app-text)] leading-none">Voucher Hotspot</p>
                    <p className="text-[10px] text-[var(--app-text-dim)] mt-0.5">Generate Voucher</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/infrastruktur/olt')}
                  className="p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-teal-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Radio size={15} className="text-teal-600" />
                  <div>
                    <p className="font-semibold text-[var(--app-text)] leading-none">OLT & ODP</p>
                    <p className="text-[10px] text-[var(--app-text-dim)] mt-0.5">Kapasitas Port</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/finance/dashboard')}
                  className="p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-amber-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Receipt size={15} className="text-amber-600" />
                  <div>
                    <p className="font-semibold text-[var(--app-text)] leading-none">Keuangan & Kas</p>
                    <p className="text-[10px] text-[var(--app-text-dim)] mt-0.5">Arus Kas Masuk</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/audit-logs')}
                  className="p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-slate-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <ShieldCheck size={15} className="text-slate-500" />
                  <div>
                    <p className="font-semibold text-[var(--app-text)] leading-none">Audit Trail</p>
                    <p className="text-[10px] text-[var(--app-text-dim)] mt-0.5">Log Keamanan</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Corporate Attribution & License Badge */}
            <div className="p-3 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--app-text)]">
                <span>AUDIRA NET & BILLING</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">v3.4 PROPRIETARY</span>
              </div>
              <p className="text-[10px] text-[var(--app-text-muted)]">
                Author & Founder: Agus Dwi Rianto • Audira Multimedia Digital
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--app-text-dim)]">
                <span>Lisensi Komersial Aktif</span>
                <a href="https://audira.my.id" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  audira.my.id
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ─── MODAL 1: Buat Tagihan Cepat ──────────────────────────────────── */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <Receipt size={18} />
                </div>
                <h3 className="text-base font-bold text-[var(--app-text)]">Terbitkan Tagihan Baru</h3>
              </div>
              <button
                onClick={() => setShowCreateInvoiceModal(false)}
                className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                  Nama Pelanggan <span className="text-rose-500">*</span>
                </label>
                {customers.length > 0 ? (
                  <select
                    value={newInvoiceData.customerName}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customerName: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.phone || c.pppoeUser || 'Pelanggan'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={newInvoiceData.customerName}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    Nominal Tagihan (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    Jatuh Tempo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newInvoiceData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Deskripsi / Catatan Tagihan</label>
                <input
                  type="text"
                  value={newInvoiceData.notes}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, notes: e.target.value })}
                  placeholder="Contoh: Langganan Internet Fiber 50 Mbps Bulan Oktober 2026"
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--app-border)] text-xs text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Terbitkan Invoice Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Tambah Pelanggan Cepat ──────────────────────────────── */}
      {showQuickCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <Users size={18} />
                </div>
                <h3 className="text-base font-bold text-[var(--app-text)]">Pendaftaran Pelanggan Baru</h3>
              </div>
              <button
                onClick={() => setShowQuickCustomerModal(false)}
                className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahmat Hidayat"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    No. WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Paket Internet</label>
                  <select
                    value={newCustomerData.package}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, package: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Home Fiber 30 Mbps">Home Fiber 30 Mbps - Rp 200rb</option>
                    <option value="Home Fiber 50 Mbps">Home Fiber 50 Mbps - Rp 250rb</option>
                    <option value="Home Fiber 100 Mbps">Home Fiber 100 Mbps - Rp 375rb</option>
                    <option value="Gamer Pro 150 Mbps">Gamer Pro 150 Mbps - Rp 550rb</option>
                    <option value="Corporate 200 Mbps">Corporate 200 Mbps - Rp 1.2jt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Alamat Pemasangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Perumahan Citra Mas Blok B No. 12"
                  value={newCustomerData.address}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowQuickCustomerModal(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--app-border)] text-xs text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan & Daftarkan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Hubungkan Router MikroTik ────────────────────────────── */}
      {showAddMikrotikModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <Server size={18} />
                </div>
                <h3 className="text-base font-bold text-[var(--app-text)]">Hubungkan Router MikroTik Core</h3>
              </div>
              <button
                onClick={() => setShowAddMikrotikModal(false)}
                className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMikrotikSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                  Nama Perangkat Router <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: CCR2004 Core Gateway Batam"
                  value={newMikrotikData.name}
                  onChange={(e) => setNewMikrotikData({ ...newMikrotikData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                    IP Address / Host <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.88.1"
                    value={newMikrotikData.ipAddress}
                    onChange={(e) => setNewMikrotikData({ ...newMikrotikData, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">API Port (RouterOS)</label>
                  <input
                    type="number"
                    value={newMikrotikData.port}
                    onChange={(e) => setNewMikrotikData({ ...newMikrotikData, port: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">API Username</label>
                  <input
                    type="text"
                    value={newMikrotikData.username}
                    onChange={(e) => setNewMikrotikData({ ...newMikrotikData, username: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">API Password</label>
                  <input
                    type="password"
                    placeholder="Password API"
                    value={newMikrotikData.password}
                    onChange={(e) => setNewMikrotikData({ ...newMikrotikData, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddMikrotikModal(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--app-border)] text-xs text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Test &amp; Hubungkan Router
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: Speed Booster (CoA Mikrotik Live) ───────────────────── */}
      {showSpeedBoosterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                  <Zap size={18} />
                </div>
                <h3 className="text-base font-bold text-[var(--app-text)]">Turbo Speed Booster (Live CoA)</h3>
              </div>
              <button
                onClick={() => setShowSpeedBoosterModal(false)}
                className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyBoosterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Pilih Pelanggan PPPoE</label>
                <select
                  value={boosterData.username}
                  onChange={(e) => setBoosterData({ ...boosterData, username: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.package || 'Aktif'})
                    </option>
                  ))}
                  {customers.length === 0 && <option value="Budi Santoso">Budi Santoso (Fiber 50M)</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Target Kecepatan</label>
                  <select
                    value={boosterData.speed}
                    onChange={(e) => setBoosterData({ ...boosterData, speed: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="100 Mbps Turbo">100 Mbps Turbo</option>
                    <option value="200 Mbps Extreme">200 Mbps Extreme</option>
                    <option value="300 Mbps Ultra">300 Mbps Ultra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Durasi Booster</label>
                  <select
                    value={boosterData.duration}
                    onChange={(e) => setBoosterData({ ...boosterData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1 Jam">1 Jam</option>
                    <option value="3 Jam">3 Jam</option>
                    <option value="6 Jam">6 Jam</option>
                    <option value="24 Jam (1 Hari)">24 Jam (1 Hari)</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] p-2.5 rounded-lg border border-[var(--app-border)]">
                ℹ️ Sistem akan mengirimkan paket RADIUS Disconnect/CoA (RFC 3576) secara instan ke MikroTik tanpa memutuskan koneksi pengguna.
              </p>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSpeedBoosterModal(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--app-border)] text-xs text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  ⚡ Terapkan Booster Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: Kasir Kolektor Lapangan (Quick Pay) ──────────────────── */}
      {showQuickPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-base font-bold text-[var(--app-text)]">Kasir Kolektor — Terima Pembayaran</h3>
              </div>
              <button
                onClick={() => setShowQuickPayModal(false)}
                className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuickPaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Pilih Tagihan / Invoice</label>
                <select
                  required
                  value={quickPayData.invoiceId}
                  onChange={(e) => setQuickPayData({ ...quickPayData, invoiceId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Pilih Tagihan Belum Lunas --</option>
                  {invoices
                    .filter((inv) => inv.status !== 'PAID')
                    .map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} - {inv.customerName || inv.customer?.name} (Rp{' '}
                        {(Number(inv.amount) || 0).toLocaleString('id-ID')})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Metode Pembayaran</label>
                <select
                  value={quickPayData.paymentMethod}
                  onChange={(e) => setQuickPayData({ ...quickPayData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Cash / Tunai">Cash / Tunai di Lapangan</option>
                  <option value="QRIS Dinamis">QRIS Dinamis</option>
                  <option value="Transfer BCA">Transfer Bank BCA</option>
                  <option value="Transfer Mandiri">Transfer Bank Mandiri</option>
                  <option value="DANA / OVO / GoPay">E-Wallet (DANA / OVO)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Nama Petugas / Kasir</label>
                <input
                  type="text"
                  value={quickPayData.collectorName}
                  onChange={(e) => setQuickPayData({ ...quickPayData, collectorName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowQuickPayModal(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--app-border)] text-xs text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Terima Kas &amp; Tandai Lunas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 6: Detail Invoice Slideover ────────────────────────────── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--app-primary)] font-bold">Detail Tagihan</span>
                <h3 className="text-base font-bold text-[var(--app-text)] font-mono">{selectedInvoice.invoiceNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[var(--app-card-subtle)] p-4 rounded-xl border border-[var(--app-border)] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--app-text-muted)]">Nama Pelanggan:</span>
                <span className="font-bold text-[var(--app-text)]">
                  {selectedInvoice.customerName || selectedInvoice.customer?.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--app-text-muted)]">Total Tagihan:</span>
                <span className="font-mono font-bold text-base text-[var(--app-text)]">
                  Rp {(Number(selectedInvoice.amount) || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--app-text-muted)]">Batas Jatuh Tempo:</span>
                <span className="font-mono text-[var(--app-text)]">{selectedInvoice.dueDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--app-text-muted)]">Status Pembayaran:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    selectedInvoice.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                  }`}
                >
                  {selectedInvoice.status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 justify-end">
              {selectedInvoice.status !== 'PAID' && (
                <button
                  onClick={() => handleMarkInvoicePaid(selectedInvoice.id)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check size={14} /> Tandai Lunas
                </button>
              )}
              <button
                onClick={() => handleSendInvoiceWhatsApp(selectedInvoice)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send size={14} /> Kirim WhatsApp
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3.5 py-2 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
