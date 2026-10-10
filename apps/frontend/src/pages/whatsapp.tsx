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
  Code
} from 'lucide-react';

interface ContactRow {
  name: string;
  phone: string;
  label: 'Pelanggan' | 'Prospek' | 'VIP';
  activeDate: string;
}

const mockContacts: ContactRow[] = [
  { name: 'Budi Santoso', phone: '6281234567890', label: 'Pelanggan', activeDate: '01/07/2026 08:28' },
  { name: 'Siti Aminah', phone: '6289876543211', label: 'Prospek', activeDate: '01/07/2026 08:20' },
  { name: 'Andi Pratama', phone: '6281111111112', label: 'Pelanggan', activeDate: '01/07/2026 08:10' },
  { name: 'Dewi Lestari', phone: '6282222222222', label: 'VIP', activeDate: '01/07/2026 08:05' },
  { name: 'Fajar Nugroho', phone: '6283333333333', label: 'Pelanggan', activeDate: '30/06/2026 22:15' }
];

interface CampaignRow {
  name: string;
  status: 'Selesai' | 'Draft' | 'Terjadwal';
  sent: string;
  responseRate: string;
}

const mockCampaigns: CampaignRow[] = [
  { name: 'Promo Juli', status: 'Selesai', sent: '5.231', responseRate: '72.8%' },
  { name: 'Tagihan Jatuh Tempo', status: 'Selesai', sent: '3.845', responseRate: '65.2%' },
  { name: 'Ucapan Lebaran', status: 'Selesai', sent: '8.125', responseRate: '78.1%' },
  { name: 'Paket Baru', status: 'Draft', sent: '-', responseRate: '-' },
  { name: 'Maintenance Notice', status: 'Terjadwal', sent: '-', responseRate: '-' }
];

interface TemplateRow {
  name: string;
  category: string;
  status: 'Disetujui' | 'Menunggu' | 'Ditolak';
}

const mockTemplates: TemplateRow[] = [
  { name: 'Tagihan_Jatuh_Tempo', category: 'Billing', status: 'Disetujui' },
  { name: 'Pembayaran_Berhasil', category: 'Transaksi', status: 'Disetujui' },
  { name: 'Selamat_Datang', category: 'Informasi', status: 'Disetujui' },
  { name: 'Promo_Paket_Baru', category: 'Marketing', status: 'Menunggu' },
  { name: 'Maintenance_Notice', category: 'Informasi', status: 'Ditolak' }
];

