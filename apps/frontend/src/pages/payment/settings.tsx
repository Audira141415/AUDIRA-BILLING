import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
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
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('umum');
  
  // States for toggle switches
  const [generalSwitches, setGeneralSwitches] = useState({
    showBalance: true,
    autoExport: false,
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
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/payment" className="hover:text-[var(--app-text)]">Kasir & Pembayaran</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Pengaturan Payment Gateway</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Konfigurasi API Payment Gateway & Webhook
            </h1>
            <p className="text-xs text-[var(--app-text-muted)]">
              Pengaturan API Server Key Midtrans/Xendit, URL Webhook Notifikasi Transaksi, dan Rekening Bank Penampung.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/pengaturan" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-colors">Sistem</Link>
          </div>
        </div>

        {/* ─── Description & Global Save Button ────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[var(--app-text)] leading-none">Pengaturan Payment</h2>
            <p className="text-[10px] text-[var(--app-text-muted)] font-semibold">Kelola konfigurasi sistem pembayaran sesuai kebutuhan bisnis Anda.</p>
          </div>

          <button onClick={() => toast.success("Pengaturan pembayaran dan gateway berhasil disimpan ke database!", "Pengaturan Tersimpan")} className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">
            Simpan Pengaturan
          </button>
        </div>

        {/* ─── Sub-tabs Navigation ───────────────────────────────────────── */}
        <div className="flex flex-wrap border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] gap-1 md:gap-2 pb-px overflow-x-auto">
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
                activeSubTab === tab.id ? 'border-blue-500 text-[var(--app-text)] font-bold' : 'border-transparent hover:text-[var(--app-text)]'
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
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Pengaturan Umum</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Mata Uang Default</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Rupiah (IDR)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Format Nomor Invoice</span>
                  <input type="text" defaultValue="INV-{YYYY}/{MM}/{00001}" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Format Nomor Transaksi</span>
                  <input type="text" defaultValue="TRX-{YYYY}{MM}{00001}" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Zone Waktu</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Asia/Jakarta (GMT+7)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Tanggal Default Invoice</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Tanggal Pembuatan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Batas Waktu Pembayaran Default</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="3" className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" />
                    <span>Hari</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[var(--app-text)]">Tampilkan Saldo di Customer</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={generalSwitches.showBalance} onChange={() => setGeneralSwitches(p => ({ ...p, showBalance: !p.showBalance }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Pembulatan Nilai</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Tanpa Pembulatan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 2: Pengaturan Invoice */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Pengaturan Invoice</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Auto Generate Invoice</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.autoGenerate} onChange={() => setInvoiceSwitches(p => ({ ...p, autoGenerate: !p.autoGenerate }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Auto Send Invoice</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.autoSend} onChange={() => setInvoiceSwitches(p => ({ ...p, autoSend: !p.autoSend }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Invoice PDF Template</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Default Template</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[var(--app-text)]">Lampirkan Syarat & Ketentuan</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.attachTnC} onChange={() => setInvoiceSwitches(p => ({ ...p, attachTnC: !p.attachTnC }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Tampilkan Detail Paket</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.showPackage} onChange={() => setInvoiceSwitches(p => ({ ...p, showPackage: !p.showPackage }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Tampilkan Riwayat Pembayaran</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={invoiceSwitches.showHistory} onChange={() => setInvoiceSwitches(p => ({ ...p, showHistory: !p.showHistory }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Watermark Invoice</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Logo Perusahaan</option>
                  </select>
                </div>
              </div>

              <button onClick={() => toast.info("Membuka pengelola template invoice...", "Template Invoice")} className="w-full text-center text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] pt-3 border-t border-[var(--app-border)] block transition-colors">
                Kelola Template Invoice &rarr;
              </button>
            </div>

            {/* Card 3: Integrasi Sistem */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Integrasi Sistem</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                {[
                  { name: 'Integrasi Bank (API)', status: 'Aktif', active: true },
                  { name: 'Midtrans / Payment Gateway', status: 'Aktif', active: true },
                  { name: 'Xendit Payment Gateway', status: 'Tidak Aktif', active: false },
                  { name: 'WhatsApp Business API', status: 'Aktif', active: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-[var(--app-border)] last:border-0 pb-2">
                    <div className="space-y-0.5">
                      <p className="text-[var(--app-text)] font-bold">{item.name}</p>
                      <span className={`text-[9px] font-bold ${item.active ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.status}
                      </span>
                    </div>
                    <button onClick={() => toast.info(`Membuka konfigurasi ${item.name}...`, "Konfigurasi Gateway")} className="text-[10px] font-bold bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] px-3 py-1.5 border border-[var(--app-border)] rounded-lg transition-colors">
                      Konfigurasi
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => toast.info("Membuka manajemen integrasi sistem payment...", "Integrasi Sistem")} className="w-full text-center text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] pt-3 border-t border-[var(--app-border)] block transition-colors">
                Kelola Integrasi &rarr;
              </button>
            </div>

          </div>

          {/* ─── COLUMN 2 ─── */}
          <div className="space-y-6">
            
            {/* Card 1: Pengaturan Status Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Pengaturan Status Pembayaran</h3>
              
              <div className="space-y-3 text-[10px] font-bold text-[var(--app-text-muted)]">
                <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-2 text-[9px] text-[var(--app-text-muted)] uppercase tracking-wider">
                  <span>Status</span>
                  <span>Keterangan Default</span>
                </div>
                {[
                  { name: 'Berhasil', color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20', desc: 'Pembayaran berhasil diterima' },
                  { name: 'Menunggu', color: 'bg-orange-500/10 text-orange-500 border border-orange-500/20', desc: 'Menunggu konfirmasi / proses' },
                  { name: 'Gagal', color: 'bg-red-500/10 text-red-500 border border-red-500/20', desc: 'Pembayaran gagal / ditolak' },
                  { name: 'Refund', color: 'bg-purple-500/10 text-purple-500 border border-purple-500/20', desc: 'Dana dikembalikan ke customer' },
                  { name: 'Void', color: 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]', desc: 'Transaksi dibatalkan' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded ${item.color}`}>{item.name}</span>
                    <span className="text-[var(--app-text)] text-right leading-none">{item.desc}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => toast.info("Membuka pengelolaan alur status transaksi & verifikasi...", "Status Pembayaran")} className="w-full text-center text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] pt-3 border-t border-[var(--app-border)] block transition-colors">
                Kelola Status &rarr;
              </button>
            </div>

            {/* Card 2: Pengaturan Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Pengaturan Pembayaran</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Konfirmasi Otomatis</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={paymentSwitches.autoConfirm} onChange={() => setPaymentSwitches(p => ({ ...p, autoConfirm: !p.autoConfirm }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Verifikasi Manual Diperlukan</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={paymentSwitches.manualVerify} onChange={() => setPaymentSwitches(p => ({ ...p, manualVerify: !p.manualVerify }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Batas Maksimal Refund (%)</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="100" className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" />
                    <span>%</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Batas Maksimal Void (Jam)</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="24" className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" />
                    <span>Jam</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Default Rekening Penerima</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>BCA - 1234 5678 9012</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[var(--app-text)]">Potong Biaya Admin ke Customer</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={paymentSwitches.feeCut} onChange={() => setPaymentSwitches(p => ({ ...p, feeCut: !p.feeCut }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Simpan Bukti Pembayaran (Hari)</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="365" className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" />
                    <span>Hari</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Keamanan & Akses */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Keamanan & Akses</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Role yang Dapat Akses</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Semua Role</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Akses Edit Pembayaran</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Finance & Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Akses Refund & Void</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>Super Admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[var(--app-text)]">Log Aktivitas Payment</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={securitySwitches.logActivity} onChange={() => setSecuritySwitches(p => ({ ...p, logActivity: !p.logActivity }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Verifikasi 2 Langkah</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={securitySwitches.twoStep} onChange={() => setSecuritySwitches(p => ({ ...p, twoStep: !p.twoStep }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <button onClick={() => toast.info("Membuka pengaturan hak akses role & permission staf billing...", "Keamanan & Akses")} className="w-full text-center text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] pt-3 border-t border-[var(--app-border)] block transition-colors">
                Kelola Role & Permission &rarr;
              </button>
            </div>

          </div>

          {/* ─── COLUMN 3 ─── */}
          <div className="space-y-6">
            
            {/* Card 1: Pengaturan Metode Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Pengaturan Metode Pembayaran</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Aktifkan Transfer Bank</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.bankTransfer} onChange={() => setMethodsSwitches(p => ({ ...p, bankTransfer: !p.bankTransfer }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Aktifkan QRIS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.qris} onChange={() => setMethodsSwitches(p => ({ ...p, qris: !p.qris }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Aktifkan E-Wallet</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.ewallet} onChange={() => setMethodsSwitches(p => ({ ...p, ewallet: !p.ewallet }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Aktifkan Virtual Account</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.virtualAccount} onChange={() => setMethodsSwitches(p => ({ ...p, virtualAccount: !p.virtualAccount }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Aktifkan Credit Card / Gateway</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.creditCard} onChange={() => setMethodsSwitches(p => ({ ...p, creditCard: !p.creditCard }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Aktifkan Payment Link</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={methodsSwitches.paymentLink} onChange={() => setMethodsSwitches(p => ({ ...p, paymentLink: !p.paymentLink }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <button onClick={() => toast.info("Membuka katalog saluran pembayaran & gateway...", "Metode Pembayaran")} className="w-full text-center text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] pt-3 border-t border-[var(--app-border)] block transition-colors">
                Kelola Metode Pembayaran &rarr;
              </button>
            </div>

            {/* Card 2: Pengaturan Notifikasi */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Pengaturan Notifikasi</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Notifikasi Email</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.email} onChange={() => setNotifySwitches(p => ({ ...p, email: !p.email }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Notifikasi WhatsApp</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.whatsapp} onChange={() => setNotifySwitches(p => ({ ...p, whatsapp: !p.whatsapp }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Notifikasi Telegram</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.telegram} onChange={() => setNotifySwitches(p => ({ ...p, telegram: !p.telegram }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Reminder Pembayaran</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifySwitches.reminder} onChange={() => setNotifySwitches(p => ({ ...p, reminder: !p.reminder }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Interval Reminder</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>1 Hari Sebelum Jatuh Tempo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase block">Waktu Kirim Reminder</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3.5 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>09:00</option>
                  </select>
                </div>
              </div>

              <button onClick={() => toast.info("Membuka pengelola template notifikasi reminder jatuh tempo...", "Template Notifikasi")} className="w-full text-center text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] pt-3 border-t border-[var(--app-border)] block transition-colors">
                Kelola Template Notifikasi &rarr;
              </button>
            </div>

            {/* Card 3: Lainnya */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">Lainnya</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-text-muted)]">
                <div className="flex justify-between items-center py-1 border-b border-[var(--app-border)] pb-2">
                  <div className="space-y-0.5">
                    <p className="text-[var(--app-text)] font-bold">Backup Data Payment</p>
                    <p className="text-[9px] text-[var(--app-text-muted)] font-medium">Backup data transaksi pembayaran secara berkala</p>
                  </div>
                  <button onClick={() => toast.success("Proses pencadangan data transaksi dimulai. Berkas arsip disimpan ke server aman.", "Backup Dimulai")} className="text-[10px] font-bold bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] px-3 py-1.5 border border-[var(--app-border)] rounded-lg transition-colors">
                    Backup Sekarang
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--app-text)]">Export Data Otomatis</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={generalSwitches.autoExport} onChange={() => setGeneralSwitches(p => ({ ...p, autoExport: !p.autoExport }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-[#ffffff] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[var(--app-border)] pb-2 pt-1">
                  <div className="space-y-0.5">
                    <p className="text-[var(--app-text)] font-bold">Bersihkan Data Lama</p>
                    <p className="text-[9px] text-[var(--app-text-muted)] font-medium">Hapus data transaksi lama sesuai periode</p>
                  </div>
                  <button onClick={() => toast.info("Membuka dialog pengaturan retensi & arsip otomatis...", "Retensi Data")} className="text-[10px] font-bold bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] px-3 py-1.5 border border-[var(--app-border)] rounded-lg transition-colors">
                    Atur Jadwal
                  </button>
                </div>

                <div className="flex justify-between items-center py-1 pt-1">
                  <div className="space-y-0.5">
                    <p className="text-[var(--app-text)] font-bold">Reset Pengaturan</p>
                    <p className="text-[9px] text-[var(--app-text-muted)] font-medium">Kembalikan semua pengaturan ke default</p>
                  </div>
                  <button onClick={() => toast.warning("Pengaturan dikembalikan ke konfigurasi bawaan sistem AUDIRA.", "Reset Pengaturan")} className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg border-none shadow-md transition-colors">
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
