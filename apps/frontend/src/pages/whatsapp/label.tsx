import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
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
  Wallet,
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
  Smartphone,
  CreditCard,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  Info,
  Users,
  MessageSquare,
  Send,
  Sliders,
  HelpCircle,
  Edit2,
  PlusCircle,
  Copy,
  ChevronDown,
  LayoutGrid,
  List,
  Star,
  StarOff,
  Trash2,
  Tag,
  FolderMinus
} from 'lucide-react';

interface LabelItem {
  id: string;
  name: string;
  desc: string;
  color: string;
  category: 'Pelanggan' | 'Transaksi' | 'Layanan' | 'Marketing' | 'Partner';
  contactCount: number;
  lastUsed: string;
  createdBy: string;
  status: 'Aktif' | 'Non Aktif';
}

const mockLabels: LabelItem[] = [
  { id: '1', name: 'Pelanggan VIP', desc: 'Pelanggan prioritas utama', color: '#6366F1', category: 'Pelanggan', contactCount: 1248, lastUsed: '22/10/2026 08:32', createdBy: 'Agus Dwi Rianto', status: 'Aktif' },
  { id: '2', name: 'Pelanggan Baru', desc: 'Pelanggan yang baru mendaftar', color: '#10B981', category: 'Pelanggan', contactCount: 3521, lastUsed: '22/10/2026 07:45', createdBy: 'Rina Marlina', status: 'Aktif' },
  { id: '3', name: 'Menunggu Pembayaran', desc: 'Belum melakukan pembayaran', color: '#F59E0B', category: 'Transaksi', contactCount: 2136, lastUsed: '30/06/2026 21:15', createdBy: 'Rina Marlina', status: 'Aktif' },
  { id: '4', name: 'Pembayaran Lunas', desc: 'Sudah melakukan pembayaran', color: '#10B981', category: 'Transaksi', contactCount: 4258, lastUsed: '30/06/2026 19:30', createdBy: 'Agus Dwi Rianto', status: 'Aktif' },
  { id: '5', name: 'Menunggu Konfirmasi', desc: 'Menunggu konfirmasi admin', color: '#8B5CF6', category: 'Layanan', contactCount: 1024, lastUsed: '29/06/2026 16:20', createdBy: 'Indah Permata', status: 'Aktif' },
  { id: '6', name: 'Komplain', desc: 'Pelanggan yang komplain', color: '#EF4444', category: 'Layanan', contactCount: 342, lastUsed: '28/06/2026 10:10', createdBy: 'Indah Permata', status: 'Aktif' },
  { id: '7', name: 'Follow Up', desc: 'Perlu di-follow up', color: '#06B6D4', category: 'Marketing', contactCount: 1856, lastUsed: '27/06/2026 14:00', createdBy: 'Agus Dwi Rianto', status: 'Aktif' },
  { id: '8', name: 'Reseller', desc: 'Partner reseller', color: '#EC4899', category: 'Partner', contactCount: 856, lastUsed: '26/06/2026 11:20', createdBy: 'WhatsApp System', status: 'Aktif' },
  { id: '9', name: 'Expired', desc: 'Layanan sudah expired', color: '#6B7280', category: 'Layanan', contactCount: 628, lastUsed: '25/06/2026 09:15', createdBy: 'WhatsApp System', status: 'Non Aktif' },
  { id: '10', name: 'Blacklist', desc: 'Jangan hubungi', color: '#374151', category: 'Layanan', contactCount: 128, lastUsed: '24/06/2026 16:45', createdBy: 'Agus Dwi Rianto', status: 'Aktif' }
];

