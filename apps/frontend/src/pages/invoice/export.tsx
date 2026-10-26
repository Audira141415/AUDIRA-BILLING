import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle,
  XCircle,
  Settings,
  HelpCircle,
  Wallet,
  Play,
  Save,
  Send,
  Lightbulb,
  ArrowUpRight,
  Shield,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';

interface PreviewRow {
  invoiceNo: string;
  customer: string;
  period: string;
  total: number;
  status: 'Lunas' | 'Belum Lunas' | 'Overdue';
}

const mockPreviewData: PreviewRow[] = [
  { invoiceNo: 'INV/2026/07/0012', customer: 'Budi Santoso', period: 'Jul 2026', total: 1200000, status: 'Lunas' },
  { invoiceNo: 'INV/2026/07/0011', customer: 'Siti Aminah', period: 'Jul 2026', total: 450000, status: 'Lunas' },
  { invoiceNo: 'INV/2026/07/0010', customer: 'Andi Pratama', period: 'Jul 2026', total: 2200000, status: 'Belum Lunas' },
  { invoiceNo: 'INV/2026/06/0099', customer: 'Dewi Lestari', period: 'Jun 2026', total: 350000, status: 'Lunas' },
  { invoiceNo: 'INV/2026/06/0098', customer: 'Fajar Nugroho', period: 'Jun 2026', total: 900000, status: 'Overdue' }
];

interface ExportLog {
  format: 'XLSX' | 'CSV' | 'PDF' | 'JSON';
  name: string;
  date: string;
  dataCount: string;
  size: string;
}

const mockExportLogs: ExportLog[] = [
  { format: 'XLSX', name: 'Export Invoice - 22 Oktober 2026', date: '22/10/2026 08:15 WIB', dataCount: '12.846 Data', size: '2.4 MB' },
  { format: 'PDF', name: 'Export Invoice - 30 Juni 2026', date: '30/06/2026 16:20 WIB', dataCount: '8.532 Data', size: '1.8 MB' },
  { format: 'XLSX', name: 'Export Invoice - 30 Juni 2026', date: '30/06/2026 08:05 WIB', dataCount: '8.532 Data', size: '2.1 MB' },
  { format: 'CSV', name: 'Export Invoice - 29 Juni 2026', date: '29/06/2026 20:10 WIB', dataCount: '7.320 Data', size: '1.2 MB' },
  { format: 'JSON', name: 'Export Invoice - 29 Juni 2026', date: '29/06/2026 10:30 WIB', dataCount: '7.320 Data', size: '950 KB' }
];

