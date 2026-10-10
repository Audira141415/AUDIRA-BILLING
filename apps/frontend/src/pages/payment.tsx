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
  Activity,
  Check,
  Percent,
  RefreshCw,
  Settings,
  ShieldAlert,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PaymentRow {
  id: string;
  date: string;
  invoiceNo: string;
  customerName: string;
  method: string;
  methodDetail?: string;
  amount: number;
  status: 'Berhasil' | 'Menunggu' | 'Gagal';
  confirmDate: string;
}

const mockPayments: PaymentRow[] = [
  {
    id: '1',
    date: '01/07/2026 08:30',
    invoiceNo: 'INV/2026/07/0012',
    customerName: 'Budi Santoso',
    method: 'Transfer Bank',
    methodDetail: 'BCA',
    amount: 1200000,
    status: 'Berhasil',
    confirmDate: '01/07/2026 08:32'
  },
  {
    id: '2',
    date: '01/07/2026 08:15',
    invoiceNo: 'INV/2026/07/0011',
    customerName: 'Siti Aminah',
    method: 'QRIS',
    amount: 450000,
    status: 'Berhasil',
    confirmDate: '01/07/2026 08:16'
  },
  {
    id: '3',
    date: '01/07/2026 07:55',
    invoiceNo: 'INV/2026/07/0010',
    customerName: 'Andi Pratama',
    method: 'Transfer Bank',
    methodDetail: 'BRI',
    amount: 2200000,
    status: 'Berhasil',
    confirmDate: '01/07/2026 07:58'
  },
  {
    id: '4',
    date: '01/07/2026 07:40',
    invoiceNo: 'INV/2026/07/0009',
    customerName: 'Dewi Lestari',
    method: 'OVO',
    amount: 350000,
    status: 'Menunggu',
    confirmDate: '-'
  },
  {
    id: '5',
    date: '01/07/2026 07:22',
    invoiceNo: 'INV/2026/07/0008',
    customerName: 'Fajar Nugroho',
    method: 'DANA',
    amount: 900000,
    status: 'Menunggu',
    confirmDate: '-'
  },
  {
    id: '6',
    date: '01/07/2026 06:50',
    invoiceNo: 'INV/2026/07/0007',
    customerName: 'Nina Wulandari',
    method: 'Transfer Bank',
    methodDetail: 'BCA',
    amount: 250000,
    status: 'Gagal',
    confirmDate: '01/07/2026 06:51'
  },
  {
    id: '7',
    date: '01/07/2026 06:40',
    invoiceNo: 'INV/2026/07/0006',
    customerName: 'Yudi Hermawan',
    method: 'Virtual Account',
    methodDetail: 'BCA',
    amount: 1300000,
    status: 'Berhasil',
    confirmDate: '01/07/2026 06:45'
  },
  {
    id: '8',
    date: '30/06/2026 16:10',
    invoiceNo: 'INV/2026/06/0099',
    customerName: 'PT. Maju Bersama',
    method: 'Transfer Bank',
    methodDetail: 'MANDIRI',
    amount: 3500000,
    status: 'Berhasil',
    confirmDate: '30/06/2026 16:12'
  },
  {
    id: '9',
    date: '30/06/2026 15:30',
    invoiceNo: 'INV/2026/06/0098',
    customerName: 'CV. Sinar Abadi',
    method: 'QRIS',
    amount: 1100000,
    status: 'Berhasil',
    confirmDate: '30/06/2026 15:31'
  },
  {
    id: '10',
    date: '30/06/2026 14:45',
    invoiceNo: 'INV/2026/06/0097',
    customerName: 'Rina Marlina',
    method: 'ShopeePay',
    amount: 750000,
    status: 'Gagal',
    confirmDate: '30/06/2026 14:46'
  }
];

