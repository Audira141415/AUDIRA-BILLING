/**
 * API Configuration
 * Centralized API endpoint configuration
 */

// Base API URL - akan otomatis menggunakan environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  
  // Customer Auth
  CUSTOMER_AUTH: {
    LOGIN: `${API_BASE_URL}/auth/customer/login`,
    REGISTER: `${API_BASE_URL}/auth/customer/register`,
    ME: `${API_BASE_URL}/auth/customer/me`,
    LOGOUT: `${API_BASE_URL}/auth/customer/logout`,
  },
  
  // Customer
  CUSTOMER: {
    LIST: `${API_BASE_URL}/pelanggan`,
    STATS: `${API_BASE_URL}/pelanggan/stats`,
    BY_ID: (id: string) => `${API_BASE_URL}/pelanggan/${id}`,
    CREATE: `${API_BASE_URL}/pelanggan`,
    UPDATE: (id: string) => `${API_BASE_URL}/pelanggan/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/pelanggan/${id}`,
  },
  
  // Invoice
  INVOICE: {
    LIST: `${API_BASE_URL}/keuangan/invoices`,
    BY_CUSTOMER: (customerId: string) => `${API_BASE_URL}/keuangan/invoices?customerId=${customerId}`,
    BY_ID: (id: string) => `${API_BASE_URL}/keuangan/invoices/${id}`,
    PDF: (id: string) => `${API_BASE_URL}/keuangan/invoices/${id}/pdf`,
    CREATE: `${API_BASE_URL}/keuangan/invoices`,
    GENERATE: `${API_BASE_URL}/billing/generate-invoices`,
    SEND_REMINDERS: `${API_BASE_URL}/billing/send-reminders`,
  },
  
  // Ticket
  TICKET: {
    LIST: `${API_BASE_URL}/operational/tickets`,
    BY_ID: (id: string) => `${API_BASE_URL}/operational/tickets/${id}`,
    CREATE: `${API_BASE_URL}/operational/tickets`,
    UPDATE: (id: string) => `${API_BASE_URL}/operational/tickets/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/operational/tickets/${id}`,
  },
  
  // MikroTik
  MIKROTIK: {
    LIST: `${API_BASE_URL}/mikrotik`,
    BY_ID: (id: string) => `${API_BASE_URL}/mikrotik/${id}`,
    CREATE: `${API_BASE_URL}/mikrotik`,
    UPDATE: (id: string) => `${API_BASE_URL}/mikrotik/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/mikrotik/${id}`,
    TEST_CONNECTION: (id: string) => `${API_BASE_URL}/mikrotik/${id}/test-connection`,
  },
  
  // Field Service
  FIELD_SERVICE: {
    JOBS: `${API_BASE_URL}/field-service/jobs`,
    JOB_BY_ID: (id: string) => `${API_BASE_URL}/field-service/jobs/${id}`,
    JOB_PHOTOS: (id: string) => `${API_BASE_URL}/field-service/jobs/${id}/photos`,
    JOB_STATUS: (id: string) => `${API_BASE_URL}/field-service/jobs/${id}/status`,
    JOB_START: (id: string) => `${API_BASE_URL}/field-service/jobs/${id}/start`,
    JOB_COMPLETE: (id: string) => `${API_BASE_URL}/field-service/jobs/${id}/complete`,
    TECHNICIAN_TODAY: (techId: string) => `${API_BASE_URL}/field-service/technician/${techId}/today`,
    CHECKIN_HISTORY: (date: string) => `${API_BASE_URL}/field-service/check-in-history?date=${date}`,
    STATS: `${API_BASE_URL}/field-service/stats`,
  },
  
  // Technician
  TECHNICIAN: {
    LIST: `${API_BASE_URL}/operational/technicians`,
  },
  
  // Attendance
  ATTENDANCE: {
    BY_DATE: (date: string) => `${API_BASE_URL}/attendance/date/${date}`,
    STATS: (date: string) => `${API_BASE_URL}/attendance/stats?date=${date}`,
    STATUS: (userId: string) => `${API_BASE_URL}/attendance/status/${userId}`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/attendance/${id}/status`,
    CHECKIN: `${API_BASE_URL}/attendance/checkin`,
    CHECKOUT: `${API_BASE_URL}/attendance/checkout`,
  },
  
  // Reports
  REPORTS: {
    DASHBOARD: `${API_BASE_URL}/reports/dashboard`,
    REVENUE: `${API_BASE_URL}/reports/revenue`,
    CUSTOMER_GROWTH: `${API_BASE_URL}/reports/customer-growth`,
    PAYMENT_SUCCESS: `${API_BASE_URL}/reports/payment-success`,
    EXPORT: (type: string) => `${API_BASE_URL}/reports/${type}/export`,
  },
  
  // Modem
  MODEM: {
    LIST: `${API_BASE_URL}/modem/list`,
    STATS: `${API_BASE_URL}/modem/stats`,
    BY_TYPE: `${API_BASE_URL}/modem/by-type`,
    CHECK: (customerId: string) => `${API_BASE_URL}/modem/check/${customerId}`,
  },
  
  // Inventory
  INVENTORY: {
    EQUIPMENT: `${API_BASE_URL}/inventory/equipment`,
    BY_ID: (id: string) => `${API_BASE_URL}/inventory/equipment/${id}`,
    STATS: `${API_BASE_URL}/inventory/stats`,
  },
  
  // Backup
  BACKUP: {
    LIST: `${API_BASE_URL}/backup/list`,
    CREATE: `${API_BASE_URL}/backup/create`,
    DOWNLOAD: (filename: string) => `${API_BASE_URL}/backup/download/${filename}`,
    DELETE: (filename: string) => `${API_BASE_URL}/backup/${filename}`,
  },
  
  // Audit
  AUDIT: {
    LOGS: `${API_BASE_URL}/audit/logs`,
    LOG: `${API_BASE_URL}/audit/log`,
  },
};

// Helper function to build URL with query params
export function buildUrl(baseUrl: string, params?: Record<string, any>): string {
  if (!params) return baseUrl;
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export default API_ENDPOINTS;
