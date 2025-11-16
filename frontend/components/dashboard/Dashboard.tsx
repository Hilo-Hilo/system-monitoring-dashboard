'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  if (!metrics) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time system resource metrics</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage</CardTitle>
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
          <CardTitle>Memory Usage</CardTitle>
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
          <CardTitle>Disk Usage</CardTitle>
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
          <CardTitle>Network I/O</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Sent: {(metrics.network.bytes_sent / 1024).toFixed(2)} KB ({metrics.network.packets_sent} packets)
            </p>
            <p className="text-sm text-muted-foreground">
              Received: {(metrics.network.bytes_recv / 1024).toFixed(2)} KB ({metrics.network.packets_recv} packets)
            </p>
          </div>
        </CardContent>
      </Card>

      {metrics.gpus && metrics.gpus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>GPU Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.gpus.map((gpu, index) => (
              <div key={index} className="space-y-2 mb-4">
                <p className="font-medium">{gpu.name}</p>
                <p className="text-sm text-muted-foreground">Utilization: {gpu.utilization}%</p>
                <p className="text-sm text-muted-foreground">Temperature: {gpu.temperature}°C</p>
                <p className="text-sm text-muted-foreground">
                  Memory: {gpu.memory_percent.toFixed(1)}% ({gpu.memory_used} MB / {gpu.memory_total} MB)
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

