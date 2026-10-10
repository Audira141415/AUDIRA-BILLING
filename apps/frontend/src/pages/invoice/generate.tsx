import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  Info,
  Lightbulb,
  Calendar,
  Bell,
  Mail,
  Maximize2
} from 'lucide-react';

interface CustomerRow {
  id: string;
  name: string;
  customerNo: string;
  area: string;
  activePackage: string;
  speed: string;
  price: number;
  nextBilling: string;
  status: string;
  phone: string;
  address: string;
}

const mockCustomers: CustomerRow[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    customerNo: 'CUST-0001',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 50 Mbps',
    speed: '50 Mbps',
    price: 375000,
    nextBilling: '10/07/2026',
    status: 'Aktif',
    phone: '0812-3456-7890',
    address: 'Jl. Merdeka No. 10, Yogyakarta'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    customerNo: 'CUST-0002',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 20 Mbps',
    speed: '20 Mbps',
    price: 250000,
    nextBilling: '10/07/2026',
    status: 'Aktif',
    phone: '0812-3456-7891',
    address: 'Jl. Malioboro No. 5, Yogyakarta'
  },
  {
    id: '3',
    name: 'Andi Pratama',
    customerNo: 'CUST-0003',
    area: 'Sleman',
    activePackage: 'Home 100 Mbps',
    speed: '100 Mbps',
    price: 575000,
    nextBilling: '10/07/2026',
    status: 'Aktif',
    phone: '0812-3456-7892',
    address: 'Jl. Kaliurang Km 5, Sleman'
  },
  {
    id: '4',
    name: 'Rina Marlina',
    customerNo: 'CUST-0004',
    area: 'Bantul',
    activePackage: 'Corporate 100 Mbps',
    speed: '100 Mbps',
    price: 750000,
    nextBilling: '01/07/2026',
    status: 'Aktif',
    phone: '0812-3456-7893',
    address: 'Jl. Parangtritis Km 8, Bantul'
  },
  {
    id: '5',
    name: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    area: 'Sleman',
    activePackage: 'Corporate 200 Mbps',
    speed: '200 Mbps',
    price: 1250000,
    nextBilling: '01/07/2026',
    status: 'Aktif',
    phone: '021-888-222',
    address: 'Kawasan Industri Sleman No. 12'
  },
  {
    id: '6',
    name: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    area: 'Bantul',
    activePackage: 'Home 10 Mbps',
    speed: '10 Mbps',
    price: 150000,
    nextBilling: '01/07/2026',
    status: 'Aktif',
    phone: '0812-3456-7894',
    address: 'Jl. Imogiri Timur, Bantul'
  },
  {
    id: '7',
    name: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 50 Mbps',
    speed: '50 Mbps',
    price: 375000,
    nextBilling: '01/07/2026',
    status: 'Aktif',
    phone: '0812-3456-7895',
    address: 'Jl. Kusumanegara, Yogyakarta'
  },
  {
    id: '8',
    name: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    area: 'Sleman',
    activePackage: 'Home 20 Mbps',
    speed: '20 Mbps',
    price: 250000,
    nextBilling: '01/06/2026',
    status: 'Aktif',
    phone: '0812-3456-7896',
    address: 'Perumahan Sleman Indah'
  },
  {
    id: '9',
    name: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    area: 'Bantul',
    activePackage: 'Corporate 50 Mbps',
    speed: '50 Mbps',
    price: 500000,
    nextBilling: '01/06/2026',
    status: 'Aktif',
    phone: '0812-3456-7897',
    address: 'Jl. Ringroad Selatan, Bantul'
  },
  {
    id: '10',
    name: 'Eva Apriyani',
    customerNo: 'CUST-0010',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 100 Mbps',
    speed: '100 Mbps',
    price: 375000,
    nextBilling: '01/06/2026',
    status: 'Aktif',
    phone: '0812-3456-7898',
    address: 'Jl. Solo Km 7, Yogyakarta'
  }
];

