import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {
  Send,
  MessageSquare,
  Bot,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Radio,
  Zap,
  Activity,
  Layers,
  FileText,
  Clock,
  Check,
  X,
  CreditCard,
  Wifi,
  Server,
  Wrench,
  UserPlus,
  LifeBuoy,
  BarChart3,
  Cpu,
  Lock,
  Calendar,
} from 'lucide-react';

interface TelegramTopic {
  no: number;
  name: string;
  desc: string;
  threadId: number;
  key: string;
}

interface TelegramStatus {
  status: string;
  botUsername: string;
  chatId: string;
  legacyChatId: string;
  title: string;
  inviteLink: string;
  topicCount: number;
  topics: TelegramTopic[];
}

const TOPIC_ICONS: Record<number, React.ReactNode> = {
  1: <MessageSquare className="w-5 h-5 text-amber-500" />,
  2: <CreditCard className="w-5 h-5 text-emerald-500" />,
  3: <UserPlus className="w-5 h-5 text-blue-500" />,
  4: <Wifi className="w-5 h-5 text-cyan-500" />,
  5: <AlertTriangle className="w-5 h-5 text-rose-500" />,
  6: <LifeBuoy className="w-5 h-5 text-indigo-500" />,
  7: <Wrench className="w-5 h-5 text-orange-500" />,
  8: <Zap className="w-5 h-5 text-teal-500" />,
  9: <Server className="w-5 h-5 text-purple-500" />,
  10: <BarChart3 className="w-5 h-5 text-blue-600" />,
  11: <Cpu className="w-5 h-5 text-slate-500 dark:text-slate-400" />,
  12: <Bot className="w-5 h-5 text-fuchsia-500" />,
  13: <Calendar className="w-5 h-5 text-yellow-600" />,
  14: <Lock className="w-5 h-5 text-emerald-600" />,
};

const TEMPLATE_PRESETS = [
  {
    name: 'Pengumuman Internal',
    topicNo: 1,
    title: 'Pemberitahuan Jadwal Rapat Koordinasi NOC',
    body: 'Rapat koordinasi teknis mingguan seluruh divisi akan dilaksanakan besok pukul 10:00 WIB via Google Meet.\n\nAgenda:\n1. Evaluasi kapasitas uplink Tier-1\n2. Jadwal maintenance OLT POP Barat',
  },
  {
    name: 'Tagihan & Pembayaran',
    topicNo: 2,
    title: 'Ringkasan Penagihan Harian',
    body: 'Kas Masuk Lunas: Rp 12.500.000 (50 dari 100 Customer)\nPiutang Menunggu: Rp 12.500.000\nCollection Rate: 50.0%\n\nSistem reminder otomatis telah mengirim notifikasi ke 50 pelanggan belum lunas.',
  },
  {
    name: 'Gangguan Jaringan (Incident)',
    topicNo: 5,
    title: 'INSIDEN FIBER CUT DI JALUR UTAMA',
    body: 'Severity: CRITICAL\nLokasi: Tiang TR-042 Jl. Pemuda (Antara ODC-01 dan ODP-08)\nEstimasi Pelanggan Terdampak: 64 Pelanggan\nStatus: Tim Splicer Lapangan sedang menuju lokasi untuk penyambungan darurat.',
  },
  {
    name: 'Aktivasi Pelanggan Baru',
    topicNo: 8,
    title: 'Aktivasi Pelanggan Berhasil (FTTH)',
    body: 'Pelanggan: Ibu Ratna Dewi\nNo Internet: INET-002144\nPaket: Home Ultra 100M\nModem ONT SN: ZTEG-C8879102\nRedaman Optik: -19.2 dBm (Sempurna)\nTeknisi: Budi Santoso',
  },
  {
    name: 'Ringkasan Keuangan Direksi',
    topicNo: 14,
    title: 'Laporan Arus Kas Periode Berjalan',
    body: 'Total Penerimaan: Rp 48.750.000\nPengeluaran Operasional: Rp 14.200.000\nEstimasi Laba Bersih: Rp 34.550.000\nStatus: Semua kewajiban IP Transit & PLN telah diselesaikan.',
  },
];

