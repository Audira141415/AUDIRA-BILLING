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
  TrendingUp,
  Settings,
  HelpCircle,
  Wallet,
  ArrowUpRight,
  Upload,
  BookOpen
} from 'lucide-react';

interface TaxRow {
  id: string;
  date: string;
  taxType: 'PPN Keluaran' | 'PPN Masukan';
  description: string;
  dpp: number;
  rate: string;
  taxAmount: number;
  status: 'Faktur Dibuat' | 'Faktur Valid' | 'e-Faktur Terkirim';
  fakturNo: string;
}

const mockTaxData: TaxRow[] = [
  {
    id: '1',
    date: '01/07/2026',
    taxType: 'PPN Keluaran',
    description: 'INV/2026/07/0001',
    dpp: 10000000,
    rate: '11%',
    taxAmount: 1100000,
    status: 'Faktur Dibuat',
    fakturNo: '010.001-26.12345678'
  },
  {
    id: '2',
    date: '01/07/2026',
    taxType: 'PPN Keluaran',
    description: 'INV/2026/07/0002',
    dpp: 5500000,
    rate: '11%',
    taxAmount: 605000,
    status: 'Faktur Dibuat',
    fakturNo: '010.001-26.12345679'
  },
  {
    id: '3',
    date: '30/06/2026',
    taxType: 'PPN Masukan',
    description: 'Pembelian Perangkat',
    dpp: 4000000,
    rate: '11%',
    taxAmount: 440000,
    status: 'Faktur Valid',
    fakturNo: '020.001-26.87654321'
  },
  {
    id: '4',
    date: '30/06/2026',
    taxType: 'PPN Keluaran',
    description: 'INV/2026/06/0100',
    dpp: 7500000,
    rate: '11%',
    taxAmount: 825000,
    status: 'Faktur Dibuat',
    fakturNo: '010.001-26.12345001'
  },
  {
    id: '5',
    date: '30/06/2026',
    taxType: 'PPN Masukan',
    description: 'Pembelian Router',
    dpp: 2500000,
    rate: '11%',
    taxAmount: 275000,
    status: 'Faktur Valid',
    fakturNo: '020.001-26.87654322'
  },
  {
    id: '6',
    date: '29/06/2026',
    taxType: 'PPN Keluaran',
    description: 'INV/2026/06/0099',
    dpp: 12000000,
    rate: '11%',
    taxAmount: 1320000,
    status: 'e-Faktur Terkirim',
    fakturNo: '010.001-26.12345999'
  },
  {
    id: '7',
    date: '28/06/2026',
    taxType: 'PPN Masukan',
    description: 'Pembelian Access Point',
    dpp: 1800000,
    rate: '11%',
    taxAmount: 198000,
    status: 'Faktur Valid',
    fakturNo: '020.001-26.87654323'
  },
  {
    id: '8',
    date: '28/06/2026',
    taxType: 'PPN Keluaran',
    description: 'INV/2026/06/0098',
    dpp: 9000000,
    rate: '11%',
    taxAmount: 990000,
    status: 'e-Faktur Terkirim',
    fakturNo: '010.001-26.12345998'
  },
  {
    id: '9',
    date: '27/06/2026',
    taxType: 'PPN Masukan',
    description: 'Biaya Listrik',
    dpp: 600000,
    rate: '11%',
    taxAmount: 66000,
    status: 'Faktur Valid',
    fakturNo: '020.001-26.87654324'
  },
  {
    id: '10',
    date: '27/06/2026',
    taxType: 'PPN Keluaran',
    description: 'INV/2026/06/0097',
    dpp: 6000000,
    rate: '11%',
    taxAmount: 660000,
    status: 'Faktur Dibuat',
    fakturNo: '010.001-26.12345997'
  }
];

interface EFakturHistory {
  no: number;
  fakturNo: string;
  date: string;
  customerName: string;
  dpp: number;
  ppn: number;
  status: string;
  sentDate: string;
}