export default function ExportInvoicePage() {
  const [selectedFormat, setSelectedFormat] = useState<'XLSX' | 'CSV' | 'PDF' | 'JSON'>('XLSX');
  const [sertakanHeader, setSertakanHeader] = useState(true);
  const [autoWidth, setAutoWidth] = useState(true);
  const [separateSheets, setSeparateSheets] = useState(false);
  const [encryption, setEncryption] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Ekspor Data Invoice</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Ekspor & Pengarsipan Tagihan
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Unduh laporan data penagihan dalam format CSV (UTF-8 BOM), Excel XLSX, dan PDF arsip buku besar akuntansi.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/invoice/history" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Riwayat Log</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total Invoice */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Invoice</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">12.846</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Invoice</p>
            </div>
          </div>

          {/* Card 2: Sudah Lunas */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Sudah Lunas</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">9.456</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">73.5% dari total</p>
            </div>
          </div>

          {/* Card 3: Belum Lunas */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Belum Lunas</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.876</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">22.4% dari total</p>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Overdue</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">514</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">4.0% dari total</p>
            </div>
          </div>

          {/* Card 5: Dibatalkan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dibatalkan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">143</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">1.1% dari total</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Form & Checkboxes */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. Pilih Data Invoice */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">1. Pilih Data Invoice</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Periode Invoice</span>
                  <div className="flex items-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] px-3 py-2 rounded-xl text-xs text-[var(--app-text)]/80 cursor-pointer">
                    <Calendar size={14} className="text-[var(--app-muted)]" />
                    <span>01/06/2026 - 22/10/2026</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Status Invoice</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                    <option>Semua Status</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Tipe Invoice</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                    <option>Semua Tipe</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Metode Pembayaran</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                    <option>Semua Metode</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Customer / Group</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                    <option>Semua Customer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Package</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                    <option>Semua Package</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Kata Kunci</span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      placeholder="Cari invoice / customer..."
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-3 py-2 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[var(--app-border)]/65 pt-3">
                <button onClick={() => alert("Menampilkan opsi filter lanjutan...")} className="text-[10px] text-blue-400 font-bold hover:underline">
                  Tampilkan Filter Lanjutan &darr;
                </button>

                {/* Micro card inside showing total selected data count */}
                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3 text-[10px] font-bold text-[var(--app-muted)] w-full md:w-56 space-y-1.5">
                  <span className="text-[9px] text-[var(--app-muted)] uppercase tracking-wider block">Ringkasan Data Terpilih</span>
                  <div className="flex justify-between"><span>Total Invoice</span><span className="text-white">12.846</span></div>
                  <div className="flex justify-between"><span>Total Nominal</span><span className="text-white">Rp 2.847.560.000</span></div>
                  <div className="flex justify-between"><span>Sudah Lunas</span><span className="text-green-400">9.456 (73.5%)</span></div>
                  <div className="flex justify-between"><span>Belum Lunas</span><span className="text-orange-400">2.876 (22.4%)</span></div>
                  <div className="flex justify-between"><span>Overdue</span><span className="text-red-400">514 (4.0%)</span></div>
                  <div className="flex justify-between"><span>Dibatalkan</span><span className="text-[var(--app-muted)]">143 (1.1%)</span></div>
                </div>
              </div>
            </div>

            {/* 2. Pilih Kolom yang Akan Diexport */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">2. Pilih Kolom yang Akan Diexport</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 text-xs font-semibold text-[var(--app-text)]/80">
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white md:col-span-5 text-blue-400">
                  <input type="checkbox" defaultChecked className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                  <span>Pilih Semua</span>
                </label>
                {[
                  { name: 'No Invoice', checked: true },
                  { name: 'Customer', checked: true },
                  { name: 'Tipe Invoice', checked: true },
                  { name: 'Periode', checked: true },
                  { name: 'Tanggal Invoice', checked: true },
                  { name: 'Jatuh Tempo', checked: true },
                  { name: 'Total', checked: true },
                  { name: 'PPN', checked: true },
                  { name: 'Total Bayar', checked: true },
                  { name: 'Sisa Tagihan', checked: true },
                  { name: 'Status', checked: true },
                  { name: 'Metode Pembayaran', checked: true },
                  { name: 'Dibayar Oleh', checked: true },
                  { name: 'Dibayar Pada', checked: true },
                  { name: 'Keterangan', checked: false }
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                    <input type="checkbox" defaultChecked={item.checked} className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Pilih Format Export */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">3. Pilih Format Export</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'XLSX', name: 'Excel (.xlsx)', desc: 'Format Excel (Office 2007+)', icon: FileSpreadsheet, color: 'text-green-500' },
                  { id: 'CSV', name: 'CSV (.csv)', desc: 'Comma Separated Values', icon: FileSpreadsheet, color: 'text-blue-400' },
                  { id: 'PDF', name: 'PDF (.pdf)', desc: 'Portable Document Format', icon: FileText, color: 'text-red-500' },
                  { id: 'JSON', name: 'JSON (.json)', desc: 'JavaScript Object Notation', icon: FileJson, color: 'text-purple-400' }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = selectedFormat === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedFormat(item.id as any)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#0052cc]/10 border-[#0052cc] shadow-md shadow-[#0052cc]/10 scale-[1.02]' 
                          : 'bg-[var(--app-bg)] border-[var(--app-border)] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg bg-white/5 ${item.color}`}>
                          <Icon size={20} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[var(--app-text)]">{item.name}</p>
                          <p className="text-[9px] text-[var(--app-muted)] font-semibold">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Opsi Tambahan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">4. Opsi Tambahan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--app-muted)]">
                  <div className="space-y-0.5">
                    <p className="text-white">Sertakan Header</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-medium">Sertakan judul kolom pada file export</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={sertakanHeader} onChange={() => setSertakanHeader(!sertakanHeader)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[var(--app-muted)]">
                  <div className="space-y-0.5">
                    <p className="text-white">Auto Width (Excel)</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-medium">Sesuaikan lebar kolom otomatis</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={autoWidth} onChange={() => setAutoWidth(!autoWidth)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[var(--app-muted)]">
                  <div className="space-y-0.5">
                    <p className="text-white">Pisahkan per Sheet (Excel)</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-medium">Pisahkan data per status di sheet berbeda</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={separateSheets} onChange={() => setSeparateSheets(!separateSheets)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[var(--app-muted)]">
                  <div className="space-y-0.5">
                    <p className="text-white">Enkripsi File</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-medium">Lindungi file dengan password</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={encryption} onChange={() => setEncryption(!encryption)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end pt-2">
                <div className="space-y-1.5 md:col-span-2">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Password (jika enkripsi diaktifkan)</span>
                  <input 
                    type="password"
                    disabled={!encryption}
                    placeholder="Masukkan password (minimal 6 karakter)"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-3.5">
                  <button onClick={() => alert("Filter ekspor direset ke bawaan.")} className="text-xs font-bold text-[var(--app-muted)] hover:text-[var(--app-text)] px-5 py-3 border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 transition-colors">
                    Reset Filter
                  </button>
                  <button onClick={() => alert("Preset filter berhasil disimpan.")} className="text-xs font-bold text-blue-400 hover:text-blue-300 px-5 py-3 border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-colors">
                    Simpan Preset Filter
                  </button>
                  
                  <button onClick={() => alert("Memproses pembuatan berkas ekspor invoice...")} className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"><Download size={14} /><span>Export Sekarang</span></button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Preview widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Preview Data (5 Teratas) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Preview Data (5 Teratas)</h3>
              
              <div className="overflow-x-auto border border-[var(--app-border)] rounded-xl">
                <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] font-bold uppercase tracking-wider">
                      <th className="p-2">NO INVOICE</th>
                      <th className="p-2">CUSTOMER</th>
                      <th className="p-2">PERIODE</th>
                      <th className="p-2">TOTAL</th>
                      <th className="p-2">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] font-semibold">
                    {mockPreviewData.map((d, idx) => (
                      <tr key={idx} className="hover:bg-[var(--app-border)]/20 transition-colors">
                        <td className="p-2 font-mono text-blue-400">{d.invoiceNo}</td>
                        <td className="p-2 text-white">{d.customer}</td>
                        <td className="p-2 text-[var(--app-muted)]">{d.period}</td>
                        <td className="p-2 text-white">{formatCurrency(d.total)}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            d.status === 'Lunas' 
                              ? 'bg-green-500/10 text-green-400' 
                              : d.status === 'Belum Lunas'
                              ? 'bg-orange-500/10 text-orange-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 2: Distribusi Status */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Distribusi Status</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="120" height="120" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Lunas: 73.5% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="73.5 26.5" 
                    strokeDashoffset="0" 
                  />

                  {/* Belum Lunas: 22.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="22.4 77.6" 
                    strokeDashoffset="-73.5" 
                  />

                  {/* Overdue: 4.0% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray="4.0 96.0" 
                    strokeDashoffset="-95.9" 
                  />

                  {/* Dibatalkan: 1.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray="1.1 98.9" 
                    strokeDashoffset="-99.9" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-base font-black text-[var(--app-text)]">12.846</p>
                  <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">Total Invoice</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-green-500" />
                    <span>Lunas</span>
                  </div>
                  <span className="text-[var(--app-text)] font-bold">9.456 (73.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-orange-500" />
                    <span>Belum Lunas</span>
                  </div>
                  <span className="text-[var(--app-text)] font-bold">2.876 (22.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-red-500" />
                    <span>Overdue</span>
                  </div>
                  <span className="text-[var(--app-text)] font-bold">514 (4.0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-blue-500" />
                    <span>Dibatalkan</span>
                  </div>
                  <span className="text-[var(--app-text)] font-bold">143 (1.1%)</span>
                </div>
              </div>
            </div>

            {/* Card 3: Riwayat Export Terakhir */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Riwayat Export Terakhir</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-muted)]">
                {mockExportLogs.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between py-1 border-b border-[var(--app-border)]/40 last:border-0 pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                        item.format === 'XLSX' ? 'bg-green-500/10 text-green-400' :
                        item.format === 'PDF' ? 'bg-red-500/10 text-red-400' :
                        item.format === 'CSV' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {item.format}
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-[var(--app-text)] font-bold">{item.name}</p>
                        <p className="text-[9px] text-[var(--app-muted)] font-semibold">{item.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-[var(--app-muted)] font-bold leading-none">{item.dataCount}</p>
                        <p className="text-[9px] text-[var(--app-muted)] mt-1 font-semibold">{item.size}</p>
                      </div>
                      <button onClick={() => alert(`Mengunduh berkas arsip: ${item.name}`)} className="p-1 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => alert("Menampilkan seluruh riwayat arsip export...")} className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[var(--app-border)] block">Lihat Semua Riwayat Export &rarr;</button>
            </div>

            {/* Tips Card */}
            <div className="bg-white/40 border border-[var(--app-border)] p-4.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-[var(--app-text)]">Tips</h5>
                <p className="text-[10px] text-[var(--app-muted)] font-medium leading-relaxed">
                  Gunakan filter untuk memilih data yang tepat sebelum export. Pastikan data yang diexport sudah sesuai dengan kebutuhan Anda.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
