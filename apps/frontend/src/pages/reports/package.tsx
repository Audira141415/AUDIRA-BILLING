import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  Users, DollarSign, Eye, Target, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight, Package,
  ArrowDown, ArrowUp, Activity, Zap, BarChart, GitCompare
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart as RBarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const packageByCustomer = [
  { name: 'Premium 100 Mbps', value: 4567, pct: '24.37%', color: '#3b82f6' },
  { name: 'Standar 50 Mbps', value: 3845, pct: '20.53%', color: '#10b981' },
  { name: 'Basic 20 Mbps', value: 2671, pct: '14.25%', color: '#8b5cf6' },
  { name: 'Promo Gaming', value: 1982, pct: '10.58%', color: '#f59e0b' },
  { name: 'Business 200 Mbps', value: 1654, pct: '8.82%', color: '#06b6d4' },
  { name: 'Lite 10 Mbps', value: 1120, pct: '5.97%', color: '#ef4444' },
  { name: 'UMKM 30 Mbps', value: 785, pct: '4.19%', color: '#a855f7' },
  { name: 'Residential 5 Mbps', value: 415, pct: '2.22%', color: '#f97316' },
  { name: 'Corporate 500 Mbps', value: 356, pct: '1.90%', color: '#14b8a6' },
  { name: 'Lainnya', value: 238, pct: '1.27%', color: '#6b7280' },
];

const revenueByPackage = [
  { name: 'Premium 100 Mbps', value: 1012450000, pct: '35.6%', color: '#3b82f6' },
  { name: 'Standar 50 Mbps', value: 628350000, pct: '22.1%', color: '#10b981' },
  { name: 'Basic 20 Mbps', value: 421680000, pct: '14.8%', color: '#8b5cf6' },
  { name: 'Promo Gaming', value: 275990000, pct: '9.7%', color: '#f59e0b' },
  { name: 'Business 200 Mbps', value: 207720000, pct: '7.3%', color: '#06b6d4' },
  { name: 'Lainnya', value: 299560000, pct: '10.5%', color: '#6b7280' },
];

const growthTrend = [
  { month: 'Jan', aktif: 12000, new: 800, churned: 320 },
  { month: 'Feb', aktif: 13500, new: 950, churned: 280 },
  { month: 'Mar', aktif: 14200, new: 1020, churned: 310 },
  { month: 'Apr', aktif: 15800, new: 1180, churned: 340 },
  { month: 'Mei', aktif: 17200, new: 1150, churned: 380 },
  { month: 'Jun', aktif: 18734, new: 1248, churned: 298 },
];

const tableData = [
  { no: 1, paket: 'Premium 100 Mbps', tipe: 'Internet', harga: 450000, pelangganAktif: 4567, newBulanIni: 312, upgrade: 198, downgrade: 87, churned: 42, revenue: 1012450000, avgTenure: 9.2, churnRate: 0.92 },
  { no: 2, paket: 'Standar 50 Mbps', tipe: 'Internet', harga: 300000, pelangganAktif: 3845, newBulanIni: 278, upgrade: 156, downgrade: 112, churned: 51, revenue: 628350000, avgTenure: 8.1, churnRate: 1.08 },
  { no: 3, paket: 'Basic 20 Mbps', tipe: 'Internet', harga: 200000, pelangganAktif: 2671, newBulanIni: 182, upgrade: 94, downgrade: 86, churned: 28, revenue: 421680000, avgTenure: 7.6, churnRate: 1.05 },
  { no: 4, paket: 'Promo Gaming', tipe: 'Internet', harga: 150000, pelangganAktif: 1982, newBulanIni: 210, upgrade: 128, downgrade: 64, churned: 19, revenue: 275990000, avgTenure: 6.3, churnRate: 0.96 },
  { no: 5, paket: 'Business 200 Mbps', tipe: 'Internet', harga: 800000, pelangganAktif: 1654, newBulanIni: 95, upgrade: 67, downgrade: 38, churned: 8, revenue: 207720000, avgTenure: 10.4, churnRate: 0.73 },
  { no: 6, paket: 'Lite 10 Mbps', tipe: 'Internet', harga: 120000, pelangganAktif: 1120, newBulanIni: 76, upgrade: 32, downgrade: 51, churned: 21, revenue: 134400000, avgTenure: 5.2, churnRate: 1.87 },
  { no: 7, paket: 'UMKM 30 Mbps', tipe: 'Internet', harga: 180000, pelangganAktif: 785, newBulanIni: 48, upgrade: 28, downgrade: 21, churned: 8, revenue: 102600000, avgTenure: 6.8, churnRate: 1.02 },
];

