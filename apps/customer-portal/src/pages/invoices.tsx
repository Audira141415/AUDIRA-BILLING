import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
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
  }, [router]);

  const fetchInvoices = async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mock data for now (replace with actual API call)
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
      const response = await fetch('http://localhost:4000/billing/create-payment', {
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
    generatePDF(invoice);
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'ALL') return true;
    return inv.status === filter;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Lunas
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-4 w-4 mr-1" />
        Belum Dibayar
      </span>
    );
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tagihan</h1>
            <p className="text-gray-600">Kelola tagihan dan pembayaran Anda</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'PENDING'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Belum Dibayar
            </button>
            <button
              onClick={() => setFilter('PAID')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'PAID'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lunas
            </button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Periode:</span>
                    <span className="font-medium text-gray-900">{invoice.month}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jatuh Tempo:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  {invoice.paidAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dibayar:</span>
                      <span className="font-medium text-green-600">
                        {new Date(invoice.paidAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp {invoice.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadPDF(invoice)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  {invoice.status === 'PENDING' && (
                    <button
                      onClick={() => handlePayment(invoice)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      Bayar Sekarang
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada tagihan</h3>
            <p className="text-gray-600">
              {filter === 'ALL' 
                ? 'Belum ada tagihan untuk akun Anda' 
                : `Tidak ada tagihan dengan status ${filter === 'PAID' ? 'Lunas' : 'Belum Dibayar'}`}
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
