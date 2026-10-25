import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  X,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  AlertCircle,
  HelpCircle,
  FileDown,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Helper to format currency to IDR style
const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_TAX = ['#0284C7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface TaxObligation {
  id: number;
  jenisPajak: string;
  masaPajak: string;
  tglJatuhTempo: string;
  dpp: number;
  tarif: string;
  pajakTerutang: number;
  pajakDibayar: number;
  status: 'Belum Lunas' | 'Sebagian' | 'Lunas';
}

export default function PajakDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('Semua Jenis Pajak');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedMasa, setSelectedMasa] = useState('Semua Masa Pajak');
  const [selectedTahun, setSelectedTahun] = useState('Tahun 2026');

  // Table Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTaxDetails, setSelectedTaxDetails] = useState<TaxObligation | null>(null);

  // Add Tax form state
  const [newJenis, setNewJenis] = useState('PPN');
  const [newMasa, setNewMasa] = useState('Juni 2026');
  const [newJatuhTempo, setNewJatuhTempo] = useState('15 Jul 2026');
  const [newDpp, setNewDpp] = useState('');
  const [newTarif, setNewTarif] = useState('10%');
  const [newTerutang, setNewTerutang] = useState('');
  const [newDibayar, setNewDibayar] = useState('0');
  const [newStatus, setNewStatus] = useState<'Belum Lunas' | 'Sebagian' | 'Lunas'>('Belum Lunas');

  // Core Dataset matching the mockup
  const [taxData, setTaxData] = useState<TaxObligation[]>([
    { id: 1, jenisPajak: 'PPN', masaPajak: 'Juni 2026', tglJatuhTempo: '15 Jul 2026', dpp: 11025000000, tarif: '10%', pajakTerutang: 1102500000, pajakDibayar: 882000000, status: 'Sebagian' },
    { id: 2, jenisPajak: 'PPh 23', masaPajak: 'Juni 2026', tglJatuhTempo: '20 Jul 2026', dpp: 1456000000, tarif: '2%', pajakTerutang: 85200000, pajakDibayar: 0, status: 'Belum Lunas' },
    { id: 3, jenisPajak: 'PPh 21', masaPajak: 'Juni 2026', tglJatuhTempo: '25 Jul 2026', dpp: 1995000, tarif: 'Tarif Progresif', pajakTerutang: 39900000, pajakDibayar: 0, status: 'Belum Lunas' },
    { id: 4, jenisPajak: 'PPh 4(2)', masaPajak: 'Juni 2026', tglJatuhTempo: '30 Jul 2026', dpp: 2856000000, tarif: '10%', pajakTerutang: 285600000, pajakDibayar: 240000000, status: 'Sebagian' },
    { id: 5, jenisPajak: 'PPh 25', masaPajak: 'Juni 2026', tglJatuhTempo: '15 Jul 2026', dpp: 1995200000, tarif: '-', pajakTerutang: 45000000, pajakDibayar: 45000000, status: 'Lunas' },
    { id: 6, jenisPajak: 'PPN', masaPajak: 'Mei 2026', tglJatuhTempo: '15 Jun 2026', dpp: 10250000000, tarif: '10%', pajakTerutang: 1025000000, pajakDibayar: 1025000000, status: 'Lunas' },
    { id: 7, jenisPajak: 'PPh 23', masaPajak: 'Mei 2026', tglJatuhTempo: '20 Jun 2026', dpp: 1250000000, tarif: '2%', pajakTerutang: 62500000, pajakDibayar: 62500000, status: 'Lunas' },
    { id: 8, jenisPajak: 'PPh 21', masaPajak: 'Mei 2026', tglJatuhTempo: '25 Jun 2026', dpp: 1850000, tarif: 'Tarif Progresif', pajakTerutang: 37000000, pajakDibayar: 37000000, status: 'Lunas' },
    { id: 9, jenisPajak: 'PPh 4(2)', masaPajak: 'Mei 2026', tglJatuhTempo: '30 Jun 2026', dpp: 2400000000, tarif: '10%', pajakTerutang: 240000000, pajakDibayar: 240000000, status: 'Lunas' },
    { id: 10, jenisPajak: 'PPh 25', masaPajak: 'Mei 2026', tglJatuhTempo: '15 Jun 2026', dpp: 1995200000, tarif: '-', pajakTerutang: 45000000, pajakDibayar: 45000000, status: 'Lunas' },
    { id: 11, jenisPajak: 'PPN', masaPajak: 'April 2026', tglJatuhTempo: '15 Mei 2026', dpp: 9800000000, tarif: '10%', pajakTerutang: 980000000, pajakDibayar: 980000000, status: 'Lunas' },
    { id: 12, jenisPajak: 'PPh 23', masaPajak: 'April 2026', tglJatuhTempo: '20 Mei 2026', dpp: 1100000000, tarif: '2%', pajakTerutang: 55000000, pajakDibayar: 55000000, status: 'Lunas' },
  ]);

  // Main Metrics calculations
  const metrics = useMemo(() => {
    const totalTerutang = taxData.reduce((acc, t) => acc + t.pajakTerutang, 0);
    const totalDibayar = taxData.reduce((acc, t) => acc + t.pajakDibayar, 0);
    const totalSelisih = Math.max(0, totalTerutang - totalDibayar);
    const totalJatuhTempo = taxData
      .filter(t => t.status !== 'Lunas')
      .reduce((acc, t) => acc + (t.pajakTerutang - t.pajakDibayar), 0);

    return {
      totalTerutang,
      totalDibayar,
      totalSelisih,
      totalJatuhTempo,
      kewajibanAktif: taxData.filter(t => t.status !== 'Lunas').length + 15,
      complianceRate: 98.6
    };
  }, [taxData]);

  // Filter application
  const filteredData = useMemo(() => {
    return taxData.filter(item => {
      const matchSearch = item.jenisPajak.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.masaPajak.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchJenis = selectedJenis === 'Semua Jenis Pajak' || item.jenisPajak === selectedJenis;
      const matchStatus = selectedStatus === 'Semua Status' || item.status === selectedStatus;
      const matchMasa = selectedMasa === 'Semua Masa Pajak' || item.masaPajak.toLowerCase().includes(selectedMasa.toLowerCase());
      
      return matchSearch && matchJenis && matchStatus && matchMasa;
    });
  }, [taxData, searchTerm, selectedJenis, selectedStatus, selectedMasa]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedJenis('Semua Jenis Pajak');
    setSelectedStatus('Semua Status');
    setSelectedMasa('Semua Masa Pajak');
    setSelectedTahun('Tahun 2026');
    setCurrentPage(1);
  };

  // Handle Adding Tax Form submission
  const handleAddTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDpp || !newTerutang) return;

    const newObligation: TaxObligation = {
      id: taxData.length + 1,
      jenisPajak: newJenis,
      masaPajak: newMasa,
      tglJatuhTempo: newJatuhTempo,
      dpp: parseFloat(newDpp),
      tarif: newTarif,
      pajakTerutang: parseFloat(newTerutang),
      pajakDibayar: parseFloat(newDibayar),
      status: newStatus
    };

    setTaxData([newObligation, ...taxData]);
    setShowAddModal(false);
    
    // Reset Form
    setNewDpp('');
    setNewTerutang('');
    setNewDibayar('0');
    setNewStatus('Belum Lunas');
  };

  // Delete tax entry
  const handleDeleteTax = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data kewajiban pajak ini?')) {
      setTaxData(taxData.filter(t => t.id !== id));
    }
  };

  // CSV Export function
  const handleExportCSV = () => {
    const headers = 'NO,JENIS PAJAK,MASA PAJAK,TGL JATUH TEMPO,DPP (Rp),TARIF,PAJAK TERUTANG (Rp),PAJAK DIBAYAR (Rp),STATUS\n';
    const rows = filteredData.map((t, idx) => 
      `${idx + 1},${t.jenisPajak},${t.masaPajak},${t.tglJatuhTempo},${t.dpp},"${t.tarif}",${t.pajakTerutang},${t.pajakDibayar},${t.status}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Pajak_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Donut chart composition data
  const pieData = [
    { name: 'PPN', value: 1102350000, percent: '44.9%' },
    { name: 'PPh 23', value: 456780000, percent: '18.6%' },
    { name: 'PPh 21', value: 412500000, percent: '16.8%' },
    { name: 'PPh 4(2)', value: 285600000, percent: '11.6%' },
    { name: 'PPh 25', value: 199520000, percent: '8.1%' }
  ];

  // Composed Trend chart data
  const trendData = [
    { name: 'Jan', terutang: 1200, dibayar: 1000, selisih: 200 },
    { name: 'Feb', terutang: 1500, dibayar: 1350, selisih: 150 },
    { name: 'Mar', terutang: 1800, dibayar: 1500, selisih: 300 },
    { name: 'Apr', terutang: 1650, dibayar: 1650, selisih: 0 },
    { name: 'Mei', terutang: 2100, dibayar: 1900, selisih: 200 },
    { name: 'Jun', terutang: 2456, dibayar: 1985, selisih: 471 },
    { name: 'Jul', terutang: 1900, dibayar: 1850, selisih: 50 },
    { name: 'Agu', terutang: 2200, dibayar: 2100, selisih: 100 },
    { name: 'Sep', terutang: 1750, dibayar: 1700, selisih: 50 },
    { name: 'Okt', terutang: 2050, dibayar: 1950, selisih: 100 },
    { name: 'Nov', terutang: 2300, dibayar: 2200, selisih: 100 },
    { name: 'Des', terutang: 2500, dibayar: 2350, selisih: 150 }
  ];

  return (
    <Layout>
      <div className="bg-[var(--app-bg)] text-slate-100 min-h-screen p-6 font-sans antialiased selection:bg-cyan-500 selection:text-white">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] mb-1">
              <span>Finance</span>
              <span>&gt;</span>
              <span className="text-cyan-400 font-medium">Pajak</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pajak</h1>
            <p className="text-xs text-[var(--app-muted)] mt-0.5">Kelola dan pantau seluruh kewajiban pajak perusahaan.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-blue-600/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Pajak Baru</span>
            </button>
            <button className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Data Pajak</span>
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
          </div>
        </div>

        {/* METRICS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {/* Card 1 */}
          <div className="bg-[#0B1528]/80 border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-blue-600/10 p-2 rounded-lg text-blue-500">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                +12.5%
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Total Pajak Terutang</div>
            <div className="text-lg font-bold text-white mt-1">{formatRupiah(metrics.totalTerutang)}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">dari periode lalu</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0B1528]/80 border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-emerald-600/10 p-2 rounded-lg text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                +9.8%
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Pajak Dibayar</div>
            <div className="text-lg font-bold text-white mt-1">{formatRupiah(metrics.totalDibayar)}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">dari periode lalu</div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0B1528]/80 border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-amber-600/10 p-2 rounded-lg text-amber-500">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                +2.7%
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Pajak Kurang / (Lebih) Bayar</div>
            <div className="text-lg font-bold text-white mt-1">{formatRupiah(metrics.totalSelisih)}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">dari periode lalu</div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0B1528]/80 border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-purple-600/10 p-2 rounded-lg text-purple-500">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 font-semibold px-2 py-0.5 rounded-full">
                3 Kewajiban
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Pajak Jatuh Tempo (30 Hari)</div>
            <div className="text-lg font-bold text-white mt-1">{formatRupiah(metrics.totalJatuhTempo)}</div>
            <div className="text-[10px] text-rose-400 mt-0.5">Memerlukan pembayaran segera</div>
          </div>

          {/* Card 5 */}
          <div className="bg-[#0B1528]/80 border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-cyan-600/10 p-2 rounded-lg text-cyan-500">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Kewajiban Pajak</div>
            <div className="text-lg font-bold text-white mt-1">{metrics.kewajibanAktif}</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">Jenis pajak aktif terdaftar</div>
          </div>

          {/* Card 6 */}
          <div className="bg-[#0B1528]/80 border border-[var(--app-border)] rounded-xl p-4.5 shadow-sm hover:border-[var(--app-border)] transition-colors">
            <div className="flex justify-between items-start mb-2.5">
              <div className="bg-rose-600/10 p-2 rounded-lg text-rose-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                Sangat Baik
              </span>
            </div>
            <div className="text-[var(--app-muted)] text-[10px] font-semibold uppercase tracking-wider">Tingkat Kepatuhan</div>
            <div className="text-lg font-bold text-white mt-1">{metrics.complianceRate}%</div>
            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">Tingkat kepatuhan pelaporan</div>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center gap-1 border-b border-slate-800/80 mb-6 overflow-x-auto scrollbar-thin scrollbar-track-transparent">
          {['Ringkasan', 'Pajak Terutang', 'Pembayaran Pajak', 'SPT', 'Faktur Pajak', 'Rekonsiliasi', 'Laporan', 'Pengaturan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-4 py-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400 bg-blue-950/10'
                  : 'border-transparent text-[var(--app-muted)] hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* MAIN LAYOUT SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* LEFT 3 COLS FOR MAIN CONTENT */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* CHARTS CONTAINER ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Trend Chart (3/5 width) */}
              <div className="lg:col-span-3 bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Tren Pajak Terutang vs Dibayar</h2>
                  <select 
                    value={selectedTahun}
                    onChange={(e) => setSelectedTahun(e.target.value)}
                    className="bg-[var(--app-bg)] border border-slate-800 text-[10px] px-2 py-1 rounded text-[var(--app-muted)] font-medium"
                  >
                    <option>Tahun 2026</option>
                    <option>Tahun 2025</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={9} 
                        tickLine={false} 
                        tickFormatter={(v) => `${v > 0 ? (v / 1000).toFixed(1) + 'M' : '0'}`} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A1629', borderColor: '#1E293B', borderRadius: 8 }} 
                        labelStyle={{ color: '#fff', fontSize: 10 }}
                        itemStyle={{ fontSize: 10 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 9, paddingTop: 10 }} />
                      <Bar name="Pajak Terutang" dataKey="terutang" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar name="Pajak Dibayar" dataKey="dibayar" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Line name="Selisih" type="monotone" dataKey="selisih" stroke="#A855F7" strokeWidth={2} dot={{ r: 2 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Composition Donut Chart (2/5 width) */}
              <div className="lg:col-span-2 bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm flex flex-col">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Komposisi Pajak Terutang</h2>
                
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_TAX[index % COLORS_TAX.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <div className="text-[10px] text-[var(--app-muted)] font-medium leading-none">Total Terutang</div>
                      <div className="text-xs font-bold text-white mt-1 leading-none">Rp 2.45B</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {pieData.map((item, idx) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS_TAX[idx % COLORS_TAX.length] }} />
                          <span className="text-[var(--app-muted)]">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-medium">{formatRupiah(item.value)}</span>
                          <span className="text-[10px] text-[var(--app-muted)] font-semibold ml-1">({item.percent})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TAX OBLIGATION DATATABLE */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col gap-4 mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Daftar Kewajiban Pajak</h2>
                
                {/* Advanced Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
                  
                  {/* Search Input */}
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--app-muted)]" />
                    <input 
                      type="text"
                      placeholder="Cari pajak..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-slate-800 text-xs px-3 py-2 pl-9 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Jenis Pajak Filter */}
                  <div>
                    <select
                      value={selectedJenis}
                      onChange={(e) => { setSelectedJenis(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option>Semua Jenis Pajak</option>
                      <option>PPN</option>
                      <option>PPh 21</option>
                      <option>PPh 23</option>
                      <option>PPh 25</option>
                      <option>PPh 4(2)</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option>Semua Status</option>
                      <option>Belum Lunas</option>
                      <option>Sebagian</option>
                      <option>Lunas</option>
                    </select>
                  </div>

                  {/* Masa Pajak Filter */}
                  <div>
                    <select
                      value={selectedMasa}
                      onChange={(e) => { setSelectedMasa(e.target.value); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-200 w-full focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option>Semua Masa Pajak</option>
                      <option>Juni 2026</option>
                      <option>Mei 2026</option>
                      <option>April 2026</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={resetFilters}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg w-full transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[var(--app-muted)] font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">NO</th>
                      <th className="py-3 px-4">JENIS PAJAK</th>
                      <th className="py-3 px-4">MASA PAJAK</th>
                      <th className="py-3 px-4">TGL JATUH TEMPO</th>
                      <th className="py-3 px-4 text-right">DPP (Rp)</th>
                      <th className="py-3 px-4 text-center">TARIF</th>
                      <th className="py-3 px-4 text-right">PAJAK TERUTANG (Rp)</th>
                      <th className="py-3 px-4 text-right">PAJAK DIBAYAR (Rp)</th>
                      <th className="py-3 px-4 text-center">STATUS</th>
                      <th className="py-3 px-4 text-center w-24">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, idx) => {
                        const calculatedNo = (currentPage - 1) * rowsPerPage + idx + 1;
                        return (
                          <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-950/40 transition-colors">
                            <td className="py-3.5 px-4 text-center text-[var(--app-muted)]">{calculatedNo}</td>
                            <td className="py-3.5 px-4 font-bold text-white">{item.jenisPajak}</td>
                            <td className="py-3.5 px-4 text-slate-300">{item.masaPajak}</td>
                            <td className="py-3.5 px-4 text-[var(--app-muted)]">{item.tglJatuhTempo}</td>
                            <td className="py-3.5 px-4 text-right font-medium text-slate-300">
                              {item.dpp > 0 ? formatRupiah(item.dpp) : '-'}
                            </td>
                            <td className="py-3.5 px-4 text-center text-[var(--app-muted)]">{item.tarif}</td>
                            <td className="py-3.5 px-4 text-right font-bold text-blue-400">{formatRupiah(item.pajakTerutang)}</td>
                            <td className="py-3.5 px-4 text-right font-bold text-emerald-400">{formatRupiah(item.pajakDibayar)}</td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'Lunas' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : item.status === 'Sebagian'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button 
                                  onClick={() => { setSelectedTaxDetails(item); setShowDetailModal(true); }}
                                  className="p-1 text-[var(--app-muted)] hover:text-white transition-colors cursor-pointer"
                                  title="Detail"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  className="p-1 text-[var(--app-muted)] hover:text-white transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTax(item.id)}
                                  className="p-1 text-[var(--app-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-[var(--app-muted)]">
                          Tidak ada data kewajiban pajak yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Controller */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-[var(--app-muted)] text-xs">
                <div>
                  Menampilkan <span className="font-semibold text-white">{Math.min(filteredData.length, (currentPage - 1) * rowsPerPage + 1)}</span> sampai{' '}
                  <span className="font-semibold text-white">{Math.min(filteredData.length, currentPage * rowsPerPage)}</span> dari{' '}
                  <span className="font-semibold text-white">{filteredData.length}</span> data
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>Baris per halaman:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                      className="bg-[var(--app-bg)] border border-slate-800 rounded px-1.5 py-0.5 text-white"
                    >
                      <option value={5}>5</option>
                      <option value={7}>7</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-[var(--app-muted)] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-6.5 h-6.5 rounded-md text-xs font-semibold ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-800 text-[var(--app-muted)] hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-[var(--app-muted)] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT 1 COL FOR SIDEBAR */}
          <div className="space-y-6">
            
            {/* Tax Due List */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Pajak Jatuh Tempo</h2>
                <button className="text-[10px] text-blue-400 font-semibold hover:underline">Lihat Semua</button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'PPN Masa Juni 2026', total: 220500000, date: '15 Jul 2026', badge: '7 hari lagi', type: 'danger' },
                  { name: 'PPh 23 Masa Juni 2026', total: 85200000, date: '20 Jul 2026', badge: '12 hari lagi', type: 'warning' },
                  { name: 'PPh 21 Masa Juni 2026', total: 39900000, date: '25 Jul 2026', badge: '17 hari lagi', type: 'warning' },
                  { name: 'PPh 25 Juni 2026', total: 45000000, date: '30 Jul 2026', badge: '22 hari lagi', type: 'normal' },
                  { name: 'PPN Masa Mei 2026', total: 15000000, date: '15 Jun 2026', badge: 'Lunas', type: 'success' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-slate-900/60 pb-2.5 last:border-b-0 last:pb-0">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-[var(--app-muted)]">
                        {formatRupiah(item.total)} • <span className="font-semibold text-slate-300">{item.date}</span>
                      </div>
                    </div>

                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                      item.type === 'danger'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : item.type === 'warning'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        : item.type === 'success'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-[var(--app-bg)]0/10 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SPT Summary */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Ringkasan SPT</h2>
                <select className="bg-[var(--app-bg)] border border-slate-800 text-[10px] px-1.5 py-0.5 rounded text-[var(--app-muted)] font-semibold">
                  <option>Tahun 2026</option>
                  <option>Tahun 2025</option>
                </select>
              </div>

              <div className="space-y-3.5">
                {[
                  { name: 'SPT Masa PPN', count: '6 / 6', progress: 100 },
                  { name: 'SPT Masa PPh 23', count: '6 / 6', progress: 100 },
                  { name: 'SPT Masa PPh 21', count: '6 / 6', progress: 100 },
                  { name: 'SPT Tahunan PPh Badan', count: '1 / 1', progress: 100 }
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--app-muted)]">{item.name}</span>
                      <span className="text-[var(--app-text)] font-semibold">{item.count}</span>
                    </div>
                    <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all" 
                        style={{ width: `${item.progress}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-blue-400 font-semibold text-[10px] mt-4 hover:underline block">
                Lihat Semua SPT &gt;
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Fitur Cepat</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Buat Kewajiban Pajak', icon: Plus },
                  { label: 'Upload Bukti Bayar', icon: Upload },
                  { label: 'Buat Pembayaran Pajak', icon: FileText },
                  { label: 'Download Bukti Potong', icon: FileDown },
                  { label: 'Buat SPT', icon: FileText },
                  { label: 'Laporan Pajak', icon: FileDown }
                ].map((btn, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (btn.label === 'Buat Kewajiban Pajak') setShowAddModal(true);
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-[var(--app-bg)]/80 hover:bg-[var(--app-bg)] border border-slate-800/80 rounded-lg text-center gap-1.5 transition-colors cursor-pointer group"
                  >
                    <btn.icon className="w-4 h-4 text-[var(--app-muted)] group-hover:text-blue-400 transition-colors" />
                    <span className="text-[9px] text-slate-300 font-medium leading-tight">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tax Notes Checklist */}
            <div className="bg-[#0B1528]/50 border border-slate-900 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Catatan Pajak</h2>
              <div className="space-y-3">
                {[
                  'Pastikan semua faktur pajak telah divalidasi.',
                  'Bayar pajak sebelum tanggal jatuh tempo untuk menghindari denda.',
                  'Rekonsiliasi pajak dilakukan setiap akhir bulan.'
                ].map((note, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[10px] text-slate-300 leading-normal">{note}</span>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-blue-400 font-semibold text-[10px] mt-4 hover:underline block">
                Lihat Catatan Lengkap &gt;
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* CREATE NEW TAX MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A1629] border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Buat Kewajiban Pajak Baru</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[var(--app-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddTax} className="p-5 space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Jenis Pajak</label>
                  <select 
                    value={newJenis}
                    onChange={(e) => setNewJenis(e.target.value)}
                    className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                  >
                    <option>PPN</option>
                    <option>PPh 21</option>
                    <option>PPh 23</option>
                    <option>PPh 25</option>
                    <option>PPh 4(2)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Masa Pajak</label>
                  <input 
                    type="text" 
                    value={newMasa}
                    onChange={(e) => setNewMasa(e.target.value)}
                    placeholder="Contoh: Juni 2026"
                    className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Tanggal Jatuh Tempo</label>
                  <input 
                    type="text" 
                    value={newJatuhTempo}
                    onChange={(e) => setNewJatuhTempo(e.target.value)}
                    placeholder="Contoh: 15 Jul 2026"
                    className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Tarif Pajak (%)</label>
                  <input 
                    type="text" 
                    value={newTarif}
                    onChange={(e) => setNewTarif(e.target.value)}
                    placeholder="Contoh: 10% atau Tarif Progresif"
                    className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[var(--app-muted)] font-semibold">DPP - Dasar Pengenaan Pajak (Rp)</label>
                <input 
                  type="number" 
                  value={newDpp}
                  onChange={(e) => setNewDpp(e.target.value)}
                  placeholder="Contoh: 15000000"
                  className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Pajak Terutang (Rp)</label>
                  <input 
                    type="number" 
                    value={newTerutang}
                    onChange={(e) => setNewTerutang(e.target.value)}
                    placeholder="Contoh: 1500000"
                    className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--app-muted)] font-semibold">Pajak Dibayar (Rp)</label>
                  <input 
                    type="number" 
                    value={newDibayar}
                    onChange={(e) => setNewDibayar(e.target.value)}
                    placeholder="Contoh: 0"
                    className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[var(--app-muted)] font-semibold">Status Pembayaran</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="bg-[var(--app-bg)] border border-slate-800 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-blue-500"
                >
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Sebagian">Sebagian</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-[var(--app-text)] font-semibold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Simpan Kewajiban Pajak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {showDetailModal && selectedTaxDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A1629] border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detail Kewajiban Pajak</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-[var(--app-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-y-3.5 border-b border-slate-900 pb-4">
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Jenis Pajak</div>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedTaxDetails.jenisPajak}</div>
                </div>
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Masa Pajak</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{selectedTaxDetails.masaPajak}</div>
                </div>
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Jatuh Tempo</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{selectedTaxDetails.tglJatuhTempo}</div>
                </div>
                <div>
                  <div className="text-[var(--app-muted)] font-semibold uppercase tracking-wider text-[10px]">Tarif</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{selectedTaxDetails.tarif}</div>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Dasar Pengenaan Pajak (DPP):</span>
                  <span className="font-semibold text-white">{formatRupiah(selectedTaxDetails.dpp)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Pajak Terutang:</span>
                  <span className="font-semibold text-blue-400">{formatRupiah(selectedTaxDetails.pajakTerutang)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Pajak Dibayar:</span>
                  <span className="font-semibold text-emerald-400">{formatRupiah(selectedTaxDetails.pajakDibayar)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                  <span className="text-[var(--app-muted)] font-semibold">Sisa Kurang Bayar:</span>
                  <span className="font-bold text-rose-400">
                    {formatRupiah(Math.max(0, selectedTaxDetails.pajakTerutang - selectedTaxDetails.pajakDibayar))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)]">Status Pembayaran:</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedTaxDetails.status === 'Lunas' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : selectedTaxDetails.status === 'Sebagian'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {selectedTaxDetails.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-800">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
