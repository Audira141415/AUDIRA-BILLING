import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
  Edit2,
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
  MessageCircle,
  MailWarning,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  BellRing,
  Wallet,
  Send,
  Plus,
  CheckCircle,
  XCircle,
  TrendingUp,
  X
} from 'lucide-react';

interface RefundRow {
  id: string;
  rfNumber: string;
  invoiceNumber: string;
  customerName: string;
  customerNo: string;
  reason: string;
  nominal: number;
  method: string;
  status: 'Selesai' | 'Diproses' | 'Ditolak';
  refundDate: string;
  createdBy: string;
}

const mockRefunds: RefundRow[] = [
  {
    id: '1',
    rfNumber: 'RF/2026/07/0001',
    invoiceNumber: 'INV/2026/06/0003',
    customerName: 'Budi Santoso',
    customerNo: 'CUST-0001',
    reason: 'Kelebihan Bayar',
    nominal: 375000,
    method: 'Transfer Bank',
    status: 'Selesai',
    refundDate: '22/10/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '2',
    rfNumber: 'RF/2026/07/0002',
    invoiceNumber: 'INV/2026/06/0005',
    customerName: 'Siti Aminah',
    customerNo: 'CUST-0002',
    reason: 'Pembatalan Layanan',
    nominal: 250000,
    method: 'QRIS',
    status: 'Diproses',
    refundDate: '22/10/2026',
    createdBy: 'Rina Marlina'
  },
  {
    id: '3',
    rfNumber: 'RF/2026/06/0021',
    invoiceNumber: 'INV/2026/06/0007',
    customerName: 'Andi Pratama',
    customerNo: 'CUST-0003',
    reason: 'Gangguan Layanan',
    nominal: 575000,
    method: 'Transfer Bank',
    status: 'Selesai',
    refundDate: '30/06/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '4',
    rfNumber: 'RF/2026/06/0020',
    invoiceNumber: 'INV/2026/06/0010',
    customerName: 'Rina Marlina',
    customerNo: 'CUST-0004',
    reason: 'Double Payment',
    nominal: 100000,
    method: 'E-Wallet',
    status: 'Ditolak',
    refundDate: '30/06/2026',
    createdBy: 'Rina Marlina'
  },
  {
    id: '5',
    rfNumber: 'RF/2026/06/0019',
    invoiceNumber: 'INV/2026/06/0002',
    customerName: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    reason: 'Pembatalan Layanan',
    nominal: 1250000,
    method: 'Transfer Bank',
    status: 'Selesai',
    refundDate: '29/06/2026',
    createdBy: 'Fitri Handayani'
  },
  {
    id: '6',
    rfNumber: 'RF/2026/06/0018',
    invoiceNumber: 'INV/2026/06/0006',
    customerName: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    reason: 'Kelebihan Bayar',
    nominal: 150000,
    method: 'Cash',
    status: 'Selesai',
    refundDate: '29/06/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '7',
    rfNumber: 'RF/2026/06/0017',
    invoiceNumber: 'INV/2026/06/0008',
    customerName: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    reason: 'Gangguan Layanan',
    nominal: 200000,
    method: 'QRIS',
    status: 'Diproses',
    refundDate: '28/06/2026',
    createdBy: 'Rina Marlina'
  },
  {
    id: '8',
    rfNumber: 'RF/2026/06/0016',
    invoiceNumber: 'INV/2026/06/0001',
    customerName: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    reason: 'Double Payment',
    nominal: 250000,
    method: 'E-Wallet',
    status: 'Selesai',
    refundDate: '28/06/2026',
    createdBy: 'Fitri Handayani'
  },
  {
    id: '9',
    rfNumber: 'RF/2026/06/0015',
    invoiceNumber: 'INV/2026/06/0004',
    customerName: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    reason: 'Pembatalan Layanan',
    nominal: 500000,
    method: 'Transfer Bank',
    status: 'Selesai',
    refundDate: '27/06/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '10',
    rfNumber: 'RF/2026/06/0014',
    invoiceNumber: 'INV/2026/05/0028',
    customerName: 'CV. Sinar Abadi',
    customerNo: 'CUST-0010',
    reason: 'Penyesuaian Tagihan',
    nominal: 2000000,
    method: 'Transfer Bank',
    status: 'Ditolak',
    refundDate: '27/06/2026',
    createdBy: 'Rina Marlina'
  }
];

