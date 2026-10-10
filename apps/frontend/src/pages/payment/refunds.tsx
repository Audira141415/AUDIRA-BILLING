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
  ChevronDown,
  Upload
} from 'lucide-react';

interface RefundVoidRow {
  id: string;
  date: string;
  type: 'Refund' | 'Void';
  refNo: string;
  invoiceNo: string;
  customerName: string;
  method: string;
  amount: number;
  percentage: number;
  status: 'Selesai' | 'Proses';
  reason: string;
}

const mockRefundVoids: RefundVoidRow[] = [
  { id: '1', date: '01/07/2026 08:32', type: 'Refund', refNo: 'RFND-20260701-0001', invoiceNo: 'INV/2026/07/0012', customerName: 'Budi Santoso', method: 'Transfer Bank - BCA', amount: 1200000, percentage: 100, status: 'Selesai', reason: 'Permintaan Customer' },
  { id: '2', date: '01/07/2026 08:16', type: 'Void', refNo: 'VOID-20260701-0002', invoiceNo: 'INV/2026/07/0011', customerName: 'Siti Aminah', method: 'QRIS', amount: 450000, percentage: 100, status: 'Selesai', reason: 'Salah Input' },
  { id: '3', date: '01/07/2026 07:58', type: 'Refund', refNo: 'RFND-20260701-0003', invoiceNo: 'INV/2026/07/0010', customerName: 'Andi Pratama', method: 'Transfer Bank - BRI', amount: 1100000, percentage: 50, status: 'Selesai', reason: 'Kelebihan Bayar' },
  { id: '4', date: '01/07/2026 07:40', type: 'Void', refNo: 'VOID-20260701-0004', invoiceNo: 'INV/2026/07/0009', customerName: 'Dewi Lestari', method: 'OVO', amount: 350000, percentage: 100, status: 'Selesai', reason: 'Duplikat Invoice' },
  { id: '5', date: '01/07/2026 07:22', type: 'Refund', refNo: 'RFND-20260701-0005', invoiceNo: 'INV/2026/07/0008', customerName: 'Fajar Nugroho', method: 'DANA', amount: 900000, percentage: 20, status: 'Proses', reason: 'Partial Refund' },
  { id: '6', date: '01/07/2026 06:51', type: 'Refund', refNo: 'RFND-20260701-0006', invoiceNo: 'INV/2026/07/0007', customerName: 'Nina Wulandari', method: 'Transfer Bank - BCA', amount: 250000, percentage: 100, status: 'Selesai', reason: 'Batal Langganan' },
  { id: '7', date: '01/07/2026 06:45', type: 'Void', refNo: 'VOID-20260701-0007', invoiceNo: 'INV/2026/07/0006', customerName: 'Yudi Hermawan', method: 'Virtual Account - BCA', amount: 1300000, percentage: 100, status: 'Selesai', reason: 'Salah Paket' },
  { id: '8', date: '30/06/2026 16:12', type: 'Refund', refNo: 'RFND-20260630-0001', invoiceNo: 'INV/2026/06/0099', customerName: 'PT. Maju Bersama', method: 'Transfer Bank - Mandiri', amount: 3500000, percentage: 30, status: 'Proses', reason: 'Kelebihan Bayar' },
  { id: '9', date: '30/06/2026 15:31', type: 'Void', refNo: 'VOID-20260630-0002', invoiceNo: 'INV/2026/06/0098', customerName: 'CV. Sinar Abadi', method: 'QRIS', amount: 1100000, percentage: 100, status: 'Selesai', reason: 'Pembatalan Order' },
  { id: '10', date: '30/06/2026 14:46', type: 'Refund', refNo: 'RFND-20260630-0003', invoiceNo: 'INV/2026/06/0097', customerName: 'Rina Marlina', method: 'ShopeePay', amount: 750000, percentage: 25, status: 'Selesai', reason: 'Partial Refund' }
];

