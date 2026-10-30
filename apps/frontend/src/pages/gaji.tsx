import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { useToast } from '@/contexts/ToastContext';
import { 
  DollarSign, Plus, Search, Filter, Edit2, Trash2, Eye, CheckCircle, 
  Calendar, TrendingUp, X, Save, Printer, Building2, CreditCard, 
  Send, Award, Shield, FileText, Check, ChevronRight, RefreshCw, 
  Download, ArrowUpRight, ArrowDownRight, Wallet, Clock
} from 'lucide-react';

interface EmployeeItem {
  id: string;
  fullName: string;
  employeeNumber: string;
  department: string;
  position: string;
  baseSalary: number;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  phone?: string;
  email?: string;
}

interface SalaryRecord {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  period: string; // YYYY-MM
  baseSalary: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
  paymentMethod?: string;
  paymentRef?: string;
  notes?: string;
}

interface SalaryStats {
  totalSalaries: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
}

// Terbilang converter helper (IDR)
function angkaTerbilang(angka: number): string {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (angka < 12) return bilangan[angka];
  if (angka < 20) return angkaTerbilang(angka - 10) + ' Belas';
  if (angka < 100) return angkaTerbilang(Math.floor(angka / 10)) + ' Puluh ' + bilangan[angka % 10];
  if (angka < 200) return 'Seratus ' + angkaTerbilang(angka - 100);
  if (angka < 1000) return angkaTerbilang(Math.floor(angka / 100)) + ' Ratus ' + angkaTerbilang(angka % 100);
  if (angka < 2000) return 'Seribu ' + angkaTerbilang(angka - 100);
  if (angka < 1000000) return angkaTerbilang(Math.floor(angka / 1000)) + ' Ribu ' + angkaTerbilang(angka % 1000);
  if (angka < 1000000000) return angkaTerbilang(Math.floor(angka / 1000000)) + ' Juta ' + angkaTerbilang(angka % 1000000);
  return angka.toString();
}