export default function WhatsappLabelPage() {
  const [selectedLabelId, setSelectedLabelId] = useState('1');
  const [activeSubTab, setActiveSubTab] = useState('semua');

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Label & Segmentasi</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              undefined
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengelompokan kontak berdasarkan kategori (VIP Korporat, Isolir Menunggak, Gangguan Massal, Prospek Baru).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/whatsapp/contacts" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Kontak</Link>
          </div>
        </div>

        {/* ─── Description & Global Action Buttons ───────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[var(--app-text)] leading-none">Label</p>
            <p className="text-[10px] text-[var(--app-muted)] font-semibold mt-1">
              Kelola label untuk mengorganisir kontak, chat, dan campaign WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all border-none">
              <PlusCircle size={14} />
              <span>Buat Label Baru</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all border-gray-800">
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Import Label</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-xl">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Label</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">32</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua label</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Digunakan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">28</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">87.5% dari total</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Tidak Digunakan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">4</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">12.5% dari total</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Kontak</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">12.548</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Diberi label</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Multi Label</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.136</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Kontak dengan multi label</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari label..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Jenis</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Warna</option>
            </select>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
              <option>Urutan: Terbaru</option>
            </select>
            <div className="flex bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-1 gap-1">
              <button className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg"><LayoutGrid size={14} /></button>
              <button className="p-1.5 bg-[var(--app-bg)] text-white rounded-lg"><List size={14} /></button>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: List & Bottom visual widgets (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4">NAMA LABEL</th>
                      <th className="p-4 w-20 text-center">WARNA</th>
                      <th className="p-4 w-24 text-center">JENIS</th>
                      <th className="p-4 w-20 text-center">KONTAK</th>
                      <th className="p-4">PENGGUNAAN TERAKHIR</th>
                      <th className="p-4">DIBUAT OLEH</th>
                      <th className="p-4 w-24 text-center">STATUS</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {mockLabels.map(item => {
                      const isSelected = selectedLabelId === item.id;
                      return (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedLabelId(item.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#0052cc]/10 hover:bg-[#0052cc]/15' : 'hover:bg-[var(--app-border)]/20'
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex gap-3">
                              <div className="p-2 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-lg mt-0.5">
                                <Tag size={14} />
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-[var(--app-text)] leading-tight">{item.name}</p>
                                <p className="text-[8px] text-[var(--app-muted)] line-clamp-1 max-w-[150px] font-semibold">{item.desc}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center">
                              <span className="w-5 h-5 rounded-md border border-gray-800 flex items-center justify-center text-[7px] text-white font-mono font-bold leading-none" style={{ backgroundColor: item.color }}>
                                {item.color}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center font-medium text-[var(--app-muted)]">{item.category}</td>
                          <td className="p-4 text-center text-[var(--app-text)] font-bold">{item.contactCount}</td>
                          <td className="p-4 font-semibold text-white">{item.lastUsed}</td>
                          <td className="p-4 font-semibold text-[var(--app-muted)]">{item.createdBy}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                              item.status === 'Aktif' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                                <Copy size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-red-500 transition-colors">
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

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-white/60">
                <span className="text-xs text-[var(--app-muted)]">
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">32</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button disabled className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">3</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">4</button>
                    <button className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)]">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)]/80 focus:outline-none">
                    <option value={10}>10 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom row widgets: Distribusi, Top 5, Aktivitas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Distribusi Label Donut */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Distribusi Label</h4>
                
                <div className="relative flex justify-center py-2 scale-90">
                  <svg width="100" height="100" viewBox="0 0 42 42" className="transform -rotate-90">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="5.5" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6366f1" strokeWidth="5.5" strokeDasharray="56 44" strokeDashoffset="0" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="5.5" strokeDasharray="50.9 49.1" strokeDashoffset="-56" />
                  </svg>
                </div>

                <div className="space-y-1.5 text-[8px] text-[var(--app-muted)] font-bold uppercase">
                  <div className="flex items-center justify-between"><span>Pelanggan</span><span className="text-white">7.027 (56.0%)</span></div>
                  <div className="flex items-center justify-between"><span>Transaksi</span><span className="text-white">6.394 (50.9%)</span></div>
                  <div className="flex items-center justify-between"><span>Layanan</span><span className="text-white">3.112 (24.8%)</span></div>
                  <div className="flex items-center justify-between"><span>Marketing</span><span className="text-white">1.856 (14.8%)</span></div>
                  <div className="flex items-center justify-between"><span>Partner</span><span className="text-white">856 (6.8%)</span></div>
                </div>
              </div>

              {/* Top 5 Label Terbanyak progress list */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Top 5 Label Terbanyak</h4>
                
                <div className="space-y-3.5 text-[10px] font-semibold text-[var(--app-muted)] mt-2">
                  {[
                    { name: 'Pembayaran Lunas', w: '95%', val: '4.258' },
                    { name: 'Pelanggan Baru', w: '78%', val: '3.521' },
                    { name: 'Menunggu Pembayaran', w: '48%', val: '2.136' },
                    { name: 'Follow Up', w: '42%', val: '1.856' },
                    { name: 'Pelanggan VIP', w: '28%', val: '1.248' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-[var(--app-text)] font-bold">{item.val}</span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: item.w }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aktivitas Label (7 Hari Terakhir) */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aktivitas Label (7 Hari Terakhir)</h4>
                  
                  <div className="h-24 w-full mt-2">
                    <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                      
                      <path d="M20,68 L60,30 L100,45 L140,70 L180,68 L220,78 L260,60" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      
                      <text x="15" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">25 Jun</text>
                      <text x="60" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">27 Jun</text>
                      <text x="105" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">29 Jun</text>
                      <text x="150" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                    </svg>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Detail Label & Kontak Terbaru & Aksi (5/12 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Detail Label Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Detail Label</h3>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                  Aktif
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold text-[var(--app-muted)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-lg">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h4 className="text-[var(--app-text)] font-bold">Pelanggan VIP</h4>
                    <p className="text-[8px] text-[var(--app-muted)] font-mono mt-0.5">ID: label_001</p>
                  </div>
                </div>

                {/* Mini Stats row */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                    <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Total Kontak</p>
                    <p className="text-sm font-black text-[var(--app-text)] mt-1">1.248</p>
                  </div>
                  <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                    <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Chat (7 Hari)</p>
                    <p className="text-sm font-black text-[var(--app-text)] mt-1">96</p>
                  </div>
                  <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                    <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Campaign</p>
                    <p className="text-sm font-black text-[var(--app-text)] mt-1">12</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-[10px] pt-1">
                  <div className="flex justify-between"><span>Nama Label</span><span className="text-white">Pelanggan VIP</span></div>
                  <div className="space-y-1">
                    <span>Deskripsi</span>
                    <p className="text-white text-[9px] leading-relaxed font-normal">
                      Pelanggan prioritas utama yang mendapatkan layanan penanganan lebih cepat.
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Warna</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-[#6366F1]"></span>
                      <span className="text-white font-mono">#6366F1</span>
                    </div>
                  </div>
                  <div className="flex justify-between"><span>Jenis Label</span><span className="text-white">Pelanggan</span></div>
                  <div className="flex justify-between"><span>Kontak</span><span className="text-white">1.248 kontak</span></div>
                  <div className="flex justify-between"><span>Dibuat Oleh</span><span className="text-white">Agus Dwi Rianto</span></div>
                  <div className="flex justify-between"><span>Tanggal Dibuat</span><span className="text-white font-mono">01/06/2026 08:20</span></div>
                  <div className="flex justify-between"><span>Penggunaan Terakhir</span><span className="text-white font-mono">22/10/2026 08:32</span></div>
                </div>
              </div>
            </div>

            {/* Kontak Terbaru widget */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Kontak Terbaru</h3>
                <button className="text-[9px] text-blue-500 font-bold hover:underline">Lihat Semua</button>
              </div>

              <div className="space-y-3 mt-4 text-[10px] font-bold text-[var(--app-muted)]">
                {[
                  { name: 'Budi Santoso', time: '08:32' },
                  { name: 'Siti Aminah', time: '08:30' },
                  { name: 'Andi Pratama', time: '08:25' },
                  { name: 'Dewi Lestari', time: '08:20' },
                  { name: 'Fajar Nugroho', time: '08:18' }
                ].map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-[var(--app-border)]/40 last:border-0 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[var(--app-text)] font-bold text-[8px] overflow-hidden">
                        <span>{c.name[0]}</span>
                      </div>
                      <span className="text-[var(--app-text)] font-bold">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--app-muted)] text-[8px] font-semibold">{c.time}</span>
                      <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 px-1.5 py-0.2 rounded text-[7px] font-black uppercase">
                        VIP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aksi Cepat Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h3>
              
              <div className="space-y-3.5 text-xs font-bold text-[var(--app-muted)]">
                <button className="w-full flex items-center gap-3 bg-blue-500/10 text-blue-455 border border-blue-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <Edit2 size={16} className="text-blue-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-[var(--app-text)]">Edit Label</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Ubah properti label</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-green-500/10 text-green-400 border border-green-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <Copy size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-[var(--app-text)]">Duplicate Label</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Duplikat label ini</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <FolderMinus size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-[var(--app-text)]">Non Aktifkan Label</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Nonaktifkan penggunaan</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-red-650 bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] border-none">
                  <Trash2 size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold">Hapus Label</p>
                    <p className="text-[8px] text-red-200 font-normal mt-0.5">Hapus data label</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
