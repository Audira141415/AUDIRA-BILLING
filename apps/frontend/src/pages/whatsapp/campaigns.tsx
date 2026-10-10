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
  Trash2,
  Copy,
  ChevronDown
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  category: string;
  status: 'Aktif' | 'Terjadwal' | 'Draft' | 'Selesai' | 'Dijeda';
  date: string;
  contacts: string;
  sent: string;
  ratio: string;
}

const mockCampaignsList: CampaignItem[] = [
  { id: '1', name: 'Promo Juli Diskon 20%', category: 'Promo Paket Internet', status: 'Aktif', date: '01/07/2026 08:00', contacts: '12.548', sent: '12.120', ratio: '96.6%' },
  { id: '2', name: 'Tagihan Jatuh Tempo', category: 'Pengingat Pembayaran', status: 'Terjadwal', date: '02/07/2026 09:00', contacts: '8.652', sent: '-', ratio: '-' },
  { id: '3', name: 'Paket Baru Super Cepat', category: 'Informasi Paket', status: 'Draft', date: '-', contacts: '-', sent: '-', ratio: '-' },
  { id: '4', name: 'Maintenance Malam Ini', category: 'Informasi Layanan', status: 'Selesai', date: '30/06/2026 20:00', contacts: '5.210', sent: '4.987', ratio: '95.7%' },
  { id: '5', name: 'Ucapan Lebaran 1447 H', category: 'Ucapan Hari Raya', status: 'Selesai', date: '28/06/2026 10:00', contacts: '12.010', sent: '11.532', ratio: '96.0%' },
  { id: '6', name: 'Survey Kepuasan Pelanggan', category: 'Survey', status: 'Dijeda', date: '25/06/2026 14:00', contacts: '4.215', sent: '2.100', ratio: '85.2%' },
  { id: '7', name: 'Informasi Gangguan Layanan', category: 'Informasi Layanan', status: 'Selesai', date: '20/06/2026 16:30', contacts: '6.120', sent: '5.895', ratio: '96.3%' }
];

