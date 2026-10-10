import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText
} from 'lucide-react'

export default function BillingDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not billing role
    if (user && user.role !== 'BILLING' && user.role !== 'CS' && user.role !== 'ADMIN') {
      router.push('/dashboard/noc')
    }
  }, [user, router])

  const [stats] = useState({
    revenue: {
      total: 45750000,
      thisMonth: 12500000,
      growth: 15.3
    },
    customers: {
      total: 156,
      active: 142,
      isolated: 8,
      inactive: 6
    },
    invoices: {
      total: 156,
      paid: 142,
      pending: 8,
      overdue: 6
    },
    payments: {
      today: 3250000,
      thisWeek: 8750000,
      thisMonth: 12500000
    }
  })

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Billing</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user?.name} (Admin Billing)</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Total Pendapatan</h3>
              <DollarSign size={24} className="opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-2">
              Rp {stats.revenue.total.toLocaleString('id-ID')}
            </p>
            <div className="flex items-center text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>+{stats.revenue.growth}% dari bulan lalu</span>
            </div>
          </div>

          {/* Active Customers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Pelanggan Aktif</h3>
              <Users className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.customers.active}</p>
            <p className="text-sm text-gray-500">dari {stats.customers.total} total pelanggan</p>
          </div>

          {/* Pending Invoices */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Invoice Pending</h3>
              <Clock className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.invoices.pending}</p>
            <p className="text-sm text-gray-500">Menunggu pembayaran</p>
          </div>

          {/* This Month Revenue */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Pendapatan Bulan Ini</h3>
              <CreditCard className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              Rp {stats.revenue.thisMonth.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-500">Desember 2025</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Payment Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Hari Ini</p>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {stats.payments.today.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Minggu Ini</p>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {stats.payments.thisWeek.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="text-purple-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Bulan Ini</p>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {stats.payments.thisMonth.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status Invoice</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="font-medium text-gray-900">Lunas</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.invoices.paid}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="text-orange-500" size={24} />
                  <span className="font-medium text-gray-900">Pending</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{stats.invoices.pending}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <span className="font-medium text-gray-900">Terlambat</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.invoices.overdue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/keuangan')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
            >
              <DollarSign className="mx-auto mb-2 text-blue-600" size={32} />
              <p className="text-sm font-medium text-gray-900">Kelola Keuangan</p>
            </button>
            <button
              onClick={() => router.push('/transaksi')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center"
            >
              <FileText className="mx-auto mb-2 text-green-600" size={32} />
              <p className="text-sm font-medium text-gray-900">Lihat Transaksi</p>
            </button>
            <button
              onClick={() => router.push('/pelanggan')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center"
            >
              <Users className="mx-auto mb-2 text-purple-600" size={32} />
              <p className="text-sm font-medium text-gray-900">Data Pelanggan</p>
            </button>
            <button
              onClick={() => router.push('/paket')}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center"
            >
              <CreditCard className="mx-auto mb-2 text-orange-600" size={32} />
              <p className="text-sm font-medium text-gray-900">Kelola Paket</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
