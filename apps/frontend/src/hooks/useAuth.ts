import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  employeeId?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    
    setLoading(false);
  }, [router]);

  const isAdmin = () => user?.role === 'ADMIN';
  const isEmployee = () => ['TECHNICIAN', 'NOC', 'CS', 'BILLING'].includes(user?.role || '');
  const canAccessHRM = () => isAdmin() || isEmployee();
  const canEditAllData = () => isAdmin();
  const getEmployeeId = () => user?.employeeId || null;

  return {
    user,
    loading,
    isAdmin,
    isEmployee,
    canAccessHRM,
    canEditAllData,
    getEmployeeId,
  };
}
