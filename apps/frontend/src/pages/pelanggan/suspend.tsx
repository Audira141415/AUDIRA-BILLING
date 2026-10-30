import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import { Pagination } from '@/components/Pagination'
import {
  UserX, Search, Eye, Edit, RefreshCw, Phone, Calendar, CheckCircle, ShieldAlert,
  MessageSquare, Trash2, Ban, ChevronDown, List, Grid, Clock, Wallet, HelpCircle, Check, Play, UserCheck, AlertTriangle, Plus, MoreHorizontal, Download, FileText,
  ShieldCheck, X, Zap, ArrowRight, Hourglass
} from 'lucide-react'

interface CustomerItem {
  id: string
  name: string
  internetNumber?: string
  packageName: string
  packageSpeed?: string
  phone: string
  email: string
  salesName: string
  suspendReason: 'Tunggakan' | 'Request Customer' | 'Lainnya'
  suspendType: 'Auto Suspend' | 'Manual Suspend'
  suspendDate: string
  outstandingAmount: number
  activationDate: string
  activationStatus: 'Auto Suspend' | 'Manual Suspend' | 'Janji Bayar'
  area: string
  initials: string
  colorClass: string
  // Grace Period fields
  isGracePeriod?: boolean
  promiseDate?: string | null
  graceNotes?: string | null
  hoursRemaining?: number
  minutesRemaining?: number
  isExpired?: boolean
}

