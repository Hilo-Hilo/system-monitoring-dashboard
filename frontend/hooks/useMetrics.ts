'use client';

import { useEffect, useState } from 'react';
import { api, SystemMetrics } from '@/lib/api';

export function useMetrics(interval: number = 2000) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchMetrics = async () => {
      try {
        const response = await api.metrics.getCurrent();
        setMetrics(response.data);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up polling
    intervalId = setInterval(fetchMetrics, interval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [interval]);

  return { metrics, loading, error };
}

