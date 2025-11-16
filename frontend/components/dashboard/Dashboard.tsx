'use client';

import { CPUMetrics } from '@/components/metrics/CPUMetrics';
import { MemoryMetrics } from '@/components/metrics/MemoryMetrics';
import { DiskMetrics } from '@/components/metrics/DiskMetrics';
import { NetworkMetrics } from '@/components/metrics/NetworkMetrics';
import { GPUMetrics } from '@/components/metrics/GPUMetrics';
import { useMetrics } from '@/hooks/useMetrics';

export function Dashboard() {
  const { metrics, loading, error } = useMetrics();

  if (loading && !metrics) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time system resource metrics</p>
      </div>
      
      <CPUMetrics metrics={metrics} />
      <MemoryMetrics metrics={metrics} />
      <DiskMetrics metrics={metrics} />
      <NetworkMetrics metrics={metrics} />
      <GPUMetrics metrics={metrics} />
    </div>
  );
}

