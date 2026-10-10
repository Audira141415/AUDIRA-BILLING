import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
  Trash2,
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
  Upload,
  Settings,
  HelpCircle,
  Wallet,
  Play,
  Save,
  Send,
  Lightbulb
} from 'lucide-react';

interface CustomerRow {
  id: string;
  custNo: string;
  name: string;
  group: 'Corporate' | 'Rumah' | 'Instansi';
  packageName: string;
  monthlyBill: number;
  tax: number;
  total: number;
  status: string;
}

const mockCustomers: CustomerRow[] = [
  {
    id: '1',
    custNo: 'CUST-0001',
    name: 'Budi Santoso',
    group: 'Corporate',
    packageName: 'Biz 100 Mbps',
    monthlyBill: 1200000,
    tax: 132000,
    total: 1332000,
    status: 'Siap Generate'
  },
  {
    id: '2',
    custNo: 'CUST-0002',
    name: 'Siti Aminah',
    group: 'Rumah',
    packageName: 'Home 50 Mbps',
    monthlyBill: 450000,
    tax: 49500,
    total: 499500,
    status: 'Siap Generate'
  },
  {
    id: '3',
    custNo: 'CUST-0003',
    name: 'Andi Pratama',
    group: 'Corporate',
    packageName: 'Biz 200 Mbps',
    monthlyBill: 2200000,
    tax: 242000,
    total: 2442000,
    status: 'Siap Generate'
  },
  {
    id: '4',
    custNo: 'CUST-0004',
    name: 'Rina Marlina',
    group: 'Rumah',
    packageName: 'Home 30 Mbps',
    monthlyBill: 350000,
    tax: 38500,
    total: 388500,
    status: 'Siap Generate'
  },
  {
    id: '5',
    custNo: 'CUST-0005',
    name: 'PT. Maju Bersama',
    group: 'Instansi',
    packageName: 'Office 100 Mbps',
    monthlyBill: 1800000,
    tax: 198000,
    total: 1998000,
    status: 'Siap Generate'
  },
  {
    id: '6',
    custNo: 'CUST-0006',
    name: 'Dewi Lestari',
    group: 'Rumah',
    packageName: 'Home 20 Mbps',
    monthlyBill: 300000,
    tax: 33000,
    total: 333000,
    status: 'Siap Generate'
  },
  {
    id: '7',
    custNo: 'CUST-0007',
    name: 'Fajar Nugroho',
    group: 'Corporate',
    packageName: 'Biz 50 Mbps',
    monthlyBill: 950000,
    tax: 104500,
    total: 1054500,
    status: 'Siap Generate'
  },
  {
    id: '8',
    custNo: 'CUST-0008',
    name: 'Nina Wulandari',
    group: 'Rumah',
    packageName: 'Home 10 Mbps',
    monthlyBill: 250000,
    tax: 27500,
    total: 277500,
    status: 'Siap Generate'
  },
  {
    id: '9',
    custNo: 'CUST-0009',
    name: 'Yudi Hermawan',
    group: 'Instansi',
    packageName: 'Office 200 Mbps',
    monthlyBill: 2800000,
    tax: 308000,
    total: 3108000,
    status: 'Siap Generate'
  },
  {
    id: '10',
    custNo: 'CUST-0010',
    name: 'CV. Sinar Abadi',
    group: 'Corporate',
    packageName: 'Biz 100 Mbps',
    monthlyBill: 1300000,
    tax: 143000,
    total: 1443000,
    status: 'Siap Generate'
  }
];

