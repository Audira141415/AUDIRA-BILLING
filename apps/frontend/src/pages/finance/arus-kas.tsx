import { useState, useEffect } from 'react';
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
  PlusCircle,
  Settings,
  Bell,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRightLeft,
  Briefcase,
  FileSpreadsheet,
  RefreshCw,
  Wallet,
  Activity,
  Calculator,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  PlusSquare,
  MinusSquare,
  CheckSquare,
  Share2,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_METODE = ['#1D4ED8', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function ArusKasDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'MASUK' | 'KELUAR'>('MASUK');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newMethod, setNewMethod] = useState('Transfer Bank');
  const [newAccount, setNewAccount] = useState('Bank BCA');
  const [newAmount, setNewAmount] = useState('');

  // Primary Financial States
  const [saldoAwal, setSaldoAwal] = useState(68420000);
  const [accounts, setAccounts] = useState([
    { id: 'bca', name: 'Bank BCA', balance: 45250000 },
    { id: 'mandiri', name: 'Bank Mandiri', balance: 32100000 },
    { id: 'bri', name: 'Bank BRI', balance: 18500000 },
    { id: 'ovo', name: 'OVO', balance: 6850000 },
    { id: 'gopay', name: 'GoPay', balance: 4250000 },
    { id: 'dana', name: 'DANA', balance: 4150000 },
    { id: 'tunai', name: 'Tunai', balance: 5500000 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, tanggal: '01/07/2026 09:21', jenis: 'Kas Masuk', deskripsi: 'Pembayaran Invoice INV/2026/07/001245 - Budi Santoso', kategori: 'Pendapatan', metode: 'Transfer Bank', akun: 'Bank BCA', masuk: 550000, keluar: 0 },
    { id: 2, tanggal: '01/07/2026 08:45', jenis: 'Kas Masuk', deskripsi: 'Pembayaran Invoice INV/2026/07/001244 - Andi Pratama', kategori: 'Pendapatan', metode: 'E-Wallet', akun: 'OVO', masuk: 150000, keluar: 0 },
    { id: 3, tanggal: '01/07/2026 08:10', jenis: 'Kas Keluar', deskripsi: 'Pembayaran Gaji Karyawan Juni 2026', kategori: 'Pengeluaran Operasional', metode: 'Transfer Bank', akun: 'Bank Mandiri', masuk: 0, keluar: 8500000 },
    { id: 4, tanggal: '30/06/2026 17:22', jenis: 'Kas Masuk', deskripsi: 'Pembayaran Invoice INV/2026/06/002542 - Siti Aminah', kategori: 'Pendapatan', metode: 'Virtual Account', akun: 'Bank BRI', masuk: 350000, keluar: 0 },
    { id: 5, tanggal: '30/06/2026 16:35', jenis: 'Kas Keluar', deskripsi: 'Pembayaran Sewa Server Bulan Juli 2026', kategori: 'Pengeluaran Operasional', metode: 'Transfer Bank', akun: 'Bank BCA', masuk: 0, keluar: 1750000 }
  ]);

  // Derived calculations
  const totalKasMasuk = transactions.reduce((acc, t) => acc + t.masuk, 125860500 - 1050000) + transactions.filter(t => t.id > 5 && t.jenis === 'Kas Masuk').reduce((acc, t) => acc + t.masuk, 0);
  const totalKasKeluar = transactions.reduce((acc, t) => acc + t.keluar, 82730500 - 10250000) + transactions.filter(t => t.id > 5 && t.jenis === 'Kas Keluar').reduce((acc, t) => acc + t.keluar, 0);
  const arusKasBersih = totalKasMasuk - totalKasKeluar;
  const saldoKasAkhir = saldoAwal + arusKasBersih;
  
  // Cash Ratio = Current Assets (Cash & Cash Equivalents) / Current Liabilities.
  // We mock Current Liabilities at Rp 82.500.000
  const currentLiabilitiesMock = 82500000;
  const rasioKas = parseFloat((saldoKasAkhir / currentLiabilitiesMock).toFixed(2));

  // Chart data states (re-calculated dynamically)
  const [weeklyData, setWeeklyData] = useState([
    { name: '25 Jun', 'Kas Masuk': 15000000, 'Kas Keluar': 10000000, 'Arus Kas Bersih': 5000000 },
    { name: '26 Jun', 'Kas Masuk': 20000000, 'Kas Keluar': 12000000, 'Arus Kas Bersih': 8000000 },
    { name: '27 Jun', 'Kas Masuk': 25000000, 'Kas Keluar': 15000000, 'Arus Kas Bersih': 10000000 },
    { name: '28 Jun', 'Kas Masuk': 12000000, 'Kas Keluar': 18000000, 'Arus Kas Bersih': -6000000 },
    { name: '29 Jun', 'Kas Masuk': 18000000, 'Kas Keluar': 14000000, 'Arus Kas Bersih': 4000000 },
    { name: '30 Jun', 'Kas Masuk': 22000000, 'Kas Keluar': 16000000, 'Arus Kas Bersih': 6000000 },
    { name: '01 Jul', 'Kas Masuk': 30000000, 'Kas Keluar': 20000000, 'Arus Kas Bersih': 10000000 }
  ]);

  const [monthlyData, setMonthlyData] = useState([
    { name: '01 Jun', 'Kas Masuk': 60000000, 'Kas Keluar': 40000000, 'Arus Kas Bersih': 20000000 },
    { name: '05 Jun', 'Kas Masuk': 75000000, 'Kas Keluar': 45000000, 'Arus Kas Bersih': 30000000 },
    { name: '10 Jun', 'Kas Masuk': 68000000, 'Kas Keluar': 55000000, 'Arus Kas Bersih': 13000000 },
    { name: '15 Jun', 'Kas Masuk': 90000000, 'Kas Keluar': 48000000, 'Arus Kas Bersih': 42000000 },
    { name: '20 Jun', 'Kas Masuk': 82000000, 'Kas Keluar': 62000000, 'Arus Kas Bersih': 20000000 },
    { name: '25 Jun', 'Kas Masuk': 110000000, 'Kas Keluar': 70000000, 'Arus Kas Bersih': 40000000 },
    { name: '30 Jun', 'Kas Masuk': 125860500, 'Kas Keluar': 82730500, 'Arus Kas Bersih': 43130000 }
  ]);

  const methodBreakdown = [
    { name: 'Transfer Bank', value: 75250000 },
    { name: 'E-Wallet', value: 24150000 },
    { name: 'Virtual Account', value: 11320000 },
    { name: 'Tunai', value: 6450000 },
    { name: 'Kartu Kredit', value: 5690000 },
    { name: 'Lainnya', value: 3000000 }
  ];

  const projectionData = [
    { name: '02 Jul', 'Kas Masuk': 28000000, 'Kas Keluar': 18000000, 'Arus Kas Bersih': 10000000 },
    { name: '07 Jul', 'Kas Masuk': 35000000, 'Kas Keluar': 22000000, 'Arus Kas Bersih': 13000000 },
    { name: '12 Jul', 'Kas Masuk': 42000000, 'Kas Keluar': 26000000, 'Arus Kas Bersih': 16000000 },
    { name: '17 Jul', 'Kas Masuk': 58000000, 'Kas Keluar': 31000000, 'Arus Kas Bersih': 27000000 },
    { name: '22 Jul', 'Kas Masuk': 48000000, 'Kas Keluar': 29000000, 'Arus Kas Bersih': 19000000 },
    { name: '27 Jul', 'Kas Masuk': 64000000, 'Kas Keluar': 35000000, 'Arus Kas Bersih': 29000000 },
    { name: '01 Aug', 'Kas Masuk': 72000000, 'Kas Keluar': 38000000, 'Arus Kas Bersih': 34000000 }
  ];

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const amountNum = parseFloat(newAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

    const newTx = {
      id: transactions.length + 1,
      tanggal: formattedDate,
      jenis: modalType === 'MASUK' ? 'Kas Masuk' : 'Kas Keluar',
      deskripsi: newDesc,
      kategori: newCategory || (modalType === 'MASUK' ? 'Pendapatan Lainnya' : 'Pengeluaran Lainnya'),
      metode: newMethod,
      akun: newAccount,
      masuk: modalType === 'MASUK' ? amountNum : 0,
      keluar: modalType === 'KELUAR' ? amountNum : 0
    };

    // Update transactions list
    setTransactions([newTx, ...transactions]);

    // Update bank balance
    setAccounts(accounts.map(acc => {
      if (acc.name === newAccount) {
        return {
          ...acc,
          balance: modalType === 'MASUK' ? acc.balance + amountNum : acc.balance - amountNum
        };
      }
      return acc;
    }));

    // Update weekly chart last day
    const updatedWeekly = [...weeklyData];
    const lastDayIdx = updatedWeekly.length - 1;
    if (modalType === 'MASUK') {
      updatedWeekly[lastDayIdx]['Kas Masuk'] += amountNum;
    } else {
      updatedWeekly[lastDayIdx]['Kas Keluar'] += amountNum;
    }
    updatedWeekly[lastDayIdx]['Arus Kas Bersih'] = updatedWeekly[lastDayIdx]['Kas Masuk'] - updatedWeekly[lastDayIdx]['Kas Keluar'];
    setWeeklyData(updatedWeekly);

    // Reset fields
    setNewDesc('');
    setNewCategory('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const filteredTxList = transactions.filter(t => 
    t.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.metode.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span className="text-cyan-400 font-medium">Arus Kas</span>
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
                placeholder="Cari invoice, customer, transaksi..."
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
            <h1 className="text-2xl font-bold tracking-tight text-white">Arus Kas</h1>
            <p className="text-xs text-gray-400 mt-1">Pantau arus kas masuk, keluar, dan posisi kas secara real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#091526] border border-blue-900/40 text-xs">
              <span className="text-gray-400 font-medium">25 Juni 2026 - 01 Juli 2026</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => alert('Mengekspor laporan arus kas...')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-blue-900/40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Saldo Kas Awal */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Saldo Kas Awal</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(saldoAwal)}</h3>
            <p className="text-[9px] text-gray-400 mt-1">Per 25 Juni 2026</p>
          </div>

          {/* Total Kas Masuk */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Kas Masuk</p>
              <div className="p-1.5 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <PlusCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(totalKasMasuk)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 12.5% dari periode lalu
            </span>
          </div>

          {/* Total Kas Keluar */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Kas Keluar</p>
              <div className="p-1.5 rounded-lg bg-rose-600/10 border border-rose-600/20 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(totalKasKeluar)}</h3>
            <span className="text-[9px] text-rose-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 8.4% dari periode lalu
            </span>
          </div>

          {/* Arus Kas Bersih */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Arus Kas Bersih</p>
              <div className="p-1.5 rounded-lg bg-cyan-600/10 border border-cyan-600/20 text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(arusKasBersih)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 22.7% dari periode lalu
            </span>
          </div>

          {/* Saldo Kas Akhir */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Saldo Kas Akhir</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(saldoKasAkhir)}</h3>
            <p className="text-[9px] text-gray-400 mt-1">Per 01 Juli 2026</p>
          </div>

          {/* Rasio Kas */}
          <div className="bg-[#0A1629]/70 border border-blue-900/40 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rasio Kas</p>
              <div className="p-1.5 rounded-lg bg-purple-600/10 border border-purple-600/20 text-purple-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{rasioKas}</h3>
            <p className="text-[9px] text-emerald-400 font-semibold mt-1">Sehat</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-blue-950/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Ringkasan', 'Arus Kas Masuk', 'Arus Kas Keluar', 'Transfer Dana', 'Proyeksi Kas', 'Rekonsiliasi Bank', 'Catatan Kas'].map((tab) => (
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

        {/* Main Workspace Layout */}
        {activeTab === 'Ringkasan' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Columns: Graphs, Monthly, and Recent Transactions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Grafik Arus Kas Bar/Line */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Grafik Arus Kas</h3>
                  <span className="text-[10px] text-gray-400 bg-[#071225] px-2 py-1 rounded border border-blue-950">7 Hari Terakhir</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={weeklyData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} tickFormatter={(v) => `${v / 1000000}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#091526', borderColor: '#1e3a8a', fontSize: '11px', color: '#fff' }}
                        formatter={(value: any) => formatRupiah(value)}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="Kas Masuk" fill="#10B981" radius={[2, 2, 0, 0]} barSize={16} />
                      <Bar dataKey="Kas Keluar" fill="#EF4444" radius={[2, 2, 0, 0]} barSize={16} />
                      <Line type="monotone" dataKey="Arus Kas Bersih" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Arus Kas Bulanan Area Chart */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Arus Kas Bulanan</h3>
                  <span className="text-[10px] text-gray-400 bg-[#071225] px-2 py-1 rounded border border-blue-950">Juni 2026</span>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} tickFormatter={(v) => `${v / 1000000}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#091526', borderColor: '#1e3a8a', fontSize: '11px' }}
                        formatter={(value: any) => formatRupiah(value)}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Area type="monotone" dataKey="Kas Masuk" stroke="#10b981" fillOpacity={0.06} fill="#10b981" />
                      <Area type="monotone" dataKey="Kas Keluar" stroke="#EF4444" fillOpacity={0.06} fill="#EF4444" />
                      <Area type="monotone" dataKey="Arus Kas Bersih" stroke="#3b82f6" fillOpacity={0.06} fill="#3b82f6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Transaksi Arus Kas Terbaru Table */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4">Transaksi Arus Kas Terbaru</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-blue-950/80 text-gray-400">
                        <th className="py-2.5 font-semibold">TANGGAL</th>
                        <th className="py-2.5 font-semibold">JENIS</th>
                        <th className="py-2.5 font-semibold">DESKRIPSI</th>
                        <th className="py-2.5 font-semibold">KATEGORI</th>
                        <th className="py-2.5 font-semibold">METODE</th>
                        <th className="py-2.5 font-semibold text-right">KAS MASUK</th>
                        <th className="py-2.5 font-semibold text-right">KAS KELUAR</th>
                        <th className="py-2.5 font-semibold text-right">SALDO KAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/40 text-gray-300">
                      {filteredTxList.map((tx) => (
                        <tr key={tx.id} className="hover:bg-blue-950/20 transition-colors">
                          <td className="py-3 text-[11px] text-gray-400">{tx.tanggal}</td>
                          <td className="py-3 font-semibold">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${tx.jenis === 'Kas Masuk' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {tx.jenis}
                            </span>
                          </td>
                          <td className="py-3 max-w-[200px] truncate" title={tx.deskripsi}>{tx.deskripsi}</td>
                          <td className="py-3 text-gray-400">{tx.kategori}</td>
                          <td className="py-3 text-gray-400">{tx.metode}</td>
                          <td className="py-3 text-right font-medium text-emerald-400">
                            {tx.masuk > 0 ? formatRupiah(tx.masuk) : '-'}
                          </td>
                          <td className="py-3 text-right font-medium text-rose-400">
                            {tx.keluar > 0 ? formatRupiah(tx.keluar) : '-'}
                          </td>
                          <td className="py-3 text-right font-semibold text-gray-100">{formatRupiah(saldoKasAkhir)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Middle 3 Columns: Summary Figures & Projection */}
            <div className="lg:col-span-3 space-y-6">
              {/* Ringkasan Arus Kas */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4 border-b border-blue-950 pb-2">Ringkasan Arus Kas</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Saldo Kas Awal</span>
                    <span className="font-semibold text-white">{formatRupiah(saldoAwal)}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-blue-950">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">KAS MASUK</p>
                    <div className="flex justify-between items-center pl-2 text-gray-400">
                      <span>Pendapatan</span>
                      <span className="text-white">{formatRupiah(totalKasMasuk * 0.94)}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2 text-gray-400 mt-1">
                      <span>Penerimaan Lainnya</span>
                      <span className="text-white">{formatRupiah(totalKasMasuk * 0.06)}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2 text-emerald-400 font-semibold mt-2">
                      <span>Total Kas Masuk</span>
                      <span>{formatRupiah(totalKasMasuk)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-950">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">KAS KELUAR</p>
                    <div className="flex justify-between items-center pl-2 text-gray-400">
                      <span>Pengeluaran Operasional</span>
                      <span className="text-white">{formatRupiah(totalKasKeluar * 0.58)}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2 text-gray-400 mt-1">
                      <span>Pengeluaran Non Operasional</span>
                      <span className="text-white">{formatRupiah(totalKasKeluar * 0.15)}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2 text-gray-400 mt-1">
                      <span>Pengeluaran Tetap</span>
                      <span className="text-white">{formatRupiah(totalKasKeluar * 0.27)}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2 text-rose-400 font-semibold mt-2">
                      <span>Total Kas Keluar</span>
                      <span>{formatRupiah(totalKasKeluar)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-950/80 flex justify-between items-center text-cyan-400 font-bold">
                    <span>Arus Kas Bersih</span>
                    <span>{formatRupiah(arusKasBersih)}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-100 font-bold bg-[#071225] p-2 rounded border border-blue-900/30">
                    <span>Saldo Kas Akhir</span>
                    <span className="text-cyan-400">{formatRupiah(saldoKasAkhir)}</span>
                  </div>
                </div>
              </div>

              {/* Proyeksi Arus Kas */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Proyeksi Arus Kas</h3>
                  <span className="text-[9px] text-gray-400 bg-[#071225] px-1.5 py-0.5 rounded border border-blue-950">30 Hari Ke Depan</span>
                </div>
                <div className="space-y-1 mb-2 text-[10px]">
                  <div className="flex justify-between text-gray-400">
                    <span>Proyeksi Kas Masuk:</span>
                    <span className="text-emerald-400 font-semibold">Rp 546.210.000</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Proyeksi Kas Keluar:</span>
                    <span className="text-rose-400 font-semibold">Rp 412.350.000</span>
                  </div>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={8} />
                      <YAxis stroke="#64748b" fontSize={8} tickFormatter={(v) => `${v / 1000000}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#091526', borderColor: '#1e3a8a', fontSize: '10px' }}
                        formatter={(value: any) => formatRupiah(value)}
                      />
                      <Line type="monotone" dataKey="Kas Masuk" stroke="#10b981" strokeWidth={1} dot={false} />
                      <Line type="monotone" dataKey="Kas Keluar" stroke="#EF4444" strokeWidth={1} dot={false} />
                      <Line type="monotone" dataKey="Arus Kas Bersih" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right 3 Columns: Payment Breakdown, Quick Action, Account Balances & Status */}
            <div className="lg:col-span-3 space-y-6">
              {/* Arus Kas per Metode Pembayaran */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4">Arus Kas per Metode Pembayaran</h3>
                <div className="flex flex-col items-center justify-center relative mb-4">
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={methodBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {methodBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_METODE[index % COLORS_METODE.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatRupiah(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Central Text */}
                  <div className="absolute text-center">
                    <p className="text-[14px] font-bold text-white">{formatRupiah(totalKasMasuk)}</p>
                    <p className="text-[9px] text-gray-400">Total Kas Masuk</p>
                  </div>
                </div>
                {/* Custom Legend */}
                <div className="space-y-1.5 text-[10px]">
                  {methodBreakdown.map((item, index) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_METODE[index % COLORS_METODE.length] }}></span>
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold mr-2">{formatRupiah(item.value)}</span>
                        <span className="text-gray-400">{(item.value / totalKasMasuk * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aksi Cepat */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4">Aksi Cepat</h3>
                <div className="space-y-2 text-xs">
                  <button 
                    onClick={() => { setModalType('MASUK'); setShowAddModal(true); }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[#091526] hover:bg-[#0c1d36] border border-blue-900/40 text-left text-gray-200 transition-colors"
                  >
                    <PlusSquare className="w-4 h-4 text-emerald-400" />
                    <span>Catat Kas Masuk</span>
                  </button>
                  <button 
                    onClick={() => { setModalType('KELUAR'); setShowAddModal(true); }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[#091526] hover:bg-[#0c1d36] border border-blue-900/40 text-left text-gray-200 transition-colors"
                  >
                    <MinusSquare className="w-4 h-4 text-rose-400" />
                    <span>Catat Kas Keluar</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[#091526] hover:bg-[#0c1d36] border border-blue-900/40 text-left text-gray-200 transition-colors">
                    <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                    <span>Transfer Dana</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[#091526] hover:bg-[#0c1d36] border border-blue-900/40 text-left text-gray-200 transition-colors">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Rekonsiliasi Bank</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[#091526] hover:bg-[#0c1d36] border border-blue-900/40 text-left text-gray-200 transition-colors">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <span>Buat Anggaran Kas</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[#091526] hover:bg-[#0c1d36] border border-blue-900/40 text-left text-gray-200 transition-colors">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Export Laporan</span>
                  </button>
                </div>
              </div>

              {/* Saldo Kas per Bank/Wallet */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4">Saldo Kas per Bank/Wallet</h3>
                <div className="space-y-3.5 text-xs">
                  {accounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center text-gray-400">
                      <span>{acc.name}</span>
                      <span className="font-semibold text-white">{formatRupiah(acc.balance)}</span>
                    </div>
                  ))}
                  <div className="pt-2.5 border-t border-blue-950 flex justify-between items-center text-gray-200 font-bold">
                    <span>Total Saldo</span>
                    <span className="text-cyan-400">{formatRupiah(saldoKasAkhir)}</span>
                  </div>
                </div>
              </div>

              {/* Status Arus Kas Gauge */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5 text-center">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-4">Status Arus Kas</h3>
                <div className="relative flex justify-center items-center h-28">
                  {/* Custom SVG Gauge */}
                  <svg className="w-36 h-20 overflow-visible">
                    <path
                      d="M 10 75 A 60 60 0 0 1 130 75"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 75 A 60 60 0 0 1 130 75"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="188"
                      strokeDashoffset={Math.max(0, 188 - (188 * Math.min(rasioKas, 3) / 3))}
                    />
                  </svg>
                  <div className="absolute mt-6">
                    <p className="text-2xl font-bold text-white">{rasioKas}</p>
                    <p className="text-[9px] text-emerald-400 uppercase tracking-widest mt-0.5">Sehat</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 px-2 mt-2 leading-relaxed">
                  Rasio Kas = Aktiva Lancar / Kewajiban Lancar. Ideal: &gt; 1.0 (Sehat)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-8 text-center text-gray-400 text-sm">
            <Layers className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-pulse" />
            <p className="font-semibold text-white">Menu Tab {activeTab} Terintegrasi</p>
            <p className="text-xs text-gray-500 mt-1.5">
              Halaman visualisasi data detail untuk modul {activeTab} terkoneksi dengan database utama.
            </p>
          </div>
        )}

        {/* Form Modal: Catat Kas Masuk / Kas Keluar */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0A1629] border border-blue-900/60 rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-950">
                <h3 className="text-sm font-bold text-white">
                  {modalType === 'MASUK' ? 'Catat Kas Masuk Baru' : 'Catat Kas Keluar Baru'}
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Batal
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Deskripsi Transaksi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembayaran internet, Gaji teknisi..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Kategori</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pendapatan, Operasional"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Metode Pembayaran</label>
                    <select
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Transfer Bank</option>
                      <option>E-Wallet</option>
                      <option>Virtual Account</option>
                      <option>Tunai</option>
                      <option>Kartu Kredit</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Dompet/Akun Bank</label>
                    <select
                      value={newAccount}
                      onChange={(e) => setNewAccount(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.name}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Nominal (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 500000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#081225] border border-blue-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors mt-2 ${
                    modalType === 'MASUK' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

