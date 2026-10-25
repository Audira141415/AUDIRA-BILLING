import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardView from '@/components/portal/DashboardView';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('customer');
    if (!raw) {
      router.replace('/login');
      return;
    }
    try {
      const customer = JSON.parse(raw);
      const inet = customer.internetNumber || customer.id || 'NET-100234';
      if (!router.asPath.startsWith('/c/')) {
        router.replace(`/c/${inet}/dashboard`);
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return <DashboardView />;
}
