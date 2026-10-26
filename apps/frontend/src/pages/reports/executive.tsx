import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportSubTabDetail from '@/components/ReportSubTabDetail';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  DollarSign, Eye, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronRight,
  Users, Percent, AlertTriangle, Zap, Edit3, ExternalLink, Info
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendKeuangan = [
  { month: 'Jan', pendapatan: 1900000000, labaKotor: 1100000000, labaBersih: 480000000 },
  { month: 'Feb', pendapatan: 2100000000, labaKotor: 1220000000, labaBersih: 530000000 },
  { month: 'Mar', pendapatan: 1980000000, labaKotor: 1150000000, labaBersih: 510000000 },
  { month: 'Apr', pendapatan: 2350000000, labaKotor: 1380000000, labaBersih: 600000000 },
  { month: 'Mei', pendapatan: 2210000000, labaKotor: 1280000000, labaBersih: 558000000 },
  { month: 'Jun', pendapatan: 2545750000, labaKotor: 1480000000, labaBersih: 645320000 },
];

const distribusiData = [
  { name: 'Internet', value: 1996250000, pct: '78.5%', color: '#3b82f6' },
  { name: 'Instalasi', value: 249700000, pct: '9.8%', color: '#10b981' },
  { name: 'Perangkat', value: 165250000, pct: '6.5%', color: '#8b5cf6' },
  { name: 'Lainnya', value: 134550000, pct: '5.2%', color: '#6b7280' },
];

const perbandinganData = [
  { name: 'Internet', meiLalu: 1700000000, junIni: 1996250000 },
  { name: 'Instalasi', meiLalu: 210000000, junIni: 249700000 },
  { name: 'Perangkat', meiLalu: 140000000, junIni: 165250000 },
  { name: 'Lainnya', meiLalu: 115000000, junIni: 134550000 },
];

const kpiTable = [
  { indikator: 'Pendapatan', periode: 2545750000, sebelumnya: 2265750000, perubahan: 12.36, up: true },
  { indikator: 'Laba Kotor', periode: 1480000000, sebelumnya: 1080250000, perubahan: 37.00, up: true },
  { indikator: 'Laba Bersih', periode: 645320000, sebelumnya: 558000000, perubahan: 16.12, up: true },
  { indikator: 'Total Tagihan', periode: 2380450000, sebelumnya: 2157800000, perubahan: 10.44, up: true },
  { indikator: 'Total Pembayaran', periode: 2120350000, sebelumnya: 1905120000, perubahan: 11.36, up: true },
  { indikator: 'Collection Rate', periode: 0, sebelumnya: 0, strPeriode: '89.07%', strSblm: '85.86%', perubahan: 3.21, up: true },
  { indikator: 'ARPU (rata-rata per user)', periode: 198100, sebelumnya: 182650, perubahan: 8.45, up: true },
  { indikator: 'Churn Rate', periode: 0, sebelumnya: 0, strPeriode: '1.32%', strSblm: '1.58%', perubahan: 0.26, up: false },
  { indikator: 'Customer Baru', periode: 568, sebelumnya: 492, perubahan: 15.44, up: true },
  { indikator: 'Customer Aktif', periode: 12845, sebelumnya: 11912, perubahan: 7.81, up: true },
];

const top5Produk = [
  { rank: 1, produk: 'Internet Corporate', pendapatan: 1250450000, kontribusi: '49.12%' },
  { rank: 2, produk: 'Internet Residential', pendapatan: 745850000, kontribusi: '29.31%' },
  { rank: 3, produk: 'Instalasi Baru', pendapatan: 249700000, kontribusi: '9.80%' },
  { rank: 4, produk: 'Perangkat', pendapatan: 165250000, kontribusi: '6.43%' },
  { rank: 5, produk: 'Lainnya', pendapatan: 134550000, kontribusi: '5.28%' },
];

const forecastData = [
  { bulan: 'Juli 2026 (Forecast)', pendapatan: 2650000000, labaBersih: 680000000, customer: 13200 },
  { bulan: 'Agustus 2026 (Forecast)', pendapatan: 2720000000, labaBersih: 702000000, customer: 13580 },
  { bulan: 'September 2026 (Forecast)', pendapatan: 2810000000, labaBersih: 730000000, customer: 13980 },
];

