import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Edit2,
  Play,
  Pause,
  RotateCcw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface RecurringRow {
  id: string;
  name: string;
  code: string;
  customerName: string;
  customerNo: string;
  packageName: string;
  period: string;
  cycle: string;
  nextGenerate: string;
  nextGenerateDesc: string;
  total: number;
  status: 'Aktif' | 'Dijeda' | 'Gagal';
}

const mockRecurring: RecurringRow[] = [
  {
    id: '1',
    name: 'Budi Santoso - Home 50 Mbps',
    code: 'INV-REC-2026-0001',
    customerName: 'Budi Santoso',
    customerNo: 'CUST-0001',
    packageName: 'Home 50 Mbps',
    period: '01/07/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 375000,
    status: 'Aktif'
  },
  {
    id: '2',
    name: 'Siti Aminah - Home 20 Mbps',
    code: 'INV-REC-2026-0002',
    customerName: 'Siti Aminah',
    customerNo: 'CUST-0002',
    packageName: 'Home 20 Mbps',
    period: '01/07/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 250000,
    status: 'Aktif'
  },
  {
    id: '3',
    name: 'Andi Pratama - Home 100 Mbps',
    code: 'INV-REC-2026-0003',
    customerName: 'Andi Pratama',
    customerNo: 'CUST-0003',
    packageName: 'Home 100 Mbps',
    period: '01/07/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 575000,
    status: 'Aktif'
  },
  {
    id: '4',
    name: 'PT. Maju Bersama - Corporate 200 Mbps',
    code: 'INV-REC-2026-0004',
    customerName: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    packageName: 'Corporate 200 Mbps',
    period: '01/06/2026 - 30/06/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/07/2026',
    nextGenerateDesc: 'Hari ini',
    total: 1250000,
    status: 'Aktif'
  },
  {
    id: '5',
    name: 'Dewi Lestari - Home 10 Mbps',
    code: 'INV-REC-2026-0005',
    customerName: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    packageName: 'Home 10 Mbps',
    period: '01/07/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 150000,
    status: 'Aktif'
  },
  {
    id: '6',
    name: 'Fajar Nugroho - Home 50 Mbps',
    code: 'INV-REC-2026-0006',
    customerName: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    packageName: 'Home 50 Mbps',
    period: '01/07/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 375000,
    status: 'Dijeda'
  },
  {
    id: '7',
    name: 'Nina Wulandari - Home 20 Mbps',
    code: 'INV-REC-2026-0007',
    customerName: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    packageName: 'Home 20 Mbps',
    period: '01/07/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 250000,
    status: 'Aktif'
  },
  {
    id: '8',
    name: 'Yudi Hermawan - Corporate 50 Mbps',
    code: 'INV-REC-2026-0008',
    customerName: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    packageName: 'Corporate 50 Mbps',
    period: '01/06/2026 - 30/06/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/07/2026',
    nextGenerateDesc: 'Hari ini',
    total: 500000,
    status: 'Aktif'
  },
  {
    id: '9',
    name: 'CV. Sinar Abadi - Corporate 300 Mbps',
    code: 'INV-REC-2026-0009',
    customerName: 'CV. Sinar Abadi',
    customerNo: 'CUST-0011',
    packageName: 'Corporate 300 Mbps',
    period: '01/06/2026 - 30/06/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/07/2026',
    nextGenerateDesc: 'Hari ini',
    total: 2000000,
    status: 'Gagal'
  },
  {
    id: '10',
    name: 'PT. Digital Nusantara - Corporate 500 Mbps',
    code: 'INV-REC-2026-0010',
    customerName: 'PT. Digital Nusantara',
    customerNo: 'CUST-0012',
    packageName: 'Corporate 500 Mbps',
    period: '01/07/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 3500000,
    status: 'Aktif'
  }
];

