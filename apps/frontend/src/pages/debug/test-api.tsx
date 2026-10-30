import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  Activity,
  Server,
  Shield,
  Radio,
  Router,
  CreditCard,
  Users,
  Terminal,
  Zap,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  Send,
  Clock,
} from 'lucide-react';

type EndpointCategory =
  | 'ALL'
  | 'Core & Auth'
  | 'Billing & Keuangan'
  | 'MikroTik & Cluster'
  | 'FTTH OLT/ODP/ZTP/GenieACS'
  | 'Carrier Security DNS/NetFlow/Speedtest/Telegram'
  | 'HRM & Inventory';

interface DiagnosticEndpoint {
  id: string;
  name: string;
  category: Exclude<EndpointCategory, 'ALL'>;
  url: string;
  method: 'GET' | 'POST';
  description: string;
}

interface TestResult {
  id: string;
  endpoint: string;
  url: string;
  category: Exclude<EndpointCategory, 'ALL'>;
  method: string;
  status: 'success' | 'error' | 'pending' | 'idle';
  httpCode?: number;
  latencyMs?: number;
  message: string;
  timestamp?: string;
  data?: any;
}

const DIAGNOSTIC_ENDPOINTS: DiagnosticEndpoint[] = [
  // 1. Core & Auth
  {
    id: 'core-health',
    name: 'System Health & Uptime Probe',
    category: 'Core & Auth',
    url: '/health',
    method: 'GET',
    description: 'Memeriksa konektivitas NestJS API, Prisma PostgreSQL, dan memori proses',
  },
  {
    id: 'core-dashboard',
    name: 'Executive Dashboard Telemetry',
    category: 'Core & Auth',
    url: '/dashboard/stats',
    method: 'GET',
    description: 'Agregasi KPI pelanggan aktif, revenue bulanan, dan tiket NOC',
  },
  {
    id: 'core-audit',
    name: 'RBAC Forensic Audit Trail',
    category: 'Core & Auth',
    url: '/audit/logs',
    method: 'GET',
    description: 'Jejak audit keamanan autentikasi JWT dan mutasi infrastruktur',
  },
  {
    id: 'core-backup',
    name: 'Disaster Recovery Vault List',
    category: 'Core & Auth',
    url: '/backup/list',
    method: 'GET',
    description: 'Daftar snapshot PostgreSQL .sql.gz dan ukuran penyimpanan vault',
  },

  // 2. Billing & Keuangan
  {
    id: 'bill-customers',
    name: 'Daftar Pelanggan (CRM)',
    category: 'Billing & Keuangan',
    url: '/pelanggan',
    method: 'GET',
    description: 'Data pelanggan FTTH/PPPoE beserta status langganan aktif/isolir',
  },
  {
    id: 'bill-cust-stats',
    name: 'Statistik Pertumbuhan Pelanggan',
    category: 'Billing & Keuangan',
    url: '/pelanggan/stats',
    method: 'GET',
    description: 'Rasio pelanggan aktif, isolir, dan churn bulanan',
  },
  {
    id: 'bill-invoices',
    name: 'Daftar Tagihan (Invoices)',
    category: 'Billing & Keuangan',
    url: '/keuangan/invoices',
    method: 'GET',
    description: 'Daftar invoice bulanan, status pembayaran, dan jatuh tempo',
  },
  {
    id: 'bill-stats',
    name: 'Ringkasan Arus Kas & Revenue',
    category: 'Billing & Keuangan',
    url: '/keuangan/stats',
    method: 'GET',
    description: 'Total pendapatan tertagih, piutang belum terbayar, dan MRR',
  },
  {
    id: 'bill-promise',
    name: 'Mesin Janji Bayar (RADIUS CoA)',
    category: 'Billing & Keuangan',
    url: '/janji-bayar',
    method: 'GET',
    description: 'Antrean pelanggan ekstensi isolir sementara 24/48 jam (<2s CoA)',
  },

  // 3. MikroTik & Cluster
  {
    id: 'mk-routers',
    name: 'MikroTik RouterOS Nodes',
    category: 'MikroTik & Cluster',
    url: '/mikrotik',
    method: 'GET',
    description: 'Daftar router Core & BNG beserta status koneksi API 8728',
  },
  {
    id: 'mk-cluster',
    name: 'Multi-NAS Anycast BNG Cluster',
    category: 'MikroTik & Cluster',
    url: '/mikrotik-cluster',
    method: 'GET',
    description: 'Status distribusi beban PPPoE lintas BRAS-East & BRAS-West',
  },
  {
    id: 'mk-ipam',
    name: 'IPAM & CGNAT PBA Pool',
    category: 'MikroTik & Cluster',
    url: '/ipam/pools',
    method: 'GET',
    description: 'Utilisasi blok IPv4 Publik, CGNAT 100.64.0.0/10, dan kepatuhan UU ITE',
  },

  // 4. FTTH OLT/ODP/ZTP/GenieACS
  {
    id: 'ftth-olt',
    name: 'OLT Chassis & PON Cards',
    category: 'FTTH OLT/ODP/ZTP/GenieACS',
    url: '/olt',
    method: 'GET',
    description: 'Telemetri OLT ZTE C320 & Huawei MA5800 beserta suhu dan PON port',
  },
  {
    id: 'ftth-odp',
    name: 'GIS Optical Distribution Point (ODP)',
    category: 'FTTH OLT/ODP/ZTP/GenieACS',
    url: '/odp',
    method: 'GET',
    description: 'Kapasitas splitter port ODP, koordinat GIS, dan redaman optik',
  },
  {
    id: 'ftth-ztp',
    name: 'Zero-Touch Provisioning (ZTP) Queue',
    category: 'FTTH OLT/ODP/ZTP/GenieACS',
    url: '/ztp/queue',
    method: 'GET',
    description: 'Deteksi Unconfigured ONU SN untuk injeksi OMCI/VLAN otomatis',
  },
  {
    id: 'ftth-genieacs',
    name: 'GenieACS TR-069 CPE Inventory',
    category: 'FTTH OLT/ODP/ZTP/GenieACS',
    url: '/genieacs/devices',
    method: 'GET',
    description: 'Parameter CWMP ONT (Optical Rx Power, SSID 2.4/5GHz, Firmware)',
  },

  // 5. Carrier Security DNS/NetFlow/Speedtest/Telegram
  {
    id: 'sec-dns',
    name: 'DNS RPZ TrustPositif Kominfo',
    category: 'Carrier Security DNS/NetFlow/Speedtest/Telegram',
    url: '/dns-trustpositif/status',
    method: 'GET',
    description: 'Sinkronisasi jutaan domain blokir Kominfo pada Unbound/PowerDNS',
  },
  {
    id: 'sec-netflow',
    name: 'NetFlow v9 & BGP Flowspec Shield',
    category: 'Carrier Security DNS/NetFlow/Speedtest/Telegram',
    url: '/netflow/summary',
    method: 'GET',
    description: 'Matriks trafik AS-Number (Meta, Google, Akamai) & mitigasi DDoS RTBH',
  },
  {
    id: 'sec-speedtest',
    name: '10Gbps Speedtest & E-SLA Probe',
    category: 'Carrier Security DNS/NetFlow/Speedtest/Telegram',
    url: '/speedtest/servers',
    method: 'GET',
    description: 'Daftar 5 node penguji throughput (Local BNG, IIX, OpenIXP, SG, Global)',
  },
  {
    id: 'sec-telegram',
    name: 'Telegram NOC 14-Topic Hub',
    category: 'Carrier Security DNS/NetFlow/Speedtest/Telegram',
    url: '/telegram/topics',
    method: 'GET',
    description: 'Pemetaan `message_thread_id` Supergroup Telegram untuk alert real-time',
  },

  // 6. HRM & Inventory
  {
    id: 'ops-tickets',
    name: 'NOC & Helpdesk Tickets',
    category: 'HRM & Inventory',
    url: '/operational/tickets',
    method: 'GET',
    description: 'Antrean tiket gangguan LOS merah, komplain lambat, dan SLA penyelesaian',
  },
  {
    id: 'ops-techs',
    name: 'Field Service Technicians',
    category: 'HRM & Inventory',
    url: '/operational/technicians',
    method: 'GET',
    description: 'Daftar teknisi lapangan, penugasan SPK/Work Order, dan status on-duty',
  },
  {
    id: 'ops-inventory',
    name: 'Warehouse & Fiber Inventory',
    category: 'HRM & Inventory',
    url: '/inventory/items',
    method: 'GET',
    description: 'Stok ONT ZTE/Huawei, Dropcore 1-Core, Patchcord SC-UPC, dan SFP+',
  },
  {
    id: 'ops-hrm',
    name: 'HRM Karyawan & Payroll Teknis',
    category: 'HRM & Inventory',
    url: '/hrm/employees',
    method: 'GET',
    description: 'Data personel NOC, teknisi psb, komisi instalasi, dan absensi',
  },
];

