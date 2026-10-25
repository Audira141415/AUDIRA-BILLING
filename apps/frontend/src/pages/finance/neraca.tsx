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
  CheckSquare,
  Scale,
  Percent,
  Wallet
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

export default function NeracaDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ringkasan Neraca');
  const [filterPeriod, setFilterPeriod] = useState('25 Juni 2026 - 22 Oktober 2026');
  const [searchTerm, setSearchTerm] = useState('');

  // Datasets based on selected period
  const dataPeriods: Record<string, {
    totalAset: number;
    totalLiabilitas: number;
    totalEkuitas: number;
    rasioLancar: number;
    rasioLtbAset: number;
    rasioLtbEkuitas: number;
    rasioAsetEkuitas: number;
    rasioCepat: number;
    
    // Assets Detail
    kasBank: number;
    piutang: number;
    persediaan: number;
    pajakDimuka: number;
    biayaDimuka: number;
    asetTetap: number;
    penyusutan: number;
    asetTakBerwujud: number;
    investasiJp: number;
    asetLain: number;

    // Liabilities & Equities Detail
    utangUsaha: number;
    utangPajak: number;
    utangGaji: number;
    pendapatanDimuka: number;
    utangLainJp: number;
    utangBankJp: number;
    utangSewa: number;
    liabilitasLain: number;
    modalDisetor: number;
    labaDitahan: number;
    labaBerjalan: number;
  }> = {
    '25 Juni 2026 - 22 Oktober 2026': {
      totalAset: 253410000,
      totalLiabilitas: 98750000,
      totalEkuitas: 154660000,
      rasioLancar: 2.57,
      rasioLtbAset: 38.9,
      rasioLtbEkuitas: 0.64,
      rasioAsetEkuitas: 1.64,
      rasioCepat: 1.89,
      kasBank: 68420000,
      piutang: 32150000,
      persediaan: 14280000,
      pajakDimuka: 5600000,
      biayaDimuka: 4400000,
      asetTetap: 95250000,
      penyusutan: -23150000,
      asetTakBerwujud: 32450000,
      investasiJp: 15000000,
      asetLain: 9010000,
      utangUsaha: 28750000,
      utangPajak: 8900000,
      utangGaji: 12600000,
      pendapatanDimuka: 8200000,
      utangLainJp: 4000000,
      utangBankJp: 25000000,
      utangSewa: 6800000,
      liabilitasLain: 4500000,
      modalDisetor: 100000000,
      labaDitahan: 45230000,
      labaBerjalan: 9430000
    },
    '18 Juni 2026 - 24 Juni 2026': {
      totalAset: 233110000,
      totalLiabilitas: 92850000,
      totalEkuitas: 140260000,
      rasioLancar: 2.45,
      rasioLtbAset: 39.8,
      rasioLtbEkuitas: 0.66,
      rasioAsetEkuitas: 1.66,
      rasioCepat: 1.78,
      kasBank: 61250000,
      piutang: 28400000,
      persediaan: 13500000,
      pajakDimuka: 5200000,
      biayaDimuka: 4100000,
      asetTetap: 88500000,
      penyusutan: -21500000,
      asetTakBerwujud: 31000000,
      investasiJp: 14500000,
      asetLain: 8160000,
      utangUsaha: 26500000,
      utangPajak: 8100000,
      utangGaji: 11800000,
      pendapatanDimuka: 7900000,
      utangLainJp: 3800000,
      utangBankJp: 24000000,
      utangSewa: 6500000,
      liabilitasLain: 4250000,
      modalDisetor: 90000000,
      labaDitahan: 42100000,
      labaBerjalan: 8160000
    }
  };

  const activeData = dataPeriods[filterPeriod] || dataPeriods['25 Juni 2026 - 22 Oktober 2026'];

  const assetLancarTotal = activeData.kasBank + activeData.piutang + activeData.persediaan + activeData.pajakDimuka + activeData.biayaDimuka;
  const assetTidakLancarTotal = activeData.asetTetap + activeData.penyusutan + activeData.asetTakBerwujud + activeData.investasiJp + activeData.asetLain;
  const totalLiabilitasShort = activeData.utangUsaha + activeData.utangPajak + activeData.utangGaji + activeData.pendapatanDimuka + activeData.utangLainJp;
  const totalLiabilitasLong = activeData.utangBankJp + activeData.utangSewa + activeData.liabilitasLain;
  const liabilitasTotal = totalLiabilitasShort + totalLiabilitasLong;
  const ekuitasTotal = activeData.modalDisetor + activeData.labaDitahan + activeData.labaBerjalan;

  // Pie chart assets composition
  const assetComposition = [
    { name: 'Aset Lancar', value: assetLancarTotal },
    { name: 'Aset Tidak Lancar', value: assetTidakLancarTotal }
  ];

  // Pie chart funding composition
  const fundingComposition = [
    { name: 'Liabilitas', value: liabilitasTotal },
    { name: 'Ekuitas', value: ekuitasTotal }
  ];

  // Line chart daily trend
  const sparkData = [
    { name: '25 Jun', 'Aset': 235000000, 'Liabilitas': 93000000, 'Ekuitas': 142000000 },
    { name: '26 Jun', 'Aset': 238000000, 'Liabilitas': 94000000, 'Ekuitas': 144000000 },
    { name: '27 Jun', 'Aset': 240000000, 'Liabilitas': 95000000, 'Ekuitas': 145000000 },
    { name: '28 Jun', 'Aset': 242000000, 'Liabilitas': 96000000, 'Ekuitas': 146000000 },
    { name: '29 Jun', 'Aset': 245000000, 'Liabilitas': 97000000, 'Ekuitas': 148000000 },
    { name: '30 Jun', 'Aset': 250000000, 'Liabilitas': 98000000, 'Ekuitas': 152000000 },
    { name: '01 Jul', 'Aset': 253410000, 'Liabilitas': 98750000, 'Ekuitas': 154660000 }
  ];

  const searchFilter = (name: string) => name.toLowerCase().includes(searchTerm.toLowerCase());

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
              <span className="text-emerald-500 font-semibold">Neraca (Balance Sheet)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Neraca</h1>
            <p className="text-xs text-[var(--app-muted)] mt-1">Laporan posisi keuangan perusahaan pada periode tertentu.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-[var(--app-card)] border border-[var(--app-border)] p-2 rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
            >
              <option>25 Juni 2026 - 22 Oktober 2026</option>
              <option>18 Juni 2026 - 24 Juni 2026</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => alert('Mengekspor laporan neraca...')}
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
          {/* Total Aset */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Aset</p>
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.totalAset)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 8.7% dari periode lalu
            </span>
          </div>

          {/* Total Liabilitas */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Liabilitas</p>
              <div className="p-1.5 rounded-lg bg-rose-600/10 border border-rose-600/20 text-rose-400">
                <Scale className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.totalLiabilitas)}</h3>
            <span className="text-[9px] text-rose-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 6.3% dari periode lalu
            </span>
          </div>

          {/* Total Ekuitas */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Total Ekuitas</p>
              <div className="p-1.5 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{formatRupiah(activeData.totalEkuitas)}</h3>
            <span className="text-[9px] text-emerald-400 flex items-center font-semibold mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              ▲ 10.4% dari periode lalu
            </span>
          </div>

          {/* Rasio Lancar */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Rasio Lancar</p>
              <div className="p-1.5 rounded-lg bg-orange-600/10 border border-orange-600/20 text-orange-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{activeData.rasioLancar}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">Sehat</span>
          </div>

          {/* Rasio Liabilitas/Aset */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Rasio Liabilitas/Aset</p>
              <div className="p-1.5 rounded-lg bg-purple-600/10 border border-purple-600/20 text-purple-400">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{activeData.rasioLtbAset}%</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">Sehat</span>
          </div>

          {/* Rasio Liabilitas/Ekuitas */}
          <div className="bg-[#0A1629]/70 border border-[var(--app-border)] rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-semibold text-[var(--app-muted)] uppercase tracking-wider">Rasio Liabilitas/Ekuitas</p>
              <div className="p-1.5 rounded-lg bg-pink-600/10 border border-pink-600/20 text-pink-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{activeData.rasioLtbEkuitas}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold mt-1">Sehat</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--app-border)]/80 mb-6 gap-2 overflow-x-auto pb-1">
          {['Ringkasan Neraca', 'Aset', 'Liabilitas', 'Ekuitas', 'Perbandingan Periode', 'Detail Akun'].map((tab) => (
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

        {/* Tab Content: Ringkasan Neraca */}
        {activeTab === 'Ringkasan Neraca' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Aset Table */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--app-border)]/60">Aset</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--app-border)]/80 text-[var(--app-muted)]">
                        <th className="py-2.5 font-semibold">URAIAN</th>
                        <th className="py-2.5 font-semibold text-right">JUMLAH (Rp)</th>
                        <th className="py-2.5 font-semibold text-right">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/40 text-[var(--app-text)]/90">
                      {searchFilter('Aset Lancar') && (
                        <tr className="bg-blue-950/20 font-bold text-white">
                          <td className="py-2.5">Aset Lancar</td>
                          <td className="py-2.5 text-right">{formatRupiah(assetLancarTotal)}</td>
                          <td className="py-2.5 text-right">{(assetLancarTotal / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      )}
                      {[
                        { name: '  Kas & Bank', val: activeData.kasBank },
                        { name: '  Piutang Usaha', val: activeData.piutang },
                        { name: '  Persediaan', val: activeData.persediaan },
                        { name: '  Pajak Dibayar Dimuka', val: activeData.pajakDimuka },
                        { name: '  Biaya Dibayar Dimuka', val: activeData.biayaDimuka }
                      ].filter(item => searchFilter(item.name)).map(item => (
                        <tr key={item.name} className="hover:bg-blue-950/10 transition-colors">
                          <td className="py-2.5 whitespace-pre-wrap text-[var(--app-text)]/90">{item.name}</td>
                          <td className="py-2.5 text-right">{formatRupiah(item.val)}</td>
                          <td className="py-2.5 text-right text-[var(--app-muted)]">{(item.val / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                      
                      {searchFilter('Aset Tidak Lancar') && (
                        <tr className="bg-blue-950/20 font-bold text-white pt-4">
                          <td className="py-2.5">Aset Tidak Lancar</td>
                          <td className="py-2.5 text-right">{formatRupiah(assetTidakLancarTotal)}</td>
                          <td className="py-2.5 text-right">{(assetTidakLancarTotal / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      )}
                      {[
                        { name: '  Aset Tetap', val: activeData.asetTetap },
                        { name: '  Akumulasi Penyusutan', val: activeData.penyusutan, isNeg: true },
                        { name: '  Aset Tak Berwujud', val: activeData.asetTakBerwujud },
                        { name: '  Investasi Jangka Panjang', val: activeData.investasiJp },
                        { name: '  Aset Lain-lain', val: activeData.asetLain }
                      ].filter(item => searchFilter(item.name)).map(item => (
                        <tr key={item.name} className="hover:bg-blue-950/10 transition-colors">
                          <td className="py-2.5 whitespace-pre-wrap text-[var(--app-text)]/90">{item.name}</td>
                          <td className={`py-2.5 text-right ${item.isNeg ? 'text-rose-300 font-semibold' : ''}`}>
                            {item.isNeg ? `(${formatRupiah(Math.abs(item.val))})` : formatRupiah(item.val)}
                          </td>
                          <td className="py-2.5 text-right text-[var(--app-muted)]">{(Math.abs(item.val) / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      ))}

                      <tr className="bg-cyan-950/40 font-bold text-cyan-400 text-[12px]">
                        <td className="py-3">TOTAL ASET</td>
                        <td className="py-3 text-right">{formatRupiah(activeData.totalAset)}</td>
                        <td className="py-3 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Middle Column: Liabilitas & Ekuitas Table */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--app-border)]/60">Liabilitas & Ekuitas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--app-border)]/80 text-[var(--app-muted)]">
                        <th className="py-2.5 font-semibold">URAIAN</th>
                        <th className="py-2.5 font-semibold text-right">JUMLAH (Rp)</th>
                        <th className="py-2.5 font-semibold text-right">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/40 text-[var(--app-text)]/90">
                      {searchFilter('Liabilitas') && (
                        <tr className="bg-blue-950/20 font-bold text-white">
                          <td className="py-2.5">Liabilitas</td>
                          <td className="py-2.5 text-right">{formatRupiah(liabilitasTotal)}</td>
                          <td className="py-2.5 text-right">{(liabilitasTotal / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      )}
                      {searchFilter('Liabilitas Jangka Pendek') && (
                        <tr className="font-semibold text-[var(--app-text)]">
                          <td className="py-2.5">  Liabilitas Jangka Pendek</td>
                          <td className="py-2.5 text-right">{formatRupiah(totalLiabilitasShort)}</td>
                          <td className="py-2.5 text-right">{(totalLiabilitasShort / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      )}
                      {[
                        { name: '    Utang Usaha', val: activeData.utangUsaha },
                        { name: '    Utang Pajak', val: activeData.utangPajak },
                        { name: '    Utang Gaji', val: activeData.utangGaji },
                        { name: '    Pendapatan Diterima Dimuka', val: activeData.pendapatanDimuka },
                        { name: '    Utang Lain-lain', val: activeData.utangLainJp }
                      ].filter(item => searchFilter(item.name)).map(item => (
                        <tr key={item.name} className="hover:bg-blue-950/10 transition-colors text-[var(--app-muted)]">
                          <td className="py-2.5 whitespace-pre-wrap">{item.name}</td>
                          <td className="py-2.5 text-right">{formatRupiah(item.val)}</td>
                          <td className="py-2.5 text-right">{(item.val / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      ))}

                      {searchFilter('Liabilitas Jangka Panjang') && (
                        <tr className="font-semibold text-[var(--app-text)]">
                          <td className="py-2.5">  Liabilitas Jangka Panjang</td>
                          <td className="py-2.5 text-right">{formatRupiah(totalLiabilitasLong)}</td>
                          <td className="py-2.5 text-right">{(totalLiabilitasLong / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      )}
                      {[
                        { name: '    Utang Bank Jangka Panjang', val: activeData.utangBankJp },
                        { name: '    Utang Sewa Pembiayaan', val: activeData.utangSewa },
                        { name: '    Liabilitas Lain-lain', val: activeData.liabilitasLain }
                      ].filter(item => searchFilter(item.name)).map(item => (
                        <tr key={item.name} className="hover:bg-blue-950/10 transition-colors text-[var(--app-muted)]">
                          <td className="py-2.5 whitespace-pre-wrap">{item.name}</td>
                          <td className="py-2.5 text-right">{formatRupiah(item.val)}</td>
                          <td className="py-2.5 text-right">{(item.val / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      ))}

                      {searchFilter('Ekuitas') && (
                        <tr className="bg-blue-950/20 font-bold text-white">
                          <td className="py-2.5">Ekuitas</td>
                          <td className="py-2.5 text-right">{formatRupiah(ekuitasTotal)}</td>
                          <td className="py-2.5 text-right">{(ekuitasTotal / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      )}
                      {[
                        { name: '  Modal Disetor', val: activeData.modalDisetor },
                        { name: '  Laba Ditahan', val: activeData.labaDitahan },
                        { name: '  Laba (Rugi) Tahun Berjalan', val: activeData.labaBerjalan }
                      ].filter(item => searchFilter(item.name)).map(item => (
                        <tr key={item.name} className="hover:bg-blue-950/10 transition-colors text-[var(--app-text)]/90">
                          <td className="py-2.5 whitespace-pre-wrap">{item.name}</td>
                          <td className="py-2.5 text-right">{formatRupiah(item.val)}</td>
                          <td className="py-2.5 text-right">{(item.val / activeData.totalAset * 100).toFixed(1)}%</td>
                        </tr>
                      ))}

                      <tr className="bg-cyan-950/40 font-bold text-cyan-400 text-[12px]">
                        <td className="py-3">TOTAL LIABILITAS & EKUITAS</td>
                        <td className="py-3 text-right">{formatRupiah(activeData.totalAset)}</td>
                        <td className="py-3 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Donut charts, Ratios, Line trend & Insights */}
            <div className="lg:col-span-3 space-y-6">
              {/* Grafik Komposisi */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Grafik Komposisi</h3>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex flex-col items-center relative">
                    <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetComposition}
                            cx="50%"
                            cy="50%"
                            innerRadius={24}
                            outerRadius={36}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            <Cell fill="#1D4ED8" />
                            <Cell fill="#10B981" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="absolute text-center mt-2.5">
                      <p className="text-[9px] font-bold text-white">Aset</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center relative">
                    <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={fundingComposition}
                            cx="50%"
                            cy="50%"
                            innerRadius={24}
                            outerRadius={36}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            <Cell fill="#F59E0B" />
                            <Cell fill="#EC4899" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="absolute text-center mt-2.5">
                      <p className="text-[9px] font-bold text-white">Pasiva</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[9px] text-[var(--app-muted)] mt-4 border-t border-[var(--app-border)] pt-3">
                  <div className="flex justify-between">
                    <span>Aset Lancar:</span>
                    <span className="font-semibold text-white">{formatRupiah(assetLancarTotal)} ({(assetLancarTotal / activeData.totalAset * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aset Tidak Lancar:</span>
                    <span className="font-semibold text-white">{formatRupiah(assetTidakLancarTotal)} ({(assetTidakLancarTotal / activeData.totalAset * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--app-border)]/60 pt-1.5">
                    <span>Liabilitas:</span>
                    <span className="font-semibold text-white">{formatRupiah(liabilitasTotal)} ({(liabilitasTotal / activeData.totalAset * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ekuitas:</span>
                    <span className="font-semibold text-white">{formatRupiah(ekuitasTotal)} ({(ekuitasTotal / activeData.totalAset * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              {/* Rasio Keuangan */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Rasio Keuangan</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { name: 'Rasio Lancar', val: activeData.rasioLancar },
                    { name: 'Rasio Cepat (Quick Ratio)', val: activeData.rasioCepat },
                    { name: 'Rasio Liabilitas terhadap Aset', val: `${activeData.rasioLtbAset}%` },
                    { name: 'Rasio Liabilitas terhadap Ekuitas', val: activeData.rasioLtbEkuitas },
                    { name: 'Rasio Aset terhadap Ekuitas', val: activeData.rasioAsetEkuitas }
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

              {/* Catatan Neraca */}
              <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-3">Catatan Neraca</h3>
                <div className="space-y-3 text-xs text-[var(--app-text)]/90">
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Total aset meningkat 8.7% dibanding periode lalu.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Liabilitas jangka pendek terkontrol dengan baik.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Rasio keuangan berada dalam kondisi sehat.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Laba ditahan menunjukkan pertumbuhan positif.</p>
                  </div>
                  
                  <button 
                    onClick={() => alert('Membuka analisis finansial neraca lengkap...')}
                    className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300 pt-2 border-t border-[var(--app-border)]/80 block"
                  >
                    Lihat Catatan Lengkap →
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
              Halaman posisi data detail untuk modul {activeTab} terkoneksi dengan database utama.
            </p>
          </div>
        )}

        {/* Bottom Section: Comparisons & Daily Line Trend (Only on Ringkasan tab) */}
        {activeTab === 'Ringkasan Neraca' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Periode Perbandingan */}
            <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
              <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider mb-4">Perbandingan Periode</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)]/80 text-[var(--app-muted)] font-semibold">
                      <th className="py-2">METRIK</th>
                      <th className="py-2 text-right">25 JUN - 22 OKT 2026</th>
                      <th className="py-2 text-right">18 JUN - 24 JUN 2026</th>
                      <th className="py-2 text-right">PERUBAHAN</th>
                      <th className="py-2 text-right">% PERUBAHAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950/40 text-[var(--app-text)]/90">
                    <tr>
                      <td className="py-2.5 font-medium">Total Aset</td>
                      <td className="py-2.5 text-right font-semibold">{formatRupiah(activeData.totalAset)}</td>
                      <td className="py-2.5 text-right text-[var(--app-muted)]">{formatRupiah(233110000)}</td>
                      <td className="py-2.5 text-right text-emerald-400 font-semibold">+Rp 20.300.000</td>
                      <td className="py-2.5 text-right text-emerald-400 font-semibold">+8.71%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Total Liabilitas</td>
                      <td className="py-2.5 text-right font-semibold">{formatRupiah(activeData.totalLiabilitas)}</td>
                      <td className="py-2.5 text-right text-[var(--app-muted)]">{formatRupiah(92850000)}</td>
                      <td className="py-2.5 text-right text-emerald-400 font-semibold">+Rp 5.900.000</td>
                      <td className="py-2.5 text-right text-emerald-400 font-semibold">+6.35%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Total Ekuitas</td>
                      <td className="py-2.5 text-right font-semibold text-cyan-400">{formatRupiah(activeData.totalEkuitas)}</td>
                      <td className="py-2.5 text-right text-[var(--app-muted)]">{formatRupiah(140260000)}</td>
                      <td className="py-2.5 text-right text-emerald-400 font-semibold">+Rp 14.400.000</td>
                      <td className="py-2.5 text-right text-emerald-400 font-semibold">+10.27%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tren Line Chart */}
            <div className="bg-[#0A1629]/60 border border-blue-900/30 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">Tren Aset, Liabilitas & Ekuitas</h3>
                <span className="text-[10px] text-[var(--app-muted)] bg-[#071225] px-2 py-1 rounded border border-[var(--app-border)]">7 Hari Terakhir</span>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#091526', borderColor: '#1e3a8a', fontSize: '11px', color: '#fff' }}
                      formatter={(value: any) => formatRupiah(value)}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="Aset" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Liabilitas" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Ekuitas" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

