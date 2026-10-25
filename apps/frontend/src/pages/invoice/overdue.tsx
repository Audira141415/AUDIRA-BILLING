import React, { useState } from 'react';
import Link from 'next/link';
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
  MessageCircle,
  MailWarning,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  BellRing,
  Wallet,
  Send,
  Plus
} from 'lucide-react';

interface OverdueRow {
  id: string;
  invoiceNumber: string;
  isAuto: boolean;
  customerName: string;
  customerNo: string;
  packageName: string;
  dueDate: string;
  daysLate: string;
  total: number;
  remainingAmount: number;
  statusBadge: string;
  statusType: 'yellow' | 'orange' | 'purple' | 'red';
  method: string;
}

const mockOverdue: OverdueRow[] = [
  {
    id: '1',
    invoiceNumber: 'INV/2026/06/0088',
    isAuto: true,
    customerName: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    packageName: 'Home 50 Mbps',
    dueDate: '30/06/2026',
    daysLate: '1 Hari',
    total: 375000,
    remainingAmount: 375000,
    statusBadge: '1-7 Hari',
    statusType: 'yellow',
    method: 'Transfer Bank'
  },
  {
    id: '2',
    invoiceNumber: 'INV/2026/06/0087',
    isAuto: true,
    customerName: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    packageName: 'Home 10 Mbps',
    dueDate: '29/06/2026',
    daysLate: '2 Hari',
    total: 150000,
    remainingAmount: 150000,
    statusBadge: '1-7 Hari',
    statusType: 'yellow',
    method: 'Cash'
  },
  {
    id: '3',
    invoiceNumber: 'INV/2026/06/0076',
    isAuto: true,
    customerName: 'Budi Santoso',
    customerNo: 'CUST-0001',
    packageName: 'Home 50 Mbps',
    dueDate: '27/06/2026',
    daysLate: '4 Hari',
    total: 375000,
    remainingAmount: 375000,
    statusBadge: '1-7 Hari',
    statusType: 'yellow',
    method: 'Transfer Bank'
  },
  {
    id: '4',
    invoiceNumber: 'INV/2026/06/0071',
    isAuto: true,
    customerName: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    packageName: 'Home 20 Mbps',
    dueDate: '24/06/2026',
    daysLate: '7 Hari',
    total: 250000,
    remainingAmount: 250000,
    statusBadge: '8-14 Hari',
    statusType: 'orange',
    method: 'QRIS'
  },
  {
    id: '5',
    invoiceNumber: 'INV/2026/06/0065',
    isAuto: false,
    customerName: 'Siti Aminah',
    customerNo: 'CUST-0002',
    packageName: 'Home 20 Mbps',
    dueDate: '20/06/2026',
    daysLate: '11 Hari',
    total: 250000,
    remainingAmount: 250000,
    statusBadge: '8-14 Hari',
    statusType: 'orange',
    method: 'QRIS'
  },
  {
    id: '6',
    invoiceNumber: 'INV/2026/06/0054',
    isAuto: true,
    customerName: 'Andi Pratama',
    customerNo: 'CUST-0003',
    packageName: 'Home 100 Mbps',
    dueDate: '15/06/2026',
    daysLate: '16 Hari',
    total: 575000,
    remainingAmount: 575000,
    statusBadge: '15-30 Hari',
    statusType: 'purple',
    method: 'Transfer Bank'
  },
  {
    id: '7',
    invoiceNumber: 'INV/2026/06/0041',
    isAuto: true,
    customerName: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    packageName: 'Corporate 200 Mbps',
    dueDate: '08/06/2026',
    daysLate: '23 Hari',
    total: 1250000,
    remainingAmount: 1250000,
    statusBadge: '15-30 Hari',
    statusType: 'purple',
    method: 'Transfer Bank'
  },
  {
    id: '8',
    invoiceNumber: 'INV/2026/05/0320',
    isAuto: false,
    customerName: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    packageName: 'Corporate 50 Mbps',
    dueDate: '27/05/2026',
    daysLate: '35 Hari',
    total: 500000,
    remainingAmount: 500000,
    statusBadge: '31-60 Hari',
    statusType: 'red',
    method: 'Transfer Bank'
  },
  {
    id: '9',
    invoiceNumber: 'INV/2026/05/0285',
    isAuto: true,
    customerName: 'CV. Sinar Abadi',
    customerNo: 'CUST-0010',
    packageName: 'Corporate 300 Mbps',
    dueDate: '20/05/2026',
    daysLate: '42 Hari',
    total: 2000000,
    remainingAmount: 2000000,
    statusBadge: '31-60 Hari',
    statusType: 'red',
    method: 'Transfer Bank'
  },
  {
    id: '10',
    invoiceNumber: 'INV/2026/04/0198',
    isAuto: false,
    customerName: 'PT. Digital Nusantara',
    customerNo: 'CUST-0012',
    packageName: 'Corporate 500 Mbps',
    dueDate: '15/04/2026',
    daysLate: '78 Hari',
    total: 3500000,
    remainingAmount: 3500000,
    statusBadge: '> 60 Hari',
    statusType: 'red',
    method: 'Transfer Bank'
  }
];