export default function PaymentDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
              <span className="text-blue-400">Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment</h1>
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
          {/* Card 1: Total Penerimaan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Penerimaan</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 2.847.560.000</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+12.5% dari bulan lalu</span>
              </p>
            </div>
          </div>

          {/* Card 2: Pembayaran Berhasil */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pembayaran Berhasil</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 2.612.850.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">91.8% dari total</p>
            </div>
          </div>

          {/* Card 3: Menunggu Konfirmasi */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Menunggu Konfirmasi</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 156.230.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">5.5% dari total</p>
            </div>
          </div>

          {/* Card 4: Gagal / Ditolak */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gagal / Ditolak</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 78.480.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">2.7% dari total</p>
            </div>
          </div>

          {/* Card 5: Refund */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Refund</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 56.000.000</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">2.0% dari total</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table & Bottom 3 cards */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[#131d35] bg-[#0b1329]/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Transaksi Terbaru</h3>
                <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] text-gray-400 hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all">
                  <Filter size={12} />
                  <span>Filter</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4">TANGGAL</th>
                      <th className="p-4">INVOICE</th>
                      <th className="p-4">CUSTOMER</th>
                      <th className="p-4">METODE</th>
                      <th className="p-4">JUMLAH</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4">WAKTU KONFIRMASI</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]">
                    {mockPayments.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-[#121c38]/40 transition-colors">
                        <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                        <td className="p-4 text-gray-400 font-medium">{d.date}</td>
                        <td className="p-4 font-mono font-semibold text-blue-400">{d.invoiceNo}</td>
                        <td className="p-4 font-bold text-white">{d.customerName}</td>
                        <td className="p-4 font-semibold text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-blue-500/20 text-[8px] font-bold text-blue-400 border border-blue-500/20 px-1 py-0.2 uppercase flex items-center justify-center">
                              {d.method.split(' ')[0][0]}
                            </span>
                            <span>{d.method} {d.methodDetail && `(${d.methodDetail})`}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-white">{formatCurrency(d.amount)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            d.status === 'Berhasil' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : d.status === 'Menunggu'
                              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 font-medium">{d.confirmDate}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                              <Eye size={13} />
                            </button>
                            <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                              <FileText size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[#131d35] bg-[#0b1329]/60">
                <span className="text-xs text-gray-500">
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">1.248</span> data
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
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">2</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">3</button>
                    <span className="text-gray-600 text-xs px-1">...</span>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">125</button>
                    <button className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400 transition-colors">
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

            {/* Bottom Section 3 cards: Metode Pembayaran, Menunggu Konfirmasi, Rekonsiliasi Hari Ini */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Card 1: Metode Pembayaran */}
              <div className="lg:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Metode Pembayaran</h4>
                    <button className="text-[10px] bg-[#0052cc] text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700 transition-all">
                      Kelola Metode
                    </button>
                  </div>

                  <div className="space-y-3.5 mt-4 text-xs font-bold text-gray-300">
                    {[
                      { name: 'Transfer Bank', desc: 'Bank BCA, BRI, Mandiri, BNI' },
                      { name: 'QRIS', desc: 'Semua QRIS Payment' },
                      { name: 'Virtual Account', desc: 'BCA, Mandiri, BNI, BRI' },
                      { name: 'OVO', desc: 'E-Wallet Payment' },
                      { name: 'DANA', desc: 'E-Wallet Payment' },
                      { name: 'ShopeePay', desc: 'E-Wallet Payment' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded bg-[#080d19] border border-[#131d35] flex items-center justify-center text-[10px]">
                            {item.name[0]}
                          </div>
                          <div>
                            <p className="text-white leading-tight">{item.name}</p>
                            <p className="text-[9px] text-gray-500 font-semibold">{item.desc}</p>
                          </div>
                        </div>
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                          Aktif
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Menunggu Konfirmasi */}
              <div className="lg:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Menunggu Konfirmasi</h4>
                    <button className="text-xs text-blue-500 font-bold hover:underline">Lihat Semua</button>
                  </div>

                  <div className="space-y-3.5 mt-4 text-xs font-bold text-gray-300">
                    {[
                      { inv: 'INV/2026/07/0009', desc: 'OVO', customer: 'Dewi Lestari', time: '01/07/2026 07:40', action: 'Baru' },
                      { inv: 'INV/2026/07/0008', desc: 'Rp 900.000', customer: 'Fajar Nugroho', time: '01/07/2026 07:22', action: 'Baru' },
                      { inv: 'INV/2026/07/0005', desc: 'Rp 650.000', customer: 'Fitri Handayani', time: '01/07/2026 06:58', action: 'Proses' },
                      { inv: 'INV/2026/07/0004', desc: 'Rp 480.000', customer: 'Bambang Setiawan', time: '01/07/2026 06:45', action: 'Proses' },
                      { inv: 'INV/2026/07/0003', desc: 'Rp 320.000', customer: 'Nadya Putri', time: '01/07/2026 06:30', action: 'Proses' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded bg-[#080d19] border border-[#131d35] flex items-center justify-center text-[10px] text-purple-400">
                            {item.desc.includes('Rp') ? 'VA' : 'O'}
                          </div>
                          <div>
                            <p className="text-white leading-tight font-mono text-[10px]">{item.inv}</p>
                            <p className="text-[9px] text-gray-500 font-semibold">{item.customer} - {item.time}</p>
                          </div>
                        </div>
                        <button className={`text-[9px] font-bold px-2 py-0.8 rounded border transition-colors ${
                          item.action === 'Baru' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20' 
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-600/20'
                        }`}>
                          {item.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Rekonsiliasi Hari Ini */}
              <div className="lg:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Rekonsiliasi Hari Ini</h4>
                  
                  <div className="relative flex justify-center py-4 scale-95">
                    <svg width="100" height="100" viewBox="0 0 42 42" className="transform -rotate-90">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                      
                      {/* Cocok: 89.2% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                        strokeDasharray="89.2 10.8" 
                        strokeDashoffset="0" 
                      />

                      {/* Selisih: 6.8% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                        strokeDasharray="6.8 93.2" 
                        strokeDashoffset="-89.2" 
                      />

                      {/* Belum Dicocokkan: 4.0% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                        strokeDasharray="4.0 96.0" 
                        strokeDashoffset="-96.0" 
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-xs font-bold text-gray-400">Total Hari Ini</p>
                      <p className="text-xs font-black text-white leading-none">Rp 234.710.000</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px] text-gray-400 font-semibold mt-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-green-500" />Cocok</span>
                      <span className="text-white">89.2% (Rp 209.350.000)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-red-500" />Selisih</span>
                      <span className="text-white">6.8% (Rp 15.930.000)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-yellow-500" />Belum Dicocokkan</span>
                      <span className="text-white">4.0% (Rp 9.430.000)</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all">
                  Buka Rekonsiliasi
                </button>
              </div>

            </div>

            {/* Horizontal Aksi Cepat Row */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { name: 'Konfirmasi Manual', desc: 'Konfirmasi pembayaran customer', icon: CheckCircle, color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                  { name: 'Tambah Pembayaran', desc: 'Catat pembayaran manual', icon: Plus, color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
                  { name: 'Buat Refund', desc: 'Proses pengembalian dana', icon: Wallet, color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
                  { name: 'Rekonsiliasi', desc: 'Cocokkan mutasi bank', icon: RefreshCw, color: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' },
                  { name: 'Export Laporan', desc: 'Download laporan payment', icon: Download, color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
                  { name: 'Pengaturan Payment', desc: 'Atur metode & rekening', icon: Settings, color: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={idx} 
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 transform hover:scale-[1.02] ${item.color}`}
                    >
                      <Icon size={16} className="mb-2" />
                      <p className="text-[10px] font-bold leading-tight">{item.name}</p>
                      <p className="text-[8px] text-gray-500 font-normal mt-0.5 leading-tight">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Penerimaan Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Penerimaan</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Transfer Bank: 65.2% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray="65.2 34.8" 
                    strokeDashoffset="0" 
                  />

                  {/* QRIS: 18.7% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="18.7 81.3" 
                    strokeDashoffset="-65.2" 
                  />

                  {/* E-Wallet: 12.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                    strokeDasharray="12.1 87.9" 
                    strokeDashoffset="-83.9" 
                  />

                  {/* Virtual Account: 3.2% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="3.2 96.8" 
                    strokeDashoffset="-96.0" 
                  />

                  {/* Lainnya: 0.8% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6b7280" strokeWidth="4.5" 
                    strokeDasharray="0.8 99.2" 
                    strokeDashoffset="-99.2" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-[8px] text-gray-500 font-bold uppercase">Total Penerimaan</p>
                  <p className="text-xs font-black text-white leading-tight">Rp 2.847.560.000</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" />Transfer Bank</span>
                  <span className="text-white font-bold">65.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" />QRIS</span>
                  <span className="text-white font-bold">18.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-yellow-500" />E-Wallet</span>
                  <span className="text-white font-bold">12.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-green-500" />Virtual Account</span>
                  <span className="text-white font-bold">3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-gray-550 bg-gray-500" />Lainnya</span>
                  <span className="text-white font-bold">0.8%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Grafik Penerimaan (30 Hari Terakhir) */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Grafik Penerimaan (30 Hari Terakhir)</h3>
              
              {/* Combo Chart */}
              <div className="h-32 w-full mt-2">
                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#131d35" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#131d35" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#131d35" strokeDasharray="3 3" />
                  
                  <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 250 Jt</text>
                  <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 150 Jt</text>
                  <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">Rp 50 Jt</text>
                  
                  {/* Lines for Berhasil, Menunggu, Gagal */}
                  <path d="M20,68 L70,50 L120,55 L170,40 L220,48 L270,30" fill="none" stroke="#10b981" strokeWidth="2" />
                  <path d="M20,80 L70,82 L120,78 L170,85 L220,72 L270,68" fill="none" stroke="#f97316" strokeWidth="1.5" />
                  <path d="M20,95 L70,92 L120,95 L170,90 L220,92 L270,89" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  
                  <text x="15" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">02 Jun</text>
                  <text x="65" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">09 Jun</text>
                  <text x="115" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">16 Jun</text>
                  <text x="165" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">23 Jun</text>
                  <text x="215" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">30 Jun</text>
                  <text x="265" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                </svg>
              </div>

              {/* Legends */}
              <div className="flex justify-center gap-3 text-[8px] text-gray-500 font-bold uppercase pt-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-green-500 inline-block"></span>Berhasil</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-orange-500 inline-block"></span>Menunggu</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>Gagal</span>
              </div>
            </div>

            {/* Card 3: Metode Pembayaran Populer */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Metode Pembayaran Populer</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Transfer Bank', amount: 1855420000, percentage: 65.2, color: 'bg-blue-600' },
                  { name: 'QRIS', amount: 532340000, percentage: 18.7, color: 'bg-blue-500' },
                  { name: 'E-Wallet', amount: 344300000, percentage: 12.1, color: 'bg-blue-400' },
                  { name: 'Virtual Account', amount: 91200000, percentage: 3.2, color: 'bg-green-555 bg-green-600' },
                  { name: 'Lainnya', amount: 24300000, percentage: 0.8, color: 'bg-gray-500' },
                ].map((item, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="text-gray-400">{formatCurrency(item.amount)} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#101935] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`${item.color} h-full rounded-full transition-all duration-500`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 4: Status Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Status Pembayaran</h3>
              
              <div className="space-y-3 text-xs text-gray-400 font-semibold">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-green-500" />Berhasil</span>
                  <span className="text-white">1.152 Transaksi (91.8%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" />Menunggu Konfirmasi</span>
                  <span className="text-white">69 Transaksi (5.5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500" />Gagal / Ditolak</span>
                  <span className="text-white">34 Transaksi (2.7%)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
