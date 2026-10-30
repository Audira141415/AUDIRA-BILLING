import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { useToast } from '@/contexts/ToastContext';
import { 
  TrendingUp, Users, Search, BarChart3, Award, Target, Plus, X, 
  Save, Edit2, Trash2, CheckCircle, Clock, Star, Zap, Shield, 
  ArrowUpRight, AlertCircle, Building2, ChevronRight, Download, 
  FileText, Activity, Radio, Check, RefreshCw, Printer
} from 'lucide-react';

interface EmployeeItem {
  id: string;
  fullName: string;
  employeeNumber: string;
  department: string;
  position: string;
  email: string;
}

interface PerformanceRecord {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  period: string; // YYYY-MM
  reviewType: string;
  productivity: number; // MTTR Ticket Resolution
  quality: number;      // Drop Core Splicing / dBm Quality
  attendance: number;   // Presensi & Shift
  discipline: number;   // SOP K3 & Prosedur ISP
  teamwork: number;     // Kolaborasi Antar Divisi
  initiative: number;   // Emergency Handling & Troubleshooting
  overallScore: number;
  achievements?: string;
  improvements?: string;
  goals?: string;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: string;
}

interface PerformanceStats {
  totalReviews: number;
  averageScore: number;
  highPerformers: number;
  needsImprovement: number;
  approvedCount: number;
}

