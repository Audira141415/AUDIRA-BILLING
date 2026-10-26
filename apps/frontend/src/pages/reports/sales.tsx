import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  Users, DollarSign, Eye, Target, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight, Info,
  ShoppingCart, Percent, Award, MapPin, Settings
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ComposedChart, AreaChart, Area
} from 'recharts';

// ─── Mock Data ─────────────────────────────────────────────────────────────

const revenueTrend = [
  { month: 'Jan', revenue: 1800000000, penjualan: 1200 },
  { month: 'Feb', revenue: 2100000000, penjualan: 1450 },
  { month: 'Mar', revenue: 1950000000, penjualan: 1310 },
  { month: 'Apr', revenue: 2400000000, penjualan: 1680 },
  { month: 'Mei', revenue: 2200000000, penjualan: 1590 },
  { month: 'Jun', revenue: 2845750000, penjualan: 1845 },
];

const salesByPerson = [
  { name: 'Budi Santoso', value: 809250000, pct: '28.45%', color: '#3b82f6' },
  { name: 'Rina Kartika', value: 659650000, pct: '23.18%', color: '#10b981' },
  { name: 'Andi Wijaya', value: 519100000, pct: '18.27%', color: '#8b5cf6' },
  { name: 'Siti Nurhaliza', value: 444850000, pct: '15.64%', color: '#f59e0b' },
  { name: 'Dewi Lestari', value: 253600000, pct: '8.92%', color: '#ef4444' },
  { name: 'Lainnya', value: 159300000, pct: '5.54%', color: '#6b7280' },
];

const targetAchievement = [
  { name: 'Budi Santoso', target: 650000000, achieved: 809250000, pct: 124.5 },
  { name: 'Rina Kartika', target: 600000000, achieved: 659650000, pct: 109.9 },
  { name: 'Andi Wijaya', target: 500000000, achieved: 519100000, pct: 103.8 },
  { name: 'Siti Nurhaliza', target: 400000000, achieved: 444850000, pct: 111.2 },
  { name: 'Dewi Lestari', target: 250000000, achieved: 253600000, pct: 101.4 },
];

const areaData = [
  { name: 'Jakarta', value: 923450000, pct: '32.45%', color: '#3b82f6' },
  { name: 'Depok', value: 533800000, pct: '18.76%', color: '#10b981' },
  { name: 'Bekasi', value: 461000000, pct: '16.20%', color: '#8b5cf6' },
  { name: 'Bogor', value: 365400000, pct: '12.14%', color: '#f59e0b' },
  { name: 'Tangerang', value: 267900000, pct: '10.30%', color: '#06b6d4' },
  { name: 'Lainnya', value: 293600000, pct: '10.30%', color: '#6b7280' },
];

const funnelData = [
  { stage: 'Total Leads', value: 6245, color: '#3b82f6', pct: '100%' },
  { stage: 'Proposal', value: 3842, color: '#6366f1', pct: '61.54%' },
  { stage: 'Negosiasi', value: 2135, color: '#8b5cf6', pct: '34.19%' },
  { stage: 'Closing', value: 1248, color: '#a855f7', pct: '19.98%' },
  { stage: 'Customer', value: 1845, color: '#10b981', pct: '29.55%' },
];

const newCustomerTrend = [
  { month: 'Jan', customer: 280, growth: 12 },
  { month: 'Feb', customer: 340, growth: 21 },
  { month: 'Mar', customer: 310, growth: -9 },
  { month: 'Apr', customer: 420, growth: 35 },
  { month: 'Mei', customer: 445, growth: 6 },
  { month: 'Jun', customer: 563, growth: 27 },
];

const topSales = [
  { rank: 1, name: 'Budi Santoso', revenue: 809250000, pct: '28.45%' },
  { rank: 2, name: 'Rina Kartika', revenue: 659650000, pct: '23.18%' },
  { rank: 3, name: 'Andi Wijaya', revenue: 519100000, pct: '18.27%' },
  { rank: 4, name: 'Siti Nurhaliza', revenue: 444850000, pct: '15.64%' },
  { rank: 5, name: 'Dewi Lestari', revenue: 253600000, pct: '8.92%' },
];

