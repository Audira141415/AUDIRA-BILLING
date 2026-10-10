import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
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
  TrendingUp,
  Percent
} from 'lucide-react';

interface Promo {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  code: string;
  packageName: string;
  discount: string;
  period: string;
  dateRange: string;
  status: string;
  used: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function PromoPackagePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Local state initialized with screenshot values
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: '1',
      name: 'Promo Merdeka 2026',
      tag: 'Spesial',
      tagColor: 'bg-red-500/10 text-red-400 border border-red-500/20',
      code: 'MERDEKA26',
      packageName: 'Home 50 Mbps',
      discount: '20% (Rp 100.000)',
      period: 'Bulanan',
      dateRange: '01/06/2026 – 31/08/2026',
      status: 'active',
      used: '45 / 100'
    },
    {
      id: '2',
      name: 'Lebaran Sale 2026',
      tag: 'Musiman',
      tagColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      code: 'LEBARAN26',
      packageName: 'Home 20 Mbps',
      discount: '15% (Rp 50.000)',
      period: 'Bulanan',
      dateRange: '15/04/2026 – 15/05/2026',
      status: 'ended',
      used: '120 / 120'
    },
    {
      id: '3',
      name: 'Tahun Baru 2026',
      tag: 'Spesial',
      tagColor: 'bg-red-500/10 text-red-400 border border-red-500/20',
      code: 'TAHUNBARU26',
      packageName: 'Home 100 Mbps',
      discount: '25% (Rp 200.000)',
      period: 'Bulanan',
      dateRange: '01/01/2026 – 31/01/2026',
      status: 'active',
      used: '32 / 200'
    },
    {
      id: '4',
      name: 'Promo Weekend',
      tag: 'Reguler',
      tagColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      code: 'WEEKEND26',
      packageName: 'Semua Package',
      discount: '10% (Rp 25.000)',
      period: 'Bulanan',
      dateRange: 'Setiap Sabtu - Minggu',
      status: 'active',
      used: '210 / ∞'
    },
    {
      id: '5',
      name: 'Back to School',
      tag: 'Edukasi',
      tagColor: 'bg-green-500/10 text-green-400 border border-green-500/20',
      code: 'SCHOOL26',
      packageName: 'Home 20 Mbps',
      discount: '20% (Rp 75.000)',
      period: 'Bulanan',
      dateRange: '01/07/2026 – 31/07/2026',
      status: 'upcoming',
      used: '0 / 150'
    },
    {
      id: '6',
      name: 'Ramadan Berkah',
      tag: 'Musiman',
      tagColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      code: 'RAMADAN26',
      packageName: 'Home 50 Mbps',
      discount: '30% (Rp 150.000)',
      period: 'Bulanan',
      dateRange: '01/03/2026 – 30/03/2026',
      status: 'ended',
      used: '300 / 300'
    },
    {
      id: '7',
      name: 'Gratis Instalasi',
      tag: 'Reguler',
      tagColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      code: 'GRATISINSTAL',
      packageName: 'Semua Package',
      discount: 'Gratis Instalasi',
      period: 'Sekali Bayar',
      dateRange: '01/01/2026 – 31/12/2026',
      status: 'active',
      used: '85 / ∞'
    },
    {
      id: '8',
      name: 'Diskon Setengah Tahun',
      tag: 'Spesial',
      tagColor: 'bg-red-500/10 text-red-400 border border-red-500/20',
      code: '6BULAN26',
      packageName: 'Home 100 Mbps',
      discount: '10% (Rp 150.000)',
      period: '6 Bulan',
      dateRange: '01/06/2026 – 30/11/2026',
      status: 'active',
      used: '18 / 100'
    }
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCategoryFilter('all');
  };

  const totalPromo = 18;
  const activePromo = 12;
  const upcomingPromo = 2;
  const endsTodayPromo = 1;
  const totalDiscountValue = 24750000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter local logic
  const filteredPromos = promos.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.code.toLowerCase().includes(search.toLowerCase()) ||
                          p.packageName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
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
              <span className="text-blue-400">Promo Package</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Promo Package</h1>
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

        {/* ─── Add Promo Button Area ─────────────────────────────────────── */}
        <div className="flex justify-end">
          <button 
            className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Tambah Promo</span>
          </button>
        </div>

        {/* ─── Stat Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Card 1: Total Promo */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Promo</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalPromo}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Semua promo package</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Check size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">{activePromo}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Promo sedang aktif</p>
            </div>
          </div>

          {/* Card 3: Akan Datang */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Akan Datang</p>
              <p className="text-2xl font-black text-white mt-0.5">{upcomingPromo}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Promo akan datang</p>
            </div>
          </div>

          {/* Card 4: Berakhir Hari Ini */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Berakhir Hari Ini</p>
              <p className="text-2xl font-black text-white mt-0.5">{endsTodayPromo}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Promo berakhir hari ini</p>
            </div>
          </div>

          {/* Card 5: Total Diskon */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Percent size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Diskon</p>
              <p className="text-base font-black text-white mt-0.5">{formatCurrency(totalDiscountValue)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Total potongan harga</p>
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
                placeholder="Cari nama promo, kode, package, deskripsi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="upcoming">Akan Datang</option>
              <option value="ended">Berakhir</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Tipe</option>
              <option value="percent">Persentase</option>
              <option value="nominal">Nominal</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Kategori</option>
              <option value="spesial">Spesial</option>
              <option value="musiman">Musiman</option>
              <option value="reguler">Reguler</option>
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
                      <th className="p-4 w-52">NAMA PROMO</th>
                      <th className="p-4 w-28">KODE PROMO</th>
                      <th className="p-4 w-32">PACKAGE</th>
                      <th className="p-4 w-36">DISKON</th>
                      <th className="p-4 w-28">PERIODE</th>
                      <th className="p-4">TANGGAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-28">DIGUNAKAN</th>
                      <th className="p-4 w-24 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {filteredPromos.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-12 text-center text-gray-500 font-semibold">
                          Tidak ada promo package ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredPromos.map((p, idx) => {
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
                            <td className="p-4 font-mono font-semibold text-white tracking-wider">{p.code}</td>
                            <td className="p-4 text-gray-400 font-medium">{p.packageName}</td>
                            <td className="p-4">
                              <span className="font-bold text-white block">{p.discount.split(' ')[0]}</span>
                              {p.discount.includes('(') && (
                                <span className="text-[10px] text-gray-500 block mt-0.5">{p.discount.substring(p.discount.indexOf('('))}</span>
                              )}
                            </td>
                            <td className="p-4 text-gray-400">{p.period}</td>
                            <td className="p-4 text-gray-400 leading-normal max-w-[130px] font-medium">{p.dateRange}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                p.status === 'active' 
                                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' 
                                  : p.status === 'upcoming'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                              }`}>
                                {p.status === 'active' ? 'Aktif' : p.status === 'upcoming' ? 'Akan Datang' : 'Berakhir'}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-white">{p.used}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1">
                                <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                  <Eye size={14} />
                                </button>
                                <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-blue-400 hover:text-blue-300 transition-colors">
                                  <Edit size={14} />
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
                  Menampilkan <span className="font-semibold text-white">1</span> - <span className="font-semibold text-white">{filteredPromos.length}</span> dari <span className="font-semibold text-white">{totalPromo}</span> data
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
                    <button className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400 transition-colors">
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

            {/* Informasi Promo Cards */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Informasi Promo</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Kelola Promo Fleksibel */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Gift size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Kelola Promo Fleksibel</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Buat promo dengan berbagai tipe diskon: persen, nominal, gratis instalasi, dan lainnya.</p>
                  </div>
                </div>

                {/* 2. Target Pelanggan */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Target size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Target Pelanggan</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Promo dapat diterapkan ke semua package atau package tertentu.</p>
                  </div>
                </div>

                {/* 3. Kontrol Periode */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3">
                  <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Kontrol Periode</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Atur periode promo: tanggal tertentu, berulang, atau tanpa batas waktu.</p>
                  </div>
                </div>

                {/* 4. Laporan & Analitik */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <BarChart4 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Laporan & Analitik</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Pantau performa promo dan lihat dampaknya terhadap penjualan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Promo */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Promo</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Aktif segment: 12/18 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray={`${(12 / 18) * 100} ${100 - (12 / 18) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Akan Datang: 2/18 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 18) * 100} ${100 - (2 / 18) * 100}`} 
                    strokeDashoffset={`${100 - (12 / 18) * 100}`} 
                  />

                  {/* Berakhir: 3/18 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6b7280" strokeWidth="4.5" 
                    strokeDasharray={`${(3 / 18) * 100} ${100 - (3 / 18) * 100}`} 
                    strokeDashoffset={`${100 - (14 / 18) * 100}`} 
                  />

                  {/* Berakhir Hari Ini: 1/18 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(1 / 18) * 100} ${100 - (1 / 18) * 100}`} 
                    strokeDashoffset={`${100 - (17 / 18) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-white">{totalPromo}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-green-500 inline-block"></span>
                    <span>Aktif</span>
                  </div>
                  <span className="font-semibold text-white">12 (66.7%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                    <span>Akan Datang</span>
                  </div>
                  <span className="font-semibold text-white">2 (11.1%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-gray-500 inline-block"></span>
                    <span>Berakhir</span>
                  </div>
                  <span className="font-semibold text-white">3 (16.7%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                    <span>Berakhir Hari Ini</span>
                  </div>
                  <span className="font-semibold text-white">1 (5.5%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Diskon graph */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Diskon</h3>
              
              <div className="flex items-center gap-2 mt-2">
                <p className="text-base font-black text-white">{formatCurrency(totalDiscountValue)}</p>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full">+18.5%</span>
              </div>
              <p className="text-[9px] text-gray-500">Dibanding bulan lalu</p>

              {/* Sparkline chart SVG */}
              <div className="h-10 w-full mt-4">
                <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                  <path 
                    d="M0,16 Q18,6 36,12 T72,4 T100,10" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M0,16 Q18,6 36,12 T72,4 T100,10 L100,20 L0,20 Z" 
                    fill="url(#sparkline-grad-promo)" 
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad-promo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Card 3: Top Promo (Digunakan) */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Top Promo (Digunakan)</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Promo Weekend', times: 210, max: 210, rank: 1 },
                  { name: 'Lebaran Sale 2026', times: 120, max: 210, rank: 2 },
                  { name: 'Gratis Instalasi', times: 85, max: 210, rank: 3 },
                  { name: 'Promo Merdeka 2026', times: 45, max: 210, rank: 4 },
                  { name: 'Tahun Baru 2026', times: 32, max: 210, rank: 5 },
                ].map((item, index) => {
                  const percentage = (item.times / item.max) * 100;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-bold w-4">{item.rank}</span>
                          <span className="font-bold text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400">{item.times} kali</span>
                      </div>
                      <div className="w-full bg-[#101935] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 4: Aktivitas Terakhir */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terakhir</h3>
              
              <div className="relative border-l-2 border-[#131d35] pl-4 ml-2.5 space-y-5 text-[11px] text-gray-400">
                
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>01 Jul 2026 08:30</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Promo <strong className="text-white">"Back to School"</strong> dibuat oleh <span className="text-blue-400">Agus Dwi Rianto</span>
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>30 Jun 2026 16:45</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Promo <strong className="text-white">"Promo Weekend"</strong> diperbarui oleh <span className="text-blue-400">Agus Dwi Rianto</span>
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>29 Jun 2026 14:20</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Promo <strong className="text-white">"Lebaran Sale 2026"</strong> berakhir
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