export default function RefundVoidPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [refundPercentage, setRefundPercentage] = useState(100);
  const [voidPercentage, setVoidPercentage] = useState(100);

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
              <span className="text-blue-400">Refund & Void</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Refund & Void</h1>
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
          {/* Card 1: Total Refund */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Refund</p>
              <p className="text-lg font-black text-white mt-0.5">Rp 156.230.000</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+12.8% dari periode lalu</span>
              </p>
            </div>
          </div>

          {/* Card 2: Total Void */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Void</p>
              <p className="text-lg font-black text-white mt-0.5">Rp 78.480.000</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+8.4% dari periode lalu</span>
              </p>
            </div>
          </div>

          {/* Card 3: Total Transaksi Refund */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Transaksi Refund</p>
              <p className="text-2xl font-black text-white mt-0.5">156</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+14.2% dari periode lalu</span>
              </p>
            </div>
          </div>

          {/* Card 4: Total Transaksi Void */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Transaksi Void</p>
              <p className="text-2xl font-black text-white mt-0.5">78</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+9.7% dari periode lalu</span>
              </p>
            </div>
          </div>

          {/* Card 5: Total Nilai Terdampak */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Nilai Terdampak</p>
              <p className="text-lg font-black text-white mt-0.5">Rp 234.710.000</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+11.5% dari periode lalu</span>
              </p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date range */}
            <div className="flex items-center gap-2 bg-[#080d19] border border-[#131d35] px-3 py-2.5 rounded-xl text-xs text-gray-300 cursor-pointer">
              <Calendar size={14} className="text-gray-500" />
              <span>01/06/2026 - 01/07/2026</span>
            </div>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[180px]">
              <option>Semua Tipe (Refund & Void)</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Metode</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>
            
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, referensi..."
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all border-none">
              <Plus size={14} />
              <span>Buat Refund</span>
            </button>

            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all border-none">
              <Plus size={14} />
              <span>Void Invoice</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table & Forms */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card with internal Sub-tabs */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              
              {/* Tabs row */}
              <div className="flex border-b border-[#131d35] bg-[#0b1329]/40 text-xs font-bold text-gray-500 overflow-x-auto">
                {[
                  { label: 'Semua', count: 234 },
                  { label: 'Refund', count: 156 },
                  { label: 'Void', count: 78 }
                ].map(tab => {
                  const isActive = activeTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(tab.label)}
                      className={`py-3 px-5 border-b-2 transition-all flex items-center gap-1.5 ${
                        isActive ? 'border-blue-500 text-white font-bold' : 'border-transparent hover:text-gray-300'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-[#0052cc] text-white' : 'bg-[#101935] text-gray-400'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4">TANGGAL</th>
                      <th className="p-4 w-24">TIPE</th>
                      <th className="p-4">REFERENSI</th>
                      <th className="p-4">INVOICE</th>
                      <th className="p-4">CUSTOMER</th>
                      <th className="p-4">METODE</th>
                      <th className="p-4">NILAI</th>
                      <th className="p-4 w-24">PERSENTASE</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4">ALASAN</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]">
                    {mockRefundVoids.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-[#121c38]/40 transition-colors">
                        <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                        <td className="p-4 text-gray-400 font-medium">{d.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                            d.type === 'Refund'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {d.type}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-gray-400">{d.refNo}</td>
                        <td className="p-4 font-mono font-semibold text-blue-400">{d.invoiceNo}</td>
                        <td className="p-4 font-bold text-white">{d.customerName}</td>
                        <td className="p-4 text-gray-400 font-medium">{d.method}</td>
                        <td className="p-4 font-bold text-white">{formatCurrency(d.amount)}</td>
                        <td className="p-4 font-semibold text-gray-300">{d.percentage}%</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            d.status === 'Selesai' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 font-medium">{d.reason}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                              <Eye size={13} />
                            </button>
                            <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                              <MoreVertical size={13} />
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">234</span> data
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
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">24</button>
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

            {/* Forms Section: Buat Refund, Buat Void, Aktivitas Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Buat Refund Form */}
              <div className="lg:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Buat Refund</h4>
                
                <div className="space-y-3.5 text-xs font-bold text-gray-400">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">No Invoice *</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none">
                      <option>Pilih Invoice</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                    <div className="space-y-0.5">
                      <span className="text-gray-500 block uppercase">Customer</span>
                      <p className="text-white">-</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-gray-500 block uppercase">Metode Pembayaran</span>
                      <p className="text-white">-</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span>Nilai Invoice</span>
                    <span className="text-white">Rp 0</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 uppercase">Persentase Refund (%) *</span>
                      <span className="text-white">{refundPercentage}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={refundPercentage}
                      onChange={(e) => setRefundPercentage(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-[#080d19] h-1.5 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Nilai Refund</span>
                    <span className="text-blue-400 font-bold">Rp 0</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Alasan Refund *</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none">
                      <option>Pilih Alasan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Catatan (Opsional)</span>
                    <textarea rows={2} placeholder="Tulis catatan refund..." className="w-full bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="text-xs font-bold text-gray-400 hover:text-white py-2.5 border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 transition-colors">
                      Reset
                    </button>
                    <button className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all border-none">
                      Preview Refund
                    </button>
                  </div>
                </div>
              </div>

              {/* Buat Void Form */}
              <div className="lg:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Buat Void</h4>
                
                <div className="space-y-3.5 text-xs font-bold text-gray-400">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">No Invoice *</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none">
                      <option>Pilih Invoice</option>
                    </select>
                  </div>

                  <div className="space-y-0.5 text-[10px] font-bold">
                    <span className="text-gray-500 block uppercase">Customer</span>
                    <p className="text-white">-</p>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span>Nilai Invoice</span>
                    <span className="text-white">Rp 0</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 uppercase">Persentase Void (%) *</span>
                      <span className="text-white">{voidPercentage}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={voidPercentage}
                      onChange={(e) => setVoidPercentage(parseInt(e.target.value))}
                      className="w-full accent-red-500 bg-[#080d19] h-1.5 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Nilai Void</span>
                    <span className="text-red-400 font-bold">Rp 0</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Alasan Void *</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-gray-300 focus:outline-none">
                      <option>Pilih Alasan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Catatan (Opsional)</span>
                    <textarea rows={2} placeholder="Tulis catatan void..." className="w-full bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="text-xs font-bold text-gray-400 hover:text-white py-2.5 border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 transition-colors">
                      Reset
                    </button>
                    <button className="bg-red-650 bg-red-650 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all border-none">
                      Preview Void
                    </button>
                  </div>
                </div>
              </div>

              {/* Aktivitas Terbaru */}
              <div className="lg:col-span-4 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terbaru</h4>
                  
                  <div className="relative border-l border-[#131d35] ml-2 pl-4 space-y-4 text-[9px] text-gray-500 font-bold mt-4">
                    {[
                      { title: 'Refund RFND-20260701-0001 diselesaikan', time: '01/07/2026 08:32 WIB', color: 'bg-green-500' },
                      { title: 'Void VOID-20260701-0002 diselesaikan', time: '01/07/2026 08:16 WIB', color: 'bg-red-500' },
                      { title: 'Refund RFND-20260701-0003 diselesaikan', time: '01/07/2026 07:58 WIB', color: 'bg-green-500' },
                      { title: 'Void VOID-20260701-0004 diselesaikan', time: '01/07/2026 07:40 WIB', color: 'bg-red-500' },
                      { title: 'Refund RFND-20260701-0005 masih diproses', time: '01/07/2026 07:22 WIB', color: 'bg-orange-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="relative">
                        <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[#070c19] ${item.color}`}></span>
                        <span className="text-white block leading-none">{item.title}</span>
                        <span className="text-gray-500 text-[8px] font-semibold mt-1 block">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[#131d35] block mt-4">
                  Lihat Semua Aktivitas &rarr;
                </button>
              </div>

            </div>

            {/* Bottom-most horizontal row: Aksi Cepat */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                {[
                  { name: 'Buat Refund', desc: 'Proses refund baru', icon: CheckCircle, color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                  { name: 'Buat Void', desc: 'Void invoice', icon: Plus, color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
                  { name: 'Daftar Refund', desc: 'Lihat semua refund', icon: FileText, color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
                  { name: 'Daftar Void', desc: 'Lihat semua void', icon: XCircle, color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
                  { name: 'Export Laporan', desc: 'Download laporan', icon: Download, color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
                  { name: 'Pengaturan Refund', desc: 'Atur kebijakan refund', icon: Settings, color: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' },
                  { name: 'Pengaturan Void', desc: 'Atur kebijakan void', icon: Settings, color: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={idx} 
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 transform hover:scale-[1.02] ${item.color}`}
                    >
                      <Icon size={14} className="mb-1.5" />
                      <p className="text-[9px] font-bold leading-tight">{item.name}</p>
                      <p className="text-[7px] text-gray-500 font-normal mt-0.5 leading-tight">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Refund & Void Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Refund & Void</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Refund Selesai: 56.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="56.4 43.6" 
                    strokeDashoffset="0" 
                  />

                  {/* Refund Proses: 10.3% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="10.3 89.7" 
                    strokeDashoffset="-56.4" 
                  />

                  {/* Void Selesai: 29.9% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray="29.9 70.1" 
                    strokeDashoffset="-66.7" 
                  />

                  {/* Void Proses: 3.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray="3.4 96.6" 
                    strokeDashoffset="-96.6" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-base font-black text-white leading-none">234</p>
                  <p className="text-[7px] text-gray-500 font-bold uppercase mt-0.5">Total Transaksi</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-green-500" />Refund Selesai</span>
                  <span className="text-white font-bold">132 (56.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" />Refund Proses</span>
                  <span className="text-white font-bold">24 (10.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500" />Void Selesai</span>
                  <span className="text-white font-bold">70 (29.9%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" />Void Proses</span>
                  <span className="text-white font-bold">8 (3.4%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Ringkasan Nilai */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Nilai</h3>
              
              <div className="space-y-3 text-xs text-gray-400 font-semibold pt-1">
                <div className="flex justify-between">
                  <span>Total Nilai Refund</span>
                  <span className="text-white font-bold">Rp 156.230.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Nilai Void</span>
                  <span className="text-white font-bold">Rp 78.480.000</span>
                </div>
                <div className="flex justify-between border-b border-[#131d35] pb-3">
                  <span>Total Nilai Terdampak</span>
                  <span className="text-blue-400 font-bold">Rp 234.710.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Rata-rata Persentase</span>
                  <span className="text-white font-bold">72.6%</span>
                </div>
                <div className="flex justify-between">
                  <span>Refund 100%</span>
                  <span className="text-white">Rp 98.350.000 (62.9%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Refund Partial</span>
                  <span className="text-white">Rp 57.880.000 (37.1%)</span>
                </div>
              </div>
            </div>

            {/* Card 3: Statistik Persentase */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Statistik Persentase</h3>
              
              <div className="space-y-3">
                {[
                  { range: '100%', tx: 152, pct: 64.9 },
                  { range: '75%', tx: 18, pct: 7.7 },
                  { range: '50%', tx: 24, pct: 10.3 },
                  { range: '25%', tx: 22, pct: 9.4 },
                  { range: '< 25%', tx: 18, pct: 7.7 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">{item.range}</span>
                      <span className="text-gray-400">{item.tx} transaksi ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-[#101935] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Alasan Terbanyak */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Alasan Terbanyak</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                {[
                  { name: 'Permintaan Customer', tx: 56, pct: 23.9, color: 'bg-blue-500' },
                  { name: 'Kelebihan Bayar', tx: 48, pct: 20.5, color: 'bg-green-500' },
                  { name: 'Salah Input', tx: 40, pct: 17.1, color: 'bg-yellow-500' },
                  { name: 'Duplikat Invoice', tx: 32, pct: 13.7, color: 'bg-purple-500' },
                  { name: 'Batal Langganan', tx: 28, pct: 12.0, color: 'bg-red-500' },
                  { name: 'Lainnya', tx: 30, pct: 12.8, color: 'bg-gray-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-300 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                        <span>{item.name}</span>
                      </span>
                      <span>{item.tx} transaksi ({item.pct}%)</span>
                    </div>
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
