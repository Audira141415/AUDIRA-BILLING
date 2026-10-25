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
  Phone,
  Star,
  PlusCircle,
  Paperclip
} from 'lucide-react';

interface ContactItem {
  id: string;
  name: string;
  phone: string;
  label: 'Pelanggan' | 'Prospek' | 'Grup' | 'VIP';
  time: string;
}

const mockContactsList: ContactItem[] = [
  { id: '1', name: 'Budi Santoso', phone: '6281234567890', label: 'Pelanggan', time: '08:32' },
  { id: '2', name: 'Siti Aminah', phone: '6289876543211', label: 'Prospek', time: '08:20' },
  { id: '3', name: 'Andi Pratama', phone: '6281111111112', label: 'Pelanggan', time: '08:10' },
  { id: '4', name: 'Dewi Lestari', phone: '6282222222222', label: 'VIP', time: '08:05' },
  { id: '5', name: 'Fajar Nugroho', phone: '6283333333333', label: 'Pelanggan', time: 'Kemarin' },
  { id: '6', name: 'PT. Maju Bersama', phone: '6284444444444', label: 'Grup', time: 'Kemarin' },
  { id: '7', name: 'Nina Wulandari', phone: '6285555555555', label: 'Pelanggan', time: 'Kemarin' },
  { id: '8', name: 'CV. Sinar Abadi', phone: '6286666666666', label: 'Grup', time: 'Kemarin' },
  { id: '9', name: 'Putri Handayani', phone: '6287777777777', label: 'Prospek', time: '2 Hari lalu' },
  { id: '10', name: 'Bambang Setiawan', phone: '6288888888888', label: 'Pelanggan', time: '2 Hari lalu' }
];

