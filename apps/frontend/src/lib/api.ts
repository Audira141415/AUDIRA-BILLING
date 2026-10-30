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

  // WireGuard Cloud Tunnel endpoints
  tunnel: {
    provision: async (data: { routerName?: string; tenantId?: string; location?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tunnel/provision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Gagal membuat Cloud Tunnel WireGuard');
      return res.json();
    },
    getAll: async (tenantId?: string) => {
      const query = tenantId ? `?tenantId=${tenantId}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/tunnel${query}`);
      if (!res.ok) throw new Error('Gagal mengambil daftar tunnel');
      return res.json();
    },
    testHandshake: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tunnel/${id}/test-handshake`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Handshake tunnel gagal');
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
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/leave/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete leave request');
      return res.json();
    },
  },

  // Employee endpoints
  employee: {
    getAll: async (status?: string) => {
      const url = status ? `${API_BASE_URL}/employee?status=${status}` : `${API_BASE_URL}/employee`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to fetch employees');
      return res.json();
    },
    getStats: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employee/stats`);
      if (!res.ok) throw new Error('Failed to fetch employee stats');
      return res.json();
    },
    getProfile: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employee/${id}`);
      if (!res.ok) throw new Error('Failed to fetch employee profile');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create employee');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employee/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update employee');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/employee/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete employee');
      return res.json();
    },
  },

  // Salary endpoints
  salary: {
    getAll: async (period?: string, status?: string) => {
      const query = new URLSearchParams();
      if (period) query.append('period', period);
      if (status && status !== 'all') query.append('status', status);
      const url = `${API_BASE_URL}/salaries${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to fetch salaries');
      return res.json();
    },
    getStats: async (period?: string) => {
      const url = `${API_BASE_URL}/salaries/stats${period ? `?period=${period}` : ''}`;
      const res = await fetchWithAuth(url);
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
    getToday: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/attendance/today`);
      if (!res.ok) return [];
      return res.json();
    },
    getStatus: async (userId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/attendance/status/${userId}`);
      if (!res.ok) return null;
      return res.json();
    },
    checkIn: async (data: { userId: string; checkInPhoto?: string; latitude?: number; longitude?: number }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/attendance/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal check-in');
      }
      return res.json();
    },
    checkOut: async (data: { userId: string; checkOutPhoto?: string; latitude?: number; longitude?: number }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/attendance/check-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal check-out');
      }
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
    getStats: async (date?: string) => {
      const url = date ? `${API_BASE_URL}/schedule/stats?date=${date}` : `${API_BASE_URL}/schedule/stats`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to fetch schedule stats');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/schedule/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update schedule');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/schedule/${id}`, {
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
    sendBatchDueReminders: async (payload: {
      date?: string;
      customerIds?: string[];
      invoiceIds?: string[];
      customMessage?: string;
      mode?: 'HARI_H' | 'H3' | 'CUSTOM';
      items?: any[];
    }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/remind-due-customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal mengirim pengingat batch WhatsApp');
      return res.json();
    },
    sendSingleReminder: async (payload: {
      phone: string;
      customerName: string;
      internetNumber?: string;
      amount?: number;
      invoiceNumber?: string;
      dueDate?: string;
      customMessage?: string;
      mode?: 'HARI_H' | 'H3' | 'CUSTOM';
    }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/send-single-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal mengirim pengingat WhatsApp perorangan');
      return res.json();
    },
    triggerDailyReminders: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/run-daily-reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Gagal menjalankan trigger pengingat harian');
      return res.json();
    },
    simulateBot: async (phone: string, message: string, senderName?: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/bot-simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message, senderName }),
      });
      if (!res.ok) throw new Error('Gagal menjalankan simulasi bot');
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
    getSuspendedCustomers: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/suspended-customers`);
      if (!res.ok) throw new Error('Failed to fetch suspended customers');
      return res.json();
    },
    getActiveGracePeriods: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/grace-period/active`);
      if (!res.ok) throw new Error('Failed to fetch active grace periods');
      return res.json();
    },
    setGracePeriod: async (customerId: string, promiseDate: string, notes?: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/grace-period/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promiseDate, notes }),
      });
      if (!res.ok) throw new Error('Failed to set grace period');
      return res.json();
    },
    cancelGracePeriod: async (customerId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/grace-period/${customerId}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to cancel grace period');
      return res.json();
    },
    reconnectSession: async (customerId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/billing/coa/reconnect/${customerId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to reconnect session');
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
    assign: async (id: string, customerId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      if (!res.ok) throw new Error('Failed to assign equipment');
      return res.json();
    },
    unassign: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment/${id}/unassign`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to unassign equipment');
      return res.json();
    },
    getMaintenanceLogs: async (params?: { equipmentId?: string; status?: string; technicianId?: string }) => {
      const query = params ? `?${new URLSearchParams(params as any)}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/maintenance${query}`);
      if (!res.ok) throw new Error('Failed to fetch maintenance logs');
      return res.json();
    },
    createMaintenanceLog: async (data: { equipmentId: string; type: string; description: string; cost?: number; scheduledAt: string; technicianId?: string; notes?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to schedule maintenance');
      return res.json();
    },
    completeMaintenance: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/maintenance/${id}/complete`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to complete maintenance');
      return res.json();
    },
    bulkImport: async (equipmentList: any[]) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventory/equipment/bulk-import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipment: equipmentList }),
      });
      if (!res.ok) throw new Error('Failed to bulk import equipment');
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
    getAll: async (filters?: any) => {
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
    getOne: async (id: string) => {
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
    create: async (data: any) => {
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
    update: async (id: string, data: any) => {
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
    cancelJob: async (id: string, reason: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to cancel work order');
      return res.json();
    },
    uploadPhotos: async (id: string, photoUrls: string[]) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrls }),
      });
      if (!res.ok) throw new Error('Failed to upload photos');
      return res.json();
    },
    addSignature: async (id: string, signature: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature }),
      });
      if (!res.ok) throw new Error('Failed to submit signature');
      return res.json();
    },
    updateQC: async (id: string, qcStatus: string, qcNotes?: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/qc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qcStatus, qcNotes }),
      });
      if (!res.ok) throw new Error('Failed to update QC status');
      return res.json();
    },
    testOpticalPower: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/jobs/${id}/optical-test`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to test optical power');
      return res.json();
    },
    getTechnicianJobs: async (technicianId: string, status?: string) => {
      const query = status ? `?status=${status}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/technician/${technicianId}/jobs${query}`);
      if (!res.ok) throw new Error('Failed to fetch technician jobs');
      return res.json();
    },
    getTodayJobs: async (technicianId: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/technician/${technicianId}/today`);
      if (!res.ok) throw new Error('Failed to fetch today jobs');
      return res.json();
    },
    getStats: async (technicianId?: string) => {
      const query = technicianId ? `?technicianId=${technicianId}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/stats${query}`);
      if (!res.ok) throw new Error('Failed to fetch field service stats');
      return res.json();
    },
    getCheckInHistory: async (date?: string) => {
      const query = date ? `?date=${date}` : '';
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/check-in-history${query}`);
      if (!res.ok) throw new Error('Failed to fetch check-in history');
      return res.json();
    },
    optimizeRoute: async (workOrderIds: string[]) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/field-service/optimize-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workOrderIds }),
      });
      if (!res.ok) throw new Error('Failed to optimize route');
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

  // Telegram Bot & Supergroup 14 Topics Operations Hub
  telegram: {
    getStatus: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/telegram/status`);
      if (!res.ok) throw new Error('Failed to fetch Telegram status');
      return res.json();
    },
    getTopics: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/telegram/topics`);
      if (!res.ok) throw new Error('Failed to fetch Telegram topics');
      return res.json();
    },
    getLogs: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/telegram/logs`);
      if (!res.ok) throw new Error('Failed to fetch Telegram logs');
      return res.json();
    },
    broadcast: async (data: {
      topicNo: number | string;
      message: string;
      title?: string;
      parseMode?: 'Markdown' | 'HTML';
    }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/telegram/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send Telegram broadcast');
      return res.json();
    },
    testTopic: async (topicNo: number | string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/telegram/test/${topicNo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`Failed to test Telegram topic ${topicNo}`);
      return res.json();
    },
    simulateScenario: async (
      scenario: 'PAYMENT' | 'OUTAGE' | 'ODP_FULL' | 'OPTICAL_CRITICAL' | 'ACTIVATION' | 'TICKET' | 'FINANCE',
      customData?: any
    ) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/telegram/simulate-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, customData }),
      });
      if (!res.ok) throw new Error('Failed to simulate scenario in Telegram');
      return res.json();
    },
  },

  // DNS Filtering & Internet Positif Kominfo
  dns: {
    getStatus: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/status`);
      if (!res.ok) throw new Error('Failed to fetch DNS status');
      return res.json();
    },
    getCategories: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/categories`);
      if (!res.ok) throw new Error('Failed to fetch DNS categories');
      return res.json();
    },
    getCustomRules: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/custom-rules`);
      if (!res.ok) throw new Error('Failed to fetch DNS custom rules');
      return res.json();
    },
    getBlockedLogs: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/blocked-logs`);
      if (!res.ok) throw new Error('Failed to fetch DNS blocked logs');
      return res.json();
    },
    syncTrustPositif: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/sync-trustpositif`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to sync TrustPositif database');
      return res.json();
    },
    toggleCategory: async (id: string, enabled: boolean) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/toggle-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled }),
      });
      if (!res.ok) throw new Error('Failed to toggle DNS category');
      return res.json();
    },
    addCustomRule: async (data: { domain: string; type: 'BLACKLIST' | 'WHITELIST'; category: string; reason: string; createdBy?: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/custom-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add DNS custom rule');
      return res.json();
    },
    deleteCustomRule: async (id: string) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/dns/custom-rules/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete DNS custom rule');
      return res.json();
    },
  },

  // Speedtest Server Lokal & Diagnostic SLA Studio
  speedtest: {
    getServerInfo: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/speedtest/server-info`);
      if (!res.ok) throw new Error('Failed to fetch Speedtest server info');
      return res.json();
    },
    getHistory: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/speedtest/history`);
      if (!res.ok) throw new Error('Failed to fetch Speedtest history');
      return res.json();
    },
    runBenchmark: async (data?: {
      clientIp?: string;
      pppoeUser?: string;
      customerName?: string;
      packagePlan?: string;
      packageSpeedMbps?: number;
    }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/speedtest/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || {}),
      });
      if (!res.ok) throw new Error('Failed to run speedtest benchmark');
      return res.json();
    },
  },

  // Zero-Touch Provisioning (ZTP) & Discovery Queue
  ztp: {
    getQueue: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ztp/queue`);
      if (!res.ok) throw new Error('Failed to fetch ZTP discovery queue');
      return res.json();
    },
    getHistory: async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ztp/history`);
      if (!res.ok) throw new Error('Failed to fetch ZTP history');
      return res.json();
    },
    provision: async (data: {
      discoveryId: string;
      customerName: string;
      internetNumber: string;
      packagePlan: string;
      wifiSsid?: string;
      wifiPassword?: string;
      technicianName?: string;
    }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ztp/provision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to auto-provision ONU');
      return res.json();
    },
  },
};

export default api;

