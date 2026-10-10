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
  FolderOpen,
  Check,
  X,
  Info,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  badgeColor: string;
  description: string;
  packageCount: number;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function KategoriPackagePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Local state for categories (initialized matching the screenshot design data)
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Internet',
      badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      description: 'Paket layanan internet untuk kebutuhan rumah tangga dan bisnis kecil',
      packageCount: 24,
      status: 'active'
    },
    {
      id: '2',
      name: 'Combo',
      badgeColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      description: 'Paket kombinasi internet dan TV kabel atau layanan tambahan lainnya',
      packageCount: 2,
      status: 'active'
    },
    {
      id: '3',
      name: 'Corporate',
      badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      description: 'Paket khusus untuk bisnis dan perusahaan',
      packageCount: 2,
      status: 'active'
    },
    {
      id: '4',
      name: 'Non Aktif',
      badgeColor: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
      description: 'Kategori tidak aktif / arsip',
      packageCount: 0,
      status: 'inactive'
    }
  ]);

  const handleResetFilters = () => {
    setSearch('');
  };

  const formatPercent = (count: number, total: number) => {
    if (total === 0) return '0%';
    return `${((count / total) * 100).toFixed(1)}%`;
  };

  const totalPackages = categories.reduce((sum, item) => sum + item.packageCount, 0);
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'active').length;
  const inactiveCategories = categories.filter(c => c.status === 'inactive').length;

  // Filter categories based on search input
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

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
              <span className="text-blue-400">Kategori Package</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Kategori Package</h1>
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

        {/* ─── Add Category Button Area ──────────────────────────────────── */}
        <div className="flex justify-end">
          <button 
            className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Tambah Kategori</span>
          </button>
        </div>

        {/* ─── Stat Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Total Kategori */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FolderOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Kategori</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalCategories}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Semua kategori package</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Check size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">{activeCategories}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Kategori aktif</p>
            </div>
          </div>

          {/* Card 3: Non Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <X size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">{inactiveCategories}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Kategori non aktif</p>
            </div>
          </div>

          {/* Card 4: Total Package */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FolderOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Package</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalPackages}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Menggunakan kategori</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari kategori package..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
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
          
          {/* Left Column: Categories list */}
          <div className="lg:col-span-9 space-y-4">
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input type="checkbox" className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                      </th>
                      <th className="p-4 w-16">NO</th>
                      <th className="p-4 w-52">NAMA KATEGORI</th>
                      <th className="p-4">DESKRIPSI</th>
                      <th className="p-4 w-36 text-center">JUMLAH PACKAGE</th>
                      <th className="p-4 w-32">STATUS</th>
                      <th className="p-4 w-32 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-500 font-semibold">
                          Tidak ada kategori package ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((cat, idx) => {
                        return (
                          <tr key={cat.id} className="hover:bg-[#121c38]/40 transition-colors">
                            <td className="p-4">
                              <input type="checkbox" className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                            </td>
                            <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                            <td className="p-4">
                              <div className="space-y-1.5">
                                <span className="font-bold text-white block">{cat.name}</span>
                                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${cat.badgeColor}`}>
                                  {cat.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-400 leading-relaxed max-w-sm">{cat.description}</td>
                            <td className="p-4 text-center font-bold text-white text-sm">{cat.packageCount}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                cat.status === 'active' 
                                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' 
                                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                              }`}>
                                {cat.status === 'active' ? 'Aktif' : 'Non Aktif'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
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
                  Menampilkan <span className="font-semibold text-white">1</span> - <span className="font-semibold text-white">{filteredCategories.length}</span> dari <span className="font-semibold text-white">{filteredCategories.length}</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled
                      className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]"
                    >
                      1
                    </button>
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
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Distribusi Package per Kategori */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Distribusi Package per Kategori</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Internet segment: 24/28 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="4.5" 
                    strokeDasharray={`${(24 / 28) * 100} ${100 - (24 / 28) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Combo segment: 2/28 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 28) * 100} ${100 - (2 / 28) * 100}`} 
                    strokeDashoffset={`${100 - (24 / 28) * 100}`} 
                  />

                  {/* Corporate segment: 2/28 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 28) * 100} ${100 - (2 / 28) * 100}`} 
                    strokeDashoffset={`${100 - (26 / 28) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-white">{totalPackages}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span>
                    <span>Internet</span>
                  </div>
                  <span className="font-semibold text-white">24 ({formatPercent(24, totalPackages)})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                    <span>Combo</span>
                  </div>
                  <span className="font-semibold text-white">2 ({formatPercent(2, totalPackages)})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>Corporate</span>
                  </div>
                  <span className="font-semibold text-white">2 ({formatPercent(2, totalPackages)})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-gray-600 inline-block"></span>
                    <span>Non Aktif</span>
                  </div>
                  <span className="font-semibold text-white">0 ({formatPercent(0, totalPackages)})</span>
                </div>
              </div>
            </div>

            {/* Card 2: Informasi */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Informasi</h3>
              
              <div className="space-y-3.5 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-400">Kategori digunakan untuk mengelompokkan package</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-400">Package dapat dipindahkan ke kategori lain</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-400">Non aktifkan kategori jika tidak digunakan</p>
                </div>
              </div>
            </div>

            {/* Card 3: Aktivitas Terakhir */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terakhir</h3>
              
              <div className="relative border-l-2 border-[#131d35] pl-4 ml-2.5 space-y-5 text-[11px] text-gray-400">
                
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>01 Jul 2026 08:25</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Kategori <strong className="text-white">"Corporate"</strong> diperbarui oleh <span className="text-blue-400">Agus Dwi Rianto</span>
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>01 Jul 2026 08:10</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Kategori <strong className="text-white">"Combo"</strong> dibuat oleh <span className="text-blue-400">Agus Dwi Rianto</span>
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>30 Jun 2026 16:45</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Kategori <strong className="text-white">"Non Aktif"</strong> dinonaktifkan oleh <span className="text-blue-400">Agus Dwi Rianto</span>
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
