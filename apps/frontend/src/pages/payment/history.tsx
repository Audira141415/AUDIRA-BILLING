import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
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
  Info
} from 'lucide-react';

interface PaymentHistoryRow {
  id: string;
  date: string;
  type: 'Payment' | 'Refund' | 'Void';
  refNo: string;
  invoiceNo: string;
  customerName: string;
  method: string;
  channel: string;
  amount: number;
  status: 'Berhasil' | 'Menunggu' | 'Refund Selesai' | 'Void Selesai' | 'Refund Proses';
  note: string;
}

const mockHistoryData: PaymentHistoryRow[] = [
  { id: '1', date: '22/10/2026 08:32', type: 'Payment', refNo: 'PAY-20260701-0001', invoiceNo: 'INV/2026/07/0012', customerName: 'Budi Santoso', method: 'Transfer Bank - BCA', channel: 'Mobile Banking', amount: 1200000, status: 'Berhasil', note: '-' },
  { id: '2', date: '22/10/2026 08:16', type: 'Payment', refNo: 'PAY-20260701-0002', invoiceNo: 'INV/2026/07/0011', customerName: 'Siti Aminah', method: 'QRIS', channel: 'QR Code', amount: 450000, status: 'Berhasil', note: '-' },
  { id: '3', date: '22/10/2026 07:58', type: 'Payment', refNo: 'PAY-20260701-0003', invoiceNo: 'INV/2026/07/0010', customerName: 'Andi Pratama', method: 'Transfer Bank - BRI', channel: 'Internet Banking', amount: 2200000, status: 'Berhasil', note: '-' },
  { id: '4', date: '22/10/2026 07:40', type: 'Payment', refNo: 'PAY-20260701-0004', invoiceNo: 'INV/2026/07/0009', customerName: 'Dewi Lestari', method: 'OVO', channel: 'E-Wallet', amount: 350000, status: 'Menunggu', note: 'Menunggu verifikasi' },
  { id: '5', date: '22/10/2026 07:22', type: 'Payment', refNo: 'PAY-20260701-0005', invoiceNo: 'INV/2026/07/0008', customerName: 'Fajar Nugroho', method: 'DANA', channel: 'E-Wallet', amount: 900000, status: 'Menunggu', note: 'Menunggu verifikasi' },
  { id: '6', date: '22/10/2026 06:51', type: 'Payment', refNo: 'PAY-20260701-0006', invoiceNo: 'INV/2026/07/0007', customerName: 'Nina Wulandari', method: 'Transfer Bank - BCA', channel: 'Mobile Banking', amount: 250000, status: 'Berhasil', note: '-' },
  { id: '7', date: '22/10/2026 06:45', type: 'Refund', refNo: 'RFND-20260701-0001', invoiceNo: 'INV/2026/07/0006', customerName: 'Yudi Hermawan', method: 'Virtual Account - BCA', channel: 'VA', amount: 1300000, status: 'Refund Selesai', note: 'Refund 100%' },
  { id: '8', date: '30/06/2026 16:12', type: 'Payment', refNo: 'PAY-20260630-0001', invoiceNo: 'INV/2026/06/0099', customerName: 'PT. Maju Bersama', method: 'Transfer Bank - Mandiri', channel: 'Internet Banking', amount: 3500000, status: 'Berhasil', note: '-' },
  { id: '9', date: '30/06/2026 15:31', type: 'Void', refNo: 'VOID-20260630-0001', invoiceNo: 'INV/2026/06/0098', customerName: 'CV. Sinar Abadi', method: 'QRIS', channel: 'QR Code', amount: 1100000, status: 'Void Selesai', note: 'Salah Input' },
  { id: '10', date: '30/06/2026 14:46', type: 'Payment', refNo: 'PAY-20260630-0002', invoiceNo: 'INV/2026/06/0097', customerName: 'Rina Marlina', method: 'ShopeePay', channel: 'E-Wallet', amount: 750000, status: 'Berhasil', note: '-' },
  { id: '11', date: '30/06/2026 13:20', type: 'Payment', refNo: 'PAY-20260629-0003', invoiceNo: 'INV/2026/06/0096', customerName: 'Putri Handayani', method: 'Virtual Account - BNI', channel: 'VA', amount: 2800000, status: 'Berhasil', note: '-' },
  { id: '12', date: '29/06/2026 20:15', type: 'Payment', refNo: 'PAY-20260629-0001', invoiceNo: 'INV/2026/06/0095', customerName: 'Bambang Setiawan', method: 'Transfer Bank - BCA', channel: 'Mobile Banking', amount: 480000, status: 'Berhasil', note: '-' },
  { id: '13', date: '29/06/2026 18:40', type: 'Payment', refNo: 'PAY-20260629-0002', invoiceNo: 'INV/2026/06/0094', customerName: 'Nadya Putri', method: 'DANA', channel: 'E-Wallet', amount: 330000, status: 'Berhasil', note: '-' },
  { id: '14', date: '29/06/2026 18:20', type: 'Refund', refNo: 'RFND-20260629-0001', invoiceNo: 'INV/2026/06/0093', customerName: 'Iwan Kurniawan', method: 'Transfer Bank - BRI', channel: 'Internet Banking', amount: 600000, status: 'Refund Proses', note: 'Refund 50%' },
  { id: '15', date: '29/06/2026 17:30', type: 'Payment', refNo: 'PAY-20260629-0003', invoiceNo: 'INV/2026/06/0092', customerName: 'Agus Dwi Rianto', method: 'QRIS', channel: 'QR Code', amount: 521000, status: 'Berhasil', note: '-' }
];

