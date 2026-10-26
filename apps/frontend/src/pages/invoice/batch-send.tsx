import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
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
  MessageCircle,
  Smartphone,
  Info,
  TrendingUp,
  Settings,
  HelpCircle,
  Wallet,
  Play,
  Save,
  Send,
  Lightbulb,
  ArrowUpRight
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
  status: 'Selesai' | 'Dalam Proses' | 'Gagal';
  methods: ('wa' | 'email' | 'sms')[];
  createdBy: string;
  createdAt: string;
}

const mockBatchSends: BatchSendRow[] = [
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
    createdAt: '30/06/2026 15:10'
  },
  {
    id: '6',
    name: 'BATCH-2026-06-029',
    period: 'Juni 2026',
    invoiceType: 'Invoice Custom',
    totalInvoice: 312,
    sentCount: 312,
    successCount: 280,
    failedCount: 32,
    status: 'Selesai',
    methods: ['wa', 'email', 'sms'],
    createdBy: 'Nina Wulandari',
    createdAt: '30/06/2026 14:05'
  },
  {
    id: '7',
    name: 'BATCH-2026-06-028',
    period: 'Juni 2026',
    invoiceType: 'Invoice Deposit',
    totalInvoice: 98,
    sentCount: 98,
    successCount: 90,
    failedCount: 8,
    status: 'Selesai',
    methods: ['wa', 'email'],
    createdBy: 'Yudi Hermawan',
    createdAt: '30/06/2026 13:45'
  },
  {
    id: '8',
    name: 'BATCH-2026-06-027',
    period: 'Juni 2026',
    invoiceType: 'Invoice Bulanan',
    totalInvoice: 521,
    sentCount: 491,
    successCount: 420,
    failedCount: 71,
    status: 'Selesai',
    methods: ['wa', 'email', 'sms'],
    createdBy: 'Agus Dwi Rianto',
    createdAt: '30/06/2026 12:30'
  },
  {
    id: '9',
    name: 'BATCH-2026-06-026',
    period: 'Juni 2026',
    invoiceType: 'Invoice Custom',
    totalInvoice: 215,
    sentCount: 215,
    successCount: 195,
    failedCount: 20,
    status: 'Selesai',
    methods: ['wa', 'email'],
    createdBy: 'Siti Aminah',
    createdAt: '30/06/2026 11:15'
  },
  {
    id: '10',
    name: 'BATCH-2026-06-025',
    period: 'Juni 2026',
    invoiceType: 'Invoice Deposit',
    totalInvoice: 84,
    sentCount: 84,
    successCount: 76,
    failedCount: 8,
    status: 'Selesai',
    methods: ['wa', 'email'],
    createdBy: 'Andi Pratama',
    createdAt: '30/06/2026 10:05'
  }
];

