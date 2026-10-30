import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { API_BASE_URL } from '../config/api';
import { useToast } from '@/contexts/ToastContext';
import { 
  Clock, User, CheckCircle, XCircle, AlertCircle, Calendar, Eye, 
  Edit3, Download, Search, Filter, X, MapPin, RefreshCw, Radio, 
  Shield, Layers, ChevronRight, Activity, ExternalLink, Award
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
  };
  employee?: {
    id: string;
    fullName: string;
    employeeNumber: string;
    department: string;
    position: string;
  };
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInPhoto: string | null;
  checkOutPhoto: string | null;
  checkInLat: number | null;
  checkInLong: number | null;
  checkOutLat: number | null;
  checkOutLong: number | null;
  status: string;
  workDuration: number | null;
}

interface StatsData {
  totalEmployees: number;
  present: number;
  late: number;
  absent: number;
  stillWorking: number;
  attendanceRate: number;
}

export default function AttendanceMonitoring() {
  const router = useRouter();
  const { toast } = useToast();
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalEmployees: 0,
    present: 0,
    late: 0,
    absent: 0,
    stillWorking: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    loadData();
    if (!autoRefresh) return;
    const interval = setInterval(loadData, 20000); // 20s live sync
    return () => clearInterval(interval);
  }, [selectedDate, autoRefresh]);

  // Apply filters
  useEffect(() => {
    let result = [...attendances];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.employee?.fullName || item.user.name || '').toLowerCase().includes(q) ||
        (item.employee?.employeeNumber || '').toLowerCase().includes(q) ||
        (item.user.email || '').toLowerCase().includes(q)
      );
    }

    if (departmentFilter !== 'all') {
      result = result.filter(item => 
        (item.employee?.department || item.user.role || '').toLowerCase() === departmentFilter.toLowerCase()
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'absent') {
        result = result.filter(item => !item.checkInTime);
      } else {
        result = result.filter(item => item.status === statusFilter && !!item.checkInTime);
      }
    }

    setFilteredAttendances(result);
  }, [attendances, searchQuery, departmentFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Fetch attendance records for selected date
      const res = await fetch(`${API_BASE_URL}/attendance/date/${selectedDate}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setAttendances(data);
      }

      // 2. Fetch stats
      const resStats = await fetch(`${API_BASE_URL}/attendance/stats?date=${selectedDate}`, { headers });
      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error loading monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  const getStatusBadge = (status: string, hasCheckedIn: boolean) => {
    if (!hasCheckedIn) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
          Belum Hadir
        </span>
      );
    }

    switch (status) {
      case 'present':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Tepat Waktu
          </span>
        );
      case 'late':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Terlambat
          </span>
        );
      case 'leave':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            Cuti / Izin
          </span>
        );
      case 'sick':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20">
            Sakit
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            {status}
          </span>
        );
    }
  };

  const handleOpenDetail = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleOpenEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setEditStatus(record.status || 'present');
    setEditNotes('');
    setShowEditModal(true);
  };

  const handleSaveStatus = async () => {
    if (!editingRecord) return;
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/attendance/${editingRecord.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: editStatus }),
      });

      if (res.ok) {
        toast.success('Status absensi berhasil diperbarui.');
        setShowEditModal(false);
        loadData();
      } else {
        toast.error('Gagal memperbarui status.');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nama Karyawan', 'NIP', 'Departemen', 'Role', 'Email', 'Check-In', 'Check-Out', 'Durasi Menit', 'Status', 'Lokasi Check-In'];
    const rows = filteredAttendances.map((item) => [
      `"${item.employee?.fullName || item.user.name}"`,
      `"${item.employee?.employeeNumber || '-'}"`,
      `"${item.employee?.department || '-'}"`,
      `"${item.user.role}"`,
      `"${item.user.email}"`,
      item.checkInTime ? `"${new Date(item.checkInTime).toLocaleString('id-ID')}"` : '"-"',
      item.checkOutTime ? `"${new Date(item.checkOutTime).toLocaleString('id-ID')}"` : '"-"',
      item.workDuration || 0,
      `"${item.status}"`,
      item.checkInLat && item.checkInLong ? `"${item.checkInLat},${item.checkInLong}"` : '"-"',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audira_monitoring_absensi_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <Head>
        <title>Monitoring Kehadiran Realtime | AUDIRA NET & BILLING</title>
      </Head>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Top Header Command Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                NOC LIVE RADAR
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                AUDIT GEOTAGGING
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--app-text)] mt-1.5 tracking-tight flex items-center gap-2">
              <Radio className="w-7 h-7 text-cyan-500" />
              Monitoring Kehadiran Staf Realtime
            </h1>
            <p className="text-sm text-[var(--app-muted)]">
              Pemantauan absensi, durasi tugas lapangan, dan audit geotagging seluruh staf operasional & teknisi AUDIRA ISP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Auto refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                autoRefresh 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                  : 'bg-[var(--app-bg)] text-[var(--app-muted)] border-[var(--app-border)]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Live Sync (20s)' : 'Sync Manual'}</span>
            </button>

            {/* Date Selector */}
            <div className="flex items-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] px-3 py-1.5 rounded-xl text-xs">
              <Calendar className="w-4 h-4 text-[var(--app-muted)]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-[var(--app-text)] outline-none font-semibold"
              />
            </div>

            {/* Terminal Checkin Link */}
            <Link
              href="/attendance"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition"
            >
              <span>Terminal Presensi</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[var(--app-bg)] hover:bg-[var(--app-card)] text-[var(--app-text)] font-semibold rounded-xl text-xs border border-[var(--app-border)] flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4 text-cyan-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 5 Real-Time KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--app-muted)] mb-1">
              <span>Total Karyawan</span>
              <User className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] font-mono">
              {stats.totalEmployees || attendances.length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Staf Terdaftar</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold mb-1">
              <span>Hadir (Tepat Waktu)</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-500 font-mono">
              {stats.present}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Tingkat: {stats.attendanceRate}%
            </div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-500 font-semibold mb-1">
              <span>Terlambat</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500 font-mono">
              {stats.late}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">Keterlambatan &gt; 15m</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-blue-500 font-semibold mb-1">
              <span>Sedang Bertugas</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-500 font-mono">
              {stats.stillWorking}
            </div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">Shift Aktif / Lapangan</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
              <span>Belum Absen / Off</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-500 font-mono">
              {stats.absent}
            </div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">Perlu Verifikasi Leader</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
            <input
              type="text"
              placeholder="Cari nama, NIP, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Department */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
            >
              <option value="all">Semua Departemen</option>
              <option value="Network Operation Center">NOC</option>
              <option value="Teknisi Lapangan">Teknisi Lapangan</option>
              <option value="Customer Support & Billing">Helpdesk & Billing</option>
              <option value="Finance & Akuntansi">Finance</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="present">Tepat Waktu (Present)</option>
              <option value="late">Terlambat (Late)</option>
              <option value="absent">Belum Absen (Absent)</option>
              <option value="leave">Cuti / Izin</option>
              <option value="sick">Sakit</option>
            </select>

            {(searchQuery || departmentFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDepartmentFilter('all');
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

        {/* Live Attendance Table */}
        <div className="bg-[var(--app-card)] rounded-2xl border border-[var(--app-border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold text-[var(--app-text)]">
                Daftar Presensi ({filteredAttendances.length} Staf)
              </span>
            </div>
            <span className="text-xs text-[var(--app-muted)]">
              Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--app-text)]">
              <thead className="bg-[var(--app-bg)] text-xs text-[var(--app-muted)] uppercase border-b border-[var(--app-border)]">
                <tr>
                  <th className="px-5 py-3.5">Karyawan</th>
                  <th className="px-5 py-3.5">Departemen & Posisi</th>
                  <th className="px-5 py-3.5">Check-In</th>
                  <th className="px-5 py-3.5">Foto Biometrik</th>
                  <th className="px-5 py-3.5">Lokasi GPS</th>
                  <th className="px-5 py-3.5">Check-Out</th>
                  <th className="px-5 py-3.5">Durasi</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {filteredAttendances.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-xs text-[var(--app-muted)]">
                      {attendances.length === 0
                        ? `Belum ada catatan presensi pada tanggal ${selectedDate}.`
                        : 'Tidak ada data presensi yang sesuai dengan kriteria filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--app-bg)]/60 transition">
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 font-bold flex items-center justify-center">
                            {(item.employee?.fullName || item.user.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--app-text)]">
                              {item.employee?.fullName || item.user.name}
                            </div>
                            <div className="text-xs text-[var(--app-muted)] font-mono">
                              {item.employee?.employeeNumber || item.user.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                        <div className="font-semibold text-[var(--app-text)]">
                          {item.employee?.department || 'Operasional'}
                        </div>
                        <div className="text-[var(--app-muted)]">
                          {item.employee?.position || item.user.role}
                        </div>
                      </td>

                      {/* Check-In */}
                      <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                        {item.checkInTime ? (
                          <span className="font-bold text-[var(--app-text)]">
                            {formatTime(item.checkInTime)}
                          </span>
                        ) : (
                          <span className="text-[var(--app-muted)]">-</span>
                        )}
                      </td>

                      {/* Biometric Photo */}
                      <td className="px-5 py-3.5">
                        {item.checkInPhoto ? (
                          <img
                            src={item.checkInPhoto}
                            alt="Biometric Selfie"
                            className="w-9 h-9 rounded-lg object-cover border border-[var(--app-border)] cursor-pointer hover:scale-110 transition shadow-sm"
                            onClick={() => handleOpenDetail(item)}
                            title="Klik untuk audit foto biometrik"
                          />
                        ) : (
                          <span className="text-xs text-[var(--app-muted)]">-</span>
                        )}
                      </td>

                      {/* GPS Link */}
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                        {item.checkInLat && item.checkInLong ? (
                          <a
                            href={`https://www.google.com/maps?q=${item.checkInLat},${item.checkInLong}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 font-mono transition"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{item.checkInLat.toFixed(3)}, {item.checkInLong.toFixed(3)}</span>
                          </a>
                        ) : (
                          <span className="text-[var(--app-muted)]">-</span>
                        )}
                      </td>

                      {/* Check-Out */}
                      <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                        {item.checkOutTime ? (
                          <span className="font-bold text-[var(--app-text)]">
                            {formatTime(item.checkOutTime)}
                          </span>
                        ) : (
                          <span className="text-[var(--app-muted)]">-</span>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                        {formatDuration(item.workDuration)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getStatusBadge(item.status, !!item.checkInTime)}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-500/10 transition"
                            title="Audit Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-500/10 transition"
                            title="Ubah Status Manual"
                          >
                            <Edit3 className="w-4 h-4" />
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
      </div>

      {/* Biometric Detail & Geotagging Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-xl w-full p-6 text-[var(--app-text)] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-500" />
                Audit Biometrik & Geotagging Presensi
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-5 space-y-4">
              {/* Employee Header Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-lg">
                  {(selectedRecord.employee?.fullName || selectedRecord.user.name).charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-base">{selectedRecord.employee?.fullName || selectedRecord.user.name}</h4>
                  <p className="text-xs text-[var(--app-muted)]">
                    {selectedRecord.employee?.employeeNumber || '-'} &bull; {selectedRecord.employee?.department || selectedRecord.user.role}
                  </p>
                </div>
              </div>

              {/* Photos Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-[var(--app-muted)]">Selfie Check-In:</div>
                  {selectedRecord.checkInPhoto ? (
                    <img
                      src={selectedRecord.checkInPhoto}
                      alt="Check-in Photo"
                      className="w-full aspect-[4/3] object-cover rounded-xl border border-[var(--app-border)] shadow"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] flex items-center justify-center text-xs text-[var(--app-muted)]">
                      Tidak ada foto check-in
                    </div>
                  )}
                  <div className="text-xs font-mono text-[var(--app-muted)]">
                    {selectedRecord.checkInTime ? new Date(selectedRecord.checkInTime).toLocaleString('id-ID') : '-'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-[var(--app-muted)]">Selfie Check-Out:</div>
                  {selectedRecord.checkOutPhoto ? (
                    <img
                      src={selectedRecord.checkOutPhoto}
                      alt="Check-out Photo"
                      className="w-full aspect-[4/3] object-cover rounded-xl border border-[var(--app-border)] shadow"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] flex items-center justify-center text-xs text-[var(--app-muted)]">
                      Belum check-out
                    </div>
                  )}
                  <div className="text-xs font-mono text-[var(--app-muted)]">
                    {selectedRecord.checkOutTime ? new Date(selectedRecord.checkOutTime).toLocaleString('id-ID') : '-'}
                  </div>
                </div>
              </div>

              {/* Geotagging & GPS Coordinates */}
              <div className="p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Koordinat GPS Check-In:</span>
                  {selectedRecord.checkInLat && selectedRecord.checkInLong ? (
                    <a
                      href={`https://www.google.com/maps?q=${selectedRecord.checkInLat},${selectedRecord.checkInLong}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-500 font-mono font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{selectedRecord.checkInLat.toFixed(5)}, {selectedRecord.checkInLong.toFixed(5)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[var(--app-muted)]">-</span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Total Durasi Tugas:</span>
                  <span className="font-mono font-bold text-[var(--app-text)]">
                    {formatDuration(selectedRecord.workDuration)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Status Audit:</span>
                  <span>{getStatusBadge(selectedRecord.status, !!selectedRecord.checkInTime)}</span>
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

      {/* Manual Status Override Modal (Admin/Supervisor) */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 text-[var(--app-text)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                Override Status Presensi
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <p className="text-xs text-[var(--app-muted)]">
                Karyawan: <strong className="text-[var(--app-text)]">{editingRecord.employee?.fullName || editingRecord.user.name}</strong>
              </p>

              <div>
                <label className="text-xs font-semibold text-[var(--app-muted)] block mb-1">
                  Pilih Status Baru:
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                >
                  <option value="present">Hadir (Tepat Waktu)</option>
                  <option value="late">Terlambat (Late)</option>
                  <option value="leave">Izin / Cuti</option>
                  <option value="sick">Sakit (Surat Dokter)</option>
                  <option value="absent">Alpha / Tanpa Keterangan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--app-muted)] block mb-1">
                  Catatan Audit Supervisor:
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Misal: Teknisi standby darurat perbaikan fiber optic cut di ODC Harapan Indah..."
                  className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-border)] text-[var(--app-text)] font-semibold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={updating}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {updating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>{updating ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
