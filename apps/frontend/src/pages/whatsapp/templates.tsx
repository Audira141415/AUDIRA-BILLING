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
  List
} from 'lucide-react';

interface TemplateItem {
  id: string;
  name: string;
  varsText: string;
  category: 'Promosi' | 'Billing' | 'Transaksi' | 'Informasi' | 'Ucapan' | 'Survey';
  lang: string;
  status: 'Disetujui' | 'Menunggu' | 'Ditolak';
  updatedAt: string;
  updatedBy: string;
}

const mockTemplatesList: TemplateItem[] = [
  { id: '1', name: 'Promo Juli Diskon 20%', varsText: 'Dapatkan diskon 20% untuk semua paket internet hanya di bulan Juli 2026!... Variabel: {{1}}, {{2}}, {{3}}', category: 'Promosi', lang: 'Indonesia', status: 'Disetujui', updatedAt: '01/07/2026 08:32', updatedBy: 'Agus Dwi Rianto' },
  { id: '2', name: 'Tagihan Jatuh Tempo', varsText: 'Halo {{1}}, tagihan Anda sebesar Rp {{2}} akan jatuh tempo pada {{3}}... Variabel: {{1}}, {{2}}, {{3}}', category: 'Billing', lang: 'Indonesia', status: 'Disetujui', updatedAt: '01/07/2026 07:45', updatedBy: 'Agus Dwi Rianto' },
  { id: '3', name: 'Pembayaran Berhasil', varsText: 'Terima kasih {{1}}, pembayaran sebesar Rp {{2}} telah kami terima... Variabel: {{1}}, {{2}}', category: 'Transaksi', lang: 'Indonesia', status: 'Disetujui', updatedAt: '30/06/2026 21:15', updatedBy: 'Rina Marlina' },
  { id: '4', name: 'Paket Baru Super Cepat', varsText: 'Selamat {{1}}, paket {{2}} Anda telah aktif. Nikmati kecepatan internet... Variabel: {{1}}, {{2}}, {{3}}', category: 'Informasi', lang: 'Indonesia', status: 'Disetujui', updatedAt: '30/06/2026 19:10', updatedBy: 'Rina Marlina' },
  { id: '5', name: 'Maintenance Malam Ini', varsText: 'Informasi maintenance sistem akan dilakukan pada {{1}} pukul {{2}} - {{3}}... Variabel: {{1}}, {{2}}, {{3}}, {{4}}', category: 'Informasi', lang: 'Indonesia', status: 'Menunggu', updatedAt: '29/06/2026 16:20', updatedBy: 'Indah Permata' },
  { id: '6', name: 'Ucapan Lebaran 1447 H', varsText: 'Selamat Hari Raya Idul Fitri 1447 H {{1}}. Mohon maaf lahir dan batin... Variabel: {{1}}', category: 'Ucapan', lang: 'Indonesia', status: 'Disetujui', updatedAt: '28/06/2026 10:10', updatedBy: 'Indah Permata' },
  { id: '7', name: 'Survey Kepuasan Pelanggan', varsText: 'Halo {{1}}, bagaimana pengalaman Anda menggunakan layanan kami?... Variabel: {{1}}, {{2}}, {{3}}', category: 'Survey', lang: 'Indonesia', status: 'Disetujui', updatedAt: '27/06/2026 14:00', updatedBy: 'Agus Dwi Rianto' },
  { id: '8', name: 'Informasi Gangguan Layanan', varsText: 'Mohon maaf {{1}}, saat ini terjadi gangguan layanan pada area {{2}}... Variabel: {{1}}, {{2}}, {{3}}', category: 'Informasi', lang: 'Indonesia', status: 'Ditolak', updatedAt: '26/06/2026 11:20', updatedBy: 'WhatsApp System' }
];

