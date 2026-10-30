import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { showAudiraToast } from '@/contexts/ToastContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  MapPin,
  X,
  Download,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Printer,
  ShieldCheck,
  Layers,
  Wrench,
  Clock,
  Building2,
  Lightbulb,
  CreditCard,
  User,
} from 'lucide-react';

interface Employee {
  id: string;
  userId?: string;
  employeeNumber: string;
  fullName: string;
  nickname?: string;
  birthDate?: string;
  birthPlace?: string;
  gender?: string;
  religion?: string;
  maritalStatus?: string;
  bloodType?: string;
  identityType?: string;
  identityNumber?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  email?: string;
  photo?: string;
  department?: string;
  position?: string;
  employmentType: string;
  joinDate: string;
  endDate?: string;
  status: string;
  workLocation?: string;
  directSuperior?: string;
  baseSalary: number;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  taxNumber?: string;
  bpjsKetenagakerjaan?: string;
  bpjsKesehatan?: string;
  cvUrl?: string;
  contractUrl?: string;
  notes?: string;
  createdAt?: string;
  user?: {
    email: string;
    role: string;
  };
}

export default function Karyawan() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'personal' | 'employment' | 'payroll' | 'skills'>('personal');

  // ID Card Modal
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [idCardTarget, setIdCardTarget] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeNumber: '',
    fullName: '',
    nickname: '',
    gender: 'male',
    identityNumber: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    department: 'Teknisi Lapangan',
    position: 'Teknisi FTTH & PSB',
    employmentType: 'permanent',
    joinDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    workLocation: 'NOC Central Basecamp',
    baseSalary: 4500000,
    bankName: 'BCA',
    bankAccount: '',
    bankAccountName: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadEmployees(), loadStats()]);
    } catch (err) {
      console.error('Failed to load employee data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await api.employee.getAll();
      const list = Array.isArray(res) ? res : res.employees || res.data || [];
      setEmployees(list);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.employee.getStats();
      if (res) setStats(res);
    } catch (err) {
      console.error('Error fetching employee stats:', err);
    }
  };

  // Generate NIK Otomatis
  const generateNIK = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    return `EMP-${year}-${rand}`;
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setActiveFormTab('personal');
    setFormData({
      employeeNumber: generateNIK(),
      fullName: '',
      nickname: '',
      gender: 'male',
      identityNumber: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      department: 'Teknisi Lapangan',
      position: 'Teknisi FTTH & PSB',
      employmentType: 'permanent',
      joinDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active',
      workLocation: 'NOC Central Basecamp',
      baseSalary: 4500000,
      bankName: 'BCA',
      bankAccount: '',
      bankAccountName: '',
      notes: 'Sertifikasi K3 & Splicer Optik',
    });
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setActiveFormTab('personal');
    setFormData({
      employeeNumber: emp.employeeNumber || '',
      fullName: emp.fullName || '',
      nickname: emp.nickname || '',
      gender: emp.gender || 'male',
      identityNumber: emp.identityNumber || '',
      phone: emp.phone || '',
      email: emp.email || '',
      address: emp.address || '',
      emergencyContact: emp.emergencyContact || '',
      emergencyPhone: emp.emergencyPhone || '',
      department: emp.department || 'Teknisi Lapangan',
      position: emp.position || 'Teknisi',
      employmentType: emp.employmentType || 'permanent',
      joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : '',
      endDate: emp.endDate ? new Date(emp.endDate).toISOString().split('T')[0] : '',
      status: emp.status || 'active',
      workLocation: emp.workLocation || '',
      baseSalary: emp.baseSalary || 0,
      bankName: emp.bankName || 'BCA',
      bankAccount: emp.bankAccount || '',
      bankAccountName: emp.bankAccountName || '',
      notes: emp.notes || '',
    });
    setShowAddEditModal(true);
  };

  // Save Employee
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.employeeNumber.trim()) {
      showAudiraToast.error('Nama Lengkap dan NIK Karyawan wajib diisi!', 'Validasi');
      return;
    }

    setActionLoading(true);
    try {
      if (editingEmployee) {
        await api.employee.update(editingEmployee.id, {
          ...formData,
          baseSalary: Number(formData.baseSalary) || 0,
        });
        showAudiraToast.success(`Data karyawan ${formData.fullName} berhasil diperbarui!`, 'Berhasil');
      } else {
        await api.employee.create({
          ...formData,
          baseSalary: Number(formData.baseSalary) || 0,
        });
        showAudiraToast.success(`Karyawan baru ${formData.fullName} (${formData.employeeNumber}) berhasil didaftarkan!`, 'Berhasil');
      }
      setShowAddEditModal(false);
      loadEmployees();
      loadStats();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menyimpan data karyawan', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Employee
  const handleDelete = async (emp: Employee) => {
    if (!confirm(`Hapus permanen data karyawan ${emp.fullName} (${emp.employeeNumber})? Seluruh riwayat presensi dan payroll terkait akan terpengaruh.`)) {
      return;
    }

    setActionLoading(true);
    try {
      await api.employee.delete(emp.id);
      showAudiraToast.success(`Data karyawan ${emp.fullName} telah dihapus.`, 'Dihapus');
      loadEmployees();
      loadStats();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menghapus karyawan', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (employees.length === 0) {
      showAudiraToast.warning('Tidak ada data karyawan untuk diekspor', 'Info');
      return;
    }

    const headers = [
      'NIK',
      'Nama Lengkap',
      'Panggilan',
      'Departemen',
      'Jabatan',
      'Tipe Kontrak',
      'No. WhatsApp',
      'Email',
      'Lokasi Kerja',
      'Status',
      'Gaji Pokok',
      'Bank',
      'No. Rekening',
      'Atas Nama',
      'Tanggal Bergabung',
    ];

    const rows = employees.map((e) => [
      `"${e.employeeNumber}"`,
      `"${e.fullName}"`,
      `"${e.nickname || '-'}"`,
      `"${e.department || '-'}"`,
      `"${e.position || '-'}"`,
      `"${e.employmentType}"`,
      `"${e.phone || '-'}"`,
      `"${e.email || '-'}"`,
      `"${e.workLocation || '-'}"`,
      `"${e.status}"`,
      `"${e.baseSalary || 0}"`,
      `"${e.bankName || '-'}"`,
      `"${e.bankAccount || '-'}"`,
      `"${e.bankAccountName || '-'}"`,
      `"${e.joinDate ? new Date(e.joinDate).toLocaleDateString('id-ID') : '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Karyawan_AUDIRA_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAudiraToast.success('Data direktori karyawan berhasil diunduh (CSV)!', 'Ekspor Sukses');
  };

  // Open ID Card Modal
  const handleOpenIdCard = (emp: Employee) => {
    setIdCardTarget(emp);
    setShowIdCardModal(true);
  };

  // Format IDR
  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  // Filtered List
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        !searchTerm ||
        emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone?.includes(searchTerm) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.workLocation?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchStatus = statusFilter === 'all' || emp.status === statusFilter;
      const matchType = typeFilter === 'all' || emp.employmentType === typeFilter;

      return matchSearch && matchDept && matchStatus && matchType;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter, typeFilter]);

  const getDepartmentBadge = (dept?: string) => {
    switch (dept) {
      case 'Teknisi Lapangan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Wrench className="w-3 h-3" />
            Teknisi Lapangan
          </span>
        );
      case 'Network Operation Center':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Layers className="w-3 h-3" />
            NOC Engineer
          </span>
        );
      case 'Customer Support & Billing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Phone className="w-3 h-3" />
            CS & Billing
          </span>
        );
      case 'Finance & Akuntansi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CreditCard className="w-3 h-3" />
            Finance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {dept || 'Umum'}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Aktif
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Non-Aktif
          </span>
        );
      case 'resigned':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Resigned
          </span>
        );
      default:
        return <span className="text-xs text-[var(--app-muted)] capitalize">{status}</span>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[var(--app-card)] p-6 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-md">
                AUDIRA HUMAN RESOURCE MANAGEMENT
              </span>
              <span className="text-xs text-[var(--app-muted)] flex items-center gap-1 font-mono">
                <Building2 className="w-3.5 h-3.5" />
                Direktori Personel & Teknisi ISP
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--app-text)] tracking-tight">
              Daftar Karyawan & Teknisi
            </h1>
            <p className="text-sm text-[var(--app-muted)] mt-1">
              Kelola data master personel, penugasan teknisi lapangan FTTH, hak akses, kontak darurat, serta ID Card digital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2.5 text-xs font-semibold text-[var(--app-text)] bg-[var(--app-surface)] hover:bg-[var(--app-border)] border border-[var(--app-border)] rounded-xl transition-all flex items-center gap-2"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sinkronisasi</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 text-xs font-semibold text-[var(--app-text)] bg-[var(--app-surface)] hover:bg-[var(--app-border)] border border-[var(--app-border)] rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Karyawan</span>
            </button>
          </div>
        </div>

        {/* 5 Real-Time KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total Staff */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--app-muted)]">Total Karyawan</span>
              <Users className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] mt-2 font-mono">
              {stats?.total ?? employees.length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Personel Terdaftar</div>
          </div>

          {/* Active Employees */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Status Aktif</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
              {stats?.active ?? employees.filter((e) => e.status === 'active').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Beroperasi Aktif</div>
          </div>

          {/* Field Technicians */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Teknisi Lapangan</span>
              <Wrench className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-2 font-mono">
              {employees.filter((e) => e.department === 'Teknisi Lapangan').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Splicer & PSB FTTH</div>
          </div>

          {/* NOC Personnel */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">NOC Engineers</span>
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2 font-mono">
              {employees.filter((e) => e.department === 'Network Operation Center').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Monitoring 24/7</div>
          </div>

          {/* Permanent Rate */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-indigo-500/40 transition-all col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Karyawan Tetap</span>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2 font-mono">
              {employees.filter((e) => e.employmentType === 'permanent').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Perjanjian Kerja PKWTT</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
            <input
              type="text"
              placeholder="Cari Nama Karyawan, NIK (EMP-...), Jabatan, atau Lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Departemen</option>
              <option value="Teknisi Lapangan">Teknisi Lapangan</option>
              <option value="Network Operation Center">NOC Engineer</option>
              <option value="Customer Support & Billing">CS & Billing</option>
              <option value="Finance & Akuntansi">Finance & Akuntansi</option>
            </select>

            {/* Employment Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Ikatan Kerja</option>
              <option value="permanent">Tetap (Permanent)</option>
              <option value="contract">Kontrak (PKWT)</option>
              <option value="intern">Magang / PKL</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non-Aktif</option>
              <option value="resigned">Resigned</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                Tabel
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'cards'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                Kartu ID
              </button>
            </div>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-[var(--app-muted)] font-mono">Memuat direktori SDM...</span>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="bg-[var(--app-card)] p-16 rounded-xl border border-[var(--app-border)] text-center">
            <Users className="w-12 h-12 text-[var(--app-muted)] stroke-[1.2] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[var(--app-text)]">Karyawan Tidak Ditemukan</h3>
            <p className="text-xs text-[var(--app-muted)] max-w-sm mx-auto mt-1">
              Coba sesuaikan kata kunci pencarian atau bersihkan filter departemen dan status.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface)] text-[11px] font-bold text-[var(--app-muted)] uppercase tracking-wider">
                    <th className="px-4 py-3.5">NIK & Karyawan</th>
                    <th className="px-4 py-3.5">Departemen & Posisi</th>
                    <th className="px-4 py-3.5">Kontak & Lokasi</th>
                    <th className="px-4 py-3.5">Gaji Pokok & Rekening</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-xs">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[var(--app-surface)]/60 transition-colors group">
                      {/* Name & NIK */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                            {emp.fullName.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--app-text)] flex items-center gap-1.5">
                              <span>{emp.fullName}</span>
                              {emp.nickname && <span className="font-normal text-[var(--app-muted)]">({emp.nickname})</span>}
                            </div>
                            <div className="text-[11px] font-mono text-[var(--app-muted)] mt-0.5">
                              {emp.employeeNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Position */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div>{getDepartmentBadge(emp.department)}</div>
                          <div className="text-[11px] text-[var(--app-muted)] font-medium">
                            {emp.position || 'Staff'} • <span className="capitalize">{emp.employmentType}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          {emp.phone ? (
                            <a
                              href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{emp.phone}</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-[var(--app-muted)]">-</span>
                          )}
                          <div className="text-[11px] text-[var(--app-muted)] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[160px]">{emp.workLocation || 'Kantor Pusat'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Payroll Info */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5 font-mono">
                          <div className="font-bold text-[var(--app-text)]">{formatRp(emp.baseSalary)}</div>
                          <div className="text-[10px] text-[var(--app-muted)]">
                            {emp.bankName || 'BCA'}: {emp.bankAccount || '-'}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">{getStatusBadge(emp.status)}</td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenIdCard(emp)}
                            className="p-1.5 text-[var(--app-muted)] hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Cetak ID Card Digital"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 text-[var(--app-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Data Karyawan"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(emp)}
                            className="p-1.5 text-[var(--app-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Hapus Karyawan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-[var(--app-card)] rounded-2xl border border-[var(--app-border)] p-5 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--app-border)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-extrabold text-sm uppercase shadow-md">
                        {emp.fullName.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--app-text)] text-sm">{emp.fullName}</h3>
                        <span className="text-xs font-mono text-[var(--app-muted)]">{emp.employeeNumber}</span>
                      </div>
                    </div>
                    {getStatusBadge(emp.status)}
                  </div>

                  <div className="py-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-muted)]">Departemen:</span>
                      <div>{getDepartmentBadge(emp.department)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-muted)]">Jabatan:</span>
                      <span className="font-semibold text-[var(--app-text)]">{emp.position || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-muted)]">Lokasi Kerja:</span>
                      <span className="text-[var(--app-text)]">{emp.workLocation || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--app-muted)]">Gaji Pokok:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRp(emp.baseSalary)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--app-border)] flex items-center justify-between gap-2">
                  {emp.phone ? (
                    <a
                      href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <span></span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenIdCard(emp)}
                      className="p-1.5 text-[var(--app-muted)] hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      title="Lihat ID Card Digital"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      className="p-1.5 text-[var(--app-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Edit Karyawan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp)}
                      className="p-1.5 text-[var(--app-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Hapus Karyawan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: TAMBAH / EDIT KARYAWAN (MULTI-TAB)                               */}
        {/* ========================================================================= */}
        {showAddEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-2xl w-full border border-[var(--app-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[var(--app-text)]">
                    {editingEmployee ? 'Edit Data Karyawan' : 'Pendaftaran Karyawan / Teknisi Baru'}
                  </h3>
                  <p className="text-xs text-[var(--app-muted)]">
                    Lengkapi berkas profil, status kepegawaian, nomor rekening, dan keahlian teknis.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex border-b border-[var(--app-border)] bg-[var(--app-surface)] px-6">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('personal')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeFormTab === 'personal'
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-[var(--app-muted)]'
                  }`}
                >
                  1. Profil Pribadi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('employment')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeFormTab === 'employment'
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-[var(--app-muted)]'
                  }`}
                >
                  2. Kepegawaian & Shift
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('payroll')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeFormTab === 'payroll'
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-[var(--app-muted)]'
                  }`}
                >
                  3. Rekening & Gaji
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('skills')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeFormTab === 'skills'
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-[var(--app-muted)]'
                  }`}
                >
                  4. Kualifikasi ISP
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveEmployee} className="p-6 space-y-4 overflow-y-auto">
                {activeFormTab === 'personal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[var(--app-text)]">NIK Karyawan *</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, employeeNumber: generateNIK() })}
                          className="text-[10px] text-cyan-500 hover:underline font-semibold"
                        >
                          Auto NIK
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.employeeNumber}
                        onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rian Hidayat, S.T."
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        placeholder="e.g. Rian"
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Jenis Kelamin</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      >
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">No. KTP (NIK Nasional)</label>
                      <input
                        type="text"
                        value={formData.identityNumber}
                        onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value })}
                        placeholder="16 digit NIK e-KTP"
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">No. WhatsApp Karyawan</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="081234567890"
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Alamat Tinggal</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Alamat domisili lengkap..."
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {activeFormTab === 'employment' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Departemen ISP</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Teknisi Lapangan">Teknisi Lapangan (Field Splicer & PSB)</option>
                        <option value="Network Operation Center">Network Operation Center (NOC)</option>
                        <option value="Customer Support & Billing">Customer Support & Billing</option>
                        <option value="Finance & Akuntansi">Finance & Akuntansi</option>
                        <option value="Sales & Marketing">Sales & Kemitraan Mitra</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Posisi / Jabatan</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="e.g. Lead Splicer, NOC Specialist"
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Ikatan Kerja</label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      >
                        <option value="permanent">Karyawan Tetap (PKWTT)</option>
                        <option value="contract">Karyawan Kontrak (PKWT)</option>
                        <option value="intern">Magang / PKL Siswa SMK</option>
                        <option value="freelance">Mitra Borongan PSB</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Status Keaktifan</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      >
                        <option value="active">Aktif Bekerja</option>
                        <option value="inactive">Non-Aktif / Cuti Panjang</option>
                        <option value="resigned">Resigned / Berhenti</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Tanggal Bergabung</label>
                      <input
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Lokasi Basecamp / Penugasan</label>
                      <input
                        type="text"
                        value={formData.workLocation}
                        onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                        placeholder="e.g. Basecamp Harapan Indah"
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {activeFormTab === 'payroll' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Gaji Pokok (Rp)</label>
                      <input
                        type="number"
                        value={formData.baseSalary}
                        onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Nama Bank Transfer</label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      >
                        <option value="BCA">BCA (Bank Central Asia)</option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BRI">Bank BRI</option>
                        <option value="BNI">Bank BNI</option>
                        <option value="BSI">Bank Syariah Indonesia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Nomor Rekening Bank</label>
                      <input
                        type="text"
                        value={formData.bankAccount}
                        onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                        placeholder="Nomor rekening transfer payroll"
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">Atas Nama Rekening</label>
                      <input
                        type="text"
                        value={formData.bankAccountName}
                        onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                        placeholder="Nama pemilik rekening sesuai buku tabungan"
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {activeFormTab === 'skills' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                        Catatan Kualifikasi / Sertifikasi Teknis
                      </label>
                      <textarea
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Contoh: Pemegang sertifikasi MTCNA, mahir sambung fusion splicer Tumtec, izin K3 ketinggian, driver SIM A aktif..."
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-3 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-600 dark:text-cyan-300 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <span>Teknisi dengan sertifikasi optik yang terdaftar akan otomatis diprioritaskan oleh sistem dispatcher tiket gangguan SPK.</span>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="pt-4 border-t border-[var(--app-border)] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-[var(--app-muted)] bg-[var(--app-surface)] rounded-xl border border-[var(--app-border)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>{editingEmployee ? 'Simpan Perubahan' : 'Daftarkan Personel'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: ID CARD DIGITAL SIAP CETAK                                       */}
        {/* ========================================================================= */}
        {showIdCardModal && idCardTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-sm w-full border border-[var(--app-border)] shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-base font-bold text-[var(--app-text)]">ID Card Digital Personel</h3>
                </div>
                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Vertical Badge */}
              <div
                id="id-card-print"
                className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 rounded-2xl border-2 border-cyan-500/50 shadow-xl space-y-4 text-center relative overflow-hidden"
              >
                {/* Lanyard Hole */}
                <div className="w-12 h-2.5 bg-slate-800 rounded-full mx-auto border border-slate-700"></div>

                {/* Company Banner */}
                <div>
                  <div className="text-xs font-black tracking-widest text-cyan-400">AUDIRA NETWORKS</div>
                  <div className="text-[9px] tracking-wider text-slate-400 uppercase">OFFICIAL IDENTITY CARD</div>
                </div>

                {/* Photo / Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 mx-auto shadow-lg">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-black text-cyan-400">
                    {idCardTarget.fullName.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Person Info */}
                <div>
                  <h4 className="font-extrabold text-sm text-white">{idCardTarget.fullName}</h4>
                  <div className="text-[11px] font-mono text-cyan-400 font-bold">{idCardTarget.employeeNumber}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{idCardTarget.position || 'Staff Operasional'}</div>
                  <div className="text-[10px] text-slate-400">{idCardTarget.department}</div>
                </div>

                {/* QR Code */}
                <div className="bg-white dark:bg-slate-100 p-2.5 rounded-xl w-fit mx-auto shadow-md">
                  <QRCodeSVG
                    value={`https://audira.my.id/verify-staff?nik=${idCardTarget.employeeNumber}&id=${idCardTarget.id}`}
                    size={110}
                    level="H"
                  />
                </div>

                {/* Footer Tag */}
                <div className="border-t border-slate-800 pt-2 text-[8px] text-slate-400">
                  PT AUDIRA MULTIMEDIA DIGITAL • HOTLINE: +62 821-1200-1600
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak ID Card</span>
                </button>
                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[var(--app-muted)] bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl hover:text-[var(--app-text)]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
