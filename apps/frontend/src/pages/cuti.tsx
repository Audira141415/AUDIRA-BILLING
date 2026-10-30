import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { useToast } from '@/contexts/ToastContext';
import { 
  Calendar, Plus, Search, Filter, CheckCircle, XCircle, Clock, 
  FileText, X, Save, User, Building2, AlertTriangle, Shield, 
  Check, ArrowRight, UserCheck, HeartHandshake, Download
} from 'lucide-react';

interface EmployeeItem {
  id: string;
  fullName: string;
  employeeNumber: string;
  department: string;
  position: string;
  email: string;
}

interface LeaveRecord {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysCount?: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  handoverTo?: string;
  emergencyContact?: string;
  createdAt: string;
}

interface LeaveStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  onLeaveToday?: number;
}

export default function Cuti() {
  const router = useRouter();
  const { toast } = useToast();
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [stats, setStats] = useState<LeaveStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    onLeaveToday: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modal States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalReason, setApprovalReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Data
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'annual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    handoverTo: '',
    emergencyContact: '',
    reason: '',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [leavesData, statsData, employeesData] = await Promise.all([
        api.leave.getAll().catch(() => []),
        api.leave.getStats().catch(() => ({ total: 0, pending: 0, approved: 0, rejected: 0 })),
        api.employee.getAll('active').catch(() => []),
      ]);

      setLeaves(leavesData || []);
      setStats(statsData || { total: 0, pending: 0, approved: 0, rejected: 0 });
      setEmployees(employeesData || []);

      if (employeesData && employeesData.length > 0 && !formData.employeeId) {
        setFormData(prev => ({ ...prev, employeeId: employeesData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load leave data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleOpenCreateModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      employeeId: employees[0]?.id || '',
      leaveType: 'annual',
      startDate: today,
      endDate: today,
      handoverTo: '',
      emergencyContact: '',
      reason: '',
    });
    setSelectedLeave(null);
    setShowModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.reason.trim()) {
      toast.warning('Pilih karyawan dan tuliskan alasan pengajuan cuti.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        employeeId: formData.employeeId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: `${formData.reason}${formData.handoverTo ? ` [PIC Handover: ${formData.handoverTo}]` : ''}`,
        status: 'pending',
      };

      if (selectedLeave) {
        await api.leave.update(selectedLeave.id, payload);
        toast.success('Pengajuan cuti berhasil diperbarui.');
      } else {
        await api.leave.create(payload);
        toast.success('Pengajuan cuti baru berhasil diajukan dan masuk antrian review supervisor.');
      }

      setShowModal(false);
      loadAllData();
    } catch (err: any) {
      console.error('Error submitting leave:', err);
      toast.error(`Gagal menyimpan pengajuan: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenApproval = (leave: LeaveRecord, action: 'approve' | 'reject') => {
    setSelectedLeave(leave);
    setApprovalAction(action);
    setApprovalReason(action === 'approve' ? 'Disetujui sesuai kuota cuti tahunan dan ketersediaan backup staf.' : '');
    setShowApproveModal(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedLeave) return;
    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (approvalAction === 'approve') {
        await api.leave.approve(selectedLeave.id, {
          approvedBy: user.id || 'admin',
          reason: approvalReason,
        });
        toast.success('Pengajuan cuti telah disetujui.');
      } else {
        if (!approvalReason.trim()) {
          toast.warning('Mohon isi alasan penolakan cuti.');
          setSubmitting(false);
          return;
        }
        await api.leave.reject(selectedLeave.id, {
          approvedBy: user.id || 'admin',
          reason: approvalReason,
        });
        toast.info('Pengajuan cuti telah ditolak.');
      }
      setShowApproveModal(false);
      loadAllData();
    } catch (err: any) {
      console.error('Error processing approval:', err);
      toast.error(`Gagal memproses approval: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      annual: { label: 'Cuti Tahunan', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
      sick: { label: 'Sakit (Dokter)', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
      emergency: { label: 'Izin Darurat', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      maternity: { label: 'Melahirkan', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
      paternity: { label: 'Ayah / Kelahiran', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      unpaid: { label: 'Tanpa Gaji', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    };
    const t = types[type] || { label: type, color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${t.color}`}>
        {t.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3.5 h-3.5" /> Disetujui
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Ditolak
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit animate-pulse">
            <Clock className="w-3.5 h-3.5" /> Menunggu Approval
          </span>
        );
    }
  };

  // Filter leaves
  const filteredLeaves = leaves.filter((leave) => {
    const empName = (leave.employee?.fullName || '').toLowerCase();
    const reason = (leave.reason || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchSearch = empName.includes(query) || reason.includes(query);
    const matchStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchType = typeFilter === 'all' || leave.leaveType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <Layout>
      <Head>
        <title>Pengajuan Cuti & Manajemen Izin Karyawan | AUDIRA NET & BILLING</title>
      </Head>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Top Header Command Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                HRM LEAVE WORKFLOW
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                KUOTA 12 HARI / TAHUN
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--app-text)] mt-1.5 tracking-tight flex items-center gap-2">
              <HeartHandshake className="w-7 h-7 text-cyan-500" />
              Pengajuan Cuti & Manajemen Izin Staf
            </h1>
            <p className="text-sm text-[var(--app-muted)]">
              Workflow pengajuan, kalkulasi kuota cuti, dan persetujuan bertingkat operasional ISP AUDIRA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Ajukan Cuti Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Realtime KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--app-muted)] mb-1">
              <span>Total Pengajuan</span>
              <FileText className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] font-mono">
              {stats.total || leaves.length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Sepanjang Tahun Berjalan</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-500 font-semibold mb-1">
              <span>Menunggu Approval</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500 font-mono">
              {stats.pending || leaves.filter(l => l.status === 'pending').length}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">Perlu Review Supervisor</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold mb-1">
              <span>Disetujui (Approved)</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-500 font-mono">
              {stats.approved || leaves.filter(l => l.status === 'approved').length}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Jadwal Shift Disesuaikan</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
              <span>Ditolak / Dibatalkan</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-500 font-mono">
              {stats.rejected || leaves.filter(l => l.status === 'rejected').length}
            </div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">Kuota Dikembalikan</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
            <input
              type="text"
              placeholder="Cari karyawan atau alasan cuti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Approval</option>
              <option value="approved">Disetujui (Approved)</option>
              <option value="rejected">Ditolak (Rejected)</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
            >
              <option value="all">Semua Jenis Cuti</option>
              <option value="annual">Cuti Tahunan</option>
              <option value="sick">Sakit</option>
              <option value="emergency">Izin Darurat</option>
              <option value="maternity">Melahirkan</option>
              <option value="unpaid">Tanpa Gaji</option>
            </select>

            {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="px-3 py-2 text-xs text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Leaves Table */}
        <div className="bg-[var(--app-card)] rounded-2xl border border-[var(--app-border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold text-[var(--app-text)]">
                Daftar Permohonan Cuti ({filteredLeaves.length} Pengajuan)
              </span>
            </div>
            <span className="text-xs text-[var(--app-muted)]">
              Kebijakan ISP: Wajib serah terima tugas (Handover PIC) sebelum hari cuti.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--app-text)]">
              <thead className="bg-[var(--app-bg)] text-xs text-[var(--app-muted)] uppercase border-b border-[var(--app-border)]">
                <tr>
                  <th className="px-5 py-3.5">Karyawan</th>
                  <th className="px-5 py-3.5">Jenis Cuti</th>
                  <th className="px-5 py-3.5">Periode Tanggal</th>
                  <th className="px-5 py-3.5">Durasi</th>
                  <th className="px-5 py-3.5">Alasan & Handover PIC</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-xs text-[var(--app-muted)]">
                      {leaves.length === 0
                        ? 'Belum ada pengajuan cuti yang tercatat di sistem.'
                        : 'Tidak ada permohonan cuti yang cocok dengan filter pencarian.'}
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => {
                    const days = calculateDays(leave.startDate, leave.endDate);
                    return (
                      <tr key={leave.id} className="hover:bg-[var(--app-bg)]/60 transition">
                        {/* Employee */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                              {(leave.employee?.fullName || 'K').charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-[var(--app-text)]">
                                {leave.employee?.fullName || 'Karyawan'}
                              </div>
                              <div className="text-xs text-[var(--app-muted)] font-mono">
                                {leave.employee?.employeeNumber || '-'} &bull; {leave.employee?.department || '-'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Leave Type */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {getLeaveTypeBadge(leave.leaveType)}
                        </td>

                        {/* Period */}
                        <td className="px-5 py-3.5 text-xs whitespace-nowrap font-mono">
                          <div>
                            {new Date(leave.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <span className="text-[var(--app-muted)] mx-1">s/d</span>
                            {new Date(leave.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="px-5 py-3.5 text-xs whitespace-nowrap font-bold text-cyan-600">
                          {days} Hari Kerja
                        </td>

                        {/* Reason */}
                        <td className="px-5 py-3.5 text-xs max-w-xs truncate text-[var(--app-text)]" title={leave.reason}>
                          {leave.reason}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {getStatusBadge(leave.status)}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          {leave.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenApproval(leave, 'approve')}
                                className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                                title="Setujui Cuti"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Setujui</span>
                              </button>
                              <button
                                onClick={() => handleOpenApproval(leave, 'reject')}
                                className="px-2.5 py-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                                title="Tolak Cuti"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--app-muted)] font-mono">Selesai Ditinjau</span>
                          )}
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

      {/* Modal Pengajuan Cuti Baru */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 text-[var(--app-text)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500" />
                Formulir Pengajuan Cuti Karyawan
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="my-4 space-y-3.5 text-xs">
              {/* Select Employee */}
              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">
                  Nama Karyawan / Teknisi:
                </label>
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

              {/* Leave Type */}
              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">
                  Jenis Cuti:
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                >
                  <option value="annual">Cuti Tahunan (Maks 12 Hari / Tahun)</option>
                  <option value="sick">Cuti Sakit (Surat Keterangan Dokter)</option>
                  <option value="emergency">Izin Darurat / Keperluan Mendesak</option>
                  <option value="maternity">Cuti Melahirkan (3 Bulan)</option>
                  <option value="paternity">Cuti Kelahiran Anak / Istri (2 Hari)</option>
                  <option value="unpaid">Cuti di Luar Tanggungan (Tanpa Gaji)</option>
                </select>
              </div>

              {/* Date Ranges */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Tanggal Mulai:</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Tanggal Selesai:</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              {/* Total Duration calculation badge */}
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 font-bold flex items-center justify-between">
                <span>Total Hari Cuti Diajukan:</span>
                <span className="text-sm font-mono">{calculateDays(formData.startDate, formData.endDate)} Hari</span>
              </div>

              {/* PIC Handover */}
              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">
                  Staf Pengganti Tugas (Handover PIC ISP):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dimas Setiawan (Menggantikan tiket PSB & Splicing)"
                  value={formData.handoverTo}
                  onChange={(e) => setFormData({ ...formData, handoverTo: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">
                  Alasan Lengkap Pengajuan Cuti:
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan keterangan detail keperluan cuti atau lampiran dokter..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                  required
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
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {submitting ? 'Menyimpan...' : 'Kirim Pengajuan Cuti'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval / Rejection Modal */}
      {showApproveModal && selectedLeave && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 text-[var(--app-text)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                {approvalAction === 'approve' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Persetujuan Cuti (Approval)
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-500" />
                    Penolakan Cuti (Rejection)
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <p className="text-[var(--app-muted)]">
                Karyawan: <strong className="text-[var(--app-text)]">{selectedLeave.employee?.fullName || 'Karyawan'}</strong>
              </p>
              <p className="text-[var(--app-muted)]">
                Durasi: <strong className="text-cyan-600">{calculateDays(selectedLeave.startDate, selectedLeave.endDate)} Hari</strong> ({selectedLeave.startDate.substring(0, 10)} s/d {selectedLeave.endDate.substring(0, 10)})
              </p>
              <p className="text-[var(--app-muted)]">
                Alasan: <span className="italic text-[var(--app-text)]">"{selectedLeave.reason}"</span>
              </p>

              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">
                  Catatan / Keterangan Supervisor:
                </label>
                <textarea
                  rows={3}
                  value={approvalReason}
                  onChange={(e) => setApprovalReason(e.target.value)}
                  placeholder={approvalAction === 'approve' ? 'Catatan persetujuan...' : 'Alasan penolakan (misal: shift kritis / tidak ada backup)...'}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                  required={approvalAction === 'reject'}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-border)] text-[var(--app-text)] font-semibold rounded-xl transition text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmApproval}
                disabled={submitting}
                className={`flex-1 py-2.5 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 ${
                  approvalAction === 'approve'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/25'
                }`}
              >
                {submitting ? 'Memproses...' : approvalAction === 'approve' ? 'Konfirmasi Setujui' : 'Konfirmasi Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
