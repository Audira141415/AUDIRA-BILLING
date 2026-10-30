import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import { Pagination } from '@/components/Pagination'
import { useToast } from '@/contexts/ToastContext'
import {
  TimerOff, Search, Eye, Edit, RefreshCw, Calendar, CheckCircle,
  MessageSquare, Trash2, ChevronDown, List, Grid, Wallet, Check, Plus, MoreHorizontal, Download
} from 'lucide-react'

interface ExpiredCustomer {
  id: string
  name: string
  packageName: string
  phone: string
  email: string
  salesName: string
  expiredDate: string
  daysExpired: number
  outstandingAmount: number
  lastPaymentDate: string
  status: 'Expired'
  area: string
  initials: string
  colorClass: string
}

export default function CustomerExpired() {
  const router = useRouter()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<ExpiredCustomer[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [packageFilter, setPackageFilter] = useState('all')
  const [salesFilter, setSalesFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  const [dateRange, setDateRange] = useState('01/06/2026 - 01/07/2026')
  const [durationFilter, setDurationFilter] = useState('all')
  const [outstandingFilter, setOutstandingFilter] = useState('all')

  // Tab filter (Semua, Expired Bulan Ini, Expired > 30 Hari, Expired > 60 Hari)
  const [activeTab, setActiveTab] = useState<'all' | 'bulan_ini' | 'over_30' | 'over_60'>('all')

  // Pagination & Layout View state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [isGridView, setIsGridView] = useState(false)

  // Checkbox Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Load actual customers
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.pelanggan.getAll()
      const dbExpired = Array.isArray(data)
        ? data.filter((c: any) => c.status === 'expired' || c.status === 'inactive').map((c: any) => {
            const pkgName = c.packages?.[0]?.name || 'Home 20 Mbps'
            return {
              id: c.id,
              name: c.name,
              initials: c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
              colorClass: 'bg-blue-600/20 text-blue-500 border border-blue-500/30',
              packageName: pkgName,
              phone: c.phone || '0812-0000-0000',
              email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
              salesName: 'Budi Santoso',
              expiredDate: c.updatedAt
                ? new Date(c.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                : '-',
              daysExpired: 11,
              outstandingAmount: Array.isArray(c.invoices)
                ? c.invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
                : 0,
              lastPaymentDate: '-',
              status: 'Expired' as const,
              area: c.address || 'Cimahi Selatan'
            }
          })
        : []
      setCustomers(dbExpired)
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
    setPackageFilter('all')
    setSalesFilter('all')
    setAreaFilter('all')
    setDurationFilter('all')
    setOutstandingFilter('all')
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

  // Reactivate / Aktifkan Kembali Action
  const handleBulkReactivate = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin mengaktifkan kembali ${selectedIds.length} customer expired terpilih?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (id.length > 5) {
          await api.pelanggan.update(id, { status: 'active' })
        }
      }

      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      toast.success('Berhasil mengaktifkan kembali customer terpilih.', 'Re-Aktivasi Berhasil')
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat memproses aktivasi kembali.', 'Gagal Re-Aktivasi')
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data customer expired terpilih?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (id.length > 5) {
          await api.pelanggan.delete(id)
        }
      }
      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      toast.success('Data terpilih berhasil dihapus.', 'Data Dihapus')
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error('Gagal menghapus data terpilih.', 'Kesalahan')
    } finally {
      setActionLoading(false)
    }
  }

  // Filters logic
  const filteredCustomers = customers.filter(c => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchName = c.name.toLowerCase().includes(term)
      const matchPhone = c.phone.includes(term)
      const matchEmail = c.email.toLowerCase().includes(term)
      const matchPkg = c.packageName.toLowerCase().includes(term)
      if (!matchName && !matchPhone && !matchEmail && !matchPkg) return false
    }

    // Tab Filters
    if (activeTab === 'bulan_ini' && c.daysExpired > 30) return false
    if (activeTab === 'over_30' && (c.daysExpired <= 30 || c.daysExpired > 60)) return false
    if (activeTab === 'over_60' && c.daysExpired <= 60) return false

    // Dropdown filters
    if (packageFilter !== 'all' && c.packageName.toLowerCase() !== packageFilter.toLowerCase()) return false
    if (salesFilter !== 'all' && c.salesName.toLowerCase() !== salesFilter.toLowerCase()) return false
    if (areaFilter !== 'all' && !c.area.toLowerCase().includes(areaFilter.toLowerCase())) return false

    // Duration filter
    if (durationFilter !== 'all') {
      if (durationFilter === 'short' && c.daysExpired > 30) return false
      if (durationFilter === 'medium' && (c.daysExpired <= 30 || c.daysExpired > 60)) return false
      if (durationFilter === 'long' && c.daysExpired <= 60) return false
    }

    // Outstanding filter
    if (outstandingFilter !== 'all') {
      if (outstandingFilter === 'none' && c.outstandingAmount > 0) return false
      if (outstandingFilter === 'exist' && c.outstandingAmount === 0) return false
    }

    return true
  })

  // Dynamic statistics calculations
  const countTotal = customers.length
  const countBulanIni = customers.filter(c => c.daysExpired <= 30).length
  const countOver30 = customers.filter(c => c.daysExpired > 30 && c.daysExpired <= 60).length
  const countOver60 = customers.filter(c => c.daysExpired > 60).length
  const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstandingAmount || 0), 0)
  const avgOutstanding = countTotal > 0 ? Math.round(totalOutstanding / countTotal) : 0

  // Donut chart variables
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const getOffset = (count: number) => {
    const pct = countTotal > 0 ? (count / countTotal) : 0
    return circumference - pct * circumference
  }

  const offsetBulanIni = getOffset(countBulanIni)
  const offsetOver30 = getOffset(countOver30)
  const offsetOver60 = getOffset(countOver60)

  const formatPct = (count: number) => {
    if (countTotal === 0) return '0%'
    return `${((count / countTotal) * 100).toFixed(1)}%`
  }

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCustomers = filteredCustomers.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/pelanggan" className="hover:text-[var(--app-text)]">Customer CRM</Link>
              <span>/</span>
              <span className="text-rose-500">Customer Expired (Non-Aktif)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              Customer Expired & Berhenti Berlangganan
            </h1>
            <p className="text-xs text-[var(--app-text-muted)]">
              Daftar pelanggan yang masa aktif layanannya telah berakhir atau berhenti berlangganan (churn).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              href="/whatsapp/campaigns"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Kirim Promo Re-Aktivasi
            </Link>
          </div>
        </div>

        {/* 6 Statistics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Expired */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-500/40 transition cursor-pointer" onClick={() => { setActiveTab('all'); handleResetFilters(); }}>
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Total Expired</span>
              <p className="text-2xl font-black font-mono tabular-nums text-[var(--app-text)] mt-1">{countTotal}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Semua customer expired</p>
            </div>
            <div className="p-3 bg-purple-600/10 rounded-xl text-purple-500 border border-purple-500/20">
              <TimerOff size={20} />
            </div>
          </div>

          {/* Card 2: Expired Bulan Ini */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-red-500/40 transition cursor-pointer" onClick={() => setActiveTab('bulan_ini')}>
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Expired Bulan Ini</span>
              <p className="text-2xl font-black font-mono tabular-nums text-red-500 mt-1">{countBulanIni}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Expired bulan ini</p>
            </div>
            <div className="p-3 bg-red-600/10 rounded-xl text-red-500 border border-red-500/20">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 3: Expired > 30 Hari */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-orange-500/40 transition cursor-pointer" onClick={() => setActiveTab('over_30')}>
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Expired &gt; 30 Hari</span>
              <p className="text-2xl font-black font-mono tabular-nums text-orange-500 mt-1">{countOver30}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Expired lebih dari 30 hari</p>
            </div>
            <div className="p-3 bg-orange-600/10 rounded-xl text-orange-500 border border-orange-500/20">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 4: Expired > 60 Hari */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-amber-500/40 transition cursor-pointer" onClick={() => setActiveTab('over_60')}>
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Expired &gt; 60 Hari</span>
              <p className="text-2xl font-black font-mono tabular-nums text-amber-500 mt-1">{countOver60}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Expired lebih dari 60 hari</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 5: Rata-rata Tunggakan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-teal-500/40 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Rata-rata Tunggakan</span>
              <p className="text-lg font-black font-mono tabular-nums text-teal-500 mt-1">Rp {avgOutstanding.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Per customer</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-500 border border-teal-500/20">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 6: Total Tunggakan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-emerald-500/40 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Total Tunggakan</span>
              <p className="text-lg font-black font-mono tabular-nums text-emerald-500 mt-1">Rp {totalOutstanding.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-[var(--app-text-muted)]">Semua customer expired</p>
            </div>
            <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-500 border border-emerald-500/20">
              <Wallet size={20} />
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
                placeholder="Cari nama, no. hp, email, paket, area..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl pl-11 pr-4 py-3 text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button onClick={handleResetFilters} className="px-4 py-3 bg-[var(--app-card)] hover:bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-semibold rounded-xl transition">
                Reset
              </button>
              <button onClick={() => toast.info('Mengekspor daftar pelanggan expired ke CSV...', 'Export Data')} className="flex items-center gap-1.5 px-4 py-3 bg-[var(--app-card)] hover:bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-semibold rounded-xl transition">
                Export <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Filtering Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Paket</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua Paket</option>
                <option value="home 20 mbps">Home 20 Mbps</option>
                <option value="home 50 mbps">Home 50 Mbps</option>
                <option value="business 100 mbps">Business 100 Mbps</option>
                <option value="dedicated 200 mbps">Dedicated 200 Mbps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Sales</label>
              <select value={salesFilter} onChange={e => setSalesFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua Sales</option>
                <option value="budi santoso">Budi Santoso</option>
                <option value="dewi lestari">Dewi Lestari</option>
                <option value="rina marlina">Rina Marlina</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Area</label>
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua Area</option>
                <option value="cimahi selatan">Cimahi Selatan</option>
                <option value="cimahi utara">Cimahi Utara</option>
                <option value="cimahi tengah">Cimahi Tengah</option>
                <option value="bandung barat">Bandung Barat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Tanggal Expired</label>
              <input
                type="text"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Lama Expired</label>
              <select value={durationFilter} onChange={e => setDurationFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="short">&lt; 30 Hari</option>
                <option value="medium">30 - 60 Hari</option>
                <option value="long">&gt; 60 Hari</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[var(--app-text-muted)] font-bold block">Tunggakan</label>
              <select value={outstandingFilter} onChange={e => setOutstandingFilter(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="none">Tidak Ada</option>
                <option value="exist">Ada Tunggakan</option>
              </select>
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
                  { id: 'all', label: `Semua Expired (${countTotal})` },
                  { id: 'bulan_ini', label: `Expired Bulan Ini (${countBulanIni})` },
                  { id: 'over_30', label: `Expired > 30 Hari (${countOver30})` },
                  { id: 'over_60', label: `Expired > 60 Hari (${countOver60})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id 
                        ? 'border-blue-500 text-blue-500 bg-blue-500/5' 
                        : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
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

            {/* Expired Table */}
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
                      <th className="p-4">SALES</th>
                      <th className="p-4">TANGGAL EXPIRED</th>
                      <th className="p-4">LAMA EXPIRED</th>
                      <th className="p-4">TUNGGAKAN</th>
                      <th className="p-4">TERAKHIR DIBAYAR</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {loading ? (
                      <tr><td colSpan={11} className="py-12 text-center text-[var(--app-text-muted)]">Memuat data customer expired...</td></tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={11} className="py-12 text-center text-[var(--app-text-muted)]">Tidak ada data customer expired yang cocok.</td></tr>
                    ) : (
                      paginatedCustomers.map((row, index) => {
                        const isSelected = selectedIds.includes(row.id)
                        const badgeColor = 'bg-red-500/10 text-red-500 border border-red-500/20'

                        return (
                          <tr 
                            key={row.id} 
                            className={`hover:bg-[var(--app-bg)]/60 transition ${
                              isSelected ? 'bg-blue-600/5' : ''
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => handleBulkSelect(row.id)}
                                className="w-4 h-4 rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-500 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-center text-[var(--app-text-muted)] font-semibold">{index + 1}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.colorClass}`}>
                                  {row.initials}
                                </div>
                                <div>
                                  <div className="font-bold text-[var(--app-text)] cursor-pointer hover:text-blue-500 flex items-center gap-1.5" onClick={() => router.push(`/pelanggan/${row.id}`)}>
                                    <span>{row.name}</span>
                                    <a href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-emerald-500 hover:text-emerald-400">
                                      <MessageSquare size={12} className="fill-emerald-500/10" />
                                    </a>
                                  </div>
                                  <div className="text-[10px] text-[var(--app-text-muted)] font-mono">{row.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-[var(--app-text)] font-semibold">{row.packageName}</td>
                            <td className="p-4 text-[var(--app-text-muted)] font-semibold">{row.salesName}</td>
                            <td className="p-4 text-[var(--app-text-muted)] font-medium">{row.expiredDate}</td>
                            <td className="p-4 text-[var(--app-text)] font-bold font-mono">{row.daysExpired} Hari</td>
                            <td className={`p-4 font-bold font-mono ${row.outstandingAmount > 0 ? 'text-red-500' : 'text-[var(--app-text-muted)]'}`}>
                              {row.outstandingAmount > 0 ? `Rp ${row.outstandingAmount.toLocaleString('id-ID')}` : 'Rp 0'}
                            </td>
                            <td className="p-4 text-[var(--app-text-muted)] font-medium">{row.lastPaymentDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${badgeColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1.5 hover:bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded transition" title="Lihat Detail">
                                  <Eye size={13} />
                                </button>
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1.5 hover:bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-blue-500 rounded transition" title="Edit Data">
                                  <Edit size={13} />
                                </button>
                                <button onClick={() => toast.info('Opsi tindakan: Kirim Notifikasi, Re-Aktivasi Layanan, atau Cetak Bukti.', 'Menu Tindakan')} className="p-1.5 hover:bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded transition" title="Opsi Lainnya">
                                  <MoreHorizontal size={13} />
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
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />

          </div>

          {/* Right Side: Widgets Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Widget 1: Ringkasan Expired (Donut Chart) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Ringkasan Expired</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="var(--app-border)" strokeWidth="6" />
                    
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#ef4444" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetBulanIni}
                    />

                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#f59e0b" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetOver30}
                    />

                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#eab308" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetOver60}
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
                      <span className="text-[var(--app-text-muted)]">Bulan Ini</span>
                    </div>
                    <span className="font-bold font-mono text-[var(--app-text)]">{countBulanIni} <span className="text-[8px] text-[var(--app-text-muted)] font-normal">({formatPct(countBulanIni)})</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      <span className="text-[var(--app-text-muted)]">&gt; 30 Hari</span>
                    </div>
                    <span className="font-bold font-mono text-[var(--app-text)]">{countOver30} <span className="text-[8px] text-[var(--app-text-muted)] font-normal">({formatPct(countOver30)})</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      <span className="text-[var(--app-text-muted)]">&gt; 60 Hari</span>
                    </div>
                    <span className="font-bold font-mono text-[var(--app-text)]">{countOver60} <span className="text-[8px] text-[var(--app-text-muted)] font-normal">({formatPct(countOver60)})</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Alasan Expired */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Alasan Expired</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Telat pembayaran', value: countBulanIni, pct: countTotal > 0 ? `${Math.round((countBulanIni / countTotal) * 100)}%` : '0%', color: 'bg-red-500' },
                  { label: 'Request stop layanan', value: countOver30, pct: countTotal > 0 ? `${Math.round((countOver30 / countTotal) * 100)}%` : '0%', color: 'bg-orange-500' },
                  { label: 'Pindah provider / lainnya', value: countOver60, pct: countTotal > 0 ? `${Math.round((countOver60 / countTotal) * 100)}%` : '0%', color: 'bg-blue-500' }
                ].map(src => (
                  <div key={src.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[var(--app-text-muted)] font-bold">{src.label}</span>
                      <span className="text-[var(--app-text)] font-bold font-mono">{src.value} <span className="text-[8px] text-[var(--app-text-muted)] font-normal">({src.pct})</span></span>
                    </div>
                    <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${src.color}`} style={{ width: src.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Rekomendasi */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Rekomendasi Retensi</h3>
              <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed">
                Kirim penawaran spesial win-back untuk pelanggan expired lebih dari 30 hari melalui WhatsApp Broadcast.
              </p>
              <button onClick={() => toast.info('Membuka formulir pembuatan penawaran diskon re-aktivasi...', 'Program Win-Back')} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl transition shadow-xs">
                Buat Penawaran
              </button>
            </div>

            {/* Widget 4: Tunggakan Expired */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Tunggakan Expired</h3>
              <div className="space-y-3.5">
                <div>
                  <div className="text-[10px] text-[var(--app-text-muted)] font-bold">Total Tunggakan</div>
                  <div className="text-lg font-black font-mono text-[var(--app-text)] mt-0.5">Rp {totalOutstanding.toLocaleString('id-ID')}</div>
                </div>
                <div className="border-t border-[var(--app-border)] pt-3">
                  <div className="text-[10px] text-[var(--app-text-muted)] font-bold">Rata-rata per Customer</div>
                  <div className="text-sm font-extrabold font-mono text-[var(--app-text-muted)] mt-0.5">Rp {avgOutstanding.toLocaleString('id-ID')}</div>
                </div>
              </div>
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
              onClick={() => toast.info(`Menyiapkan broadcast WhatsApp untuk ${selectedIds.length} pelanggan...`, 'WhatsApp Gateway')}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--app-bg)] hover:border-blue-500/40 disabled:opacity-50 text-[var(--app-text)] border border-[var(--app-border)] rounded-xl font-bold transition"
            >
              <MessageSquare size={12} /> Kirim WhatsApp
            </button>
            <button
              onClick={handleBulkReactivate}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold transition"
            >
              <Check size={12} /> Aktifkan Kembali
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--app-bg)] hover:bg-red-500/10 disabled:opacity-50 text-[var(--app-text-muted)] hover:text-red-500 border border-[var(--app-border)] rounded-xl font-bold transition"
            >
              <Trash2 size={12} /> Hapus Expired
            </button>
            <button
              onClick={() => toast.info(`Mengekspor ${selectedIds.length} data terpilih ke CSV...`, 'Export Data')}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--app-bg)] hover:border-blue-500/40 disabled:opacity-50 text-[var(--app-text)] border border-[var(--app-border)] rounded-xl font-bold transition"
            >
              <Download size={12} /> Export
            </button>
          </div>

          <button onClick={() => router.push('/pelanggan/tambah')} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-xs transition">
            <Plus size={14} /> Tambah Customer
          </button>
        </div>

      </div>
    </Layout>
  )
}
