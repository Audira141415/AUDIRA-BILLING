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
  Trash2
} from 'lucide-react';

interface QuickReplyItem {
  id: string;
  name: string;
  category: 'Salam' | 'Informasi' | 'Pembayaran' | 'Notifikasi' | 'Penagihan' | 'Umum' | 'Promosi' | 'Lainnya';
  lang: string;
  status: 'Aktif' | 'Non Aktif';
  usedCount: number;
  updatedAt: string;
  updatedBy: string;
  isFavorite: boolean;
  snippet: string;
}

const mockQuickReplies: QuickReplyItem[] = [
  { id: '1', name: 'Salam Pembuka', snippet: 'Halo {{1}}, Terima kasih telah menghubungi kami...', category: 'Salam', lang: 'Indonesia', status: 'Aktif', usedCount: 342, updatedAt: '22/10/2026 08:32', updatedBy: 'Agus Dwi Rianto', isFavorite: true },
  { id: '2', name: 'Info Paket Internet', snippet: 'Berikut daftar paket internet yang tersedia saat ini...', category: 'Informasi', lang: 'Indonesia', status: 'Aktif', usedCount: 213, updatedAt: '22/10/2026 07:45', updatedBy: 'Rina Marlina', isFavorite: true },
  { id: '3', name: 'Konfirmasi Pembayaran', snippet: 'Terima kasih {{1}}, pembayaran sebesar Rp {{2}}...', category: 'Pembayaran', lang: 'Indonesia', status: 'Aktif', usedCount: 186, updatedAt: '30/06/2026 21:15', updatedBy: 'Rina Marlina', isFavorite: true },
  { id: '4', name: 'Gangguan Layanan', snippet: 'Mohon maaf saat ini sedang terjadi gangguan layanan...', category: 'Notifikasi', lang: 'Indonesia', status: 'Aktif', usedCount: 128, updatedAt: '30/06/2026 19:30', updatedBy: 'Agus Dwi Rianto', isFavorite: true },
  { id: '5', name: 'Penagihan Jatuh Tempo', snippet: 'Halo {{1}}, tagihan Anda sebesar Rp {{2}} akan jatuh tempo...', category: 'Penagihan', lang: 'Indonesia', status: 'Aktif', usedCount: 98, updatedAt: '29/06/2026 16:20', updatedBy: 'Indah Permata', isFavorite: true },
  { id: '6', name: 'Ucapan Terima Kasih', snippet: 'Terima kasih telah menjadi pelanggan setia kami...', category: 'Umum', lang: 'Indonesia', status: 'Aktif', usedCount: 76, updatedAt: '28/06/2026 10:10', updatedBy: 'Indah Permata', isFavorite: true },
  { id: '7', name: 'Promo Spesial', snippet: 'Dapatkan promo spesial untuk Anda {{1}}...', category: 'Promosi', lang: 'Indonesia', status: 'Aktif', usedCount: 65, updatedAt: '27/06/2026 14:00', updatedBy: 'Agus Dwi Rianto', isFavorite: true },
  { id: '8', name: 'Cara Cek Tagihan', snippet: 'Berikut cara mudah untuk mengecek tagihan Anda...', category: 'Informasi', lang: 'Indonesia', status: 'Non Aktif', usedCount: 0, updatedAt: '25/06/2026 11:20', updatedBy: 'WhatsApp System', isFavorite: true }
];

