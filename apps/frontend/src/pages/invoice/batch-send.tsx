import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/Pagination';
import {
  Search,
  Eye,
  Download,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Mail,
  Smartphone,
  FileText,
  X,
  Play,
  Check,
  AlertTriangle
} from 'lucide-react';

interface BatchSendRow {
  id: string;
  name: string;
  period: string;
  invoiceType: string;
  totalInvoice: number;
  sentCount: number;
  successCount: number;
  failedCount: number;
  status: 'Selesai' | 'Sedang Berjalan' | 'Gagal';
  methods: string[];
  createdBy: string;
  createdAt: string;
}

const initialBatches: BatchSendRow[] = [
  {
    id: '1',
    name: 'BATCH-2026-07-001',
    period: 'Juli 2026',
    invoiceType: 'Invoice Bulanan',
    totalInvoice: 512,
    sentCount: 512,
    successCount: 498,
    failedCount: 14,
    status: 'Selesai',
    methods: ['wa', 'email', 'sms'],
    createdBy: 'Agus Dwi Rianto',
    createdAt: '22/10/2026 08:00'
  },
  {
    id: '2',
    name: 'BATCH-2026-07-002',
    period: 'Juli 2026',
    invoiceType: 'Invoice Deposit',
    totalInvoice: 128,
    sentCount: 128,
    successCount: 124,
    failedCount: 4,
    status: 'Selesai',
    methods: ['wa', 'email'],
    createdBy: 'Siti Aminah',
    createdAt: '22/10/2026 07:45'
  },
  {
    id: '3',
    name: 'BATCH-2026-07-003',
    period: 'Juli 2026',
    invoiceType: 'Invoice Custom',
    totalInvoice: 256,
    sentCount: 256,
    successCount: 230,
    failedCount: 26,
    status: 'Selesai',
    methods: ['wa', 'email'],
    createdBy: 'Andi Pratama',
    createdAt: '22/10/2026 07:30'
  },
  {
    id: '4',
    name: 'BATCH-2026-06-031',
    period: 'Juni 2026',
    invoiceType: 'Invoice Bulanan',
    totalInvoice: 487,
    sentCount: 487,
    successCount: 487,
    failedCount: 0,
    status: 'Selesai',
    methods: ['wa', 'email'],
    createdBy: 'Dewi Lestari',
    createdAt: '30/06/2026 16:20'
  },
  {
    id: '5',
    name: 'BATCH-2026-06-030',
    period: 'Juni 2026',
    invoiceType: 'Invoice Bulanan',
    totalInvoice: 439,
    sentCount: 439,
    successCount: 410,
    failedCount: 29,
    status: 'Selesai',
    methods: ['wa', 'sms'],
    createdBy: 'Fajar Nugroho',
    createdAt: '30/06/2026 15:45'
  }
];