export default function TestAPI() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [testingAll, setTestingAll] = useState(false);
  const [testingSingleId, setTestingSingleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EndpointCategory>('ALL');
  const [expandedEndpointId, setExpandedEndpointId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Realtime WebSocket Broadcast Tester State
  const [wsEventType, setWsEventType] = useState<'payment' | 'ticket' | 'alert' | 'refresh'>('payment');
  const [wsCustomMessage, setWsCustomMessage] = useState(
    'Pembayaran QRIS INV-2026-07-0918 sebesar Rp 350.000 diterima (Auto-Unblock CoA <2s)'
  );
  const [wsSending, setWsSending] = useState(false);
  const [wsResponseLog, setWsResponseLog] = useState<{
    status: 'idle' | 'success' | 'error';
    latencyMs?: number;
    payload?: any;
  }>({ status: 'idle' });

  const categories: EndpointCategory[] = [
    'ALL',
    'Core & Auth',
    'Billing & Keuangan',
    'MikroTik & Cluster',
    'FTTH OLT/ODP/ZTP/GenieACS',
    'Carrier Security DNS/NetFlow/Speedtest/Telegram',
    'HRM & Inventory',
  ];

  const visibleEndpoints = useMemo(() => {
    if (selectedCategory === 'ALL') return DIAGNOSTIC_ENDPOINTS;
    return DIAGNOSTIC_ENDPOINTS.filter((ep) => ep.category === selectedCategory);
  }, [selectedCategory]);

  const runSingleEndpoint = async (endpoint: DiagnosticEndpoint) => {
    setTestingSingleId(endpoint.id);
    setResults((prev) => ({
      ...prev,
      [endpoint.id]: {
        id: endpoint.id,
        endpoint: endpoint.name,
        url: endpoint.url,
        category: endpoint.category,
        method: endpoint.method,
        status: 'pending',
        message: 'Mengukur latensi RTT...',
      },
    }));

    const startTime = performance.now();
    try {
      const response = await fetch(`${API_BASE}${endpoint.url}`, {
        method: endpoint.method,
        headers: { Accept: 'application/json' },
      });
      const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = { rawStatus: response.statusText };
      }

      setResults((prev) => ({
        ...prev,
        [endpoint.id]: {
          id: endpoint.id,
          endpoint: endpoint.name,
          url: endpoint.url,
          category: endpoint.category,
          method: endpoint.method,
          status: response.ok ? 'success' : 'error',
          httpCode: response.status,
          latencyMs,
          timestamp: new Date().toLocaleTimeString('id-ID'),
          message: response.ok
            ? `${response.status} OK • ${latencyMs} ms`
            : `HTTP ${response.status} • ${latencyMs} ms`,
          data,
        },
      }));
    } catch (error: any) {
      const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
      setResults((prev) => ({
        ...prev,
        [endpoint.id]: {
          id: endpoint.id,
          endpoint: endpoint.name,
          url: endpoint.url,
          category: endpoint.category,
          method: endpoint.method,
          status: 'error',
          httpCode: 0,
          latencyMs,
          timestamp: new Date().toLocaleTimeString('id-ID'),
          message: `Connection Refused / Timeout (${error.message || 'Network Error'})`,
          data: {
            error: error.message,
            targetUrl: `${API_BASE}${endpoint.url}`,
            hint: 'Pastikan NestJS Backend aktif di port 3218',
          },
        },
      }));
    } finally {
      setTestingSingleId(null);
    }
  };

  const runAllDiagnostics = async () => {
    setTestingAll(true);
    const targets = selectedCategory === 'ALL' ? DIAGNOSTIC_ENDPOINTS : visibleEndpoints;
    for (const endpoint of targets) {
      await runSingleEndpoint(endpoint);
    }
    setTestingAll(false);
  };

  const triggerRealtimeBroadcast = async () => {
    setWsSending(true);
    const t0 = performance.now();
    try {
      const response = await fetch(`${API_BASE}/realtime/test-broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: wsEventType,
          message: wsCustomMessage,
          timestamp: new Date().toISOString(),
          source: 'API_DIAGNOSTIC_SUITE',
        }),
      });
      const latencyMs = Math.max(1, Math.round(performance.now() - t0));
      let payload: any = {};
      try {
        payload = await response.json();
      } catch {
        payload = { status: response.status };
      }
      setWsResponseLog({
        status: response.ok ? 'success' : 'error',
        latencyMs,
        payload: {
          broadcastEvent: wsEventType,
          httpStatus: response.status,
          backendResponse: payload,
        },
      });
    } catch (error: any) {
      const latencyMs = Math.max(1, Math.round(performance.now() - t0));
      setWsResponseLog({
        status: 'error',
        latencyMs,
        payload: {
          broadcastEvent: wsEventType,
          simulatedFallback: true,
          note: `Endpoint ${API_BASE}/realtime/test-broadcast tidak terjangkau (${error.message})`,
          emittedPayload: {
            type: wsEventType,
            message: wsCustomMessage,
          },
        },
      });
    } finally {
      setWsSending(false);
    }
  };

  const benchmarkMetrics = useMemo(() => {
    const executed = Object.values(results).filter(
      (r) => r.status === 'success' || r.status === 'error'
    );
    const passed = executed.filter((r) => r.status === 'success');
    const failed = executed.filter((r) => r.status === 'error');
    const avgLatency =
      executed.length > 0
        ? Math.round(
            executed.reduce((acc, item) => acc + (item.latencyMs || 0), 0) / executed.length
          )
        : 0;
    const passRate =
      executed.length > 0 ? Math.round((passed.length / executed.length) * 100) : 100;

    return {
      totalConfigured: DIAGNOSTIC_ENDPOINTS.length,
      executedCount: executed.length,
      passedCount: passed.length,
      failedCount: failed.length,
      avgLatency,
      passRate,
    };
  }, [results]);

  const copyJsonData = (id: string, data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/30 text-[var(--app-primary)]">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--app-text)]">
                  Full-Spectrum Carrier-Grade API Diagnostic & Latency Suite
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {DIAGNOSTIC_ENDPOINTS.length} ENDPOINTS READY
                </span>
              </div>
              <p className="text-sm text-[var(--app-text-muted)] mt-1">
                Benchmark latensi aktual (<span className="font-mono">performance.now()</span>), inspeksi payload JSON, dan pengujian WebSocket Gateway pada{' '}
                <span className="font-mono text-[var(--app-text)]">{API_BASE}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setResults({})}
              disabled={testingAll || Object.keys(results).length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] text-sm font-medium disabled:opacity-40"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Benchmark
            </button>

            <button
              onClick={runAllDiagnostics}
              disabled={testingAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--app-primary)] hover:opacity-90 text-white text-sm font-semibold shadow-sm disabled:opacity-50"
            >
              {testingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menjalankan Diagnostik...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run All Diagnostics ({visibleEndpoints.length})
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 KPI Benchmark Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Cakupan Endpoint Diuji
              </span>
              <Terminal className="w-5 h-5 text-[var(--app-primary)]" />
            </div>
            <p className="text-2xl font-bold font-mono text-[var(--app-text)]">
              {benchmarkMetrics.executedCount} / {benchmarkMetrics.totalConfigured}
            </p>
            <p className="text-xs font-mono text-[var(--app-text-muted)] mt-1">
              6 Kategori Modul NestJS
            </p>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                API Pass Rate / Uptime
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400">
              {benchmarkMetrics.passRate}%
            </p>
            <p className="text-xs font-mono text-[var(--app-text-muted)] mt-1">
              {benchmarkMetrics.passedCount} Passed • {benchmarkMetrics.failedCount} Failed
            </p>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Rata-Rata Latensi RTT
              </span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-[var(--app-text)]">
              {benchmarkMetrics.avgLatency} ms
            </p>
            <p className="text-xs font-mono text-[var(--app-text-muted)] mt-1">
              Target Carrier-Grade: &lt; 50 ms
            </p>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Target API Gateway
              </span>
              <Server className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-lg font-bold font-mono text-[var(--app-text)] truncate">
              {API_BASE}
            </p>
            <p className="text-xs font-mono text-[var(--app-text-muted)] mt-1">
              PostgreSQL :5455 • Redis :6379
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">
              Filter Kategori Modul ({visibleEndpoints.length} Endpoint Ditampilkan)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              const count =
                cat === 'ALL'
                  ? DIAGNOSTIC_ENDPOINTS.length
                  : DIAGNOSTIC_ENDPOINTS.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-[var(--app-primary)] text-white shadow-sm'
                      : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] border border-[var(--app-border)]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-black/20">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Endpoint Diagnostic Grid */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--app-border)] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--app-text)]">
                Matriks Pengujian Endpoint & Inspeksi Payload
              </h2>
              <p className="text-xs text-[var(--app-text-muted)]">
                Uji secara individual atau klik &ldquo;Inspect JSON&rdquo; untuk memeriksa struktur respons API
              </p>
            </div>
          </div>

          <div className="divide-y divide-[var(--app-border)]">
            {visibleEndpoints.map((endpoint) => {
              const res = results[endpoint.id];
              const isExpanded = expandedEndpointId === endpoint.id;
              const isRunning = testingSingleId === endpoint.id || res?.status === 'pending';

              return (
                <div
                  key={endpoint.id}
                  className="p-5 hover:bg-[var(--app-card-subtle)]/40 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="mt-0.5">
                        {isRunning ? (
                          <Loader2 className="w-5 h-5 text-[var(--app-primary)] animate-spin" />
                        ) : res?.status === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : res?.status === 'error' ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <Globe className="w-5 h-5 text-[var(--app-text-muted)]" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-[var(--app-primary)]/15 text-[var(--app-primary)] border border-[var(--app-primary)]/30">
                            {endpoint.method}
                          </span>
                          <span className="text-sm font-bold text-[var(--app-text)]">
                            {endpoint.name}
                          </span>
                          <span className="text-xs font-mono text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">
                            {endpoint.url}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]">
                            {endpoint.category}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--app-text-muted)] mt-1">
                          {endpoint.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
                      {res && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md ${
                              res.status === 'success'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : res.status === 'error'
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]'
                            }`}
                          >
                            {res.message}
                          </span>
                        </div>
                      )}

                      {res?.data && (
                        <button
                          onClick={() =>
                            setExpandedEndpointId(isExpanded ? null : endpoint.id)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] text-xs font-semibold"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" />
                              Tutup JSON
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" />
                              Inspect JSON
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => runSingleEndpoint(endpoint)}
                        disabled={isRunning || testingAll}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--app-primary)]/15 hover:bg-[var(--app-primary)]/25 text-[var(--app-primary)] border border-[var(--app-primary)]/30 text-xs font-semibold disabled:opacity-40"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Test Endpoint
                      </button>
                    </div>
                  </div>

                  {isExpanded && res?.data && (
                    <div className="mt-4 pt-3 border-t border-[var(--app-border)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[var(--app-text-muted)]">
                          Response Payload ({endpoint.url}) • {res.timestamp}
                        </span>
                        <button
                          onClick={() => copyJsonData(endpoint.id, res.data)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] text-xs font-mono"
                        >
                          {copiedId === endpoint.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Disalin
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy JSON
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] text-xs font-mono text-[var(--app-text)] overflow-x-auto max-h-64 leading-relaxed">
                        {JSON.stringify(res.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Realtime WebSocket Broadcast Tester */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--app-text)]">
                  Realtime WebSocket Broadcast Tester
                </h2>
                <p className="text-xs text-[var(--app-text-muted)]">
                  Uji emisi event Socket.IO ke seluruh sesi dashboard NOC via{' '}
                  <span className="font-mono">POST {API_BASE}/realtime/test-broadcast</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1.5">
                Tipe Event Broadcast
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['payment', 'ticket', 'alert', 'refresh'] as const).map((evt) => (
                  <button
                    key={evt}
                    onClick={() => setWsEventType(evt)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold uppercase border transition-all ${
                      wsEventType === evt
                        ? 'bg-[var(--app-primary)] text-white border-[var(--app-primary)]'
                        : 'bg-[var(--app-card-subtle)] text-[var(--app-text)] border-[var(--app-border)] hover:bg-[var(--app-bg)]'
                    }`}
                  >
                    event: {evt}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-[var(--app-text-muted)] mb-1.5">
                Payload Pesan Broadcast
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={wsCustomMessage}
                  onChange={(e) => setWsCustomMessage(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-lg text-sm bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
                />
                <button
                  onClick={triggerRealtimeBroadcast}
                  disabled={wsSending}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[var(--app-primary)] hover:opacity-90 text-white text-sm font-semibold disabled:opacity-50"
                >
                  {wsSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Emit Broadcast
                </button>
              </div>
            </div>
          </div>

          {wsResponseLog.status !== 'idle' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-[var(--app-text-muted)]">
                  Status Broadcast: {wsResponseLog.status.toUpperCase()} ({wsResponseLog.latencyMs} ms)
                </span>
              </div>
              <pre className="p-3.5 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] text-xs font-mono text-[var(--app-text)] overflow-x-auto">
                {JSON.stringify(wsResponseLog.payload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Official Port Architecture Reference */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <Database className="w-5 h-5 text-[var(--app-primary)]" />
            <h3 className="text-base font-bold text-[var(--app-text)]">
              Arsitektur Port Resmi Ekosistem AUDIRA-NET & BILLING
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
              <span className="text-[var(--app-text-muted)] block">Web Admin Frontend</span>
              <p className="text-base font-bold font-mono text-[var(--app-text)] mt-1">
                Port 3217
              </p>
              <span className="font-mono text-[11px] text-emerald-400">http://localhost:3217</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
              <span className="text-[var(--app-text-muted)] block">NestJS Backend API</span>
              <p className="text-base font-bold font-mono text-[var(--app-text)] mt-1">
                Port 3218
              </p>
              <span className="font-mono text-[11px] text-sky-400">http://localhost:3218</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
              <span className="text-[var(--app-text-muted)] block">Customer Self-Service Portal</span>
              <p className="text-base font-bold font-mono text-[var(--app-text)] mt-1">
                Port 3001
              </p>
              <span className="font-mono text-[11px] text-indigo-400">http://localhost:3001</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
              <span className="text-[var(--app-text-muted)] block">PostgreSQL (sebilling-postgres)</span>
              <p className="text-base font-bold font-mono text-[var(--app-text)] mt-1">
                Port 5455
              </p>
              <span className="font-mono text-[11px] text-amber-400">Docker Container 5455:5432</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
              <span className="text-[var(--app-text-muted)] block">Redis Cache & BullMQ</span>
              <p className="text-base font-bold font-mono text-[var(--app-text)] mt-1">
                Port 6379
              </p>
              <span className="font-mono text-[11px] text-rose-400">redis://localhost:6379</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