const mockEFakturHistory: EFakturHistory[] = [
  {
    no: 1,
    fakturNo: '010.001-26.12345678',
    date: '01/07/2026',
    customerName: 'Budi Santoso',
    dpp: 10000000,
    ppn: 1100000,
    status: 'Faktur Dibuat',
    sentDate: '01/07/2026 10:30'
  },
  {
    no: 2,
    fakturNo: '010.001-26.12345679',
    date: '01/07/2026',
    customerName: 'Siti Aminah',
    dpp: 5500000,
    ppn: 605000,
    status: 'Faktur Dibuat',
    sentDate: '01/07/2026 10:25'
  },
  {
    no: 3,
    fakturNo: '010.001-26.12345999',
    date: '29/06/2026',
    customerName: 'Andi Pratama',
    dpp: 12000000,
    ppn: 1320000,
    status: 'e-Faktur Terkirim',
    sentDate: '29/06/2026 14:10'
  },
  {
    no: 4,
    fakturNo: '010.001-26.12345998',
    date: '28/06/2026',
    customerName: 'Rina Marlina',
    dpp: 9000000,
    ppn: 990000,
    status: 'e-Faktur Terkirim',
    sentDate: '28/06/2026 11:05'
  },
  {
    no: 5,
    fakturNo: '010.001-26.12345997',
    date: '27/06/2026',
    customerName: 'Dewi Lestari',
    dpp: 6000000,
    ppn: 660000,
    status: 'Faktur Dibuat',
    sentDate: '27/06/2026 09:20'
  }
];

