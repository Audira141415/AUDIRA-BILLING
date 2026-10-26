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
  Bell,
  Mail,
  Settings,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building,
  Briefcase,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  Plus,
  Edit,
  Trash,
  ChevronDown,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

// Format currency in Rupiah
const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

// Colors from mockup
const COLORS_DISTRIBUTION = ['#1D4ED8', '#0EA5E9', '#F59E0B', '#DC2626'];
const COLORS_EXPENSE = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function FinanceDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('25 Juni 2026 - 22 Oktober 2026');
  const [searchTerm, setSearchTerm] = useState('');
  const [systemStatus, setSystemStatus] = useState('Normal');

  // Interactive state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Sparkline mockup data (values for 7 days)
  const sparklineData = {
    pendapatan: [{ v: 100 }, { v: 120 }, { v: 115 }, { v: 130 }, { v: 125 }, { v: 140 }, { v: 125.8 }],
    biaya: [{ v: 40 }, { v: 45 }, { v: 42 }, { v: 48 }, { v: 43 }, { v: 46 }, { v: 45.2 }],
    laba: [{ v: 60 }, { v: 75 }, { v: 73 }, { v: 82 }, { v: 82 }, { v: 94 }, { v: 80.6 }],
    arusKas: [{ v: 55 }, { v: 62 }, { v: 58 }, { v: 67 }, { v: 64 }, { v: 72 }, { v: 68.4 }],
    transaksi: [{ v: 2100 }, { v: 2300 }, { v: 2200 }, { v: 2450 }, { v: 2350 }, { v: 2600 }, { v: 2548 }]
  };

  // 1. Grafik Pendapatan & Biaya (7 days)
  const lineChartData = [
    { name: '25 Jun', Pendapatan: 110, Biaya: 40 },
    { name: '26 Jun', Pendapatan: 125, Biaya: 48 },
    { name: '27 Jun', Pendapatan: 105, Biaya: 42 },
    { name: '28 Jun', Pendapatan: 120, Biaya: 52 },
    { name: '29 Jun', Pendapatan: 115, Biaya: 45 },
    { name: '30 Jun', Pendapatan: 135, Biaya: 49 },
    { name: '01 Jul', Pendapatan: 125.8, Biaya: 45.2 }
  ];

  // 2. Distribusi Pendapatan
  const distributionData = [
    { name: 'Paket Berlangganan', value: 91200000 },
    { name: 'Layanan Tambahan', value: 19120000 },
    { name: 'Biaya Instalasi', value: 9820000 },
    { name: 'Denda & Lainnya', value: 5720500 }
  ];

  // 3. Arus Kas
  const barChartData = [
    { name: '25 Jun', Masuk: 95, Keluar: 35 },
    { name: '26 Jun', Masuk: 110, Keluar: 42 },
    { name: '27 Jun', Masuk: 85, Keluar: 38 },
    { name: '28 Jun', Masuk: 105, Keluar: 45 },
    { name: '29 Jun', Masuk: 100, Keluar: 40 },
    { name: '30 Jun', Masuk: 120, Keluar: 44 },
    { name: '01 Jul', Masuk: 112, Keluar: 41 }
  ];

  // 4. Pengeluaran per Kategori
  const expenseCategoryData = [
    { name: 'Server & Hosting', value: 40.9 },
    { name: 'Gaji Karyawan', value: 28.3 },
    { name: 'Listrik & Internet', value: 14.3 },
    { name: 'Sewa & Operasional', value: 9.1 },
    { name: 'Lainnya', value: 7.4 }
  ];

  // 5. Transaksi Terbaru
  const [transactions, setTransactions] = useState([
    { id: '1', waktu: '22/10/2026 08:32', jenis: 'Pemasukan', kategori: 'Paket Berlangganan', deskripsi: 'Pembayaran paket internet Juli 2026 - Budi Santoso', metode: 'Transfer Bank', jumlah: 550000, status: 'Selesai' },
    { id: '2', waktu: '22/10/2026 07:45', jenis: 'Pemasukan', kategori: 'Layanan Tambahan', deskripsi: 'Add-on IP Public - Andi Pratama', metode: 'E-Wallet', jumlah: 150000, status: 'Selesai' },
    { id: '3', waktu: '22/10/2026 06:20', jenis: 'Pengeluaran', kategori: 'Biaya Server', deskripsi: 'Pembayaran VPS Server Juni 2026', metode: 'Transfer Bank', jumlah: 2500000, status: 'Selesai' },
    { id: '4', waktu: '30/06/2026 22:15', jenis: 'Pemasukan', kategori: 'Paket Berlangganan', deskripsi: 'Pembayaran paket internet Juli 2026 - Siti Aminah', metode: 'Transfer Bank', jumlah: 350000, status: 'Selesai' },
    { id: '5', waktu: '30/06/2026 19:30', jenis: 'Pengeluaran', kategori: 'Gaji Karyawan', deskripsi: 'Gaji bulan Juni 2026', metode: 'Transfer Bank', jumlah: 8500000, status: 'Selesai' }
  ]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Waktu,Jenis,Kategori,Deskripsi,Metode,Jumlah,Status", 
         ...transactions.map(t => `${t.waktu},${t.jenis},${t.kategori},"${t.deskripsi}",${t.metode},${t.jumlah},${t.status}`)
        ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_transaksi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTransaction = () => {
    const desc = prompt("Masukkan Deskripsi Transaksi:");
    if (!desc) return;
    const amountStr = prompt("Masukkan Jumlah (Rupiah):");
    if (!amountStr) return;
    const amount = parseInt(amountStr.replace(/[^0-9]/g, ''));
    if (isNaN(amount)) return;

    const newTx = {
      id: String(transactions.length + 1),
      waktu: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      jenis: 'Pemasukan',
      kategori: 'Layanan Tambahan',
      deskripsi: desc,
      metode: 'Transfer Bank',
      jumlah: amount,
      status: 'Selesai'
    };
    setTransactions([newTx, ...transactions]);
  };

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
              <span className="text-emerald-500 font-semibold">Executive Summary</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)]">Dashboard Finance</h1>
            <p className="text-xs text-[var(--app-muted)] mt-1">Ringkasan keuangan WhatsApp Business API secara real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] text-xs">
              <span className="text-[var(--app-muted)] font-medium">{dateRange}</span>
            </div>
            <button 
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-xs font-semibold text-[var(--app-text)] border border-[var(--app-border)] shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3 h-3 text-[var(--app-muted)]" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards with Sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Card 1: Total Pendapatan */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Pendapatan</p>
                <h3 className="text-lg font-bold text-[var(--app-text)] mt-1">Rp 125.860.500</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 12.5%
              </span>
              <span className="text-[9px] text-[var(--app-muted)]">dari periode lalu</span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.pendapatan}>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} fill="rgba(59, 130, 246, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Total Biaya */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Biaya</p>
                <h3 className="text-lg font-bold text-[var(--app-text)] mt-1">Rp 45.230.000</h3>
              </div>
              <div className="p-2 rounded-lg bg-rose-600/10 border border-rose-600/20 text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-rose-400 flex items-center font-semibold">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                ▼ 5.3%
              </span>
              <span className="text-[9px] text-[var(--app-muted)]">dari periode lalu</span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.biaya}>
                  <Area type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={1.5} fill="rgba(244, 63, 94, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3: Laba Bersih */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Laba Bersih</p>
                <h3 className="text-lg font-bold text-[var(--app-text)] mt-1">Rp 80.630.500</h3>
              </div>
              <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 15.8%
              </span>
              <span className="text-[9px] text-[var(--app-muted)]">dari periode lalu</span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.laba}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={1.5} fill="rgba(16, 185, 129, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 4: Arus Kas */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Arus Kas</p>
                <h3 className="text-lg font-bold text-[var(--app-text)] mt-1">Rp 68.420.000</h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-600/10 border border-amber-600/20 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 9.7%
              </span>
              <span className="text-[9px] text-[var(--app-muted)]">dari periode lalu</span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.arusKas}>
                  <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} fill="rgba(245, 158, 11, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 5: Transaksi */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Transaksi</p>
                <h3 className="text-lg font-bold text-[var(--app-text)] mt-1">2.548</h3>
              </div>
              <div className="p-2 rounded-lg bg-cyan-600/10 border border-cyan-600/20 text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ▲ 10.2%
              </span>
              <span className="text-[9px] text-[var(--app-muted)]">dari periode lalu</span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.transaksi}>
                  <Area type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={1.5} fill="rgba(6, 180, 212, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart 1: Grafik Pendapatan & Biaya */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Grafik Pendapatan & Biaya</h4>
              <span className="text-[10px] text-[var(--app-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">7 Hari Terakhir</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Line type="monotone" dataKey="Pendapatan" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Biaya" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Distribusi Pendapatan */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase mb-4">Distribusi Pendapatan</h4>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-36 h-36 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_DISTRIBUTION[index % COLORS_DISTRIBUTION.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-[var(--app-muted)]">Total</p>
                    <p className="text-[10px] font-bold text-[var(--app-text)] mt-0.5">Rp 125M</p>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  {distributionData.map((d, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS_DISTRIBUTION[index] }}></span>
                        <span className="text-[var(--app-text)]/90 text-[10px] font-medium truncate max-w-[120px]">{d.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[var(--app-text)] font-semibold block text-[10px]">{formatRupiah(d.value)}</span>
                        <span className="text-[9px] text-[var(--app-muted)]">
                          {((d.value / 125860500) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3: Arus Kas */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Arus Kas (Masuk vs Keluar)</h4>
              <span className="text-[10px] text-[var(--app-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">7 Hari Terakhir</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Bar dataKey="Masuk" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Keluar" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions & Balance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Column 1 & 2: Recent Transactions */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Transaksi Terbaru</h4>
              <button 
                onClick={handleAddTransaction}
                className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Tambah Transaksi
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--app-border)] text-[var(--app-muted)]">
                    <th className="py-2.5 font-medium">Waktu</th>
                    <th className="py-2.5 font-medium">Jenis</th>
                    <th className="py-2.5 font-medium">Kategori</th>
                    <th className="py-2.5 font-medium">Deskripsi</th>
                    <th className="py-2.5 font-medium text-right">Jumlah</th>
                    <th className="py-2.5 font-medium text-center">Status</th>
                    <th className="py-2.5 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]/90">
                  {transactions.filter(t => t.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())).map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--app-card-subtle)]/20">
                      <td className="py-3 whitespace-nowrap text-[11px] text-[var(--app-muted)]">{tx.waktu}</td>
                      <td className="py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${tx.jenis === 'Pemasukan' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {tx.jenis}
                        </span>
                      </td>
                      <td className="py-3 whitespace-nowrap font-medium text-[11px]">{tx.kategori}</td>
                      <td className="py-3 max-w-[200px] truncate text-[11px]" title={tx.deskripsi}>{tx.deskripsi}</td>
                      <td className="py-3 text-right font-bold text-[11px] text-[var(--app-text)]">{formatRupiah(tx.jumlah)}</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/25 text-emerald-300">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-1 text-[var(--app-muted)] hover:text-cyan-400">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm("Hapus transaksi ini?")) {
                                setTransactions(transactions.filter(t => t.id !== tx.id));
                              }
                            }}
                            className="p-1 text-[var(--app-muted)] hover:text-rose-500"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="text-[11px] font-medium text-blue-400 hover:underline">Lihat Semua Transaksi →</button>
            </div>
          </div>

          {/* Column 3: Ringkasan Saldo & Top 5 Pendapatan */}
          <div className="space-y-6">
            {/* Card: Ringkasan Saldo */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase mb-3.5">Ringkasan Saldo</h4>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[var(--app-border)]/60">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[var(--app-text)]/90">Saldo Kas</span>
                  </div>
                  <span className="font-bold text-[var(--app-text)]">{formatRupiah(68420000)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-b-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[var(--app-text)]/90">Saldo Bank</span>
                  </div>
                  <span className="font-bold text-[var(--app-text)]">{formatRupiah(152840000)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-b-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[var(--app-text)]/90">Saldo E-Wallet</span>
                  </div>
                  <span className="font-bold text-[var(--app-text)]">{formatRupiah(32150000)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-bold text-cyan-400 text-xs">Total Saldo</span>
                  <span className="font-extrabold text-cyan-400 text-sm">{formatRupiah(253410000)}</span>
                </div>
              </div>
            </div>

            {/* Card: Top 5 Pendapatan */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Top 5 Pendapatan</h4>
                <button className="text-[10px] font-semibold text-cyan-400 hover:underline">Lihat Semua</button>
              </div>
              <div className="space-y-3 text-xs">
                {distributionData.map((d, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[var(--app-text)]/90 font-medium">{index + 1}. {d.name}</span>
                      <span className="font-semibold text-[var(--app-text)]">{formatRupiah(d.value)}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-[var(--app-card-subtle)] rounded-full h-1.5 border border-[var(--app-border)]/20 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full" 
                        style={{ width: `${(d.value / 125860500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed financial breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Laba Rugi */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Laba Rugi (Ringkas)</h4>
              <span className="text-[10px] text-[var(--app-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">Bulan Ini</span>
            </div>
            <div className="space-y-2.5 text-xs text-[var(--app-text)]/90">
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span>Total Pendapatan</span>
                <span className="font-semibold text-[var(--app-text)]">Rp 125.860.500</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span>Total Biaya</span>
                <span className="font-semibold text-[var(--app-text)]">Rp 45.230.000</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span className="font-bold text-[var(--app-text)]">Laba Kotor</span>
                <span className="font-bold text-[var(--app-text)]">Rp 80.630.500</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span>Biaya Operasional</span>
                <span className="font-semibold text-[var(--app-text)]">Rp 7.000.000</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-emerald-400">Laba Bersih</span>
                <span className="font-extrabold text-emerald-400">Rp 73.630.500</span>
              </div>
            </div>
          </div>

          {/* Neraca */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Neraca (Ringkas)</h4>
              <span className="text-[10px] text-[var(--app-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">Per 22 Oktober 2026</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-[var(--app-text)]/90">
              <div className="space-y-2">
                <p className="font-bold text-[var(--app-text)] uppercase text-[10px] tracking-wider">Aset</p>
                <div className="flex justify-between">
                  <span>Aset Lancar</span>
                  <span className="text-[var(--app-muted)]">Rp 210M</span>
                </div>
                <div className="flex justify-between">
                  <span>Aset Tetap</span>
                  <span className="text-[var(--app-muted)]">Rp 185M</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[var(--app-border)]">
                  <span className="font-bold">Total Aset</span>
                  <span className="font-bold text-[var(--app-text)]">Rp 395M</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-[var(--app-text)] uppercase text-[10px] tracking-wider">Liabilitas & Ekuitas</p>
                <div className="flex justify-between">
                  <span>Liabilitas Lancar</span>
                  <span className="text-[var(--app-muted)]">Rp 85M</span>
                </div>
                <div className="flex justify-between">
                  <span>Liabilitas Jk Panjang</span>
                  <span className="text-[var(--app-muted)]">Rp 25M</span>
                </div>
                <div className="flex justify-between">
                  <span>Ekuitas</span>
                  <span className="text-[var(--app-muted)]">Rp 285M</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[var(--app-border)]">
                  <span className="font-bold">Total L & E</span>
                  <span className="font-bold text-[var(--app-text)]">Rp 395M</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button className="text-[10px] text-blue-400 hover:underline">Lihat Detail Neraca</button>
            </div>
          </div>

          {/* Arus Kas Ringkas */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Arus Kas (Ringkas)</h4>
              <span className="text-[10px] text-[var(--app-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">Bulan Ini</span>
            </div>
            <div className="space-y-2.5 text-xs text-[var(--app-text)]/90">
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span>Arus Kas Operasional</span>
                <span className="font-semibold text-[var(--app-text)]">Rp 68.420.000</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span>Arus Kas Investasi</span>
                <span className="font-semibold text-rose-400">-Rp 15.300.000</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span>Arus Kas Pendanaan</span>
                <span className="font-semibold text-[var(--app-text)]">Rp 0</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--app-border)]/40">
                <span className="font-bold text-[var(--app-text)]">Kenaikan (Penurunan) Kas</span>
                <span className="font-bold text-[var(--app-text)]">Rp 53.120.000</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-emerald-400">Kas Akhir</span>
                <span className="font-extrabold text-emerald-400">Rp 68.420.000</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <button className="text-[10px] text-blue-400 hover:underline">Lihat Detail Arus Kas</button>
            </div>
          </div>

          {/* Pengeluaran per Kategori Donut */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Pengeluaran per Kategori</h4>
              <span className="text-[10px] text-[var(--app-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">Bulan Ini</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-24 h-24 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={42}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_EXPENSE[index % COLORS_EXPENSE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[8px] text-[var(--app-muted)] font-semibold uppercase">Total</p>
                  <p className="text-[9px] font-bold text-[var(--app-text)]">45.2M</p>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-[10px]">
                {expenseCategoryData.map((e, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_EXPENSE[index] }}></span>
                      <span className="text-[var(--app-text)]/90 max-w-[80px] truncate">{e.name}</span>
                    </div>
                    <span className="font-bold text-[var(--app-text)]">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 text-center">
              <button className="text-[10px] text-blue-400 hover:underline">Lihat Semua Pengeluaran</button>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
          <button 
            onClick={() => router.push('/finance/pendapatan')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Pendapatan</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Kelola semua sumber pendapatan & laporan</span>
          </button>

          <button 
            onClick={() => router.push('/finance/pengeluaran')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-pink-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-4 h-4 text-pink-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Pengeluaran</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Kelola biaya operasional & pengeluaran</span>
          </button>

          <button 
            onClick={() => router.push('/finance/anggaran')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Buat Anggaran</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Buat & kelola anggaran perusahaan</span>
          </button>

          <button 
            onClick={() => router.push('/finance/pajak')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Pajak</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Kelola pajak, PPN & pelaporan pajak</span>
          </button>

          <button 
            onClick={() => router.push('/finance/rekonsiliasi')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Rekonsiliasi</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Cocokkan transaksi dengan bank</span>
          </button>

          <button 
            onClick={() => router.push('/finance/settings')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Multi Metode Bayar</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Cash, Bank, E-Wallet & lainnya</span>
          </button>

          <button 
            onClick={() => router.push('/finance/laporan')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Laporan Otomatis</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Laporan keuangan otomatis</span>
          </button>

          <button 
            onClick={handleExport}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--app-card)] shadow-xs hover:bg-blue-600/10 border border-[var(--app-border)] hover:border-blue-500/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[11px] font-bold text-[var(--app-text)]">Ekspor Data</span>
            <span className="text-[9px] text-[var(--app-muted)] mt-0.5 line-clamp-2">Export ke Excel, PDF, CSV</span>
          </button>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl max-w-sm w-full p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filter Periode Waktu</h3>
              <div className="space-y-2">
                <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Pilih Periode</label>
                <select 
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    setShowFilterModal(false);
                  }}
                  className="w-full p-2 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-xs text-white"
                >
                  <option value="25 Juni 2026 - 22 Oktober 2026">25 Juni 2026 - 22 Oktober 2026 (7 Hari)</option>
                  <option value="01 Juni 2026 - 30 Juni 2026">01 Juni 2026 - 30 Juni 2026 (Bulan Ini)</option>
                  <option value="01 Mei 2026 - 31 Mei 2026">01 Mei 2026 - 31 Mei 2026 (Bulan Lalu)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="px-3 py-1.5 rounded bg-[var(--app-card-subtle)] text-xs font-semibold text-[var(--app-text)]/90 hover:text-white"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
