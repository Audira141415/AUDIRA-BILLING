import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Edit2,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  Trash2,
  CheckCircle,
  FileText,
  Clock,
  AlertCircle,
  XCircle,
  Send,
  MessageCircle,
  Plus
} from 'lucide-react';

interface DraftRow {
  id: string;
  draftNo: string;
  customerName: string;
  customerNo: string;
  packageName: string;
  period: string;
  total: number;
  createdBy: string;
  lastModified: string;
  status: 'Perlu Diperiksa' | 'Perlu Approval' | 'Siap Dipublish' | 'Sudah Ditolak';
}

const mockDrafts: DraftRow[] = [
  {
    id: '1',
    draftNo: 'DRAFT/2026/07/0001',
    customerName: 'Budi Santoso',
    customerNo: 'CUST-0001',
    packageName: 'Home 50 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 375000,
    createdBy: 'Agus Dwi Rianto',
    lastModified: '01/07/2026 08:31 WIB',
    status: 'Perlu Diperiksa'
  },
  {
    id: '2',
    draftNo: 'DRAFT/2026/07/0002',
    customerName: 'Siti Aminah',
    customerNo: 'CUST-0002',
    packageName: 'Home 20 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 250000,
    createdBy: 'Rina Marlina',
    lastModified: '01/07/2026 08:15 WIB',
    status: 'Perlu Diperiksa'
  },
  {
    id: '3',
    draftNo: 'DRAFT/2026/07/0003',
    customerName: 'Andi Pratama',
    customerNo: 'CUST-0003',
    packageName: 'Home 100 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 575000,
    createdBy: 'Agus Dwi Rianto',
    lastModified: '01/07/2026 07:59 WIB',
    status: 'Perlu Approval'
  },
  {
    id: '4',
    draftNo: 'DRAFT/2026/07/0004',
    customerName: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    packageName: 'Corporate 200 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 1250000,
    createdBy: 'Rina Marlina',
    lastModified: '30/06/2026 16:45 WIB',
    status: 'Perlu Approval'
  },
  {
    id: '5',
    draftNo: 'DRAFT/2026/07/0005',
    customerName: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    packageName: 'Home 10 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 150000,
    createdBy: 'Fitri Handayani',
    lastModified: '30/06/2026 14:22 WIB',
    status: 'Siap Dipublish'
  },
  {
    id: '6',
    draftNo: 'DRAFT/2026/07/0006',
    customerName: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    packageName: 'Home 50 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 375000,
    createdBy: 'Agus Dwi Rianto',
    lastModified: '30/06/2026 13:10 WIB',
    status: 'Perlu Diperiksa'
  },
  {
    id: '7',
    draftNo: 'DRAFT/2026/07/0007',
    customerName: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    packageName: 'Home 20 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 250000,
    createdBy: 'Rina Marlina',
    lastModified: '30/06/2026 11:05 WIB',
    status: 'Perlu Approval'
  },
  {
    id: '8',
    draftNo: 'DRAFT/2026/07/0008',
    customerName: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    packageName: 'Corporate 50 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 500000,
    createdBy: 'Fitri Handayani',
    lastModified: '30/06/2026 10:20 WIB',
    status: 'Perlu Diperiksa'
  },
  {
    id: '9',
    draftNo: 'DRAFT/2026/07/0009',
    customerName: 'Eva Apriyani',
    customerNo: 'CUST-0010',
    packageName: 'Home 100 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 375000,
    createdBy: 'Agus Dwi Rianto',
    lastModified: '29/06/2026 17:30 WIB',
    status: 'Sudah Ditolak'
  },
  {
    id: '10',
    draftNo: 'DRAFT/2026/07/0010',
    customerName: 'CV. Sinar Abadi',
    customerNo: 'CUST-0011',
    packageName: 'Corporate 300 Mbps',
    period: '01/07/2026 - 31/07/2026',
    total: 2000000,
    createdBy: 'Rina Marlina',
    lastModified: '29/06/2026 14:12 WIB',
    status: 'Siap Dipublish'
  }
];