export default function RecurringInvoicePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockRecurring.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockRecurring.map(r => r.id));
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
              <span className="text-blue-400">Invoice Berulang</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Invoice Berulang</h1>
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
          {/* Card 1: Total Berulang */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Berulang</p>
              <p className="text-xl font-black text-white mt-0.5">86</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Semua invoice berulang</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-xl font-black text-white mt-0.5">64</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">74.4% dari total</p>
            </div>
          </div>

          {/* Card 3: Akan Dibuat Hari Ini */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Akan Dibuat Hari Ini</p>
              <p className="text-xl font-black text-white mt-0.5">12</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 4.250.000</p>
            </div>
          </div>

          {/* Card 4: Berhasil Dibuat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Berhasil Dibuat (Bulan Ini)</p>
              <p className="text-xl font-black text-white mt-0.5">152</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 54.250.000</p>
            </div>
          </div>

          {/* Card 5: Gagal Dibuat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gagal Dibuat (Bulan Ini)</p>
              <p className="text-xl font-black text-white mt-0.5">3</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Rp 1.250.000</p>
            </div>
          </div>

          {/* Card 6: Dijeda */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-xl">
              <Pause size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Dijeda</p>
              <p className="text-xl font-black text-white mt-0.5">7</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">8.1% dari total</p>
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
                placeholder="Cari nama, package, atau customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Periode</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Sales</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Area</option>
            </select>

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
              <span>Tambah Berulang</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-gray-400" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Recurring Table */}
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
                      <th className="p-4 w-52">NAMA BERULANG</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-40">PERIODE</th>
                      <th className="p-4 w-28">SIKLUS</th>
                      <th className="p-4 w-36">NEXT GENERATE</th>
                      <th className="p-4 w-32">TOTAL TAGIHAN</th>
                      <th className="p-4 w-24">STATUS</th>
                      <th className="p-4 w-24 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {mockRecurring.map((r, idx) => {
                      const isSelected = selectedIds.includes(r.id);
                      return (
                        <tr 
                          key={r.id}
                          onClick={() => handleSelectRow(r.id)}
                          className={`hover:bg-[#121c38]/40 transition-colors cursor-pointer ${isSelected ? 'bg-[#121c38]/50' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleSelectRow(r.id)}
                              className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" 
                            />
                          </td>
                          <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="font-bold text-white block">{r.name}</span>
                              <span className="font-mono text-[9px] text-gray-500 block font-semibold">{r.code}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-white block">{r.customerName}</span>
                              <span className="text-[10px] text-gray-500 block font-semibold">{r.customerNo}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-gray-300">{r.packageName}</td>
                          <td className="p-4 text-gray-400 font-medium">{r.period}</td>
                          <td className="p-4 text-gray-400 font-medium">{r.cycle}</td>
                          <td className="p-4">
                            <span className="block text-gray-300 font-semibold">{r.nextGenerate}</span>
                            <span className={`text-[10px] block mt-0.5 ${r.nextGenerateDesc === 'Hari ini' ? 'text-orange-400 font-bold' : 'text-green-500'}`}>
                              {r.nextGenerateDesc}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-white">{formatCurrency(r.total)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              r.status === 'Aktif' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : r.status === 'Dijeda'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                {r.status === 'Aktif' ? <Pause size={13} /> : <Play size={13} />}
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
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">4</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">5</button>
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

            {/* Bottom Section: Jadwal Generate Berikutnya */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Jadwal Generate Berikutnya</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { title: 'Hari Ini', date: '01 Juli 2026', count: 12, amount: 4250000, active: true },
                  { title: '2 Hari Lagi', date: '03 Juli 2026', count: 18, amount: 6750000 },
                  { title: '3 Hari Lagi', date: '04 Juli 2026', count: 15, amount: 4875000 },
                  { title: '7 Hari Lagi', date: '08 Juli 2026', count: 21, amount: 7125000 },
                  { title: '30 Hari Lagi', date: '31 Juli 2026', count: 10, amount: 3250000 },
                  { title: '> 30 Hari', date: '-', count: 10, amount: 2750000 }
                ].map((sched, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl flex flex-col justify-between gap-3 transition-colors ${
                      sched.active 
                        ? 'bg-amber-500/10 border-2 border-amber-500/40 text-amber-400' 
                        : 'bg-[#080d19] border border-[#131d35] hover:bg-[#101c3a]/30'
                    }`}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider">{sched.title}</p>
                      <p className="text-[9px] text-gray-500 font-medium mt-0.5">{sched.date}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{sched.count} Invoice</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">{formatCurrency(sched.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Berulang Donut Chart */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Berulang</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Aktif: 64 / 86 = 74.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray={`${(64 / 86) * 100} ${100 - (64 / 86) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Dijeda: 7 / 86 = 8.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(7 / 86) * 100} ${100 - (7 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (64 / 86) * 100}`} 
                  />

                  {/* Gagal: 3 / 86 = 3.5% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(3 / 86) * 100} ${100 - (3 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (71 / 86) * 100}`} 
                  />

                  {/* Selesai: 12 / 86 = 14% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray={`${(12 / 86) * 100} ${100 - (12 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (74 / 86) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-white">86</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#10b981] inline-block"></span>
                    <span>Aktif</span>
                  </div>
                  <span className="font-semibold text-white">64 (74.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#f97316] inline-block"></span>
                    <span>Dijeda</span>
                  </div>
                  <span className="font-semibold text-white">7 (8.1%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#ef4444] inline-block"></span>
                    <span>Gagal</span>
                  </div>
                  <span className="font-semibold text-white">3 (3.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#3b82f6] inline-block"></span>
                    <span>Selesai</span>
                  </div>
                  <span className="font-semibold text-white">12 (14.0%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Siklus Berulang */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Siklus Berulang</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Bulanan', count: 78, percentage: 90.7, color: 'bg-blue-600' },
                  { name: 'Mingguan', count: 3, percentage: 3.5, color: 'bg-purple-600' },
                  { name: 'Tahunan', count: 2, percentage: 2.3, color: 'bg-orange-600' },
                  { name: 'Kustom', count: 3, percentage: 3.5, color: 'bg-green-600' },
                ].map((item, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-300">{item.name}</span>
                        <span className="text-[10px] font-semibold text-gray-400">{item.count} ({item.percentage}%)</span>
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

            {/* Card 3: Selanjutnya Generate */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Selanjutnya Generate</h3>
              
              <div className="space-y-2 text-xs font-semibold text-gray-400">
                <div className="flex justify-between items-center text-amber-500">
                  <span>Hari Ini</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>1 - 3 Hari</span>
                  <span className="text-white">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>4 - 7 Hari</span>
                  <span className="text-white">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>&gt; 7 Hari</span>
                  <span className="text-white">28</span>
                </div>
              </div>
            </div>

            {/* Card 4: Pengaturan Otomatis */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Pengaturan Otomatis</h3>
              
              <div className="space-y-3 text-[11px] font-semibold text-gray-400">
                {[
                  { name: 'Auto Generate', desc: 'Aktif' },
                  { name: 'Auto Send WA', desc: 'Aktif' },
                  { name: 'Auto Send Email', desc: 'Aktif' },
                  { name: 'Skip Jika Suspend', desc: 'Aktif' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