const SUB_TABS = [
  'Ringkasan', 'Kinerja Keuangan', 'Kinerja Operasional',
  'Analisis Customer', 'Analisis Pembayaran', 'Proyeksi & Forecast', 'Catatan Eksekutif'
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => `Rp ${Math.abs(n).toLocaleString('id-ID')}`;
const fmtRpCompact = (n: number) => {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(3).replace('.', ',')} M`;
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(0)} Jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
};
const fmt = (n: number) => n.toLocaleString('id-ID');

// ─── KPI Card ─────────────────────────────────────────────────────────────────

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

// ─── Donut Chart ──────────────────────────────────────────────────────────────

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
          <p className="text-[9px] font-black text-[var(--app-text)] leading-none">{total}</p>
          <p className="text-[6px] text-[var(--app-muted)] font-bold uppercase mt-0.5">{label}</p>
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--app-muted)] truncate flex-1">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold shrink-0">{d.pct}</span>
            <span className="text-[var(--app-muted)] text-[7px] shrink-0 ml-1">{fmtRpCompact(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────

function Spark({ data, color, up }: { data: number[]; color: string; up: boolean }) {
  const pts = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width={60} height={22}>
      <LineChart data={pts}>
        <Line dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

function TabRingkasan() {
  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={DollarSign} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Pendapatan" value="Rp 2.545.750.000" change="12.85%" up={true} />
        <KpiCard icon={FileText} iconBg="bg-indigo-500/10" iconColor="#6366f1" label="Total Tagihan" value="Rp 2.380.450.000" change="10.44%" up={true} />
        <KpiCard icon={TrendingUp} iconBg="bg-green-500/10" iconColor="#10b981" label="Total Pembayaran" value="Rp 2.120.350.000" change="11.36%" up={true} />
        <KpiCard icon={Zap} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Laba Bersih" value="Rp 645.320.000" change="18.12%" up={true} />
        <KpiCard icon={Percent} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="Collection Rate" value="89.07%" change="3.21%" up={true} />
        <KpiCard icon={Users} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="Total Customer" value="12.845" change="7.81%" up={true} />
      </div>

      {/* Row 1: Trend + Distribusi + Perbandingan + Insight AI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tren Kinerja Keuangan */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[var(--app-text)]">Tren Kinerja Keuangan</h4>
            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
              <option>6 Bulan Terakhir</option>
            </select>
          </div>
          <div className="flex gap-2 text-[7px] flex-wrap">
            {[['Pendapatan','#3b82f6'],['Laba Kotor','#10b981'],['Laba Bersih','#8b5cf6']].map(([l,c]) => (
              <span key={l} className="flex items-center gap-1 font-bold"><span className="w-2 h-0.5 inline-block" style={{ backgroundColor: c }} /><span className="text-[var(--app-muted)]">{l}</span></span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <LineChart data={trendKeuangan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                formatter={(v: any) => [fmtRp(v)]} />
              <Line type="monotone" dataKey="pendapatan" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="Pendapatan" />
              <Line type="monotone" dataKey="labaKotor" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2, fill: '#10b981' }} name="Laba Kotor" />
              <Line type="monotone" dataKey="labaBersih" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 2, fill: '#8b5cf6' }} name="Laba Bersih" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribusi Pendapatan */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[var(--app-text)]">Distribusi Pendapatan</h4>
            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
              <option>Periode Ini</option>
            </select>
          </div>
          <p className="text-[8px] text-[var(--app-muted)]">(Berdasarkan Kategori)</p>
          <DonutChart data={distribusiData} total="Rp 2,545 M" label="Total Pendapatan" size={125} />
          <div className="space-y-1.5 border-t border-[var(--app-border)] pt-2">
            {distribusiData.map((d, i) => (
              <div key={i} className="flex justify-between text-[8px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[var(--app-muted)]">{d.name}</span>
                </span>
                <span className="text-[var(--app-text)] font-bold">{d.pct} — {fmtRpCompact(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perbandingan Pendapatan */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-[var(--app-text)]">Perbandingan Pendapatan</h4>
          <div className="flex gap-2 text-[7px] font-bold">
            <span className="flex items-center gap-1"><span className="w-2 h-1.5 bg-gray-500/50 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Mei 2026</span></span>
            <span className="flex items-center gap-1"><span className="w-2 h-1.5 bg-blue-500/70 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Juni 2026</span></span>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={perbandinganData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                formatter={(v: any) => [fmtRp(v)]} />
              <Bar dataKey="meiLalu" fill="#4b556380" name="Mei 2026" radius={[2, 2, 0, 0]} />
              <Bar dataKey="junIni" fill="#3b82f6b0" name="Juni 2026" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Eksekutif AI */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[var(--app-text)]">Insight Eksekutif</h4>
            <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
          </div>
          <div className="space-y-2">
            {[
              "Pendapatan naik 12.85% dibanding periode sebelumnya, didorong oleh pertumbuhan layanan Internet.",
              "Collection rate meningkat menjadi 89.07%, mendekati kondisi ideal.",
              "Laba bersih naik 16.12% berkat efisiensi biaya operasional.",
              "Churn rate turun menjadi 1.32%, pertahankan strategi retensi.",
            ].map((t, i) => (
              <div key={i} className="flex gap-2 text-[8px] p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                <p className="text-[var(--app-text)]/80 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
          <button onClick={() => alert("Membuka analisis eksekutif komprehensif...")} className="w-full flex items-center justify-center gap-1 text-[8px] font-bold text-blue-400 hover:text-blue-300 border-t border-[var(--app-border)] pt-2">
            Lihat Analisis Lengkap <ArrowUpRight size={10} />
          </button>
        </div>
      </div>

      {/* Row 2: KPI Table + Top 5 + Arus Kas + Peringatan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Ringkasan Kinerja Utama */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2 md:col-span-1">
          <h4 className="text-xs font-bold text-[var(--app-text)]">Ringkasan Kinerja Utama</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-[8px] min-w-[380px]">
              <thead>
                <tr className="text-[var(--app-muted)] font-bold uppercase border-b border-[var(--app-border)]">
                  <th className="py-1.5 text-left">Indikator</th>
                  <th className="py-1.5 text-right">Periode Ini</th>
                  <th className="py-1.5 text-right">Periode Sblm</th>
                  <th className="py-1.5 text-right">Perubahan</th>
                  <th className="py-1.5 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {kpiTable.map((row, i) => {
                  const valPeriode = row.strPeriode ?? (row.periode < 1000 ? (row.periode > 100 ? String(fmt(row.periode)) : String(row.periode)) : fmtRpCompact(row.periode));
                  const valSblm = row.strSblm ?? (row.sebelumnya < 1000 ? String(row.sebelumnya) : fmtRpCompact(row.sebelumnya));
                  return (
                    <tr key={i} className="hover:bg-[var(--app-border)]/30/30 transition-colors">
                      <td className="py-1.5 text-[var(--app-muted)] pr-2">{row.indikator}</td>
                      <td className="py-1.5 text-right text-[var(--app-text)] font-bold">{valPeriode}</td>
                      <td className="py-1.5 text-right text-[var(--app-muted)]">{valSblm}</td>
                      <td className="py-1.5 text-right">
                        <span className={`font-bold ${row.up ? 'text-green-400' : 'text-red-400'}`}>
                          {row.up ? '▲' : '▼'} {row.perubahan}%
                        </span>
                      </td>
                      <td className="py-1.5 flex justify-center">
                        <Spark data={[row.sebelumnya || 0, (row.periode || 0) * 0.9, row.periode || 0]} color={row.up ? '#10b981' : '#ef4444'} up={row.up} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Produk / Layanan */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-[var(--app-text)]">Top 5 Produk / Layanan</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-[8px] min-w-[240px]">
              <thead>
                <tr className="text-[var(--app-muted)] font-bold uppercase border-b border-[var(--app-border)]">
                  <th className="py-1.5 text-left">#</th>
                  <th className="py-1.5 text-left">Produk / Layanan</th>
                  <th className="py-1.5 text-right">Pendapatan</th>
                  <th className="py-1.5 text-right">Kontribusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {top5Produk.map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--app-border)]/30/30 transition-colors">
                    <td className="py-1.5 pr-2">
                      <span className={`w-5 h-5 rounded-full text-[7px] font-black flex items-center justify-center ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-600 text-white' : 'bg-[var(--app-border)]/20 text-[var(--app-muted)]'}`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-1.5 text-[var(--app-text)]/80">{row.produk}</td>
                    <td className="py-1.5 text-right text-[var(--app-text)] font-bold">{fmtRpCompact(row.pendapatan)}</td>
                    <td className="py-1.5 text-right text-blue-400 font-bold">{row.kontribusi}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-blue-500/30 font-bold">
                  <td className="py-1.5 text-[var(--app-muted)] font-black" colSpan={2}>Total</td>
                  <td className="py-1.5 text-right text-[var(--app-text)] font-black">Rp 2,545 M</td>
                  <td className="py-1.5 text-right text-blue-400 font-black">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan Arus Kas */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-[var(--app-text)]">Ringkasan Arus Kas</h4>
          <div className="space-y-2.5">
            {[
              { label: 'Saldo Awal', value: 'Rp 1.250.000.000', color: 'text-white', big: false },
              { label: 'Arus Kas Masuk', value: 'Rp 2.250.450.000', color: 'text-green-400', big: true },
              { label: 'Arus Kas Keluar', value: 'Rp 1.850.250.000', color: 'text-red-400', big: true },
              { label: 'Saldo Akhir', value: 'Rp 1.650.200.000', color: 'text-white', big: false },
              { label: 'Perubahan', value: '▲ Rp 400.200.000 (32.02%)', color: 'text-green-400', big: false },
            ].map((r, i) => (
              <div key={i} className={`flex justify-between items-center text-[9px] ${i < 4 ? 'border-b border-[var(--app-border)] pb-2' : ''}`}>
                <span className="text-[var(--app-muted)]">{r.label}</span>
                <span className={`font-bold ${r.big ? 'text-base' : ''} ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peringatan + Laporan + Catatan */}
        <div className="space-y-3">
          {/* Peringatan & Notifikasi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Peringatan & Notifikasi</h4>
            {[
              { text: 'Invoice overdue lebih dari 30 hari', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
              { text: 'Customer dengan tagihan belum dibayar > 60 hari', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle },
              { text: 'Kapasitas bandwidth hampir penuh di beberapa area (85%)', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Info },
            ].map((a, i) => (
              <div key={i} className={`flex items-start gap-2 p-2 rounded-lg border ${a.bg}`}>
                <a.icon size={10} className={`${a.color} mt-0.5 shrink-0`} />
                <p className={`text-[8px] font-semibold ${a.color} leading-relaxed`}>{a.text}</p>
                <ChevronRight size={9} className="text-gray-600 shrink-0 ml-auto mt-0.5" />
              </div>
            ))}
            <button onClick={() => alert("Menampilkan semua peringatan operasional & keuangan...")} className="text-[8px] font-bold text-blue-400 flex items-center gap-1">
              Lihat Semua Peringatan <ArrowUpRight size={9} />
            </button>
          </div>

          {/* Laporan Terkait */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-1.5">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Laporan Terkait</h4>
            {[
              'Laporan Laba Rugi Bulanan',
              'Laporan Arus Kas Bulanan',
              'Laporan Aging Hutang',
              'Laporan PPN Keluaran',
              'Laporan KPI Keuangan',
            ].map((l, i) => (
              <div key={i} className="flex justify-between items-center text-[8px] hover:bg-[var(--app-border)]/30/30 px-1 py-1 rounded transition-colors cursor-pointer">
                <span className="text-[var(--app-muted)]">{l}</span>
                <span className="text-blue-400 font-bold">Lihat →</span>
              </div>
            ))}
            <button onClick={() => alert("Membuka seluruh laporan bisnis terpadu...")} className="text-[8px] font-bold text-blue-400 flex items-center gap-1 mt-1">
              Lihat Semua Laporan <ArrowUpRight size={9} />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: YoY + Forecast + Catatan Eksekutif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Analisis YoY */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[var(--app-text)]">Analisis Perbandingan YoY</h4>
            <span className="text-[8px] font-bold text-[var(--app-muted)] bg-[var(--app-border)]/20 px-2 py-0.5 rounded">2026 vs 2025</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Pendapatan', value: 'Rp 2.545.750.000', change: '▲ 18.45%', color: 'text-green-400' },
              { label: 'Laba Bersih', value: 'Rp 645.320.000', change: '▲ 22.32%', color: 'text-green-400' },
              { label: 'Customer Aktif', value: '12.845', change: '▲ 15.21%', color: 'text-green-400' },
              { label: 'ARPU', value: 'Rp 198.100', change: '▲ 2.81%', color: 'text-green-400' },
            ].map((d, i) => (
              <div key={i} className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3 space-y-1">
                <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">{d.label}</p>
                <p className="text-[11px] font-black text-[var(--app-text)] leading-tight">{d.value}</p>
                <p className={`text-[8px] font-bold ${d.color}`}>{d.change}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast 3 Bulan */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[var(--app-text)]">Forecast 3 Bulan Ke Depan</h4>
            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
              <option>Pendapatan</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {forecastData.map((f, i) => {
              const label = ['Juli 2026', 'Agustus 2026', 'September 2026'][i];
              const pct = ['4.09%', '4.08%', '8.66%'][i];
              return (
                <div key={i} className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 space-y-1">
                  <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase leading-tight">{label} (Forecast)</p>
                  <p className="text-[11px] font-black text-[var(--app-text)] leading-tight">{fmtRpCompact(f.pendapatan)}</p>
                  <p className="text-[8px] font-bold text-green-400">▲ {pct}</p>
                </div>
              );
            })}
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={forecastData.map((d, i) => ({ name: ['Jul','Agu','Sep'][i], v: d.pendapatan }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                formatter={(v: any) => [fmtRpCompact(v)]} />
              <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} strokeDasharray="5 3" name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Catatan Eksekutif */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[var(--app-text)]">Catatan Eksekutif</h4>
            <button onClick={() => alert("Membuka dialog penyuntingan catatan eksekutif...")} className="p-1 text-[var(--app-muted)] hover:text-blue-400 transition-colors"><Edit3 size={11} /></button>
          </div>
          <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3 space-y-2 min-h-[120px]">
            <p className="text-[8px] text-[var(--app-text)]/80 leading-relaxed">
              Kinerja bulan Juni 2026 menunjukkan pertumbuhan yang positif di hampir semua indikator utama.
            </p>
            <p className="text-[8px] text-[var(--app-text)]/80 leading-relaxed">
              Fokus untuk bulan berikutnya: meningkatkan collection, menekan biaya operasional, dan menjaga kualitas layanan.
            </p>
            <p className="text-[8px] text-[var(--app-muted)] mt-3 italic border-t border-[var(--app-border)] pt-2">Terakhir diperbarui: 22/10/2026 oleh Agus Dwi Rianto</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">Prioritas Bulan Depan</p>
            {[
              { label: 'Tingkatkan collection rate ke 92%', done: false, color: 'text-yellow-400' },
              { label: 'Tambah 600 customer baru', done: false, color: 'text-blue-400' },
              { label: 'Kurangi churn rate di bawah 1.2%', done: false, color: 'text-red-400' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-[8px]">
                <span className={`w-1.5 h-1.5 rounded-full ${p.done ? 'bg-green-400' : 'bg-[var(--app-border)]/20 border border-gray-600'}`} />
                <span className={p.done ? 'line-through text-[var(--app-muted)]' : 'text-[var(--app-text)]/80'}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// TabPlaceholder replaced by ReportSubTabDetail

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExecutiveSummaryPage() {
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
              <span className="text-indigo-400 font-semibold">Executive Summary</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Ringkasan Eksekutif & Kinerja Bisnis (Executive Report)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Ikhtisar tingkat tinggi metrik pendapatan, margin EBITDA, rasio operasional jaringan, dan proyeksi pertumbuhan ISP.
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
            { label: 'Group By', opt: 'Bulan' },
            { label: 'Entitas / Grup', opt: 'Semua Entitas' },
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
        {activeTab === 'Ringkasan' ? <TabRingkasan /> : <ReportSubTabDetail tabName={activeTab} category="Eksekutif" />}
      </div>
    </Layout>
  );
}
