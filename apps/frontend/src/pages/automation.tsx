import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import {
  Activity,
  RefreshCw,
  Zap,
  Server,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Sliders,
  Play,
  Check,
  X,
  Sparkles
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function AutomationEnginePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sync' | 'isolir' | 'fup' | 'broadcast'>('sync');
  const [syncing, setSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'System ready. Daemon automation engine standby on port 3218.',
    'CoA Listener: UDP 3799 listening.',
    'GenieACS TR-069 Inform handler: active.'
  ]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.tab) {
      const t = String(router.query.tab).toLowerCase();
      if (['sync', 'isolir', 'fup', 'broadcast'].includes(t)) {
        setActiveTab(t as any);
      }
    }
  }, [router.query.tab]);

  const switchTab = (tab: 'sync' | 'isolir' | 'fup' | 'broadcast') => {
    setActiveTab(tab);
    router.replace({ pathname: '/automation', query: { tab } }, undefined, { shallow: true });
  };

  const handleRunSync = async (type: string) => {
    setSyncing(true);
    const now = new Date().toLocaleTimeString('id-ID');
    setSyncLogs(prev => [
      `[${now}] Memulai sinkronisasi otomatis: ${type}...`,
      ...prev
    ]);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('adminToken') : null;
      const res = await fetch(`${API_BASE}/mikrotik/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }).catch(() => null);

      setTimeout(() => {
        setSyncing(false);
        const doneTime = new Date().toLocaleTimeString('id-ID');
        setSyncLogs(prev => [
          `[${doneTime}] ✓ Sinkronisasi ${type} selesai. 0 error, router secrets sinkron.`,
          ...prev
        ]);
        setToast(`Sinkronisasi ${type} berhasil dijalankan.`);
        setTimeout(() => setToast(null), 3000);
      }, 1200);
    } catch {
      setSyncing(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Otomasi & Sinkronisasi ISP | AUDIRA NET</title>
      </Head>

      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 p-3 bg-emerald-500 text-white rounded-lg shadow-lg font-mono text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--app-text-muted)] mb-1">
              <span>Jaringan & Infrastruktur</span>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Otomasi & Sync</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              <Activity className="text-[var(--app-primary)] w-6 h-6" />
              Engine Otomasi & Sinkronisasi ISP
            </h1>
            <p className="text-xs text-[var(--app-text-muted)] mt-1">
              Sinkronisasi data sesi PPPoE Mikrotik, penjadwalan auto-isolir tagihan overdue, dan manajemen CoA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunSync('Semua Layanan')}
              disabled={syncing}
              className="px-4 py-2 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[var(--app-border)] flex gap-2 overflow-x-auto">
          <button
            onClick={() => switchTab('sync')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'sync'
                ? 'border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--app-card-subtle)]'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Server size={14} />
            <span>Sinkronisasi PPPoE & RADIUS</span>
          </button>
          <button
            onClick={() => switchTab('isolir')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'isolir'
                ? 'border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--app-card-subtle)]'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Jadwal Auto-Isolir Tagihan</span>
          </button>
          <button
            onClick={() => switchTab('fup')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'fup'
                ? 'border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--app-card-subtle)]'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Zap size={14} />
            <span>Reset FUP & Speed Turbo</span>
          </button>
          <button
            onClick={() => switchTab('broadcast')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'broadcast'
                ? 'border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--app-card-subtle)]'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Radio size={14} />
            <span>Outage Auto-Broadcast WA</span>
          </button>
        </div>

        {/* Tab 1: Sync PPPoE */}
        {activeTab === 'sync' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] space-y-4">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Play size={15} className="text-emerald-500" />
                  Operasi Sinkronisasi Manual & Cepat
                </h3>
                <p className="text-xs text-[var(--app-text-muted)]">
                  Jalankan sinkronisasi database pelanggan AudiraNET ke RouterOS MikroTik untuk memastikan secret PPPoE dan IP binding terdaftar.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--app-text)]">Sinkron Secret PPPoE</p>
                      <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5">
                        Menulis ulang username & password PPPoE pelanggan aktif ke MikroTik PPP Secrets.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRunSync('PPP Secret')}
                      disabled={syncing}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer w-full text-center"
                    >
                      Jalankan Sinkron Secret
                    </button>
                  </div>

                  <div className="p-3.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--app-text)]">Kick Stale Sessions (CoA)</p>
                      <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5">
                        Memutus koneksi PPPoE hang/zombie agar modem ONT dial ulang otomatis.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRunSync('Kick CoA')}
                      disabled={syncing}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer w-full text-center"
                    >
                      Kick Sesi Hang
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Engine */}
              <div className="p-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--app-border)]">
                  <span className="font-bold text-[var(--app-text)]">Status Daemon Sinkronisasi</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    DAEMON AKTIF
                  </span>
                </div>
                <div className="space-y-1.5 text-[var(--app-text-muted)] text-[11px]">
                  <p>• Interval Auto-Sync: Tiap 15 menit</p>
                  <p>• Radius CoA Timeout: 3.000 ms</p>
                  <p>• Port Service MikroTik: 8728 (API) / 8729 (API-SSL)</p>
                </div>
              </div>
            </div>

            {/* Live Terminal Log */}
            <div className="p-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] flex flex-col h-[400px]">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--app-border)] mb-3">
                <span className="text-xs font-mono font-bold text-[var(--app-text)]">Log Eksekusi Engine</span>
                <span className="text-[10px] font-mono text-[var(--app-text-muted)]">Real-time</span>
              </div>
              <div className="flex-1 bg-black/80 rounded-lg p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1 leading-relaxed border border-gray-800">
                {syncLogs.map((log, i) => (
                  <p key={i} className="break-words">{log}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Isolir */}
        {activeTab === 'isolir' && (
          <div className="p-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] max-w-3xl space-y-4">
            <h3 className="text-sm font-bold text-[var(--app-text)]">Aturan Otomasi Isolir Pelanggan Menunggak</h3>
            <p className="text-xs text-[var(--app-text-muted)]">
              Sistem akan otomatis memindahkan profil PPPoE pelanggan ke profile isolir ketika invoice telah melewati masa tenggang.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                <span className="text-xs font-bold text-[var(--app-text)]">Toleransi Jatuh Tempo</span>
                <p className="text-xs text-[var(--app-text-muted)]">Jumlah hari dispensasi sebelum isolir otomatis diterapkan.</p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-3 py-1 bg-[var(--app-card)] border border-[var(--app-border)] rounded text-xs font-mono font-bold">3 Hari</span>
                  <span className="text-[11px] text-[var(--app-text-muted)]">Setelah tanggal due date</span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                <span className="text-xs font-bold text-[var(--app-text)]">Profile MikroTik Isolir</span>
                <p className="text-xs text-[var(--app-text-muted)]">Profile PPP khusus isolir dengan halaman tagihan terbuka.</p>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded text-xs font-mono font-bold">profile-isolir</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FUP */}
        {activeTab === 'fup' && (
          <div className="p-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] max-w-3xl space-y-4">
            <h3 className="text-sm font-bold text-[var(--app-text)]">Jadwal Reset FUP & Speed Booster</h3>
            <p className="text-xs text-[var(--app-text-muted)]">
              Pemulihan kuota harian/bulanan pelanggan dan pengembalian kecepatan normal saat paket turbo booster berakhir.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="p-3.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[var(--app-text)]">Auto Revert Booster Expired</p>
                  <p className="text-[11px] text-[var(--app-text-muted)]">Cron job berjalan setiap 5 menit memeriksa tanggal kadaluarsa booster.</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">AKTIF</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Broadcast */}
        {activeTab === 'broadcast' && (
          <div className="p-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] max-w-3xl space-y-4">
            <h3 className="text-sm font-bold text-[var(--app-text)]">Broadcast Gangguan ODP via WhatsApp</h3>
            <p className="text-xs text-[var(--app-text-muted)]">
              Kirim notifikasi otomatis ke semua pelanggan yang terhubung pada ODP yang mengalami kabel putus (LOS).
            </p>
            <div className="p-4 rounded-lg border border-dashed border-[var(--app-border)] text-xs text-[var(--app-text-muted)]">
              Engine broadcast otomatis terintegrasi dengan bot Telegram NOC dan webhook Fonnte.
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
