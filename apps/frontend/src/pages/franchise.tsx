import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Settings,
  Eye,
  Award,
  Network,
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  contactEmail: string;
  contactPhone: string;
  commissionRate: number;
  parentTenant?: {
    name: string;
  };
  _count?: {
    customers: number;
    childTenants: number;
  };
}

export default function FranchiseManagement() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  const getHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('adminToken')) : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const loadTenants = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const response = await fetch(`${baseUrl}/tenant`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setTenants(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading tenants:', error);
    }
  };

  const loadTenantStats = async (tenantId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const response = await fetch(`${baseUrl}/tenant/${tenantId}/statistics`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    loadTenantStats(tenant.id);
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Franchise Management</h1>
            <p className="text-[var(--app-muted)] mt-1">Kelola multi-tenant & franchise</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHierarchy(!showHierarchy)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
            >
              <Network className="w-5 h-5" />
              {showHierarchy ? 'List View' : 'Hierarchy View'}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Tambah Franchise
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tenant List */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--app-card)] rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold text-[var(--app-text)]">Daftar Franchise</h2>
              </div>
              
              <div className="divide-y">
                {tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className={`p-6 cursor-pointer transition ${
                      selectedTenant?.id === tenant.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-[var(--app-bg)]'
                    }`}
                    onClick={() => handleSelectTenant(tenant)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--app-text)]">{tenant.name}</h3>
                          <p className="text-sm text-[var(--app-muted)]">/{tenant.slug}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--app-muted)]">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {tenant._count?.customers || 0} pelanggan
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {tenant._count?.childTenants || 0} sub-franchise
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {tenant.commissionRate}% komisi
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            tenant.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </div>
                    </div>

                    {tenant.parentTenant && (
                      <div className="mt-3 text-sm text-[var(--app-muted)]">
                        Parent: {tenant.parentTenant.name}
                      </div>
                    )}
                  </div>
                ))}

                {tenants.length === 0 && (
                  <div className="p-12 text-center text-[var(--app-muted)]">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-[var(--app-muted)]" />
                    <p>Belum ada franchise</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tenant Details */}
          <div>
            {selectedTenant ? (
              <div className="space-y-4">
                {/* Info Card */}
                <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[var(--app-text)]">Detail Franchise</h2>
                    <div className="flex gap-2">
                      <button onClick={() => alert("Mengubah data mitra franchise...")} className="p-2 text-[var(--app-muted)] hover:text-[var(--app-text)]">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => alert("Pengaturan konfigurasi franchise...")} className="p-2 text-[var(--app-muted)] hover:text-[var(--app-text)]">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-[var(--app-muted)]">Nama</label>
                      <p className="font-medium text-[var(--app-text)]">{selectedTenant.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-[var(--app-muted)]">Slug</label>
                      <p className="font-medium text-[var(--app-text)]">/{selectedTenant.slug}</p>
                    </div>
                    <div>
                      <label className="text-sm text-[var(--app-muted)]">Email</label>
                      <p className="font-medium text-[var(--app-text)]">{selectedTenant.contactEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm text-[var(--app-muted)]">Telepon</label>
                      <p className="font-medium text-[var(--app-text)]">{selectedTenant.contactPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-[var(--app-muted)]">Tipe</label>
                      <p className="font-medium text-[var(--app-text)] capitalize">{selectedTenant.type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-[var(--app-muted)]">Komisi Rate</label>
                      <p className="font-medium text-[var(--app-text)]">{selectedTenant.commissionRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                {stats && (
                  <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
                    <h3 className="font-semibold text-[var(--app-text)] mb-4">Statistik</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600">Total Pelanggan</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalCustomers}</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600">Aktif</p>
                        <p className="text-2xl font-bold text-green-900">{stats.activeCustomers}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg col-span-2">
                        <p className="text-sm text-purple-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-purple-900">
                          Rp {stats.totalRevenue.toLocaleString('id-ID')}
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-600">Komisi Pending</p>
                        <p className="text-xl font-bold text-yellow-900">
                          Rp {stats.pendingCommissions.toLocaleString('id-ID')}
                        </p>
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm text-orange-600">Komisi Paid</p>
                        <p className="text-xl font-bold text-orange-900">
                          Rp {stats.paidCommissions.toLocaleString('id-ID')}
                        </p>
                      </div>

                      {stats.childTenants > 0 && (
                        <div className="bg-indigo-50 p-3 rounded-lg col-span-2">
                          <p className="text-sm text-indigo-600">Sub-Franchise</p>
                          <p className="text-2xl font-bold text-indigo-900">{stats.childTenants}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
                  <h3 className="font-semibold text-[var(--app-text)] mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button onClick={() => router.push('/pelanggan')} className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-left hover:bg-blue-100">
                      <Eye className="w-4 h-4 inline mr-2" />
                      Lihat Pelanggan
                    </button>
                    <button onClick={() => router.push('/finance/pendapatan')} className="w-full bg-green-50 text-green-700 px-4 py-2 rounded-lg text-left hover:bg-green-100">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Lihat Komisi
                    </button>
                    <button onClick={() => router.push('/pengaturan')} className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-left hover:bg-purple-100">
                      <Users className="w-4 h-4 inline mr-2" />
                      Kelola User
                    </button>
                    <button onClick={() => router.push('/pengaturan')} className="w-full bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-left hover:bg-orange-100">
                      <Settings className="w-4 h-4 inline mr-2" />
                      White-Label Settings
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--app-card)] rounded-lg shadow p-12 text-center text-[var(--app-muted)]">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-[var(--app-muted)]" />
                <p>Pilih franchise untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Tenant Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--app-card)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[var(--app-card)] border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Tambah Franchise Baru</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[var(--app-muted)] hover:text-[var(--app-text)]/90"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Nama Franchise
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="PT ABC Network"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="abc-network"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Tipe
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="franchise">Franchise</option>
                      <option value="branch">Branch</option>
                      <option value="independent">Independent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="contact@abc.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Telepon
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="08123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Komisi Rate (%)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="10"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Parent Franchise (Optional)
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="">Tidak ada (Root)</option>
                      {tenants.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-1">
                      Alamat
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="Alamat lengkap..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-[var(--app-text)]/90 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button onClick={() => { alert('Mitra franchise baru berhasil disimpan!'); setShowAddModal(false); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Simpan
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
