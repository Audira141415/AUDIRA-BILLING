import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
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
  Settings,
  Bell,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Layers,
  ArrowRightLeft,
  FileSpreadsheet,
  Activity,
  Calculator,
  PieChart as ChartPieIcon,
  CheckSquare,
  PlusSquare,
  MinusSquare,
  Trash2,
  Edit,
  Share2,
  FileText,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Scale,
  Percent,
  X
} from 'lucide-react';
import { Pagination } from '@/components/Pagination';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_METODE = ['#1D4ED8', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
const COLORS_TIPE = ['#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function TransaksiDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Semua Transaksi');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter States
  const [filterPeriod, setFilterPeriod] = useState('25/06/2026 - 22/10/2026');
  const [filterType, setFilterType] = useState('Semua Tipe');
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');
  const [filterAccount, setFilterAccount] = useState('Semua Akun');
  const [filterMethod, setFilterMethod] = useState('Semua Metode');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [newType, setNewType] = useState('Pemasukan');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Pendapatan');
  const [newAccount, setNewAccount] = useState('Kas & Bank');
  const [newMethod, setNewMethod] = useState('Transfer Bank');
  const [newAmount, setNewAmount] = useState('');
  const [newStatusState, setNewStatusState] = useState('Selesai');

  // Primary Transactions List (matching screenshot rows)
  const [transactions, setTransactions] = useState([
    { id: 1, tanggal: '22/10/2026 09:21', trxNo: 'TRX/2026/07/001245', tipe: 'Pemasukan', deskripsi: 'Pembayaran Invoice INV/2026/07/001245 - Budi Santoso', akun: 'Kas & Bank', kategori: 'Pendapatan', debit: 0, kredit: 550000, saldo: 37410500, metode: 'Transfer Bank', status: 'Selesai' },
    { id: 2, tanggal: '22/10/2026 08:45', trxNo: 'TRX/2026/07/001244', tipe: 'Pengeluaran', deskripsi: 'Pembayaran Gaji Karyawan Juni 2026', akun: 'Beban Gaji', kategori: 'Beban Operasional', debit: 8500000, kredit: 0, saldo: 36860500, metode: 'Transfer Bank', status: 'Selesai' },
    { id: 3, tanggal: '22/10/2026 08:10', trxNo: 'TRX/2026/07/001243', tipe: 'Pemasukan', deskripsi: 'Pembayaran Invoice INV/2026/07/001243 - Andi Pratama', akun: 'Kas & Bank', kategori: 'Pendapatan', debit: 0, kredit: 150000, saldo: 45360500, metode: 'E-Wallet', status: 'Selesai' },
    { id: 4, tanggal: '30/06/2026 22:15', trxNo: 'TRX/2026/06/002542', tipe: 'Pengeluaran', deskripsi: 'Pembayaran Tagihan Listrik & Utilitas', akun: 'Beban Utilitas', kategori: 'Beban Operasional', debit: 950000, kredit: 0, saldo: 45210500, metode: 'Transfer Bank', status: 'Selesai' },
    { id: 5, tanggal: '30/06/2026 19:30', trxNo: 'TRX/2026/06/002541', tipe: 'Transfer', deskripsi: 'Transfer Dana Operasional ke Kas Kecil', akun: 'Kas Kecil', kategori: 'Transfer', debit: 2000000, kredit: 0, saldo: 46160500, metode: 'Transfer Internal', status: 'Selesai' },
    { id: 6, tanggal: '30/06/2026 18:05', trxNo: 'TRX/2026/06/002540', tipe: 'Pengeluaran', deskripsi: 'Pembelian Perangkat Jaringan', akun: 'Beban Peralatan', kategori: 'Beban Non Operasional', debit: 7250000, kredit: 0, saldo: 48160500, metode: 'Transfer Bank', status: 'Selesai' },
    { id: 7, tanggal: '30/06/2026 17:22', trxNo: 'TRX/2026/06/002539', tipe: 'Pemasukan', deskripsi: 'Pembayaran Invoice INV/2026/06/002539 - Fajar Nugroho', akun: 'Kas & Bank', kategori: 'Pendapatan', debit: 0, kredit: 250000, saldo: 55410500, metode: 'QRIS', status: 'Selesai' },
    { id: 8, tanggal: '30/06/2026 15:10', trxNo: 'TRX/2026/06/002538', tipe: 'Transfer', deskripsi: 'Transfer Dana dari Bank BCA ke Mandiri', akun: 'Kas & Bank', kategori: 'Transfer', debit: 10000000, kredit: 0, saldo: 55160500, metode: 'Transfer Bank', status: 'Selesai' },
    { id: 9, tanggal: '30/06/2026 11:33', trxNo: 'TRX/2026/06/002537', tipe: 'Pemasukan', deskripsi: 'Pembayaran Invoice INV/2026/06/002537 - Dewi Lestari', akun: 'Kas & Bank', kategori: 'Pendapatan', debit: 0, kredit: 100000, saldo: 45160500, metode: 'E-Wallet', status: 'Selesai' },
    { id: 10, tanggal: '30/06/2026 09:21', trxNo: 'TRX/2026/06/002536', tipe: 'Pengeluaran', deskripsi: 'Pembayaran Sewa Server Bulan Juli 2026', akun: 'Beban Sewa', kategori: 'Beban Operasional', debit: 1750000, kredit: 0, saldo: 45060500, metode: 'Transfer Bank', status: 'Selesai' }
  ]);

  // Real dynamic statistics calculations from active transactions
  const totalTrxCount = transactions.length;
  const debitTotal = transactions.reduce((acc, t) => acc + (t.debit || 0), 0);
  const kreditTotal = transactions.reduce((acc, t) => acc + (t.kredit || 0), 0);
  const saldoAkhir = kreditTotal - debitTotal;
  const averagePerDay = Math.max(1, Math.round(transactions.length / 30));
  const pendingTrx = transactions.filter(t => t.status !== 'Selesai').length;

  // Edit and Delete Modals State
  const [showEditModal, setShowEditModal] = useState(false);
  const [trxToEdit, setTrxToEdit] = useState<any | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editTipe, setEditTipe] = useState('Pemasukan');
  const [editKategori, setEditKategori] = useState('Pendapatan');
  const [editAkun, setEditAkun] = useState('Kas & Bank');
  const [editMetode, setEditMetode] = useState('Transfer Bank');
  const [editNominal, setEditNominal] = useState('');
  const [editStatus, setEditStatus] = useState('Selesai');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trxToDelete, setTrxToDelete] = useState<any | null>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [trxDetail, setTrxDetail] = useState<any | null>(null);

  const handleOpenEdit = (t: any) => {
    setTrxToEdit(t);
    setEditDesc(t.deskripsi);
    setEditTipe(t.tipe);
    setEditKategori(t.kategori);
    setEditAkun(t.akun);
    setEditMetode(t.metode);
    setEditNominal(String(t.tipe === 'Pengeluaran' ? t.debit : t.kredit));
    setEditStatus(t.status);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxToEdit) return;
    const num = parseFloat(editNominal) || 0;
    setTransactions(transactions.map(t => {
      if (t.id === trxToEdit.id) {
        return {
          ...t,
          deskripsi: editDesc,
          tipe: editTipe,
          kategori: editKategori,
          akun: editAkun,
          metode: editMetode,
          debit: editTipe === 'Pengeluaran' ? num : 0,
          kredit: editTipe === 'Pemasukan' ? num : 0,
          status: editStatus
        };
      }
      return t;
    }));
    setShowEditModal(false);
    setTrxToEdit(null);
  };

  const handleOpenDelete = (t: any) => {
    setTrxToDelete(t);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!trxToDelete) return;
    setTransactions(transactions.filter(t => t.id !== trxToDelete.id));
    setShowDeleteModal(false);
    setTrxToDelete(null);
  };

  // Chart data
  const weeklyTrendData = [
    { name: '25 Jun', 'Pemasukan': 15000000, 'Pengeluaran': 10000000, 'Transfer': 2000000 },
    { name: '26 Jun', 'Pemasukan': 22000000, 'Pengeluaran': 14000000, 'Transfer': 3000000 },
    { name: '27 Jun', 'Pemasukan': 25000000, 'Pengeluaran': 18000000, 'Transfer': 1000000 },
    { name: '28 Jun', 'Pemasukan': 12000000, 'Pengeluaran': 11000000, 'Transfer': 4000000 },
    { name: '29 Jun', 'Pemasukan': 19000000, 'Pengeluaran': 13000000, 'Transfer': 2000000 },
    { name: '30 Jun', 'Pemasukan': 26000000, 'Pengeluaran': 22000000, 'Transfer': 12000000 },
    { name: '01 Jul', 'Pemasukan': kreditTotal / 10, 'Pengeluaran': debitTotal / 10, 'Transfer': 2000000 }
  ];

  const typeComposition = [
    { name: 'Pemasukan', value: kreditTotal },
    { name: 'Pengeluaran', value: debitTotal },
    { name: 'Transfer', value: 12350000 },
    { name: 'Penyesuaian', value: 2150000 }
  ];

  const categoryBarData = [
    { name: 'Pendapatan', value: 125860500 },
    { name: 'Beban Operasional', value: 63150000 },
    { name: 'Transfer', value: 12350000 },
    { name: 'Beban Non Operasional', value: 7250000 },
    { name: 'Beban Gaji', value: 8500000 }
  ];

  const methodComposition = [
    { name: 'Transfer Bank', value: 133350000 },
    { name: 'E-Wallet', value: 39950000 },
    { name: 'QRIS', value: 19900000 },
    { name: 'Tunai', value: 13480000 },
    { name: 'Lainnya', value: 7150000 }
  ];

  // Add new transaction handler
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const amountNum = parseFloat(newAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
    const nextId = transactions.length + 1;
    const trxNumber = `TRX/2026/07/${nextId.toString().padStart(6, '0')}`;

    const newTx = {
      id: nextId,
      tanggal: formattedDate,
      trxNo: trxNumber,
      tipe: newType,
      deskripsi: newDesc,
      akun: newAccount,
      kategori: newCategory,
      debit: newType === 'Pengeluaran' || newType === 'Transfer' ? amountNum : 0,
      kredit: newType === 'Pemasukan' ? amountNum : 0,
      saldo: newType === 'Pemasukan' ? saldoAkhir + amountNum : saldoAkhir - amountNum,
      metode: newMethod,
      status: newStatusState
    };

    setTransactions([newTx, ...transactions]);

    setNewDesc('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const handleResetFilter = () => {
    setFilterType('Semua Tipe');
    setFilterCategory('Semua Kategori');
    setFilterAccount('Semua Akun');
    setFilterMethod('Semua Metode');
    setFilterStatus('Semua Status');
    setFilterMinAmount('');
    setFilterMaxAmount('');
    setSearchTerm('');
  };

  // Filtering Logic
  const filteredList = transactions.filter(t => {
    // Search Term
    const matchesSearch = t.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.trxNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filtration
    let matchesTab = true;
    if (activeTab === 'Pemasukan') matchesTab = t.tipe === 'Pemasukan';
    else if (activeTab === 'Pengeluaran') matchesTab = t.tipe === 'Pengeluaran';
    else if (activeTab === 'Transfer') matchesTab = t.tipe === 'Transfer';

    // Sidebar Filters
    const matchesType = filterType === 'Semua Tipe' || t.tipe === filterType;
    const matchesCategory = filterCategory === 'Semua Kategori' || t.kategori === filterCategory;
    const matchesAccount = filterAccount === 'Semua Akun' || t.akun === filterAccount;
    const matchesMethod = filterMethod === 'Semua Metode' || t.metode === filterMethod;
    const matchesStatus = filterStatus === 'Semua Status' || t.status === filterStatus;
    
    const amountVal = t.debit || t.kredit;
    const matchesMinAmount = !filterMinAmount || amountVal >= parseFloat(filterMinAmount);
    const matchesMaxAmount = !filterMaxAmount || amountVal <= parseFloat(filterMaxAmount);

    return matchesSearch && matchesTab && matchesType && matchesCategory && matchesAccount && matchesMethod && matchesStatus && matchesMinAmount && matchesMaxAmount;
  });

  const paginatedList = filteredList.slice((page - 1) * limit, page * limit);

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
              <span className="text-emerald-500 font-semibold">Jurnal Umum Transaksi</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)]">Transaksi</h1>
            <p className="text-xs text-[var(--app-muted)] mt-1">Kelola semua transaksi keuangan perusahaan secara realtime.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] text-xs">
              <span className="text-[var(--app-muted)] font-medium">25 Juni 2026 - 22 Oktober 2026</span>
            </div>
            <button onClick={() => toast.info("Penyaringan data transaksi keuangan diterapkan.")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => toast.success('Mengekspor daftar transaksi...')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-xs font-semibold text-[var(--app-text)] border border-[var(--app-border)] shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--app-muted)]" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Transaksi */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Transaksi</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{totalTrxCount}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              ▲ 12.5% dari periode lalu
            </span>
          </div>

          {/* Debit */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Debit</p>
              <div className="p-1.5 rounded-lg bg-rose-600/10 border border-rose-600/20 text-rose-400">
                <Scale className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{formatRupiah(debitTotal)}</h3>
            <span className="text-[9px] text-rose-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              ▲ 8.6% dari periode lalu
            </span>
          </div>

          {/* Kredit */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Kredit</p>
              <div className="p-1.5 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{formatRupiah(kreditTotal)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              ▲ 15.3% dari periode lalu
            </span>
          </div>

          {/* Saldo Akhir */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Saldo Akhir</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{formatRupiah(saldoAkhir)}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">▲ 21.8% dari periode lalu</span>
          </div>

          {/* Rata-rata per Hari */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Rata-rata per Hari</p>
              <div className="p-1.5 rounded-lg bg-purple-600/10 border border-purple-600/20 text-purple-400">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{averagePerDay}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">▲ 9.7% dari periode lalu</span>
          </div>

          {/* Transaksi Tertunda */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Transaksi Tertunda</p>
              <div className="p-1.5 rounded-lg bg-orange-600/10 border border-orange-600/20 text-orange-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{pendingTrx}</h3>
            <span className="text-[9px] text-rose-400 font-semibold mt-1">▲ 5.2% dari periode lalu</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--app-border)]/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Semua Transaksi', 'Pemasukan', 'Pengeluaran', 'Transfer', 'Jurnal Umum', 'Penyesuaian', 'Rekonsiliasi'].map((tab) => (
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

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Filter Sidebar (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--app-border)]/60">Filter Transaksi</h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Periode</label>
                  <input
                    type="text"
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2.5 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Tipe Transaksi</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2.5 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                  >
                    <option>Semua Tipe</option>
                    <option>Pemasukan</option>
                    <option>Pengeluaran</option>
                    <option>Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2.5 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                  >
                    <option>Semua Kategori</option>
                    <option>Pendapatan</option>
                    <option>Beban Operasional</option>
                    <option>Beban Non Operasional</option>
                    <option>Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Akun</label>
                  <select
                    value={filterAccount}
                    onChange={(e) => setFilterAccount(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2.5 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                  >
                    <option>Semua Akun</option>
                    <option>Kas & Bank</option>
                    <option>Beban Gaji</option>
                    <option>Beban Utilitas</option>
                    <option>Kas Kecil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Metode Pembayaran</label>
                  <select
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2.5 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                  >
                    <option>Semua Metode</option>
                    <option>Transfer Bank</option>
                    <option>E-Wallet</option>
                    <option>QRIS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2.5 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                  >
                    <option>Semua Status</option>
                    <option>Selesai</option>
                    <option>Tertunda</option>
                    <option>Gagal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Jumlah (Rp)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filterMinAmount}
                      onChange={(e) => setFilterMinAmount(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filterMaxAmount}
                      onChange={(e) => setFilterMaxAmount(e.target.value)}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-2 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => toast.info("Penyaringan transaksi diterapkan.")} className="bg-blue-600 hover:bg-blue-500 py-2 rounded text-[var(--app-text)] font-semibold">Terapkan Filter</button>
                  <button onClick={handleResetFilter} className="bg-slate-800 hover:bg-slate-700 py-2 rounded text-white">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Ringkasan Transaksi Persentase Card */}
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4 border-b border-[var(--app-border)] pb-2">Ringkasan Transaksi</h3>
              <div className="space-y-3.5 text-xs text-[var(--app-text)]/90">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Pemasukan</span>
                  </div>
                  <span>{formatRupiah(kreditTotal)} (59.0%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>Pengeluaran</span>
                  </div>
                  <span>{formatRupiah(debitTotal)} (41.0%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Transfer</span>
                  </div>
                  <span>{formatRupiah(12350000)} (5.8%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>Penyesuaian</span>
                  </div>
                  <span>{formatRupiah(2150000)} (1.0%)</span>
                </div>
                <div className="flex justify-between items-center font-bold text-white pt-2.5 border-t border-[var(--app-border)]">
                  <span>Total</span>
                  <span>{formatRupiah(kreditTotal + debitTotal + 12350000 + 2150000)} (100%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Main List Table (9 Columns) */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--app-border)]/60">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Daftar Transaksi</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Transaksi Baru</span>
                  </button>
                  <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-[var(--app-border)] rounded text-xs text-white cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5 text-[var(--app-muted)]" />
                    <span>Import Transaksi</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)]/80 text-[var(--app-muted)] font-semibold">
                      <th className="py-2.5">NO</th>
                      <th className="py-2.5">TANGGAL</th>
                      <th className="py-2.5">NO. TRANSAKSI</th>
                      <th className="py-2.5">TIPE</th>
                      <th className="py-2.5">DESKRIPSI</th>
                      <th className="py-2.5">AKUN</th>
                      <th className="py-2.5">KATEGORI</th>
                      <th className="py-2.5 text-right">DEBIT</th>
                      <th className="py-2.5 text-right">KREDIT</th>
                      <th className="py-2.5 text-right">SALDO</th>
                      <th className="py-2.5">METODE</th>
                      <th className="py-2.5">STATUS</th>
                      <th className="py-2.5 text-right pr-2">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]/90">
                    {paginatedList.map((t, idx) => (
                      <tr key={t.id} className="hover:bg-[var(--app-card-subtle)]/20 transition-colors">
                        <td className="py-3 text-[var(--app-muted)]">{idx + 1}</td>
                        <td className="py-3 text-[11px] text-[var(--app-muted)]">{t.tanggal}</td>
                        <td className="py-3 font-semibold text-cyan-400">{t.trxNo}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            t.tipe === 'Pemasukan' ? 'bg-emerald-500/10 text-emerald-400' :
                            t.tipe === 'Pengeluaran' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {t.tipe}
                          </span>
                        </td>
                        <td className="py-3 max-w-[200px] truncate" title={t.deskripsi}>{t.deskripsi}</td>
                        <td className="py-3 text-[var(--app-muted)]">{t.akun}</td>
                        <td className="py-3 text-[var(--app-muted)]">{t.kategori}</td>
                        <td className="py-3 text-right font-medium text-rose-400">
                          {t.debit > 0 ? formatRupiah(t.debit) : '-'}
                        </td>
                        <td className="py-3 text-right font-medium text-emerald-400">
                          {t.kredit > 0 ? formatRupiah(t.kredit) : '-'}
                        </td>
                        <td className="py-3 text-right font-semibold">{formatRupiah(saldoAkhir)}</td>
                        <td className="py-3 text-[var(--app-muted)]">{t.metode}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${t.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setTrxDetail(t);
                                setShowDetailModal(true);
                              }}
                              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition"
                              title="Lihat Detail Transaksi"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition"
                              title="Edit Transaksi"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(t)}
                              className="p-1 hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-400 transition"
                              title="Hapus Transaksi"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 pt-4 border-t border-[var(--app-border)]/60">
                <Pagination
                  currentPage={page}
                  totalItems={filteredList.length}
                  pageSize={limit}
                  onPageChange={setPage}
                  onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                  pageSizeOptions={[5, 10, 25]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: 4 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Chart 1: Tren Transaksi */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
            <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Tren Transaksi</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} tickFormatter={(v) => `${v / 1000000}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8 }}
                    formatter={(value: any) => formatRupiah(value)}
                  />
                  <Line type="monotone" dataKey="Pemasukan" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Pengeluaran" stroke="#EF4444" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Transfer" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Transaksi per Tipe */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
            <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Transaksi per Tipe</h3>
            <div className="flex flex-col items-center justify-center relative mb-4">
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeComposition}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {typeComposition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_TIPE[index % COLORS_TIPE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatRupiah(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute text-center mt-1">
                <p className="text-[12px] font-bold text-[var(--app-text)]">{totalTrxCount}</p>
                <p className="text-[8px] text-[var(--app-muted)]">Total</p>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-1 text-[9px] text-[var(--app-muted)] border-t border-[var(--app-border)] pt-2">
              {typeComposition.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_TIPE[index % COLORS_TIPE.length] }}></span>
                  <span>{item.name}: {((item.value / (kreditTotal + debitTotal + 14500000)) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Transaksi per Kategori */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
            <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Transaksi per Kategori (Top 5)</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBarData} layout="vertical">
                  <XAxis type="number" stroke="#64748b" fontSize={8} tickFormatter={(v) => `${v / 1000000}M`} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={7} width={64} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8 }}
                    formatter={(value: any) => formatRupiah(value)}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 2, 2, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Metode Pembayaran */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
            <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Metode Pembayaran</h3>
            <div className="flex flex-col items-center justify-center relative mb-4">
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={methodComposition}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {methodComposition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_METODE[index % COLORS_METODE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatRupiah(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute text-center mt-1">
                <p className="text-[12px] font-bold text-[var(--app-text)]">{formatRupiah(kreditTotal + debitTotal)}</p>
                <p className="text-[8px] text-[var(--app-muted)]">Total</p>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-1 text-[9px] text-[var(--app-muted)] border-t border-[var(--app-border)] pt-2">
              {methodComposition.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_METODE[index % COLORS_METODE.length] }}></span>
                  <span>{item.name}: {((item.value / (kreditTotal + debitTotal)) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: Tambah Transaksi Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--app-border)]">
                <h3 className="text-sm font-bold text-white">Catat Transaksi Baru</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-[var(--app-muted)] hover:text-white text-xs"
                >
                  Batal
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Tipe Transaksi</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option>Pemasukan</option>
                    <option>Pengeluaran</option>
                    <option>Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Deskripsi Transaksi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembayaran internet, Pembelian kabel..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pendapatan, Operasional"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Metode Pembayaran</label>
                    <select
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Transfer Bank</option>
                      <option>E-Wallet</option>
                      <option>QRIS</option>
                      <option>Tunai</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Akun</label>
                    <input
                      type="text"
                      placeholder="Kas & Bank, Kas Kecil..."
                      value={newAccount}
                      onChange={(e) => setNewAccount(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Nominal (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 500000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-[var(--app-text)] font-semibold bg-blue-600 hover:bg-blue-500 transition-colors mt-2"
                >
                  Simpan Transaksi
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Modal: Detail Transaksi */}
      {showDetailModal && trxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-blue-500/15 text-blue-400">
                  <Eye size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Detail Transaksi Kas</h3>
                  <p className="text-[10px] text-[var(--app-muted)] font-mono">{trxDetail.trxNo}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-[var(--app-muted)] hover:text-white text-xs">
                Tutup
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Tanggal</span>
                <span className="font-semibold text-white">{trxDetail.tanggal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Tipe Transaksi</span>
                <span className="font-bold text-cyan-400">{trxDetail.tipe}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Kategori</span>
                <span className="text-white">{trxDetail.kategori}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Akun Kas</span>
                <span className="text-white">{trxDetail.akun}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Metode Pembayaran</span>
                <span className="text-white">{trxDetail.metode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Nominal Debit</span>
                <span className="font-mono text-rose-400 font-bold">{formatRupiah(trxDetail.debit)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Nominal Kredit</span>
                <span className="font-mono text-emerald-400 font-bold">{formatRupiah(trxDetail.kredit)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                <span className="text-[var(--app-muted)]">Status</span>
                <span className="font-bold uppercase text-emerald-400">{trxDetail.status}</span>
              </div>
              <div className="pt-2">
                <span className="text-[var(--app-muted)] block mb-1">Keterangan:</span>
                <p className="p-2.5 rounded bg-[var(--app-card-subtle)] text-white text-[11px] font-mono">{trxDetail.deskripsi}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[var(--app-border)]">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Transaksi */}
      {showEditModal && trxToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--app-border)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-blue-500/15 text-blue-400">
                  <Edit size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Transaksi</h3>
                  <p className="text-[10px] text-[var(--app-muted)] font-mono">{trxToEdit.trxNo}</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-[var(--app-muted)] hover:text-white text-xs">
                Batal
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--app-muted)] mb-1">Deskripsi Transaksi</label>
                <input
                  type="text"
                  required
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Tipe</label>
                  <select
                    value={editTipe}
                    onChange={e => setEditTipe(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Pemasukan">Pemasukan (Kredit)</option>
                    <option value="Pengeluaran">Pengeluaran (Debit)</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={editNominal}
                    onChange={e => setEditNominal(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Akun</label>
                  <select
                    value={editAkun}
                    onChange={e => setEditAkun(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Kas & Bank">Kas & Bank</option>
                    <option value="Kas Kecil">Kas Kecil</option>
                    <option value="Beban Gaji">Beban Gaji</option>
                    <option value="Beban Utilitas">Beban Utilitas</option>
                    <option value="Beban Peralatan">Beban Peralatan</option>
                    <option value="Beban Sewa">Beban Sewa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Metode</label>
                  <select
                    value={editMetode}
                    onChange={e => setEditMetode(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Transfer Internal">Transfer Internal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--app-muted)] mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Selesai">Selesai</option>
                  <option value="Pending">Pending</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Hapus Transaksi */}
      {showDeleteModal && trxToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-500 border-b border-[var(--app-border)] pb-3">
              <Trash2 size={18} />
              <h3 className="text-sm font-bold">Hapus Transaksi</h3>
            </div>
            <p className="text-xs text-[var(--app-text)]">
              Yakin ingin menghapus transaksi <strong className="text-white">{trxToDelete.trxNo}</strong> ({trxToDelete.deskripsi})?
            </p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded border border-[var(--app-border)] text-xs text-[var(--app-muted)] hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-xs text-white font-semibold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import Transaksi Rekening Koran */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <UploadCloud size={16} />
                </div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">Import Transaksi Rekening Koran</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[var(--app-text)]">Akun Bank Tujuan</label>
                <select className="w-full p-2.5 rounded bg-[var(--app-surface-2)] border border-[var(--app-border)] text-[var(--app-text)] focus:outline-none">
                  <option>Bank Mandiri (123-00-9876543-1 a.n AUDIRA)</option>
                  <option>Bank BCA (882-019-2831 a.n AUDIRA)</option>
                  <option>Bank BRI (0012-01-098273-50-1 a.n AUDIRA)</option>
                  <option>Kas Operasional Sentral</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-[var(--app-border)] hover:border-blue-500 rounded-xl p-6 text-center bg-[var(--app-surface-2)]/50 transition-colors cursor-pointer">
                <UploadCloud size={28} className="mx-auto text-blue-500 mb-2" />
                <p className="font-semibold text-[var(--app-text)]">Pilih atau seret berkas CSV/MT940 Mutasi Bank</p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Mendukung ekspor e-Banking BCA, Mandiri MCM, BRI CMS</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={() => toast.success('Mengunduh contoh_format_mutasi.csv...', 'Unduh Contoh')}
                  className="text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Format CSV</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newTx = {
                        id: Date.now(),
                        tanggal: new Date().toLocaleDateString('id-ID') + ' 09:00',
                        trxNo: `TRX/${new Date().getFullYear()}/07/00${transactions.length + 1}`,
                        tipe: 'Pemasukan',
                        deskripsi: 'Setoran Mutasi QRIS Settlement H-1',
                        akun: 'Kas & Bank',
                        kategori: 'Pendapatan',
                        debit: 0,
                        kredit: 12500000,
                        saldo: 49910500,
                        metode: 'Transfer Bank',
                        status: 'Selesai'
                      };
                      setTransactions(prev => [newTx, ...prev]);
                      setShowImportModal(false);
                      toast.success('Mutasi rekening koran berhasil diimpor! Transaksi kas telah diperbarui.', 'Impor Berhasil');
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Proses Impor Transaksi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
