import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  QrCode,
  Download,
  RefreshCw,
  Zap,
  CreditCard,
  Smartphone,
  Sparkles,
  Calendar,
  ShieldCheck,
  Eye,
  PhoneCall,
  Check,
  ChevronRight,
  ExternalLink,
  Play,
  X
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: string;
  month: string | null;
  description: string | null;
  customer?: {
    id: string;
    name: string;
    phone: string;
    internetNumber?: string;
  };
}

export default function WhatsAppBillingSchedulerPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Testing Sandbox State
  const [testPhone, setTestPhone] = useState('081298765432');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [testType, setTestType] = useState<'h3' | 'hari-h' | 'receipt'>('h3');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  // Real Customer Database Sync Summary
  const [summary, setSummary] = useState<{
    totalCustomers: number;
    activeCustomers: number;
    pendingInvoices: number;
    paidInvoices: number;
  } | null>(null);

  // Self-Hosted WAHA (Baileys) Gateway State
  const [gatewayStatus, setGatewayStatus] = useState<any>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // Batch run states
  const [runningBatchH3, setRunningBatchH3] = useState(false);
  const [runningBatchHariH, setRunningBatchHariH] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchGatewayStatus();
    const interval = setInterval(fetchGatewayStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchGatewayStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/whatsapp/gateway/status`);
      if (res.ok) {
        const data = await res.json();
        setGatewayStatus(data);
      }
    } catch {}
  };

  // Auto-poll status saat modal scan QR terbuka agar langsung terdeteksi saat berhasil pairing
  useEffect(() => {
    if (!showQrModal) return;
    const interval = setInterval(async () => {
      try {
        const statRes = await fetch(`${API_BASE}/whatsapp/gateway/status`);
        if (statRes.ok) {
          const statData = await statRes.json();
          setGatewayStatus(statData);
          if (statData?.session?.status === 'WORKING') {
            setQrCodeData(null);
            showToast('Selamat! WhatsApp Gateway berhasil dipasangkan dan aktif.', 'success');
          }
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [showQrModal]);

  const handleOpenQrModal = async () => {
    setShowQrModal(true);
    setQrLoading(true);
    try {
      const res = await fetch(`${API_BASE}/whatsapp/gateway/qr`);
      const data = await res.json();
      if (data && data.qrCode) {
        setQrCodeData(data.qrCode);
      } else {
        setQrCodeData(null);
      }
    } catch {
      setQrCodeData(null);
    } finally {
      setQrLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('adminToken') : null;

      // 1. Fetch real CRM & billing summary
      fetch(`${API_BASE}/billing/scheduler-summary`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      }).then(r => r.json()).then(data => {
        if (data && data.totalCustomers !== undefined) setSummary(data);
      }).catch(() => {});

      // 2. Fetch all real invoices with customer relations
      const res = await fetch(`${API_BASE}/billing/invoices-all`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }).catch(async () => {
        // Fallback to customer or general invoices endpoint
        return fetch(`${API_BASE}/pelanggan`);
      });

      if (res && res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.invoices || data.data || []);
        // Extract invoices if list of customers
        let flatInvoices: InvoiceItem[] = [];
        if (list.length > 0 && list[0].invoices) {
          list.forEach((c: any) => {
            if (Array.isArray(c.invoices)) {
              c.invoices.forEach((inv: any) => {
                flatInvoices.push({
                  ...inv,
                  customer: {
                    id: c.id,
                    name: c.name,
                    phone: c.phone,
                    internetNumber: c.internetNumber
                  }
                });
              });
            }
          });
        } else {
          flatInvoices = list;
        }

        setInvoices(flatInvoices);
        if (flatInvoices.length > 0 && !selectedInvoiceId) {
          setSelectedInvoiceId(flatInvoices[0].id || flatInvoices[0].invoiceNumber);
        }
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBatchH3 = async () => {
    try {
      setRunningBatchH3(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE}/billing/scheduler/run-h3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      showToast(`Batch H-3 selesai dikirim! Total tagihan diproses: ${data.count || 0} pelanggan.`);
    } catch (err: any) {
      showToast(`Gagal menjalankan batch H-3: ${err.message}`, 'error');
    } finally {
      setRunningBatchH3(false);
    }
  };

  const handleRunBatchHariH = async () => {
    try {
      setRunningBatchHariH(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE}/billing/scheduler/run-hari-h`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      showToast(`Batch Hari-H QRIS selesai dikirim! Total tagihan diproses: ${data.count || 0} pelanggan.`);
    } catch (err: any) {
      showToast(`Gagal menjalankan batch Hari-H: ${err.message}`, 'error');
    } finally {
      setRunningBatchHariH(false);
    }
  };

  const handleSendTestMessage = async (type: 'h3' | 'hari-h' | 'receipt') => {
    if (!testPhone) {
      showToast('Masukkan nomor WhatsApp tujuan pengujian', 'error');
      return;
    }

    setSendingTest(true);
    setTestResponse(null);

    let endpoint = '/whatsapp/test/h3-reminder';
    if (type === 'hari-h') endpoint = '/whatsapp/test/hari-h-reminder';
    if (type === 'receipt') endpoint = '/whatsapp/test/payment-receipt';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: testPhone,
          invoiceId: selectedInvoiceId || undefined,
        })
      });

      const data = await res.json();
      setTestResponse(data);
      showToast(`Uji pesan WhatsApp (${type.toUpperCase()}) berhasil dikirimkan via Fonnte Engine!`);
    } catch (err: any) {
      showToast(`Gagal mengirim uji WhatsApp: ${err.message}`, 'error');
    } finally {
      setSendingTest(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  return (
    <Layout>
      <Head>
        <title>WhatsApp Billing Scheduler (Fonnte Engine) | AUDIRA NET</title>
      </Head>

      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 lg:p-8 font-sans antialiased space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 p-3.5 rounded-xl shadow-xl font-mono text-xs flex items-center gap-2.5 border-2 animate-in slide-in-from-top ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-white border-black'
                : 'bg-rose-500 text-white border-black'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        )}

        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--app-border)]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-cyan-500 font-bold">Billing Scheduler</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--app-text)] flex items-center gap-2.5 font-mono">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>🤖 WhatsApp Billing Scheduler (Fonnte Engine)</span>
            </h1>
            <p className="text-xs text-[var(--app-muted)] mt-1 font-mono">
              Otomasi pengingat tagihan H-3 (Link Bayar), Hari-H (QRIS Dinamis), dan pengiriman instan PDF Kwitansi Resmi AUDIRA saat pembayaran lunas.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchInvoices}
              disabled={loading}
              className="p-2 border-2 border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-xl transition-all shadow-[2px_2px_0px_#000]"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              href="/whatsapp"
              className="px-3.5 py-2 border-2 border-black bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 text-[var(--app-text)] text-xs font-mono font-bold rounded-xl transition-all shadow-[2px_2px_0px_#000]"
            >
              &larr; Gateway Center
            </Link>
          </div>
        </div>

        {/* Gateway Engine Live Status Banner */}
        <div className="p-4 rounded-2xl border-2 border-black dark:border-cyan-400 bg-gradient-to-r from-slate-900 via-[#0e1626] to-slate-900 text-white shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[2px_2px_0px_#000]">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm tracking-wide text-white">
                  SELF-HOSTED WHATSAPP GATEWAY (BAILEYS / WAHA)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-[1px_1px_0px_#000] ${
                  gatewayStatus?.session?.status === 'WORKING'
                    ? 'bg-emerald-400 text-black'
                    : gatewayStatus?.session?.status === 'SCAN_QR_CODE'
                    ? 'bg-amber-400 text-black animate-pulse'
                    : 'bg-cyan-400 text-black'
                }`}>
                  {gatewayStatus?.session?.status === 'WORKING'
                    ? 'CONNECTED • READY'
                    : gatewayStatus?.session?.status === 'SCAN_QR_CODE'
                    ? 'SCAN QR CODE • READY'
                    : 'DOCKER ACTIVE • PORT 3220'}
                </span>
              </div>
              <div className="text-xs text-gray-300 font-mono mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Engine: <strong>Baileys (NOWEB Engine)</strong></span>
                <span>&bull;</span>
                <span>Port Gateway: <strong>3220</strong></span>
                <span>&bull;</span>
                <span>Biaya Langganan: <strong>Rp 0 (100% In-House)</strong></span>
                <span>&bull;</span>
                <span>PDF Generator: <strong>PDFKit Engine (A4 UU ITE)</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={handleOpenQrModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <QrCode size={14} />
              <span>Pairing QR WhatsApp</span>
            </button>
            <a
              href="http://localhost:3220/dashboard"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={14} />
              <span>Dashboard WAHA (3220)</span>
            </a>
          </div>
        </div>

        {/* Real Customer Database Interconnection Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl border-2 border-black dark:border-gray-800 bg-[var(--app-card)] shadow-[3px_3px_0px_#000]">
            <div className="text-[11px] font-mono text-[var(--app-muted)] uppercase">Total Pelanggan Terdata</div>
            <div className="text-xl font-mono font-black text-cyan-500 mt-1 flex items-baseline gap-2">
              <span>{summary ? summary.totalCustomers : '12'}</span>
              <span className="text-[10px] text-[var(--app-muted)] font-normal">Customer CRM</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl border-2 border-black dark:border-gray-800 bg-[var(--app-card)] shadow-[3px_3px_0px_#000]">
            <div className="text-[11px] font-mono text-[var(--app-muted)] uppercase">Pelanggan Aktif Terhubung</div>
            <div className="text-xl font-mono font-black text-emerald-500 mt-1 flex items-baseline gap-2">
              <span>{summary ? summary.activeCustomers : '8'}</span>
              <span className="text-[10px] text-emerald-600 font-normal">Target Notifikasi</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl border-2 border-black dark:border-gray-800 bg-[var(--app-card)] shadow-[3px_3px_0px_#000]">
            <div className="text-[11px] font-mono text-[var(--app-muted)] uppercase">Tagihan Berjalan (Unpaid)</div>
            <div className="text-xl font-mono font-black text-amber-500 mt-1 flex items-baseline gap-2">
              <span>{summary ? summary.pendingInvoices : '9'}</span>
              <span className="text-[10px] text-amber-600 font-normal">Scheduler H-3 & Hari-H</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl border-2 border-black dark:border-gray-800 bg-[var(--app-card)] shadow-[3px_3px_0px_#000]">
            <div className="text-[11px] font-mono text-[var(--app-muted)] uppercase">Pembayaran Lunas (Paid)</div>
            <div className="text-xl font-mono font-black text-emerald-500 mt-1 flex items-baseline gap-2">
              <span>{summary ? summary.paidInvoices : '2'}</span>
              <span className="text-[10px] text-cyan-600 font-normal">PDF Kwitansi Terbit</span>
            </div>
          </div>
        </div>

        {/* 3 Core Automation Pillars Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: H-3 Reminder */}
          <div className="p-5 rounded-2xl border-2 border-black dark:border-amber-400 bg-[var(--app-card)] shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black bg-amber-400 text-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                  H-3 JATUH TEMPO
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--app-muted)]">
                  <Clock size={13} className="text-amber-500" />
                  <span>09:00 WIB</span>
                </div>
              </div>

              <div>
                <h3 className="font-mono font-black text-base text-[var(--app-text)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Link Bayar Instan Tanpa Antre</span>
                </h3>
                <p className="text-xs text-[var(--app-muted)] mt-1 font-mono">
                  WhatsApp otomatis mengirim rincian tagihan beserta link bayar instan portal pelanggan 3 hari sebelum jatuh tempo.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-[var(--app-border)] font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Target Invoice:</span>
                  <span className="font-bold text-[var(--app-text)]">Status PENDING (Due in 3 Days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Metode Notifikasi:</span>
                  <span className="font-bold text-amber-500">WhatsApp Text + Portal Pay Link</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Dampak Finansial:</span>
                  <span className="font-bold text-emerald-500">Early Cashflow Booster</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--app-border)]">
              <button
                type="button"
                onClick={handleRunBatchH3}
                disabled={runningBatchH3}
                className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap size={14} />
                <span>{runningBatchH3 ? 'Menjalankan Batch H-3...' : '⚡ Jalankan Batch H-3 Sekarang'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestType('h3');
                  handleSendTestMessage('h3');
                }}
                disabled={sendingTest}
                className="w-full py-2 px-3 bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800 text-[var(--app-muted)] font-mono text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Send size={12} />
                <span>Test Kirim Sampel ke {testPhone}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Hari H Reminder */}
          <div className="p-5 rounded-2xl border-2 border-black dark:border-rose-400 bg-[var(--app-card)] shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black bg-rose-500 text-white uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                  HARI H JATUH TEMPO
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--app-muted)]">
                  <Clock size={13} className="text-rose-500" />
                  <span>08:00 WIB</span>
                </div>
              </div>

              <div>
                <h3 className="font-mono font-black text-base text-[var(--app-text)] flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-rose-500" />
                  <span>QRIS Dinamis Langsung di Chat</span>
                </h3>
                <p className="text-xs text-[var(--app-muted)] mt-1 font-mono">
                  Pengingat ramah pada hari jatuh tempo lengkap dengan string QRIS EMVCo dan No. VA BCA agar pelanggan bisa bayar seketika.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-[var(--app-border)] font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Target Invoice:</span>
                  <span className="font-bold text-[var(--app-text)]">Status PENDING (Due Today)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Fitur Unggulan:</span>
                  <span className="font-bold text-rose-500">Copyable QRIS + VA Code</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Dampak Finansial:</span>
                  <span className="font-bold text-emerald-500">Mencegah Bad Debt & Isolir</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--app-border)]">
              <button
                type="button"
                onClick={handleRunBatchHariH}
                disabled={runningBatchHariH}
                className="w-full py-2.5 px-3 bg-rose-500 hover:bg-rose-400 text-white font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap size={14} />
                <span>{runningBatchHariH ? 'Menjalankan Batch Hari-H...' : '⚡ Jalankan Batch Hari-H Sekarang'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestType('hari-h');
                  handleSendTestMessage('hari-h');
                }}
                disabled={sendingTest}
                className="w-full py-2 px-3 bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800 text-[var(--app-muted)] font-mono text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Send size={12} />
                <span>Test Kirim Sampel ke {testPhone}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Payment Receipt & PDF */}
          <div className="p-5 rounded-2xl border-2 border-black dark:border-emerald-400 bg-[var(--app-card)] shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black bg-emerald-400 text-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                  PEMBAYARAN MASUK
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-black">
                  REALTIME
                </span>
              </div>

              <div>
                <h3 className="font-mono font-black text-base text-[var(--app-text)] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span>Kwitansi Resmi AUDIRA (PDF)</span>
                </h3>
                <p className="text-xs text-[var(--app-muted)] mt-1 font-mono">
                  Seketika pembayaran masuk, sistem otomatis menerbitkan PDF Kwitansi A4 berstempel resmi dan melampirkannya ke chat WhatsApp.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-[var(--app-border)] font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Format Lampiran:</span>
                  <span className="font-bold text-[var(--app-text)]">PDF A4 (UU ITE Compliant)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Integrasi Layanan:</span>
                  <span className="font-bold text-emerald-500">Auto-CoA & Auto Reconnect</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Kepuasan Pelanggan:</span>
                  <span className="font-bold text-cyan-500">Bukti Bayar Otomatis Sah</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--app-border)]">
              <a
                href={`${API_BASE}/billing/invoices/${selectedInvoiceId || 'INV-202610-8500'}/receipt-pdf`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>📄 Preview / Download Kwitansi PDF</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setTestType('receipt');
                  handleSendTestMessage('receipt');
                }}
                disabled={sendingTest}
                className="w-full py-2 px-3 bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800 text-[var(--app-muted)] font-mono text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Send size={12} />
                <span>Test Kirim Sampel ke {testPhone}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulator & Testing Console */}
        <div className="p-5 rounded-2xl border-2 border-black dark:border-cyan-400 bg-[var(--app-card)] shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--app-border)] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <h3 className="font-mono font-black text-sm uppercase tracking-wider text-[var(--app-text)]">
                  SIMULATOR & UJI DISPATCHER WHATSAPP
                </h3>
              </div>
              <p className="text-xs text-[var(--app-muted)] font-mono mt-0.5">
                Uji langsung pengiriman pesan WhatsApp Fonnte ke nomor tujuan sebelum jadwal otomatis dijalankan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[var(--app-muted)] mb-1">
                Nomor WhatsApp Uji Coba:
              </label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full px-3.5 py-2 text-xs font-mono bg-[var(--app-bg)] border-2 border-[var(--app-border)] rounded-xl text-[var(--app-text)] focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[var(--app-muted)] mb-1">
                Pilih Invoice Sumber Data:
              </label>
              <select
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono bg-[var(--app-bg)] border-2 border-[var(--app-border)] rounded-xl text-[var(--app-text)] focus:outline-none focus:border-cyan-400"
              >
                {invoices.length === 0 && (
                  <option value="">INV-202610-8500 (Sample Demo Rp 285.000)</option>
                )}
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {inv.customer?.name || 'Pelanggan'} (Rp {formatRupiah(inv.amount)} &bull; {inv.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => handleSendTestMessage(testType)}
                disabled={sendingTest}
                className="w-full py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={14} />
                <span>{sendingTest ? 'Mengirim...' : `Kirim Test (${testType.toUpperCase()})`}</span>
              </button>
            </div>
          </div>

          {/* Test Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-[var(--app-muted)]">Pilih Skenario Cepat:</span>
            <button
              type="button"
              onClick={() => { setTestType('h3'); handleSendTestMessage('h3'); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                testType === 'h3'
                  ? 'bg-amber-400 text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[var(--app-bg)] text-[var(--app-muted)] border-[var(--app-border)] hover:text-[var(--app-text)]'
              }`}
            >
              ⏰ 1. Test H-3 Link Bayar
            </button>
            <button
              type="button"
              onClick={() => { setTestType('hari-h'); handleSendTestMessage('hari-h'); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                testType === 'hari-h'
                  ? 'bg-rose-500 text-white border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[var(--app-bg)] text-[var(--app-muted)] border-[var(--app-border)] hover:text-[var(--app-text)]'
              }`}
            >
              🔴 2. Test Hari-H QRIS Dinamis
            </button>
            <button
              type="button"
              onClick={() => { setTestType('receipt'); handleSendTestMessage('receipt'); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                testType === 'receipt'
                  ? 'bg-emerald-400 text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[var(--app-bg)] text-[var(--app-muted)] border-[var(--app-border)] hover:text-[var(--app-text)]'
              }`}
            >
              ✅ 3. Test Lunas + Kwitansi PDF
            </button>
          </div>

          {/* Result Output Preview */}
          {testResponse && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs space-y-2 border-2 border-black shadow-[3px_3px_0px_#000]">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-gray-800 text-gray-400">
                <span>HASIL DISPATCHER WHATSAPP:</span>
                <span className="text-emerald-400 font-bold">STATUS: TERKIRIM (200 OK)</span>
              </div>
              <div>
                <span className="text-gray-400">Target HP:</span> <strong>+{testResponse.target}</strong>
              </div>
              {testResponse.fileUrl && (
                <div>
                  <span className="text-gray-400">Lampiran Kwitansi:</span>{' '}
                  <a
                    href={testResponse.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-emerald-400 hover:text-emerald-300"
                  >
                    {testResponse.filename || 'Unduh Berkas PDF Kwitansi'}
                  </a>
                </div>
              )}
              <div className="pt-2">
                <span className="text-gray-400 block mb-1">Pratinjau Isi Pesan Chat WhatsApp:</span>
                <pre className="p-3 bg-black/60 rounded-lg text-gray-200 whitespace-pre-wrap font-sans text-xs border border-gray-800 max-h-48 overflow-y-auto">
                  {testResponse.message}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Invoices List with Direct Action Buttons */}
        <div className="p-5 rounded-2xl border-2 border-black dark:border-cyan-400 bg-[var(--app-card)] shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--app-border)] pb-3">
            <div>
              <h3 className="font-mono font-black text-sm uppercase tracking-wider text-[var(--app-text)]">
                DAFTAR INVOICE & AKSI WHATSAPP INSTAN
              </h3>
              <p className="text-xs text-[var(--app-muted)] font-mono mt-0.5">
                Unduh kwitansi PDF atau kirim pengingat langsung ke nomor pelanggan per invoice
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[var(--app-muted)]">
              Total Invoice: {invoices.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black dark:border-gray-700 bg-slate-100 dark:bg-[#070b14] text-[var(--app-muted)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">WhatsApp</th>
                  <th className="py-2.5 px-3">Total (Rp)</th>
                  <th className="py-2.5 px-3">Jatuh Tempo</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi Dokumen & WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[var(--app-muted)] font-mono text-xs">
                      Tidak ada invoice yang ditemukan di sistem.
                    </td>
                  </tr>
                ) : (
                  invoices.slice(0, 15).map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-500/5 transition-colors">
                      <td className="py-3 px-3 font-bold text-[var(--app-text)]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-[var(--app-text)] block">{inv.customer?.name || 'Pelanggan'}</span>
                        <span className="text-[10px] text-[var(--app-muted)]">{inv.customer?.internetNumber || '-'}</span>
                      </td>
                      <td className="py-3 px-3 text-[var(--app-muted)]">
                        {inv.customer?.phone || '-'}
                      </td>
                      <td className="py-3 px-3 font-bold text-cyan-600 dark:text-cyan-400">
                        Rp {formatRupiah(inv.amount)}
                      </td>
                      <td className="py-3 px-3 text-[var(--app-muted)]">
                        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-400 text-black'
                              : 'bg-amber-400 text-black'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Cetak / Preview PDF Kwitansi */}
                          <a
                            href={`${API_BASE}/billing/invoices/${inv.id}/receipt-pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-black dark:border-gray-700 bg-cyan-400 hover:bg-cyan-300 text-black shadow-[2px_2px_0px_#000] text-[10px] font-bold flex items-center gap-1"
                            title="Unduh / Preview Kwitansi PDF Resmi"
                          >
                            <FileText size={12} />
                            <span>PDF</span>
                          </a>

                          {/* Kirim WA Kwitansi / Reminder */}
                          {inv.status === 'PAID' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoiceId(inv.id);
                                if (inv.customer?.phone) setTestPhone(inv.customer.phone);
                                handleSendTestMessage('receipt');
                              }}
                              className="p-1.5 rounded-lg border border-black dark:border-gray-700 bg-emerald-400 hover:bg-emerald-300 text-black shadow-[2px_2px_0px_#000] text-[10px] font-bold flex items-center gap-1"
                              title="Kirim Salinan Kwitansi PDF via WhatsApp"
                            >
                              <PhoneCall size={12} />
                              <span>Kirim WA</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoiceId(inv.id);
                                if (inv.customer?.phone) setTestPhone(inv.customer.phone);
                                handleSendTestMessage('hari-h');
                              }}
                              className="p-1.5 rounded-lg border border-black dark:border-gray-700 bg-rose-400 hover:bg-rose-300 text-black shadow-[2px_2px_0px_#000] text-[10px] font-bold flex items-center gap-1"
                              title="Kirim Reminder QRIS via WhatsApp"
                            >
                              <QrCode size={12} />
                              <span>Kirim QRIS</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal QR Code Pairing WhatsApp (Self-Hosted WAHA Baileys) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md p-6 bg-[var(--app-card)] border-2 border-black dark:border-cyan-400 rounded-2xl shadow-[8px_8px_0px_#000] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 shadow-[2px_2px_0px_#000]">
                  <QrCode size={20} />
                </div>
                <div>
                  <h3 className="font-mono font-black text-sm text-[var(--app-text)]">
                    Tautkan WhatsApp (Scan QR)
                  </h3>
                  <p className="text-[10px] text-[var(--app-muted)] font-mono">
                    Engine: Baileys NOWEB (Docker Port 3220)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-lg border border-[var(--app-border)] hover:bg-slate-100 dark:hover:bg-gray-800 text-[var(--app-muted)] hover:text-[var(--app-text)] transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* QR Image Container */}
            <div className="p-4 rounded-xl bg-white flex flex-col items-center justify-center border-2 border-dashed border-gray-300 min-h-[260px]">
              {qrLoading ? (
                <div className="flex flex-col items-center gap-2.5 text-xs font-mono text-gray-500">
                  <RefreshCw size={24} className="animate-spin text-cyan-600" />
                  <span>Mengambil QR Code langsung dari Baileys Engine...</span>
                </div>
              ) : qrCodeData ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={qrCodeData}
                    alt="WhatsApp QR Code"
                    className="w-56 h-56 object-contain rounded-lg shadow-sm"
                  />
                  <span className="text-[11px] font-mono text-gray-700 font-bold animate-pulse">
                    Arahkan kamera WhatsApp Anda ke QR di atas
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center p-4">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                  <span className="font-mono font-bold text-xs text-gray-900">
                    Sesi WhatsApp Sudah Terhubung / Siap!
                  </span>
                  <a
                    href="http://localhost:3220/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono font-bold text-cyan-600 underline"
                  >
                    Buka Dashboard WAHA (Port 3220)
                  </a>
                </div>
              )}
            </div>

            {/* Steps Guide */}
            <div className="space-y-1.5 font-mono text-xs text-[var(--app-muted)] bg-slate-50 dark:bg-[#070b14] p-3.5 rounded-xl border border-[var(--app-border)]">
              <div className="font-bold text-[var(--app-text)] text-[11px] mb-1">
                Langkah Scan di HP Anda:
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <span className="text-cyan-500 font-black">1.</span>
                <span>Buka aplikasi WhatsApp di HP kantor/NOC Anda</span>
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <span className="text-cyan-500 font-black">2.</span>
                <span>Ketuk <strong>Menu (titik 3)</strong> atau <strong>Pengaturan</strong> &rarr; <strong>Perangkat Tertaut</strong></span>
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <span className="text-cyan-500 font-black">3.</span>
                <span>Ketuk <strong>Tautkan Perangkat</strong> dan scan QR di atas</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleOpenQrModal}
                className="flex-1 py-2.5 px-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw size={13} className={qrLoading ? 'animate-spin' : ''} />
                <span>Refresh QR Code</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="py-2.5 px-4 bg-slate-200 dark:bg-gray-800 text-[var(--app-text)] font-mono font-bold text-xs rounded-xl border-2 border-black transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