const SUB_TABS = [
  'Ringkasan', 'Package List', 'Package Performance', 'Customer by Package',
  'Revenue by Package', 'Usage by Package', 'Upgrade / Downgrade',
  'Add-on Report', 'Package Comparison'
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(3).replace('.', ',')} M`;
  if (n >= 1000000) return `Rp ${Math.round(n / 1000).toLocaleString('id-ID')}`;
  return `Rp ${n.toLocaleString('id-ID')}`;
};
const fmtRpFull = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const fmt = (n: number) => n.toLocaleString('id-ID');

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, iconColor, iconBg, label, value, change, up, accent }: {
  icon: any; iconColor: string; iconBg: string; accent?: string;
  label: string; value: string; change: string; up: boolean;
}) {
  return (
    <div className={`bg-white border rounded-xl p-3 flex flex-col gap-2 min-w-0 relative overflow-hidden ${accent ? `border-${accent}-500/30` : 'border-[var(--app-border)]'}`}>
      {accent && <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-${accent}-500 to-transparent`} />}
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
        <p className="text-lg font-black text-[var(--app-text)] mt-0.5 leading-tight">{value}</p>
        <p className="text-[8px] text-[var(--app-muted)] mt-0.5">dari Mei 2026</p>
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

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
          <p className="text-[10px] font-black text-[var(--app-text)] leading-none">{total}</p>
          <p className="text-[6px] text-[var(--app-muted)] font-bold uppercase">{label}</p>
        </div>
      </div>
      <div className="space-y-1 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--app-muted)] truncate flex-1">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold shrink-0">{d.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal Bar ──────────────────────────────────────────────────────────

function HBar({ data, valueKey, labelKey, color = '#3b82f6' }: {
  data: any[]; valueKey: string; labelKey: string; color?: string;
}) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] gap-1.5 items-center">
          <div className="space-y-0.5">
            <div className="flex justify-between text-[8px]">
              <span className="text-[var(--app-muted)] truncate max-w-[140px]">{d[labelKey]}</span>
              <span className="text-[var(--app-text)] font-bold ml-1 shrink-0">{fmt(d[valueKey])}</span>
            </div>
            <div className="h-1.5 bg-[var(--app-border)]/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(d[valueKey] / max) * 100}%`, backgroundColor: color }} />
            </div>
          </div>
          <span className="text-[7px] text-[var(--app-muted)] shrink-0 w-11 text-right">{d.pct}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Tab ────────────────────────────────────────────────────────────────

