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
  Settings,
  HelpCircle,
  Wallet,
  ArrowUpRight,
  Shield,
  FileJson,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  RefreshCw,
  Sliders,
  CreditCard,
  Printer,
  ChevronDown
} from 'lucide-react';

export default function InvoiceSettingsPage() {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('umum');
  const [generalSwitches, setGeneralSwitches] = useState({
    autoSend: true,
    useCustomerEmail: true,
    showTax: true,
    watermark: false
  });

  const [otherSwitches, setOtherSwitches] = useState({
    showDetails: true,
    showContract: true,
    showContact: true,
    allowEdit: false,
    autoRecurring: true
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Konfigurasi Billing</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Pengaturan Parameter Tagihan & Denda
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Aturan tanggal jatuh tempo (due date), grace period isolir Mikrotik, perhitungan denda keterlambatan, dan format nomor invoice.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/pengaturan" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Pengaturan Sistem</Link>
          </div>
        </div>

        {/* ─── Horizontal Sub-Tabs ───────────────────────────────────────── */}
        <div className="flex flex-wrap border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-muted)] gap-1 md:gap-2 pb-px overflow-x-auto">
          {[
            { id: 'umum', label: 'Pengaturan Umum', icon: Settings },
            { id: 'penomoran', label: 'Penomoran Invoice', icon: FileText },
            { id: 'tampilan', label: 'Tampilan Invoice', icon: Printer },
            { id: 'template', label: 'Template', icon: Sliders },
            { id: 'pajak', label: 'Pajak & PPN', icon: Shield },
            { id: 'syarat', label: 'Syarat & Ketentuan', icon: FileText },
            { id: 'email', label: 'Email & Reminder', icon: Mail },
            { id: 'integrasi', label: 'Integrasi', icon: ArrowUpRight },
            { id: 'akses', label: 'Akses & Approval', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`pb-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
                  isActive ? 'border-blue-500 text-[var(--app-text)] font-bold' : 'border-transparent hover:text-[var(--app-text)]/80'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-blue-400' : 'text-[var(--app-muted)]'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Col 1: Informasi Perusahaan & Penomoran */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card: Informasi Perusahaan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Informasi Perusahaan</h3>
                
                <div className="space-y-4 mt-4">
                  {/* Logo Upload Box */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Logo Perusahaan</span>
                    <div className="border border-dashed border-[var(--app-border)] bg-[var(--app-bg)] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--app-border)]/20 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[var(--app-text)] font-bold text-xs overflow-hidden mb-2">
                        <span className="text-sm">AR</span>
                      </div>
                      <span className="text-[9px] text-[var(--app-muted)] font-semibold text-center">Klik untuk upload logo<br />PNG, JPG (Maks. 2MB)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Nama Perusahaan</span>
                    <input type="text" defaultValue="Audira NET" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">NPWP</span>
                    <input type="text" defaultValue="12.345.678.9-123.000" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Alamat</span>
                    <textarea rows={3} defaultValue="Jl. Palagan Tentara Pelajar No.123, Sleman, Yogyakarta 55581" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Telepon</span>
                      <input type="text" defaultValue="(0274) 1234567" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Email</span>
                      <input type="text" defaultValue="billing@audiranet.id" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Website</span>
                    <input type="text" defaultValue="https://www.audiranet.id" className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-[var(--app-border)]/60 mt-5">
                <button onClick={() => toast.success("Perubahan konfigurasi berhasil disimpan ke database!")} className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">Simpan Perubahan</button>
              </div>
            </div>

            {/* Card: Penomoran Invoice */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Penomoran Invoice</h3>
                
                <div className="space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Format Nomor Invoice</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="INV/{YY}/{MM}/{SEQ}" className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                      <button onClick={() => toast.info("Format nomor invoice siap disunting.")} className="bg-[var(--app-card)] border border-[var(--app-border)] text-blue-400 hover:bg-[var(--app-border)]/30 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border-blue-500/20">
                        Edit Format
                      </button>
                    </div>
                    <p className="text-[9px] text-[var(--app-muted)] font-semibold mt-1">Contoh: INV/26/07/0001</p>
                  </div>

                  <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-3.5 rounded-xl space-y-1.5 text-[9px] text-[var(--app-muted)] font-bold leading-normal">
                    <p className="text-[var(--app-muted)] uppercase tracking-wider mb-1">Keterangan Format:</p>
                    <p>&bull; {`{YY}`} = Tahun (2 digit)</p>
                    <p>&bull; {`{YYYY}`} = Tahun (4 digit)</p>
                    <p>&bull; {`{MM}`} = Bulan (2 digit)</p>
                    <p>&bull; {`{DD}`} = Tanggal (2 digit)</p>
                    <p>&bull; {`{SEQ}`} = Nomor urut</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Nomor Awal</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="0001" className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" />
                      <button onClick={() => toast.info("Nomor awal direset ke 0001.")} className="text-xs font-bold text-[var(--app-muted)] hover:text-[var(--app-text)] px-4 py-2.5 border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 transition-colors">
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Preview</span>
                    <p className="text-xs font-bold text-[var(--app-text)] font-mono bg-[var(--app-bg)] p-3.5 rounded-xl border border-[var(--app-border)]">
                      INV/26/07/0001
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-[var(--app-border)]/60 mt-5">
                <button onClick={() => toast.success("Perubahan konfigurasi berhasil disimpan ke database!")} className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">Simpan Perubahan</button>
              </div>
            </div>

          </div>

          {/* Col 2: Pengaturan Umum Invoice & Jatuh Tempo & Pengaturan Lainnya */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card: Pengaturan Umum Invoice */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Umum Invoice</h3>
                
                <div className="space-y-3.5 mt-4 text-xs font-semibold text-[var(--app-muted)]">
                  <div className="flex items-center justify-between">
                    <span>Kirim invoice otomatis saat generate</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.autoSend} onChange={() => setGeneralSwitches(p => ({ ...p, autoSend: !p.autoSend }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Gunakan email customer sebagai default</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.useCustomerEmail} onChange={() => setGeneralSwitches(p => ({ ...p, useCustomerEmail: !p.useCustomerEmail }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Gunakan satuan mata uang</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Rupiah (IDR)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span>Tampilkan PPN di invoice</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.showTax} onChange={() => setGeneralSwitches(p => ({ ...p, showTax: !p.showTax }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Template invoice default</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Default Template</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Tipe invoice default</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Invoice Bulanan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Pembulatan nominal</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Tanpa Pembulatan</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span>Tampilkan watermark</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.watermark} onChange={() => setGeneralSwitches(p => ({ ...p, watermark: !p.watermark }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Bahasa invoice</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-[var(--app-border)]/60 mt-5">
                <button onClick={() => toast.success("Perubahan konfigurasi berhasil disimpan ke database!")} className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">Simpan Perubahan</button>
              </div>
            </div>

            {/* Card: Jatuh Tempo & Denda */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Jatuh Tempo & Denda</h3>
                
                <div className="space-y-4 mt-4 text-xs font-semibold text-[var(--app-muted)]">
                  <div className="space-y-2">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Aturan Jatuh Tempo</span>
                    <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                      <input type="radio" name="dueRule" defaultChecked className="bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                      <span>Berdasarkan tanggal invoice</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                      <input type="radio" name="dueRule" className="bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                      <span>Berdasarkan periode layanan</span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Hari jatuh tempo</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="15" className="w-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white text-center focus:outline-none" />
                      <span>hari setelah invoice diterbitkan</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Hitung denda mulai</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Setelah jatuh tempo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Denda keterlambatan</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="2" className="w-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white text-center focus:outline-none" />
                      <span>% per hari</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Denda maksimal</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="25" className="w-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white text-center focus:outline-none" />
                      <span>% dari total tagihan</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-[var(--app-border)]/60 mt-5">
                <button onClick={() => toast.success("Perubahan konfigurasi berhasil disimpan ke database!")} className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">Simpan Perubahan</button>
              </div>
            </div>

            {/* Card: Pengaturan Lainnya */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Lainnya</h3>
                
                <div className="space-y-3.5 mt-4 text-xs font-semibold text-[var(--app-muted)]">
                  <div className="flex items-center justify-between">
                    <span>Tampilkan detail penggunaan pada invoice</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={otherSwitches.showDetails} onChange={() => setOtherSwitches(p => ({ ...p, showDetails: !p.showDetails }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tampilkan nomor kontrak / layanan</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={otherSwitches.showContract} onChange={() => setOtherSwitches(p => ({ ...p, showContract: !p.showContract }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tampilkan kontak penagihan</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={otherSwitches.showContact} onChange={() => setOtherSwitches(p => ({ ...p, showContact: !p.showContact }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Izinkan pengeditan invoice setelah kirim</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={otherSwitches.allowEdit} onChange={() => setOtherSwitches(p => ({ ...p, allowEdit: !p.allowEdit }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Aktifkan invoice berulang otomatis</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={otherSwitches.autoRecurring} onChange={() => setOtherSwitches(p => ({ ...p, autoRecurring: !p.autoRecurring }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Arsip kan invoice otomatis setelah</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="12" className="w-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white text-center focus:outline-none" />
                      <span>bulan</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Penyimpanan lampiran</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Database</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-[var(--app-border)]/60 mt-5">
                <button onClick={() => toast.success("Perubahan konfigurasi berhasil disimpan ke database!")} className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">Simpan Perubahan</button>
              </div>
            </div>

          </div>

          {/* Col 3: Pengaturan Pembayaran & Aksi Cepat */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card: Pengaturan Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Pembayaran</h3>
                
                <div className="space-y-4 mt-4 text-xs font-semibold text-[var(--app-muted)]">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Metode pembayaran default</span>
                    <div className="flex flex-wrap gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                      <span className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] px-2 py-1 rounded text-[10px] font-bold text-[var(--app-text)]">
                        <span>Transfer Bank</span>
                        <span className="text-[var(--app-muted)] cursor-pointer">x</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] px-2 py-1 rounded text-[10px] font-bold text-[var(--app-text)]">
                        <span>QRIS</span>
                        <span className="text-[var(--app-muted)] cursor-pointer">x</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Batas waktu pembayaran (hari)</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="15" className="w-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white text-center focus:outline-none" />
                      <span>hari setelah invoice diterbitkan</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Denda keterlambatan (%)</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="2" className="w-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white text-center focus:outline-none" />
                      <span>% per hari</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Maksimal denda (%)</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="25" className="w-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white text-center focus:outline-none" />
                      <span>% dari total tagihan</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Akun pembayaran default</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
                      <option>Bank BCA - 1234567890 (Audira NET)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase block">Catatan pembayaran</span>
                    <textarea rows={3} defaultValue="Terima kasih telah melakukan pembayaran tepat waktu." className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-[var(--app-border)]/60 mt-5">
                <button onClick={() => toast.success("Perubahan konfigurasi berhasil disimpan ke database!")} className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">Simpan Perubahan</button>
              </div>
            </div>

            {/* Card: Aksi Cepat */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h3>
              
              <div className="space-y-2 text-[10px] font-bold text-[var(--app-muted)]">
                {[
                  { name: 'Reset Semua Pengaturan', desc: 'Kembalikan semua pengaturan ke default sistem', color: 'text-purple-400' },
                  { name: 'Export Pengaturan', desc: 'Download pengaturan invoice (JSON)', color: 'text-blue-400' },
                  { name: 'Import Pengaturan', desc: 'Upload dan terapkan pengaturan invoice', color: 'text-green-500' },
                  { name: 'Bersihkan Cache Invoice', desc: 'Hapus cache untuk memperbarui tampilan', color: 'text-red-400' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-border)]/20 cursor-pointer transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-white leading-none">{item.name}</p>
                      <p className="text-[8px] text-[var(--app-muted)] font-normal">{item.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-[var(--app-muted)]" />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ─── Bottom Bar: Informasi Sistem ─────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-semibold text-[var(--app-muted)]">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-[var(--app-muted)]" />
              <span>Terakhir Diubah Oleh: <strong className="text-white">Agus Dwi Rianto</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-[var(--app-muted)]" />
              <span>Tanggal Perubahan: <strong className="text-white">22 Oktober 2026 08:15 WIB</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Settings size={12} className="text-[var(--app-muted)]" />
              <span>Versi Pengaturan: <strong className="text-white">v2.1.5</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>Status: <strong className="text-green-400">Aktif</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Log Perubahan Terakhir</span>
            <button onClick={() => toast.info("Menampilkan log perubahan konfigurasi...")} className="text-blue-500 hover:underline">Lihat Log Perubahan &rarr;</button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
