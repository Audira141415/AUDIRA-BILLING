import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface Package {
  id: string;
  name: string;
  price: number;
  speed: string;
  description: string | null;
}

interface ProfileData {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  internetNumber: string | null;
  ipAddress: string | null;
  installedModem: string | null;
  installationDate: string | null;
  status: string;
  package: Package | null;
}

export default function CustomerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      router.push('/customer/login');
      return;
    }

    try {
      setLoading(true);
      const data = await api.customer.getProfile(token);
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone,
        address: data.address || '',
      });
    } catch (err: any) {
      if (err.message?.includes('401')) {
        localStorage.removeItem('customer_token');
        router.push('/customer/login');
      } else {
        setError(err.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
        address: profile.address || '',
      });
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      router.push('/customer/login');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await api.customer.updateProfile(token, formData);
      await loadProfile();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_info');
    router.push('/customer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
          <button
            onClick={() => router.push('/customer/dashboard')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push('/customer/dashboard')}
              className="text-blue-600 hover:underline mb-2 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{profile.email || '-'}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.address || '-'}</p>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Package & Technical Info */}
          <div className="space-y-6">
            {/* Current Package */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Package</h2>
              {profile.package ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Package Name</p>
                    <p className="text-lg font-semibold text-blue-600">{profile.package.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Speed</p>
                    <p className="text-gray-900">{profile.package.speed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-gray-900">Rp {profile.package.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">No active package</p>
              )}
            </div>

            {/* Technical Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Internet Number</p>
                  <p className="text-gray-900 font-mono">{profile.internetNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">IP Address</p>
                  <p className="text-gray-900 font-mono">{profile.ipAddress || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Modem</p>
                  <p className="text-gray-900">{profile.installedModem || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Installation Date</p>
                  <p className="text-gray-900">
                    {profile.installationDate
                      ? new Date(profile.installationDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      profile.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {profile.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
