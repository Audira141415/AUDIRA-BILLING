import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { showAudiraToast } from '@/contexts/ToastContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Users,
  Clock,
  MapPin,
  X,
  Download,
  RefreshCw,
  Sun,
  Sunset,
  Moon,
  Coffee,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Check,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Layers,
  Phone,
  CalendarCheck,
  Building2,
  Trash2,
  Edit2,
} from 'lucide-react';

interface Employee {
  id: string;
  fullName: string;
  employeeNumber: string;
  department?: string;
  position?: string;
  phone?: string;
}

interface Schedule {
  id: string;
  employeeId: string;
  date: string;
  shiftType: 'morning' | 'afternoon' | 'night' | 'off';
  startTime?: string;
  endTime?: string;
  location?: string;
  notes?: string;
  employee?: {
    id: string;
    fullName: string;
    employeeNumber: string;
    department?: string;
    position?: string;
    phone?: string;
  };
  attendance?: {
    id: string;
    checkInTime?: string;
    checkOutTime?: string;
    status?: string;
  };
}

export default function JadwalKerja() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Date Navigation State
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Senin sebagai awal minggu
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [viewMode, setViewMode] = useState<'roster' | 'daily'>('roster');

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'morning' as 'morning' | 'afternoon' | 'night' | 'off',
    startTime: '08:00',
    endTime: '16:00',
    location: 'NOC Central Basecamp',
    notes: '',
  });

  // Bulk Generator State
  const [bulkConfig, setBulkConfig] = useState({
    selectedEmployeeIds: [] as string[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    pattern: '3shift' as '3shift' | 'office' | 'weekend',
    defaultLocation: 'NOC Central Basecamp',
  });

  // Shift Swap State
  const [swapData, setSwapData] = useState({
    employee1Id: '',
    employee2Id: '',
    date: new Date().toISOString().split('T')[0],
    reason: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, [currentWeekStart, selectedDate]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadEmployees(), loadSchedules()]);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await api.employee.getAll('active');
      const list = Array.isArray(res) ? res : res.employees || res.data || [];
      setEmployees(list);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const loadSchedules = async () => {
    try {
      // Ambil 14 hari rentang jadwal untuk tampilan roster mingguan
      const startStr = currentWeekStart.toISOString().split('T')[0];
      const endD = new Date(currentWeekStart);
      endD.setDate(endD.getDate() + 13);
      const endStr = endD.toISOString().split('T')[0];

      const res = await api.schedule.getAll(undefined, startStr, endStr);
      setSchedules(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    }
  };

  // Week Days Array (7 Days from currentWeekStart)
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d);
      const dayNumber = d.getDate();
      return { date: d, dateStr, dayName, dayNumber, isToday };
    });
  }, [currentWeekStart]);

  // Navigate Weeks
  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handleCurrentWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  // Open Add/Edit Modal
  const handleOpenAdd = (employeeId?: string, dateStr?: string) => {
    setEditingSchedule(null);
    setFormData({
      employeeId: employeeId || (employees[0]?.id || ''),
      date: dateStr || selectedDate,
      shiftType: 'morning',
      startTime: '08:00',
      endTime: '16:00',
      location: 'NOC Central Basecamp',
      notes: 'Piket operasional shift pagi',
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (sch: Schedule) => {
    setEditingSchedule(sch);
    setFormData({
      employeeId: sch.employeeId,
      date: new Date(sch.date).toISOString().split('T')[0],
      shiftType: sch.shiftType,
      startTime: sch.startTime || '08:00',
      endTime: sch.endTime || '16:00',
      location: sch.location || 'NOC Central Basecamp',
      notes: sch.notes || '',
    });
    setShowAddEditModal(true);
  };

  // Save Schedule
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      showAudiraToast.error('Pilih karyawan terlebih dahulu!', 'Validasi');
      return;
    }

    setActionLoading(true);
    try {
      if (editingSchedule) {
        await api.schedule.update(editingSchedule.id, formData);
        showAudiraToast.success('Jadwal shift berhasil diperbarui!', 'Tersimpan');
      } else {
        await api.schedule.create(formData);
        showAudiraToast.success('Jadwal shift berhasil ditambahkan!', 'Tersimpan');
      }
      setShowAddEditModal(false);
      loadSchedules();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menyimpan jadwal shift', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Schedule
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Hapus jadwal shift ini?')) return;
    try {
      await api.schedule.delete(id);
      showAudiraToast.success('Jadwal shift berhasil dihapus', 'Dihapus');
      loadSchedules();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menghapus jadwal', 'Error');
    }
  };

  // Bulk Generator
  const handleRunBulkGenerator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkConfig.selectedEmployeeIds.length === 0) {
      showAudiraToast.error('Pilih minimal 1 karyawan untuk digenerate jadwal!', 'Validasi');
      return;
    }

    setActionLoading(true);
    try {
      const start = new Date(bulkConfig.startDate);
      const end = new Date(bulkConfig.endDate);
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays <= 0 || diffDays > 31) {
        showAudiraToast.error('Rentang generator maksimal 31 hari!', 'Peringatan');
        setActionLoading(false);
        return;
      }

      // Generate schedules per day
      let totalCreated = 0;
      for (let i = 0; i < diffDays; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        const daySchedules = bulkConfig.selectedEmployeeIds.map((empId, empIdx) => {
          let shiftType: 'morning' | 'afternoon' | 'night' | 'off' = 'morning';
          let startTime = '08:00';
          let endTime = '16:00';

          if (bulkConfig.pattern === '3shift') {
            // Rotasi 3 shift (Pagi, Sore, Malam, Off)
            const cycle = (i + empIdx) % 4;
            if (cycle === 0) {
              shiftType = 'morning';
              startTime = '08:00';
              endTime = '16:00';
            } else if (cycle === 1) {
              shiftType = 'afternoon';
              startTime = '16:00';
              endTime = '24:00';
            } else if (cycle === 2) {
              shiftType = 'night';
              startTime = '00:00';
              endTime = '08:00';
            } else {
              shiftType = 'off';
              startTime = '00:00';
              endTime = '00:00';
            }
          } else if (bulkConfig.pattern === 'office') {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            shiftType = isWeekend ? 'off' : 'morning';
            startTime = isWeekend ? '00:00' : '08:00';
            endTime = isWeekend ? '00:00' : '17:00';
          } else if (bulkConfig.pattern === 'weekend') {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            shiftType = isWeekend ? 'morning' : 'off';
            startTime = isWeekend ? '09:00' : '00:00';
            endTime = isWeekend ? '17:00' : '00:00';
          }

          return {
            employeeId: empId,
            shiftType,
            startTime,
            endTime,
            location: bulkConfig.defaultLocation,
            notes: `Auto-generated Roster ${bulkConfig.pattern}`,
          };
        });

        await api.schedule.createBulk({
          date: dateStr,
          schedules: daySchedules,
        });
        totalCreated += daySchedules.length;
      }

      showAudiraToast.success(`Berhasil meng-generate ${totalCreated} entri jadwal shift masal!`, 'Sukses');
      setShowBulkModal(false);
      loadSchedules();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal generate roster masal', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchDept = selectedDepartment === 'all' || e.department === selectedDepartment;
      const matchSearch =
        !searchEmployee ||
        e.fullName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        e.employeeNumber.toLowerCase().includes(searchEmployee.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [employees, selectedDepartment, searchEmployee]);

  // Daily Schedule List
  const dailySchedules = useMemo(() => {
    return schedules.filter((s) => {
      const sDate = new Date(s.date).toISOString().split('T')[0];
      return sDate === selectedDate;
    });
  }, [schedules, selectedDate]);

  // Helpers
  const getShiftBadge = (shift: string, time?: string) => {
    switch (shift) {
      case 'morning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Sun className="w-3 h-3" />
            <span>PAGI ({time || '08-16'})</span>
          </span>
        );
      case 'afternoon':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sunset className="w-3 h-3" />
            <span>SORE ({time || '16-24'})</span>
          </span>
        );
      case 'night':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Moon className="w-3 h-3" />
            <span>MALAM ({time || '00-08'})</span>
          </span>
        );
      case 'off':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <Coffee className="w-3 h-3" />
            <span>LIBUR (OFF)</span>
          </span>
        );
      default:
        return <span className="text-[10px] text-[var(--app-muted)] capitalize">{shift}</span>;
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (schedules.length === 0) {
      showAudiraToast.warning('Tidak ada jadwal untuk diekspor', 'Info');
      return;
    }

    const headers = ['Tanggal', 'NIK', 'Nama Karyawan', 'Departemen', 'Shift', 'Jam Masuk', 'Jam Pulang', 'Lokasi', 'Catatan'];
    const rows = schedules.map((s) => [
      `"${new Date(s.date).toLocaleDateString('id-ID')}"`,
      `"${s.employee?.employeeNumber || '-'}"`,
      `"${s.employee?.fullName || '-'}"`,
      `"${s.employee?.department || '-'}"`,
      `"${s.shiftType.toUpperCase()}"`,
      `"${s.startTime || '-'}"`,
      `"${s.endTime || '-'}"`,
      `"${s.location || '-'}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Roster_Shift_AUDIRA_${currentWeekStart.toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAudiraToast.success('Jadwal shift berhasil diekspor (CSV)!', 'Ekspor Sukses');
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Top Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[var(--app-card)] p-6 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-md">
                AUDIRA ISP 24/7 SHIFT ROSTER & DISPATCH
              </span>
              <span className="text-xs text-[var(--app-muted)] flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Matriks Rotasi Shift Lapangan & NOC
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--app-text)] tracking-tight">
              Jadwal Shift Kerja 24/7
            </h1>
            <p className="text-sm text-[var(--app-muted)] mt-1">
              Atur alokasi shift pagi, sore, malam, dan libur regu teknisi optik, NOC monitoring, serta helpdesk pelanggan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchInitialData}
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
              onClick={() => {
                setBulkConfig({
                  ...bulkConfig,
                  selectedEmployeeIds: employees.map((e) => e.id),
                });
                setShowBulkModal(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Generator Roster Masal</span>
            </button>

            <button
              onClick={() => handleOpenAdd()}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Shift</span>
            </button>
          </div>
        </div>

        {/* 5 Real-Time KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Total Scheduled */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--app-muted)]">Piket Hari Ini</span>
              <CalendarIcon className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] mt-2 font-mono">
              {dailySchedules.filter((s) => s.shiftType !== 'off').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Personel On-Duty</div>
          </div>

          {/* Morning Shift */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-500">Shift Pagi</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500 mt-2 font-mono">
              {dailySchedules.filter((s) => s.shiftType === 'morning').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">08:00 - 16:00 WIB</div>
          </div>

          {/* Afternoon Shift */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400">Shift Sore</span>
              <Sunset className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 mt-2 font-mono">
              {dailySchedules.filter((s) => s.shiftType === 'afternoon').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">16:00 - 24:00 WIB</div>
          </div>

          {/* Night Shift NOC */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400">Shift Malam NOC</span>
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400 mt-2 font-mono">
              {dailySchedules.filter((s) => s.shiftType === 'night').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">00:00 - 08:00 WIB</div>
          </div>

          {/* Day Off */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--app-muted)]">Libur (Off)</span>
              <Coffee className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] mt-2 font-mono">
              {dailySchedules.filter((s) => s.shiftType === 'off').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Istirahat Roster</div>
          </div>
        </div>

        {/* Date Navigator & Controls */}
        <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="p-2 text-[var(--app-text)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl transition-colors"
              title="Minggu Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleCurrentWeek}
              className="px-3 py-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/20 transition-colors"
            >
              Minggu Ini
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 text-[var(--app-text)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl transition-colors"
              title="Minggu Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[var(--app-text)] font-mono ml-2">
              {weekDays[0]?.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} -{' '}
              {weekDays[6]?.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
              <input
                type="text"
                placeholder="Cari nama karyawan..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Departemen</option>
              <option value="Teknisi Lapangan">Teknisi Lapangan</option>
              <option value="Network Operation Center">NOC Engineer</option>
              <option value="Customer Support & Billing">CS & Billing</option>
              <option value="Finance & Akuntansi">Finance</option>
            </select>

            <div className="flex items-center rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] p-1">
              <button
                onClick={() => setViewMode('roster')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'roster'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                Roster Mingguan
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'daily'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                Harian Detail
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Weekly Roster Matrix */}
        {viewMode === 'roster' ? (
          <div className="bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface)] text-[11px] font-bold text-[var(--app-muted)] uppercase">
                    <th className="px-4 py-3.5 w-64">Karyawan / Teknisi</th>
                    {weekDays.map((day) => (
                      <th
                        key={day.dateStr}
                        onClick={() => setSelectedDate(day.dateStr)}
                        className={`px-3 py-3.5 text-center cursor-pointer transition-colors ${
                          day.isToday ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-[var(--app-card)]'
                        }`}
                      >
                        <div className="font-bold text-[10px]">{day.dayName}</div>
                        <div className="text-sm font-mono mt-0.5">{day.dayNumber}</div>
                        {day.isToday && <span className="text-[9px] font-bold text-cyan-400 block">HARI INI</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-[var(--app-muted)]">
                        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <span>Memuat matriks roster shift...</span>
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[var(--app-muted)]">
                        Tidak ada data karyawan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-[var(--app-surface)]/60 transition-colors">
                        {/* Employee Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                              {emp.fullName.substring(0, 2)}
                            </div>
                            <div className="truncate">
                              <div className="font-bold text-[var(--app-text)] truncate">{emp.fullName}</div>
                              <div className="text-[10px] text-[var(--app-muted)] truncate">{emp.department}</div>
                            </div>
                          </div>
                        </td>

                        {/* 7 Days Cells */}
                        {weekDays.map((day) => {
                          const sch = schedules.find((s) => {
                            const sDate = new Date(s.date).toISOString().split('T')[0];
                            return s.employeeId === emp.id && sDate === day.dateStr;
                          });

                          return (
                            <td
                              key={day.dateStr}
                              onClick={() => {
                                if (sch) {
                                  handleOpenEdit(sch);
                                } else {
                                  handleOpenAdd(emp.id, day.dateStr);
                                }
                              }}
                              className={`px-2 py-2 text-center cursor-pointer transition-colors border-l border-[var(--app-border)] hover:bg-cyan-500/5 ${
                                day.isToday ? 'bg-cyan-500/5' : ''
                              }`}
                            >
                              {sch ? (
                                <div className="space-y-1">
                                  {getShiftBadge(sch.shiftType, `${sch.startTime?.substring(0, 2)}-${sch.endTime?.substring(0, 2)}`)}
                                </div>
                              ) : (
                                <span className="text-[10px] text-[var(--app-muted)] opacity-30 hover:opacity-100 font-mono">
                                  + Tambah
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* View Mode 2: Daily Schedule Detail */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">
                  Jadwal Shift Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </h3>
                <span className="text-xs text-[var(--app-muted)]">
                  Total Petugas Terjadwal: {dailySchedules.length} Personel
                </span>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
              />
            </div>

            {dailySchedules.length === 0 ? (
              <div className="bg-[var(--app-card)] p-16 rounded-xl border border-[var(--app-border)] text-center">
                <CalendarIcon className="w-12 h-12 text-[var(--app-muted)] stroke-[1.2] mx-auto mb-3" />
                <h4 className="text-sm font-bold text-[var(--app-text)]">Belum Ada Shift Terjadwal</h4>
                <p className="text-xs text-[var(--app-muted)] max-w-sm mx-auto mt-1">
                  Klik tombol &quot;+ Tambah Shift&quot; atau jalankan &quot;Generator Roster Masal&quot; untuk mengisi shift tanggal ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailySchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] p-4 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 border-b border-[var(--app-border)] pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs uppercase">
                            {sch.employee?.fullName.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--app-text)] text-xs">{sch.employee?.fullName}</div>
                            <div className="text-[10px] text-[var(--app-muted)] font-mono">{sch.employee?.department}</div>
                          </div>
                        </div>
                        {getShiftBadge(sch.shiftType)}
                      </div>

                      <div className="py-3 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--app-muted)]">Jam Kerja:</span>
                          <span className="font-mono font-bold text-[var(--app-text)]">
                            {sch.startTime} - {sch.endTime} WIB
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--app-muted)]">Lokasi:</span>
                          <span className="text-[var(--app-text)]">{sch.location || 'NOC'}</span>
                        </div>
                        {sch.notes && (
                          <div className="pt-1 text-[11px] text-[var(--app-muted)] italic">
                            Catatan: {sch.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--app-border)] flex items-center justify-between">
                      {sch.employee?.phone ? (
                        <a
                          href={`https://wa.me/${sch.employee.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-500 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <span></span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sch)}
                          className="p-1.5 text-[var(--app-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit Shift"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(sch.id)}
                          className="p-1.5 text-[var(--app-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Hapus Shift"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: TAMBAH / EDIT SHIFT                                              */}
        {/* ========================================================================= */}
        {showAddEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-md w-full border border-[var(--app-border)] shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-base font-bold text-[var(--app-text)]">
                    {editingSchedule ? 'Edit Jadwal Shift' : 'Tambah Jadwal Shift Baru'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--app-text)] mb-1">Pilih Karyawan / Teknisi *</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Pilih Karyawan --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.department || 'Staff'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--app-text)] mb-1">Tanggal *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--app-text)] mb-1">Tipe Shift *</label>
                    <select
                      value={formData.shiftType}
                      onChange={(e) => {
                        const shift = e.target.value as any;
                        let start = '08:00';
                        let end = '16:00';
                        if (shift === 'afternoon') {
                          start = '16:00';
                          end = '24:00';
                        } else if (shift === 'night') {
                          start = '00:00';
                          end = '08:00';
                        } else if (shift === 'off') {
                          start = '00:00';
                          end = '00:00';
                        }
                        setFormData({ ...formData, shiftType: shift, startTime: start, endTime: end });
                      }}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    >
                      <option value="morning">Shift Pagi (08:00 - 16:00)</option>
                      <option value="afternoon">Shift Sore (16:00 - 24:00)</option>
                      <option value="night">Shift Malam NOC (00:00 - 08:00)</option>
                      <option value="off">Libur (OFF Roster)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--app-text)] mb-1">Jam Mulai</label>
                    <input
                      type="text"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--app-text)] mb-1">Jam Selesai</label>
                    <input
                      type="text"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--app-text)] mb-1">Lokasi Kerja / Penugasan</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--app-text)] mb-1">Catatan</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2 font-semibold text-[var(--app-muted)] bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>{editingSchedule ? 'Simpan Perubahan' : 'Tetapkan Shift'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: BULK ROSTER GENERATOR (OTOMATIS 24/7)                             */}
        {/* ========================================================================= */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-lg w-full border border-[var(--app-border)] shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-[var(--app-text)]">
                    Generator Roster Masal ISP 24/7
                  </h3>
                </div>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRunBulkGenerator} className="space-y-4 text-xs">
                {/* Employee Multi-Select */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-[var(--app-text)]">
                      Pilih Karyawan ({bulkConfig.selectedEmployeeIds.length} Terpilih)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (bulkConfig.selectedEmployeeIds.length === employees.length) {
                          setBulkConfig({ ...bulkConfig, selectedEmployeeIds: [] });
                        } else {
                          setBulkConfig({ ...bulkConfig, selectedEmployeeIds: employees.map((e) => e.id) });
                        }
                      }}
                      className="text-[10px] text-cyan-500 font-bold hover:underline"
                    >
                      {bulkConfig.selectedEmployeeIds.length === employees.length ? 'Batal Pilih Semua' : 'Pilih Semua Tim'}
                    </button>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl">
                    {employees.map((emp) => {
                      const isSelected = bulkConfig.selectedEmployeeIds.includes(emp.id);
                      return (
                        <div
                          key={emp.id}
                          onClick={() => {
                            if (isSelected) {
                              setBulkConfig({
                                ...bulkConfig,
                                selectedEmployeeIds: bulkConfig.selectedEmployeeIds.filter((id) => id !== emp.id),
                              });
                            } else {
                              setBulkConfig({
                                ...bulkConfig,
                                selectedEmployeeIds: [...bulkConfig.selectedEmployeeIds, emp.id],
                              });
                            }
                          }}
                          className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-cyan-500/10 text-cyan-500 font-bold' : 'text-[var(--app-text)] hover:bg-[var(--app-card)]'
                          }`}
                        >
                          <span>{emp.fullName} ({emp.department})</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--app-text)] mb-1">Dari Tanggal *</label>
                    <input
                      type="date"
                      required
                      value={bulkConfig.startDate}
                      onChange={(e) => setBulkConfig({ ...bulkConfig, startDate: e.target.value })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--app-text)] mb-1">Sampai Tanggal *</label>
                    <input
                      type="date"
                      required
                      value={bulkConfig.endDate}
                      onChange={(e) => setBulkConfig({ ...bulkConfig, endDate: e.target.value })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Pattern */}
                <div>
                  <label className="block font-semibold text-[var(--app-text)] mb-1">Pola Jadwal Otomatis</label>
                  <select
                    value={bulkConfig.pattern}
                    onChange={(e) => setBulkConfig({ ...bulkConfig, pattern: e.target.value as any })}
                    className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                  >
                    <option value="3shift">Rotasi 3 Regu 3 Shift 24 Jam (Pagi, Sore, Malam, Libur)</option>
                    <option value="office">Office Hours Reguler (Senin - Jumat 08:00 - 17:00, Sabtu-Minggu OFF)</option>
                    <option value="weekend">Weekend Standby Only (Piket Sabtu & Minggu)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 font-semibold text-[var(--app-muted)] bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || bulkConfig.selectedEmployeeIds.length === 0}
                    className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>Eksekusi Generator Roster</span>
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
