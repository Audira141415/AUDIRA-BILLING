import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportSubTabDetail from '@/components/ReportSubTabDetail';
import { Pagination } from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  DollarSign, Eye, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight,
  Percent, Activity, Layers, Globe, Package, Repeat, Zap
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendData = [
  { month: 'Jan', total: 1900000000, recurring: 1600000000, oneTime: 300000000 },
  { month: 'Feb', total: 2100000000, recurring: 1750000000, oneTime: 350000000 },
  { month: 'Mar', total: 1980000000, recurring: 1650000000, oneTime: 330000000 },
  { month: 'Apr', total: 2300000000, recurring: 1900000000, oneTime: 400000000 },
  { month: 'Mei', total: 2200000000, recurring: 1830000000, oneTime: 370000000 },
  { month: 'Jun', total: 2545750000, recurring: 2120450000, oneTime: 425300000 },
];

const distribusiData = [
  { name: 'Internet', value: 2118850000, pct: '83.2%', color: '#3b82f6' },
  { name: 'Instalasi', value: 221450000, pct: '8.7%', color: '#10b981' },
  { name: 'Perangkat', value: 137550000, pct: '5.4%', color: '#8b5cf6' },
  { name: 'Lainnya', value: 67900000, pct: '2.7%', color: '#6b7280' },
];

const paketBarData = [
  { name: 'Premium', value: 845000000 },
  { name: 'Standar', value: 620000000 },
  { name: 'Basic', value: 410000000 },
  { name: 'Promo', value: 210000000 },
  { name: 'Game', value: 145000000 },
  { name: 'Bisnis', value: 120000000 },
  { name: 'Residensi', value: 60000000 },
  { name: 'UMKM', value: 60000000 },
  { name: 'Lite', value: 30000000 },
  { name: 'Lainnya', value: 25000000 },
];

const tableData = [
  { no: 1, sumber: 'Internet', totalRevenue: 2118850000, recurringRevenue: 1880250000, oneTimeRevenue: 238600000, discount: -65120000, netRevenue: 2053730000, contribution: 83.20, growth: 11.45, growthUp: true },
  { no: 2, sumber: 'Instalasi', totalRevenue: 221450000, recurringRevenue: 25450000, oneTimeRevenue: 196000000, discount: -8850000, netRevenue: 212600000, contribution: 8.70, growth: 15.32, growthUp: true },
  { no: 3, sumber: 'Perangkat', totalRevenue: 137550000, recurringRevenue: 12550000, oneTimeRevenue: 125000000, discount: -5250000, netRevenue: 132300000, contribution: 5.40, growth: 13.21, growthUp: true },
  { no: 4, sumber: 'Lainnya', totalRevenue: 67900000, recurringRevenue: 2200000, oneTimeRevenue: 65700000, discount: -6030000, netRevenue: 61870000, contribution: 2.70, growth: -9.87, growthUp: false },
];

const SUB_TABS = [
  'Ringkasan', 'Revenue Trend', 'Revenue by Source', 'Revenue by Package',
  'Revenue by Area', 'Recurring Revenue', 'One Time Revenue',
  'ARPU & ARPPU', 'Forecast', 'Cohort Analysis'
];

