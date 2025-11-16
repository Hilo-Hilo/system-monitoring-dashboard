'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { LineChart } from '@/components/charts/LineChart';
import { SystemMetrics } from '@/lib/api';
import { useEffect, useState } from 'react';

interface CPUMetricsProps {
  metrics: SystemMetrics | null;
}

export function CPUMetrics({ metrics }: CPUMetricsProps) {
  const [history, setHistory] = useState<Array<{ timestamp: string; percent: number }>>([]);

  useEffect(() => {
    if (metrics) {
      setHistory((prev) => {
        const newHistory = [...prev, { timestamp: metrics.timestamp, percent: metrics.cpu.percent }];
        // Keep last 60 data points (2 minutes at 2s intervals)
        return newHistory.slice(-60);
      });
    }
  }, [metrics]);

  if (!metrics) {
    return <Card><CardContent className="p-6">Loading CPU metrics...</CardContent></Card>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GaugeChart
              value={metrics.cpu.percent}
              max={100}
              label="Overall CPU Usage"
              unit="%"
            />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">CPU Cores: {metrics.cpu.count}</div>
              {metrics.cpu.freq_current && (
                <div className="text-sm text-muted-foreground">
                  Frequency: {(metrics.cpu.freq_current / 1000).toFixed(2)} GHz
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={history}
              dataKey="percent"
              xAxisKey="timestamp"
              lines={[{ key: 'percent', name: 'CPU Usage (%)', color: '#3b82f6' }]}
              height={200}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

