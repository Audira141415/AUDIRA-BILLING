import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Production & Development API URLs
// Android emulator uses 10.0.2.2 to access host machine localhost:3218
// iOS simulator & Web use localhost:3218
const getBaseUrl = () => {
  if (!__DEV__) {
    return 'https://api.audiranet.com';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3218';
  }
  return 'http://localhost:3218';
};

const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

// Unified Auth API - Connected to same backend as Web Customer Portal
export const authAPI = {
  // Customer Login (accepts email, phone, or internetNumber)
  login: async (identifier: string, password: string) => {
    try {
      // Try customer login first
      const res = await api.post('/auth/customer/login', { email: identifier, password });
      return {
        data: {
          token: res.data.access_token || res.data.token,
          user: {
            ...res.data.customer,
            role: 'customer',
          },
        },
      };
    } catch (err: any) {
      // If 401/404, fallback to employee/technician login
      if (err.response?.status === 401 || err.response?.status === 404) {
        return api.post('/auth/login', { email: identifier, password });
      }
      throw err;
    }
  },

  customerLogin: (email: string, password: string) =>
    api.post('/auth/customer/login', { email, password }),

  employeeLogin: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },
};

// Customer API - 100% Identical Single-Source-of-Truth Endpoints as Web Portal
export const customerAPI = {
  // Unified customer dashboard (syncs statistics, invoices, package, tickets)
  getDashboard: () =>
    api.get('/customer/dashboard'),

  getProfile: () =>
    api.get('/customer/profile'),

  updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
    api.put('/customer/profile', data),

  changePassword: (data: { currentPassword?: string; newPassword?: string }) =>
    api.post('/customer/change-password', data),

  getInvoices: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/customer/invoices', { params }),

  getInvoiceDetail: (invoiceId: string) =>
    api.get(`/customer/invoices/${invoiceId}`),

  getTickets: (params?: { status?: string }) =>
    api.get('/customer/tickets', { params }),

  createTicket: (data: { title: string; description: string; priority?: string }) =>
    api.post('/customer/tickets', data),

  addTicketComment: (ticketId: string, content: string) =>
    api.post(`/customer/tickets/${ticketId}/comments`, { content }),

  payInvoice: (invoiceId: string) =>
    api.post('/billing/create-payment', { invoiceId }),

  createQrisPayment: (invoiceId: string) =>
    api.post('/billing/create-qris-payment', { invoiceId }),
};

// Technician API
export const technicianAPI = {
  getTodayJobs: (technicianId: string) =>
    api.get(`/field-service/technician/${technicianId}/today`),
  
  getAllJobs: (technicianId: string, status?: string) =>
    api.get(`/field-service/technician/${technicianId}/jobs`, {
      params: { status },
    }),
  
  startJob: (jobId: string, latitude: number, longitude: number) =>
    api.post(`/field-service/jobs/${jobId}/start`, { latitude, longitude }),
  
  uploadPhotos: (jobId: string, photoUrls: string[]) =>
    api.post(`/field-service/jobs/${jobId}/photos`, { photoUrls }),
  
  addSignature: (jobId: string, signature: string) =>
    api.post(`/field-service/jobs/${jobId}/signature`, { signature }),
  
  completeJob: (jobId: string, data: any) =>
    api.post(`/field-service/jobs/${jobId}/complete`, data),
  
  updateStatus: (jobId: string, status: string) =>
    api.put(`/field-service/jobs/${jobId}/status`, { status }),
};

// Referral & Loyalty API - Shared across Web & Mobile
export const referralAPI = {
  getReferralCode: (customerId: string) =>
    api.get(`/referral/code/${customerId}`),
  
  getReferralStats: (customerId: string) =>
    api.get(`/referral/stats/${customerId}`),
  
  getLoyaltyPoints: (customerId: string) =>
    api.get(`/referral/loyalty/${customerId}`),
  
  redeemPoints: (customerId: string, points: number) =>
    api.post('/referral/redeem', { customerId, points }),
};

// Attendance API
export const attendanceAPI = {
  checkIn: (latitude: number, longitude: number, photo?: string) =>
    api.post('/attendance/check-in', { latitude, longitude, photo }),
  
  checkOut: (latitude: number, longitude: number, photo?: string) =>
    api.post('/attendance/check-out', { latitude, longitude, photo }),
  
  getTodayAttendance: () =>
    api.get('/attendance/my-today'),
  
  getAttendanceHistory: (startDate?: string, endDate?: string) =>
    api.get('/attendance/my-history', { params: { startDate, endDate } }),
};
