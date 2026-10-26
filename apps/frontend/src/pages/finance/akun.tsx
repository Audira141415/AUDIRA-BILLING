import Link from 'next/link';
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
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  User,
  Activity,
  PlusSquare,
  MinusSquare,
  Lock,
  Unlock,
  CheckSquare,
  Scale,
  Percent,
  Wallet,
  Edit,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
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

const COLORS_STRUKTUR = ['#1D4ED8', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#8B5CF6'];

export default function AkunDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua Akun');
  const [searchTerm, setSearchTerm] = useState('');

  // Sidebar/Header Filters
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');
  const [filterLevel, setFilterLevel] = useState('Semua Level');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  // Selected Account for details panel
  const [selectedAccCode, setSelectedAccCode] = useState('1.1.1.01');

  // Collapse/Expand state for tree nodes
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({
    '1.2': false
  });

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Aset');
  const [newLevel, setNewLevel] = useState(4);
  const [newType, setNewType] = useState('Detail');
  const [newDebit, setNewDebit] = useState('');
  const [newKredit, setNewKredit] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // COA Node Data List
  const [accounts, setAccounts] = useState([
    { code: '1', name: 'Aset', category: 'Aset', level: 1, type: 'Header', status: 'Aktif', debit: 253410000, kredit: 0, desc: 'Kelompok Akun Aset', creator: 'System', dateCreated: '01/01/2026 00:00', changer: 'System', dateChanged: '01/01/2026 00:00', parent: '' },
    { code: '1.1', name: 'Aset Lancar', category: 'Aset', level: 2, type: 'Header', status: 'Aktif', debit: 124850000, kredit: 0, desc: 'Aset Lancar Perusahaan', creator: 'System', dateCreated: '01/01/2026 00:00', changer: 'System', dateChanged: '01/01/2026 00:00', parent: '1' },
    { code: '1.1.1', name: 'Kas & Bank', category: 'Aset', level: 3, type: 'Detail', status: 'Aktif', debit: 68420000, kredit: 0, desc: 'Kas dan Saldo Rekening Bank', creator: 'System', dateCreated: '01/01/2026 00:00', changer: 'System', dateChanged: '01/01/2026 00:00', parent: '1.1' },
    { code: '1.1.1.01', name: 'Kas', category: 'Aset', level: 4, type: 'Detail', status: 'Aktif', debit: 15250000, kredit: 0, desc: 'Kas tunai perusahaan', creator: 'Agus Dwi Rianto', dateCreated: '01/06/2026 09:21', changer: 'Agus Dwi Rianto', dateChanged: '28/06/2026 14:35', parent: '1.1.1' },
    { code: '1.1.1.02', name: 'Bank BCA', category: 'Aset', level: 4, type: 'Detail', status: 'Aktif', debit: 32100000, kredit: 0, desc: 'Rekening Bank BCA Operasional', creator: 'Agus Dwi Rianto', dateCreated: '01/06/2026 09:21', changer: 'Agus Dwi Rianto', dateChanged: '28/06/2026 14:35', parent: '1.1.1' },
    { code: '1.1.1.03', name: 'Bank Mandiri', category: 'Aset', level: 4, type: 'Detail', status: 'Aktif', debit: 21070000, kredit: 0, desc: 'Rekening Bank Mandiri Cadangan', creator: 'Agus Dwi Rianto', dateCreated: '01/06/2026 09:21', changer: 'Agus Dwi Rianto', dateChanged: '28/06/2026 14:35', parent: '1.1.1' },
    { code: '1.1.2', name: 'Piutang Usaha', category: 'Aset', level: 3, type: 'Detail', status: 'Aktif', debit: 32150000, kredit: 0, desc: 'Tagihan Piutang Customer internet', creator: 'System', dateCreated: '01/01/2026 00:00', changer: 'System', dateChanged: '01/01/2026 00:00', parent: '1.1' },
    { code: '1.1.2.01', name: 'Piutang Customer', category: 'Aset', level: 4, type: 'Detail', status: 'Aktif', debit: 28750000, kredit: 0, desc: 'Piutang layanan langganan bulanan', creator: 'Agus Dwi Rianto', dateCreated: '01/06/2026 09:21', changer: 'Agus Dwi Rianto', dateChanged: '28/06/2026 14:35', parent: '1.1.2' },
    { code: '1.1.2.02', name: 'Piutang Lain-lain', category: 'Aset', level: 4, type: 'Detail', status: 'Aktif', debit: 3400000, kredit: 0, desc: 'Piutang selain layanan langganan', creator: 'Agus Dwi Rianto', dateCreated: '01/06/2026 09:21', changer: 'Agus Dwi Rianto', dateChanged: '28/06/2026 14:35', parent: '1.1.2' },
    { code: '1.2', name: 'Aset Tidak Lancar', category: 'Aset', level: 2, type: 'Header', status: 'Aktif', debit: 128560000, kredit: 0, desc: 'Aset Tidak Lancar / Inventaris Tetap', creator: 'System', dateCreated: '01/01/2026 00:00', changer: 'System', dateChanged: '01/01/2026 00:00', parent: '1' }
  ]);

  // Real dynamic statistics computed from active chart of accounts
  const totalAkun = accounts.length;
  const akunAktif = accounts.filter(a => a.status === 'Aktif').length;
  const akunNonAktif = accounts.filter(a => a.status === 'Non-Aktif').length;
  const accountsHeader = accounts.filter(a => a.type === 'Header').length;
  const accountsDetail = accounts.filter(a => a.type === 'Detail').length;
  const deepestLevel = Math.max(...accounts.map(a => a.level), 1);

  // Edit and Delete Modals State
  const [showEditModal, setShowEditModal] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Aset');
  const [editDebit, setEditDebit] = useState('');
  const [editKredit, setEditKredit] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<any | null>(null);

  const handleOpenEditModal = (acc: any) => {
    setAccountToEdit(acc);
    setEditName(acc.name);
    setEditCategory(acc.category);
    setEditDebit(String(acc.debit || 0));
    setEditKredit(String(acc.kredit || 0));
    setEditDesc(acc.desc || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountToEdit) return;
    setAccounts(accounts.map(acc => {
      if (acc.code === accountToEdit.code) {
        return {
          ...acc,
          name: editName,
          category: editCategory,
          debit: parseFloat(editDebit) || 0,
          kredit: parseFloat(editKredit) || 0,
          desc: editDesc,
          changer: 'Super Admin',
          dateChanged: new Date().toLocaleString('id-ID')
        };
      }
      return acc;
    }));
    setShowEditModal(false);
    setAccountToEdit(null);
  };

  const handleOpenDeleteModal = (acc: any) => {
    setAccountToDelete(acc);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!accountToDelete) return;
    setAccounts(accounts.filter(a => a.code !== accountToDelete.code));
    if (selectedAccCode === accountToDelete.code) {
      setSelectedAccCode(accounts[0]?.code || '');
    }
    setShowDeleteModal(false);
    setAccountToDelete(null);
  };

  // Chart data
  const donutChartData = [
    { name: 'Aset', value: 68 },
    { name: 'Liabilitas', value: 42 },
    { name: 'Ekuitas', value: 18 },
    { name: 'Pendapatan', value: 76 },
    { name: 'Beban', value: 74 },
    { name: 'Lainnya', value: 8 }
  ];

  const distributionLevelData = [
    { level: '1', value: 45 },
    { level: '2', value: 78 },
    { level: '3', value: 96 },
    { level: '4', value: 48 },
    { level: '5', value: 19 }
  ];

  // Selected Account computed details
  const selectedAcc = accounts.find(a => a.code === selectedAccCode) || accounts[3];

  const toggleNode = (code: string) => {
    setCollapsedNodes({
      ...collapsedNodes,
      [code]: !collapsedNodes[code]
    });
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

    const parentCode = newCode.includes('.') ? newCode.substring(0, newCode.lastIndexOf('.')) : '';

    const newAcc = {
      code: newCode,
      name: newName,
      category: newCategory,
      level: Number(newLevel),
      type: newType,
      status: 'Aktif',
      debit: newDebit ? parseFloat(newDebit) : 0,
      kredit: newKredit ? parseFloat(newKredit) : 0,
      desc: newDesc || 'Akun baru ditambahkan',
      creator: 'Agus Dwi Rianto',
      dateCreated: formattedDate,
      changer: 'Agus Dwi Rianto',
      dateChanged: formattedDate,
      parent: parentCode
    };

    setAccounts([...accounts, newAcc]);
    setSelectedAccCode(newCode);

    setNewCode('');
    setNewName('');
    setNewDebit('');
    setNewKredit('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleToggleStatus = (code: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.code === code) {
        return {
          ...acc,
          status: acc.status === 'Aktif' ? 'Non-Aktif' : 'Aktif'
        };
      }
      return acc;
    }));
  };

  // Filter accounts tree logic
  const filteredAccounts = accounts.filter(acc => {
    // Search Term
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.code.includes(searchTerm);

    // Kategori Filter
    const matchesCategory = filterCategory === 'Semua Kategori' || acc.category === filterCategory;

    // Level Filter
    const matchesLevel = filterLevel === 'Semua Level' || acc.level === Number(filterLevel);

    // Status Filter
    const matchesStatus = filterStatus === 'Semua Status' || acc.status === filterStatus;

    // Tab Filter
    let matchesTab = true;
    if (activeTab === 'Akun Header') matchesTab = acc.type === 'Header';
    else if (activeTab === 'Akun Detail') matchesTab = acc.type === 'Detail';
    else if (activeTab === 'Akun Aktif') matchesTab = acc.status === 'Aktif';
    else if (activeTab === 'Akun Non Aktif') matchesTab = acc.status === 'Non-Aktif';

    // Collapsed Tree Parents logic
    let parentIsCollapsed = false;
    Object.keys(collapsedNodes).forEach(collapsedCode => {
      if (collapsedNodes[collapsedCode] && acc.code.startsWith(collapsedCode + '.') && acc.code !== collapsedCode) {
        parentIsCollapsed = true;
      }
    });

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus && matchesTab && !parentIsCollapsed;
  });

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
              <span className="text-emerald-500 font-semibold">Bagan Akun (COA)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)]">Akun</h1>
            <p className="text-xs text-[var(--app-muted)] mt-1">Kelola semua akun/COA perusahaan. Buat, edit, dan atur struktur akun dengan mudah.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Akun Baru</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-xs font-semibold text-[var(--app-text)] border border-[var(--app-border)] shadow-xs transition-colors">
              <FolderOpen className="w-3.5 h-3.5 text-[var(--app-muted)]" />
              <span>Import Akun</span>
            </button>
            <button 
              onClick={() => alert('Mengekspor COA...')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--app-card)] hover:bg-slate-800 text-xs font-semibold text-white border border-[var(--app-border)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3 h-3 text-[var(--app-muted)]" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Akun */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Akun</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{totalAkun}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">+ 12 akun baru bulan ini</span>
          </div>

          {/* Akun Aktif */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Akun Aktif</p>
              <div className="p-1.5 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{akunAktif}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">95.8% dari total akun</span>
          </div>

          {/* Akun Non Aktif */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Akun Non Aktif</p>
              <div className="p-1.5 rounded-lg bg-orange-600/10 border border-orange-600/20 text-orange-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{akunNonAktif}</h3>
            <span className="text-[9px] text-orange-400 font-semibold mt-1">4.2% dari total akun</span>
          </div>

          {/* Akun Header */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Akun Header</p>
              <div className="p-1.5 rounded-lg bg-purple-600/10 border border-purple-600/20 text-purple-400">
                <Folder className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{accountsHeader}</h3>
            <span className="text-[9px] text-purple-400 font-semibold mt-1">15.7% dari total akun</span>
          </div>

          {/* Akun Detail */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Akun Detail</p>
              <div className="p-1.5 rounded-lg bg-cyan-600/10 border border-cyan-600/20 text-cyan-400">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{accountsDetail}</h3>
            <span className="text-[9px] text-cyan-400 font-semibold mt-1">84.3% dari total akun</span>
          </div>

          {/* Level Terdalam */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Level Terdalam</p>
              <div className="p-1.5 rounded-lg bg-rose-600/10 border border-rose-600/20 text-rose-400">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--app-text)]">{deepestLevel}</h3>
            <span className="text-[9px] text-[var(--app-muted)] font-semibold mt-1">Struktur COA</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--app-border)]/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Semua Akun', 'Akun Aktif', 'Akun Non Aktif', 'Akun Header', 'Akun Detail'].map((tab) => (
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

        {/* Middle Visualization Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Donut Chart: Struktur Akun */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_STRUKTUR[index % COLORS_STRUKTUR.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-lg font-bold text-[var(--app-text)]">{totalAkun}</p>
                <p className="text-[8px] text-[var(--app-muted)]">Total Akun</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[9px] text-[var(--app-muted)] w-full">
              <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Struktur Akun</h3>
              <div className="grid grid-cols-2 gap-2">
                {donutChartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS_STRUKTUR[index % COLORS_STRUKTUR.length] }}></span>
                    <span>{item.name}: {item.value} ({((item.value / 236) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart: Distribusi Level Akun */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
            <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-3">Distribusi Level Akun</h3>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionLevelData}>
                  <XAxis dataKey="level" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#10B981" radius={[2, 2, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Saldo Per Kategori */}
          <div className="bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
            <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-3">Saldo per Kategori</h3>
            <div className="space-y-1.5 text-xs text-[var(--app-text)]/90">
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-semibold">● Aset</span>
                <span>Rp 253.410.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-semibold">● Liabilitas</span>
                <span>Rp 98.750.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400 font-semibold">● Ekuitas</span>
                <span>Rp 154.660.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-semibold">● Pendapatan</span>
                <span>Rp 125.860.500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-rose-400 font-semibold">● Beban</span>
                <span>Rp 88.450.000</span>
              </div>
              <div className="flex justify-between items-center border-t border-[var(--app-border)]/80 pt-2 font-bold text-white text-[13px]">
                <span>Total Saldo</span>
                <span>Rp 720.130.500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tree Table on Left, Details Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COA Tree Table */}
          <div className="lg:col-span-8 bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[var(--app-muted)]" />
                <input
                  type="text"
                  placeholder="Cari akun..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded text-white focus:outline-none"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-1.5 rounded text-white text-[11px]"
              >
                <option>Semua Kategori</option>
                <option>Aset</option>
                <option>Liabilitas</option>
                <option>Ekuitas</option>
                <option>Pendapatan</option>
                <option>Beban</option>
              </select>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-1.5 rounded text-white text-[11px]"
              >
                <option>Semua Level</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-1.5 rounded text-white text-[11px]"
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Non-Aktif</option>
              </select>

              <button 
                onClick={() => {
                  setFilterCategory('Semua Kategori');
                  setFilterLevel('Semua Level');
                  setFilterStatus('Semua Status');
                  setSearchTerm('');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-[11px]"
              >
                Reset
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--app-border)]/80 text-[var(--app-muted)] font-semibold">
                    <th className="py-2.5">KODE AKUN</th>
                    <th className="py-2.5">NAMA AKUN</th>
                    <th className="py-2.5">KATEGORI</th>
                    <th className="py-2.5">LEVEL</th>
                    <th className="py-2.5">TIPE</th>
                    <th className="py-2.5">STATUS</th>
                    <th className="py-2.5 text-right">SALDO (DEBIT)</th>
                    <th className="py-2.5 text-right">SALDO (KREDIT)</th>
                    <th className="py-2.5 text-right pr-2">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]/90">
                  {filteredAccounts.map((acc) => {
                    const isCollapsed = collapsedNodes[acc.code];
                    const hasChildren = accounts.some(child => child.parent === acc.code);

                    return (
                      <tr 
                        key={acc.code} 
                        onClick={() => setSelectedAccCode(acc.code)}
                        className={`hover:bg-[var(--app-card-subtle)]/20 cursor-pointer transition-colors ${
                          selectedAccCode === acc.code ? 'bg-[var(--app-card-subtle)]/40 text-cyan-400 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 font-mono text-[11px]">{acc.code}</td>
                        <td className="py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1" style={{ paddingLeft: `${(acc.level - 1) * 12}px` }}>
                            {hasChildren ? (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNode(acc.code);
                                }}
                                className="p-0.5 hover:text-cyan-400"
                              >
                                <span className="text-[10px]">{isCollapsed ? '▶' : '▼'}</span>
                              </button>
                            ) : (
                              <span className="w-3.5"></span>
                            )}
                            <span>{acc.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5">{acc.category}</td>
                        <td className="py-2.5 text-[var(--app-muted)]">{acc.level}</td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                            acc.type === 'Header' ? 'bg-purple-500/15 text-purple-300' : 'bg-cyan-500/15 text-cyan-300'
                          }`}>
                            {acc.type}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                            acc.status === 'Aktif' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {acc.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono">{formatRupiah(acc.debit)}</td>
                        <td className="py-2.5 text-right font-mono">{formatRupiah(acc.kredit)}</td>
                        <td className="py-2.5 text-right pr-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedAccCode(acc.code)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition"
                              title="Lihat Detail"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(acc)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-600 transition"
                              title="Edit Akun"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(acc)}
                              className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded text-slate-500 hover:text-rose-600 transition"
                              title="Hapus Akun"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--app-border)]/60 text-[11px] text-[var(--app-muted)]">
              <span>Menampilkan {filteredAccounts.length} dari {totalAkun} akun</span>
              <div className="flex items-center gap-1.5">
                <button className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-semibold">1</button>
              </div>
            </div>
          </div>

          {/* Account Detail Panel */}
          <div className="lg:col-span-4 bg-[var(--app-card)] shadow-xs border border-[var(--app-border)] rounded-xl p-5 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--app-border)]/60">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Detail Akun</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                selectedAcc.status === 'Aktif' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
              }`}>
                ● {selectedAcc.status}
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-[var(--app-text)]/90">
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Kode Akun</span>
                <span className="col-span-2 font-mono font-semibold text-[var(--app-text)]">{selectedAcc.code}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Nama Akun</span>
                <span className="col-span-2 font-semibold text-[var(--app-text)]">{selectedAcc.name}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Kategori</span>
                <span className="col-span-2">{selectedAcc.category}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Tipe Akun</span>
                <span className="col-span-2">{selectedAcc.type}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Level</span>
                <span className="col-span-2">{selectedAcc.level}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Saldo Normal</span>
                <span className="col-span-2 text-cyan-400 font-semibold">{selectedAcc.debit > 0 ? 'Debit' : 'Kredit'}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Saldo (Debit)</span>
                <span className="col-span-2 font-mono">{formatRupiah(selectedAcc.debit)}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Saldo (Kredit)</span>
                <span className="col-span-2 font-mono">{formatRupiah(selectedAcc.kredit)}</span>
              </div>
              <div className="grid grid-cols-3 border-t border-[var(--app-border)] pt-3">
                <span className="text-[var(--app-muted)]">Deskripsi</span>
                <span className="col-span-2 text-[var(--app-muted)] italic">{selectedAcc.desc}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Dibuat Oleh</span>
                <span className="col-span-2">{selectedAcc.creator}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Dibuat Pada</span>
                <span className="col-span-2 text-[var(--app-muted)]">{selectedAcc.dateCreated}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Diubah Oleh</span>
                <span className="col-span-2">{selectedAcc.changer}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[var(--app-muted)]">Diubah Pada</span>
                <span className="col-span-2 text-[var(--app-muted)]">{selectedAcc.dateChanged}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--app-border)]">
              <button 
                onClick={() => handleOpenEditModal(selectedAcc)}
                className="bg-blue-600 hover:bg-blue-500 py-2 rounded text-[var(--app-text)] font-semibold text-center text-xs flex items-center justify-center gap-1.5"
              >
                <Edit size={13} />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleToggleStatus(selectedAcc.code)}
                className="border border-orange-500/50 hover:bg-orange-500/10 text-orange-400 py-2 rounded font-semibold text-center text-xs"
              >
                {selectedAcc.status === 'Aktif' ? 'Non-Aktif' : 'Aktifkan'}
              </button>
              <button 
                onClick={() => handleOpenDeleteModal(selectedAcc)}
                className="border border-rose-500/50 hover:bg-rose-500/10 text-rose-400 py-2 rounded font-semibold text-center text-xs flex items-center justify-center gap-1"
              >
                <Trash2 size={13} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Tambah Akun Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--app-border)]">
                <h3 className="text-sm font-bold text-white">Buat Akun Baru</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-[var(--app-muted)] hover:text-white text-xs"
                >
                  Batal
                </button>
              </div>
              <form onSubmit={handleAddAccount} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kode Akun</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 1.1.1.04"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Nama Akun</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kas Kecil"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Aset</option>
                      <option>Liabilitas</option>
                      <option>Ekuitas</option>
                      <option>Pendapatan</option>
                      <option>Beban</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Level</label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Tipe</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Detail</option>
                      <option>Header</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Saldo Awal (Debit)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newDebit}
                      onChange={(e) => setNewDebit(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Saldo Awal (Kredit)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newKredit}
                      onChange={(e) => setNewKredit(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Deskripsi Akun</label>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi singkat akun..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-[var(--app-text)] font-semibold transition-colors mt-2"
                >
                  Simpan Akun
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
        {/* Modal: Edit Akun */}
        {showEditModal && accountToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-blue-500/15 text-blue-400">
                    <Edit size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Edit Akun COA</h3>
                    <p className="text-[10px] text-[var(--app-muted)] font-mono">{accountToEdit.code}</p>
                  </div>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-[var(--app-muted)] hover:text-white text-xs">
                  Batal
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Akun</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Kategori Akun</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Aset">Aset</option>
                    <option value="Liabilitas">Liabilitas</option>
                    <option value="Ekuitas">Ekuitas</option>
                    <option value="Pendapatan">Pendapatan</option>
                    <option value="Beban">Beban</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Saldo Debit (Rp)</label>
                    <input
                      type="number"
                      value={editDebit}
                      onChange={(e) => setEditDebit(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Saldo Kredit (Rp)</label>
                    <input
                      type="number"
                      value={editKredit}
                      onChange={(e) => setEditKredit(e.target.value)}
                      className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Deskripsi Akun</label>
                  <textarea
                    rows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-white focus:outline-none focus:border-cyan-500"
                  />
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

        {/* Modal: Hapus Akun */}
        {showDeleteModal && accountToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-rose-500 border-b border-[var(--app-border)] pb-3">
                <Trash2 size={18} />
                <h3 className="text-sm font-bold">Hapus Akun</h3>
              </div>
              <p className="text-xs text-[var(--app-text)]">
                Yakin ingin menghapus akun <strong className="text-white">{accountToDelete.name}</strong> ({accountToDelete.code})?
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
    </Layout>
  );
}