export default function RefundPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockRefunds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockRefunds.map(d => d.id));
    }
  };

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
              <span className="text-blue-500 font-semibold">Pengembalian Dana (Refund)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Pencatatan & Verifikasi Pengembalian Dana
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Proses pengembalian kelebihan bayar, deposit instalasi, dan kompensasi gangguan jaringan terverifikasi.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/payment/history" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Riwayat Bayar</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total Refund */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Refund</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">28</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Refund</p>
            </div>
          </div>

          {/* Card 2: Total Nominal Refund */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Nominal Refund</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">Rp 12.850.000</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Refund</p>
            </div>
          </div>

          {/* Card 3: Selesai */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Selesai</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">22</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">78.6% dari total</p>
            </div>
          </div>

          {/* Card 4: Diproses */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Diproses</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">4</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">14.3% dari total</p>
            </div>
          </div>

          {/* Card 5: Ditolak */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Ditolak</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">7.1% dari total</p>
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
                placeholder="Cari refund, invoice, customer..."
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
              <option>Semua Sales</option>
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

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Plus size={14} />
              <span>Buat Refund</span>
            </button>

            <button className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Mass Action bar ────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider mr-2">
            Mass Action ({selectedIds.length} dipilih)
          </span>
          
          <button className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] text-xs px-3.5 py-2 rounded-xl transition-all">
            <CheckCircle size={13} className="text-green-500" />
            <span>Proses Refund</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] text-xs px-3.5 py-2 rounded-xl transition-all">
            <Mail size={13} />
            <span>Kirim Email</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] text-xs px-3.5 py-2 rounded-xl transition-all">
            <FileText size={13} />
            <span>Cetak PDF</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-red-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <XCircle size={13} className="text-red-500" />
            <span>Batalkan</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] text-xs px-3.5 py-2 rounded-xl transition-all">
            <Send size={13} />
            <span>Export</span>
          </button>

          <button className="p-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)]">
            <MoreVertical size={13} />
          </button>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Refund Table & Extra Charts */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length > 0}
                          onChange={handleSelectAll}
                          className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-44">REFUND NO</th>
                      <th className="p-4 w-44">INVOICE NO</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-48">ALASAN REFUND</th>
                      <th className="p-4 w-32">NOMINAL</th>
                      <th className="p-4 w-32">METODE</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-32">REFUND DATE</th>
                      <th className="p-4 w-36">DIBUAT OLEH</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                    {mockRefunds.map((d, idx) => {
                      const isSelected = selectedIds.includes(d.id);
                      return (
                        <tr 
                          key={d.id}
                          onClick={() => handleSelectRow(d.id)}
                          className={`hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer ${isSelected ? 'bg-[var(--app-border)]/20/50' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleSelectRow(d.id)}
                              className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                            />
                          </td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{idx + 1}</td>
                          <td className="p-4 font-mono font-semibold text-white tracking-wider">
                            <span className="text-blue-400 font-bold">{d.rfNumber}</span>
                          </td>
                          <td className="p-4 font-mono font-semibold text-[var(--app-muted)]">{d.invoiceNumber}</td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-[var(--app-text)] block">{d.customerName}</span>
                              <span className="text-[10px] text-[var(--app-muted)] block font-semibold">{d.customerNo}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-[var(--app-text)]/80">{d.reason}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.nominal)}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.method}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.status === 'Selesai' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : d.status === 'Diproses'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.refundDate}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.createdBy}</td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">28</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled
                      className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">3</button>
                    <button className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
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

            {/* Bottom Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Status Refund */}
              <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Status Refund</h4>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl space-y-1">
                    <CheckCircle size={16} className="text-green-500 mx-auto" />
                    <p className="text-lg font-black text-[var(--app-text)]">22</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase">Selesai</p>
                  </div>
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl space-y-1">
                    <Clock size={16} className="text-orange-400 mx-auto" />
                    <p className="text-lg font-black text-[var(--app-text)]">4</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase">Diproses</p>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                    <XCircle size={16} className="text-red-500 mx-auto" />
                    <p className="text-lg font-black text-[var(--app-text)]">2</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase">Ditolak</p>
                  </div>
                </div>
              </div>

              {/* Refund Bulanan Line Chart */}
              <div className="lg:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Refund Bulanan (Nominal)</h4>
                
                {/* SVG Line Chart */}
                <div className="h-28 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    {/* Grids */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                    
                    {/* Labels */}
                    <text x="5" y="16" fill="#4a5568" fontSize="8" fontWeight="bold">Rp 6M</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="8" fontWeight="bold">Rp 4M</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="8" fontWeight="bold">Rp 2M</text>
                    
                    {/* Blue line path */}
                    <path
                      d="M20,80 L60,78 L100,75 L140,82 L180,72 L220,40 L260,80"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Dots on peak */}
                    <circle cx="220" cy="40" r="4" fill="#3b82f6" stroke="#0b1329" strokeWidth="1.5" />
                    
                    {/* Month labels */}
                    <text x="15" y="96" fill="#4a5568" fontSize="8" fontWeight="bold">Jan</text>
                    <text x="55" y="96" fill="#4a5568" fontSize="8" fontWeight="bold">Feb</text>
                    <text x="95" y="96" fill="#4a5568" fontSize="8" fontWeight="bold">Mar</text>
                    <text x="135" y="96" fill="#4a5568" fontSize="8" fontWeight="bold">Apr</text>
                    <text x="175" y="96" fill="#4a5568" fontSize="8" fontWeight="bold">Mei</text>
                    <text x="215" y="96" fill="#4a5568" fontSize="8" fontWeight="bold">Jun</text>
                    <text x="255" y="96" fill="#4a5568" fontSize="8" fontWeight="bold">Jul</text>
                  </svg>
                </div>
              </div>

              {/* Aksi Cepat */}
              <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
                
                <div className="space-y-2 text-[10px] font-bold text-[var(--app-muted)]">
                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Plus size={12} className="text-blue-500" />
                      <span>Buat Refund</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileText size={12} className="text-purple-400" />
                      <span>Refund dari Invoice</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-yellow-500" />
                      <span>Riwayat Refund</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Download size={12} className="text-green-500" />
                      <span>Export Data</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Refund Donut */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Refund</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Selesai: 22 / 28 = 78.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray={`${(22 / 28) * 100} ${100 - (22 / 28) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Diproses: 4 / 28 = 14.3% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(4 / 28) * 100} ${100 - (4 / 28) * 100}`} 
                    strokeDashoffset={`${100 - (22 / 28) * 100}`} 
                  />

                  {/* Ditolak: 2 / 28 = 7.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 28) * 100} ${100 - (2 / 28) * 100}`} 
                    strokeDashoffset={`${100 - (26 / 28) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-[var(--app-text)]">28</p>
                  <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#10b981] inline-block"></span>
                    <span>Selesai</span>
                  </div>
                  <span className="font-semibold text-white">22 (78.6%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#f97316] inline-block"></span>
                    <span>Diproses</span>
                  </div>
                  <span className="font-semibold text-white">4 (14.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#ef4444] inline-block"></span>
                    <span>Ditolak</span>
                  </div>
                  <span className="font-semibold text-white">2 (7.1%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Nominal Refund */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider block">Total Nominal Refund</span>
                <p className="text-lg font-black text-[var(--app-text)]">Rp 12.850.000</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet size={18} />
              </div>
            </div>

            {/* Card 3: Metode Refund */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Metode Refund</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Transfer Bank', amount: 7650000, percentage: 59.5, color: 'bg-blue-600' },
                  { name: 'E-Wallet', amount: 2450000, percentage: 19.1, color: 'bg-purple-600' },
                  { name: 'QRIS', amount: 1750000, percentage: 13.6, color: 'bg-orange-600' },
                  { name: 'Cash', amount: 1000000, percentage: 7.8, color: 'bg-green-600' },
                ].map((item, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[var(--app-text)]/80">{item.name}</span>
                        <span className="text-[var(--app-muted)]">{formatCurrency(item.amount)} ({item.percentage}%)</span>
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

            {/* Card 4: Alasan Refund Terbanyak */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Alasan Refund Terbanyak</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: '1. Kelebihan Bayar', count: 9, percentage: 32.1 },
                  { name: '2. Pembatalan Layanan', count: 8, percentage: 28.6 },
                  { name: '3. Gangguan Layanan', count: 6, percentage: 21.4 },
                  { name: '4. Double Payment', count: 4, percentage: 14.3 },
                  { name: '5. Penyesuaian Tagihan', count: 1, percentage: 3.6 }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[var(--app-text)]/80">{item.name}</span>
                    <span className="text-white">{item.count} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white/40 border border-[var(--app-border)] p-4.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-[var(--app-text)]">Tips</h5>
                <p className="text-[10px] text-[var(--app-muted)] font-medium leading-relaxed">
                  Pastikan alasan refund sudah sesuai kebijakan perusahaan sebelum memproses refund.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