export default function DraftInvoicePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockDrafts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockDrafts.map(d => d.id));
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
              <span className="text-blue-400">Draft Invoice</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Draft Invoice</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Card 1: Total Draft */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Draft</p>
              <p className="text-2xl font-black text-white mt-0.5">32</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Semua draft</p>
            </div>
          </div>

          {/* Card 2: Perlu Diperiksa */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Perlu Diperiksa</p>
              <p className="text-2xl font-black text-white mt-0.5">18</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">56.3% dari total</p>
            </div>
          </div>

          {/* Card 3: Perlu Approval */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Perlu Approval</p>
              <p className="text-2xl font-black text-white mt-0.5">7</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">21.9% dari total</p>
            </div>
          </div>

          {/* Card 4: Sudah Ditolak */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sudah Ditolak</p>
              <p className="text-2xl font-black text-white mt-0.5">2</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">6.3% dari total</p>
            </div>
          </div>

          {/* Card 5: Siap Dipublish */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Siap Dipublish</p>
              <p className="text-2xl font-black text-white mt-0.5">5</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">15.6% dari total</p>
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
                placeholder="Cari draft invoice, customer, package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]">
              <option>Semua Sales</option>
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
          </div>
        </div>

        {/* ─── Mass Action bar ────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mr-2">
            Mass Action ({selectedIds.length} dipilih)
          </span>
          
          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
            <Edit2 size={13} />
            <span>Edit</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
            <Eye size={13} />
            <span>Preview</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
            <CheckCircle size={13} />
            <span>Publish</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
            <MessageCircle size={13} />
            <span>Kirim WA</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
            <Mail size={13} />
            <span>Kirim Email</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-red-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <Trash2 size={13} />
            <span>Hapus</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-xs px-3.5 py-2 rounded-xl transition-all">
            <Send size={13} />
            <span>Export</span>
          </button>

          <button className="p-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400">
            <MoreVertical size={13} />
          </button>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Draft Table */}
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
                      <th className="p-4 w-44">DRAFT NO</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-40">PERIODE</th>
                      <th className="p-4 w-28">TOTAL</th>
                      <th className="p-4 w-32">DIBUAT OLEH</th>
                      <th className="p-4 w-44">TERAKHIR DIUBAH</th>
                      <th className="p-4 w-32">STATUS</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {mockDrafts.map((d, idx) => {
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
                            <span className="text-blue-400 font-bold">{d.draftNo}</span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-white block">{d.customerName}</span>
                              <span className="text-[10px] text-gray-500 block font-semibold">{d.customerNo}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-gray-300">{d.packageName}</td>
                          <td className="p-4 text-gray-400 font-medium">{d.period}</td>
                          <td className="p-4 font-bold text-white">{formatCurrency(d.total)}</td>
                          <td className="p-4 text-gray-400 font-medium">{d.createdBy}</td>
                          <td className="p-4 text-gray-400 font-medium">{d.lastModified}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.status === 'Siap Dipublish' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : d.status === 'Perlu Diperiksa'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : d.status === 'Perlu Approval'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Eye size={13} />
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">32</span> data
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
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Draft */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Draft</h3>
              
              <div className="bg-[#080d19]/40 border border-[#131d35] p-3 rounded-xl flex items-start gap-3 text-xs text-gray-400 leading-normal">
                <FileText size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] font-medium text-gray-400">
                  Draft invoice adalah invoice yang belum dipublish.
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Total Draft</span>
                  <span className="font-bold text-white">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Perlu Diperiksa</span>
                  <span className="font-semibold text-white">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Perlu Approval</span>
                  <span className="font-semibold text-white">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Siap Dipublish</span>
                  <span className="font-semibold text-white">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sudah Ditolak</span>
                  <span className="font-semibold text-white">2</span>
                </div>
              </div>
            </div>

            {/* Card 2: Aktivitas Terakhir */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terakhir</h3>
              
              <div className="relative border-l border-[#131d35] pl-4 ml-2 space-y-5 text-[11px] text-gray-400">
                
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1">
                    <span className="text-[10px] font-bold text-gray-400">INV/2026/07/0003</span>
                    <span>Hari ini, 08:31</span>
                  </div>
                  <p className="leading-relaxed">
                    Dibuat oleh <strong className="text-white">Agus Dwi Rianto</strong>
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-orange-500" />
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1">
                    <span className="text-[10px] font-bold text-gray-400">INV/2026/07/0002</span>
                    <span>Hari ini, 08:15</span>
                  </div>
                  <p className="leading-relaxed">
                    Diubah oleh <strong className="text-white">Rina Marlina</strong>
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1">
                    <span className="text-[10px] font-bold text-gray-400">INV/2026/07/0005</span>
                    <span>Hari ini, 07:59</span>
                  </div>
                  <p className="leading-relaxed font-medium">
                    Siap dipublish
                  </p>
                </div>

                {/* Item 4 */}
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-red-500" />
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1">
                    <span className="text-[10px] font-bold text-gray-400">INV/2026/06/0021</span>
                    <span>Kemarin, 16:45</span>
                  </div>
                  <p className="leading-relaxed">
                    Ditolak oleh <strong className="text-white">Super Admin</strong>
                  </p>
                </div>

                {/* Item 5 */}
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1">
                    <span className="text-[10px] font-bold text-gray-400">INV/2026/06/0020</span>
                    <span>Kemarin, 14:22</span>
                  </div>
                  <p className="leading-relaxed">
                    Dibuat oleh <strong className="text-white">Fitri Handayani</strong>
                  </p>
                </div>

              </div>
              
              <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[#131d35]">
                Lihat Semua Aktivitas
              </button>
            </div>

            {/* Tips Card */}
            <div className="bg-[#0b1329]/40 border border-[#131d35] p-4.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <FileText size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-white">Tips</h5>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  Anda dapat membuat draft invoice terlebih dahulu, kemudian publish ketika sudah siap untuk dikirim ke customer.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
