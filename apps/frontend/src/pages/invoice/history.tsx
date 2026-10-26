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
  Wallet,
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
  Smartphone,
  CreditCard,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface HistoryRow {
  id: string;
  invoiceNumber: string;
  customerName: string;
  type: string;
  period: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  status: 'Lunas' | 'Belum Lunas' | 'Overdue' | 'Dibatalkan';
  method: string;
  paidDate: string;
}

const mockHistoryData: HistoryRow[] = [
  {
    id: '1',
    invoiceNumber: 'INV/2026/07/0012',
    customerName: 'Budi Santoso',
    type: 'Invoice Bulanan',
    period: 'Jul 2026',
    invoiceDate: '22/10/2026',
    dueDate: '15/07/2026',
    total: 1200000,
    status: 'Lunas',
    method: 'Transfer Bank',
    paidDate: '22/10/2026'
  },
  {
    id: '2',
    invoiceNumber: 'INV/2026/07/0011',
    customerName: 'Siti Aminah',
    type: 'Invoice Bulanan',
    period: 'Jul 2026',
    invoiceDate: '22/10/2026',
    dueDate: '15/07/2026',
    total: 450000,
    status: 'Lunas',
    method: 'QRIS',
    paidDate: '22/10/2026'
  },
  {
    id: '3',
    invoiceNumber: 'INV/2026/07/0010',
    customerName: 'Andi Pratama',
    type: 'Invoice Custom',
    period: 'Jul 2026',
    invoiceDate: '22/10/2026',
    dueDate: '15/07/2026',
    total: 2200000,
    status: 'Belum Lunas',
    method: '-',
    paidDate: '-'
  },
  {
    id: '4',
    invoiceNumber: 'INV/2026/06/0099',
    customerName: 'Dewi Lestari',
    type: 'Invoice Bulanan',
    period: 'Jun 2026',
    invoiceDate: '30/06/2026',
    dueDate: '14/06/2026',
    total: 350000,
    status: 'Lunas',
    method: 'Transfer Bank',
    paidDate: '30/06/2026'
  },
  {
    id: '5',
    invoiceNumber: 'INV/2026/06/0098',
    customerName: 'Fajar Nugroho',
    type: 'Invoice Custom',
    period: 'Jun 2026',
    invoiceDate: '30/06/2026',
    dueDate: '14/07/2026',
    total: 900000,
    status: 'Overdue',
    method: 'Transfer Bank',
    paidDate: '-'
  },
  {
    id: '6',
    invoiceNumber: 'INV/2026/06/0097',
    customerName: 'Nina Wulandari',
    type: 'Invoice Deposit',
    period: 'Jun 2026',
    invoiceDate: '30/06/2026',
    dueDate: '14/07/2026',
    total: 250000,
    status: 'Lunas',
    method: 'QRIS',
    paidDate: '30/06/2026'
  },
  {
    id: '7',
    invoiceNumber: 'INV/2026/06/0096',
    customerName: 'Yudi Hermawan',
    type: 'Invoice Bulanan',
    period: 'Jun 2026',
    invoiceDate: '30/06/2026',
    dueDate: '14/07/2026',
    total: 1300000,
    status: 'Lunas',
    method: 'Transfer Bank',
    paidDate: '30/06/2026'
  },
  {
    id: '8',
    invoiceNumber: 'INV/2026/06/0095',
    customerName: 'PT. Maju Bersama',
    type: 'Invoice Custom',
    period: 'Jun 2026',
    invoiceDate: '29/06/2026',
    dueDate: '13/07/2026',
    total: 3500000,
    status: 'Lunas',
    method: 'Transfer Bank',
    paidDate: '29/06/2026'
  },
  {
    id: '9',
    invoiceNumber: 'INV/2026/06/0094',
    customerName: 'CV. Sinar Abadi',
    type: 'Invoice Bulanan',
    period: 'Jun 2026',
    invoiceDate: '29/06/2026',
    dueDate: '13/07/2026',
    total: 1100000,
    status: 'Dibatalkan',
    method: '-',
    paidDate: '-'
  },
  {
    id: '10',
    invoiceNumber: 'INV/2026/06/0093',
    customerName: 'Rina Marlina',
    type: 'Invoice Deposit',
    period: 'Jun 2026',
    invoiceDate: '28/06/2026',
    dueDate: '12/07/2026',
    total: 750000,
    status: 'Lunas',
    method: 'QRIS',
    paidDate: '28/06/2026'
  },
  {
    id: '11',
    invoiceNumber: 'INV/2026/06/0092',
    customerName: 'Agus Dwi Rianto',
    type: 'Invoice Bulanan',
    period: 'Jun 2026',
    invoiceDate: '28/06/2026',
    dueDate: '12/07/2026',
    total: 521000,
    status: 'Lunas',
    method: 'Transfer Bank',
    paidDate: '28/06/2026'
  },
  {
    id: '12',
    invoiceNumber: 'INV/2026/06/0091',
    customerName: 'Putri Handayani',
    type: 'Invoice Custom',
    period: 'Jun 2026',
    invoiceDate: '27/06/2026',
    dueDate: '11/07/2026',
    total: 2800000,
    status: 'Overdue',
    method: 'Transfer Bank',
    paidDate: '-'
  },
  {
    id: '13',
    invoiceNumber: 'INV/2026/06/0090',
    customerName: 'Bambang Setiawan',
    type: 'Invoice Bulanan',
    period: 'Jun 2026',
    invoiceDate: '27/06/2026',
    dueDate: '11/07/2026',
    total: 450000,
    status: 'Lunas',
    method: 'QRIS',
    paidDate: '27/06/2026'
  },
  {
    id: '14',
    invoiceNumber: 'INV/2026/06/0089',
    customerName: 'Nadya Putri',
    type: 'Invoice Bulanan',
    period: 'Jun 2026',
    invoiceDate: '26/06/2026',
    dueDate: '1/11/2026',
    total: 330000,
    status: 'Lunas',
    method: 'Transfer Bank',
    paidDate: '26/06/2026'
  },
  {
    id: '15',
    invoiceNumber: 'INV/2026/06/0088',
    customerName: 'Iwan Kurniawan',
    type: 'Invoice Deposit',
    period: 'Jun 2026',
    invoiceDate: '25/06/2026',
    dueDate: '09/07/2026',
    total: 600000,
    status: 'Belum Lunas',
    method: '-',
    paidDate: '-'
  }
];

