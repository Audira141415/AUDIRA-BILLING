import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Settings,
  Share2,
  Clock,
  Play,
  ArrowUpRight,
  Sliders,
  ChevronDown,
  Info,
  CalendarDays,
  FileSpreadsheet,
  MoreVertical,
  ShoppingCart,
  Percent,
  Database,
  Mail,
  Bell,
  User,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const DONUT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ReportsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Dashboard Report');

  useEffect(() => {
    if (router.isReady && router.query.tab) {
      const tabQuery = router.query.tab;
      if (tabQuery === 'tax') {
        setActiveTab('Tax Report');
      } else {
        const tabMap: Record<string, string> = {
          executive: 'Executive Summary',
          customer: 'Customer Report',
          revenue: 'Revenue Report',
          invoice: 'Invoice Report',
          payment: 'Payment Report',
          aging: 'Aging Report',
          kpi: 'KPI Report',
          builder: 'Report Builder',
          archive: 'Report Archive'
        };
        if (tabMap[tabQuery as string]) {
          setActiveTab(tabMap[tabQuery as string]);
        }
      }
    }
  }, [router.isReady, router.query.tab]);

  const [periode, setPeriode] = useState('Juni 2026');
  const [pembanding, setPembanding] = useState('Mei 2026');
  const [groupBy, setGroupBy] = useState('Bulanan');
  const [entitas, setEntitas] = useState('Semua Entitas');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Tax-specific States
  const [activeTaxTab, setActiveTaxTab] = useState('Ringkasan');
  const [taxSearchTerm, setTaxSearchTerm] = useState('');
  const [taxItemsPerPage, setTaxItemsPerPage] = useState(10);
  const [taxCurrentPage, setTaxCurrentPage] = useState(1);

  // Sparkline data
  const sparklineData1 = [{ v: 12 }, { v: 14 }, { v: 13 }, { v: 16 }, { v: 15 }, { v: 18 }, { v: 17 }];
  const sparklineData2 = [{ v: 15 }, { v: 14 }, { v: 16 }, { v: 15 }, { v: 18 }, { v: 17 }, { v: 19 }];
  const sparklineData3 = [{ v: 10 }, { v: 11 }, { v: 13 }, { v: 12 }, { v: 14 }, { v: 13 }, { v: 15 }];
  const sparklineData4 = [{ v: 8 }, { v: 9 }, { v: 9 }, { v: 11 }, { v: 10 }, { v: 12 }, { v: 11 }];
  const sparklineData5 = [{ v: 80 }, { v: 82 }, { v: 85 }, { v: 84 }, { v: 87 }, { v: 86 }, { v: 89.07 }];
  const sparklineData6 = [{ v: 11000 }, { v: 11500 }, { v: 11800 }, { v: 12000 }, { v: 12200 }, { v: 12500 }, { v: 12845 }];

  // Chart 1: Tren Pendapatan & Laba
  const trendData = [
    { name: 'Jan', Pendapatan: 1500000000, Laba: 450000000 },
    { name: 'Feb', Pendapatan: 1700000000, Laba: 480000000 },
    { name: 'Mar', Pendapatan: 1600000000, Laba: 440000000 },
    { name: 'Apr', Pendapatan: 1900000000, Laba: 520000000 },
    { name: 'Mei', Pendapatan: 2200000000, Laba: 590000000 },
    { name: 'Jun', Pendapatan: 2545750000, Laba: 645320000 },
    { name: 'Jul', Pendapatan: 2400000000, Laba: 610000000 },
    { name: 'Agu', Pendapatan: 2600000000, Laba: 670000000 },
    { name: 'Sep', Pendapatan: 2300000000, Laba: 580000000 },
    { name: 'Okt', Pendapatan: 2700000000, Laba: 700000000 },
    { name: 'Nov', Pendapatan: 2800000000, Laba: 730000000 },
    { name: 'Des', Pendapatan: 2900000000, Laba: 760000000 }
  ];

  // Chart 2: Distribusi Pendapatan
  const distributionData = [
    { name: 'Internet', value: 1996250000, percentage: '78.5%' },
    { name: 'Instalasi', value: 249700000, percentage: '9.8%' },
    { name: 'Perangkat', value: 165250000, percentage: '6.5%' },
    { name: 'Lainnya', value: 134550000, percentage: '5.2%' }
  ];

  // Chart 3: Perbandingan Pendapatan
  const comparisonData = [
    { name: 'Internet', 'Mei 2026': 1800000000, 'Juni 2026': 1996250000 },
    { name: 'Instalasi', 'Mei 2026': 210000000, 'Juni 2026': 249700000 },
    { name: 'Perangkat', 'Mei 2026': 140000000, 'Juni 2026': 165250000 },
    { name: 'Lainnya', 'Mei 2026': 120000000, 'Juni 2026': 134550000 }
  ];

  // Laporan Tersedia Table Dataset
  const reportsList = [
    { id: 1, nama: 'Laporan Laba Rugi', kategori: 'Laporan Standar', desc: 'Laporan laba rugi periode bulanan', tgl: '01/07/2026 08:30', user: 'Agus Dwi Rianto' },
    { id: 2, nama: 'Laporan Neraca', kategori: 'Laporan Standar', desc: 'Laporan posisi keuangan', tgl: '01/07/2026 08:25', user: 'Agus Dwi Rianto' },
    { id: 3, nama: 'Laporan Arus Kas', kategori: 'Laporan Standar', desc: 'Laporan arus kas masuk dan keluar', tgl: '01/07/2026 07:50', user: 'Budi Santoso' },
    { id: 4, nama: 'Laporan PPN Keluaran', kategori: 'Laporan Pajak', desc: 'Laporan PPN keluaran periode', tgl: '30/06/2026 16:45', user: 'Siti Nurhaliza' },
    { id: 5, nama: 'Laporan Konsolidasi', kategori: 'Laporan Konsolidasi', desc: 'Laporan konsolidasi seluruh grup', tgl: '30/06/2026 15:30', user: 'Agus Dwi Rianto' },
    { id: 6, nama: 'Laporan Biaya Proyek', kategori: 'Laporan Kostum', desc: 'Analisis biaya per proyek', tgl: '30/06/2026 14:20', user: 'Dewi Lestari' },
    { id: 7, nama: 'Laporan Anggaran vs Realisasi', kategori: 'Laporan Manajerial', desc: 'Perbandingan anggaran dan realisasi', tgl: '30/06/2026 13:10', user: 'Budi Santoso' },
    { id: 8, nama: 'Laporan Aging Piutang', kategori: 'Aging Report', desc: 'Analisis umur piutang pelanggan', tgl: '29/06/2026 18:40', user: 'Siti Nurhaliza' },
    { id: 9, nama: 'Laporan Collection', kategori: 'Collection Report', desc: 'Analisis penagihan pelanggan', tgl: '29/06/2026 17:25', user: 'Dewi Lestari' },
    { id: 10, nama: 'Laporan KPI Keuangan', kategori: 'KPI Report', desc: 'KPI keuangan perusahaan', tgl: '29/06/2026 16:10', user: 'Agus Dwi Rianto' },
  ];

  // Scheduled reports
  const scheduledReports = [
    { id: 1, nama: 'Laporan Laba Rugi Bulanan', jadwal: 'Setiap tanggal 1, 08.00 WIB', status: 'Aktif', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    { id: 2, nama: 'Laporan Arus Kas Mingguan', jadwal: 'Setiap Senin, 09.00 WIB', status: 'Aktif', color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
    { id: 3, nama: 'Laporan Aging Piutang', jadwal: 'Setiap Jumat, 17.00 WIB', status: 'Aktif', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { id: 4, nama: 'Laporan KPI Keuangan', jadwal: 'Setiap tanggal 5, 08.30 WIB', status: 'Aktif', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' }
  ];

  const tabs = [
    'Dashboard Report', 'Executive Summary', 'Customer Report', 'Revenue Report', 
    'Invoice Report', 'Payment Report', 'Finance Summary', 'Aging Report', 
    'KPI Report', 'Report Builder', 'Report Archive'
  ];

  // Helper to colorize badges
  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'Laporan Standar': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      case 'Laporan Pajak': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Laporan Konsolidasi': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Laporan Kostum': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Laporan Manajerial': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num).replace('Rp', 'Rp ');
  };

  return (
    <Layout>
      <div className="bg-[#050B14] text-slate-200 min-h-screen p-6 font-sans antialiased selection:bg-blue-500 selection:text-white">
        
        {/* Top Mini Header / Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Finance</span>
            <span>&gt;</span>
            <span className="text-blue-400 font-medium">Reports</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* System Status */}
            <div className="flex items-center gap-2 bg-[#0B1528] border border-blue-950 px-3.5 py-1.5 rounded-full text-xs">
              <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-medium">01 Juli 2026 <span className="text-slate-500">|</span> 08:35 WIB</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
              <span className="text-emerald-400 font-semibold text-[11px]">Status Sistem: Normal</span>
            </div>
            
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari invoice, customer, transaksi..."
                className="bg-[#0B1528] border border-blue-950 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Reports</h1>
            <p className="text-xs text-slate-400 mt-1">Pusat laporan keuangan dan bisnis untuk analisis dan pengambilan keputusan.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg shadow-lg hover:shadow-blue-600/10 transition-all">
              <Plus className="w-4 h-4" />
              <span>Buat Laporan</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            <button className="flex items-center gap-2 bg-[#0B1528] hover:bg-[#0f1d38] border border-blue-950 text-slate-200 text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-colors">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Jadwalkan Laporan</span>
            </button>
          </div>
        </div>

        {/* Secondary Sub-navigation Tabs */}
        <div className="border-b border-slate-800/80 mb-6 scrollbar-thin overflow-x-auto whitespace-nowrap">
          <div className="flex gap-1.5 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Filters Area */}
        <div className="bg-[#0B1528]/40 border border-blue-950/60 rounded-xl p-4 mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Periode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Periode</label>
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="bg-[#050B14] border border-blue-950 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 min-w-[140px]"
              >
                <option>Juni 2026</option>
                <option>Mei 2026</option>
                <option>April 2026</option>
              </select>
            </div>

            {/* Dibandingkan Dengan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Dibandingkan Dengan</label>
              <select
                value={pembanding}
                onChange={(e) => setPembanding(e.target.value)}
                className="bg-[#050B14] border border-blue-950 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 min-w-[140px]"
              >
                <option>Mei 2026</option>
                <option>April 2026</option>
                <option>Maret 2026</option>
              </select>
            </div>

            {/* Group By */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="bg-[#050B14] border border-blue-950 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 min-w-[120px]"
              >
                <option>Bulanan</option>
                <option>Mingguan</option>
                <option>Harian</option>
              </select>
            </div>

            {/* Entitas / Grup */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Entitas / Grup</label>
              <select
                value={entitas}
                onChange={(e) => setEntitas(e.target.value)}
                className="bg-[#050B14] border border-blue-950 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 min-w-[140px]"
              >
                <option>Semua Entitas</option>
                <option>Entitas Utama</option>
                <option>Cabang Jakarta</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#0B1528] hover:bg-[#0f1d38] border border-blue-950 text-slate-300 text-xs px-3.5 py-2 rounded-lg transition-colors">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter Lainnya</span>
            </button>
            <button className="bg-transparent hover:bg-slate-800/30 text-slate-400 hover:text-slate-200 text-xs px-3.5 py-2 rounded-lg transition-colors border border-transparent">
              Reset
            </button>
          </div>
        </div>

        {/* 6 Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4.5 mb-6">
          {/* Card 1: Total Pendapatan */}
          <div className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-900/60 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-blue-600/10 p-2 rounded-lg text-blue-500">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                <span>↑ 12.85%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Pendapatan</p>
              <h3 className="text-sm font-bold text-white mt-1">{formatRupiah(2545750000)}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">dari Mei 2026</p>
            </div>
            {/* Sparkline */}
            <div className="h-6 mt-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData1}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Total Tagihan */}
          <div className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-900/60 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-emerald-600/10 p-2 rounded-lg text-emerald-500">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                <span>↑ 10.44%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Tagihan</p>
              <h3 className="text-sm font-bold text-white mt-1">{formatRupiah(2380450000)}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">dari Mei 2026</p>
            </div>
            {/* Sparkline */}
            <div className="h-6 mt-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData2}>
                  <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3: Total Pembayaran */}
          <div className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-900/60 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-amber-600/10 p-2 rounded-lg text-amber-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                <span>↑ 11.36%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Pembayaran</p>
              <h3 className="text-sm font-bold text-white mt-1">{formatRupiah(2120350000)}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">dari Mei 2026</p>
            </div>
            {/* Sparkline */}
            <div className="h-6 mt-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData3}>
                  <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 4: Laba Bersih */}
          <div className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-900/60 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-purple-600/10 p-2 rounded-lg text-purple-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                <span>↑ 16.12%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Laba Bersih</p>
              <h3 className="text-sm font-bold text-white mt-1">{formatRupiah(645320000)}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">dari Mei 2026</p>
            </div>
            {/* Sparkline */}
            <div className="h-6 mt-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData4}>
                  <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 5: Collection Rate */}
          <div className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-900/60 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-cyan-600/10 p-2 rounded-lg text-cyan-500">
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                <span>↑ 3.21%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Collection Rate</p>
              <h3 className="text-sm font-bold text-white mt-1">89.07%</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">dari Mei 2026</p>
            </div>
            {/* Sparkline */}
            <div className="h-6 mt-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData5}>
                  <Line type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 6: Total Customer */}
          <div className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-900/60 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-rose-600/10 p-2 rounded-lg text-rose-500">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                <span>↑ 7.81%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Customer</p>
              <h3 className="text-sm font-bold text-white mt-1">12.845</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">dari Mei 2026</p>
            </div>
            {/* Sparkline */}
            <div className="h-6 mt-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData6}>
                  <Line type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts & Visualization Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Tren Pendapatan & Laba Chart (5 cols) */}
          <div className="lg:col-span-5 bg-[#0B1528]/60 border border-blue-950 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4.5">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Tren Pendapatan & Laba</h3>
              <select className="bg-[#050B14] border border-blue-950 rounded px-2 py-1 text-[10px] text-slate-300">
                <option>Periode Ini</option>
                <option>Tahun Lalu</option>
              </select>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F1D38" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={9} />
                  <YAxis stroke="#64748B" fontSize={9} tickFormatter={(v) => `${(v / 1e9).toFixed(1)}B`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1528', borderColor: '#1E293B', borderRadius: 8 }}
                    labelStyle={{ color: '#F1F5F9', fontSize: 11, fontWeight: 'bold' }}
                    itemStyle={{ fontSize: 10 }}
                    formatter={(v: any) => [formatRupiah(v), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, marginTop: 10 }} />
                  <Line type="monotone" dataKey="Pendapatan" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} name="Pendapatan" />
                  <Line type="monotone" dataKey="Laba" stroke="#10b981" strokeWidth={2} name="Laba Bersih" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribusi Pendapatan Donut Chart (3 cols) */}
          <div className="lg:col-span-3 bg-[#0B1528]/60 border border-blue-950 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4.5">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Distribusi Pendapatan</h3>
              <select className="bg-[#050B14] border border-blue-950 rounded px-2 py-1 text-[10px] text-slate-300">
                <option>Periode Ini</option>
                <option>Tahun Lalu</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 items-center gap-4 h-60">
              <div className="h-36 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total</span>
                  <span className="text-xs font-bold text-white mt-0.5">{formatRupiah(2545750000)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {distributionData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs border-b border-slate-900 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}></span>
                      <span className="text-slate-300 text-[11px]">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] mr-2 font-medium">{item.percentage}</span>
                      <span className="text-white font-semibold text-[11px]">{formatRupiah(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Perbandingan Pendapatan Chart (4 cols) */}
          <div className="lg:col-span-4 bg-[#0B1528]/60 border border-blue-950 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4.5">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Perbandingan Pendapatan</h3>
              <select className="bg-[#050B14] border border-blue-950 rounded px-2 py-1 text-[10px] text-slate-300">
                <option>Periode Ini</option>
                <option>Tahun Lalu</option>
              </select>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F1D38" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={9} />
                  <YAxis stroke="#64748B" fontSize={9} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1528', borderColor: '#1E293B', borderRadius: 8 }}
                    labelStyle={{ color: '#F1F5F9', fontSize: 11, fontWeight: 'bold' }}
                    itemStyle={{ fontSize: 10 }}
                    formatter={(v: any) => [formatRupiah(v), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, marginTop: 10 }} />
                  <Bar dataKey="Mei 2026" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Juni 2026" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Bottom Section: Laporan Tersedia & Sidebar Laporan Terjadwal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Laporan Tersedia Table (2 cols width) */}
          <div className="xl:col-span-2 bg-[#0B1528]/60 border border-blue-950 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-900">
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Daftar Laporan Tersedia</h3>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Cari laporan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-[#050B14] border border-blue-950 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 w-44 transition-colors"
                    />
                  </div>
                  <button className="flex items-center gap-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <Filter className="w-3 h-3" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-900/60 uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-3 px-2 text-center w-8">No</th>
                      <th className="py-3 px-3">Nama Laporan</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Deskripsi</th>
                      <th className="py-3 px-3">Terakhir Dibuat</th>
                      <th className="py-3 px-3">Dibuat Oleh</th>
                      <th className="py-3 px-3 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40">
                    {reportsList
                      .filter(item => item.nama.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                          <td className="py-3 px-2 text-center text-slate-500 font-medium">{item.id}</td>
                          <td className="py-3 px-3 font-semibold text-slate-200">{item.nama}</td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getBadgeColor(item.kategori)}`}>
                              {item.kategori}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate">{item.desc}</td>
                          <td className="py-3 px-3 text-slate-400 font-medium text-[11px]">{item.tgl}</td>
                          <td className="py-3 px-3 text-slate-400">{item.user}</td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="Lihat">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="Unduh">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="Bagikan">
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-900">
              <span className="text-xs text-slate-400">
                Menampilkan 1 - 10 dari 48 data
              </span>
              
              <div className="flex items-center gap-4.5">
                <div className="flex items-center gap-1.5">
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#050B14] border border-blue-950 text-slate-500 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-600 font-semibold text-xs text-white">
                    1
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#050B14] border border-blue-950 font-medium text-xs text-slate-400 hover:text-white transition-colors">
                    2
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#050B14] border border-blue-950 font-medium text-xs text-slate-400 hover:text-white transition-colors">
                    3
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#050B14] border border-blue-950 font-medium text-xs text-slate-400 hover:text-white transition-colors">
                    4
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#050B14] border border-blue-950 font-medium text-xs text-slate-400 hover:text-white transition-colors">
                    5
                  </button>
                  <span className="text-slate-600 font-medium text-xs px-1">...</span>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#050B14] border border-blue-950 text-slate-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-[#050B14] border border-blue-950 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value={10}>10 / halaman</option>
                    <option value={20}>20 / halaman</option>
                    <option value={50}>50 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar Widget (1 col width) */}
          <div className="flex flex-col gap-6">
            
            {/* Laporan Terjadwal */}
            <div className="bg-[#0B1528]/60 border border-blue-950 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Laporan Terjadwal</h3>
                <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold">Lihat Semua</button>
              </div>
              <div className="flex flex-col gap-3">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-[#050B14] border border-blue-950/60 hover:border-blue-900/60 transition-colors">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{report.nama}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{report.jadwal}</span>
                      </p>
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aksi Cepat */}
            <div className="bg-[#0B1528]/60 border border-blue-950 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Aksi Cepat</h3>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all text-center gap-1.5 shadow-md">
                  <Plus className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Buat Laporan</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-purple-600/90 hover:bg-purple-500 text-white transition-all text-center gap-1.5 shadow-md">
                  <Sliders className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Report Builder</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white transition-all text-center gap-1.5 shadow-md">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Jadwalkan</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white transition-all text-center gap-1.5 shadow-md">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Export Center</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white transition-all text-center gap-1.5 shadow-md">
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Laporan Tersimpan</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-700/90 hover:bg-slate-600 text-white transition-all text-center gap-1.5 shadow-md">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Import Data</span>
                </button>
              </div>
            </div>

            {/* Insight & Rekomendasi */}
            <div className="bg-[#0B1528]/60 border border-blue-950 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>Insight & Rekomendasi</span>
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 flex flex-col gap-2.5 pl-4 list-disc marker:text-blue-500">
                  <li>Pendapatan naik <span className="text-emerald-400 font-semibold">12.85%</span> dibanding periode sebelumnya.</li>
                  <li>Collection rate meningkat <span className="text-emerald-400 font-semibold">3.21%</span> menjadi <span className="text-white font-semibold">89.07%</span>.</li>
                  <li>Piutang overdue lebih dari 30 hari meningkat <span className="text-rose-400 font-semibold">8.45%</span>.</li>
                  <li>Laba bersih naik <span className="text-emerald-400 font-semibold">16.12%</span> dibanding periode sebelumnya.</li>
                </ul>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold mt-4 flex items-center gap-1 hover:gap-2 transition-all self-start">
                <span>Lihat Detail Analisis</span>
                <span>&gt;</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
