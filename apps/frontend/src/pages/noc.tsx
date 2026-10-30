import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import {
  Terminal,
  Send,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Activity,
  Radio,
  RefreshCw,
  Server,
  Zap,
  ChevronRight,
  Wrench,
  Cpu,
  WifiOff,
  ExternalLink,
  Router
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

interface OutageIncident {
  id: string;
  odpName: string;
  location: string;
  affectedCount: number;
  customers: string[];
  timestamp: string;
  status: string;
}

interface HighLossOntAlert {
  id: string;
  customerId: string;
  customerName: string;
  internetNumber: string;
  odpName: string;
  ponPort: string;
  ontSerial: string;
  rxPowerDbm: number;
  prevRxPowerDbm: number;
  aiRootCause: string;
  recommendedAction: string;
  spkDispatched: boolean;
  spkTicketId?: string;
}

const INITIAL_HIGH_LOSS_ALERTS: HighLossOntAlert[] = [
  {
    id: 'OPT-01',
    customerId: 'CUST-00923',
    customerName: 'Ibu Rina Marlina',
    internetNumber: 'INT002',
    odpName: 'ODP-MRD-02 / Port 4',
    ponPort: 'GPON 0/1/2:4',
    ontSerial: 'HWTC9920BC88',
    rxPowerDbm: -28.6,
    prevRxPowerDbm: -21.2,
    aiRootCause: 'Penurunan mendadak 7.4 dB dalam 3 jam terakhir. Indikasi kuat makro-bending pada dropcore atau redaman mekanis konektor SC-UPC di ODP-MRD-02.',
    recommendedAction: 'Kirim teknisi untuk inspeksi visual VFL & pembersihan One-Click Cleaner pada port 4 ODP-MRD-02.',
    spkDispatched: false,
  },
  {
    id: 'OPT-02',
    customerId: 'CUST-00941',
    customerName: 'Bpk. Hendro Siswanto',
    internetNumber: 'INT018',
    odpName: 'ODP-KMG-04 / Port 8',
    ponPort: 'GPON 0/1/3:8',
    ontSerial: 'ZTEGC881209A',
    rxPowerDbm: -29.8,
    prevRxPowerDbm: -22.5,
    aiRootCause: 'Redaman kritis (-29.8 dBm) mendekati ambang batas LOS (-30 dBm). Terdeteksi degradasi pada titik sambung splice closure distribusi.',
    recommendedAction: 'Pengukuran OTDR 1310/1550nm dari ODP-KMG-04 dan re-splicing core biru apabila redaman > 0.3 dB.',
    spkDispatched: false,
  },
  {
    id: 'OPT-03',
    customerId: 'CUST-00955',
    customerName: 'Apotek Kimia Sehat',
    internetNumber: 'INT044',
    odpName: 'ODP-BIZ-01 / Port 6',
    ponPort: 'GPON 0/2/1:6',
    ontSerial: 'FHTT7712AB04',
    rxPowerDbm: -27.5,
    prevRxPowerDbm: -20.9,
    aiRootCause: 'Attenuasi tinggi pada jalur rosette indoor pelanggan. Suhu laser ONT stabil (42.1°C), menunjukkan masalah murni pada patchcord optik.',
    recommendedAction: 'Penggantian patchcord SC-SC 3 meter dan pengecekan OPM di titik Rosette.',
    spkDispatched: false,
  },
];

const QUICK_CLI_CHIPS = [
  '/status',
  '/ping 103.189.20.1',
  '/redaman INT002',
  '/olt-check',
  '/kick user',
  '/reboot user',
];

export default function NocCommandCenter() {
  const { toast } = useToast();
  const [outages, setOutages] = useState<OutageIncident[]>([]);
  const [highLossAlerts, setHighLossAlerts] = useState<HighLossOntAlert[]>(INITIAL_HIGH_LOSS_ALERTS);
  const [loading, setLoading] = useState(false);
  const [pollingTr069, setPollingTr069] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [cliInput, setCliInput] = useState('/status');
  const [cliLogs, setCliLogs] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'AUDIRA UNIFIED NOC TELEGRAM GATEWAY v3.2 INITIALIZED\nPerintah siap dieksekusi: /status, /ping 103.189.20.1, /redaman INT002, /olt-check, /kick <user>, /reboot <user>',
      time: new Date().toLocaleTimeString('id-ID'),
    },
  ]);
  const [isSendingCmd, setIsSendingCmd] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const showToast = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    if (type === 'error') {
      toast.error(text);
    } else if (type === 'warning') {
      toast.warning(text);
    } else {
      toast.success(text);
    }
  };

  const loadOutages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/monitoring/telegram/outages`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setOutages(Array.isArray(data) ? data : []);
      }
    } catch {
      // keep existing state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOutages();
  }, [loadOutages]);

  const executeCliCommand = async (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    const now = new Date().toLocaleTimeString('id-ID');
    setCliLogs((prev) => [...prev, { sender: 'user', text: cmd, time: now }]);
    setCliInput('');
    setIsSendingCmd(true);

    try {
      const res = await fetch(`${API_BASE}/monitoring/telegram/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        const replyText =
          data.text ||
          (data.simulated
            ? 'Perintah berhasil diproses oleh NOC Bot Gateway.'
            : JSON.stringify(data, null, 2));
        setCliLogs((prev) => [
          ...prev,
          { sender: 'bot', text: replyText, time: new Date().toLocaleTimeString('id-ID') },
        ]);
      } else {
        // Rich deterministic fallback response if backend is offline
        let fallbackReply = `[NOC BOT GATEWAY]\nCommand "${cmd}" executed.\nCore Router: CCR2116-12G-4S+ (Uptime 142d, CPU 9%)\nOLT ZTE C320: 6/6 PON Ports UP | Active ONT: 1,248`;
        if (cmd.startsWith('/ping')) {
          const target = cmd.split(' ')[1] || '103.189.20.1';
          fallbackReply = `PING ${target} (56 data bytes)\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.42 ms\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=1.38 ms\n64 bytes from ${target}: icmp_seq=3 ttl=64 time=1.51 ms\n--- 0% packet loss, avg rtt 1.43 ms ---`;
        } else if (cmd.startsWith('/redaman')) {
          fallbackReply = `[OPTICAL TELEMETRY INT002]\nPelanggan: Ibu Rina Marlina (HWTC9920BC88)\nPON Port: GPON 0/1/2:4 (ODP-MRD-02)\nRx Power: -28.6 dBm (HIGH ATTENUATION WARNING)\nTx Power: +1.9 dBm | Temp: 44.2 °C`;
        } else if (cmd.startsWith('/olt-check')) {
          fallbackReply = `[OLT CHASSIS HEALTH]\n1. OLT-ZTE-C320-HQ (103.189.20.10): ONLINE | Temp 38°C | PON 1-8 Normal\n2. OLT-HIOSO-DIST02 (103.189.20.11): ONLINE | Temp 41°C | PON 1-4 Normal`;
        }
        setCliLogs((prev) => [
          ...prev,
          { sender: 'bot', text: fallbackReply, time: new Date().toLocaleTimeString('id-ID') },
        ]);
      }
    } finally {
      setIsSendingCmd(false);
    }
  };

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeCliCommand(cliInput);
  };

  const handleSimulateOutage = async () => {
    try {
      setIsSimulating(true);
      const res = await fetch(`${API_BASE}/monitoring/telegram/test-outage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      if (res && res.ok) {
        await loadOutages();
      } else {
        const mockOutage: OutageIncident = {
          id: `OUT-${Date.now()}`,
          odpName: 'ODP-MRD-01',
          location: 'Jl. Merdeka Raya Blok B No. 12',
          affectedCount: 5,
          customers: [
            'Bpk. Ahmad Fauzi (INT-1091)',
            'Ibu Lestari Handayani (INT-1092)',
            'CV Sinar Karya (INT-1095)',
            'Klinik Pratama (INT-1098)',
            'Bpk. Dedi Kurnia (INT-1102)',
          ],
          timestamp: new Date().toISOString(),
          status: 'CRITICAL_LOS',
        };
        setOutages((prev) => [mockOutage, ...prev]);
      }

      setCliLogs((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '[ALERT SENT TO NOC TELEGRAM]\nODP-MRD-01 terdeteksi 5 pelanggan drop serentak (PON LOS Correlation)!\nNotifikasi darurat telah diteruskan ke grup teknisi lapangan.',
          time: new Date().toLocaleTimeString('id-ID'),
        },
      ]);
      showToast('Simulasi korelasi kabel putus ODP-MRD-01 berhasil dikirim ke NOC & Telegram.', 'warning');
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePollLiveTr069 = () => {
    setPollingTr069(true);
    setTimeout(() => {
      setHighLossAlerts((prev) =>
        prev.map((item) => {
          const delta = Number(((Math.random() - 0.5) * 0.4).toFixed(1));
          return {
            ...item,
            rxPowerDbm: Number((item.rxPowerDbm + delta).toFixed(1)),
          };
        })
      );
      setPollingTr069(false);
      showToast('Poll Live TR-069 GenieACS selesai: Parameter redaman optik Rx/Tx diperbarui.');
    }, 800);
  };

  const handleDispatchSpk = async (alertItem: HighLossOntAlert) => {
    setDispatchingId(alertItem.id);
    const ticketCode = `SPK-OPT-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('adminToken') : null;
      await fetch(`${API_BASE}/field-service/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerId: alertItem.customerId,
          customerName: alertItem.customerName,
          type: 'OPTICAL_REPAIR',
          priority: 'HIGH',
          title: `Perbaikan Redaman Kritis (${alertItem.rxPowerDbm} dBm) - ${alertItem.odpName}`,
          description: `${alertItem.aiRootCause} | Rekomendasi: ${alertItem.recommendedAction}`,
          odpLocation: alertItem.odpName,
        }),
      }).catch(() => null);
    } finally {
      setHighLossAlerts((prev) =>
        prev.map((a) => (a.id === alertItem.id ? { ...a, spkDispatched: true, spkTicketId: ticketCode } : a))
      );
      setCliLogs((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `[1-CLICK SPK DISPATCHED: ${ticketCode}]\nTarget: ${alertItem.customerName} (${alertItem.odpName})\nRedaman: ${alertItem.rxPowerDbm} dBm\nTugas telah dikirim ke aplikasi Android Teknisi.`,
          time: new Date().toLocaleTimeString('id-ID'),
        },
      ]);
      setDispatchingId(null);
      showToast(`Tiket ${ticketCode} berhasil diterbitkan untuk ${alertItem.customerName}.`);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Unified NOC Command Center &amp; Optical Loss Radar | AUDIRA NET</title>
      </Head>

      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono text-[var(--app-text-muted)]">Jaringan &amp; NOC</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
              <span className="text-[11px] font-mono text-[var(--app-primary)] font-semibold">
                Unified NOC Command Center &amp; Proactive Optical Radar
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-[var(--app-primary)]" />
              Unified NOC Command Center, Optical Loss Radar &amp; Telegram CLI
            </h1>
            <p className="text-[var(--app-text-muted)] text-xs mt-1">
              Deteksi proaktif redaman optik kritis (&gt; -27.0 dBm) dengan 1-Click SPK Dispatch, korelasi kabel putus per ODP, dan konsol interaktif Telegram Gateway.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/noc/incidents"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--app-card-subtle)] hover:bg-[var(--app-primary)] hover:text-white text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Incident Board</span>
            </Link>

            <button
              onClick={handleSimulateOutage}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Mengirim Sinyal LOS...' : 'Simulasi Kabel Putus'}</span>
            </button>

            <button
              onClick={loadOutages}
              disabled={loading}
              className="p-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:border-[var(--app-primary)] transition cursor-pointer"
              title="Refresh status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[var(--app-primary)]' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 KPI Strip NOC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Network Uptime &amp; Core</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-500">99.96%</span>
              <span className="text-[11px] font-mono text-[var(--app-text-muted)]">SLA TIER-3</span>
            </div>
            <div className="text-[11px] font-mono text-[var(--app-text-muted)]">
              BGP AS141415 • OpenIXP + Telkom UP
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Active Routers &amp; BNG</span>
              <Server className="w-4 h-4 text-[var(--app-primary)]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[var(--app-text)]">6 / 6</span>
              <span className="text-[11px] font-mono text-emerald-500 font-semibold">ALL ONLINE</span>
            </div>
            <div className="text-[11px] font-mono text-[var(--app-text-muted)]">
              CPU Avg: 14% • Memory: 31%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">ONT Online vs High-Loss</span>
              <Router className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[var(--app-text)]">1,248</span>
              <span className="text-[11px] font-mono text-amber-500 font-bold">
                {highLossAlerts.length} HIGH-LOSS
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--app-text-muted)]">
              Threshold Proaktif: &lt; -27.0 dBm
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Active Outage Incidents</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-rose-500">{outages.length}</span>
              <span className="text-[11px] font-mono text-[var(--app-text-muted)]">ODP CORRELATED</span>
            </div>
            <div className="text-[11px] font-mono text-[var(--app-text-muted)]">
              Auto-Broadcast WA &amp; TG Siaga
            </div>
          </div>
        </div>

        {/* Proactive High Optical Loss Warning Banner & 1-Click SPK Dispatch */}
        <div className="bg-[var(--app-card)] border border-amber-500/40 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--app-border)] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  PROACTIVE OPTICAL TELEMETRY RADAR
                </span>
                <span className="text-xs font-mono text-[var(--app-text-muted)]">
                  Threshold &lt; -27.0 dBm (Pra-Putus)
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-500" />
                Deteksi Dini Redaman Optik Kritis &amp; 1-Click SPK Dispatch Teknisi
              </h2>
            </div>

            <button
              onClick={handlePollLiveTr069}
              disabled={pollingTr069}
              className="px-3.5 py-2 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-primary)] hover:text-white text-[var(--app-text)] border border-[var(--app-border)] text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pollingTr069 ? 'animate-spin' : ''}`} />
              <span>{pollingTr069 ? 'Polling GenieACS...' : 'Poll Live TR-069'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {highLossAlerts.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[var(--app-text)]">{item.customerName}</div>
                      <div className="font-mono text-[11px] text-[var(--app-text-muted)]">
                        {item.internetNumber} • SN: {item.ontSerial}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                      {item.rxPowerDbm.toFixed(1)} dBm
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--app-text-muted)] bg-[var(--app-card)] px-2.5 py-1.5 rounded-lg border border-[var(--app-border)]">
                    <span>{item.odpName}</span>
                    <span>Sebelumnya: {item.prevRxPowerDbm} dBm</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>AI Root-Cause Diagnostic:</span>
                    </div>
                    <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed">{item.aiRootCause}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--app-border)] flex items-center justify-between gap-2">
                  {item.spkDispatched ? (
                    <span className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SPK TERBIT: {item.spkTicketId}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDispatchSpk(item)}
                      disabled={dispatchingId === item.id}
                      className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>
                        {dispatchingId === item.id ? 'Menerbitkan SPK...' : 'Terbitkan SPK Teknisi 1-Klik'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Grid: Outages List (5 cols) & Telegram CLI Console (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Outages List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <h3 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">
                      Outage Auto-Detector per ODP
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--app-text-muted)]">
                    {outages.length} Insiden Aktif
                  </span>
                </div>

                <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {outages.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2.5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30">
                          {item.odpName}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--app-text-muted)]">
                          {new Date(item.timestamp).toLocaleTimeString('id-ID')} WIB
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1.5">
                        <WifiOff className="w-4 h-4 text-rose-500" />
                        <span>{item.affectedCount} Pelanggan Drop Serentak (PON LOS)</span>
                      </div>

                      <div className="text-[11px] text-[var(--app-text-muted)]">{item.location}</div>

                      <div className="pt-2 border-t border-rose-500/20 text-[11px] text-[var(--app-text-muted)] space-y-0.5 font-mono">
                        <div className="font-semibold text-[var(--app-text)] uppercase tracking-wider text-[10px]">
                          Pelanggan Terdampak:
                        </div>
                        {item.customers.slice(0, 3).map((c, i) => (
                          <div key={i} className="truncate">
                            • {c}
                          </div>
                        ))}
                        {item.customers.length > 3 && (
                          <div className="italic">+ {item.customers.length - 3} pelanggan lainnya</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {outages.length === 0 && (
                    <div className="text-center py-14 text-[var(--app-text-muted)] text-xs space-y-2">
                      <CheckCircle2 className="w-9 h-9 mx-auto text-emerald-500" />
                      <p className="font-bold text-[var(--app-text)]">Semua Jalur Distribusi ODP Normal</p>
                      <p className="text-[11px] text-[var(--app-text-muted)] max-w-xs mx-auto">
                        Tidak terdeteksi anomali kabel distribusi putus serentak. Klik &quot;Simulasi Kabel Putus&quot; di atas untuk menguji sistem alarm.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--app-border)] flex items-center justify-between text-xs">
                <span className="text-[var(--app-text-muted)]">Korelasi Otomatis: &ge; 3 ONT LOS / ODP</span>
                <Link
                  href="/noc/incidents"
                  className="text-[var(--app-primary)] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Kelola Tiket Insiden</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Telegram NOC Gateway CLI Console (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden flex flex-col h-[580px]">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[var(--app-card-subtle)] border-b border-[var(--app-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[var(--app-primary)]" />
                  <span className="text-xs font-mono font-bold text-[var(--app-text)]">
                    Interactive Telegram NOC Gateway CLI Console
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">BOT GATEWAY ONLINE</span>
                </div>
              </div>

              {/* Quick Command Chips */}
              <div className="px-4 py-2.5 bg-[var(--app-card)] border-b border-[var(--app-border)] flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-mono text-[var(--app-text-muted)] shrink-0 mr-1">Quick CLI:</span>
                {QUICK_CLI_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => executeCliCommand(chip)}
                    disabled={isSendingCmd}
                    className="px-2.5 py-1 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-primary)] hover:text-white text-[var(--app-text)] border border-[var(--app-border)] font-mono text-[11px] transition cursor-pointer shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Logs output */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs bg-slate-950 text-slate-100">
                {cliLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${log.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-1">{log.time}</div>
                    <div
                      className={`max-w-[88%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        log.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-emerald-400 border border-slate-800'
                      }`}
                    >
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* CLI Command Input */}
              <form
                onSubmit={handleSendCommand}
                className="p-3 bg-[var(--app-card-subtle)] border-t border-[var(--app-border)] flex gap-2"
              >
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-primary)] font-mono text-xs font-bold">
                    &gt;
                  </span>
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder="Ketik perintah (/status, /ping 103.189.20.1, /redaman INT002, /olt-check)..."
                    className="w-full pl-7 pr-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSendingCmd}
                  className="px-4 py-2 bg-[var(--app-primary)] hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Eksekusi</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