export default function BatchSendPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
            <Link href="/whatsapp/campaigns" className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all">WhatsApp Gateway</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Card 1: Total Batch */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Batch</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">24</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Batch</p>
            </div>
          </div>

          {/* Card 2: Total Invoice Terkirim */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Send size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Invoice Terkirim</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">3.248</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">85.4% dari total</p>
            </div>
          </div>

          {/* Card 3: Berhasil Terkirim */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Berhasil Terkirim</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.770</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">73.1% dari total</p>
            </div>
          </div>

          {/* Card 4: Dalam Proses */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dalam Proses</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">128</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">3.4% dari total</p>
            </div>
          </div>

          {/* Card 5: Gagal Terkirim */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Gagal Terkirim</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">350</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">9.2% dari total</p>
            </div>
          </div>

          {/* Card 6: Menunggu */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-gray-550 bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Menunggu</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">0</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">0% dari total</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari batch, periode, user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Metode</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Tipe Invoice</option>
            </select>
            
            {/* Date range picker mock */}
            <div className="flex items-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] px-3 py-2.5 rounded-xl text-xs text-[var(--app-text)]/80 cursor-pointer">
              <Calendar size={14} className="text-[var(--app-muted)]" />
              <span>01/06/2026 - 22/10/2026</span>
            </div>

            <button 
              onClick={() => { setSearchTerm(''); }}
              className="text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-transparent hover:border-[var(--app-border)] transition-all ml-auto"
            >
              Reset
            </button>

            <button onClick={() => alert("Penyaringan data diterapkan berdasarkan parameter yang dipilih.")} className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <button onClick={() => alert("Membuka formulir Buat Batch Pengiriman Baru...")} className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"><Plus size={14} /><span>Buat Batch Baru</span></button>

            <button onClick={() => alert("Mengekspor data ke berkas CSV / Excel...")} className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Batch Table & Details */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[var(--app-border)] bg-white/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Daftar Batch Pengiriman Invoice</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-44">NAMA BATCH</th>
                      <th className="p-4 w-32">PERIODE</th>
                      <th className="p-4 w-36">TIPE INVOICE</th>
                      <th className="p-4 w-32">JUMLAH INVOICE</th>
                      <th className="p-4 w-28">TERKIRIM</th>
                      <th className="p-4 w-28">BERHASIL</th>
                      <th className="p-4 w-24">GAGAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-32">METODE</th>
                      <th className="p-4 w-36">DIBUAT OLEH</th>
                      <th className="p-4 w-40">DIBUAT PADA</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                    {mockBatchSends.map((d, idx) => {
                      return (
                        <tr 
                          key={d.id}
                          className="hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer"
                        >
                          <td className="p-4 text-[var(--app-muted)] font-medium">{idx + 1}</td>
                          <td className="p-4 font-mono font-semibold text-blue-400 block py-6">{d.name}</td>
                          <td className="p-4 text-slate-700 font-semibold">{d.period}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.invoiceType}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{d.totalInvoice}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{d.sentCount}</td>
                          <td className="p-4 font-bold text-green-400">{d.successCount}</td>
                          <td className="p-4 font-bold text-red-400">{d.failedCount}</td>
                          <td className="p-4">
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 text-[10px] font-bold rounded-full">
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              {d.methods.includes('wa') && <MessageCircle size={14} className="text-emerald-500" />}
                              {d.methods.includes('email') && <Mail size={14} className="text-blue-400" />}
                              {d.methods.includes('sms') && <Smartphone size={14} className="text-yellow-500" />}
                            </div>
                          </td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.createdBy}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.createdAt}</td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => alert("Menampilkan rincian detail catatan ini.")} className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Eye size={13} />
                              </button>
                              <button onClick={() => alert("Mengunduh salinan berkas faktur / bukti transaksi.")} className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Download size={13} />
                              </button>
                              <button onClick={() => alert("Opsi tindakan: Kirim WhatsApp, Cetak PDF, Void Transaksi.")} className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <MoreVertical size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-white/60">
                <span className="text-xs text-[var(--app-muted)]">
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">24</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert("Halaman pertama sudah tercapai.")} className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
                      <ChevronLeft size={14} />
                    </button>
                    <button onClick={() => alert("Halaman 1 saat ini aktif.")} className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button onClick={() => alert("Beralih ke halaman 2")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                    <button onClick={() => alert("Beralih ke halaman 3")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">3</button>
                    <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)]/80 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Row Extra Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Detail Batch Terpilih */}
              <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Detail Batch Terpilih</h4>
                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                    Selesai
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-[var(--app-text)] leading-none">BATCH-2026-07-001</p>
                  <p className="text-[10px] text-[var(--app-muted)] font-semibold">Invoice Bulanan - Juli 2026</p>
                </div>

                <div className="space-y-2.5 text-xs text-[var(--app-muted)] font-semibold border-t border-[var(--app-border)] pt-3">
                  <div className="flex justify-between">
                    <span>Periode Invoice</span>
                    <span className="text-white">Juli 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipe Invoice</span>
                    <span className="text-white">Invoice Bulanan</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah Invoice</span>
                    <span className="text-[var(--app-text)] font-bold">512</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metode Kirim</span>
                    <span className="text-white">Email, WhatsApp, SMS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dibuat Oleh</span>
                    <span className="text-white">Agus Dwi Rianto</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dibuat Pada</span>
                    <span className="text-white">22/10/2026 08:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu Selesai</span>
                    <span className="text-white">22/10/2026 08:15</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--app-border)] pt-2">
                    <span>Durasi Proses</span>
                    <span className="text-blue-400 font-bold">15 menit</span>
                  </div>
                </div>
              </div>

              {/* Statistik Batch Chart */}
              <div className="lg:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Statistik Batch</h4>
                
                {/* SVG Combo Chart (Lines) */}
                <div className="h-32 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                    
                    <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">1.000</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">600</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">200</text>
                    
                    {/* Terkirim (blue) */}
                    <path
                      d="M20,80 L70,55 L120,68 L170,50 L220,70 L270,30"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />

                    {/* Berhasil (green) */}
                    <path
                      d="M20,85 L70,68 L120,75 L170,60 L220,78 L270,42"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />

                    {/* Gagal (red) */}
                    <path
                      d="M20,95 L70,92 L120,94 L170,90 L220,93 L270,88"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                    
                    <text x="15" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">26 Jun</text>
                    <text x="65" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">27 Jun</text>
                    <text x="115" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">28 Jun</text>
                    <text x="165" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">29 Jun</text>
                    <text x="215" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">30 Jun</text>
                    <text x="265" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                  </svg>
                </div>

                {/* Legends */}
                <div className="flex justify-center gap-4 text-[9px] text-[var(--app-muted)] font-bold uppercase pt-1">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-blue-500 inline-block"></span>Terkirim</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-green-550 bg-green-500 inline-block"></span>Berhasil</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>Gagal</span>
                </div>
              </div>

              {/* Aktivitas Batch */}
              <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aktivitas Batch</h4>
                
                <div className="relative border-l border-[var(--app-border)] ml-2 pl-4 space-y-4 text-[9px] text-[var(--app-muted)] font-bold">
                  {[
                    { title: 'Batch dibuat', desc: '22/10/2026 08:00', by: 'Agus Dwi Rianto', active: true },
                    { title: 'Proses generate invoice', desc: '22/10/2026 08:01', by: 'System', active: true },
                    { title: 'Mulai pengiriman email', desc: '22/10/2026 08:02', by: 'System', active: true },
                    { title: 'Mulai pengiriman WhatsApp', desc: '22/10/2026 08:03', by: 'System', active: true },
                    { title: 'Mulai pengiriman SMS', desc: '22/10/2026 08:04', by: 'System', active: true },
                    { title: 'Batch selesai', desc: '22/10/2026 08:15', by: 'System', active: true, success: true }
                  ].map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle indicator */}
                      <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[var(--app-border)] ${
                        item.success ? 'bg-green-500' : 'bg-blue-500'
                      }`}></span>
                      <div className="flex justify-between">
                        <span className="text-white block">{item.title}</span>
                        <span className="text-gray-550 block font-normal">{item.by}</span>
                      </div>
                      <p className="text-[var(--app-muted)] text-[8px] font-semibold mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <button onClick={() => alert("Membuka log aktivitas audit...")} className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[var(--app-border)] block">Lihat Detail Log &rarr;</button>
              </div>

            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Pengiriman Donut */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Pengiriman</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Berhasil: 2.770 / 3.248 = 73.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="73.1 26.9" 
                    strokeDashoffset="0" 
                  />

                  {/* Gagal: 350 / 3.248 = 9.2% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray="9.2 90.8" 
                    strokeDashoffset="-73.1" 
                  />

                  {/* Dalam Proses: 128 / 3.248 = 3.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="3.4 96.6" 
                    strokeDashoffset="-82.3" 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-lg font-black text-[var(--app-text)]">3.248</p>
                  <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Total Invoice</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-[var(--app-muted)] border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-green-500 inline-block"></span>
                    <span>Berhasil Terkirim</span>
                  </div>
                  <span className="font-semibold text-white">2.770 (73.1%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                    <span>Gagal Terkirim</span>
                  </div>
                  <span className="font-semibold text-white">350 (9.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>Dalam Proses</span>
                  </div>
                  <span className="font-semibold text-white">128 (3.4%)</span>
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[var(--app-muted)]">
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] uppercase block font-bold">Tingkat Keberhasilan</span>
                  <p className="text-base font-black text-[var(--app-text)] leading-none">85.4%</p>
                  <p className="text-[9px] text-green-500 font-medium flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    <span>6.2% vs bulan lalu</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--app-muted)] uppercase block font-bold">Rata-rata Waktu Kirim</span>
                  <p className="text-base font-black text-[var(--app-text)] leading-none">2m 34s</p>
                  <p className="text-[9px] text-[var(--app-muted)] font-medium">Per 100 Invoice</p>
                </div>
              </div>
            </div>

            {/* Card 2: Metode Pengiriman */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Metode Pengiriman</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'WhatsApp', icon: MessageCircle, amount: 1854, percentage: 57.1, color: 'bg-emerald-500' },
                  { name: 'Email', icon: Mail, amount: 1102, percentage: 33.9, color: 'bg-blue-600' },
                  { name: 'SMS', icon: Smartphone, amount: 292, percentage: 9.0, color: 'bg-orange-500' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[var(--app-text)]/80 flex items-center gap-1.5">
                          <Icon size={12} className={item.color.replace('bg-', 'text-')} />
                          <span>{item.name}</span>
                        </span>
                        <span className="text-[var(--app-muted)]">{item.amount.toLocaleString('id-ID')} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`${item.color} h-full rounded-full transition-all duration-500`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Status Terakhir */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Status Terakhir</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-muted)]">
                {[
                  { name: 'BATCH-2026-07-001', desc: 'Invoice Bulanan - Juli 2026', time: '22/10/2026 08:15', status: 'Selesai' },
                  { name: 'BATCH-2026-07-002', desc: 'Invoice Deposit - Juli 2026', time: '22/10/2026 08:02', status: 'Selesai' },
                  { name: 'BATCH-2026-07-003', desc: 'Invoice Custom - Juli 2026', time: '22/10/2026 07:50', status: 'Selesai' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-0.5 border-b border-[var(--app-border)]/40 last:border-0 pb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-[var(--app-text)] font-bold">{item.name}</p>
                      <p className="text-[10px] text-[var(--app-muted)]">{item.desc}</p>
                      <p className="text-[9px] text-[var(--app-muted)] font-semibold">{item.time}</p>
                    </div>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => alert("Membuka seluruh riwayat aktivitas invoice...")} className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[var(--app-border)] block">Lihat Semua Aktivitas</button>
            </div>

            {/* Tips Card */}
            <div className="bg-white/40 border border-[var(--app-border)] p-4.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-[var(--app-text)]">Tips</h5>
                <p className="text-[10px] text-[var(--app-muted)] font-medium leading-relaxed">
                  Gunakan fitur batch send untuk mengirim invoice secara massal dan hemat waktu. Pastikan data customer sudah lengkap.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
