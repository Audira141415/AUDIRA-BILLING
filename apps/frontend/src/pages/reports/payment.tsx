import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  DollarSign, Eye, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, AlertTriangle, Clock, CreditCard,
  Smartphone, Globe, Building, Percent, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendData = [
  { month: 'Jan', berhasil: 2200000000, tertunda: 58000000, gagal: 18000000, refund: 28000000 },
  { month: 'Feb', berhasil: 2450000000, tertunda: 62000000, gagal: 21000000, refund: 31000000 },
  { month: 'Mar', berhasil: 2180000000, tertunda: 55000000, gagal: 19000000, refund: 27000000 },
  { month: 'Apr', berhasil: 2680000000, tertunda: 70000000, gagal: 24000000, refund: 35000000 },
  { month: 'Mei', berhasil: 2520000000, tertunda: 65000000, gagal: 22000000, refund: 32000000 },
  { month: 'Jun', berhasil: 2756250000, tertunda: 68250000, gagal: 21250000, refund: 34000000 },
];

const metodeTrendData = [
  { month: 'Jan', transfer: 1200000000, ewallet: 580000000, va: 380000000, kartuKredit: 180000000, tunai: 60000000 },
  { month: 'Feb', transfer: 1350000000, ewallet: 640000000, va: 420000000, kartuKredit: 195000000, tunai: 65000000 },
  { month: 'Mar', transfer: 1180000000, ewallet: 590000000, va: 390000000, kartuKredit: 170000000, tunai: 55000000 },
  { month: 'Apr', transfer: 1480000000, ewallet: 710000000, va: 450000000, kartuKredit: 215000000, tunai: 72000000 },
  { month: 'Mei', transfer: 1380000000, ewallet: 670000000, va: 430000000, kartuKredit: 205000000, tunai: 68000000 },
  { month: 'Jun', transfer: 1483750000, ewallet: 687500000, va: 439750000, kartuKredit: 174250000, tunai: 61000000 },
];

const metodeData = [
  { name: 'Transfer Bank', value: 1483750000, pct: '52.13%', color: '#3b82f6' },
  { name: 'E-Wallet', value: 687500000, pct: '24.18%', color: '#10b981' },
  { name: 'VA (Virtual Account)', value: 439750000, pct: '15.46%', color: '#8b5cf6' },
  { name: 'Kartu Kredit', value: 174250000, pct: '6.12%', color: '#f59e0b' },
  { name: 'Tunai', value: 61000000, pct: '2.11%', color: '#6b7280' },
];

const channelData = [
  { name: 'Payment Gateway', value: 1608750000, pct: '58.34%', color: '#3b82f6' },
  { name: 'Mobile Banking', value: 701750000, pct: '24.75%', color: '#10b981' },
  { name: 'Teller / Offline', value: 287500000, pct: '10.12%', color: '#8b5cf6' },
  { name: 'E-Wallet App', value: 151250000, pct: '5.32%', color: '#f59e0b' },
  { name: 'Lainnya', value: 45600000, pct: '1.47%', color: '#6b7280' },
];

const agingData = [
  { range: '1 - 7 Hari', pct: 38.24, amount: 26100000, color: '#f59e0b' },
  { range: '8 - 14 Hari', pct: 22.18, amount: 15150000, color: '#ef4444' },
  { range: '15 - 30 Hari', pct: 25.76, amount: 17560000, color: '#dc2626' },
  { range: '> 30 Hari', pct: 13.82, amount: 9440000, color: '#991b1b' },
];

