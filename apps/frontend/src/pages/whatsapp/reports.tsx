import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ReportSubTabDetail from '@/components/ReportSubTabDetail';
import {
  Search, Filter, Eye, Download, Calendar, Bell, Mail, FileText,
  Clock, CheckCircle, XCircle, ArrowUpRight, TrendingUp, MessageSquare,
  Send, RefreshCw, Users, ChevronLeft, ChevronRight, FileSpreadsheet,
  FileDown, MoreVertical, MessageCircle, Zap, BarChart2, Activity,
  Info, ChevronDown, Share2, Settings
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const trendData = [
  { month: 'Jan', terkirim: 32000, diterima: 28000, dibaca: 24000, dibalas: 6200 },
  { month: 'Feb', terkirim: 38000, diterima: 33000, dibaca: 28500, dibalas: 7400 },
  { month: 'Mar', terkirim: 29000, diterima: 25500, dibaca: 21000, dibalas: 5800 },
  { month: 'Apr', terkirim: 41000, diterima: 36500, dibaca: 31000, dibalas: 8600 },
  { month: 'Mei', terkirim: 36500, diterima: 32000, dibaca: 27800, dibalas: 7900 },
  { month: 'Jun', terkirim: 48765, diterima: 42328, dibaca: 37205, dibalas: 8945 },
];

const responseRateData = [
  { month: 'Jan', rate: 18.2 },
  { month: 'Feb', rate: 19.5 },
  { month: 'Mar', rate: 17.8 },
  { month: 'Apr', rate: 22.1 },
  { month: 'Mei', rate: 20.5 },
  { month: 'Jun', rate: 21.1 },
];

const statusDistData = [
  { name: 'Terkirim Sukses', value: 45612, color: '#3b82f6', pct: '93.53%' },
  { name: 'Dibaca', value: 37205, color: '#10b981', pct: '76.32%' },
  { name: 'Diterima', value: 42328, color: '#f59e0b', pct: '86.82%' },
  { name: 'Dibalas', value: 8945, color: '#8b5cf6', pct: '18.34%' },
  { name: 'Gagal Terkirim', value: 3153, color: '#ef4444', pct: '6.47%' },
];

const channelData = [
  { name: 'WhatsApp Center 1', value: 18241, pct: '37.41%', color: '#3b82f6' },
  { name: 'WhatsApp Center 2', value: 14320, pct: '29.38%', color: '#10b981' },
  { name: 'WhatsApp Center 3', value: 11880, pct: '24.37%', color: '#f59e0b' },
  { name: 'WhatsApp Center 4', value: 4324, pct: '8.87%', color: '#8b5cf6' },
];

const campaignData = [
  { name: 'Promo Internet 2026', value: 12845 },
  { name: 'Pengingat Pembayaran', value: 9632 },
  { name: 'Pelanggan Baru', value: 7845 },
  { name: 'Upgrade Paket', value: 6215 },
  { name: 'Survey Kepuasan', value: 4876 },
];

const messagetypeData = [
  { name: 'Text', value: 28765, pct: '58.99%', color: '#3b82f6' },
  { name: 'Image', value: 10235, pct: '20.99%', color: '#10b981' },
  { name: 'Document', value: 4325, pct: '8.87%', color: '#f59e0b' },
  { name: 'Video', value: 3210, pct: '6.58%', color: '#8b5cf6' },
  { name: 'Audio', value: 2230, pct: '4.57%', color: '#ef4444' },
];

// Heatmap: days x time slots
const heatmapDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const heatmapSlots = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'];
const heatmapValues = [
  [1, 2, 8, 6, 7, 3, 2],
  [2, 3, 9, 7, 8, 4, 2],
  [5, 9, 10, 10, 9, 5, 3],
  [6, 10, 9, 8, 8, 6, 3],
  [4, 8, 8, 7, 7, 5, 2],
  [1, 2, 3, 3, 2, 1, 1],
];

const tableData = [
  { no: 1, channel: 'WhatsApp Center 1', number: '62812345678901', campaign: 'Promo Internet 2026', terkirim: 12845, sukses: 12125, diterima: 11230, dibaca: 9875, dibalas: 2456, responseRate: '22.53%', readRate: '87.94%', gagal: 720 },
  { no: 2, channel: 'WhatsApp Center 2', number: '62812345678911', campaign: 'Pengingat Pembayaran', terkirim: 9632, sukses: 9102, diterima: 8456, dibaca: 7210, dibalas: 1852, responseRate: '21.90%', readRate: '85.27%', gagal: 530 },
  { no: 3, channel: 'WhatsApp Center 3', number: '62812345678921', campaign: 'Pelanggan Baru', terkirim: 7845, sukses: 7256, diterima: 6543, dibaca: 5875, dibalas: 1325, responseRate: '20.25%', readRate: '89.34%', gagal: 589 },
  { no: 4, channel: 'WhatsApp Center 4', number: '62812345678931', campaign: 'Upgrade Paket', terkirim: 6215, sukses: 5845, diterima: 5132, dibaca: 4325, dibalas: 1102, responseRate: '21.45%', readRate: '84.27%', gagal: 370 },
  { no: 5, channel: 'WhatsApp Center 1', number: '62812345678901', campaign: 'Survey Kepuasan', terkirim: 4876, sukses: 4652, diterima: 3987, dibaca: 3250, dibalas: 1210, responseRate: '24.56%', readRate: '81.56%', gagal: 224 },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const KpiCard = ({ icon: Icon, iconBg, iconColor, label, value, change, changeColor }: any) => (
  <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3 flex flex-col gap-1.5 min-w-0">
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-lg ${iconBg} border`} style={{ borderColor: iconColor + '30' }}>
        <Icon size={14} style={{ color: iconColor }} />
      </div>
      <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-wide leading-tight">{label}</p>
    </div>
    <p className="text-xl font-black text-[var(--app-text)] leading-none">{value}</p>
    <p className={`text-[9px] font-semibold ${changeColor}`}>{change}</p>
  </div>
);

const DonutChart = ({ data, total, label }: { data: { value: number; color: string; name: string; pct: string }[]; total: string; label: string }) => {
  const totalVal = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const R = 15.915;
  const circumference = 2 * Math.PI * R;
  const arcs = data.map(d => {
    const frac = d.value / totalVal;
    const arc = {
      ...d,
      strokeDasharray: `${frac * circumference} ${(1 - frac) * circumference}`,
      strokeDashoffset: -offset * circumference,
    };
    offset += frac;
    return arc;
  });

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <svg width="80" height="80" viewBox="0 0 42 42" className="transform -rotate-90">
          <circle cx="21" cy="21" r={R} fill="transparent" stroke="#101935" strokeWidth="5" />
          {arcs.map((a, i) => (
            <circle key={i} cx="21" cy="21" r={R} fill="transparent" stroke={a.color} strokeWidth="5"
              strokeDasharray={a.strokeDasharray} strokeDashoffset={a.strokeDashoffset} />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs font-black text-[var(--app-text)] leading-none">{total}</p>
          <p className="text-[6px] text-[var(--app-muted)] font-bold uppercase">{label}</p>
        </div>
      </div>
      <div className="space-y-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[8px] text-[var(--app-muted)] leading-none">{d.name}</span>
            <span className="text-[8px] text-[var(--app-text)] font-bold ml-auto pl-2">{d.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HorizontalBar = ({ data }: { data: { name: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="space-y-0.5">
          <div className="flex justify-between text-[9px]">
            <span className="text-[var(--app-muted)] truncate">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold ml-2 shrink-0">{d.value.toLocaleString()} ({Math.round(d.value / max * 100)}%)</span>
          </div>
          <div className="h-1.5 bg-[var(--app-border)]/20 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const Heatmap = () => {
  const maxVal = 10;
  const getColor = (v: number) => {
    const intensity = v / maxVal;
    if (intensity < 0.2) return '#0d1e3a';
    if (intensity < 0.4) return '#1e3a6b';
    if (intensity < 0.6) return '#1d4ed8';
    if (intensity < 0.8) return '#3b82f6';
    return '#60a5fa';
  };
  return (
    <div className="overflow-x-auto">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `40px repeat(${heatmapDays.length}, 1fr)` }}>
        <div />
        {heatmapDays.map(d => (
          <div key={d} className="text-center text-[8px] text-[var(--app-muted)] font-bold pb-1">{d}</div>
        ))}
        {heatmapSlots.map((slot, si) => (
          <React.Fragment key={slot}>
            <div className="text-[8px] text-[var(--app-muted)] font-bold flex items-center pr-1 justify-end">{slot}</div>
            {heatmapValues[si].map((val, di) => (
              <div key={di} className="h-5 rounded-sm transition-all hover:scale-110 cursor-default"
                style={{ backgroundColor: getColor(val) }}
                title={`${heatmapDays[di]} ${slot}: ${val * 10}%`} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[8px] text-[var(--app-muted)]">Rendah</span>
        {['#0d1e3a', '#1e3a6b', '#1d4ed8', '#3b82f6', '#60a5fa'].map(c => (
          <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[8px] text-[var(--app-muted)]">Tinggi</span>
      </div>
    </div>
  );
};

// ─── Sub-Tab Content: Ringkasan (Main Dashboard) ─────────────────────────────

function TabRingkasan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const totalPages = 5;

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <KpiCard icon={Send} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Pesan Terkirim" value="48.765" change="▲ 18.25% dari Mei 2026" changeColor="text-green-400" />
        <KpiCard icon={CheckCircle} iconBg="bg-green-500/10" iconColor="#10b981" label="Pesan Terkirim Sukses" value="45.612" change="▲ 17.01% dari Mei 2026" changeColor="text-green-400" />
        <KpiCard icon={MessageSquare} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Pesan Diterima" value="42.328" change="▲ 16.07% dari Mei 2026" changeColor="text-green-400" />
        <KpiCard icon={Eye} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="Pesan Dibaca" value="37.205" change="▲ 30.13% dari Mei 2026" changeColor="text-green-400" />
        <KpiCard icon={TrendingUp} iconBg="bg-indigo-500/10" iconColor="#6366f1" label="Tingkat Dibaca" value="87.89%" change="▲ 2.45% dari Mei 2026" changeColor="text-green-400" />
        <KpiCard icon={MessageCircle} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="Balasan Diterima" value="8.945" change="▲ 35.10% dari Mei 2026" changeColor="text-green-400" />
        <KpiCard icon={Activity} iconBg="bg-orange-500/10" iconColor="#f97316" label="Response Rate" value="21.10%" change="▲ 1.18% dari Mei 2026" changeColor="text-green-400" />
        <KpiCard icon={XCircle} iconBg="bg-red-500/10" iconColor="#ef4444" label="Gagal Terkirim" value="3.153" change="▼ 46.02% dari Mei 2026" changeColor="text-red-400" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Charts + Table */}
        <div className="lg:col-span-9 space-y-4">
          {/* Row 1: Line, Donut Status, Response Rate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tren Pesan */}
            <div className="md:col-span-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-[var(--app-text)]">Tren Pesan (6 Bulan Terakhir)</h4>
                </div>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] py-1 px-2 rounded-lg text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 10 }} />
                  <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="terkirim" name="Terkirim" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="diterima" name="Diterima" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="dibaca" name="Dibaca" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="dibalas" name="Dibalas" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribusi Status Pesan */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Distribusi Status Pesan</h4>
              <DonutChart data={statusDistData} total="48.765" label="Total Pesan" />
              <div className="space-y-1 mt-2">
                {statusDistData.map((d, i) => (
                  <div key={i} className="flex justify-between text-[9px]">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.value.toLocaleString()} ({d.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Tingkat Respons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Tingkat Respons (Response Rate)</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] py-1 px-2 rounded-lg text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={110}>
                <LineChart data={responseRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 10 }} formatter={(v: any) => [`${v}%`, 'Response Rate']} />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pesan per Channel */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Pesan per Channel / Nomor</h4>
              <DonutChart data={channelData} total="48.765" label="Total Pesan" />
            </div>

            {/* Pesan per Campaign */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Pesan per Campaign (Top 5)</h4>
                <span className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">Top 5</span>
              </div>
              <HorizontalBar data={campaignData} />
            </div>
          </div>

          {/* Row 3: Heatmap + Message Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Distribusi Waktu Pengiriman</h4>
              <Heatmap />
            </div>

            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Tipe Pesan</h4>
              <DonutChart data={messagetypeData} total="48.765" label="Total Pesan" />
            </div>
          </div>

          {/* Detail Table */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Detail Performa WhatsApp</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                  <input type="text" placeholder="Cari campaign, nomor, agent..."
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-8 pr-3 py-1.5 rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none focus:border-blue-500 w-48 transition-colors" />
                </div>
                <button onClick={() => alert("Penyaringan data diterapkan berdasarkan parameter yang dipilih.")} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                  <Filter size={11} /> Filter
                </button>
                <button onClick={() => alert("Beralih ke mode visualisasi grafik / diagram analitik.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]">
                  <BarChart2 size={14} />
                </button>
                <button onClick={() => alert("Beralih ke tampilan tabel ringkas.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]">
                  <FileText size={14} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
              <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80 min-w-[900px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Channel / Nomor</th>
                    <th className="px-3 py-2.5">Campaign</th>
                    <th className="px-3 py-2.5 text-center">Pesan Terkirim</th>
                    <th className="px-3 py-2.5 text-center">Terkirim Sukses</th>
                    <th className="px-3 py-2.5 text-center">Diterima</th>
                    <th className="px-3 py-2.5 text-center">Dibaca</th>
                    <th className="px-3 py-2.5 text-center">Dibalas</th>
                    <th className="px-3 py-2.5 text-center">Response Rate</th>
                    <th className="px-3 py-2.5 text-center">Read Rate</th>
                    <th className="px-3 py-2.5 text-center">Gagal Terkirim</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {tableData.map((row) => (
                    <tr key={row.no} className="hover:bg-[var(--app-border)]/20 transition-colors">
                      <td className="px-3 py-2.5 text-[var(--app-muted)] font-bold">{row.no}</td>
                      <td className="px-3 py-2.5">
                        <p className="text-[var(--app-text)] font-bold leading-none">{row.channel}</p>
                        <p className="text-[8px] text-[var(--app-muted)] mt-0.5">{row.number}</p>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--app-text)]/80">{row.campaign}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-[var(--app-text)]">{row.terkirim.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-center text-[var(--app-muted)]">{row.sukses.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-center text-[var(--app-muted)]">{row.diterima.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-center text-[var(--app-muted)]">{row.dibaca.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-center text-[var(--app-muted)]">{row.dibalas.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-green-400">{row.responseRate}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-blue-400">{row.readRate}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-red-400">{row.gagal.toLocaleString()}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => alert("Melihat detail pesan WhatsApp.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-blue-400 transition-colors" title="Lihat Detail">
                            <Eye size={12} />
                          </button>
                          <button onClick={() => alert("Mengunduh lampiran pesan WhatsApp...")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] hover:text-green-400 transition-colors" title="Download">
                            <Download size={12} />
                          </button>
                          <button onClick={() => alert("Opsi tindakan pesan: Teruskan, Hapus, Jadwalkan Ulang.")} className="p-1 hover:bg-[var(--app-border)]/30 rounded text-[var(--app-muted)] transition-colors" title="Lainnya">
                            <MoreVertical size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-[9px] text-[var(--app-muted)]">Menampilkan 1 - 5 dari 24 data</p>
              <div className="flex items-center gap-2">
                <button onClick={() => alert("Kembali ke halaman sebelumnya.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30">
                  <ChevronLeft size={12} />
                </button>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 text-[9px] rounded-md font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-border)]/30">
                  <ChevronRight size={12} />
                </button>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] py-1.5 px-2 rounded-lg text-[var(--app-text)]/80 focus:outline-none">
                  <option>10 / halaman</option>
                  <option>25 / halaman</option>
                  <option>50 / halaman</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Filter Cepat</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {['7 Hari', '30 Hari', 'Bulan Ini', '3 Bulan', '6 Bulan', 'Tahun Ini'].map((t, i) => (
                <button key={t} onClick={() => alert(`Memfilter periode: ${t}`)} className={`text-[9px] font-bold py-1.5 px-2 rounded-lg border transition-all ${i === 4 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Channel / Nomor', opt: 'Semua Nomor' },
                { label: 'Campaign', opt: 'Semua Campaign' },
                { label: 'Area / Region', opt: 'Semua Area' },
                { label: 'CS / Agent', opt: 'Semua Agent' },
                { label: 'Status Pesan', opt: 'Semua Status' },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase">{f.label}</span>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                    <option>{f.opt}</option>
                  </select>
                </div>
              ))}
            </div>
            <button onClick={() => alert("Filter laporan WhatsApp berhasil diterapkan.")} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 rounded-lg transition-colors">
              Terapkan Filter
            </button>
          </div>

          {/* Aksi Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h4>
            <div className="space-y-1.5">
              {[
                { label: 'Lihat Detail Pesan', icon: Eye, color: 'text-blue-400' },
                { label: 'Export WhatsApp Report (Excel)', icon: FileSpreadsheet, color: 'text-green-400' },
                { label: 'Export WhatsApp Report (PDF)', icon: FileDown, color: 'text-red-400' },
                { label: 'Download Chat History', icon: Download, color: 'text-yellow-400' },
                { label: 'Template Message Report', icon: FileText, color: 'text-purple-400' },
                { label: 'Auto Reply Report', icon: Zap, color: 'text-cyan-400' },
              ].map(a => (
                <button key={a.label} onClick={() => { if (a.label.includes("PDF")) { window.print(); } else { alert(`Aksi ${a.label} berhasil dieksekusi.`); } }} className="w-full flex items-center justify-between gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 p-2.5 rounded-lg text-[9px] font-semibold text-[var(--app-text)]/80 transition-all group">
                  <span className="flex items-center gap-2">
                    <a.icon size={12} className={a.color} />
                    {a.label}
                  </span>
                  <ChevronDown size={10} className="text-gray-600 group-hover:text-[var(--app-muted)] -rotate-90" />
                </button>
              ))}
            </div>
          </div>

          {/* Insight & Rekomendasi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Insight & Rekomendasi</h4>
            <div className="space-y-2.5">
              {[
                { text: 'Tingkat dibaca naik 2.45% dibanding periode sebelumnya.', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: 'Campaign "Promo Internet" memberikan response rate tertinggi (22.53%).', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: 'Waktu terbaik untuk mengirim pesan adalah pk 10.00-12.00.', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
              ].map((ins, i) => (
                <div key={i} className={`p-2.5 rounded-lg border ${ins.bg}`}>
                  <p className={`text-[9px] font-semibold ${ins.color} leading-relaxed`}>{ins.text}</p>
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

// ─── Placeholder Tab ─────────────────────────────────────────────────────────

// TabPlaceholder replaced by ReportSubTabDetail

// ─── Main Page ────────────────────────────────────────────────────────────────

const SUB_TABS = [
  'Ringkasan', 'Pesan', 'Interaksi', 'Kontak / Leads', 'Campaign',
  'Template Message', 'Auto Reply', 'CS Performance', 'Distribusi Waktu',
  'Sentiment Analysis', 'Activity Log'
];

export default function WhatsappReportsPage() {
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showExport, setShowExport] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">

        {/* ─── Swiss B2B Reports Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-emerald-500 font-semibold">Laporan Trafik WhatsApp</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Analitik Pengiriman Pesan & Delivery Telemetry
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Statistik pengiriman broadcast, status pesan (Sent, Delivered, Read), response time CS, dan jam sibuk trafik.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/whatsapp/campaigns"
              className="px-3 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/20 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all"
            >
              Semua Kampanye
            </Link>
          </div>
        </div>

        {/* ─── Action Buttons Row ───────────────────────────────────────── */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            {/* Export dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExport(v => !v)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                <Download size={12} /> Export <ChevronDown size={10} className={`transition-transform ${showExport ? 'rotate-180' : ''}`} />
              </button>
              {showExport && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xl overflow-hidden w-40">
                  {[
                    { label: 'Export PDF', icon: FileDown, color: 'text-red-400' },
                    { label: 'Export Excel', icon: FileSpreadsheet, color: 'text-green-400' },
                    { label: 'Export CSV', icon: Download, color: 'text-blue-400' },
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
            <button onClick={() => alert("Opsi Laporan: Salin Link URL, Cetak Layar Penuh, Sinkronisasi Cloud Drive.")} className="p-1.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]">
              <MoreVertical size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[var(--app-muted)]">
            <RefreshCw size={11} className="text-[var(--app-muted)]" />
            <span>Data diperbarui: 22/10/2026 08:30 WIB</span>
            <span className="text-gray-600">|</span>
            <span>Auto-Update</span>
            <button onClick={() => setAutoUpdate(v => !v)}
              className={`relative w-8 h-4 rounded-full transition-all ${autoUpdate ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoUpdate ? 'left-4' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* ─── Sub-Tabs ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-px overflow-x-auto">
          <div className="flex gap-1 shrink-0">
            {SUB_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold' : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Primary Filters ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2.5">
          {[
            { label: 'Periode', opt: 'Juni 2026' },
            { label: 'Dibandingkan Dengan', opt: 'Mei 2026' },
            { label: 'Channel / Nomor', opt: 'Semua Nomor' },
            { label: 'Campaign', opt: 'Semua Campaign' },
            { label: 'Area / Region', opt: 'Semua Area' },
            { label: 'CS / Agent', opt: 'Semua Agent' },
          ].map(f => (
            <div key={f.label} className="flex flex-col gap-1">
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

        {/* ─── Tab Content ─────────────────────────────────────────────── */}
        {activeTab === 'Ringkasan' ? <TabRingkasan /> : <ReportSubTabDetail tabName={activeTab} category="WhatsApp Gateway" />}

      </div>
    </Layout>
  );
}
