import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
  Edit2,
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
  Copy,
  Settings,
  HelpCircle,
  Check,
  TrendingUp,
  Layout as LayoutIcon
} from 'lucide-react';

interface TemplateRow {
  id: string;
  name: string;
  category: string;
  categoryType: 'corporate' | 'premium' | 'modern' | 'minimalis' | 'classic' | 'startup';
  createdBy: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'Aktif' | 'Non Aktif';
}

const mockTemplates: TemplateRow[] = [
  {
    id: '1',
    name: 'Corporate Standard',
    category: 'Corporate',
    categoryType: 'corporate',
    createdBy: 'System',
    isSystem: true,
    createdAt: '01/01/2026 10:00',
    updatedAt: '25/06/2026 14:30',
    status: 'Aktif'
  },
  {
    id: '2',
    name: 'Minimalis Clean',
    category: 'Premium',
    categoryType: 'premium',
    createdBy: 'Andi Pratama',
    isSystem: false,
    createdAt: '05/01/2026 11:20',
    updatedAt: '28/06/2026 09:15',
    status: 'Aktif'
  },
  {
    id: '3',
    name: 'Modern Blue',
    category: 'Modern',
    categoryType: 'modern',
    createdBy: 'Rina Marlina',
    isSystem: false,
    createdAt: '10/01/2026 09:45',
    updatedAt: '27/06/2026 16:40',
    status: 'Aktif'
  },
  {
    id: '4',
    name: 'Simple Black & White',
    category: 'Minimalis',
    categoryType: 'minimalis',
    createdBy: 'Dewi Lestari',
    isSystem: false,
    createdAt: '15/01/2026 14:10',
    updatedAt: '20/06/2026 10:30',
    status: 'Non Aktif'
  },
  {
    id: '5',
    name: 'Elegant Corporate',
    category: 'Corporate',
    categoryType: 'corporate',
    createdBy: 'Agus Dwi Rianto',
    isSystem: false,
    createdAt: '20/01/2026 08:30',
    updatedAt: '30/06/2026 13:20',
    status: 'Aktif'
  },
  {
    id: '6',
    name: 'Colorful Modern',
    category: 'Modern',
    categoryType: 'modern',
    createdBy: 'Fajar Nugroho',
    isSystem: false,
    createdAt: '25/01/2026 13:50',
    updatedAt: '29/06/2026 17:10',
    status: 'Aktif'
  },
  {
    id: '7',
    name: 'Classic Professional',
    category: 'Classic',
    categoryType: 'classic',
    createdBy: 'Nina Wulandari',
    isSystem: false,
    createdAt: '02/02/2026 10:15',
    updatedAt: '24/06/2026 11:05',
    status: 'Aktif'
  },
  {
    id: '8',
    name: 'Startup Style',
    category: 'Startup',
    categoryType: 'startup',
    createdBy: 'Yudi Hermawan',
    isSystem: false,
    createdAt: '10/02/2026 15:30',
    updatedAt: '22/06/2026 08:45',
    status: 'Aktif'
  },
  {
    id: '9',
    name: 'Green Nature',
    category: 'Modern',
    categoryType: 'modern',
    createdBy: 'Siti Aminah',
    isSystem: false,
    createdAt: '18/02/2026 09:00',
    updatedAt: '21/06/2026 12:25',
    status: 'Non Aktif'
  },
  {
    id: '10',
    name: 'Dark Premium',
    category: 'Premium',
    categoryType: 'premium',
    createdBy: 'Budi Santoso',
    isSystem: false,
    createdAt: '25/02/2026 16:20',
    updatedAt: '19/06/2026 15:40',
    status: 'Aktif'
  }
];

