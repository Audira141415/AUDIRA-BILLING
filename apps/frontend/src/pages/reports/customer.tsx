import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  Users, Eye, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight,
  UserCheck, UserX, UserPlus, Percent, Clock, Send, PlusCircle
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const growthTrend = [
  { month: 'Jan', total: 9800, new: 820, churned: 310 },
  { month: 'Feb', total: 10600, new: 950, churned: 290 },
  { month: 'Mar', total: 11100, new: 780, churned: 320 },
  { month: 'Apr', total: 11900, new: 1020, churned: 280 },
  { month: 'Mei', total: 12500, new: 880, churned: 350 },
  { month: 'Jun', total: 12845, new: 568, churned: 171 },
];

const paketData = [
  { name: 'Premium', value: 4567, pct: '35.6%', color: '#3b82f6' },
  { name: 'Standar', value: 4120, pct: '32.1%', color: '#10b981' },
  { name: 'Basic', value: 2671, pct: '20.8%', color: '#8b5cf6' },
  { name: 'Promo', value: 972, pct: '7.5%', color: '#f59e0b' },
  { name: 'Lainnya', value: 515, pct: '4.0%', color: '#6b7280' },
];

const areaBarData = [
  { name: 'Jakarta', value: 3845 },
  { name: 'Bandung', value: 2120 },
  { name: 'Surabaya', value: 1650 },
  { name: 'Medan', value: 1120 },
  { name: 'Makassar', value: 895 },
  { name: 'Bekasi', value: 785 },
  { name: 'Bogor', value: 615 },
  { name: 'Depok', value: 580 },
  { name: 'Tangerang', value: 1165 },
  { name: 'Lainnya', value: 70 },
];

const tableData = [
  { no: 1, paket: 'Premium', totalCustomer: 4567, pctTotal: '35.56%', aktif: 4278, nonAktif: 289, newCustomer: 214, churned: 45, reaktivasi: 23, arpu: 198450, avgUmur: 20.3, churnRate: 0.98 },
  { no: 2, paket: 'Standar', totalCustomer: 4120, pctTotal: '32.10%', aktif: 3845, nonAktif: 275, newCustomer: 198, churned: 62, reaktivasi: 25, arpu: 142750, avgUmur: 17.8, churnRate: 1.50 },
  { no: 3, paket: 'Basic', totalCustomer: 2671, pctTotal: '20.78%', aktif: 2410, nonAktif: 261, newCustomer: 112, churned: 48, reaktivasi: 19, arpu: 98360, avgUmur: 15.6, churnRate: 1.80 },
  { no: 4, paket: 'Promo', totalCustomer: 972, pctTotal: '7.50%', aktif: 872, nonAktif: 90, newCustomer: 37, churned: 12, reaktivasi: 5, arpu: 78250, avgUmur: 13.4, churnRate: 1.24 },
  { no: 5, paket: 'Lainnya', totalCustomer: 515, pctTotal: '4.01%', aktif: 507, nonAktif: 8, newCustomer: 7, churned: 4, reaktivasi: 2, arpu: 65100, avgUmur: 12.1, churnRate: 0.78 },
];

const SUB_TABS = [
  'Ringkasan', 'Customer List', 'Customer Growth', 'New Customer',
  'Customer Activity', 'Churn Analysis', 'Customer Value (CLV)',
  'Segmentasi', 'Geografis', 'Retention'
];

