import Link from 'next/link';
﻿import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, Filter, Download, Eye, ChevronLeft, ChevronRight, ChevronDown, FileText, Info, TrendingUp, TrendingDown, MoreVertical, RefreshCw, Sliders, Star, Calendar, CheckCircle2, AlertCircle, ArrowRight, Bell, Mail, FileDown, Database } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Bar } from 'recharts';

const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n).replace('Rp', 'Rp ');
const fmtShort = (n: number) => { if (n >= 1e9) return `${(n/1e9).toFixed(1)}M`; if (n >= 1e6) return `${(n/1e6).toFixed(0)}jt`; if (n >= 1e3) return `${(n/1e3).toFixed(0)}rb`; return String(n); };

const TAX_TABS = ['Ringkasan','PPN (VAT)','PPh 23','PPh 4(2)','PPh 21','PPh 25/29','Withholding Tax','Tax Summary','e-Faktur','Tax Payment','Tax Reconciliation','Activity Log'];
const TREND_DATA = [
  { bulan: 'Jan', ppn: 310000000, pph: 180000000, lain: 22000000 },
  { bulan: 'Feb', ppn: 330000000, pph: 185000000, lain: 24000000 },
  { bulan: 'Mar', ppn: 340000000, pph: 192000000, lain: 23000000 },
  { bulan: 'Apr', ppn: 355000000, pph: 200000000, lain: 26000000 },
  { bulan: 'Mei', ppn: 318000000, pph: 195000000, lain: 25000000 },
  { bulan: 'Jun', ppn: 372450000, pph: 155980000, lain: 14075000 },
];
const KOMPOSISI_DATA = [
  { name: 'PPN (VAT)', value: 372450000, pct: '68.65%', color: '#3b82f6' },
  { name: 'PPh 23', value: 99520000, pct: '18.34%', color: '#10b981' },
  { name: 'PPh 4(2)', value: 38870000, pct: '7.16%', color: '#f59e0b' },
  { name: 'PPh 21', value: 16920000, pct: '3.12%', color: '#8b5cf6' },
  { name: 'Lainnya', value: 14075000, pct: '2.73%', color: '#94a3b8' },
];
const PAID_VS_DUE_DATA = [
  { bulan: 'Jan', terutang: 420000000, dibayar: 398000000, selisih: 22000000 },
  { bulan: 'Feb', terutang: 440000000, dibayar: 415000000, selisih: 25000000 },
  { bulan: 'Mar', terutang: 455000000, dibayar: 430000000, selisih: 25000000 },
  { bulan: 'Apr', terutang: 475000000, dibayar: 460000000, selisih: 15000000 },
  { bulan: 'Mei', terutang: 510000000, dibayar: 478000000, selisih: 32000000 },
  { bulan: 'Jun', terutang: 542785250, dibayar: 398125000, selisih: 144660250 },
];
const JENIS_TABLE = [
  { jenis:'PPN (VAT)', terutang: 372450000, pct:'68.65%', vs: '+17.25%' },
  { jenis:'PPh 23', terutang: 99520000, pct:'18.34%', vs: '+20.19%' },
  { jenis:'PPh 4(2)', terutang: 38870000, pct:'7.16%', vs: '+15.62%' },
  { jenis:'PPh 21', terutang: 16920000, pct:'3.12%', vs: '+22.01%' },
  { jenis:'Lainnya', terutang: 14025250, pct:'2.73%', vs: '+11.47%' },
  { jenis:'TOTAL', terutang: 541785250, pct:'100%', vs: '+18.62%' },
];
const AREA_TABLE = [
  { area:'Jakarta', terutang: 218750000, pct:'40.31%' },
  { area:'Jawa Barat', terutang: 128250000, pct:'23.63%' },
  { area:'Jawa Tengah', terutang: 86450000, pct:'15.92%' },
  { area:'Jawa Timur', terutang: 65850000, pct:'12.14%' },
  { area:'Lainnya', terutang: 43485250, pct:'8.00%' },
  { area:'TOTAL', terutang: 542785250, pct:'100%' },
];
const STATUS_TABLE = [
  { status:'Sudah Dibayar', jumlah: 398125000, pct:'73.35%', color:'text-emerald-400', dot:'bg-emerald-400' },
  { status:'Kurang Bayar', jumlah: 144660250, pct:'26.64%', color:'text-rose-400', dot:'bg-rose-400' },
  { status:'Lebih Bayar', jumlah: 8125000, pct:'1.49%', color:'text-amber-400', dot:'bg-amber-400' },
  { status:'TOTAL', jumlah: 550910250, pct:'100%', color:'text-white', dot:'bg-blue-400' },
];
const DETAIL_TABLE = [
  { no:1, tgl:'01/06/2026', jenis:'PPN (VAT)', dok:'e-Faktur', nomor:'010.007-26.12345678', dpp:2500000000, pajak:132000000, status:'Dibayar', tglBayar:'10/06/2026', sumber:'Invoice', area:'Jakarta' },
  { no:2, tgl:'02/06/2026', jenis:'PPh 23', dok:'e-Bupot', nomor:'23/06/2026/001', dpp:450000000, pajak:9000000, status:'Dibayar', tglBayar:'10/06/2026', sumber:'Payment', area:'Jawa Barat' },
  { no:3, tgl:'03/06/2026', jenis:'PPN (VAT)', dok:'e-Faktur', nomor:'010.007-26.12345679', dpp:1800000000, pajak:198000000, status:'Dibayar', tglBayar:'12/06/2026', sumber:'Invoice', area:'Jakarta' },
  { no:4, tgl:'05/06/2026', jenis:'PPh 4(2)', dok:'e-Bupot', nomor:'42/06/2026/003', dpp:320000000, pajak:6400000, status:'Kurang Bayar', tglBayar:'', sumber:'Payment', area:'Jawa Timur' },
  { no:5, tgl:'06/06/2026', jenis:'PPN (VAT)', dok:'e-Faktur', nomor:'010.007-26.12345680', dpp:1200000000, pajak:132000000, status:'Dibayar', tglBayar:'15/06/2026', sumber:'Invoice', area:'Jakarta' },
];
const QUICK_TIMES = ['7 Hari','30 Hari','Bulan Ini','3 Bulan','6 Bulan','Tahun Ini'];

