import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  Sliders,
  Check,
  X,
  Info,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Crown,
  TrendingUp
} from 'lucide-react';

interface SpeedProfile {
  id: string;
  name: string;
  download: string;
  upload: string;
  type: string; // Simetris / Asimetris
  status: string;
  usedCount: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function SpeedProfilePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Local state initialized with screenshot values
  const [profiles, setProfiles] = useState<SpeedProfile[]>([
    { id: '1', name: '1 Mbps', download: '1 Mbps', upload: '512 Kbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '2', name: '2 Mbps', download: '2 Mbps', upload: '1 Mbps', type: 'Simetris', status: 'active', usedCount: 3 },
    { id: '3', name: '5 Mbps', download: '5 Mbps', upload: '2 Mbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '4', name: '10 Mbps', download: '10 Mbps', upload: '5 Mbps', type: 'Simetris', status: 'active', usedCount: 4 },
    { id: '5', name: '20 Mbps', download: '20 Mbps', upload: '10 Mbps', type: 'Simetris', status: 'active', usedCount: 3 },
    { id: '6', name: '50 Mbps', download: '50 Mbps', upload: '25 Mbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '7', name: '100 Mbps', download: '100 Mbps', upload: '50 Mbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '8', name: '200 Mbps', download: '200 Mbps', upload: '100 Mbps', type: 'Simetris', status: 'active', usedCount: 1 },
    { id: '9', name: '10 Mbps (Down) / 2 Mbps (Up)', download: '10 Mbps', upload: '2 Mbps', type: 'Asimetris', status: 'active', usedCount: 2 },
    { id: '10', name: '20 Mbps (Down) / 5 Mbps (Up)', download: '20 Mbps', upload: '5 Mbps', type: 'Asimetris', status: 'active', usedCount: 2 }
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const totalProfiles = 15;
  const activeProfiles = 13;
  const inactiveProfiles = 2;
  const usedProfiles = 11;

  // Filter local logic
  const filteredProfiles = profiles.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prof.status === statusFilter;
    const matchesType = typeFilter === 'all' || prof.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/packages-admin" className="hover:text-[var(--app-text)]">Paket & Layanan</Link>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Speed Profile</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Speed Profile & Rate Limiting Mikrotik
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengaturan batasan kecepatan upload / download, rasio CIR/MIR, dan burst rate queue.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/packages-admin"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Kembali ke Katalog
            </Link>
          </div>
        </div>

        {/* ─── Add Profile Button Area ───────────────────────────────────── */}
        <div className="flex justify-end">
          <button 
            className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Tambah Speed Profile</span>
          </button>
        </div>

        {/* ─── Stat Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Total Speed Profile */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Sliders size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Speed Profile</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalProfiles}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Semua speed profile</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Check size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{activeProfiles}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Speed profile aktif</p>
            </div>
          </div>

          {/* Card 3: Non Aktif */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <X size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{inactiveProfiles}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Speed profile non aktif</p>
            </div>
          </div>

          {/* Card 4: Digunakan */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Sliders size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Digunakan</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{usedProfiles}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Sedang digunakan package</p>
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
                placeholder="Cari speed profile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none focus:border-blue-500 min-w-[150px]"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non Aktif</option>
            </select>

            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none focus:border-blue-500 min-w-[150px]"
            >
              <option value="all">Semua Tipe</option>
              <option value="Simetris">Simetris</option>
              <option value="Asimetris">Asimetris</option>
            </select>
            
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all ml-auto"
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
          
          {/* Left Column: Speed profiles list & stats */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/40 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input type="checkbox" className="rounded bg-slate-50 border-slate-200 text-blue-600 focus:ring-0" />
                      </th>
                      <th className="p-4 w-16">NO</th>
                      <th className="p-4 w-60">NAMA SPEED PROFILE</th>
                      <th className="p-4">DOWNLOAD (MAX)</th>
                      <th className="p-4">UPLOAD (MAX)</th>
                      <th className="p-4">TIPE</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-32">DIGUNAKAN</th>
                      <th className="p-4 w-28 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-12 text-center text-slate-400 font-semibold">
                          Tidak ada speed profile ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((prof, idx) => {
                        return (
                          <tr key={prof.id} className="hover:bg-slate-100/40 transition-colors">
                            <td className="p-4">
                              <input type="checkbox" className="rounded bg-slate-50 border-slate-200 text-blue-600 focus:ring-0" />
                            </td>
                            <td className="p-4 text-slate-400 font-medium">{idx + 1}</td>
                            <td className="p-4 font-bold text-slate-800">{prof.name}</td>
                            <td className="p-4 font-semibold text-white">{prof.download}</td>
                            <td className="p-4 font-semibold text-slate-500">{prof.upload}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                prof.type === 'Simetris' 
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              }`}>
                                {prof.type}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                prof.status === 'active' 
                                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' 
                                  : 'bg-gray-500/10 text-slate-500 border border-gray-500/20'
                              }`}>
                                {prof.status === 'active' ? 'Aktif' : 'Non Aktif'}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-slate-500">{prof.usedCount} Package</td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                                  <Eye size={14} />
                                </button>
                                <button className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-400 hover:text-blue-300 transition-colors">
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-slate-200 bg-white/60">
                <span className="text-xs text-slate-400">
                  Menampilkan <span className="font-semibold text-white">1</span> - <span className="font-semibold text-white">{filteredProfiles.length}</span> dari <span className="font-semibold text-white">{totalProfiles}</span> data
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
                    <button className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-xs py-1.5 px-3 rounded-lg text-slate-600 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                    <option value={25}>25 / halaman</option>
                    <option value={50}>50 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Statistik Kecepatan Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Statistik Kecepatan</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Rata-rata Download */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Download size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rata-rata Download</p>
                    <p className="text-base font-black text-slate-900 mt-1">33.8 Mbps</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Kecepatan rata-rata download</p>
                  </div>
                </div>

                {/* 2. Rata-rata Upload */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rata-rata Upload</p>
                    <p className="text-base font-black text-slate-900 mt-1">16.7 Mbps</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Kecepatan rata-rata upload</p>
                  </div>
                </div>

                {/* 3. Tertinggi Download */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-lg">
                    <Crown size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tertinggi Download</p>
                    <p className="text-base font-black text-slate-900 mt-1">500 Mbps</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Kecepatan download tertinggi</p>
                  </div>
                </div>

                {/* 4. Tertinggi Upload */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-2.5 bg-green-500/10 text-green-400 rounded-lg">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tertinggi Upload</p>
                    <p className="text-base font-black text-slate-900 mt-1">200 Mbps</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Kecepatan upload tertinggi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Distribusi Tipe Speed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Distribusi Tipe Speed</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Simetris segment: 13/15 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="4.5" 
                    strokeDasharray={`${(13 / 15) * 100} ${100 - (13 / 15) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Asimetris segment: 2/15 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4.5" 
                    strokeDasharray={`${(2 / 15) * 100} ${100 - (2 / 15) * 100}`} 
                    strokeDashoffset={`${100 - (13 / 15) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-slate-900">15</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span>
                    <span>Simetris</span>
                  </div>
                  <span className="font-semibold text-white">13 (86.7%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                    <span>Asimetris</span>
                  </div>
                  <span className="font-semibold text-white">2 (13.3%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Informasi */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Informasi</h3>
              
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-500">Speed profile digunakan untuk membatasi kecepatan internet customer.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-500">Tipe Simetris: Download = Upload<br />Tipe Asimetris: Download != Upload</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-500">Speed profile dapat digunakan di banyak package.</p>
                </div>
              </div>
            </div>

            {/* Card 3: Aktivitas Terakhir */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Aktivitas Terakhir</h3>
              
              <div className="relative border-l-2 border-slate-200 pl-4 ml-2.5 space-y-5 text-[11px] text-slate-500">
                
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-slate-200" />
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>22 Okt 2026 08:30</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Speed profile <strong className="text-white">"100 Mbps"</strong> diperbarui oleh <span className="text-blue-400">Agus Dwi Rianto</span>
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-slate-200" />
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>22 Okt 2026 08:10</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Speed profile <strong className="text-white">"2 Mbps"</strong> dibuat oleh <span className="text-blue-400">Agus Dwi Rianto</span>
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-slate-200" />
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>30 Jun 2026 16:40</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Speed profile <strong className="text-white">"512 Kbps"</strong> dinonaktifkan oleh <span className="text-blue-400">Agus Dwi Rianto</span>
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
