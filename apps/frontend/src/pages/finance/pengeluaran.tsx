import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
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
  Trash,
  PlusCircle,
  Settings,
  Bell,
  Mail,
  CheckCircle,
  AlertCircle,
  X,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_KATEGORI = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#14B8A6', '#8B5CF6'];
const COLORS_METODE = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function PengeluaranDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Filter states
  const [filterPeriod, setFilterPeriod] = useState('25/06/2026 - 22/10/2026');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterKategori, setFilterKategori] = useState('Semua Kategori');
  const [filterVendor, setFilterVendor] = useState('Semua Vendor');
  const [filterMetode, setFilterMetode] = useState('Semua Metode');
  const [filterProyek, setFilterProyek] = useState('Semua Proyek');
  const [filterMinNominal, setFilterMinNominal] = useState('');
  const [filterMaxNominal, setFilterMaxNominal] = useState('');

  // Transaction list (Mock matching the screenshot)
  const initialTransactions = [
    { no: 1, tanggal: '22/10/2026 09:21', invoice: 'EXP/2026/07/000342', vendor: 'PT. Cloud Nusantara', kategori: 'Server & Hosting', metode: 'Transfer Bank', total: 2450000, status: 'Lunas' },
    { no: 2, tanggal: '22/10/2026 08:45', invoice: 'EXP/2026/07/000341', vendor: 'Telkom Indonesia', kategori: 'Bandwidth & Internet', metode: 'Virtual Account', total: 1850000, status: 'Lunas' },
    { no: 3, tanggal: '22/10/2026 08:10', invoice: 'EXP/2026/07/000340', vendor: 'PLN', kategori: 'Listrik & Utilitas', metode: 'Transfer Bank', total: 950000, status: 'Lunas' },
    { no: 4, tanggal: '30/06/2026 17:22', invoice: 'EXP/2026/06/000339', vendor: 'Andi Pratama', kategori: 'Office & Umum', metode: 'E-Wallet', total: 350000, status: 'Lunas' },
    { no: 5, tanggal: '30/06/2026 16:35', invoice: 'EXP/2026/06/000338', vendor: 'CV. Maju Jaya', kategori: 'Marketing', metode: 'Transfer Bank', total: 1200000, status: 'Sebagian' },
    { no: 6, tanggal: '30/06/2026 15:12', invoice: 'EXP/2026/06/000337', vendor: 'Rina Marlina', kategori: 'Gaji & SDM', metode: 'Transfer Bank', total: 8500000, status: 'Lunas' },
    { no: 7, tanggal: '30/06/2026 14:05', invoice: 'EXP/2026/06/000336', vendor: 'AWS (Amazon Web)', kategori: 'Server & Hosting', metode: 'Virtual Account', total: 1750000, status: 'Belum Lunas' },
    { no: 8, tanggal: '30/06/2026 11:33', invoice: 'EXP/2026/06/000335', vendor: 'Google Workspace', kategori: 'Software', metode: 'E-Wallet', total: 450000, status: 'Lunas' },
    { no: 9, tanggal: '29/06/2026 09:50', invoice: 'EXP/2026/06/000334', vendor: 'Fajar Nugroho', kategori: 'Office & Umum', metode: 'Tunai', total: 120000, status: 'Lunas' },
    { no: 10, tanggal: '28/06/2026 16:20', invoice: 'EXP/2026/06/000333', vendor: 'DigitalOcean', kategori: 'Server & Hosting', metode: 'Transfer Bank', total: 1200000, status: 'Lunas' }
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetailTx, setSelectedDetailTx] = useState<any | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // New transaction form state
  const [newDate, setNewDate] = useState('22/10/2026 11:00');
  const [newInvoice, setNewInvoice] = useState('EXP/2026/07/000350');
  const [newVendor, setNewVendor] = useState('');
  const [newKategori, setNewKategori] = useState('Server & Hosting');
  const [newMetode, setNewMetode] = useState('Transfer Bank');
  const [newTotal, setNewTotal] = useState('');
  const [newStatus, setNewStatus] = useState('Lunas');

  const applyFilters = () => {
    let result = [...transactions];

    if (filterStatus !== 'Semua Status') {
      result = result.filter(t => t.status === filterStatus);
    }
    if (filterKategori !== 'Semua Kategori') {
      result = result.filter(t => t.kategori === filterKategori);
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
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterStatus('Semua Status');
    setFilterKategori('Semua Kategori');
    setFilterMetode('Semua Metode');
    setFilterMinNominal('');
    setFilterMaxNominal('');
    setFilteredTransactions(transactions);
    setCurrentPage(1);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor || !newTotal) return;

    const newTx = {
      no: transactions.length + 1,
      tanggal: newDate,
      invoice: newInvoice,
      vendor: newVendor,
      kategori: newKategori,
      metode: newMetode,
      total: parseInt(newTotal),
      status: newStatus
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    setFilteredTransactions(updated);
    setShowAddModal(false);

    // reset inputs
    setNewVendor('');
    setNewTotal('');
    setNewInvoice(`EXP/2026/07/00${350 + transactions.length}`);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["NO,TANGGAL,NO. PENGELUARAN,VENDOR / SUPPLIER,KATEGORI,METODE,TOTAL,STATUS", 
         ...filteredTransactions.map(t => `${t.no},${t.tanggal},${t.invoice},"${t.vendor}",${t.kategori},${t.metode},${t.total},${t.status}`)
        ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_pengeluaran_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sparkline data
  const sparkData = {
    total: [{ v: 75 }, { v: 80 }, { v: 78 }, { v: 85 }, { v: 82 }, { v: 88 }, { v: 82.7 }],
    operasional: [{ v: 45 }, { v: 48 }, { v: 46 }, { v: 51 }, { v: 49 }, { v: 52 }, { v: 48.65 }],
    nonOperasional: [{ v: 15 }, { v: 14 }, { v: 16 }, { v: 13 }, { v: 14 }, { v: 12 }, { v: 12.83 }],
    tetap: [{ v: 20 }, { v: 20 }, { v: 21 }, { v: 21 }, { v: 21 }, { v: 22 }, { v: 21.25 }],
    rataRata: [{ v: 2.4 }, { v: 2.6 }, { v: 2.5 }, { v: 2.8 }, { v: 2.7 }, { v: 2.9 }, { v: 2.66 }],
    transaksi: [{ v: 310 }, { v: 330 }, { v: 320 }, { v: 350 }, { v: 335 }, { v: 360 }, { v: 342 }]
  };

  // Tren Pengeluaran Harian
  const dailyTrendData = [
    { name: '25 Jun', Tren: 11 },
    { name: '26 Jun', Tren: 15 },
    { name: '27 Jun', Tren: 13 },
    { name: '28 Jun', Tren: 10 },
    { name: '29 Jun', Tren: 12 },
    { name: '30 Jun', Tren: 11 },
    { name: '01 Jul', Tren: 14 }
  ];

  // Donut data
  const categoryData = [
    { name: 'Server & Hosting', value: 22450000, percent: '27.1%' },
    { name: 'Bandwidth & Internet', value: 15200000, percent: '18.4%' },
    { name: 'Gaji & SDM', value: 12850000, percent: '15.5%' },
    { name: 'Listrik & Utilitas', value: 9450000, percent: '11.4%' },
    { name: 'Marketing', value: 6730000, percent: '8.1%' },
    { name: 'Office & Umum', value: 5180000, percent: '6.3%' },
    { name: 'Lainnya', value: 10870500, percent: '13.2%' }
  ];

  const paymentMethodData = [
    { name: 'Transfer Bank', value: 45320000, percent: '54.8%' },
    { name: 'E-Wallet', value: 18650000, percent: '22.5%' },
    { name: 'Virtual Account', value: 12830000, percent: '15.5%' },
    { name: 'Tunai', value: 3930000, percent: '4.8%' },
    { name: 'Kartu Kredit', value: 0, percent: '0%' },
    { name: 'Lainnya', value: 0, percent: '0%' }
  ];

  const vendorData = [
    { name: 'PT. Cloud Nusantara', value: 12450000, percent: '15.0%' },
    { name: 'Telkom Indonesia', value: 10850000, percent: '13.1%' },
    { name: 'AWS (Amazon Web)', value: 8750000, percent: '10.6%' },
    { name: 'PLN', value: 6450000, percent: '7.8%' },
    { name: 'Google Workspace', value: 4250000, percent: '5.1%' }
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
              <span className="text-emerald-500 font-semibold">Pengeluaran</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)]">Pengeluaran</h1>
            <p className="text-xs text-[var(--app-muted)] mt-1">Kelola semua pengeluaran dan analisis performa biaya operasional.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] text-xs">
              <span className="text-[var(--app-muted)] font-medium">25 Juni 2026 - 22 Oktober 2026</span>
            </div>
            <button 
              onClick={() => {
                applyFilters();
                toast.success("Penyaringan data transaksi pengeluaran diterapkan.");
              }} 
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

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Pengeluaran */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Pengeluaran</p>
            <h3 className="text-base font-bold text-[var(--app-text)] mt-1">Rp 82.730.500</h3>
            <span className="text-[10px] text-emerald-400 flex items-center font-semibold mt-1">
              ▲ 8.4% <span className="text-[var(--app-muted)] font-normal ml-1">vs lalu</span>
            </span>
            <div className="h-8 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.total}>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} fill="rgba(59, 130, 246, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pengeluaran Operasional */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Pengeluaran Operasional</p>
            <h3 className="text-base font-bold text-[var(--app-text)] mt-1">Rp 48.650.000</h3>
            <span className="text-[10px] text-emerald-400 flex items-center font-semibold mt-1">
              ▲ 6.2% <span className="text-[var(--app-muted)] font-normal ml-1">vs lalu</span>
            </span>
            <div className="h-8 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.operasional}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={1.5} fill="rgba(16, 185, 129, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pengeluaran Non Operasional */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Pengeluaran Non Operasional</p>
            <h3 className="text-base font-bold text-[var(--app-text)] mt-1">Rp 12.830.000</h3>
            <span className="text-[10px] text-rose-400 flex items-center font-semibold mt-1">
              ▼ 3.6% <span className="text-[var(--app-muted)] font-normal ml-1">vs lalu</span>
            </span>
            <div className="h-8 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.nonOperasional}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={1.5} fill="rgba(16, 185, 129, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pengeluaran Tetap */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Pengeluaran Tetap</p>
            <h3 className="text-base font-bold text-[var(--app-text)] mt-1">Rp 21.250.000</h3>
            <span className="text-[10px] text-emerald-400 flex items-center font-semibold mt-1">
              ▲ 9.1% <span className="text-[var(--app-muted)] font-normal ml-1">vs lalu</span>
            </span>
            <div className="h-8 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.tetap}>
                  <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} fill="rgba(245, 158, 11, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rata-rata per Hari */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Rata-rata per Hari</p>
            <h3 className="text-base font-bold text-[var(--app-text)] mt-1">Rp 2.669.371</h3>
            <span className="text-[10px] text-emerald-400 flex items-center font-semibold mt-1">
              ▲ 8.4% <span className="text-[var(--app-muted)] font-normal ml-1">vs lalu</span>
            </span>
            <div className="h-8 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.rataRata}>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} fill="rgba(59, 130, 246, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaksi Pengeluaran */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-[11px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Transaksi Pengeluaran</p>
            <h3 className="text-base font-bold text-[var(--app-text)] mt-1">342</h3>
            <span className="text-[10px] text-emerald-400 flex items-center font-semibold mt-1">
              ▲ 11.2% <span className="text-[var(--app-muted)] font-normal ml-1">vs lalu</span>
            </span>
            <div className="h-8 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData.transaksi}>
                  <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={1.5} fill="rgba(139, 92, 246, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--app-border)]/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Ringkasan', 'Transaksi Pengeluaran', 'Kategori Pengeluaran', 'Vendor / Supplier', 'Metode Pembayaran', 'Proyek / Department', 'Anggaran', 'Tren Pengeluaran'].map((tab) => (
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

        {/* Tab Content: Ringkasan */}
        {activeTab === 'Ringkasan' && (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Tren Pengeluaran */}
              <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Tren Pengeluaran</h4>
                  <span className="text-[10px] text-[var(--app-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">7 Hari Terakhir</span>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8, fontSize: 11 }} />
                      <Area type="monotone" dataKey="Tren" stroke="#8b5cf6" strokeWidth={2.5} fill="rgba(139, 92, 246, 0.08)" dot={{ r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pengeluaran per Kategori */}
              <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase mb-3">Pengeluaran per Kategori</h4>
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_KATEGORI[index % COLORS_KATEGORI.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-[8px] text-[var(--app-muted)] font-semibold uppercase">Total</p>
                      <p className="text-[9px] font-bold text-[var(--app-text)]">82.7M</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 text-[10px] overflow-y-auto max-h-[140px] pr-1">
                    {categoryData.map((e, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS_KATEGORI[index] }}></span>
                          <span className="text-[var(--app-text)]/90 max-w-[80px] truncate">{e.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[var(--app-text)] font-semibold block">{formatRupiah(e.value)}</span>
                          <span className="text-[8px] text-[var(--app-muted)]">{e.percent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pengeluaran per Metode Pembayaran */}
              <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase mb-3">Pengeluaran per Metode Pembayaran</h4>
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
                      <p className="text-[9px] font-bold text-[var(--app-text)]">82.7M</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 text-[10px] overflow-y-auto max-h-[140px] pr-1">
                    {paymentMethodData.map((e, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS_METODE[index] }}></span>
                          <span className="text-[var(--app-text)]/90 max-w-[80px] truncate">{e.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[var(--app-text)] font-semibold block">{formatRupiah(e.value)}</span>
                          <span className="text-[8px] text-[var(--app-muted)]">{e.percent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Filter, Table, Summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filter Sidebar (1/4 column) */}
              <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase border-b border-[var(--app-border)]/60 pb-2">Filter Pengeluaran</h3>

                <div className="space-y-3.5 text-xs">
                  {/* Periode */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Periode</label>
                    <input 
                      type="text" 
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]" 
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Status</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]"
                    >
                      <option>Semua Status</option>
                      <option>Lunas</option>
                      <option>Sebagian</option>
                      <option>Belum Lunas</option>
                      <option>Dibatalkan</option>
                    </select>
                  </div>

                  {/* Kategori */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Kategori</label>
                    <select 
                      value={filterKategori}
                      onChange={(e) => setFilterKategori(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]"
                    >
                      <option>Semua Kategori</option>
                      <option>Server & Hosting</option>
                      <option>Bandwidth & Internet</option>
                      <option>Listrik & Utilitas</option>
                      <option>Office & Umum</option>
                      <option>Marketing</option>
                      <option>Gaji & SDM</option>
                    </select>
                  </div>

                  {/* Vendor / Supplier */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Vendor / Supplier</label>
                    <select 
                      value={filterVendor}
                      onChange={(e) => setFilterVendor(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]"
                    >
                      <option>Semua Vendor</option>
                    </select>
                  </div>

                  {/* Metode Pembayaran */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Metode Pembayaran</label>
                    <select 
                      value={filterMetode}
                      onChange={(e) => setFilterMetode(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]"
                    >
                      <option>Semua Metode</option>
                      <option>Transfer Bank</option>
                      <option>Virtual Account</option>
                      <option>E-Wallet</option>
                      <option>Tunai</option>
                    </select>
                  </div>

                  {/* Proyek / Department */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Proyek / Department</label>
                    <select 
                      value={filterProyek}
                      onChange={(e) => setFilterProyek(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]"
                    >
                      <option>Semua Proyek</option>
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
                        className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Max Nominal</label>
                      <input 
                        type="text" 
                        placeholder="Rp 0" 
                        value={filterMaxNominal}
                        onChange={(e) => setFilterMaxNominal(e.target.value)}
                        className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white text-[11px]" 
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
                      className="w-full py-2 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-hover)] rounded text-xs font-semibold text-[var(--app-text)]/90 hover:text-white transition-colors border border-[var(--app-border)]"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Status Breakdown Checklist */}
                <div className="pt-3.5 border-t border-[var(--app-border)]/40 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-[var(--app-muted)] font-semibold uppercase">
                    <span>Status Pengeluaran</span>
                    <span>342</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-emerald-500"></span> Lunas
                      </span>
                      <span className="font-semibold text-[var(--app-text)]">267 <span className="text-[10px] font-normal text-[var(--app-muted)]">(78.1%)</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-amber-500"></span> Sebagian
                      </span>
                      <span className="font-semibold text-[var(--app-text)]">36 <span className="text-[10px] font-normal text-[var(--app-muted)]">(10.5%)</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-orange-500"></span> Belum Lunas
                      </span>
                      <span className="font-semibold text-[var(--app-text)]">28 <span className="text-[10px] font-normal text-[var(--app-muted)]">(8.2%)</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-text)]/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-red-600"></span> Dibatalkan
                      </span>
                      <span className="font-semibold text-[var(--app-text)]">11 <span className="text-[10px] font-normal text-[var(--app-muted)]">(3.2%)</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table (2/4 columns) */}
              <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Transaksi Pengeluaran Terbaru</h3>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pengeluaran Baru</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--app-border)] text-[var(--app-muted)]">
                        <th className="py-2.5 font-medium">NO</th>
                        <th className="py-2.5 font-medium">TANGGAL</th>
                        <th className="py-2.5 font-medium">NO. PENGELUARAN</th>
                        <th className="py-2.5 font-medium">VENDOR / SUPPLIER</th>
                        <th className="py-2.5 font-medium">KATEGORI</th>
                        <th className="py-2.5 font-medium">METODE</th>
                        <th className="py-2.5 font-medium text-right">TOTAL</th>
                        <th className="py-2.5 font-medium text-center">STATUS</th>
                        <th className="py-2.5 font-medium text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]/90">
                      {paginatedTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-xs text-[var(--app-muted)]">
                            Tidak ada catatan pengeluaran yang sesuai filter.
                          </td>
                        </tr>
                      ) : (
                        paginatedTransactions.map((tx, idx) => (
                          <tr key={idx} className="hover:bg-[var(--app-card-subtle)]/20">
                            <td className="py-3 text-[var(--app-muted)]">{(currentPage - 1) * pageSize + idx + 1}</td>
                            <td className="py-3 text-[var(--app-muted)] whitespace-nowrap">{tx.tanggal}</td>
                            <td className="py-3 font-semibold text-cyan-400 whitespace-nowrap">{tx.invoice}</td>
                            <td className="py-3 font-medium text-white">{tx.vendor}</td>
                            <td className="py-3 text-[var(--app-muted)]">{tx.kategori}</td>
                            <td className="py-3 text-[var(--app-text)]/90">{tx.metode}</td>
                            <td className="py-3 text-right font-bold text-[var(--app-text)] whitespace-nowrap">{formatRupiah(tx.total)}</td>
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
                                <button 
                                  onClick={() => setSelectedDetailTx(tx)} 
                                  title="Lihat Rincian Pengeluaran"
                                  className="p-1 text-[var(--app-muted)] hover:text-cyan-400 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (confirm("Hapus pencatatan pengeluaran ini?")) {
                                      const updated = transactions.filter(t => t.invoice !== tx.invoice);
                                      setTransactions(updated);
                                      setFilteredTransactions(updated);
                                      toast.success("Catatan pengeluaran berhasil dihapus.");
                                    }
                                  }}
                                  title="Hapus Catatan"
                                  className="p-1 text-[var(--app-muted)] hover:text-rose-500 transition-colors"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Universal Pagination */}
                <div className="pt-4 border-t border-[var(--app-border)]/40">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredTransactions.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newSize: number) => {
                      setPageSize(newSize);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Summaries (1/4 column) */}
              <div className="space-y-6">
                {/* Ringkasan Pengeluaran */}
                <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 space-y-3.5">
                  <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase border-b border-[var(--app-border)]/60 pb-2">Ringkasan Pengeluaran</h4>
                  <div className="space-y-2 text-xs text-[var(--app-text)]/90">
                    <div className="flex justify-between pb-1 border-b border-[var(--app-border)]/40">
                      <span>Total Pengeluaran</span>
                      <span className="font-semibold text-[var(--app-text)]">Rp 82.730.500</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-[var(--app-border)]/40">
                      <span>Pengeluaran Operasional</span>
                      <span className="font-semibold text-[var(--app-text)]">Rp 48.650.000</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-[var(--app-border)]/40">
                      <span>Pengeluaran Non Operasional</span>
                      <span className="font-semibold text-[var(--app-text)]">Rp 12.830.000</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-[var(--app-border)]/40">
                      <span>Pengeluaran Tetap</span>
                      <span className="font-semibold text-[var(--app-text)]">Rp 21.250.000</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-[var(--app-border)]/40">
                      <span>Pengeluaran Variabel</span>
                      <span className="font-semibold text-[var(--app-text)]">Rp 27.400.000</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-[var(--app-border)]/40">
                      <span>Penghematan (Budget)</span>
                      <span className="font-semibold text-emerald-400">Rp 6.740.000</span>
                    </div>
                    <div className="flex justify-between pt-1 text-cyan-400 font-bold">
                      <span>Persentase Budget</span>
                      <span>88.6%</span>
                    </div>
                  </div>
                </div>

                {/* Top 5 Vendor */}
                <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center border-b border-[var(--app-border)]/60 pb-2">
                    <h4 className="text-xs font-bold text-[var(--app-text)] tracking-wide uppercase">Top 5 Vendor</h4>
                    <button 
                      onClick={() => {
                        resetFilters();
                        toast.success("Menampilkan seluruh transaksi pengeluaran.");
                      }} 
                      className="text-[10px] font-semibold text-cyan-400 hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>
                  <div className="space-y-3 text-xs">
                    {vendorData.map((d, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-[var(--app-text)]/90 font-medium">{index + 1}. {d.name}</span>
                          <span className="font-semibold text-[var(--app-text)]">{formatRupiah(d.value)}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-[var(--app-card-subtle)] rounded-full h-1 border border-[var(--app-border)]/20 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full" 
                            style={{ width: d.percent }}
                          ></div>
                        </div>
                        <div className="text-right text-[9px] text-[var(--app-muted)] mt-0.5">{d.percent}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <form onSubmit={handleAddTransaction} className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[var(--app-border)] pb-2">Tambah Pengeluaran Baru</h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Tanggal & Waktu</label>
                  <input 
                    type="text" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">No. Pengeluaran</label>
                  <input 
                    type="text" 
                    value={newInvoice} 
                    onChange={(e) => setNewInvoice(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[var(--app-muted)]">Vendor / Supplier</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nama vendor..."
                  value={newVendor} 
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Kategori</label>
                  <select 
                    value={newKategori} 
                    onChange={(e) => setNewKategori(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white"
                  >
                    <option>Server & Hosting</option>
                    <option>Bandwidth & Internet</option>
                    <option>Listrik & Utilitas</option>
                    <option>Office & Umum</option>
                    <option>Marketing</option>
                    <option>Gaji & SDM</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Metode Pembayaran</label>
                  <select 
                    value={newMetode} 
                    onChange={(e) => setNewMetode(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white"
                  >
                    <option>Transfer Bank</option>
                    <option>Virtual Account</option>
                    <option>E-Wallet</option>
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
                    placeholder="Contoh: 150000"
                    value={newTotal} 
                    onChange={(e) => setNewTotal(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[var(--app-muted)]">Status</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white"
                  >
                    <option>Lunas</option>
                    <option>Sebagian</option>
                    <option>Belum Lunas</option>
                    <option>Dibatalkan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--app-border)]">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-hover)] text-xs font-semibold text-[var(--app-text)]/90"
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

        {/* ─── MODAL DETAIL PENGELUARAN ─── */}
        {selectedDetailTx && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between bg-[var(--app-bg)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Rincian Pengeluaran</span>
                  <h3 className="text-sm font-bold text-white font-mono mt-0.5">{selectedDetailTx.invoice}</h3>
                </div>
                <button 
                  onClick={() => setSelectedDetailTx(null)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-white hover:bg-[var(--app-border)]/20"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)]">
                  <div>
                    <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase">Status Pembayaran</p>
                    <p className="font-bold text-white mt-0.5">{selectedDetailTx.status}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedDetailTx.status === 'Lunas' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                    selectedDetailTx.status === 'Sebagian' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                    selectedDetailTx.status === 'Belum Lunas' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                    'bg-red-500/15 text-red-400 border border-red-500/20'
                  }`}>
                    {selectedDetailTx.status}
                  </span>
                </div>

                <div className="p-3 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Vendor / Supplier:</span>
                    <span className="font-bold text-white">{selectedDetailTx.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Tanggal Pengeluaran:</span>
                    <span className="font-bold text-white">{selectedDetailTx.tanggal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Kategori Biaya:</span>
                    <span className="font-bold text-rose-400">{selectedDetailTx.kategori}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Metode Pembayaran:</span>
                    <span className="font-bold text-white">{selectedDetailTx.metode}</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--app-border)] pt-2 text-sm">
                    <span className="font-bold text-white">Total Pengeluaran:</span>
                    <span className="font-black text-rose-400">{formatRupiah(selectedDetailTx.total)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--app-border)]">
                  <button
                    onClick={() => {
                      toast.info(`Mencetak bukti pengeluaran ${selectedDetailTx.invoice}...`);
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white rounded-xl text-xs font-semibold"
                  >
                    <Printer size={14} />
                    <span>Cetak Bukti</span>
                  </button>
                  <button
                    onClick={() => setSelectedDetailTx(null)}
                    className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-white rounded-xl text-xs font-semibold"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
