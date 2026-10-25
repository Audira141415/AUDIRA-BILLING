import { useEffect } from 'react';
import { useRouter } from 'next/router';
import TicketsView from '@/components/portal/TicketsView';

export default function Tickets() {
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
        router.replace(`/c/${inet}/tickets`);
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return <TicketsView />;
}
