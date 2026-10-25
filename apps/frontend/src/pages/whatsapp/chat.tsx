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
  Phone,
  Video,
  Smile,
  Paperclip,
  Image,
  Mic,
  CalendarDays,
  Tag,
  PlusCircle,
  UserPlus,
  Edit2
} from 'lucide-react';

interface ChatItem {
  id: string;
  name: string;
  phone: string;
  label: 'Pelanggan' | 'Prospek' | 'Grup';
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

const mockChatList: ChatItem[] = [
  { id: '1', name: 'Budi Santoso', phone: '6281234567890', label: 'Pelanggan', lastMessage: 'Terima kasih, pembayaran sudah saya lakukan', time: '08:32', unreadCount: 2 },
  { id: '2', name: 'Siti Aminah', phone: '6289876543211', label: 'Prospek', lastMessage: 'Baik kak, saya tunggu informasinya', time: '08:30', unreadCount: 1 },
  { id: '3', name: 'Andi Pratama', phone: '6281111111112', label: 'Pelanggan', lastMessage: 'Oke siap, terima kasih', time: '08:25' },
  { id: '4', name: 'Dewi Lestari', phone: '6282222222222', label: 'Pelanggan', lastMessage: 'Mohon bantuannya kak', time: '08:20', unreadCount: 3 },
  { id: '5', name: 'Fajar Nugroho', phone: '6283333333333', label: 'Pelanggan', lastMessage: 'Saya mau tanya tentang paket', time: '08:18' },
  { id: '6', name: 'PT. Maju Bersama', phone: '6284444444444', label: 'Grup', lastMessage: 'Rina: Meeting besok jam 10 pagi', time: '08:10' },
  { id: '7', name: 'Nina Wulandari', phone: '6285555555555', label: 'Pelanggan', lastMessage: 'Sudah ya kak', time: '07:55' },
  { id: '8', name: 'CV. Sinar Abadi', phone: '6286666666666', label: 'Grup', lastMessage: 'Budi: Siap, kita proses', time: '07:45' },
  { id: '9', name: 'Putri Handayani', phone: '6287777777777', label: 'Prospek', lastMessage: 'Terima kasih atas penawarannya', time: '07:35' },
  { id: '10', name: 'Bambang Setiawan', phone: '6288888888888', label: 'Pelanggan', lastMessage: 'Payment berhasil, terima kasih', time: '07:20' }
];

export default function WhatsappChatPage() {
  const [selectedChatId, setSelectedChatId] = useState('1');
  const [inputText, setInputText] = useState('');

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
              <span className="text-blue-500 font-semibold">Live Chat CS</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              undefined
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Inbox percakapan pelanggan terpadu untuk tim Customer Service, eskalasi komplain tiket NOC, dan respon interaktif.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/whatsapp/quick-reply" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Balasan Cepat</Link>
          </div>
        </div>

        {/* ─── Main Chat Interface Layout ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)] min-h-[680px]">

          {/* Left Column: Chat List (3/12 cols) */}
          <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-col justify-between h-full overflow-hidden space-y-4">
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Chat</h3>
                <button className="p-1 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <Plus size={14} />
                </button>
              </div>
              
              {/* Search chats */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                <input 
                  type="text" 
                  placeholder="Cari chat atau kontak..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-8 py-2 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
                />
                <button className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] hover:text-white">
                  <Filter size={12} />
                </button>
              </div>

              {/* Sub-tabs inside list */}
              <div className="flex border-b border-[var(--app-border)] text-[10px] font-bold text-[var(--app-muted)] pb-1.5 overflow-x-auto gap-2">
                <button className="text-white border-b border-blue-500 pb-1 font-bold">Semua</button>
                <button className="hover:text-[var(--app-text)]/80 pb-1 flex items-center gap-1">
                  <span>Belum Dibaca</span>
                  <span className="bg-green-500/20 text-green-400 px-1 rounded-full text-[8px]">6</span>
                </button>
                <button className="hover:text-[var(--app-text)]/80 pb-1">Favorit</button>
                <button className="hover:text-[var(--app-text)]/80 pb-1">Grup</button>
              </div>

              {/* Chat list items */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {mockChatList.map(item => {
                  const isSelected = selectedChatId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedChatId(item.id)}
                      className={`flex justify-between items-start p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-[#0052cc]/10 border border-[#0052cc]' : 'bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/20'
                      }`}
                    >
                      <div className="flex gap-2.5 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[var(--app-text)] font-bold text-xs overflow-hidden flex-shrink-0">
                          <span>{item.name[0]}</span>
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-[var(--app-text)] leading-none truncate">{item.name}</p>
                            <span className={`px-1 rounded text-[7px] font-black uppercase ${
                              item.label === 'Pelanggan' ? 'bg-green-500/10 text-green-400' :
                              item.label === 'Grup' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                            }`}>
                              {item.label}
                            </span>
                          </div>
                          <p className="text-[9px] text-[var(--app-muted)] leading-tight truncate">{item.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-[8px] text-[var(--app-muted)] font-semibold">{item.time}</span>
                        {item.unreadCount && (
                          <span className="w-4 h-4 bg-[#10b981] text-[var(--app-text)] font-bold rounded-full text-[8px] flex items-center justify-center">
                            {item.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination inside sidebar */}
            <div className="flex justify-between items-center text-[10px] text-[var(--app-muted)] border-t border-[var(--app-border)]/60 pt-3 flex-shrink-0">
              <span>1 - 10 dari 248 chat</span>
              <div className="flex items-center gap-1.5">
                <button className="p-1 border border-[var(--app-border)] rounded text-[var(--app-muted)] disabled:opacity-30" disabled>
                  <ChevronLeft size={10} />
                </button>
                <span className="text-[var(--app-text)] font-bold">1</span>
                <button className="p-1 border border-[var(--app-border)] rounded text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Center Main Chat Area: Chat panel (6/12 cols) */}
          <div className="lg:col-span-6 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs flex flex-col justify-between h-full overflow-hidden">
            
            {/* Header chat */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--app-border)] bg-white/40 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[var(--app-text)] font-bold text-xs overflow-hidden">
                  <span>BS</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[var(--app-text)] leading-none">Budi Santoso</h3>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.2 rounded text-[8px] font-black uppercase">
                      Pelanggan
                    </span>
                  </div>
                  <span className="text-[8px] text-[var(--app-muted)] font-semibold mt-1 block">Terakhir dilihat hari ini pukul 08:32</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                  <Search size={14} />
                </button>
                <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                  <Phone size={14} />
                </button>
                <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                  <Video size={14} />
                </button>
                <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            {/* Bubble log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--app-bg)]/30">
              {/* Date */}
              <div className="flex justify-center">
                <span className="bg-[var(--app-card)] border border-[var(--app-border)] text-[8px] text-[var(--app-muted)] font-bold uppercase px-2 py-0.5 rounded-md">
                  1 Juli 2026
                </span>
              </div>

              {/* Chat flow bubbles */}
              <div className="space-y-4">
                
                {/* L1 */}
                <div className="flex justify-start">
                  <div className="bg-[var(--app-bg)] text-white rounded-xl rounded-tl-none p-3 max-w-[80%] text-[10px] space-y-1 relative">
                    <p className="leading-relaxed">Halo Admin, saya mau tanya tentang paket internet yang cocok untuk rumah 3 orang 🙏</p>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5">08:20</div>
                  </div>
                </div>

                {/* R1 */}
                <div className="flex justify-end">
                  <div className="bg-[#0b51cc]/25 text-white rounded-xl rounded-tr-none p-3 max-w-[80%] text-[10px] space-y-1 relative border border-blue-500/20">
                    <p className="leading-relaxed">
                      Halo Budi, terima kasih sudah menghubungi AudiraNET 😊. Untuk 3 orang, kami rekomendasikan paket Home 50 Mbps. Apakah sudah pernah menggunakan layanan kami sebelumnya?
                    </p>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5 flex items-center justify-end gap-1">
                      <span>08:21</span>
                      <span className="text-blue-400">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* L2 */}
                <div className="flex justify-start">
                  <div className="bg-[var(--app-bg)] text-white rounded-xl rounded-tl-none p-3 max-w-[80%] text-[10px] space-y-1 relative">
                    <p className="leading-relaxed">Belum pernah kak, ini baru pertama kali.</p>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5">08:22</div>
                  </div>
                </div>

                {/* R2 */}
                <div className="flex justify-end">
                  <div className="bg-[#0b51cc]/25 text-white rounded-xl rounded-tr-none p-3 max-w-[80%] text-[10px] space-y-1 relative border border-blue-500/20">
                    <div className="space-y-1 leading-relaxed">
                      <p>Baik kak, berikut detail paket Home 50 Mbps:</p>
                      <p>• Kecepatan : 50 Mbps</p>
                      <p>• Kuota : Unlimited</p>
                      <p>• Harga : Rp 275.000 / bulan</p>
                      <p>• Gratis Instalasi & Router</p>
                      <p>Tertarik untuk berlangganan? 😊</p>
                    </div>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5 flex items-center justify-end gap-1">
                      <span>08:23</span>
                      <span className="text-blue-400">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* L3 */}
                <div className="flex justify-start">
                  <div className="bg-[var(--app-bg)] text-white rounded-xl rounded-tl-none p-3 max-w-[80%] text-[10px] space-y-1 relative">
                    <p className="leading-relaxed">Menarik kak, apakah ada promo bulan ini?</p>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5">08:24</div>
                  </div>
                </div>

                {/* R3 */}
                <div className="flex justify-end">
                  <div className="bg-[#0b51cc]/25 text-white rounded-xl rounded-tr-none p-3 max-w-[80%] text-[10px] space-y-1 relative border border-blue-500/20">
                    <p className="leading-relaxed">
                      Ada kak! 😊 Untuk bulan Juli 2026, ada promo diskon 20% untuk 3 bulan pertama. Jadi hanya Rp 220.000 / bulan selama 3 bulan pertama.
                    </p>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5 flex items-center justify-end gap-1">
                      <span>08:25</span>
                      <span className="text-blue-400">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* L4 */}
                <div className="flex justify-start">
                  <div className="bg-[var(--app-bg)] text-white rounded-xl rounded-tl-none p-3 max-w-[80%] text-[10px] space-y-1 relative">
                    <p className="leading-relaxed">Wah bagus kak, saya ambil paket itu ya.</p>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5">08:26</div>
                  </div>
                </div>

                {/* R4 */}
                <div className="flex justify-end">
                  <div className="bg-[#0b51cc]/25 text-white rounded-xl rounded-tr-none p-3 max-w-[80%] text-[10px] space-y-1 relative border border-blue-500/20">
                    <div className="space-y-1 leading-relaxed">
                      <p>Siap kak! 🙌 Mohon isi data berikut untuk proses pendaftaran:</p>
                      <p>1. Nama Lengkap</p>
                      <p>2. Alamat Lengkap</p>
                      <p>3. Nomor WhatsApp</p>
                      <p>Setelah itu, kami akan proses order dan jadwalkan instalasi.</p>
                    </div>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5 flex items-center justify-end gap-1">
                      <span>08:27</span>
                      <span className="text-blue-400">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* L5 */}
                <div className="flex justify-start">
                  <div className="bg-[var(--app-bg)] text-white rounded-xl rounded-tl-none p-3 max-w-[80%] text-[10px] space-y-1.5 relative">
                    <p className="font-bold border-b border-gray-700 pb-1.5">Data Pendaftaran:</p>
                    <div className="space-y-1 leading-relaxed font-mono">
                      <p>1. Budi Santoso</p>
                      <p>2. Jl. Mawar No. 10, Jakarta Selatan</p>
                      <p>3. 6281234567890</p>
                    </div>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5">08:28</div>
                  </div>
                </div>

                {/* R5 */}
                <div className="flex justify-end">
                  <div className="bg-[#0b51cc]/25 text-white rounded-xl rounded-tr-none p-3 max-w-[80%] text-[10px] space-y-1 relative border border-blue-500/20">
                    <p className="leading-relaxed">
                      Terima kasih kak Budi 🙏. Order #ORD-20260701-00123 telah dibuat. Tim kami akan menghubungi kakak untuk konfirmasi jadwal instalasi.
                    </p>
                    <div className="text-[7px] text-[var(--app-muted)] text-right font-semibold pt-0.5 flex items-center justify-end gap-1">
                      <span>08:30</span>
                      <span className="text-blue-400">✓✓</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-[var(--app-border)] bg-white flex-shrink-0 flex items-center gap-3">
              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                <Smile size={18} />
              </button>
              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                <Paperclip size={18} />
              </button>
              
              <input 
                type="text" 
                placeholder="Ketik pesan..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
              />

              <button className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                <Image size={18} />
              </button>
              
              <button className="p-2.5 bg-[#10b981] hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-md">
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* Right Column: Profile Overview & Quick Actions (3/12 cols) */}
          <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-col justify-between h-full overflow-y-auto space-y-6">
            
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-[var(--app-border)]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[var(--app-text)] font-bold text-lg overflow-hidden">
                  <span>BS</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <h4 className="text-xs font-bold text-[var(--app-text)] leading-none">Budi Santoso</h4>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.2 rounded text-[7px] font-black uppercase">
                      Pelanggan
                    </span>
                  </div>
                  <p className="text-[9px] text-[var(--app-muted)] font-mono mt-1">6281234567890</p>
                </div>
                
                {/* Actions row */}
                <div className="flex justify-center gap-4 text-[8px] font-bold text-[var(--app-muted)] pt-2 w-full">
                  <button className="flex flex-col items-center gap-1"><Users size={14} /><span className="text-[7px]">Profil</span></button>
                  <button className="flex flex-col items-center gap-1"><Phone size={14} /><span className="text-[7px]">Panggil</span></button>
                  <button className="flex flex-col items-center gap-1"><Video size={14} /><span className="text-[7px]">Video</span></button>
                  <button className="flex flex-col items-center gap-1"><Tag size={14} /><span className="text-[7px]">Label</span></button>
                  <button className="flex flex-col items-center gap-1"><MoreVertical size={14} /><span className="text-[7px]">Lainnya</span></button>
                </div>
              </div>

              {/* Info Kontak */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Info Kontak</h4>
                  <button className="text-[9px] text-blue-500 font-bold hover:underline">Tambah ke Kontak</button>
                </div>

                <div className="space-y-3 text-[10px] font-bold text-gray-450 text-[var(--app-muted)]">
                  <div className="flex justify-between"><span>Nama Lengkap</span><span className="text-white">Budi Santoso</span></div>
                  <div className="flex justify-between"><span>Nomor WhatsApp</span><span className="text-white font-mono">6281234567890</span></div>
                  <div className="flex justify-between"><span>Email</span><span className="text-white">budi.santoso@email.com</span></div>
                  <div className="flex justify-between"><span>Alamat</span><span className="text-white text-right leading-tight max-w-[120px]">Jl. Mawar No. 10, Jakarta Selatan</span></div>
                  <div className="flex justify-between"><span>Status</span><span className="text-green-400 font-bold">Aktif</span></div>
                  <div className="flex justify-between"><span>Tanggal Bergabung</span><span className="text-white">22/10/2026 08:20</span></div>
                  <div className="flex justify-between"><span>Sumber</span><span className="text-white">WhatsApp Chat</span></div>
                  <div className="space-y-1">
                    <span>Catatan</span>
                    <p className="text-white text-[9px] leading-relaxed font-normal">
                      Pelanggan potensial, tertarik paket 50 Mbps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Label</h4>
                  <button className="text-[9px] text-blue-500 font-bold hover:underline">Kelola Label</button>
                </div>

                <div className="flex flex-wrap gap-2 text-[8px] font-bold text-[var(--app-muted)]">
                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">Pelanggan</span>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">VIP</span>
                  <span className="bg-[var(--app-bg)] border border-[var(--app-border)] text-white px-2 py-0.5 rounded">Internet</span>
                  <button className="p-0.5 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)]"><Plus size={8} /></button>
                </div>
              </div>

              {/* Media, File & Link */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Media, File & Link</h4>
                  <button className="text-[9px] text-blue-500 font-bold hover:underline">Lihat Semua</button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((item, idx) => (
                    <div key={idx} className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg p-1 h-12 flex items-center justify-center text-[7px] text-blue-400 font-bold uppercase rounded">
                      Doc {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Riwayat Chat */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Riwayat Chat</h4>
                  <button className="text-[9px] text-blue-500 font-bold hover:underline">Lihat Semua</button>
                </div>

                <div className="space-y-2 text-[10px] font-bold text-[var(--app-muted)]">
                  <div className="flex justify-between"><span>Total Chat</span><span className="text-white">12</span></div>
                  <div className="flex justify-between"><span>Pertama Chat</span><span className="text-white font-mono">22/10/2026 08:20</span></div>
                  <div className="flex justify-between"><span>Terakhir Chat</span><span className="text-white font-mono">22/10/2026 08:32</span></div>
                </div>
              </div>
            </div>

            {/* Aksi Cepat Buttons Grid (Bottom Section) */}
            <div className="space-y-3.5 pt-4 border-t border-[var(--app-border)] flex-shrink-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
              
              <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-[var(--app-muted)]">
                {[
                  { name: 'Kirim Template', icon: MessageSquare },
                  { name: 'Kirim Invoice', icon: FileText },
                  { name: 'Buat Order', icon: Wallet },
                  { name: 'Buat Ticket', icon: AlertCircle },
                  { name: 'Buat Follow Up', icon: Clock },
                  { name: 'Tambah Catatan', icon: Edit2 }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={idx}
                      className="flex items-center gap-2 justify-center py-2 px-1 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl transition-all text-center border-gray-800"
                    >
                      <Icon size={12} className="text-[var(--app-muted)] flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
