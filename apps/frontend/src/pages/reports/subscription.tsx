import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  Users, DollarSign, Eye, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight,
  ArrowDown, ArrowUp, Activity, Zap, AlertTriangle, Clock, Send
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const growthTrend = [
  { month: 'Jan', total: 9800, new: 680, canceled: 220 },
  { month: 'Feb', total: 10500, new: 820, canceled: 195 },
  { month: 'Mar', total: 11200, new: 910, canceled: 240 },
  { month: 'Apr', total: 11900, new: 780, canceled: 210 },
  { month: 'Mei', total: 12450, new: 860, canceled: 180 },
  { month: 'Jun', total: 12845, new: 568, canceled: 171 },
];

const statusData = [
  { name: 'Aktif', value: 11399, pct: '88.75%', color: '#10b981' },
  { name: 'Nonaktif', value: 786, pct: '6.12%', color: '#6b7280' },
  { name: 'Suspend', value: 443, pct: '3.45%', color: '#f59e0b' },
  { name: 'Expired', value: 217, pct: '1.70%', color: '#ef4444' },
];

const paketData = [
  { name: 'Premium 100 Mbps', value: 4530, pct: '35.24%', color: '#3b82f6' },
  { name: 'Standar 50 Mbps', value: 4119, pct: '32.05%', color: '#10b981' },
  { name: 'Basic 20 Mbps', value: 2658, pct: '20.71%', color: '#8b5cf6' },
  { name: 'Promo Gaming', value: 928, pct: '7.23%', color: '#f59e0b' },
  { name: 'Lainnya', value: 610, pct: '4.77%', color: '#6b7280' },
];

const activeVsInactive = [
  { name: 'Premium', aktif: 4200, nonaktif: 330 },
  { name: 'Standar', aktif: 3900, nonaktif: 219 },
  { name: 'Basic', aktif: 2400, nonaktif: 258 },
  { name: 'Promo', aktif: 850, nonaktif: 78 },
  { name: 'Lite', aktif: 1080, nonaktif: 65 },
  { name: 'UMKM', aktif: 700, nonaktif: 85 },
  { name: 'Residens.', aktif: 380, nonaktif: 45 },
  { name: 'Lainnya', aktif: 200, nonaktif: 38 },
];

const tableData = [
  { no: 1, noLayanan: 'SUB/2025/06/00001', customer: 'PT. Maju Bersama', paket: 'Premium 100 Mbps', type: 'Internet', tanggalAktif: '01/01/2026', tanggalExpired: '01/01/2026', status: 'Aktif', tenure: '6 Bulan', billingCycle: 'Bulanan', tagihan: 1200000 },
  { no: 2, noLayanan: 'SUB/2025/06/00002', customer: 'Budi Santoso', paket: 'Standar 50 Mbps', type: 'Internet', tanggalAktif: '15/12/2025', tanggalExpired: '15/07/2026', status: 'Aktif', tenure: '7 Bulan', billingCycle: 'Bulanan', tagihan: 350000 },
  { no: 3, noLayanan: 'SUB/2025/06/00003', customer: 'CV. Sejahtera', paket: 'Basic 20 Mbps', type: 'Internet', tanggalAktif: '10/05/2026', tanggalExpired: '10/06/2026', status: 'Expiring Soon', tenure: '1 Bulan', billingCycle: 'Bulanan', tagihan: 220000 },
  { no: 4, noLayanan: 'SUB/2025/06/00004', customer: 'Andi Wijaya', paket: 'Promo Gaming', type: 'Internet', tanggalAktif: '05/04/2026', tanggalExpired: '05/07/2026', status: 'Aktif', tenure: '2 Bulan', billingCycle: 'Bulanan', tagihan: 180000 },
  { no: 5, noLayanan: 'SUB/2025/06/00005', customer: 'Siti Nurhaliza', paket: 'Bisnis 100 Mbps', type: 'Internet', tanggalAktif: '20/03/2026', tanggalExpired: '20/06/2026', status: 'Aktif', tenure: '3 Bulan', billingCycle: 'Bulanan', tagihan: 750000 },
  { no: 6, noLayanan: 'SUB/2025/06/00006', customer: 'PT. Digital Solusi', paket: 'Premium 100 Mbps', type: 'Internet', tanggalAktif: '01/02/2026', tanggalExpired: '01/08/2026', status: 'Aktif', tenure: '4 Bulan', billingCycle: 'Bulanan', tagihan: 1200000 },
  { no: 7, noLayanan: 'SUB/2025/06/00007', customer: 'Rina Kartika', paket: 'Lite 10 Mbps', type: 'Internet', tanggalAktif: '28/05/2026', tanggalExpired: '28/06/2026', status: 'Expiring Soon', tenure: '1 Bulan', billingCycle: 'Bulanan', tagihan: 150000 },
  { no: 8, noLayanan: 'SUB/2025/06/00008', customer: 'Dewi Lestari', paket: 'Standar 50 Mbps', type: 'Internet', tanggalAktif: '18/01/2026', tanggalExpired: '18/07/2026', status: 'Aktif', tenure: '5 Bulan', billingCycle: 'Bulanan', tagihan: 350000 },
];