export default function BatchSendPage() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<BatchSendRow[]>(initialBatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchSendRow | null>(null);

  // New Batch Form State
  const [form, setForm] = useState({
    name: `BATCH-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-00${initialBatches.length + 1}`,
    period: 'November 2026',
    invoiceType: 'Invoice Bulanan',
    targetSegment: 'Semua Pelanggan Belum Bayar',
    channelWA: true,
    channelEmail: true,
    channelSMS: false,
    jitterDelay: '3'
  });

  // Filtered
  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'Semua' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [batches, searchTerm, statusFilter]);

  const paginatedBatches = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredBatches.slice(start, start + limit);
  }, [filteredBatches, page, limit]);

  // Dynamic KPI Stats
  const totalBatch = batches.length;
  const totalSent = batches.reduce((acc, b) => acc + b.sentCount, 0);
  const totalSuccess = batches.reduce((acc, b) => acc + b.successCount, 0);
  const totalFailed = batches.reduce((acc, b) => acc + b.failedCount, 0);
  const successRate = totalSent === 0 ? 100 : ((totalSuccess / totalSent) * 100).toFixed(1);

  // Create Batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const channels: string[] = [];
    if (form.channelWA) channels.push('wa');
    if (form.channelEmail) channels.push('email');
    if (form.channelSMS) channels.push('sms');

    if (channels.length === 0) {
      toast.warning('Pilih minimal satu saluran pengiriman (WhatsApp, Email, atau SMS).', 'Validasi');
      return;
    }

    const count = 350;
    const success = 346;
    const failed = 4;

    const newBatch: BatchSendRow = {
      id: Date.now().toString(),
      name: form.name,
      period: form.period,
      invoiceType: form.invoiceType,
      totalInvoice: count,
      sentCount: count,
      successCount: success,
      failedCount: failed,
      status: 'Selesai',
      methods: channels,
      createdBy: 'Agus Dwi Rianto',
      createdAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setBatches(prev => [newBatch, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Batch ${newBatch.name} berhasil dibuat! Notifikasi telah dikirimkan ke ${count} pelanggan.`, 'Batch Terkirim');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Batch', 'Periode', 'Tipe Invoice', 'Total Invoice', 'Terkirim', 'Sukses', 'Gagal', 'Saluran', 'Dibuat Oleh', 'Waktu Dibuat'];
    const rows = filteredBatches.map(b => [
      `"${b.id}"`,
      `"${b.name}"`,
      `"${b.period}"`,
      `"${b.invoiceType}"`,
      b.totalInvoice,
      b.sentCount,
      b.successCount,
      b.failedCount,
      `"${b.methods.join(', ')}"`,
      `"${b.createdBy}"`,
      `"${b.createdAt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `batch_send_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Daftar riwayat batch invoice berhasil diekspor ke CSV.', 'Ekspor CSV');
  };

  const handleExportSingleBatch = (b: BatchSendRow) => {
    toast.success(`Mengekspor ringkasan detail pengiriman untuk ${b.name}...`, 'Unduh Bukti');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Top Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Batch Send Reminder</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Pengiriman Invoice Massal (Batch Send)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Distribusi notifikasi tagihan serentak melalui WhatsApp Business Gateway, Email, dan SMS dengan delivery telemetry real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link 
              href="/whatsapp/billing-scheduler" 
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle size={14} />
              <span>Scheduler WhatsApp</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Batch</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">{totalBatch}</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Batch Terdistribusi</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Send size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Notifikasi</p>
              <p className="text-2xl font-black text-blue-400 mt-0.5">{totalSent.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-blue-500/80 mt-0.5 font-medium">Terkirim ke Pelanggan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Tingkat Keberhasilan</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{successRate}%</p>
              <p className="text-[10px] text-emerald-500/80 mt-0.5 font-medium">{totalSuccess.toLocaleString('id-ID')} Sukses</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Gagal Terkirim</p>
              <p className="text-2xl font-black text-rose-400 mt-0.5">{totalFailed}</p>
              <p className="text-[10px] text-rose-500/80 mt-0.5 font-medium">Nomor Tidak Valid</p>
            </div>
          </div>
        </div>

        {/* Filter & Action Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari ID batch, pembuat, atau tipe tagihan..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder:text-[var(--app-muted)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Sedang Berjalan">Sedang Berjalan</option>
              <option value="Gagal">Gagal</option>
            </select>

            <button 
              type="button"
              onClick={() => { setSearchTerm(''); setStatusFilter('Semua'); setPage(1); }}
              className="text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] px-3 py-2.5 rounded-xl border border-[var(--app-border)] hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
            >
              Reset
            </button>

            <button 
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Buat Batch Baru</span>
            </button>

            <button 
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] hover:bg-[var(--app-surface)] text-[var(--app-text)] text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Batch Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4 w-12 font-mono">NO</th>
                  <th className="p-4">ID BATCH</th>
                  <th className="p-4">PERIODE</th>
                  <th className="p-4">TIPE INVOICE</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">SUKSES</th>
                  <th className="p-4">GAGAL</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">SALURAN</th>
                  <th className="p-4">DIBUAT OLEH</th>
                  <th className="p-4 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                {paginatedBatches.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-12 text-center text-[var(--app-muted)] font-medium">
                      Tidak ada batch pengiriman invoice yang cocok dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedBatches.map((d, idx) => {
                    return (
                      <tr key={d.id} className="hover:bg-[var(--app-surface-2)] transition-colors">
                        <td className="p-4 text-[var(--app-muted)] font-mono">{(page - 1) * limit + idx + 1}</td>
                        <td className="p-4 font-mono font-bold text-blue-500">{d.name}</td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.period}</td>
                        <td className="p-4 font-medium">{d.invoiceType}</td>
                        <td className="p-4 font-mono font-bold">{d.totalInvoice}</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">{d.successCount}</td>
                        <td className="p-4 font-mono font-bold text-rose-400">{d.failedCount}</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold rounded-full">
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {d.methods.includes('wa') && (
                              <span title="WhatsApp" className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <MessageCircle size={12} />
                              </span>
                            )}
                            {d.methods.includes('email') && (
                              <span title="Email" className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Mail size={12} />
                              </span>
                            )}
                            {d.methods.includes('sms') && (
                              <span title="SMS" className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Smartphone size={12} />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.createdBy}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              type="button"
                              onClick={() => setSelectedBatch(d)}
                              title="Lihat Rincian Batch"
                              className="p-1.5 hover:bg-[var(--app-surface)] rounded-lg text-[var(--app-muted)] hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleExportSingleBatch(d)}
                              title="Unduh Rekap Laporan Batch"
                              className="p-1.5 hover:bg-[var(--app-surface)] rounded-lg text-[var(--app-muted)] hover:text-emerald-400 transition-colors cursor-pointer"
                            >
                              <Download size={13} />
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

          {/* Table pagination */}
          <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-surface-2)]">
            <Pagination
              currentPage={page}
              totalItems={filteredBatches.length}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
              pageSizeOptions={[5, 10, 25]}
            />
          </div>
        </div>

        {/* Modal: Buat Batch Baru */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Send size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Buat Batch Pengiriman Massal Baru</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateBatch} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Nama / ID Batch *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Periode Tagihan</label>
                    <select
                      value={form.period}
                      onChange={(e) => setForm({ ...form, period: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none cursor-pointer"
                    >
                      <option value="November 2026">November 2026</option>
                      <option value="Desember 2026">Desember 2026</option>
                      <option value="Januari 2027">Januari 2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Tipe Tagihan</label>
                    <select
                      value={form.invoiceType}
                      onChange={(e) => setForm({ ...form, invoiceType: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none cursor-pointer"
                    >
                      <option value="Invoice Bulanan">Invoice Bulanan</option>
                      <option value="Invoice Deposit">Invoice Deposit</option>
                      <option value="Invoice Peringatan Isolir">Invoice Peringatan Isolir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Target Pelanggan</label>
                  <select
                    value={form.targetSegment}
                    onChange={(e) => setForm({ ...form, targetSegment: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none cursor-pointer"
                  >
                    <option value="Semua Pelanggan Belum Bayar">Semua Pelanggan Belum Bayar (Status Unpaid)</option>
                    <option value="Jatuh Tempo Kurang Dari 3 Hari">Jatuh Tempo Kurang Dari 3 Hari</option>
                    <option value="Jatuh Tempo Hari Ini">Jatuh Tempo Hari Ini (Emergency Notice)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-[var(--app-text)]">Saluran Pengiriman</label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.channelWA}
                        onChange={(e) => setForm({ ...form, channelWA: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span className="font-semibold text-emerald-400">WhatsApp</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.channelEmail}
                        onChange={(e) => setForm({ ...form, channelEmail: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span className="font-semibold text-blue-400">Email</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.channelSMS}
                        onChange={(e) => setForm({ ...form, channelSMS: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span className="font-semibold text-amber-400">SMS</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Play size={13} />
                    <span>Luncurkan Batch</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Detail Batch */}
        {selectedBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <FileText size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Detail Batch: {selectedBatch.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBatch(null)}
                  className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-xl text-center">
                    <span className="text-[10px] text-[var(--app-muted)] uppercase font-semibold">Total Target</span>
                    <p className="text-lg font-mono font-bold text-[var(--app-text)] mt-0.5">{selectedBatch.totalInvoice}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">Terkirim Sukses</span>
                    <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">{selectedBatch.successCount}</p>
                  </div>
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                    <span className="text-[10px] text-rose-400 uppercase font-semibold">Gagal Dikirim</span>
                    <p className="text-lg font-mono font-bold text-rose-400 mt-0.5">{selectedBatch.failedCount}</p>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] bg-[var(--app-surface-2)] p-3 rounded-xl border border-[var(--app-border)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Periode Tagihan:</span>
                    <span className="font-semibold text-[var(--app-text)]">{selectedBatch.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Tipe Invoice:</span>
                    <span className="font-semibold text-[var(--app-text)]">{selectedBatch.invoiceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Dieksekusi Oleh:</span>
                    <span className="font-semibold text-[var(--app-text)]">{selectedBatch.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Waktu Peluncuran:</span>
                    <span className="font-mono text-[var(--app-text)]">{selectedBatch.createdAt}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      handleExportSingleBatch(selectedBatch);
                      setSelectedBatch(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Unduh Rekap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBatch(null)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Tutup
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
