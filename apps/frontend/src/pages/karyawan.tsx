import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { 
  Users, Plus, Search, Filter, Edit2, Trash2, Eye, 
  Phone, Mail, Calendar, Briefcase, MapPin, X, Save 
} from 'lucide-react';

export default function Karyawan() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    userId: '',
    employeeNumber: '',
    fullName: '',
    nickname: '',
    birthDate: '',
    birthPlace: '',
    gender: 'male',
    religion: '',
    maritalStatus: 'single',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    department: '',
    position: '',
    employmentType: 'permanent',
    joinDate: '',
    baseSalary: 0,
    status: 'active',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadEmployees();
    loadStats();
  }, [router]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.employee.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.employee.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCreate = () => {
    setFormData({
      userId: '',
      employeeNumber: `EMP${Date.now()}`,
      fullName: '',
      nickname: '',
      birthDate: '',
      birthPlace: '',
      gender: 'male',
      religion: '',
      maritalStatus: 'single',
      phone: '',
      email: '',
      address: '',
      city: '',
      province: '',
      department: '',
      position: '',
      employmentType: 'permanent',
      joinDate: new Date().toISOString().split('T')[0],
      baseSalary: 0,
      status: 'active',
    });
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setFormData({
      ...employee,
      birthDate: employee.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : '',
      joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleViewDetail = async (employee: any) => {
    try {
      const profile = await api.employee.getProfile(employee.id);
      setSelectedEmployee(profile);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Failed to load employee profile:', error);
      alert('Gagal memuat profil karyawan');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        await api.employee.update(selectedEmployee.id, formData);
        alert('Data karyawan berhasil diupdate');
      } else {
        await api.employee.create(formData);
        alert('Karyawan baru berhasil ditambahkan');
      }
      setShowModal(false);
      loadEmployees();
      loadStats();
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Gagal menyimpan data karyawan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) return;
    
    try {
      await api.employee.delete(id);
      alert('Karyawan berhasil dihapus');
      loadEmployees();
      loadStats();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      alert('Gagal menghapus karyawan');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-[var(--app-text)]';
      case 'resigned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-[var(--app-text)]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      case 'resigned': return 'Resign';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-2">
            <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
            <span>/</span>
            <Link href="/hrm-dashboard" className="hover:text-[var(--app-text)]">Human Resource Management</Link>
            <span>/</span>
            <span className="text-blue-500 font-semibold">Direktori Karyawan</span>
          </div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--app-text)] flex items-center gap-3">
              <Users className="text-blue-600" size={36} />
              Data Karyawan
            </h1>
            <p className="text-[var(--app-muted)] mt-1">Kelola data karyawan perusahaan</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus size={20} />
            Tambah Karyawan
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Karyawan</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
                </div>
                <Users size={40} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Aktif</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.active}</h3>
                </div>
                <Users size={40} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 text-sm">Tidak Aktif</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.inactive}</h3>
                </div>
                <Users size={40} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Resign</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.resigned}</h3>
                </div>
                <Users size={40} className="opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[var(--app-card)] rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-[var(--app-muted)]" size={20} />
              <input
                type="text"
                placeholder="Cari nama, NIK, atau departemen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-[var(--app-muted)]" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="resigned">Resign</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-[var(--app-card)] rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--app-bg)] border-b border-[var(--app-border)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider">
                    NIK
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider">
                    Departemen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider">
                    Posisi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--app-muted)]">
                      Loading...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--app-muted)]">
                      Tidak ada data karyawan
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-[var(--app-bg)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--app-text)]">
                        {employee.employeeNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[var(--app-text)] font-semibold">
                              {employee.fullName?.charAt(0) || '?'}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[var(--app-text)]">{employee.fullName}</div>
                            <div className="text-sm text-[var(--app-muted)]">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-text)]">
                        {employee.department || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-text)]">
                        {employee.position || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {getStatusLabel(employee.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-muted)]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            {employee.phone || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(employee)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[var(--app-card)] border-b border-[var(--app-border)] px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--app-text)]">
                  {selectedEmployee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[var(--app-muted)] hover:text-[var(--app-muted)] p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold text-[var(--app-text)] mb-4">Informasi Pribadi</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      NIK Karyawan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employeeNumber}
                      onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Jenis Kelamin
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Status Pernikahan
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="single">Belum Menikah</option>
                      <option value="married">Menikah</option>
                      <option value="divorced">Cerai</option>
                      <option value="widowed">Janda/Duda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Telepon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Alamat
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Employment Info */}
                  <div className="col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-[var(--app-text)] mb-4">Informasi Kepegawaian</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Departemen *
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih Departemen</option>
                      <option value="NOC">NOC</option>
                      <option value="CS">Customer Service</option>
                      <option value="Billing">Billing</option>
                      <option value="Technician">Teknisi</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">Human Resource</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Posisi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Tipe Kepegawaian
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="permanent">Tetap</option>
                      <option value="contract">Kontrak</option>
                      <option value="freelance">Freelance</option>
                      <option value="intern">Magang</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Tanggal Bergabung *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Gaji Pokok
                    </label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                      <option value="resigned">Resign</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-[var(--app-text)]/90 hover:bg-[var(--app-bg)] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={18} />
                    {selectedEmployee ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--app-text)]">
                  Profil Karyawan
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Employee Header */}
                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-[var(--app-border)]">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    {selectedEmployee.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--app-text)]">{selectedEmployee.fullName}</h3>
                    <p className="text-lg text-[var(--app-muted)] mt-1">{selectedEmployee.position}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                        {getStatusLabel(selectedEmployee.status)}
                      </span>
                      <span className="text-sm text-[var(--app-muted)]">NIK: {selectedEmployee.employeeNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--app-muted)] uppercase mb-4">Informasi Pribadi</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-[var(--app-muted)]" size={18} />
                        <div>
                          <p className="text-xs text-[var(--app-muted)]">Tanggal Lahir</p>
                          <p className="text-sm font-medium text-[var(--app-text)]">
                            {selectedEmployee.birthDate ? new Date(selectedEmployee.birthDate).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="text-[var(--app-muted)]" size={18} />
                        <div>
                          <p className="text-xs text-[var(--app-muted)]">Telepon</p>
                          <p className="text-sm font-medium text-[var(--app-text)]">{selectedEmployee.phone || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="text-[var(--app-muted)]" size={18} />
                        <div>
                          <p className="text-xs text-[var(--app-muted)]">Email</p>
                          <p className="text-sm font-medium text-[var(--app-text)]">{selectedEmployee.email || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="text-[var(--app-muted)]" size={18} />
                        <div>
                          <p className="text-xs text-[var(--app-muted)]">Alamat</p>
                          <p className="text-sm font-medium text-[var(--app-text)]">{selectedEmployee.address || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[var(--app-muted)] uppercase mb-4">Informasi Kepegawaian</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-[var(--app-muted)]" size={18} />
                        <div>
                          <p className="text-xs text-[var(--app-muted)]">Departemen</p>
                          <p className="text-sm font-medium text-[var(--app-text)]">{selectedEmployee.department || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-[var(--app-muted)]" size={18} />
                        <div>
                          <p className="text-xs text-[var(--app-muted)]">Tipe Kepegawaian</p>
                          <p className="text-sm font-medium text-[var(--app-text)]">{selectedEmployee.employmentType || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-[var(--app-muted)]" size={18} />
                        <div>
                          <p className="text-xs text-[var(--app-muted)]">Tanggal Bergabung</p>
                          <p className="text-sm font-medium text-[var(--app-text)]">
                            {selectedEmployee.joinDate ? new Date(selectedEmployee.joinDate).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedEmployee);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={18} />
                    Edit Data
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