export default function TemplateInvoicePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockTemplates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockTemplates.map(d => d.id));
    }
  };

  const getCategoryClass = (type: string) => {
    switch (type) {
      case 'corporate': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'premium': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'modern': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'minimalis': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'classic': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'startup': return 'bg-blue-600/10 text-blue-500 border border-blue-600/20';
      default: return 'bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Template Cetak Invoice</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Kustomisasi Desain & Template Invoice
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengaturan kop surat perusahaan, logo AUDIRA, catatan kaki rekening bank, QR Code validasi, dan styling cetak thermal/A4.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/invoice/semua" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Pratinjau</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total Template */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <LayoutIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Template</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">15</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua Template</p>
            </div>
          </div>

          {/* Card 2: Template Aktif */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Template Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">12</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">80% dari total</p>
            </div>
          </div>

          {/* Card 3: Template Bawaan */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Settings size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Template Bawaan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">5</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">System Default</p>
            </div>
          </div>

          {/* Card 4: Template Kustom */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <LayoutIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Template Kustom</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">10</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Dibuat User</p>
            </div>
          </div>

          {/* Card 5: Template Tidak Aktif */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Template Tidak Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">3</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">20% dari total</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari template invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Kategori</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Dibuat Oleh</option>
            </select>

            <button 
              onClick={() => { setSearchTerm(''); }}
              className="text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-transparent hover:border-[var(--app-border)] transition-all ml-auto"
            >
              Reset
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Plus size={14} />
              <span>Buat Template</span>
            </button>

            <button className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Template Table & Categories */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length > 0}
                          onChange={handleSelectAll}
                          className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-52">NAMA TEMPLATE</th>
                      <th className="p-4 w-32">KATEGORI</th>
                      <th className="p-4 w-44">DIBUAT OLEH</th>
                      <th className="p-4 w-40">DIBUAT PADA</th>
                      <th className="p-4 w-44">TERAKHIR DIUBAH</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                    {mockTemplates.map((d, idx) => {
                      const isSelected = selectedIds.includes(d.id);
                      return (
                        <tr 
                          key={d.id}
                          onClick={() => handleSelectRow(d.id)}
                          className={`hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer ${isSelected ? 'bg-[var(--app-border)]/20/50' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleSelectRow(d.id)}
                              className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                            />
                          </td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{idx + 1}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{d.name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryClass(d.categoryType)}`}>
                              {d.category}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-[var(--app-text)]/80">
                            <div className="flex items-center gap-1.5">
                              <span>{d.createdBy}</span>
                              {d.isSystem && (
                                <span className="bg-purple-500/15 text-purple-400 border border-purple-500/25 px-1 py-0.2 rounded text-[8px] font-extrabold uppercase">
                                  Bawaan
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.createdAt}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.updatedAt}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.status === 'Aktif' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20'
                            }`}>
                               {d.status}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-white/60">
                <span className="text-xs text-[var(--app-muted)]">
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">15</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled
                      className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                    <button className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)]/80 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Row: Kategori & Terbanyak & Aksi Cepat */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Kategori Template Donut */}
              <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Kategori Template</h4>
                
                <div className="relative flex justify-center py-1">
                  <svg width="110" height="110" viewBox="0 0 42 42" className="transform -rotate-90">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                    
                    {/* Corporate: 5 / 15 = 33.3% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4.5" 
                      strokeDasharray="33.3 66.7" 
                      strokeDashoffset="0" 
                    />

                    {/* Modern: 4 / 15 = 26.7% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                      strokeDasharray="26.7 73.3" 
                      strokeDashoffset="-33.3" 
                    />

                    {/* Premium: 2 / 15 = 13.3% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                      strokeDasharray="13.3 86.7" 
                      strokeDashoffset="-60" 
                    />

                    {/* Minimalis: 2 / 15 = 13.3% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                      strokeDasharray="13.3 86.7" 
                      strokeDashoffset="-73.3" 
                    />

                    {/* Classic: 1 / 15 = 6.7% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                      strokeDasharray="6.7 93.3" 
                      strokeDashoffset="-86.6" 
                    />

                    {/* Startup: 1 / 15 = 6.7% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="4.5" 
                      strokeDasharray="6.7 93.3" 
                      strokeDashoffset="-93.3" 
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-lg font-black text-[var(--app-text)]">15</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Total</p>
                  </div>
                </div>

                {/* Legends grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[9px] text-[var(--app-muted)]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-500" />Corporate</span>
                    <span className="text-white">(5) 33.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500" />Modern</span>
                    <span className="text-white">(4) 26.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" />Premium</span>
                    <span className="text-white">(2) 13.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-500" />Minimalis</span>
                    <span className="text-white">(2) 13.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500" />Classic</span>
                    <span className="text-white">(1) 6.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600" />Startup</span>
                    <span className="text-white">(1) 6.7%</span>
                  </div>
                </div>
              </div>

              {/* Penggunaan Template Terbanyak */}
              <div className="lg:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Penggunaan Template Terbanyak</h4>
                
                <div className="space-y-3">
                  {[
                    { name: '1. Corporate Standard', count: 48, percentage: 65 },
                    { name: '2. Modern Blue', count: 36, percentage: 50 },
                    { name: '3. Minimalis Clean', count: 28, percentage: 38 },
                    { name: '4. Elegant Corporate', count: 24, percentage: 33 },
                    { name: '5. Classic Professional', count: 18, percentage: 25 }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-[var(--app-text)]/80">
                        <span>{item.name}</span>
                        <span className="text-[var(--app-muted)]">{item.count} Invoice</span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aksi Cepat */}
              <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
                
                <div className="space-y-2 text-[10px] font-bold text-[var(--app-muted)]">
                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Plus size={12} className="text-blue-500" />
                      <span>Buat Template Baru</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Download size={12} className="text-purple-400" />
                      <span>Import Template</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Copy size={12} className="text-yellow-500" />
                      <span>Duplikat Template</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Settings size={12} className="text-green-500" />
                      <span>Kelola Placeholder</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Settings size={12} className="text-blue-500" />
                      <span>Pengaturan Default</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Preview Template Widget */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)] font-sans">Preview Template</h3>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                  Aktif
                </span>
              </div>
              
              {/* Mini Invoice preview */}
              <div className="bg-white p-4 rounded-xl border border-[var(--app-border)] text-[6px] text-gray-800 space-y-3 font-sans shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-extrabold text-blue-900 text-[8px] leading-tight">AudiraNET</h5>
                    <p className="text-[5px] text-[var(--app-muted)]">ISP Billing System</p>
                    <p className="text-[4px] text-[var(--app-muted)] mt-1">Jl. Teknologi Raya No. 123<br />Yogyakarta, Indonesia<br />Telp: (0274) 1234567<br />Email: info@audiranet.com</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-gray-900 font-extrabold text-[9px] uppercase tracking-wider">INVOICE</h4>
                    <p className="text-[var(--app-muted)] mt-0.5">Nilai: INV/2026/07/0001</p>
                    <p className="text-[var(--app-muted)] mt-1">Tanggal: 22 Oktober 2026<br />Jatuh Tempo: 10 Juli 2026</p>
                  </div>
                </div>

                <div className="border-t border-b border-gray-100 py-1.5">
                  <p className="font-bold text-[6px] text-gray-900 uppercase mb-1">Ditagihkan Kepada :</p>
                  <p className="font-extrabold text-gray-800 text-[6px]">Budi Santoso</p>
                  <p className="text-[var(--app-muted)] mt-0.5">PT. Maju Bersama<br />Jl. Sudirman No. 45<br />Jakarta Selatan, 12190</p>
                </div>

                <table className="w-full text-left border-collapse text-[5px]">
                  <thead>
                    <tr className="border-b border-gray-200 font-bold text-gray-900">
                      <th className="py-1">No</th>
                      <th className="py-1">Deskripsi</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Harga</th>
                      <th className="py-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="py-1 text-[var(--app-muted)]">1</td>
                      <td className="py-1 text-gray-800 font-medium">Internet Dedicated 100 Mbps</td>
                      <td className="py-1 text-center text-gray-600">1</td>
                      <td className="py-1 text-right text-gray-600">Rp 1.250.000</td>
                      <td className="py-1 text-right text-gray-800 font-bold">Rp 1.250.000</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-[var(--app-muted)]">2</td>
                      <td className="py-1 text-gray-800 font-medium">IP Public / Static IP</td>
                      <td className="py-1 text-center text-gray-600">1</td>
                      <td className="py-1 text-right text-gray-600">Rp 150.000</td>
                      <td className="py-1 text-right text-gray-800 font-bold">Rp 150.000</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-[var(--app-muted)]">3</td>
                      <td className="py-1 text-gray-800 font-medium">Maintenance & Support</td>
                      <td className="py-1 text-center text-gray-600">1</td>
                      <td className="py-1 text-right text-gray-600">Rp 100.000</td>
                      <td className="py-1 text-right text-gray-800 font-bold">Rp 100.000</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between items-start pt-1.5 border-t border-gray-100 text-[5px]">
                  <p className="text-[var(--app-muted)] italic">Terima kasih atas kepercayaan Anda.</p>
                  <div className="w-24 space-y-1 text-right">
                    <div className="flex justify-between text-[var(--app-muted)]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-850">Rp 1.500.000</span>
                    </div>
                    <div className="flex justify-between text-[var(--app-muted)]">
                      <span>PPN 11%</span>
                      <span className="font-semibold text-gray-850">Rp 165.000</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-bold border-t border-gray-100 pt-0.5">
                      <span>Total</span>
                      <span>Rp 1.665.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Detail Template */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Detail Template</h3>
              
              <div className="space-y-3.5 text-xs text-[var(--app-muted)] font-semibold">
                <div className="flex justify-between">
                  <span>Nama Template</span>
                  <span className="text-[var(--app-text)] font-bold">Corporate Standard</span>
                </div>
                <div className="flex justify-between">
                  <span>Kategori</span>
                  <span className="text-white">Corporate</span>
                </div>
                <div className="flex justify-between">
                  <span>Dibuat Pada</span>
                  <span className="text-white">System (Bawaan)</span>
                </div>
                <div className="flex justify-between">
                  <span>Terakhir Diubah</span>
                  <span className="text-white">25/06/2026 14:30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                    Aktif
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--app-border)]">
                  <span className="text-[10px] text-[var(--app-muted)] uppercase font-bold tracking-wider block mb-1">Deskripsi</span>
                  <p className="text-[var(--app-text)]/80 leading-relaxed font-medium">
                    Template invoice standar untuk kebutuhan corporate dengan desain profesional.
                  </p>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--app-border)]">
                  <span>Digunakan Pada</span>
                  <span className="text-blue-400 font-bold">48 Invoice</span>
                </div>
              </div>
            </div>

            {/* Card 3: Fitur Template */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Fitur Template</h3>
              
              <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-[var(--app-muted)]">
                {[
                  { name: 'Logo Perusahaan', checked: true },
                  { name: 'Pajak & PPN', checked: true },
                  { name: 'Informasi Perusahaan', checked: true },
                  { name: 'Syarat & Ketentuan', checked: true },
                  { name: 'Detail Customer', checked: true },
                  { name: 'Tanda Tangan', checked: true },
                  { name: 'Item Invoice', checked: true },
                  { name: 'QR Code Pembayaran', checked: true }
                ].map((fitur, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle size={12} className={fitur.checked ? 'text-green-500' : 'text-gray-600'} />
                    <span>{fitur.name}</span>
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
