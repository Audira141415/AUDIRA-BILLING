import Link from 'next/link';
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
  Edit2,
  PlusCircle,
  Copy,
  ChevronDown,
  LayoutGrid,
  List,
  Star,
  StarOff,
  Trash2,
  Play
} from 'lucide-react';

interface AutoReplyRule {
  id: string;
  name: string;
  desc: string;
  triggerType: string;
  category: 'Umum' | 'Layanan' | 'Promosi' | 'Informasi' | 'Transaksi' | 'Retensi' | 'Support' | 'Event';
  status: 'Aktif' | 'Non Aktif';
  triggerCount: number;
  updatedAt: string;
  updatedBy: string;
  enabled: boolean;
}

const mockRules: AutoReplyRule[] = [
  { id: '1', name: 'Salam Pembuka', desc: 'Menyapa pelanggan saat pertama kali chat', triggerType: 'Pesan Masuk', category: 'Umum', status: 'Aktif', triggerCount: 342, updatedAt: '22/10/2026 08:32', updatedBy: 'Agus Dwi Rianto', enabled: true },
  { id: '2', name: 'Jam Operasional', desc: 'Memberi info jam operasional perusahaan', triggerType: 'Di Luar Jam Kerja', category: 'Layanan', status: 'Aktif', triggerCount: 213, updatedAt: '22/10/2026 07:45', updatedBy: 'Rina Marlina', enabled: true },
  { id: '3', name: 'Promo Bulan Ini', desc: 'Mengirim promo otomatis', triggerType: 'Kata Kunci', category: 'Promosi', status: 'Aktif', triggerCount: 186, updatedAt: '30/06/2026 21:15', updatedBy: 'Rina Marlina', enabled: true },
  { id: '4', name: 'Informasi Paket', desc: 'Menjawab pertanyaan tentang paket', triggerType: 'Kata Kunci', category: 'Informasi', status: 'Aktif', triggerCount: 128, updatedAt: '30/06/2026 19:30', updatedBy: 'Agus Dwi Rianto', enabled: true },
  { id: '5', name: 'Konfirmasi Pembayaran', desc: 'Memberi konfirmasi otomatis', triggerType: 'Status Pembayaran', category: 'Transaksi', status: 'Aktif', triggerCount: 98, updatedAt: '29/06/2026 16:20', updatedBy: 'Indah Permata', enabled: true },
  { id: '6', name: 'Follow Up', desc: 'Mengirim follow up ke pelanggan', triggerType: 'Tidak Aktif (X Hari)', category: 'Retensi', status: 'Non Aktif', triggerCount: 76, updatedAt: '28/06/2026 10:10', updatedBy: 'Indah Permata', enabled: false },
  { id: '7', name: 'Tiket Support', desc: 'Mengarahkan ke tim support', triggerType: 'Kata Kunci', category: 'Support', status: 'Aktif', triggerCount: 65, updatedAt: '27/06/2026 14:00', updatedBy: 'Agus Dwi Rianto', enabled: true },
  { id: '8', name: 'Ucapan Hari Raya', desc: 'Ucapan otomatis di hari spesial', triggerType: 'Tanggal Spesial', category: 'Event', status: 'Aktif', triggerCount: 54, updatedAt: '25/06/2026 11:20', updatedBy: 'WhatsApp System', enabled: true }
];