const tableData = [
  { no: 1, sales: 'Budi Santoso', area: 'Jakarta', revenue: 809250000, penjualan: 512, newCustomer: 156, convRate: 30.47, avgDeal: 1580556, target: 650000000, achievement: 124.5 },
  { no: 2, sales: 'Rina Kartika', area: 'Depok', revenue: 659650000, penjualan: 428, newCustomer: 132, convRate: 30.84, avgDeal: 1541472, target: 600000000, achievement: 109.9 },
  { no: 3, sales: 'Andi Wijaya', area: 'Bekasi', revenue: 519100000, penjualan: 356, newCustomer: 98, convRate: 27.53, avgDeal: 1457584, target: 500000000, achievement: 103.8 },
  { no: 4, sales: 'Siti Nurhaliza', area: 'Bogor', revenue: 444850000, penjualan: 289, newCustomer: 81, convRate: 28.03, avgDeal: 1538928, target: 400000000, achievement: 111.2 },
  { no: 5, sales: 'Dewi Lestari', area: 'Tangerang', revenue: 253600000, penjualan: 176, newCustomer: 40, convRate: 22.73, avgDeal: 1440909, target: 250000000, achievement: 101.4 },
];

const SUB_TABS = [
  'Ringkasan', 'Sales Performance', 'Sales Target', 'Product Performance',
  'Customer Acquisition', 'Pipeline (Leads)', 'Conversion Funnel', 'Commission', 'Activity Log'
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(3).replace('.', ',')} M`;
  if (n >= 1000000) return `Rp ${Math.round(n / 1000).toLocaleString('id-ID')}`;
  return `Rp ${n.toLocaleString('id-ID')}`;
};
const fmtRpFull = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const fmt = (n: number) => n.toLocaleString('id-ID');

// ─── KPI Card ───────────────────────────────────────────────────────────────

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
        <span className={`flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
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

// ─── Donut Chart ────────────────────────────────────────────────────────────

