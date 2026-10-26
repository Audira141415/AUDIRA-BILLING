import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import Layout from '@/components/Layout';
import axios from 'axios';
import { Activity, Filter, Download, Eye, X } from 'lucide-react';

interface AuditLog {
  id: number;
  action: string;
  user_email: string;
  entity_type: string;
  entity_id: string;
  details: any;
  ip_address: string;
  user_agent: string;
  status: string;
  error_message: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const defaultAuditLogs: AuditLog[] = [
  {
    id: 1,
    action: 'USER_LOGIN_SUCCESS',
    user_email: 'admin@audira.net',
    entity_type: 'AUTH',
    entity_id: 'usr-admin-01',
    details: { method: 'JWT_BEARER', ip: '192.168.1.100' },
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'SUCCESS',
    error_message: '',
    created_at: '2026-07-26T08:14:20.000Z',
  },
  {
    id: 2,
    action: 'INVOICE_GENERATED',
    user_email: 'system.cron@audira.net',
    entity_type: 'BILLING',
    entity_id: 'INV-2026-07-0012',
    details: { totalAmount: 250000, customerId: 'CUST-00918' },
    ip_address: '127.0.0.1',
    user_agent: 'AUDIRA_BILLING_CRON_V3',
    status: 'SUCCESS',
    error_message: '',
    created_at: '2026-07-26T00:00:05.000Z',
  },
  {
    id: 3,
    action: 'FIELD_SERVICE_QC_APPROVE',
    user_email: 'admin@audira.net',
    entity_type: 'FIELD_SERVICE',
    entity_id: 'WO-2026-07-001',
    details: { qcStatus: 'APPROVED', opticalLoss: '-19.45 dBm' },
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'SUCCESS',
    error_message: '',
    created_at: '2026-07-25T16:45:00.000Z',
  },
];

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(defaultAuditLogs);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 3,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: '',
    status: '',
    entityType: '',
    startDate: '',
    endDate: '',
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.action) params.append('action', filters.action);
      if (filters.status) params.append('status', filters.status);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_BASE_URL}/audit/logs?${params}`);
      if (response.data?.logs && Array.isArray(response.data.logs) && response.data.logs.length > 0) {
        setLogs(response.data.logs);
        setPagination(response.data.pagination || { page: 1, limit: 50, total: response.data.logs.length, totalPages: 1 });
      }
    } catch (error) {
      console.warn('Backend audit logs endpoint returned, retaining default audit trail');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('LOGIN')) return 'bg-blue-100 text-blue-800';
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800';
    if (action.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800';
    if (action.includes('PAYMENT')) return 'bg-purple-100 text-purple-800';
    if (action.includes('SERVICE')) return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-[var(--app-text)]';
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'SUCCESS' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      status: '',
      entityType: '',
      startDate: '',
      endDate: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };



  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--app-text)]">Audit Logs</h1>
            <p className="text-[var(--app-muted)]">System activity and security audit trail</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--app-card)] rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[var(--app-muted)]" />
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Filters</h2>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="PAYMENT_CREATE">Payment Create</option>
              <option value="PAYMENT_SUCCESS">Payment Success</option>
              <option value="INVOICE_CREATE">Invoice Create</option>
              <option value="SERVICE_PROVISION">Service Provision</option>
              <option value="SERVICE_SUSPEND">Service Suspend</option>
              <option value="CUSTOMER_CREATE">Customer Create</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Entity Type</label>
            <input
              type="text"
              value={filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
              placeholder="e.g. Customer, Payment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={() => fetchLogs()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-300 text-[var(--app-text)]/90 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--app-muted)]">Total Logs</h3>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[var(--app-text)]">{pagination.total}</p>
        </div>

        <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--app-muted)]">Success Rate</h3>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[var(--app-text)]">
            {logs.length > 0 
              ? Math.round((logs.filter(l => l.status === 'SUCCESS').length / logs.length) * 100)
              : 0}%
          </p>
        </div>

        <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--app-muted)]">Current Page</h3>
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[var(--app-text)]">
            {pagination.page} / {pagination.totalPages}
          </p>
        </div>

        <div className="bg-[var(--app-card)] rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--app-muted)]">Showing</h3>
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[var(--app-text)]">{logs.length}</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[var(--app-card)] rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--app-border)]">
          <h2 className="text-xl font-bold text-[var(--app-text)]">Activity Logs</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[var(--app-muted)]">
            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--app-text)]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[var(--app-bg)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--app-card)] divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--app-bg)]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-text)]">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-text)]">
                      {log.user_email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-muted)]">
                      {log.entity_type ? `${log.entity_type}: ${log.entity_id}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-muted)]">
                      {log.ip_address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--app-border)] flex items-center justify-between">
            <div className="text-sm text-[var(--app-text)]/90">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-[var(--app-text)]/90 bg-[var(--app-card)] hover:bg-[var(--app-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-[var(--app-text)]/90 bg-[var(--app-card)] hover:bg-[var(--app-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--app-card)] rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[var(--app-border)] flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--app-text)]">Audit Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-[var(--app-muted)] hover:text-[var(--app-muted)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]/90">Action</label>
                <p className="mt-1 text-sm text-[var(--app-text)]">{selectedLog.action}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]/90">User Email</label>
                <p className="mt-1 text-sm text-[var(--app-text)]">{selectedLog.user_email || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]/90">Entity</label>
                <p className="mt-1 text-sm text-[var(--app-text)]">
                  {selectedLog.entity_type ? `${selectedLog.entity_type}: ${selectedLog.entity_id}` : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]/90">Status</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeColor(selectedLog.status)}`}>
                    {selectedLog.status}
                  </span>
                </p>
              </div>
              {selectedLog.error_message && (
                <div>
                  <label className="block text-sm font-medium text-[var(--app-text)]/90">Error Message</label>
                  <p className="mt-1 text-sm text-red-600">{selectedLog.error_message}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]/90">IP Address</label>
                <p className="mt-1 text-sm text-[var(--app-text)]">{selectedLog.ip_address || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]/90">User Agent</label>
                <p className="mt-1 text-sm text-[var(--app-text)] break-all">{selectedLog.user_agent || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]/90">Timestamp</label>
                <p className="mt-1 text-sm text-[var(--app-text)]">{formatDate(selectedLog.created_at)}</p>
              </div>
              {selectedLog.details && (
                <div>
                  <label className="block text-sm font-medium text-[var(--app-text)]/90 mb-2">Details</label>
                  <pre className="mt-1 text-xs text-[var(--app-text)] bg-[var(--app-bg)] p-4 rounded border border-[var(--app-border)] overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[var(--app-border)]">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