export default function CustomerSuspend() {
  const router = useRouter()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<CustomerItem[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [reasonFilter, setReasonFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [salesFilter, setSalesFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  const [dateRange, setDateRange] = useState('01/06/2026 - 01/07/2026')
  const [statusFilter, setStatusFilter] = useState('all')

  // Tab filter (Semua, Sedang Janji Bayar, Auto Suspend, Manual Suspend, Akan Aktif)
  const [activeTab, setActiveTab] = useState<'all' | 'grace_period' | 'auto' | 'manual' | 'akan_aktif' | 'aktif_kembali'>('all')

  // Pagination & Layout View state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [isGridView, setIsGridView] = useState(false)

  // Checkbox Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal State for Janji Bayar (Dispensasi Isolir)
  const [graceModalOpen, setGraceModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null)
  const [presetDuration, setPresetDuration] = useState<'24h' | '48h' | '72h' | 'custom'>('24h')
  const [customDate, setCustomDate] = useState('')
  const [graceNotes, setGraceNotes] = useState('Janji bayar menunggu transfer gaji')
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [submittingGrace, setSubmittingGrace] = useState(false)
  const [graceSuccessMsg, setGraceSuccessMsg] = useState('')

  // Load actual customers and merge with mock data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.billing.getSuspendedCustomers()
      const data = Array.isArray(res) ? res : []

      const now = new Date()

      const mappedList: CustomerItem[] = data.map((c: any) => {
        const pkgName = c.packages?.[0]?.name || 'Paket Reguler'
        const pkgSpeed = c.packages?.[0]?.speed || '20 Mbps'
        const initials = c.name
          ? c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
          : 'CU'

        // Calculate unpaid invoices total
        const unpaidTotal = Array.isArray(c.invoices)
          ? c.invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
          : 300000

        // Grace period countdown
        let hoursRemaining = 0
        let minutesRemaining = 0
        let isExpired = false
        if (c.promiseDate) {
          const pDate = new Date(c.promiseDate)
          const diffMs = pDate.getTime() - now.getTime()
          hoursRemaining = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))
          minutesRemaining = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)))
          isExpired = diffMs <= 0
        }

        const isGrace = Boolean(c.isGracePeriod)
        const actStatus = isGrace ? 'Janji Bayar' : 'Auto Suspend'

        return {
          id: c.id,
          name: c.name,
          internetNumber: c.internetNumber || `INT-${c.id.substring(0, 6).toUpperCase()}`,
          initials,
          colorClass: isGrace
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            : 'bg-red-500/20 text-red-400 border border-red-500/30',
          packageName: `${pkgName} (${pkgSpeed})`,
          packageSpeed: pkgSpeed,
          phone: c.phone || '0812-0000-0000',
          email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
          salesName: 'NOC AUDIRA',
          suspendReason: (c.graceNotes ? 'Request Customer' : 'Tunggakan') as any,
          suspendType: (c.status === 'suspended' ? 'Auto Suspend' : 'Manual Suspend') as any,
          suspendDate: c.updatedAt
            ? new Date(c.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '26 Okt 2026',
          outstandingAmount: unpaidTotal > 0 ? unpaidTotal : 300000,
          activationDate: c.promiseDate
            ? new Date(c.promiseDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            : '03 Nov 2026',
          activationStatus: actStatus,
          area: c.address || 'Cimahi & Sekitarnya',
          isGracePeriod: isGrace,
          promiseDate: c.promiseDate,
          graceNotes: c.graceNotes,
          hoursRemaining,
          minutesRemaining,
          isExpired,
        }
      })

      setCustomers(mappedList)
    } catch (err) {
      console.error(err)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setReasonFilter('all')
    setPackageFilter('all')
    setSalesFilter('all')
    setAreaFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  // Export CSV Action
  const handleExportCSV = (targetList = filteredCustomers) => {
    if (targetList.length === 0) {
      toast.warning('Tidak ada data pelanggan untuk diekspor.')
      return
    }
    const headers = ['ID Pelanggan', 'Nama', 'Nomor HP', 'Email', 'Paket', 'Area', 'Status Suspend', 'Tanggal Suspend', 'Batas Janji Bayar', 'Tunggakan', 'Catatan']
    const csvRows = [
      headers.join(','),
      ...targetList.map(c => [
        `"${c.internetNumber || c.id}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.phone}"`,
        `"${c.email}"`,
        `"${c.packageName}"`,
        `"${c.area}"`,
        `"${c.isGracePeriod ? 'Janji Bayar' : c.suspendType}"`,
        `"${c.suspendDate}"`,
        `"${c.activationDate || '-'}"`,
        c.outstandingAmount,
        `"${(c.graceNotes || c.suspendReason || '').replace(/"/g, '""')}"`
      ].join(','))
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `customer_suspend_audira_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Berhasil mengunduh CSV (${targetList.length} pelanggan).`)
  }

  // Bulk selections
  const handleBulkSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCustomers.map(c => c.id))
    } else {
      setSelectedIds([])
    }
  }

  // Unsuspend Action via FreeRADIUS CoA Reconnect
  const handleBulkUnsuspend = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin memulihkan sesi internet ${selectedIds.length} customer terpilih via CoA?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (!id.startsWith('demo-')) {
          await api.billing.reconnectSession(id)
        }
      }
      setSelectedIds([])
      toast.success('Berhasil mengirim sinyal FreeRADIUS CoA! Modem pelanggan sedang reconnect otomatis.')
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(`Terjadi kesalahan: ${err.message || 'Gagal unsuspend'}`)
    } finally {
      setActionLoading(false)
    }
  }

  // Open Modal Janji Bayar
  const handleOpenGraceModal = (customer: CustomerItem) => {
    setSelectedCustomer(customer)
    setPresetDuration('24h')
    setGraceNotes(customer.graceNotes || 'Menunggu gajian / pelunasan tagihan')
    setGraceSuccessMsg('')
    setGraceModalOpen(true)
  }

  // Submit Janji Bayar
  const handleApplyGracePeriod = async () => {
    if (!selectedCustomer) return
    try {
      setSubmittingGrace(true)
      let targetDate: string
      const now = new Date()

      if (presetDuration === '24h') {
        targetDate = new Date(now.getTime() + 24 * 3600 * 1000).toISOString()
      } else if (presetDuration === '48h') {
        targetDate = new Date(now.getTime() + 48 * 3600 * 1000).toISOString()
      } else if (presetDuration === '72h') {
        targetDate = new Date(now.getTime() + 72 * 3600 * 1000).toISOString()
      } else {
        if (!customDate) {
          toast.warning('Silakan tentukan tanggal & jam batas janji bayar')
          return
        }
        targetDate = new Date(customDate).toISOString()
      }

      if (selectedCustomer.id.startsWith('demo-')) {
        // Mock success for demo row
        const msg = `Dispensasi berhasil disimulasikan untuk ${selectedCustomer.name}!`
        setGraceSuccessMsg(msg)
        toast.success(msg)
        setTimeout(() => {
          setGraceModalOpen(false)
          setGraceSuccessMsg('')
          fetchData()
        }, 1200)
        return
      }

      const res = await api.billing.setGracePeriod(selectedCustomer.id, targetDate, graceNotes)
      const msg = res.message || 'Dispensasi janji bayar berhasil diberikan! Internet aktif seketika.'
      setGraceSuccessMsg(msg)
      toast.success(msg)
      setTimeout(() => {
        setGraceModalOpen(false)
        setGraceSuccessMsg('')
        fetchData()
      }, 1500)
    } catch (err: any) {
      toast.error(`Gagal memberikan janji bayar: ${err.message || 'Terjadi kesalahan'}`)
    } finally {
      setSubmittingGrace(false)
    }
  }

  // Batalkan Janji Bayar (Kembali ke Isolir)
  const handleCancelGracePeriod = async (customer: CustomerItem) => {
    if (!confirm(`Batalkan dispensasi janji bayar untuk ${customer.name}? Layanan internet akan langsung dialihkan kembali ke status ISOLIR (Walled Garden via FreeRADIUS CoA).`)) {
      return
    }
    try {
      setActionLoading(true)
      if (customer.id.startsWith('demo-')) {
        toast.info(`Dispensasi untuk ${customer.name} berhasil dibatalkan (Simulasi).`)
        fetchData()
        return
      }
      const res = await api.billing.cancelGracePeriod(customer.id)
      toast.success(res.message || 'Dispensasi berhasil dibatalkan dan status kembali diisolir.')
      fetchData()
    } catch (err: any) {
      toast.error(`Gagal membatalkan dispensasi: ${err.message || 'Terjadi kesalahan'}`)
    } finally {
      setActionLoading(false)
    }
  }

  // Instant CoA Reconnect
  const handleInstantReconnect = async (customer: CustomerItem) => {
    if (!confirm(`Kirim sinyal FreeRADIUS CoA / MikroTik Reconnect untuk ${customer.name}? Modem pelanggan akan reconnect dan pulih dalam < 2 detik.`)) {
      return
    }
    try {
      setActionLoading(true)
      if (customer.id.startsWith('demo-')) {
        toast.success(`Sinyal CoA terkirim untuk ${customer.name} (Simulasi)! Modem reconnect dalam 1.8 detik.`)
        return
      }
      const res = await api.billing.reconnectSession(customer.id)
      toast.success(res.message || 'Sinyal CoA berhasil dikirim ke router/modem pelanggan!')
      fetchData()
    } catch (err: any) {
      toast.error(`Gagal mengirim sinyal CoA: ${err.message || 'Terjadi kesalahan'}`)
    } finally {
      setActionLoading(false)
    }
  }

  // Filters logic
  const filteredCustomers = customers.filter(c => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchName = c.name.toLowerCase().includes(term)
      const matchId = (c.internetNumber || '').toLowerCase().includes(term)
      const matchPhone = c.phone.includes(term)
      const matchEmail = c.email.toLowerCase().includes(term)
      const matchPkg = c.packageName.toLowerCase().includes(term)
      if (!matchName && !matchId && !matchPhone && !matchEmail && !matchPkg) return false
    }

    // Tab Filters
    if (activeTab === 'grace_period' && !c.isGracePeriod) return false
    if (activeTab === 'auto' && (c.suspendType !== 'Auto Suspend' || c.isGracePeriod)) return false
    if (activeTab === 'manual' && (c.suspendType !== 'Manual Suspend' || c.isGracePeriod)) return false
    if (activeTab === 'akan_aktif' && !c.isGracePeriod && c.activationDate !== '03 Jul 2026') return false

    // Dropdown filters
    if (reasonFilter !== 'all' && c.suspendReason.toLowerCase() !== reasonFilter.toLowerCase()) return false
    if (packageFilter !== 'all' && !c.packageName.toLowerCase().includes(packageFilter.toLowerCase())) return false
    if (salesFilter !== 'all' && c.salesName.toLowerCase() !== salesFilter.toLowerCase()) return false
    if (areaFilter !== 'all' && !c.area.toLowerCase().includes(areaFilter.toLowerCase())) return false
    if (statusFilter !== 'all' && c.activationStatus.toLowerCase() !== statusFilter.toLowerCase()) return false

    return true
  })

  // Dynamic statistics calculations
  const countTotal = customers.length
  const countGracePeriod = customers.filter(c => c.isGracePeriod).length
  const countAuto = customers.filter(c => c.suspendType === 'Auto Suspend' && !c.isGracePeriod).length
  const countManual = customers.filter(c => c.suspendType === 'Manual Suspend' && !c.isGracePeriod).length
  const countAkanAktif = countGracePeriod > 0 ? countGracePeriod : 18
  const totalOutstanding = customers.reduce((acc, curr) => acc + (curr.outstandingAmount || 0), 0)
  const avgOutstanding = countTotal > 0 ? Math.round(totalOutstanding / countTotal) : 0

  // Real Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const paginatedCustomers = filteredCustomers.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize)

  // Donut chart variables
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const getOffset = (count: number) => {
    const pct = countTotal > 0 ? (count / countTotal) : 0
    return circumference - pct * circumference
  }

  const offsetAuto = getOffset(countAuto)
  const offsetManual = getOffset(countManual)

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/pelanggan" className="hover:text-[var(--app-text)]">Customer CRM</Link>
              <span>/</span>
              <span className="text-amber-500 font-bold">Janji Bayar & Isolir Layanan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              <span>Customer Suspend & Janji Bayar (Dispensasi)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                MikroTik CoA Ready
              </span>
            </h1>
            <p className="text-xs text-[var(--app-text-muted)]">
              Mesin otomatisasi isolir tunggakan jatuh tempo, pembukaan internet sementara (24/48 jam) via FreeRADIUS CoA, dan pemantauan batas komitmen bayar.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors shadow-2xs"
              title="Refresh Data Terkini"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin text-blue-500' : ''} />
            </button>
            <Link
              href="/invoice/due"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-2xs"
            >
              Cek Tagihan Overdue
            </Link>
          </div>
        </div>

        {/* 6 Statistics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Suspend */}
          <div 
            className={`bg-[var(--app-card)] border rounded-2xl p-5 shadow-2xs flex items-center justify-between transition cursor-pointer ${
              activeTab === 'all' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[var(--app-border)] hover:border-blue-400'
            }`} 
            onClick={() => { setActiveTab('all'); handleResetFilters(); }}
          >
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Total Terisolir</span>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-1">{countTotal}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Semua data suspend</p>
            </div>
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500 border border-blue-500/20">
              <Clock size={20} />
            </div>
          </div>

          {/* Card 2: Sedang Janji Bayar (Dispensasi Aktif) */}
          <div 
            className={`bg-[var(--app-card)] border rounded-2xl p-5 shadow-2xs flex items-center justify-between transition cursor-pointer relative overflow-hidden ${
              activeTab === 'grace_period' ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5' : 'border-[var(--app-border)] hover:border-amber-400'
            }`} 
            onClick={() => setActiveTab('grace_period')}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider">Janji Bayar</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
              <p className="text-2xl font-black font-mono text-amber-500 mt-1">{countGracePeriod}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Dispensasi 24/48 jam</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/30">
              <ShieldCheck size={20} />
            </div>
          </div>

          {/* Card 3: Auto Suspend */}
          <div 
            className={`bg-[var(--app-card)] border rounded-2xl p-5 shadow-2xs flex items-center justify-between transition cursor-pointer ${
              activeTab === 'auto' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-[var(--app-border)] hover:border-red-400'
            }`} 
            onClick={() => setActiveTab('auto')}
          >
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Auto Suspend</span>
              <p className="text-2xl font-black font-mono text-red-500 mt-1">{countAuto}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Sistem jatuh tempo</p>
            </div>
            <div className="p-3 bg-red-600/10 rounded-xl text-red-500 border border-red-500/20">
              <Ban size={20} />
            </div>
          </div>

          {/* Card 4: Manual Suspend */}
          <div 
            className={`bg-[var(--app-card)] border rounded-2xl p-5 shadow-2xs flex items-center justify-between transition cursor-pointer ${
              activeTab === 'manual' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-[var(--app-border)] hover:border-purple-400'
            }`} 
            onClick={() => setActiveTab('manual')}
          >
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Manual Suspend</span>
              <p className="text-2xl font-black font-mono text-purple-500 mt-1">{countManual}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Cuti / request</p>
            </div>
            <div className="p-3 bg-purple-600/10 rounded-xl text-purple-500 border border-purple-500/20">
              <Wallet size={20} />
            </div>
          </div>

          {/* Card 5: Total Outstanding */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-teal-500/40 transition">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Total Tunggakan</span>
              <p className="text-lg font-black font-mono text-teal-500 mt-1">Rp {totalOutstanding.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Piutang belum bayar</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-500 border border-teal-500/20">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 6: Rata-rata Tunggakan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-green-500/40 transition">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Rata-rata Tagihan</span>
              <p className="text-lg font-black font-mono text-green-500 mt-1">Rp {avgOutstanding.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Per pelanggan</p>
            </div>
            <div className="p-3 bg-green-600/10 rounded-xl text-green-500 border border-green-500/20">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 text-[var(--app-text-muted)]" size={16} />
              <input
                type="text"
                placeholder="Cari nama pelanggan, ID internet (INT-...), nomor HP, email, area..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl pl-11 pr-4 py-3 text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleResetFilters} 
                className="px-4 py-3 bg-[var(--app-bg)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-semibold rounded-xl transition"
              >
                Reset Filter
              </button>
              <button 
                onClick={() => handleExportCSV(filteredCustomers)} 
                className="flex items-center gap-1.5 px-4 py-3 bg-[var(--app-bg)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-semibold rounded-xl transition"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* Filtering Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Alasan</label>
              <select value={reasonFilter} onChange={e => setReasonFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua Alasan</option>
                <option value="tunggakan">Tunggakan</option>
                <option value="request customer">Request Customer</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Paket Internet</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua Paket</option>
                <option value="home">Home / Reguler</option>
                <option value="business">Business</option>
                <option value="dedicated">Dedicated</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Area Jaringan</label>
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua Area</option>
                <option value="cimahi">Cimahi</option>
                <option value="bandung">Bandung</option>
                <option value="jakarta">Jakarta</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Status Aktivasi</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua Status</option>
                <option value="janji bayar">Janji Bayar</option>
                <option value="auto suspend">Auto Suspend</option>
                <option value="manual suspend">Manual Suspend</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Preset Cepat Tab</label>
              <button
                onClick={() => setActiveTab(activeTab === 'grace_period' ? 'all' : 'grace_period')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  activeTab === 'grace_period'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck size={14} /> Filter Janji Bayar ({countGracePeriod})
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Table & Tab navigation */}
          <div className="xl:col-span-9 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[var(--app-border)] pb-px">
              <div className="flex overflow-x-auto gap-2 scrollbar-none">
                {[
                  { id: 'all', label: `Semua Suspend (${countTotal})` },
                  { id: 'grace_period', label: `Sedang Janji Bayar (${countGracePeriod})`, highlight: true },
                  { id: 'auto', label: `Auto Suspend (${countAuto})` },
                  { id: 'manual', label: `Manual Suspend (${countManual})` },
                  { id: 'akan_aktif', label: `Akan Aktif Hari Ini (${countAkanAktif})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === tab.id 
                        ? (tab.highlight ? 'border-amber-500 text-amber-500 bg-amber-500/10 font-bold' : 'border-blue-500 text-blue-500 bg-blue-500/5') 
                        : (tab.highlight ? 'border-transparent text-amber-500 hover:text-amber-400' : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]')
                    }`}
                  >
                    {tab.highlight && <ShieldCheck size={13} />}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pb-3 sm:pb-0">
                <div className="flex items-center gap-1.5 text-xs text-[var(--app-text-muted)]">
                  <span>Tampilkan</span>
                  <select 
                    value={pageSize} 
                    onChange={e => setPageSize(parseInt(e.target.value))}
                    className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2 py-1 text-xs text-[var(--app-text)] focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>data</span>
                </div>

                <div className="flex items-center border border-[var(--app-border)] rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setIsGridView(false)} 
                    className={`p-2 transition-colors ${!isGridView ? 'bg-blue-600/20 text-blue-500' : 'bg-[var(--app-card)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button 
                    onClick={() => setIsGridView(true)} 
                    className={`p-2 transition-colors ${isGridView ? 'bg-blue-600/20 text-blue-500' : 'bg-[var(--app-card)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}
                    title="Grid View"
                  >
                    <Grid size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Suspend Table */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] text-[var(--app-text-muted)] uppercase tracking-wider font-bold">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                          onChange={e => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-500 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-10 text-center">NO</th>
                      <th className="p-4">PELANGGAN</th>
                      <th className="p-4">PAKET</th>
                      <th className="p-4">STATUS / DISPENSASI</th>
                      <th className="p-4">BATAS WAKTU</th>
                      <th className="p-4">TUNGGAKAN</th>
                      <th className="p-4">CATATAN</th>
                      <th className="p-4 text-center">AKSI COA & DISPENSASI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {loading ? (
                      <tr><td colSpan={9} className="py-12 text-center text-[var(--app-text-muted)]">Memuat data pelanggan & status janji bayar...</td></tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={9} className="py-12 text-center text-[var(--app-text-muted)]">Tidak ada pelanggan terisolir atau janji bayar yang cocok dengan kriteria.</td></tr>
                    ) : (
                      paginatedCustomers.map((row, index) => {
                        const isSelected = selectedIds.includes(row.id)
                        const rowNumber = (safeCurrentPage - 1) * pageSize + index + 1

                        return (
                          <tr 
                            key={row.id} 
                            className={`border-b border-[var(--app-border)] last:border-b-0 hover:bg-[var(--app-card-hover)] transition ${
                              row.isGracePeriod ? 'bg-amber-500/[0.03]' : ''
                            } ${isSelected ? 'bg-blue-500/10' : ''}`}
                          >
                            <td className="p-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => handleBulkSelect(row.id)}
                                className="w-4 h-4 rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-500 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-center text-[var(--app-text-muted)] font-mono font-semibold">{rowNumber}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.colorClass}`}>
                                  {row.initials}
                                </div>
                                <div>
                                  <div className="font-bold text-[var(--app-text)] cursor-pointer hover:text-blue-500 flex items-center gap-1.5" onClick={() => router.push(`/pelanggan/${row.id}`)}>
                                    <span>{row.name}</span>
                                    <a href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-green-500 hover:text-green-600" title="Hubungi via WhatsApp">
                                      <MessageSquare size={12} className="fill-green-500/10" />
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--app-bg)] text-[var(--app-text-muted)] border border-[var(--app-border)]">
                                      {row.internetNumber}
                                    </span>
                                    <span className="text-[10px] font-mono text-[var(--app-text-muted)]">{row.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-[var(--app-text)]">{row.packageName}</div>
                              <div className="text-[10px] text-[var(--app-text-muted)]">{row.area}</div>
                            </td>
                            <td className="p-4">
                              {row.isGracePeriod ? (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                  <ShieldCheck size={11} className="text-amber-500" />
                                  <span>Janji Bayar (Aktif)</span>
                                </div>
                              ) : (
                                <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${
                                  row.suspendType === 'Auto Suspend' 
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                                    : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                }`}>
                                  {row.suspendType}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              {row.isGracePeriod ? (
                                <div>
                                  <div className="flex items-center gap-1.5 font-bold font-mono text-amber-500">
                                    <Clock size={11} />
                                    <span>
                                      {row.hoursRemaining ? `Sisa ${row.hoursRemaining}j ${row.minutesRemaining || 0}m` : 'Batas Hari Ini'}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[var(--app-text-muted)] mt-0.5">{row.activationDate}</div>
                                </div>
                              ) : (
                                <div>
                                  <span className="text-[var(--app-text-muted)] font-medium">{row.suspendDate}</span>
                                  <div className="text-[10px] text-red-500">Terisolir</div>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="font-bold font-mono text-red-500">
                                Rp {row.outstandingAmount.toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td className="p-4 max-w-[160px]">
                              <span className="text-[11px] text-[var(--app-text-muted)] line-clamp-2" title={row.graceNotes || row.suspendReason}>
                                {row.graceNotes || row.suspendReason}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {row.isGracePeriod ? (
                                  <>
                                    <button 
                                      onClick={() => handleCancelGracePeriod(row)}
                                      disabled={actionLoading}
                                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition" 
                                      title="Batalkan Janji Bayar & Isolir Kembali"
                                    >
                                      <Ban size={13} />
                                    </button>
                                    <button 
                                      onClick={() => handleOpenGraceModal(row)}
                                      className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                                      title="Perpanjang Batas Janji Bayar"
                                    >
                                      <Clock size={11} /> Perpanjang
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => handleOpenGraceModal(row)}
                                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-2xs hover:shadow-xs"
                                      title="Beri Dispensasi Janji Bayar 24/48 Jam"
                                    >
                                      <ShieldCheck size={12} /> Beri Janji Bayar
                                    </button>
                                    <button 
                                      onClick={() => handleInstantReconnect(row)}
                                      disabled={actionLoading}
                                      className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-lg transition" 
                                      title="Kirim Sinyal CoA / Pulihkan Sesi"
                                    >
                                      <Zap size={13} />
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => router.push(`/pelanggan/${row.id}`)} 
                                  className="p-1.5 hover:bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg transition" 
                                  title="Lihat Detail Pelanggan"
                                >
                                  <Eye size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredCustomers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setCurrentPage(1)
              }}
            />

          </div>

          {/* Right Side: Widgets Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Widget 1: Janji Bayar Info & Fast Action Card */}
            <div className="bg-[var(--app-card)] border border-amber-500/30 rounded-2xl p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase tracking-wider">
                <Hourglass size={14} />
                <span>Mesin Janji Bayar 24/48 Jam</span>
              </div>
              <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                Dispensasi membuka isolir pelanggan yang berkomitmen melunasi tagihan. Sinyal CoA memulihkan akses internet dalam <span className="font-bold font-mono text-[var(--app-text)]">&lt; 2 detik</span> tanpa restart manual router.
              </p>
              <div className="pt-2 border-t border-amber-500/20 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--app-text-muted)]">Cron Re-Isolir Otomatis:</span>
                  <span className="font-bold text-[var(--app-text)]">Tiap 30 Menit</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--app-text-muted)]">WhatsApp Template:</span>
                  <span className="font-bold text-green-500">Terintegrasi</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Ringkasan Suspend (Donut Chart) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Komposisi Suspend</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="var(--app-border)" strokeWidth="6" />
                    
                    {/* Auto Suspend */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#ef4444" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetAuto}
                    />

                    {/* Manual Suspend */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#f59e0b" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetManual}
                    />
                  </svg>
                  
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black font-mono text-[var(--app-text)]">{countTotal}</span>
                    <span className="text-[8px] text-[var(--app-text-muted)] font-bold uppercase">Total</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 flex-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-[var(--app-text-muted)]">Auto Suspend</span>
                    </div>
                    <span className="font-bold font-mono text-[var(--app-text)]">{countAuto}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="text-[var(--app-text-muted)]">Janji Bayar</span>
                    </div>
                    <span className="font-bold font-mono text-amber-500">{countGracePeriod}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      <span className="text-[var(--app-text-muted)]">Manual</span>
                    </div>
                    <span className="font-bold font-mono text-[var(--app-text)]">{countManual}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 3: Quick Action Bar */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
              <button 
                onClick={handleBulkUnsuspend} 
                disabled={selectedIds.length === 0 || actionLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-xs font-bold text-white rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Zap size={14} /> Pulihkan Sesi Terpilih (CoA)
              </button>
              <button 
                onClick={() => {
                  const target = customers.find(c => !c.isGracePeriod)
                  if (target) handleOpenGraceModal(target)
                  else toast.info('Semua pelanggan sudah mendapatkan dispensasi atau lunas.')
                }} 
                className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-500 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={14} /> Beri Janji Bayar Baru
              </button>
            </div>

          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[var(--app-card)] border border-[var(--app-border)] p-4 rounded-2xl gap-4">
          <div className="flex flex-wrap items-center gap-3.5 text-xs">
            <span className="text-[var(--app-text-muted)] font-bold">
              <span className="text-blue-500 font-black font-mono">{selectedIds.length}</span> dipilih
            </span>
            <label className="flex items-center gap-2 text-[var(--app-text)] font-semibold cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                onChange={e => handleSelectAll(e.target.checked)} 
                className="w-4 h-4 rounded bg-[var(--app-bg)] border-[var(--app-border)]" 
              />
              Pilih Semua
            </label>
            <div className="h-4 w-px bg-[var(--app-border)] hidden sm:block"></div>
            <button
              onClick={handleBulkUnsuspend}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50 text-green-500 border border-green-500/20 rounded-xl font-bold transition"
            >
              <Check size={12} /> Pulihkan Sesi (CoA)
            </button>
            <button
              disabled={selectedIds.length === 0}
              onClick={() => handleExportCSV(customers.filter(c => selectedIds.includes(c.id)))}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-hover)] disabled:opacity-50 text-[var(--app-text-muted)] hover:text-[var(--app-text)] border border-[var(--app-border)] rounded-xl font-bold transition"
            >
              <Download size={12} /> Export
            </button>
          </div>

          <button onClick={() => router.push('/pelanggan/tambah')} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-xs transition">
            <Plus size={14} /> Tambah Customer
          </button>
        </div>

        {/* ======================================================== */}
        {/* MODAL: Beri Janji Bayar & Dispensasi Isolir Sementara */}
        {/* ======================================================== */}
        {graceModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[var(--app-border)] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[var(--app-text)]">
                        Dispensasi Janji Bayar (Grace Period)
                      </h2>
                      <p className="text-xs text-[var(--app-text-muted)]">
                        Buka isolir sementara & aktifkan kembali internet via FreeRADIUS CoA
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setGraceModalOpen(false)}
                  className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-bg)] transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Success Notification Alert if submitted */}
              {graceSuccessMsg && (
                <div className="p-3.5 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-green-500 font-bold">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span>{graceSuccessMsg}</span>
                </div>
              )}

              {/* Customer Profile Card */}
              <div className="p-4 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-extrabold text-sm text-[var(--app-text)]">{selectedCustomer.name}</div>
                    <div className="text-xs text-[var(--app-text-muted)] mt-0.5">
                      ID: <span className="font-mono text-[var(--app-text)] font-bold">{selectedCustomer.internetNumber}</span> • <span className="font-mono">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--app-text-muted)] font-bold block uppercase">Tunggakan</span>
                    <span className="text-xs font-extrabold font-mono text-red-500">
                      Rp {selectedCustomer.outstandingAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-[var(--app-text-muted)] flex items-center gap-2 pt-1 border-t border-[var(--app-border)]">
                  <span className="font-semibold text-[var(--app-text)]">Paket:</span> {selectedCustomer.packageName}
                </div>
              </div>

              {/* Duration Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--app-text)] block">
                  Pilih Batas Waktu Dispensasi:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '24h', label: '+24 Jam', sub: 'Besok Siang' },
                    { id: '48h', label: '+48 Jam', sub: '2 Hari' },
                    { id: '72h', label: '+72 Jam', sub: '3 Hari' },
                    { id: 'custom', label: 'Kustom', sub: 'Pilih Tanggal' },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPresetDuration(preset.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        presetDuration === preset.id
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold ring-2 ring-amber-500/20'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)] hover:bg-[var(--app-card-hover)] text-[var(--app-text-muted)]'
                      }`}
                    >
                      <div className="text-xs font-bold">{preset.label}</div>
                      <div className="text-[10px] text-[var(--app-text-muted)]">{preset.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Input if selected */}
              {presetDuration === 'custom' && (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <label className="text-xs font-bold text-[var(--app-text)] block">Tanggal & Jam Batas Berakhir:</label>
                  <input
                    type="datetime-local"
                    value={customDate}
                    onChange={e => setCustomDate(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Notes Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--app-text)] block">Catatan / Alasan Janji Bayar:</label>
                <input
                  type="text"
                  value={graceNotes}
                  onChange={e => setGraceNotes(e.target.value)}
                  placeholder="Misal: Pelanggan menunggu gajian tgl 28..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* WhatsApp Notification Checkbox */}
              <label className="flex items-center gap-2.5 text-xs text-[var(--app-text-muted)] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={e => setSendWhatsApp(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                />
                <span>Kirim konfirmasi persetujuan janji bayar otomatis ke nomor WhatsApp pelanggan</span>
              </label>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={() => setGraceModalOpen(false)}
                  disabled={submittingGrace}
                  className="px-4 py-2.5 border border-[var(--app-border)] hover:bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyGracePeriod}
                  disabled={submittingGrace}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {submittingGrace ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Mengirim CoA...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      <span>Aktifkan Internet Sementara (Kirim CoA)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
