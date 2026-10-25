import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
import { API_BASE_URL } from '@/config/api';
import { 
  FileText, 
  Download, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Search,
  Filter,
  XCircle,
  Calendar
} from 'lucide-react';
import jsPDF from 'jspdf';

interface Invoice {
  id: string;
  invoiceNumber: string;
  month: string;
  date?: Date;
  dueDate: string | Date;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  description: string;
  paidAt?: string | Date | null;
  paymentMethod?: string;
  items?: {
    description: string;
    amount: number;
  }[];
}

export default function Invoices() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchInvoices(parsed.id);

    const inet = parsed.internetNumber || parsed.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/invoices`);
    }
  }, [router]);

  const fetchInvoices = async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/customer/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const serverInvoices = result.data || [];
        if (serverInvoices.length > 0) {
          const mapped: Invoice[] = serverInvoices.map((inv: any) => ({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber || `INV-${inv.id.substring(0, 8)}`,
            month: inv.month || new Date(inv.createdAt).toISOString().substring(0, 7),
            date: new Date(inv.createdAt),
            dueDate: new Date(inv.dueDate),
            amount: inv.amount,
            status: (inv.status === 'paid' ? 'PAID' : inv.status === 'unpaid' ? 'PENDING' : 'OVERDUE') as any,
            description: inv.description || 'Tagihan Layanan Internet',
            paidAt: inv.paidAt ? new Date(inv.paidAt) : null,
            paymentMethod: inv.paymentMethod || '-',
            items: [
              { description: inv.description || 'Layanan Internet Fiber', amount: inv.amount }
            ],
          }));
          setInvoices(mapped);
          return;
        }
      }

      // Mock data for preview/demonstration if no server invoices yet
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNumber: 'INV-202512-0001',
          month: '2025-12',
          date: new Date('2025-12-01'),
          amount: 350000,
          dueDate: new Date('2025-12-10'),
          paidAt: null,
          status: 'PENDING',
          description: 'Tagihan Internet Desember 2025',
          items: [
            { description: 'Paket Internet Home 20 Mbps', amount: 350000 },
          ],
        },
        {
          id: '2',
          invoiceNumber: 'INV-202511-0001',
          month: '2025-11',
          date: new Date('2025-11-01'),
          amount: 350000,
          dueDate: new Date('2025-11-10'),
          paidAt: new Date('2025-11-05'),
          status: 'PAID',
          description: 'Tagihan Internet November 2025',
          paymentMethod: 'Virtual Account BCA',
          items: [
            { description: 'Paket Internet Home 20 Mbps', amount: 350000 },
          ],
        },
      ];

      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text('AudiraNET', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Jl. Teknologi No. 123, Jakarta', 20, 28);
    doc.text('Tel: (021) 1234-5678', 20, 33);
    doc.text('Email: billing@audiranet.com', 20, 38);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('INVOICE', 20, 55);

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 65);
    const invoiceDate = invoice.date || new Date(invoice.month + '-01');
    const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : new Date(invoice.dueDate);
    doc.text(`Date: ${invoiceDate.toLocaleDateString('id-ID')}`, 20, 72);
    doc.text(`Due Date: ${dueDate.toLocaleDateString('id-ID')}`, 20, 79);
    
    // Customer Details
    doc.text('Bill To:', 20, 92);
    doc.setFont('helvetica', 'bold');
    doc.text(customer?.name || 'Customer Name', 20, 99);
    doc.setFont('helvetica', 'normal');
    doc.text(customer?.email || 'customer@email.com', 20, 106);
    doc.text(customer?.phone || '+62 123 4567 8900', 20, 113);

    // Status Badge
    if (invoice.status === 'PAID') {
      doc.setFillColor(34, 197, 94); // Green
      doc.setTextColor(255);
      doc.roundedRect(150, 60, 40, 10, 2, 2, 'F');
      doc.text('LUNAS', 160, 67);
      doc.setTextColor(0);
    } else if (invoice.status === 'OVERDUE') {
      doc.setFillColor(239, 68, 68); // Red
      doc.setTextColor(255);
      doc.roundedRect(150, 60, 40, 10, 2, 2, 'F');
      doc.text('JATUH TEMPO', 154, 67);
      doc.setTextColor(0);
    }

    // Table Header
    doc.setFillColor(37, 99, 235);
    doc.rect(20, 125, 170, 10, 'F');
    doc.setTextColor(255);
    doc.text('Deskripsi', 25, 132);
    doc.text('Jumlah', 160, 132);

    // Table Content
    doc.setTextColor(0);
    let y = 142;
    const items = invoice.items || [{ description: invoice.description, amount: invoice.amount }];
    items.forEach((item) => {
      doc.text(item.description, 25, y);
      doc.text(`Rp ${item.amount.toLocaleString('id-ID')}`, 160, y);
      y += 10;
    });

    // Total
    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 25, y);
    doc.text(`Rp ${invoice.amount.toLocaleString('id-ID')}`, 160, y);

    // Payment Info
    if (invoice.status === 'PAID' && invoice.paymentMethod) {
      y += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Metode Pembayaran: ${invoice.paymentMethod}`, 25, y);
      if (invoice.paidAt) {
        y += 7;
        const paidDate = invoice.paidAt instanceof Date ? invoice.paidAt : new Date(invoice.paidAt);
        doc.text(`Tanggal Pembayaran: ${paidDate.toLocaleDateString('id-ID')}`, 25, y);
      }
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Terima kasih atas kepercayaan Anda menggunakan layanan AudiraNET', 105, 280, { align: 'center' });
    doc.text('Dokumen ini dibuat secara otomatis dan sah tanpa tanda tangan', 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  const handlePayment = async (invoice: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const data = await response.json();
      
      if (data.success && data.redirectUrl) {
        // Redirect to payment gateway
        window.location.href = data.redirectUrl;
      } else {
        alert('Gagal membuat pembayaran. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // Open official AUDIRA backend PDF stream (A4 format with official green stamp & digital security seal)
    window.open(`${API_BASE_URL}/billing/invoices/${invoice.id}/receipt-pdf`, '_blank');
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'ALL') return true;
    return inv.status === filter;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-500/40">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          LUNAS
        </span>
      );
    }
    if (status === 'OVERDUE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border border-rose-500/40">
          <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
          JATUH TEMPO
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-500/40">
        <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
        BELUM DIBAYAR
      </span>
    );
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64 font-mono text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Memuat Riwayat Tagihan...</span>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const inetIdentifier = customer?.internetNumber || customer?.id || 'NET-100234';

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                Billing & Payment Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Tagihan & Invoice
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Lihat riwayat invoice resmi, download salinan PDF, dan lakukan pembayaran tagihan internet fiber Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono text-xs">
            <span className="text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold">
              Total Invoice:
            </span>
            <span className="text-base font-black text-cyan-600 dark:text-cyan-400">
              {invoices.length}
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-3.5 shadow-[3px_3px_0px_#000]">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'Semua Tagihan' },
              { id: 'PENDING', label: 'Belum Dibayar' },
              { id: 'PAID', label: 'Lunas' },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                    isActive
                      ? 'bg-cyan-400 text-black border-black shadow-[2px_2px_0px_#000]'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-gray-300 border-slate-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Invoices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 block mb-1">
                      Nomor Dokumen
                    </span>
                    <h3 className="text-base sm:text-lg font-mono font-black text-slate-950 dark:text-white">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                      {invoice.description || 'Tagihan Bulanan Layanan Fiber Optic'}
                    </p>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>

                <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-lg mb-4 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-gray-400">Periode Billing:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{invoice.month}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-gray-400">Batas Jatuh Tempo:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {new Date(invoice.dueDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {invoice.paidAt && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-gray-800">
                      <span className="text-slate-500 dark:text-gray-400">Waktu Pembayaran:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {new Date(invoice.paidAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-gray-800">
                    <span className="text-slate-700 dark:text-gray-300 font-bold uppercase text-[11px]">
                      Total Tagihan:
                    </span>
                    <span className="text-lg sm:text-xl font-black text-cyan-600 dark:text-cyan-400">
                      Rp {invoice.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => handleDownloadPDF(invoice)}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-black dark:border-gray-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  Unduh PDF
                </button>
                {invoice.status === 'PENDING' && (
                  <button
                    onClick={() => handlePayment(invoice)}
                    className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-black bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <CreditCard className="h-4 w-4 stroke-[2.5]" />
                    Bayar via QRIS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-10 sm:p-12 text-center shadow-[4px_4px_0px_#000]">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl border-2 border-black dark:border-gray-700 bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
              <FileText className="h-7 w-7 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase text-slate-950 dark:text-white mb-1">
              Tidak Ada Tagihan Ditemukan
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-mono">
              {filter === 'ALL'
                ? 'Belum ada catatan tagihan untuk akun Anda saat ini.'
                : `Tidak ada tagihan dengan filter status "${filter === 'PAID' ? 'Lunas' : 'Belum Dibayar'}".`}
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
