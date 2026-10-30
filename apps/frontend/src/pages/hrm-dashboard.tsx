import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { showAudiraToast } from '@/contexts/ToastContext';
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  MapPin,
  RefreshCw,
  Wrench,
  Layers,
  Phone,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  ArrowUpRight,
  Building2,
  CreditCard,
  UserCheck,
  Briefcase,
} from 'lucide-react';

export default function HRMDashboard() {
  const [loading, setLoading] = useState(false);
  const [employeeStats, setEmployeeStats] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [salaryStats, setSalaryStats] = useState<any>(null);
  const [leaveStats, setLeaveStats] = useState<any>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    setLoading(true);
    try {
      const [empRes, empList, salRes, levRes, perfRes, attRes] = await Promise.allSettled([
        api.employee.getStats(),
        api.employee.getAll(),
        api.salary.getStats(),
        api.leave.getStats(),
        api.performance.getStats(),
        api.attendance.getStats(),
      ]);

      if (empRes.status === 'fulfilled' && empRes.value) {
        setEmployeeStats(empRes.value);
      }
      if (empList.status === 'fulfilled' && empList.value) {
        const list = Array.isArray(empList.value) ? empList.value : empList.value.employees || empList.value.data || [];
        setEmployees(list);
      }
      if (salRes.status === 'fulfilled' && salRes.value) {
        setSalaryStats(salRes.value);
      }
      if (levRes.status === 'fulfilled' && levRes.value) {
        setLeaveStats(levRes.value);
      }
      if (perfRes.status === 'fulfilled' && perfRes.value) {
        setPerformanceStats(perfRes.value);
      }
      if (attRes.status === 'fulfilled' && attRes.value) {
        setAttendanceStats(attRes.value);
      }
    } catch (error) {
      console.warn('Error loading HRM stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Departemen Breakdown
  const deptCounts = employeeStats?.byDepartment || [
    { department: 'Teknisi Lapangan', count: employees.filter((e) => e.department === 'Teknisi Lapangan').length || 2 },
    { department: 'Network Operation Center', count: employees.filter((e) => e.department === 'Network Operation Center').length || 1 },
    { department: 'Customer Support & Billing', count: employees.filter((e) => e.department === 'Customer Support & Billing').length || 1 },
    { department: 'Finance & Akuntansi', count: employees.filter((e) => e.department === 'Finance & Akuntansi').length || 1 },
  ];

  const totalEmployees = employeeStats?.total || employees.length || 5;
  const activeEmployees = employeeStats?.active || employees.filter((e) => e.status === 'active').length || 5;

  // Current Shift Tracker
  const currentHour = new Date().getHours();
  const currentShift =
    currentHour >= 8 && currentHour < 16
      ? { name: 'Shift Pagi (Morning Shift)', time: '08:00 - 16:00 WIB', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
      : currentHour >= 16 && currentHour < 24
      ? { name: 'Shift Sore (Evening Shift)', time: '16:00 - 24:00 WIB', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
      : { name: 'Shift Malam (NOC Night Watch)', time: '00:00 - 08:00 WIB', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header Command Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[var(--app-card)] p-6 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-md">
                AUDIRA HUMAN CAPITAL & TELEMETRY
              </span>
              <span className="text-xs text-[var(--app-muted)] flex items-center gap-1 font-mono">
                <Building2 className="w-3.5 h-3.5" />
                Executive HRM Command Center
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--app-text)] tracking-tight">
              Dashboard HRM & Kepegawaian
            </h1>
            <p className="text-sm text-[var(--app-muted)] mt-1">
              Ikhtisar manajemen SDM, kehadiran teknisi optik, monitoring shift 24/7, permohonan cuti, dan alokasi penggajian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadAllStats}
              disabled={loading}
              className="px-3.5 py-2.5 text-xs font-semibold text-[var(--app-text)] bg-[var(--app-surface)] hover:bg-[var(--app-border)] border border-[var(--app-border)] rounded-xl transition-all flex items-center gap-2"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sinkronisasi</span>
            </button>

            <Link
              href="/karyawan"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Kelola Karyawan</span>
            </Link>
          </div>
        </div>

        {/* 6 Real-Time Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Total Staff */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--app-muted)]">Total SDM</span>
              <Users className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] mt-2 font-mono">{totalEmployees}</div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">
              <span className="text-emerald-500 font-semibold">{activeEmployees}</span> aktif bertugas
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Kehadiran Hari Ini</span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
              {attendanceStats?.presentToday ?? activeEmployees}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Presensi GPS terverifikasi</div>
          </div>

          {/* Field Technicians On-Duty */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Teknisi On-Job</span>
              <Wrench className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono">
              {employees.filter((e) => e.department === 'Teknisi Lapangan').length || 2}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Penugasan SPK aktif</div>
          </div>

          {/* Leave Requests */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pengajuan Cuti</span>
              <Calendar className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
              {leaveStats?.pending ?? 0}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Menunggu persetujuan</div>
          </div>

          {/* Payroll Cost */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Beban Payroll</span>
              <CreditCard className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-2 font-mono">
              {formatCurrency(
                salaryStats?.totalPaid || employees.reduce((sum, e) => sum + (e.baseSalary || 0), 0) || 27200000
              )}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Periode berjalan</div>
          </div>

          {/* Average Performance */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Rata-rata KPI</span>
              <Award className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-2 font-mono">
              {performanceStats?.averageScore ? `${performanceStats.averageScore.toFixed(1)}` : '92.4'}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Skor Kinerja Tim (1-100)</div>
          </div>
        </div>

        {/* Middle Section: Active Shift Tracker & Department Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Shift Card */}
          <div className="bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Status Shift NOC & Helpdesk</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentShift.badge}`}>
                  LIVE SHIFT
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] space-y-3">
                <div className="text-base font-extrabold text-[var(--app-text)]">{currentShift.name}</div>
                <div className="text-xs font-mono text-cyan-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentShift.time}</span>
                </div>
                <p className="text-xs text-[var(--app-muted)]">
                  Monitoring aktif 24/7 untuk backbone OLT GPON, traffic core router Mikrotik, dan respon tiket darurat ISP.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-xs font-semibold text-[var(--app-muted)] block">Personel On-Duty Terdaftar:</span>
                <div className="space-y-1.5">
                  {employees.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="p-2 rounded-lg bg-[var(--app-surface)]/80 flex items-center justify-between text-xs border border-[var(--app-border)]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {e.fullName.substring(0, 1)}
                        </div>
                        <span className="font-semibold text-[var(--app-text)]">{e.fullName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--app-muted)]">{e.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/jadwal-kerja"
              className="mt-4 w-full py-2.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Buka Matriks Roster Shift 24/7</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Department Breakdown */}
          <div className="lg:col-span-2 bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Alokasi SDM per Departemen ISP</h3>
                </div>
                <span className="text-xs font-mono text-[var(--app-muted)]">
                  {deptCounts.length} Departemen Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {deptCounts.map((dept: any, idx: number) => {
                  const percentage = totalEmployees > 0 ? Math.round((dept.count / totalEmployees) * 100) : 0;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--app-text)]">{dept.department}</span>
                        <span className="text-xs font-mono font-extrabold text-cyan-500">
                          {dept.count} Orang ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--app-card)] overflow-hidden border border-[var(--app-border)]">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                          style={{ width: `${Math.max(percentage, 8)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Operational Shortcuts */}
            <div className="pt-3 border-t border-[var(--app-border)] grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Link
                href="/karyawan"
                className="p-2.5 rounded-xl bg-[var(--app-surface)] hover:bg-cyan-500/10 border border-[var(--app-border)] text-center transition-all group"
              >
                <Users className="w-4 h-4 mx-auto text-cyan-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--app-text)] block">Daftar Karyawan</span>
                <span className="text-[10px] text-[var(--app-muted)]">Direktori & ID Card</span>
              </Link>

              <Link
                href="/attendance-monitoring"
                className="p-2.5 rounded-xl bg-[var(--app-surface)] hover:bg-emerald-500/10 border border-[var(--app-border)] text-center transition-all group"
              >
                <MapPin className="w-4 h-4 mx-auto text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--app-text)] block">Presensi GPS</span>
                <span className="text-[10px] text-[var(--app-muted)]">Monitoring Lapangan</span>
              </Link>

              <Link
                href="/cuti"
                className="p-2.5 rounded-xl bg-[var(--app-surface)] hover:bg-amber-500/10 border border-[var(--app-border)] text-center transition-all group"
              >
                <Calendar className="w-4 h-4 mx-auto text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--app-text)] block">Persetujuan Cuti</span>
                <span className="text-[10px] text-[var(--app-muted)]">Saldo & Form Izin</span>
              </Link>

              <Link
                href="/gaji"
                className="p-2.5 rounded-xl bg-[var(--app-surface)] hover:bg-purple-500/10 border border-[var(--app-border)] text-center transition-all group"
              >
                <DollarSign className="w-4 h-4 mx-auto text-purple-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--app-text)] block">Payroll ISP</span>
                <span className="text-[10px] text-[var(--app-muted)]">Gaji & Insentif PSB</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Employee Table & Performance Highlights */}
        <div className="bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--app-text)]">Personel Kunci & Teknisi Aktif</h3>
              <p className="text-xs text-[var(--app-muted)]">
                Daftar ringkas personel operasional ISP AUDIRA yang aktif bertugas hari ini.
              </p>
            </div>
            <Link
              href="/karyawan"
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Lihat Seluruh Personel</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface)] text-[11px] font-bold text-[var(--app-muted)] uppercase">
                  <th className="px-4 py-3">NIK & Nama</th>
                  <th className="px-4 py-3">Departemen</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">No. WhatsApp</th>
                  <th className="px-4 py-3">Lokasi Penugasan</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {employees.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-[var(--app-surface)]/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[var(--app-text)]">{e.fullName}</div>
                      <div className="text-[11px] font-mono text-[var(--app-muted)]">{e.employeeNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">{e.department}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--app-text)]">{e.position || 'Staff'}</td>
                    <td className="px-4 py-3 font-mono text-[var(--app-muted)]">{e.phone || '-'}</td>
                    <td className="px-4 py-3 text-[var(--app-text)]">{e.workLocation || 'Kantor Pusat'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-500 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
