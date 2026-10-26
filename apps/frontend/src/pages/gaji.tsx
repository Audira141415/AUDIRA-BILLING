import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { DollarSign, Plus, Search, Filter, Edit2, Trash2, Eye, CheckCircle, Calendar, TrendingUp, X, Save, Printer } from 'lucide-react';

export default function Gaji() {
  const router = useRouter();
  const [salaries, setSalaries] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7),
    baseSalary: 0,
    allowances: 0,
    overtime: 0,
    bonus: 0,
    deductions: 0,
    status: 'pending',
  });
  const [bulkData, setBulkData] = useState<any>({
    period: new Date().toISOString().slice(0, 7),
    employeeIds: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadSalaries();
    loadStats();
    loadEmployees();
  }, [router]);

  const loadSalaries = async () => {
    try {
      setLoading(true);
      const data = await api.salary.getAll();
      setSalaries(data);
    } catch (error) {
      console.error('Failed to load salaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.salary.getStats();
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
      period: new Date().toISOString().slice(0, 7),
      baseSalary: 0,
      allowances: 0,
      overtime: 0,
      bonus: 0,
      deductions: 0,
      status: 'pending',
    });
    setSelectedSalary(null);
    setShowModal(true);
  };

  const handleEdit = (salary: any) => {
    setSelectedSalary(salary);
    setFormData({
      employeeId: salary.employeeId,
      period: salary.period,
      baseSalary: salary.baseSalary,
      allowances: salary.allowances,
      overtime: salary.overtime,
      bonus: salary.bonus,
      deductions: salary.deductions,
      status: salary.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSalary) {
        await api.salary.update(selectedSalary.id, formData);
        alert('Data gaji berhasil diupdate');
      } else {
        await api.salary.create(formData);
        alert('Data gaji berhasil ditambahkan');
      }
      setShowModal(false);
      loadSalaries();
      loadStats();
    } catch (error) {
      console.error('Failed to save salary:', error);
      alert('Gagal menyimpan data gaji');
    }
  };

  const handleBulkCreate = async () => {
    if (bulkData.employeeIds.length === 0) {
      alert('Pilih minimal 1 karyawan');
      return;
    }
    try {
      await api.salary.createBulk(bulkData);
      alert(`Berhasil membuat ${bulkData.employeeIds.length} slip gaji`);
      setShowBulkModal(false);
      loadSalaries();
      loadStats();
    } catch (error) {
      console.error('Failed to create bulk salaries:', error);
      alert('Gagal membuat slip gaji massal');
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    if (!confirm('Tandai gaji ini sebagai sudah dibayar?')) return;
    try {
      await api.salary.markAsPaid(id, {
        paymentMethod: 'transfer',
        paymentRef: `PAY-${Date.now()}`,
      });
      alert('Gaji berhasil ditandai sebagai dibayar');
      loadSalaries();
      loadStats();
    } catch (error) {
      console.error('Failed to mark as paid:', error);
      alert('Gagal menandai gaji sebagai dibayar');
    }
  };

  const handlePrint = (salary: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Slip Gaji - ${salary.employee?.fullName}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          @media print {
            @page { margin: 20mm; }
            body { margin: 0; }
          }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .slip-title {
            font-size: 20px;
            margin-top: 10px;
            color: #666;
          }
          .info-section {
            margin: 30px 0;
          }
          .info-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-label {
            width: 200px;
            font-weight: bold;
            color: #555;
          }
          .info-value {
            flex: 1;
            color: #333;
          }
          .salary-table {
            width: 100%;
            margin: 30px 0;
            border-collapse: collapse;
          }
          .salary-table th {
            background: #f5f5f5;
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
          }
          .salary-table td {
            padding: 10px 12px;
            border: 1px solid #ddd;
          }
          .amount {
            text-align: right;
            font-family: 'JetBrains Mono', monospace;
            font-feature-settings: "tnum" 1;
          }
          .total-row {
            font-weight: bold;
            background: #f9f9f9;
            font-size: 16px;
          }
          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .signature {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            margin-top: 60px;
            border-top: 1px solid #333;
            padding-top: 5px;
          }
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
          @media print {
            .print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print</button>
        
        <div class="header">
          <div class="company-name">AUDIRA BILLING SYSTEM</div>
          <div class="slip-title">SLIP GAJI KARYAWAN</div>
        </div>

        <div class="info-section">
          <div class="info-row">
            <div class="info-label">Nama Karyawan</div>
            <div class="info-value">${salary.employee?.fullName || '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">NIK</div>
            <div class="info-value">${salary.employee?.employeeNumber || '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Departemen</div>
            <div class="info-value">${salary.employee?.department || '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Posisi</div>
            <div class="info-value">${salary.employee?.position || '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Periode</div>
            <div class="info-value">${formatPeriod(salary.period)}</div>
          </div>
        </div>

        <table class="salary-table">
          <thead>
            <tr>
              <th>Komponen</th>
              <th class="amount">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gaji Pokok</td>
              <td class="amount">${formatCurrency(salary.baseSalary)}</td>
            </tr>
            <tr>
              <td>Tunjangan</td>
              <td class="amount">${formatCurrency(salary.allowances)}</td>
            </tr>
            <tr>
              <td>Lembur</td>
              <td class="amount">${formatCurrency(salary.overtime)}</td>
            </tr>
            <tr>
              <td>Bonus</td>
              <td class="amount">${formatCurrency(salary.bonus)}</td>
            </tr>
            <tr>
              <td>Potongan</td>
              <td class="amount">(${formatCurrency(salary.deductions)})</td>
            </tr>
            <tr class="total-row">
              <td><strong>TOTAL GAJI</strong></td>
              <td class="amount"><strong>${formatCurrency(salary.totalSalary)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="info-section">
          <div class="info-row">
            <div class="info-label">Status Pembayaran</div>
            <div class="info-value">${salary.status === 'paid' ? '✓ Sudah Dibayar' : '⏳ Pending'}</div>
          </div>
          ${salary.paidAt ? `
          <div class="info-row">
            <div class="info-label">Tanggal Bayar</div>
            <div class="info-value">${new Date(salary.paidAt).toLocaleDateString('id-ID')}</div>
          </div>
          ` : ''}
        </div>

        <div class="footer">
          <div class="signature">
            <div>Karyawan</div>
            <div class="signature-line">${salary.employee?.fullName || ''}</div>
          </div>
          <div class="signature">
            <div>Finance/HRD</div>
            <div class="signature-line">(.............................)</div>
          </div>
        </div>

        <p style="text-align: center; margin-top: 40px; color: #999; font-size: 12px;">
          Dicetak pada: ${new Date().toLocaleString('id-ID')}
        </p>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data gaji ini?')) return;
    try {
      await api.salary.delete(id);
      alert('Data gaji berhasil dihapus');
      loadSalaries();
      loadStats();
    } catch (error) {
      console.error('Failed to delete salary:', error);
      alert('Gagal menghapus data gaji');
    }
  };

  const filteredSalaries = salaries.filter(salary => {
    const matchSearch = salary.employee?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       salary.employee?.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPeriod = !periodFilter || salary.period === periodFilter;
    const matchStatus = statusFilter === 'all' || salary.status === statusFilter;
    return matchSearch && matchPeriod && matchStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const calculateTotal = () => {
    return formData.baseSalary + formData.allowances + formData.overtime + formData.bonus - formData.deductions;
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-2">
            <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
            <span>/</span>
            <Link href="/hrm-dashboard" className="hover:text-[var(--app-text)]">Human Resource Management</Link>
            <span>/</span>
            <span className="text-blue-500 font-semibold">Penggajian (Payroll)</span>
          </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--app-text)] flex items-center gap-3">
              <DollarSign className="text-green-600" size={36} />
              Gaji & Payroll
            </h1>
            <p className="text-[var(--app-muted)] mt-1">Kelola penggajian karyawan</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              <TrendingUp size={20} />
              Generate Payroll
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Plus size={20} />
              Tambah Slip Gaji
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm">Total Gaji</p>
              <h3 className="text-2xl font-bold mt-2">{formatCurrency(stats.totalAmount)}</h3>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm">Sudah Dibayar</p>
              <h3 className="text-2xl font-bold mt-2">{formatCurrency(stats.paidAmount)}</h3>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-yellow-100 text-sm">Pending</p>
              <h3 className="text-2xl font-bold mt-2">{formatCurrency(stats.pendingAmount)}</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm">Total Slip</p>
              <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
            </div>
          </div>
        )}

        <div className="bg-[var(--app-card)] rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-[var(--app-muted)]" size={20} />
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <input
              type="month"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Sudah Dibayar</option>
            </select>
          </div>
        </div>

        <div className="bg-[var(--app-card)] rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--app-bg)] border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase">Periode</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase">Karyawan</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--app-muted)] uppercase">Gaji Pokok</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--app-muted)] uppercase">Tunjangan</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--app-muted)] uppercase">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-muted)] uppercase">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--app-muted)] uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
                ) : filteredSalaries.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center">Tidak ada data</td></tr>
                ) : (
                  filteredSalaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-[var(--app-bg)]">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatPeriod(salary.period)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{salary.employee?.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(salary.baseSalary)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(salary.allowances)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">{formatCurrency(salary.totalSalary)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(salary.status)}`}>
                          {salary.status === 'paid' ? 'Dibayar' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handlePrint(salary)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                            title="Print Slip Gaji"
                          >
                            <Printer size={18} />
                          </button>
                          {salary.status === 'pending' && (
                            <button
                              onClick={() => handleMarkAsPaid(salary.id)}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg"
                              title="Tandai Dibayar"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button onClick={() => handleEdit(salary)} className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(salary.id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg">
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

        {/* Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="bg-green-600 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-[var(--app-text)]">{selectedSalary ? 'Edit Slip Gaji' : 'Tambah Slip Gaji'}</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-green-700 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Karyawan *</label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => {
                        const emp = employees.find(e => e.id === e.target.value);
                        setFormData({ ...formData, employeeId: e.target.value, baseSalary: emp?.baseSalary || 0 });
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Pilih Karyawan</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} - {emp.employeeNumber}</option>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Gaji Pokok</label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Tunjangan</label>
                    <input
                      type="number"
                      value={formData.allowances}
                      onChange={(e) => setFormData({ ...formData, allowances: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Lembur</label>
                    <input
                      type="number"
                      value={formData.overtime}
                      onChange={(e) => setFormData({ ...formData, overtime: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Bonus</label>
                    <input
                      type="number"
                      value={formData.bonus}
                      onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Potongan</label>
                    <input
                      type="number"
                      value={formData.deductions}
                      onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="col-span-2 bg-[var(--app-bg)] p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Gaji:</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-[var(--app-bg)]">
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Save size={18} />
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Create Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="bg-purple-600 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-[var(--app-text)]">Generate Payroll Massal</h2>
                <button onClick={() => setShowBulkModal(false)} className="text-white hover:bg-purple-700 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Periode *</label>
                  <input
                    type="month"
                    value={bulkData.period}
                    onChange={(e) => setBulkData({ ...bulkData, period: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Pilih Karyawan *</label>
                  <div className="max-h-64 overflow-y-auto border rounded-lg p-4">
                    {employees.map(emp => (
                      <label key={emp.id} className="flex items-center gap-3 p-2 hover:bg-[var(--app-bg)] rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bulkData.employeeIds.includes(emp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkData({ ...bulkData, employeeIds: [...bulkData.employeeIds, emp.id] });
                            } else {
                              setBulkData({ ...bulkData, employeeIds: bulkData.employeeIds.filter((id: string) => id !== emp.id) });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span>{emp.fullName} - {emp.employeeNumber}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[var(--app-muted)] mb-4">
                  {bulkData.employeeIds.length} karyawan dipilih
                </p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowBulkModal(false)} className="px-6 py-2 border rounded-lg hover:bg-[var(--app-bg)]">
                    Batal
                  </button>
                  <button onClick={handleBulkCreate} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Generate Payroll
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
