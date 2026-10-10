import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production API URL - Ganti dengan domain server Anda
const API_URL = __DEV__ 
  ? 'http://localhost:4000'  // Development (local)
  : 'https://api.audiranet.com'; // Production (ganti dengan URL server Anda)

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
      // Token expired, clear storage and redirect to login
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },
};

// Customer API
export const customerAPI = {
  getProfile: (customerId: string) =>
    api.get(`/pelanggan/${customerId}`),
  
  getUsage: (customerId: string) =>
    api.get(`/monitoring/usage/${customerId}`),
  
  getInvoices: (customerId: string) =>
    api.get(`/keuangan/invoices/${customerId}`),
  
  payInvoice: (invoiceId: string, paymentMethod: string) =>
    api.post('/payment/create', { invoiceId, paymentMethod }),
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

// Referral API
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
    api.post('/referral/redeem', { customerId, points }),
};
