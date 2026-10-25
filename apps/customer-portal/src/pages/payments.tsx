import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  QrCode, 
  CheckCircle, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';

export default function Payments() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState('qris');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('customer');
    if (!raw) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(raw);
    setCustomer(parsed);
    const inet = parsed.internetNumber || parsed.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/payments`);
    }
  }, [router]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS Auto-Confirm',
      icon: QrCode,
      description: 'BCA, GoPay, OVO, ShopeePay, Dana, LinkAja',
      tag: 'INSTAN 24/7',
      tagColor: 'bg-cyan-400 text-black',
    },
    {
      id: 'bank_transfer',
      name: 'Virtual Account & Transfer Bank',
      icon: Building2,
      description: 'BCA, Mandiri, BNI, BRI, Permata Bank',
      tag: 'OTOMATIS',
      tagColor: 'bg-emerald-400 text-black',
    },
    {
      id: 'ewallet',
      name: 'Dompet Digital (E-Wallet)',
      icon: Smartphone,
      description: 'Langsung redirect ke aplikasi GoPay / OVO',
      tag: 'POPULER',
      tagColor: 'bg-amber-400 text-black',
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit / Debit',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB, American Express',
      tag: '3D SECURE',
      tagColor: 'bg-purple-400 text-black',
    },
  ];

  const recentPayments = [
    {
      id: '1',
      invoiceNumber: 'INV-202511-0001',
      amount: 300000,
      method: 'QRIS Dynamic QR',
      status: 'success',
      date: '2025-11-03',
    },
    {
      id: '2',
      invoiceNumber: 'INV-202510-0001',
      amount: 300000,
      method: 'Transfer Bank BCA',
      status: 'success',
      date: '2025-10-02',
    },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Payment Gateway & Saluran Pembayaran
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Metode Pembayaran
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Pilih kanal pembayaran resmi untuk aktivasi otomatis tagihan internet fiber optik Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              Verifikasi Otomatis Terhubung NOC
            </span>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <h2 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white mb-4">
            Pilihan Jalur Pembayaran
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-5 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 shadow-[3px_3px_0px_#000]'
                      : 'border-black dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg border border-black bg-cyan-400 text-black flex items-center justify-center font-bold">
                      <Icon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-black ${method.tagColor}`}>
                      {method.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-sm uppercase text-slate-950 dark:text-white mb-1">
                      {method.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bank & VA Account Details */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <h2 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white mb-1">
            Rekening Resmi PT Audira Sukses Mandiri
          </h2>
          <p className="text-xs text-slate-600 dark:text-gray-400 mb-5">
            Gunakan nomor rekening atau virtual account resmi di bawah ini:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border-2 border-black dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-black text-xs">
                    BCA
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-gray-400 font-bold">
                    Bank Central Asia
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-gray-400 font-bold block">
                    Nomor Rekening
                  </span>
                  <p className="text-xl font-mono font-black text-slate-950 dark:text-white">
                    821-1200-1600
                  </p>
                  <p className="text-xs font-mono text-slate-600 dark:text-gray-400">
                    A/N: PT Audira Sukses Mandiri
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard('82112001600', 'bca')}
                className="mt-4 px-3 py-1.5 rounded-lg border border-black dark:border-gray-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5"
              >
                {copiedAccount === 'bca' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount === 'bca' ? 'Tersalin!' : 'Salin Nomor Rekening'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border-2 border-black dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded bg-indigo-900 text-white font-black text-xs">
                    MANDIRI
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-gray-400 font-bold">
                    Bank Mandiri
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-gray-400 font-bold block">
                    Nomor Rekening
                  </span>
                  <p className="text-xl font-mono font-black text-slate-950 dark:text-white">
                    109-00-8211200-1
                  </p>
                  <p className="text-xs font-mono text-slate-600 dark:text-gray-400">
                    A/N: PT Audira Sukses Mandiri
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard('1090082112001', 'mandiri')}
                className="mt-4 px-3 py-1.5 rounded-lg border border-black dark:border-gray-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5"
              >
                {copiedAccount === 'mandiri' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount === 'mandiri' ? 'Tersalin!' : 'Salin Nomor Rekening'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 rounded-xl text-xs text-amber-900 dark:text-amber-300 font-mono">
            <strong>Catatan Penting:</strong> Untuk pembayaran via QRIS dan Virtual Account, invoice akan otomatis terverifikasi dan layanan langsung diaktifkan tanpa konfirmasi manual.
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-gray-800">
            <h2 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Riwayat Pembayaran Berhasil
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-100 dark:bg-[#070b14] border-b border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">No. Invoice</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Metode</th>
                  <th className="px-5 py-3">Jumlah</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-gray-400">
                      {new Date(payment.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-gray-400">
                      {payment.method}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-400/40">
                        <CheckCircle className="h-3 w-3" />
                        Sukses
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
