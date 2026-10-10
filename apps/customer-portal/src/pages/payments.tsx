import { useState } from 'react';
import CustomerLayout from '@/components/CustomerLayout';
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  QrCode,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Payments() {
  const [selectedMethod, setSelectedMethod] = useState('');

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      icon: Building2,
      description: 'BCA, Mandiri, BNI, BRI',
      color: 'bg-blue-500',
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'GoPay, OVO, Dana, ShopeePay',
      color: 'bg-green-500',
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: QrCode,
      description: 'Scan QR Code',
      color: 'bg-purple-500',
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit',
      icon: CreditCard,
      description: 'Visa, Mastercard',
      color: 'bg-orange-500',
    },
  ];

  const recentPayments = [
    {
      id: '1',
      invoiceNumber: 'INV-202511-0001',
      amount: 300000,
      method: 'Transfer Bank BCA',
      status: 'success',
      date: '2025-11-03',
    },
    {
      id: '2',
      invoiceNumber: 'INV-202510-0001',
      amount: 300000,
      method: 'GoPay',
      status: 'success',
      date: '2025-10-02',
    },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
          <p className="text-gray-600">Kelola metode pembayaran Anda</p>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
            <p className="text-sm text-gray-600 mt-1">Pilih metode pembayaran yang Anda inginkan</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`${method.color} p-3 rounded-lg inline-block mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{method.name}</h3>
                    <p className="text-xs text-gray-600">{method.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bank Account Info */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Informasi Rekening</h2>
            <p className="text-sm text-gray-600 mt-1">Transfer pembayaran Anda ke rekening berikut</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded font-bold">BCA</div>
                  <span className="text-sm text-gray-600">Bank Central Asia</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Nomor Rekening</p>
                    <p className="text-lg font-bold text-gray-900">1234567890</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Atas Nama</p>
                    <p className="font-semibold text-gray-900">PT AudiraNET Indonesia</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-900 text-white px-3 py-1 rounded font-bold">Mandiri</div>
                  <span className="text-sm text-gray-600">Bank Mandiri</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Nomor Rekening</p>
                    <p className="text-lg font-bold text-gray-900">0987654321</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Atas Nama</p>
                    <p className="font-semibold text-gray-900">PT AudiraNET Indonesia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Penting:</strong> Setelah transfer, konfirmasi pembayaran akan diproses otomatis dalam 1x24 jam.
                Untuk pembayaran via payment gateway (GoPay, OVO, QRIS, Credit Card), konfirmasi instan.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Riwayat Pembayaran</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Berhasil
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