export default function WhatsappDashboardPage() {
  const [selectedRange, setSelectedRange] = useState('30 Hari');

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
              <span className="text-blue-400">Dashboard</span>
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

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Card 1: Total Kontak */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Kontak</p>
              <p className="text-2xl font-black text-white mt-0.5">12.548</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">+8.2% dari bulan lalu</p>
            </div>
          </div>

          {/* Card 2: Kontak Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kontak Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">9.842</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">78.5% dari total</p>
            </div>
          </div>

          {/* Card 3: Pesan Terkirim */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pesan Terkirim</p>
              <p className="text-2xl font-black text-white mt-0.5">45.231</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">+12.6% dari bulan lalu</p>
            </div>
          </div>

          {/* Card 4: Pesan Diterima */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pesan Diterima</p>
              <p className="text-2xl font-black text-white mt-0.5">38.764</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">+9.4% dari bulan lalu</p>
            </div>
          </div>

          {/* Card 5: Terkirim Berhasil */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Terkirim Berhasil</p>
              <p className="text-2xl font-black text-white mt-0.5">42.512</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">(94.0%) Delivery rate</p>
            </div>
          </div>

          {/* Card 6: Response Rate */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Response Rate</p>
              <p className="text-2xl font-black text-white mt-0.5">71.3%</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">+6.7% dari bulan lalu</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Charts, Channels, Lists */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Chart & WhatsApp Channels row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Grafik Aktivitas */}
              <div className="md:col-span-8 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Grafik Aktivitas (30 Hari Terakhir)</h4>
                  <select className="bg-[#080d19] border border-[#131d35] text-[10px] py-1 px-2.5 rounded-lg text-gray-300 focus:outline-none">
                    <option>30 Hari Terakhir</option>
                  </select>
                </div>

                <div className="h-44 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#131d35" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#131d35" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#131d35" strokeDasharray="3 3" />
                    
                    <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">1.500</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">900</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">300</text>
                    
                    {/* Lines */}
                    <path d="M20,68 L60,50 L100,55 L140,40 L180,48 L220,30 L260,25" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <path d="M20,80 L60,82 L100,78 L140,85 L180,72 L220,68 L260,65" fill="none" stroke="#10b981" strokeWidth="1.5" />
                    <path d="M20,95 L60,92 L100,95 L140,90 L180,92 L220,89 L260,88" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    <path d="M20,98 L60,99 L100,98 L140,99 L180,98 L220,99 L260,98" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex justify-center gap-3.5 text-[8px] text-gray-500 font-bold uppercase pt-1">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-blue-500 inline-block"></span>Terkirim</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-green-500 inline-block"></span>Diterima</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span>Dibaca</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>Gagal</span>
                </div>
              </div>

              {/* Channel WhatsApp */}
              <div className="md:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Channel WhatsApp</h4>
                    <button className="text-[9px] bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white font-bold px-2 py-1 rounded">
                      Kelola Channel
                    </button>
                  </div>
                  <p className="text-[10px] text-green-400 font-bold mt-1">5 / 5 Aktif</p>

                  <div className="space-y-3.5 mt-4 text-[10px] font-bold text-gray-300">
                    {[
                      { num: '6281234567890', desc: 'Gateway Utama', status: 'Terhubung', active: true, tx: '12.548', quality: '98.5%' },
                      { num: '6289876543210', desc: 'Gateway Backup', status: 'Terhubung', active: true, tx: '8.352', quality: '96.2%' },
                      { num: '6281111111111', desc: 'Marketing', status: 'Terhubung', active: true, tx: '6.125', quality: '95.7%' },
                      { num: '6282222222222', desc: 'Sales', status: 'Terhubung', active: true, tx: '3.245', quality: '97.1%' },
                      { num: '6283333333333', desc: 'Customer Service', status: 'Reconnecting', active: false, tx: '1.852', quality: '89.3%' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-0.5">
                        <div className="space-y-0.5">
                          <p className="text-white leading-none font-mono">{item.num}</p>
                          <p className="text-[8px] text-gray-500 font-semibold">{item.desc}</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-white leading-none">{item.tx}</p>
                            <p className="text-[7px] text-gray-500 font-semibold">{item.quality} Quality</p>
                          </div>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                            item.active ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Tables Row: Kontak Terbaru, Campaign, Templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Daftar Kontak Terbaru */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Kontak Terbaru</h4>
                    <button className="text-[9px] text-blue-500 font-bold hover:underline">Lihat Semua</button>
                  </div>

                  <div className="overflow-x-auto mt-4 border border-[#131d35] rounded-xl">
                    <table className="w-full text-left border-collapse text-[9px] text-gray-300">
                      <thead>
                        <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 font-bold uppercase">
                          <th className="p-2">NAMA</th>
                          <th className="p-2">NOMOR</th>
                          <th className="p-2">LABEL</th>
                          <th className="p-2">TERAKTIF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#131d35]">
                        {mockContacts.map((d, idx) => (
                          <tr key={idx} className="hover:bg-[#121c38]/40">
                            <td className="p-2 font-bold text-white">{d.name}</td>
                            <td className="p-2 font-mono">{d.phone}</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                                d.label === 'Pelanggan' ? 'bg-green-500/10 text-green-400' :
                                d.label === 'VIP' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {d.label}
                              </span>
                            </td>
                            <td className="p-2 text-gray-500 font-medium">{d.activeDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Campaign Terbaru */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Campaign Terbaru</h4>
                    <button className="text-[9px] text-blue-500 font-bold hover:underline">Lihat Semua</button>
                  </div>

                  <div className="overflow-x-auto mt-4 border border-[#131d35] rounded-xl">
                    <table className="w-full text-left border-collapse text-[9px] text-gray-300">
                      <thead>
                        <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 font-bold uppercase">
                          <th className="p-2">NAMA CAMPAIGN</th>
                          <th className="p-2">STATUS</th>
                          <th className="p-2">TERKIRIM</th>
                          <th className="p-2">RESPONSE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#131d35]">
                        {mockCampaigns.map((d, idx) => (
                          <tr key={idx} className="hover:bg-[#121c38]/40">
                            <td className="p-2 font-bold text-white">{d.name}</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                                d.status === 'Selesai' ? 'bg-green-500/10 text-green-400' :
                                d.status === 'Draft' ? 'bg-gray-500/10 text-gray-400' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {d.status}
                              </span>
                            </td>
                            <td className="p-2 text-white font-bold">{d.sent}</td>
                            <td className="p-2 text-white font-bold">{d.responseRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Template Pesan */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Template Pesan</h4>
                    <button className="text-[9px] text-blue-500 font-bold hover:underline">Lihat Semua</button>
                  </div>

                  <div className="overflow-x-auto mt-4 border border-[#131d35] rounded-xl">
                    <table className="w-full text-left border-collapse text-[9px] text-gray-300">
                      <thead>
                        <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 font-bold uppercase">
                          <th className="p-2">NAMA TEMPLATE</th>
                          <th className="p-2">KATEGORI</th>
                          <th className="p-2">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#131d35]">
                        {mockTemplates.map((d, idx) => (
                          <tr key={idx} className="hover:bg-[#121c38]/40">
                            <td className="p-2 font-bold text-white font-mono">{d.name}</td>
                            <td className="p-2 text-gray-400 font-semibold">{d.category}</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                                d.status === 'Disetujui' ? 'bg-green-500/10 text-green-400' :
                                d.status === 'Menunggu' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            {/* Fitur WhatsApp Grid */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Fitur WhatsApp</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                {[
                  { name: 'Kontak', desc: 'Kelola semua kontak pelanggan', icon: Users, color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                  { name: 'Campaign', desc: 'Kirim pesan ke banyak kontak', icon: Send, color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
                  { name: 'Template Pesan', desc: 'Kelola template pesan WhatsApp', icon: FileText, color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
                  { name: 'Quick Reply', desc: 'Balasan cepat untuk chat', icon: RefreshCw, color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
                  { name: 'Chat', desc: 'Kelola semua percakapan', icon: MessageSquare, color: 'bg-blue-505 bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                  { name: 'Auto Reply', desc: 'Balasan otomatis WhatsApp', icon: Sliders, color: 'bg-yellow-500/10 text-yellow-550 text-yellow-500 border border-yellow-500/20' },
                  { name: 'Label', desc: 'Kelompokkan kontak dengan label', icon: Settings, color: 'bg-blue-600/10 text-blue-400 border border-blue-600/20' },
                  { name: 'Laporan', desc: 'Analisa & laporan WhatsApp', icon: FileText, color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
                  { name: 'Pengaturan', desc: 'Pengaturan WhatsApp', icon: Settings, color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
                  { name: 'Webhook', desc: 'Integrasi dengan sistem lain', icon: Code, color: 'bg-red-500/10 text-red-400 border border-red-500/20' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={idx} 
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 transform hover:scale-[1.02] ${item.color}`}
                    >
                      <Icon size={16} className="mb-2" />
                      <p className="text-[10px] font-bold leading-tight text-white">{item.name}</p>
                      <p className="text-[8px] text-gray-500 font-normal mt-1 leading-tight">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Aktivitas Terbaru */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terbaru</h3>
                <button className="text-[9px] bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white font-bold px-2 py-1 rounded">
                  Lihat Semua
                </button>
              </div>

              <div className="relative border-l border-[#131d35] ml-2 pl-4 space-y-4 text-[9px] text-gray-500 font-bold">
                {[
                  { title: 'Campaign "Promo Juli" dikirim ke 5.231 kontak', time: '01/07/2026 08:32 WIB', color: 'bg-blue-500' },
                  { title: 'Pesan dari Budi Santoso (6281234567890)', time: '01/07/2026 08:28 WIB', color: 'bg-green-500' },
                  { title: 'Template "Tagihan_Jatuh_Tempo" disetujui', time: '01/07/2026 08:20 WIB', color: 'bg-green-500' },
                  { title: 'Auto Reply "Selamat Datang" dijalankan', time: '01/07/2026 08:15 WIB', color: 'bg-purple-500' },
                  { title: 'Kontak baru ditambahkan: Andi Pratama', time: '01/07/2026 08:10 WIB', color: 'bg-blue-500' },
                  { title: 'Pesan gagal dikirim ke 12 kontak', time: '01/07/2026 08:05 WIB', color: 'bg-red-500' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[#070c19] ${item.color}`}></span>
                    <span className="text-white block leading-normal font-medium">{item.title}</span>
                    <span className="text-gray-500 text-[8px] font-semibold mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panduan WhatsApp */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Panduan WhatsApp</h3>
              
              <div className="space-y-4 text-[10px] font-bold text-gray-400">
                {[
                  { step: 1, title: 'Hubungkan Channel', desc: 'Hubungkan nomor WhatsApp Business Anda.' },
                  { step: 2, title: 'Import Kontak', desc: 'Import kontak pelanggan dari sistem.' },
                  { step: 3, title: 'Buat Template', desc: 'Buat dan ajukan template pesan.' },
                  { step: 4, title: 'Kirim Campaign', desc: 'Kirim pesan ke kontak atau grup.' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#101935] border border-[#1e2e58] text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-white font-bold leading-tight">{item.title}</p>
                      <p className="text-[9px] text-gray-500 font-medium leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[#131d35] block">
                Lihat Dokumentasi Lengkap &rarr;
              </button>
            </div>

            {/* Informasi Penting */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Informasi Penting</h3>
              
              <div className="text-xs text-gray-400 font-semibold space-y-3 pb-3 border-b border-[#131d35]">
                <div className="flex justify-between">
                  <span>Batas Pesan Harian</span>
                  <span className="text-white font-bold">1.000 / 10.000 pesan</span>
                </div>
                <div className="flex justify-between">
                  <span>Sisa Kuota Bulan Ini</span>
                  <span className="text-white font-bold">154.231 pesan</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Score Rata-rata</span>
                  <span className="text-green-400 font-bold">95.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>Status Akun</span>
                  <span className="text-green-400 font-bold">Aktif</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all border-none">
                <MessageSquare size={13} />
                <span>Cek Status WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