export default function WhatsappContactsPage() {
  const [selectedContactId, setSelectedContactId] = useState('1');
  const [activeSubTab, setActiveSubTab] = useState('detail');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Kontak Pelanggan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              undefined
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar nomor WhatsApp seluruh pelanggan aktif, status opt-in penerimaan pesan, dan validasi format nomor +62.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/pelanggan" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Data Pelanggan</Link>
          </div>
        </div>

        {/* ─── Main Content Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Daftar Kontak (3/12 cols) */}
          <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Daftar Kontak</h3>
              
              {/* Search contacts */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                <input 
                  type="text" 
                  placeholder="Cari kontak..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-8 py-2 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
                />
                <button className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] hover:text-white">
                  <Filter size={12} />
                </button>
              </div>

              {/* Sub-tabs inside list */}
              <div className="flex border-b border-[var(--app-border)] text-[10px] font-bold text-[var(--app-muted)] pb-1.5 overflow-x-auto gap-2">
                <button className="text-white border-b border-blue-500 pb-1 font-bold">Semua 12.548</button>
                <button className="hover:text-[var(--app-text)]/80 pb-1">Pelanggan 8.652</button>
                <button className="hover:text-[var(--app-text)]/80 pb-1">Prospek 2.145</button>
                <button className="hover:text-[var(--app-text)]/80 pb-1">Grup 1.751</button>
              </div>

              {/* Contact list items */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {mockContactsList.map(item => {
                  const isSelected = selectedContactId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedContactId(item.id)}
                      className={`flex justify-between items-center p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-[#0052cc]/10 border border-[#0052cc]' : 'bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[var(--app-text)] font-bold text-xs overflow-hidden">
                          <span>{item.name[0]}</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[var(--app-text)] leading-tight">{item.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-[var(--app-muted)] font-mono">{item.phone}</span>
                            <span className={`px-1 rounded text-[7px] font-black ${
                              item.label === 'Pelanggan' ? 'bg-green-500/10 text-green-400' :
                              item.label === 'VIP' ? 'bg-purple-500/10 text-purple-400' :
                              item.label === 'Grup' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                            }`}>
                              {item.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[8px] text-[var(--app-muted)] font-semibold">{item.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination inside sidebar */}
            <div className="flex justify-between items-center text-[10px] text-[var(--app-muted)] border-t border-[var(--app-border)]/60 pt-3">
              <span>1 - 10 dari 12.548</span>
              <div className="flex items-center gap-1.5">
                <button className="p-1 border border-[var(--app-border)] rounded text-[var(--app-muted)] disabled:opacity-30" disabled>
                  <ChevronLeft size={10} />
                </button>
                <span className="text-[var(--app-text)] font-bold">1</span>
                <button className="p-1 border border-[var(--app-border)] rounded text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Center Main Area: Details (6/12 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Main Profile Header card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center text-[var(--app-text)] font-bold text-xl overflow-hidden">
                  <span>BS</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--app-text)] leading-none">Budi Santoso</h2>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.2 rounded text-[8px] font-black uppercase">
                      Pelanggan
                    </span>
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-xs text-[var(--app-muted)] font-mono">6281234567890</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 bg-[#10b981] hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all">
                  <MessageSquare size={13} />
                  <span>Kirim Pesan</span>
                </button>
                
                <button className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-xs font-bold px-4 py-2 rounded-xl transition-all border-gray-800">
                  <Phone size={13} />
                  <span>Panggil</span>
                </button>

                <button className="flex items-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all">
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>

                <button className="p-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/30 transition-colors">
                  <MoreVertical size={13} className="text-[var(--app-muted)]" />
                </button>
              </div>
            </div>

            {/* Profile Sub-tabs row */}
            <div className="flex border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-muted)] pb-px overflow-x-auto gap-2">
              {[
                { id: 'detail', label: 'Detail' },
                { id: 'chat', label: 'Chat' },
                { id: 'riwayat', label: 'Riwayat' },
                { id: 'transaksi', label: 'Transaksi' },
                { id: 'campaign', label: 'Campaign' },
                { id: 'catatan', label: 'Catatan' },
                { id: 'label', label: 'Label' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${
                    activeSubTab === tab.id ? 'border-blue-500 text-[var(--app-text)] font-bold' : 'border-transparent hover:text-[var(--app-text)]/80'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-grid: Informasi Kontak & Statistik & Ringkasan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Informasi Kontak */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Informasi Kontak</h4>
                  
                  <div className="space-y-3 mt-4 text-xs font-semibold text-gray-450 text-[var(--app-muted)]">
                    <div className="flex justify-between"><span>Nama Lengkap</span><span className="text-white">Budi Santoso</span></div>
                    <div className="flex justify-between"><span>Nomor WhatsApp</span><span className="text-white font-mono">6281234567890</span></div>
                    <div className="flex justify-between"><span>Email</span><span className="text-white">budi.santoso@email.com</span></div>
                    <div className="flex justify-between"><span>Tanggal Bergabung</span><span className="text-white">22/10/2026 08:32</span></div>
                    <div className="flex justify-between"><span>Status</span><span className="text-green-400 font-bold">Aktif</span></div>
                    <div className="flex justify-between"><span>Sumber</span><span className="text-white">Import Kontak</span></div>
                    <div className="flex justify-between"><span>Agent</span><span className="text-white">Agus Dwi Rianto</span></div>
                    <div className="flex justify-between items-center">
                      <span>Label</span>
                      <div className="flex gap-1">
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.2 rounded text-[9px] font-bold">Pelanggan</span>
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.2 rounded text-[9px] font-bold">VIP</span>
                        <button className="p-0.5 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)]"><Plus size={10} /></button>
                      </div>
                    </div>
                    <div className="flex justify-between"><span>Grup</span><span className="text-white">Pelanggan Premium</span></div>
                    <div className="flex justify-between"><span>Alamat</span><span className="text-white">Jl. Mawar No. 10, Jakarta Selatan</span></div>
                    <div className="flex justify-between"><span>Kota</span><span className="text-white">Jakarta Selatan</span></div>
                    <div className="flex justify-between"><span>Provinsi</span><span className="text-white">DKI Jakarta</span></div>
                    <div className="flex justify-between"><span>Kode Pos</span><span className="text-white">12160</span></div>
                    <div className="flex justify-between"><span>Negara</span><span className="text-white">Indonesia</span></div>
                    <div className="space-y-1">
                      <span>Catatan</span>
                      <p className="text-white text-[10px] leading-relaxed font-normal">
                        Pelanggan setia sejak 2023, langganan paket premium.
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-xs font-bold py-2.5 rounded-xl transition-all border-gray-800 mt-4">
                  <Edit2 size={13} />
                  <span>Edit Informasi</span>
                </button>
              </div>

              {/* Col 2 inside: Statistik Interaksi & Ringkasan */}
              <div className="space-y-6">
                
                {/* Statistik Interaksi Card */}
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Statistik Interaksi</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[var(--app-muted)]">
                    <div className="space-y-0.5">
                      <span>Total Pesan</span>
                      <p className="text-lg font-black text-[var(--app-text)] leading-none mt-1">128</p>
                      <p className="text-[9px] text-[var(--app-muted)]">Pesan</p>
                    </div>

                    <div className="space-y-0.5">
                      <span>Pesan Terkirim</span>
                      <p className="text-lg font-black text-[var(--app-text)] leading-none mt-1">68</p>
                      <p className="text-[9px] text-[var(--app-muted)]">Pesan</p>
                    </div>

                    <div className="space-y-0.5">
                      <span>Pesan Diterima</span>
                      <p className="text-lg font-black text-[var(--app-text)] leading-none mt-1">60</p>
                      <p className="text-[9px] text-[var(--app-muted)]">Pesan</p>
                    </div>

                    <div className="space-y-0.5">
                      <span>Response Rate</span>
                      <p className="text-lg font-black text-green-400 leading-none mt-1">92.6%</p>
                      <p className="text-[9px] text-green-500 font-bold">Sangat Baik</p>
                    </div>

                    <div className="space-y-0.5">
                      <span>Rata-rata Response Time</span>
                      <p className="text-lg font-black text-[var(--app-text)] leading-none mt-1">00:02:15</p>
                      <p className="text-[9px] text-[var(--app-muted)]">Menit</p>
                    </div>

                    <div className="space-y-0.5">
                      <span>Terakhir Interaksi</span>
                      <p className="text-[10px] text-white mt-1 leading-normal">22/10/2026 08:32 WIB</p>
                    </div>
                  </div>
                </div>

                {/* Ringkasan Card */}
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Ringkasan</h4>
                    
                    <div className="space-y-3 mt-3.5 text-xs font-semibold text-[var(--app-muted)]">
                      <div className="flex justify-between"><span>Total Transaksi</span><span className="text-[var(--app-text)] font-bold">{formatCurrency(8750000)}</span></div>
                      <div className="flex justify-between"><span>Total Pembayaran</span><span className="text-[var(--app-text)] font-bold">{formatCurrency(8750000)}</span></div>
                      <div className="flex justify-between"><span>Sisa Tagihan</span><span className="text-green-400 font-bold">Rp 0</span></div>
                      <div className="flex justify-between"><span>Invoice Terakhir</span><span className="text-white font-mono">INV/2026/07/0012</span></div>
                      <div className="flex justify-between"><span>Status Pembayaran</span><span className="text-green-400 font-bold">Lunas</span></div>
                      <div className="flex justify-between"><span>Paket Aktif</span><span className="text-white">Internet 100 Mbps</span></div>
                      <div className="flex justify-between"><span>Tanggal Aktif</span><span className="text-white">01/03/2026</span></div>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-xs font-bold py-2.5 rounded-xl transition-all border-gray-800 mt-4">
                    <FileText size={13} />
                    <span>Lihat Detail Transaksi</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Right Column: Activities, Notes, Media (3/12 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Aktivitas Terakhir */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aktivitas Terakhir</h3>
                <button className="text-[9px] bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] font-bold px-2 py-1 rounded">
                  Lihat Semua
                </button>
              </div>

              <div className="relative border-l border-[var(--app-border)] ml-2 pl-4 space-y-4 text-[9px] text-[var(--app-muted)] font-bold">
                {[
                  { title: 'Pesan diterima', desc: 'Terima kasih atas infonya', time: '22/10/2026 08:32', color: 'bg-green-500' },
                  { title: 'Pesan terkirim', desc: 'Invoice INV/2026/07/0012 telah dibayar.', time: '22/10/2026 08:30', color: 'bg-blue-500' },
                  { title: 'Pembayaran dikonfirmasi', desc: 'Invoice INV/2026/07/0012', time: '22/10/2026 08:28', color: 'bg-green-500' },
                  { title: 'Campaign dikirim', desc: 'Promo Juli - Diskon 20%', time: '22/10/2026 08:20', color: 'bg-purple-500' },
                  { title: 'Kontak dibuat', desc: 'Import dari file pelanggan_juli.csv', time: '22/10/2026 08:15', color: 'bg-gray-500' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[var(--app-border)] ${item.color}`}></span>
                    <span className="text-white block leading-none">{item.title}</span>
                    <span className="text-[var(--app-muted)] text-[8px] font-normal leading-tight mt-0.5 block">{item.desc}</span>
                    <span className="text-[var(--app-muted)] text-[8px] font-semibold mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Label Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Label</h3>
                <button className="text-[9px] bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] font-bold px-2 py-1 rounded">
                  Kelola Label
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-[9px] font-bold text-[var(--app-muted)]">
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded">Pelanggan</span>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded">VIP</span>
                <span className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white px-2 py-1 rounded">Pelanggan Premium</span>
                <button className="flex items-center gap-1 bg-[var(--app-bg)] border border-[var(--app-border)] hover:text-white px-2 py-1 rounded">
                  <Plus size={10} />
                  <span>Tambah Label</span>
                </button>
              </div>
            </div>

            {/* Catatan Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)] font-sans">Catatan</h3>
                <button className="text-[9px] bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] font-bold px-2.5 py-1 rounded">
                  Tambah Catatan
                </button>
              </div>

              <div className="space-y-3.5 text-[10px] font-bold text-[var(--app-muted)]">
                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-1.5">
                  <p className="text-white leading-normal">Keluhan kecepatan internet</p>
                  <p className="text-[8px] text-[var(--app-muted)] font-medium leading-relaxed">
                    Pelanggan mengeluhkan kecepatan internet di jam malam.
                  </p>
                  <p className="text-[var(--app-muted)] text-[8px] font-semibold">30/06/2026 22:15 - Agus Dwi Rianto</p>
                </div>

                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl space-y-1.5">
                  <p className="text-white leading-normal">Upgrade paket</p>
                  <p className="text-[8px] text-[var(--app-muted)] font-medium leading-relaxed">
                    Pelanggan tertarik upgrade ke paket 200 Mbps.
                  </p>
                  <p className="text-[var(--app-muted)] text-[8px] font-semibold">28/06/2026 10:30 - Rina Marlina</p>
                </div>
              </div>
            </div>

            {/* Media & Dokumen Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Media & Dokumen</h3>
                <button className="text-[9px] bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] font-bold px-2 py-1 rounded">
                  Lihat Semua
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 1, type: 'img', label: 'Struk' },
                  { id: 2, type: 'img', label: 'KTP' },
                  { id: 3, type: 'doc', label: 'PDF' },
                  { id: 4, type: 'doc', label: 'DOC' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg p-1.5 h-16 flex flex-col justify-between items-center relative group overflow-hidden cursor-pointer hover:border-blue-500/50">
                    {item.type === 'img' ? (
                      <div className="w-full h-full bg-[var(--app-bg)] flex items-center justify-center text-[8px] text-blue-400 font-bold uppercase rounded">
                        {item.label}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-[var(--app-bg)] flex flex-col justify-between items-center py-1 uppercase font-bold text-[8px] text-purple-400 rounded">
                        <FileText size={16} />
                        <span>{item.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3.5 rounded-xl flex items-center justify-between text-xs font-bold text-[var(--app-muted)]">
                <span className="flex items-center gap-2">
                  <Paperclip size={14} className="text-[var(--app-muted)]" />
                  <span>Total File Media</span>
                </span>
                <span className="text-[var(--app-text)] font-black text-sm">+12</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