export default function Kinerja() {
  const router = useRouter();
  const { toast } = useToast();
  const [performances, setPerformances] = useState<PerformanceRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [stats, setStats] = useState<PerformanceStats>({
    totalReviews: 0,
    averageScore: 0,
    highPerformers: 0,
    needsImprovement: 0,
    approvedCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>(new Date().toISOString().slice(0, 7));
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<PerformanceRecord | null>(null);
  const [editingPerformance, setEditingPerformance] = useState<PerformanceRecord | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7),
    reviewType: 'monthly',
    productivity: 85, // MTTR & Kecepatan Tiket
    quality: 90,      // Kualitas Redaman Kabel FO (dBm)
    attendance: 88,   // Kehadiran & Shift
    discipline: 85,   // K3 Tiang & Prosedur ISP
    teamwork: 86,     // Kerjasama Tim
    initiative: 82,   // Tanggap Darurat FO Cut
    achievements: 'Penyelesaian perbaikan kabel feeder FO 24 core di Jl. Pejuang tepat waktu (< 2 jam).',
    improvements: 'Meningkatkan kelengkapan log dokumentasi splicing ODP di aplikasi mobile.',
    goals: 'Mendapatkan sertifikasi lanjutan Mikrotik MTCRE dan sertifikasi K3 Tenaga Kerja Pada Ketinggian.',
    status: 'submitted',
  });

  useEffect(() => {
    loadData();
  }, [periodFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [perfsData, statsData, employeesData] = await Promise.all([
        api.performance.getAll().catch(() => []),
        api.performance.getStats().catch(() => ({
          totalReviews: 0,
          averageScore: 0,
          highPerformers: 0,
          needsImprovement: 0,
          approvedCount: 0,
        })),
        api.employee.getAll('active').catch(() => []),
      ]);

      setPerformances(perfsData || []);
      setStats(statsData || {
        totalReviews: 0,
        averageScore: 0,
        highPerformers: 0,
        needsImprovement: 0,
        approvedCount: 0,
      });
      setEmployees(employeesData || []);
    } catch (err) {
      console.error('Failed to load performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Outstanding (Sangat Baik)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 80) return { grade: 'A', label: 'Exceeds Target (Baik)', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' };
    if (score >= 70) return { grade: 'B', label: 'Meets Standards (Cukup)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return { grade: 'C', label: 'Needs Improvement (Perlu Bimbingan)', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const handleOpenCreate = () => {
    const firstEmp = employees[0];
    setEditingPerformance(null);
    setFormData({
      employeeId: firstEmp?.id || '',
      period: periodFilter,
      reviewType: 'monthly',
      productivity: 85,
      quality: 90,
      attendance: 88,
      discipline: 85,
      teamwork: 86,
      initiative: 82,
      achievements: 'Penyelesaian tiket tepat waktu, penarikan kabel drop core rapi sesuai standar K3.',
      improvements: 'Meningkatkan kecepatan respon tiket darurat pelanggan corporate.',
      goals: 'Target zero complaint terhadap instalasi PSB baru bulan depan.',
      status: 'submitted',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (perf: PerformanceRecord) => {
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast.warning('Pilih karyawan terlebih dahulu.');
      return;
    }

    try {
      setSubmitting(true);
      const overallScore = Math.round(
        (Number(formData.productivity) + Number(formData.quality) + Number(formData.attendance) +
         Number(formData.discipline) + Number(formData.teamwork) + Number(formData.initiative)) / 6
      );

      const payload = {
        ...formData,
        productivity: Number(formData.productivity),
        quality: Number(formData.quality),
        attendance: Number(formData.attendance),
        discipline: Number(formData.discipline),
        teamwork: Number(formData.teamwork),
        initiative: Number(formData.initiative),
        overallScore,
      };

      if (editingPerformance) {
        await api.performance.update(editingPerformance.id, payload);
        toast.success('Review penilaian KPI berhasil diperbarui.');
      } else {
        await api.performance.create(payload);
        toast.success('Penilaian kinerja baru berhasil dicatat.');
      }

      setShowModal(false);
      loadData();
    } catch (err: any) {
      console.error('Failed to save performance:', err);
      toast.error(`Gagal menyimpan penilaian: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await api.performance.approve(id, { approvedBy: user.id || 'admin' });
      toast.success('Penilaian kinerja telah disetujui (Approved).');
      loadData();
    } catch (err: any) {
      toast.error(`Gagal menyetujui: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus catatan evaluasi kinerja ini?')) return;
    try {
      await api.performance.delete(id);
      toast.success('Evaluasi kinerja berhasil dihapus.');
      loadData();
    } catch (err: any) {
      toast.error(`Gagal menghapus: ${err.message}`);
    }
  };

  const handleOpenDetail = (perf: PerformanceRecord) => {
    setSelectedRecord(perf);
    setShowDetailModal(true);
  };

  // Filter performances
  const filteredPerformances = performances.filter((perf) => {
    const empName = (perf.employee?.fullName || '').toLowerCase();
    const empNo = (perf.employee?.employeeNumber || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchSearch = empName.includes(query) || empNo.includes(query);
    const matchEmployee = !selectedEmployee || perf.employeeId === selectedEmployee;
    const matchStatus = statusFilter === 'all' || perf.status === statusFilter;
    return matchSearch && matchEmployee && matchStatus;
  });

  return (
    <Layout>
      <Head>
        <title>Penilaian Kinerja (KPI) Staf & Teknisi | AUDIRA NET & BILLING</title>
      </Head>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Top Header Command Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                ISP KPI SCORECARD 360°
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                SLA & KUALITAS JARINGAN
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--app-text)] mt-1.5 tracking-tight flex items-center gap-2">
              <Award className="w-7 h-7 text-cyan-500" />
              Penilaian Kinerja (KPI) Karyawan & Teknisi
            </h1>
            <p className="text-sm text-[var(--app-muted)]">
              Evaluasi komprehensif performa tim: MTTR tiket gangguan, kualitas redaman kabel fiber optik, kepatuhan K3 tiang, dan kepuasan pelanggan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Input Penilaian Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Realtime KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--app-muted)] mb-1">
              <span>Total Evaluasi Kinerja</span>
              <BarChart3 className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] font-mono">
              {stats.totalReviews || performances.length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Review Tercatat</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-cyan-500 font-semibold mb-1">
              <span>Rata-Rata Skor Tim</span>
              <Activity className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-cyan-500 font-mono">
              {stats.averageScore ? stats.averageScore.toFixed(1) : (
                performances.length > 0 
                  ? (performances.reduce((a, b) => a + b.overallScore, 0) / performances.length).toFixed(1)
                  : '85.4'
              )} / 100
            </div>
            <div className="text-[11px] text-cyan-600 font-semibold mt-1">Grade: A (Exceeds Target)</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold mb-1">
              <span>Top Performers (Skor &ge; 85)</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-500 font-mono">
              {stats.highPerformers || performances.filter(p => p.overallScore >= 85).length}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Kandidat Insentif Bulanan</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-500 font-semibold mb-1">
              <span>Perlu Coaching / Pelatihan</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500 font-mono">
              {stats.needsImprovement || performances.filter(p => p.overallScore < 75).length}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">Jadwal Training Splicer</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
            <input
              type="text"
              placeholder="Cari nama atau NIP staf..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Employee Filter */}
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
            >
              <option value="">Semua Karyawan</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="approved">Disetujui (Approved)</option>
              <option value="submitted">Diajukan (Submitted)</option>
              <option value="draft">Draft Evaluator</option>
            </select>

            {(searchTerm || selectedEmployee || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEmployee('');
                  setStatusFilter('all');
                }}
                className="px-3 py-2 text-xs text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Performance Scorecard Table */}
        <div className="bg-[var(--app-card)] rounded-2xl border border-[var(--app-border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold text-[var(--app-text)]">
                Scorecard Evaluasi Kinerja ({filteredPerformances.length} Karyawan)
              </span>
            </div>
            <span className="text-xs text-[var(--app-muted)]">
              6 Dimensi Kompetensi ISP: MTTR, dBm FO, Absensi, K3, Kerjasama & Inisiatif.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--app-text)]">
              <thead className="bg-[var(--app-bg)] text-xs text-[var(--app-muted)] uppercase border-b border-[var(--app-border)]">
                <tr>
                  <th className="px-5 py-3.5">Karyawan</th>
                  <th className="px-5 py-3.5">Periode</th>
                  <th className="px-5 py-3.5">MTTR & Tiket</th>
                  <th className="px-5 py-3.5">Kualitas FO (dBm)</th>
                  <th className="px-5 py-3.5">Presensi</th>
                  <th className="px-5 py-3.5">Skor Total</th>
                  <th className="px-5 py-3.5">Predikat</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {filteredPerformances.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-xs text-[var(--app-muted)]">
                      {performances.length === 0
                        ? 'Belum ada penilaian kinerja tercatat. Klik "Input Penilaian Baru" untuk mengevaluasi staf.'
                        : 'Tidak ada data penilaian yang cocok dengan filter pencarian.'}
                    </td>
                  </tr>
                ) : (
                  filteredPerformances.map((perf) => {
                    const gradeInfo = getScoreGrade(perf.overallScore);
                    return (
                      <tr key={perf.id} className="hover:bg-[var(--app-bg)]/60 transition">
                        {/* Employee */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                              {(perf.employee?.fullName || 'K').charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-[var(--app-text)]">
                                {perf.employee?.fullName || 'Karyawan'}
                              </div>
                              <div className="text-xs text-[var(--app-muted)] font-mono">
                                {perf.employee?.employeeNumber || '-'} &bull; {perf.employee?.department || '-'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Period */}
                        <td className="px-5 py-3.5 text-xs font-mono whitespace-nowrap text-cyan-500 font-bold">
                          {perf.period}
                        </td>

                        {/* MTTR */}
                        <td className="px-5 py-3.5 text-xs font-mono whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-[var(--app-bg)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${perf.productivity}%` }} />
                            </div>
                            <span>{perf.productivity}%</span>
                          </div>
                        </td>

                        {/* Quality FO */}
                        <td className="px-5 py-3.5 text-xs font-mono whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-[var(--app-bg)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${perf.quality}%` }} />
                            </div>
                            <span>{perf.quality}%</span>
                          </div>
                        </td>

                        {/* Attendance */}
                        <td className="px-5 py-3.5 text-xs font-mono whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-[var(--app-bg)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${perf.attendance}%` }} />
                            </div>
                            <span>{perf.attendance}%</span>
                          </div>
                        </td>

                        {/* Overall Score */}
                        <td className="px-5 py-3.5 font-mono text-base font-black text-[var(--app-text)] whitespace-nowrap">
                          {perf.overallScore}
                        </td>

                        {/* Predicate */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${gradeInfo.color}`}>
                            {gradeInfo.grade} ({gradeInfo.label.split(' ')[0]})
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {perf.status === 'approved' ? (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" /> Approved
                            </span>
                          ) : perf.status === 'submitted' ? (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" /> Submitted
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View detail radar scorecard */}
                            <button
                              onClick={() => handleOpenDetail(perf)}
                              className="p-1.5 rounded-lg text-cyan-500 hover:bg-cyan-500/10 transition"
                              title="Lihat Detail Scorecard 360°"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>

                            {/* Approve */}
                            {perf.status !== 'approved' && (
                              <button
                                onClick={() => handleApprove(perf.id)}
                                className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition"
                                title="Setujui Penilaian"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(perf)}
                              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition"
                              title="Edit Nilai"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(perf.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                              title="Hapus Review"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
      </div>

      {/* KPI Evaluation Input / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-2xl w-full p-6 text-[var(--app-text)] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-500" />
                {editingPerformance ? 'Edit Scorecard KPI Karyawan' : 'Formulir Penilaian Kinerja Karyawan (KPI)'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="my-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Pilih Karyawan:</label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                    required
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.employeeNumber}) - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Periode Evaluasi:</label>
                  <input
                    type="month"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              {/* 6 Dimension Sliders */}
              <div className="p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] space-y-3">
                <div className="font-bold text-cyan-500 text-xs flex items-center justify-between pb-1 border-b border-[var(--app-border)]">
                  <span>6 DIMENSI PENILAIAN TEKNIS ISP</span>
                  <span className="text-[var(--app-muted)] font-mono text-[11px]">Skor (0 - 100)</span>
                </div>

                {/* 1. MTTR */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">1. Kecepatan Tiket & MTTR Gangguan:</span>
                    <span className="font-mono font-bold text-cyan-500">{formData.productivity}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.productivity}
                    onChange={(e) => setFormData({ ...formData, productivity: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* 2. Quality FO */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">2. Kualitas Redaman Kabel Fiber Optic (dBm):</span>
                    <span className="font-mono font-bold text-emerald-500">{formData.quality}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: Number(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* 3. Attendance */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">3. Presensi & Kesiapsiagaan Shift 24/7:</span>
                    <span className="font-mono font-bold text-purple-500">{formData.attendance}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* 4. Discipline K3 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">4. Kepatuhan SOP & Keselamatan Kerja K3:</span>
                    <span className="font-mono font-bold text-blue-500">{formData.discipline}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: Number(e.target.value) })}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* 5. Teamwork */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">5. Kolaborasi Tim & Koordinasi NOC:</span>
                    <span className="font-mono font-bold text-indigo-500">{formData.teamwork}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.teamwork}
                    onChange={(e) => setFormData({ ...formData, teamwork: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* 6. Initiative */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">6. Inisiatif & Penanganan Tanggap Darurat FO Cut:</span>
                    <span className="font-mono font-bold text-amber-500">{formData.initiative}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.initiative}
                    onChange={(e) => setFormData({ ...formData, initiative: Number(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Overall Score */}
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex justify-between items-center text-xs font-bold text-cyan-600">
                <span>Rata-Rata Skor Keseluruhan:</span>
                <span className="text-lg font-mono">
                  {Math.round((formData.productivity + formData.quality + formData.attendance + formData.discipline + formData.teamwork + formData.initiative) / 6)} / 100
                </span>
              </div>

              {/* Qualitative Notes */}
              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">Pencapaian Utama (Achievements):</label>
                <textarea
                  rows={2}
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Prestasi atau proyek pemasangan/maintenance terbaik bulan ini..."
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">Target Perbaikan (Improvements):</label>
                <textarea
                  rows={2}
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  placeholder="Hal yang perlu ditingkatkan, sertifikasi yang dianjurkan..."
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-border)] text-[var(--app-text)] font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Scorecard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Scorecard 360° Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-xl w-full p-6 text-[var(--app-text)] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-500" />
                Scorecard Kinerja 360° - {selectedRecord.employee?.fullName}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              {/* Header Badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-cyan-400">{selectedRecord.employee?.fullName}</div>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedRecord.employee?.employeeNumber} &bull; {selectedRecord.employee?.position}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Periode: {selectedRecord.period}</div>
                </div>
                <div className="text-center bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="text-3xl font-black text-cyan-400 font-mono">{selectedRecord.overallScore}</div>
                  <div className="text-[10px] text-slate-400 font-mono">SKOR AKHIR</div>
                </div>
              </div>

              {/* 6 Dimension Radar Breakdown */}
              <div className="space-y-2 p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)]">
                <div className="font-bold text-xs text-[var(--app-text)] mb-2">Rincian 6 Pilar Kompetensi ISP:</div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--app-muted)]">MTTR & Tiket Gangguan</span>
                      <span className="font-mono font-bold">{selectedRecord.productivity}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-card)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${selectedRecord.productivity}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--app-muted)]">Kualitas Redaman Kabel FO (dBm)</span>
                      <span className="font-mono font-bold text-emerald-500">{selectedRecord.quality}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-card)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedRecord.quality}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--app-muted)]">Presensi & Shift 24/7</span>
                      <span className="font-mono font-bold text-purple-500">{selectedRecord.attendance}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-card)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${selectedRecord.attendance}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--app-muted)]">Kepatuhan K3 & SOP ISP</span>
                      <span className="font-mono font-bold text-blue-500">{selectedRecord.discipline}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-card)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${selectedRecord.discipline}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--app-muted)]">Kerjasama & Koordinasi Tim</span>
                      <span className="font-mono font-bold text-indigo-500">{selectedRecord.teamwork}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-card)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${selectedRecord.teamwork}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--app-muted)]">Inisiatif Darurat FO Cut</span>
                      <span className="font-mono font-bold text-amber-500">{selectedRecord.initiative}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-card)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${selectedRecord.initiative}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-3 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] space-y-2">
                <div>
                  <span className="font-semibold text-emerald-600 block">Pencapaian:</span>
                  <p className="text-[var(--app-muted)]">{selectedRecord.achievements || '-'}</p>
                </div>
                <div>
                  <span className="font-semibold text-cyan-600 block">Rekomendasi Pelatihan:</span>
                  <p className="text-[var(--app-muted)]">{selectedRecord.improvements || '-'}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-border)] text-[var(--app-text)] font-semibold rounded-xl text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
