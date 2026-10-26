const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

const fetchWithAuth = async (url: string, init?: RequestInit) => {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('adminToken')) : null;
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string>) };
  
  if (token && token !== 'undefined' && token !== 'null') {
    if (!headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } else {
    if (headers['Authorization'] === 'Bearer null' || headers['Authorization'] === 'Bearer undefined') {
      delete headers['Authorization'];
    }
  }

  return fetch(url, {
    credentials: 'include',
    ...init,
    headers,
  });
};

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    register: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
  },

  // Mikrotik endpoints
  mikrotik: {
    getAll: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/mikrotik`);
      if (!res.ok) throw new Error('Failed to fetch mikrotik devices');
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/mikrotik/${id}`);
      if (!res.ok) throw new Error('Failed to fetch mikrotik device');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/mikrotik`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create mikrotik device');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/mikrotik/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update mikrotik device');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/mikrotik/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete mikrotik device');
      return res.json();
    },
    testConnection: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/mikrotik/${id}/test-connection`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Connection test failed');
      return res.json();
    },
    getInterfaces: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/mikrotik/${id}/interfaces`);
      if (!res.ok) throw new Error('Failed to fetch interfaces');
      return res.json();
    },
  },

  // Pelanggan endpoints
  pelanggan: {
    getAll: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pelanggan`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pelanggan/stats`);
      if (!res.ok) throw new Error('Failed to fetch customer stats');
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pelanggan/${id}`);
      if (!res.ok) throw new Error('Failed to fetch customer');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pelanggan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create customer');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pelanggan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update customer');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pelanggan/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete customer');
      return res.json();
    },
  },

  // Paket / Packages endpoints
  paket: {
    getAll: async (query?: any) => {
      const params = query ? `?${new URLSearchParams(query)}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/packages${params}`);
      if (!res.ok) throw new Error('Failed to fetch packages');
      return res.json();
    },
    getStatistics: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/packages/statistics/overview`);
      if (!res.ok) throw new Error('Failed to fetch package statistics');
      return res.json();
    },
    getAvailable: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/packages/available`);
      if (!res.ok) throw new Error('Failed to fetch available packages');
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/packages/${id}`);
      if (!res.ok) throw new Error('Failed to fetch package detail');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create package');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update package');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/packages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete package');
      return res.json();
    },
  },

  // Keuangan endpoints (Billing)
  keuangan: {
    getInvoices: async (customerId?: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const url = customerId
        ? `${API_BASE_URL}/keuangan/invoices?customerId=${customerId}`
        : `${API_BASE_URL}/keuangan/invoices`;
      const res = await fetchWithAuth(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch invoices');
      return res.json();
    },
    getStats: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch keuangan stats');
      return res.json();
    },
    getInvoice: async (id: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch invoice');
      return res.json();
    },
    createInvoice: async (data: any) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create invoice');
      return res.json();
    },
    createPayment: async (data: any) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create payment');
      return res.json();
    },
    updateInvoice: async (id: string, data: any) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update invoice');
      return res.json();
    },
    deleteInvoice: async (id: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/invoices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete invoice');
      return res.json();
    },
    bulkGenerate: async (month: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/invoices/bulk-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ month }),
      });
      if (!res.ok) throw new Error('Failed to bulk generate invoices');
      return res.json();
    },
    markPaid: async (id: string, paymentMethod: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/invoices/${id}/mark-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentMethod }),
      });
      if (!res.ok) throw new Error('Failed to mark invoice as paid');
      return res.json();
    },
    getOverdue: async (days?: number) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const url = days !== undefined
        ? `${API_BASE_URL}/keuangan/overdue?days=${days}`
        : `${API_BASE_URL}/keuangan/overdue`;
      const res = await fetchWithAuth(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch overdue invoices');
      return res.json();
    },
    getSummary: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/invoices/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch invoice summary');
      return res.json();
    },
    suspendCustomer: async (customerId: string, reason?: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/suspend/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to suspend customer');
      return res.json();
    },
    unsuspendCustomer: async (customerId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetchWithAuth(`${API_BASE_URL}/keuangan/unsuspend/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Failed to unsuspend customer');
      return res.json();
    },
  },

  // Operational endpoints
  operational: {
    getTickets: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/tickets`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      return res.json();
    },
    getTechnicians: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/technicians`);
      if (!res.ok) throw new Error('Failed to fetch technicians');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/stats`);
      if (!res.ok) throw new Error('Failed to fetch operational stats');
      return res.json();
    },
    getTicket: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/tickets/${id}`);
      if (!res.ok) throw new Error('Failed to fetch ticket');
      return res.json();
    },
    createTicket: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create ticket');
      return res.json();
    },
    createTechnician: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/technicians`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create technician');
      return res.json();
    },
    updateTicket: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update ticket');
      return res.json();
    },
    assignTicket: async (id: string, technicianId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/tickets/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId }),
      });
      if (!res.ok) throw new Error('Failed to assign ticket');
      return res.json();
    },
    deleteTicket: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/operational/tickets/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete ticket');
      return res.json();
    },
  },

  // ODP endpoints
  odp: {
    getAll: async (search?: string) => {
      const url = search ? `${API_BASE_URL}/odp?search=${search}` : `${API_BASE_URL}/odp`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to fetch ODPs');
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/odp/${id}`);
      if (!res.ok) throw new Error('Failed to fetch ODP');
      return res.json();
    },
    getTopology: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/odp/topology`);
      if (!res.ok) throw new Error('Failed to fetch topology');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/odp/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/odp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create ODP');
      return res.json();
    },
  },

  // Settings endpoints
  settings: {
    getAll: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    },
    getSetting: async (key: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/settings/${key}`);
      if (!res.ok) throw new Error('Failed to fetch setting');
      return res.json();
    },
    update: async (settings: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      return res.json();
    },
  },

  // Documentation endpoints
  documentation: {
    getAll: async (category?: string) => {
      const url = category ? `${API_BASE_URL}/documentation?category=${category}` : `${API_BASE_URL}/documentation`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to fetch documentation');
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/documentation/${id}`);
      if (!res.ok) throw new Error('Failed to fetch document');
      return res.json();
    },
    search: async (query: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/documentation/search?q=${query}`);
      if (!res.ok) throw new Error('Failed to search documentation');
      return res.json();
    },
    getCategories: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/documentation/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  },

  // Customer Portal Endpoints
  customer: {
    getDashboard: async (token: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/dashboard`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch customer dashboard data');
      return res.json();
    },

    getProfile: async (token: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },

    updateProfile: async (token: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    
    getInvoices: async (token: string, page = 1, limit = 10, status?: string) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status', status);
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/invoices?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch invoices');
      return res.json();
    },
    
    getInvoiceDetail: async (token: string, invoiceId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/invoices/${invoiceId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch invoice detail');
      return res.json();
    },
    
    getPackages: async (token: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/packages`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch packages');
      return res.json();
    },
    
    getCurrentPackage: async (token: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/package/current`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch current package');
      return res.json();
    },
    
    getTickets: async (token: string, page = 1, limit = 10, status?: string) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status', status);
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/tickets?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch tickets');
      return res.json();
    },
    
    getTicketDetail: async (token: string, ticketId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/tickets/${ticketId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
      if (!res.ok) throw new Error('Failed to fetch ticket detail');
      return res.json();
    },
    
    createTicket: async (token: string, data: { title: string; description: string; priority?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/customer/tickets`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create ticket');
      return res.json();
    },
  },

  // Leave / Cuti endpoints
  leave: {
    getAll: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/leave`);
      if (!res.ok) throw new Error('Failed to fetch leave requests');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/leave/stats`);
      if (!res.ok) throw new Error('Failed to fetch leave stats');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create leave request');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/leave/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update leave request');
      return res.json();
    },
    approve: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/leave/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to approve leave request');
      return res.json();
    },
    reject: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/leave/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to reject leave request');
      return res.json();
    },
  },

  // Employee endpoints
  employee: {
    getAll: async (status?: string) => {
      const url = status ? `${API_BASE_URL}/employees?status=${status}` : `${API_BASE_URL}/employees`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to fetch employees');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employees/stats`);
      if (!res.ok) throw new Error('Failed to fetch employee stats');
      return res.json();
    },
    getProfile: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employees/${id}`);
      if (!res.ok) throw new Error('Failed to fetch employee profile');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create employee');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update employee');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete employee');
      return res.json();
    },
  },

  // Salary endpoints
  salary: {
    getAll: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/salaries`);
      if (!res.ok) throw new Error('Failed to fetch salaries');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/salaries/stats`);
      if (!res.ok) throw new Error('Failed to fetch salary stats');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/salaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create salary record');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/salaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update salary record');
      return res.json();
    },
    createBulk: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/salaries/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create bulk salaries');
      return res.json();
    },
    markAsPaid: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/salaries/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to mark salary as paid');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/salaries/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete salary record');
      return res.json();
    },
  },

  // Performance endpoints
  performance: {
    getAll: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/performances`);
      if (!res.ok) throw new Error('Failed to fetch performances');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/performances/stats`);
      if (!res.ok) throw new Error('Failed to fetch performance stats');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/performances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create performance review');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/performances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update performance review');
      return res.json();
    },
    approve: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/performances/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to approve performance review');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/performances/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete performance review');
      return res.json();
    },
  },

  // Attendance endpoints
  attendance: {
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/attendance/stats`);
      if (!res.ok) throw new Error('Failed to fetch attendance stats');
      return res.json();
    },
  },

  // Dashboard endpoints
  dashboard: {
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/stats`);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return res.json();
    },
  },

  // Analytics endpoints
  analytics: {
    getRevenue: async (startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await fetchWithAuth(`${API_BASE_URL}/analytics/revenue?${params}`);
      if (!res.ok) throw new Error('Failed to fetch revenue analytics');
      return res.json();
    },
    getForecast: async (months?: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/analytics/forecast${months ? `?months=${months}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch forecast');
      return res.json();
    },
    getChurn: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/analytics/churn`);
      if (!res.ok) throw new Error('Failed to fetch churn');
      return res.json();
    },
    getFunnel: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/analytics/funnel`);
      if (!res.ok) throw new Error('Failed to fetch funnel');
      return res.json();
    },
    getProfit: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/analytics/profit`);
      if (!res.ok) throw new Error('Failed to fetch profit');
      return res.json();
    },
    getClv: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/analytics/clv`);
      if (!res.ok) throw new Error('Failed to fetch clv');
      return res.json();
    },
    getDashboard: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/analytics/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch analytics dashboard');
      return res.json();
    },
  },

  // Schedule endpoints
  schedule: {
    getAll: async (employeeId?: string, startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (employeeId) params.append('employeeId', employeeId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await fetchWithAuth(`${API_BASE_URL}/schedules?${params}`);
      if (!res.ok) throw new Error('Failed to fetch schedules');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create schedule');
      return res.json();
    },
    createBulk: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/schedules/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create bulk schedules');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/schedules/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete schedule');
      return res.json();
    },
  },

  // WhatsApp endpoints
  whatsapp: {
    getStatus: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/gateway/status`);
      if (!res.ok) throw new Error('Failed to fetch WhatsApp gateway status');
      return res.json();
    },
    getQr: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/gateway/qr`);
      if (!res.ok) throw new Error('Failed to fetch WhatsApp QR');
      return res.json();
    },
    startSession: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/gateway/start`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to start WhatsApp session');
      return res.json();
    },
    sendMessage: async (data: { phone: string; message: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send WhatsApp message');
      return res.json();
    },
    sendH3Reminder: async (data: { phone: string; invoiceId?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/test/h3-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send H-3 reminder');
      return res.json();
    },
    sendHariHReminder: async (data: { phone: string; invoiceId?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/test/hari-h-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send Hari-H reminder');
      return res.json();
    },
    sendReceipt: async (data: { phone: string; invoiceId?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/test/payment-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send WhatsApp receipt');
      return res.json();
    },
    sendInvoice: async (data: { customer: any; invoice: any }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send invoice via WhatsApp');
      return res.json();
    },
    sendReminder: async (data: { customer: any; invoice: any; daysLeft: number }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/whatsapp/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send reminder via WhatsApp');
      return res.json();
    },
  },

  // Billing & Invoicing Automation endpoints
  billing: {
    getAllInvoices: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/invoices-all`);
      if (!res.ok) throw new Error('Failed to fetch all invoices');
      return res.json();
    },
    getSchedulerSummary: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/scheduler-summary`);
      if (!res.ok) throw new Error('Failed to fetch billing scheduler summary');
      return res.json();
    },
    getReceiptPdfUrl: (invoiceId: string) => {
      return `${API_BASE_URL}/billing/invoices/${invoiceId}/receipt-pdf`;
    },
    downloadReceiptPdf: async (invoiceId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/invoices/${invoiceId}/receipt-pdf`);
      if (!res.ok) throw new Error('Failed to download receipt PDF');
      return res.blob();
    },
    triggerH3Scheduler: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/scheduler/run-h3`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to trigger H-3 scheduler');
      return res.json();
    },
    triggerHariHScheduler: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/scheduler/run-hari-h`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to trigger Hari-H scheduler');
      return res.json();
    },
    generateInvoices: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/generate-invoices`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to trigger invoice generation');
      return res.json();
    },
    sendReminders: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/send-reminders`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to trigger reminders');
      return res.json();
    },
    createPayment: async (invoiceId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });
      if (!res.ok) throw new Error('Failed to create payment transaction');
      return res.json();
    },
    createQRISPayment: async (invoiceId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/create-qris-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });
      if (!res.ok) throw new Error('Failed to create QRIS payment');
      return res.json();
    },
    createVAPayment: async (invoiceId: string, bank: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/create-va-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, bank }),
      });
      if (!res.ok) throw new Error('Failed to create Virtual Account payment');
      return res.json();
    },
  },

  // GenieACS TR-069 Device Management endpoints
  genieacs: {
    getDevices: async (search?: string) => {
      const url = search ? `${API_BASE_URL}/genieacs/devices?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/genieacs/devices`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to fetch GenieACS devices');
      return res.json();
    },
    getDevice: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/devices/${id}`);
      if (!res.ok) throw new Error('Failed to fetch device detail');
      return res.json();
    },
    refreshDevice: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/devices/${id}/refresh`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to refresh device parameters');
      return res.json();
    },
    rebootDevice: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/devices/${id}/reboot`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to send reboot signal');
      return res.json();
    },
    getOpticalPower: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/devices/${id}/optical`);
      if (!res.ok) throw new Error('Failed to fetch optical power');
      return res.json();
    },
    updateWifi: async (id: string, data: { ssid24?: string; password24?: string; ssid5?: string; password5?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/devices/${id}/wifi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update WiFi configuration');
      return res.json();
    },
    factoryReset: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/devices/${id}/factory-reset`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to factory reset device');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/stats`);
      if (!res.ok) throw new Error('Failed to fetch GenieACS stats');
      return res.json();
    },
    getPresets: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/genieacs/presets`);
      if (!res.ok) throw new Error('Failed to fetch GenieACS presets');
      return res.json();
    },
  },

  // Inventory & Equipment Management endpoints
  inventory: {
    getAll: async (params?: { type?: string; status?: string; customerId?: string }) => {
      const query = params ? `?${new URLSearchParams(params as any)}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment${query}`);
      if (!res.ok) throw new Error('Failed to fetch inventory equipment');
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment/${id}`);
      if (!res.ok) throw new Error('Failed to fetch equipment detail');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create equipment');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update equipment');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete equipment');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/stats`);
      if (!res.ok) throw new Error('Failed to fetch inventory stats');
      return res.json();
    },
  },

  // Field Service & Work Order endpoints
  fieldService: {
    getJobs: async (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs${query}`);
      if (!res.ok) throw new Error('Failed to fetch field service jobs');
      return res.json();
    },
    getJob: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch work order');
      return res.json();
    },
    createJob: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create work order');
      return res.json();
    },
    updateJob: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update work order');
      return res.json();
    },
    assignTechnician: async (id: string, technicianId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId }),
      });
      if (!res.ok) throw new Error('Failed to assign technician');
      return res.json();
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update job status');
      return res.json();
    },
    startJob: async (id: string, latitude?: number, longitude?: number, checkInPhoto?: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, checkInPhoto }),
      });
      if (!res.ok) throw new Error('Failed to start job');
      return res.json();
    },
    completeJob: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to complete job');
      return res.json();
    },
  },

  // Tickets Helpdesk endpoints
  tickets: {
    getAll: async (query?: any) => {
      const params = query ? `?${new URLSearchParams(query)}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets${params}`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      return res.json();
    },
    getStatistics: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets/statistics/overview`);
      if (!res.ok) throw new Error('Failed to fetch ticket statistics');
      return res.json();
    },
    getUnassigned: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets/unassigned`);
      if (!res.ok) throw new Error('Failed to fetch unassigned tickets');
      return res.json();
    },
    getAvailableTechnicians: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets/technicians/available`);
      if (!res.ok) throw new Error('Failed to fetch available technicians');
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets/${id}`);
      if (!res.ok) throw new Error('Failed to fetch ticket detail');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create ticket');
      return res.json();
    },
    assign: async (id: string, technicianId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId }),
      });
      if (!res.ok) throw new Error('Failed to assign ticket');
      return res.json();
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update ticket status');
      return res.json();
    },
  },
};

export default api;