export default function InvoiceHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
              <span className="text-blue-500 font-semibold">Riwayat & Audit Log</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Riwayat Penerbitan & Siklus Billing
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Audit trail lengkap pembuatan invoice, perubahan nominal, pelunasan, dan pembatalan transaksi.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/invoice/semua" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Semua Invoice</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
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

          {/* Card 2: Total Nominal */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Nominal</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">Rp 2.847.560.000</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Invoice</p>
            </div>
          </div>

          {/* Card 3: Sudah Lunas */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Sudah Lunas</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">9.456</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Rp 2.154.850.000 (75.7%)</p>
            </div>
          </div>

          {/* Card 4: Belum Lunas */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Belum Lunas</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.876</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Rp 692.710.000 (24.3%)</p>
            </div>
          </div>

          {/* Card 5: Overdue */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Overdue</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">514</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Rp 148.230.000</p>
            </div>
          </div>

          {/* Card 6: Dibatalkan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-gray-550 bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dibatalkan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">143</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Rp 36.120.000</p>
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
                placeholder="Cari invoice, customer, no invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Tipe</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Metode</option>
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

            <button onClick={() => alert("Mengekspor data ke berkas CSV / Excel...")} className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: History Table & Activities */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[var(--app-border)] bg-white/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Riwayat Invoice</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-44">NO INVOICE</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">TIPE</th>
                      <th className="p-4 w-28">PERIODE</th>
                      <th className="p-4 w-32">TGL INVOICE</th>
                      <th className="p-4 w-32">JATUH TEMPO</th>
                      <th className="p-4 w-32">TOTAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-32">METODE</th>
                      <th className="p-4 w-32">DIBAYAR</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                    {mockHistoryData.map((d, idx) => {
                      return (
                        <tr 
                          key={d.id}
                          className="hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer"
                        >
                          <td className="p-4 text-[var(--app-muted)] font-medium">{idx + 1}</td>
                          <td className="p-4 font-mono font-semibold text-blue-400 block py-6">{d.invoiceNumber}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{d.customerName}</td>
                          <td className="p-4 text-[var(--app-muted)] font-semibold">{d.type}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.period}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.invoiceDate}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.dueDate}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.total)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.status === 'Lunas' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : d.status === 'Belum Lunas'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : d.status === 'Overdue'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.method}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.paidDate}</td>
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
                  Menampilkan <span className="font-semibold text-white">1 - 15</span> dari <span className="font-semibold text-white">12.846</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert("Halaman pertama sudah tercapai.")} className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
                      <ChevronLeft size={14} />
                    </button>
                    <button onClick={() => alert("Halaman 1 saat ini aktif.")} className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button onClick={() => alert("Beralih ke halaman 2")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                    <button onClick={() => alert("Beralih ke halaman 3")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">3</button>
                    <span className="text-gray-600 text-xs px-1">...</span>
                    <button onClick={() => alert("Beralih ke halaman 857")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">857</button>
                    <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)]/80 focus:outline-none"
                  >
                    <option value={15}>15 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Aktivitas Terbaru */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aktivitas Terbaru</h3>
                <button onClick={() => alert("Membuka seluruh riwayat aktivitas...")} className="text-xs text-blue-500 font-bold hover:underline">Lihat Semua Aktivitas &rarr;</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-[9px] font-bold">
                
                {/* Act 1 */}
                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <CheckCircle size={15} className="text-green-500" />
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                      Lunas
                    </span>
                  </div>
                  <div className="space-y-0.5 leading-tight">
                    <p className="text-white">Invoice INV/2026/07/0012</p>
                    <p className="text-[var(--app-muted)] font-normal">dibayar oleh Budi Santoso</p>
                  </div>
                  <p className="text-[var(--app-muted)] text-[8px] font-semibold">22/10/2026 08:15 WIB</p>
                </div>

                {/* Act 2 */}
                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <Mail size={15} className="text-blue-500" />
                  </div>
                  <div className="space-y-0.5 leading-tight">
                    <p className="text-white">Invoice INV/2026/07/0011</p>
                    <p className="text-[var(--app-muted)] font-normal">dibayar oleh Siti Aminah</p>
                  </div>
                  <p className="text-[var(--app-muted)] text-[8px] font-semibold">22/10/2026 08:02 WIB</p>
                </div>

                {/* Act 3 */}
                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <FileText size={15} className="text-purple-400" />
                  </div>
                  <div className="space-y-0.5 leading-tight">
                    <p className="text-white">Invoice INV/2026/07/0010</p>
                    <p className="text-[var(--app-muted)] font-normal">dibuat untuk Andi Pratama</p>
                  </div>
                  <p className="text-[var(--app-muted)] text-[8px] font-semibold">22/10/2026 07:58 WIB</p>
                </div>

                {/* Act 4 */}
                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <CheckCircle size={15} className="text-green-500" />
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                      Lunas
                    </span>
                  </div>
                  <div className="space-y-0.5 leading-tight">
                    <p className="text-white">Invoice INV/2026/06/0099</p>
                    <p className="text-[var(--app-muted)] font-normal">dibayar oleh Dewi Lestari</p>
                  </div>
                  <p className="text-[var(--app-muted)] text-[8px] font-semibold">30/06/2026 16:20 WIB</p>
                </div>

                {/* Act 5 */}
                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <AlertCircle size={15} className="text-red-500" />
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                      Overdue
                    </span>
                  </div>
                  <div className="space-y-0.5 leading-tight">
                    <p className="text-white">Invoice INV/2026/06/0098</p>
                    <p className="text-[var(--app-muted)] font-normal">jatuh tempo (Overdue)</p>
                  </div>
                  <p className="text-[var(--app-muted)] text-[8px] font-semibold">30/06/2026 15:10 WIB</p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Status Invoice Donut */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Status Invoice</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Lunas: 9.456 / 12.846 = 75.7% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="75.7 24.3" 
                    strokeDashoffset="0" 
                  />

                  {/* Belum Lunas: 2.876 / 12.846 = 22.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="22.4 77.6" 
                    strokeDashoffset="-75.7" 
                  />

                  {/* Overdue: 514 / 12.846 = 4.0% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray="4.0 96.0" 
                    strokeDashoffset="-98.1" 
                  />

                  {/* Dibatalkan: 143 / 12.846 = 1.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6b7280" strokeWidth="4.5" 
                    strokeDasharray="1.1 98.9" 
                    strokeDashoffset="-102.1" 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-lg font-black text-[var(--app-text)]">12.846</p>
                  <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Total Invoice</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-green-550 bg-green-500 inline-block"></span>
                    <span>Lunas</span>
                  </div>
                  <span className="font-semibold text-white">9.456 (75.7%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>Belum Lunas</span>
                  </div>
                  <span className="font-semibold text-white">2.876 (24.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                    <span>Overdue</span>
                  </div>
                  <span className="font-semibold text-white">514 (4.0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-gray-500 inline-block"></span>
                    <span>Dibatalkan</span>
                  </div>
                  <span className="font-semibold text-white">143 (1.1%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Ringkasan Nominal */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Nominal</h3>
              
              <div className="space-y-3 text-xs text-[var(--app-muted)] font-semibold">
                <div className="flex justify-between">
                  <span>Total Nominal</span>
                  <span className="text-[var(--app-text)] font-bold">Rp 2.847.560.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Lunas</span>
                  <span className="text-green-400">Rp 2.154.850.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Belum Lunas</span>
                  <span className="text-orange-400">Rp 692.710.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Overdue</span>
                  <span className="text-red-400">Rp 148.230.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Dibatalkan</span>
                  <span className="text-[var(--app-muted)]">Rp 36.120.000</span>
                </div>
              </div>
            </div>

            {/* Card 3: Grafik Invoice (6 Bulan Terakhir) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Grafik Invoice (6 Bulan Terakhir)</h3>
              
              {/* Combo Chart */}
              <div className="h-32 w-full mt-2">
                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                  
                  <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 500 Jt</text>
                  <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 300 Jt</text>
                  <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 100 Jt</text>
                  
                  {[
                    { x: 50, lunas: 45, belumLunas: 25 },
                    { x: 90, lunas: 50, belumLunas: 22 },
                    { x: 130, lunas: 58, belumLunas: 28 },
                    { x: 170, lunas: 65, belumLunas: 30 },
                    { x: 210, lunas: 75, belumLunas: 32 },
                    { x: 250, lunas: 68, belumLunas: 26 }
                  ].map((bar, idx) => (
                    <g key={idx}>
                      <rect x={bar.x} y={100 - bar.lunas} width="6" height={bar.lunas} fill="#10b981" opacity="0.8" rx="1" />
                      <rect x={bar.x + 8} y={100 - bar.belumLunas} width="6" height={bar.belumLunas} fill="#f97316" opacity="0.8" rx="1" />
                    </g>
                  ))}
                  
                  <text x="48" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Feb 2026</text>
                  <text x="88" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Mar 2026</text>
                  <text x="128" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Apr 2026</text>
                  <text x="168" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Mei 2026</text>
                  <text x="208" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Jun 2026</text>
                  <text x="248" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Jul 2026</text>
                </svg>
              </div>

              {/* Legends */}
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[8px] text-[var(--app-muted)] font-bold uppercase pt-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-purple-500 inline-block"></span>Total Invoice</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-green-500 inline-block"></span>Lunas</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-orange-500 inline-block"></span>Belum Lunas</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-red-500 inline-block"></span>Overdue</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-gray-500 inline-block"></span>Dibatalkan</span>
              </div>
            </div>

            {/* Card 4: Metode Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Metode Pembayaran</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Transfer Bank', amount: 7245, percentage: 56.4, color: 'bg-blue-600' },
                  { name: 'QRIS', amount: 3156, percentage: 24.5, color: 'bg-green-600' },
                  { name: 'Cash', amount: 1245, percentage: 9.7, color: 'bg-yellow-500' },
                  { name: 'Kartu Kredit', amount: 1200, percentage: 9.3, color: 'bg-blue-500' },
                ].map((item, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[var(--app-text)]/80 flex items-center gap-1.5">
                          {item.name === 'Kartu Kredit' ? <CreditCard size={12} className="text-blue-500" /> : <Wallet size={12} className="text-[var(--app-muted)]" />}
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

          </div>

        </div>

      </div>
    </Layout>
  );
}
