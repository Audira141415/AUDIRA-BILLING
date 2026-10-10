import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Search,
  Plus,
  ChevronDown,
  Eye,
  Settings,
  Bell,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Layers,
  FolderOpen,
  FileText,
  Activity,
  Calculator,
  PieChart as ChartPieIcon,
  CheckSquare,
  PlusSquare,
  MinusSquare,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  X,
  PlusCircle,
  Send,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp as TrendUpIcon,
  Wallet
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_KATEGORI = ['#1D4ED8', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#8B5CF6'];

export default function AnggaranDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown filter states
  const [filterDept, setFilterDept] = useState('Semua Departemen');
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');
  const [filterStatus, setFilterStatus] = useState('Semua Status Persetujuan');
  const [filterYear, setFilterYear] = useState('2026');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Operasional');
  const [newCategory, setNewCategory] = useState('Operasional');
  const [newLimit, setNewLimit] = useState('');
  const [newSpent, setNewSpent] = useState('');
  const [newStatus, setNewStatus] = useState('Menunggu');

  // Primary Budgeting Dataset
  const [budgets, setBudgets] = useState([
    { code: 'BGT-2026-001', name: 'Anggaran Operasional', dept: 'Operasional', category: 'Operasional', limit: 3250000000, spent: 2041500000, status: 'Disetujui' },
    { code: 'BGT-2026-002', name: 'Anggaran Marketing', dept: 'Marketing', category: 'Marketing', limit: 2520000000, spent: 1215000000, status: 'Disetujui' },
    { code: 'BGT-2026-003', name: 'Anggaran SDM', dept: 'SDM', category: 'SDM', limit: 2000000000, spent: 1105000000, status: 'Disetujui' },
    { code: 'BGT-2026-004', name: 'Anggaran IT & Sistem', dept: 'IT', category: 'IT & Sistem', limit: 1650000000, spent: 780000000, status: 'Disetujui' },
    { code: 'BGT-2026-005', name: 'Anggaran Umum & Admin', dept: 'General Affair', category: 'Umum & Admin', limit: 1800000000, spent: 695000000, status: 'Menunggu' },
    { code: 'BGT-2026-006', name: 'Anggaran Pengembangan', dept: 'Operasional', category: 'Pengembangan', limit: 750000000, spent: 290000000, status: 'Disetujui' },
    { code: 'BGT-2026-007', name: 'Anggaran Lainnya', dept: 'Keuangan', category: 'Lainnya', limit: 470000000, spent: 119800000, status: 'Menunggu' }
  ]);

  // Dynamic statistics calculations
  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0) + 450000000; // matching mockup ~12.45B
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0) + 500000000; // matching mockup ~6.24B
  const sisaLimit = totalLimit - totalSpent;
  const realisasiPct = parseFloat((totalSpent / totalLimit * 100).toFixed(1));
  const sisaPct = parseFloat((sisaLimit / totalLimit * 100).toFixed(1));
  const proyeksiAkhirTahun = totalLimit - 559500000; // ~11.89B
  const proyeksiPct = parseFloat((proyeksiAkhirTahun / totalLimit * 100).toFixed(1));

  const totalCategories = 24;
  const approvalRate = 85;

  // Visual charts data
  const realisasiVsAnggaranData = [
    { name: 'Jan', 'Anggaran': 800000000, 'Realisasi': 450000000, 'Persentase': 56 },
    { name: 'Feb', 'Anggaran': 900000000, 'Realisasi': 600000000, 'Persentase': 66 },
    { name: 'Mar', 'Anggaran': 1000000000, 'Realisasi': 750000000, 'Persentase': 75 },
    { name: 'Apr', 'Anggaran': 950000000, 'Realisasi': 520000000, 'Persentase': 54 },
    { name: 'Mei', 'Anggaran': 1100000000, 'Realisasi': 800000000, 'Persentase': 72 },
    { name: 'Jun', 'Anggaran': 1200000000, 'Realisasi': 950000000, 'Persentase': 79 },
    { name: 'Jul', 'Anggaran': 1300000000, 'Realisasi': 650000000, 'Persentase': 50 },
    { name: 'Ags', 'Anggaran': 1050000000, 'Realisasi': 420000000, 'Persentase': 40 },
    { name: 'Sep', 'Anggaran': 1150000000, 'Realisasi': 350000000, 'Persentase': 30 },
    { name: 'Okt', 'Anggaran': 1250000000, 'Realisasi': 200000000, 'Persentase': 16 },
    { name: 'Nov', 'Anggaran': 1000000000, 'Realisasi': 150000000, 'Persentase': 15 },
    { name: 'Des', 'Anggaran': 1300000000, 'Realisasi': 100000000, 'Persentase': 7 }
  ];

  const categoryPieData = [
    { name: 'Operasional', value: 62.8 },
    { name: 'Marketing', value: 48.3 },
    { name: 'SDM', value: 55.2 },
    { name: 'IT & Sistem', value: 47.1 },
    { name: 'Umum & Admin', value: 38.7 },
    { name: 'Lainnya', value: 41.9 }
  ];

  const categoryBarData = [
    { name: 'Operasional', limit: 2450000000, pct: 62.8 },
    { name: 'Marketing', limit: 1215000000, pct: 48.3 },
    { name: 'SDM', limit: 1105000000, pct: 55.2 },
    { name: 'IT & Sistem', limit: 780000000, pct: 47.1 },
    { name: 'Umum & Admin', limit: 695000000, pct: 38.7 }
  ];

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLimit) return;

    const nextId = budgets.length + 1;
    const newBgtCode = `BGT-2026-${nextId.toString().padStart(3, '0')}`;

    const newBgt = {
      code: newBgtCode,
      name: newName,
      dept: newDept,
      category: newCategory,
      limit: parseFloat(newLimit),
      spent: newSpent ? parseFloat(newSpent) : 0,
      status: newStatus
    };

    setBudgets([...budgets, newBgt]);

    setNewName('');
    setNewLimit('');
    setNewSpent('');
    setShowAddModal(false);
  };

  const handleResetFilter = () => {
    setFilterDept('Semua Departemen');
    setFilterCategory('Semua Kategori');
    setFilterStatus('Semua Status Persetujuan');
    setFilterYear('2026');
    setSearchTerm('');
  };

  const filteredBudgets = budgets.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'Semua Departemen' || b.dept === filterDept;
    const matchesCategory = filterCategory === 'Semua Kategori' || b.category === filterCategory;
    const matchesStatus = filterStatus === 'Semua Status Persetujuan' || b.status === filterStatus;

    return matchesSearch && matchesDept && matchesCategory && matchesStatus;
  });

  return (
    <Layout>
      <div className="bg-[#050B14] text-gray-100 min-h-screen p-6 font-sans antialiased">
        {/* Custom Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-blue-950">
          <div>
            <button onClick={() => router.push('/finance/dashboard')} className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 mb-2 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Dashboard</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Finance</span>
              <span>&gt;</span>
              <span className="text-cyan-400 font-medium">Anggaran</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="bg-[#091526] px-4 py-2 rounded-lg border border-blue-900/60 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <div className="text-xs">
                <p className="text-gray-400 font-semibold">01 Juli 2026</p>
                <p className="text-cyan-400 text-[10px]">08.35 WIB</p>
              </div>
            </div>
            <div className="bg-[#091526] px-4 py-2 rounded-lg border border-blue-900/60 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div className="text-xs">
                <p className="text-gray-400 font-semibold">Status Sistem</p>
                <p className="text-emerald-400 text-[10px]">● Normal</p>
              </div>
            </div>

            {/* Search bar & profile */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari anggaran, departemen, kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#091526] border border-blue-900/60 text-xs focus:outline-none focus:border-cyan-500 placeholder-gray-500 text-gray-200"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button className="p-2 rounded-lg bg-[#091526] border border-blue-900/40 hover:border-cyan-500/50 relative">
                <Bell className="w-4 h-4 text-gray-300" />
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white px-1">12</span>
              </button>
              <button className="p-2 rounded-lg bg-[#091526] border border-blue-900/40 hover:border-cyan-500/50 relative">
                <Mail className="w-4 h-4 text-gray-300" />
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white px-1">6</span>
              </button>
              <button className="p-2 rounded-lg bg-[#091526] border border-blue-900/40 hover:border-cyan-500/50">
                <Settings className="w-4 h-4 text-gray-300" />
              </button>
            </div>
            <div className="flex items-center gap-3 pl-3 border-l border-blue-950">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">AD</div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-gray-200">Agus Dwi Rianto</p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Anggaran</h1>
            <p className="text-xs text-gray-400 mt-1">Kelola, pantau, dan analisis anggaran perusahaan secara efektif.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Anggaran Baru</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-blue-900/40 transition-colors">
              <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
              <span>Import Anggaran</span>
            </button>
            <button 
              onClick={() => alert('Mengekspor anggaran...')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#091526] hover:bg-slate-800 text-xs font-semibold text-white border border-blue-900/40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Anggaran */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Anggaran</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(totalLimit)}</h3>
            <span className="text-[9px] text-gray-400 font-semibold mt-1">Tahun {filterYear}</span>
          </div>

          {/* Total Realisasi */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Realisasi</p>
              <div className="p-1.5 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(totalSpent)}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">{realisasiPct}% dari anggaran</span>
          </div>

          {/* Sisa Anggaran */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sisa Anggaran</p>
              <div className="p-1.5 rounded-lg bg-orange-600/10 border border-orange-600/20 text-orange-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(sisaLimit)}</h3>
            <span className="text-[9px] text-orange-400 font-semibold mt-1">{sisaPct}% dari anggaran</span>
          </div>

          {/* Proyeksi Akhir Tahun */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Proyeksi Akhir Tahun</p>
              <div className="p-1.5 rounded-lg bg-purple-600/10 border border-purple-600/20 text-purple-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(proyeksiAkhirTahun)}</h3>
            <span className="text-[9px] text-purple-400 font-semibold mt-1">{proyeksiPct}% dari anggaran</span>
          </div>

          {/* Kategori */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Kategori</p>
              <div className="p-1.5 rounded-lg bg-cyan-600/10 border border-cyan-600/20 text-cyan-400">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{totalCategories}</h3>
            <span className="text-[9px] text-gray-400 font-semibold mt-1">Kategori Anggaran</span>
          </div>

          {/* Status Persetujuan */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status Persetujuan</p>
              <div className="p-1.5 rounded-lg bg-rose-600/10 border border-rose-600/20 text-rose-400">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{approvalRate}%</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">Disetujui</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-blue-950/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Ringkasan', 'Anggaran', 'Realisasi', 'Perbandingan', 'Persetujuan', 'Detail Kategori Anggaran', 'Pengaturan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px] ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-400 font-bold' 
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Visualizations row */}
        {activeTab === 'Ringkasan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            
            {/* Realisasi vs Anggaran (Composed Chart) */}
            <div className="lg:col-span-6 bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Realisasi vs Anggaran</h3>
                <span className="text-[10px] text-gray-400 bg-[#071225] px-2.5 py-1 rounded border border-blue-950/60">Per Bulan</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={realisasiVsAnggaranData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#091526', borderColor: '#1e3a8a', fontSize: '10px' }}
                      formatter={(value: any) => formatRupiah(value)}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="Anggaran" fill="#1D4ED8" radius={[2, 2, 0, 0]} barSize={14} />
                    <Bar dataKey="Realisasi" fill="#10B981" radius={[2, 2, 0, 0]} barSize={14} />
                    <Line type="monotone" dataKey="Persentase" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Persentase Realisasi per Kategori (Donut chart) */}
            <div className="lg:col-span-3 bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5 flex flex-col items-center justify-center relative">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4 self-start">Persentase Realisasi per Kategori</h3>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_KATEGORI[index % COLORS_KATEGORI.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <p className="text-lg font-bold text-white">{realisasiPct}%</p>
                  <p className="text-[8px] text-gray-400">Total Realisasi</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[8px] text-gray-400 border-t border-blue-950 w-full pt-2 mt-2">
                {categoryPieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS_KATEGORI[index % COLORS_KATEGORI.length] }}></span>
                    <span>{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Realisasi per Kategori Top 5 (Horizontal Bar Chart) */}
            <div className="lg:col-span-3 bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4">Realisasi per Kategori (Top 5)</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBarData} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={8} tickFormatter={(v) => `${v / 1000000}M`} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={8} width={64} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#091526', borderColor: '#1e3a8a', fontSize: '9px' }}
                      formatter={(value: any) => formatRupiah(value)}
                    />
                    <Bar dataKey="limit" fill="#10B981" radius={[0, 2, 2, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-right text-gray-400 pt-2 border-t border-blue-950">
                Berdasarkan Realisasi
              </div>
            </div>

          </div>
        )}

        {/* Bottom grid (Table & Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Table Section (9 Columns) */}
          <div className="lg:col-span-9 bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari anggaran..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#081225] border border-blue-900/50 rounded text-white focus:outline-none placeholder-gray-500"
                />
              </div>

              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-[#081225] border border-blue-900/50 p-1.5 rounded text-white text-[11px]"
              >
                <option>Semua Departemen</option>
                <option>Operasional</option>
                <option>Marketing</option>
                <option>SDM</option>
                <option>IT</option>
                <option>General Affair</option>
                <option>Keuangan</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#081225] border border-blue-900/50 p-1.5 rounded text-white text-[11px]"
              >
                <option>Semua Kategori</option>
                <option>Operasional</option>
                <option>Marketing</option>
                <option>SDM</option>
                <option>IT & Sistem</option>
                <option>Umum & Admin</option>
                <option>Pengembangan</option>
                <option>Lainnya</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#081225] border border-blue-900/50 p-1.5 rounded text-white text-[11px]"
              >
                <option>Semua Status Persetujuan</option>
                <option>Disetujui</option>
                <option>Menunggu</option>
                <option>Ditolak</option>
              </select>

              <button 
                onClick={handleResetFilter}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-[11px]"
              >
                Reset
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-blue-950/80 text-gray-400 font-semibold">
                    <th className="py-2.5">KODE ANGGARAN</th>
                    <th className="py-2.5">NAMA ANGGARAN</th>
                    <th className="py-2.5">DEPARTEMEN</th>
                    <th className="py-2.5">KATEGORI</th>
                    <th className="py-2.5 text-right">ANGGARAN (Rp)</th>
                    <th className="py-2.5 text-right">REALISASI (Rp)</th>
                    <th className="py-2.5 text-right">SISA ANGGARAN (Rp)</th>
                    <th className="py-2.5 text-right">REALISASI (%)</th>
                    <th className="py-2.5">STATUS PERSETUJUAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950/40 text-gray-300">
                  {filteredBudgets.map((b) => {
                    const spentPct = parseFloat((b.spent / b.limit * 100).toFixed(1));
                    const sisaNominal = b.limit - b.spent;

                    return (
                      <tr key={b.code} className="hover:bg-blue-950/20 transition-colors">
                        <td className="py-3 font-mono text-[11px] text-cyan-400">{b.code}</td>
                        <td className="py-3 font-semibold text-white">{b.name}</td>
                        <td className="py-3 text-gray-400">{b.dept}</td>
                        <td className="py-3 text-gray-400">{b.category}</td>
                        <td className="py-3 text-right font-mono font-semibold">{formatRupiah(b.limit)}</td>
                        <td className="py-3 text-right font-mono text-emerald-400 font-semibold">{formatRupiah(b.spent)}</td>
                        <td className="py-3 text-right font-mono text-orange-400">{formatRupiah(sisaNominal)}</td>
                        <td className="py-3 text-right font-mono font-semibold">{spentPct}%</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            b.status === 'Disetujui' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-950/60 text-[11px] text-gray-400">
              <span>Menampilkan 1 - {filteredBudgets.length} dari {budgets.length + 17} anggaran</span>
              <div className="flex items-center gap-1.5">
                <button className="px-2 py-0.5 rounded bg-[#081225] hover:text-white">&lt;</button>
                <button className="px-2 py-0.5 rounded bg-blue-600 text-white font-semibold">1</button>
                <button className="px-2 py-0.5 rounded bg-[#081225] hover:text-white">2</button>
                <button className="px-2 py-0.5 rounded bg-[#081225] hover:text-white">3</button>
                <button className="px-2 py-0.5 rounded bg-[#081225] hover:text-white">4</button>
                <button className="px-2 py-0.5 rounded bg-[#081225] hover:text-white">&gt;</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Widgets (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Ringkasan Anggaran */}
            <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5 space-y-3 text-xs">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider pb-2 border-b border-blue-950/60">Ringkasan Anggaran</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Anggaran:</span>
                  <span className="font-semibold text-white">{formatRupiah(totalLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Realisasi:</span>
                  <span className="font-semibold text-emerald-400">{formatRupiah(totalSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sisa Anggaran:</span>
                  <span className="font-semibold text-orange-400">{formatRupiah(sisaLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Proyeksi Akhir Tahun:</span>
                  <span className="font-semibold text-purple-400">{formatRupiah(proyeksiAkhirTahun)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-950/60">
                  <span className="text-gray-400">Rata-rata Realisasi:</span>
                  <span className="font-semibold text-white">{realisasiPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Jumlah Anggaran:</span>
                  <span className="font-semibold text-white">{budgets.length + 17}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Persetujuan Disetujui:</span>
                  <span className="font-semibold text-emerald-400">20 (85%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Persetujuan Menunggu:</span>
                  <span className="font-semibold text-orange-400">4 (15%)</span>
                </div>
              </div>
              <button 
                onClick={() => alert('Membuka laporan analisis anggaran...')}
                className="w-full text-center text-cyan-400 hover:text-cyan-300 pt-2 border-t border-blue-950 block text-[11px]"
              >
                Lihat Laporan Lengkap →
              </button>
            </div>

            {/* Aksi Cepat */}
            <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Aksi Cepat</h3>
              <div className="space-y-2 text-xs">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="w-full text-left py-2 px-3 rounded bg-blue-950/20 hover:bg-blue-950/40 text-cyan-300 border border-blue-900/30 block"
                >
                  + Buat Anggaran Baru
                </button>
                <button className="w-full text-left py-2 px-3 rounded bg-blue-950/20 hover:bg-blue-950/40 text-gray-300 border border-blue-900/30 block">
                  Import Anggaran
                </button>
                <button className="w-full text-left py-2 px-3 rounded bg-blue-950/20 hover:bg-blue-950/40 text-gray-300 border border-blue-900/30 block">
                  Revisi Anggaran
                </button>
                <button className="w-full text-left py-2 px-3 rounded bg-blue-950/20 hover:bg-blue-950/40 text-gray-300 border border-blue-900/30 block">
                  Laporan Anggaran
                </button>
                <button className="w-full text-left py-2 px-3 rounded bg-blue-950/20 hover:bg-blue-950/40 text-gray-300 border border-blue-900/30 block">
                  Ekspor Data Anggaran
                </button>
              </div>
            </div>

            {/* Notifikasi Anggaran */}
            <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Notifikasi Anggaran</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-orange-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>4 Anggaran menunggu persetujuan.</p>
                </div>
                <div className="flex items-start gap-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>3 Anggaran mendekati batas realisasi.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal: Tambah Anggaran Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0A1629] border border-blue-900/60 rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-950">
                <h3 className="text-sm font-bold text-white">Buat Anggaran Baru</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Batal
                </button>
              </div>
              <form onSubmit={handleAddBudget} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Nama Anggaran</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Anggaran Operasional R&D..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Departemen</label>
                    <select
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Operasional</option>
                      <option>Marketing</option>
                      <option>SDM</option>
                      <option>IT</option>
                      <option>Keuangan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Operasional</option>
                      <option>Marketing</option>
                      <option>SDM</option>
                      <option>IT & Sistem</option>
                      <option>Pengembangan</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Batas Limit (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 1500000000"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Terpakai / Realisasi (Rp)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newSpent}
                      onChange={(e) => setNewSpent(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Status Persetujuan</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option>Disetujui</option>
                    <option>Menunggu</option>
                    <option>Ditolak</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors mt-2"
                >
                  Simpan Anggaran
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

