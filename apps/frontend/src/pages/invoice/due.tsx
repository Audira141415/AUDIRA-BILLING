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
  MessageCircle,
  MailWarning,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  BellRing
} from 'lucide-react';

interface DueInvoiceRow {
  id: string;
  invoiceNumber: string;
  isAuto: boolean;
  customerName: string;
  customerNo: string;
  packageName: string;
  dueDate: string;
  dueDateLabel: string;
  daysLate: string;
  total: number;
  status: 'Hari Ini' | '1 - 3 Hari' | '4 - 7 Hari' | '8 - 14 Hari' | '> 15 Hari';
  method: string;
}

const mockDueInvoices: DueInvoiceRow[] = [
  {
    id: '1',
    invoiceNumber: 'INV/2026/07/0001',
    isAuto: true,
    customerName: 'Budi Santoso',
    customerNo: 'CUST-0001',
    packageName: 'Home 50 Mbps',
    dueDate: '10/07/2026',
    dueDateLabel: 'Hari ini',
    daysLate: '0 Hari',
    total: 375000,
    status: 'Hari Ini',
    method: 'Transfer Bank'
  },
  {
    id: '2',
    invoiceNumber: 'INV/2026/07/0002',
    isAuto: true,
    customerName: 'Siti Aminah',
    customerNo: 'CUST-0002',
    packageName: 'Home 20 Mbps',
    dueDate: '10/07/2026',
    dueDateLabel: 'Hari ini',
    daysLate: '0 Hari',
    total: 250000,
    status: 'Hari Ini',
    method: 'QRIS'
  },
  {
    id: '3',
    invoiceNumber: 'INV/2026/07/0003',
    isAuto: true,
    customerName: 'Andi Pratama',
    customerNo: 'CUST-0003',
    packageName: 'Home 100 Mbps',
    dueDate: '08/07/2026',
    dueDateLabel: '3 Hari lalu',
    daysLate: '3 Hari',
    total: 575000,
    status: '1 - 3 Hari',
    method: 'Transfer Bank'
  },
  {
    id: '4',
    invoiceNumber: 'INV/2026/07/0004',
    isAuto: false,
    customerName: 'Rina Marlina',
    customerNo: 'CUST-0004',
    packageName: 'Corporate 100 Mbps',
    dueDate: '08/07/2026',
    dueDateLabel: '3 Hari lalu',
    daysLate: '3 Hari',
    total: 750000,
    status: '1 - 3 Hari',
    method: 'Transfer Bank'
  },
  {
    id: '5',
    invoiceNumber: 'INV/2026/07/0005',
    isAuto: true,
    customerName: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    packageName: 'Corporate 200 Mbps',
    dueDate: '05/07/2026',
    dueDateLabel: '6 Hari lalu',
    daysLate: '6 Hari',
    total: 1250000,
    status: '4 - 7 Hari',
    method: 'Transfer Bank'
  },
  {
    id: '6',
    invoiceNumber: 'INV/2026/07/0006',
    isAuto: true,
    customerName: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    packageName: 'Home 10 Mbps',
    dueDate: '05/07/2026',
    dueDateLabel: '6 Hari lalu',
    daysLate: '6 Hari',
    total: 150000,
    status: '4 - 7 Hari',
    method: 'Cash'
  },
  {
    id: '7',
    invoiceNumber: 'INV/2026/07/0007',
    isAuto: true,
    customerName: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    packageName: 'Home 50 Mbps',
    dueDate: '30/06/2026',
    dueDateLabel: '11 Hari lalu',
    daysLate: '11 Hari',
    total: 375000,
    status: '8 - 14 Hari',
    method: 'Transfer Bank'
  },
  {
    id: '8',
    invoiceNumber: 'INV/2026/06/0123',
    isAuto: false,
    customerName: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    packageName: 'Home 20 Mbps',
    dueDate: '30/06/2026',
    dueDateLabel: '11 Hari lalu',
    daysLate: '11 Hari',
    total: 250000,
    status: '8 - 14 Hari',
    method: 'QRIS'
  },
  {
    id: '9',
    invoiceNumber: 'INV/2026/06/0109',
    isAuto: true,
    customerName: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    packageName: 'Corporate 50 Mbps',
    dueDate: '20/06/2026',
    dueDateLabel: '21 Hari lalu',
    daysLate: '21 Hari',
    total: 500000,
    status: '> 15 Hari',
    method: 'Transfer Bank'
  },
  {
    id: '10',
    invoiceNumber: 'INV/2026/06/0098',
    isAuto: false,
    customerName: 'CV. Sinar Abadi',
    customerNo: 'CUST-0010',
    packageName: 'Corporate 300 Mbps',
    dueDate: '15/06/2026',
    dueDateLabel: '26 Hari lalu',
    daysLate: '26 Hari',
    total: 2000000,
    status: '> 15 Hari',
    method: 'Transfer Bank'
  }
];

