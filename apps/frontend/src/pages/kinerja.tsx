import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { TrendingUp, Users, Search, BarChart3, Award, Target, Plus, X, Save, Edit2, Trash2 } from 'lucide-react';

export default function Kinerja() {
  const router = useRouter();
  const [performances, setPerformances] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7),
    reviewType: 'monthly',
    productivity: 75,
    quality: 75,
    attendance: 75,
    discipline: 75,
    teamwork: 75,
    initiative: 75,
    achievements: '',
    improvements: '',
    goals: '',
    status: 'draft',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadPerformances();
    loadStats();
    loadEmployees();
  }, [router]);

  const loadPerformances = async () => {
    try {
      setLoading(true);
      const data = await api.performance.getAll();
      setPerformances(data);
    } catch (error) {
      console.error('Failed to load performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.performance.getStats();
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

  const filteredPerformances = performances.filter(perf => {
    const matchSearch = perf.employee?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmployee = !selectedEmployee || perf.employeeId === selectedEmployee;
    return matchSearch && matchEmployee;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const handleCreate = () => {
    setEditingPerformance(null);
    setFormData({
      employeeId: '',
      period: new Date().toISOString().slice(0, 7),
      reviewType: 'monthly',
      productivity: 75,
      quality: 75,
      attendance: 75,
      discipline: 75,
      teamwork: 75,
      initiative: 75,
      achievements: '',
      improvements: '',
      goals: '',
      status: 'draft',
    });
    setShowModal(true);
  };

  const handleEdit = (perf: any) => {
    setEditingPerformance(perf);
    setFormData({
      employeeId: perf.employeeId,
      period: perf.period,
      reviewType: perf.reviewType,
      productivity: perf.productivity,
      quality: perf.quality,
      attendance: perf.attendance,
      discipline: perf.discipline,
      teamwork: perf.teamwork,
      initiative: perf.initiative,
      achievements: perf.achievements || '',
      improvements: perf.improvements || '',
      goals: perf.goals || '',
      status: perf.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const overallScore = Math.floor(
        (formData.productivity + formData.quality + formData.attendance + 
         formData.discipline + formData.teamwork + formData.initiative) / 6
      );
      
      const dataToSubmit = { ...formData, overallScore };
      
      if (editingPerformance) {
        await api.performance.update(editingPerformance.id, dataToSubmit);
        alert('Performance review berhasil diupdate');
      } else {
        await api.performance.create(dataToSubmit);
        alert('Performance review berhasil dibuat');
      }
      
      setShowModal(false);
      loadPerformances();
      loadStats();
    } catch (error) {
      console.error('Failed to save performance:', error);
      alert('Gagal menyimpan performance review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus performance review ini?')) return;
    try {
      await api.performance.delete(id);
      alert('Performance review berhasil dihapus');
      loadPerformances();
      loadStats();
    } catch (error) {
      console.error('Failed to delete performance:', error);
      alert('Gagal menghapus performance review');
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve performance review ini?')) return;
    try {
      await api.performance.approve(id, { reviewedBy: 'admin' });
      alert('Performance review berhasil diapprove');
      loadPerformances();
    } catch (error) {
      console.error('Failed to approve performance:', error);
      alert('Gagal approve performance review');
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
            <span className="text-blue-500 font-semibold">Evaluasi Kinerja (KPI)</span>
          </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--app-text)] flex items-center gap-3">
              <TrendingUp className="text-orange-600" size={36} />
              Dashboard Kinerja
            </h1>
            <p className="text-[var(--app-muted)] mt-1">Monitor performa karyawan</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 shadow-lg"
          >
            <Plus size={20} />
            Buat Review
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm">Total Review</p>
              <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Rata-rata Skor</p>
                  <h3 className="text-3xl font-bold mt-2">{Math.round(stats.averageScores?.overall || 0)}</h3>
                </div>
                <Award size={40} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm">Produktivitas</p>
              <h3 className="text-3xl font-bold mt-2">{Math.round(stats.averageScores?.productivity || 0)}</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm">Kualitas</p>
              <h3 className="text-3xl font-bold mt-2">{Math.round(stats.averageScores?.quality || 0)}</h3>
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Semua Karyawan</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="bg-[var(--app-card)] rounded-xl shadow-lg p-12 text-center">Loading...</div>
          ) : filteredPerformances.length === 0 ? (
            <div className="bg-[var(--app-card)] rounded-xl shadow-lg p-12 text-center">
              <BarChart3 size={48} className="mx-auto text-[var(--app-muted)] mb-4" />
              <p className="text-[var(--app-muted)]">Belum ada data kinerja</p>
            </div>
          ) : (
            filteredPerformances.map((perf) => (
              <div key={perf.id} className="bg-[var(--app-card)] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[var(--app-text)] font-bold text-2xl">
                      {perf.employee?.fullName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--app-text)]">{perf.employee?.fullName}</h3>
                      <p className="text-sm text-[var(--app-muted)]">{perf.employee?.department} - {perf.employee?.position}</p>
                      <p className="text-sm text-[var(--app-muted)] mt-1">Periode: {perf.period}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-right">
                      <p className="text-sm text-[var(--app-muted)]">Overall Score</p>
                      <p className={`text-4xl font-bold ${getScoreColor(perf.overallScore || 0)}`}>
                        {perf.overallScore || 0}
                      </p>
                      <p className={`text-sm font-medium ${getScoreColor(perf.overallScore || 0)}`}>
                        {getScoreLabel(perf.overallScore || 0)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {perf.status === 'draft' && (
                        <button
                          onClick={() => handleEdit(perf)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {perf.status === 'draft' && (
                        <button
                          onClick={() => handleApprove(perf.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Approve"
                        >
                          <Award size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(perf.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Produktivitas', value: perf.productivity, icon: Target },
                    { label: 'Kualitas', value: perf.quality, icon: Award },
                    { label: 'Kehadiran', value: perf.attendance, icon: Users },
                    { label: 'Disiplin', value: perf.discipline, icon: Target },
                    { label: 'Teamwork', value: perf.teamwork, icon: Users },
                    { label: 'Inisiatif', value: perf.initiative, icon: TrendingUp },
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-[var(--app-bg)] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon size={16} className="text-[var(--app-muted)]" />
                        <p className="text-xs text-[var(--app-muted)] font-medium">{metric.label}</p>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(metric.value || 0)}`}>
                        {metric.value || 0}
                      </p>
                    </div>
                  ))}
                </div>

                {(perf.achievements || perf.improvements) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[var(--app-border)]">
                    {perf.achievements && (
                      <div>
                        <p className="text-sm font-semibold text-[var(--app-text)]/90 mb-2">Pencapaian:</p>
                        <p className="text-sm text-[var(--app-muted)]">{perf.achievements}</p>
                      </div>
                    )}
                    {perf.improvements && (
                      <div>
                        <p className="text-sm font-semibold text-[var(--app-text)]/90 mb-2">Area Perbaikan:</p>
                        <p className="text-sm text-[var(--app-muted)]">{perf.improvements}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-orange-600 px-6 py-4 flex justify-between items-center rounded-t-xl sticky top-0">
                <h2 className="text-2xl font-bold text-[var(--app-text)]">
                  {editingPerformance ? 'Edit' : 'Buat'} Performance Review
                </h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-orange-700 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Karyawan *</label>
                      <select
                        required
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        disabled={!!editingPerformance}
                      >
                        <option value="">Pilih Karyawan</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.fullName} - {emp.department}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Periode *</label>
                      <input
                        type="month"
                        required
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Tipe Review *</label>
                    <select
                      required
                      value={formData.reviewType}
                      onChange={(e) => setFormData({ ...formData, reviewType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="monthly">Bulanan</option>
                      <option value="quarterly">Triwulan</option>
                      <option value="annual">Tahunan</option>
                    </select>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-[var(--app-text)] mb-4">KPI Scoring (0-100)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'productivity', label: 'Produktivitas' },
                        { key: 'quality', label: 'Kualitas' },
                        { key: 'attendance', label: 'Kehadiran' },
                        { key: 'discipline', label: 'Disiplin' },
                        { key: 'teamwork', label: 'Teamwork' },
                        { key: 'initiative', label: 'Inisiatif' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">
                            {label}: <span className={`font-bold ${getScoreColor(formData[key])}`}>{formData[key]}</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <p className="text-sm font-medium text-orange-900">Overall Score Otomatis:</p>
                      <p className={`text-3xl font-bold ${getScoreColor(
                        Math.floor((formData.productivity + formData.quality + formData.attendance + 
                                   formData.discipline + formData.teamwork + formData.initiative) / 6)
                      )}`}>
                        {Math.floor((formData.productivity + formData.quality + formData.attendance + 
                                    formData.discipline + formData.teamwork + formData.initiative) / 6)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Pencapaian</label>
                    <textarea
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Tuliskan pencapaian karyawan..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Area Perbaikan</label>
                    <textarea
                      value={formData.improvements}
                      onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Tuliskan area yang perlu diperbaiki..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Target/Goals</label>
                    <textarea
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Tuliskan target untuk periode berikutnya..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-[var(--app-bg)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Save size={18} />
                    Simpan
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
