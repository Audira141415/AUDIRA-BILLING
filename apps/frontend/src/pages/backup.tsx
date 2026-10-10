import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import Layout from '@/components/Layout';
import axios from 'axios';
import { Database, Download, Trash2, RefreshCw, HardDrive, AlertCircle } from 'lucide-react';

interface Backup {
  filename: string;
  size: number;
  createdAt: string;
}

export default function BackupManagement() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('${API_BASE_URL}/backup/list');
      setBackups(response.data.backups);
      setTotalSize(response.data.totalSize);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
      alert('Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    if (!confirm('Create new database backup?')) return;

    try {
      setCreating(true);
      const response = await axios.post('${API_BASE_URL}/backup/create');
      
      if (response.data.success) {
        alert(`Backup created successfully!\n${response.data.filename}\nSize: ${(response.data.size / (1024 * 1024)).toFixed(2)} MB`);
        fetchBackups();
      } else {
        alert('Backup failed: ' + response.data.error);
      }
    } catch (error: any) {
      alert('Failed to create backup: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreating(false);
    }
  };

  const downloadBackup = (filename: string) => {
    window.open(`${API_BASE_URL}/backup/download/${filename}`, '_blank');
  };

  const deleteBackup = async (filename: string) => {
    if (!confirm(`Delete backup: ${filename}?`)) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/backup/${filename}`);
      
      if (response.data.success) {
        alert('Backup deleted successfully');
        fetchBackups();
      } else {
        alert('Delete failed: ' + response.data.error);
      }
    } catch (error: any) {
      alert('Failed to delete backup: ' + (error.response?.data?.error || error.message));
    }
  };

  const restoreBackup = async (filename: string) => {
    if (!confirm(`⚠️ WARNING ⚠️\n\nRestore database from backup: ${filename}?\n\nThis will OVERWRITE the current database!\n\nAre you sure?`)) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/backup/restore/${filename}`);
      
      if (response.data.success) {
        alert('Database restored successfully!\n\nPlease restart the backend server.');
      } else {
        alert('Restore failed: ' + response.data.error);
      }
    } catch (error: any) {
      alert('Failed to restore backup: ' + (error.response?.data?.error || error.message));
    }
  };

  const cleanOldBackups = async () => {
    if (!confirm('Clean old backups (older than 30 days)?')) return;

    try {
      const response = await axios.post('${API_BASE_URL}/backup/clean');
      alert(response.data.message);
      fetchBackups();
    } catch (error) {
      alert('Failed to clean old backups');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Database Backup</h1>
              <p className="text-gray-600">Manage PostgreSQL database backups</p>
            </div>
          </div>
          <button
            onClick={createBackup}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <HardDrive className="w-5 h-5" />
            {creating ? 'Creating...' : 'Create Backup'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Backups</h3>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800">{backups.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Size</h3>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800">{formatBytes(totalSize)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Auto Backup</h3>
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-800">Daily at 2 AM</p>
          <p className="text-sm text-gray-600 mt-1">Retention: 30 days</p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <button
            onClick={createBackup}
            disabled={creating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Backup Now
              </>
            )}
          </button>

          <button
            onClick={cleanOldBackups}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clean Old Backups
          </button>

          <button
            onClick={fetchBackups}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Backup Files</h2>
        </div>

        {backups.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p className="text-lg">No backups found</p>
            <p className="text-sm mt-2">Create your first backup using the button above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.filename} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">{backup.filename}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatBytes(backup.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(backup.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => downloadBackup(backup.filename)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Download"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => restoreBackup(backup.filename)}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title="Restore"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteBackup(backup.filename)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Backup Information</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• <strong>Auto Backup:</strong> Runs daily at 2 AM (Asia/Jakarta timezone)</li>
              <li>• <strong>Retention:</strong> Backups older than 30 days are automatically deleted</li>
              <li>• <strong>Location:</strong> ./backups directory in backend folder</li>
              <li>• <strong>Format:</strong> PostgreSQL plain-text SQL dump (pg_dump)</li>
              <li>• <strong>Restore:</strong> Use psql to restore from backup file</li>
              <li>• <strong>Manual:</strong> Click "Create Backup Now" for immediate backup</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