export default function WhatsappQuickReplyPage() {
  const [selectedQRId, setSelectedQRId] = useState('1');
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
              <span className="text-blue-500 font-semibold">Balasan Cepat (Quick Reply)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              undefined
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar template respon cepat (/bank, /restart, /ont) untuk mempercepat First Response Time (FRT) penanganan komplain.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/whatsapp/chat" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Buka Chat</Link>
          </div>
        </div>

        {/* ─── Description & Global Action Buttons ───────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-[var(--app-muted)] font-semibold uppercase tracking-wider">Quick Reply</p>
            <p className="text-[10px] text-[var(--app-muted)] leading-normal">
              Kelola pesan cepat untuk membalas pelanggan dengan lebih efisien.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all border-none">
              <PlusCircle size={14} />
              <span>Buat Quick Reply Baru</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all border-gray-800">
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Import Quick Reply</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Quick Reply</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">58</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua pesan cepat</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Send size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Digunakan</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">1.248</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Bulan ini</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Sliders size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Kategori</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">8</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Kategori aktif</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Star size={20} className="fill-orange-500/20" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Favorit</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">16</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Ditandai favorit</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dibuat Oleh</p>
              <p className="text-xs font-black text-[var(--app-text)] mt-0.5">Agus Dwi Rianto</p>
              <p className="text-[8px] text-[var(--app-muted)] mt-0.5 font-medium uppercase">Super Admin</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Terakhir Diperbarui</p>
              <p className="text-xs font-black text-[var(--app-text)] mt-0.5">22/10/2026 08:32</p>
              <p className="text-[8px] text-[var(--app-muted)] mt-0.5 font-medium">Oleh: Rina Marlina</p>
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
                placeholder="Cari quick reply..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Kategori</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Bahasa</option>
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

          {/* Left Column: List (6/12 cols) */}
          <div className="lg:col-span-6 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">JUDUL PESAN</th>
                    <th className="p-4 w-24 text-center">KATEGORI</th>
                    <th className="p-4 w-20 text-center">BAHASA</th>
                    <th className="p-4 w-24 text-center">STATUS</th>
                    <th className="p-4 w-20 text-center">DIGUNAKAN</th>
                    <th className="p-4">TERAKHIR DIPERBARUI</th>
                    <th className="p-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {mockQuickReplies.map(item => {
                    const isSelected = selectedQRId === item.id;
                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedQRId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#0052cc]/10 hover:bg-[#0052cc]/15' : 'hover:bg-[var(--app-border)]/20'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-lg mt-0.5">
                              <MessageSquare size={14} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-[var(--app-text)] leading-tight">{item.name}</p>
                              <p className="text-[8px] text-[var(--app-muted)] line-clamp-1 max-w-[200px] font-semibold">{item.snippet}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                            item.category === 'Salam' ? 'bg-purple-500/10 text-purple-400' :
                            item.category === 'Informasi' ? 'bg-blue-500/10 text-blue-400' :
                            item.category === 'Pembayaran' ? 'bg-green-500/10 text-green-400' :
                            item.category === 'Notifikasi' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 text-center font-medium text-[var(--app-muted)]">{item.lang}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                            item.status === 'Aktif' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[var(--app-text)] font-bold">{item.usedCount}</td>
                        <td className="p-4">
                          <p className="text-white leading-none font-semibold">{item.updatedAt}</p>
                          <span className="text-[8px] text-gray-505 text-[var(--app-muted)] font-semibold mt-1 block">{item.updatedBy}</span>
                        </td>
                        <td className="p-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                              <Eye size={13} />
                            </button>
                            <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                              <Edit2 size={13} />
                            </button>
                            <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-yellow-500 transition-colors">
                              <Star size={13} className="fill-yellow-500/20" />
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
                Menampilkan <span className="font-semibold text-white">1 - 8</span> dari <span className="font-semibold text-white">58</span> data
              </span>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button disabled className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">3</button>
                  <span className="text-gray-600 text-xs px-1">...</span>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">8</button>
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

          {/* Center Column: Detail Quick Reply & Isi Pesan (3/12 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Detail Quick Reply Header */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Detail Quick Reply</h3>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                  Aktif
                </span>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-muted)]">
                <div className="flex justify-between"><span>Judul Pesan</span><span className="text-white">Salam Pembuka</span></div>
                <div className="flex justify-between"><span>Kategori</span><span className="text-white">Salam</span></div>
                <div className="flex justify-between"><span>Bahasa</span><span className="text-white">Indonesia</span></div>
                <div className="flex justify-between"><span>Variabel</span><span className="text-white">{"{{1}}"} (Nama Pelanggan)</span></div>
                <div className="flex justify-between"><span>Digunakan</span><span className="text-white">342 kali</span></div>
                <div className="flex justify-between"><span>Terakhir Diperbarui</span><span className="text-white font-mono">22/10/2026 08:32</span></div>
                <div className="flex justify-between"><span>Oleh</span><span className="text-white">Agus Dwi Rianto</span></div>
              </div>
            </div>

            {/* Isi Pesan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Isi Pesan</h3>
              
              <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3.5 text-[10px] space-y-1.5 text-[var(--app-text)]/80 font-mono min-h-36">
                <p>Halo {"{{1}}"},</p>
                <p>Terima kasih telah menghubungi {"{{2}}"}.</p>
                <p>Ada yang bisa kami bantu hari ini? 😊</p>
                <p>Salam,</p>
                <p>{"{{3}}"}</p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-[var(--app-muted)] font-bold">
                <span>112 / 1024 karakter</span>
              </div>
            </div>

            {/* Variabel */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Variabel</h3>
                
                <div className="space-y-2 mt-4 text-[10px] font-mono">
                  <div className="flex justify-between items-center bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                    <span className="text-blue-400 font-bold">{"{{1}}"}</span>
                    <span className="text-white">Nama Pelanggan</span>
                  </div>
                  <div className="flex justify-between items-center bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                    <span className="text-blue-400 font-bold">{"{{2}}"}</span>
                    <span className="text-white">Nama Perusahaan</span>
                  </div>
                  <div className="flex justify-between items-center bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                    <span className="text-blue-400 font-bold">{"{{3}}"}</span>
                    <span className="text-white">Nama Admin</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-xs font-bold py-2.5 rounded-xl transition-all border-gray-800 mt-4">
                <span>Kelola Variabel</span>
              </button>
            </div>

          </div>

          {/* Right Column: Preview, Contoh Penggunaan, Aksi (3/12 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Preview Pesan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Preview Pesan</h3>
              
              {/* WA bubble */}
              <div className="bg-[#d9fdd3] text-gray-800 rounded-xl p-3.5 text-[10px] space-y-2 border border-green-200/50 shadow relative">
                <p>Halo Budi Santoso,</p>
                <p>
                  Terima kasih telah menghubungi AudiraNET.
                </p>
                <p>Ada yang bisa kami bantu hari ini? 😊</p>
                <p>Salam,</p>
                <p className="font-bold">Agus Dwi Rianto</p>
                <div className="text-[8px] text-[var(--app-muted)] text-right flex items-center justify-end gap-1 pt-1 font-semibold">
                  <span>08:32</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Contoh Penggunaan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Contoh Penggunaan</h3>
                
                <div className="space-y-3.5 mt-3.5 text-[10px] font-bold text-[var(--app-muted)]">
                  <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-1">
                    <p className="text-[var(--app-text)] font-bold">Budi Santoso</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal leading-relaxed">
                      Halo Budi Santoso, Terima kasih telah menghubungi AudiraNET. Ada yang bisa kami bantu hari ini? 😊 Salam, Agus Dwi Rianto
                    </p>
                  </div>
                  <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-1">
                    <p className="text-[var(--app-text)] font-bold">Siti Aminah</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal leading-relaxed">
                      Halo Siti Aminah, Terima kasih telah menghubungi AudiraNET. Ada yang bisa kami bantu hari ini? 😊 Salam, Agus Dwi Rianto
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-3 border-t border-[var(--app-border)]/60 block mt-2">
                Lihat Semua Contoh
              </button>
            </div>

            {/* Aksi Cepat Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h3>
              
              <div className="space-y-3.5 text-xs font-bold text-[var(--app-muted)]">
                <button className="w-full flex items-center gap-3 bg-blue-500/10 text-blue-450 border border-blue-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <Edit2 size={16} className="text-blue-405 text-blue-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-[var(--app-text)]">Edit Quick Reply</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Ubah isi pesan</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-green-500/10 text-green-400 border border-green-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <Copy size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-[var(--app-text)]">Duplicate</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Duplikat pesan ini</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <Sliders size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-[var(--app-text)]">Non Aktifkan</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Nonaktifkan sementara</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] border-none">
                  <Trash2 size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold">Hapus</p>
                    <p className="text-[8px] text-red-200 font-normal mt-0.5">Hapus quick reply ini</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ─── Kategori Quick Reply (Bottom Row Badge) ───────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Kategori Quick Reply</h3>
              <button className="text-[9px] bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] font-bold px-2 py-1 rounded">
                Kelola Kategori
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3.5 text-[9px] font-bold text-[var(--app-muted)]">
              {[
                { name: 'Salam', count: '8 pesan', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
                { name: 'Informasi', count: '12 pesan', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                { name: 'Pembayaran', count: '10 pesan', color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
                { name: 'Notifikasi', count: '7 pesan', color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
                { name: 'Penagihan', count: '6 pesan', color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
                { name: 'Promosi', count: '8 pesan', color: 'bg-pink-500/10 text-pink-400 border border-pink-500/20' },
                { name: 'Umum', count: '5 pesan', color: 'bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20' },
                { name: 'Lainnya', count: '2 pesan', color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' }
              ].map((cat, idx) => (
                <div key={idx} className={`px-3 py-1.5 rounded-xl flex items-center gap-2 ${cat.color}`}>
                  <span>{cat.name}</span>
                  <span className="bg-[var(--app-bg)] text-[8px] px-1 rounded-md text-[var(--app-text)]/80 font-bold">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