export default function TaxPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockTaxData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockTaxData.map(d => d.id));
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
              <span className="text-blue-400">Pajak & PPN</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pajak & PPN</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Card 1: Total Pajak Keluaran */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Pajak Keluaran</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 127.850.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">PPN 11%</p>
            </div>
          </div>

          {/* Card 2: Total Pajak Masukan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Pajak Masukan</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 56.320.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">PPN 11%</p>
            </div>
          </div>

          {/* Card 3: Total PPN Terutang */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total PPN Terutang</p>
              <p className="text-2xl font-black text-white mt-0.5">Rp 71.530.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">(Keluaran - Masukan)</p>
            </div>
          </div>

          {/* Card 4: Faktur Pajak Dibuat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Faktur Pajak Dibuat</p>
              <p className="text-2xl font-black text-white mt-0.5">86</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Bulan Ini</p>
            </div>
          </div>

          {/* Card 5: e-Faktur Terkirim */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">e-Faktur Terkirim</p>
              <p className="text-2xl font-black text-white mt-0.5">72</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Bulan Ini</p>
            </div>
          </div>

          {/* Card 6: Belum Disetor */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Belum Disetor</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 12.450.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Jatuh Tempo</p>
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
                placeholder="Cari invoice, customer, no faktur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Jenis Pajak</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Periode</option>
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

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Plus size={14} />
              <span>Buat Faktur Pajak</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-gray-400" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Tax Table & Extra Charts */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
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
                      <th className="p-4 w-32">TANGGAL</th>
                      <th className="p-4 w-36">JENIS PAJAK</th>
                      <th className="p-4 w-48">DESKRIPSI</th>
                      <th className="p-4 w-44">DPP (DASAR PENGENAAN)</th>
                      <th className="p-4 w-24">TARIF</th>
                      <th className="p-4 w-32">PAJAK</th>
                      <th className="p-4 w-32">STATUS</th>
                      <th className="p-4 w-48">NO FAKTUR PAJAK</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {mockTaxData.map((d, idx) => {
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
                          <td className="p-4 text-gray-400 font-medium">{d.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.taxType === 'PPN Keluaran'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                              {d.taxType}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-white">{d.description}</td>
                          <td className="p-4 font-bold text-white">{formatCurrency(d.dpp)}</td>
                          <td className="p-4 text-gray-400 font-bold">{d.rate}</td>
                          <td className="p-4 font-bold text-white">{formatCurrency(d.taxAmount)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.status === 'Faktur Dibuat' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : d.status === 'Faktur Valid'
                                ? 'bg-green-600/10 text-green-500 border border-green-600/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-gray-400 font-semibold">{d.fakturNo}</td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">86</span> data
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
                    <span className="text-gray-600 text-xs px-1">...</span>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">9</button>
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

            {/* Bottom Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Grafik Pajak (6 Bulan Terakhir) */}
              <div className="lg:col-span-5 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Grafik Pajak (6 Bulan Terakhir)</h4>
                
                {/* SVG Combo Chart (Bar & Line) */}
                <div className="h-28 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#131d35" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#131d35" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#131d35" strokeDasharray="3 3" />
                    
                    <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 150 Jt</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 90 Jt</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 30 Jt</text>
                    
                    {/* Bars for PPN Keluaran (purple) and Masukan (green) */}
                    {[
                      { x: 50, keluaran: 30, masukan: 40 },
                      { x: 90, keluaran: 45, masukan: 35 },
                      { x: 130, keluaran: 55, masukan: 42 },
                      { x: 170, keluaran: 40, masukan: 50 },
                      { x: 210, keluaran: 65, masukan: 45 },
                      { x: 250, keluaran: 50, masukan: 38 }
                    ].map((bar, idx) => (
                      <g key={idx}>
                        <rect x={bar.x} y={100 - bar.keluaran} width="6" height={bar.keluaran} fill="#8b5cf6" opacity="0.8" rx="1" />
                        <rect x={bar.x + 8} y={100 - bar.masukan} width="6" height={bar.masukan} fill="#10b981" opacity="0.8" rx="1" />
                      </g>
                    ))}

                    {/* Line for PPN Terutang (orange) */}
                    <path
                      d="M53,60 L93,65 L133,52 L173,62 L213,42 L253,58"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    
                    <text x="48" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Feb 2026</text>
                    <text x="88" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Mar 2026</text>
                    <text x="128" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Apr 2026</text>
                    <text x="168" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Mei 2026</text>
                    <text x="208" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Jun 2026</text>
                    <text x="248" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">Jul 2026</text>
                  </svg>
                </div>
              </div>

              {/* Status e-Faktur Pajak */}
              <div className="lg:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Status e-Faktur Pajak</h4>
                
                <div className="flex gap-4 items-center">
                  <div className="relative flex justify-center scale-90 flex-shrink-0">
                    <svg width="80" height="80" viewBox="0 0 42 42" className="transform -rotate-90">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="51.2 48.8" strokeDashoffset="0" />
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="32.6 67.4" strokeDashoffset="-51.2" />
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="11.6 88.4" strokeDashoffset="-83.8" />
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="4.6 95.4" strokeDashoffset="-95.4" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-sm font-black text-white">86</p>
                      <p className="text-[6px] text-gray-500 font-bold uppercase">Total</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] text-gray-400 flex-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-green-500" />Faktur Dibuat</span>
                      <span className="text-white">44 (51.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-blue-500" />e-Faktur Kirim</span>
                      <span className="text-white">28 (32.6%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-green-600" />Faktur Valid</span>
                      <span className="text-white">10 (11.6%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-red-500" />Gagal</span>
                      <span className="text-white">4 (4.6%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tugas Cepat */}
              <div className="lg:col-span-3 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tugas Cepat</h4>
                
                <div className="space-y-2 text-[10px] font-bold text-gray-400">
                  <div className="flex items-center justify-between p-2 bg-[#080d19] border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Plus size={12} className="text-blue-500" />
                      <span>Buat Faktur Pajak</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#080d19] border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Upload size={12} className="text-purple-400" />
                      <span>Upload Faktur Masukan</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#080d19] border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileText size={12} className="text-yellow-500" />
                      <span>Laporan PPN</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#080d19] border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Wallet size={12} className="text-green-500" />
                      <span>Setor PPN</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Riwayat e-Faktur Terbaru */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Riwayat e-Faktur Terbaru</h3>
              
              <div className="overflow-x-auto border border-[#131d35] rounded-xl">
                <table className="w-full text-left border-collapse text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3 w-12">NO</th>
                      <th className="p-3">NO FAKTUR</th>
                      <th className="p-3">TANGGAL</th>
                      <th className="p-3">PELANGGAN</th>
                      <th className="p-3">DPP</th>
                      <th className="p-3">PPN</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3">TANGGAL KIRIM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]">
                    {mockEFakturHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#121c38]/40 transition-colors">
                        <td className="p-3 text-gray-500 font-medium">{item.no}</td>
                        <td className="p-3 font-mono font-bold text-blue-400">{item.fakturNo}</td>
                        <td className="p-3 text-gray-400 font-medium">{item.date}</td>
                        <td className="p-3 font-bold text-white">{item.customerName}</td>
                        <td className="p-3 font-bold text-white">{formatCurrency(item.dpp)}</td>
                        <td className="p-3 font-bold text-white">{formatCurrency(item.ppn)}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                            item.status === 'Faktur Dibuat' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-550 font-medium">{item.sentDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Pajak Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Pajak</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* PPN Keluaran: 127.85 / 198.40 = 64.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4.5" 
                    strokeDasharray="64.4 35.6" 
                    strokeDashoffset="0" 
                  />

                  {/* PPN Masukan: 56.32 / 198.40 = 28.2% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="28.2 71.8" 
                    strokeDashoffset="-64.4" 
                  />

                  {/* PPN Terutang: 71.53 / 198.40 = 35.8% (Note: visual overlap for outstanding sum representation) */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray="35.8 64.2" 
                    strokeDashoffset="-92.6" 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xs font-black text-white">Total PPN</p>
                  <p className="text-[10px] text-blue-400 font-bold">Rp 71.530.000</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                    <span>PPN Keluaran</span>
                  </div>
                  <span className="font-semibold text-white">Rp 127.850.000 (64.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-green-550 bg-green-500 inline-block"></span>
                    <span>PPN Masukan</span>
                  </div>
                  <span className="font-semibold text-white">Rp 56.320.000 (28.2%)</span>
                </div>
                <div className="flex items-center justify-between font-bold border-t border-[#131d35] pt-1.5 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                    <span>PPN Terutang</span>
                  </div>
                  <span className="text-white">Rp 71.530.000 (35.8%)</span>
                </div>
              </div>

              {/* Value Summary Details */}
              <div className="pt-3 border-t border-[#131d35] text-[11px] text-gray-400 space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total PPN Keluaran</span>
                  <span className="text-white font-bold">Rp 127.850.000</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN Terutang (Keluaran - Masukan)</span>
                  <span className="text-blue-400 font-bold">Rp 71.530.000</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN Telah Disetor</span>
                  <span className="text-green-400">Rp 59.080.000</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN Belum Disetor</span>
                  <span className="text-red-400">Rp 12.450.000</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500">
                  <span>Jatuh Tempo Setor</span>
                  <span className="font-bold">15 Juli 2026</span>
                </div>
              </div>
            </div>

            {/* Card 2: Jatuh Tempo Setor */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Jatuh Tempo Setor</h3>
              
              <div className="space-y-4 text-xs font-semibold">
                {[
                  { month: 'PPN Juni 2026', amount: 12450000, days: '5 Hari Lagi', date: '15 Jul', active: true },
                  { month: 'PPN Juli 2026', amount: 14320000, days: '35 Hari Lagi', date: '15 Agu' },
                  { month: 'PPN Agustus 2026', amount: 13980000, days: '66 Hari Lagi', date: '15 Sep' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#080d19] border border-[#1e2e58] flex flex-col items-center justify-center text-[9px] text-gray-400">
                      <span className="font-black text-white leading-none">{item.date.split(' ')[0]}</span>
                      <span className="text-[7px] text-gray-500 font-bold uppercase mt-1">{item.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-gray-300 font-bold">{item.month}</p>
                      <p className="text-[10px] text-gray-400">{formatCurrency(item.amount)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      item.active ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.days}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[#131d35]">
                Lihat Semua Jatuh Tempo
              </button>
            </div>

            {/* Card 3: Dasar Hukum */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Dasar Hukum</h3>
              
              <ul className="space-y-3.5 text-[10px] font-bold text-gray-400 list-disc list-inside">
                <li>UU No. 42 Tahun 2009 tentang PPN</li>
                <li>PMK No. 18/PMK.03/2021 tentang Faktur Pajak</li>
                <li>PMK No. 243/PMK.03/2014 tentang Tata Cara Pembuatan Faktur Pajak</li>
                <li>PER-03/PJ/2022 tentang Tata Cara Pembuatan e-Faktur</li>
              </ul>

              <button className="w-full flex items-center justify-center gap-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-blue-400 text-xs font-bold py-2.5 rounded-xl transition-all">
                <BookOpen size={13} />
                <span>Download Regulasi</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