export default function BatchGeneratePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(mockCustomers.map(x => x.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [includeTax, setIncludeTax] = useState(true);

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockCustomers.map(d => d.id));
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
              <span className="text-blue-400">Batch Generate</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Batch Generate Invoice</h1>
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
          {/* Card 1: Total Terpilih */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Terpilih</p>
              <p className="text-2xl font-black text-white mt-0.5">126</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Customer</p>
            </div>
          </div>

          {/* Card 2: Estimasi Invoice */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Estimasi Invoice</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 187.450.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Total Nominal</p>
            </div>
          </div>

          {/* Card 3: Rata-rata Per Invoice */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rata-rata Per Invoice</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 1.486.905</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Average</p>
            </div>
          </div>

          {/* Card 4: Periode Invoice */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Periode Invoice</p>
              <p className="text-[11px] font-black text-white mt-1 leading-none">01 Jul 2026 - 31 Jul 2026</p>
              <p className="text-[10px] text-gray-400 mt-1 font-medium">Billing Period</p>
            </div>
          </div>

          {/* Card 5: Sukses Dibuat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sukses Dibuat</p>
              <p className="text-2xl font-black text-white mt-0.5">0</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Belum Generate</p>
            </div>
          </div>

          {/* Card 6: Gagal Generate */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gagal Generate</p>
              <p className="text-2xl font-black text-white mt-0.5">0</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Belum Generate</p>
            </div>
          </div>
        </div>

        {/* ─── Stepper ───────────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4">Langkah Pembuatan Batch Invoice</p>
          
          <div className="flex flex-wrap items-center gap-4 lg:gap-8 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold">1</span>
              <div>
                <p className="text-white leading-none">Pilih Customer</p>
                <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Pilih data customer</p>
              </div>
            </div>
            
            <div className="hidden lg:block w-16 h-0.5 bg-[#131d35]"></div>

            <div className="flex items-center gap-3 opacity-60">
              <span className="w-7 h-7 rounded-full bg-[#101935] border border-[#1e2e58] text-gray-400 flex items-center justify-center font-bold">2</span>
              <div>
                <p className="text-gray-300 leading-none">Pilih Periode & Tipe</p>
                <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Tentukan periode invoice</p>
              </div>
            </div>

            <div className="hidden lg:block w-16 h-0.5 bg-[#131d35]"></div>

            <div className="flex items-center gap-3 opacity-60">
              <span className="w-7 h-7 rounded-full bg-[#101935] border border-[#1e2e58] text-gray-400 flex items-center justify-center font-bold">3</span>
              <div>
                <p className="text-gray-300 leading-none">Review & Preview</p>
                <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Cek data invoice</p>
              </div>
            </div>

            <div className="hidden lg:block w-16 h-0.5 bg-[#131d35]"></div>

            <div className="flex items-center gap-3 opacity-60">
              <span className="w-7 h-7 rounded-full bg-[#101935] border border-[#1e2e58] text-gray-400 flex items-center justify-center font-bold">4</span>
              <div>
                <p className="text-gray-300 leading-none">Generate Invoice</p>
                <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Proses pembuatan</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Filter & Options Area ─────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Col 1: Filter Customer */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Filter Customer</span>
              <div className="grid grid-cols-2 gap-2">
                <select className="bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none">
                  <option>Semua Group</option>
                </select>
                <select className="bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none">
                  <option>Semua Package</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                  <input 
                    type="text" 
                    placeholder="Cari customer..."
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-9 pr-3 py-2 rounded-xl text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-400 hover:text-white transition-colors">
                  <Filter size={12} />
                  <span>Lainnya</span>
                </button>
              </div>
            </div>

            {/* Col 2: Periode Invoice */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Periode Invoice</span>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input 
                    type="text" 
                    defaultValue="01/07/2026"
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-3 py-2.5 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <span className="text-gray-500 font-bold">&rarr;</span>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input 
                    type="text" 
                    defaultValue="31/07/2026"
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-3 py-2.5 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Col 3: Tipe Invoice */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Tipe Invoice</span>
              
              <div className="space-y-2 text-xs font-semibold text-gray-400">
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input type="radio" name="invoiceType" defaultChecked className="bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                  <span>Invoice Bulanan</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input type="radio" name="invoiceType" className="bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                  <span>Invoice Deposit</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input type="radio" name="invoiceType" className="bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                  <span>Invoice Custom</span>
                </label>
              </div>
            </div>

            {/* Col 4: Tgl. Jatuh Tempo & PPN */}
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tgl. Jatuh Tempo</span>
                <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none">
                  <option>15 Hari Setelah Invoice</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-1 border-t border-[#131d35]/60 text-xs font-semibold text-gray-400">
                <span>Termasuk PPN</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeTax} 
                    onChange={() => setIncludeTax(!includeTax)} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-[#101935] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table & Bottom Summaries */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[#131d35] bg-[#0b1329]/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Customer Terpilih (126)</h3>
                
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all">
                    <Upload size={12} />
                    <span>Import Customer</span>
                  </button>
                  <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all">
                    <Download size={12} />
                    <span>Export List</span>
                  </button>
                </div>
              </div>

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
                      <th className="p-4 w-32">ID CUSTOMER</th>
                      <th className="p-4 w-44">NAMA CUSTOMER</th>
                      <th className="p-4 w-28">GROUP</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-32">TAGIHAN BULANAN</th>
                      <th className="p-4 w-24">PPN 11%</th>
                      <th className="p-4 w-32">TOTAL</th>
                      <th className="p-4 w-32">STATUS</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {mockCustomers.map((d, idx) => {
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
                          <td className="p-4 font-mono font-semibold text-blue-400">{d.custNo}</td>
                          <td className="p-4 font-bold text-white">{d.name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              d.group === 'Corporate'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : d.group === 'Rumah'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                            }`}>
                              {d.group}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-gray-300">{d.packageName}</td>
                          <td className="p-4 font-bold text-white">{formatCurrency(d.monthlyBill)}</td>
                          <td className="p-4 font-bold text-white">{formatCurrency(d.tax)}</td>
                          <td className="p-4 font-bold text-white">{formatCurrency(d.total)}</td>
                          <td className="p-4">
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 text-[10px] font-bold rounded-full">
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-red-400 hover:text-red-300 transition-colors">
                                <Trash2 size={13} />
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">126</span> data
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
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">13</button>
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

              {/* Table Bottom bar */}
              <div className="p-4 border-t border-[#131d35] bg-[#0b1329]/60 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 cursor-pointer hover:text-white">
                  <input type="checkbox" defaultChecked className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                  <span>Pilih Semua (126)</span>
                </label>
                <button className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold py-1.5 px-3 rounded-xl transition-all">
                  <Trash2 size={12} />
                  <span>Hapus Terpilih</span>
                </button>
              </div>
            </div>

            {/* Bottom Summary KPI panel */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4.5 space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Customer Terpilih</p>
                <p className="text-2xl font-black text-white">126</p>
                <p className="text-[10px] text-gray-500 font-semibold">Customer Terpilih</p>
              </div>

              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4.5 space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subtotal (Tanpa PPN)</p>
                <p className="text-xl font-black text-white">Rp 169.005.000</p>
                <p className="text-[10px] text-gray-500 font-semibold">Subtotal (Tanpa PPN)</p>
              </div>

              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4.5 space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">PPN 11%</p>
                <p className="text-xl font-black text-white">Rp 18.445.000</p>
                <p className="text-[10px] text-gray-500 font-semibold">PPN 11%</p>
              </div>

              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4.5 space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Grand Total</p>
                <p className="text-xl font-black text-white">Rp 187.450.000</p>
                <p className="text-[10px] text-gray-500 font-semibold">Grand Total</p>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Preview Ringkasan Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Preview Ringkasan</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Corporate: 28 / 126 = 22.2% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray="22.2 77.8" 
                    strokeDashoffset="0" 
                  />

                  {/* Rumah: 68 / 126 = 54.0% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="54.0 46.0" 
                    strokeDashoffset="-22.2" 
                  />

                  {/* Instansi: 20 / 126 = 15.9% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="15.9 84.1" 
                    strokeDashoffset="-76.2" 
                  />

                  {/* Lainnya: 10 / 126 = 7.9% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6b7280" strokeWidth="4.5" 
                    strokeDasharray="7.9 92.1" 
                    strokeDashoffset="-92.1" 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-white">126</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-gray-400 border-b border-[#131d35] pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                    <span>Corporate</span>
                  </div>
                  <span className="font-semibold text-white">28 (22.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>Rumah</span>
                  </div>
                  <span className="font-semibold text-white">68 (54.0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-green-500 inline-block"></span>
                    <span>Instansi</span>
                  </div>
                  <span className="font-semibold text-white">20 (15.9%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-gray-500 inline-block"></span>
                    <span>Lainnya</span>
                  </div>
                  <span className="font-semibold text-white">10 (7.9%)</span>
                </div>
              </div>

              {/* Value details */}
              <div className="text-xs text-gray-400 font-semibold space-y-2.5 pt-1">
                <div className="flex justify-between">
                  <span>Total Customer</span>
                  <span className="text-white font-bold">126</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Nominal</span>
                  <span className="text-white">Rp 187.450.000</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN 11%</span>
                  <span className="text-white">Rp 18.445.000</span>
                </div>
                <div className="flex justify-between text-red-500 font-bold border-t border-[#131d35] pt-2">
                  <span>Grand Total</span>
                  <span>Rp 205.895.000</span>
                </div>
              </div>
            </div>

            {/* Card 2: Aksi Batch Generate */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Batch Generate</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all">
                  <Play size={14} />
                  <div className="text-left leading-tight">
                    <p className="font-bold">Generate Invoice Sekarang</p>
                    <p className="text-[9px] text-blue-200 font-normal">Buat invoice untuk 126 customer</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#f97316]/30 text-gray-300 hover:text-white text-xs py-3 px-4 rounded-xl hover:border-orange-500 transition-all text-left">
                  <Save size={14} className="text-orange-500" />
                  <div className="leading-tight">
                    <p className="font-bold">Simpan sebagai Draft</p>
                    <p className="text-[9px] text-gray-500 font-normal">Simpan untuk diproses nanti</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#eab308]/30 text-gray-300 hover:text-white text-xs py-3 px-4 rounded-xl hover:border-yellow-500 transition-all text-left">
                  <Calendar size={14} className="text-yellow-500" />
                  <div className="leading-tight">
                    <p className="font-bold">Jadwalkan Generate</p>
                    <p className="text-[9px] text-gray-500 font-normal">Jalankan otomatis sesuai jadwal</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#10b981]/30 text-gray-300 hover:text-white text-xs py-3 px-4 rounded-xl hover:border-green-500 transition-all text-left">
                  <Send size={14} className="text-green-550 text-green-500" />
                  <div className="leading-tight">
                    <p className="font-bold">Buat & Kirim Sekarang</p>
                    <p className="text-[9px] text-gray-500 font-normal">Generate dan kirim via Email/WA</p>
                  </div>
                </button>
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
                  Pastikan data customer dan package sudah benar sebelum generate invoice. Anda dapat import customer dari file Excel/CSV.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