function DonutChart({ data, total, label, size = 130 }: {
  data: { name: string; value: number; color: string; pct: string }[];
  total: string; label: string; size?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="55%" outerRadius="80%" startAngle={90} endAngle={-270} stroke="none">
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs font-black text-[var(--app-text)] leading-none">{total}</p>
          <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">{label}</p>
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--app-muted)] truncate flex-1">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold shrink-0">{d.pct}</span>
            <span className="text-[var(--app-muted)] shrink-0 hidden xl:inline">{fmtRp(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sales Funnel ────────────────────────────────────────────────────────────

function SalesFunnel({ data }: { data: typeof funnelData }) {
  const max = data[0].value;
  return (
    <div className="space-y-1.5">
      {data.map((d, i) => {
        const w = (d.value / max) * 100;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[8px] text-[var(--app-muted)] w-20 shrink-0 text-right leading-tight">{d.stage}</span>
            <div className="flex-1 relative h-5 bg-[var(--app-border)]/20 rounded overflow-hidden">
              <div className="h-full rounded transition-all flex items-center pl-2"
                style={{ width: `${w}%`, backgroundColor: d.color + 'cc' }}>
                <span className="text-[7px] text-[var(--app-text)] font-bold">{fmt(d.value)}</span>
              </div>
            </div>
            <span className="text-[7px] text-[var(--app-muted)] w-10 shrink-0">{d.pct}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard Tab ───────────────────────────────────────────────────────

function TabRingkasan() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tableData.filter(r =>
    r.sales.toLowerCase().includes(search.toLowerCase()) ||
    r.area.toLowerCase().includes(search.toLowerCase())
  );

  const achColor = (pct: number) =>
    pct >= 120 ? 'text-green-400' : pct >= 100 ? 'text-blue-400' : pct >= 80 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={DollarSign} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Sales (Revenue)" value="Rp 2.845.750.000" change="12.85%" up={true} />
        <KpiCard icon={ShoppingCart} iconBg="bg-green-500/10" iconColor="#10b981" label="Total Penjualan" value="1.845" change="13.32%" up={true} />
        <KpiCard icon={Users} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="New Customer" value="563" change="15.28%" up={true} />
        <KpiCard icon={Percent} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Conversion Rate" value="30.51%" change="2.48%" up={true} />
        <KpiCard icon={TrendingUp} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="Avg. Deal Value" value="Rp 1.542.350" change="3.21%" up={true} />
        <KpiCard icon={Award} iconBg="bg-orange-500/10" iconColor="#f97316" label="Sales Target Achievement" value="118.75%" change="18.75%" up={true} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Trend + Revenue by Sales + Target vs Achievement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Revenue Trend */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-[var(--app-text)]">Revenue Trend (6 Bulan Terakhir)</h4>
                </div>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-3 text-[7px] font-bold flex-wrap">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /><span className="text-[var(--app-muted)]">Total Revenue</span></span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-400 inline-block" /><span className="text-[var(--app-muted)]">Total Penjualan</span></span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <ComposedChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="l" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any, name: string) => [name === 'revenue' ? fmtRpFull(v) : fmt(v), name === 'revenue' ? 'Revenue' : 'Penjualan']} />
                  <Line yAxisId="l" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} name="revenue" />
                  <Line yAxisId="r" type="monotone" dataKey="penjualan" stroke="#10b981" strokeWidth={1.5} dot={false} name="penjualan" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Sales (Donut) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Revenue by Sales</h4>
              <DonutChart data={salesByPerson} total="Rp 2,845 M" label="Total Revenue" size={120} />
              <div className="space-y-1 mt-1">
                {salesByPerson.slice(0, 5).map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-[8px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.pct} {fmtRpFull(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Target vs Achievement */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Sales Target vs Achievement</h4>
              </div>
              <div className="flex gap-3 text-[7px] font-bold">
                <span className="flex items-center gap-1"><span className="w-2 h-1.5 bg-blue-500/60 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Target (Rp)</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-1.5 bg-green-500/60 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Achieved</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-orange-400 inline-block" /><span className="text-[var(--app-muted)]">Achievement (%)</span></span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <ComposedChart data={targetAchievement} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 7, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any, n: string) => [n === 'pct' ? `${v}%` : fmtRpFull(v), n === 'target' ? 'Target' : n === 'achieved' ? 'Achieved' : 'Achievement']} />
                  <Bar dataKey="target" fill="#3b82f680" radius={[0, 2, 2, 0]} name="target" barSize={7} />
                  <Bar dataKey="achieved" fill="#10b98180" radius={[0, 2, 2, 0]} name="achieved" barSize={7} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Area + Funnel + New Customer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sales by Area */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Sales by Area / Region</h4>
              <DonutChart data={areaData} total="Rp 2,845 M" label="Total Revenue" size={120} />
              <div className="space-y-1">
                {areaData.map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-[8px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.pct} {fmtRpFull(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Funnel */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Sales Funnel</h4>
              <SalesFunnel data={funnelData} />
              <div className="mt-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3 space-y-1 text-[9px]">
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Conversion Rate</span>
                  <span className="text-[var(--app-text)] font-black text-lg">29.55%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">vs Mei 2026</span>
                  <span className="text-green-400 font-bold">▲ 2.48%</span>
                </div>
              </div>
            </div>

            {/* New Customer Acquisition */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-[var(--app-text)]">New Customer Acquisition</h4>
                  <p className="text-[8px] text-[var(--app-muted)]">(6 Bulan Terakhir)</p>
                </div>
              </div>
              <div className="flex gap-2 text-[7px] font-bold flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-blue-500 inline-block" /><span className="text-[var(--app-muted)]">New Customer</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-orange-400 inline-block" /><span className="text-[var(--app-muted)]">Growth (%)</span></span>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={newCustomerTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="l" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Bar yAxisId="l" dataKey="customer" fill="#3b82f680" radius={[2, 2, 0, 0]} name="New Customer" />
                  <Line yAxisId="r" type="monotone" dataKey="growth" stroke="#f97316" strokeWidth={2} dot={{ r: 2, fill: '#f97316' }} name="Growth %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detail Table */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Detail Sales Performance</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                  <input type="text" placeholder="Cari sales, area, paket..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 w-40" />
                </div>
                <button onClick={() => alert("Penyaringan data diterapkan berdasarkan parameter yang dipilih.")} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                  <Filter size={10} /> Filter
                </button>
                <button onClick={() => alert("Beralih ke mode visualisasi grafik / diagram analitik.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]"><BarChart2 size={12} /></button>
                <button onClick={() => alert("Beralih ke tampilan tabel ringkas.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]"><FileText size={12} /></button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
              <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80 min-w-[900px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Sales</th>
                    <th className="px-3 py-2.5">Area / Region</th>
                    <th className="px-3 py-2.5 text-right">Total Revenue</th>
                    <th className="px-3 py-2.5 text-right">Penjualan</th>
                    <th className="px-3 py-2.5 text-right">New Customer</th>
                    <th className="px-3 py-2.5 text-right">Conversion Rate</th>
                    <th className="px-3 py-2.5 text-right">Avg. Deal Value</th>
                    <th className="px-3 py-2.5 text-right">Target (Rp)</th>
                    <th className="px-3 py-2.5 text-right">Achievement</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {filtered.map(row => (
                    <tr key={row.no} className="hover:bg-[var(--app-border)]/20 transition-colors">
                      <td className="px-3 py-2.5 text-[var(--app-muted)] font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.sales}</td>
                      <td className="px-3 py-2.5 text-[var(--app-muted)]">{row.area}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-400">{fmtRpFull(row.revenue)}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-[var(--app-text)]">{fmt(row.penjualan)}</td>
                      <td className="px-3 py-2.5 text-right text-white">{row.newCustomer}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-blue-400">{row.convRate}%</td>
                      <td className="px-3 py-2.5 text-right text-[var(--app-text)]/80">{fmtRpFull(row.avgDeal)}</td>
                      <td className="px-3 py-2.5 text-right text-[var(--app-text)]/80">{fmtRpFull(row.target)}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={`font-black text-xs ${achColor(row.achievement)}`}>{row.achievement}%</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => alert("Menampilkan rincian detail catatan laporan ini.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-blue-400 transition-colors"><Eye size={11} /></button>
                          <button onClick={() => alert("Mengunduh salinan berkas laporan baris terpilih...")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-green-400 transition-colors"><Download size={11} /></button>
                          <button onClick={() => alert("Opsi tindakan: Kirim WhatsApp, Cetak Salinan, Lihat Log Audit.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] transition-colors"><MoreVertical size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="bg-[var(--app-border)]/20 font-bold border-t-2 border-blue-500/30">
                    <td className="px-3 py-2.5 text-[var(--app-muted)] font-black" colSpan={3}>TOTAL</td>
                    <td className="px-3 py-2.5 text-right text-green-400 font-black">Rp 2.845.750.000</td>
                    <td className="px-3 py-2.5 text-right text-[var(--app-text)] font-black">1.845</td>
                    <td className="px-3 py-2.5 text-right text-[var(--app-text)] font-black">563</td>
                    <td className="px-3 py-2.5 text-right text-blue-400 font-black">30.51%</td>
                    <td className="px-3 py-2.5 text-right text-[var(--app-text)] font-black">Rp 1.542.350</td>
                    <td className="px-3 py-2.5 text-right text-[var(--app-text)] font-black">Rp 2.400.000.000</td>
                    <td className="px-3 py-2.5 text-right text-green-400 font-black">118.75%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[9px] text-[var(--app-muted)]">Menampilkan 1 - {filtered.length} dari 15 data</p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => alert("Kembali ke halaman sebelumnya.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><ChevronLeft size={11} /></button>
                {[1, 2, 3].map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 text-[9px] rounded-md font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><ChevronRight size={11} /></button>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] py-1.5 px-2 rounded-lg text-[var(--app-text)]/80 focus:outline-none">
                  <option>10 / halaman</option>
                  <option>25 / halaman</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Sales */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Top Sales (Revenue)</h4>
              <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                <option>Top 5</option>
              </select>
            </div>
            <div className="space-y-2">
              {topSales.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px]">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-600 text-white' : 'bg-[var(--app-border)]/20 text-[var(--app-muted)]'}`}>
                    {s.rank}
                  </span>
                  <span className="flex-1 font-bold text-[var(--app-text)] truncate">{s.name}</span>
                  <span className="text-green-400 font-bold shrink-0">{s.pct}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 mt-1 border-t border-[var(--app-border)] pt-2">
              {topSales.map((s, i) => (
                <div key={i} className="flex justify-between text-[8px]">
                  <span className="text-[var(--app-muted)]">{s.name}</span>
                  <span className="text-[var(--app-text)] font-bold">{fmtRpFull(s.revenue)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => alert("Menampilkan semua data sales dan agen AUDIRA...")} className="w-full text-center text-[9px] font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 border-t border-[var(--app-border)] pt-2">
              Lihat Semua Sales <ArrowUpRight size={10} />
            </button>
          </div>

          {/* Filter Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Top Cepat</h4>
            <div className="grid grid-cols-3 gap-1">
              {['7 Hari', '30 Hari', 'Bulan Ini', '3 Bulan', '6 Bulan', 'Tahun Ini'].map((t, i) => (
                <button key={t} onClick={() => alert(`Memfilter periode data: ${t}`)} className={`text-[8px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center ${i === 4 ? "bg-blue-600 border-blue-500 text-white" : "bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { label: 'Semua Sales', opt: 'Semua Sales' },
                { label: 'Semua Area', opt: 'Semua Area' },
                { label: 'Semua Paket', opt: 'Semua Paket' },
                { label: 'Semua Status', opt: 'Semua Status' },
                { label: 'Semua Sumber Leads', opt: 'Semua Sumber Leads' },
              ].map(f => (
                <div key={f.label}>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>{f.opt}</option>
                  </select>
                </div>
              ))}
            </div>
            <button onClick={() => alert("Filter multi-kriteria laporan berhasil diterapkan.")} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold py-2 rounded-lg transition-colors">
              Terapkan Filter
            </button>
          </div>

          {/* Aksi Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
            {[
              { label: 'Lihat Detail Sales', icon: Eye, color: 'text-blue-400' },
              { label: 'Sales Target Settings', icon: Target, color: 'text-orange-400' },
              { label: 'Download Sales Report', icon: Download, color: 'text-cyan-400' },
              { label: 'Export Sales Report (Excel)', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Export Sales Report (PDF)', icon: FileDown, color: 'text-red-400' },
              { label: 'Sales Commission Report', icon: Award, color: 'text-purple-400' },
            ].map(a => (
              <button key={a.label} onClick={() => alert(`Mengeksekusi aksi: ${a.label}`)} className="w-full flex items-center justify-between gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 p-2 rounded-lg text-[8px] font-semibold text-[var(--app-text)]/80 transition-all group">
                <span className="flex items-center gap-2">
                  <a.icon size={11} className={a.color} />
                  <span className="text-left">{a.label}</span>
                </span>
                <ChevronDown size={9} className="text-gray-600 group-hover:text-[var(--app-muted)] -rotate-90 shrink-0" />
              </button>
            ))}
          </div>

          {/* Insight */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Insight & Rekomendasi</h4>
            <div className="space-y-2">
              {[
                { text: "Budi Santoso mencapai target tertinggi (124.50%). Pertahankan strategi ini.", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "Rina Kartika memiliki pertumbuhan paling konsisten (23.18%).", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Conversion rate meningkat 2.48% dibanding periode sebelumnya.", color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
              ].map((ins, i) => (
                <div key={i} className={`p-2 rounded-lg border ${ins.bg}`}>
                  <p className={`text-[8px] font-semibold ${ins.color} leading-relaxed`}>{ins.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => alert("Insight Lengkap AI: Berdasarkan analisis churn dan margin laba, retensi pelanggan segmen korporat meningkat 14.2% setelah optimalisasi SLA bandwidth.")} className="w-full text-center text-[9px] font-bold text-blue-400 hover:text-blue-300 mt-1 flex items-center justify-center gap-1 border-t border-[var(--app-border)] pt-2">
              Lihat Insight Lengkap <ArrowUpRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[var(--app-muted)] space-y-3">
      <BarChart2 size={40} className="text-gray-700" />
      <p className="text-sm font-bold">Tab <span className="text-blue-400">{name}</span> sedang dalam pengembangan</p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SalesReportPage() {
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
              <span className="text-indigo-400 font-semibold">Laporan Penjualan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Produktivitas Tim Sales & Kanal Keagenan
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pencapaian target kuota bulanan sales rep, komisi agen reseller, dan closing rate prospek baru.
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

        {/* Action Buttons */}
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
                    <button key={e.label} onClick={() => { if (e.label === "Export PDF") { window.print(); } else { alert(`${e.label} berhasil diekspor.`); } setShowExport(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-[var(--app-text)]/80 hover:bg-[var(--app-border)]/30 transition-colors">
                      <e.icon size={12} className={e.color} />{e.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => alert("Jadwal pengiriman laporan otomatis via Email dan WhatsApp (mingguan/bulanan) telah diaktifkan untuk admin@audira.my.id.")} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Calendar size={11} className="text-blue-400" /> Jadwalkan Laporan
            </button>
            <button onClick={() => alert("Opsi Laporan: Salin Link URL, Cetak Layar Penuh, Sinkronisasi Cloud Drive.")} className="p-1.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]"><MoreVertical size={13} /></button>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[var(--app-muted)]">
            <RefreshCw size={11} className="text-[var(--app-muted)]" />
            <span>Data diperbarui: 22/10/2026 08:30 WIB</span>
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
            { label: 'Sales', opt: 'Semua Sales' },
            { label: 'Area / Region', opt: 'Semua Area' },
            { label: 'Paket', opt: 'Semua Paket' },
            { label: 'Status', opt: 'Semua Status' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase px-0.5">{f.label}</span>
              <select className="bg-[var(--app-card)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 transition-colors">
                <option>{f.opt}</option>
              </select>
            </div>
          ))}
          <div className="flex gap-1.5 self-end">
            <button onClick={() => alert("Membuka filter lanjutan & kustomisasi periode...")} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs"><Filter size={12} /> Filter Lainnya</button>
            <button onClick={() => window.location.reload()} className="text-xs font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-2.5 py-1.5 border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-card-subtle)] bg-[var(--app-card)] transition-colors shadow-xs">
              Reset
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Ringkasan' ? <TabRingkasan /> : <TabPlaceholder name={activeTab} />}
      </div>
    </Layout>
  );
}
