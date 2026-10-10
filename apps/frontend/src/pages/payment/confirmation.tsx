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
  Copy,
  ArrowLeft,
  Upload,
  ZoomIn
} from 'lucide-react';

interface ConfirmationLog {
  date: string;
  verifiedBy: string;
  status: string;
  notes: string;
  extraProof: string;
  statusType: 'green' | 'blue';
}

const mockLogs: ConfirmationLog[] = [
  {
    date: '01/07/2026 08:32',
    verifiedBy: 'Sistem',
    status: 'Diterima',
    notes: 'Pembayaran diterima, menunggu verifikasi admin',
    extraProof: '-',
    statusType: 'green'
  },
  {
    date: '01/07/2026 08:35',
    verifiedBy: 'Agus Dwi Rianto',
    status: 'Verifikasi',
    notes: 'Sedang dalam proses verifikasi bukti pembayaran',
    extraProof: '-',
    statusType: 'blue'
  }
];

export default function PaymentConfirmationPage() {
  const [selectedStatus, setSelectedStatus] = useState('Terima');
  const [notes, setNotes] = useState('Pembayaran sesuai dengan invoice. Terima kasih.');

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
              <span>Konfirmasi Pembayaran</span>
              <span>&gt;</span>
              <span className="text-blue-400">Detail</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Konfirmasi Pembayaran</h1>
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

        {/* ─── Top Stepper/Action Row ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white leading-none">Konfirmasi Pembayaran</h2>
            <p className="text-[10px] text-gray-500 font-semibold">Tinjau dan verifikasi bukti pembayaran dari customer</p>
          </div>

          <button className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all border-gray-800">
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar</span>
          </button>
        </div>

        {/* ─── Stepper Widget ────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-4 lg:gap-8 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold">1</span>
              <div>
                <p className="text-white leading-none">Menunggu Konfirmasi</p>
                <p className="text-[9px] text-gray-500 mt-0.5 font-medium">Pembayaran belum dikonfirmasi</p>
              </div>
            </div>
            
            <div className="hidden lg:block w-16 h-0.5 bg-[#131d35]"></div>

            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold">2</span>
              <div>
                <p className="text-white leading-none">Verifikasi Pembayaran</p>
                <p className="text-[9px] text-gray-500 mt-0.5 font-medium">Periksa bukti & detail pembayaran</p>
              </div>
            </div>

            <div className="hidden lg:block w-16 h-0.5 bg-[#131d35]"></div>

            <div className="flex items-center gap-3 opacity-60">
              <span className="w-7 h-7 rounded-full bg-[#101935] border border-[#1e2e58] text-gray-400 flex items-center justify-center font-bold">3</span>
              <div>
                <p className="text-gray-300 leading-none">Proses Pembayaran</p>
                <p className="text-[9px] text-gray-500 mt-0.5 font-medium">Sedang diproses</p>
              </div>
            </div>

            <div className="hidden lg:block w-16 h-0.5 bg-[#131d35]"></div>

            <div className="flex items-center gap-3 opacity-60">
              <span className="w-7 h-7 rounded-full bg-[#101935] border border-[#1e2e58] text-gray-400 flex items-center justify-center font-bold">4</span>
              <div>
                <p className="text-gray-300 leading-none">Selesai</p>
                <p className="text-[9px] text-gray-500 mt-0.5 font-medium">Pembayaran berhasil dikonfirmasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Details & Verification Form */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Invoice & Payment Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Detail Invoice Card */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Detail Invoice</h4>
                  
                  <div className="space-y-3.5 mt-4 text-xs font-semibold text-gray-400">
                    <div className="flex justify-between items-center">
                      <span>No Invoice</span>
                      <div className="flex items-center gap-1.5 text-white font-bold font-mono">
                        <span>INV/2026/07/0012</span>
                        <Copy size={12} className="text-gray-500 cursor-pointer hover:text-white" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer</span>
                      <span className="text-white font-bold">Budi Santoso</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paket / Layanan</span>
                      <span className="text-white font-bold">Internet 100 Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Periode</span>
                      <span className="text-white">01 Juli 2026 - 31 Juli 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tgl Jatuh Tempo</span>
                      <span className="text-white">15 Juli 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tagihan</span>
                      <span className="text-white font-bold">Rp 1.200.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sisa Tagihan</span>
                      <span className="text-red-500 font-bold">Rp 1.200.000</span>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-gray-300 text-xs font-bold py-2.5 rounded-xl transition-all border-gray-800 mt-4">
                  <FileText size={13} />
                  <span>Lihat Detail Invoice</span>
                </button>
              </div>

              {/* Informasi Pembayaran Card */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Informasi Pembayaran</h4>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="space-y-0.5">
                    <span>No Referensi</span>
                    <div className="flex items-center gap-1 text-white font-bold font-mono">
                      <span>TRX-20260701-0001</span>
                      <Copy size={11} className="text-gray-500 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span>Keterangan</span>
                    <p className="text-white text-[10px] leading-tight">Pembayaran tagihan internet bulan Juli 2026</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Metode Pembayaran</span>
                    <p className="text-white font-bold">Transfer Bank - BCA</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Channel</span>
                    <p className="text-white">Mobile Banking</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Tanggal Transfer</span>
                    <p className="text-white">01 Juli 2026 08:32 WIB</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>No Rekening Pengirim</span>
                    <p className="text-white font-mono">1234 5678 9012</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Atas Nama Pengirim</span>
                    <p className="text-white font-bold">Budi Santoso</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>No Rekening Tujuan</span>
                    <p className="text-white font-mono">1234 5678 9999</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Bank Tujuan</span>
                    <p className="text-white">BCA (Bank Central Asia)</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Status Otomatis</span>
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold inline-block mt-0.5">
                      Menunggu
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span>Jumlah Transfer</span>
                    <p className="text-white font-bold">Rp 1.200.000</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Dibuat Pada</span>
                    <p className="text-white text-[10px]">01 Juli 2026 08:32 WIB</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Biaya Admin</span>
                    <p className="text-white">Rp 0</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Total Diterima</span>
                    <p className="text-blue-400 font-bold">Rp 1.200.000</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Riwayat Konfirmasi Table */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Riwayat Konfirmasi</h4>
              
              <div className="overflow-x-auto border border-[#131d35] rounded-xl">
                <table className="w-full text-left border-collapse text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3 w-40">TANGGAL</th>
                      <th className="p-3 w-44">DIVERIFIKASI OLEH</th>
                      <th className="p-3 w-32">STATUS</th>
                      <th className="p-3">CATATAN</th>
                      <th className="p-3 w-40">BUKTI TAMBAHAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]">
                    {mockLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-[#121c38]/40 transition-colors">
                        <td className="p-3 text-gray-500 font-medium">{log.date}</td>
                        <td className="p-3 font-bold text-white">{log.verifiedBy}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                            log.statusType === 'green'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-300 font-medium">{log.notes}</td>
                        <td className="p-3 text-gray-500 font-medium">{log.extraProof}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verifikasi Pembayaran (Form) */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Verifikasi Pembayaran</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Status Radio Group */}
                <div className="md:col-span-4 space-y-3.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Status Konfirmasi</span>
                  
                  <div className="space-y-3 text-xs font-semibold text-gray-400">
                    <label 
                      onClick={() => setSelectedStatus('Terima')}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-[#121c38]/30 transition-all ${
                        selectedStatus === 'Terima' ? 'bg-[#0052cc]/5 border-[#0052cc]' : 'bg-[#080d19] border-[#131d35]'
                      }`}
                    >
                      <input type="radio" name="confirmStatus" checked={selectedStatus === 'Terima'} readOnly className="bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-white font-bold">Terima Pembayaran</p>
                        <p className="text-[9px] text-gray-500 font-normal mt-0.5">Pembayaran sesuai dan akan diproses</p>
                      </div>
                    </label>

                    <label 
                      onClick={() => setSelectedStatus('Tolak')}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-[#121c38]/30 transition-all ${
                        selectedStatus === 'Tolak' ? 'bg-red-500/5 border-red-500' : 'bg-[#080d19] border-[#131d35]'
                      }`}
                    >
                      <input type="radio" name="confirmStatus" checked={selectedStatus === 'Tolak'} readOnly className="bg-[#080d19] border-[#131d35] text-red-600 focus:ring-0 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-white font-bold">Tolak Pembayaran</p>
                        <p className="text-[9px] text-gray-500 font-normal mt-0.5">Pembayaran tidak valid atau tidak sesuai</p>
                      </div>
                    </label>

                    <label 
                      onClick={() => setSelectedStatus('Minta')}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-[#121c38]/30 transition-all ${
                        selectedStatus === 'Minta' ? 'bg-yellow-500/5 border-yellow-500' : 'bg-[#080d19] border-[#131d35]'
                      }`}
                    >
                      <input type="radio" name="confirmStatus" checked={selectedStatus === 'Minta'} readOnly className="bg-[#080d19] border-[#131d35] text-yellow-600 focus:ring-0 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-white font-bold">Minta Perbaikan</p>
                        <p className="text-[9px] text-gray-500 font-normal mt-0.5">Butuh informasi atau bukti tambahan</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Catatan Konfirmasi */}
                <div className="md:col-span-5 space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Catatan Konfirmasi <span className="text-red-500">*</span></span>
                  <textarea 
                    rows={7} 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none resize-none" 
                  />
                  <span className="text-[9px] text-gray-500 font-semibold block text-right">50/500</span>
                </div>

                {/* Bukti Tambahan */}
                <div className="md:col-span-3 space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Bukti Tambahan (Opsional)</span>
                  <div className="border border-dashed border-[#1e2e58] bg-[#080d19] rounded-xl p-5 h-44 flex flex-col items-center justify-center cursor-pointer hover:bg-[#121c38]/40 transition-colors">
                    <Upload size={24} className="text-blue-400 mb-2" />
                    <span className="text-[9px] text-gray-400 font-bold text-center">Klik untuk upload atau drag & drop</span>
                    <span className="text-[8px] text-gray-500 font-semibold text-center mt-1">PNG, JPG, PDF (Max. 5MB)</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center border-t border-[#131d35]/60 pt-4">
                <button className="text-xs font-bold text-gray-400 hover:text-white px-5 py-2.5 border border-[#131d35] rounded-xl hover:bg-[#121c38]/40 transition-colors">
                  Batal
                </button>
                
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 bg-[#10b981] hover:bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">
                    <CheckCircle size={14} />
                    <span>Simpan & Proses</span>
                  </button>

                  <button className="flex items-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">
                    <CheckCircle size={14} />
                    <span>Simpan</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Bukti Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Bukti Pembayaran</h3>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                  Valid
                </span>
              </div>

              {/* Sample Bank Receipt Image box */}
              <div className="bg-[#080d19] border border-[#131d35] p-3 rounded-xl flex items-center justify-center h-44 overflow-hidden relative group">
                <div className="bg-white p-4 w-32 rounded text-[5px] text-gray-800 shadow-md flex flex-col justify-between h-36">
                  <div>
                    <h5 className="font-extrabold text-[7px] text-blue-900 leading-tight">Bank Mandiri</h5>
                    <p className="text-[4px] text-gray-400">STRUK TRANSAKSI TRANSFER</p>
                  </div>
                  <div className="border-t border-b border-gray-100 py-1 space-y-1">
                    <div className="flex justify-between"><span>Dari</span><span className="font-bold">Budi Santoso</span></div>
                    <div className="flex justify-between"><span>Ke</span><span className="font-bold">Audira NET</span></div>
                    <div className="flex justify-between"><span>Jumlah</span><span className="font-bold">Rp 1.200.000</span></div>
                  </div>
                  <p className="text-center text-[4px] text-green-500 font-extrabold uppercase tracking-wide">SUKSES</p>
                </div>
              </div>

              {/* File Info details */}
              <div className="text-[11px] text-gray-400 font-semibold space-y-2 border-b border-[#131d35] pb-3">
                <div className="flex justify-between">
                  <span>Nama File</span>
                  <span className="text-white font-mono font-bold">bukti-transfer-budi-santoso.jpg</span>
                </div>
                <div className="flex justify-between">
                  <span>Ukuran File</span>
                  <span className="text-white">1.25 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipe File</span>
                  <span className="text-white">image/jpeg</span>
                </div>
                <div className="flex justify-between">
                  <span>Upload Pada</span>
                  <span className="text-white">01 Juli 2026 08:32 WIB</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-[9px] font-bold text-gray-300 transition-colors">
                  <Eye size={12} className="mb-1" />
                  <span>Lihat</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-[9px] font-bold text-gray-300 transition-colors">
                  <Download size={12} className="mb-1" />
                  <span>Unduh</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-[9px] font-bold text-gray-300 transition-colors">
                  <ZoomIn size={12} className="mb-1" />
                  <span>Zoom</span>
                </button>
              </div>

              {/* Notice */}
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex gap-2.5 text-green-400 leading-normal text-[10px] font-bold">
                <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>Bukti pembayaran terlihat jelas dan dapat dibaca. Semua informasi penting teridentifikasi dengan baik.</span>
              </div>
            </div>

            {/* Card 2: Ringkasan Konfirmasi */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Konfirmasi</h3>
              
              <div className="space-y-3 text-xs text-gray-400 font-semibold pt-1">
                <div className="flex justify-between">
                  <span>Invoice</span>
                  <span className="text-white font-mono font-bold">INV/2026/07/0012</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer</span>
                  <span className="text-white">Budi Santoso</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tagihan</span>
                  <span className="text-white">Rp 1.200.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Transfer</span>
                  <span className="text-white">Rp 1.200.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Selisih</span>
                  <span className="text-green-400 font-bold">Rp 0</span>
                </div>
                <div className="flex justify-between">
                  <span>Persentase</span>
                  <span className="text-white">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                    Sesuai
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Aktivitas Terbaru */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terbaru</h3>
              
              <div className="relative border-l border-[#131d35] ml-2 pl-4 space-y-4 text-[9px] text-gray-500 font-bold">
                {[
                  { title: 'Pembayaran dibuat oleh customer', time: '01/07/2026 08:32 WIB' },
                  { title: 'Bukti pembayaran diupload', time: '01/07/2026 08:32 WIB' },
                  { title: 'Menunggu verifikasi admin', time: '01/07/2026 08:32 WIB' },
                  { title: 'Sedang diverifikasi', time: '01/07/2026 08:35 WIB' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[#070c19] bg-blue-500"></span>
                    <span className="text-white block leading-none">{item.title}</span>
                    <span className="text-gray-500 text-[8px] font-semibold mt-1 block">{item.time}</span>
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
