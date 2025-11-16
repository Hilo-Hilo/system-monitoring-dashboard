'use client';

import { CPUMetrics } from '@/components/metrics/CPUMetrics';
import { MemoryMetrics } from '@/components/metrics/MemoryMetrics';
import { DiskMetrics } from '@/components/metrics/DiskMetrics';
import { NetworkMetrics } from '@/components/metrics/NetworkMetrics';
import { GPUMetrics } from '@/components/metrics/GPUMetrics';

export function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time system resource metrics</p>
      </div>
      
      <CPUMetrics />
      <MemoryMetrics />
      <DiskMetrics />
      <NetworkMetrics />
      <GPUMetrics />
    </div>
  );
}

