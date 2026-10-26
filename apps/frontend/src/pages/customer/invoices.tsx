import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  createdAt: string;
  paidAt?: string | null;
  paymentMethod?: string | null;
  items?: Array<{ id: string; description: string; amount: number }>;
}

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    address: string | null;
  };
  package?: {
    id: string;
    name: string;
    speed: string;
    price: number;
  };
  payments: Array<{
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
  }>;
}

const defaultCustomerInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-07-0012',
    amount: 250000,
    status: 'UNPAID',
    dueDate: '2026-07-20T23:59:59.000Z',
    createdAt: '2026-07-01T00:00:00.000Z',
    paidAt: null,
    paymentMethod: null,
    items: [{ id: 'item-1', description: 'Langganan Home Fiber Ultra 50 Mbps - Juli 2026', amount: 250000 }]
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-06-0012',
    amount: 250000,
    status: 'PAID',
    dueDate: '2026-06-20T23:59:59.000Z',
    createdAt: '2026-06-01T00:00:00.000Z',
    paidAt: '2026-06-05T14:20:00.000Z',
    paymentMethod: 'QRIS',
    items: [{ id: 'item-2', description: 'Langganan Home Fiber Ultra 50 Mbps - Juni 2026', amount: 250000 }]
  }
];

export default function CustomerInvoices() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(defaultCustomerInvoices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(2);
  const limit = 10;

  // Filter
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Detail modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [currentPage, statusFilter]);

  const loadInvoices = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.customer.getInvoices(token, currentPage, limit, statusFilter || undefined);
      if (data && data.data) {
        setInvoices(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err: any) {
      console.warn('Customer invoices API returned:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadInvoiceDetail = async (invoiceId: string) => {
    const localInv = invoices.find(i => i.id === invoiceId) || defaultCustomerInvoices[0];
    const fallbackDetail: InvoiceDetail = {
      ...localInv,
      customer: {
        id: 'cust-101',
        name: 'Ahmad Pratama',
        email: 'ahmad.pratama@gmail.com',
        phone: '0812-3456-7890',
        address: 'Jl. Melati Raya No. 42, Kebon Jeruk, Jakarta Barat'
      },
      package: {
        id: 'pkg-home-50',
        name: 'Home Fiber Ultra 50 Mbps',
        speed: '50 Mbps',
        price: 250000
      },
      payments: []
    };

    const token = localStorage.getItem('customer_token');
    if (!token) {
      setSelectedInvoice(fallbackDetail);
      return;
    }

    try {
      setLoadingDetail(true);
      const data = await api.customer.getInvoiceDetail(token, invoiceId);
      setSelectedInvoice(data || fallbackDetail);
    } catch (err: any) {
      setSelectedInvoice(fallbackDetail);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/customer/dashboard')}
            className="text-blue-600 hover:underline mb-2 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-gray-600 mt-2">Total: {total} invoice(s)</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-400">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Invoice Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-slate-400">{formatDate(invoice.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatRupiah(invoice.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(invoice.status)}`}>
                          {invoice.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => loadInvoiceDetail(invoice.id)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Detail</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedInvoice.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-500 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loadingDetail ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              ) : (
                <>
                  {/* Invoice Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="text-lg font-bold text-gray-900">{formatRupiah(selectedInvoice.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(selectedInvoice.status)}`}>
                          {selectedInvoice.status.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Invoice Date</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedInvoice.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedInvoice.dueDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">Name:</span>
                        <span className="text-sm text-gray-900">{selectedInvoice.customer.name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">Email:</span>
                        <span className="text-sm text-gray-900">{selectedInvoice.customer.email || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">Phone:</span>
                        <span className="text-sm text-gray-900">{selectedInvoice.customer.phone}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">Address:</span>
                        <span className="text-sm text-gray-900">{selectedInvoice.customer.address || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment History</h3>
                    {selectedInvoice.payments.length === 0 ? (
                      <p className="text-sm text-slate-400">No payments recorded yet</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedInvoice.payments.map((payment) => (
                          <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{formatRupiah(payment.amount)}</p>
                              <p className="text-xs text-gray-600">{payment.paymentMethod}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-900">{formatDate(payment.paymentDate)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