const FILTER_BTNS = [
  { label: 'Semua Customer', color: 'text-gray-200', bg: 'bg-gray-500/20 border-gray-500/30' },
  { label: 'Customer Aktif', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30' },
  { label: 'Customer Non Aktif', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' },
  { label: 'New Customer', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
  { label: 'Churned Customer', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
  { label: 'Reaktivasi', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const fmt = (n: number) => n.toLocaleString('id-ID');

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, iconColor, iconBg, label, value, change, up }: {
  icon: any; iconColor: string; iconBg: string;
  label: string; value: string; change: string; up: boolean;
}) {
  return (
    <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-3 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg border ${iconBg}`} style={{ borderColor: iconColor + '25' }}>
          <Icon size={14} style={{ color: iconColor }} />
        </div>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {up ? '▲' : '▼'} {change}
        </span>
      </div>
      <div>
        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-lg font-black text-white mt-0.5 leading-tight">{value}</p>
        <p className="text-[8px] text-gray-500 mt-0.5">dari Mei 2026</p>
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ data, total, label, size = 135 }: {
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
          <p className="text-sm font-black text-white leading-none">{total}</p>
          <p className="text-[6px] text-gray-500 font-bold uppercase mt-0.5">{label}</p>
        </div>
      </div>
      <div className="space-y-2 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-gray-400 truncate flex-1">{d.name}</span>
            <span className="text-white font-bold shrink-0">{d.pct}</span>
            <span className="text-gray-500 shrink-0 w-10 text-right">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tab ────────────────────────────────────────────────────────────────

function TabRingkasan() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua Customer');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tableData.filter(r =>
    r.paket.toLowerCase().includes(search.toLowerCase())
  );

  const totals = {
    total: filtered.reduce((s, r) => s + r.totalCustomer, 0),
    aktif: filtered.reduce((s, r) => s + r.aktif, 0),
    nonAktif: filtered.reduce((s, r) => s + r.nonAktif, 0),
    new: filtered.reduce((s, r) => s + r.newCustomer, 0),
    churned: filtered.reduce((s, r) => s + r.churned, 0),
    reaktivasi: filtered.reduce((s, r) => s + r.reaktivasi, 0),
  };

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={Users} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Customer" value="12.845" change="7.81%" up={true} />
        <KpiCard icon={UserCheck} iconBg="bg-green-500/10" iconColor="#10b981" label="Customer Aktif" value="11.912" change="7.34%" up={true} />
        <KpiCard icon={UserPlus} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="New Customer" value="568" change="15.45%" up={true} />
        <KpiCard icon={UserX} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Customer Non Aktif" value="933" change="2.31%" up={false} />
        <KpiCard icon={Percent} iconBg="bg-red-500/10" iconColor="#ef4444" label="Churn Rate" value="1.32%" change="0.26%" up={false} />
        <KpiCard icon={Clock} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="Avg. Customer Lifetime" value="18.7 Bulan" change="5.12%" up={true} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Growth + Paket Donut + Area Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pertumbuhan Customer */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Pertumbuhan Customer</h4>
                <select className="bg-[#080d19] border border-[#131d35] text-[8px] py-0.5 px-1.5 rounded text-gray-300 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-2 text-[7px] font-bold flex-wrap">
                {[['Total Customer','#3b82f6'],['New Customer','#10b981'],['Churned','#ef4444']].map(([l,c]) => (
                  <span key={l} className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block" style={{ backgroundColor: c }} /><span className="text-gray-400">{l}</span></span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={growthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131d35" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="Total Customer" />
                  <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2, fill: '#10b981' }} name="New Customer" />
                  <Line type="monotone" dataKey="churned" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 2, fill: '#ef4444' }} name="Churned" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Customer by Paket */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Customer by Paket</h4>
              <DonutChart data={paketData} total="12.845" label="Total Customer" size={130} />
              <div className="space-y-1.5 border-t border-[#131d35] pt-2">
                {paketData.map((d, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between text-[8px]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-gray-400">{d.name}</span>
                      </span>
                      <span className="text-white font-bold">{d.pct} — {fmt(d.value)}</span>
                    </div>
                    <div className="h-1 bg-[#131d35] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: d.pct, backgroundColor: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer by Area */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Customer by Area</h4>
                <select className="bg-[#080d19] border border-[#131d35] text-[8px] py-0.5 px-1.5 rounded text-gray-300 focus:outline-none">
                  <option>Top 10 Area</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={areaBarData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131d35" />
                  <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Bar dataKey="value" name="Customer" radius={[3, 3, 0, 0]}>
                    {areaBarData.map((_, i) => (
                      <Cell key={i} fill={['#3b82f6','#10b981','#8b5cf6','#f59e0b','#06b6d4','#ef4444','#a855f7','#f97316','#14b8a6','#6b7280'][i % 10]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detail Customer Table */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-white">Daftar Customer <span className="text-gray-500 font-normal">(Ringkasan)</span></h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Cari paket, area..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-[#080d19] border border-[#131d35] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-blue-500 w-40" />
                </div>
                <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                  <Filter size={10} /> Filter
                </button>
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400 hover:bg-[#121c38]"><BarChart2 size={12} /></button>
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400 hover:bg-[#121c38]"><FileText size={12} /></button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#131d35]">
              <table className="w-full text-left border-collapse text-[9px] text-gray-300 min-w-[950px]">
                <thead>
                  <tr className="border-b border-[#131d35] bg-[#101935]/60 text-gray-400 font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Paket</th>
                    <th className="px-3 py-2.5 text-right">Total Customer</th>
                    <th className="px-3 py-2.5 text-right">Aktif</th>
                    <th className="px-3 py-2.5 text-right">Non Aktif</th>
                    <th className="px-3 py-2.5 text-right">New Customer</th>
                    <th className="px-3 py-2.5 text-right">Churned</th>
                    <th className="px-3 py-2.5 text-right">Reaktivasi</th>
                    <th className="px-3 py-2.5 text-right">ARPU</th>
                    <th className="px-3 py-2.5 text-right">Avg. Umur Customer</th>
                    <th className="px-3 py-2.5 text-right">Churn Rate</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131d35]">
                  {filtered.map(row => (
                    <tr key={row.no} className="hover:bg-[#121c38]/40 transition-colors">
                      <td className="px-3 py-2.5 text-gray-500 font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 font-bold text-white">{row.paket}</td>
                      <td className="px-3 py-2.5 text-right">
                        <div>
                          <span className="font-bold text-white">{fmt(row.totalCustomer)}</span>
                          <span className="text-gray-500 ml-1">({row.pctTotal})</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-400">{fmt(row.aktif)}</td>
                      <td className="px-3 py-2.5 text-right text-yellow-400">{fmt(row.nonAktif)}</td>
                      <td className="px-3 py-2.5 text-right text-blue-400 font-bold">{row.newCustomer}</td>
                      <td className="px-3 py-2.5 text-right text-red-400 font-bold">{row.churned}</td>
                      <td className="px-3 py-2.5 text-right text-purple-400">{row.reaktivasi}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-white">{fmtRp(row.arpu)}</td>
                      <td className="px-3 py-2.5 text-right text-gray-300">{row.avgUmur} Bulan</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={`font-bold text-xs ${row.churnRate < 1.0 ? 'text-green-400' : row.churnRate < 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {row.churnRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-1 hover:bg-[#1a2a4a] rounded text-gray-400 hover:text-blue-400 transition-colors"><Eye size={11} /></button>
                          <button className="p-1 hover:bg-[#1a2a4a] rounded text-gray-400 hover:text-green-400 transition-colors"><Download size={11} /></button>
                          <button className="p-1 hover:bg-[#1a2a4a] rounded text-gray-400 transition-colors"><MoreVertical size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-[#101935]/60 font-bold border-t-2 border-blue-500/30">
                    <td className="px-3 py-2.5 text-gray-400 font-black" colSpan={2}>TOTAL</td>
                    <td className="px-3 py-2.5 text-right text-white font-black">{fmt(totals.total)} (100%)</td>
                    <td className="px-3 py-2.5 text-right text-green-400 font-black">{fmt(totals.aktif)}</td>
                    <td className="px-3 py-2.5 text-right text-yellow-400 font-black">{totals.nonAktif}</td>
                    <td className="px-3 py-2.5 text-right text-blue-400 font-black">{totals.new}</td>
                    <td className="px-3 py-2.5 text-right text-red-400 font-black">{totals.churned}</td>
                    <td className="px-3 py-2.5 text-right text-purple-400 font-black">{totals.reaktivasi}</td>
                    <td className="px-3 py-2.5 text-right text-white font-black">Rp 126.840</td>
                    <td className="px-3 py-2.5 text-right text-white font-black">18.7 Bulan</td>
                    <td className="px-3 py-2.5 text-right text-yellow-400 font-black">1.32%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[9px] text-gray-500">Menampilkan 1 - {filtered.length} dari {filtered.length} data</p>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400"><ChevronLeft size={11} /></button>
                <button className="w-6 h-6 text-[9px] rounded-md font-bold bg-blue-600 text-white">1</button>
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400"><ChevronRight size={11} /></button>
                <select className="bg-[#080d19] border border-[#131d35] text-[9px] py-1.5 px-2 rounded-lg text-gray-300 focus:outline-none">
                  <option>10 / halaman</option>
                  <option>25 / halaman</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Ringkasan Customer */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Ringkasan Customer</h4>
            <div className="space-y-2">
              {[
                { label: 'Total Customer', value: '12.845', color: 'text-white' },
                { label: 'Customer Aktif', value: '11.912 (92.73%)', color: 'text-green-400' },
                { label: 'Customer Non Aktif', value: '933 (7.27%)', color: 'text-yellow-400' },
                { label: 'New Customer (Bln Ini)', value: '568', color: 'text-blue-400' },
                { label: 'Churned Customer (Bln Ini)', value: '171', color: 'text-red-400' },
                { label: 'Reaktivasi Customer', value: '74', color: 'text-purple-400' },
                { label: 'Rasio Aktivasi', value: '92.73%', color: 'text-green-400' },
                { label: 'Rasio Retensi', value: '98.68%', color: 'text-green-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center text-[9px] border-b border-[#131d35] pb-1.5 last:border-0 last:pb-0">
                  <span className="text-gray-400">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Cepat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Filter Cepat</h4>
            <div className="grid grid-cols-2 gap-1">
              {FILTER_BTNS.map(f => (
                <button key={f.label} onClick={() => setActiveFilter(f.label)}
                  className={`text-[7px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center truncate leading-tight ${activeFilter === f.label ? f.bg + ' ' + f.color : 'bg-[#080d19] border-[#131d35] text-gray-500 hover:bg-[#121c38]'}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Semua Paket', opt: 'Semua Paket' },
                { label: 'Semua Area', opt: 'Semua Area' },
                { label: 'Group By', opt: 'Bulan' },
                { label: 'Status', opt: 'Semua Status' },
              ].map(f => (
                <div key={f.label} className="space-y-0.5">
                  <span className="text-[7px] text-gray-500 font-bold uppercase">{f.label}</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-[8px] py-1.5 px-2 rounded-lg text-white focus:outline-none">
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
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h4>
            {[
              { label: 'Lihat Detail Customer', icon: Eye, color: 'text-blue-400' },
              { label: 'Kirim Campaign', icon: Send, color: 'text-cyan-400' },
              { label: 'Export Customer List', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Tambah Customer', icon: PlusCircle, color: 'text-purple-400' },
            ].map(a => (
              <button key={a.label} className="w-full flex items-center justify-between gap-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] p-2 rounded-lg text-[8px] font-semibold text-gray-300 transition-all group">
                <span className="flex items-center gap-2">
                  <a.icon size={11} className={a.color} />
                  <span className="text-left">{a.label}</span>
                </span>
                <ChevronDown size={9} className="text-gray-600 -rotate-90 shrink-0" />
              </button>
            ))}
          </div>

          {/* Insight */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Insight & Rekomendasi</h4>
            <div className="space-y-2">
              {[
                { text: "Pertumbuhan customer naik 7.81% dibanding periode sebelumnya.", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "Area Jakarta menyumbang 29.24% dari total customer.", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Churn rate turun menjadi 1.32%. Pertahankan program retensi!", color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                { text: "Paket Premium memiliki retensi terbaik (98.12%).", color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
              ].map((ins, i) => (
                <div key={i} className={`p-2.5 rounded-lg border ${ins.bg}`}>
                  <p className={`text-[8px] font-semibold ${ins.color} leading-relaxed`}>{ins.text}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-[9px] font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 border-t border-[#131d35] pt-2">
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
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-3">
      <BarChart2 size={40} className="text-gray-700" />
      <p className="text-sm font-bold">Tab <span className="text-blue-400">{name}</span> sedang dalam pengembangan</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomerReportPage() {
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-5 space-y-4">

        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-3 border-b border-[#131d35] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold mb-1">
              <span>Finance</span><span className="text-gray-600">›</span>
              <span>Reports</span><span className="text-gray-600">›</span>
              <span className="text-blue-400">Customer Report</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Customer Report</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">Laporan lengkap mengenai pelanggan, pertumbuhan, aktivasi, churn dan nilai pelanggan.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-1.5 rounded-lg">
              <Calendar size={11} className="text-blue-400" />
              <span className="text-[9px] text-gray-300">01 Jul 2026 · 08:35 WIB</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0b1329] border border-[#131d35] px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-bold">Status Sistem</span>
              <span className="text-[9px] text-gray-400">Normal</span>
            </div>
            <div className="relative hidden lg:block">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari invoice, customer, transaksi..."
                className="bg-[#0b1329] border border-[#131d35] text-[9px] pl-8 pr-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-blue-500 w-52" />
            </div>
            <button className="relative p-1.5 bg-[#0b1329] border border-[#131d35] rounded-lg text-gray-400">
              <Bell size={13} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[7px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">13</span>
            </button>
            <button className="relative p-1.5 bg-[#0b1329] border border-[#131d35] rounded-lg text-gray-400">
              <Mail size={13} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[7px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">5</span>
            </button>
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#131d35]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[9px]">AR</div>
              <div className="hidden md:block">
                <div className="text-[9px] font-bold text-white leading-none">Agus Dwi Rianto</div>
                <div className="text-[8px] text-gray-500 font-bold uppercase">Super Admin</div>
              </div>
            </div>
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
                <div className="absolute left-0 top-full mt-1 z-10 bg-[#0b1329] border border-[#131d35] rounded-xl shadow-xl overflow-hidden w-44">
                  {[
                    { label: 'Export PDF', icon: FileDown, color: 'text-red-400' },
                    { label: 'Export Excel', icon: FileSpreadsheet, color: 'text-green-400' },
                    { label: 'Export CSV', icon: FileText, color: 'text-blue-400' },
                  ].map(e => (
                    <button key={e.label} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-gray-300 hover:bg-[#121c38]">
                      <e.icon size={12} className={e.color} />{e.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-1.5 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Calendar size={11} className="text-blue-400" /> Jadwalkan Laporan
            </button>
            <button className="p-1.5 bg-[#0b1329] border border-[#131d35] rounded-lg hover:bg-[#121c38] text-gray-400"><MoreVertical size={13} /></button>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-gray-400">
            <RefreshCw size={11} className="text-gray-500" />
            <span>Data diperbarui: 01/07/2026 08:31 WIB</span>
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
        <div className="flex gap-0.5 border-b border-[#131d35] pb-px overflow-x-auto">
          {SUB_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-[9px] font-bold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Primary Filters */}
        <div className="flex flex-wrap items-end gap-2">
          {[
            { label: 'Periode', opt: 'Juni 2026' },
            { label: 'Dibandingkan Dengan', opt: 'Mei 2026' },
            { label: 'Group By', opt: 'Bulan' },
            { label: 'Area/Region', opt: 'Semua Area' },
            { label: 'Paket', opt: 'Semua Paket' },
            { label: 'Status', opt: 'Semua Status' },
          ].map(f => (
            <div key={f.label} className="space-y-0.5">
              <span className="text-[7px] text-gray-500 font-bold uppercase px-0.5">{f.label}</span>
              <select className="bg-[#0b1329] border border-[#131d35] text-[9px] py-1.5 px-2.5 rounded-lg text-white focus:outline-none hover:border-blue-500/50 transition-colors">
                <option>{f.opt}</option>
              </select>
            </div>
          ))}
          <div className="flex gap-1.5 self-end">
            <button className="flex items-center gap-1.5 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-gray-300 text-[9px] font-bold px-3 py-1.5 rounded-lg">
              <Filter size={10} /> Filter Lainnya
            </button>
            <button className="text-[9px] font-bold text-gray-400 hover:text-white px-2 py-1.5 border border-[#131d35] rounded-lg hover:bg-[#121c38] bg-[#0b1329]">
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