const tableData = [
  { no: 1, tanggal: '30/06/2026 14:25', noInvoice: 'INV/2026/06/00001', customer: 'PT. Maju Bersama', metode: 'Transfer Bank', channel: 'Mobile Banking', jumlah: 1200000, status: 'Berhasil', refNo: 'BRI/MB/3062026/124512' },
  { no: 2, tanggal: '30/06/2026 13:40', noInvoice: 'INV/2026/06/00002', customer: 'Budi Santoso', metode: 'E-Wallet (OVO)', channel: 'E-Wallet App', jumlah: 350000, status: 'Berhasil', refNo: 'OVO/3062026/134009' },
  { no: 3, tanggal: '30/06/2026 12:15', noInvoice: 'INV/2026/06/00003', customer: 'CV. Sejahtera', metode: 'VA (BCA)', channel: 'Payment Gateway', jumlah: 1750000, status: 'Berhasil', refNo: 'BCA/VA/3062026/121503' },
  { no: 4, tanggal: '30/06/2026 11:50', noInvoice: 'INV/2026/06/00004', customer: 'Andi Wijaya', metode: 'Transfer Bank', channel: 'Internet Banking', jumlah: 220000, status: 'Tertunda', refNo: 'MANDIRI/MB/29062026/180' },
  { no: 5, tanggal: '29/06/2026 16:32', noInvoice: 'INV/2026/06/00005', customer: 'Siti Nurhaliza', metode: 'E-Wallet (Gopay)', channel: 'E-Wallet App', jumlah: 180000, status: 'Gagal', refNo: 'GOPAY/29062026/163256' },
  { no: 6, tanggal: '29/06/2026 15:20', noInvoice: 'INV/2026/06/00006', customer: 'PT. Digital Solusi', metode: 'Kartu Kredit', channel: 'Payment Gateway', jumlah: 1200000, status: 'Berhasil', refNo: 'MIDTRANS/29062026/1520' },
];

