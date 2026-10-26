import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Trash2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  Clock,
  Briefcase,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  Sliders,
  CheckSquare,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertTriangle
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
  Cell
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_RECON = ['#10B981', '#F59E0B', '#EF4444', '#6366F1'];

interface TransactionReconcile {
  id: number;
  tanggal: string;
  referensi: string;
  sumber: string;
  deskripsi: string;
  metode: string;
  debit: number; // Mutasi Bank
  kredit: number; // Sistem internal
  selisih: number;
  status: 'Cocok' | 'Tidak Cocok' | 'Belum Cocok' | 'Dalam Proses';
  dicocokkanDengan: string;
}

export default function Rekonsiliasi() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSumber, setSelectedSumber] = useState('Semua Sumber');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedMetode, setSelectedMetode] = useState('Semua Metode');
  const [dateRange, setDateRange] = useState('25/06/2026 - 22/10/2026');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState<TransactionReconcile | null>(null);
  
  // Simulation Match status
  const [isProcessingAutoMatch, setIsProcessingAutoMatch] = useState(false);

  // Form State - Add new reconciliation record
  const [newRef, setNewRef] = useState('');
  const [newSumber, setNewSumber] = useState('Bank BCA');
  const [newDeskripsi, setNewDeskripsi] = useState('');
  const [newMetode, setNewMetode] = useState('Transfer Bank');
  const [newDebit, setNewDebit] = useState('');
  const [newKredit, setNewKredit] = useState('');
  const [newStatus, setNewStatus] = useState<'Cocok' | 'Tidak Cocok' | 'Belum Cocok' | 'Dalam Proses'>('Cocok');

  // Core Reconciliation Dataset matching mockup
  const [transactions, setTransactions] = useState<TransactionReconcile[]>([
    { id: 1, tanggal: '22/10/2026 08:35', referensi: 'BCA-010726-0001', sumber: 'Bank BCA', deskripsi: 'Pembayaran Invoice INV/2026/07/001245 - Budi Santoso', metode: 'Transfer Bank', debit: 550000, kredit: 550000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/07/001245' },
    { id: 2, tanggal: '22/10/2026 08:32', referensi: 'BCA-010726-0002', sumber: 'Bank BCA', deskripsi: 'Pembayaran Invoice INV/2026/07/001246 - Sari Dewi', metode: 'Transfer Bank', debit: 750000, kredit: 750000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/07/001246' },
    { id: 3, tanggal: '22/10/2026 08:30', referensi: 'MAND-010726-0001', sumber: 'Bank Mandiri', deskripsi: 'Top Up Saldo Customer - Andi Pratama', metode: 'Transfer Bank', debit: 300000, kredit: 300000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/07/001247' },
    { id: 4, tanggal: '22/10/2026 08:28', referensi: 'OVO-010726-0001', sumber: 'OVO', deskripsi: 'Pembayaran Invoice INV/2026/07/001248 - Dimas Setiawan', metode: 'E-Wallet', debit: 200000, kredit: 200000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/07/001248' },
    { id: 5, tanggal: '22/10/2026 08:27', referensi: 'DANA-010726-0001', sumber: 'DANA', deskripsi: 'Pembayaran Invoice INV/2026/07/001249 - Rina Wahyuni', metode: 'E-Wallet', debit: 150000, kredit: 150000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/07/001249' },
    { id: 6, tanggal: '22/10/2026 08:26', referensi: 'GOPAY-010726-0001', sumber: 'GoPay', deskripsi: 'Top Up Saldo Customer - Joko Susilo', metode: 'E-Wallet', debit: 100000, kredit: 100000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/07/001250' },
    { id: 7, tanggal: '22/10/2026 08:25', referensi: 'BCA-010726-0003', sumber: 'Bank BCA', deskripsi: 'Pembayaran Invoice INV/2026/07/001251 - Nur Aini', metode: 'Transfer Bank', debit: 500000, kredit: 480000, selisih: 20000, status: 'Tidak Cocok', dicocokkanDengan: 'INV/2026/07/001251' },
    { id: 8, tanggal: '22/10/2026 08:24', referensi: 'MAND-010726-0002', sumber: 'Bank Mandiri', deskripsi: 'Pembayaran Invoice INV/2026/07/001252 - Agung Wibowo', metode: 'Transfer Bank', debit: 750000, kredit: 0, selisih: 750000, status: 'Belum Cocok', dicocokkanDengan: '-' },
    { id: 9, tanggal: '22/10/2026 08:23', referensi: 'BCA-010726-0004', sumber: 'Bank BCA', deskripsi: 'Biaya Admin', metode: 'Transfer Bank', debit: 6500, kredit: 0, selisih: 6500, status: 'Belum Cocok', dicocokkanDengan: '-' },
    { id: 10, tanggal: '22/10/2026 08:22', referensi: 'OVO-010726-0002', sumber: 'OVO', deskripsi: 'Pembayaran Invoice INV/2026/07/001253 - Wahyu Hidayat', metode: 'E-Wallet', debit: 250000, kredit: 0, selisih: 250000, status: 'Dalam Proses', dicocokkanDengan: '-' },
    { id: 11, tanggal: '30/06/2026 18:40', referensi: 'MAND-300626-0012', sumber: 'Bank Mandiri', deskripsi: 'Pembayaran Invoice INV/2026/06/001198 - Hendra Wijaya', metode: 'Transfer Bank', debit: 450000, kredit: 450000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/06/001198' },
    { id: 12, tanggal: '30/06/2026 17:15', referensi: 'BCA-300626-0089', sumber: 'Bank BCA', deskripsi: 'Pembayaran Invoice INV/2026/06/001197 - Maria Utami', metode: 'Transfer Bank', debit: 1200000, kredit: 1200000, selisih: 0, status: 'Cocok', dicocokkanDengan: 'INV/2026/06/001197' }
  ]);

  // Calculations
  const metrics = useMemo(() => {
    const totalCount = transactions.length + 32; // Simulating 44 items
    const cocok = transactions.filter(t => t.status === 'Cocok').reduce((acc, t) => acc + t.debit, 0) + 2985000000;
    const belum = transactions.filter(t => t.status === 'Belum Cocok').reduce((acc, t) => acc + t.debit, 0) + 212000000;
    const selisih = transactions.filter(t => t.status === 'Tidak Cocok').reduce((acc, t) => acc + t.selisih, 0) + 44600000;
    
    return {
      total: cocok + belum + selisih,
      cocok,
      belum,
      selisih,
      inProgress: transactions.filter(t => t.status === 'Dalam Proses').length,
      totalCount,
      rate: 91.95
    };
  }, [transactions]);

  // Payment sources breakdown data
  const sourcesData = [
    { name: 'Bank BCA', value: 1250450000, total: 1620750000, percent: '92.1%' },
    { name: 'Bank Mandiri', value: 980750000, total: 1070250000, percent: '91.3%' },
    { name: 'OVO', value: 450250000, total: 670500000, percent: '90.3%' },
    { name: 'DANA', value: 320750000, total: 420750000, percent: '88.7%' },
    { name: 'GoPay', value: 243550000, total: 243550000, percent: '87.6%' }
  ];

  // Donut data
  const pieData = [
    { name: 'Cocok', value: metrics.cocok },
    { name: 'Belum Cocok', value: metrics.belum },
    { name: 'Selisih', value: metrics.selisih },
    { name: 'Dalam Proses', value: metrics.inProgress * 100000 }
  ];

  // Composed Trend chart data (Daily Reconcile Performance)
  const trendData = [
    { name: '25 Jun', Volume: 400, Cocok: 360, Belum: 40, Rate: 90 },
    { name: '26 Jun', Volume: 600, Cocok: 550, Belum: 50, Rate: 91.6 },
    { name: '27 Jun', Volume: 450, Cocok: 410, Belum: 40, Rate: 91.1 },
    { name: '28 Jun', Volume: 500, Cocok: 460, Belum: 40, Rate: 92 },
    { name: '29 Jun', Volume: 520, Cocok: 480, Belum: 40, Rate: 92.3 },
    { name: '30 Jun', Volume: 580, Cocok: 530, Belum: 50, Rate: 91.3 },
    { name: '01 Jul', Volume: 700, Cocok: 645, Belum: 55, Rate: 92.1 }
  ];

  // Filter application
  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
      const matchSearch = item.referensi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.dicocokkanDengan.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSumber = selectedSumber === 'Semua Sumber' || item.sumber === selectedSumber;
      const matchStatus = selectedStatus === 'Semua Status' || item.status === selectedStatus;
      const matchMetode = selectedMetode === 'Semua Metode' || item.metode === selectedMetode;
      
      return matchSearch && matchSumber && matchStatus && matchMetode;
    });
  }, [transactions, searchTerm, selectedSumber, selectedStatus, selectedMetode]);

  // Paginated Data
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTransactions, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSumber('Semua Sumber');
    setSelectedStatus('Semua Status');
    setSelectedMetode('Semua Metode');
    setDateRange('25/06/2026 - 22/10/2026');
    setCurrentPage(1);
  };

  // Submit new manual reconciliation
  const handleCreateReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRef || !newDebit) return;

    const debitVal = parseFloat(newDebit);
    const kreditVal = newKredit ? parseFloat(newKredit) : 0;
    const diff = Math.abs(debitVal - kreditVal);

    const newRecon: TransactionReconcile = {
      id: transactions.length + 1,
      tanggal: new Date().toLocaleString('id-ID', { hour12: false }).replace(/\./g, ':'),
      referensi: newRef,
      sumber: newSumber,
      deskripsi: newDeskripsi,
      metode: newMetode,
      debit: debitVal,
      kredit: kreditVal,
      selisih: diff,
      status: newStatus,
      dicocokkanDengan: newStatus === 'Cocok' ? 'INV/2026/07/00' + (1254 + transactions.length) : '-'
    };

    setTransactions([newRecon, ...transactions]);
    setShowAddModal(false);
    
    // Reset Form
    setNewRef('');
    setNewDeskripsi('');
    setNewDebit('');
    setNewKredit('');
    setNewStatus('Cocok');
  };

  // Automated match process simulation
  const triggerAutoMatch = () => {
    setIsProcessingAutoMatch(true);
    setTimeout(() => {
      // Find "Belum Cocok" items and match them
      const updated = transactions.map(t => {
        if (t.status === 'Belum Cocok' && t.debit > 0) {
          return {
            ...t,
            kredit: t.debit,
            selisih: 0,
            status: 'Cocok' as const,
            dicocokkanDengan: 'INV/AUTO/07/00' + t.id
          };
        }
        return t;
      });
      setTransactions(updated);
      setIsProcessingAutoMatch(false);
      alert('Pencocokan Otomatis Selesai! Transaksi yang valid telah dicocokkan.');
    }, 2000);
  };

  // Delete transaction from list
  const handleDeleteItem = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pencocokan ini?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = 'NO,TANGGAL,REFERENSI,SUMBER,DESKRIPSI,METODE,DEBIT,KREDIT,SELISIH,STATUS,DICOCOKKAN DENGAN\n';
    const rows = filteredTransactions.map((t, idx) => 
      `${idx + 1},${t.tanggal},${t.referensi},${t.sumber},"${t.deskripsi}",${t.metode},${t.debit},${t.kredit},${t.selisih},${t.status},${t.dicocokkanDengan}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Riwayat_Rekonsiliasi_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="bg-[var(--app-bg)] text-[var(--app-text)] min-h-screen p-6 font-sans antialiased selection:bg-cyan-500 selection:text-white">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] mb-1">
              <span>Finance</span>
              <span>&gt;</span>
              <span className="text-cyan-400 font-medium">Rekonsiliasi</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--app-text)] tracking-tight">Rekonsiliasi</h1>
            <p className="text-xs text-[var(--app-muted)] mt-0.5">Cocokkan transaksi internal dengan mutasi bank, e-wallet, atau gateway pembayaran.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-blue-600/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Rekonsiliasi Baru</span>
            </button>
            <button className="flex items-center gap-1.5 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-medium px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Import Mutasi</span>
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-medium px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
            <button className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Bantuan</span>
            </button>
          </div>
        </div>

        {/* METRICS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {/* Card 1 */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-blue-600/10 p-2 rounded-lg text-blue-500">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                +12.8%
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Total Rekonsiliasi</div>
            <div className="text-lg font-bold text-[var(--app-text)] mt-1">{formatRupiah(metrics.total)}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">dari periode lalu</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-emerald-600/10 p-2 rounded-lg text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                91.95%
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Sudah Cocok</div>
            <div className="text-lg font-bold text-[var(--app-text)] mt-1">{formatRupiah(metrics.cocok)}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">dari total transaksi</div>
          </div>

          {/* Card 3 */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-amber-600/10 p-2 rounded-lg text-amber-500">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                +6.58%
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Belum Cocok</div>
            <div className="text-lg font-bold text-[var(--app-text)] mt-1">{formatRupiah(metrics.belum)}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">dari total transaksi</div>
          </div>

          {/* Card 4 */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-rose-600/10 p-2 rounded-lg text-rose-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 font-semibold px-2 py-0.5 rounded-full">
                +1.37%
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Selisih</div>
            <div className="text-lg font-bold text-[var(--app-text)] mt-1">{formatRupiah(metrics.selisih)}</div>
            <div className="text-[10px] text-rose-400 mt-0.5">Memerlukan penyesuaian manual</div>
          </div>

          {/* Card 5 */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-purple-600/10 p-2 rounded-lg text-purple-500">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Dalam Proses</div>
            <div className="text-lg font-bold text-[var(--app-text)] mt-1">{metrics.inProgress}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">transaksi sedang dicocokkan</div>
          </div>

          {/* Card 6 */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-cyan-600/10 p-2 rounded-lg text-cyan-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                Sangat Baik
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Tingkat Kecocokan</div>
            <div className="text-lg font-bold text-[var(--app-text)] mt-1">{metrics.rate}%</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">Akurasi data kecocokan</div>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center gap-1 border-b border-[var(--app-border)] mb-6 overflow-x-auto scrollbar-thin scrollbar-track-transparent">
          {['Ringkasan', 'Rekonsiliasi Transaksi', 'Mutasi Bank', 'Aturan Rekonsiliasi', 'Log Aktivitas', 'Laporan Rekonsiliasi'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-4 py-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400 bg-[var(--app-card-subtle)]/10'
                  : 'border-transparent text-[var(--app-muted)] hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* MAIN LAYOUT SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* LEFT 3 COLS FOR MAIN CONTENT */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* CHARTS CONTAINER ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Trend Chart (3/5 width) */}
              <div className="lg:col-span-3 bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Tren Rekonsiliasi</h2>
                  <select 
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[10px] px-2 py-1 rounded text-[var(--app-muted)] font-medium"
                  >
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis 
                        yAxisId="left"
                        stroke="#64748b" 
                        fontSize={9} 
                        tickLine={false} 
                        tickFormatter={(v) => `${v > 0 ? v + 'M' : '0'}`} 
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="#64748b" 
                        fontSize={9} 
                        tickLine={false} 
                        tickFormatter={(v) => `${v}%`} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8 }} 
                        labelStyle={{ color: '#fff', fontSize: 10 }}
                        itemStyle={{ fontSize: 10 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 9, paddingTop: 10 }} />
                      <Bar yAxisId="left" name="Jumlah Transaksi" dataKey="Volume" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" name="Cocok" dataKey="Cocok" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" name="Belum Cocok" dataKey="Belum" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" name="Persentase Cocok" type="monotone" dataKey="Rate" stroke="#A855F7" strokeWidth={2} dot={{ r: 2 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Composition Donut Chart (2/5 width) */}
              <div className="lg:col-span-2 bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 shadow-sm flex flex-col">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Distribusi Status</h2>
                
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_RECON[index % COLORS_RECON.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <div className="text-[10px] text-[var(--app-muted)] font-medium leading-none">Total Transaksi</div>
                      <div className="text-[11px] font-bold text-white mt-1 leading-none">Rp 3.24B</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {pieData.map((item, idx) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS_RECON[idx % COLORS_RECON.length] }} />
                          <span className="text-[var(--app-muted)]">{item.name}</span>
                        </div>
                        <div className="text-right flex flex-col">
                          <span className="text-[var(--app-text)] font-semibold">{formatRupiah(item.value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rekonsiliasi Per Sumber Progress bars */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Rekonsiliasi per Sumber (Top 5)</h2>
              <div className="space-y-4">
                {sourcesData.map((item) => {
                  const percentVal = (item.value / item.total) * 100;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-[var(--app-muted)]">
                          {formatRupiah(item.value)} / {formatRupiah(item.total)}{' '}
                          <span className="text-blue-400 font-bold">({item.percent})</span>
                        </span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all" 
                          style={{ width: `${percentVal}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 shadow-sm">
              <div className="flex flex-col gap-4 mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Daftar Rekonsiliasi Transaksi</h2>
                
                {/* Advanced Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
                  
                  {/* Search Input */}
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--app-muted)]" />
                    <input 
                      type="text"
                      placeholder="Cari invoice, referensi, atau jumlah..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 pl-9 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Sumber Filter */}
                  <div>
                    <select
                      value={selectedSumber}
                      onChange={(e) => { setSelectedSumber(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option>Semua Sumber</option>
                      <option>Bank BCA</option>
                      <option>Bank Mandiri</option>
                      <option>OVO</option>
                      <option>DANA</option>
                      <option>GoPay</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option>Semua Status</option>
                      <option>Cocok</option>
                      <option>Tidak Cocok</option>
                      <option>Belum Cocok</option>
                      <option>Dalam Proses</option>
                    </select>
                  </div>

                  {/* Metode Filter */}
                  <div>
                    <select
                      value={selectedMetode}
                      onChange={(e) => { setSelectedMetode(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option>Semua Metode</option>
                      <option>Transfer Bank</option>
                      <option>E-Wallet</option>
                    </select>
                  </div>

                  {/* Reset Button */}
                  <div className="flex gap-2">
                    <button 
                      onClick={resetFilters}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg w-full transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] text-[var(--app-muted)] font-semibold uppercase tracking-wider">
                      <th className="py-3 px-3 w-10 text-center">NO</th>
                      <th className="py-3 px-3">TANGGAL</th>
                      <th className="py-3 px-3">REFERENSI</th>
                      <th className="py-3 px-3">SUMBER</th>
                      <th className="py-3 px-3">DESKRIPSI</th>
                      <th className="py-3 px-3">METODE</th>
                      <th className="py-3 px-3 text-right">DEBIT (MUTASI)</th>
                      <th className="py-3 px-3 text-right">KREDIT (SISTEM)</th>
                      <th className="py-3 px-3 text-right">SELISIH</th>
                      <th className="py-3 px-3 text-center">STATUS</th>
                      <th className="py-3 px-3">DICOCOKKAN DENGAN</th>
                      <th className="py-3 px-3 text-center w-20">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((item, idx) => {
                        const calculatedNo = (currentPage - 1) * rowsPerPage + idx + 1;
                        return (
                          <tr key={item.id} className="border-b border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] transition-colors">
                            <td className="py-3.5 px-3 text-center text-[var(--app-muted)]">{calculatedNo}</td>
                            <td className="py-3.5 px-3 text-[var(--app-muted)] whitespace-nowrap">{item.tanggal}</td>
                            <td className="py-3.5 px-3 font-semibold text-white">{item.referensi}</td>
                            <td className="py-3.5 px-3 text-slate-300">{item.sumber}</td>
                            <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">{item.deskripsi}</td>
                            <td className="py-3.5 px-3 text-[var(--app-muted)]">{item.metode}</td>
                            <td className="py-3.5 px-3 text-right font-bold text-[var(--app-text)]">{formatRupiah(item.debit)}</td>
                            <td className="py-3.5 px-3 text-right font-medium text-slate-300">
                              {item.kredit > 0 ? formatRupiah(item.kredit) : 'Rp 0'}
                            </td>
                            <td className={`py-3.5 px-3 text-right font-bold ${item.selisih > 0 ? 'text-rose-400' : 'text-[var(--app-muted)]'}`}>
                              {formatRupiah(item.selisih)}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'Cocok' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : item.status === 'Tidak Cocok'
                                  ? 'bg-rose-500/10 text-rose-400'
                                  : item.status === 'Dalam Proses'
                                  ? 'bg-purple-500/10 text-purple-400'
                                  : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-[var(--app-muted)]">{item.dicocokkanDengan}</td>
                            <td className="py-3.5 px-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button 
                                  onClick={() => { setSelectedItemDetails(item); setShowDetailModal(true); }}
                                  className="p-1 text-[var(--app-muted)] hover:text-white transition-colors cursor-pointer"
                                  title="Detail"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1 text-[var(--app-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12} className="py-8 text-center text-[var(--app-muted)]">
                          Tidak ada data transaksi rekonsiliasi yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Controller */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-[var(--app-muted)] text-xs">
                <div>
                  Menampilkan <span className="font-semibold text-[var(--app-text)]">{Math.min(filteredTransactions.length, (currentPage - 1) * rowsPerPage + 1)}</span> sampai{' '}
                  <span className="font-semibold text-[var(--app-text)]">{Math.min(filteredTransactions.length, currentPage * rowsPerPage)}</span> dari{' '}
                  <span className="font-semibold text-[var(--app-text)]">{filteredTransactions.length}</span> data
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>Baris per halaman:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded px-1.5 py-0.5 text-white"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-[var(--app-muted)] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-6.5 h-6.5 rounded-md text-xs font-semibold ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-800 text-[var(--app-muted)] hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-[var(--app-muted)] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT 1 COL FOR SIDEBAR */}
          <div className="space-y-6">
            
            {/* Period Summary Table */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Ringkasan Periode</h2>
              <div className="space-y-3.5 text-xs">
                {[
                  { name: 'Total Transaksi', value: metrics.total, bold: true },
                  { name: 'Sudah Cocok', value: metrics.cocok, success: true },
                  { name: 'Belum Cocok', value: metrics.belum, warning: true },
                  { name: 'Selisih', value: metrics.selisih, danger: true },
                  { name: 'Dalam Proses', value: 0 },
                  { name: 'Tingkat Kecocokan', value: `${metrics.rate}%`, rate: true }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-[var(--app-border)] pb-2 last:border-0 last:pb-0">
                    <span className="text-[var(--app-muted)]">{item.name}</span>
                    <span className={`font-bold ${
                      item.success
                        ? 'text-emerald-400'
                        : item.warning
                        ? 'text-amber-400'
                        : item.danger
                        ? 'text-rose-400'
                        : item.rate
                        ? 'text-cyan-400'
                        : 'text-[var(--app-text)]'
                    }`}>
                      {typeof item.value === 'number' ? formatRupiah(item.value) : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sumber Data List */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Sumber Data</h2>
              <div className="space-y-3 text-xs">
                {sourcesData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-[var(--app-border)] pb-2.5 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="text-[var(--app-text)] font-bold">{formatRupiah(item.total)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-3 text-xs font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-blue-400">Rp 4.025.800.000</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Aksi Cepat</h2>
              <div className="space-y-2.5">
                <button 
                  onClick={triggerAutoMatch}
                  disabled={isProcessingAutoMatch}
                  className="w-full flex items-center justify-between p-3 bg-[var(--app-bg)]/85 hover:bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-left gap-1.5 transition-colors cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] text-slate-200 font-semibold">Proses Pencocokan Otomatis</span>
                  </div>
                  {isProcessingAutoMatch && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--app-muted)]" />}
                </button>

                <button 
                  onClick={() => setShowAddModal(true)}
                  className="w-full flex items-center justify-between p-3 bg-[var(--app-bg)]/85 hover:bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-left gap-1.5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] text-slate-200 font-semibold">Cocokkan Manual</span>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setNewStatus('Tidak Cocok');
                    setShowAddModal(true);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-[var(--app-bg)]/85 hover:bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-left gap-1.5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] text-slate-200 font-semibold">Buat Penyesuaian</span>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setSelectedStatus('Tidak Cocok');
                    setCurrentPage(1);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-[var(--app-bg)]/85 hover:bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-left gap-1.5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] text-slate-200 font-semibold">Lihat Selisih</span>
                  </div>
                </button>

                <button 
                  onClick={handleExportCSV}
                  className="w-full flex items-center justify-between p-3 bg-[var(--app-bg)]/85 hover:bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-left gap-1.5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[var(--app-muted)]" />
                    <span className="text-[10px] text-slate-200 font-semibold">Unduh Hasil Rekonsiliasi</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* CREATE NEW RECONCILIATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--app-surface)] border border-[var(--app-border)] w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--app-border)]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Rekonsiliasi / Penyesuaian Transaksi</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[var(--app-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateReconciliation} className="p-5 space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">No. Referensi / Transaksi</label>
                  <input 
                    type="text" 
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    placeholder="Contoh: BCA-010726-0005"
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Sumber Transaksi</label>
                  <select 
                    value={newSumber}
                    onChange={(e) => setNewSumber(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  >
                    <option>Bank BCA</option>
                    <option>Bank Mandiri</option>
                    <option>OVO</option>
                    <option>DANA</option>
                    <option>GoPay</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[var(--app-muted)] font-semibold">Deskripsi Transaksi</label>
                <input 
                  type="text" 
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  placeholder="Contoh: Pembayaran Invoice INV/2026/07/001254 - Andi"
                  className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Metode Pembayaran</label>
                  <select 
                    value={newMetode}
                    onChange={(e) => setNewMetode(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  >
                    <option>Transfer Bank</option>
                    <option>E-Wallet</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Status Awal</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  >
                    <option value="Cocok">Cocok</option>
                    <option value="Tidak Cocok">Tidak Cocok</option>
                    <option value="Belum Cocok">Belum Cocok</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Nilai Debit (Mutasi Bank - Rp)</label>
                  <input 
                    type="number" 
                    value={newDebit}
                    onChange={(e) => setNewDebit(e.target.value)}
                    placeholder="Contoh: 500000"
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Nilai Kredit (Catatan Sistem - Rp)</label>
                  <input 
                    type="number" 
                    value={newKredit}
                    onChange={(e) => setNewKredit(e.target.value)}
                    placeholder="Contoh: 500000"
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-[var(--app-text)] font-semibold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {showDetailModal && selectedItemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--app-surface)] border border-[var(--app-border)] w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--app-border)]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detail Pencocokan Rekonsiliasi</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-[var(--app-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-y-3.5 border-b border-[var(--app-border)] pb-4">
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Referensi</div>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedItemDetails.referensi}</div>
                </div>
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Tanggal</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{selectedItemDetails.tanggal}</div>
                </div>
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Sumber</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{selectedItemDetails.sumber}</div>
                </div>
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Metode</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{selectedItemDetails.metode}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Deskripsi</div>
                <div className="text-xs font-semibold text-slate-200 leading-relaxed mt-0.5">{selectedItemDetails.deskripsi}</div>
              </div>

              <div className="space-y-3.5 border-t border-[var(--app-border)] pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Nilai Mutasi Bank (Debit):</span>
                  <span className="font-semibold text-[var(--app-text)]">{formatRupiah(selectedItemDetails.debit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Nilai Catatan Internal (Kredit):</span>
                  <span className="font-semibold text-[var(--app-text)]">{formatRupiah(selectedItemDetails.kredit)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[var(--app-border)] pt-3">
                  <span className="text-[var(--app-muted)] font-semibold">Selisih Pajak/Biaya:</span>
                  <span className={`font-bold ${selectedItemDetails.selisih > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {formatRupiah(selectedItemDetails.selisih)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Dicocokkan Dengan:</span>
                  <span className="font-semibold text-cyan-400">{selectedItemDetails.dicocokkanDengan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Status Rekonsiliasi:</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    selectedItemDetails.status === 'Cocok' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : selectedItemDetails.status === 'Tidak Cocok'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {selectedItemDetails.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-[var(--app-border)]">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
