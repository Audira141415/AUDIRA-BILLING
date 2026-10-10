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
  Check
} from 'lucide-react';

export default function WhatsappSettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('umum');
  
  // Toggles and form states
  const [generalSwitches, setGeneralSwitches] = useState({
    enableWA: true,
    showBadge: true,
    autoMark: false,
    autoImport: true,
    validateWA: true,
    deleteInactive: false,
    mergeDuplicate: true,
    enableOps: true,
    webhook: true,
    saveHistory: true,
    encryptMsg: true,
    detailLog: false,
    retryFailed: true
  });

  const [themeMode, setThemeMode] = useState('gelap');
  const [selectedColor, setSelectedColor] = useState('blue');

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
              <span className="text-blue-400">Pengaturan</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pengaturan WhatsApp</h1>
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

        {/* ─── Description & Global sub-tabs ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white leading-none">Pengaturan WhatsApp</h2>
            <p className="text-[10px] text-gray-500 font-semibold mt-1">Kelola semua pengaturan WhatsApp Business API, preferensi, integrasi, dan notifikasi.</p>
          </div>
        </div>

        {/* Sub-tabs row */}
        <div className="flex flex-wrap border-b border-[#131d35] text-xs font-bold text-gray-500 pb-px gap-2 overflow-x-auto w-full">
          {[
            { id: 'umum', label: 'Umum' },
            { id: 'api', label: 'WhatsApp API' },
            { id: 'notifikasi', label: 'Notifikasi' },
            { id: 'autoreply', label: 'Auto Reply Global' },
            { id: 'keamanan', label: 'Keamanan' },
            { id: 'integrasi', label: 'Integrasi' },
            { id: 'team', label: 'Team & Akses' },
            { id: 'database', label: 'Database' },
            { id: 'backup', label: 'Backup & Restore' },
            { id: 'log', label: 'Log Aktivitas' }
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

        {/* ─── Main Content Grid (3 columns) ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── COLUMN 1 ─── */}
          <div className="space-y-6">
            
            {/* Informasi Akun WhatsApp */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Informasi Akun WhatsApp</h3>
              
              <div className="flex items-center gap-4 py-2 border-b border-[#131d35]/40 pb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl flex-shrink-0">
                  <span>B</span>
                </div>
                <div className="space-y-1 text-xs font-semibold text-gray-400">
                  <div className="flex justify-between w-full gap-8"><span>Nomor WhatsApp</span><span className="text-white font-mono">6281234567890</span></div>
                  <div className="flex justify-between w-full gap-8"><span>Nama Tampilan</span><span className="text-white">AudiraNET Official</span></div>
                  <div className="flex justify-between w-full gap-8"><span>Status Akun</span><span className="text-green-400 font-bold">Terhubung</span></div>
                  <div className="flex justify-between w-full gap-8"><span>Quality Rating</span><span className="text-green-400 font-bold">Baik</span></div>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-gray-300 text-xs font-bold py-2 rounded-xl transition-all border-gray-800">
                <span>Ubah Informasi</span>
              </button>
            </div>

            {/* Jam Operasional */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Jam Operasional</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={generalSwitches.enableOps} onChange={() => setGeneralSwitches(p => ({ ...p, enableOps: !p.enableOps }))} className="sr-only peer" />
                    <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Hari Operasional</span>
                    <div className="flex flex-wrap gap-2">
                      {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => (
                        <label key={idx} className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" defaultChecked={idx < 5} className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0 scale-75" />
                          <span className="text-[9px]">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Jam Mulai</span>
                      <input type="text" defaultValue="08:00" className="w-full bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none text-center" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Jam Selesai</span>
                      <input type="text" defaultValue="20:00" className="w-full bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none text-center" />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Pesan di Luar Jam Kerja</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-white focus:outline-none">
                      <option>Jam Operasional</option>
                    </select>
                    <span className="text-[8px] text-gray-550 text-gray-555 text-gray-500 block leading-normal">
                      Pesan auto reply akan dikirim di luar jam operasional
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all mt-4 border-none">
                Simpan Pengaturan
              </button>
            </div>

            {/* Pengaturan Kontak */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Kontak</h3>

                <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Auto Import Kontak Baru</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.autoImport} onChange={() => setGeneralSwitches(p => ({ ...p, autoImport: !p.autoImport }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Validasi Nomor WhatsApp</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.validateWA} onChange={() => setGeneralSwitches(p => ({ ...p, validateWA: !p.validateWA }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Hapus Kontak Tidak Aktif</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="90" className="bg-[#080d19] border border-[#131d35] rounded-lg text-xs p-1 w-12 text-center text-white focus:outline-none font-mono" />
                      <span>hari</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={generalSwitches.deleteInactive} onChange={() => setGeneralSwitches(p => ({ ...p, deleteInactive: !p.deleteInactive }))} className="sr-only peer" />
                        <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Merge Kontak Duplikat</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.mergeDuplicate} onChange={() => setGeneralSwitches(p => ({ ...p, mergeDuplicate: !p.mergeDuplicate }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all mt-4 border-none">
                Simpan Pengaturan
              </button>
            </div>

          </div>

          {/* ─── COLUMN 2 ─── */}
          <div className="space-y-6">
            
            {/* Pengaturan Umum */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Umum</h3>
                
                <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Aktifkan WhatsApp</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.enableWA} onChange={() => setGeneralSwitches(p => ({ ...p, enableWA: !p.enableWA }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tampilkan Badge WhatsApp</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.showBadge} onChange={() => setGeneralSwitches(p => ({ ...p, showBadge: !p.showBadge }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Auto Mark as Read</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.autoMark} onChange={() => setGeneralSwitches(p => ({ ...p, autoMark: !p.autoMark }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Waktu Sinkronisasi Kontak</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-white focus:outline-none">
                      <option>Setiap 15 menit</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Zona Waktu</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-white focus:outline-none font-mono">
                      <option>(GMT +07:00) Asia/Jakarta</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Bahasa Default</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-white focus:outline-none">
                      <option>Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all mt-4 border-none">
                Simpan Pengaturan
              </button>
            </div>

            {/* Tampilan & Tema */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Tampilan & Tema</h3>
                
                <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="space-y-2">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Tema</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'terang', label: 'Terang' },
                        { id: 'gelap', label: 'Gelap' },
                        { id: 'sistem', label: 'Sistem' }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setThemeMode(mode.id)}
                          className={`py-3 px-1.5 rounded-xl text-[10px] font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                            themeMode === mode.id 
                              ? 'bg-[#0052cc]/10 border-[#0052cc] text-white' 
                              : 'bg-[#080d19] border-[#131d35] hover:bg-[#121c38] text-gray-400'
                          }`}
                        >
                          <div className="w-8 h-4 bg-[#101935] rounded border border-gray-700/60 flex items-center justify-center gap-0.5">
                            <span className="w-2.5 h-0.5 bg-gray-500 inline-block"></span>
                            <span className="w-1 h-0.5 bg-gray-650 inline-block"></span>
                          </div>
                          <span>{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Warna Utama</span>
                    <div className="flex gap-2 flex-wrap">
                      {['blue', 'purple', 'orange', 'red', 'cyan', 'pink', 'gray'].map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            selectedColor === color ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: 
                              color === 'blue' ? '#3b82f6' : 
                              color === 'purple' ? '#a855f7' :
                              color === 'orange' ? '#f97316' :
                              color === 'red' ? '#ef4444' :
                              color === 'cyan' ? '#06b6d4' :
                              color === 'pink' ? '#ec4899' : '#6b7280'
                          }}
                        >
                          {selectedColor === color && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Kepadatan Tampilan</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-white focus:outline-none">
                      <option>Nyaman</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Bahasa Aplikasi</span>
                    <select className="w-full bg-[#080d19] border border-[#131d35] text-xs py-2 px-3 rounded-xl text-white focus:outline-none">
                      <option>Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all mt-4 border-none">
                Simpan Pengaturan
              </button>
            </div>

          </div>

          {/* ─── COLUMN 3 ─── */}
          <div className="space-y-6">
            
            {/* Pengaturan Pesan */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Pesan</h3>
                
                <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Delay Kirim Pesan</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="1 - 3" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none" />
                      <span>detik</span>
                    </div>
                    <span className="text-[8px] text-gray-500 block leading-normal">
                      Jeda waktu antar pesan untuk menghindari spam
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Batas Kirim Pesan per Menit</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="60" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none font-mono" />
                      <span>pesan</span>
                    </div>
                    <span className="text-[8px] text-gray-500 block leading-normal font-sans">
                      Maksimal pesan yang dapat dikirim per menit
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Batas Kirim Pesan per Hari</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="1000" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none font-mono" />
                      <span>pesan</span>
                    </div>
                    <span className="text-[8px] text-gray-500 block leading-normal">
                      Maksimal pesan yang dapat dikirim per hari
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Tipe Media yang Diizinkan</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px]">
                      {['Gambar', 'Video', 'Dokumen', 'Audio'].map((media, idx) => (
                        <label key={idx} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0 scale-90" />
                          <span>{media}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Ukuran Maksimal Media</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="10" className="flex-1 bg-[#080d19] border border-[#131d35] rounded-xl text-xs px-3.5 py-2 text-white focus:outline-none font-mono" />
                      <span>MB</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all mt-4 border-none">
                Simpan Pengaturan
              </button>
            </div>

            {/* Pengaturan Advanced */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pengaturan Advanced</h3>
                
                <div className="space-y-3.5 text-xs font-semibold text-gray-400">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span>Aktifkan Webhook</span>
                      <p className="text-[8px] text-gray-500 font-normal leading-tight">Terima event real-time dari WhatsApp</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.webhook} onChange={() => setGeneralSwitches(p => ({ ...p, webhook: !p.webhook }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span>Simpan History Chat</span>
                      <p className="text-[8px] text-gray-500 font-normal leading-tight">Simpan history chat ke database</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.saveHistory} onChange={() => setGeneralSwitches(p => ({ ...p, saveHistory: !p.saveHistory }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span>Enkripsi Pesan</span>
                      <p className="text-[8px] text-gray-500 font-normal leading-tight">Enkripsi isi pesan di database</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.encryptMsg} onChange={() => setGeneralSwitches(p => ({ ...p, encryptMsg: !p.encryptMsg }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span>Log Aktivitas Detail</span>
                      <p className="text-[8px] text-gray-500 font-normal leading-tight">Simpan log aktivitas secara detail</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={generalSwitches.detailLog} onChange={() => setGeneralSwitches(p => ({ ...p, detailLog: !p.detailLog }))} className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Retry Gagal Kirim</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="3" className="bg-[#080d19] border border-[#131d35] rounded-lg text-xs p-1 w-10 text-center text-white focus:outline-none font-mono" />
                      <span>kali</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={generalSwitches.retryFailed} onChange={() => setGeneralSwitches(p => ({ ...p, retryFailed: !p.retryFailed }))} className="sr-only peer" />
                        <div className="w-8 h-4 bg-[#101935] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all mt-4 border-none">
                Simpan Pengaturan
              </button>
            </div>

          </div>

        </div>

        {/* ─── Bottom Row: Informasi Sistem ──────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-4 w-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Informasi Sistem</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="space-y-1">
                <span>Provider</span>
                <p className="text-xs text-white mt-1 leading-normal font-sans font-semibold normal-case">Meta (WhatsApp Business API)</p>
              </div>

              <div className="space-y-1">
                <span>API Version</span>
                <p className="text-xs text-white mt-1 leading-normal font-mono font-semibold">v18.0</p>
              </div>

              <div className="space-y-1">
                <span>Nama WABA</span>
                <p className="text-xs text-white mt-1 leading-normal font-sans font-semibold normal-case">AudiraNET WABA</p>
              </div>

              <div className="space-y-1">
                <span>WABA ID</span>
                <p className="text-xs text-white mt-1 leading-normal font-mono font-semibold">123456789012345</p>
              </div>

              <div className="space-y-1">
                <span>Phone Number ID</span>
                <p className="text-xs text-white mt-1 leading-normal font-mono font-semibold">123456789012345</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <span>Status Webhook</span>
                <div className="flex items-center gap-1.5 mt-1 font-mono font-semibold text-xs lowercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-green-400">Aktif</span>
                  <span className="text-gray-400">https://app.audiranet.com/webhook/whatsapp</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[9px] text-gray-550 text-gray-500 font-bold border-t border-[#131d35]/40 pt-3">
              <span>Terakhir Sync: 01/07/2026 08:30 WIB</span>
              <span>Data diperbarui setiap 5 menit</span>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