const SUB_TABS = [
  'Ringkasan', 'Payment List', 'Metode Pembayaran', 'Channel Pembayaran',
  'Payment Aging', 'Refund / Pembatalan', 'Rekonsiliasi Pembayaran',
  'Collection Performance', 'Gateway Report'
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(3).replace('.', ',')} M`;
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(3).replace('.', ',')} Jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
};
const fmtRpFull = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const fmt = (n: number) => n.toLocaleString('id-ID');

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Berhasil': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Tertunda': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Gagal': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Refund': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
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
        <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase tracking-wider">{label}</p>
        <p className="text-base font-black text-[var(--app-text)] mt-0.5 leading-tight">{value}</p>
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
          <p className="text-[9px] font-black text-[var(--app-text)] leading-none">{total}</p>
          <p className="text-[6px] text-[var(--app-muted)] font-bold uppercase">{label}</p>
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--app-muted)] truncate flex-1 text-[7px]">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold shrink-0">{d.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tab ────────────────────────────────────────────────────────────────

function TabRingkasan() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tableData.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.noInvoice.toLowerCase().includes(search.toLowerCase()) ||
    r.metode.toLowerCase().includes(search.toLowerCase()) ||
    r.channel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={DollarSign} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Pembayaran" value="Rp 2.845.750.000" change="10.85%" up={true} />
        <KpiCard icon={CheckCircle} iconBg="bg-green-500/10" iconColor="#10b981" label="Pembayaran Berhasil" value="Rp 2.756.250.000" change="13.12%" up={true} />
        <KpiCard icon={Clock} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Pembayaran Tertunda" value="Rp 68.250.000" change="5.21%" up={false} />
        <KpiCard icon={XCircle} iconBg="bg-red-500/10" iconColor="#ef4444" label="Pembayaran Gagal" value="Rp 21.250.000" change="8.45%" up={false} />
        <KpiCard icon={AlertTriangle} iconBg="bg-purple-500/10" iconColor="#a855f7" label="Refund" value="Rp 34.000.000" change="3.21%" up={false} />
        <KpiCard icon={Percent} iconBg="bg-emerald-500/10" iconColor="#10b981" label="Success Rate" value="96.86%" change="2.15%" up={true} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Trend + Metode Donut + Channel Donut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tren Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Tren Pembayaran</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-2 text-[7px] font-bold flex-wrap">
                {[['Berhasil','#10b981'],['Tertunda','#f59e0b'],['Gagal','#ef4444'],['Refund','#a855f7']].map(([l,c]) => (
                  <span key={l} className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block" style={{ backgroundColor: c }} /><span className="text-[var(--app-muted)]">{l}</span></span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any) => [fmtRpFull(v)]} />
                  <Line type="monotone" dataKey="berhasil" stroke="#10b981" strokeWidth={2} dot={false} name="Berhasil" />
                  <Line type="monotone" dataKey="tertunda" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Tertunda" />
                  <Line type="monotone" dataKey="gagal" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Gagal" />
                  <Line type="monotone" dataKey="refund" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Refund" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribusi Metode */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Distribusi Metode Pembayaran</h4>
              <DonutChart data={metodeData} total="Rp 2,845 M" label="Total Pembayaran" size={120} />
              <div className="space-y-1 border-t border-[var(--app-border)] pt-2">
                {metodeData.map((d, i) => (
                  <div key={i} className="flex justify-between text-[8px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.pct} — {fmtRp(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribusi Channel */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Distribusi Channel Pembayaran</h4>
              <DonutChart data={channelData} total="Rp 2,845 M" label="Total Pembayaran" size={120} />
              <div className="space-y-1 border-t border-[var(--app-border)] pt-2">
                {channelData.map((d, i) => (
                  <div key={i} className="flex justify-between text-[8px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.pct} — {fmtRp(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Metode Trend + Aging Donut + Ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tren Metode Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Tren Metode Pembayaran</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-2 text-[7px] font-bold flex-wrap">
                {[['Transfer Bank','#3b82f6'],['E-Wallet','#10b981'],['VA','#8b5cf6'],['Kartu Kredit','#f59e0b'],['Tunai','#6b7280']].map(([l,c]) => (
                  <span key={l} className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ backgroundColor: c }} /><span className="text-[var(--app-muted)]">{l}</span></span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={metodeTrendData} barSize={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any) => [fmtRpFull(v)]} />
                  <Bar dataKey="transfer" fill="#3b82f6" name="Transfer Bank" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="ewallet" fill="#10b981" name="E-Wallet" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="va" fill="#8b5cf6" name="VA" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="kartuKredit" fill="#f59e0b" name="Kartu Kredit" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="tunai" fill="#6b7280" name="Tunai" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Aging */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Payment Aging (Belum Dibayar)</h4>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 w-28 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={agingData.map(d => ({ ...d, name: d.range }))} dataKey="amount" innerRadius="55%" outerRadius="80%" startAngle={90} endAngle={-270} stroke="none">
                        {agingData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[9px] font-black text-[var(--app-text)] leading-none">Rp 68,2 Jt</p>
                    <p className="text-[6px] text-[var(--app-muted)] font-bold uppercase">Total Tertunda</p>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {agingData.map((d, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between text-[8px]">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-[var(--app-muted)]">{d.range}</span>
                        </span>
                        <span className="text-[var(--app-text)] font-bold">{d.pct}%</span>
                      </div>
                      <div className="h-1 bg-[var(--app-border)]/20 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                      </div>
                      <p className="text-[7px] text-[var(--app-muted)] text-right">{fmtRpFull(d.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ringkasan Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Ringkasan Pembayaran</h4>
              <div className="space-y-2.5">
                {[
                  { label: 'Rata-rata Nilai Pembayaran', value: 'Rp 197.755', color: 'text-white' },
                  { label: 'Median Pembayaran', value: 'Rp 185.000', color: 'text-white' },
                  { label: 'Transaksi Terbanyak', value: '3.245 transaksi', color: 'text-blue-400' },
                  { label: 'Customer Membayar', value: '12.384', color: 'text-white' },
                  { label: 'Rasio Collection', value: '85.68%', color: 'text-green-400' },
                  { label: 'Dispute / Chargeback', value: '12 Transaksi', color: 'text-red-400' },
                  { label: 'Refund Rate', value: '1.19%', color: 'text-purple-400' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-[9px] border-b border-[var(--app-border)] pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[var(--app-muted)]">{r.label}</span>
                    <span className={`font-bold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detail Payment Table */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Daftar Pembayaran</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                  <input type="text" placeholder="Cari invoice, customer, metode, channel..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 w-52" />
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
                    <th className="px-3 py-2.5">Tanggal Bayar</th>
                    <th className="px-3 py-2.5">No Invoice</th>
                    <th className="px-3 py-2.5">Customer</th>
                    <th className="px-3 py-2.5">Metode</th>
                    <th className="px-3 py-2.5">Channel</th>
                    <th className="px-3 py-2.5 text-right">Jumlah</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Ref No / Transaksi</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {filtered.map(row => (
                    <tr key={row.no} className="hover:bg-[var(--app-border)]/20 transition-colors">
                      <td className="px-3 py-2.5 text-[var(--app-muted)] font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 text-[var(--app-muted)] text-[8px]">{row.tanggal}</td>
                      <td className="px-3 py-2.5 font-mono text-blue-400 text-[8px]">{row.noInvoice}</td>
                      <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.customer}</td>
                      <td className="px-3 py-2.5 text-[var(--app-text)]/80">{row.metode}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold">{row.channel}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-400">{fmtRpFull(row.jumlah)}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={row.status} /></td>
                      <td className="px-3 py-2.5 font-mono text-[var(--app-muted)] text-[8px] max-w-[160px] truncate">{row.refNo}</td>
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
              <p className="text-[9px] text-[var(--app-muted)]">Menampilkan 1 - 10 dari 15.842 data</p>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-muted)]"><ChevronLeft size={11} /></button>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 text-[9px] rounded-md font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                    {p}
                  </button>
                ))}
                <span className="text-gray-600 text-[9px]">...</span>
                <button className="w-10 h-6 text-[9px] rounded-md font-bold bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30">1585</button>
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
            <div className="grid grid-cols-4 gap-1">
              {['Hari Ini', '7 Hari', '30 Hari', 'Bulan Ini'].map((t, i) => (
                <button key={t} className={`text-[7px] font-bold py-1.5 px-0.5 rounded-lg border transition-all text-center ${i === 2 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30'}`}>
                  {t}
                </button>
              ))}
            </div>
            {/* Status checkboxes */}
            <div className="space-y-1">
              <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">Status</p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: 'Semua Status', color: 'text-[var(--app-text)]/80', bg: 'bg-gray-500/10 border-gray-500/20' },
                  { label: 'Tertunda', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                  { label: 'Berhasil', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                  { label: 'Gagal', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                  { label: 'Tergal', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                  { label: 'Refund', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                ].map(s => (
                  <label key={s.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[7px] font-bold cursor-pointer ${s.bg} ${s.color}`}>
                    <input type="checkbox" className="accent-blue-500 w-2.5 h-2.5" defaultChecked />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              {['Semua Metode Pembayaran', 'Semua Channel Pembayaran', 'Semua Paket', 'Semua Area / Region'].map(f => (
                <select key={f} className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500">
                  <option>{f}</option>
                </select>
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
              { label: 'Lihat Detail Pembayaran', icon: Eye, color: 'text-blue-400' },
              { label: 'Download Payment List', icon: Download, color: 'text-cyan-400' },
              { label: 'Export Payment List (Excel)', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Export Payment List (PDF)', icon: FileDown, color: 'text-red-400' },
              { label: 'Rekonsiliasi Pembayaran', icon: RefreshCw, color: 'text-purple-400' },
              { label: 'Kirim Reminder Pembayaran', icon: Bell, color: 'text-orange-400' },
            ].map(a => (
              <button key={a.label} className="w-full flex items-center justify-between gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 p-2 rounded-lg text-[8px] font-semibold text-[var(--app-text)]/80 transition-all group">
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
                { text: "Payment success rate naik 2.15% dibanding periode sebelumnya.", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "Transfer bank masih menjadi metode pembayaran utama (52.13%).", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Tingkat pembayaran tertunda menurun 5.21%. Gunakan reminder otomatis untuk invoice > 7 hari.", color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
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

export default function PaymentReportPage() {
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
              <span className="text-indigo-400 font-semibold">Laporan Pembayaran</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Analisis Kanal & Volume Pembayaran
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Komposisi transaksi via Payment Gateway QRIS/VA, loket kasir tunai, transfer manual, dan fee payment processing.
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
            { label: 'Tanggal Pembayaran', opt: 'Semua' },
            { label: 'Metode Pembayaran', opt: 'Semua Metode' },
            { label: 'Channel Pembayaran', opt: 'Semua Channel' },
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
