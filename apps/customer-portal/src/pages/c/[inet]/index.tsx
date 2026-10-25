import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardView from '@/components/portal/DashboardView';

export default function CustomerIndexPage() {
  const router = useRouter();
  const { inet } = router.query;

  useEffect(() => {
    if (inet) {
      router.replace(`/c/${inet}/dashboard`);
    }
  }, [router, inet]);

  return <DashboardView />;
}
