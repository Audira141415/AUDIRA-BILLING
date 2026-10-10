import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Settings,
  Building2,
  DollarSign,
  Calendar,
  Globe,
  Monitor,
  BookOpen,
  FolderTree,
  GitCommit,
  Wallet,
  FileSpreadsheet,
  Percent,
  Layers,
  ShieldCheck,
  CreditCard,
  Building,
  Key,
  Clock,
  Coins,
  FileDigit,
  FileCode,
  FileCheck2,
  RefreshCw,
  Share2,
  Database,
  Search,
  Trash2,
  Save,
  CheckCircle2,
  Edit,
  X
} from 'lucide-react';

interface CompanyInfo {
  name: string;
  npwp: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  fiscalYear: string;
  accountingPeriod: string;
}

interface SettingsLog {
  id: number;
  user: string;
  action: string;
  time: string;
}

export default function FinanceSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Umum');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [activeManageSection, setActiveManageSection] = useState('');

  // Company Information State
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'PT Audira Network Indonesia',
    npwp: '12.345.678.9-012.000',
    address: 'Jl. Merdeka No. 123 Yogyakarta, D.I. Yogyakarta 55281',
    phone: '(0274) 1234567',
    email: 'finance@audiranet.com',
    website: 'https://www.audiranet.com',
    currency: 'IDR - Rupiah',
    fiscalYear: '01 Januari - 31 Desember',
    accountingPeriod: 'Bulanan'
  });

  // Temp State for editing
  const [tempCompanyInfo, setTempCompanyInfo] = useState<CompanyInfo>({ ...companyInfo });

  // Recent Settings Activity Log
  const [activityLogs, setActivityLogs] = useState<SettingsLog[]>([
    { id: 1, user: 'Agus Dwi Rianto', action: 'Mengubah pengaturan pajak PPN', time: '01/07/2026 08:30' },
    { id: 2, user: 'Sari Dewi', action: 'Menambahkan metode pembayaran baru', time: '01/07/2026 08:15' },
    { id: 3, user: 'Budi Santoso', action: 'Mengubah format nomor invoice', time: '01/07/2026 07:45' },
    { id: 4, user: 'Dimas Setiawan', action: 'Mengupdate akun bank perusahaan', time: '01/07/2026 07:20' }
  ]);

  // Handle Save All Settings Changes
  const handleSaveAll = () => {
    setShowSavedToast(true);
    // Add current user action to activity logs
    const newLog: SettingsLog = {
      id: activityLogs.length + 1,
      user: 'Agus Dwi Rianto',
      action: 'Menyimpan seluruh konfigurasi pengaturan finance',
      time: new Date().toLocaleString('id-ID', { hour12: false }).replace(/\./g, ':')
    };
    setActivityLogs([newLog, ...activityLogs]);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Handle Company Info Update
  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyInfo({ ...tempCompanyInfo });
    setShowEditCompanyModal(false);
    
    // Log Activity
    const newLog: SettingsLog = {
      id: activityLogs.length + 1,
      user: 'Agus Dwi Rianto',
      action: 'Memperbarui profil Informasi Perusahaan',
      time: new Date().toLocaleString('id-ID', { hour12: false }).replace(/\./g, ':')
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  // Open generic Manage Modal
  const openManageModal = (sectionName: string) => {
    setActiveManageSection(sectionName);
    setShowManageModal(true);
  };

  // Tabs list matching mockup
  const tabsList = [
    'Umum', 'Akun & Kategori', 'Pajak', 'Penomoran', 'Pembayaran', 
    'Laporan', 'Anggaran', 'Rekonsiliasi', 'Integrasi', 
    'Akses & Keamanan', 'Notifikasi', 'Lainnya'
  ];

  return (
    <Layout>
      <div className="bg-[#050B14] text-slate-100 min-h-screen p-6 font-sans antialiased selection:bg-cyan-500 selection:text-white relative">
        
        {/* Toast Notification */}
        {showSavedToast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-white text-xs font-semibold px-4.5 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perubahan pengaturan berhasil disimpan!</span>
          </div>
        )}

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Finance</span>
              <span>&gt;</span>
              <span className="text-cyan-400 font-medium">Pengaturan</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pengaturan Finance</h1>
            <p className="text-xs text-slate-400 mt-0.5">Kelola konfigurasi sistem keuangan sesuai kebutuhan bisnis Anda.</p>
          </div>
          
          <div>
            <button 
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-blue-600/10 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center gap-1 border-b border-slate-800/80 mb-6 overflow-x-auto scrollbar-thin scrollbar-track-transparent">
          {tabsList.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-4 py-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400 bg-blue-950/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* MAIN LAYOUT SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* LEFT 3 COLS FOR CONFIG GRID */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* 1. PENGATURAN UMUM */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Umum</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {[
                  { title: 'Informasi Perusahaan', desc: 'Kelola profil perusahaan, alamat, kontak, dan informasi legal.', icon: Building2 },
                  { title: 'Mata Uang & Format', desc: 'Atur mata uang default, format angka, tanggal, dan pembulatan.', icon: DollarSign },
                  { title: 'Tahun Fiskal', desc: 'Atur tahun fiskal, periode akuntansi, dan periode tutup buku.', icon: Calendar },
                  { title: 'Bahasa', desc: 'Atur bahasa yang digunakan di modul finance.', icon: Globe },
                  { title: 'Preferensi Tampilan', desc: 'Atur tampilan tabel, kolom default, dan preferensi visual.', icon: Monitor }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="bg-blue-600/10 w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 mb-3">
                        <item.icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1.5">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 leading-normal mb-4">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (item.title === 'Informasi Perusahaan') {
                          setTempCompanyInfo({ ...companyInfo });
                          setShowEditCompanyModal(true);
                        } else {
                          openManageModal(item.title);
                        }
                      }}
                      className="w-full text-center bg-[#050B14] hover:bg-[#081120] border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 py-2 transition-colors cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. PENGATURAN AKUN & KATEGORI */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Akun & Kategori</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {[
                  { title: 'Akun Perkiraan', desc: 'Kelola daftar akun COA (Chart of Account).', icon: BookOpen },
                  { title: 'Kategori Akun', desc: 'Kelola kategori akun (Aset, Liabilities, Ekuitas, Pendapatan, Beban).', icon: FolderTree },
                  { title: 'Mapping Akun', desc: 'Pemetaan akun untuk modul lain (invoice, payment, dll).', icon: GitCommit },
                  { title: 'Saldo Awal', desc: 'Atur saldo awal untuk akun tertentu.', icon: Coins },
                  { title: 'Aturan Jurnal', desc: 'Atur aturan otomatis jurnal dan validasi.', icon: FileSpreadsheet }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="bg-blue-600/10 w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 mb-3">
                        <item.icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1.5">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 leading-normal mb-4">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => openManageModal(item.title)}
                      className="w-full text-center bg-[#050B14] hover:bg-[#081120] border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 py-2 transition-colors cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PENGATURAN PAJAK */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Pajak</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {[
                  { title: 'Jenis Pajak', desc: 'Kelola jenis pajak (PPN, PPh, Bea Materai, dll).', icon: Percent },
                  { title: 'Tarif Pajak', desc: 'Atur tarif pajak sesuai jenis dan periode.', icon: FileSpreadsheet },
                  { title: 'Kelompok Pajak', desc: 'Kelompokkan pajak untuk memudahkan pengelolaan.', icon: Layers },
                  { title: 'Aturan Pajak', desc: 'Atur aturan pajak (inklusi, eksklusi, threshold).', icon: ShieldCheck },
                  { title: 'Klasifikasi NPWP', desc: 'Kelola jenis NPWP (Pribadi, Badan, Luar Negeri).', icon: Monitor }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="bg-blue-600/10 w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 mb-3">
                        <item.icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1.5">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 leading-normal mb-4">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => openManageModal(item.title)}
                      className="w-full text-center bg-[#050B14] hover:bg-[#081120] border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 py-2 transition-colors cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. PENGATURAN PEMBAYARAN */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Pembayaran</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {[
                  { title: 'Metode Pembayaran', desc: 'Kelola metode pembayaran yang tersedia.', icon: CreditCard },
                  { title: 'Akun Bank', desc: 'Kelola daftar rekening bank perusahaan.', icon: Building },
                  { title: 'Gateway Pembayaran', desc: 'Atur integrasi payment gateway.', icon: Key },
                  { title: 'Termin Pembayaran', desc: 'Atur syarat dan termin pembayaran.', icon: Clock },
                  { title: 'Biaya & Komisi', desc: 'Atur biaya admin, komisi, dan potongan.', icon: Coins }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="bg-blue-600/10 w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 mb-3">
                        <item.icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1.5">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 leading-normal mb-4">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => openManageModal(item.title)}
                      className="w-full text-center bg-[#050B14] hover:bg-[#081120] border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 py-2 transition-colors cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. PENGATURAN PENOMORAN */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Penomoran</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {[
                  { title: 'Nomor Invoice', desc: 'Atur format dan urutan nomor invoice.', icon: FileDigit },
                  { title: 'Nomor Kwitansi', desc: 'Atur format nomor kwitansi pembayaran.', icon: FileCode },
                  { title: 'Nomor Jurnal', desc: 'Atur format nomor jurnal umum.', icon: FileCheck2 },
                  { title: 'Nomor Pajak', desc: 'Atur format nomor dokumen pajak.', icon: FileSpreadsheet },
                  { title: 'Reset Nomor', desc: 'Reset atau ubah urutan nomor dokumen.', icon: RefreshCw }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="bg-blue-600/10 w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 mb-3">
                        <item.icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1.5">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 leading-normal mb-4">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => openManageModal(item.title)}
                      className="w-full text-center bg-[#050B14] hover:bg-[#081120] border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 py-2 transition-colors cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. LAINNYA */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lainnya</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {[
                  { title: 'Integrasi', desc: 'Atur integrasi dengan modul lain dan pihak ketiga.', icon: Share2 },
                  { title: 'Import & Export', desc: 'Atur template import/export data finance.', icon: FileSpreadsheet },
                  { title: 'Backup Data', desc: 'Kelola backup dan restore data keuangan.', icon: Database },
                  { title: 'Audit Trail', desc: 'Lihat log perubahan data keuangan.', icon: Clock },
                  { title: 'Hapus Data', desc: 'Hapus data tidak terpakai dengan aman.', icon: Trash2 }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="bg-blue-600/10 w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 mb-3">
                        <item.icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1.5">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 leading-normal mb-4">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => openManageModal(item.title)}
                      className="w-full text-center bg-[#050B14] hover:bg-[#081120] border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 py-2 transition-colors cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 1 COL FOR SIDEBAR */}
          <div className="space-y-6">
            
            {/* Company Info Sidebar Block */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm relative">
              <div className="flex items-center justify-between mb-4 border-b border-slate-900/60 pb-2">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Informasi Perusahaan</h2>
                <button 
                  onClick={() => {
                    setTempCompanyInfo({ ...companyInfo });
                    setShowEditCompanyModal(true);
                  }}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Logo + Company */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blue-600/10 flex items-center justify-center rounded-lg border border-blue-500/20">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">{companyInfo.name}</h3>
                  <p className="text-[9px] text-slate-400 mt-0.5">ISP Billing System</p>
                </div>
              </div>

              <div className="space-y-3 text-[11px]">
                <div>
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Nama Perusahaan</div>
                  <div className="text-slate-200 mt-0.5 font-medium">{companyInfo.name}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">NPWP</div>
                  <div className="text-slate-200 mt-0.5 font-medium">{companyInfo.npwp}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Alamat</div>
                  <div className="text-slate-300 mt-0.5 leading-relaxed">{companyInfo.address}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Telepon</div>
                  <div className="text-slate-200 mt-0.5 font-medium">{companyInfo.phone}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Email</div>
                  <div className="text-slate-200 mt-0.5 font-medium">{companyInfo.email}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Website</div>
                  <a href={companyInfo.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline mt-0.5 block font-medium">
                    {companyInfo.website}
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                  <div>
                    <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Mata Uang</div>
                    <div className="text-slate-200 mt-0.5">{companyInfo.currency.split(' - ')[0]}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Tahun Fiskal</div>
                    <div className="text-slate-200 mt-0.5 text-[9px] truncate">{companyInfo.fiscalYear.split(' - ')[0]}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Config Sections status check */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-900/50 pb-2">Status Pengaturan</h2>
              <div className="space-y-3.5 text-xs">
                {[
                  'Pengaturan Umum', 'Akun & Kategori', 'Pajak', 'Pembayaran', 
                  'Penomoran', 'Laporan', 'Rekonsiliasi', 'Integrasi'
                ].map((sec, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-400">{sec}</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings Activity Logs */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-900/50 pb-2">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Aktivitas Terakhir</h2>
                <button className="text-[10px] text-blue-400 font-semibold hover:underline">Lihat Semua</button>
              </div>

              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="space-y-0.5 border-b border-slate-900/50 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white font-semibold">{log.user}</span>
                      <span className="text-[9px] text-slate-500">{log.time.split(' ')[0]}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{log.action}</div>
                    <div className="text-[9px] text-slate-500">{log.time.split(' ')[1] || ''}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* EDIT COMPANY PROFILE MODAL */}
      {showEditCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A1629] border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Edit Informasi Perusahaan</h3>
              <button 
                onClick={() => setShowEditCompanyModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCompanyUpdate} className="p-5 space-y-4 text-xs text-slate-300">
              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold">Nama Perusahaan</label>
                <input 
                  type="text" 
                  value={tempCompanyInfo.name}
                  onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, name: e.target.value })}
                  className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold">NPWP</label>
                <input 
                  type="text" 
                  value={tempCompanyInfo.npwp}
                  onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, npwp: e.target.value })}
                  className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold">Alamat Lengkap</label>
                <textarea 
                  value={tempCompanyInfo.address}
                  onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, address: e.target.value })}
                  rows={2}
                  className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500 leading-relaxed font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Telepon</label>
                  <input 
                    type="text" 
                    value={tempCompanyInfo.phone}
                    onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, phone: e.target.value })}
                    className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Email Finance</label>
                  <input 
                    type="email" 
                    value={tempCompanyInfo.email}
                    onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, email: e.target.value })}
                    className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold">Website Utama</label>
                <input 
                  type="text" 
                  value={tempCompanyInfo.website}
                  onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, website: e.target.value })}
                  className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold text-[10px]">Mata Uang</label>
                  <select 
                    value={tempCompanyInfo.currency}
                    onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, currency: e.target.value })}
                    className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  >
                    <option>IDR - Rupiah</option>
                    <option>USD - Dollar US</option>
                    <option>SGD - Singapore Dollar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold text-[10px]">Tahun Fiskal</label>
                  <input 
                    type="text" 
                    value={tempCompanyInfo.fiscalYear}
                    onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, fiscalYear: e.target.value })}
                    className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold text-[10px]">Periode Akuntansi</label>
                  <select
                    value={tempCompanyInfo.accountingPeriod}
                    onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, accountingPeriod: e.target.value })}
                    className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  >
                    <option>Bulanan</option>
                    <option>Triwulanan</option>
                    <option>Tahunan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setShowEditCompanyModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERIC MANAGE PARAMETERS MODAL */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A1629] border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kelola Parameter: {activeManageSection}</h3>
              <button 
                onClick={() => setShowManageModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs text-slate-300">
              <div className="bg-[#050B14] border border-slate-900 rounded-lg p-4 space-y-2">
                <p className="text-[10px] text-slate-400">Parameter saat ini untuk {activeManageSection} terkonfigurasi dengan standar bawaan (default) sistem keuangan AudiraNET.</p>
                <div className="pt-2">
                  <div className="flex justify-between items-center text-xs border-b border-slate-900/60 pb-1.5 mb-1.5">
                    <span className="text-slate-400">Status Integrasi:</span>
                    <span className="text-emerald-400 font-bold">Terhubung</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Otoritas Modul:</span>
                    <span className="text-slate-200 font-semibold">Super Admin Only</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold">Ubah Parameter Kunci</label>
                <input 
                  type="text" 
                  placeholder="Masukkan konfigurasi baru..."
                  className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button 
                  onClick={() => setShowManageModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
                <button 
                  onClick={() => {
                    setShowManageModal(false);
                    handleSaveAll();
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Terapkan & Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
