'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from '@/components/ui/info-icon';
import { useMetrics } from '@/hooks/useMetrics';

type NetworkUnit = 'MB/s' | 'Mbps';

export function Dashboard() {
  const { metrics, loading, error } = useMetrics();
  const [networkRates, setNetworkRates] = useState<{ sent: number; recv: number } | null>(null);
  const [networkUnit, setNetworkUnit] = useState<NetworkUnit>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('network_unit') as NetworkUnit) || 'MB/s';
    }
    return 'MB/s';
  });
  const prevNetworkRef = useRef<{ sent: number; recv: number; timestamp: number } | null>(null);

  // Save network unit preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('network_unit', networkUnit);
    }
  }, [networkUnit]);

  // Calculate network rates
  useEffect(() => {
    if (metrics) {
      const metricsTime = new Date(metrics.timestamp).getTime();
      const current = {
        sent: metrics.network.bytes_sent,
        recv: metrics.network.bytes_recv,
        timestamp: metricsTime,
      };

      if (prevNetworkRef.current) {
        const timeDiff = (metricsTime - prevNetworkRef.current.timestamp) / 1000; // seconds
        if (timeDiff > 0 && timeDiff < 10) { // Only calculate if time difference is reasonable (avoid large gaps)
          const sentRate = (current.sent - prevNetworkRef.current.sent) / timeDiff; // bytes per second
          const recvRate = (current.recv - prevNetworkRef.current.recv) / timeDiff; // bytes per second
          setNetworkRates({ sent: Math.max(0, sentRate), recv: Math.max(0, recvRate) });
        }
      }

      prevNetworkRef.current = current;
    }
  }, [metrics]);

  // Format network rate
  const formatNetworkRate = (bytesPerSecond: number): string => {
    if (networkUnit === 'Mbps') {
      const mbps = (bytesPerSecond * 8) / (1024 * 1024); // Convert bytes/s to Mbps
      if (mbps >= 1) {
        return `${mbps.toFixed(2)} Mbps`;
      } else {
        const kbps = (bytesPerSecond * 8) / 1024;
        return `${kbps.toFixed(2)} Kbps`;
      }
    } else {
      // MB/s
      const mbps = bytesPerSecond / (1024 * 1024); // Convert bytes/s to MB/s
      if (mbps >= 1) {
        return `${mbps.toFixed(2)} MB/s`;
      } else {
        const kbps = bytesPerSecond / 1024;
        return `${kbps.toFixed(2)} KB/s`;
      }
    }
  };

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

  if (!metrics) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time system resource metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>CPU Usage</CardTitle>
              <InfoIcon content="CPU usage percentage represents the average utilization across all CPU cores. A value of 100% means all cores are fully utilized. The percentage is calculated as the average of all cores, not per-core (each core can be up to 100%)." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{metrics.cpu.percent.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Cores: {metrics.cpu.count}</p>
              {metrics.cpu.freq_current && (
                <p className="text-sm text-muted-foreground">
                  Frequency: {(metrics.cpu.freq_current / 1000).toFixed(2)} GHz
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Memory Usage</CardTitle>
              <InfoIcon content="Memory usage shows the percentage of RAM currently in use. 'Used' includes memory actively used by applications and system processes. 'Available' is memory that can be allocated to new processes immediately. Total memory is the physical RAM installed in the system." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{metrics.memory.percent.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">
                Used: {(metrics.memory.used / 1024 / 1024 / 1024).toFixed(2)} GB / {(metrics.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB
              </p>
              <p className="text-sm text-muted-foreground">
                Available: {(metrics.memory.available / 1024 / 1024 / 1024).toFixed(2)} GB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Disk Usage</CardTitle>
              <InfoIcon content="Disk usage shows the percentage of storage space used on the primary disk partition. 'Used' is the amount of space occupied by files and data. 'Free' is the remaining space available for new files. This metric monitors the root filesystem where the system is installed." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{metrics.disk.percent.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">
                Used: {(metrics.disk.used / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB / {(metrics.disk.total / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB
              </p>
              <p className="text-sm text-muted-foreground">
                Free: {(metrics.disk.free / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Network I/O</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  value={networkUnit}
                  onChange={(e) => setNetworkUnit(e.target.value as NetworkUnit)}
                  className="px-2 py-1 text-xs border rounded bg-background"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="MB/s">MB/s</option>
                  <option value="Mbps">Mbps</option>
                </select>
                <InfoIcon content="Network I/O shows the current data transfer rate (bytes per second). 'Sent' is the rate of data transmitted from this system. 'Received' is the rate of data received by this system. Rates are calculated from cumulative counters and automatically adapt units (KB/s, MB/s, or Kbps, Mbps) based on the transfer speed. You can toggle between MB/s (megabytes per second) and Mbps (megabits per second) using the dropdown." />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {networkRates ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Sent: <span className="text-foreground font-semibold">{formatNetworkRate(networkRates.sent)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Received: <span className="text-foreground font-semibold">{formatNetworkRate(networkRates.recv)}</span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Calculating network rates...</p>
              )}
              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>Total Sent: {(metrics.network.bytes_sent / 1024 / 1024).toFixed(2)} MB ({metrics.network.packets_sent.toLocaleString()} packets)</p>
                <p>Total Received: {(metrics.network.bytes_recv / 1024 / 1024).toFixed(2)} MB ({metrics.network.packets_recv.toLocaleString()} packets)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {metrics.gpus && metrics.gpus.length > 0 && (
          <Card className={metrics.gpus.length > 1 ? 'md:col-span-2 lg:col-span-3' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GPU Metrics</CardTitle>
                <InfoIcon content="GPU utilization shows the percentage of GPU compute resources currently in use. GPU memory percentage shows how much of the GPU's dedicated VRAM is being used. Temperature is the current GPU core temperature. These metrics are specific to NVIDIA GPUs." />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.gpus.map((gpu, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-lg">
                    <p className="font-medium">{gpu.name}</p>
                    <p className="text-sm text-muted-foreground">Utilization: {gpu.utilization}%</p>
                    <p className="text-sm text-muted-foreground">Temperature: {gpu.temperature}°C</p>
                    <p className="text-sm text-muted-foreground">
                      Memory: {gpu.memory_percent.toFixed(1)}% ({gpu.memory_used} MB / {gpu.memory_total} MB)
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

