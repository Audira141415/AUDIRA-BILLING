import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportSubTabDetail from '@/components/ReportSubTabDetail';
import { Pagination } from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  Users, DollarSign, MessageSquare, Eye, CheckCircle, Target,
  ArrowUpRight, MoreVertical, Share2, Bell, Mail, Search,
  ChevronLeft, ChevronRight, Info, Zap, Megaphone, MousePointer,
  Globe, Smartphone, Monitor, Tablet, Activity, Hash
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area,
  ComposedChart
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendData = [
  { month: 'Jan', spend: 180000000, leads: 1240, customers: 320, revenue: 1600000000 },
  { month: 'Feb', spend: 210000000, leads: 1580, customers: 410, revenue: 2050000000 },
  { month: 'Mar', spend: 195000000, leads: 1380, customers: 356, revenue: 1780000000 },
  { month: 'Apr', spend: 230000000, leads: 1820, customers: 480, revenue: 2400000000 },
  { month: 'Mei', spend: 215000000, leads: 1690, customers: 440, revenue: 2200000000 },
  { month: 'Jun', spend: 245680000, leads: 2356, customers: 563, revenue: 2845750000 },
];

const channelLeads = [
  { name: 'Facebook', value: 835, pct: '35.42%', color: '#3b82f6' },
  { name: 'WhatsApp', value: 676, pct: '28.71%', color: '#10b981' },
  { name: 'Instagram', value: 420, pct: '17.85%', color: '#8b5cf6' },
  { name: 'Google Ads', value: 221, pct: '9.38%', color: '#f59e0b' },
  { name: 'Website', value: 129, pct: '5.50%', color: '#06b6d4' },
  { name: 'Lainnya', value: 75, pct: '3.15%', color: '#6b7280' },
];

const funnelData = [
  { name: 'Impression', value: 2845750, color: '#3b82f6', pct: '100%' },
  { name: 'Click', value: 128450, color: '#6366f1', pct: '4.51%' },
  { name: 'Leads', value: 2356, color: '#8b5cf6', pct: '1.38%' },
  { name: 'Opportunity', value: 876, color: '#a855f7', pct: '0.03%' },
  { name: 'Customer', value: 563, color: '#10b981', pct: '22.78%' },
];

const costVsRevenue = [
  { month: 'Jan', spend: 180, revenue: 1600 },
  { month: 'Feb', spend: 210, revenue: 2050 },
  { month: 'Mar', spend: 195, revenue: 1780 },
  { month: 'Apr', spend: 230, revenue: 2400 },
  { month: 'Mei', spend: 215, revenue: 2200 },
  { month: 'Jun', spend: 245, revenue: 2845 },
];

const topCampaignsByLeads = [
  { name: 'Promo Internet Merdeka 2026', leads: 568 },
  { name: 'Campaign Ramadhan 2026', leads: 416 },
  { name: 'Fiber Launching Promo', leads: 432 },
  { name: 'WhatsApp Broadcast Mei', leads: 312 },
  { name: 'Google Ads - Brand', leads: 245 },
];

const topChannelByROI = [
  { name: 'Email Marketing', roi: 18.56 },
  { name: 'Google Search', roi: 14.32 },
  { name: 'Organic Search', roi: 12.38 },
  { name: 'Facebook Ads', roi: 11.05 },
  { name: 'Google Ads', roi: 9.12 },
  { name: 'Instagram Ads', roi: 8.45 },
];

const sourceData = [
  { name: 'google / cpc', value: 735, pct: '31.25%', color: '#3b82f6' },
  { name: 'facebook / cpc', value: 591, pct: '25.12%', color: '#6366f1' },
  { name: 'instagram / cpc', value: 369, pct: '15.68%', color: '#8b5cf6' },
  { name: '(direct) / (none)', value: 269, pct: '11.43%', color: '#f59e0b' },
  { name: 'whatsapp / referral', value: 203, pct: '8.62%', color: '#10b981' },
  { name: 'lainnya', value: 189, pct: '7.90%', color: '#6b7280' },
];

const deviceData = [
  { name: 'Mobile', value: 68.25, color: '#3b82f6' },
  { name: 'Desktop', value: 27.45, color: '#10b981' },
  { name: 'Tablet', value: 4.30, color: '#f59e0b' },
];