const LIVE_SCENARIOS = [
  {
    id: 'PAYMENT',
    name: 'Customer Bayar Lunas',
    targetTopicNo: 2,
    targetTopicName: 'Billing & Payment',
    color: 'emerald',
    desc: 'Simulasi kasir / QRIS: Pelanggan membayar tagihan bulanan dan sesi dipulihkan (CoA).',
    badge: 'Billing Real-Time',
  },
  {
    id: 'OUTAGE',
    name: 'Gangguan Jaringan (Fiber Cut)',
    targetTopicNo: 5,
    targetTopicName: 'Network Incidents',
    color: 'rose',
    desc: 'Alarm darurat insiden kabel optik putus, dampak 74 pelanggan, & penugasan tim splicer.',
    badge: 'NOC Emergency Alert',
  },
  {
    id: 'ODP_FULL',
    name: 'Kapasitas ODP Penuh (8/8 Port)',
    targetTopicNo: 9,
    targetTopicName: 'Infrastructure',
    color: 'purple',
    desc: 'Peringatan utilisasi port ODP mencapai 100% dan rekomendasi pemasangan splitter ekspansi.',
    badge: 'Capacity Planning',
  },
  {
    id: 'OPTICAL_CRITICAL',
    name: 'Redaman Optik Kritis (-29.8 dBm)',
    targetTopicNo: 4,
    targetTopicName: 'Network Monitoring',
    color: 'cyan',
    desc: 'Telemetri redaman optik ONT pelanggan melampaui batas toleransi -27 dBm.',
    badge: 'TR-069 Diagnostic',
  },
  {
    id: 'ACTIVATION',
    name: 'Aktivasi FTTH Pelanggan Baru',
    targetTopicNo: 8,
    targetTopicName: 'Installation & Activation',
    color: 'teal',
    desc: 'Konfirmasi aktivasi internet selesai dengan nomor PPPoE, ONT SN, dan teknisi PSB.',
    badge: 'Field Service Complete',
  },
  {
    id: 'TICKET',
    name: 'Tiket Keluhan Pelanggan Baru',
    targetTopicNo: 6,
    targetTopicName: 'Support Tickets',
    color: 'indigo',
    desc: 'Laporan keluhan pelanggan baru masuk dari CS untuk penanganan SLA tim teknisi.',
    badge: 'Customer Helpdesk',
  },
  {
    id: 'FINANCE',
    name: 'Laporan Arus Kas Hari Ini',
    targetTopicNo: 14,
    targetTopicName: 'Finance Summary',
    color: 'blue',
    desc: 'Laporan kas harian 50 dari 100 pelanggan bayar lunas (Rp 12.500.000) ke direksi.',
    badge: 'Executive Briefing',
  },
];

