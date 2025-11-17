'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/AreaChart';
import { LineChart } from '@/components/charts/LineChart';

interface MemoryMetricsChartProps {
  data: Array<Record<string, any>>;
  loading?: boolean;
  timezone?: string;
}

export function MemoryMetricsChart({ data, loading, timezone = 'UTC' }: MemoryMetricsChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      timestamp: item.timestamp,
      'Memory Used (GB)': item.memory?.used ? (item.memory.used / 1024 / 1024 / 1024) : null,
      'Memory Available (GB)': item.memory?.available ? (item.memory.available / 1024 / 1024 / 1024) : null,
      'Memory Usage (%)': item.memory?.percent ?? null,
    }));
  }, [data]);

  // Don't hide chart while loading if we have previous data
  if (chartData.length === 0 && !loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Memory Usage (%)</h3>
              <LineChart
                data={chartData}
                dataKey="Memory Usage (%)"
                xAxisKey="timestamp"
                height={250}
                timezone={timezone}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Memory Usage (GB)</h3>
              <AreaChart
                data={chartData}
                dataKey="Memory Used (GB)"
                xAxisKey="timestamp"
                name="Memory Used"
                color="#8884d8"
                height={250}
                timezone={timezone}
              />
            </div>
      </CardContent>
    </Card>
  );
}

