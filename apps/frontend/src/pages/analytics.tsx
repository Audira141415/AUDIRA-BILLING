import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '@/lib/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6', '#06b6d4'];

export default function AnalyticsPage() {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [churnData, setChurnData] = useState<any>(null);
  const [funnelData, setFunnelData] = useState<any>(null);
  const [profitData, setProfitData] = useState<any>(null);
  const [clvData, setClvData] = useState<any>(null);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          break;
      }

      // Load all analytics safely via API client
      const [revenue, forecast, churn, funnel, profit, clv, dashboard] = await Promise.allSettled([
        api.analytics.getRevenue(dateRange !== 'all' ? startDate.toISOString() : undefined, dateRange !== 'all' ? endDate.toISOString() : undefined),
        api.analytics.getForecast(3),
        api.analytics.getChurn(),
        api.analytics.getFunnel(),
        api.analytics.getProfit(),
        api.analytics.getClv(),
        api.analytics.getDashboard(),
      ]);

      if (revenue.status === 'fulfilled') setRevenueData(revenue.value);
      if (forecast.status === 'fulfilled') setForecastData(forecast.value);
      if (churn.status === 'fulfilled') setChurnData(churn.value);
      if (funnel.status === 'fulfilled') setFunnelData(funnel.value);
      if (profit.status === 'fulfilled') setProfitData(profit.value);
      if (clv.status === 'fulfilled') setClvData(clv.value);
      if (dashboard.status === 'fulfilled') setDashboardSummary(dashboard.value);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const exportReport = () => {
    // TODO: Implement PDF export using jsPDF
    alert('Exporting report...');
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Advanced Analytics</h1>
            <p className="text-[var(--app-muted)] mt-1">Dashboard analytics dan insights</p>
          </div>
          <div className="flex gap-3">
            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="90d">90 Hari Terakhir</option>
              <option value="all">Semua Data</option>
            </select>
            
            <button
              onClick={exportReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {dashboardSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--app-muted)]">Total Revenue</p>
                  <p className="text-2xl font-bold text-[var(--app-text)]">
                    Rp {dashboardSummary.revenue.total.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-[var(--app-muted)] mt-1">
                    {dashboardSummary.revenue.invoiceCount} invoices
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--app-muted)]">Next Month Forecast</p>
                  <p className="text-2xl font-bold text-[var(--app-text)]">
                    Rp {dashboardSummary.forecast.nextMonth.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {dashboardSummary.forecast.trend === 'increasing' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-[var(--app-muted)]">
                      {dashboardSummary.forecast.confidence}% confidence
                    </span>
                  </div>
                </div>
                <Calendar className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--app-muted)]">Churn Risk</p>
                  <p className="text-2xl font-bold text-red-600">
                    {dashboardSummary.churn.highRisk}
                  </p>
                  <p className="text-sm text-[var(--app-muted)] mt-1">
                    {dashboardSummary.churn.mediumRisk} medium risk
                  </p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--app-muted)]">Profit Margin</p>
                  <p className="text-2xl font-bold text-[var(--app-text)]">
                    {dashboardSummary.profit.margin}%
                  </p>
                  <p className="text-sm text-[var(--app-muted)] mt-1">
                    Rp {Math.round(dashboardSummary.profit.totalProfit).toLocaleString('id-ID')} profit
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Revenue Chart */}
        {revenueData && (
          <div className="bg-[var(--app-card)] rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={Object.entries(revenueData.revenueByMonth || {}).map(([month, revenue]) => ({
                  month,
                  revenue,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="#93c5fd"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Forecast & Package Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Forecast */}
          {forecastData && forecastData.forecast && (
            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">
                Revenue Forecast (Next 3 Months)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={forecastData.forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="predictedRevenue"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Predicted Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[var(--app-muted)]">Trend: {forecastData.trend}</span>
                <span className="text-[var(--app-muted)]">Confidence: {forecastData.confidence}%</span>
              </div>
            </div>
          )}

          {/* Revenue by Package */}
          {revenueData && (
            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">Revenue by Package</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(revenueData.revenueByPackage || {}).map(
                      ([name, value], index) => ({
                        name,
                        value,
                        fill: COLORS[index % COLORS.length],
                      })
                    )}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: Rp ${entry.value.toLocaleString('id-ID')}`}
                  >
                    {Object.entries(revenueData.revenueByPackage || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Sales Funnel & Profit Margin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Funnel */}
          {funnelData && (
            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">Sales Funnel</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={funnelData.funnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#2563eb" name="Count" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-[var(--app-bg)] p-3 rounded">
                  <p className="text-[var(--app-muted)]">Lead to Customer</p>
                  <p className="text-lg font-semibold text-[var(--app-text)]">
                    {funnelData.conversionRates.leadToCustomer}%
                  </p>
                </div>
                <div className="bg-[var(--app-bg)] p-3 rounded">
                  <p className="text-[var(--app-muted)]">Customer to Paying</p>
                  <p className="text-lg font-semibold text-[var(--app-text)]">
                    {funnelData.conversionRates.customerToPaying}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profit Margin by Package */}
          {profitData && (
            <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">
                Profit Margin by Package
              </h2>
              <div className="space-y-3 mb-4">
                {Object.entries(profitData.byPackage || {}).map(([pkg, data]: [string, any]) => (
                  <div key={pkg} className="border-b pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-[var(--app-text)]">{pkg}</span>
                      <span className="text-sm font-semibold text-green-600">
                        {data.margin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--app-muted)]">
                      <span>Revenue: Rp {data.revenue.toLocaleString('id-ID')}</span>
                      <span>Profit: Rp {data.profit.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[var(--app-text)]">Overall Margin</span>
                  <span className="text-xl font-bold text-blue-600">
                    {profitData.overall.margin}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Churn Risk Customers */}
        {churnData && (
          <div className="bg-[var(--app-card)] rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">
              High Risk Churn Customers
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[var(--app-bg)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase">
                      Reasons
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--app-card)] divide-y divide-gray-200">
                  {churnData.highRisk?.slice(0, 10).map((customer: any) => (
                    <tr key={customer.customerId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[var(--app-text)]">
                          {customer.customerName}
                        </div>
                        <div className="text-sm text-[var(--app-muted)]">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-red-600">
                          {customer.riskScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            customer.riskLevel === 'high'
                              ? 'bg-red-100 text-red-800'
                              : customer.riskLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {customer.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--app-muted)]">
                          {customer.reasons.join(', ')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Customers by CLV */}
        {clvData && (
          <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">
              Top Customers by Lifetime Value
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {clvData.topCustomers?.slice(0, 6).map((customer: any) => (
                <div key={customer.customerId} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-[var(--app-text)] mb-2">
                    {customer.customerName}
                  </h3>
                  <div className="space-y-1 text-sm text-[var(--app-muted)]">
                    <div className="flex justify-between">
                      <span>CLV:</span>
                      <span className="font-semibold text-blue-600">
                        Rp {customer.clv.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spent:</span>
                      <span>Rp {customer.totalSpent.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Invoices:</span>
                      <span>{customer.invoiceCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Months:</span>
                      <span>{customer.monthsAsCustomer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[var(--app-bg)] p-4 rounded">
              <div className="flex justify-between items-center">
                <span className="text-[var(--app-text)]/90">Average CLV (All Customers)</span>
                <span className="text-xl font-bold text-[var(--app-text)]">
                  Rp {clvData.averageCLV?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