export default function Gaji() {
  const router = useRouter();
  const { toast } = useToast();
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [stats, setStats] = useState<SalaryStats>({
    totalSalaries: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    paidCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>(new Date().toISOString().slice(0, 7));
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Forms
  const [formData, setFormData] = useState({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7),
    baseSalary: 4500000,
    allowances: 500000,
    overtime: 350000,
    bonus: 500000, // Insentif PSB
    deductions: 90000, // BPJS
    notes: 'Gaji Bulanan & Insentif PSB Lapangan',
  });

  const [paymentRefData, setPaymentRefData] = useState({
    paymentMethod: 'BCA Virtual Account / Transfer',
    paymentRef: `PAY-AUDIRA-${Date.now().toString().slice(-6)}`,
  });

  useEffect(() => {
    loadData();
  }, [periodFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [salariesData, statsData, employeesData] = await Promise.all([
        api.salary.getAll(periodFilter).catch(() => []),
        api.salary.getStats(periodFilter).catch(() => ({
          totalSalaries: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          paidCount: 0,
          pendingCount: 0,
        })),
        api.employee.getAll('active').catch(() => []),
      ]);

      setSalaries(salariesData || []);
      setStats(statsData || {
        totalSalaries: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        paidCount: 0,
        pendingCount: 0,
      });
      setEmployees(employeesData || []);
    } catch (err) {
      console.error('Error loading salary data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    const firstEmp = employees[0];
    setFormData({
      employeeId: firstEmp?.id || '',
      period: periodFilter,
      baseSalary: firstEmp?.baseSalary || 4500000,
      allowances: 500000,
      overtime: 350000,
      bonus: 500000,
      deductions: 90000,
      notes: 'Gaji Pokok + Insentif PSB + Tunjangan ISP',
    });
    setSelectedSalary(null);
    setShowModal(true);
  };

  const handleEmployeeSelect = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    setFormData(prev => ({
      ...prev,
      employeeId: empId,
      baseSalary: emp?.baseSalary || prev.baseSalary,
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast.warning('Pilih karyawan terlebih dahulu.');
      return;
    }

    try {
      setSubmitting(true);
      const totalSalary = Number(formData.baseSalary) + Number(formData.allowances) + 
                          Number(formData.overtime) + Number(formData.bonus) - Number(formData.deductions);

      const payload = {
        ...formData,
        baseSalary: Number(formData.baseSalary),
        allowances: Number(formData.allowances),
        overtime: Number(formData.overtime),
        bonus: Number(formData.bonus),
        deductions: Number(formData.deductions),
        totalSalary,
        status: selectedSalary ? selectedSalary.status : 'pending',
      };

      if (selectedSalary) {
        await api.salary.update(selectedSalary.id, payload);
        toast.success('Data slip gaji berhasil diperbarui.');
      } else {
        await api.salary.create(payload);
        toast.success('Slip gaji baru berhasil dibuat.');
      }

      setShowModal(false);
      loadData();
    } catch (err: any) {
      console.error('Error saving salary:', err);
      toast.error(`Gagal menyimpan gaji: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Generate bulk payroll for all employees in one click
  const handleBulkGenerate = async () => {
    if (employees.length === 0) {
      toast.warning('Tidak ada karyawan aktif.');
      return;
    }

    try {
      setSubmitting(true);
      const empIds = employees.map(e => e.id);
      await api.salary.createBulk({
        period: periodFilter,
        employeeIds: empIds,
      });
      toast.success(`Berhasil membuat slip gaji periode ${periodFilter} untuk ${empIds.length} staf!`);
      setShowBulkModal(false);
      loadData();
    } catch (err: any) {
      console.error('Error bulk generate:', err);
      toast.error(`Gagal generate slip gaji massal: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Open mark as paid modal
  const handleOpenPay = (salary: SalaryRecord) => {
    setSelectedSalary(salary);
    setPaymentRefData({
      paymentMethod: salary.employee?.bankName ? `Transfer Bank ${salary.employee.bankName}` : 'Transfer Bank BCA',
      paymentRef: `PAY-${salary.employee?.employeeNumber || 'STAFF'}-${Date.now().toString().slice(-6)}`,
    });
    setShowPayModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedSalary) return;
    try {
      setSubmitting(true);
      await api.salary.markAsPaid(selectedSalary.id, paymentRefData);
      toast.success('Gaji berhasil ditandai sebagai SUDAH DITRANSFER (Lunas).');
      setShowPayModal(false);
      loadData();
    } catch (err: any) {
      toast.error(`Gagal konfirmasi pembayaran: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSalary = async (id: string) => {
    if (!confirm('Hapus catatan slip gaji ini?')) return;
    try {
      await api.salary.delete(id);
      toast.success('Data gaji berhasil dihapus.');
      loadData();
    } catch (err: any) {
      toast.error(`Gagal menghapus: ${err.message}`);
    }
  };

  // Send WhatsApp Slip
  const handleSendWhatsApp = (salary: SalaryRecord) => {
    const phone = salary.employee?.phone || '081234567890';
    const cleanPhone = phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const net = salary.totalSalary || (salary.baseSalary + salary.allowances + salary.overtime + salary.bonus - salary.deductions);
    const msg = `*SLIP GAJI DIGITAL AUDIRA NET & BILLING*%0A` +
      `Periode: ${salary.period}%0A` +
      `NIP: ${salary.employee?.employeeNumber}%0A` +
      `Nama: ${salary.employee?.fullName}%0A` +
      `Jabatan: ${salary.employee?.position}%0A%0A` +
      `*PENERIMAAN:*%0A` +
      `- Gaji Pokok: Rp ${salary.baseSalary.toLocaleString('id-ID')}%0A` +
      `- Tunjangan: Rp ${salary.allowances.toLocaleString('id-ID')}%0A` +
      `- Lembur / Shift Malam: Rp ${salary.overtime.toLocaleString('id-ID')}%0A` +
      `- Insentif PSB: Rp ${salary.bonus.toLocaleString('id-ID')}%0A%0A` +
      `*POTONGAN (BPJS/PPH):*%0A` +
      `- Potongan: Rp ${salary.deductions.toLocaleString('id-ID')}%0A%0A` +
      `*TOTAL DITERIMA (TAKE HOME PAY): Rp ${net.toLocaleString('id-ID')}*%0A` +
      `Status: ${salary.status === 'paid' ? 'SUDAH DITRANSFER (LUNAS)' : 'PENDING'}%0A%0A` +
      `_Dokumen resmi diterbitkan oleh PT AUDIRA SUKSES MANDIRI_`;

    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  // Open Printable Digital Slip
  const handleViewSlip = (salary: SalaryRecord) => {
    setSelectedSalary(salary);
    setShowSlipModal(true);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  // Filter salaries
  const filteredSalaries = salaries.filter(s => {
    const empName = (s.employee?.fullName || '').toLowerCase();
    const empNo = (s.employee?.employeeNumber || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchSearch = empName.includes(query) || empNo.includes(query);
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Layout>
      <Head>
        <title>Penggajian & Payroll Staf | AUDIRA NET & BILLING</title>
      </Head>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Top Header Command Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                PAYROLL & REMUNERASI ISP
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                TERMASUK INSENTIF PSB FTTH
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--app-text)] mt-1.5 tracking-tight flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-emerald-500" />
              Penggajian (Payroll) & Insentif Karyawan
            </h1>
            <p className="text-sm text-[var(--app-muted)]">
              Kalkulasi gaji pokok, tunjangan shift malam, insentif pemasangan PSB baru, dan cetak slip gaji digital AUDIRA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Period Selector */}
            <div className="flex items-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] px-3 py-1.5 rounded-xl text-xs">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span className="font-semibold text-[var(--app-muted)]">Periode:</span>
              <input
                type="month"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="bg-transparent text-[var(--app-text)] outline-none font-bold cursor-pointer"
              />
            </div>

            {/* Bulk Generate Button */}
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 font-bold rounded-xl text-xs border border-purple-500/30 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate Massal</span>
            </button>

            {/* Add Salary */}
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Slip Gaji</span>
            </button>
          </div>
        </div>

        {/* 5 Realtime Financial KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--app-muted)] mb-1">
              <span>Total Anggaran Gaji</span>
              <Wallet className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--app-text)] font-mono">
              Rp {((stats.totalAmount || 0) / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">{stats.totalSalaries || salaries.length} Slip Periode Ini</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold mb-1">
              <span>Sudah Ditransfer</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">
              Rp {((stats.paidAmount || 0) / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">{stats.paidCount || 0} Karyawan (Lunas)</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-500 font-semibold mb-1">
              <span>Menunggu Transfer</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-500 font-mono">
              Rp {((stats.pendingAmount || 0) / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">{stats.pendingCount || 0} Antrian Payroll</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-blue-500 font-semibold mb-1">
              <span>Insentif PSB Lapangan</span>
              <Award className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-500 font-mono">
              Rp {(salaries.reduce((acc, s) => acc + (s.bonus || 0), 0) / 1000).toLocaleString('id-ID')} Rb
            </div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">Rp 50.000 / Pasang Baru</div>
          </div>

          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs text-purple-500 font-semibold mb-1">
              <span>Iuran BPJS & Pajak</span>
              <Shield className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-500 font-mono">
              Rp {(salaries.reduce((acc, s) => acc + (s.deductions || 0), 0) / 1000).toLocaleString('id-ID')} Rb
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">Ketenagakerjaan & PPh 21</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
            <input
              type="text"
              placeholder="Cari nama atau NIP staf..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Transfer (Pending)</option>
              <option value="paid">Sudah Ditransfer (Lunas)</option>
            </select>

            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
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

        {/* Salaries Table */}
        <div className="bg-[var(--app-card)] rounded-2xl border border-[var(--app-border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-[var(--app-text)]">
                Daftar Penggajian Bulan {periodFilter} ({filteredSalaries.length} Slip)
              </span>
            </div>
            <span className="text-xs text-[var(--app-muted)]">
              Standar Payroll ISP: Transfer serentak setiap tanggal 28-30.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--app-text)]">
              <thead className="bg-[var(--app-bg)] text-xs text-[var(--app-muted)] uppercase border-b border-[var(--app-border)]">
                <tr>
                  <th className="px-5 py-3.5">Karyawan</th>
                  <th className="px-5 py-3.5">Bank & Rekening</th>
                  <th className="px-5 py-3.5">Gaji Pokok</th>
                  <th className="px-5 py-3.5">Tunjangan & Lembur</th>
                  <th className="px-5 py-3.5">Insentif PSB</th>
                  <th className="px-5 py-3.5">Potongan</th>
                  <th className="px-5 py-3.5">Total Diterima</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {filteredSalaries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-xs text-[var(--app-muted)]">
                      {salaries.length === 0
                        ? `Belum ada data slip gaji pada periode ${periodFilter}. Silakan klik 'Generate Massal' atau 'Tambah Slip Gaji'.`
                        : 'Tidak ada data slip gaji yang sesuai dengan filter pencarian.'}
                    </td>
                  </tr>
                ) : (
                  filteredSalaries.map((salary) => {
                    const netSalary = salary.totalSalary || (salary.baseSalary + salary.allowances + salary.overtime + salary.bonus - salary.deductions);
                    return (
                      <tr key={salary.id} className="hover:bg-[var(--app-bg)]/60 transition">
                        {/* Employee */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-sm">
                              {(salary.employee?.fullName || 'K').charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-[var(--app-text)]">
                                {salary.employee?.fullName || 'Karyawan'}
                              </div>
                              <div className="text-xs text-[var(--app-muted)] font-mono">
                                {salary.employee?.employeeNumber || '-'} &bull; {salary.employee?.position || '-'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Bank info */}
                        <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                          <div className="font-semibold text-[var(--app-text)] flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-[var(--app-muted)]" />
                            {salary.employee?.bankName || 'BCA'}
                          </div>
                          <div className="text-[var(--app-muted)] font-mono">
                            {salary.employee?.bankAccount || '822000000'}
                          </div>
                        </td>

                        {/* Base Salary */}
                        <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                          Rp {salary.baseSalary.toLocaleString('id-ID')}
                        </td>

                        {/* Allowances & Overtime */}
                        <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                          Rp {(salary.allowances + salary.overtime).toLocaleString('id-ID')}
                        </td>

                        {/* PSB Bonus */}
                        <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap text-blue-600 font-semibold">
                          + Rp {salary.bonus.toLocaleString('id-ID')}
                        </td>

                        {/* Deductions */}
                        <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap text-rose-500">
                          - Rp {salary.deductions.toLocaleString('id-ID')}
                        </td>

                        {/* Total Net */}
                        <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap font-bold text-emerald-600 text-sm">
                          Rp {netSalary.toLocaleString('id-ID')}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {salary.status === 'paid' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3.5 h-3.5" /> Lunas
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Slip Gaji Resmi */}
                            <button
                              onClick={() => handleViewSlip(salary)}
                              className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-500/10 transition"
                              title="Lihat & Cetak Slip Gaji"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Kirim WhatsApp */}
                            <button
                              onClick={() => handleSendWhatsApp(salary)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/10 transition"
                              title="Kirim Notifikasi Slip WhatsApp"
                            >
                              <Send className="w-4 h-4" />
                            </button>

                            {/* Mark as paid */}
                            {salary.status !== 'paid' && (
                              <button
                                onClick={() => handleOpenPay(salary)}
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                                title="Tandai Sudah Ditransfer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Bayar</span>
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteSalary(salary.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                              title="Hapus Slip"
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

      {/* Slip Gaji Digital Resmi AUDIRA Modal */}
      {showSlipModal && selectedSalary && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-2xl w-full p-8 text-[var(--app-text)] shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--app-border)] print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                  DOKUMEN RESMI GAJI
                </span>
                <span className="text-xs text-[var(--app-muted)] font-mono">
                  REF: {selectedSalary.paymentRef || `PAY-${selectedSalary.id.slice(0, 8)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSlip}
                  className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="w-8 h-8 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Slip Content Area */}
            <div id="printable-salary-slip" className="my-6 space-y-6">
              {/* Slip Header Letterhead */}
              <div className="border-b-2 border-slate-700/80 pb-5 text-center relative">
                <div className="text-xl font-black tracking-wider text-cyan-500 uppercase">
                  PT AUDIRA SUKSES MANDIRI
                </div>
                <div className="text-xs text-[var(--app-muted)]">
                  Layanan Internet Broadband & Dedicated Network Solutions
                </div>
                <div className="text-xs text-[var(--app-muted)] font-mono">
                  Website: https://audira.my.id &bull; Email: billing@audira.my.id &bull; Hotline: +62 821-1200-1600
                </div>
                <div className="mt-4 inline-block px-4 py-1 rounded-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs font-extrabold tracking-widest uppercase">
                  SLIP GAJI & REMUNERASI KARYAWAN
                </div>
              </div>

              {/* Employee Meta Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[var(--app-bg)] p-4 rounded-xl border border-[var(--app-border)]">
                <div className="space-y-1.5">
                  <div className="flex">
                    <span className="w-28 text-[var(--app-muted)]">Nama Karyawan</span>
                    <span className="font-bold">: {selectedSalary.employee?.fullName || 'Karyawan'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-[var(--app-muted)]">Nomor Induk (NIP)</span>
                    <span className="font-mono font-bold">: {selectedSalary.employee?.employeeNumber || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-[var(--app-muted)]">Departemen</span>
                    <span>: {selectedSalary.employee?.department || '-'}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex">
                    <span className="w-28 text-[var(--app-muted)]">Periode Gaji</span>
                    <span className="font-bold text-cyan-500">: {selectedSalary.period}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-[var(--app-muted)]">Jabatan</span>
                    <span>: {selectedSalary.employee?.position || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-[var(--app-muted)]">Rekening Bank</span>
                    <span className="font-mono">: {selectedSalary.employee?.bankName || 'BCA'} - {selectedSalary.employee?.bankAccount || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Earnings vs Deductions Breakdown Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Penerimaan */}
                <div className="space-y-2 border border-[var(--app-border)] rounded-xl p-4 bg-[var(--app-card)]">
                  <div className="font-bold text-sm text-emerald-500 pb-2 border-b border-[var(--app-border)] flex items-center justify-between">
                    <span>A. PENERIMAAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                    <span className="text-[var(--app-muted)]">Gaji Pokok Standar</span>
                    <span className="font-mono font-semibold">Rp {selectedSalary.baseSalary.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                    <span className="text-[var(--app-muted)]">Tunjangan Jabatan & Ops</span>
                    <span className="font-mono font-semibold">Rp {selectedSalary.allowances.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                    <span className="text-[var(--app-muted)]">Insentif PSB Lapangan</span>
                    <span className="font-mono font-semibold text-blue-500">Rp {selectedSalary.bonus.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--app-muted)]">Uang Lembur / Shift Malam</span>
                    <span className="font-mono font-semibold">Rp {selectedSalary.overtime.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--app-border)] flex justify-between font-bold text-emerald-600">
                    <span>Total Penerimaan (A):</span>
                    <span className="font-mono">
                      Rp {(selectedSalary.baseSalary + selectedSalary.allowances + selectedSalary.bonus + selectedSalary.overtime).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Potongan */}
                <div className="space-y-2 border border-[var(--app-border)] rounded-xl p-4 bg-[var(--app-card)]">
                  <div className="font-bold text-sm text-rose-500 pb-2 border-b border-[var(--app-border)] flex items-center justify-between">
                    <span>B. POTONGAN</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                    <span className="text-[var(--app-muted)]">BPJS Ketenagakerjaan (1%)</span>
                    <span className="font-mono font-semibold">Rp {Math.round(selectedSalary.deductions * 0.5).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--app-border)]/50">
                    <span className="text-[var(--app-muted)]">BPJS Kesehatan (1%)</span>
                    <span className="font-mono font-semibold">Rp {Math.round(selectedSalary.deductions * 0.5).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--app-muted)]">Potongan Keterlambatan</span>
                    <span className="font-mono font-semibold">Rp 0</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--app-border)] flex justify-between font-bold text-rose-500">
                    <span>Total Potongan (B):</span>
                    <span className="font-mono">Rp {selectedSalary.deductions.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Total Take Home Pay Banner */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    GAJI BERSIH DITERIMA (TAKE HOME PAY)
                  </div>
                  <div className="text-xs text-[var(--app-muted)] italic mt-0.5">
                    Terbilang: &quot;{angkaTerbilang(selectedSalary.totalSalary || (selectedSalary.baseSalary + selectedSalary.allowances + selectedSalary.overtime + selectedSalary.bonus - selectedSalary.deductions))} Rupiah&quot;
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  Rp {(selectedSalary.totalSalary || (selectedSalary.baseSalary + selectedSalary.allowances + selectedSalary.overtime + selectedSalary.bonus - selectedSalary.deductions)).toLocaleString('id-ID')}
                </div>
              </div>

              {/* Signature and Verification Footer */}
              <div className="grid grid-cols-2 pt-6 border-t border-[var(--app-border)] text-xs text-center">
                <div className="space-y-12">
                  <div className="text-[var(--app-muted)]">Penerima,</div>
                  <div className="font-bold underline text-[var(--app-text)]">
                    {selectedSalary.employee?.fullName}
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="text-[var(--app-muted)]">Bekasi, Direktur Operasional & HRD</div>
                  <div className="font-bold underline text-[var(--app-text)]">
                    Agus Dwi Rianto (AUDIRA)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 text-[var(--app-text)] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                {selectedSalary ? 'Edit Slip Gaji' : 'Formulir Slip Gaji Karyawan'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="my-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">Karyawan:</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeNumber}) - {emp.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Periode (Bulan):</label>
                  <input
                    type="month"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Gaji Pokok (Rp):</label>
                  <input
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Tunjangan:</label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Lembur Shift:</label>
                  <input
                    type="number"
                    value={formData.overtime}
                    onChange={(e) => setFormData({ ...formData, overtime: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--app-muted)] block mb-1">Insentif PSB:</label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">
                  Potongan BPJS & Absensi (Rp):
                </label>
                <input
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">Catatan Remunerasi:</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Keterangan lembur perbaikan kabel FO, insentif PSB, dll..."
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-between items-center text-xs font-bold text-emerald-600">
                <span>Total Estimasi Gaji Bersih:</span>
                <span className="text-base font-mono">
                  Rp {(Number(formData.baseSalary) + Number(formData.allowances) + Number(formData.overtime) + Number(formData.bonus) - Number(formData.deductions)).toLocaleString('id-ID')}
                </span>
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
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Slip Gaji'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Generate Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 text-[var(--app-text)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-500" />
                Generate Payroll Massal
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <p className="text-[var(--app-muted)]">
                Sistem akan membuat slip gaji otomatis untuk seluruh <strong className="text-[var(--app-text)]">{employees.length} Karyawan Aktif</strong> pada periode terpilih:
              </p>
              <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl font-bold text-center text-cyan-500 text-sm font-mono">
                Bulan: {periodFilter}
              </div>
              <p className="text-slate-400 text-[11px]">
                Komponen gaji pokok, tunjangan, dan nomor rekening akan disinkronkan langsung dari profil master data karyawan.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-border)] text-[var(--app-text)] font-semibold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleBulkGenerate}
                disabled={submitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{submitting ? 'Memproses...' : 'Jalankan Payroll Massal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Confirmation Modal */}
      {showPayModal && selectedSalary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 text-[var(--app-text)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Konfirmasi Transfer Payroll
              </h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-[var(--app-text)] flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] space-y-1">
                <div className="font-bold text-sm">{selectedSalary.employee?.fullName}</div>
                <div className="text-[var(--app-muted)] font-mono">
                  {selectedSalary.employee?.bankName} - {selectedSalary.employee?.bankAccount} ({selectedSalary.employee?.bankAccountName || selectedSalary.employee?.fullName})
                </div>
                <div className="text-emerald-500 font-bold font-mono text-base pt-1">
                  Nominal: Rp {(selectedSalary.totalSalary || (selectedSalary.baseSalary + selectedSalary.allowances + selectedSalary.overtime + selectedSalary.bonus - selectedSalary.deductions)).toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">Metode Transfer:</label>
                <input
                  type="text"
                  value={paymentRefData.paymentMethod}
                  onChange={(e) => setPaymentRefData({ ...paymentRefData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--app-muted)] block mb-1">Nomor Referensi Transfer / Bukti:</label>
                <input
                  type="text"
                  value={paymentRefData.paymentRef}
                  onChange={(e) => setPaymentRefData({ ...paymentRefData, paymentRef: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-border)] text-[var(--app-text)] font-semibold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={submitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {submitting ? 'Menyimpan...' : 'Konfirmasi Lunas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