function TabRingkasan() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tableData.filter(r =>
    r.paket.toLowerCase().includes(search.toLowerCase()) ||
    r.tipe.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <KpiCard icon={Package} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Paket Aktif" value="18.734" change="8.21%" up={true} />
        <KpiCard icon={TrendingUp} iconBg="bg-green-500/10" iconColor="#10b981" label="New Package" value="1.248" change="14.73%" up={true} />
        <KpiCard icon={ArrowUp} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="Upgrade" value="653" change="9.31%" up={true} />
        <KpiCard icon={ArrowDown} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Downgrade" value="421" change="6.28%" up={false} />
        <KpiCard icon={TrendingDown} iconBg="bg-red-500/10" iconColor="#ef4444" label="Churned Package" value="298" change="7.47%" up={false} />
        <KpiCard icon={DollarSign} iconBg="bg-emerald-500/10" iconColor="#10b981" label="Total Revenue" value="Rp 2,845 M" change="12.80%" up={true} />
        <KpiCard icon={Activity} iconBg="bg-orange-500/10" iconColor="#f97316" label="Avg. Revenue per Package" value="Rp 151.839" change="4.58%" up={true} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Top 10 + Revenue Donut + Growth Trend */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top 10 Paket by Customer */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Top 10 Paket by Customer</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>Top 10</option>
                </select>
              </div>
              <HBar data={packageByCustomer} valueKey="value" labelKey="name" color="#3b82f6" />
            </div>

            {/* Revenue by Package */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Revenue by Package</h4>
              <DonutChart data={revenueByPackage} total="Rp 2,845 M" label="Total Revenue" size={130} />
              <div className="space-y-1 mt-1 border-t border-[var(--app-border)] pt-2">
                {revenueByPackage.slice(0, 5).map((d, i) => (
                  <div key={i} className="flex justify-between text-[8px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.pct} — {fmtRpFull(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Growth Trend */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-[var(--app-text)]">Package Growth Trend</h4>
                  <p className="text-[8px] text-[var(--app-muted)]">(6 Bulan Terakhir)</p>
                </div>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-3 text-[7px] font-bold">
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-blue-500 inline-block" /><span className="text-[var(--app-muted)]">Aktif</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-green-400 inline-block" /><span className="text-[var(--app-muted)]">New</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-red-400 inline-block" /><span className="text-[var(--app-muted)]">Churned</span></span>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={growthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Line type="monotone" dataKey="aktif" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="Aktif" />
                  <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2, fill: '#10b981' }} name="New" />
                  <Line type="monotone" dataKey="churned" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 2, fill: '#ef4444' }} name="Churned" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Secondary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { icon: Activity, color: '#3b82f6', bg: 'bg-blue-500/10', label: 'Avg. Tenure (Aktif)', value: '8.7 Bulan', change: '3.12%', up: true },
              { icon: Zap, color: '#8b5cf6', bg: 'bg-purple-500/10', label: 'Utilization Rate (Avg)', value: '62.34%', change: '4.76%', up: true },
              { icon: Target, color: '#10b981', bg: 'bg-green-500/10', label: 'Conversion Rate (New to Active)', value: '87.56%', change: '2.45%', up: true },
              { icon: TrendingDown, color: '#ef4444', bg: 'bg-red-500/10', label: 'Churn Rate', value: '1.32%', change: '0.18%', up: false },
              { icon: DollarSign, color: '#f59e0b', bg: 'bg-yellow-500/10', label: 'Package Lifetime Value (PLTV)', value: 'Rp 1.245.230', change: '6.31%', up: true },
            ].map((k, i) => (
              <div key={i} className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg border ${k.bg}`} style={{ borderColor: k.color + '25' }}>
                    <k.icon size={12} style={{ color: k.color }} />
                  </div>
                  <span className={`text-[7px] font-bold px-1 py-0.5 rounded-full ${k.up ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {k.up ? '▲' : '▼'} {k.change}
                  </span>
                </div>
                <div>
                  <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase leading-tight">{k.label}</p>
                  <p className="text-sm font-black text-[var(--app-text)] mt-0.5 leading-tight">{k.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Table */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Daftar Paket</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                  <input type="text" placeholder="Cari paket..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 w-36" />
                </div>
                <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                  <Filter size={10} /> Filter
                </button>
                <button className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><BarChart2 size={12} /></button>
                <button className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><FileText size={12} /></button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
              <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80 min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Paket</th>
                    <th className="px-3 py-2.5">Tipe Layanan</th>
                    <th className="px-3 py-2.5 text-right">Harga / Bln</th>
                    <th className="px-3 py-2.5 text-right">Pelanggan Aktif</th>
                    <th className="px-3 py-2.5 text-right">New (Bulan Ini)</th>
                    <th className="px-3 py-2.5 text-right">Upgrade</th>
                    <th className="px-3 py-2.5 text-right">Downgrade</th>
                    <th className="px-3 py-2.5 text-right">Churned</th>
                    <th className="px-3 py-2.5 text-right">Revenue</th>
                    <th className="px-3 py-2.5 text-right">Avg. Tenure</th>
                    <th className="px-3 py-2.5 text-right">Churn Rate</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {filtered.map(row => (
                    <tr key={row.no} className="hover:bg-[var(--app-border)]/20 transition-colors">
                      <td className="px-3 py-2.5 text-[var(--app-muted)] font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.paket}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold">{row.tipe}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-white">{fmtRpFull(row.harga)}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-[var(--app-text)]">{fmt(row.pelangganAktif)}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-400">{row.newBulanIni}</td>
                      <td className="px-3 py-2.5 text-right text-blue-400 font-bold">{row.upgrade}</td>
                      <td className="px-3 py-2.5 text-right text-yellow-400 font-bold">{row.downgrade}</td>
                      <td className="px-3 py-2.5 text-right text-red-400 font-bold">{row.churned}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-400">{fmtRpFull(row.revenue)}</td>
                      <td className="px-3 py-2.5 text-right text-[var(--app-text)]/80">{row.avgTenure} Bulan</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={`font-bold text-xs ${row.churnRate < 1.0 ? 'text-green-400' : row.churnRate < 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {row.churnRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-blue-400 transition-colors"><Eye size={11} /></button>
                          <button className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-green-400 transition-colors"><Download size={11} /></button>
                          <button className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] transition-colors"><MoreVertical size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[9px] text-[var(--app-muted)]">Menampilkan 1 - {filtered.length} dari 18.734 data</p>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)]"><ChevronLeft size={11} /></button>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 text-[9px] rounded-md font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                    {p}
                  </button>
                ))}
                <span className="text-gray-600 text-[9px]">...</span>
                <button className="w-10 h-6 text-[9px] rounded-md font-bold bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30">1874</button>
                <button className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)]"><ChevronRight size={11} /></button>
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
          {/* Filter Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Filter Cepat</h4>
            <div className="grid grid-cols-3 gap-1">
              {['7 Hari', '30 Hari', 'Bulan Ini', '3 Bulan', '6 Bulan', 'Tahun Ini'].map((t, i) => (
                <button key={t} className={`text-[8px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center ${i === 4 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { label: 'Area / Region', opt: 'Semua Area' },
                { label: 'Paket', opt: 'Semua Paket' },
                { label: 'Tipe Layanan', opt: 'Semua Tipe' },
                { label: 'Status Paket', opt: 'Semua Status' },
                { label: 'Billing Cycle', opt: 'Semua Billing Cycle' },
              ].map(f => (
                <div key={f.label} className="space-y-0.5">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase">{f.label}</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>{f.opt}</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold py-2 rounded-lg transition-colors">
              Terapkan Filter
            </button>
          </div>

          {/* Aksi Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
            {[
              { label: 'Lihat Detail Paket', icon: Eye, color: 'text-blue-400' },
              { label: 'Download Package List', icon: Download, color: 'text-cyan-400' },
              { label: 'Export Package List (Excel)', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Export Package Revenue (PDF)', icon: FileDown, color: 'text-red-400' },
              { label: 'Export Package Usage', icon: Activity, color: 'text-purple-400' },
              { label: 'Bandingkan Paket', icon: GitCompare, color: 'text-yellow-400' },
            ].map(a => (
              <button key={a.label} className="w-full flex items-center justify-between gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 p-2 rounded-lg text-[8px] font-semibold text-[var(--app-text)]/80 transition-all group">
                <span className="flex items-center gap-2">
                  <a.icon size={11} className={a.color} />
                  <span className="text-left">{a.label}</span>
                </span>
                <ChevronDown size={9} className="text-gray-600 group-hover:text-[var(--app-muted)] -rotate-90 shrink-0" />
              </button>
            ))}
          </div>

          {/* Insight & Rekomendasi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Insight & Rekomendasi</h4>
            <div className="space-y-2">
              {[
                { text: "Paket Premium 100 Mbps memberikan kontribusi revenue tertinggi (35.6%).", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "Paket Promo Gaming mengalami pertumbuhan pelanggan tercepat (↑ 18.21%).", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Churn tertinggi terjadi pada paket Lite 10 Mbps (1.87%).", color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
              ].map((ins, i) => (
                <div key={i} className={`p-2.5 rounded-lg border ${ins.bg}`}>
                  <p className={`text-[8px] font-semibold ${ins.color} leading-relaxed`}>{ins.text}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-[9px] font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 border-t border-[var(--app-border)] pt-2">
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PackageReportPage() {
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
              <span className="text-indigo-400 font-semibold">Laporan Paket Internet</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Popularitas & Profitabilitas Paket Layanan
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Sebaran bandwidth pelanggan (20M, 50M, 100M+), kontribusi pendapatan per paket, dan tren upgrade paket.
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
                    <button key={e.label} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-[var(--app-text)]/80 hover:bg-[var(--app-border)]/30">
                      <e.icon size={12} className={e.color} />{e.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Calendar size={11} className="text-blue-400" /> Jadwalkan Laporan
            </button>
            <button className="p-1.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]"><MoreVertical size={13} /></button>
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
            { label: 'Area / Region', opt: 'Semua Area' },
            { label: 'Paket', opt: 'Semua Paket' },
            { label: 'Status Paket', opt: 'Semua Status' },
            { label: 'Tipe Layanan', opt: 'Semua Tipe' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase px-0.5">{f.label}</span>
              <select className="bg-[var(--app-card)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 transition-colors">
                <option>{f.opt}</option>
              </select>
            </div>
          ))}
          <div className="flex gap-1.5 self-end">
            <button className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs">
              <Filter size={12} /> Filter Lainnya
            </button>
            <button className="text-xs font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-2.5 py-1.5 border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-card-subtle)] bg-[var(--app-card)] transition-colors shadow-xs">
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
