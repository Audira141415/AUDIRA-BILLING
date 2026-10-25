import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import {
  UserX, Search, Eye, Edit, RefreshCw, Phone, Calendar, CheckCircle, ShieldAlert,
  MessageSquare, Trash2, Ban, ChevronDown, List, Grid, Clock, Wallet, HelpCircle, Check, Play, UserCheck, AlertTriangle, Plus, MoreHorizontal, Download, FileText
} from 'lucide-react'

interface SuspendedCustomer {
  id: string
  name: string
  packageName: string
  phone: string
  email: string
  salesName: string
  suspendReason: 'Tunggakan' | 'Request Customer' | 'Lainnya'
  suspendType: 'Auto Suspend' | 'Manual Suspend'
  suspendDate: string
  outstandingAmount: number
  activationDate: string
  activationStatus: 'Auto Suspend' | 'Manual Suspend'
  area: string
  initials: string
  colorClass: string
}

const INITIAL_SUSPEND_DATA: SuspendedCustomer[] = []

export default function CustomerSuspend() {
  const router = useRouter()
  const [customers, setCustomers] = useState<SuspendedCustomer[]>([])
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

  // Tab filter (Semua, Auto Suspend, Manual Suspend, Akan Aktif)
  const [activeTab, setActiveTab] = useState<'all' | 'auto' | 'manual' | 'akan_aktif' | 'aktif_kembali'>('all')

  // Pagination & Layout View state
  const [pageSize, setPageSize] = useState(25)
  const [isGridView, setIsGridView] = useState(false)

  // Checkbox Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Load actual customers and merge with mock data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.pelanggan.getAll()
      const dbSuspended = Array.isArray(data)
        ? data.filter((c: any) => c.status === 'suspended').map((c: any) => {
            const pkgName = c.packages?.[0]?.name || 'Home 20 Mbps'
            return {
              id: c.id,
              name: c.name,
              initials: c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
              colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
              packageName: pkgName,
              phone: c.phone || '0812-0000-0000',
              email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
              salesName: 'Budi Santoso',
              suspendReason: 'Tunggakan' as const,
              suspendType: 'Auto Suspend' as const,
              suspendDate: '28 Jun 2026 10:30',
              outstandingAmount: 250000,
              activationDate: '03 Jul 2026',
              activationStatus: 'Auto Suspend' as const,
              area: 'Cimahi Selatan'
            }
          })
        : []
      setCustomers(dbSuspended)
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

  // Unsuspend Action (Aktifkan)
  const handleBulkUnsuspend = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin mengaktifkan kembali ${selectedIds.length} customer terpilih?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (id.length > 5) {
          await api.keuangan.unsuspendCustomer(id)
        }
      }

      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      alert('Berhasil mengaktifkan kembali customer terpilih.')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat memproses unsuspend.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data customer suspend terpilih?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (id.length > 5) {
          await api.pelanggan.delete(id)
        }
      }
      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      alert('Data terpilih berhasil dihapus.')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data terpilih.')
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
    if (activeTab === 'auto' && c.suspendType !== 'Auto Suspend') return false
    if (activeTab === 'manual' && c.suspendType !== 'Manual Suspend') return false
    if (activeTab === 'akan_aktif' && c.activationDate !== '03 Jul 2026') return false // Mock filter

    // Dropdown filters
    if (reasonFilter !== 'all' && c.suspendReason.toLowerCase() !== reasonFilter.toLowerCase()) return false
    if (packageFilter !== 'all' && c.packageName.toLowerCase() !== packageFilter.toLowerCase()) return false
    if (salesFilter !== 'all' && c.salesName.toLowerCase() !== salesFilter.toLowerCase()) return false
    if (areaFilter !== 'all' && c.area.toLowerCase() !== areaFilter.toLowerCase()) return false
    if (statusFilter !== 'all' && c.activationStatus.toLowerCase() !== statusFilter.toLowerCase()) return false

    return true
  })

  // Dynamic statistics calculations
  const countTotal = customers.length
  const countAuto = customers.filter(c => c.suspendType === 'Auto Suspend').length
  const countManual = customers.filter(c => c.suspendType === 'Manual Suspend').length
  const countAkanAktif = 18 // Mock statistic matching design
  const totalOutstanding = 125430000 // Rp 125.430.000
  const avgOutstanding = 402017 // Rp 402.017

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
      <div className="min-h-screen bg-slate-50 text-slate-800 p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/pelanggan" className="hover:text-[var(--app-text)]">Customer CRM</Link>
              <span>/</span>
              <span className="text-amber-400">Customer Suspend (Isolir)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              Customer Suspend (Isolir Layanan)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar pelanggan terisolir karena tunggakan tagihan jatuh tempo atau permintaan cuti sementara.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              href="/invoice/due"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Cek Tagihan Overdue
            </Link>
          </div>
        </div>

        {/* 6 Statistics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Suspend */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-blue-500/35 transition cursor-pointer" onClick={() => { setActiveTab('all'); handleResetFilters(); }}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Suspend</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{countTotal}</p>
              <p className="text-[10px] text-slate-500">Semua data suspend</p>
            </div>
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Clock size={20} />
            </div>
          </div>

          {/* Card 2: Auto Suspend */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-orange-500/35 transition cursor-pointer" onClick={() => setActiveTab('auto')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Auto Suspend</span>
              <p className="text-2xl font-black text-orange-400 mt-1">{countAuto}</p>
              <p className="text-[10px] text-slate-500">Suspend otomatis</p>
            </div>
            <div className="p-3 bg-orange-650/10 rounded-xl text-orange-400 border border-orange-500/20 bg-orange-600/10">
              <Clock size={20} />
            </div>
          </div>

          {/* Card 3: Manual Suspend */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-500/35 transition cursor-pointer" onClick={() => setActiveTab('manual')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manual Suspend</span>
              <p className="text-2xl font-black text-purple-400 mt-1">{countManual}</p>
              <p className="text-[10px] text-slate-500">Suspend manual</p>
            </div>
            <div className="p-3 bg-purple-600/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Wallet size={20} />
            </div>
          </div>

          {/* Card 4: Akan Aktif */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-red-500/35 transition cursor-pointer" onClick={() => setActiveTab('akan_aktif')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Akan Aktif (Hari Ini)</span>
              <p className="text-2xl font-black text-red-400 mt-1">{countAkanAktif}</p>
              <p className="text-[10px] text-slate-500">Akan aktif hari ini</p>
            </div>
            <div className="p-3 bg-red-600/10 rounded-xl text-red-455 border border-red-500/20 text-red-500">
              <Ban size={20} />
            </div>
          </div>

          {/* Card 5: Total Outstanding */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-teal-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Outstanding</span>
              <p className="text-lg font-black text-teal-400 mt-1">Rp 125.430.000</p>
              <p className="text-[10px] text-slate-500">Total tunggakan</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 6: Rata-rata Tunggakan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-green-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rata-rata Tunggakan</span>
              <p className="text-lg font-black text-green-400 mt-1">Rp 402.017</p>
              <p className="text-[10px] text-slate-500">Per customer</p>
            </div>
            <div className="p-3 bg-green-600/10 rounded-xl text-green-400 border border-green-500/20">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama, no. hp, email, paket, area..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button onClick={handleResetFilters} className="px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition">
                Reset
              </button>
              <button className="flex items-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition">
                Export <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Filtering Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Alasan Suspend</label>
              <select value={reasonFilter} onChange={e => setReasonFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="tunggakan">Tunggakan</option>
                <option value="request customer">Request Customer</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Paket</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua Paket</option>
                <option value="home 20 mbps">Home 20 Mbps</option>
                <option value="home 50 mbps">Home 50 Mbps</option>
                <option value="business 100 mbps">Business 100 Mbps</option>
                <option value="dedicated 200 mbps">Dedicated 200 Mbps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Sales</label>
              <select value={salesFilter} onChange={e => setSalesFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua Sales</option>
                <option value="budi santoso">Budi Santoso</option>
                <option value="dewi lestari">Dewi Lestari</option>
                <option value="rina marlina">Rina Marlina</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Area</label>
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua Area</option>
                <option value="cimahi selatan">Cimahi Selatan</option>
                <option value="cimahi utara">Cimahi Utara</option>
                <option value="cimahi tengah">Cimahi Tengah</option>
                <option value="bandung barat">Bandung Barat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Tanggal Suspend</label>
              <input
                type="text"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Status Aktivasi</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="auto suspend">Auto Suspend</option>
                <option value="manual suspend">Manual Suspend</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Table & Tab navigation */}
          <div className="xl:col-span-9 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-slate-200 pb-px">
              <div className="flex overflow-x-auto gap-2 scrollbar-none">
                {[
                  { id: 'all', label: `Semua Suspend (${countTotal})` },
                  { id: 'auto', label: `Auto Suspend (${countAuto})` },
                  { id: 'manual', label: `Manual Suspend (${countManual})` },
                  { id: 'akan_aktif', label: `Akan Aktif (${countAkanAktif})` },
                  { id: 'aktif_kembali', label: `Aktif Kembali (Bulan Ini) (56)` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id 
                        ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                        : 'border-transparent text-slate-500 hover:text-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pb-3 sm:pb-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Tampilkan</span>
                  <select 
                    value={pageSize} 
                    onChange={e => setPageSize(parseInt(e.target.value))}
                    className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>data</span>
                </div>

                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setIsGridView(false)} 
                    className={`p-2 transition-colors ${!isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button 
                    onClick={() => setIsGridView(true)} 
                    className={`p-2 transition-colors ${isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                    title="Grid View"
                  >
                    <Grid size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Suspend Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                          onChange={e => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-100 border-slate-200 text-blue-500 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-10 text-center">NO</th>
                      <th className="p-4">PELANGGAN</th>
                      <th className="p-4">PAKET</th>
                      <th className="p-4">SALES</th>
                      <th className="p-4">ALASAN SUSPEND</th>
                      <th className="p-4">TANGGAL SUSPEND</th>
                      <th className="p-4">TUNGGAKAN</th>
                      <th className="p-4">AKAN AKTIF</th>
                      <th className="p-4">STATUS AKTIVASI</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/35">
                    {loading ? (
                      <tr><td colSpan={11} className="py-12 text-center text-slate-400">Memuat data customer suspend...</td></tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={11} className="py-12 text-center text-slate-400">Tidak ada data customer suspend yang cocok.</td></tr>
                    ) : (
                      filteredCustomers.slice(0, pageSize).map((row, index) => {
                        const isSelected = selectedIds.includes(row.id)
                        
                        let reasonBadge = 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        if (row.suspendReason === 'Tunggakan') reasonBadge = 'bg-red-500/10 text-red-400 border border-red-500/20'
                        else if (row.suspendReason === 'Request Customer') reasonBadge = 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'

                        let actStatusBadge = 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'
                        if (row.activationStatus === 'Auto Suspend') actStatusBadge = 'bg-red-500/10 text-red-400 border border-red-500/20'

                        return (
                          <tr 
                            key={row.id} 
                            className={`border-b border-slate-200/20 last:border-b-0 hover:bg-slate-100/25 transition ${
                              isSelected ? 'bg-blue-600/5' : ''
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => handleBulkSelect(row.id)}
                                className="w-4 h-4 rounded bg-slate-100 border-slate-200 text-blue-500 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-center text-slate-400 font-semibold">{index + 1}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.colorClass}`}>
                                  {row.initials}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 cursor-pointer hover:text-blue-600 flex items-center gap-1.5" onClick={() => router.push(`/pelanggan/${row.id}`)}>
                                    <span>{row.name}</span>
                                    <a href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">
                                      <MessageSquare size={12} className="fill-green-500/10" />
                                    </a>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">{row.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-slate-700 font-semibold">{row.packageName}</td>
                            <td className="p-4 text-slate-500 font-semibold">{row.salesName}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${reasonBadge}`}>
                                {row.suspendReason}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 font-medium">{row.suspendDate}</td>
                            <td className={`p-4 font-bold ${row.outstandingAmount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                              {row.outstandingAmount > 0 ? `Rp ${row.outstandingAmount.toLocaleString('id-ID')}` : 'Rp 0'}
                            </td>
                            <td className="p-4 text-slate-500 font-medium">{row.activationDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${actStatusBadge}`}>
                                {row.activationStatus}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition" title="Lihat Detail">
                                  <Eye size={12} />
                                </button>
                                <button className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition" title="Edit Data">
                                  <Edit size={12} />
                                </button>
                                <button className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition">
                                  <MoreHorizontal size={12} />
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

            <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-2">
              <span>Menampilkan 1 - {Math.min(filteredCustomers.length, pageSize)} dari {filteredCustomers.length} data</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg font-semibold">&lt;</button>
                <button className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg font-semibold">1</button>
                <button className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">2</button>
                <button className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">3</button>
                <span className="px-2 pt-1 text-gray-600">...</span>
                <button className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">13</button>
                <button className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-500 hover:text-slate-900 rounded-lg font-semibold">&gt;</button>
              </div>
            </div>

          </div>

          {/* Right Side: Widgets Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Widget 1: Ringkasan Suspend (Donut Chart) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Statistik Suspend</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                    
                    {/* Auto Suspend (57.1%) - Red/Orange */}
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

                    {/* Manual Suspend (42.9%) - Orange */}
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
                    <span className="text-base font-black text-slate-900">{countTotal}</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Total</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 flex-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-slate-500">Auto Suspend</span>
                    </div>
                    <span className="font-bold text-slate-800">178 <span className="text-[8px] text-slate-400 font-normal">(57.1%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-450 bg-orange-400"></span>
                      <span className="text-slate-500">Manual Suspend</span>
                    </div>
                    <span className="font-bold text-slate-800">134 <span className="text-[8px] text-slate-400 font-normal">(42.9%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Alasan Suspend */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alasan Suspend</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Tunggakan', value: 238, pct: 'w-[76.3%]', color: 'bg-red-550 bg-red-500' },
                  { label: 'Request Customer', value: 58, pct: 'w-[18.6%]', color: 'bg-orange-500' },
                  { label: 'Lainnya', value: 16, pct: 'w-[5.1%]', color: 'bg-blue-500' }
                ].map(src => (
                  <div key={src.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold">{src.label}</span>
                      <span className="text-white font-bold">{src.value} <span className="text-[8px] text-slate-400 font-normal">({src.pct.replace('w-[', '').replace(']', '')})</span></span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${src.color} ${src.pct}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Tunggakan Suspend */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tunggakan Suspend</h3>
              <div className="space-y-3.5">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">Total Tunggakan</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">Rp 125.430.000</div>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="text-[10px] text-slate-400 font-bold">Rata-rata per Customer</div>
                  <div className="text-sm font-extrabold text-slate-600 mt-0.5">Rp 402.017</div>
                </div>
              </div>
            </div>

            {/* Widget 4: Aktivasi Cepat */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <button onClick={handleBulkUnsuspend} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-slate-800 rounded-xl transition shadow-lg">
                Aktifkan Massal
              </button>
              <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl transition">
                Jadwalkan Aktivasi
              </button>
            </div>

          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl gap-4">
          <div className="flex flex-wrap items-center gap-3.5 text-xs">
            <span className="text-slate-500 font-bold">
              <span className="text-blue-400 font-black">{selectedIds.length}</span> dipilih
            </span>
            <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                onChange={e => handleSelectAll(e.target.checked)} 
                className="w-4 h-4 rounded bg-slate-100 border-slate-200" 
              />
              Pilih Semua
            </label>
            <div className="h-4 w-px bg-slate-100 hidden sm:block"></div>
            <button
              onClick={handleBulkUnsuspend}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50 text-green-400 border border-green-500/20 rounded-xl font-bold transition"
            >
              <Check size={12} /> Aktifkan
            </button>
            <button
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-100 disabled:opacity-50 text-slate-600 border border-slate-200 rounded-xl font-bold transition"
            >
              <MessageSquare size={12} /> Kirim WhatsApp
            </button>
            <button
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-100 disabled:opacity-50 text-slate-600 border border-slate-200 rounded-xl font-bold transition"
            >
              <Download size={12} /> Export
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-red-500/10 disabled:opacity-50 text-slate-500 hover:text-red-400 border border-slate-200 rounded-xl font-bold transition"
            >
              <Trash2 size={12} /> Hapus
            </button>
          </div>

          <button onClick={() => router.push('/pelanggan/tambah')} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-lg transition">
            <Plus size={14} /> Tambah Customer
          </button>
        </div>

      </div>
    </Layout>
  )
}