export default function OverdueInvoicePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockOverdue.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockOverdue.map(d => d.id));
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
              <span className="text-rose-400">Invoice Menunggak (Overdue)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Tagihan Menunggak & Penagihan Kritis (Overdue Invoices)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar invoice yang telah melewati tanggal jatuh tempo penagihan dan menjadi kandidat auto-isolir layanan PPPoE Mikrotik.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/pelanggan/suspend"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Lihat Customer Terisolir
            </Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Card 1: Total Overdue */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Overdue</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">86</p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Total Invoice Rp 25.750.000</p>
            </div>
          </div>

          {/* Card 2: 1 - 7 Hari */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">1 - 7 Hari</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">18</p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Rp 4.875.000 (20.9%)</p>
            </div>
          </div>

          {/* Card 3: 8 - 14 Hari */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">8 - 14 Hari</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">16</p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Rp 5.350.000 (20.8%)</p>
            </div>
          </div>

          {/* Card 4: 15 - 30 Hari */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">15 - 30 Hari</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">24</p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Rp 8.250.000 (32.0%)</p>
            </div>
          </div>

          {/* Card 5: 31 - 60 Hari */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">31 - 60 Hari</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">16</p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Rp 4.150.000 (16.1%)</p>
            </div>
          </div>

          {/* Card 6: > 60 Hari */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">&gt; 60 Hari</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">12</p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Rp 3.125.000 (12.1%)</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none min-w-[140px]">
              <option>Semua Area</option>
            </select>

            <select className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none min-w-[140px]">
              <option>Semua Sales</option>
            </select>

            <select className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none min-w-[140px]">
              <option>Semua Metode</option>
            </select>
            
            {/* Date range picker mock */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs text-slate-600 cursor-pointer">
              <Calendar size={14} className="text-slate-400" />
              <span>01/06/2026 - 01/07/2026</span>
            </div>

            <button 
              onClick={() => { setSearchTerm(''); }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all ml-auto"
            >
              Reset
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-100 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-slate-500" />
              <span>Export</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <BellRing size={14} />
              <span>Kirim Reminder</span>
            </button>
          </div>
        </div>

        {/* ─── Table Tabs ────────────────────────────────────────────────── */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-400 gap-6">
          {[
            { id: 'Semua', label: 'Semua Overdue', count: 86 },
            { id: '1-7', label: '1 - 7 Hari', count: 18 },
            { id: '8-14', label: '8 - 14 Hari', count: 16 },
            { id: '15-30', label: '15 - 30 Hari', count: 24 },
            { id: '31-60', label: '31 - 60 Hari', count: 16 },
            { id: '60+', label: '> 60 Hari', count: 12 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === tab.id ? 'border-[#0052cc] text-white font-bold' : 'border-transparent hover:text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                activeTab === tab.id ? 'bg-[#0052cc] text-white' : 'bg-slate-50 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Overdue Table & Mass Action */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/40 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length > 0}
                          onChange={handleSelectAll}
                          className="rounded bg-slate-50 border-slate-200 text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-44">INVOICE</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-32">DUE DATE</th>
                      <th className="p-4 w-36">HARI TELAT</th>
                      <th className="p-4 w-28">TOTAL</th>
                      <th className="p-4 w-28">SISA TAGIHAN</th>
                      <th className="p-4 w-28">METODE</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                    {mockOverdue.map((d, idx) => {
                      const isSelected = selectedIds.includes(d.id);
                      return (
                        <tr 
                          key={d.id}
                          onClick={() => handleSelectRow(d.id)}
                          className={`hover:bg-slate-100/40 transition-colors cursor-pointer ${isSelected ? 'bg-slate-100/50' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleSelectRow(d.id)}
                              className="rounded bg-slate-50 border-slate-200 text-blue-600 focus:ring-0" 
                            />
                          </td>
                          <td className="p-4 text-slate-400 font-medium">{idx + 1}</td>
                          <td className="p-4 font-mono font-semibold text-white tracking-wider">
                            <div className="space-y-1">
                              <span className="block text-blue-400 font-bold">{d.invoiceNumber}</span>
                              <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {d.isAuto ? 'Auto' : 'Manual'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 block">{d.customerName}</span>
                              <span className="text-[10px] text-slate-400 block font-semibold">{d.customerNo}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-slate-600">{d.packageName}</td>
                          <td className="p-4">
                            <span className="block text-slate-700 font-semibold">{d.dueDate}</span>
                            <span className="text-[10px] block mt-0.5 text-slate-400">Jatuh tempo</span>
                          </td>
                          <td className="p-4 font-bold text-red-500">{d.daysLate}</td>
                          <td className="p-4 font-bold text-slate-800">{formatCurrency(d.total)}</td>
                          <td className="p-4 font-bold text-slate-800">{formatCurrency(d.remainingAmount)}</td>
                          <td className="p-4 text-slate-500 font-medium">{d.method}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.statusType === 'yellow' 
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                : d.statusType === 'orange'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : d.statusType === 'purple'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {d.statusBadge}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                                <MessageCircle size={13} className="text-emerald-500" />
                              </button>
                              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-slate-200 bg-white/60">
                <span className="text-xs text-slate-400">
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">86</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled
                      className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100">2</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100">3</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100">4</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100">5</button>
                    <span className="text-gray-600 text-xs px-1">...</span>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100">9</button>
                    <button className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    className="bg-slate-50 border border-slate-200 text-xs py-1.5 px-3 rounded-lg text-slate-600 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Section: Mass Action */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-2">
                  Mass Action ({selectedIds.length} dipilih)
                </span>
                
                <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs px-3.5 py-2 rounded-xl transition-all">
                  <BellRing size={13} />
                  <span>Kirim Reminder WA</span>
                </button>

                <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs px-3.5 py-2 rounded-xl transition-all">
                  <Mail size={13} />
                  <span>Kirim Email</span>
                </button>

                <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs px-3.5 py-2 rounded-xl transition-all">
                  <Smartphone size={13} />
                  <span>Kirim SMS</span>
                </button>

                <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs px-3.5 py-2 rounded-xl transition-all">
                  <RefreshCw size={13} />
                  <span>Buat Tagihan Ulang</span>
                </button>

                <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs px-3.5 py-2 rounded-xl transition-all">
                  <AlertTriangle size={13} />
                  <span>Suspend Preview</span>
                </button>

                <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs px-3.5 py-2 rounded-xl transition-all">
                  <FileText size={13} />
                  <span>Export Excel</span>
                </button>

                <button className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500">
                  <MoreVertical size={13} />
                </button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-blue-400 leading-relaxed text-[11px] font-bold">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>Tips: Segera lakukan penagihan untuk menghindari suspend layanan dan menjaga cashflow perusahaan.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Overdue Donut */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Ringkasan Overdue</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* 1 - 7 Hari: 18 / 86 = 20.9% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                    strokeDasharray={`${(18 / 86) * 100} ${100 - (18 / 86) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* 8 - 14 Hari: 16 / 86 = 18.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(16 / 86) * 100} ${100 - (16 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (18 / 86) * 100}`} 
                  />

                  {/* 15 - 30 Hari: 24 / 86 = 27.9% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.5" 
                    strokeDasharray={`${(24 / 86) * 100} ${100 - (24 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (34 / 86) * 100}`} 
                  />

                  {/* 31 - 60 Hari: 16 / 86 = 18.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(16 / 86) * 100} ${100 - (16 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (58 / 86) * 100}`} 
                  />

                  {/* > 60 Hari: 12 / 86 = 14% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#b91c1c" strokeWidth="4.5" 
                    strokeDasharray={`${(12 / 86) * 100} ${100 - (12 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (74 / 86) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-slate-900">86</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block"></span>
                    <span>1 - 7 Hari</span>
                  </div>
                  <span className="font-semibold text-white">18 (20.9%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>8 - 14 Hari</span>
                  </div>
                  <span className="font-semibold text-white">16 (18.6%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                    <span>15 - 30 Hari</span>
                  </div>
                  <span className="font-semibold text-white">24 (27.9%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                    <span>31 - 60 Hari</span>
                  </div>
                  <span className="font-semibold text-white">16 (18.6%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-800 inline-block"></span>
                    <span>&gt; 60 Hari</span>
                  </div>
                  <span className="font-semibold text-white">12 (14.0%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Outstanding */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Outstanding</span>
                <p className="text-lg font-black text-slate-900">Rp 25.750.000</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet size={18} />
              </div>
            </div>

            {/* Card 3: Top 5 Customer Overdue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Top 5 Customer Overdue</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'PT. Digital Nusantara', amount: 3500000 },
                  { name: 'CV. Sinar Abadi', amount: 2000000 },
                  { name: 'PT. Maju Bersama', amount: 1250000 },
                  { name: 'Andi Pratama', amount: 575000 },
                  { name: 'Yudi Hermawan', amount: 500000 }
                ].map((cust, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600">{cust.name}</span>
                    <span className="text-red-500">{formatCurrency(cust.amount)}</span>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-slate-200">
                Lihat Semua Customer
              </button>
            </div>

            {/* Card 4: Aksi Cepat (Boxes Style) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Aksi Cepat</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Kirim WA', icon: MessageCircle, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                  { name: 'Kirim Email', icon: Mail, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                  { name: 'Kirim SMS', icon: Smartphone, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
                  { name: 'Buat Tagihan Ulang', icon: RefreshCw, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                  { name: 'Suspend Preview', icon: AlertTriangle, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
                  { name: 'Export Excel', icon: FileText, color: 'bg-green-500/10 text-green-400 border-green-500/20' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={idx} 
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 transform hover:scale-[1.02] ${item.color}`}
                    >
                      <Icon size={16} className="mb-1" />
                      <span className="text-[9px] font-bold text-center">{item.name}</span>
                    </button>
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
