import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { 
  Zap, 
  Star, 
  Check, 
  X, 
  Crown, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Package as PackageIcon, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Mail, 
  Maximize2,
  Eye,
  MoreVertical,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  price: number;
  speed: string;
  description: string | null;
  status: string;
  customerCount: number;
  serviceCount: number;
  createdAt: string;
}

interface Statistics {
  total: number;
  active: number;
  inactive: number;
  totalRevenue: number;
  popularPackages: Array<{
    id: string;
    name: string;
    speed: string;
    price: number;
    customerCount: number;
    revenue: number;
  }>;
}

interface PackageFormData {
  name: string;
  price: number;
  speed: string;
  description: string;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function PackageManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  
  // Custom Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    price: 0,
    speed: '',
    description: '',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchStatistics();
    fetchPackages();
  }, [page, limit, search, statusFilter, categoryFilter, typeFilter, activeTab]);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.action === 'add') {
        setFormData({ name: '', price: 0, speed: '', description: '', status: 'active' });
        setShowCreateModal(true);
        // Clear query to avoid re-triggering on reload
        router.replace('/packages-admin', undefined, { shallow: true });
      }
      if (router.query.status === 'inactive') {
        setActiveTab('inactive');
      }
    }
  }, [router.isReady, router.query]);

  const checkAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
    }
  };

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/statistics/overview`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      // Map filters to backend query if supported
      const activeStatus = activeTab !== 'all' ? activeTab : statusFilter;
      if (activeStatus !== 'all') params.append('status', activeStatus);
      if (search) params.append('search', search);

      const response = await fetch(`${API_BASE_URL}/packages?${params}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper mappings for category & dummy fields to match design
  const getPackageCategory = (pkg: Package) => {
    const name = pkg.name.toLowerCase();
    if (name.includes('corporate') || name.includes('biz')) return 'Corporate';
    if (name.includes('combo') || name.includes('tv')) return 'Combo';
    return 'Internet';
  };

  const getInstallationFee = (pkg: Package) => {
    if (pkg.price === 0) return 0;
    const name = pkg.name.toLowerCase();
    if (name.includes('corporate') || name.includes('biz')) return 500000;
    if (name.includes('combo')) return 200000;
    return 150000;
  };

  const getPeriod = (pkg: Package) => {
    if (pkg.price === 0) return '7 Hari';
    return 'Bulanan';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setActiveTab('all');
    setPage(1);
  };

  // CRUD actions
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Price must be greater than 0';
    if (!formData.speed.trim()) errors.speed = 'Speed is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/packages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowCreateModal(false);
        fetchPackages();
        fetchStatistics();
        toast.success('Paket internet baru berhasil dibuat!', 'Paket Ditambahkan');
      } else {
        const error = await response.json();
        toast.error(`Gagal membuat paket: ${error.message || 'Error server'}`, 'Gagal');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`, 'Gagal');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedPackage) return;
    setFormLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/packages/${selectedPackage.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowEditModal(false);
        fetchPackages();
        fetchStatistics();
        toast.success('Paket internet berhasil diperbarui!', 'Update Berhasil');
      } else {
        const error = await response.json();
        toast.error(`Gagal update paket: ${error.message || 'Error server'}`, 'Gagal');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`, 'Gagal');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePackage = async () => {
    if (!selectedPackage) return;
    setFormLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/packages/${selectedPackage.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setShowDeleteModal(false);
        fetchPackages();
        fetchStatistics();
        toast.success('Paket internet berhasil dihapus!', 'Paket Dihapus');
      } else {
        const error = await response.json();
        toast.error(`Gagal menghapus paket: ${error.message || 'Error server'}`, 'Gagal');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`, 'Gagal');
    } finally {
      setFormLoading(false);
    }
  };

  // Filter package lists locally if needed for categories or tabs
  const filteredPackages = packages.filter(pkg => {
    const category = getPackageCategory(pkg);
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'active' && pkg.status === 'active') ||
      (activeTab === 'inactive' && pkg.status === 'inactive') ||
      (activeTab === 'internet' && category === 'Internet') ||
      (activeTab === 'combo' && category === 'Combo') ||
      (activeTab === 'corporate' && category === 'Corporate');

    const matchesCategory = categoryFilter === 'all' || category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    
    return matchesTab && matchesCategory && matchesStatus;
  });

  // Calculate dynamic stats metrics
  const totalCount = statistics?.total ?? packages.length;
  const activeCount = statistics?.active ?? packages.filter(p => p.status === 'active').length;
  const inactiveCount = statistics?.inactive ?? packages.filter(p => p.status === 'inactive').length;
  const totalCustomers = packages.reduce((acc, p) => acc + (p.customerCount || 0), 0);
  const averageRevenue = statistics?.totalRevenue ?? 0;

  // Pie chart calculation helper values
  const countInternet = packages.filter(p => getPackageCategory(p) === 'Internet').length;
  const countCombo = packages.filter(p => getPackageCategory(p) === 'Combo').length;
  const countCorporate = packages.filter(p => getPackageCategory(p) === 'Corporate').length;
  const countNonActive = packages.filter(p => p.status === 'inactive').length;
  const sumForDonut = countInternet + countCombo + countCorporate + countNonActive;
  const safeDonutSum = sumForDonut > 0 ? sumForDonut : 1;

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-mono">
              <span>Home</span>
              <span>/</span>
              <span>Package</span>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Semua Package</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--app-text)] tracking-tight">Katalog Paket &amp; Layanan Internet</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Calendar */}
            <div className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] px-3 py-1.5 rounded-lg text-xs text-[var(--app-text)] font-mono">
              <Calendar size={14} className="text-blue-500" />
              <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            
            {/* Status Sistem */}
            <div className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] px-3 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[var(--app-text-muted)]">Status Sistem</span>
              <span className="text-emerald-500 font-bold">Online</span>
            </div>

            {/* Global Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-text-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari customer, invoice, tagihan..."
                className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl text-xs pl-9 pr-4 py-2 text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Notification and Profile icons */}
            <div className="flex items-center gap-3">
              <button onClick={() => toast.info('Tidak ada notifikasi baru paket.', 'Notifikasi Katalog')} className="relative p-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-bg)] transition-colors">
                <Bell size={16} className="text-[var(--app-text-muted)]" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75 font-mono">12</span>
              </button>
              <button onClick={() => toast.info('Membuka pesan tiket dan permintaan upgrade paket...', 'Kotak Masuk')} className="relative p-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-bg)] transition-colors">
                <Mail size={16} className="text-[var(--app-text-muted)]" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75 font-mono">8</span>
              </button>
              <button onClick={() => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); } else { document.exitFullscreen?.(); } }} className="p-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-bg)] transition-colors max-sm:hidden">
                <Maximize2 size={16} className="text-[var(--app-text-muted)]" />
              </button>
              
              {/* Profile */}
              <div className="flex items-center gap-2 pl-2 border-l border-[var(--app-border)]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  <span className="text-xs">AR</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-[var(--app-text)]">Agus Dwi Rianto</div>
                  <div className="text-[9px] text-[var(--app-text-muted)] font-bold uppercase">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Add Package Button Area ───────────────────────────────────── */}
        <div className="flex justify-end">
          <button 
            onClick={() => {
              setFormData({ name: '', price: 0, speed: '', description: '', status: 'active' });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Tambah Package</span>
          </button>
        </div>

        {/* ─── Stat Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Card 1: Total Package */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <PackageIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Total Package</p>
              <p className="text-2xl font-black text-[var(--app-text)] font-mono mt-0.5">{totalCount}</p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Semua package</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Check size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] font-mono mt-0.5">{activeCount}</p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Package aktif</p>
            </div>
          </div>

          {/* Card 3: Non Aktif */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-slate-500/10 text-[var(--app-text-muted)] border border-slate-500/20 rounded-xl">
              <X size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] font-mono mt-0.5">{inactiveCount}</p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Package non aktif</p>
            </div>
          </div>

          {/* Card 4: Total Customer */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Total Customer</p>
              <p className="text-2xl font-black text-[var(--app-text)] font-mono mt-0.5">{totalCustomers.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Menggunakan package</p>
            </div>
          </div>

          {/* Card 5: Average Revenue */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Rata-rata Revenue</p>
              <p className="text-lg font-black text-[var(--app-text)] font-mono mt-0.5">{formatCurrency(averageRevenue)}</p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Per bulan</p>
            </div>
          </div>
        </div>

        {/* ─── Query / Filter Bar ─────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Input Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-text-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari nama package, kecepatan, harga..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Dropdown Category */}
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500 min-w-[150px]"
            >
              <option value="all">Semua Kategori</option>
              <option value="internet">Internet</option>
              <option value="combo">Combo</option>
              <option value="corporate">Corporate</option>
            </select>

            {/* Dropdown Status */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500 min-w-[150px]"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non Aktif</option>
            </select>

            {/* Dropdown Type */}
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500 min-w-[150px]"
            >
              <option value="all">Semua Tipe</option>
              <option value="broadband">Broadband</option>
              <option value="dedicated">Dedicated</option>
            </select>

            {/* Reset Button */}
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-transparent hover:border-[var(--app-border)] transition-all"
            >
              Reset
            </button>

            {/* Filter Button */}
            <button 
              onClick={fetchPackages}
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* ─── Two Column Main Dashboard Body ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ─── Left Column (Table List) ─────────────────────────────────── */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Table Header controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[var(--app-card)] p-3 rounded-2xl border border-[var(--app-border)]">
              {/* Tabs */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: `Semua Package (${totalCount})` },
                  { id: 'internet', label: `Internet (${countInternet})` },
                  { id: 'combo', label: `Combo (${countCombo})` },
                  { id: 'corporate', label: `Corporate (${countCorporate})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-bg)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Data limit and views */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs text-[var(--app-text-muted)]">Tampilkan</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)] font-mono focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs text-[var(--app-text-muted)]">data</span>

                {/* View toggles */}
                <div className="flex gap-1 border border-[var(--app-border)] rounded-xl p-0.5 bg-[var(--app-bg)]">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}
                  >
                    <SlidersHorizontal size={14} className="rotate-90" />
                  </button>
                </div>
              </div>
            </div>

            {/* The Main Data Table */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input type="checkbox" className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                      </th>
                      <th className="p-4">NO</th>
                      <th className="p-4">NAMA PACKAGE</th>
                      <th className="p-4">KATEGORI</th>
                      <th className="p-4">KECEPATAN</th>
                      <th className="p-4">HARGA</th>
                      <th className="p-4">BIAYA PASANG</th>
                      <th className="p-4">PERIODE</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4">CUSTOMER</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                    {loading ? (
                      <tr>
                        <td colSpan={11} className="p-12 text-center text-[var(--app-text-muted)] font-semibold">
                          <RefreshCw size={14} className="inline-block animate-spin mr-2" /> Loading package data...
                        </td>
                      </tr>
                    ) : filteredPackages.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-12 text-center text-[var(--app-text-muted)] font-semibold">
                          Tidak ada data package ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((pkg, idx) => {
                        const rowNo = (page - 1) * limit + idx + 1;
                        return (
                          <tr key={pkg.id} className="hover:bg-[var(--app-bg)] transition-colors">
                            <td className="p-4">
                              <input type="checkbox" className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                            </td>
                            <td className="p-4 text-[var(--app-text-muted)] font-mono">{rowNo}</td>
                            <td className="p-4 font-bold text-[var(--app-text)]">{pkg.name}</td>
                            <td className="p-4 text-[var(--app-text-muted)]">{getPackageCategory(pkg)}</td>
                            <td className="p-4 font-mono font-semibold text-[var(--app-text)]">{pkg.speed} / {pkg.speed}</td>
                            <td className="p-4 font-mono font-bold text-[var(--app-text)]">{formatCurrency(pkg.price)}</td>
                            <td className="p-4 font-mono text-[var(--app-text-muted)]">{formatCurrency(getInstallationFee(pkg))}</td>
                            <td className="p-4 text-[var(--app-text-muted)]">{getPeriod(pkg)}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                pkg.status === 'active' 
                                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' 
                                  : 'bg-slate-500/10 text-[var(--app-text-muted)] border border-slate-500/20'
                              }`}>
                                {pkg.status === 'active' ? 'Aktif' : 'Non Aktif'}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-semibold text-[var(--app-text)]">{pkg.customerCount || 0}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setSelectedPackage(pkg); setFormData({ name: pkg.name, price: pkg.price, speed: pkg.speed, description: pkg.description || '', status: pkg.status }); setShowEditModal(true); }} className="p-1.5 hover:bg-[var(--app-bg)] rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors">
                                  <Eye size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedPackage(pkg);
                                    setFormData({
                                      name: pkg.name,
                                      price: pkg.price,
                                      speed: pkg.speed,
                                      description: pkg.description || '',
                                      status: pkg.status,
                                    });
                                    setShowEditModal(true);
                                  }}
                                  className="p-1.5 hover:bg-blue-500/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedPackage(pkg);
                                    setShowDeleteModal(true);
                                  }}
                                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-[var(--app-card)]">
                <span className="text-xs text-[var(--app-text-muted)]">
                  Menampilkan <span className="font-mono font-semibold text-[var(--app-text)]">{total === 0 ? 0 : (page - 1) * limit + 1}</span> - <span className="font-mono font-semibold text-[var(--app-text)]">{Math.min(page * limit, total)}</span> dari <span className="font-mono font-semibold text-[var(--app-text)]">{total}</span> data
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-xl text-[var(--app-text-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pg = i + 1;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-8 h-8 rounded-xl text-xs font-mono font-semibold border transition-all ${
                          page === pg 
                            ? 'bg-[#0052cc] text-white border-[#0052cc]' 
                            : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-bg)]'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-xl text-[var(--app-text-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Column (Charts & Widgets) ───────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Distribusi Package (Donut chart) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Distribusi Package</h3>
              
              <div className="relative flex justify-center py-2">
                {/* SVG Donut Chart */}
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--app-border)" strokeWidth="4.5" />
                  
                  {/* Internet segment */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="4.5" 
                    strokeDasharray={`${(countInternet / safeDonutSum) * 100} ${100 - (countInternet / safeDonutSum) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Combo segment */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4.5" 
                    strokeDasharray={`${(countCombo / safeDonutSum) * 100} ${100 - (countCombo / safeDonutSum) * 100}`} 
                    strokeDashoffset={`${100 - (countInternet / safeDonutSum) * 100}`} 
                  />

                  {/* Corporate segment */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(countCorporate / safeDonutSum) * 100} ${100 - (countCorporate / safeDonutSum) * 100}`} 
                    strokeDashoffset={`${100 - ((countInternet + countCombo) / safeDonutSum) * 100}`} 
                  />

                  {/* Non Active segment */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#4b5563" strokeWidth="4.5" 
                    strokeDasharray={`${(countNonActive / safeDonutSum) * 100} ${100 - (countNonActive / safeDonutSum) * 100}`} 
                    strokeDashoffset={`${100 - ((countInternet + countCombo + countCorporate) / safeDonutSum) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-[var(--app-text)] font-mono">{totalCount}</p>
                  <p className="text-[9px] text-[var(--app-text-muted)] font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span>
                    <span>Internet</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--app-text)]">{countInternet} ({sumForDonut > 0 ? ((countInternet / sumForDonut) * 100).toFixed(1) : '0.0'}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                    <span>Combo</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--app-text)]">{countCombo} ({sumForDonut > 0 ? ((countCombo / sumForDonut) * 100).toFixed(1) : '0.0'}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>Corporate</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--app-text)]">{countCorporate} ({sumForDonut > 0 ? ((countCorporate / sumForDonut) * 100).toFixed(1) : '0.0'}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-gray-600 inline-block"></span>
                    <span>Non Aktif</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--app-text)]">{countNonActive} ({sumForDonut > 0 ? ((countNonActive / sumForDonut) * 100).toFixed(1) : '0.0'}%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Top 5 Package (Customer) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Top 5 Package (Customer)</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Home 50 Mbps', customers: 1025, max: 1025, rank: 1 },
                  { name: 'Home 20 Mbps', customers: 892, max: 1025, rank: 2 },
                  { name: 'Home 10 Mbps', customers: 523, max: 1025, rank: 3 },
                  { name: 'Home 100 Mbps', customers: 542, max: 1025, rank: 4 },
                  { name: 'Combo 20 Mbps + TV', customers: 312, max: 1025, rank: 5 },
                ].map((item, index) => {
                  const percentage = (item.customers / item.max) * 100;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[var(--app-text-muted)] font-mono font-bold w-4">{item.rank}</span>
                          <span className="font-bold text-[var(--app-text)]">{item.name}</span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-[var(--app-text-muted)]">{item.customers.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Pendapatan per Bulan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3 relative overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Pendapatan per Bulan</h3>
              <p className="text-[10px] text-[var(--app-text-muted)] font-semibold">(Berdasarkan Package Aktif)</p>
              
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xl font-black text-[var(--app-text)] font-mono">{formatCurrency(averageRevenue)}</p>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">+12.5%</span>
              </div>
              <p className="text-[9px] text-[var(--app-text-muted)]">Dibanding bulan lalu</p>

              {/* Sparkline chart SVG */}
              <div className="h-10 w-full mt-4">
                <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                  <path 
                    d="M0,15 Q15,8 30,12 T60,5 T90,14 L100,10" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M0,15 Q15,8 30,12 T60,5 T90,14 L100,10 L100,20 L0,20 Z" 
                    fill="url(#sparkline-grad)" 
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Create New Package Modal ───────────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[var(--app-border)] flex justify-between items-center">
                <h2 className="text-lg font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Plus className="text-blue-500" size={18} />
                  <span>Buat Package Baru</span>
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-[var(--app-bg)] rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreatePackage} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Nama Package *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 bg-[var(--app-bg)] border rounded-xl text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 ${formErrors.name ? 'border-red-500' : 'border-[var(--app-border)]'}`}
                    placeholder="Contoh: Home 10 Mbps"
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Kecepatan (Speed) *</label>
                  <input
                    type="text"
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                    className={`w-full px-3 py-2 bg-[var(--app-bg)] border rounded-xl text-xs font-mono text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 ${formErrors.speed ? 'border-red-500' : 'border-[var(--app-border)]'}`}
                    placeholder="Contoh: 10 Mbps"
                  />
                  {formErrors.speed && <p className="text-red-500 text-[10px] mt-1">{formErrors.speed}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2 bg-[var(--app-bg)] border rounded-xl text-xs font-mono text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 ${formErrors.price ? 'border-red-500' : 'border-[var(--app-border)]'}`}
                    placeholder="Contoh: 200000"
                  />
                  {formErrors.price && <p className="text-red-500 text-[10px] mt-1">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500"
                    placeholder="Deskripsi detail paket..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non Aktif</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--app-border)] mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={formLoading}
                    className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-xl text-xs font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-all disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {formLoading ? 'Menyimpan...' : 'Simpan Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── Edit Package Modal ─────────────────────────────────────────── */}
        {showEditModal && selectedPackage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[var(--app-border)] flex justify-between items-center">
                <h2 className="text-lg font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Edit className="text-blue-500" size={18} />
                  <span>Edit Package</span>
                </h2>
                <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-[var(--app-bg)] rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdatePackage} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Nama Package *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 bg-[var(--app-bg)] border rounded-xl text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 ${formErrors.name ? 'border-red-500' : 'border-[var(--app-border)]'}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Kecepatan (Speed) *</label>
                  <input
                    type="text"
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                    className={`w-full px-3 py-2 bg-[var(--app-bg)] border rounded-xl text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500 ${formErrors.speed ? 'border-red-500' : 'border-[var(--app-border)]'}`}
                  />
                  {formErrors.speed && <p className="text-red-500 text-[10px] mt-1">{formErrors.speed}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2 bg-[var(--app-bg)] border rounded-xl text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500 ${formErrors.price ? 'border-red-500' : 'border-[var(--app-border)]'}`}
                  />
                  {formErrors.price && <p className="text-red-500 text-[10px] mt-1">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non Aktif</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--app-border)] mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={formLoading}
                    className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-xl text-xs font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-all disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {formLoading ? 'Menyimpan...' : 'Perbarui Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── Delete Package Modal ───────────────────────────────────────── */}
        {showDeleteModal && selectedPackage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)]">Hapus Package</h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-2">
                    Apakah Anda yakin ingin menghapus package <strong className="text-[var(--app-text)]">{selectedPackage.name}</strong>?
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2.5 p-4 bg-[var(--app-bg)] border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={formLoading}
                  className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-card)] rounded-xl text-xs font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeletePackage}
                  disabled={formLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
