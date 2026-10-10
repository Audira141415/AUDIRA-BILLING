import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import {
  Search, Download, Eye, Trash2, Clock, HelpCircle, FileText,
  FileSpreadsheet, FileImage, Globe, CheckCircle2, ChevronLeft,
  ChevronRight, ToggleLeft, ToggleRight, Upload, Sliders, X, AlertTriangle, Award, DollarSign, Share2, Copy, FolderOpen, Archive, History, BookOpen, Video, HelpCircle as HelpIcon, PhoneCall
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, BarChart, LineChart
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#A855F7', '#6366F1'];

interface ArchiveItem {
  id: number;
  nama: string;
  subNama: string;
  deskripsi: string;
  jenis: string;
  entitas: string;
  periode: string;
  tanggal: string;
  pembuat: string;
  status: 'Tersimpan' | 'Dalam Retensi' | 'Akan Dihapus';
  ukuran: string;
  kategori: string;
  tags: string[];
}

export default function LaporanKeuangan() {
  const [activeTab, setActiveTab] = useState('Arsip Laporan');

  // Common filters
  const [dariTanggal, setDariTanggal] = useState('2026-06-01');
  const [sampaiTanggal, setSampaiTanggal] = useState('2026-06-30');
  
  // Standard Laporan filters & settings
  const [selectedStandardReport, setSelectedStandardReport] = useState('Laba Rugi');
  const [tampilanStyle, setTampilanStyle] = useState('Ringkasan');
  const [basisAkuntansi, setBasisAkuntansi] = useState('Akrual');
  const [currencySelected, setCurrencySelected] = useState('IDR - Rupiah');
  const [groupingLevel, setGroupingLevel] = useState('Level 3');

  // Pajak Filters
  const [taxTransactions] = useState([
    { id: 1, tanggal: '01/06/2026', jenisPajak: 'PPN Keluaran', dokumen: 'INV/2026/06/0001', referensi: 'Invoice INV/2026/06/0001', dpp: 100000000, tarif: '11%', pajak: 11000000, status: 'Sudah Lapor' },
    { id: 2, tanggal: '01/06/2026', jenisPajak: 'PPN Keluaran', dokumen: 'INV/2026/06/0002', referensi: 'Invoice INV/2026/06/0002', dpp: 150000000, tarif: '11%', pajak: 16500000, status: 'Sudah Lapor' },
    { id: 3, tanggal: '01/06/2026', jenisPajak: 'PPN Masukan', dokumen: 'BILL/2026/06/0001', referensi: 'Pembelian Barang', dpp: 80000000, tarif: '11%', pajak: 8800000, status: 'Sudah Lapor' }
  ]);

  // Kostum Filters
  const [costDetails] = useState([
    { id: 1, kategori: 'Layanan & Operasional', langsung: 420500000, tidakLangsung: 141850000, total: 562350000, kontribusi: '45.19%', perubahan: '+12.35%', isPos: true },
    { id: 2, kategori: 'Infrastruktur & Jaringan', langsung: 210750000, tidakLangsung: 104000000, total: 314750000, kontribusi: '25.28%', perubahan: '+8.72%', isPos: true }
  ]);

  // Konsolidasi Filters
  const [grupEntitas, setGrupEntitas] = useState('Semua Grup');
  const [selectedEntitas, setSelectedEntitas] = useState('Semua Entitas');
  const [consolidationDetails] = useState([
    { name: 'Audira ISP Jakarta', al: 1250450000, atl: 820300000, ta: 2070750000, ll: 620250000, ljp: 350200000, tl: 970450000, te: 1100300000, rev: 1020450000, net: 260350000, cash: 245750000 }
  ]);

  // Ringkasan Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('Semua Jenis');
  const [selectedKategori, setSelectedKategori] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReportDetails, setSelectedReportDetails] = useState<any>(null);

  // Add Item States
  const [newName, setNewName] = useState('');
  const [newJenis, setNewJenis] = useState('Keuangan');
  const [newKategori, setNewKategori] = useState('Laba Rugi');
  const [newPeriode, setNewPeriode] = useState('01/06/2026 - 30/06/2026');
  const [newFormat, setNewFormat] = useState('PDF');

  // Arsip Laporan filters (matching all 12 controls)
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveJenis, setArchiveJenis] = useState('Semua Jenis');
  const [archiveKategori, setArchiveKategori] = useState('Semua Kategori');
  const [archivePeriod, setArchivePeriod] = useState('Juni 2026');
  const [archiveGrup, setArchiveGrup] = useState('Semua Grup');
  const [archiveEntitas, setArchiveEntitas] = useState('Semua Entitas');
  const [archiveUser, setArchiveUser] = useState('Semua User');
  const [archiveStatus, setArchiveStatus] = useState('Semua Status');
  const [archiveTag, setArchiveTag] = useState('Semua Tag');
  const [archiveOrder, setArchiveOrder] = useState('Terbaru');

  const [selectedArchiveItem, setSelectedArchiveItem] = useState<ArchiveItem>({
    id: 1,
    nama: 'Laporan Laba Rugi',
    subNama: 'Laporan laba rugi bulanan Juni 2026',
    deskripsi: 'Laporan laba rugi untuk periode Juni 2026 yang mencakup pendapatan, beban, dan laba bersih.',
    jenis: 'Laporan Standar',
    entitas: 'Audira ISP Jakarta',
    periode: 'Juni 2026',
    tanggal: '01/07/2026 08:30',
    pembuat: 'Agus Dwi Rianto',
    status: 'Tersimpan',
    ukuran: '1.25 MB',
    kategori: 'Profitabilitas',
    tags: ['Laba Rugi', 'Bulanan', 'Juni 2026']
  });

  // Settings State Toggles
  const [multiEntity, setMultiEntity] = useState(true);
  const [autoMerge, setAutoMerge] = useState(true);
  const [showZeroValue, setShowZeroValue] = useState(false);
  const [lockPeriod, setLockPeriod] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [showFooterInfo, setShowFooterInfo] = useState(true);
  const [showWatermark, setShowWatermark] = useState(false);

  const [reports, setReports] = useState<any[]>([
    { id: 1, namaLaporan: 'Laba Rugi Bulanan - Juni 2026', jenis: 'Keuangan', kategori: 'Laba Rugi', periode: '01/06/2026 - 30/06/2026', tanggalDibuat: '01/07/2026 08:30', dibuatOleh: 'Agus Dwi Rianto', format: 'PDF', status: 'Selesai' }
  ]);

  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Laporan Laba Rugi Bulanan', schedule: 'Setiap bulan, tgl 02 - 08:00 WIB', active: true }
  ]);

  const [archives] = useState<ArchiveItem[]>([
    { id: 1, nama: 'Laporan Laba Rugi', subNama: 'Laporan laba rugi bulanan Juni 2026', deskripsi: 'Laporan laba rugi untuk periode Juni 2026 yang mencakup pendapatan, beban, dan laba bersih.', jenis: 'Laporan Standar', entitas: 'Audira ISP Jakarta', periode: 'Juni 2026', tanggal: '01/07/2026 08:30', pembuat: 'Agus Dwi Rianto', status: 'Tersimpan', ukuran: '1.25 MB', kategori: 'Profitabilitas', tags: ['Laba Rugi', 'Bulanan', 'Juni 2026'] },
    { id: 2, nama: 'Laporan Neraca', subNama: 'Neraca posisi keuangan Juni 2026', deskripsi: 'Neraca posisi keuangan perusahaan per Juni 2026.', jenis: 'Laporan Standar', entitas: 'Audira ISP Jakarta', periode: 'Juni 2026', tanggal: '01/07/2026 08:25', pembuat: 'Agus Dwi Rianto', status: 'Tersimpan', ukuran: '980 KB', kategori: 'Neraca', tags: ['Neraca', 'Bulanan'] },
    { id: 3, nama: 'Laporan Arus Kas', subNama: 'Arus kas bulan Juni 2026', deskripsi: 'Arus kas bulanan Juni 2026.', jenis: 'Laporan Manajerial', entitas: 'Semua Grup', periode: 'Juni 2026', tanggal: '01/07/2026 07:50', pembuat: 'Budi Santoso', status: 'Tersimpan', ukuran: '1.10 MB', kategori: 'Arus Kas', tags: ['Arus Kas', 'Bulanan'] },
    { id: 4, nama: 'Laporan PPN Keluaran', subNama: 'PPN Keluaran Juni 2026', deskripsi: 'PPN Keluaran Juni 2026.', jenis: 'Laporan Pajak', entitas: 'Semua Entitas', periode: 'Juni 2026', tanggal: '30/06/2026 16:45', pembuat: 'Siti Nurhaliza', status: 'Dalam Retensi', ukuran: '560 KB', kategori: 'PPN', tags: ['Pajak', 'PPN'] },
    { id: 5, nama: 'Laporan Konsolidasi', subNama: 'Konsolidasi seluruh entitas Juni 2026', deskripsi: 'Konsolidasi seluruh entitas Juni 2026.', jenis: 'Laporan Konsolidasi', entitas: 'Semua Grup', periode: 'Juni 2026', tanggal: '30/06/2026 15:30', pembuat: 'Agus Dwi Rianto', status: 'Tersimpan', ukuran: '2.75 MB', kategori: 'Konsolidasi', tags: ['Konsolidasi'] },
    { id: 6, nama: 'Laporan Biaya Operasional', subNama: 'Analisis biaya operasional', deskripsi: 'Analisis biaya operasional.', jenis: 'Laporan Kostum', entitas: 'Audira ISP Bandung', periode: 'Juni 2026', tanggal: '30/06/2026 14:20', pembuat: 'Dewi Lestari', status: 'Tersimpan', ukuran: '1.85 MB', kategori: 'Operational', tags: ['Biaya', 'Operasional'] },
    { id: 7, nama: 'Laporan ROI', subNama: 'Return on Investment Q2 2026', deskripsi: 'Return on Investment Q2 2026.', jenis: 'Laporan Manajerial', entitas: 'Audira ISP Medan', periode: 'Q2 2026', tanggal: '30/06/2026 13:10', pembuat: 'Budi Santoso', status: 'Dalam Retensi', ukuran: '1.45 MB', kategori: 'Rasio', tags: ['ROI', 'Rasio'] },
    { id: 8, nama: 'Laporan PPh 21', subNama: 'PPh 21 Juni 2026', deskripsi: 'PPh 21 Juni 2026.', jenis: 'Laporan Pajak', entitas: 'Semua Entitas', periode: 'Juni 2026', tanggal: '29/06/2026 18:40', pembuat: 'Siti Nurhaliza', status: 'Akan Dihapus', ukuran: '320 KB', kategori: 'PPh', tags: ['PPh 21', 'Pajak'] },
    { id: 9, nama: 'Laporan Budget vs Realisasi', subNama: 'Perbandingan budget vs realisasi', deskripsi: 'Perbandingan budget vs realisasi.', jenis: 'Laporan Kostum', entitas: 'Audira ISP Jakarta', periode: 'Juni 2026', tanggal: '29/06/2026 17:25', pembuat: 'Dewi Lestari', status: 'Tersimpan', ukuran: '1.20 MB', kategori: 'Operational', tags: ['Budget', 'Realisasi'] },
    { id: 10, nama: 'Laporan Arus Kas Proyeksi', subNama: 'Proyeksi arus kas 12 bulan', deskripsi: 'Proyeksi arus kas 12 bulan.', jenis: 'Laporan Manajerial', entitas: 'Semua Grup', periode: 'Juli 2026', tanggal: '29/06/2026 16:10', pembuat: 'Agus Dwi Rianto', status: 'Tersimpan', ukuran: '1.60 MB', kategori: 'Proyeksi', tags: ['Arus Kas', 'Proyeksi'] }
  ]);

  const [savedTemplates] = useState([
    { id: 1, nama: 'Laba Rugi Standar', jenis: 'Laporan Standar', desc: 'Template standar laporan laba rugi bulanan', pembuat: 'Agus Dwi Rianto', diubah: '30/06/2026 10:22', status: 'Aktif' }
  ]);

  const filteredReports = useMemo(() => {
    return reports.filter(item => {
      const matchSearch = item.namaLaporan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchJenis = selectedJenis === 'Semua Jenis' || item.jenis === selectedJenis;
      return matchSearch && matchJenis;
    });
  }, [reports, searchTerm, selectedJenis]);

  const paginatedReports = useMemo(() => {
    return filteredReports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredReports, currentPage, rowsPerPage]);

  const filteredArchives = useMemo(() => {
    return archives.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(archiveSearch.toLowerCase()) || 
                          item.subNama.toLowerCase().includes(archiveSearch.toLowerCase()) ||
                          item.deskripsi.toLowerCase().includes(archiveSearch.toLowerCase());
      const matchJenis = archiveJenis === 'Semua Jenis' || item.jenis === archiveJenis;
      const matchStatus = archiveStatus === 'Semua Status' || item.status === archiveStatus;
      return matchSearch && matchJenis && matchStatus;
    });
  }, [archives, archiveSearch, archiveJenis, archiveStatus]);

  return (
    <Layout>
      <div className="bg-[#050B14] text-slate-100 min-h-screen p-6 font-sans antialiased selection:bg-cyan-500 selection:text-white">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Finance</span>
              <span>&gt;</span>
              <span>Laporan Keuangan</span>
              {activeTab !== 'Ringkasan' && (
                <>
                  <span>&gt;</span>
                  <span className="text-cyan-400 font-medium">{activeTab}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{activeTab === 'Ringkasan' ? 'Laporan Keuangan' : activeTab}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === 'Arsip Laporan' ? 'Kelola, cari, unduh dan kelola arsip semua laporan keuangan perusahaan dengan aman.' : 'Kelola dan analisis laporan keuangan perusahaan secara komprehensif.'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'Arsip Laporan' ? (
              <>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer">
                  <Clock className="w-4 h-4" />
                  <span>Buat Laporan</span>
                </button>
                <button className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Bantuan</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer">
                  <Clock className="w-4 h-4" />
                  <span>Buat Laporan</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Switcher Headers */}
        <div className="flex items-center gap-1 border-b border-slate-800/80 mb-6 overflow-x-auto scrollbar-thin">
          {['Ringkasan', 'Laporan Standar', 'Laporan Manajerial', 'Laporan Pajak', 'Laporan Kostum', 'Laporan Konsolidasi', 'Arsip Laporan', 'Pengaturan'].map((t) => {
            const isNew = ['Laporan Pajak', 'Laporan Kostum', 'Laporan Konsolidasi'].includes(t);
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-xs px-4 py-3 border-b-2 font-medium whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === t ? 'border-blue-500 text-blue-400 bg-blue-950/10' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{t}</span>
                {isNew && (
                  <span className="text-[8px] bg-blue-600 text-white font-extrabold px-1 py-0.5 rounded leading-none scale-90">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 7: ARSIP LAPORAN */}
        {activeTab === 'Arsip Laporan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter Parameter Query Form (12 filters exactly matching the image) */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-4.5 shadow-sm text-xs space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Cari Laporan</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Cari nama laporan, deskripsi..." 
                      value={archiveSearch}
                      onChange={e => setArchiveSearch(e.target.value)}
                      className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 pl-9 w-full focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Jenis Laporan</label>
                  <select value={archiveJenis} onChange={e => setArchiveJenis(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Semua Jenis</option>
                    <option>Laporan Standar</option>
                    <option>Laporan Manajerial</option>
                    <option>Laporan Pajak</option>
                    <option>Laporan Kostum</option>
                    <option>Laporan Konsolidasi</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Kategori</label>
                  <select value={archiveKategori} onChange={e => setArchiveKategori(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Semua Kategori</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Periode</label>
                  <select value={archivePeriod} onChange={e => setArchivePeriod(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Juni 2026</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Dari Tanggal</label>
                  <input type="date" value={dariTanggal} onChange={e => setDariTanggal(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full" />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Sampai Tanggal</label>
                  <input type="date" value={sampaiTanggal} onChange={e => setSampaiTanggal(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 pt-1 border-t border-slate-900/60">
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Grup / Entitas</label>
                  <select value={archiveGrup} onChange={e => setArchiveGrup(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Semua Grup</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Entitas</label>
                  <select value={archiveEntitas} onChange={e => setArchiveEntitas(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Semua Entitas</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Dibuat Oleh</label>
                  <select value={archiveUser} onChange={e => setArchiveUser(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Semua User</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Status</label>
                  <select value={archiveStatus} onChange={e => setArchiveStatus(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Semua Status</option>
                    <option>Tersimpan</option>
                    <option>Dalam Retensi</option>
                    <option>Akan Dihapus</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Tag / Label</label>
                  <select value={archiveTag} onChange={e => setArchiveTag(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Semua Tag</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold">Urutkan</label>
                  <select value={archiveOrder} onChange={e => setArchiveOrder(e.target.value)} className="bg-[#050B14] border border-slate-800 text-white rounded-lg p-2 w-full">
                    <option>Terbaru</option>
                  </select>
                </div>
                <div className="flex gap-2 items-end">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg w-full">Filter</button>
                  <button onClick={() => { setArchiveSearch(''); setArchiveStatus('Semua Status'); }} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-lg w-full">Reset</button>
                </div>
              </div>
            </div>

            {/* Storage Cards Row (with progress bar) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'Total Arsip', val: '256', change: '+18 dari bulan lalu' },
                { label: 'Laporan Tersimpan', val: '198', change: '+15 dari bulan lalu' },
                { label: 'Dalam Retensi', val: '48', change: '-2 dari bulan lalu' },
                { label: 'Akan Dihapus', val: '10', change: 'dalam 30 hari' }
              ].map((it, idx) => (
                <div key={idx} className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5">
                  <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">{it.label}</div>
                  <div className="text-2xl font-bold text-white mt-1.5">{it.val}</div>
                  <div className="text-[9px] text-slate-500 mt-1">{it.change}</div>
                </div>
              ))}
              <div className="bg-[#0B1528]/80 border border-blue-950 rounded-xl p-4.5 flex flex-col justify-between">
                <div>
                  <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Total Ukuran</div>
                  <div className="text-lg font-bold text-white mt-1">12.45 GB <span className="text-[10px] text-slate-500 font-normal">/ 25 GB</span></div>
                </div>
                <div className="w-full bg-[#050B14] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '49.8%' }} />
                </div>
                <div className="text-[8px] text-slate-400 mt-1">Penggunaan Penyimpanan 12.45 GB / 25 GB (49.8%)</div>
              </div>
            </div>

            {/* Table & Right column Details split */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* TABLE LIST */}
              <div className="xl:col-span-3 bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Daftar Arsip Laporan</h3>
                  <div className="flex items-center gap-2">
                    <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700/80 cursor-pointer">Aksi Massal</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 px-3 w-8 text-center"><input type="checkbox" /></th>
                        <th className="py-2.5 px-3 w-10 text-center">NO</th>
                        <th className="py-2.5 px-3">NAMA LAPORAN</th>
                        <th className="py-2.5 px-3">JENIS LAPORAN</th>
                        <th className="py-2.5 px-3">ENTITAS / GRUP</th>
                        <th className="py-2.5 px-3">PERIODE</th>
                        <th className="py-2.5 px-3">TANGGAL DIBUAT</th>
                        <th className="py-2.5 px-3">DIBUAT OLEH</th>
                        <th className="py-2.5 px-3 text-center">STATUS</th>
                        <th className="py-2.5 px-3 text-right">UKURAN</th>
                        <th className="py-2.5 px-3 text-center w-16">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArchives.map((item, idx) => (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedArchiveItem(item)}
                          className={`border-b border-slate-900 hover:bg-slate-950/40 transition-colors cursor-pointer ${selectedArchiveItem.id === item.id ? 'bg-[#0E1B35]/30' : ''}`}
                        >
                          <td className="py-3.5 px-3 text-center"><input type="checkbox" onClick={e => e.stopPropagation()} /></td>
                          <td className="py-3.5 px-3 text-center text-slate-500">{idx + 1}</td>
                          <td className="py-3.5 px-3 font-semibold text-white">
                            <div>{item.nama}</div>
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5">{item.subNama}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400">{item.jenis}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-300">{item.entitas}</td>
                          <td className="py-3.5 px-3 text-slate-400">{item.periode}</td>
                          <td className="py-3.5 px-3 text-slate-400">{item.tanggal}</td>
                          <td className="py-3.5 px-3 text-slate-300">{item.pembuat}</td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                              item.status === 'Tersimpan'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : item.status === 'Dalam Retensi'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}>{item.status}</span>
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium text-slate-300">{item.ukuran}</td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button className="p-1 text-slate-500 hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                              <button className="p-1 text-slate-500 hover:text-white"><Download className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DETAILS SIDEBAR */}
              <div className="space-y-6">
                
                <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Detail Laporan</h3>
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[9px]">{selectedArchiveItem.status}</span>
                  </div>

                  <div className="space-y-3.5 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Nama Laporan</span>
                      <span className="font-semibold text-white mt-1 block">{selectedArchiveItem.nama}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Jenis Laporan</span>
                        <span className="font-semibold text-slate-200 mt-1 block">{selectedArchiveItem.jenis}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Kategori</span>
                        <span className="font-semibold text-slate-200 mt-1 block">{selectedArchiveItem.kategori}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Entitas</span>
                      <span className="font-semibold text-slate-200 mt-1 block">{selectedArchiveItem.entitas}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Periode</span>
                        <span className="font-semibold text-slate-200 mt-1 block">{selectedArchiveItem.periode}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Ukuran File</span>
                        <span className="font-semibold text-slate-200 mt-1 block">{selectedArchiveItem.ukuran}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Tanggal Dibuat</span>
                      <span className="font-semibold text-slate-200 mt-1 block">{selectedArchiveItem.tanggal}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Dibuat Oleh</span>
                      <span className="font-semibold text-slate-200 mt-1 block">{selectedArchiveItem.pembuat}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Deskripsi</span>
                      <span className="text-slate-400 mt-1 block leading-normal">{selectedArchiveItem.deskripsi}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Tags</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedArchiveItem.tags.map(t => (
                          <span key={t} className="bg-slate-800 text-slate-300 text-[8px] font-bold px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 space-y-2.5 text-xs">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-2 mb-1">Aksi Cepat</h3>
                  <button className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg cursor-pointer">
                    <Eye className="w-4 h-4" />
                    <span>Lihat Laporan</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-1 bg-[#050B14] hover:bg-[#07101F] border border-slate-850 py-2.5 rounded-lg text-slate-300 font-semibold cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 bg-[#050B14] hover:bg-[#07101F] border border-slate-850 py-2.5 rounded-lg text-slate-300 font-semibold cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-1 bg-[#050B14] hover:bg-[#07101F] border border-slate-850 py-2.5 rounded-lg text-slate-300 font-semibold cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplikat</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 bg-[#050B14] hover:bg-[#07101F] border border-slate-850 py-2.5 rounded-lg text-slate-300 font-semibold cursor-pointer">
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Pindahkan</span>
                    </button>
                  </div>
                  <button className="w-full flex items-center justify-center gap-1.5 border border-dashed border-red-500/40 text-rose-400 hover:text-rose-300 hover:border-red-400 py-2 rounded-lg font-semibold cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Laporan</span>
                  </button>
                </div>

                <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 space-y-4 text-xs">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-2">Riwayat Aktivitas</h3>
                  <div className="space-y-3.5">
                    {[
                      { type: 'dibuat', user: 'Agus Dwi Rianto', time: '01/07/2026 08:30' },
                      { type: 'dilihat', user: 'Budi Santoso', time: '01/07/2026 09:15' },
                      { type: 'diunduh', user: 'Siti Nurhaliza', time: '01/07/2026 09:20' }
                    ].map((h, i) => (
                      <div key={i} className="flex gap-2 items-start text-[10px] text-slate-300">
                        <History className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Laporan {h.type}</p>
                          <span className="text-slate-400">{h.user}</span>
                          <span className="text-slate-500 block mt-0.5">{h.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 8: PENGATURAN */}
        {activeTab === 'Pengaturan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 space-y-4 text-xs">
                <h3 className="font-bold text-white uppercase tracking-wider text-[10px] border-b border-slate-900 pb-2 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-blue-500" /><span>Pengaturan Umum</span></h3>
                <div className="space-y-3 text-slate-300">
                  <div className="flex justify-between items-center py-1"><span>Aktifkan Multi Entitas</span><button onClick={() => setMultiEntity(!multiEntity)}>{multiEntity ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}</button></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