const Spark = ({ data, color }: { data: number[]; color: string }) => (
  <ResponsiveContainer width="100%" height={28}>
    <LineChart data={data.map((v) => ({ v }))}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, string> = {
    Dibayar: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Kurang Bayar': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    'Lebih Bayar': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${map[s] ?? 'bg-slate-500/10 text-[var(--app-muted)] border-slate-500/20'}`}>{s}</span>;
};

interface MetricCardProps {
  label: string; value: string; sub: string; trend: string; trendUp: boolean;
  icon: React.ReactNode; iconBg: string; spark: number[]; sparkColor: string;
}
const MetricCard = ({ label, value, sub, trend, trendUp, icon, iconBg, spark, sparkColor }: MetricCardProps) => (
  <div className="bg-[var(--app-bg)]/80 border border-[var(--app-border)] rounded-xl p-3.5 flex flex-col justify-between hover:border-[var(--app-border)]/60 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
      <div className={`flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
        {trendUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5"/> : <TrendingDown className="w-2.5 h-2.5 mr-0.5"/>}
        {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] text-[var(--app-muted)] font-medium uppercase tracking-wider">{label}</p>
      <h3 className="text-sm font-bold text-[var(--app-text)] mt-0.5 leading-tight">{value}</h3>
      <p className="text-[9px] text-[var(--app-muted)] mt-0.5">{sub}</p>
    </div>
    <div className="h-7 mt-2 opacity-70 group-hover:opacity-100 transition-opacity"><Spark data={spark} color={sparkColor}/></div>
  </div>
);

export default function TaxReportPage() {
  const [activeTaxTab, setActiveTaxTab] = useState('Ringkasan');
  const [taxSearch, setTaxSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [quickTime, setQuickTime] = useState('6 Bulan');
  const totalTax = 542785250;
  const filtered = DETAIL_TABLE.filter(r => r.nomor.toLowerCase().includes(taxSearch.toLowerCase()) || r.jenis.toLowerCase().includes(taxSearch.toLowerCase()));

  return (
    <Layout>
      <div className="bg-[var(--app-bg)] text-[var(--app-text)] min-h-screen p-5 font-sans antialiased">
        {/* ─── Swiss B2B Reports Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/reports" className="hover:text-[var(--app-text)]">Laporan & Analitik</Link>
              <span>/</span>
              <span className="text-indigo-400 font-semibold">Laporan Perpajakan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Rekapitulasi Faktur Pajak & PPN Telekomunikasi
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Penyusunan SPT masa PPN 11%, bukti potong PPh pasal 23/21, dan rekonsiliasi e-Faktur terbit.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/reports"
              className="px-3 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/20 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all"
            >
              Semua Laporan
            </Link>
          </div>
        </div>
        {/* Title & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-[var(--app-text)] tracking-tight">Tax Report</h1>
            <p className="text-xs text-[var(--app-muted)] mt-0.5">Laporan perpajakan berdasarkan transaksi, invoice, dan periode pajak.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg transition-all"><Download className="w-3.5 h-3.5"/>Export<ChevronDown className="w-3 h-3 ml-0.5"/></button>
            <button className="flex items-center gap-1.5 bg-[var(--app-bg)] hover:bg-[var(--app-bg)] border border-[var(--app-border)] text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"><Star className="w-3.5 h-3.5 text-[var(--app-muted)]"/>Jadwalkan Laporan</button>
            <button className="p-2 rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-bg)] text-[var(--app-muted)] hover:text-white"><MoreVertical className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="border-b border-[var(--app-border)] mb-4 overflow-x-auto">
          <div className="flex gap-1 pb-2 whitespace-nowrap">
            {TAX_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTaxTab(tab)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${activeTaxTab === tab ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 font-bold' : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] border border-transparent'}`}>{tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3.5 mb-4 flex flex-wrap items-end justify-between gap-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            {[{lbl:'Periode Pajak',opts:['Juni 2026','Mei 2026','April 2026']},{lbl:'Dibandingkan Dengan',opts:['Mei 2026','April 2026']},{lbl:'Jenis Pajak',opts:['Semua Jenis Pajak','PPN (VAT)','PPh 23']},{lbl:'Status',opts:['Semua Status','Dibayar','Kurang Bayar']},{lbl:'Area / Region',opts:['Semua Area','Jakarta','Jawa Barat']},{lbl:'Sumber',opts:['Semua Sumber','Invoice','Payment']}].map(({lbl,opts}) => (
              <div key={lbl} className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--app-text-muted)]">{lbl}</label>
                <select className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 min-w-[110px]">{opts.map(o=><option key={o}>{o}</option>)}</select>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-[var(--app-text)] text-xs px-3 py-1.5 rounded-lg transition-colors"><Sliders className="w-3.5 h-3.5"/>Filter Lainnya</button>
            <button className="text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs px-3 py-1.5 rounded-lg hover:bg-[var(--app-card-subtle)] transition-colors">Reset</button>
          </div>
        </div>

        {/* Last updated */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[10px] text-[var(--app-muted)]"><RefreshCw className="w-3 h-3"/><span>Data diperbarui: 22/10/2026 08:30 WIB</span></div>
          <div className="flex items-center gap-1.5"><span className="text-[10px] text-[var(--app-muted)]">Auto-update</span><div className="w-8 h-4 rounded-full bg-blue-600 relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow"/></div></div>
        </div>

        {/* 7 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-3 mb-5">
          <MetricCard label="Total Pajak Terutang" value={fmt(542785250)} sub="+ 18.62% dari Mei 2026" trend="18.62%" trendUp icon={<Database className="w-4 h-4 text-blue-400"/>} iconBg="bg-blue-600/10" spark={[310,330,340,355,318,372]} sparkColor="#3b82f6"/>
          <MetricCard label="PPN (VAT) Terutang" value={fmt(372450000)} sub="+ 17.25% dari Mei 2026" trend="17.25%" trendUp icon={<TrendingUp className="w-4 h-4 text-emerald-400"/>} iconBg="bg-emerald-600/10" spark={[280,295,310,320,300,372]} sparkColor="#10b981"/>
          <MetricCard label="PPh Terutang" value={fmt(145980000)} sub="+ 21.38% dari Mei 2026" trend="21.38%" trendUp icon={<FileText className="w-4 h-4 text-amber-400"/>} iconBg="bg-amber-600/10" spark={[110,115,122,128,118,145]} sparkColor="#f59e0b"/>
          <MetricCard label="Pajak Dibayar" value={fmt(398125000)} sub="+ 15.80% dari Mei 2026" trend="15.80%" trendUp icon={<CheckCircle2 className="w-4 h-4 text-cyan-400"/>} iconBg="bg-cyan-600/10" spark={[320,340,358,370,345,398]} sparkColor="#06b6d4"/>
          <MetricCard label="Pajak Kurang Bayar" value={fmt(144660250)} sub="- 5.21% dari Mei 2026" trend="5.21%" trendUp={false} icon={<AlertCircle className="w-4 h-4 text-rose-400"/>} iconBg="bg-rose-600/10" spark={[160,158,155,150,152,144]} sparkColor="#f43f5e"/>
          <MetricCard label="Pajak Lebih Bayar" value={fmt(8125000)} sub="+ 4.35% dari Mei 2026" trend="4.35%" trendUp icon={<TrendingDown className="w-4 h-4 text-violet-400"/>} iconBg="bg-violet-600/10" spark={[7,7.5,7.8,7.9,7.8,8.1]} sparkColor="#8b5cf6"/>
          <MetricCard label="e-Faktur Terbit" value="1.245" sub="+ 12.35% dari Mei 2026" trend="12.35%" trendUp icon={<FileDown className="w-4 h-4 text-pink-400"/>} iconBg="bg-pink-600/10" spark={[900,970,1050,1100,1108,1245]} sparkColor="#ec4899"/>
        </div>
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
          {/* Trend Line Chart */}
          <div className="lg:col-span-5 bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[var(--app-text)]">Trend Pajak Terutang <span className="text-[var(--app-muted)] font-normal">(6 Bulan Terakhir)</span></h3>
              <div className="flex items-center gap-3 text-[10px] text-[var(--app-muted)]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>PPN (VAT)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>PPh</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/>Lainnya</span>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{left:-15,right:8,top:5,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F1D38"/>
                  <XAxis dataKey="bulan" stroke="#64748B" fontSize={9}/>
                  <YAxis stroke="#64748B" fontSize={9} tickFormatter={fmtShort}/>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8, fontSize: 11 }} labelStyle={{color:'#F1F5F9',fontWeight:'bold'}} formatter={(v: any)=>[fmt(v),'']}/>
                  <Line type="monotone" dataKey="ppn" stroke="#3b82f6" strokeWidth={2} dot={{r:3}} activeDot={{r:5}} name="PPN (VAT)"/>
                  <Line type="monotone" dataKey="pph" stroke="#10b981" strokeWidth={2} dot={{r:3}} activeDot={{r:5}} name="PPh"/>
                  <Line type="monotone" dataKey="lain" stroke="#f59e0b" strokeWidth={2} dot={{r:3}} activeDot={{r:5}} name="Lainnya"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Komposisi */}
          <div className="lg:col-span-3 bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
            <h3 className="text-xs font-bold text-[var(--app-text)] mb-3">Komposisi Pajak</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0" style={{width:120,height:120}}>
                <PieChart width={120} height={120}>
                  <Pie data={KOMPOSISI_DATA} cx={55} cy={55} innerRadius={38} outerRadius={55} paddingAngle={2} dataKey="value">
                    {KOMPOSISI_DATA.map((_,i)=><Cell key={i} fill={KOMPOSISI_DATA[i].color}/>)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[8px] text-[var(--app-muted)] font-semibold uppercase leading-none">Total</p>
                  <p className="text-[10px] font-bold text-[var(--app-text)] leading-tight text-center">{fmt(totalTax)}</p>
                  <p className="text-[8px] text-[var(--app-muted)]">Total Pajak</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {KOMPOSISI_DATA.map(d=>(
                  <div key={d.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:d.color}}/><span className="text-slate-300">{d.name}</span></div>
                    <div className="text-right"><span className="text-[var(--app-muted)] mr-1">{d.pct}</span><span className="text-[var(--app-text)] font-semibold">{fmtShort(d.value)}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar+Line combo */}
          <div className="lg:col-span-4 bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[var(--app-text)]">Pajak Terutang vs Dibayar</h3>
              <div className="flex items-center gap-2 text-[10px] text-[var(--app-muted)]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500 inline-block"/>Terutang</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500 inline-block"/>Dibayar</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Selisih</span>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={PAID_VS_DUE_DATA} margin={{left:-15,right:8,top:5,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F1D38"/>
                  <XAxis dataKey="bulan" stroke="#64748B" fontSize={9}/>
                  <YAxis stroke="#64748B" fontSize={9} tickFormatter={fmtShort}/>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)', borderRadius: 8, fontSize: 11 }} labelStyle={{color:'#F1F5F9',fontWeight:'bold'}} formatter={(v: any)=>[fmt(v),'']}/>
                  <Bar dataKey="terutang" fill="#3b82f6" radius={[3,3,0,0]} name="Terutang"/>
                  <Bar dataKey="dibayar" fill="#10b981" radius={[3,3,0,0]} name="Dibayar"/>
                  <Line type="monotone" dataKey="selisih" stroke="#f59e0b" strokeWidth={2} dot={{r:3}} name="Selisih"/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Tables + Right Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-5">
          <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Per Jenis */}
            <div className="bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] mb-3">Pajak Terutang per Jenis</h3>
              <table className="w-full text-xs">
                <thead><tr className="text-[var(--app-muted)] text-[10px] uppercase border-b border-[var(--app-border)]">
                  <th className="py-1.5 text-left">Jenis Pajak</th><th className="py-1.5 text-right">Terutang (Rp)</th><th className="py-1.5 text-right">%</th><th className="py-1.5 text-right">vs Mei</th>
                </tr></thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {JENIS_TABLE.map((r,i)=>(
                    <tr key={i} className={`hover:bg-[var(--app-card-subtle)] ${r.jenis==='TOTAL'?'border-t border-slate-700/60':''}`}>
                      <td className={`py-2 pr-2 ${r.jenis==='TOTAL'?'font-bold text-[var(--app-text)]':'text-slate-300'}`}>{r.jenis}</td>
                      <td className={`py-2 text-right whitespace-nowrap ${r.jenis==='TOTAL'?'font-bold text-[var(--app-text)]':'text-slate-300'}`}>{fmt(r.terutang)}</td>
                      <td className="py-2 text-right text-[var(--app-muted)]">{r.pct}</td>
                      <td className="py-2 text-right text-emerald-400 font-semibold">{r.vs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Per Area */}
            <div className="bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] mb-3">Pajak Terutang per Area / Region</h3>
              <table className="w-full text-xs">
                <thead><tr className="text-[var(--app-muted)] text-[10px] uppercase border-b border-[var(--app-border)]">
                  <th className="py-1.5 text-left">Area</th><th className="py-1.5 text-right">Terutang (Rp)</th><th className="py-1.5 text-right">%</th>
                </tr></thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {AREA_TABLE.map((r,i)=>(
                    <tr key={i} className={`hover:bg-[var(--app-card-subtle)] ${r.area==='TOTAL'?'border-t border-slate-700/60':''}`}>
                      <td className={`py-2 pr-2 ${r.area==='TOTAL'?'font-bold text-[var(--app-text)]':'text-slate-300'}`}>{r.area}</td>
                      <td className={`py-2 text-right whitespace-nowrap ${r.area==='TOTAL'?'font-bold text-[var(--app-text)]':'text-slate-300'}`}>{fmt(r.terutang)}</td>
                      <td className="py-2 text-right text-[var(--app-muted)]">{r.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Status */}
            <div className="bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] mb-3">Status Pembayaran Pajak</h3>
              <table className="w-full text-xs">
                <thead><tr className="text-[var(--app-muted)] text-[10px] uppercase border-b border-[var(--app-border)]">
                  <th className="py-1.5 text-left">Status</th><th className="py-1.5 text-right">Jumlah (Rp)</th><th className="py-1.5 text-right">%</th>
                </tr></thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {STATUS_TABLE.map((r,i)=>(
                    <tr key={i} className={`hover:bg-[var(--app-card-subtle)] ${r.status==='TOTAL'?'border-t border-slate-700/60':''}`}>
                      <td className="py-2 pr-2"><div className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`}/><span className={r.color}>{r.status}</span></div></td>
                      <td className={`py-2 text-right whitespace-nowrap ${r.status==='TOTAL'?'font-bold text-[var(--app-text)]':'text-slate-300'}`}>{fmt(r.jumlah)}</td>
                      <td className="py-2 text-right text-[var(--app-muted)]">{r.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right panel */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            {/* Filter Cepat */}
            <div className="bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] mb-3">Filter Cepat</h3>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {QUICK_TIMES.map(t=>(
                  <button key={t} onClick={()=>setQuickTime(t)} className={`text-[10px] font-semibold px-1.5 py-1.5 rounded-lg transition-all ${quickTime===t?'bg-blue-600 text-white':'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-slate-200'}`}>{t}</button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {['Jenis Pajak','Status','Sumber','Area / Region','Customer','PPN Type'].map(lbl=>(
                  <div key={lbl} className="flex flex-col gap-0.5">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-[var(--app-muted)]">{lbl}</label>
                    <select className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"><option>Semua {lbl}</option></select>
                  </div>
                ))}
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg mt-1 transition-colors">Terapkan Filter</button>
              </div>
            </div>
            {/* Aksi Cepat */}
            <div className="bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] mb-3">Aksi Cepat</h3>
              <div className="flex flex-col gap-1.5">
                {[{label:'Lihat Detail Pajak',icon:Eye},{label:'Export Tax Report (Excel)',icon:FileDown},{label:'Export Tax Report (PDF)',icon:FileText},{label:'e-Faktur Summary',icon:Database},{label:'Withholding Tax Report',icon:FileText},{label:'Download Tax History',icon:Download},{label:'Rekonsiliasi Pajak',icon:RefreshCw}].map(({label,icon:Icon})=>(
                  <button key={label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)]/30 border border-[var(--app-border)] hover:border-blue-500/30 text-xs text-slate-300 hover:text-white transition-all group">
                    <div className="flex items-center gap-2"><Icon className="w-3.5 h-3.5 text-[var(--app-muted)] group-hover:text-blue-400 transition-colors"/><span>{label}</span></div>
                    <ChevronRight className="w-3 h-3 text-[var(--app-text)]/80 group-hover:text-slate-300 transition-colors"/>
                  </button>
                ))}
              </div>
            </div>
            {/* Insight */}
            <div className="bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1.5 mb-3"><Info className="w-3.5 h-3.5 text-blue-400"/>Insight &amp; Rekomendasi</h3>
              <ul className="text-xs text-slate-300 flex flex-col gap-2 pl-4 list-disc marker:text-blue-400">
                <li>PPN terutang naik <span className="text-emerald-400 font-semibold">17.25%</span> dibanding periode sebelumnya.</li>
                <li>PPh 23 mengalami kenaikan signifikan pada pembayaran ke vendor.</li>
                <li>Pastikan pembayaran pajak sebelum jatuh tempo untuk menghindari denda.</li>
              </ul>
              <button className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-semibold mt-3"><span>Lihat Insight Lengkap</span><ArrowRight className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        </div>
        {/* Detail Tax Report Table */}
        <div className="bg-[var(--app-border)]/20 border border-[var(--app-border)] rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--app-border)]">
            <h3 className="text-xs font-bold text-[var(--app-text)]">Detail Tax Report</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--app-muted)]"/>
                <input type="text" placeholder="Cari nomor faktur, dokumen..." value={taxSearch} onChange={e=>setTaxSearch(e.target.value)} className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 w-52 transition-colors"/>
              </div>
              <button className="flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs px-3 py-1.5 rounded-lg">
                <Filter className="w-3 h-3"/>Filter
                <span className="bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">88</span>
              </button>
              <button className="p-1.5 rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white"><MoreVertical className="w-3.5 h-3.5"/></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[var(--app-muted)] text-[10px] uppercase tracking-wider border-b border-[var(--app-border)]">
                  <th className="py-2.5 px-2 text-center w-8">NO</th>
                  <th className="py-2.5 px-2">Tanggal</th><th className="py-2.5 px-2">Jenis Pajak</th><th className="py-2.5 px-2">Dokumen</th>
                  <th className="py-2.5 px-2">Nomor</th><th className="py-2.5 px-2 text-right">DPP (Rp)</th><th className="py-2.5 px-2 text-right">Pajak (Rp)</th>
                  <th className="py-2.5 px-2 text-center">Status</th><th className="py-2.5 px-2">Tanggal Bayar</th><th className="py-2.5 px-2">Sumber</th>
                  <th className="py-2.5 px-2">Area / Region</th><th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {filtered.map(row=>(
                  <tr key={row.no} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                    <td className="py-2.5 px-2 text-center text-[var(--app-text-muted)]">{row.no}</td>
                    <td className="py-2.5 px-2 text-[var(--app-text)] whitespace-nowrap">{row.tgl}</td>
                    <td className="py-2.5 px-2 text-[var(--app-text)] font-medium whitespace-nowrap">{row.jenis}</td>
                    <td className="py-2.5 px-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 font-medium">{row.dok}</span></td>
                    <td className="py-2.5 px-2 text-[var(--app-text-muted)] font-mono text-[10px]">{row.nomor}</td>
                    <td className="py-2.5 px-2 text-right text-[var(--app-text)] font-medium whitespace-nowrap">{fmt(row.dpp)}</td>
                    <td className="py-2.5 px-2 text-right text-[var(--app-text)] font-semibold whitespace-nowrap">{fmt(row.pajak)}</td>
                    <td className="py-2.5 px-2 text-center"><StatusBadge s={row.status}/></td>
                    <td className="py-2.5 px-2 text-[var(--app-text-muted)] whitespace-nowrap">{row.tglBayar || <span className="text-[var(--app-text-dim)]">—</span>}</td>
                    <td className="py-2.5 px-2 text-[var(--app-text-muted)]">{row.sumber}</td>
                    <td className="py-2.5 px-2 text-[var(--app-text-muted)]">{row.area}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-[var(--app-card-subtle)] rounded text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors"><Eye className="w-3 h-3"/></button>
                        <button className="p-1 hover:bg-[var(--app-card-subtle)] rounded text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors"><Download className="w-3 h-3"/></button>
                        <button className="p-1 hover:bg-[var(--app-card-subtle)] rounded text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors"><MoreVertical className="w-3 h-3"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-[var(--app-border)]">
            <span className="text-xs text-[var(--app-muted)]">Menampilkan 1 - {Math.min(perPage,filtered.length)} dari 245 data</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="h-7 w-7 flex items-center justify-center rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white"><ChevronLeft className="w-3.5 h-3.5"/></button>
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setPage(n)} className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${page===n?'bg-blue-600 text-white':'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white'}`}>{n}</button>
                ))}
                <span className="text-[var(--app-text)]/80 text-xs px-1">...</span>
                <button className="h-7 px-2 flex items-center justify-center rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white text-xs">49</button>
                <button onClick={()=>setPage(p=>p+1)} className="h-7 w-7 flex items-center justify-center rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white"><ChevronRight className="w-3.5 h-3.5"/></button>
              </div>
              <select value={perPage} onChange={e=>setPerPage(Number(e.target.value))} className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500">
                <option value={10}>10 / halaman</option><option value={20}>20 / halaman</option><option value={50}>50 / halaman</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