const SUB_TABS = [
  'Ringkasan', 'Subscription List', 'Subscription Growth', 'Active vs Inactive',
  'Renewal Forecast', 'Expiring Soon', 'Upgrade / Downgrade',
  'Churn & Cancellation', 'Tenure Analysis'
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const fmt = (n: number) => n.toLocaleString('id-ID');

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Aktif': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Expiring Soon': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Nonaktif': 'bg-gray-500/10 text-[var(--app-muted)] border-gray-500/20',
    'Suspend': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Expired': 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${map[status] ?? 'bg-gray-500/10 text-[var(--app-muted)] border-gray-500/20'}`}>
      {status}
    </span>
  );
}

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
        <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase tracking-wider leading-tight">{label}</p>
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
      <div className="space-y-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--app-muted)] truncate flex-1">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold shrink-0">{d.pct}</span>
            <span className="text-[var(--app-muted)] shrink-0 w-10 text-right">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Alert Card ──────────────────────────────────────────────────────────────

function AlertCard({ icon: Icon, color, bg, border, label, value, sub }: {
  icon: any; color: string; bg: string; border: string;
  label: string; value: string; sub: string;
}) {
  return (
    <div className={`bg-white border ${border} rounded-xl p-4 space-y-2`}>
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon size={14} className={color} />
        </div>
        <p className="text-[9px] text-[var(--app-muted)] font-bold">{label}</p>
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-[8px] text-[var(--app-muted)]">{sub}</p>
      <button onClick={() => alert("Menampilkan detail metrik dan data historis terkait.")} className="text-[8px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
        Lihat Detail <ArrowUpRight size={9} />
      </button>
    </div>
  );
}

// ─── Main Tab ────────────────────────────────────────────────────────────────

