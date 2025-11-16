'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function useHistoricalData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalMetrics = async (
    startTime: Date,
    endTime: Date,
    metricType?: string,
    limit?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.history.getMetrics(
        startTime.toISOString(),
        endTime.toISOString(),
        metricType,
        limit
      );
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch historical data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessHistory = async (startTime: Date, endTime: Date, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.history.getProcesses(
        startTime.toISOString(),
        endTime.toISOString(),
        limit
      );
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch process history';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchHistoricalMetrics,
    fetchProcessHistory,
    loading,
    error,
  };
}