const campaignTableData = [
  { no: 1, campaign: 'Promo Internet Merdeka 2026', channel: 'Facebook', status: 'Aktif', spend: 45600000, impression: 495250, click: 21450, ctr: 4.42, leads: 568, customers: 128, convRate: 22.54, revenue: 640000000, cpl: 80268, roi: 1.303 },
  { no: 2, campaign: 'Campaign Ramadhan 2026', channel: 'WhatsApp', status: 'Aktif', spend: 32800000, impression: 312450, click: 18320, ctr: 5.87, leads: 416, customers: 112, convRate: 24.56, revenue: 542600000, cpl: 73930, roi: 1.554 },
  { no: 3, campaign: 'Fiber Launching Promo', channel: 'Google Ads', status: 'Aktif', spend: 68750000, impression: 625480, click: 26540, ctr: 3.93, leads: 432, customers: 98, convRate: 22.69, revenue: 392500000, cpl: 159143, roi: 0.471 },
  { no: 4, campaign: 'WhatsApp Broadcast Mei', channel: 'WhatsApp', status: 'Selesai', spend: 15250000, impression: 125680, click: 8450, ctr: 6.72, leads: 312, customers: 76, convRate: 24.36, revenue: 312800000, cpl: 48878, roi: 1.863 },
  { no: 5, campaign: 'Google Ads - Brand', channel: 'Google Ads', status: 'Aktif', spend: 22100000, impression: 215450, click: 11320, ctr: 5.26, leads: 245, customers: 62, convRate: 25.31, revenue: 285400000, cpl: 90204, roi: 1.260 },
  { no: 6, campaign: 'Instagram Awareness', channel: 'Instagram Ads', status: 'Aktif', spend: 18400000, impression: 198250, click: 9450, ctr: 4.77, leads: 210, customers: 48, convRate: 22.86, revenue: 196600000, cpl: 87619, roi: 0.969 },
  { no: 7, campaign: 'Email Newsletter Juni', channel: 'Email Marketing', status: 'Selesai', spend: 8780000, impression: 78250, click: 3120, ctr: 3.99, leads: 133, customers: 39, convRate: 29.32, revenue: 145300000, cpl: 66015, roi: 1.854 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(2).replace('.', ',')} M`;
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  return `Rp ${n.toLocaleString('id-ID')}`;
};
const fmt = (n: number) => n.toLocaleString('id-ID');

const SUB_TABS = [
  'Ringkasan', 'Campaign Performance', 'Channel Performance',
  'Source / Medium', 'Content Performance', 'Lead Performance',
  'Conversion Funnel', 'Akuisisi', 'ROI Analysis', 'Activity Log'
];

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
        <span className={`flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {up ? '▲' : '▼'} {change}
        </span>
      </div>
      <div>
        <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase tracking-wider leading-tight">{label}</p>
        <p className="text-lg font-black text-[var(--app-text)] mt-0.5 leading-none">{value}</p>
        <p className="text-[8px] text-[var(--app-muted)] mt-0.5">dari Mei 2026</p>
      </div>
    </div>
  );
}

// ─── Donut Chart Component ────────────────────────────────────────────────────

function DonutWithLegend({ data, total, label, height = 140 }: {
  data: { name: string; value: number; color: string; pct: string }[];
  total: string; label: string; height?: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="55%" outerRadius="80%" startAngle={90} endAngle={-270} stroke="none">
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm font-black text-[var(--app-text)] leading-none">{total}</p>
          <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">{label}</p>
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--app-muted)] truncate flex-1">{d.name}</span>
            <span className="text-[var(--app-text)] font-bold shrink-0">{d.pct}</span>
            <span className="text-[var(--app-muted)] shrink-0">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal Bar ──────────────────────────────────────────────────────────

function HBar({ data, valueKey, labelKey, color = '#3b82f6', unit = '' }: {
  data: any[]; valueKey: string; labelKey: string; color?: string; unit?: string;
}) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="space-y-0.5">
          <div className="flex justify-between text-[8px]">
            <span className="text-[var(--app-muted)] truncate max-w-[160px]">{d[labelKey]}</span>
            <span className="text-[var(--app-text)] font-bold ml-1 shrink-0">{unit}{typeof d[valueKey] === 'number' && d[valueKey] > 100 ? fmt(d[valueKey]) : d[valueKey]}</span>
          </div>
          <div className="h-1.5 bg-[var(--app-border)]/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(d[valueKey] / max) * 100}%`, backgroundColor: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Conversion Funnel ───────────────────────────────────────────────────────

