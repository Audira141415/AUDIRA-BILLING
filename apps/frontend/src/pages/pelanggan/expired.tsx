import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import {
  TimerOff, Search, Eye, Edit, RefreshCw, Phone, Calendar, CheckCircle, ShieldAlert,
  MessageSquare, Trash2, Ban, ChevronDown, List, Grid, Clock, Wallet, HelpCircle, Check, Play, UserCheck, AlertTriangle, Plus, MoreHorizontal, Download
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

const INITIAL_EXPIRED_DATA: ExpiredCustomer[] = []

export default function CustomerExpired() {
  const router = useRouter()
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
  const [pageSize, setPageSize] = useState(25)
  const [isGridView, setIsGridView] = useState(false)

  // Checkbox Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Load actual customers and merge with mock data
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
              colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
              packageName: pkgName,
              phone: c.phone || '0812-0000-0000',
              email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
              salesName: 'Budi Santoso',
              expiredDate: '20 Jun 2026',
              daysExpired: 11,
              outstandingAmount: 250000,
              lastPaymentDate: '20 Mei 2026',
              status: 'Expired' as const,
              area: 'Cimahi Selatan'
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
          // Change status to active
          await api.pelanggan.update(id, { status: 'active' })
        }
      }

      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      alert('Berhasil mengaktifkan kembali customer terpilih.')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat memproses aktivasi kembali.')
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
    if (activeTab === 'bulan_ini' && c.daysExpired > 30) return false
    if (activeTab === 'over_30' && (c.daysExpired <= 30 || c.daysExpired > 60)) return false
    if (activeTab === 'over_60' && c.daysExpired <= 60) return false

    // Dropdown filters
    if (packageFilter !== 'all' && c.packageName.toLowerCase() !== packageFilter.toLowerCase()) return false
    if (salesFilter !== 'all' && c.salesName.toLowerCase() !== salesFilter.toLowerCase()) return false
    if (areaFilter !== 'all' && c.area.toLowerCase() !== areaFilter.toLowerCase()) return false

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
  const totalOutstanding = 89715200 // Rp 89.715.200
  const avgOutstanding = 350450 // Rp 350.450

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
              <span className="text-rose-400">Customer Expired (Non-Aktif)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              Customer Expired & Berhenti Berlangganan
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar pelanggan yang masa aktif layanannya telah berakhir atau berhenti berlangganan (churn).
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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-500/35 transition cursor-pointer" onClick={() => { setActiveTab('all'); handleResetFilters(); }}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Expired</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{countTotal}</p>
              <p className="text-[10px] text-slate-500">Semua customer expired</p>
            </div>
            <div className="p-3 bg-purple-650/10 rounded-xl text-purple-500 border border-purple-500/20 bg-purple-600/10">
              <TimerOff size={20} />
            </div>
          </div>

          {/* Card 2: Expired Bulan Ini */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-red-500/35 transition cursor-pointer" onClick={() => setActiveTab('bulan_ini')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expired Bulan Ini</span>
              <p className="text-2xl font-black text-red-400 mt-1">{countBulanIni}</p>
              <p className="text-[10px] text-slate-500">Expired bulan ini</p>
            </div>
            <div className="p-3 bg-red-650/10 rounded-xl text-red-400 border border-red-500/20 bg-red-600/10">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 3: Expired > 30 Hari */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-orange-500/35 transition cursor-pointer" onClick={() => setActiveTab('over_30')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expired &gt; 30 Hari</span>
              <p className="text-2xl font-black text-orange-400 mt-1">{countOver30}</p>
              <p className="text-[10px] text-slate-500">Expired lebih dari 30 hari</p>
            </div>
            <div className="p-3 bg-orange-600/10 rounded-xl text-orange-400 border border-orange-500/20">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 4: Expired > 60 Hari */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-yellow-500/35 transition cursor-pointer" onClick={() => setActiveTab('over_60')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expired &gt; 60 Hari</span>
              <p className="text-2xl font-black text-yellow-400 mt-1">{countOver60}</p>
              <p className="text-[10px] text-slate-500">Expired lebih dari 60 hari</p>
            </div>
            <div className="p-3 bg-yellow-600/10 rounded-xl text-yellow-400 border border-yellow-500/20">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 5: Rata-rata Tunggakan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-teal-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rata-rata Tunggakan</span>
              <p className="text-lg font-black text-teal-400 mt-1">Rp 350.450</p>
              <p className="text-[10px] text-slate-500">Per customer</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 6: Total Tunggakan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-green-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Tunggakan</span>
              <p className="text-lg font-black text-green-400 mt-1">Rp 89.715.200</p>
              <p className="text-[10px] text-slate-500">Semua customer expired</p>
            </div>
            <div className="p-3 bg-green-600/10 rounded-xl text-green-400 border border-green-500/20">
              <Wallet size={20} />
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
              <button onClick={() => alert("Mengekspor daftar pelanggan expired...")} className="flex items-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition">
                Export <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Filtering Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            
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
              <label className="text-[10px] text-slate-400 font-bold block">Tanggal Expired</label>
              <input
                type="text"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Lama Expired</label>
              <select value={durationFilter} onChange={e => setDurationFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="short">&lt; 30 Hari</option>
                <option value="medium">30 - 60 Hari</option>
                <option value="long">&gt; 60 Hari</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Tunggakan</label>
              <select value={outstandingFilter} onChange={e => setOutstandingFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
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
            
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-slate-200 pb-px">
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

            {/* Expired Table */}
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
                      <th className="p-4">TANGGAL EXPIRED</th>
                      <th className="p-4">LAMA EXPIRED</th>
                      <th className="p-4">TUNGGAKAN</th>
                      <th className="p-4">TERAKHIR DIBAYAR</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/35">
                    {loading ? (
                      <tr><td colSpan={11} className="py-12 text-center text-slate-400">Memuat data customer expired...</td></tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={11} className="py-12 text-center text-slate-400">Tidak ada data customer expired yang cocok.</td></tr>
                    ) : (
                      filteredCustomers.slice(0, pageSize).map((row, index) => {
                        const isSelected = selectedIds.includes(row.id)
                        let badgeColor = 'bg-red-500/10 text-red-400 border border-red-500/20'

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
                            <td className="p-4 text-slate-500 font-medium">{row.expiredDate}</td>
                            <td className="p-4 text-slate-600 font-bold">{row.daysExpired} Hari</td>
                            <td className={`p-4 font-bold ${row.outstandingAmount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                              {row.outstandingAmount > 0 ? `Rp ${row.outstandingAmount.toLocaleString('id-ID')}` : 'Rp 0'}
                            </td>
                            <td className="p-4 text-slate-500 font-medium">{row.lastPaymentDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${badgeColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition" title="Lihat Detail">
                                  <Eye size={12} />
                                </button>
                                <button onClick={() => alert("Membuka modal edit data...")} className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition" title="Edit Data"><Edit size={12} /></button>
                                <button onClick={() => alert("Opsi tindakan: Kirim Notifikasi, Isolir Layanan, Cetak Bukti.")} className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition"><MoreHorizontal size={12} /></button>
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
                <button onClick={() => alert("Halaman pertama sudah aktif.")} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg font-semibold">&lt;</button>
                <button onClick={() => alert("Halaman 1 saat ini aktif.")} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg font-semibold">1</button>
                <button onClick={() => alert("Beralih ke halaman 2.")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">2</button>
                <button onClick={() => alert("Beralih ke halaman 3.")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">3</button>
                <span className="px-2 pt-1 text-gray-600">...</span>
                <button onClick={() => alert("Beralih ke halaman 11")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">11</button>
                <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-500 hover:text-slate-900 rounded-lg font-semibold">&gt;</button>
              </div>
            </div>

          </div>

          {/* Right Side: Widgets Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Widget 1: Ringkasan Expired (Donut Chart) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ringkasan Expired</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                    
                    {/* Expired Bulan Ini (14.1%) - Red */}
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

                    {/* Expired > 30 Hari (43.8%) - Orange */}
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

                    {/* Expired > 60 Hari (25%) - Yellow */}
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
                    <span className="text-base font-black text-slate-900">{countTotal}</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Total</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 flex-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-slate-500">Bulan Ini</span>
                    </div>
                    <span className="font-bold text-slate-800">36 <span className="text-[8px] text-slate-400 font-normal">(14.1%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      <span className="text-slate-500">&gt; 30 Hari</span>
                    </div>
                    <span className="font-bold text-slate-800">112 <span className="text-[8px] text-slate-400 font-normal">(43.8%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      <span className="text-slate-500">&gt; 60 Hari</span>
                    </div>
                    <span className="font-bold text-slate-800">64 <span className="text-[8px] text-slate-400 font-normal">(25%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-slate-500">Lainnya</span>
                    </div>
                    <span className="font-bold text-slate-800">44 <span className="text-[8px] text-slate-400 font-normal">(17.1%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Alasan Expired */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alasan Expired</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Telat pembayaran', value: 184, pct: 'w-[71.9%]', color: 'bg-red-500' },
                  { label: 'Request stop layanan', value: 32, pct: 'w-[12.5%]', color: 'bg-orange-500' },
                  { label: 'Pindah provider', value: 24, pct: 'w-[9.4%]', color: 'bg-yellow-500' },
                  { label: 'Lainnya', value: 16, pct: 'w-[6.2%]', color: 'bg-blue-500' }
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

            {/* Widget 3: Rekomendasi */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Rekomendasi</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Kirim penawaran spesial untuk pelanggan expired lebih dari 30 hari.
              </p>
              <button onClick={() => alert("Membuka formulir pembuatan penawaran diskon re-aktivasi...")} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-slate-800 rounded-xl transition shadow-lg">Buat Penawaran</button>
            </div>

            {/* Widget 4: Tunggakan Expired */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tunggakan Expired</h3>
              <div className="space-y-3.5">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">Total Tunggakan</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">Rp 89.715.200</div>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="text-[10px] text-slate-400 font-bold">Rata-rata per Customer</div>
                  <div className="text-sm font-extrabold text-slate-600 mt-0.5">Rp 350.450</div>
                </div>
              </div>
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
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-100 disabled:opacity-50 text-slate-600 border border-slate-200 rounded-xl font-bold transition"
            >
              <MessageSquare size={12} /> Kirim WhatsApp
            </button>
            <button
              onClick={handleBulkReactivate}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50 text-green-400 border border-green-500/20 rounded-xl font-bold transition"
            >
              <Check size={12} /> Aktifkan Kembali
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-red-500/10 disabled:opacity-50 text-slate-500 hover:text-red-400 border border-slate-200 rounded-xl font-bold transition"
            >
              <Trash2 size={12} /> Hapus Expired
            </button>
            <button
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-100 disabled:opacity-50 text-slate-600 border border-slate-200 rounded-xl font-bold transition"
            >
              <Download size={12} /> Export
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