export default function WhatsappAutoReplyPage() {
  const [selectedRuleId, setSelectedRuleId] = useState('1');
  const [activeSubTab, setActiveSubTab] = useState('semua');
  
  // Rule state bindings
  const [isRuleActive, setIsRuleActive] = useState(true);
  const [ruleName, setRuleName] = useState('Salam Pembuka');
  const [ruleDesc, setRuleDesc] = useState('Menyapa pelanggan saat pertama kali chat');

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Bot Balasan Otomatis</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              undefined
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Otomasi respon pesan masuk berdasarkan kata kunci (contoh: "tagihan", "gangguan", "cara bayar") 24/7.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/whatsapp/chat" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Inbox CS</Link>
          </div>
        </div>

        {/* ─── Description bar ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[var(--app-text)] leading-none">Auto Reply</p>
            <p className="text-[10px] text-[var(--app-muted)] font-semibold mt-1">Kelola balasan otomatis untuk pesan masuk dari pelanggan.</p>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Rule</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">24</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua rule</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">18</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">75% dari total</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">6</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">25% dari total</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <Play size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dijalankan Hari Ini</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">1.248</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Total trigger</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Berhasil</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">1.186</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">95.0%</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Gagal</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">62</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">5.0%</p>
            </div>
          </div>
        </div>

        {/* ─── Sub-tabs row ──────────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-muted)] pb-px overflow-x-auto gap-2">
          {[
            { id: 'semua', label: 'Semua Rule' },
            { id: 'aktif', label: 'Aktif' },
            { id: 'nonaktif', label: 'Non Aktif' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-2.5 px-3 border-b-2 transition-all ${
                activeSubTab === tab.id ? 'border-blue-500 text-[var(--app-text)] font-bold' : 'border-transparent hover:text-[var(--app-text)]/80'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari rule auto reply..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Status</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Kategori</option>
            </select>

            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]">
              <option>Semua Jenis Trigger</option>
            </select>

            <button className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none">
              <option>Urutan: Terbaru</option>
            </select>
            <div className="flex bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-1 gap-1">
              <button className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg"><LayoutGrid size={14} /></button>
              <button className="p-1.5 bg-[var(--app-bg)] text-white rounded-lg"><List size={14} /></button>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: List & Bottom stats (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4">NAMA RULE</th>
                      <th className="p-4 w-24 text-center">TRIGGER</th>
                      <th className="p-4 w-24 text-center">KATEGORI</th>
                      <th className="p-4 w-20 text-center">STATUS</th>
                      <th className="p-4 w-20 text-center">DIJALANKAN</th>
                      <th className="p-4">TERAKHIR DIPERBARUI</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {mockRules.map(item => {
                      const isSelected = selectedRuleId === item.id;
                      return (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedRuleId(item.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#0052cc]/10 hover:bg-[#0052cc]/15' : 'hover:bg-[var(--app-border)]/20'
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex gap-3">
                              <div className="p-2 bg-blue-500/10 text-blue-450 border border-blue-500/20 rounded-lg mt-0.5">
                                <Sliders size={14} />
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-[var(--app-text)] leading-tight">{item.name}</p>
                                <p className="text-[8px] text-[var(--app-muted)] line-clamp-1 max-w-[160px] font-semibold">{item.desc}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                              item.triggerType === 'Pesan Masuk' ? 'bg-blue-500/10 text-blue-450' :
                              item.triggerType === 'Di Luar Jam Kerja' ? 'bg-purple-500/10 text-purple-455' :
                              item.triggerType === 'Kata Kunci' ? 'bg-orange-500/10 text-orange-450' :
                              item.triggerType === 'Status Pembayaran' ? 'bg-green-500/10 text-green-450' : 'bg-red-500/10 text-red-450'
                            }`}>
                              {item.triggerType}
                            </span>
                          </td>
                          <td className="p-4 text-center font-medium text-[var(--app-muted)]">{item.category}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                              item.status === 'Aktif' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-center text-[var(--app-text)] font-bold">{item.triggerCount}</td>
                          <td className="p-4">
                            <p className="text-white leading-none font-semibold">{item.updatedAt}</p>
                            <span className="text-[8px] text-gray-505 text-[var(--app-muted)] font-semibold mt-1 block">{item.updatedBy}</span>
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-3">
                              <button className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)]">
                                <Edit2 size={13} />
                              </button>
                              
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={item.enabled} disabled className="sr-only peer" />
                                <div className="w-8 h-4 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-white/60">
                <span className="text-xs text-[var(--app-muted)]">
                  Menampilkan <span className="font-semibold text-white">1 - 8</span> dari <span className="font-semibold text-white">24</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button disabled className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">2</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30">3</button>
                    <button className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)]">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)]/80 focus:outline-none">
                    <option value={10}>10 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Statistik Auto Reply (7 Hari Terakhir) */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Statistik Auto Reply (7 Hari Terakhir)</h4>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-semibold text-[var(--app-muted)] mt-2">
                  <div className="space-y-0.5">
                    <span>Total Trigger</span>
                    <p className="text-lg font-black text-[var(--app-text)] leading-none mt-1">8.548</p>
                    <p className="text-[9px] text-green-500 font-bold mt-1">+12.5% dari minggu lalu</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Berhasil</span>
                    <p className="text-lg font-black text-[var(--app-text)] leading-none mt-1">8.120</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-bold mt-1">95.0% success rate</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Gagal</span>
                    <p className="text-lg font-black text-[var(--app-text)] leading-none mt-1">428</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-bold mt-1">5.0% error rate</p>
                  </div>

                  <div className="space-y-0.5">
                    <span>Rata-rata Respon</span>
                    <p className="text-lg font-black text-green-400 leading-none mt-1">2.3 detik</p>
                    <p className="text-[9px] text-green-500 font-bold mt-1">-0.8 detik respon time</p>
                  </div>
                </div>
              </div>

              {/* Trigger per Hari chart */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Trigger per Hari</h4>
                
                <div className="h-32 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                    
                    <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">3K</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">2K</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">1K</text>
                    
                    <path d="M20,68 L60,50 L100,55 L140,70 L180,68 L220,72 L260,65" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    
                    <text x="15" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">25 Jun</text>
                    <text x="60" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">27 Jun</text>
                    <text x="105" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">29 Jun</text>
                    <text x="150" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                  </svg>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Edit Auto Reply Form & Logs (5/12 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Edit Auto Reply Form */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Edit Auto Reply</h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase">Aktifkan Rule</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isRuleActive} onChange={() => setIsRuleActive(!isRuleActive)} className="sr-only peer" />
                    <div className="w-8 h-4 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-muted)]">
                
                {/* Rule Name */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase">Nama Rule</span>
                    <span className="text-[9px] text-gray-650">14/100</span>
                  </div>
                  <input 
                    type="text" 
                    value={ruleName} 
                    onChange={e => setRuleName(e.target.value)} 
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" 
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase">Deskripsi (Opsional)</span>
                    <span className="text-[9px] text-gray-650">41/255</span>
                  </div>
                  <input 
                    type="text" 
                    value={ruleDesc} 
                    onChange={e => setRuleDesc(e.target.value)} 
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none" 
                  />
                </div>

                {/* Trigger Section */}
                <div className="pt-2 border-t border-[var(--app-border)]/40 space-y-3">
                  <p className="text-[10px] font-bold text-[var(--app-text)] uppercase tracking-wider">Trigger</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-[var(--app-muted)] font-bold uppercase block">Jenis Trigger</span>
                      <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-white focus:outline-none">
                        <option>Pesan Masuk</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] text-[var(--app-muted)] font-bold uppercase block">Kondisi</span>
                      <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-white focus:outline-none">
                        <option>Pertama kali chat</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-[var(--app-muted)] font-bold uppercase block">Delay (Opsional)</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="0" className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-white focus:outline-none w-20 text-center" />
                      <span>detik</span>
                      <span className="text-[9px] text-[var(--app-muted)] ml-2 font-medium">Tunggu sebelum mengirim balasan</span>
                    </div>
                  </div>
                </div>

                {/* Pesan Balasan Section */}
                <div className="pt-2 border-t border-[var(--app-border)]/40 space-y-3">
                  <p className="text-[10px] font-bold text-[var(--app-text)] uppercase tracking-wider">Pesan Balasan</p>
                  
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-[var(--app-muted)] font-bold uppercase block">Tipe Pesan</span>
                    <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-white focus:outline-none w-48">
                      <option>Teks</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-[var(--app-muted)] font-bold uppercase block">Pesan</span>
                    <textarea 
                      rows={4} 
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs p-3 text-white focus:outline-none font-mono"
                      defaultValue={"Halo {{nama}} 👋,\nTerima kasih telah menghubungi *AudiraNET*.\nAda yang bisa kami bantu hari ini? 😊"}
                    />
                    <div className="flex justify-between items-center text-[9px] text-[var(--app-muted)]">
                      <span>38/1024 karakter</span>
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:underline">+ Tambah Variabel</button>
                        <button className="text-blue-500 hover:underline">Tambah Media</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pengaturan Tambahan Section */}
                <div className="pt-2 border-t border-[var(--app-border)]/40 space-y-3">
                  <p className="text-[10px] font-bold text-[var(--app-text)] uppercase tracking-wider">Pengaturan Tambahan</p>
                  
                  <div className="space-y-3 text-[10px] font-bold text-[var(--app-muted)]">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                        <span>Aktif hanya pada jam tertentu</span>
                      </label>
                      <div className="flex items-center gap-2 pl-6">
                        <input type="text" defaultValue="08:00" className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[10px] p-1.5 text-center text-white focus:outline-none w-16" />
                        <span>s/d</span>
                        <input type="text" defaultValue="20:00" className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[10px] p-1.5 text-center text-white focus:outline-none w-16" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                        <span>Aktif hanya pada hari tertentu</span>
                      </label>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => (
                          <label key={idx} className="flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" defaultChecked={idx < 5} className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 scale-75" />
                            <span className="text-[9px]">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input type="checkbox" className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                      <span>Jangan kirim jika ada agent yang sedang membalas</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" />
                      <span>Prioritas tinggi</span>
                    </label>
                  </div>
                </div>

                {/* Form buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--app-border)]/40">
                  <button className="bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-xs font-bold px-4 py-2 rounded-xl transition-all border-gray-800">
                    Batal
                  </button>
                  <button className="bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-xs font-bold px-4 py-2 rounded-xl transition-all border-gray-800">
                    Simpan Draft
                  </button>
                  <button className="bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md transition-all">
                    Simpan & Aktifkan
                  </button>
                </div>

              </div>
            </div>

            {/* Log Aktivitas Rule */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Log Aktivitas Rule</h3>
                <button className="text-[9px] text-blue-500 font-bold hover:underline">Lihat Semua</button>
              </div>

              <div className="relative border-l border-[var(--app-border)] ml-2 pl-4 space-y-3.5 text-[9px] text-gray-550 text-[var(--app-muted)] font-bold">
                {[
                  { time: '22/10/2026 08:32', title: 'Rule dijalankan', desc: 'Trigger: Pesan Masuk', status: 'Berhasil', color: 'text-green-400' },
                  { time: '22/10/2026 08:31', title: 'Rule dijalankan', desc: 'Trigger: Pesan Masuk', status: 'Berhasil', color: 'text-green-400' },
                  { time: '22/10/2026 08:30', title: 'Rule dijalankan', desc: 'Trigger: Pesan Masuk', status: 'Berhasil', color: 'text-green-400' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[var(--app-border)] bg-blue-500"></span>
                    <div className="flex justify-between items-start">
                      <span className="text-white block font-bold leading-none">{item.title}</span>
                      <span className={`text-[8px] font-black uppercase ${item.color}`}>{item.status}</span>
                    </div>
                    <span className="text-[var(--app-muted)] text-[8px] font-normal leading-normal mt-0.5 block">{item.desc}</span>
                    <span className="text-[var(--app-muted)] text-[8px] font-semibold mt-1 block">{item.time}</span>
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