export default function WhatsappTemplatesPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('1');
  const [activeSubTab, setActiveSubTab] = useState('semua');

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
              <span className="text-blue-400">Template Pesan</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Template Pesan</h1>
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

        {/* ─── Description & Global Action Buttons ───────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Template Pesan</p>
            <p className="text-[10px] text-gray-400 leading-normal">
              Kelola template pesan WhatsApp untuk keperluan komunikasi bisnis Anda.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all border-none">
              <PlusCircle size={14} />
              <span>Buat Template Baru</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all border-gray-800">
              <Download size={14} className="text-gray-400" />
              <span>Import Template</span>
            </button>
          </div>
        </div>

        {/* ─── Sub-tabs row ──────────────────────────────────────────────── */}
        <div className="flex border-b border-[#131d35] text-xs font-bold text-gray-500 pb-px overflow-x-auto gap-2">
          {[
            { id: 'semua', label: 'Semua Template' },
            { id: 'disetujui', label: 'Disetujui' },
            { id: 'menunggu', label: 'Menunggu Persetujuan' },
            { id: 'ditolak', label: 'Ditolak' }
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

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Template</p>
              <p className="text-2xl font-black text-white mt-0.5">48</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Semua template</p>
            </div>
          </div>

          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Disetujui</p>
              <p className="text-2xl font-black text-white mt-0.5">32</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">66.7% dari total</p>
            </div>
          </div>

          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Menunggu</p>
              <p className="text-2xl font-black text-white mt-0.5">10</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">20.8% dari total</p>
            </div>
          </div>

          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ditolak</p>
              <p className="text-2xl font-black text-white mt-0.5">6</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">12.5% dari total</p>
            </div>
          </div>

          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-405 border border-blue-500/20 rounded-xl">
              <Send size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Digunakan</p>
              <p className="text-2xl font-black text-white mt-0.5">1.248</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Bulan ini</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari template..."
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Kategori</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Bahasa</option>
            </select>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3 rounded-xl text-gray-300 focus:outline-none">
              <option>Urutan: Terbaru</option>
            </select>
            <div className="flex bg-[#080d19] border border-[#131d35] rounded-xl p-1 gap-1">
              <button className="p-1.5 text-gray-400 hover:text-white rounded-lg"><LayoutGrid size={14} /></button>
              <button className="p-1.5 bg-[#101935] text-white rounded-lg"><List size={14} /></button>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Template List (6/12 cols) */}
          <div className="lg:col-span-6 bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">TEMPLATE</th>
                    <th className="p-4 w-24 text-center">KATEGORI</th>
                    <th className="p-4 w-20 text-center">BAHASA</th>
                    <th className="p-4 w-24 text-center">STATUS</th>
                    <th className="p-4">TERAKHIR DIPERBARUI</th>
                    <th className="p-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131d35]">
                  {mockTemplatesList.map(item => {
                    const isSelected = selectedTemplateId === item.id;
                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedTemplateId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#0052cc]/10 hover:bg-[#0052cc]/15' : 'hover:bg-[#121c38]/40'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-lg mt-0.5">
                              <MessageSquare size={14} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-white leading-tight">{item.name}</p>
                              <p className="text-[8px] text-gray-500 line-clamp-1 max-w-[240px] font-semibold">{item.varsText}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                            item.category === 'Promosi' ? 'bg-purple-500/10 text-purple-400' :
                            item.category === 'Billing' ? 'bg-blue-500/10 text-blue-400' :
                            item.category === 'Transaksi' ? 'bg-green-500/10 text-green-400' :
                            item.category === 'Ucapan' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 text-center font-medium text-gray-400">{item.lang}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                            item.status === 'Disetujui' ? 'bg-green-500/10 text-green-400' :
                            item.status === 'Menunggu' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-white leading-none font-semibold">{item.updatedAt}</p>
                          <span className="text-[8px] text-gray-505 text-gray-500 font-semibold mt-1 block">{item.updatedBy}</span>
                        </td>
                        <td className="p-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                              <Eye size={13} />
                            </button>
                            <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                              <Edit2 size={13} />
                            </button>
                            <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
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

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[#131d35] bg-[#0b1329]/60">
              <span className="text-xs text-gray-500">
                Menampilkan <span className="font-semibold text-white">1 - 8</span> dari <span className="font-semibold text-white">48</span> data
              </span>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button disabled className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">2</button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">3</button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">4</button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">5</button>
                  <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">6</button>
                  <button className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400">
                    <ChevronRight size={14} />
                  </button>
                </div>

                <select className="bg-[#080d19] border border-[#131d35] text-xs py-1.5 px-3 rounded-lg text-gray-300 focus:outline-none">
                  <option value={10}>10 / halaman</option>
                </select>
              </div>
            </div>
          </div>

          {/* Center Column: Detail Template & Variabel (3/12 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Detail Template Header */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#131d35]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Detail Template</h3>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                  Disetujui
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-lg">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Promo Juli Diskon 20%</h4>
                    <p className="text-[8px] text-gray-500 font-mono mt-0.5">ID: promo_juli_20</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[#080d19] border border-[#131d35] p-2.5 rounded-xl text-[10px]">
                  <span className="font-mono text-gray-500">ID Template: 123456789012345</span>
                  <button className="text-blue-500 hover:text-blue-400"><Copy size={12} /></button>
                </div>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[10px]">
                  <div><span className="text-gray-500 font-bold uppercase block text-[8px]">Kategori</span><span className="text-white">Promosi</span></div>
                  <div><span className="text-gray-500 font-bold uppercase block text-[8px]">Bahasa</span><span className="text-white">Indonesia</span></div>
                  <div><span className="text-gray-500 font-bold uppercase block text-[8px]">Status</span><span className="text-green-450 text-green-400 font-bold">Disetujui</span></div>
                  <div><span className="text-gray-500 font-bold uppercase block text-[8px]">Dibuat Oleh</span><span className="text-white">Agus Dwi Rianto</span></div>
                  <div><span className="text-gray-500 font-bold uppercase block text-[8px]">Dibuat Pada</span><span className="text-white font-mono">01/07/2026 08:00</span></div>
                  <div><span className="text-gray-500 font-bold uppercase block text-[8px]">Terakhir Diperbarui</span><span className="text-white font-mono">01/07/2026 08:32</span></div>
                </div>

                <div className="pt-2 border-t border-[#131d35]/65">
                  <span className="text-[8px] text-gray-500 font-bold uppercase block mb-1">Kategori Target</span>
                  <span className="bg-[#101935] border border-[#1e2e58] text-white px-2 py-0.5 rounded text-[9px] font-bold">Pelanggan</span>
                </div>
              </div>
            </div>

            {/* WA bubble preview inside center col */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
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
            </div>

            {/* Variabel Template */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Variabel Template</h3>
                
                <div className="space-y-2 mt-4 text-[10px] font-mono">
                  <div className="flex justify-between items-center bg-[#080d19] border border-[#131d35] p-2.5 rounded-xl">
                    <span className="text-blue-400 font-bold">{"{{1}}"}</span>
                    <span className="text-white">Nama Pelanggan</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#080d19] border border-[#131d35] p-2.5 rounded-xl">
                    <span className="text-blue-400 font-bold">{"{{2}}"}</span>
                    <span className="text-white">Nominal / Harga</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#080d19] border border-[#131d35] p-2.5 rounded-xl">
                    <span className="text-blue-400 font-bold">{"{{3}}"}</span>
                    <span className="text-white">Tanggal / Deadline</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#080d19] border border-[#131d35] p-2.5 rounded-xl">
                    <span className="text-blue-400 font-bold">{"{{4}}"}</span>
                    <span className="text-white">Waktu</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-gray-300 text-xs font-bold py-2.5 rounded-xl transition-all border-gray-800 mt-4">
                <span>Lihat Contoh Variabel</span>
              </button>
            </div>

          </div>

          {/* Right Column: Preview, Aksi, Tips (3/12 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Preview Template header widget */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#131d35]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Preview Template</h3>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                  Disetujui
                </span>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-lg">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Promo Juli Diskon 20%</h4>
                    <p className="text-[8px] text-gray-500 font-mono mt-0.5">ID: promo_juli_20</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[#080d19] border border-[#131d35] p-2.5 rounded-xl text-[10px]">
                  <span className="font-mono text-gray-500">ID Template: 123456789012345</span>
                  <button className="text-blue-500 hover:text-blue-400"><Copy size={12} /></button>
                </div>

                <div className="space-y-3 text-[10px]">
                  <div className="flex justify-between"><span>Kategori</span><span className="text-white">Promosi</span></div>
                  <div className="flex justify-between"><span>Bahasa</span><span className="text-white">Indonesia</span></div>
                  <div className="flex justify-between"><span>Status</span><span className="text-green-450 text-green-400 font-bold">Disetujui</span></div>
                  <div className="flex justify-between"><span>Dibuat Oleh</span><span className="text-white">Agus Dwi Rianto</span></div>
                  <div className="flex justify-between"><span>Dibuat Pada</span><span className="text-white font-mono">01/07/2026 08:00</span></div>
                  <div className="flex justify-between"><span>Terakhir Diperbarui</span><span className="text-white font-mono">01/07/2026 08:32</span></div>
                </div>
              </div>
            </div>

            {/* Aksi Cepat Card */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h3>
              
              <div className="space-y-3.5 text-xs font-bold text-gray-400">
                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] p-3 rounded-xl transition-all border-gray-800">
                  <Plus size={16} className="text-blue-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-white">Buat Template Baru</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Buat template dari awal</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] p-3 rounded-xl transition-all border-gray-800">
                  <Download size={16} className="text-green-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-white">Import Template</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Import dari file CSV/Excel</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] p-3 rounded-xl transition-all border-gray-800">
                  <Download size={16} className="text-purple-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-white">Export Template</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Export semua template</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] p-3 rounded-xl transition-all border-gray-800">
                  <FileText size={16} className="text-orange-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-white">Dokumentasi</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Panduan penggunaan template</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] p-3 rounded-xl transition-all border-gray-800">
                  <Settings size={16} className="text-blue-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-white">Aturan Template</p>
                    <p className="text-[8px] text-gray-500 font-normal mt-0.5">Lihat aturan WhatsApp Business</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Tips Template */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tips Template</h3>
              
              <ul className="space-y-3 text-[9px] font-bold text-gray-500 list-disc pl-4 leading-relaxed">
                <li>Gunakan variabel untuk personalisasi pesan</li>
                <li>Pastikan template sesuai dengan kebijakan WhatsApp</li>
                <li>Template memerlukan persetujuan WhatsApp</li>
                <li>Gunakan kategori yang tepat untuk memudahkan pencarian</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