function TabRingkasan() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tableData.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.paket.toLowerCase().includes(search.toLowerCase()) ||
    r.noLayanan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <KpiCard icon={Activity} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Subscription Aktif" value="12.845" change="7.81%" up={true} />
        <KpiCard icon={TrendingUp} iconBg="bg-green-500/10" iconColor="#10b981" label="New Subscription" value="568" change="15.40%" up={true} />
        <KpiCard icon={TrendingDown} iconBg="bg-red-500/10" iconColor="#ef4444" label="Cancelled Subscription" value="171" change="12.53%" up={false} />
        <KpiCard icon={AlertTriangle} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Expired Subscription" value="93" change="8.82%" up={false} />
        <KpiCard icon={ArrowUp} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="Upgrade" value="352" change="18.67%" up={true} />
        <KpiCard icon={ArrowDown} iconBg="bg-orange-500/10" iconColor="#f97316" label="Downgrade" value="147" change="5.13%" up={false} />
        <KpiCard icon={Clock} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="Avg. Tenure (Aktif)" value="18.7 Bulan" change="5.12%" up={true} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Growth + Status Donut + Paket Donut + Active vs Inactive */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Pertumbuhan Subscription */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-[var(--app-text)]">Pertumbuhan Subscription</h4>
                </div>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-3 text-[7px] font-bold flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-blue-500 inline-block" /><span className="text-[var(--app-muted)]">Total Aktif</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-green-400 inline-block" /><span className="text-[var(--app-muted)]">New</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-red-400 inline-block" /><span className="text-[var(--app-muted)]">Canceled</span></span>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={growthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="Total Aktif" />
                  <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2, fill: '#10b981' }} name="New" />
                  <Line type="monotone" dataKey="canceled" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 2, fill: '#ef4444' }} name="Canceled" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Subscription by Status */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Subscription by Status</h4>
              <DonutChart data={statusData} total="12.845" label="Total Aktif" size={120} />
            </div>

            {/* Subscription by Paket */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Subscription by Paket</h4>
              <DonutChart data={paketData} total="12.845" label="Total Aktif" size={120} />
            </div>

            {/* Active vs Inactive */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Active vs Inactive</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>Top 10 Paket</option>
                </select>
              </div>
              <div className="flex gap-2 text-[7px] font-bold">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-teal-400 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Aktif</span></span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-gray-500 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Nonaktif</span></span>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={activeVsInactive} barSize={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Bar dataKey="aktif" fill="#2dd4bf" radius={[2, 2, 0, 0]} name="Aktif" />
                  <Bar dataKey="nonaktif" fill="#4b5563" radius={[2, 2, 0, 0]} name="Nonaktif" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Alert cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <AlertCard icon={AlertTriangle} color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/20"
              label="Subscription Expiring Soon" value="217"
              sub="Akan berakhir dalam 7 hari ke depan" />
            <AlertCard icon={Clock} color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/20"
              label="Subscription Expiring This Month" value="786"
              sub="Akan berakhir dalam bulan ini" />
            <AlertCard icon={RefreshCw} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20"
              label="Renewal Forecast (Next 30 Days)" value="3.245"
              sub="Estimasi akan memperbarui dalam 30 hari" />
            <AlertCard icon={TrendingDown} color="text-red-400" bg="bg-red-500/10" border="border-red-500/20"
              label="Churn Rate (This Month)" value="1.32%"
              sub="% pelanggan yang churn bulan ini" />
          </div>

          {/* Detail Table */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Daftar Subscription</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                  <input type="text" placeholder="Cari customer, nomor layanan, paket..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 w-48" />
                </div>
                <button onClick={() => alert("Penyaringan data tabel diterapkan.")} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                  <Filter size={10} /> Filter
                </button>
                <button onClick={() => alert("Beralih ke visualisasi diagram batang / analitik visual.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><BarChart2 size={12} /></button>
                <button onClick={() => alert("Beralih ke tampilan mode tabel ringkas.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"><FileText size={12} /></button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
              <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80 min-w-[1050px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">No. Layanan</th>
                    <th className="px-3 py-2.5">Customer</th>
                    <th className="px-3 py-2.5">Paket</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Tanggal Aktif</th>
                    <th className="px-3 py-2.5">Tanggal Expired</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Tenure</th>
                    <th className="px-3 py-2.5">Billing Cycle</th>
                    <th className="px-3 py-2.5 text-right">Tagihan/Bulan</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {filtered.map(row => (
                    <tr key={row.no} className="hover:bg-[var(--app-border)]/20 transition-colors">
                      <td className="px-3 py-2.5 text-[var(--app-muted)] font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 font-mono text-blue-400 text-[8px]">{row.noLayanan}</td>
                      <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.customer}</td>
                      <td className="px-3 py-2.5 text-[var(--app-text)]/80">{row.paket}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold">{row.type}</span>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--app-muted)]">{row.tanggalAktif}</td>
                      <td className="px-3 py-2.5 text-[var(--app-muted)]">{row.tanggalExpired}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={row.status} /></td>
                      <td className="px-3 py-2.5 text-[var(--app-muted)]">{row.tenure}</td>
                      <td className="px-3 py-2.5 text-[var(--app-muted)]">{row.billingCycle}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-400">{fmtRp(row.tagihan)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => alert("Menampilkan detail catatan lengkap transaksi / layanan ini.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-blue-400 transition-colors"><Eye size={11} /></button>
                          <button onClick={() => alert("Mengunduh berkas bukti laporan untuk baris terpilih...")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-green-400 transition-colors"><Download size={11} /></button>
                          <button onClick={() => alert("Opsi tindakan: Kirim WhatsApp, Cetak Salinan, Lihat Log Audit.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] transition-colors"><MoreVertical size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[9px] text-[var(--app-muted)]">Menampilkan 1 - {filtered.length} dari 12.845 data</p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => alert("Kembali ke halaman sebelumnya.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)]"><ChevronLeft size={11} /></button>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 text-[9px] rounded-md font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                    {p}
                  </button>
                ))}
                <span className="text-gray-600 text-[9px]">...</span>
                <button onClick={() => alert("Beralih ke halaman akhir.")} className="w-10 h-6 text-[9px] rounded-md font-bold bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30">1605</button>
                <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)]"><ChevronRight size={11} /></button>
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
                <button key={t} onClick={() => alert(`Memfilter periode data: ${t}`)} className={`text-[8px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center ${i === 4 ? "bg-blue-600 border-blue-500 text-white" : "bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Status checkboxes */}
            <div className="space-y-1">
              <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">Status Subscription</p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: 'Aktif', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                  { label: 'Nonaktif', color: 'text-[var(--app-muted)]', bg: 'bg-gray-500/10 border-gray-500/20' },
                  { label: 'Suspend', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                  { label: 'Expired', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                ].map(s => (
                  <label key={s.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[8px] font-bold cursor-pointer ${s.bg} ${s.color}`}>
                    <input type="checkbox" className="accent-blue-500 w-2.5 h-2.5" defaultChecked />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Semua Paket', opt: 'Semua Paket' },
                { label: 'Semua Tipe Subscription', opt: 'Semua Tipe Subscription' },
                { label: 'Semua Area / Region', opt: 'Semua Area / Region' },
                { label: 'Semua Billing Cycle', opt: 'Semua Billing Cycle' },
              ].map(f => (
                <select key={f.label} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                  <option>{f.opt}</option>
                </select>
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
              { label: 'Lihat Detail Subscription', icon: Eye, color: 'text-blue-400' },
              { label: 'Download Subscription List', icon: Download, color: 'text-cyan-400' },
              { label: 'Export Subscription List (Excel)', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Export Subscription List (PDF)', icon: FileDown, color: 'text-red-400' },
              { label: 'Kirim Reminder Expiring', icon: Send, color: 'text-orange-400' },
              { label: 'Kirim Penawaran Renewal', icon: RefreshCw, color: 'text-purple-400' },
            ].map(a => (
              <button key={a.label} onClick={() => { if (a.label.includes("PDF")) { window.print(); } else { alert(`Aksi ${a.label} berhasil dieksekusi.`); } }} className="w-full flex items-center justify-between gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 p-2 rounded-lg text-[8px] font-semibold text-[var(--app-text)]/80 transition-all group">
                <span className="flex items-center gap-2">
                  <a.icon size={11} className={a.color} />
                  <span className="text-left">{a.label}</span>
                </span>
                <ChevronDown size={9} className="text-gray-600 -rotate-90 shrink-0" />
              </button>
            ))}
          </div>

          {/* Insight & Rekomendasi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Insight & Rekomendasi</h4>
            <div className="space-y-2">
              {[
                { text: "217 subscription akan berakhir dalam 7 hari ke depan. Segera hubungi pelanggan!", color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                { text: "Paket Premium memiliki churn rate terendah (0.98%). Dorong migrasi ke Premium.", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "Renewal forecast 30 hari ke depan sebesar Rp 3.245.000.000.", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Fokus pada paket Basic yang memiliki churn rate tertinggi (1.87%).", color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
              ].map((ins, i) => (
                <div key={i} className={`p-2.5 rounded-lg border ${ins.bg}`}>
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubscriptionReportPage() {
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
              <span className="text-indigo-400 font-semibold">Laporan Langganan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Siklus Berlangganan & Status Kontrak
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Monitoring masa aktif kontrak pelanggan korporat, perpanjangan otomatis, dan status grace period isolir.
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
            { label: 'Area / Region', opt: 'Semua Area' },
            { label: 'Paket', opt: 'Semua Paket' },
            { label: 'Status', opt: 'Semua Status' },
            { label: 'Tipe Subscription', opt: 'Semua Tipe' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase px-0.5">{f.label}</span>
              <select className="bg-[var(--app-card)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 transition-colors">
                <option>{f.opt}</option>
              </select>
            </div>
          ))}
          <div className="flex gap-1.5 self-end">
            <button onClick={() => alert("Fitur filter kustom (berdasarkan status paket, zona ODP, dan sales rep) sedang aktif.")} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs">
              <Filter size={12} /> Filter Lainnya
            </button>
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
