'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { HistoryDashboard } from '@/components/history/HistoryDashboard';

export default function HistoryPage() {
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!auth.isAuthenticated()) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Historical Metrics</h1>
        <p className="text-muted-foreground">View historical system resource metrics</p>
      </div>
      <HistoryDashboard />
    </div>
  );
}