export default function PaymentHistoryPage() {
  const router = useRouter();
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
              <Link href="/payment" className="hover:text-[var(--app-text)]">Kasir & Pembayaran</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Riwayat Transaksi</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Buku Riwayat Pembayaran & Kas Masuk
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Catatan seluruh transaksi masuk melalui Payment Gateway (Midtrans, QRIS), Bank Transfer, dan Petugas Kolektor.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/finance/transaksi" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Jurnal Umum</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Card 1: Total Transaksi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Transaksi</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.847</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">+12.8% dari periode lalu</p>
            </div>
          </div>

          {/* Card 2: Total Pembayaran */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Pembayaran</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">Rp 2.847.560.000</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">+15.2% dari periode lalu</p>
            </div>
          </div>

          {/* Card 3: Berhasil */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Berhasil</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.612</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">(91.75%) +13.1%</p>
            </div>
          </div>

          {/* Card 4: Menunggu */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Menunggu</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">156</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">(5.48%) -2.1%</p>
            </div>
          </div>

          {/* Card 5: Gagal */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Gagal</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">78</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">(2.74%) +1.2%</p>
            </div>
          </div>

          {/* Card 6: Refund & Void */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Refund & Void</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">234</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">(8.23%) +3.6%</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date range */}
            <div className="flex items-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] px-3 py-2.5 rounded-xl text-xs text-[var(--app-text)]/80 cursor-pointer">
              <Calendar size={14} className="text-[var(--app-muted)]" />
              <span>01/06/2026 - 22/10/2026</span>
            </div>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Tipe</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Metode</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Channel</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>
            
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, referensi..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button onClick={() => alert("Penyaringan data diterapkan berdasarkan parameter yang dipilih.")} className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table & Bottom charts */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[var(--app-border)] bg-white/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Daftar Riwayat Payment</h3>
                <button onClick={() => alert("Mengekspor seluruh riwayat pembayaran ke CSV...")} className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-all border-gray-800">
                  <Download size={12} className="text-[var(--app-muted)]" />
                  <span>Export</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4">TANGGAL</th>
                      <th className="p-4 w-24">TIPE</th>
                      <th className="p-4">REFERENSI</th>
                      <th className="p-4">INVOICE</th>
                      <th className="p-4">CUSTOMER</th>
                      <th className="p-4">METODE</th>
                      <th className="p-4">CHANNEL</th>
                      <th className="p-4">NILAI</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4">KETERANGAN</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {mockHistoryData.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-[var(--app-border)]/20 transition-colors">
                        <td className="p-4 text-[var(--app-muted)] font-medium">{idx + 1}</td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                            d.type === 'Payment' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : d.type === 'Refund'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {d.type}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-[var(--app-muted)]">{d.refNo}</td>
                        <td className="p-4 font-mono font-semibold text-blue-400">{d.invoiceNo}</td>
                        <td className="p-4 font-bold text-[var(--app-text)]">{d.customerName}</td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.method}</td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.channel}</td>
                        <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.amount)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                            d.status === 'Berhasil' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : d.status === 'Menunggu'
                              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                              : d.status === 'Refund Selesai'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : d.status === 'Refund Proses'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.note}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => alert("Membuka rincian bukti bayar...")} className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"><Eye size={13} /></button>
                            <button onClick={() => alert("Opsi tindakan: Kirim Kuitansi WhatsApp, Void Pembayaran.")} className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"><MoreVertical size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-white/60">
                <span className="text-xs text-[var(--app-muted)]">
                  Menampilkan <span className="font-semibold text-white">1 - 15</span> dari <span className="font-semibold text-white">2.847</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert("Halaman pertama sudah tercapai.")} className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
                      <ChevronLeft size={14} />
                    </button>
                    <button onClick={() => alert("Halaman 1 saat ini aktif.")} className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button onClick={() => alert("Beralih ke halaman 2")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                    <button onClick={() => alert("Beralih ke halaman 3")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">3</button>
                    <span className="text-gray-600 text-xs px-1">...</span>
                    <button onClick={() => alert("Beralih ke halaman 190")} className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">190</button>
                    <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)]/80 focus:outline-none"
                  >
                    <option value={15}>15 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Row: Statistik Harian & Aksi Cepat */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Statistik Harian */}
              <div className="lg:col-span-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)] font-sans">Statistik Harian (30 Hari Terakhir)</h4>
                
                <div className="h-44 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                    
                    <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">300</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">200</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">100</text>
                    
                    {[
                      { x: 30, h1: 45, h2: 12, h3: 8, h4: 4 },
                      { x: 50, h1: 52, h2: 10, h3: 6, h4: 3 },
                      { x: 70, h1: 58, h2: 15, h3: 10, h4: 5 },
                      { x: 90, h1: 65, h2: 8, h3: 5, h4: 2 },
                      { x: 110, h1: 72, h2: 14, h3: 12, h4: 6 },
                      { x: 130, h1: 60, h2: 11, h3: 8, h4: 4 },
                      { x: 150, h1: 68, h2: 13, h3: 9, h4: 3 },
                      { x: 170, h1: 75, h2: 16, h3: 11, h4: 5 },
                      { x: 190, h1: 64, h2: 10, h3: 7, h4: 4 },
                      { x: 210, h1: 70, h2: 12, h3: 10, h4: 5 },
                      { x: 230, h1: 78, h2: 18, h3: 13, h4: 7 },
                      { x: 250, h1: 82, h2: 15, h3: 9, h4: 4 },
                      { x: 270, h1: 69, h2: 11, h3: 8, h4: 3 },
                    ].map((bar, idx) => {
                      const total = bar.h1 + bar.h2 + bar.h3 + bar.h4;
                      return (
                        <g key={idx}>
                          {/* Stacked columns */}
                          <rect x={bar.x} y={100 - bar.h1} width="6" height={bar.h1} fill="#10b981" rx="0.5" />
                          <rect x={bar.x} y={100 - bar.h1 - bar.h2} width="6" height={bar.h2} fill="#f97316" rx="0.5" />
                          <rect x={bar.x} y={100 - bar.h1 - bar.h2 - bar.h3} width="6" height={bar.h3} fill="#a855f7" rx="0.5" />
                          <rect x={bar.x} y={100 - total} width="6" height={bar.h4} fill="#ef4444" rx="0.5" />
                        </g>
                      );
                    })}
                    
                    <text x="25" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">02 Jun</text>
                    <text x="65" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">08 Jun</text>
                    <text x="105" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">14 Jun</text>
                    <text x="145" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">20 Jun</text>
                    <text x="185" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">26 Jun</text>
                    <text x="225" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">29 Jun</text>
                    <text x="265" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                  </svg>
                </div>

                <div className="flex justify-center gap-3 text-[8px] text-[var(--app-muted)] font-bold uppercase pt-1">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-green-500 inline-block"></span>Berhasil</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-orange-500 inline-block"></span>Menunggu</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span>Refund</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>Void</span>
                </div>
              </div>

              {/* Aksi Cepat */}
              <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
                
                <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-[var(--app-muted)]">
                  {[
                    { name: 'Verifikasi Pembayaran', desc: 'Proses pembayaran manual', icon: CheckCircle, color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
                    { name: 'Proses Refund', desc: 'Buat refund baru', icon: Wallet, color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
                    { name: 'Proses Void', desc: 'Buat void invoice', icon: XCircle, color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
                    { name: 'Export Laporan', desc: 'Download riwayat payment', icon: Download, color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button 
                        key={idx} 
                        onClick={() => {
                          if (item.name === 'Verifikasi Pembayaran') router.push('/payment/confirmation');
                          else if (item.name === 'Proses Refund') router.push('/finance/pengeluaran');
                          else if (item.name === 'Proses Void') router.push('/invoice/history');
                          else if (item.name === 'Export Laporan') router.push('/invoice/export');
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 transform hover:scale-[1.02] ${item.color}`}
                      >
                        <Icon size={16} className="mb-2" />
                        <p className="text-[10px] font-bold leading-tight">{item.name}</p>
                        <p className="text-[8px] text-gray-505 text-[var(--app-muted)] font-normal mt-0.5 leading-tight">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Metode Pembayaran Donut */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Metode Pembayaran</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Transfer Bank: 65.7% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray="65.7 34.3" 
                    strokeDashoffset="0" 
                  />

                  {/* QRIS: 18.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="18.6 81.4" 
                    strokeDashoffset="-65.7" 
                  />

                  {/* E-Wallet: 12.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                    strokeDasharray="12.1 87.9" 
                    strokeDashoffset="-84.3" 
                  />

                  {/* Virtual Account: 3.0% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="3.0 97.0" 
                    strokeDashoffset="-96.4" 
                  />

                  {/* Lainnya: 0.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6b7280" strokeWidth="4.5" 
                    strokeDasharray="0.6 99.4" 
                    strokeDashoffset="-99.4" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-base font-black text-[var(--app-text)] leading-none">2.847</p>
                  <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase mt-0.5">Total Transaksi</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" />Transfer Bank</span>
                  <span className="text-[var(--app-text)] font-bold">65.7% (Rp 1.872.450.000)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" />QRIS</span>
                  <span className="text-[var(--app-text)] font-bold">18.6% (Rp 529.470.000)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-yellow-500" />E-Wallet</span>
                  <span className="text-[var(--app-text)] font-bold">12.1% (Rp 344.300.000)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-green-500" />Virtual Account</span>
                  <span className="text-[var(--app-text)] font-bold">3.0% (Rp 85.340.000)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-gray-500" />Lainnya</span>
                  <span className="text-[var(--app-text)] font-bold">0.6% (Rp 16.000.000)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Ringkasan Status Payment Donut */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Status Payment</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="120" height="120" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Berhasil: 91.75% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="91.75 8.25" 
                    strokeDashoffset="0" 
                  />

                  {/* Menunggu: 5.48% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray="5.48 94.52" 
                    strokeDashoffset="-91.75" 
                  />

                  {/* Refund/Void: 2.77% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray="2.77 97.23" 
                    strokeDashoffset="-97.23" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-base font-black text-[var(--app-text)] leading-none">2.847</p>
                  <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase mt-0.5">Total Transaksi</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-green-500" />Berhasil</span>
                  <span className="text-[var(--app-text)] font-bold">2.612 (91.75%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-orange-500" />Menunggu</span>
                  <span className="text-[var(--app-text)] font-bold">156 (5.48%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-purple-500" />Refund</span>
                  <span className="text-[var(--app-text)] font-bold">142 (5.00%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-red-500" />Void</span>
                  <span className="text-[var(--app-text)] font-bold">78 (2.74%)</span>
                </div>
              </div>
            </div>

            {/* Card 3: Grafik Transaksi */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Grafik Transaksi</h3>
              
              <div className="h-32 w-full mt-2">
                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                  
                  {/* Lines for Berhasil, Menunggu, Refund, Void */}
                  <path d="M20,68 L70,50 L120,55 L170,40 L220,48 L270,30" fill="none" stroke="#10b981" strokeWidth="2" />
                  <path d="M20,80 L70,82 L120,78 L170,85 L220,72 L270,68" fill="none" stroke="#f97316" strokeWidth="1.5" />
                  <path d="M20,95 L70,92 L120,95 L170,90 L220,92 L270,89" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                  <path d="M20,98 L70,99 L120,98 L170,99 L220,98 L270,99" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  
                  <text x="15" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">02 Jun</text>
                  <text x="65" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">09 Jun</text>
                  <text x="115" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">16 Jun</text>
                  <text x="165" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">23 Jun</text>
                  <text x="215" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">30 Jun</text>
                  <text x="265" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                </svg>
              </div>

              {/* Legends */}
              <div className="flex justify-center gap-2 text-[8px] text-[var(--app-muted)] font-bold uppercase pt-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-green-500 inline-block"></span>Berhasil</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-orange-500 inline-block"></span>Menunggu</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span>Refund</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>Void</span>
              </div>
            </div>

            {/* Card 4: Aktivitas Terbaru */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aktivitas Terbaru</h3>
              
              <div className="relative border-l border-[var(--app-border)] ml-2 pl-4 space-y-4 text-[9px] text-[var(--app-muted)] font-bold">
                {[
                  { title: 'Refund RFND-20260701-0001 diselesaikan', time: '22/10/2026 08:32 WIB' },
                  { title: 'Payment PAY-20260701-0002 terverifikasi', time: '22/10/2026 08:16 WIB' },
                  { title: 'Void VOID-20260630-0001 diselesaikan', time: '30/06/2026 15:31 WIB' },
                  { title: 'Payment PAY-20260701-0003 diterima', time: '22/10/2026 07:58 WIB' },
                  { title: 'Refund RFND-20260629-0001 dalam proses', time: '29/06/2026 18:20 WIB' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[var(--app-border)] bg-blue-500"></span>
                    <span className="text-white block leading-none">{item.title}</span>
                    <span className="text-[var(--app-muted)] text-[8px] font-semibold mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => alert("Membuka seluruh riwayat log aktivitas pembayaran...")} className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[var(--app-border)] block">
                Lihat Semua Aktivitas &rarr;
              </button>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
