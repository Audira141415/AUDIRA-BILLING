import Link from 'next/link';
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
  FileSpreadsheet,
  Trash,
  PlusCircle,
  Settings,
  Bell,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_METODE = ['#1D4ED8', '#10B981', '#6366F1', '#F59E0B', '#EC4899'];
const COLORS_SUMBER = ['#2563EB', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'];

export default function PendapatanDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Transaksi Pendapatan');

  // Filter states
  const [filterPeriod, setFilterPeriod] = useState('25/06/2026 - 22/10/2026');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterSumber, setFilterSumber] = useState('Semua Sumber');
  const [filterMetode, setFilterMetode] = useState('Semua Metode');
  const [filterPelanggan, setFilterPelanggan] = useState('Semua Pelanggan');
  const [filterProduk, setFilterProduk] = useState('Semua Package');
  const [filterMinNominal, setFilterMinNominal] = useState('');
  const [filterMaxNominal, setFilterMaxNominal] = useState('');

  // Transaction list (Mock matching the screenshot)
  const initialTransactions = [
    { no: 1, tanggal: '22/10/2026 08:32', invoice: 'INV/2026/07/001245', pelanggan: 'Budi Santoso', sumber: 'Layanan Internet', metode: 'Transfer Bank', total: 550000, status: 'Lunas' },
    { no: 2, tanggal: '22/10/2026 07:45', invoice: 'INV/2026/07/001244', pelanggan: 'Andi Pratama', sumber: 'Add-on IP Public', metode: 'E-Wallet', total: 150000, status: 'Lunas' },
    { no: 3, tanggal: '22/10/2026 06:20', invoice: 'INV/2026/07/001243', pelanggan: 'Siti Aminah', sumber: 'Layanan Internet', metode: 'Transfer Bank', total: 350000, status: 'Lunas' },
    { no: 4, tanggal: '30/06/2026 22:15', invoice: 'INV/2026/07/002542', pelanggan: 'Desti Istiningrum', sumber: 'Paket Berlangganan', metode: 'Transfer Bank', total: 450000, status: 'Sebagian' },
    { no: 5, tanggal: '30/06/2026 19:30', invoice: 'INV/2026/06/002541', pelanggan: 'Rina Marlina', sumber: 'Gaji Bulan Juni 2026', metode: 'Transfer Bank', total: 8500000, status: 'Lunas' },
    { no: 6, tanggal: '30/06/2026 18:05', invoice: 'INV/2026/06/002540', pelanggan: 'CV. Maju Jaya', sumber: 'Sewa Perangkat', metode: 'Virtual Account', total: 2750000, status: 'Lunas' },
    { no: 7, tanggal: '30/06/2026 17:22', invoice: 'INV/2026/06/002539', pelanggan: 'Fajar Nugroho', sumber: 'Setup Instalasi', metode: 'QRIS', total: 250000, status: 'Lunas' },
    { no: 8, tanggal: '30/06/2026 15:10', invoice: 'INV/2026/06/002538', pelanggan: 'Koperasi Sejahtera', sumber: 'Layanan Internet', metode: 'Transfer Bank', total: 1200000, status: 'Belum Lunas' },
    { no: 9, tanggal: '30/06/2026 11:33', invoice: 'INV/2026/06/002537', pelanggan: 'PT. Sumber Rezeki', sumber: 'Bandwidth Tambahan', metode: 'E-Wallet', total: 600000, status: 'Lunas' },
    { no: 10, tanggal: '30/06/2026 09:21', invoice: 'INV/2026/06/002536', pelanggan: 'Dewi Lestari', sumber: 'Add-on IP Public', metode: 'Transfer Bank', total: 100000, status: 'Gagal' }
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions);
  const [showAddModal, setShowAddModal] = useState(false);

  // New transaction form state
  const [newDate, setNewDate] = useState('22/10/2026 10:00');
  const [newInvoice, setNewInvoice] = useState('INV/2026/07/001250');
  const [newPelanggan, setNewPelanggan] = useState('');
  const [newSumber, setNewSumber] = useState('Layanan Internet');
  const [newMetode, setNewMetode] = useState('Transfer Bank');
  const [newTotal, setNewTotal] = useState('');
  const [newStatus, setNewStatus] = useState('Lunas');

  const applyFilters = () => {
    let result = [...transactions];

    if (filterStatus !== 'Semua Status') {
      result = result.filter(t => t.status === filterStatus);
    }
    if (filterSumber !== 'Semua Sumber') {
      result = result.filter(t => t.sumber === filterSumber);
    }
    if (filterMetode !== 'Semua Metode') {
      result = result.filter(t => t.metode === filterMetode);
    }
    if (filterMinNominal) {
      result = result.filter(t => t.total >= parseInt(filterMinNominal));
    }
    if (filterMaxNominal) {
      result = result.filter(t => t.total <= parseInt(filterMaxNominal));
    }

    setFilteredTransactions(result);
  };

  const resetFilters = () => {
    setFilterStatus('Semua Status');
    setFilterSumber('Semua Sumber');
    setFilterMetode('Semua Metode');
    setFilterMinNominal('');
    setFilterMaxNominal('');
    setFilteredTransactions(transactions);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPelanggan || !newTotal) return;

    const newTx = {
      no: transactions.length + 1,
      tanggal: newDate,
      invoice: newInvoice,
      pelanggan: newPelanggan,
      sumber: newSumber,
      metode: newMetode,
      total: parseInt(newTotal),
      status: newStatus
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    setFilteredTransactions(updated);
    setShowAddModal(false);

    // reset inputs
    setNewPelanggan('');
    setNewTotal('');
    setNewInvoice(`INV/2026/07/00${1250 + transactions.length}`);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["NO,TANGGAL,NO. INVOICE,PELANGGAN,SUMBER,METODE,TOTAL,STATUS", 
         ...filteredTransactions.map(t => `${t.no},${t.tanggal},${t.invoice},"${t.pelanggan}",${t.sumber},${t.metode},${t.total},${t.status}`)
        ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_pendapatan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sparkline data
  const sparkData = {
    total: [{ v: 100 }, { v: 120 }, { v: 110 }, { v: 130 }, { v: 125 }, { v: 140 }, { v: 125.8 }],
    diterima: [{ v: 90 }, { v: 110 }, { v: 105 }, { v: 120 }, { v: 118 }, { v: 125 }, { v: 118.4 }],
    belumDiterima: [{ v: 10 }, { v: 10 }, { v: 5 }, { v: 10 }, { v: 7 }, { v: 15 }, { v: 7.4 }],
    rataRata: [{ v: 3.8 }, { v: 4.1 }, { v: 4.0 }, { v: 4.5 }, { v: 4.2 }, { v: 4.6 }, { v: 4.47 }],
    berhasil: [{ v: 1000 }, { v: 1150 }, { v: 1100 }, { v: 1300 }, { v: 1200 }, { v: 1260 }, { v: 1248 }]
  };

  // Tren Pendapatan Harian
  const dailyTrendData = [
    { name: '25 Jun', Tren: 30 },
    { name: '26 Jun', Tren: 42 },
    { name: '27 Jun', Tren: 28 },
    { name: '28 Jun', Tren: 32 },
    { name: '29 Jun', Tren: 25 },
    { name: '30 Jun', Tren: 38 },
    { name: '01 Jul', Tren: 35 }
  ];

  // Donut data
  const paymentMethodData = [
    { name: 'Transfer Bank', value: 78250000, percent: '62.2%' },
    { name: 'E-Wallet', value: 24150000, percent: '19.2%' },
    { name: 'Virtual Account', value: 11320000, percent: '9.0%' },
    { name: 'QRIS', value: 6450000, percent: '5.1%' },
    { name: 'Tunai', value: 5690500, percent: '4.5%' }
  ];

  const sourceData = [
    { name: 'Layanan Internet', value: 78850000, percent: '62.6%' },
    { name: 'Add-on / Layanan Tambahan', value: 24900000, percent: '19.8%' },
    { name: 'Pemasangan / Instalasi', value: 11550000, percent: '9.2%' },
    { name: 'Sewa Perangkat', value: 6750000, percent: '5.4%' },
    { name: 'Lainnya', value: 3810500, percent: '3.0%' }
  ];

  return (
    <Layout>
      <div className="bg-[var(--app-bg)] text-[var(--app-text)] min-h-screen p-6 font-sans antialiased">
        

        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[var(--app-border)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1.5">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/finance/dashboard" className="hover:text-[var(--app-text)]">Keuangan & Akuntansi</Link>
              <span>/</span>
              <span className="text-emerald-500 font-semibold">Pendapatan</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Pendapatan</h1>
            <p className="text-xs text-[var(--app-muted)] mt-1">Kelola semua sumber pendapatan dan analisis performa pendapatan.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] text-xs">
              <span className="text-[var(--app-muted)] font-medium">25 Juni 2026 - 22 Oktober 2026</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-[var(--app-border)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3 h-3 text-[var(--app-muted)]" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Total Pendapatan */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Pendapatan</p>
                <h3 className="text-lg font-bold text-white mt-1">Rp 125.860.500</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 12.5% dari periode lalu
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.total}>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} fill="rgba(59, 130, 246, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pendapatan Diterima */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Pendapatan Diterima</p>
                <h3 className="text-lg font-bold text-white mt-1">Rp 118.450.000</h3>
              </div>
              <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 10.8% dari periode lalu
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.diterima}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={1.5} fill="rgba(16, 185, 129, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pendapatan Belum Diterima */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Pendapatan Belum Diterima</p>
                <h3 className="text-lg font-bold text-white mt-1">Rp 7.410.500</h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-600/10 border border-amber-600/20 text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-rose-400 flex items-center font-semibold">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                ▼ 5.2% dari periode lalu
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.belumDiterima}>
                  <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} fill="rgba(245, 158, 11, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rata-rata per Hari */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Rata-rata per Hari</p>
                <h3 className="text-lg font-bold text-white mt-1">Rp 4.476.446</h3>
              </div>
              <div className="p-2 rounded-lg bg-purple-600/10 border border-purple-600/20 text-purple-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 8.7% dari periode lalu
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.rataRata}>
                  <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={1.5} fill="rgba(139, 92, 246, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaksi Berhasil */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Transaksi Berhasil</p>
                <h3 className="text-lg font-bold text-white mt-1">1.248</h3>
              </div>
              <div className="p-2 rounded-lg bg-cyan-600/10 border border-cyan-600/20 text-cyan-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 9.3% dari periode lalu
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.berhasil}>
                  <Area type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={1.5} fill="rgba(6, 182, 212, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--app-border)]/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Ringkasan', 'Sumber Pendapatan', 'Transaksi Pendapatan', 'Pelanggan', 'Produk/Package', 'Metode Pembayaran', 'Tren Pendapatan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px] ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-400 font-bold' 
                  : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: Transaksi Pendapatan */}
        {activeTab === 'Transaksi Pendapatan' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Filter Sidebar (1/4 column) */}
            <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase border-b border-[var(--app-border)]/60 pb-2">Filter Transaksi</h3>

              <div className="space-y-3.5 text-xs">
                {/* Periode */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Periode</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                      className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]" 
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]"
                  >
                    <option>Semua Status</option>
                    <option>Lunas</option>
                    <option>Sebagian</option>
                    <option>Belum Lunas</option>
                    <option>Gagal</option>
                  </select>
                </div>

                {/* Sumber Pendapatan */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Sumber Pendapatan</label>
                  <select 
                    value={filterSumber}
                    onChange={(e) => setFilterSumber(e.target.value)}
                    className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]"
                  >
                    <option>Semua Sumber</option>
                    <option>Layanan Internet</option>
                    <option>Add-on IP Public</option>
                    <option>Paket Berlangganan</option>
                    <option>Sewa Perangkat</option>
                    <option>Setup Instalasi</option>
                    <option>Bandwidth Tambahan</option>
                  </select>
                </div>

                {/* Metode Pembayaran */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Metode Pembayaran</label>
                  <select 
                    value={filterMetode}
                    onChange={(e) => setFilterMetode(e.target.value)}
                    className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]"
                  >
                    <option>Semua Metode</option>
                    <option>Transfer Bank</option>
                    <option>E-Wallet</option>
                    <option>Virtual Account</option>
                    <option>QRIS</option>
                    <option>Tunai</option>
                  </select>
                </div>

                {/* Pelanggan */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Pelanggan</label>
                  <select 
                    value={filterPelanggan}
                    onChange={(e) => setFilterPelanggan(e.target.value)}
                    className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]"
                  >
                    <option>Semua Pelanggan</option>
                  </select>
                </div>

                {/* Package / Produk */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Package / Produk</label>
                  <select 
                    value={filterProduk}
                    onChange={(e) => setFilterProduk(e.target.value)}
                    className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]"
                  >
                    <option>Semua Package</option>
                  </select>
                </div>

                {/* Minimal/Maksimal Nominal */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Min Nominal</label>
                    <input 
                      type="text" 
                      placeholder="Rp 0" 
                      value={filterMinNominal}
                      onChange={(e) => setFilterMinNominal(e.target.value)}
                      className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Max Nominal</label>
                    <input 
                      type="text" 
                      placeholder="Rp 0" 
                      value={filterMaxNominal}
                      onChange={(e) => setFilterMaxNominal(e.target.value)}
                      className="w-full bg-[#081225] border border-blue-900/50 p-2 rounded text-white text-[11px]" 
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--app-border)]/40">
                  <button 
                    onClick={applyFilters}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold text-white transition-colors"
                  >
                    Terapkan Filter
                  </button>
                  <button 
                    onClick={resetFilters}
                    className="w-full py-2 bg-blue-950 hover:bg-blue-900 rounded text-xs font-semibold text-[var(--app-text)]/90 hover:text-white transition-colors border border-blue-900/30"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>

              {/* Status Breakdown Checklist */}
              <div className="pt-3.5 border-t border-[var(--app-border)]/40 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-[var(--app-muted)] font-semibold uppercase">
                  <span>Status</span>
                  <span>1.248</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-emerald-500"></span> Lunas
                    </span>
                    <span className="font-semibold text-white">1.048 <span className="text-[10px] font-normal text-[var(--app-muted)]">(84.1%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-amber-500"></span> Sebagian
                    </span>
                    <span className="font-semibold text-white">86 <span className="text-[10px] font-normal text-[var(--app-muted)]">(6.9%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-orange-500"></span> Belum Lunas
                    </span>
                    <span className="font-semibold text-white">72 <span className="text-[10px] font-normal text-[var(--app-muted)]">(5.8%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-red-600"></span> Gagal
                    </span>
                    <span className="font-semibold text-white">42 <span className="text-[10px] font-normal text-[var(--app-muted)]">(3.2%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table (3/4 column) */}
            <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-4 lg:col-span-3 space-y-4">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Transaksi Pendapatan</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pendapatan</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] text-[var(--app-muted)]">
                      <th className="py-2.5 font-medium">NO</th>
                      <th className="py-2.5 font-medium">TANGGAL</th>
                      <th className="py-2.5 font-medium">NO. INVOICE</th>
                      <th className="py-2.5 font-medium">PELANGGAN</th>
                      <th className="py-2.5 font-medium">SUMBER</th>
                      <th className="py-2.5 font-medium">METODE</th>
                      <th className="py-2.5 font-medium text-right">TOTAL</th>
                      <th className="py-2.5 font-medium text-center">STATUS</th>
                      <th className="py-2.5 font-medium text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950/40 text-[var(--app-text)]/90">
                    {filteredTransactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-blue-950/20">
                        <td className="py-3 text-[var(--app-muted)]">{tx.no}</td>
                        <td className="py-3 text-[var(--app-muted)] whitespace-nowrap">{tx.tanggal}</td>
                        <td className="py-3 font-semibold text-cyan-400 whitespace-nowrap">{tx.invoice}</td>
                        <td className="py-3 font-medium text-white">{tx.pelanggan}</td>
                        <td className="py-3 text-[var(--app-muted)]">{tx.sumber}</td>
                        <td className="py-3 text-[var(--app-text)]/90">{tx.metode}</td>
                        <td className="py-3 text-right font-bold text-white whitespace-nowrap">{formatRupiah(tx.total)}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                            tx.status === 'Lunas' ? 'bg-emerald-500/15 text-emerald-400' :
                            tx.status === 'Sebagian' ? 'bg-amber-500/15 text-amber-400' :
                            tx.status === 'Belum Lunas' ? 'bg-orange-500/15 text-orange-400' :
                            'bg-red-500/15 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1 text-[var(--app-muted)] hover:text-cyan-400">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm("Hapus pencatatan pendapatan ini?")) {
                                  const updated = transactions.filter(t => t.invoice !== tx.invoice);
                                  setTransactions(updated);
                                  setFilteredTransactions(updated);
                                }
                              }}
                              className="p-1 text-[var(--app-muted)] hover:text-rose-500"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center pt-4 border-t border-[var(--app-border)]/40 text-xs text-[var(--app-muted)]">
                <span>Menampilkan 1 - 10 dari 1.248 transaksi</span>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 rounded bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)]/90 font-semibold hover:border-cyan-500">&lt;</button>
                  <button className="px-2.5 py-1 rounded bg-blue-600 text-[var(--app-text)] font-bold">1</button>
                  <button className="px-2.5 py-1 rounded bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)]/90 font-semibold hover:border-cyan-500">2</button>
                  <button className="px-2.5 py-1 rounded bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)]/90 font-semibold hover:border-cyan-500">3</button>
                  <button className="px-2.5 py-1 rounded bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)]/90 font-semibold hover:border-cyan-500">4</button>
                  <button className="px-2.5 py-1 rounded bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)]/90 font-semibold hover:border-cyan-500">5</button>
                  <span>...</span>
                  <button className="px-2.5 py-1 rounded bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)]/90 font-semibold hover:border-cyan-500">125</button>
                  <button className="px-2 py-1 rounded bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)]/90 font-semibold hover:border-cyan-500">&gt;</button>
                </div>
                <div className="flex items-center gap-1.5">
                  <select className="bg-[#081225] border border-[var(--app-border)] rounded p-1 text-[11px] text-white">
                    <option>10 / halaman</option>
                    <option>25 / halaman</option>
                    <option>50 / halaman</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tren Pendapatan Harian */}
          <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Tren Pendapatan Harian</h4>
              <span className="text-[10px] text-[var(--app-muted)] bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/30">7 Hari Terakhir</span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#091526', borderColor: '#1E3A8A', color: '#FFF', fontSize: 11 }} />
                  <Line type="monotone" dataKey="Tren" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pendapatan per Metode Pembayaran */}
          <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-4 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase mb-3">Pendapatan per Metode Pembayaran</h4>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_METODE[index % COLORS_METODE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[8px] text-[var(--app-muted)] font-semibold uppercase">Total</p>
                  <p className="text-[9px] font-bold text-white">125.8M</p>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-[10px]">
                {paymentMethodData.map((e, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_METODE[index] }}></span>
                      <span className="text-[var(--app-text)]/90 max-w-[80px] truncate">{e.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[var(--app-text)] font-semibold block">{formatRupiah(e.value)}</span>
                      <span className="text-[9px] text-[var(--app-muted)]">{e.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pendapatan per Sumber */}
          <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-4 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase mb-3">Pendapatan per Sumber</h4>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_SUMBER[index % COLORS_SUMBER.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[8px] text-[var(--app-muted)] font-semibold uppercase">Total</p>
                  <p className="text-[9px] font-bold text-white">125.8M</p>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-[10px]">
                {sourceData.map((e, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_SUMBER[index] }}></span>
                      <span className="text-[var(--app-text)]/90 max-w-[90px] truncate">{e.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[var(--app-text)] font-semibold block">{formatRupiah(e.value)}</span>
                      <span className="text-[9px] text-[var(--app-muted)]">{e.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <form onSubmit={handleAddTransaction} className="bg-[#0A1629] border border-blue-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[var(--app-border)] pb-2">Tambah Pendapatan Baru</h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Tanggal & Waktu</label>
                  <input 
                    type="text" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#081225] border border-[var(--app-border)] p-2 rounded text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">No. Invoice</label>
                  <input 
                    type="text" 
                    value={newInvoice} 
                    onChange={(e) => setNewInvoice(e.target.value)}
                    className="w-full bg-[#081225] border border-[var(--app-border)] p-2 rounded text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[var(--app-muted)]">Pelanggan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nama pelanggan..."
                  value={newPelanggan} 
                  onChange={(e) => setNewPelanggan(e.target.value)}
                  className="w-full bg-[#081225] border border-[var(--app-border)] p-2 rounded text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Sumber Pendapatan</label>
                  <select 
                    value={newSumber} 
                    onChange={(e) => setNewSumber(e.target.value)}
                    className="w-full bg-[#081225] border border-[var(--app-border)] p-2 rounded text-white"
                  >
                    <option>Layanan Internet</option>
                    <option>Add-on IP Public</option>
                    <option>Paket Berlangganan</option>
                    <option>Sewa Perangkat</option>
                    <option>Setup Instalasi</option>
                    <option>Bandwidth Tambahan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Metode Pembayaran</label>
                  <select 
                    value={newMetode} 
                    onChange={(e) => setNewMetode(e.target.value)}
                    className="w-full bg-[#081225] border border-[var(--app-border)] p-2 rounded text-white"
                  >
                    <option>Transfer Bank</option>
                    <option>E-Wallet</option>
                    <option>Virtual Account</option>
                    <option>QRIS</option>
                    <option>Tunai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Total Nominal (Rp)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Contoh: 550000"
                    value={newTotal} 
                    onChange={(e) => setNewTotal(e.target.value)}
                    className="w-full bg-[#081225] border border-[var(--app-border)] p-2 rounded text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Status</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#081225] border border-[var(--app-border)] p-2 rounded text-white"
                  >
                    <option>Lunas</option>
                    <option>Sebagian</option>
                    <option>Belum Lunas</option>
                    <option>Gagal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--app-border)]">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-blue-950 hover:bg-blue-900 text-xs font-semibold text-[var(--app-text)]/90"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