export default function TelegramIntegrationPage() {
  const [statusData, setStatusData] = useState<TelegramStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingTopicNo, setTestingTopicNo] = useState<number | null>(null);
  const [simulatingScenarioId, setSimulatingScenarioId] = useState<string | null>(null);
  const [selectedTopicNo, setSelectedTopicNo] = useState<number>(1);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const { toast } = useToast();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast.info(message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStatus, resLogs] = await Promise.all([
        api.telegram.getStatus(),
        api.telegram.getLogs().catch(() => ({ logs: [] })),
      ]);
      setStatusData(resStatus);
      if (resLogs?.logs) setLogs(resLogs.logs);
    } catch (err: any) {
      console.error('Error fetching Telegram status:', err);
      showToast('Gagal memuat status Telegram: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTestTopic = async (topicNo: number) => {
    try {
      setTestingTopicNo(topicNo);
      const res = await api.telegram.testTopic(topicNo);
      if (res.success) {
        showToast(`Tes terkirim ke Topik #${topicNo} di Telegram!`, 'success');
        fetchData();
      } else {
        showToast('Gagal mengirim tes: ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setTestingTopicNo(null);
    }
  };

  const handleSimulateScenario = async (scenario: (typeof LIVE_SCENARIOS)[0]) => {
    try {
      setSimulatingScenarioId(scenario.id);
      const res = await api.telegram.simulateScenario(scenario.id as any);
      if (res.success) {
        showToast(
          `Skenario "${scenario.name}" berhasil dikirim ke Topik #${scenario.targetTopicNo} (${scenario.targetTopicName}) di Telegram!`,
          'success'
        );
        fetchData();
      } else {
        showToast('Gagal simulasi skenario: ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSimulatingScenarioId(null);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      showToast('Pesan tidak boleh kosong', 'error');
      return;
    }

    try {
      setIsSending(true);
      const res = await api.telegram.broadcast({
        topicNo: selectedTopicNo,
        title: broadcastTitle.trim() || undefined,
        message: broadcastMessage.trim(),
      });

      if (res.success) {
        showToast(`Pesan berhasil dikirim ke Topik #${selectedTopicNo}!`, 'success');
        setBroadcastTitle('');
        setBroadcastMessage('');
        fetchData();
      } else {
        showToast('Gagal mengirim pesan: ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      showToast('Error mengirim broadcast: ' + err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const applyPreset = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setSelectedTopicNo(preset.topicNo);
    setBroadcastTitle(preset.title);
    setBroadcastMessage(preset.body);
    showToast(`Template "${preset.name}" diterapkan!`, 'info');
  };

  const topicsList = statusData?.topics || [];

  return (
    <Layout>
      <Head>
        <title>Telegram Bot & 14 Topics Operations Hub | AUDIRA-NET</title>
      </Head>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-[var(--app-text)]">
                    Telegram Bot & Topics Operations Hub
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    14 Topics Live
                  </span>
                </div>
                <p className="text-sm text-[var(--app-text-muted)] mt-0.5">
                  Pusat kendali telemetri, alert insiden NOC, notifikasi billing, dan automasi terintegrasi 2-arah ke Supergroup Telegram AUDIRA ISP.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-sm font-semibold text-[var(--app-text)] flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
            <a
              href={statusData?.inviteLink || 'https://t.me/+Yx8qadYjUSsxZjQ1'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-sm font-semibold shadow-md flex items-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Buka Supergroup Telegram
            </a>
          </div>
        </div>

        {/* 4 Status KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                Bot Username
              </span>
              <Bot className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-[var(--app-text)]">
              @{statusData?.botUsername || 'AudiraISPBot'}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              API Token Terotentikasi
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                Supergroup Forum
              </span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-[var(--app-text)] truncate">
              {statusData?.title || 'AUDIRA ISP | Operations Center'}
            </div>
            <div className="mt-1 text-xs text-[var(--app-text-muted)] font-mono">
              Chat ID: {statusData?.chatId || '-1004464075869'}
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                Forum Topics Terhubung
              </span>
              <Layers className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-emerald-500">
              {statusData?.topicCount || 14} / 14 Aktif
            </div>
            <div className="mt-1 text-xs text-[var(--app-text-muted)]">
              Terdistribusi ke seluruh divisi ISP
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                Integrasi Web & Mobile
              </span>
              <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
            </div>
            <div className="mt-2 text-xl font-bold text-cyan-500">
              Realtime Synchronized
            </div>
            <div className="mt-1 text-xs text-[var(--app-text-muted)]">
              Next.js 3217 & Flutter AUDIRA-NET
            </div>
          </div>
        </div>

        {/* ─── LIVE SCENARIOS SIMULATION SUITE (User Functional Testing) ─── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Zap className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold text-[var(--app-text)]">
                  Uji Fungsi Skenario Operasional ISP Nyata (Live Telegram Test)
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full">
                  Real Dispatch
                </span>
              </div>
              <p className="text-xs text-[var(--app-text-muted)] mt-1">
                Klik tombol pada salah satu skenario di bawah ini untuk menguji bagaimana backend & web AUDIRA secara otomatis mengirim notifikasi terformat ke thread topik yang tepat di Supergroup Telegram.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {LIVE_SCENARIOS.map((sc) => (
              <div
                key={sc.id}
                className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-blue-500/30 flex flex-col justify-between gap-3 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {sc.badge}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--app-text-muted)]">
                      Topik #{sc.targetTopicNo}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--app-text)]">
                    {sc.name}
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-1 leading-relaxed">
                    {sc.desc}
                  </p>
                  <div className="mt-2 text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Target: {sc.targetTopicName}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSimulateScenario(sc)}
                  disabled={simulatingScenarioId === sc.id}
                  className="w-full py-2 px-3 rounded-lg bg-[var(--app-card)] hover:bg-blue-500/10 text-blue-500 hover:text-blue-600 border border-blue-500/30 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-xs"
                >
                  {simulatingScenarioId === sc.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim ke Telegram...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Uji Skenario Ini</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Topics Grid (14 Topics) | Right Composer */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Topics List (2 Columns wide on XL) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--app-text)] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-500" />
                    Matriks 14 Topik Forum Telegram
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Setiap modul AUDIRA menyalurkan notifikasi otomatis ke thread topik yang sesuai.
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text-muted)]">
                  Total: {topicsList.length} Topik
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topicsList.map((topic) => (
                  <div
                    key={topic.no}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedTopicNo === topic.no
                        ? 'border-blue-500/50 bg-blue-500/5 shadow-sm'
                        : 'border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
                          {TOPIC_ICONS[topic.no] || <MessageSquare className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[var(--app-text-muted)]">
                              #{topic.no}
                            </span>
                            <h3 className="font-bold text-sm text-[var(--app-text)]">
                              {topic.name}
                            </h3>
                          </div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-mono font-medium bg-[var(--app-card)] border border-[var(--app-border)] rounded text-slate-500 dark:text-slate-400">
                            Thread ID: {topic.threadId}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTestTopic(topic.no)}
                          disabled={testingTopicNo === topic.no}
                          title="Kirim Tes Notifikasi ke Topik Ini"
                          className="p-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-[var(--app-text)] hover:text-emerald-500 transition text-xs flex items-center gap-1 font-medium"
                        >
                          {testingTopicNo === topic.no ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                          ) : (
                            <Zap className="w-3.5 h-3.5" />
                          )}
                          Tes
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTopicNo(topic.no);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          title="Pilih Topik untuk Menulis Pesan"
                          className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                            selectedTopicNo === topic.no
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-[var(--app-border)] bg-[var(--app-card)] hover:bg-blue-500/10 text-[var(--app-text)] hover:text-blue-500'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Kirim
                        </button>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs text-[var(--app-text-muted)] leading-relaxed">
                      {topic.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-500" />
                  Log Pengiriman Pesan Terkini
                </h2>
                <span className="text-xs text-[var(--app-text-muted)]">
                  Live Buffer ({logs.length} entri)
                </span>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-8 text-sm text-[var(--app-text-muted)]">
                  Belum ada log pengiriman pada sesi ini. Coba kirim pesan melalui tombol "Tes" di atas.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              log.success ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                          <span className="font-bold text-[var(--app-text)]">
                            {log.topicName}
                          </span>
                          <span className="text-[var(--app-text-muted)] font-mono text-[10px]">
                            {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                          </span>
                        </div>
                        <p className="text-[var(--app-text-muted)] line-clamp-2 whitespace-pre-wrap font-mono text-[11px]">
                          {log.text}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${
                          log.success
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        {log.success ? 'TERKIRIM' : 'GAGAL'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Composer & Presets */}
          <div className="space-y-6">
            {/* Composer Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-500" />
                  Kirim Pesan ke Telegram
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md">
                  Topik #{selectedTopicNo}
                </span>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--app-text-muted)] mb-1.5">
                    Target Topik Forum
                  </label>
                  <select
                    value={selectedTopicNo}
                    onChange={(e) => setSelectedTopicNo(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-sm font-medium text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {topicsList.map((t) => (
                      <option key={t.no} value={t.no}>
                        #{t.no} - {t.name} (Thread ID: {t.threadId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--app-text-muted)] mb-1.5">
                    Judul Pesan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PEMBERITAHUAN JADWAL MAINTENANCE"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-sm text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--app-text-muted)] mb-1.5">
                    Isi Pesan (Mendukung Markdown Telegram)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tulis pesan lengkap di sini... Anda dapat menggunakan *tebal*, _miring_, atau `kode`."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-sm font-mono text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || !broadcastMessage.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Mengirim ke Telegram...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim ke Topik #{selectedTopicNo}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Templates Presets */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl">
              <h2 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-amber-500" />
                Template Pesan Cepat (Presets)
              </h2>
              <p className="text-xs text-[var(--app-text-muted)] mb-4">
                Klik salah satu preset untuk mengisi formulir secara instan.
              </p>

              <div className="space-y-2">
                {TEMPLATE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset)}
                    className="w-full text-left p-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] hover:border-blue-500/40 transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--app-text)] group-hover:text-blue-500">
                      <span>{preset.name}</span>
                      <span className="text-[10px] font-mono text-[var(--app-text-muted)]">
                        Topik #{preset.topicNo}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--app-text-muted)] truncate mt-1">
                      {preset.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Integration Instructions Card */}
            <div className="bg-gradient-to-br from-blue-500/5 to-sky-500/5 border border-blue-500/20 p-5 rounded-2xl text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-blue-500 text-sm">
                <ShieldCheck className="w-4 h-4" />
                Arsitektur Operasional Telegram
              </div>
              <p className="text-[var(--app-text-muted)] leading-relaxed">
                Supergroup <strong>AUDIRA ISP | Operations Center</strong> telah dikonfigurasi sebagai Forum dengan 14 topik spesifik. Bot <strong>@AudiraISPBot</strong> memiliki hak akses mengelola topik dan mengirim pesan telemetri tanpa batasan.
              </p>
              <div className="pt-2 border-t border-blue-500/10 flex items-center justify-between text-[11px] font-mono text-[var(--app-text-muted)]">
                <span>Migrated Supergroup:</span>
                <span className="font-bold text-[var(--app-text)]">-1004464075869</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
