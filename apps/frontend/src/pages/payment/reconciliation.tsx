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

interface ReconRow {
  id: string;
  date: string;
  refNo: string;
  channel: string;
  method: string;
  invoiceNo: string;
  customerName: string;
  amount: number;
  status: 'Cocok' | 'Selisih' | 'Tidak Cocok' | 'Duplikat';
  diffAmount: number;
}

const mockRecons: ReconRow[] = [
  { id: '1', date: '01/07/2026 08:32', refNo: 'TRX-20260701-0001', channel: 'Mobile Banking', method: 'Transfer Bank - BCA', invoiceNo: 'INV/2026/07/0012', customerName: 'Budi Santoso', amount: 1200000, status: 'Cocok', diffAmount: 0 },
  { id: '2', date: '01/07/2026 08:16', refNo: 'TRX-20260701-0002', channel: 'QR Code', method: 'QRIS', invoiceNo: 'INV/2026/07/0011', customerName: 'Siti Aminah', amount: 450000, status: 'Cocok', diffAmount: 0 },
  { id: '3', date: '01/07/2026 07:58', refNo: 'TRX-20260701-0003', channel: 'Internet Banking', method: 'Transfer Bank - BRI', invoiceNo: 'INV/2026/07/0010', customerName: 'Andi Pratama', amount: 2200000, status: 'Cocok', diffAmount: 0 },
  { id: '4', date: '01/07/2026 07:40', refNo: 'TRX-20260701-0004', channel: 'E-Wallet', method: 'OVO', invoiceNo: 'INV/2026/07/0009', customerName: 'Dewi Lestari', amount: 350000, status: 'Selisih', diffAmount: 50000 },
  { id: '5', date: '01/07/2026 07:22', refNo: 'TRX-20260701-0005', channel: 'E-Wallet', method: 'DANA', invoiceNo: 'INV/2026/07/0008', customerName: 'Fajar Nugroho', amount: 900000, status: 'Tidak Cocok', diffAmount: 900000 },
  { id: '6', date: '01/07/2026 06:51', refNo: 'TRX-20260701-0006', channel: 'Mobile Banking', method: 'Transfer Bank - BCA', invoiceNo: 'INV/2026/07/0007', customerName: 'Nina Wulandari', amount: 250000, status: 'Cocok', diffAmount: 0 },
  { id: '7', date: '01/07/2026 06:45', refNo: 'TRX-20260701-0007', channel: 'Virtual Account', method: 'VA BCA', invoiceNo: 'INV/2026/07/0006', customerName: 'Yudi Hermawan', amount: 1300000, status: 'Cocok', diffAmount: 0 },
  { id: '8', date: '30/06/2026 16:12', refNo: 'TRX-20260630-0001', channel: 'Internet Banking', method: 'Transfer Bank - Mandiri', invoiceNo: 'INV/2026/06/0099', customerName: 'PT. Maju Bersama', amount: 3500000, status: 'Cocok', diffAmount: 0 },
  { id: '9', date: '30/06/2026 15:31', refNo: 'TRX-20260630-0002', channel: 'QR Code', method: 'QRIS', invoiceNo: 'INV/2026/06/0098', customerName: 'CV. Sinar Abadi', amount: 1100000, status: 'Selisih', diffAmount: 10000 },
  { id: '10', date: '30/06/2026 14:46', refNo: 'TRX-20260630-0003', channel: 'E-Wallet', method: 'ShopeePay', invoiceNo: 'INV/2026/06/0097', customerName: 'Rina Marlina', amount: 750000, status: 'Duplikat', diffAmount: 0 }
];

