import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Wifi, Globe, Plus, Edit, Trash2, Search, Filter, Activity, UserCheck, UserX, PauseCircle, Server, Package as PackageIcon } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  type: string;
  username: string;
  status: string;
  description: string | null;
  customerId: string;
  packageId: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  package: {
    id: string;
    name: string;
    price: number;
    speed: string;
  } | null;
  createdAt: string;
}

interface Statistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  pppoeCount: number;
  hotspotCount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  speed: string;
}

interface ServiceFormData {
  name: string;
  type: string;
  username: string;
  password: string;
  description: string;
  customerId: string;
  packageId: string;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function ServiceManagementPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    type: 'pppoe',
    username: '',
    password: '',
    description: '',
    customerId: '',
    packageId: '',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchStatistics();
    fetchServices();
    fetchCustomers();
    fetchPackages();
  }, [page, limit, search, typeFilter, statusFilter, customerFilter, packageFilter, sortBy, sortOrder]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/statistics/overview`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });
      
      if (search) params.append('search', search);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (customerFilter !== 'all') params.append('customerId', customerFilter);
      if (packageFilter !== 'all') params.append('packageId', packageFilter);

      const response = await fetch(`${API_BASE_URL}/services?${params}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/customers?limit=1000`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages?limit=1000&status=active`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setPackages(data.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCustomerFilter = (value: string) => {
    setCustomerFilter(value);
    setPage(1);
  };

  const handlePackageFilter = (value: string) => {
    setPackageFilter(value);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      type: 'pppoe',
      username: '',
      password: '',
      description: '',
      customerId: '',
      packageId: '',
      status: 'active',
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      type: service.type,
      username: service.username,
      password: '', // Don't show password for security
      description: service.description || '',
      customerId: service.customerId,
      packageId: service.packageId || '',
      status: service.status,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (service: Service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!showEditModal && !formData.password.trim()) errors.password = 'Password is required';
    if (!formData.customerId) errors.customerId = 'Customer is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Service created successfully!');
        setShowCreateModal(false);
        fetchServices();
        fetchStatistics();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create service'}`);
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedService) return;

    setFormLoading(true);
    try {
      // Don't send password if it's empty (means not changing it)
      const updateData = { ...formData };
      if (!updateData.password) {
        delete (updateData as any).password;
      }

      const response = await fetch(`${API_BASE_URL}/services/${selectedService.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('Service updated successfully!');
        setShowEditModal(false);
        fetchServices();
        fetchStatistics();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to update service'}`);
      }
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    setFormLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/services/${selectedService.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        alert('Service deleted successfully!');
        setShowDeleteModal(false);
        fetchServices();
        fetchStatistics();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to delete service'}`);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'pppoe': return 'bg-blue-100 text-blue-800';
      case 'hotspot': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'pppoe' ? <Wifi className="w-4 h-4" /> : <Globe className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
            <p className="text-gray-600 mt-1">Manage PPPoE and Hotspot services</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.total}</p>
                </div>
                <Server className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{statistics.active}</p>
                </div>
                <UserCheck className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Inactive</p>
                  <p className="text-3xl font-bold text-gray-600 mt-2">{statistics.inactive}</p>
                </div>
                <UserX className="w-12 h-12 text-slate-400 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Suspended</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{statistics.suspended}</p>
                </div>
                <PauseCircle className="w-12 h-12 text-yellow-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">PPPoE</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{statistics.pppoeCount}</p>
                </div>
                <Wifi className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Hotspot</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{statistics.hotspotCount}</p>
                </div>
                <Globe className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name, username..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="pppoe">PPPoE</option>
                <option value="hotspot">Hotspot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <select
                value={customerFilter}
                onChange={(e) => handleCustomerFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Customers</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
              <select
                value={packageFilter}
                onChange={(e) => handlePackageFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Packages</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.speed})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    Service Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('type')}>
                    Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdAt')}>
                    Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{service.name}</div>
                        {service.description && (
                          <div className="text-sm text-slate-400">{service.description.substring(0, 50)}{service.description.length > 50 ? '...' : ''}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClass(service.type)}`}>
                          {getTypeIcon(service.type)}
                          {service.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{service.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.customer.name}</div>
                        <div className="text-xs text-slate-400">{service.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.package ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.package.name}</div>
                            <div className="text-xs text-slate-400">{service.package.speed}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">No package</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(service.status)}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {formatDate(service.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(service)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(service)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && services.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
                </span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Service</h2>
              </div>
              
              <form onSubmit={handleCreateService} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Internet Service - John Doe"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pppoe">PPPoE</option>
                      <option value="hotspot">Hotspot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Username for authentication"
                    />
                    {formErrors.username && <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Password for authentication"
                    />
                    {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.customerId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </option>
                      ))}
                    </select>
                    {formErrors.customerId && <p className="mt-1 text-sm text-red-500">{formErrors.customerId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package
                    </label>
                    <select
                      value={formData.packageId}
                      onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No Package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.speed} - Rp{pkg.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description or notes"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Creating...' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Service</h2>
              </div>
              
              <form onSubmit={handleUpdateService} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Internet Service - John Doe"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pppoe">PPPoE</option>
                      <option value="hotspot">Hotspot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Username for authentication"
                    />
                    {formErrors.username && <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-slate-400">(leave empty to keep current)</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="New password (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.customerId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </option>
                      ))}
                    </select>
                    {formErrors.customerId && <p className="mt-1 text-sm text-red-500">{formErrors.customerId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package
                    </label>
                    <select
                      value={formData.packageId}
                      onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No Package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.speed} - Rp{pkg.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description or notes"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Updating...' : 'Update Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete service <strong>{selectedService.name}</strong>? This action will set the status to inactive.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={formLoading}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteService}
                    disabled={formLoading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Deleting...' : 'Delete Service'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