export default function WhatsappCampaignsPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState('1');
  const [activeSubTab, setActiveSubTab] = useState('ringkasan');

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Home</span>
              <span>&gt;</span>
              <span>WhatsApp</span>
              <span>&gt;</span>
              <span>Campaign</span>
              <span>&gt;</span>
              <span className="text-blue-400">Promo Juli Diskon 20%</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">WhatsApp</h1>
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

        {/* ─── Main Content Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Daftar Campaign (3/12 cols) */}
          <div className="lg:col-span-3 bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Daftar Campaign</h3>
              
              {/* Search campaign */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                <input 
                  type="text" 
                  placeholder="Cari campaign..."
                  className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-9 pr-8 py-2 rounded-xl text-white placeholder-gray-500 focus:outline-none"
                />
                <button className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white">
                  <Filter size={12} />
                </button>
              </div>

              {/* Sub-tabs inside list */}
              <div className="flex border-b border-[#131d35] text-[10px] font-bold text-gray-500 pb-1.5 overflow-x-auto gap-2">
                <button className="text-white border-b border-blue-500 pb-1 font-bold">Semua</button>
                <button className="hover:text-gray-300 pb-1">Aktif</button>
                <button className="hover:text-gray-300 pb-1">Terjadwal</button>
                <button className="hover:text-gray-300 pb-1">Selesai</button>
                <button className="hover:text-gray-300 pb-1">Draft</button>
                <button className="hover:text-gray-300 pb-1">Dijeda</button>
              </div>

              {/* Campaign list items */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {mockCampaignsList.map(item => {
                  const isSelected = selectedCampaignId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCampaignId(item.id)}
                      className={`flex justify-between items-start p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-[#0052cc]/10 border border-[#0052cc]' : 'bg-[#080d19] border border-[#131d35] hover:bg-[#121c38]/40'
                      }`}
                    >
                      <div className="flex gap-2.5">
                        <div className="p-2 bg-[#0052cc]/10 text-[#0052cc] rounded-lg mt-0.5">
                          <Send size={14} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                            <span className={`px-1.5 py-0.2 rounded text-[7px] font-black uppercase ${
                              item.status === 'Aktif' ? 'bg-green-500/10 text-green-400' :
                              item.status === 'Terjadwal' ? 'bg-orange-500/10 text-orange-400' :
                              item.status === 'Selesai' ? 'bg-blue-500/10 text-blue-400' :
                              item.status === 'Draft' ? 'bg-gray-500/10 text-gray-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[8px] text-gray-500 font-semibold">{item.category}</p>
                          <div className="flex gap-3 text-[8px] text-gray-400 pt-1 font-semibold">
                            <span>{item.contacts} Kontak</span>
                            <span>{item.sent} Terkirim</span>
                            <span>{item.ratio}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination inside sidebar */}
            <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-[#131d35]/60 pt-3">
              <span>Menampilkan 1 - 7 dari 7 data</span>
              <div className="flex items-center gap-1.5">
                <button className="p-1 border border-[#131d35] rounded text-gray-500 disabled:opacity-30" disabled>
                  <ChevronLeft size={10} />
                </button>
                <span className="text-white font-bold">1</span>
                <button className="p-1 border border-[#131d35] rounded text-gray-500 disabled:opacity-30" disabled>
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Center Main Area: Details (6/12 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Main Campaign Header card */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-450 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Send size={24} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white leading-none">Promo Juli Diskon 20%</h2>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.2 rounded text-[8px] font-black uppercase">
                      Aktif
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Promo Paket Internet</p>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    Kampanye promo diskon 20% untuk semua paket internet selama bulan Juli 2026.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-orange-450 text-orange-400 text-xs font-bold px-4 py-2 rounded-xl transition-all border-gray-800">
                  <Clock size={13} />
                  <span>Jeda Campaign</span>
                </button>
                
                <button className="flex items-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all">
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>

                <button className="flex items-center gap-1 bg-[#080d19] border border-[#131d35] rounded-xl hover:bg-[#121c38] text-xs font-bold px-3 py-2 text-gray-400">
                  <span>Lainnya</span>
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {/* Campaign metrics row (6 items) */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'Total Kontak', val: '12.548', sub: 'Total Kontak', color: 'text-white' },
                { name: 'Terkirim', val: '12.120', sub: '96.6%', color: 'text-white' },
                { name: 'Terkirim (Sukses)', val: '11.285', sub: '93.0%', color: 'text-white' },
                { name: 'Dibaca', val: '835', sub: '7.3%', color: 'text-white' },
                { name: 'Dibalas', val: '1.245', sub: '10.2%', color: 'text-white' },
                { name: 'Klik Link', val: '892', sub: '7.1%', color: 'text-white' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0b1329] border border-[#131d35] rounded-xl p-3 text-center">
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider leading-none">{item.name}</p>
                  <p className={`text-base font-black mt-2 leading-none ${item.color}`}>{item.val}</p>
                  <p className="text-[8px] text-gray-400 mt-1 font-semibold">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Profile Sub-tabs row */}
            <div className="flex border-b border-[#131d35] text-xs font-bold text-gray-500 pb-px overflow-x-auto gap-2">
              {[
                { id: 'ringkasan', label: 'Ringkasan' },
                { id: 'pesan', label: 'Pesan' },
                { id: 'audiens', label: 'Audiens' },
                { id: 'jadwal', label: 'Jadwal' },
                { id: 'pengaturan', label: 'Pengaturan' },
                { id: 'laporan', label: 'Laporan' },
                { id: 'log', label: 'Log Aktivitas' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${
                    activeSubTab === tab.id ? 'border-blue-500 text-white font-bold' : 'border-transparent hover:text-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-grid: Informasi Campaign & Performa Pengiriman */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Informasi Campaign */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Informasi Campaign</h4>
                
                <div className="space-y-3 mt-4 text-xs font-semibold text-gray-400">
                  <div className="flex justify-between"><span>Nama Campaign</span><span className="text-white">Promo Juli Diskon 20%</span></div>
                  <div className="flex justify-between"><span>Kategori</span><span className="text-white">Promo Paket Internet</span></div>
                  <div className="flex justify-between"><span>Status</span><span className="text-green-400 font-bold">Aktif</span></div>
                  <div className="flex justify-between"><span>Dibuat Oleh</span><span className="text-white">Agus Dwi Rianto</span></div>
                  <div className="flex justify-between"><span>Dibuat Pada</span><span className="text-white font-mono">29/06/2026 10:15</span></div>
                  <div className="flex justify-between"><span>Mulai Kirim</span><span className="text-white font-mono">01/07/2026 08:00</span></div>
                  <div className="flex justify-between"><span>Selesai Kirim</span><span className="text-white font-mono">01/07/2026 10:30</span></div>
                  <div className="flex justify-between"><span>Metode Kirim</span><span className="text-white">Gateway Cloud API</span></div>
                  <div className="flex justify-between"><span>Kecepatan Kirim</span><span className="text-white">Medium (20 msg/detik)</span></div>
                  <div className="flex justify-between items-center">
                    <span>Label</span>
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.2 rounded text-[9px] font-bold">Promo</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span>Catatan</span>
                    <p className="text-white text-[10px] leading-relaxed font-normal">
                      Diskon 20% untuk semua paket internet selama bulan Juli 2026.
                    </p>
                  </div>
                </div>
              </div>

              {/* Col 2 inside: Performa Pengiriman Bar Chart & Performa Detail */}
              <div className="space-y-6">
                
                {/* Performa Pengiriman Bar Chart */}
                <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Performa Pengiriman</h4>
                  
                  <div className="h-32 w-full mt-2">
                    <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#131d35" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#131d35" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#131d35" strokeDasharray="3 3" />
                      
                      <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">15K</text>
                      <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">9K</text>
                      <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">3K</text>
                      
                      {/* Bars */}
                      <rect x="35" y="100 - 80" width="10" height="80" fill="#3b82f6" rx="0.5" />
                      <rect x="75" y="100 - 77" width="10" height="77" fill="#10b981" rx="0.5" />
                      <rect x="115" y="100 - 72" width="10" height="72" fill="#06b6d4" rx="0.5" />
                      <rect x="155" y="100 - 20" width="10" height="20" fill="#f59e0b" rx="0.5" />
                      <rect x="195" y="100 - 30" width="10" height="30" fill="#a855f7" rx="0.5" />
                      <rect x="235" y="100 - 25" width="10" height="25" fill="#6366f1" rx="0.5" />
                      
                      <text x="30" y="96" fill="#4a5568" fontSize="6" fontWeight="bold">Kontak</text>
                      <text x="70" y="96" fill="#4a5568" fontSize="6" fontWeight="bold">Terkirim</text>
                      <text x="110" y="96" fill="#4a5568" fontSize="6" fontWeight="bold">Sukses</text>
                      <text x="150" y="96" fill="#4a5568" fontSize="6" fontWeight="bold">Dibaca</text>
                      <text x="190" y="96" fill="#4a5568" fontSize="6" fontWeight="bold">Dibalas</text>
                      <text x="230" y="96" fill="#4a5568" fontSize="6" fontWeight="bold">Klik Link</text>
                    </svg>
                  </div>
                </div>

                {/* Performa Detail Progress bars */}
                <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3.5 text-xs font-semibold text-gray-400">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Performa Detail</h4>
                  
                  {[
                    { name: 'Terkirim', val: '12.120 (96.6%)', w: '96.6%', color: 'bg-blue-500' },
                    { name: 'Terkirim (Sukses)', val: '11.285 (93.0%)', w: '93.0%', color: 'bg-green-500' },
                    { name: 'Dibaca', val: '835 (7.3%)', w: '7.3%', color: 'bg-yellow-500' },
                    { name: 'Dibalas', val: '1.245 (10.2%)', w: '10.2%', color: 'bg-purple-500' },
                    { name: 'Klik Link', val: '892 (7.1%)', w: '7.1%', color: 'bg-indigo-500' },
                    { name: 'Gagal Kirim', val: '428 (3.4%)', w: '3.4%', color: 'bg-red-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{item.name}</span>
                        <span className="text-white font-bold">{item.val}</span>
                      </div>
                      <div className="w-full bg-[#101935] h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.w }}></div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Bottom Row widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Jadwal Pengiriman */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Jadwal Pengiriman</h4>
                
                <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="flex justify-between"><span>Mulai Kirim</span><span className="text-white font-mono">01/07/2026 08:00</span></div>
                  <div className="flex justify-between"><span>Selesai Kirim</span><span className="text-white font-mono">01/07/2026 10:30</span></div>
                  <div className="flex justify-between"><span>Durasi Pengiriman</span><span className="text-white">2 Jam 30 Menit</span></div>
                  <div className="flex justify-between"><span>Waktu Terakhir Kirim</span><span className="text-white font-mono">01/07/2026 10:28</span></div>
                  <div className="flex justify-between"><span>Kecepatan Kirim</span><span className="text-white">20 pesan/detik</span></div>
                </div>
              </div>

              {/* Gateway & Pengiriman */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Gateway & Pengiriman</h4>
                  
                  <div className="space-y-3 mt-4 text-xs font-semibold text-gray-400">
                    <div className="flex justify-between"><span>Gateway</span><span className="text-white">Cloud API (Meta Official)</span></div>
                    <div className="flex justify-between"><span>Nomor Pengirim</span><span className="text-white font-mono">6281234567890</span></div>
                    <div className="flex justify-between"><span>Kualitas</span><span className="text-green-400 font-bold">Sangat Baik</span></div>
                    <div className="flex justify-between"><span>Sisa Kuota</span><span className="text-white">85.432 pesan</span></div>
                    <div className="flex justify-between"><span>Biaya Estimasi</span><span className="text-white font-bold">Rp 156.480</span></div>
                  </div>
                </div>

                <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-3 border-t border-[#131d35]/60 block mt-2">
                  Lihat Log Aktivitas
                </button>
              </div>

              {/* Segmentasi Audiens */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Segmentasi Audiens</h4>
                  
                  <div className="space-y-3 mt-4 text-xs font-semibold text-gray-400">
                    <div className="flex justify-between"><span>Status Pelanggan</span><span className="text-white">Aktif</span></div>
                    <div className="flex justify-between"><span>Paket</span><span className="text-white">Semua Paket</span></div>
                    <div className="flex justify-between"><span>Wilayah</span><span className="text-white font-mono">Jabodetabek</span></div>
                    <div className="flex justify-between"><span>Tag</span><span className="text-white">Pelanggan Aktif</span></div>
                    <div className="flex justify-between"><span>Terakhir Chat</span><span className="text-white">30 Hari Terakhir</span></div>
                  </div>
                </div>

                <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-3 border-t border-[#131d35]/60 block mt-2">
                  Lihat Semua Filter
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Activities, Notes, Media (3/12 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Pesan Preview */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Pesan Preview</h3>
              
              {/* WA bubble */}
              <div className="bg-[#d9fdd3] text-gray-800 rounded-xl p-3.5 text-[10px] space-y-2 border border-green-200/50 shadow relative">
                <p className="font-bold">📢 PROMO SPESIAL JULI 📢</p>
                <p>
                  Dapatkan diskon 20% untuk semua paket internet hanya di bulan Juli 2026!
                </p>
                <p>Nikmati internet super cepat dengan harga lebih hemat.</p>
                <p className="font-bold">📅 Promo berlaku sampai 31 Juli 2026</p>
                <p>Info lebih lanjut hubungi kami ya!</p>
                <p className="font-bold">Terima kasih 😊</p>
                <div className="text-[8px] text-gray-400 text-right flex items-center justify-end gap-1 pt-1 font-semibold">
                  <span>08:30</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-gray-300 text-xs font-bold py-2.5 rounded-xl transition-all border-gray-800">
                <span>Lihat Template Lengkap</span>
              </button>
            </div>

            {/* Target Audiens Card */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Target Audiens</h3>
                
                <div className="space-y-3.5 mt-3.5 text-xs font-semibold text-gray-400">
                  <div className="flex justify-between"><span>Total Kontak</span><span className="text-white font-bold">12.548</span></div>
                  <div className="flex justify-between"><span>Filter Digunakan</span><span className="text-white">3 Filter</span></div>
                  <div className="flex justify-between"><span>Estimasi Terkirim</span><span className="text-green-400 font-bold">± 12.120</span></div>
                </div>
              </div>

              <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-3 border-t border-[#131d35]/60 block mt-2">
                Lihat Detail Audiens
              </button>
            </div>

            {/* Aksi Cepat Card */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h3>
              
              <div className="space-y-3.5 text-xs font-bold text-gray-400">
                <button className="w-full flex items-center gap-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <Copy size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold">Duplicate Campaign</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Buat campaign baru</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <Download size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold">Export Laporan</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Export data campaign</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                  <FileText size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold">Lihat Laporan Lengkap</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Analisa performa detail</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-red-650 bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] border-none">
                  <Trash2 size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold">Hapus Campaign</p>
                    <p className="text-[8px] text-red-200 font-normal mt-0.5">Hapus campaign ini</p>
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