export default function PaymentReconciliationPage() {
  const [activeTab, setActiveTab] = useState('Semua');

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
              <span className="text-blue-400">Rekonsiliasi</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Rekonsiliasi Pembayaran</h1>
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
          {/* Card 1: Total Transaksi */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Transaksi</p>
              <p className="text-2xl font-black text-white mt-0.5">2.847</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+12.5% dari periode lalu</span>
              </p>
            </div>
          </div>

          {/* Card 2: Sudah Rekonsiliasi */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sudah Rekonsiliasi</p>
              <p className="text-2xl font-black text-white mt-0.5">2.612</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">91.75% dari total</p>
            </div>
          </div>

          {/* Card 3: Belum Rekonsiliasi */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Belum Rekonsiliasi</p>
              <p className="text-2xl font-black text-white mt-0.5">183</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">6.43% dari total</p>
            </div>
          </div>

          {/* Card 4: Tidak Cocok */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tidak Cocok</p>
              <p className="text-2xl font-black text-white mt-0.5">52</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">1.82% dari total</p>
            </div>
          </div>

          {/* Card 5: Total Nilai */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Nilai</p>
              <p className="text-xl font-black text-white mt-0.5">Rp 2.847.560.000</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+15.2% dari periode lalu</span>
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

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Channel</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Metode</option>
            </select>

            <select className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>
            
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari referensi, invoice, customer..."
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table and Bottom Widgets */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card with internal Sub-tabs */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              
              {/* Tabs row */}
              <div className="flex border-b border-[#131d35] bg-[#0b1329]/40 text-xs font-bold text-gray-500 overflow-x-auto">
                {[
                  { label: 'Semua', count: 183 },
                  { label: 'Cocok', count: 131 },
                  { label: 'Tidak Cocok', count: 52 },
                  { label: 'Selisih', count: 28 },
                  { label: 'Duplikat', count: 12 }
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
                      <th className="p-4">REFERENSI</th>
                      <th className="p-4">CHANNEL</th>
                      <th className="p-4">METODE</th>
                      <th className="p-4">INVOICE</th>
                      <th className="p-4">CUSTOMER</th>
                      <th className="p-4">NILAI</th>
                      <th className="p-4">STATUS REKONSILIASI</th>
                      <th className="p-4">SELISIH</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]">
                    {mockRecons.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-[#121c38]/40 transition-colors">
                        <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                        <td className="p-4 text-gray-400 font-medium">{d.date}</td>
                        <td className="p-4 font-mono font-semibold text-gray-400">{d.refNo}</td>
                        <td className="p-4 font-bold text-white">{d.channel}</td>
                        <td className="p-4 text-gray-400 font-medium">{d.method}</td>
                        <td className="p-4 font-mono font-semibold text-blue-400">{d.invoiceNo}</td>
                        <td className="p-4 font-bold text-white">{d.customerName}</td>
                        <td className="p-4 font-bold text-white">{formatCurrency(d.amount)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            d.status === 'Cocok' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : d.status === 'Selisih'
                              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                              : d.status === 'Tidak Cocok'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">{formatCurrency(d.diffAmount)}</td>
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
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">183</span> data
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
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">19</button>
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

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Sumber Data */}
              <div className="md:col-span-5 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Sumber Data</h4>
                
                <div className="space-y-3.5 text-xs font-bold text-gray-400">
                  {[
                    { name: 'BCA (Mobile Banking)', tx: 650, amount: 1250500000 },
                    { name: 'Mandiri (Internet Banking)', tx: 420, amount: 850300000 },
                    { name: 'BRI (Internet Banking)', tx: 380, amount: 720150000 },
                    { name: 'QRIS', tx: 520, amount: 480250000 },
                    { name: 'E-Wallet (OVO, DANA, ShopeePay)', tx: 877, amount: 1050360000 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5 border-b border-[#131d35]/40 last:border-0 pb-1.5">
                      <span className="text-white">{item.name}</span>
                      <div className="text-right">
                        <span className="text-gray-500 font-semibold">{item.tx} Transaksi</span>
                        <span className="text-white ml-3">{formatCurrency(item.amount)}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-2.5 font-black border-t border-[#131d35] text-white">
                    <span>Total</span>
                    <div className="text-right">
                      <span className="text-gray-400">2.847 Transaksi</span>
                      <span className="ml-3 text-blue-400">{formatCurrency(4351560000)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grafik Rekonsiliasi (30 Hari Terakhir) */}
              <div className="md:col-span-7 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Grafik Rekonsiliasi (30 Hari Terakhir)</h4>
                
                <div className="h-36 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#131d35" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#131d35" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#131d35" strokeDasharray="3 3" />
                    
                    <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">400</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">200</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">100</text>
                    
                    {/* Lines */}
                    <path d="M20,38 L60,50 L100,45 L140,40 L180,48 L220,30 L260,25" fill="none" stroke="#10b981" strokeWidth="2" />
                    <path d="M20,80 L60,82 L100,78 L140,85 L180,72 L220,68 L260,65" fill="none" stroke="#f97316" strokeWidth="1.5" />
                    <path d="M20,95 L60,92 L100,95 L140,90 L180,92 L220,89 L260,88" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                    <path d="M20,98 L60,99 L100,98 L140,99 L180,98 L220,99 L260,98" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    
                    <text x="15" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">02 Jun</text>
                    <text x="55" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">06 Jun</text>
                    <text x="95" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">10 Jun</text>
                    <text x="135" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">14 Jun</text>
                    <text x="175" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">18 Jun</text>
                    <text x="215" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">22 Jun</text>
                    <text x="255" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">26 Jun</text>
                    <text x="285" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                  </svg>
                </div>

                <div className="flex justify-center gap-3.5 text-[8px] text-gray-500 font-bold uppercase pt-1">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-green-500 inline-block"></span>Cocok</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>Tidak Cocok</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-orange-500 inline-block"></span>Selisih</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span>Duplikat</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Rekonsiliasi Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Rekonsiliasi</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Cocok: 71.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="71.6 28.4" 
                    strokeDashoffset="0" 
                  />

                  {/* Tidak Cocok: 28.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray="28.4 71.6" 
                    strokeDashoffset="-71.6" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-base font-black text-white leading-none">183</p>
                  <p className="text-[7px] text-gray-500 font-bold uppercase mt-0.5">Total Transaksi</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-green-500" />Cocok</span>
                  <span className="text-white font-bold">131 (71.6%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500" />Tidak Cocok</span>
                  <span className="text-white font-bold">52 (28.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" />Selisih</span>
                  <span className="text-white font-bold">28 (15.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-purple-550 bg-purple-500" />Duplikat</span>
                  <span className="text-white font-bold">12 (6.6%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-gray-500" />Belum Rekonsiliasi</span>
                  <span className="text-white font-bold">183 (100%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Ringkasan Nilai */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Nilai</h3>
              
              <div className="space-y-3 text-xs text-gray-400 font-semibold pt-1">
                <div className="flex justify-between">
                  <span>Total Nilai Masuk</span>
                  <span className="text-white font-bold">Rp 2.847.560.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Cocok</span>
                  <span className="text-green-400">Rp 2.612.850.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Tidak Cocok</span>
                  <span className="text-red-400">Rp 156.230.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Selisih</span>
                  <span className="text-orange-400">Rp 78.480.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Belum Rekonsiliasi</span>
                  <span className="text-gray-400">Rp 183.000.000</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#131d35] items-center">
                  <span>Persentase Cocok</span>
                  <span className="text-green-400 font-black text-sm">91.75%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Aktivitas Terbaru */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terbaru</h3>
              
              <div className="relative border-l border-[#131d35] ml-2 pl-4 space-y-4 text-[9px] text-gray-500 font-bold">
                {[
                  { title: 'Rekonsiliasi otomatis dijalankan', time: '01/07/2026 08:32 WIB' },
                  { title: 'Pembayaran TRX-20260701-0004 ditandai selisih', time: '01/07/2026 07:40 WIB' },
                  { title: 'Pembayaran TRX-20260701-0005 ditandai tidak cocok', time: '01/07/2026 07:22 WIB' },
                  { title: 'Statement BCA diimport', time: '01/07/2026 06:30 WIB' },
                  { title: 'Rekonsiliasi manual dilakukan oleh Agus Dwi Rianto', time: '01/07/2026 06:15 WIB' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[#070c19] bg-blue-500"></span>
                    <span className="text-white block leading-none">{item.title}</span>
                    <span className="text-gray-500 text-[8px] font-semibold mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[#131d35] block">
                Lihat Semua Aktivitas &rarr;
              </button>
            </div>

            {/* Card 4: Aksi Cepat */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h3>
              
              <div className="space-y-2 text-[10px] font-bold text-gray-400">
                {[
                  { name: 'Jalankan Rekonsiliasi Otomatis', desc: 'Cocokkan transaksi secara massal' },
                  { name: 'Rekonsiliasi Manual', desc: 'Pilih transaksi untuk rekonsiliasi manual' },
                  { name: 'Upload Statement Bank', desc: 'Import mutasi rekening bank' },
                  { name: 'Download Laporan Rekonsiliasi', desc: 'Export laporan hasil rekonsiliasi' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#080d19] border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 cursor-pointer transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-white leading-none">{item.name}</p>
                      <p className="text-[8px] text-gray-500 font-normal mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-500" />
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
