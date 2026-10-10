import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  RefreshCw, 
  Trash2, 
  Calendar, 
  Bell, 
  Mail, 
  Maximize2,
  Gift,
  Check,
  X,
  Info,
  Clock,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart4,
  Percent,
  Sliders
} from 'lucide-react';

interface InactivePackage {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  type: string;
  speed: string;
  price: number;
  reason: string;
  reasonDetail: string;
  date: string;
  status: string; // expired, stopped, unused
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function PaketNonAktifPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Local state initialized with screenshot values
  const [inactivePackages, setInactivePackages] = useState<InactivePackage[]>([
    {
      id: '1',
      name: 'Promo Ramadhan 2025',
      tag: 'Promo',
      tagColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      type: 'Internet',
      speed: '50 Mbps / 50 Mbps',
      price: 150000,
      reason: 'Kadaluarsa',
      reasonDetail: 'Periode promo berakhir',
      date: '01/05/2026 10:30 WIB',
      status: 'expired'
    },
    {
      id: '2',
      name: 'Paket Trial 7 Hari',
      tag: 'Trial',
      tagColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      type: 'Internet',
      speed: '20 Mbps / 20 Mbps',
      price: 0,
      reason: 'Kadaluarsa',
      reasonDetail: 'Periode trial berakhir',
      date: '25/05/2026 17:15 WIB',
      status: 'expired'
    },
    {
      id: '3',
      name: 'Paket Corporate Lama',
      tag: 'Corporate',
      tagColor: 'bg-green-500/10 text-green-400 border border-green-500/20',
      type: 'Internet',
      speed: '100 Mbps / 100 Mbps',
      price: 500000,
      reason: 'Dihentikan Customer',
      reasonDetail: 'Customer tidak lagi menggunakan',
      date: '18/04/2026 09:45 WIB',
      status: 'stopped'
    },
    {
      id: '4',
      name: 'Paket Home Basic Lama',
      tag: 'Internet',
      tagColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      type: 'Internet',
      speed: '10 Mbps / 10 Mbps',
      price: 100000,
      reason: 'Dihentikan Customer',
      reasonDetail: 'Upgrade ke paket lain',
      date: '10/05/2026 14:20 WIB',
      status: 'stopped'
    },
    {
      id: '5',
      name: 'Paket Event 2025',
      tag: 'Event',
      tagColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      type: 'Internet',
      speed: '30 Mbps / 30 Mbps',
      price: 75000,
      reason: 'Tidak Digunakan',
      reasonDetail: 'Tidak ada pelanggan aktif',
      date: '15/03/2026 11:05 WIB',
      status: 'unused'
    },
    {
      id: '6',
      name: 'Paket Combo Lama',
      tag: 'Combo',
      tagColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      type: 'Combo',
      speed: '50 Mbps / 50 Mbps + TV',
      price: 200000,
      reason: 'Dihentikan Customer',
      reasonDetail: 'Berubah ke paket internet saja',
      date: '05/04/2026 16:55 WIB',
      status: 'stopped'
    }
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setReasonFilter('all');
    setTypeFilter('all');
    setCategoryFilter('all');
  };

  const totalInactive = 6;
  const expiredCount = 2;
  const stoppedCount = 3;
  const unusedCount = 1;
  const totalRevenueLost = 3450000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter local logic
  const filteredPackages = inactivePackages.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.reason.toLowerCase().includes(search.toLowerCase()) ||
                          p.type.toLowerCase().includes(search.toLowerCase());
    const matchesReason = reasonFilter === 'all' || p.reason.toLowerCase().includes(reasonFilter.toLowerCase());
    return matchesSearch && matchesReason;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Home</span>
              <span>&gt;</span>
              <span>Package</span>
              <span>&gt;</span>
              <span className="text-blue-400">Paket Non Aktif</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Paket Non Aktif</h1>
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75">8</span>
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

        {/* ─── Add Non Active Button Area ─────────────────────────────────── */}
        <div className="flex justify-end">
          <button 
            className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Tambah Paket Non Aktif</span>
          </button>
        </div>

        {/* ─── Stat Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Card 1: Total Paket Non Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Paket Non Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalInactive}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Semua paket non aktif</p>
            </div>
          </div>

          {/* Card 2: Kadaluarsa */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kadaluarsa</p>
              <p className="text-2xl font-black text-white mt-0.5">{expiredCount}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Paket kadaluarsa</p>
            </div>
          </div>

          {/* Card 3: Dihentikan Customer */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Sliders size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Dihentikan Customer</p>
              <p className="text-2xl font-black text-white mt-0.5">{stoppedCount}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Paket dihentikan</p>
            </div>
          </div>

          {/* Card 4: Tidak Digunakan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-xl">
              <X size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tidak Digunakan</p>
              <p className="text-2xl font-black text-white mt-0.5">{unusedCount}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Paket tidak digunakan</p>
            </div>
          </div>

          {/* Card 5: Pendapatan Hilang */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Percent size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pendapatan Hilang</p>
              <p className="text-base font-black text-white mt-0.5">{formatCurrency(totalRevenueLost)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Potensi pendapatan hilang</p>
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
                placeholder="Cari nama paket, tipe, keterangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select 
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Alasan</option>
              <option value="kadaluarsa">Kadaluarsa</option>
              <option value="customer">Dihentikan Customer</option>
              <option value="tidak digunakan">Tidak Digunakan</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Tipe</option>
              <option value="internet">Internet</option>
              <option value="combo">Combo</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Kategori</option>
              <option value="promo">Promo</option>
              <option value="trial">Trial</option>
              <option value="corporate">Corporate</option>
            </select>
            
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-transparent hover:border-[#131d35] transition-all ml-auto"
            >
              Reset
            </button>

            <button 
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* ─── Main Two-Column Panel ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Promos list & stats */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input type="checkbox" className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                      </th>
                      <th className="p-4 w-16">NO</th>
                      <th className="p-4 w-52">NAMA PAKET</th>
                      <th className="p-4 w-28">TIPE</th>
                      <th className="p-4 w-32">KECEPATAN</th>
                      <th className="p-4 w-28">HARGA</th>
                      <th className="p-4 w-56">ALASAN NON AKTIF</th>
                      <th className="p-4">TANGGAL NON AKTIF</th>
                      <th className="p-4 w-32">STATUS</th>
                      <th className="p-4 w-24 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {filteredPackages.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-12 text-center text-gray-500 font-semibold">
                          Tidak ada paket non aktif ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((p, idx) => {
                        return (
                          <tr key={p.id} className="hover:bg-[#121c38]/40 transition-colors">
                            <td className="p-4">
                              <input type="checkbox" className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                            </td>
                            <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="font-bold text-white block">{p.name}</span>
                                <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${p.tagColor}`}>
                                  {p.tag}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-400 font-medium">{p.type}</td>
                            <td className="p-4 font-semibold text-gray-300">{p.speed}</td>
                            <td className="p-4 font-bold text-white">{formatCurrency(p.price)}</td>
                            <td className="p-4">
                              <span className="font-semibold text-white block">{p.reason}</span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">{p.reasonDetail}</span>
                            </td>
                            <td className="p-4 text-gray-400 font-medium leading-normal max-w-[130px]">{p.date}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                p.status === 'expired' 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                  : p.status === 'stopped'
                                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {p.status === 'expired' ? 'Kadaluarsa' : p.status === 'stopped' ? 'Dihentikan' : 'Tidak Digunakan'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                  <Eye size={14} />
                                </button>
                                <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-blue-400 hover:text-blue-300 transition-colors">
                                  <RefreshCw size={14} />
                                </button>
                                <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[#131d35] bg-[#0b1329]/60">
                <span className="text-xs text-gray-500">
                  Menampilkan <span className="font-semibold text-white">1</span> - <span className="font-semibold text-white">{filteredPackages.length}</span> dari <span className="font-semibold text-white">{totalInactive}</span> data
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
                    <button 
                      disabled
                      className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="bg-[#080d19] border border-[#131d35] text-xs py-1.5 px-3 rounded-lg text-gray-300 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                    <option value={25}>25 / halaman</option>
                    <option value={50}>50 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Card banner */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Kelola Paket Non Aktif dengan Mudah</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Pantau paket yang tidak aktif, lihat alasan dan dampaknya, serta aktifkan kembali jika diperlukan.</p>
              </div>
              <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md">
                <Plus size={14} />
                <span>Lihat Laporan Lengkap</span>
              </button>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Distribusi Alasan Non Aktif */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Distribusi Alasan Non Aktif</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Kadaluarsa: 2/6 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 6) * 100} ${100 - (2 / 6) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Dihentikan: 3/6 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(3 / 6) * 100} ${100 - (3 / 6) * 100}`} 
                    strokeDashoffset={`${100 - (2 / 6) * 100}`} 
                  />

                  {/* Tidak digunakan: 1/6 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="4.5" 
                    strokeDasharray={`${(1 / 6) * 100} ${100 - (1 / 6) * 100}`} 
                    strokeDashoffset={`${100 - (5 / 6) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-white">{totalInactive}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                    <span>Kadaluarsa</span>
                  </div>
                  <span className="font-semibold text-white">2 (33.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>Dihentikan Customer</span>
                  </div>
                  <span className="font-semibold text-white">3 (50.0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                    <span>Tidak Digunakan</span>
                  </div>
                  <span className="font-semibold text-white">1 (16.7%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Ringkasan Dampak graph */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Dampak</h3>
              <p className="text-[10px] text-gray-500 font-semibold">Potensi Pendapatan Hilang</p>
              
              <div className="flex items-center gap-2 mt-2">
                <p className="text-base font-black text-white">{formatCurrency(totalRevenueLost)}</p>
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full">+18.5%</span>
              </div>
              <p className="text-[9px] text-gray-500">Dari 6 paket non aktif</p>

              {/* Sparkline chart SVG */}
              <div className="h-10 w-full mt-4">
                <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                  <path 
                    d="M0,12 Q15,16 30,8 T60,15 T90,6 L100,14" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M0,12 Q15,16 30,8 T60,15 T90,6 L100,14 L100,20 L0,20 Z" 
                    fill="url(#sparkline-grad-nonaktif)" 
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad-nonaktif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Card 3: Informasi */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Informasi</h3>
              
              <div className="space-y-3.5 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-400">Paket akan masuk ke non aktif jika periode berakhir atau dihentikan.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-400">Paket non aktif tidak dapat digunakan oleh customer baru.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-400">Anda dapat mengaktifkan kembali paket yang dihentikan.</p>
                </div>
              </div>
            </div>

            {/* Card 4: Aktivitas Terakhir */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terakhir</h3>
              
              <div className="relative border-l-2 border-[#131d35] pl-4 ml-2.5 space-y-5 text-[11px] text-gray-400">
                
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>01 Jul 2026 08:25</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Paket <strong className="text-white">"Promo Ramadhan 2025"</strong> kadaluarsa
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>30 Jun 2026 16:40</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Paket <strong className="text-white">"Paket Corporate Lama"</strong> dihentikan
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>29 Jun 2026 10:15</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Paket <strong className="text-white">"Paket Event 2025"</strong> tidak digunakan
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}