export default function DueInvoicePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockDueInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockDueInvoices.map(d => d.id));
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
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Home</span>
              <span>&gt;</span>
              <span>Invoice</span>
              <span>&gt;</span>
              <span className="text-blue-400">Invoice Jatuh Tempo</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Invoice Jatuh Tempo</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Calendar */}
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-2 rounded-xl text-xs text-gray-300">
              <Calendar size={14} className="text-blue-400" />
              <span>01 Juli 2026</span>
              <span className="text-[10px] text-gray-500">08:35 WIB</span>
            </div>
            
            {/* Status Sistem */}
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-2 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-400">Status Sistem</span>
              <span className="text-green-400 font-bold">Normal</span>
            </div>

            {/* Global Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari customer, invoice, tagihan..."
                className="w-full bg-[#0b1329] border border-[#131d35] rounded-xl text-xs pl-9 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Notification and Profile icons */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors">
                <Bell size={16} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75">12</span>
              </button>
              <button className="relative p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors">
                <Mail size={16} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75">6</span>
              </button>
              <button className="p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors max-sm:hidden">
                <Maximize2 size={16} className="text-gray-400" />
              </button>
              
              {/* Profile */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#131d35]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  <span className="text-xs">AR</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-white">Agus Dwi Rianto</div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Card 1: Total Jatuh Tempo */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Jatuh Tempo</p>
              <p className="text-xl font-black text-white mt-0.5">48</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Total Invoice</p>
            </div>
          </div>

          {/* Card 2: Hari Ini */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hari Ini</p>
              <p className="text-xl font-black text-white mt-0.5">12</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 4.250.000</p>
            </div>
          </div>

          {/* Card 3: 1 - 3 Hari */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">1 - 3 Hari</p>
              <p className="text-xl font-black text-white mt-0.5">18</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 6.750.000</p>
            </div>
          </div>

          {/* Card 4: 4 - 7 Hari */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">4 - 7 Hari</p>
              <p className="text-xl font-black text-white mt-0.5">9</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 2.875.000</p>
            </div>
          </div>

          {/* Card 5: 8 - 14 Hari */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">8 - 14 Hari</p>
              <p className="text-xl font-black text-white mt-0.5">6</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 1.250.000</p>
            </div>
          </div>

          {/* Card 6: > 15 Hari */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">&gt; 15 Hari</p>
              <p className="text-xl font-black text-white mt-0.5">3</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 1.250.000</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Area</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Sales</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>
            
            {/* Date range picker mock */}
            <div className="flex items-center gap-2 bg-[#080d19] border border-[#131d35] px-3 py-2.5 rounded-xl text-xs text-gray-300 cursor-pointer">
              <Calendar size={14} className="text-gray-500" />
              <span>01/06/2026 - 01/07/2026</span>
            </div>

            <button 
              onClick={() => { setSearchTerm(''); }}
              className="text-xs font-semibold text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-transparent hover:border-[#131d35] transition-all ml-auto"
            >
              Reset
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-gray-400" />
              <span>Export</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <BellRing size={14} />
              <span>Kirim Reminder</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Due Table & Mass Action */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length > 0}
                          onChange={handleSelectAll}
                          className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-44">INVOICE</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-32">DUE DATE</th>
                      <th className="p-4 w-36">HARI TERLAMBAT</th>
                      <th className="p-4 w-28">TOTAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-28">METODE</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {mockDueInvoices.map((d, idx) => {
                      const isSelected = selectedIds.includes(d.id);
                      return (
                        <tr 
                          key={d.id}
                          onClick={() => handleSelectRow(d.id)}
                          className={`hover:bg-[#121c38]/40 transition-colors cursor-pointer ${isSelected ? 'bg-[#121c38]/50' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleSelectRow(d.id)}
                              className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" 
                            />
                          </td>
                          <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
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
                              <span className="font-bold text-white block">{d.customerName}</span>
                              <span className="text-[10px] text-gray-500 block font-semibold">{d.customerNo}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-gray-300">{d.packageName}</td>
                          <td className="p-4">
                            <span className="block text-gray-300 font-semibold">{d.dueDate}</span>
                            <span className={`text-[10px] block mt-0.5 ${d.status === 'Hari Ini' ? 'text-amber-500 font-bold' : 'text-red-400'}`}>
                              {d.dueDateLabel}
                            </span>
                          </td>
                          <td className={`p-4 font-bold ${d.status === 'Hari Ini' ? 'text-amber-500' : 'text-red-500'}`}>
                            {d.daysLate}
                          </td>
                          <td className="p-4 font-bold text-white">{formatCurrency(d.total)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.status === 'Hari Ini' 
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                : d.status === '1 - 3 Hari'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : d.status === '4 - 7 Hari'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400 font-medium">{d.method}</td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <BellRing size={13} className="text-amber-500" />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[#131d35] bg-[#0b1329]/60">
                <span className="text-xs text-gray-500">
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">48</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled
                      className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">2</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">3</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">4</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">5</button>
                    <button className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    className="bg-[#080d19] border border-[#131d35] text-xs py-1.5 px-3 rounded-lg text-gray-300 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Section: Mass Action */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mr-2">
                Mass Action ({selectedIds.length} dipilih)
              </span>
              
              <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
                <MessageCircle size={13} />
                <span>Kirim WA</span>
              </button>

              <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
                <Mail size={13} />
                <span>Kirim Email</span>
              </button>

              <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
                <Smartphone size={13} />
                <span>Kirim SMS</span>
              </button>

              <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
                <RefreshCw size={13} />
                <span>Buat Tagihan Ulang</span>
              </button>

              <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
                <FileText size={13} />
                <span>Export Excel</span>
              </button>

              <button className="p-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400">
                <MoreVertical size={13} />
              </button>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Jatuh Tempo Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Jatuh Tempo</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Hari Ini: 12 / 48 = 25% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                    strokeDasharray={`${(12 / 48) * 100} ${100 - (12 / 48) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* 1 - 3 Hari: 18 / 48 = 37.5% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(18 / 48) * 100} ${100 - (18 / 48) * 100}`} 
                    strokeDashoffset={`${100 - (12 / 48) * 100}`} 
                  />

                  {/* 4 - 7 Hari: 9 / 48 = 18.8% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.5" 
                    strokeDasharray={`${(9 / 48) * 100} ${100 - (9 / 48) * 100}`} 
                    strokeDashoffset={`${100 - (30 / 48) * 100}`} 
                  />

                  {/* 8 - 14 Hari: 6 / 48 = 12.5% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(6 / 48) * 100} ${100 - (6 / 48) * 100}`} 
                    strokeDashoffset={`${100 - (39 / 48) * 100}`} 
                  />

                  {/* > 15 Hari: 3 / 48 = 6.2% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#b91c1c" strokeWidth="4.5" 
                    strokeDasharray={`${(3 / 48) * 100} ${100 - (3 / 48) * 100}`} 
                    strokeDashoffset={`${100 - (45 / 48) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-white">48</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block"></span>
                    <span>Hari Ini</span>
                  </div>
                  <span className="font-semibold text-white">12 (25.0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>1 - 3 Hari</span>
                  </div>
                  <span className="font-semibold text-white">18 (37.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                    <span>4 - 7 Hari</span>
                  </div>
                  <span className="font-semibold text-white">9 (18.8%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                    <span>8 - 14 Hari</span>
                  </div>
                  <span className="font-semibold text-white">6 (12.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-800 inline-block"></span>
                    <span>&gt; 15 Hari</span>
                  </div>
                  <span className="font-semibold text-white">3 (6.2%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Nilai Jatuh Tempo */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Nilai Jatuh Tempo</span>
                <p className="text-lg font-black text-white">Rp 17.050.000</p>
                <p className="text-[9px] text-gray-500 font-semibold">Total Outstanding</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <FileText size={18} />
              </div>
            </div>

            {/* Card 3: Metode Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Metode Pembayaran</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Transfer Bank', percentage: 60.4, color: 'bg-blue-600' },
                  { name: 'QRIS', percentage: 22.9, color: 'bg-purple-600' },
                  { name: 'Cash', percentage: 10.4, color: 'bg-orange-600' },
                  { name: 'E-Wallet', percentage: 6.3, color: 'bg-green-600' },
                ].map((item, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="text-gray-400">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#101935] h-1.5 rounded-full overflow-hidden">
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

            {/* Card 4: Aksi Cepat */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h3>
              
              <div className="space-y-3 text-[11px] font-semibold text-gray-400">
                {[
                  { name: 'Kirim Reminder WA', count: 48, icon: MessageCircle, color: 'text-emerald-500' },
                  { name: 'Kirim Reminder Email', count: 48, icon: MailWarning, color: 'text-blue-400' },
                  { name: 'Kirim SMS', count: 48, icon: Smartphone, color: 'text-yellow-500' },
                  { name: 'Buat Tagihan Ulang', count: 12, icon: RefreshCw, color: 'text-purple-400' },
                  { name: 'Suspend Pelanggan', count: 3, icon: AlertTriangle, color: 'text-red-500' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex justify-between items-center hover:text-white cursor-pointer transition-colors py-0.5">
                      <div className="flex items-center gap-2">
                        <Icon size={13} className={item.color} />
                        <span>{item.name}</span>
                      </div>
                      <span className="bg-[#101935] border border-[#18264e] px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-[#0b1329]/40 border border-[#131d35] p-4.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-white">Tips</h5>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  Kirim reminder sebelum tanggal jatuh tempo untuk meningkatkan tingkat koleksi pembayaran.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