const FILTER_SOURCES = [
  { label: 'Semua Sumber', color: 'text-gray-200', bg: 'bg-gray-500/20 border-gray-500/30', active: true },
  { label: 'Internet', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30', active: false },
  { label: 'Instalasi', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30', active: false },
  { label: 'Perangkat', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30', active: false },
  { label: 'Recurring', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30', active: false },
  { label: 'One Time', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', active: false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => `Rp ${Math.abs(n).toLocaleString('id-ID')}`;
const fmtRpFull = (n: number, sign = false) => `${sign && n < 0 ? '-' : ''}Rp ${Math.abs(n).toLocaleString('id-ID')}`;
const fmtRpCompact = (n: number) => {
  const abs = Math.abs(n);
  const prefix = n < 0 ? '-' : '';
  if (abs >= 1000000000) return `${prefix}Rp ${(abs / 1000000000).toFixed(3).replace('.', ',')} M`;
  if (abs >= 1000000) return `${prefix}Rp ${(abs / 1000000).toFixed(0)}Jt`;
  return `${prefix}Rp ${abs.toLocaleString('id-ID')}`;
};

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, iconColor, iconBg, label, value, change, up }: {
  icon: any; iconColor: string; iconBg: string;
  label: string; value: string; change: string; up: boolean;
}) {
  return (
    <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg border ${iconBg}`} style={{ borderColor: iconColor + '25' }}>
          <Icon size={14} style={{ color: iconColor }} />
        </div>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {up ? '▲' : '▼'} {change}
        </span>
      </div>
      <div>
        <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase tracking-wider">{label}</p>
        <p className="text-base font-black text-[var(--app-text)] mt-0.5 leading-tight">{value}</p>
        <p className="text-[8px] text-[var(--app-muted)] mt-0.5">dari Mei 2026</p>
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ data, total, label, size = 140 }: {
  data: { name: string; value: number; color: string; pct: string }[];
  total: string; label: string; size?: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="55%" outerRadius="82%" startAngle={90} endAngle={-270} stroke="none">
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-black text-[var(--app-text)] leading-none">{total}</p>
          <p className="text-[6px] text-[var(--app-muted)] font-bold uppercase mt-0.5">{label}</p>
        </div>
      </div>
      <div className="space-y-2 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--app-muted)] truncate flex-1">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold shrink-0">{d.pct}</span>
            <span className="text-[var(--app-muted)] shrink-0 text-[7px] hidden xl:inline">{fmtRpCompact(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tab ────────────────────────────────────────────────────────────────

function TabRingkasan() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [activeSources, setActiveSources] = useState<string[]>(['Semua Sumber']);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggleSource = (label: string) => {
    if (label === 'Semua Sumber') {
      setActiveSources(['Semua Sumber']);
    } else {
      const next = activeSources.includes(label)
        ? activeSources.filter(s => s !== label && s !== 'Semua Sumber')
        : [...activeSources.filter(s => s !== 'Semua Sumber'), label];
      setActiveSources(next.length === 0 ? ['Semua Sumber'] : next);
    }
  };

  const filtered = tableData.filter(r =>
    r.sumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const totals = {
    totalRevenue: filtered.reduce((s, r) => s + r.totalRevenue, 0),
    recurringRevenue: filtered.reduce((s, r) => s + r.recurringRevenue, 0),
    oneTimeRevenue: filtered.reduce((s, r) => s + r.oneTimeRevenue, 0),
    discount: filtered.reduce((s, r) => s + r.discount, 0),
    netRevenue: filtered.reduce((s, r) => s + r.netRevenue, 0),
  };

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={DollarSign} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Revenue" value="Rp 2.545.750.000" change="12.85%" up={true} />
        <KpiCard icon={Repeat} iconBg="bg-green-500/10" iconColor="#10b981" label="Recurring Revenue (MRR)" value="Rp 2.120.450.000" change="11.32%" up={true} />
        <KpiCard icon={Zap} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="One Time Revenue" value="Rp 425.300.000" change="18.74%" up={true} />
        <KpiCard icon={Activity} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="ARPU" value="Rp 198.450" change="1.21%" up={true} />
        <KpiCard icon={Layers} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="ARPPU" value="Rp 245.820" change="4.18%" up={true} />
        <KpiCard icon={TrendingUp} iconBg="bg-emerald-500/10" iconColor="#10b981" label="Growth Revenue" value="12.85%" change="2.14%" up={true} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Trend + Distribusi + By Package */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tren Pendapatan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Tren Pendapatan</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-2 text-[7px] font-bold flex-wrap">
                {[['Total Revenue','#3b82f6'],['Recurring Revenue','#10b981'],['One Time Revenue','#8b5cf6']].map(([l,c]) => (
                  <span key={l} className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block" style={{ backgroundColor: c }} /><span className="text-[var(--app-muted)]">{l}</span></span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any, n: string) => [fmtRp(v), n]} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="Total Revenue" />
                  <Line type="monotone" dataKey="recurring" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2, fill: '#10b981' }} name="Recurring Revenue" />
                  <Line type="monotone" dataKey="oneTime" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 2, fill: '#8b5cf6' }} name="One Time Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribusi Pendapatan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Distribusi Pendapatan (Berdasarkan Sumber)</h4>
              <DonutChart data={distribusiData} total="Rp 2,545 M" label="Total Revenue" size={135} />
              <div className="space-y-2 border-t border-[var(--app-border)] pt-2">
                {distribusiData.map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-[8px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.pct} - {fmtRpCompact(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Package */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Revenue by Package</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>Top 10 Paket</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={paketBarData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000000000 ? `${(v / 1000000000).toFixed(0)}M` : v >= 1000000 ? `${(v / 1000000).toFixed(0)}Jt` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any) => [fmtRp(v), 'Revenue']} />
                  <Bar dataKey="value" name="Revenue" radius={[3, 3, 0, 0]}>
                    {paketBarData.map((_, i) => (
                      <Cell key={i} fill={['#3b82f6','#10b981','#8b5cf6','#f59e0b','#06b6d4','#ef4444','#a855f7','#f97316','#14b8a6','#6b7280'][i % 10]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detail Revenue Table */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Detail Revenue <span className="text-[var(--app-muted)] font-normal">(Berdasarkan Sumber Pendapatan)</span></h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                  <input type="text" placeholder="Cari sumber pendapatan..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 w-44" />
                </div>
                <button onClick={() => toast.success("Penyaringan data diterapkan berdasarkan parameter yang dipilih.")} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                  <Filter size={10} /> Filter
                </button>
                <button onClick={() => toast.info("Beralih ke mode visualisasi grafik / diagram analitik.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><BarChart2 size={12} /></button>
                <button onClick={() => toast.info("Beralih ke tampilan tabel ringkas.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><FileText size={12} /></button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
              <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80 min-w-[900px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Sumber Pendapatan</th>
                    <th className="px-3 py-2.5 text-right">Total Revenue</th>
                    <th className="px-3 py-2.5 text-right">Recurring Revenue</th>
                    <th className="px-3 py-2.5 text-right">One Time Revenue</th>
                    <th className="px-3 py-2.5 text-right">Discount</th>
                    <th className="px-3 py-2.5 text-right">Net Revenue</th>
                    <th className="px-3 py-2.5 text-right">Contribution</th>
                    <th className="px-3 py-2.5 text-right">Growth</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {paginatedData.map(row => (
                    <tr key={row.no} className="hover:bg-[var(--app-border)]/20 transition-colors">
                      <td className="px-3 py-2.5 text-[var(--app-muted)] font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.sumber}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-[var(--app-text)]">{fmtRp(row.totalRevenue)}</td>
                      <td className="px-3 py-2.5 text-right text-green-400 font-bold">{fmtRp(row.recurringRevenue)}</td>
                      <td className="px-3 py-2.5 text-right text-purple-400">{fmtRp(row.oneTimeRevenue)}</td>
                      <td className="px-3 py-2.5 text-right text-red-400 font-bold">-{fmtRp(-row.discount)}</td>
                      <td className="px-3 py-2.5 text-right font-black text-blue-400">{fmtRp(row.netRevenue)}</td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-bold text-[var(--app-text)]">{row.contribution}%</span>
                          <div className="w-16 h-1 bg-[var(--app-border)]/20 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.contribution}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={`font-black text-xs flex items-center justify-end gap-0.5 ${row.growthUp ? 'text-green-400' : 'text-red-400'}`}>
                          {row.growthUp ? '▲' : '▼'} {Math.abs(row.growth)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => toast.info("Menampilkan rincian detail catatan laporan ini.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-blue-400 transition-colors"><Eye size={11} /></button>
                          <button onClick={() => toast.success("Mengunduh salinan berkas laporan baris terpilih...")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-green-400 transition-colors"><Download size={11} /></button>
                          <button onClick={() => toast.info("Opsi tindakan: Kirim WhatsApp, Cetak Salinan, Lihat Log Audit.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] transition-colors"><MoreVertical size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-[var(--app-border)]/20 font-bold border-t-2 border-blue-500/30">
                    <td className="px-3 py-2.5 text-[var(--app-muted)] font-black" colSpan={2}>TOTAL</td>
                    <td className="px-3 py-2.5 text-right text-[var(--app-text)] font-black">{fmtRp(totals.totalRevenue)}</td>
                    <td className="px-3 py-2.5 text-right text-green-400 font-black">{fmtRp(totals.recurringRevenue)}</td>
                    <td className="px-3 py-2.5 text-right text-purple-400 font-black">{fmtRp(totals.oneTimeRevenue)}</td>
                    <td className="px-3 py-2.5 text-right text-red-400 font-black">-{fmtRp(-totals.discount)}</td>
                    <td className="px-3 py-2.5 text-right text-blue-400 font-black">{fmtRp(totals.netRevenue)}</td>
                    <td className="px-3 py-2.5 text-right text-[var(--app-text)] font-black">100%</td>
                    <td className="px-3 py-2.5 text-right text-green-400 font-black">▲ 12.85%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Right 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Ringkasan Revenue */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Revenue</h4>
            <div className="space-y-2">
              {[
                { label: 'Total Revenue', value: 'Rp 2.545.750.000', color: 'text-white' },
                { label: 'Recurring Revenue', value: 'Rp 2.120.450.000', color: 'text-green-400' },
                { label: 'One Time Revenue', value: 'Rp 425.300.000', color: 'text-purple-400' },
                { label: 'Total Discount', value: '-Rp 85.250.000', color: 'text-red-400' },
                { label: 'Net Revenue', value: 'Rp 2.460.500.000', color: 'text-blue-400' },
                { label: 'Tax (PPN)', value: 'Rp 245.050.000', color: 'text-white' },
                { label: 'Growth Revenue', value: '12.85%', color: 'text-green-400' },
                { label: 'Growth vs Last Month', value: '▲ 2.14%', color: 'text-green-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center text-[9px] border-b border-[var(--app-border)] pb-1.5 last:border-0 last:pb-0">
                  <span className="text-[var(--app-muted)]">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Filter Cepat</h4>
            <div className="grid grid-cols-2 gap-1">
              {FILTER_SOURCES.map(s => (
                <button key={s.label} onClick={() => toggleSource(s.label)}
                  className={`text-[7px] font-bold py-1.5 px-2 rounded-lg border transition-all text-center truncate ${activeSources.includes(s.label) ? s.bg + ' ' + s.color : 'bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Semua Paket', opt: 'Semua Paket' },
                { label: 'Semua Area', opt: 'Semua Area' },
                { label: 'Group By', opt: 'Bulan' },
              ].map(f => (
                <div key={f.label} className="space-y-0.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase">{f.label}</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>{f.opt}</option>
                  </select>
                </div>
              ))}
            </div>
            <button onClick={() => toast.success("Filter multi-kriteria laporan berhasil diterapkan.")} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold py-2 rounded-lg transition-colors">
              Terapkan Filter
            </button>
          </div>

          {/* Aksi Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
            {[
              { label: 'Lihat Detail Revenue', icon: Eye, color: 'text-blue-400' },
              { label: 'Revenue per Customer', icon: Activity, color: 'text-cyan-400' },
              { label: 'Export Revenue List', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Download Invoice Terkait', icon: FileDown, color: 'text-red-400' },
            ].map(a => (
              <button key={a.label} onClick={() => toast.info(`Mengeksekusi aksi: ${a.label}`)} className="w-full flex items-center justify-between gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 p-2 rounded-lg text-[8px] font-semibold text-[var(--app-text)]/80 transition-all group">
                <span className="flex items-center gap-2">
                  <a.icon size={11} className={a.color} />
                  <span className="text-left">{a.label}</span>
                </span>
                <ChevronDown size={9} className="text-gray-600 -rotate-90 shrink-0" />
              </button>
            ))}
          </div>

          {/* Insight */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Insight & Rekomendasi</h4>
            <div className="space-y-2">
              {[
                { text: "Pendapatan naik 12.85% dibanding periode sebelumnya.", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "Recurring Revenue berkontribusi 83.2% dari total pendapatan.", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Paket Premium menyumbang 33.2% dari total revenue.", color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                { text: "ARPU naik 3.21% yang menunjukkan peningkatan nilai per customer.", color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
              ].map((ins, i) => (
                <div key={i} className={`p-2.5 rounded-lg border ${ins.bg}`}>
                  <p className={`text-[8px] font-semibold ${ins.color} leading-relaxed`}>{ins.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => toast.info("Insight Lengkap AI: Berdasarkan analisis churn dan margin laba, retensi pelanggan segmen korporat meningkat 14.2% setelah optimalisasi SLA bandwidth.")} className="w-full text-center text-[9px] font-bold text-blue-400 hover:text-blue-300 mt-1 flex items-center justify-center gap-1 border-t border-[var(--app-border)] pt-2">
              Lihat Insight Lengkap <ArrowUpRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TabPlaceholder replaced by ReportSubTabDetail

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RevenueReportPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">

        {/* ─── Swiss B2B Reports Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/reports" className="hover:text-[var(--app-text)]">Laporan & Analitik</Link>
              <span>/</span>
              <span className="text-indigo-400 font-semibold">Laporan Pendapatan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Pendapatan Berulang Bulanan & Pertumbuhan (MRR)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Analisis Monthly Recurring Revenue (MRR), Annual Run-rate, net revenue retention, dan pemetaan pendapatan per klaster OLT.
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

        {/* Action Row */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowExport(v => !v)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                <Download size={12} /> Export <ChevronDown size={9} className={`transition-transform ${showExport ? 'rotate-180' : ''}`} />
              </button>
              {showExport && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xl overflow-hidden w-44">
                  {[
                    { label: 'Export PDF', icon: FileDown, color: 'text-red-400' },
                    { label: 'Export Excel', icon: FileSpreadsheet, color: 'text-green-400' },
                    { label: 'Export CSV', icon: FileText, color: 'text-blue-400' },
                  ].map(e => (
                    <button key={e.label} onClick={() => { if (e.label === "Export PDF") { window.print(); } else { toast.success(`${e.label} berhasil diekspor.`); } setShowExport(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-[var(--app-text)]/80 hover:bg-[var(--app-border)]/30 transition-colors">
                      <e.icon size={12} className={e.color} />{e.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => toast.success("Jadwal pengiriman laporan otomatis via Email dan WhatsApp (mingguan/bulanan) telah diaktifkan untuk admin@audira.my.id.")} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Calendar size={11} className="text-blue-400" /> Jadwalkan Laporan
            </button>
            <button onClick={() => toast.info("Opsi Laporan: Salin Link URL, Cetak Layar Penuh, Sinkronisasi Cloud Drive.")} className="p-1.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]"><MoreVertical size={13} /></button>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[var(--app-muted)]">
            <RefreshCw size={11} className="text-[var(--app-muted)]" />
            <span>Data diperbarui: 22/10/2026 08:31 WIB</span>
            <span className="text-gray-600">|</span>
            <span>Auto-Update</span>
            {isMounted && (
              <button onClick={() => setAutoUpdate(v => !v)}
                className={`relative w-8 h-4 rounded-full transition-all ${autoUpdate ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoUpdate ? 'left-4' : 'left-0.5'}`} />
              </button>
            )}
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 border-b border-[var(--app-border)] pb-px overflow-x-auto">
          {SUB_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold' : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Primary Filters */}
        <div className="flex flex-wrap items-end gap-2.5">
          {[
            { label: 'Periode', opt: 'Juni 2026' },
            { label: 'Dibandingkan Dengan', opt: 'Mei 2026' },
            { label: 'Group By', opt: 'Bulan' },
            { label: 'Sumber Pendapatan', opt: 'Semua Sumber' },
            { label: 'Area/Region', opt: 'Semua Area' },
            { label: 'Paket', opt: 'Semua Paket' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase px-0.5">{f.label}</span>
              <select className="bg-[var(--app-card)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 transition-colors">
                <option>{f.opt}</option>
              </select>
            </div>
          ))}
          <div className="flex gap-1.5 self-end">
            <button onClick={() => toast.info("Membuka filter lanjutan & kustomisasi periode...")} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs"><Filter size={12} /> Filter Lainnya</button>
            <button onClick={() => window.location.reload()} className="text-xs font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-2.5 py-1.5 border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-card-subtle)] bg-[var(--app-card)] transition-colors shadow-xs">
              Reset
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Ringkasan' ? <TabRingkasan /> : <ReportSubTabDetail tabName={activeTab} category="Pendapatan" />}
      </div>
    </Layout>
  );
}
