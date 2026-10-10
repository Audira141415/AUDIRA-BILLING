import { useEffect, useState, startTransition } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import {
  Users,
  CreditCard,
  FileText,
  Clock,
  ArrowUpRight,
  Search,
  Bell,
  MessageSquare,
  Maximize2,
  ChevronDown,
  Info,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Loader2,
  TrendingUp,
  Download,
  AlertTriangle,
  Settings,
  Database,
  Briefcase,
  Share2,
  Printer,
  FileSpreadsheet,
  Upload,
  UserCheck,
  Zap,
  TrendingDown
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

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

// Color schemes from design
const COLORS = {
  paid: '#10b981', // emerald
  pending: '#f59e0b', // amber
  overdue: '#ef4444', // red
  canceled: '#6b7280', // gray
  draft: '#6366f1' // indigo
}

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280', '#6366f1']
const PAYMENT_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#6b7280']

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  
  // Real stats state
  const [realStats, setRealStats] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState('08:35 WIB')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      setCurrentTime(timeStr)
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsData = await api.dashboard.getStats()
        setRealStats(statsData)
        const invoicesData = await api.keuangan.getInvoices()
        setInvoices(invoicesData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      }
    }
    if (user) {
      loadDashboardData()
    }
  }, [user])

  // fallback to mockup values if database is empty
  const totalCustomers = realStats?.customers_total?.total || 3248
  const activeCustomers = realStats?.customers?.active || 2742
  const suspendedCustomers = realStats?.customers?.isolated || 278
  const expiredCustomers = 186
  const trialCustomers = 42

  const totalInvoicesCount = invoices.length > 0 ? invoices.length : 4256
  const paidInvoicesCount = invoices.filter((i: any) => i.status === 'PAID').length || 2842
  const pendingInvoicesCount = invoices.filter((i: any) => i.status === 'PENDING').length || 856
  const overdueInvoicesCount = invoices.filter((i: any) => i.status === 'OVERDUE').length || 438
  const draftInvoicesCount = 120

  const totalRevenueBulanIni = realStats?.revenue?.total || 245750000

  // Revenue Overview chart data (Mock matching the beautiful graph in the design)
  const revenueOverviewData = [
    { name: '1 Jun', Revenue: 180, Expense: 65, Profit: 115, Target: 250 },
    { name: '5 Jun', Revenue: 195, Expense: 70, Profit: 125, Target: 250 },
    { name: '10 Jun', Revenue: 210, Expense: 82, Profit: 128, Target: 250 },
    { name: '15 Jun', Revenue: 245.75, Expense: 89.45, Profit: 156.3, Target: 250 },
    { name: '20 Jun', Revenue: 220, Expense: 78, Profit: 142, Target: 250 },
    { name: '25 Jun', Revenue: 235, Expense: 85, Profit: 150, Target: 250 },
    { name: '30 Jun', Revenue: 260, Expense: 90, Profit: 170, Target: 250 }
  ]

  // Customer Growth data (grouped bars)
  const customerGrowthData = [
    { name: 'Jan', 'Customer Baru': 450, 'Aktif': 400, 'Suspend': 30, 'Berhenti': 10 },
    { name: 'Feb', 'Customer Baru': 520, 'Aktif': 480, 'Suspend': 25, 'Berhenti': 15 },
    { name: 'Mar', 'Customer Baru': 580, 'Aktif': 510, 'Suspend': 40, 'Berhenti': 12 },
    { name: 'Apr', 'Customer Baru': 490, 'Aktif': 460, 'Suspend': 35, 'Berhenti': 8 },
    { name: 'Mei', 'Customer Baru': 610, 'Aktif': 550, 'Suspend': 28, 'Berhenti': 18 },
    { name: 'Jun', 'Customer Baru': 640, 'Aktif': 590, 'Suspend': 32, 'Berhenti': 20 }
  ]

  // Invoice Analytics Pie Data
  const invoicePieData = [
    { name: 'Paid', value: paidInvoicesCount, percentage: '57%' },
    { name: 'Pending', value: pendingInvoicesCount, percentage: '20%' },
    { name: 'Overdue', value: overdueInvoicesCount, percentage: '9%' },
    { name: 'Canceled', value: 80, percentage: '2%' },
    { name: 'Draft', value: draftInvoicesCount, percentage: '2%' }
  ]

  // Payment Analytics Pie Data
  const paymentPieData = [
    { name: 'Transfer Bank', value: 1245, percentage: '45%' },
    { name: 'QRIS', value: 856, percentage: '21%' },
    { name: 'Virtual Account', value: 768, percentage: '18%' },
    { name: 'Cash', value: 452, percentage: '8%' },
    { name: 'Manual', value: 235, percentage: '4%' },
    { name: 'Lainnya', value: 100, percentage: '2%' }
  ]

  // Mock list elements
  const topPackages = [
    { rank: 1, name: 'Home 20 Mbps', value: '892 Customer' },
    { rank: 2, name: 'Home 50 Mbps', value: '682 Customer' },
    { rank: 3, name: 'Home 100 Mbps', value: '458 Customer' },
    { rank: 4, name: 'Business 100 Mbps', value: '256 Customer' },
    { rank: 5, name: 'Dedicated 200 Mbps', value: '178 Customer' }
  ]

  const topCities = [
    { name: 'Jakarta', count: 1245, percentage: 38 },
    { name: 'Bekasi', count: 856, percentage: 26 },
    { name: 'Depok', count: 458, percentage: 14 },
    { name: 'Tangerang', count: 356, percentage: 11 },
    { name: 'Bogor', count: 233, percentage: 7 }
  ]

  const recentPayments = [
    { id: 'INV-2026-0630-154', customer: 'Andi Setiawan', nominal: 350000, date: '01 Jul 2026 08:21', method: 'QRIS' },
    { id: 'INV-2026-0630-153', customer: 'Budi Santoso', nominal: 275000, date: '01 Jul 2026 08:15', method: 'Transfer' },
    { id: 'INV-2026-0630-152', customer: 'Citra Lestari', nominal: 490000, date: '01 Jul 2026 08:10', method: 'VA BCA' },
    { id: 'INV-2026-0630-151', customer: 'Dewi Sartika', nominal: 350000, date: '01 Jul 2026 08:05', method: 'QRIS' },
    { id: 'INV-2026-0630-150', customer: 'PT. Maju Bersama', nominal: 1250000, date: '01 Jul 2026 07:58', method: 'Transfer' }
  ]

  const dueTodayInvoices = [
    { id: 'INV-2026-0701-001', customer: 'Andi Setiawan', nominal: 350000, due: '01 Jul 2026' },
    { id: 'INV-2026-0701-002', customer: 'PT. Maju Bersama', nominal: 1250000, due: '01 Jul 2026' },
    { id: 'INV-2026-0701-003', customer: 'Budi Santoso', nominal: 275000, due: '01 Jul 2026' },
    { id: 'INV-2026-0701-004', customer: 'Citra Lestari', nominal: 490000, due: '01 Jul 2026' },
    { id: 'INV-2026-0701-005', customer: 'Rina Anggraini', nominal: 350000, due: '01 Jul 2026' }
  ]

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#080d19] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
      </div>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#080d19] text-gray-200 p-4 md:p-6 space-y-6 overflow-hidden">
        
        {/* ─── Top Navbar Header ────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Selamat datang kembali,
              <span className="text-blue-400 font-extrabold">{user?.name || 'Agus Dwi Rianto'}</span> 👋
            </h1>
            <p className="text-xs text-gray-450 text-gray-400">Semoga harimu menyenangkan!</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Clock Widget */}
            <div className="flex items-center gap-2 bg-[#0d1527] border border-[#1e293b] rounded-xl px-4 py-2 text-xs font-semibold text-gray-300">
              <Calendar size={14} className="text-blue-400" />
              <span>01 Juli 2026</span>
              <span className="text-gray-500">|</span>
              <span>{currentTime}</span>
            </div>

            {/* Status Widget */}
            <div className="flex items-center gap-2 bg-[#0d1527] border border-[#1e293b] rounded-xl px-4 py-2 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-400">Status Sistem:</span>
              <span className="text-green-500 font-bold">Normal</span>
            </div>

            {/* Quick Action Button */}
            <button 
              onClick={() => router.push('/invoice')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/10"
            >
              <Plus size={14} /> Quick Action
            </button>
          </div>
        </div>

        {/* ─── Main Metrics Grid (4 Column cards) ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          
          {/* Card 1: Total Customer */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-blue-500/30 transition duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Total Customer</p>
                <p className="text-3xl font-extrabold text-white mt-1.5">{totalCustomers.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                <Users size={22} />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 border-t border-[#131d35] pt-4 mt-4 text-[10px]">
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Aktif</p>
                <p className="text-sm font-bold text-green-500 mt-0.5">{activeCustomers}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Suspend</p>
                <p className="text-sm font-bold text-orange-500 mt-0.5">{suspendedCustomers}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Expired</p>
                <p className="text-sm font-bold text-red-500 mt-0.5">{expiredCustomers}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Trial</p>
                <p className="text-sm font-bold text-indigo-400 mt-0.5">{trialCustomers}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-[10px] text-green-500 font-semibold gap-1">
              <ArrowUpRight size={12} />
              <span>+12% dari bulan lalu</span>
            </div>
          </div>

          {/* Card 2: Total Invoice */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-emerald-500/30 transition duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Total Invoice</p>
                <p className="text-3xl font-extrabold text-white mt-1.5">{totalInvoicesCount.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2.5 bg-[#10b981]/10 text-[#10b981] rounded-xl">
                <FileText size={22} />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 border-t border-[#131d35] pt-4 mt-4 text-[10px]">
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Paid</p>
                <p className="text-sm font-bold text-green-500 mt-0.5">{paidInvoicesCount}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Pending</p>
                <p className="text-sm font-bold text-amber-500 mt-0.5">{pendingInvoicesCount}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Overdue</p>
                <p className="text-sm font-bold text-red-500 mt-0.5">{overdueInvoicesCount}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold text-[9px]">Draft</p>
                <p className="text-sm font-bold text-indigo-400 mt-0.5">{draftInvoicesCount}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-[10px] text-green-500 font-semibold gap-1">
              <ArrowUpRight size={12} />
              <span>+15% dari bulan lalu</span>
            </div>
          </div>

          {/* Card 3: Total Revenue */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-indigo-500/30 transition duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Total Revenue (Bulan Ini)</p>
                <p className="text-2xl font-extrabold text-white mt-2">Rp {totalRevenueBulanIni.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <CreditCard size={22} />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-t border-[#131d35] pt-4 mt-4 text-[10px]">
              <div className="col-span-1">
                <p className="text-gray-500 uppercase font-bold text-[9px]">Hari Ini</p>
                <p className="text-xs font-bold text-white mt-0.5">Rp 8.450k</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 uppercase font-bold text-[9px]">Minggu Ini</p>
                <p className="text-xs font-bold text-white mt-0.5">Rp 52.430k</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 uppercase font-bold text-[9px]">Tahun Ini</p>
                <p className="text-xs font-bold text-white mt-0.5">Rp 1.245jt</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-[10px] text-green-500 font-semibold gap-1">
              <ArrowUpRight size={12} />
              <span>+18% dari bulan lalu</span>
            </div>
          </div>

          {/* Card 4: Outstanding Balance */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-red-500/30 transition duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Outstanding Balance</p>
                <p className="text-2xl font-extrabold text-white mt-2">Rp 125.430.000</p>
              </div>
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                <TrendingDown size={22} />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-t border-[#131d35] pt-4 mt-4 text-[10px]">
              <div className="col-span-1">
                <p className="text-gray-500 uppercase font-bold text-[9px]">Hari Ini</p>
                <p className="text-xs font-bold text-red-400 mt-0.5">Rp 12.850k</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 uppercase font-bold text-[9px]">30 Hari</p>
                <p className="text-xs font-bold text-amber-500 mt-0.5">Rp 45.230k</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 uppercase font-bold text-[9px]">60+ Hari</p>
                <p className="text-xs font-bold text-gray-300 mt-0.5">Rp 67.350k</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-[10px] text-green-500 font-semibold gap-1">
              <ArrowUpRight size={12} />
              <span>+8% dari bulan lalu</span>
            </div>
          </div>

        </div>

        {/* ─── Middle Grid Row 1 (Revenue Line Chart, Customer Bar, Invoice Donut) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Revenue Overview */}
          <div className="lg:col-span-2 bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-white">Revenue Overview</h2>
                <p className="text-xs text-gray-500">Visualisasi cash flow bulan ini</p>
              </div>
              <select className="bg-[#0d1527] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>Bulan Ini</option>
                <option>Bulan Lalu</option>
              </select>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueOverviewData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131d35" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '10px' }} unit="jt" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1527', borderColor: '#131d35', borderRadius: '10px' }}
                    labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} name="Revenue (jt)" />
                  <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} name="Expense (jt)" />
                  <Line type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} name="Profit (jt)" />
                  <Line type="monotone" dataKey="Target" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 4" name="Target (jt)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Invoice Analytics Donut */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Invoice Analytics</h2>
              <p className="text-xs text-gray-500 mb-6">Status tagihan invoice terbit</p>
            </div>
            
            <div className="relative h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoicePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {invoicePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-black text-white">{totalInvoicesCount.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Invoice</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-xs">
              {invoicePieData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value} ({item.percentage})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ─── Middle Grid Row 2 (Payment Analytics, Top Packages, Customer Area, Status Rings) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Card 1: Payment Analytics Donut */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Payment Analytics</h2>
              <p className="text-xs text-gray-500 mb-4">Pilihan metode bayar favorit</p>
            </div>
            
            <div className="relative h-36 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-black text-white">3,656</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Total Bayar</p>
              </div>
            </div>

            <div className="space-y-1.5 mt-3 text-[11px]">
              {paymentPieData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PAYMENT_COLORS[idx] }}></span>
                    <span className="truncate max-w-[100px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value} ({item.percentage})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Top 5 Package */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Top 5 Package</h2>
                <p className="text-xs text-gray-500">Paket terlaris dipesan</p>
              </div>
              <button onClick={() => router.push('/paket')} className="text-xs text-blue-400 font-semibold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-3.5 flex-1 flex flex-col justify-center">
              {topPackages.map(pkg => (
                <div key={pkg.rank} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      pkg.rank === 1 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                      pkg.rank === 2 ? 'bg-slate-400/20 text-slate-350 border border-slate-350/30' :
                      'bg-[#131d35] text-gray-400'
                    }`}>
                      {pkg.rank}
                    </span>
                    <span className="font-semibold text-gray-250 text-white">{pkg.name}</span>
                  </div>
                  <span className="text-gray-400 font-semibold text-[11px]">{pkg.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Customer Area */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Customer Area (Top Kota)</h2>
                <p className="text-xs text-gray-500">Sebaran wilayah pelanggan</p>
              </div>
              <button onClick={() => router.push('/pelanggan')} className="text-xs text-blue-400 font-semibold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {topCities.map(city => (
                <div key={city.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{city.name}</span>
                    <span className="text-gray-400">{city.count.toLocaleString('id-ID')} ({city.percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#131d35] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${city.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Customer Status Circular Rings */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Customer Status</h2>
              <p className="text-xs text-gray-500 mb-6">Persentase & kuota pelanggan</p>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 items-center">
              {[
                { label: 'Aktif', value: activeCustomers, percentage: 84, color: 'text-green-500', stroke: '#10b981' },
                { label: 'Suspend', value: suspendedCustomers, percentage: 8, color: 'text-orange-500', stroke: '#f59e0b' },
                { label: 'Expired', value: expiredCustomers, percentage: 6, color: 'text-red-500', stroke: '#ef4444' },
                { label: 'Trial', value: trialCustomers, percentage: 2, color: 'text-indigo-400', stroke: '#6366f1' },
              ].map(ring => {
                const radius = 22
                const circum = 2 * Math.PI * radius
                const offset = circum - (ring.percentage / 100) * circum
                return (
                  <div key={ring.label} className="flex flex-col items-center text-center">
                    <div className="relative w-14 h-14">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="28" cy="28" r={radius} stroke="#131d35" strokeWidth="3" fill="transparent" />
                        <circle 
                          cx="28" 
                          cy="28" 
                          r={radius} 
                          stroke={ring.stroke} 
                          strokeWidth="3.5" 
                          fill="transparent" 
                          strokeDasharray={circum}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                        {ring.percentage}%
                      </div>
                    </div>
                    <p className="text-xs font-bold text-white mt-1.5">{ring.value}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{ring.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* ─── Middle Grid Row 3 (Customer Growth bar, Invoice Table, Recent Payment) ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Growth Bar Chart */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Customer Growth</h2>
                <p className="text-xs text-gray-500">Tren pertumbuhan 6 bulan terakhir</p>
              </div>
              <select className="bg-[#0d1527] border border-[#1e293b] rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>6 Bulan Terakhir</option>
                <option>1 Tahun Terakhir</option>
              </select>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerGrowthData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131d35" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1527', borderColor: '#131d35', borderRadius: '10px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Customer Baru" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Aktif" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Suspend" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Invoice Due Today Table */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Invoice Due Today</h2>
                <p className="text-xs text-gray-500">Harus segera diselesaikan hari ini</p>
              </div>
              <button onClick={() => router.push('/invoice')} className="text-xs text-blue-400 font-semibold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#131d35] text-gray-500 font-bold">
                    <th className="pb-2.5">Invoice #</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Nominal</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131d35]">
                  {dueTodayInvoices.map((inv) => (
                    <tr key={inv.id} className="text-white hover:bg-white/5 transition-colors">
                      <td className="py-2.5 font-mono text-[11px] text-blue-400 font-bold">{inv.id.substring(4)}</td>
                      <td className="py-2.5 font-semibold">{inv.customer}</td>
                      <td className="py-2.5 font-bold">Rp {inv.nominal.toLocaleString('id-ID')}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                          Jatuh Tempo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Payment Table */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Recent Payment</h2>
                <p className="text-xs text-gray-500">Konfirmasi pembayaran terakhir terverifikasi</p>
              </div>
              <button onClick={() => router.push('/invoice')} className="text-xs text-blue-400 font-semibold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#131d35] text-gray-500 font-bold">
                    <th className="pb-2.5">Invoice #</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Nominal</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131d35]">
                  {recentPayments.map((inv) => (
                    <tr key={inv.id} className="text-white hover:bg-white/5 transition-colors">
                      <td className="py-2.5 font-mono text-[11px] text-blue-400 font-bold">{inv.id.substring(4)}</td>
                      <td className="py-2.5 font-semibold truncate max-w-[80px]">{inv.customer}</td>
                      <td className="py-2.5 font-bold">Rp {inv.nominal.toLocaleString('id-ID')}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ─── Bottom Section Grid (Overdue Invoice, Reminder WA, Target, Timeline, Quick actions) ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Card 1: Overdue Invoice Range info */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Overdue Invoice</h2>
                <p className="text-xs text-gray-500">Rentang waktu keterlambatan</p>
              </div>
              <button onClick={() => router.push('/invoice')} className="text-xs text-blue-400 font-semibold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 flex-1 items-center">
              {[
                { label: '1-7 Hari', count: 152, amount: 'Rp 18.250.000', color: 'text-yellow-500' },
                { label: '8-14 Hari', count: 98, amount: 'Rp 15.430.000', color: 'text-orange-500' },
                { label: '15-30 Hari', count: 126, amount: 'Rp 22.880.000', color: 'text-red-500' },
                { label: '31-60 Hari', count: 45, amount: 'Rp 8.120.000', color: 'text-gray-400' }
              ].map(item => (
                <div key={item.label} className="p-3 bg-[#0d1527] border border-[#131d35] rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{item.label}</p>
                  <p className={`text-lg font-black mt-1 ${item.color}`}>{item.count}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Reminder WA details */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Reminder WA (Hari Ini)</h2>
                <p className="text-xs text-gray-500">Status pengiriman blasting WhatsApp</p>
              </div>
              <button onClick={() => router.push('/invoice')} className="text-xs text-blue-400 font-semibold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {[
                { label: 'Akan Dikirim', count: 456, color: '#3b82f6', bg: 'bg-blue-500/10' },
                { label: 'Terkirim', count: 386, color: '#10b981', bg: 'bg-green-500/10' },
                { label: 'Delivered', count: 352, color: '#6366f1', bg: 'bg-indigo-500/10' },
                { label: 'Read', count: 289, color: '#f59e0b', bg: 'bg-amber-500/10' },
                { label: 'Failed', count: 25, color: '#ef4444', bg: 'bg-red-500/10' }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-400 font-medium">{item.label}</span>
                  </div>
                  <span className="font-extrabold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Monthly Target indicators */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Monthly Target</h2>
                <p className="text-xs text-gray-500">Pencapaian KPI operasional</p>
              </div>
              <button className="text-xs text-blue-400 font-semibold hover:underline">Detail</button>
            </div>
            
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {[
                { label: 'Target Revenue', target: 'Rp 1.500.000.000', current: 'Rp 1.245.300.000', percentage: 82, stroke: 'bg-blue-500' },
                { label: 'Target Customer', target: '3.500', current: '2.742', percentage: 78, stroke: 'bg-green-500' },
                { label: 'Target Collection', target: 'Rp 1.400.000.000', current: 'Rp 1.134.200.000', percentage: 81, stroke: 'bg-indigo-500' }
              ].map(target => (
                <div key={target.label} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-gray-400">{target.label}</span>
                    <span className="text-white">{target.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#131d35] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${target.stroke} transition-all duration-500`}
                      style={{ width: `${target.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500">
                    <span>Realisasi: {target.current}</span>
                    <span>Target: {target.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Quick Action buttons */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white mb-1">Quick Action</h2>
              <p className="text-xs text-gray-500 mb-4">Akses cepat menu operasional</p>
            </div>
            
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: 'Customer', icon: Users, path: '/pelanggan', bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                { label: 'Invoice', icon: FileText, path: '/invoice', bg: 'bg-green-500/10 text-green-500 border border-green-500/20' },
                { label: 'Payment', icon: CreditCard, path: '/keuangan', bg: 'bg-amber-500/10 text-amber-500 border border-amber-500/20' },
                { label: 'Broadcast', icon: MessageSquare, path: '/invoice', bg: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' },
                { label: 'Cetak', icon: Printer, path: '/invoice', bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
                { label: 'Laporan', icon: FileSpreadsheet, path: '/keuangan', bg: 'bg-teal-500/10 text-teal-400 border border-teal-500/20' },
                { label: 'Export', icon: Download, path: '/keuangan', bg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' },
                { label: 'Import', icon: Upload, path: '/pelanggan', bg: 'bg-rose-500/10 text-rose-455 border border-rose-500/20 text-rose-400' }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(btn.path)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition hover:opacity-80 active:scale-95 ${btn.bg}`}
                  title={btn.label}
                >
                  <btn.icon size={16} />
                  <span className="text-[8px] mt-1 font-semibold truncate max-w-full">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ─── Activity Timeline Row (takes full width) ────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold text-white">Activity Timeline</h2>
              <p className="text-xs text-gray-500">Log operasional system log real-time</p>
            </div>
            <button className="text-xs text-blue-400 font-semibold hover:underline">Lihat Semua</button>
          </div>
          
          <div className="relative border-l border-[#1e293b] ml-4 pl-6 space-y-4 text-xs">
            {[
              { time: '08:35 WIB', text: 'Invoice INV-2026-0701-001 dibayar lunas oleh Andi Setiawan', color: 'bg-green-500' },
              { time: '08:20 WIB', text: 'Konfirmasi payment Rp 350.000 via QRIS terverifikasi otomatis', color: 'bg-blue-500' },
              { time: '08:10 WIB', text: 'Reminder WhatsApp telah dikirimkan ke 56 customer jatuh tempo', color: 'bg-yellow-500' },
              { time: '08:00 WIB', text: '12 invoice baru terbit otomatis untuk tagihan bulan Juli 2026', color: 'bg-indigo-500' },
              { time: '07:45 WIB', text: 'Customer baru Budi Hermawan didaftarkan dengan layanan Paket 50 Mbps', color: 'bg-emerald-500' }
            ].map((activity, idx) => (
              <div key={idx} className="relative">
                <span className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full ${activity.color} border-2 border-[#0b1329]`} />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-semibold whitespace-nowrap">{activity.time}</span>
                  <span className="text-gray-300 font-medium">{activity.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}
