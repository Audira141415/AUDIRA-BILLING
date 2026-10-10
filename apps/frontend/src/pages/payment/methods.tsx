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
  Edit2
} from 'lucide-react';

interface MethodRow {
  id: string;
  name: string;
  subName: string;
  channel: string;
  type: string;
  adminFee: number;
  minPayment: number;
  status: 'Aktif' | 'Non Aktif';
}

const mockMethods: MethodRow[] = [
  { id: '1', name: 'Transfer Bank - BCA', subName: 'Bank Central Asia', channel: 'Transfer Bank', type: 'Otomatis', adminFee: 0, minPayment: 10000, status: 'Aktif' },
  { id: '2', name: 'Transfer Bank - Mandiri', subName: 'Bank Mandiri', channel: 'Transfer Bank', type: 'Otomatis', adminFee: 0, minPayment: 10000, status: 'Aktif' },
  { id: '3', name: 'QRIS', subName: 'QR Code Standar Indonesia', channel: 'QRIS', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '4', name: 'E-Wallet - OVO', subName: 'OVO Payment', channel: 'E-Wallet', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '5', name: 'E-Wallet - DANA', subName: 'DANA Payment', channel: 'E-Wallet', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '6', name: 'Virtual Account - BCA', subName: 'BCA Virtual Account', channel: 'Virtual Account', type: 'Otomatis', adminFee: 2500, minPayment: 10000, status: 'Aktif' },
  { id: '7', name: 'ShopeePay', subName: 'ShopeePay Payment', channel: 'E-Wallet', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '8', name: 'Alfamart / Indomaret', subName: 'Retail Payment', channel: 'Retail', type: 'Manual', adminFee: 2000, minPayment: 20000, status: 'Non Aktif' }
];

