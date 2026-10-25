import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Search,
  Plus,
  ChevronDown,
  Eye,
  Settings,
  Bell,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp as TrendUpIcon,
  HelpCircle,
  FileSpreadsheet,
  Activity,
  Calculator,
  PieChart as ChartPieIcon,
  CheckSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const COLORS_METODE = ['#1D4ED8', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function LabaRugiDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ringkasan Laba Rugi');
  const [filterPeriod, setFilterPeriod] = useState('25 Juni 2026 - 22 Oktober 2026');
  const [searchTerm, setSearchTerm] = useState('');

  // Datasets based on selected period
  const dataPeriods: Record<string, {
    pendapatan: number;
    hpp: number;
    labaKotor: number;
    bebanOps: number;
    labaOps: number;
    labaBersih: number;
    marginBersih: number;
    internet: number;
    tambahan: number;
    lainnya: number;
    biayaBandwidth: number;
    biayaPerangkat: number;
    biayaMaintenance: number;
    biayaLainHpp: number;
    biayaGaji: number;
    biayaPemasaran: number;
    biayaAdm: number;
    biayaLainOps: number;
  }> = {
    '25 Juni 2026 - 22 Oktober 2026': {
      pendapatan: 125860500,
      hpp: 32450000,
      labaKotor: 93410500,
      bebanOps: 16780000,
      labaOps: 76630500,
      labaBersih: 73630145,
      marginBersih: 58.5,
      internet: 98450000,
      tambahan: 19120000,
      lainnya: 8290500,
      biayaBandwidth: 18650000,
      biayaPerangkat: 7850000,
      biayaMaintenance: 3450000,
      biayaLainHpp: 2500000,
      biayaGaji: 7850000,
      biayaPemasaran: 1950000,
      biayaAdm: 4280000,
      biayaLainOps: 2700000
    },
    '18 Juni 2026 - 24 Juni 2026': {
      pendapatan: 111905000,
      hpp: 30550000,
      labaKotor: 81355000,
      bebanOps: 16090000,
      labaOps: 65265000,
      labaBersih: 62374950,
      marginBersih: 55.8,
      internet: 87250000,
      tambahan: 16580000,
      lainnya: 8075000,
      biayaBandwidth: 17120000,
      biayaPerangkat: 7230000,
      biayaMaintenance: 3120000,
      biayaLainHpp: 2080000,
      biayaGaji: 7320000,
      biayaPemasaran: 1850000,
      biayaAdm: 4120000,
      biayaLainOps: 2800000
    },
    '11 Juni 2026 - 17 Juni 2026': {
      pendapatan: 98450000,
      hpp: 27120000,
      labaKotor: 71330000,
      bebanOps: 14500000,
      labaOps: 56830000,
      labaBersih: 53890250,
      marginBersih: 54.7,
      internet: 76500000,
      tambahan: 14200000,
      lainnya: 7750000,
      biayaBandwidth: 15200000,
      biayaPerangkat: 6400000,
      biayaMaintenance: 3020000,
      biayaLainHpp: 2500000,
      biayaGaji: 6500000,
      biayaPemasaran: 1600000,
      biayaAdm: 3800000,
      biayaLainOps: 2600000
    }
  };

  const activeData = dataPeriods[filterPeriod] || dataPeriods['25 Juni 2026 - 22 Oktober 2026'];

  // Trend Sparkline Charts Data
  const sparkData = [
    { name: '25 Jun', 'Pendapatan': 118000000, 'Laba Operasional': 68000000, 'Laba Bersih': 64000000 },
    { name: '26 Jun', 'Pendapatan': 120000000, 'Laba Operasional': 71000000, 'Laba Bersih': 67000000 },
    { name: '27 Jun', 'Pendapatan': 122000000, 'Laba Operasional': 73000000, 'Laba Bersih': 69000000 },
    { name: '28 Jun', 'Pendapatan': 119000000, 'Laba Operasional': 69000000, 'Laba Bersih': 65000000 },
    { name: '29 Jun', 'Pendapatan': 123000000, 'Laba Operasional': 74000000, 'Laba Bersih': 71000000 },
    { name: '30 Jun', 'Pendapatan': 125000000, 'Laba Operasional': 75000000, 'Laba Bersih': 72000000 },
    { name: '01 Jul', 'Pendapatan': 125860500, 'Laba Operasional': 76630500, 'Laba Bersih': 73630145 }
  ];

  // Donut chart composition
  const compositionData = [
    { name: 'Internet', value: activeData.internet },
    { name: 'Tambahan', value: activeData.tambahan },
    { name: 'Lainnya', value: activeData.lainnya }
  ];

  // Profitability per segment
  const segmentData = [
    { name: 'Consumer', pendapatan: 78450000, hpp: 20150000, kotor: 58300000, beban: 8650000, bersih: 49650000, margin: 63.3 },
    { name: 'Bisnis Kecil', pendapatan: 29850000, hpp: 7250000, kotor: 22600000, beban: 4120000, bersih: 18480000, margin: 61.9 },
    { name: 'Enterprise', pendapatan: 14250000, hpp: 3450000, kotor: 10800000, beban: 2350000, bersih: 8450000, margin: 59.3 },
    { name: 'Lainnya', pendapatan: 3310500, hpp: 1600000, kotor: 1710500, beban: 1660000, bersih: 50500, margin: 1.5 }
  ];

  // Calculate segment totals
  const totalSegPendapatan = segmentData.reduce((acc, s) => acc + s.pendapatan, 0);
  const totalSegHpp = segmentData.reduce((acc, s) => acc + s.hpp, 0);
  const totalSegKotor = segmentData.reduce((acc, s) => acc + s.kotor, 0);
  const totalSegBeban = segmentData.reduce((acc, s) => acc + s.beban, 0);
  const totalSegBersih = segmentData.reduce((acc, s) => acc + s.bersih, 0);
  const totalSegMargin = parseFloat((totalSegBersih / totalSegPendapatan * 100).toFixed(1));

  // P&L report dynamic rows matching search term
  const plReportRows = [
    { code: 'REV', name: 'PENDAPATAN', current: activeData.pendapatan, prev: 111905000, type: 'header' },
    { code: 'REV-INT', name: '  Pendapatan Layanan Internet', current: activeData.internet, prev: 87250000, type: 'sub' },
    { code: 'REV-ADD', name: '  Pendapatan Tambahan', current: activeData.tambahan, prev: 16580000, type: 'sub' },
    { code: 'REV-OTH', name: '  Pendapatan Lainnya', current: activeData.lainnya, prev: 8075000, type: 'sub' },
    
    { code: 'COGS', name: 'HARGA POKOK PENJUALAN (HPP)', current: -activeData.hpp, prev: -30550000, type: 'header-neg' },
    { code: 'COGS-BW', name: '  Biaya Bandwidth & Transit', current: -activeData.biayaBandwidth, prev: -17120000, type: 'sub-neg' },
    { code: 'COGS-INF', name: '  Biaya Perangkat & Infrastruktur', current: -activeData.biayaPerangkat, prev: -7230000, type: 'sub-neg' },
    { code: 'COGS-MNT', name: '  Biaya Maintenance', current: -activeData.biayaMaintenance, prev: -3120000, type: 'sub-neg' },
    { code: 'COGS-OTH', name: '  Biaya Lainnya', current: -activeData.biayaLainHpp, prev: -2080000, type: 'sub-neg' },
    
    { code: 'GP', name: 'LABA KOTOR', current: activeData.labaKotor, prev: 81355000, type: 'total' },
    
    { code: 'OPEX', name: 'BEBAN OPERASIONAL', current: -activeData.bebanOps, prev: -16090000, type: 'header-neg' },
    { code: 'OPEX-SAL', name: '  Beban Gaji & Karyawan', current: -activeData.biayaGaji, prev: -7320000, type: 'sub-neg' },
    { code: 'OPEX-MKT', name: '  Beban Pemasaran', current: -activeData.biayaPemasaran, prev: -1850000, type: 'sub-neg' },
    { code: 'OPEX-ADM', name: '  Beban Umum & Administrasi', current: -activeData.biayaAdm, prev: -4120000, type: 'sub-neg' },
    { code: 'OPEX-OTH', name: '  Beban Lainnya', current: -activeData.biayaLainOps, prev: -2800000, type: 'sub-neg' },
    
    { code: 'OP', name: 'LABA OPERASIONAL', current: activeData.labaOps, prev: 65265000, type: 'total' },
    { code: 'OTH-REV', name: 'PENDAPATAN (BEBAN) LAINNYA', current: 1450000, prev: 980000, type: 'sub' },
    { code: 'EBT', name: 'LABA SEBELUM PAJAK', current: activeData.labaOps + 1450000, prev: 66245000, type: 'total' },
    { code: 'TAX', name: 'PAJAK PENGHASILAN', current: -4450355, prev: -3870050, type: 'sub-neg' },
    { code: 'NP', name: 'LABA BERSIH', current: activeData.labaBersih, prev: 62374950, type: 'grand-total' }
  ];

  const filteredPlRows = plReportRows.filter(row => 
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-[var(--app-bg)] text-[var(--app-text)] min-h-screen p-6 font-sans antialiased">
        

        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[var(--app-border)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1.5">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/finance/dashboard" className="hover:text-[var(--app-text)]">Keuangan & Akuntansi</Link>
              <span>/</span>
              <span className="text-emerald-500 font-semibold">Laba Rugi (P&L)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Laba Rugi</h1>
            <p className="text-xs text-[var(--app-muted)] mt-1">Laporan laba rugi untuk analisis kinerja profitabilitas bisnis.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-[var(--app-card)] border border-[var(--app-border)] p-2 rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
            >
              <option>25 Juni 2026 - 22 Oktober 2026</option>
              <option>18 Juni 2026 - 24 Juni 2026</option>
              <option>11 Juni 2026 - 17 Juni 2026</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => alert('Mengekspor laporan laba rugi...')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-[var(--app-border)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3 h-3 text-[var(--app-muted)]" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Pendapatan */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Pendapatan</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.pendapatan)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 12.5% dari periode lalu
            </span>
          </div>

          {/* HPP */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Harga Pokok Penjualan</p>
              <div className="p-1.5 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.hpp)}</h3>
            <span className="text-[9px] text-rose-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 6.2% dari periode lalu
            </span>
          </div>

          {/* Laba Kotor */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Laba Kotor</p>
              <div className="p-1.5 rounded-lg bg-cyan-600/10 border border-cyan-600/20 text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.labaKotor)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 15.8% dari periode lalu
            </span>
          </div>

          {/* Beban Operasional */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Beban Operasional</p>
              <div className="p-1.5 rounded-lg bg-orange-600/10 border border-orange-600/20 text-orange-400">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.bebanOps)}</h3>
            <span className="text-[9px] text-rose-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 4.3% dari periode lalu
            </span>
          </div>

          {/* Laba Operasional */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Laba Operasional</p>
              <div className="p-1.5 rounded-lg bg-purple-600/10 border border-purple-600/20 text-purple-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.labaOps)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 18.7% dari periode lalu
            </span>
          </div>

          {/* Laba Bersih */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Laba Bersih</p>
              <div className="p-1.5 rounded-lg bg-pink-600/10 border border-pink-600/20 text-pink-400">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.labaBersih)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 21.3% dari periode lalu
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--app-border)]/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Ringkasan Laba Rugi', 'Analisis Margin', 'Perbandingan Periode', 'Detail Akun', 'Segmen Profitabilitas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px] ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-400 font-bold' 
                  : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: Ringkasan Laba Rugi */}
        {activeTab === 'Ringkasan Laba Rugi' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 6 Columns: Laporan Laba Rugi & Profitabilitas Segmen */}
            <div className="lg:col-span-6 space-y-6">
              {/* Laporan Laba Rugi Detail */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--app-border)]/60">
                  <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Laporan Laba Rugi</h3>
                  <span className="text-[10px] text-[var(--app-muted)] bg-[#071225] px-2 py-1 rounded border border-[var(--app-border)]">25 Jun - 22 Oktober 2026</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--app-border)]/80 text-[var(--app-muted)]">
                        <th className="py-2.5 font-semibold">URAIAN</th>
                        <th className="py-2.5 font-semibold text-right">25 JUN - 22 OKT 2026</th>
                        <th className="py-2.5 font-semibold text-right">18 JUN - 24 JUN 2026</th>
                        <th className="py-2.5 font-semibold text-right">PERUBAHAN</th>
                        <th className="py-2.5 font-semibold text-right">% PERUBAHAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/40 text-[var(--app-text)]/90">
                      {filteredPlRows.map((row) => {
                        const isHeader = row.type.includes('header');
                        const isTotal = row.type.includes('total') || row.type.includes('grand');
                        const diff = row.current - row.prev;
                        const pct = ((diff / Math.abs(row.prev)) * 100).toFixed(1);
                        const isNeg = row.type.includes('neg');
                        
                        return (
                          <tr 
                            key={row.code} 
                            className={`hover:bg-blue-950/20 transition-colors ${
                              isHeader ? 'bg-blue-950/10 font-bold text-white text-[12px]' : ''
                            } ${
                              isTotal ? 'bg-blue-950/30 font-bold text-cyan-400 text-[12px]' : ''
                            }`}
                          >
                            <td className="py-2.5 whitespace-pre-wrap">{row.name}</td>
                            <td className={`py-2.5 text-right font-medium ${isNeg ? 'text-rose-300' : ''}`}>
                              {isNeg ? `(${formatRupiah(Math.abs(row.current))})` : formatRupiah(row.current)}
                            </td>
                            <td className={`py-2.5 text-right text-[var(--app-muted)]`}>
                              {isNeg ? `(${formatRupiah(Math.abs(row.prev))})` : formatRupiah(row.prev)}
                            </td>
                            <td className={`py-2.5 text-right font-semibold ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {diff >= 0 ? `+${formatRupiah(diff)}` : `-${formatRupiah(Math.abs(diff))}`}
                            </td>
                            <td className={`py-2.5 text-right font-semibold ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {diff >= 0 ? `+${pct}%` : `${pct}%`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analisis Profitabilitas per Segmen */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4 border-b border-[var(--app-border)] pb-2">Analisis Profitabilitas per Segmen</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--app-border)]/80 text-[var(--app-muted)]">
                        <th className="py-2.5 font-semibold">SEGMEN</th>
                        <th className="py-2.5 font-semibold text-right">PENDAPATAN</th>
                        <th className="py-2.5 font-semibold text-right">HPP</th>
                        <th className="py-2.5 font-semibold text-right">LABA KOTOR</th>
                        <th className="py-2.5 font-semibold text-right">BEBAN OPERASIONAL</th>
                        <th className="py-2.5 font-semibold text-right">LABA BERSIH</th>
                        <th className="py-2.5 font-semibold text-right">MARGIN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/40 text-[var(--app-text)]/90">
                      {segmentData.map((seg) => (
                        <tr key={seg.name} className="hover:bg-blue-950/20 transition-colors">
                          <td className="py-3 font-semibold text-[var(--app-text)]">{seg.name}</td>
                          <td className="py-3 text-right">{formatRupiah(seg.pendapatan)}</td>
                          <td className="py-3 text-right text-[var(--app-muted)]">({formatRupiah(seg.hpp)})</td>
                          <td className="py-3 text-right text-emerald-400">{formatRupiah(seg.kotor)}</td>
                          <td className="py-3 text-right text-[var(--app-muted)]">({formatRupiah(seg.beban)})</td>
                          <td className="py-3 text-right text-cyan-400 font-semibold">{formatRupiah(seg.bersih)}</td>
                          <td className="py-3 text-right font-semibold text-emerald-400">{seg.margin}%</td>
                        </tr>
                      ))}
                      <tr className="bg-blue-950/40 font-bold text-white">
                        <td className="py-3">TOTAL</td>
                        <td className="py-3 text-right">{formatRupiah(totalSegPendapatan)}</td>
                        <td className="py-3 text-right">({formatRupiah(totalSegHpp)})</td>
                        <td className="py-3 text-right text-emerald-400">{formatRupiah(totalSegKotor)}</td>
                        <td className="py-3 text-right">({formatRupiah(totalSegBeban)})</td>
                        <td className="py-3 text-right text-cyan-400">{formatRupiah(totalSegBersih)}</td>
                        <td className="py-3 text-right text-emerald-400">{totalSegMargin}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Middle 3 Columns: Line Chart, Profit Margin Gauges, & Period Comparisons */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tren Laba Rugi Chart */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Tren Laba Rugi</h3>
                  <span className="text-[10px] text-[var(--app-muted)] bg-[#071225] px-2 py-1 rounded border border-[var(--app-border)]">7 Hari Terakhir</span>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} tickFormatter={(v) => `${v / 1000000}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#091526', borderColor: '#1e3a8a', fontSize: '11px', color: '#fff' }}
                        formatter={(value: any) => formatRupiah(value)}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="Pendapatan" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Laba Operasional" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Laba Bersih" stroke="#EC4899" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Margin Profitabilitas Gauge Lists */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4 border-b border-[var(--app-border)] pb-2">Margin Profitabilitas</h3>
                <div className="space-y-4">
                  {/* Gauge 1 */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[var(--app-muted)] font-semibold">Margin Kotor</span>
                      <span className="text-emerald-400 font-bold">74.2%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '74.2%' }}></div>
                    </div>
                  </div>
                  {/* Gauge 2 */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[var(--app-muted)] font-semibold">Margin Operasional</span>
                      <span className="text-emerald-400 font-bold">60.8%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60.8%' }}></div>
                    </div>
                  </div>
                  {/* Gauge 3 */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[var(--app-muted)] font-semibold">Margin Bersih</span>
                      <span className="text-purple-400 font-bold">58.5%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '58.5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perbandingan Periode */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-3">Perbandingan Periode</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between text-[var(--app-muted)] border-b border-[var(--app-border)] pb-2">
                    <span className="font-semibold text-[var(--app-muted)]">METRIK</span>
                    <span>25 JUN - 01 JUL</span>
                    <span>18 JUN - 24 JUN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Pendapatan</span>
                    <span className="font-semibold">{formatRupiah(activeData.pendapatan)}</span>
                    <span className="text-[var(--app-muted)]">{formatRupiah(111905000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Laba Kotor</span>
                    <span className="font-semibold">{formatRupiah(activeData.labaKotor)}</span>
                    <span className="text-[var(--app-muted)]">{formatRupiah(81355000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Laba Operasional</span>
                    <span className="font-semibold">{formatRupiah(activeData.labaOps)}</span>
                    <span className="text-[var(--app-muted)]">{formatRupiah(65265000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Laba Bersih</span>
                    <span className="font-semibold text-cyan-400">{formatRupiah(activeData.labaBersih)}</span>
                    <span className="text-[var(--app-muted)]">{formatRupiah(62374950)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3 Columns: Donut Chart, Ratio list, Summary quick-facts, Catatan insight */}
            <div className="lg:col-span-3 space-y-6">
              {/* Komposisi Pendapatan */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Komposisi Pendapatan</h3>
                <div className="flex flex-col items-center justify-center relative mb-4">
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={compositionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {compositionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_METODE[index % COLORS_METODE.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatRupiah(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Central Text */}
                  <div className="absolute text-center">
                    <p className="text-[12px] font-bold text-white">{formatRupiah(activeData.pendapatan)}</p>
                    <p className="text-[8px] text-[var(--app-muted)]">Total Pendapatan</p>
                  </div>
                </div>
                {/* Custom Legend */}
                <div className="space-y-1.5 text-[10px]">
                  {compositionData.map((item, index) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_METODE[index % COLORS_METODE.length] }}></span>
                        <span className="text-[var(--app-muted)]">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[var(--app-text)] font-semibold mr-2">{formatRupiah(item.value)}</span>
                        <span className="text-[var(--app-muted)]">{(item.value / activeData.pendapatan * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rasio Keuangan */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Rasio Keuangan</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { name: 'Gross Profit Margin', val: '74.2%' },
                    { name: 'Operating Profit Margin', val: '60.8%' },
                    { name: 'Net Profit Margin', val: '58.5%' },
                    { name: 'Return on Assets (ROA)', val: '18.6%' },
                    { name: 'Return on Equity (ROE)', val: '32.4%' }
                  ].map(rasio => (
                    <div key={rasio.name} className="flex justify-between items-center text-[var(--app-muted)]">
                      <span>{rasio.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{rasio.val}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400">Sehat</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ringkasan Laba Rugi QuickFacts */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-3">Ringkasan Laba Rugi</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[var(--app-muted)]">
                    <span>Total Pendapatan</span>
                    <span className="font-semibold text-white">{formatRupiah(activeData.pendapatan)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--app-muted)]">
                    <span>Total HPP</span>
                    <span className="font-semibold text-white">({formatRupiah(activeData.hpp)})</span>
                  </div>
                  <div className="flex justify-between text-[var(--app-muted)]">
                    <span>Total Beban Operasional</span>
                    <span className="font-semibold text-white">({formatRupiah(activeData.bebanOps)})</span>
                  </div>
                  <div className="flex justify-between text-[var(--app-muted)]">
                    <span>Total Pendapatan Lainnya</span>
                    <span className="font-semibold text-white">{formatRupiah(1450000)}</span>
                  </div>
                  <div className="flex justify-between text-cyan-400 font-bold border-t border-[var(--app-border)] pt-2">
                    <span>Laba Bersih</span>
                    <span>{formatRupiah(activeData.labaBersih)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--app-muted)]">
                    <span>Margin Bersih</span>
                    <span className="font-semibold text-emerald-400">{activeData.marginBersih}%</span>
                  </div>
                </div>
              </div>

              {/* Catatan & Insight */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-3">Catatan & Insight</h3>
                <div className="space-y-3 text-xs text-[var(--app-text)]/90">
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Pendapatan meningkat 12.5% dibanding periode sebelumnya.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Laba bersih meningkat 18.0% dengan margin {activeData.marginBersih}%.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Segmen Consumer memberikan kontribusi terbesar terhadap laba bersih.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Fokus pada efisiensi biaya operasional untuk meningkatkan margin.</p>
                  </div>
                  
                  <button 
                    onClick={() => alert('Membuka analisis finansial lengkap...')}
                    className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300 pt-2 border-t border-[var(--app-border)]/80 block"
                  >
                    Lihat Analisis Lengkap →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-8 text-center text-[var(--app-muted)] text-sm">
            <Layers className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-pulse" />
            <p className="font-semibold text-white">Menu Tab {activeTab} Terintegrasi</p>
            <p className="text-xs text-[var(--app-muted)] mt-1.5">
              Halaman visualisasi data detail untuk modul {activeTab} terkoneksi dengan database utama.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

