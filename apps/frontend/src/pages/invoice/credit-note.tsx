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

interface CreditNoteRow {
  id: string;
  cnNumber: string;
  invoiceNumber: string;
  customerName: string;
  customerNo: string;
  type: 'Adjustment' | 'Refund' | 'Goodwill';
  nominal: number;
  remainingValue: number;
  status: 'Digunakan' | 'Belum Digunakan' | 'Sebagian Digunakan';
  expiredDate: string;
  createdBy: string;
}

const mockCreditNotes: CreditNoteRow[] = [
  {
    id: '1',
    cnNumber: 'CN/2026/07/0001',
    invoiceNumber: 'INV/2026/06/0003',
    customerName: 'Budi Santoso',
    customerNo: 'CUST-0001',
    type: 'Adjustment',
    nominal: 375000,
    remainingValue: 0,
    status: 'Digunakan',
    expiredDate: '31/07/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '2',
    cnNumber: 'CN/2026/07/0002',
    invoiceNumber: 'INV/2026/06/0005',
    customerName: 'Siti Aminah',
    customerNo: 'CUST-0002',
    type: 'Refund',
    nominal: 250000,
    remainingValue: 250000,
    status: 'Belum Digunakan',
    expiredDate: '31/08/2026',
    createdBy: 'Rina Marlina'
  },
  {
    id: '3',
    cnNumber: 'CN/2026/07/0003',
    invoiceNumber: 'INV/2026/06/0007',
    customerName: 'Andi Pratama',
    customerNo: 'CUST-0003',
    type: 'Adjustment',
    nominal: 575000,
    remainingValue: 0,
    status: 'Digunakan',
    expiredDate: '31/07/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '4',
    cnNumber: 'CN/2026/07/0004',
    invoiceNumber: 'INV/2026/06/0010',
    customerName: 'Rina Marlina',
    customerNo: 'CUST-0004',
    type: 'Goodwill',
    nominal: 100000,
    remainingValue: 100000,
    status: 'Belum Digunakan',
    expiredDate: '31/08/2026',
    createdBy: 'Rina Marlina'
  },
  {
    id: '5',
    cnNumber: 'CN/2026/07/0005',
    invoiceNumber: 'INV/2026/06/0002',
    customerName: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    type: 'Refund',
    nominal: 1250000,
    remainingValue: 750000,
    status: 'Sebagian Digunakan',
    expiredDate: '31/07/2026',
    createdBy: 'Fitri Handayani'
  },
  {
    id: '6',
    cnNumber: 'CN/2026/07/0006',
    invoiceNumber: 'INV/2026/06/0006',
    customerName: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    type: 'Adjustment',
    nominal: 150000,
    remainingValue: 150000,
    status: 'Belum Digunakan',
    expiredDate: '31/08/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '7',
    cnNumber: 'CN/2026/07/0007',
    invoiceNumber: 'INV/2026/06/0001',
    customerName: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    type: 'Goodwill',
    nominal: 2000000,
    remainingValue: 0,
    status: 'Digunakan',
    expiredDate: '31/07/2026',
    createdBy: 'Rina Marlina'
  },
  {
    id: '8',
    cnNumber: 'CN/2026/07/0008',
    invoiceNumber: 'INV/2026/06/0008',
    customerName: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    type: 'Adjustment',
    nominal: 250000,
    remainingValue: 250000,
    status: 'Belum Digunakan',
    expiredDate: '31/08/2026',
    createdBy: 'Fitri Handayani'
  },
  {
    id: '9',
    cnNumber: 'CN/2026/07/0009',
    invoiceNumber: 'INV/2026/06/0009',
    customerName: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    type: 'Refund',
    nominal: 500000,
    remainingValue: 500000,
    status: 'Belum Digunakan',
    expiredDate: '31/08/2026',
    createdBy: 'Agus Dwi Rianto'
  },
  {
    id: '10',
    cnNumber: 'CN/2026/07/0010',
    invoiceNumber: 'INV/2026/06/0004',
    customerName: 'CV. Sinar Abadi',
    customerNo: 'CUST-0010',
    type: 'Adjustment',
    nominal: 2000000,
    remainingValue: 0,
    status: 'Digunakan',
    expiredDate: '31/07/2026',
    createdBy: 'Rina Marlina'
  }
];

