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

// Initial mock data matching the screenshot exactly
const INITIAL_EXPIRED_DATA: ExpiredCustomer[] = [
  { id: '1', name: 'Rudi Hartono', initials: 'RH', colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', packageName: 'Home 50 Mbps', phone: '0812-3456-7890', email: 'rudi.h@email.com', salesName: 'Budi Santoso', expiredDate: '20 Jun 2026', daysExpired: 11, outstandingAmount: 350000, lastPaymentDate: '20 Mei 2026', status: 'Expired', area: 'Cimahi Selatan' },
  { id: '2', name: 'Siti Aisyah', initials: 'SA', colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', packageName: 'Home 20 Mbps', phone: '0813-9876-5432', email: 'siti.a@email.com', salesName: 'Dewi Lestari', expiredDate: '18 Jun 2026', daysExpired: 13, outstandingAmount: 250000, lastPaymentDate: '18 Mei 2026', status: 'Expired', area: 'Cimahi Utara' },
  { id: '3', name: 'Ahmad Fauzi', initials: 'AF', colorClass: 'bg-purple-600/20 text-purple-400 border border-purple-500/30', packageName: 'Business 100 Mbps', phone: '0821-2345-6789', email: 'ahmad.f@email.com', salesName: 'Rina Marlina', expiredDate: '10 Jun 2026', daysExpired: 21, outstandingAmount: 650000, lastPaymentDate: '10 Mei 2026', status: 'Expired', area: 'Bandung Barat' },
  { id: '4', name: 'Dian Permata', initials: 'DP', colorClass: 'bg-green-600/20 text-green-400 border border-green-500/30', packageName: 'Home 20 Mbps', phone: '0811-2222-3333', email: 'dian.p@email.com', salesName: 'Budi Santoso', expiredDate: '05 Jun 2026', daysExpired: 26, outstandingAmount: 250000, lastPaymentDate: '05 Mei 2026', status: 'Expired', area: 'Cimahi Tengah' },
  { id: '5', name: 'Yoga Pratama', initials: 'YP', colorClass: 'bg-purple-600/20 text-purple-400 border border-purple-500/30', packageName: 'Home 50 Mbps', phone: '0822-4444-5555', email: 'yoga.p@email.com', salesName: 'Dewi Lestari', expiredDate: '28 Mei 2026', daysExpired: 34, outstandingAmount: 0, lastPaymentDate: '28 Apr 2026', status: 'Expired', area: 'Cimahi Selatan' },
  { id: '6', name: 'Lina Handayani', initials: 'LH', colorClass: 'bg-green-600/20 text-green-400 border border-green-500/30', packageName: 'Business 100 Mbps', phone: '0817-7777-8888', email: 'lina.h@email.com', salesName: 'Rina Marlina', expiredDate: '15 Mei 2026', daysExpired: 47, outstandingAmount: 950000, lastPaymentDate: '15 Apr 2026', status: 'Expired', area: 'Bandung Barat' },
  { id: '7', name: 'Fajar Nugroho', initials: 'FN', colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', packageName: 'Dedicated 200 Mbps', phone: '0816-9999-0000', email: 'fajar.n@email.com', salesName: 'Budi Santoso', expiredDate: '01 Mei 2026', daysExpired: 61, outstandingAmount: 0, lastPaymentDate: '01 Apr 2026', status: 'Expired', area: 'Cimahi Utara' },
  { id: '8', name: 'Maya Sari', initials: 'MS', colorClass: 'bg-green-600/20 text-green-400 border border-green-500/30', packageName: 'Home 20 Mbps', phone: '0812-1234-5678', email: 'maya.s@email.com', salesName: 'Dewi Lestari', expiredDate: '25 Apr 2026', daysExpired: 67, outstandingAmount: 250000, lastPaymentDate: '25 Mar 2026', status: 'Expired', area: 'Cimahi Tengah' },
  { id: '9', name: 'Budi Setiawan', initials: 'BS', colorClass: 'bg-orange-650/20 text-orange-400 border border-orange-500/30 bg-orange-600/10', packageName: 'Home 50 Mbps', phone: '0823-5555-6666', email: 'budi.s@email.com', salesName: 'Rina Marlina', expiredDate: '20 Apr 2026', daysExpired: 72, outstandingAmount: 250000, lastPaymentDate: '20 Mar 2026', status: 'Expired', area: 'Cimahi Selatan' },
  { id: '10', name: 'Novia Putri', initials: 'NP', colorClass: 'bg-purple-600/20 text-purple-400 border border-purple-500/30', packageName: 'Home 20 Mbps', phone: '0819-8888-9999', email: 'novia.p@email.com', salesName: 'Dewi Lestari', expiredDate: '10 Apr 2026', daysExpired: 82, outstandingAmount: 0, lastPaymentDate: '10 Mar 2026', status: 'Expired', area: 'Cimahi Utara' }
]

export default function CustomerExpired() {
  const router = useRouter()
  const [customers, setCustomers] = useState<ExpiredCustomer[]>(INITIAL_EXPIRED_DATA)
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
      setCustomers([...dbExpired, ...INITIAL_EXPIRED_DATA])
    } catch (err) {
      console.error(err)
      setCustomers(INITIAL_EXPIRED_DATA)
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
      <div className="min-h-screen bg-[#080d19] text-gray-200 p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
              <Link href="/pelanggan" className="hover:text-blue-400 transition">Customer</Link>
              <span>&gt;</span>
              <span className="text-blue-400">Customer Expired</span>
            </div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
              Customer Expired
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3.5 py-2 rounded-xl text-xs font-semibold">
              <Calendar size={14} className="text-blue-400" />
              <span>01 Juli 2026 | 08:35 WIB</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3.5 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-400">Status Sistem: <span className="text-green-400 font-bold">Normal</span></span>
            </div>
          </div>
        </div>

        {/* 6 Statistics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Expired */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-purple-500/35 transition cursor-pointer" onClick={() => { setActiveTab('all'); handleResetFilters(); }}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Expired</span>
              <p className="text-2xl font-black text-white mt-1">{countTotal}</p>
              <p className="text-[10px] text-gray-400">Semua customer expired</p>
            </div>
            <div className="p-3 bg-purple-650/10 rounded-xl text-purple-500 border border-purple-500/20 bg-purple-600/10">
              <TimerOff size={20} />
            </div>
          </div>

          {/* Card 2: Expired Bulan Ini */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-red-500/35 transition cursor-pointer" onClick={() => setActiveTab('bulan_ini')}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Expired Bulan Ini</span>
              <p className="text-2xl font-black text-red-400 mt-1">{countBulanIni}</p>
              <p className="text-[10px] text-gray-400">Expired bulan ini</p>
            </div>
            <div className="p-3 bg-red-650/10 rounded-xl text-red-400 border border-red-500/20 bg-red-600/10">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 3: Expired > 30 Hari */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-orange-500/35 transition cursor-pointer" onClick={() => setActiveTab('over_30')}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Expired &gt; 30 Hari</span>
              <p className="text-2xl font-black text-orange-400 mt-1">{countOver30}</p>
              <p className="text-[10px] text-gray-400">Expired lebih dari 30 hari</p>
            </div>
            <div className="p-3 bg-orange-600/10 rounded-xl text-orange-400 border border-orange-500/20">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 4: Expired > 60 Hari */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-yellow-500/35 transition cursor-pointer" onClick={() => setActiveTab('over_60')}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Expired &gt; 60 Hari</span>
              <p className="text-2xl font-black text-yellow-400 mt-1">{countOver60}</p>
              <p className="text-[10px] text-gray-400">Expired lebih dari 60 hari</p>
            </div>
            <div className="p-3 bg-yellow-600/10 rounded-xl text-yellow-400 border border-yellow-500/20">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 5: Rata-rata Tunggakan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-teal-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rata-rata Tunggakan</span>
              <p className="text-lg font-black text-teal-400 mt-1">Rp 350.450</p>
              <p className="text-[10px] text-gray-400">Per customer</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 6: Total Tunggakan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-green-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Tunggakan</span>
              <p className="text-lg font-black text-green-400 mt-1">Rp 89.715.200</p>
              <p className="text-[10px] text-gray-400">Semua customer expired</p>
            </div>
            <div className="p-3 bg-green-600/10 rounded-xl text-green-400 border border-green-500/20">
              <Wallet size={20} />
            </div>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Cari nama, no. hp, email, paket, area..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#131d35]/50 border border-[#131d35] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button onClick={handleResetFilters} className="px-4 py-3 bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35] text-xs font-semibold rounded-xl text-gray-400 hover:text-white transition">
                Reset
              </button>
              <button className="flex items-center gap-1.5 px-4 py-3 bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35] text-xs font-semibold rounded-xl text-gray-400 hover:text-white transition">
                Export <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Filtering Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Paket</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Paket</option>
                <option value="home 20 mbps">Home 20 Mbps</option>
                <option value="home 50 mbps">Home 50 Mbps</option>
                <option value="business 100 mbps">Business 100 Mbps</option>
                <option value="dedicated 200 mbps">Dedicated 200 Mbps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Sales</label>
              <select value={salesFilter} onChange={e => setSalesFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Sales</option>
                <option value="budi santoso">Budi Santoso</option>
                <option value="dewi lestari">Dewi Lestari</option>
                <option value="rina marlina">Rina Marlina</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Area</label>
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Area</option>
                <option value="cimahi selatan">Cimahi Selatan</option>
                <option value="cimahi utara">Cimahi Utara</option>
                <option value="cimahi tengah">Cimahi Tengah</option>
                <option value="bandung barat">Bandung Barat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Tanggal Expired</label>
              <input
                type="text"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Lama Expired</label>
              <select value={durationFilter} onChange={e => setDurationFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="short">&lt; 30 Hari</option>
                <option value="medium">30 - 60 Hari</option>
                <option value="long">&gt; 60 Hari</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Tunggakan</label>
              <select value={outstandingFilter} onChange={e => setOutstandingFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
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
            
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#131d35] pb-px">
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
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pb-3 sm:pb-0">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>Tampilkan</span>
                  <select 
                    value={pageSize} 
                    onChange={e => setPageSize(parseInt(e.target.value))}
                    className="bg-[#131d35] border border-[#131d35] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>data</span>
                </div>

                <div className="flex items-center border border-[#131d35] rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setIsGridView(false)} 
                    className={`p-2 transition-colors ${!isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-[#131d35]/30 text-gray-500 hover:text-gray-300'}`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button 
                    onClick={() => setIsGridView(true)} 
                    className={`p-2 transition-colors ${isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-[#131d35]/30 text-gray-500 hover:text-gray-300'}`}
                    title="Grid View"
                  >
                    <Grid size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Expired Table */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#131d35] text-gray-500 uppercase tracking-wider font-bold">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                          onChange={e => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500 focus:ring-0" 
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
                  <tbody className="divide-y divide-[#131d35]/35">
                    {loading ? (
                      <tr><td colSpan={11} className="py-12 text-center text-gray-500">Memuat data customer expired...</td></tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={11} className="py-12 text-center text-gray-500">Tidak ada data customer expired yang cocok.</td></tr>
                    ) : (
                      filteredCustomers.slice(0, pageSize).map((row, index) => {
                        const isSelected = selectedIds.includes(row.id)
                        let badgeColor = 'bg-red-500/10 text-red-400 border border-red-500/20'

                        return (
                          <tr 
                            key={row.id} 
                            className={`border-b border-[#131d35]/20 last:border-b-0 hover:bg-[#131d35]/25 transition ${
                              isSelected ? 'bg-blue-600/5' : ''
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => handleBulkSelect(row.id)}
                                className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-center text-gray-500 font-semibold">{index + 1}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.colorClass}`}>
                                  {row.initials}
                                </div>
                                <div>
                                  <div className="font-bold text-white cursor-pointer hover:text-blue-400 flex items-center gap-1.5" onClick={() => router.push(`/pelanggan/${row.id}`)}>
                                    <span>{row.name}</span>
                                    <a href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">
                                      <MessageSquare size={12} className="fill-green-500/10" />
                                    </a>
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-medium">{row.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300 font-semibold">{row.packageName}</td>
                            <td className="p-4 text-gray-400 font-semibold">{row.salesName}</td>
                            <td className="p-4 text-gray-400 font-medium">{row.expiredDate}</td>
                            <td className="p-4 text-gray-300 font-bold">{row.daysExpired} Hari</td>
                            <td className={`p-4 font-bold ${row.outstandingAmount > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                              {row.outstandingAmount > 0 ? `Rp ${row.outstandingAmount.toLocaleString('id-ID')}` : 'Rp 0'}
                            </td>
                            <td className="p-4 text-gray-400 font-medium">{row.lastPaymentDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${badgeColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1 hover:bg-[#131d35] hover:text-white text-gray-400 rounded transition" title="Lihat Detail">
                                  <Eye size={12} />
                                </button>
                                <button className="p-1 hover:bg-[#131d35] hover:text-white text-gray-400 rounded transition" title="Edit Data">
                                  <Edit size={12} />
                                </button>
                                <button className="p-1 hover:bg-[#131d35] hover:text-white text-gray-400 rounded transition">
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

            <div className="flex justify-between items-center text-xs text-gray-500 font-medium pt-2">
              <span>Menampilkan 1 - {Math.min(filteredCustomers.length, pageSize)} dari {filteredCustomers.length} data</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-[#131d35] border border-[#1e293b] text-gray-400 hover:text-white rounded-lg font-semibold">&lt;</button>
                <button className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg font-semibold">1</button>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-500 rounded-lg font-semibold">2</button>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-500 rounded-lg font-semibold">3</button>
                <span className="px-2 pt-1 text-gray-600">...</span>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-500 rounded-lg font-semibold">11</button>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-400 hover:text-white rounded-lg font-semibold">&gt;</button>
              </div>
            </div>

          </div>

          {/* Right Side: Widgets Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Widget 1: Ringkasan Expired (Donut Chart) */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ringkasan Expired</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#131d35" strokeWidth="6" />
                    
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
                    <span className="text-base font-black text-white">{countTotal}</span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase">Total</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 flex-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-gray-400">Bulan Ini</span>
                    </div>
                    <span className="font-bold text-white">36 <span className="text-[8px] text-gray-500 font-normal">(14.1%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      <span className="text-gray-400">&gt; 30 Hari</span>
                    </div>
                    <span className="font-bold text-white">112 <span className="text-[8px] text-gray-500 font-normal">(43.8%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      <span className="text-gray-400">&gt; 60 Hari</span>
                    </div>
                    <span className="font-bold text-white">64 <span className="text-[8px] text-gray-500 font-normal">(25%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-gray-400">Lainnya</span>
                    </div>
                    <span className="font-bold text-white">44 <span className="text-[8px] text-gray-500 font-normal">(17.1%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Alasan Expired */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Alasan Expired</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Telat pembayaran', value: 184, pct: 'w-[71.9%]', color: 'bg-red-500' },
                  { label: 'Request stop layanan', value: 32, pct: 'w-[12.5%]', color: 'bg-orange-500' },
                  { label: 'Pindah provider', value: 24, pct: 'w-[9.4%]', color: 'bg-yellow-500' },
                  { label: 'Lainnya', value: 16, pct: 'w-[6.2%]', color: 'bg-blue-500' }
                ].map(src => (
                  <div key={src.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 font-bold">{src.label}</span>
                      <span className="text-white font-bold">{src.value} <span className="text-[8px] text-gray-500 font-normal">({src.pct.replace('w-[', '').replace(']', '')})</span></span>
                    </div>
                    <div className="w-full bg-[#131d35] h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${src.color} ${src.pct}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Rekomendasi */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Rekomendasi</h3>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Kirim penawaran spesial untuk pelanggan expired lebih dari 30 hari.
              </p>
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl transition shadow-lg">
                Buat Penawaran
              </button>
            </div>

            {/* Widget 4: Tunggakan Expired */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tunggakan Expired</h3>
              <div className="space-y-3.5">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold">Total Tunggakan</div>
                  <div className="text-lg font-black text-white mt-0.5">Rp 89.715.200</div>
                </div>
                <div className="border-t border-[#131d35] pt-3">
                  <div className="text-[10px] text-gray-500 font-bold">Rata-rata per Customer</div>
                  <div className="text-sm font-extrabold text-gray-300 mt-0.5">Rp 350.450</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0b1329] border border-[#131d35] p-4 rounded-2xl gap-4">
          <div className="flex flex-wrap items-center gap-3.5 text-xs">
            <span className="text-gray-400 font-bold">
              <span className="text-blue-400 font-black">{selectedIds.length}</span> dipilih
            </span>
            <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                onChange={e => handleSelectAll(e.target.checked)} 
                className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b]" 
              />
              Pilih Semua
            </label>
            <div className="h-4 w-px bg-[#131d35] hidden sm:block"></div>
            <button
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131d35] hover:bg-[#1e293b] disabled:opacity-50 text-gray-300 border border-[#1e293b] rounded-xl font-bold transition"
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
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131d35] hover:bg-red-500/10 disabled:opacity-50 text-gray-400 hover:text-red-400 border border-[#1e293b] rounded-xl font-bold transition"
            >
              <Trash2 size={12} /> Hapus Expired
            </button>
            <button
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131d35] hover:bg-[#1e293b] disabled:opacity-50 text-gray-300 border border-[#1e293b] rounded-xl font-bold transition"
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

