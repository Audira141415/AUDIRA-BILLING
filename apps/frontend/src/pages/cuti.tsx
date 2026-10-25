import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { Calendar, Plus, Search, Filter, CheckCircle, XCircle, Clock, FileText, X, Save } from 'lucide-react';

export default function Cuti() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    employeeId: '',
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadLeaves();
    loadStats();
    loadEmployees();
  }, [router]);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await api.leave.getAll();
      setLeaves(data);
    } catch (error) {
      console.error('Failed to load leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.leave.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await api.employee.getAll('active');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const handleCreate = () => {
    setFormData({
      employeeId: '',
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending',
    });
    setSelectedLeave(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedLeave) {
        await api.leave.update(selectedLeave.id, formData);
        alert('Pengajuan cuti berhasil diupdate');
      } else {
        await api.leave.create(formData);
        alert('Pengajuan cuti berhasil dibuat');
      }
      setShowModal(false);
      loadLeaves();
      loadStats();
    } catch (error) {
      console.error('Failed to save leave:', error);
      alert('Gagal menyimpan pengajuan cuti');
    }
  };

  const handleApprove = async (id: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      await api.leave.approve(id, { approvedBy: user.id });
      alert('Cuti disetujui');
      loadLeaves();
      loadStats();
    } catch (error) {
      console.error('Failed to approve leave:', error);
      alert('Gagal menyetujui cuti');
    }
  };

  const handleReject = async (id: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const reason = prompt('Alasan penolakan:');
    if (!reason) return;
    try {
      await api.leave.reject(id, { approvedBy: user.id, reason });
      alert('Cuti ditolak');
      loadLeaves();
      loadStats();
    } catch (error) {
      console.error('Failed to reject leave:', error);
      alert('Gagal menolak cuti');
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchSearch = leave.employee?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-[var(--app-text)]';
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    const types: any = {
      annual: 'Tahunan',
      sick: 'Sakit',
      unpaid: 'Tanpa Gaji',
      maternity: 'Melahirkan',
      paternity: 'Ayah',
      emergency: 'Darurat',
    };
    return types[type] || type;
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-2">
            <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
            <span>/</span>
            <Link href="/hrm-dashboard" className="hover:text-[var(--app-text)]">Human Resource Management</Link>
            <span>/</span>
            <span className="text-blue-500 font-semibold">Permohonan Cuti</span>
          </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--app-text)] flex items-center gap-3">
              <Calendar className="text-blue-600" size={36} />
              Pengajuan Cuti
            </h1>
            <p className="text-[var(--app-muted)] mt-1">Kelola pengajuan cuti karyawan</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
          >
            <Plus size={20} />
            Ajukan Cuti
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm">Total Pengajuan</p>
              <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-yellow-100 text-sm">Pending</p>
              <h3 className="text-3xl font-bold mt-2">{stats.pending}</h3>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm">Disetujui</p>
              <h3 className="text-3xl font-bold mt-2">{stats.approved}</h3>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-red-100 text-sm">Ditolak</p>
              <h3 className="text-3xl font-bold mt-2">{stats.rejected}</h3>
            </div>
          </div>
        )}

        <div className="bg-[var(--app-card)] rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-[var(--app-muted)]" size={20} />
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="bg-[var(--app-card)] rounded-xl shadow-lg p-12 text-center">Loading...</div>
          ) : filteredLeaves.length === 0 ? (
            <div className="bg-[var(--app-card)] rounded-xl shadow-lg p-12 text-center">Tidak ada pengajuan cuti</div>
          ) : (
            filteredLeaves.map((leave) => (
              <div key={leave.id} className="bg-[var(--app-card)] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[var(--app-text)] font-bold text-xl">
                      {leave.employee?.fullName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[var(--app-text)]">{leave.employee?.fullName}</h3>
                      <p className="text-sm text-[var(--app-muted)]">{leave.employee?.department} - {leave.employee?.position}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                          {leave.status === 'pending' ? 'Pending' : leave.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </span>
                        <span className="text-sm text-[var(--app-muted)]">{getLeaveTypeLabel(leave.leaveType)}</span>
                        <span className="text-sm text-[var(--app-muted)]">{leave.totalDays} hari</span>
                      </div>
                    </div>
                  </div>
                  {leave.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(leave.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle size={16} />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(leave.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle size={16} />
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--app-border)]">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--app-muted)]">Tanggal Mulai</p>
                      <p className="font-medium">{new Date(leave.startDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-[var(--app-muted)]">Tanggal Selesai</p>
                      <p className="font-medium">{new Date(leave.endDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[var(--app-muted)]">Alasan</p>
                      <p className="font-medium">{leave.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-[var(--app-text)]">Ajukan Cuti</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-blue-700 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Karyawan *</label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Karyawan</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Tipe Cuti *</label>
                    <select
                      required
                      value={formData.leaveType}
                      onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="annual">Cuti Tahunan</option>
                      <option value="sick">Sakit</option>
                      <option value="unpaid">Tanpa Gaji</option>
                      <option value="maternity">Melahirkan</option>
                      <option value="paternity">Ayah</option>
                      <option value="emergency">Darurat</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Tanggal Mulai *</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Tanggal Selesai *</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Alasan *</label>
                    <textarea
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-[var(--app-bg)]">
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save size={18} />
                    Ajukan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
