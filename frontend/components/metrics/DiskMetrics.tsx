'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { useMetrics } from '@/hooks/useMetrics';
import { useEffect, useState } from 'react';

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function DiskMetrics() {
  const { metrics } = useMetrics();
  const [history, setHistory] = useState<Array<{ timestamp: string; percent: number; used: number }>>([]);

  useEffect(() => {
    if (metrics) {
      setHistory((prev) => {
        const newHistory = [...prev, {
          timestamp: metrics.timestamp,
          percent: metrics.disk.percent,
          used: metrics.disk.used
        }];
        return newHistory.slice(-60);
      });
    }
  }, [metrics]);

  if (!metrics) {
    return <Card><CardContent className="p-6">Loading disk metrics...</CardContent></Card>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Disk Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GaugeChart
              value={metrics.disk.percent}
              max={100}
              label="Disk Usage"
              unit="%"
            />
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-medium">{formatBytes(metrics.disk.total)}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Used: </span>
                <span className="font-medium">{formatBytes(metrics.disk.used)}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Free: </span>
                <span className="font-medium">{formatBytes(metrics.disk.free)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Disk Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={history}
              dataKey="percent"
              xAxisKey="timestamp"
              name="Disk Usage (%)"
              color="#f59e0b"
              height={200}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

