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
  Lock,
  Sliders,
  Shield,
  HelpCircle
} from 'lucide-react';

export default function PaymentSettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('umum');
  
  // States for toggle switches
  const [generalSwitches, setGeneralSwitches] = useState({
    showBalance: true,
  });

  const [methodsSwitches, setMethodsSwitches] = useState({
    bankTransfer: true,
    qris: true,
    ewallet: true,
    virtualAccount: true,
    creditCard: false,
    paymentLink: true
  });

  const [invoiceSwitches, setInvoiceSwitches] = useState({
    autoGenerate: true,
    autoSend: true,
    attachTnC: true,
    showPackage: true,
    showHistory: true
  });

  const [paymentSwitches, setPaymentSwitches] = useState({
    autoConfirm: true,
    manualVerify: true,
    feeCut: false
  });

  const [notifySwitches, setNotifySwitches] = useState({
    email: true,
    whatsapp: true,
    telegram: false,
    reminder: true
  });

  const [securitySwitches, setSecuritySwitches] = useState({
    logActivity: true,
    twoStep: true
  });

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
              <span className="text-blue-400">Pengaturan Payment</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pengaturan Payment</h1>
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

        {/* ─── Description & Global Save Button ────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white leading-none">Pengaturan Payment</h2>
            <p className="text-[10px] text-gray-500 font-semibold">Kelola konfigurasi sistem pembayaran sesuai kebutuhan bisnis Anda.</p>
          </div>

          <button className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">
            Simpan Pengaturan
          </button>
        </div>

        {/* ─── Sub-tabs Navigation ───────────────────────────────────────── */}
        <div className="flex flex-wrap border-b border-[#131d35] text-xs font-bold text-gray-500 gap-1 md:gap-2 pb-px overflow-x-auto">
          {[
            { id: 'umum', label: 'Umum' },
            { id: 'metode', label: 'Metode Pembayaran' },
            { id: 'invoice', label: 'Invoice & Tagihan' },
            { id: 'notifikasi', label: 'Notifikasi' },
            { id: 'keamanan', label: 'Keamanan' },
            { id: 'pajak', label: 'Pajak & Biaya' },
            { id: 'integrasi', label: 'Integrasi' },
            { id: 'lainnya', label: 'Lainnya' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 px-4 border-b-2 transition-all ${
                activeSubTab === tab.id ? 'border-blue-500 text-white font-bold' : 'border-transparent hover:text-gray-300'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── Main content Grid (3 columns) ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ─── COLUMN 1 ─── */}
          <div className="space-y-6">
            {/* Card 1: Pengaturan Umum */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Umum</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Mata Uang Default</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Rupiah (IDR)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Format Nomor Invoice</span>
                  <input type="text" defaultValue="INV-{YYYY}/{MM}/{00001}" className="w-full bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Format Nomor Transaksi</span>
                  <input type="text" defaultValue="TRX-{YYYY}{MM}{00001}" className="w-full bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Zone Waktu</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Asia/Jakarta (GMT+7)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Tanggal Default Invoice</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Tanggal Pembuatan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Batas Waktu Pembayaran Default</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="3" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                    <span>Hari</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span>Tampilkan Saldo di Customer</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={generalSwitches.showBalance} onChange={() => setGeneralSwitches(p => ({ ...p, showBalance: !p.showBalance }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Pembulatan Nilai</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Tanpa Pembulatan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 2: Pengaturan Invoice */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Invoice</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Auto Generate Invoice</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.autoGenerate} onChange={() => setInvoiceSwitches(p => ({ ...p, autoGenerate: !p.autoGenerate }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Auto Send Invoice</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.autoSend} onChange={() => setInvoiceSwitches(p => ({ ...p, autoSend: !p.autoSend }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Invoice PDF Template</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Default Template</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span>Lampirkan Syarat & Ketentuan</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.attachTnC} onChange={() => setInvoiceSwitches(p => ({ ...p, attachTnC: !p.attachTnC }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Tampilkan Detail Paket</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.showPackage} onChange={() => setInvoiceSwitches(p => ({ ...p, showPackage: !p.showPackage }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Tampilkan Riwayat Pembayaran</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.showHistory} onChange={() => setInvoiceSwitches(p => ({ ...p, showHistory: !p.showHistory }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Watermark Invoice</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Logo Perusahaan</option>
                  </select>
                </div>
              </div>

              <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-3 border-t border-[#131d35] block">
                Kelola Template Invoice &rarr;
              </button>
            </div>

            {/* Card 3: Integrasi Sistem */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Integrasi Sistem</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                {[
                  { name: 'Integrasi Bank (API)', status: 'Aktif', active: true },
                  { name: 'Midtrans / Payment Gateway', status: 'Aktif', active: true },
                  { name: 'Xendit Payment Gateway', status: 'Tidak Aktif', active: false },
                  { name: 'WhatsApp Business API', status: 'Aktif', active: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-[#131d35]/40 last:border-0 pb-2">
                    <div className="space-y-0.5">
                      <p className="text-white font-bold">{item.name}</p>
                      <span className={`text-[9px] font-bold ${item.active ? 'text-green-400' : 'text-red-400'}`}>
                        {item.status}
                      </span>
                    </div>
                    <button className="text-[10px] font-bold text-gray-400 hover:text-white px-3 py-1.5 border border-[#131d35] rounded-lg">
                      Konfigurasi
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-3 border-t border-[#131d35] block">
                Kelola Integrasi &rarr;
              </button>
            </div>

          </div>

          {/* ─── COLUMN 2 ─── */}
          <div className="space-y-6">
            
            {/* Card 1: Pengaturan Status Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Status Pembayaran</h3>
              
              <div className="space-y-3 text-[10px] font-bold text-gray-400">
                <div className="flex justify-between items-center border-b border-[#131d35]/40 pb-2 text-[9px] text-gray-500 uppercase tracking-wider">
                  <span>Status</span>
                  <span>Keterangan Default</span>
                </div>
                {[
                  { name: 'Berhasil', color: 'bg-green-500/10 text-green-400 border border-green-500/20', desc: 'Pembayaran berhasil diterima' },
                  { name: 'Menunggu', color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20', desc: 'Menunggu konfirmasi / proses' },
                  { name: 'Gagal', color: 'bg-red-500/10 text-red-400 border border-red-500/20', desc: 'Pembayaran gagal / ditolak' },
                  { name: 'Refund', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', desc: 'Dana dikembalikan ke customer' },
                  { name: 'Void', color: 'bg-gray-500/10 text-gray-400 border border-gray-500/20', desc: 'Transaksi dibatalkan' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded ${item.color}`}>{item.name}</span>
                    <span className="text-white text-right leading-none">{item.desc}</span>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-3 border-t border-[#131d35] block">
                Kelola Status &rarr;
              </button>
            </div>

            {/* Card 2: Pengaturan Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Pembayaran</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Konfirmasi Otomatis</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={paymentSwitches.autoConfirm} onChange={() => setPaymentSwitches(p => ({ ...p, autoConfirm: !p.autoConfirm }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Verifikasi Manual Diperlukan</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={paymentSwitches.manualVerify} onChange={() => setPaymentSwitches(p => ({ ...p, manualVerify: !p.manualVerify }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Batas Maksimal Refund (%)</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="100" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                    <span>%</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Batas Maksimal Void (Jam)</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="24" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                    <span>Jam</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Default Rekening Penerima</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>BCA - 1234 5678 9012</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span>Potong Biaya Admin ke Customer</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={paymentSwitches.feeCut} onChange={() => setPaymentSwitches(p => ({ ...p, feeCut: !p.feeCut }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Simpan Bukti Pembayaran (Hari)</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="365" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                    <span>Hari</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Keamanan & Akses */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Keamanan & Akses</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Role yang Dapat Akses</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Semua Role</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Akses Edit Pembayaran</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Finance & Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Akses Refund & Void</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>Super Admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span>Log Aktivitas Payment</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={securitySwitches.logActivity} onChange={() => setSecuritySwitches(p => ({ ...p, logActivity: !p.logActivity }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Verifikasi 2 Langkah</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={securitySwitches.twoStep} onChange={() => setSecuritySwitches(p => ({ ...p, twoStep: !p.twoStep }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-3 border-t border-[#131d35] block">
                Kelola Role & Permission &rarr;
              </button>
            </div>

          </div>

          {/* ─── COLUMN 3 ─── */}
          <div className="space-y-6">
            
            {/* Card 1: Pengaturan Metode Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Metode Pembayaran</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Aktifkan Transfer Bank</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.bankTransfer} onChange={() => setMethodsSwitches(p => ({ ...p, bankTransfer: !p.bankTransfer }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Aktifkan QRIS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.qris} onChange={() => setMethodsSwitches(p => ({ ...p, qris: !p.qris }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Aktifkan E-Wallet</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.ewallet} onChange={() => setMethodsSwitches(p => ({ ...p, ewallet: !p.ewallet }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Aktifkan Virtual Account</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.virtualAccount} onChange={() => setMethodsSwitches(p => ({ ...p, virtualAccount: !p.virtualAccount }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Aktifkan Credit Card / Gateway</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.creditCard} onChange={() => setMethodsSwitches(p => ({ ...p, creditCard: !p.creditCard }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Aktifkan Payment Link</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.paymentLink} onChange={() => setMethodsSwitches(p => ({ ...p, paymentLink: !p.paymentLink }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-3 border-t border-[#131d35] block">
                Kelola Metode Pembayaran &rarr;
              </button>
            </div>

            {/* Card 2: Pengaturan Notifikasi */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Notifikasi</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Notifikasi Email</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.email} onChange={() => setNotifySwitches(p => ({ ...p, email: !p.email }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Notifikasi WhatsApp</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.whatsapp} onChange={() => setNotifySwitches(p => ({ ...p, whatsapp: !p.whatsapp }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Notifikasi Telegram</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.telegram} onChange={() => setNotifySwitches(p => ({ ...p, telegram: !p.telegram }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Reminder Pembayaran</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.reminder} onChange={() => setNotifySwitches(p => ({ ...p, reminder: !p.reminder }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Interval Reminder</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>1 Hari Sebelum Jatuh Tempo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Waktu Kirim Reminder</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-3.5 rounded-xl text-gray-350 focus:outline-none text-white">
                    <option>09:00</option>
                  </select>
                </div>
              </div>

              <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-3 border-t border-[#131d35] block">
                Kelola Template Notifikasi &rarr;
              </button>
            </div>

            {/* Card 3: Lainnya */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Lainnya</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                <div className="flex justify-between items-center py-1 border-b border-[#131d35]/40 pb-2">
                  <div className="space-y-0.5">
                    <p className="text-white font-bold">Backup Data Payment</p>
                    <p className="text-[9px] text-gray-500 font-medium">Backup data transaksi pembayaran secara berkala</p>
                  </div>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-white px-3 py-1.5 border border-[#131d35] rounded-lg">
                    Backup Sekarang
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span>Export Data Otomatis</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[#131d35]/40 pb-2 pt-1">
                  <div className="space-y-0.5">
                    <p className="text-white font-bold">Bersihkan Data Lama</p>
                    <p className="text-[9px] text-gray-500 font-medium">Hapus data transaksi lama sesuai periode</p>
                  </div>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-white px-3 py-1.5 border border-[#131d35] rounded-lg">
                    Atur Jadwal
                  </button>
                </div>

                <div className="flex justify-between items-center py-1 pt-1">
                  <div className="space-y-0.5">
                    <p className="text-white font-bold">Reset Pengaturan</p>
                    <p className="text-[9px] text-gray-500 font-medium">Kembalikan semua pengaturan ke default</p>
                  </div>
                  <button className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg border-none shadow-md">
                    Reset Sekarang
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