interface UsageHistory {
  no: number;
  cnNumber: string;
  invoiceNumber: string;
  customerName: string;
  amountUsed: number;
  remainingValue: number;
  usedBy: string;
  date: string;
}

const mockUsageHistory: UsageHistory[] = [
  {
    no: 1,
    cnNumber: 'CN/2026/07/0005',
    invoiceNumber: 'INV/2026/07/0012',
    customerName: 'PT. Maju Bersama',
    amountUsed: 500000,
    remainingValue: 750000,
    usedBy: 'Agus Dwi Rianto',
    date: '22/10/2026 08:21'
  },
  {
    no: 2,
    cnNumber: 'CN/2026/07/0003',
    invoiceNumber: 'INV/2026/07/0011',
    customerName: 'Andi Pratama',
    amountUsed: 575000,
    remainingValue: 0,
    usedBy: 'Rina Marlina',
    date: '22/10/2026 07:45'
  },
  {
    no: 3,
    cnNumber: 'CN/2026/06/0021',
    invoiceNumber: 'INV/2026/07/0010',
    customerName: 'Dewi Lestari',
    amountUsed: 150000,
    remainingValue: 0,
    usedBy: 'Agus Dwi Rianto',
    date: '30/06/2026 15:32'
  }
];

export default function CreditNotePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockCreditNotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockCreditNotes.map(d => d.id));
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
              <span className="text-blue-500 font-semibold">Nota Kredit (Credit Note)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Manajemen Nota Kredit & Penyesuaian Saldo
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pencatatan kompensasi downtime, diskon billing retrospektif, dan penyesuaian nominal invoice pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/invoice/semua" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Semua Invoice</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Card 1: Total Credit Note */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Credit Note</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">32</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Credit Note</p>
            </div>
          </div>

          {/* Card 2: Total Nominal */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Nominal</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">Rp 18.750.000</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Credit Note</p>
            </div>
          </div>

          {/* Card 3: Digunakan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Digunakan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">28</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">87.5% dari total</p>
            </div>
          </div>

          {/* Card 4: Belum Digunakan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Belum Digunakan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">4</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">12.5% dari total</p>
            </div>
          </div>

          {/* Card 5: Kadaluarsa */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Kadaluarsa</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">0</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">0% dari total</p>
            </div>
          </div>

          {/* Card 6: Dibatalkan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dibatalkan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">6.3% dari total</p>
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
                placeholder="Cari credit note, customer, invoice..."
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
              <span>Buat Credit Note</span>
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
            <span>Gunakan</span>
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

          {/* Left Column: Credit Note Table & Usage History */}
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
                      <th className="p-4 w-44">CREDIT NOTE NO</th>
                      <th className="p-4 w-44">INVOICE</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-32">TIPE</th>
                      <th className="p-4 w-32">NOMINAL</th>
                      <th className="p-4 w-32">SISA NILAI</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-40">EXPIRED DATE</th>
                      <th className="p-4 w-36">DIBUAT OLEH</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                    {mockCreditNotes.map((d, idx) => {
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
                            <span className="text-blue-400 font-bold">{d.cnNumber}</span>
                          </td>
                          <td className="p-4 font-mono font-semibold text-[var(--app-muted)]">{d.invoiceNumber}</td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-[var(--app-text)] block">{d.customerName}</span>
                              <span className="text-[10px] text-[var(--app-muted)] block font-semibold">{d.customerNo}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-[var(--app-text)]/80">{d.type}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.nominal)}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.remainingValue)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.status === 'Digunakan' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : d.status === 'Belum Digunakan'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.expiredDate}</td>
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">32</span> data
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
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">4</button>
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

            {/* Bottom Section: Riwayat Penggunaan Terbaru */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Riwayat Penggunaan Terbaru</h3>
              
              <div className="overflow-x-auto border border-[var(--app-border)] rounded-xl">
                <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3 w-12">NO</th>
                      <th className="p-3">CREDIT NOTE</th>
                      <th className="p-3">INVOICE</th>
                      <th className="p-3">CUSTOMER</th>
                      <th className="p-3">NILAI DIGUNAKAN</th>
                      <th className="p-3">SISA NILAI</th>
                      <th className="p-3">DIGUNAKAN OLEH</th>
                      <th className="p-3">TANGGAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {mockUsageHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[var(--app-border)]/20 transition-colors">
                        <td className="p-3 text-[var(--app-muted)] font-medium">{item.no}</td>
                        <td className="p-3 font-mono font-bold text-blue-400">{item.cnNumber}</td>
                        <td className="p-3 font-mono font-bold text-[var(--app-muted)]">{item.invoiceNumber}</td>
                        <td className="p-3 font-bold text-[var(--app-text)]">{item.customerName}</td>
                        <td className="p-3 font-bold text-[var(--app-text)]">{formatCurrency(item.amountUsed)}</td>
                        <td className="p-3 font-bold text-[var(--app-text)]">{formatCurrency(item.remainingValue)}</td>
                        <td className="p-3 text-[var(--app-muted)] font-medium">{item.usedBy}</td>
                        <td className="p-3 text-[var(--app-muted)] font-medium">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Credit Note Donut */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Credit Note</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Digunakan: 28 / 32 = 87.5% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray={`${(28 / 32) * 100} ${100 - (28 / 32) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Sebagian Digunakan: 2 / 32 = 6.3% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 32) * 100} ${100 - (2 / 32) * 100}`} 
                    strokeDashoffset={`${100 - (28 / 32) * 100}`} 
                  />

                  {/* Belum Digunakan: 4 / 32 = 12.5% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(4 / 32) * 100} ${100 - (4 / 32) * 100}`} 
                    strokeDashoffset={`${100 - (30 / 32) * 100}`} 
                  />

                  {/* Dibatalkan: 2 / 32 = 6.3% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 32) * 100} ${100 - (2 / 32) * 100}`} 
                    strokeDashoffset={`${100 - (34 / 32) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-[var(--app-text)]">32</p>
                  <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#10b981] inline-block"></span>
                    <span>Digunakan</span>
                  </div>
                  <span className="font-semibold text-white">28 (87.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#3b82f6] inline-block"></span>
                    <span>Sebagian Digunakan</span>
                  </div>
                  <span className="font-semibold text-white">2 (6.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#f97316] inline-block"></span>
                    <span>Belum Digunakan</span>
                  </div>
                  <span className="font-semibold text-white">4 (12.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#ef4444] inline-block"></span>
                    <span>Dibatalkan</span>
                  </div>
                  <span className="font-semibold text-white">2 (6.3%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Nilai */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider block">Total Nilai</span>
                <p className="text-lg font-black text-[var(--app-text)]">Rp 18.750.000</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet size={18} />
              </div>
            </div>

            {/* Card 3: Detail Nilai Credit Note */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Detail Nilai Credit Note</h3>
              
              <div className="space-y-3.5 text-xs text-[var(--app-muted)] font-semibold">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-green-500" />
                    <span>Digunakan</span>
                  </div>
                  <span className="text-white">Rp 13.125.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-orange-500" />
                    <span>Belum Digunakan</span>
                  </div>
                  <span className="text-white">Rp 3.875.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-blue-500" />
                    <span>Sebagian Digunakan</span>
                  </div>
                  <span className="text-white">Rp 1.000.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-red-500" />
                    <span>Dibatalkan</span>
                  </div>
                  <span className="text-white">Rp 750.000</span>
                </div>
              </div>
            </div>

            {/* Card 4: Top 5 Customer */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Top 5 Customer</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: '1. PT. Maju Bersama', amount: 1250000 },
                  { name: '2. CV. Sinar Abadi', amount: 2000000 },
                  { name: '3. Budi Santoso', amount: 375000 },
                  { name: '4. Andi Pratama', amount: 575000 },
                  { name: '5. Rina Marlina', amount: 350000 }
                ].map((cust, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[var(--app-text)]/80">{cust.name}</span>
                    <span className="text-white">{formatCurrency(cust.amount)}</span>
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
                  Credit note dapat digunakan untuk potongan pada invoice berikutnya atau refund.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