function ConvFunnel({ data }: { data: typeof funnelData }) {
  const max = data[0].value;
  return (
    <div className="space-y-1.5">
      {data.map((d, i) => {
        const w = (d.value / max) * 100;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[8px] text-[var(--app-muted)] w-20 shrink-0 text-right">{d.name}</span>
            <div className="flex-1 relative h-6 bg-[var(--app-border)]/20 rounded overflow-hidden">
              <div className="h-full rounded transition-all flex items-center pl-2"
                style={{ width: `${w}%`, backgroundColor: d.color + 'cc' }}>
                <span className="text-[8px] text-[var(--app-text)] font-bold truncate">{d.value >= 1000 ? `${(d.value / 1000).toFixed(0)}K` : fmt(d.value)}</span>
              </div>
            </div>
            <span className="text-[8px] text-[var(--app-muted)] w-10 shrink-0">{d.pct}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard Tab ───────────────────────────────────────────────────────

function TabRingkasan() {
  const { toast } = useToast();
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = campaignTableData.filter(r =>
    r.campaign.toLowerCase().includes(tableSearch.toLowerCase()) ||
    r.channel.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <KpiCard icon={Megaphone} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Campaign" value="24" change="14.29%" up={true} />
        <KpiCard icon={DollarSign} iconBg="bg-green-500/10" iconColor="#10b981" label="Total Spend" value="Rp 245,6 Jt" change="12.45%" up={true} />
        <KpiCard icon={Eye} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="Total Impression" value="2.845.750" change="18.21%" up={true} />
        <KpiCard icon={MousePointer} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Total Click" value="128.450" change="16.22%" up={true} />
        <KpiCard icon={Target} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="Total Leads" value="2.356" change="22.31%" up={true} />
        <KpiCard icon={Users} iconBg="bg-indigo-500/10" iconColor="#6366f1" label="Total Customer" value="563" change="12.91%" up={true} />
        <KpiCard icon={TrendingUp} iconBg="bg-emerald-500/10" iconColor="#10b981" label="Total Revenue" value="Rp 2,845 M" change="22.80%" up={true} />
        <KpiCard icon={Activity} iconBg="bg-orange-500/10" iconColor="#f97316" label="ROI" value="1.058%" change="9.54%" up={true} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Trend + Leads by Channel + Funnel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Marketing Performance Trend */}
            <div className="md:col-span-1 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-[var(--app-text)] leading-tight">Marketing Performance Trend</h4>
                  <p className="text-[8px] text-[var(--app-muted)]">(6 Bulan Terakhir)</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap text-[7px] font-bold">
                {['Spend', 'Leads', 'Customer', 'Revenue'].map((l, i) => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-2 h-0.5 inline-block" style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i] }} />
                    <span className="text-[var(--app-muted)]">{l}</span>
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Spend" />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={1.5} dot={false} name="Leads" />
                  <Line type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Customer" />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Leads by Channel */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Leads by Channel</h4>
              <DonutWithLegend data={channelLeads} total="2.356" label="Total Leads" height={130} />
            </div>

            {/* Conversion Funnel */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Conversion Funnel</h4>
              <ConvFunnel data={funnelData} />
            </div>
          </div>

          {/* Row 2: Cost vs Revenue + Top Campaign + Top Channel + Source + Device */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Cost vs Revenue */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Cost vs Revenue</h4>
                <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[8px] py-0.5 px-1.5 rounded text-[var(--app-text)]/80 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-3 text-[7px] font-bold">
                <span className="flex items-center gap-1"><span className="w-2 h-1.5 bg-blue-500 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Spend</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-1.5 bg-green-500 inline-block rounded-sm" /><span className="text-[var(--app-muted)]">Revenue</span></span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <ComposedChart data={costVsRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[2, 2, 0, 0]} opacity={0.8} name="Spend (Jt)" />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981' }} name="Revenue (Jt)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Top Campaign by Leads */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Top Campaign (by Leads)</h4>
                <span className="text-[8px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">Top 5</span>
              </div>
              <HBar data={topCampaignsByLeads} valueKey="leads" labelKey="name" color="#3b82f6" />
            </div>

            {/* Top Channel by ROI */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Top Channel (by ROI)</h4>
                <span className="text-[8px] text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">Top 6</span>
              </div>
              <HBar data={topChannelByROI} valueKey="roi" labelKey="name" color="#10b981" unit="" />
              <div className="space-y-1">
                {topChannelByROI.map((d, i) => (
                  <div key={i} className="flex justify-between text-[8px]">
                    <span className="text-[var(--app-muted)] truncate">{d.name}</span>
                    <span className="text-[var(--app-text)] font-bold ml-1">{d.roi.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads by Source + Device */}
            <div className="space-y-4">
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Leads by Source / Medium</h4>
                <DonutWithLegend data={sourceData} total="2.356" label="Total Leads" height={110} />
              </div>
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-[var(--app-text)]">Device Breakdown</h4>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0 w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={deviceData} dataKey="value" innerRadius="50%" outerRadius="80%" stroke="none">
                          {deviceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-[7px] text-[var(--app-muted)] font-bold">2.356</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex-1">
                    {deviceData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-[8px]">
                        <span className="flex items-center gap-1">
                          {i === 0 ? <Smartphone size={9} style={{ color: d.color }} /> : i === 1 ? <Monitor size={9} style={{ color: d.color }} /> : <Tablet size={9} style={{ color: d.color }} />}
                          <span className="text-[var(--app-muted)]">{d.name}</span>
                        </span>
                        <span className="text-[var(--app-text)] font-bold">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Campaign Table */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-[var(--app-text)]">Detail Campaign Performance</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                  <input
                    type="text"
                    placeholder="Cari campaign..."
                    value={tableSearch}
                    onChange={e => setTableSearch(e.target.value)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 w-40"
                  />
                </div>
                <button onClick={() => toast.success("Penyaringan data diterapkan berdasarkan parameter yang dipilih.")} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                  <Filter size={10} /> Filter
                </button>
                <button onClick={() => toast.info("Beralih ke mode visualisasi grafik / diagram analitik.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]"><BarChart2 size={12} /></button>
                <button onClick={() => toast.info("Beralih ke tampilan tabel ringkas.")} className="p-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]"><FileText size={12} /></button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
              <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80 min-w-[1100px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Campaign</th>
                    <th className="px-3 py-2.5">Channel</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Spend (Rp)</th>
                    <th className="px-3 py-2.5 text-right">Impression</th>
                    <th className="px-3 py-2.5 text-right">Click</th>
                    <th className="px-3 py-2.5 text-right">CTR</th>
                    <th className="px-3 py-2.5 text-right">Leads</th>
                    <th className="px-3 py-2.5 text-right">Customer</th>
                    <th className="px-3 py-2.5 text-right">Conv. Rate</th>
                    <th className="px-3 py-2.5 text-right">Revenue (Rp)</th>
                    <th className="px-3 py-2.5 text-right">Cost/Lead</th>
                    <th className="px-3 py-2.5 text-right">ROI</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {paginatedData.map((row) => {
                    const roiGood = row.roi >= 1.0;
                    const roiGreat = row.roi >= 1.5;
                    return (
                      <tr key={row.no} className="hover:bg-[var(--app-border)]/20 transition-colors">
                        <td className="px-3 py-2.5 text-[var(--app-muted)] font-bold">{row.no}</td>
                        <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.campaign}</td>
                        <td className="px-3 py-2.5 text-[var(--app-muted)]">{row.channel}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${row.status === 'Aktif' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-[var(--app-muted)] border-gray-500/20'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-[var(--app-text)]/80">{fmt(row.spend)}</td>
                        <td className="px-3 py-2.5 text-right text-[var(--app-text)]/80">{fmt(row.impression)}</td>
                        <td className="px-3 py-2.5 text-right text-[var(--app-text)]/80">{fmt(row.click)}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-blue-400">{row.ctr}%</td>
                        <td className="px-3 py-2.5 text-right font-bold text-[var(--app-text)]">{row.leads}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-[var(--app-text)]">{row.customers}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-purple-400">{row.convRate}%</td>
                        <td className="px-3 py-2.5 text-right font-bold text-green-400">{fmt(row.revenue)}</td>
                        <td className="px-3 py-2.5 text-right text-[var(--app-text)]/80">{fmt(row.cpl)}</td>
                        <td className="px-3 py-2.5 text-right">
                          <span className={`font-black text-xs ${roiGreat ? 'text-green-400' : roiGood ? 'text-yellow-400' : 'text-red-400'}`}>
                            {row.roi.toFixed(3)}
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
                    );
                  })}
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

        {/* Right sidebar 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Cepat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[var(--app-muted)]">Filter Cepat</h4>
            <div className="grid grid-cols-3 gap-1">
              {['7 Hari', '30 Hari', 'Bulan Ini', '3 Bulan', '6 Bulan', 'Tahun Ini'].map((t, i) => (
                <button key={t} onClick={() => toast.info(`Memfilter periode data: ${t}`)} className={`text-[8px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center ${i === 4 ? "bg-blue-600 border-blue-500 text-white" : "bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-border)]/30"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { label: 'Channel', opt: 'Semua Channel' },
                { label: 'Campaign', opt: 'Semua Campaign' },
                { label: 'Area / Region', opt: 'Semua Area' },
                { label: 'Status Campaign', opt: 'Semua Status' },
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
              { label: 'Lihat Detail Campaign', icon: Eye, color: 'text-blue-400' },
              { label: 'Download Marketing Report', icon: Download, color: 'text-cyan-400' },
              { label: 'Export Marketing Report (Excel)', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Export Marketing Report (PDF)', icon: FileDown, color: 'text-red-400' },
              { label: 'ROI Analysis Report', icon: BarChart2, color: 'text-purple-400' },
              { label: 'Lead Source Report', icon: Target, color: 'text-yellow-400' },
            ].map(a => (
              <button key={a.label} onClick={() => toast.info(`Mengeksekusi aksi: ${a.label}`)} className="w-full flex items-center justify-between gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 p-2 rounded-lg text-[8px] font-semibold text-[var(--app-text)]/80 transition-all group">
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
                { text: "Campaign 'Promo Internet Merdeka 2026' memberikan ROI tertinggi (1.303%).", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "WhatsApp memiliki conversion rate tertinggi (24.56%) dibanding channel lain.", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Tingkatkan budget pada channel dengan ROI di atas 1.000%.", color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
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

// ─── Placeholder Tab ──────────────────────────────────────────────────────────

// TabPlaceholder replaced by ReportSubTabDetail

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketingReportPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'Ringkasan': return <TabRingkasan />;
      default: return <ReportSubTabDetail tabName={activeTab} category="Marketing" />;
    }
  };

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
              <span className="text-indigo-400 font-semibold">Laporan Pemasaran</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Efektivitas Kampanye & Akuisisi Pemasaran
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Performa saluran promosi (door-to-door, brosur, digital ads, referral), biaya per akuisisi (CAC), dan konversi sales.
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

        {/* ─── Action Buttons ───────────────────────────────────────────── */}
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
            <button onClick={() => toast.info("Opsi Laporan: Salin Link URL, Cetak Layar Penuh, Sinkronisasi Cloud Drive.")} className="p-1.5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg hover:bg-[var(--app-border)]/30 text-[var(--app-muted)]">
              <MoreVertical size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[var(--app-muted)]">
            <RefreshCw size={11} className="text-[var(--app-muted)]" />
            <span>Data diperbarui: 22/10/2026 08:10 WIB</span>
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

        {/* ─── Sub-tabs ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 border-b border-[var(--app-border)] pb-px overflow-x-auto">
          {SUB_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold' : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ─── Primary Filters ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end gap-2.5">
          {[
            { label: 'Periode', opt: 'Juni 2026' },
            { label: 'Dibandingkan Dengan', opt: 'Mei 2026' },
            { label: 'Channel', opt: 'Semua Channel' },
            { label: 'Campaign', opt: 'Semua Campaign' },
            { label: 'Area / Region', opt: 'Semua Area' },
            { label: 'Status Campaign', opt: 'Semua Status' },
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

        {/* ─── Tab Content ─────────────────────────────────────────────── */}
        {renderTab()}

      </div>
    </Layout>
  );
}
