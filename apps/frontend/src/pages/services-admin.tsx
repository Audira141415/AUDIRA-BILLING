import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';
import {
  Wifi,
  Globe,
  Plus,
  Edit,
  Trash2,
  Search,
  UserCheck,
  UserX,
  PauseCircle,
  Server,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  type: string;
  username: string;
  status: string;
  description: string | null;
  customerId: string;
  packageId: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  package: {
    id: string;
    name: string;
    price: number;
    speed: string;
  } | null;
  createdAt: string;
}

interface Statistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  pppoeCount: number;
  hotspotCount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  speed: string;
}

interface ServiceFormData {
  name: string;
  type: string;
  username: string;
  password: string;
  description: string;
  customerId: string;
  packageId: string;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function ServiceManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    type: 'pppoe',
    username: '',
    password: '',
    description: '',
    customerId: '',
    packageId: '',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
    fetchServices();
    fetchCustomers();
    fetchPackages();
  }, [page, limit, search, typeFilter, statusFilter, customerFilter, packageFilter, sortBy, sortOrder]);

  const getAuthHeaders = () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('adminToken')
        : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/statistics/overview`, {
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

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) params.append('search', search);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (customerFilter !== 'all') params.append('customerId', customerFilter);
      if (packageFilter !== 'all') params.append('packageId', packageFilter);

      const response = await fetch(`${API_BASE_URL}/services?${params}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.data || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/customers?limit=1000`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(Array.isArray(data) ? data : data.data || []);
        return;
      }
    } catch {
      // Fallback below
    }
    try {
      const fallbackList = await api.pelanggan.getAll();
      if (Array.isArray(fallbackList)) {
        setCustomers(
          fallbackList.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email || c.phone || '-',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching fallback customers:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages?limit=1000&status=active`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setPackages(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      type: 'pppoe',
      username: '',
      password: '',
      description: '',
      customerId: '',
      packageId: '',
      status: 'active',
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      type: service.type,
      username: service.username,
      password: '',
      description: service.description || '',
      customerId: service.customerId,
      packageId: service.packageId || '',
      status: service.status,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (service: Service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Nama layanan wajib diisi';
    if (!formData.username.trim()) errors.username = 'Username wajib diisi';
    if (!showEditModal && !formData.password.trim()) errors.password = 'Password wajib diisi';
    if (!formData.customerId) errors.customerId = 'Pelanggan wajib dipilih';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Layanan PPPoE/Hotspot baru berhasil dibuat!');
        setShowCreateModal(false);
        fetchServices();
        fetchStatistics();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.message || 'Gagal membuat layanan baru');
      }
    } catch {
      toast.error('Gagal menghubungi server layanan');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedService) return;

    setFormLoading(true);
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete (updateData as any).password;
      }

      const response = await fetch(`${API_BASE_URL}/services/${selectedService.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success(`Layanan ${selectedService.name} berhasil diperbarui!`);
        setShowEditModal(false);
        fetchServices();
        fetchStatistics();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.message || 'Gagal memperbarui layanan');
      }
    } catch {
      toast.error('Gagal memperbarui layanan');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    setFormLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/services/${selectedService.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success(`Layanan ${selectedService.name} berhasil dinonaktifkan.`);
        setShowDeleteModal(false);
        fetchServices();
        fetchStatistics();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.message || 'Gagal menghapus layanan');
      }
    } catch {
      toast.error('Gagal menghapus layanan');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'inactive':
        return 'bg-slate-500/10 text-[var(--app-text-muted)] border border-[var(--app-border)]';
      case 'suspended':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-[var(--app-text-muted)] border border-[var(--app-border)]';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'pppoe':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'hotspot':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-[var(--app-text-muted)]';
    }
  };

  const getTypeIcon = (type: string) =>
    type === 'pppoe' ? <Wifi className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[var(--app-text)]">
              Manajemen Layanan PPPoE &amp; Hotspot
            </h1>
            <p className="text-xs text-[var(--app-text-muted)] mt-1">
              Kelola kredensial autentikasi FreeRADIUS, profil paket, dan status koneksi pelanggan.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Layanan</span>
          </button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[var(--app-card)] rounded-xl p-4 border border-[var(--app-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--app-text-muted)] text-xs font-semibold">Total Layanan</p>
                  <p className="text-2xl font-bold font-mono text-[var(--app-text)] mt-1">
                    {statistics.total}
                  </p>
                </div>
                <Server className="w-8 h-8 text-blue-500 opacity-40" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-xl p-4 border border-[var(--app-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--app-text-muted)] text-xs font-semibold">Aktif</p>
                  <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">
                    {statistics.active}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-emerald-500 opacity-40" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-xl p-4 border border-[var(--app-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--app-text-muted)] text-xs font-semibold">Non-Aktif</p>
                  <p className="text-2xl font-bold font-mono text-[var(--app-text-muted)] mt-1">
                    {statistics.inactive}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-slate-400 opacity-40" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-xl p-4 border border-[var(--app-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--app-text-muted)] text-xs font-semibold">Suspended</p>
                  <p className="text-2xl font-bold font-mono text-amber-500 mt-1">
                    {statistics.suspended}
                  </p>
                </div>
                <PauseCircle className="w-8 h-8 text-amber-500 opacity-40" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-xl p-4 border border-[var(--app-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--app-text-muted)] text-xs font-semibold">PPPoE</p>
                  <p className="text-2xl font-bold font-mono text-blue-500 mt-1">
                    {statistics.pppoeCount}
                  </p>
                </div>
                <Wifi className="w-8 h-8 text-blue-500 opacity-40" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-xl p-4 border border-[var(--app-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--app-text-muted)] text-xs font-semibold">Hotspot</p>
                  <p className="text-2xl font-bold font-mono text-purple-500 mt-1">
                    {statistics.hotspotCount}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-purple-500 opacity-40" />
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1.5">
                Cari Layanan
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-text-muted)] w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari nama layanan, username PPPoE..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1.5">
                Tipe
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Semua Tipe</option>
                <option value="pppoe">PPPoE</option>
                <option value="hotspot">Hotspot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1.5">
                Pelanggan
              </label>
              <select
                value={customerFilter}
                onChange={(e) => {
                  setCustomerFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Semua Pelanggan</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1.5">
                Paket
              </label>
              <select
                value={packageFilter}
                onChange={(e) => {
                  setPackageFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Semua Paket</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.speed})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--app-bg)] border-b border-[var(--app-border)]">
                <tr>
                  <th
                    className="px-5 py-3.5 text-left text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Nama Layanan {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-5 py-3.5 text-left text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    Tipe {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-5 py-3.5 text-left text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Dibuat {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-5 py-3.5 text-right text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-[var(--app-text-muted)]">
                      Memuat daftar layanan...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-[var(--app-text-muted)]">
                      Belum ada layanan PPPoE/Hotspot yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-[var(--app-surface-2)] transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-[var(--app-text)]">{service.name}</div>
                        {service.description && (
                          <div className="text-[11px] text-[var(--app-text-muted)]">
                            {service.description.substring(0, 50)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${getTypeBadgeClass(
                            service.type
                          )}`}
                        >
                          {getTypeIcon(service.type)}
                          {service.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-mono text-[var(--app-text)]">{service.username}</div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-[var(--app-text)]">
                          {service.customer?.name || '-'}
                        </div>
                        <div className="text-[11px] text-[var(--app-text-muted)]">
                          {service.customer?.email || ''}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {service.package ? (
                          <div>
                            <div className="font-semibold text-[var(--app-text)]">
                              {service.package.name}
                            </div>
                            <div className="text-[11px] font-mono text-[var(--app-text-muted)]">
                              {service.package.speed}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[var(--app-text-muted)]">Tanpa paket</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(
                            service.status
                          )}`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[var(--app-text-muted)]">
                        {formatDate(service.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(service)}
                            className="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(service)}
                            className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && services.length > 0 && (
            <div className="bg-[var(--app-bg)] px-5 py-3.5 border-t border-[var(--app-border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[var(--app-text-muted)]">
                  Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, total)} dari {total}
                </span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2.5 py-1 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)]"
                >
                  <option value={10}>10 / halaman</option>
                  <option value={25}>25 / halaman</option>
                  <option value={50}>50 / halaman</option>
                </select>
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-[var(--app-border)] rounded-lg text-[var(--app-text)] disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-[var(--app-border)] rounded-lg text-[var(--app-text)] disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-[var(--app-border)]">
                <h2 className="text-lg font-bold text-[var(--app-text)]">Tambah Layanan Baru</h2>
              </div>

              <form onSubmit={handleCreateService} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Nama Layanan *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                      placeholder="Mis. FTTH Home - Budi Santoso"
                    />
                    {formErrors.name && <p className="mt-1 text-rose-500">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Tipe *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="pppoe">PPPoE</option>
                      <option value="hotspot">Hotspot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 font-mono bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-rose-500">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-rose-500">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Pelanggan *
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="">Pilih Pelanggan</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </option>
                      ))}
                    </select>
                    {formErrors.customerId && (
                      <p className="mt-1 text-rose-500">{formErrors.customerId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Paket Internet
                    </label>
                    <select
                      value={formData.packageId}
                      onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="">Tanpa Paket</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.speed}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                    Catatan / Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                    {formLoading ? 'Menyimpan...' : 'Simpan Layanan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedService && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-[var(--app-border)]">
                <h2 className="text-lg font-bold text-[var(--app-text)]">Edit Layanan</h2>
              </div>

              <form onSubmit={handleUpdateService} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Nama Layanan *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--app-text-muted)] mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-[var(--app-border)] rounded-lg text-[var(--app-text)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                    {formLoading ? 'Memperbarui...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedService && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <h2 className="text-base font-bold text-[var(--app-text)]">Nonaktifkan Layanan?</h2>
              <p className="text-xs text-[var(--app-text-muted)]">
                Apakah Anda yakin ingin menonaktifkan layanan{' '}
                <strong className="text-[var(--app-text)]">{selectedService.name}</strong>?
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={formLoading}
                  className="px-4 py-2 border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteService}
                  disabled={formLoading}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {formLoading ? 'Memproses...' : 'Ya, Nonaktifkan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