export default function PaymentMethodsPage() {
  const [selectedMethodId, setSelectedMethodId] = useState('1');
  const [channelSwitches, setChannelSwitches] = useState({
    active: true,
    showInInvoice: true,
    autoVerify: true,
    autoNotify: true
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Home</span>
              <span>&gt;</span>
              <span>Payment</span>
              <span>&gt;</span>
              <span className="text-blue-400">Metode Pembayaran</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Metode Pembayaran</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total Metode */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Metode</p>
              <p className="text-2xl font-black text-white mt-0.5">8</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Semua metode</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">7</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">87.5% dari total</p>
            </div>
          </div>

          {/* Card 3: Non Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">1</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">12.5% dari total</p>
            </div>
          </div>

          {/* Card 4: Channel Tersedia */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Channel Tersedia</p>
              <p className="text-2xl font-black text-white mt-0.5">5</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Transfer, QRIS, E-Wallet, VA, dll</p>
            </div>
          </div>

          {/* Card 5: Transaksi Hari Ini */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Transaksi Hari Ini</p>
              <p className="text-2xl font-black text-white mt-0.5">156</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Total transaksi</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table & Bottom Widgets */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              
              {/* Header inside */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-[#131d35] bg-[#0b1329]/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Metode Pembayaran</h3>
                
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      placeholder="Cari metode pembayaran..."
                      className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-9 pr-3 py-2 rounded-xl text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  <select className="bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none min-w-[120px]">
                    <option>Semua Status</option>
                  </select>

                  <select className="bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none min-w-[120px]">
                    <option>Semua Channel</option>
                  </select>

                  <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all sm:ml-auto">
                    <Plus size={14} />
                    <span>Tambah Metode</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4">NAMA METODE</th>
                      <th className="p-4">CHANNEL</th>
                      <th className="p-4">TIPE</th>
                      <th className="p-4">BIAYA ADMIN</th>
                      <th className="p-4">MIN. PEMBAYARAN</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]">
                    {mockMethods.map((d, idx) => {
                      const isSelected = selectedMethodId === d.id;
                      return (
                        <tr 
                          key={d.id} 
                          onClick={() => setSelectedMethodId(d.id)}
                          className={`hover:bg-[#121c38]/40 transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#0052cc]/5 border-l-2 border-l-blue-500' : ''
                          }`}
                        >
                          <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                          <td className="p-4 font-bold text-white">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[9px] font-black text-blue-900 border border-gray-100 overflow-hidden">
                                {d.name.split(' ')[0][0]}{d.name.split(' ').pop()?.[0]}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-white leading-tight font-semibold">{d.name}</p>
                                <p className="text-[9px] text-gray-500 font-medium">{d.subName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-gray-300">
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              {d.channel}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400 font-medium">{d.type}</td>
                          <td className="p-4 text-gray-400 font-medium">{formatCurrency(d.adminFee)}</td>
                          <td className="p-4 text-gray-400 font-medium">{formatCurrency(d.minPayment)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                              d.status === 'Aktif' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                                <XCircle size={13} />
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[#131d35] bg-[#0b1329]/60">
                <span className="text-xs text-gray-500">
                  Menampilkan <span className="font-semibold text-white">1 - 8</span> dari <span className="font-semibold text-white">8</span> data
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
                    <button className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400 transition-colors" disabled>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    className="bg-[#080d19] border border-[#131d35] text-xs py-1.5 px-3 rounded-lg text-gray-300 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Statistik Metode Pembayaran Donut */}
              <div className="md:col-span-5 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Statistik Metode Pembayaran</h4>
                  
                  <div className="relative flex justify-center py-4 scale-95">
                    <svg width="100" height="100" viewBox="0 0 42 42" className="transform -rotate-90">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                      
                      {/* Transfer Bank: 41.7% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                        strokeDasharray="41.7 58.3" 
                        strokeDashoffset="0" 
                      />

                      {/* QRIS: 24.4% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                        strokeDasharray="24.4 75.6" 
                        strokeDashoffset="-41.7" 
                      />

                      {/* E-Wallet: 20.5% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                        strokeDasharray="20.5 79.5" 
                        strokeDashoffset="-66.1" 
                      />

                      {/* VA: 9.6% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                        strokeDasharray="9.6 90.4" 
                        strokeDashoffset="-86.6" 
                      />

                      {/* Retail: 3.8% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.5" 
                        strokeDasharray="3.8 96.2" 
                        strokeDashoffset="-96.2" 
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-[7px] text-gray-500 font-bold uppercase">Total Transaksi</p>
                      <p className="text-base font-black text-white leading-none">156</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px] text-gray-400 font-semibold mt-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-blue-500" />Transfer Bank</span>
                      <span className="text-white">65 (41.7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-orange-500" />QRIS</span>
                      <span className="text-white">38 (24.4%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-yellow-500" />E-Wallet</span>
                      <span className="text-white">32 (20.5%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-green-500" />Virtual Account</span>
                      <span className="text-white">15 (9.6%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-purple-500" />Retail</span>
                      <span className="text-white">6 (3.8%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panduan Konfigurasi */}
              <div className="md:col-span-7 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Panduan Konfigurasi</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-[10px] font-bold text-gray-400">
                    {[
                      { step: 1, title: 'Tambah Metode', desc: 'Klik tombol "Tambah Metode" untuk menambahkan metode pembayaran baru.' },
                      { step: 2, title: 'Konfigurasi Detail', desc: 'Isi detail metode, biaya admin, dan informasi rekening atau API yang diperlukan.' },
                      { step: 3, title: 'Atur Status & Channel', desc: 'Aktifkan metode dan pilih channel yang sesuai untuk metode pembayaran.' },
                      { step: 4, title: 'Uji Coba', desc: 'Lakukan uji coba untuk memastikan metode pembayaran berfungsi dengan baik.' }
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
                </div>

                <div className="border-t border-[#131d35]/60 pt-3 mt-4 text-left">
                  <button className="text-blue-500 font-bold hover:underline text-xs">
                    Lihat Dokumentasi Lengkap &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Detail Pane */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Detail Metode Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-5">
              
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">Detail Metode Pembayaran</h3>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                  Aktif
                </span>
              </div>

              {/* Logo & Bank */}
              <div className="flex items-center gap-3 bg-[#080d19] border border-[#131d35] p-3 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-900 font-black text-xs border border-gray-100 overflow-hidden">
                  BCA
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white leading-tight">Transfer Bank - BCA</p>
                  <p className="text-[9px] text-gray-500 font-semibold">Bank Central Asia</p>
                </div>
              </div>

              {/* Detail fields */}
              <div className="text-[11px] text-gray-400 font-semibold space-y-3 border-b border-[#131d35] pb-4">
                <div className="flex justify-between">
                  <span>Channel</span>
                  <span className="text-white">Transfer Bank</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipe</span>
                  <span className="text-white">Otomatis</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Admin</span>
                  <span className="text-white">Rp 0</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Pembayaran</span>
                  <span className="text-white">Rp 10.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Maksimum Pembayaran</span>
                  <span className="text-white">Rp 50.000.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu Proses</span>
                  <span className="text-white">Real-time</span>
                </div>
                <div className="space-y-1">
                  <span>Deskripsi</span>
                  <p className="text-white text-[10px] leading-relaxed font-normal">
                    Pembayaran melalui transfer bank BCA.
                  </p>
                </div>
              </div>

              {/* Informasi Rekening */}
              <div className="space-y-3.5 border-b border-[#131d35] pb-4">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Informasi Rekening</h4>
                
                <div className="text-[11px] text-gray-400 font-semibold space-y-2.5">
                  <div className="flex justify-between">
                    <span>Bank</span>
                    <span className="text-white">BCA (Bank Central Asia)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nama Pemilik</span>
                    <span className="text-white">PT. Audira NET Indonesia</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No. Rekening</span>
                    <span className="text-white font-mono">1234 5678 9012</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cabang</span>
                    <span className="text-white">Jakarta Pusat</span>
                  </div>
                </div>
              </div>

              {/* Pengaturan Channel */}
              <div className="space-y-3.5">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Pengaturan Channel</h4>
                
                <div className="space-y-3 text-[11px] font-semibold text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Aktifkan metode ini</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={channelSwitches.active} onChange={() => setChannelSwitches(p => ({ ...p, active: !p.active }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tampilkan di invoice</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={channelSwitches.showInInvoice} onChange={() => setChannelSwitches(p => ({ ...p, showInInvoice: !p.showInInvoice }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Verifikasi otomatis</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={channelSwitches.autoVerify} onChange={() => setChannelSwitches(p => ({ ...p, autoVerify: !p.autoVerify }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Kirim notifikasi otomatis</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={channelSwitches.autoNotify} onChange={() => setChannelSwitches(p => ({ ...p, autoNotify: !p.autoNotify }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button className="flex items-center justify-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
                  <Edit2 size={13} />
                  <span>Edit Metode</span>
                </button>
                <button className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
                  <XCircle size={13} />
                  <span>Non Aktifkan</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