export default function GenerateInvoicePage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>(['1']); // Default Budi Santoso selected matching screenshot
  const [currentStep, setCurrentStep] = useState(1);

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockCustomers.map(c => c.id));
    }
  };

  // Calculations for summary based on selected rows
  const selectedCustomers = mockCustomers.filter(c => selectedIds.includes(c.id));
  const totalTagihan = selectedCustomers.reduce((sum, c) => sum + c.price, 0);
  const totalDiskon = 0;
  const totalPPN = Math.round(totalTagihan * 0.11);
  const totalAkhir = totalTagihan - totalDiskon + totalPPN;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const primaryCustomer = selectedCustomers[0] || mockCustomers[0];

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
              <span className="text-blue-400">Generate Invoice</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Generate Invoice</h1>
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

        {/* ─── Wizard Steps Bar ───────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          {[
            { step: 1, label: 'Pilih Customer' },
            { step: 2, label: 'Pilih Package' },
            { step: 3, label: 'Periode & Jatuh Tempo' },
            { step: 4, label: 'Diskon & Pajak' },
            { step: 5, label: 'Preview Invoice' },
            { step: 6, label: 'Generate Invoice' }
          ].map((s, idx, arr) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === s.step 
                    ? 'bg-[#0052cc] text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-[#101935] text-gray-400 border border-[#1e2d54]'
                }`}>
                  {s.step}
                </div>
                <span className={`text-xs font-semibold ${
                  currentStep === s.step ? 'text-white' : 'text-gray-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div className="hidden lg:block flex-1 h-[1px] bg-[#1e2d54] mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ─── Main Form Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side: Step Content Card */}
          <div className="lg:col-span-8 bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Step 1 - Pilih Customer</h2>
              <p className="text-xs text-gray-500">Pilih customer yang akan dibuatkan invoice</p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-4 bg-[#080d19]/40 border border-[#131d35] p-4 rounded-xl">
              <select className="bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-lg text-gray-400 focus:outline-none min-w-[120px]">
                <option>Semua Area</option>
              </select>

              <select className="bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-lg text-gray-400 focus:outline-none min-w-[120px]">
                <option>Semua Sales</option>
              </select>

              <select className="bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-lg text-gray-400 focus:outline-none min-w-[120px]">
                <option>Semua Status</option>
              </select>

              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Cari customer atau nomor whatsapp..."
                  className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-9 pr-4 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none"
                />
              </div>

              <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                <Filter size={14} />
                <span>Filter</span>
              </button>
            </div>

            {/* Table wrapper */}
            <div className="border border-[#131d35] rounded-xl overflow-hidden">
              {/* Batch selection state indicator */}
              <div className="bg-[#101935]/40 border-b border-[#131d35] p-3 flex justify-between items-center text-[10px] font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0}
                    onChange={handleSelectAll}
                    className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0 w-3.5 h-3.5" 
                  />
                  <span>{selectedIds.length} customer dipilih</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === mockCustomers.length}
                    onChange={handleSelectAll}
                    className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0 w-3.5 h-3.5" 
                  />
                  <span>Pilih Semua</span>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/10 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10"></th>
                      <th className="p-4">CUSTOMER</th>
                      <th className="p-4">NO. CUSTOMER</th>
                      <th className="p-4">AREA</th>
                      <th className="p-4">PACKAGE AKTIF</th>
                      <th className="p-4">TAGIHAN BERIKUTNYA</th>
                      <th className="p-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {mockCustomers.map((c) => {
                      const isSelected = selectedIds.includes(c.id);
                      return (
                        <tr 
                          key={c.id}
                          onClick={() => handleSelectRow(c.id)}
                          className={`hover:bg-[#121c38]/40 transition-colors cursor-pointer ${isSelected ? 'bg-[#121c38]/60' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleSelectRow(c.id)}
                              className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0 w-3.5 h-3.5" 
                            />
                          </td>
                          <td className="p-4 font-bold text-white">{c.name}</td>
                          <td className="p-4 font-semibold text-gray-400">{c.customerNo}</td>
                          <td className="p-4 text-gray-400 font-medium">{c.area}</td>
                          <td className="p-4 text-gray-300 font-medium">{c.activePackage}</td>
                          <td className="p-4 text-gray-400 font-medium">{c.nextBilling}</td>
                          <td className="p-4">
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              {c.status}
                            </span>
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">3,248</span> data
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
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">325</button>
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

            {/* Bottom Actions inside Step Card */}
            <div className="flex justify-between items-center pt-2">
              <button className="px-5 py-2.5 bg-transparent border border-[#1e2d54] hover:bg-[#121c38] text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all">
                Batal
              </button>
              
              <button 
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <span>Lanjut ke Step 2</span>
                <ChevronRight size={14} />
              </button>
            </div>

          </div>

          {/* Right Side: Sidebar Ringkasan */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: Ringkasan Customer */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Ringkasan Customer ( {selectedIds.length} Dipilih )
              </h3>

              {primaryCustomer && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div className="space-y-1.5 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-sm">{primaryCustomer.name}</p>
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                        Aktif
                      </span>
                    </div>
                    <p className="font-semibold text-gray-500">{primaryCustomer.customerNo}</p>
                    <p className="text-gray-400 font-medium">📞 {primaryCustomer.phone}</p>
                    <p className="text-gray-400 leading-relaxed">📍 {primaryCustomer.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Informasi Package */}
            {primaryCustomer && (
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-[#131d35] pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Informasi Package</span>
                    <h4 className="font-bold text-white text-xs">{primaryCustomer.activePackage}</h4>
                  </div>
                  <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                    Home
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Kecepatan</span>
                    <span className="text-white font-bold">{primaryCustomer.speed}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>IP Public</span>
                    <span className="text-white font-bold">1 IP</span>
                  </div>
                  <div className="flex justify-between text-[#a0aec0] font-medium border-t border-[#131d35]/60 pt-2.5">
                    <span>Biaya Bulanan</span>
                    <span className="text-white font-bold">{formatCurrency(primaryCustomer.price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Tagihan Berikutnya</span>
                    <span className="text-white font-bold">10 Juli 2026</span>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: Ringkasan Generate */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Generate</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Jumlah Customer</span>
                  <span className="text-white font-bold">{selectedIds.length}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Total Tagihan</span>
                  <span className="text-white font-bold">{formatCurrency(totalTagihan)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Total Diskon</span>
                  <span className="text-white font-bold">{formatCurrency(totalDiskon)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Total PPN (11%)</span>
                  <span className="text-white font-bold">{formatCurrency(totalPPN)}</span>
                </div>

                <div className="flex justify-between text-white font-extrabold border-t border-[#131d35] pt-3 mt-1 text-sm">
                  <span>Total Akhir</span>
                  <span className="text-blue-400 text-base font-black">{formatCurrency(totalAkhir)}</span>
                </div>
              </div>
            </div>

            {/* Warning Message Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 text-blue-400 leading-relaxed">
              <Info size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold">
                Setelah semua step selesai, invoice akan dibuat dengan status <span className="bg-blue-500/20 px-1 py-0.5 rounded text-[8px] uppercase font-black">Draft</span> dan dapat Anda kirim ke customer.
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-[#0b1329]/40 border border-[#131d35] p-4.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-[#0052cc]/10 text-[#0052cc] rounded-lg">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-white">Tips</h5>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  Anda dapat memilih multiple customer dengan mencentang beberapa customer sekaligus.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
