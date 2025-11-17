'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/AreaChart';
import { LineChart } from '@/components/charts/LineChart';

interface DiskMetricsChartProps {
  data: Array<Record<string, any>>;
  loading?: boolean;
  timezone?: string;
}

export function DiskMetricsChart({ data, loading, timezone = 'UTC' }: DiskMetricsChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      timestamp: item.timestamp,
      'Disk Used (TB)': item.disk?.used ? (item.disk.used / 1024 / 1024 / 1024 / 1024) : null,
      'Disk Free (TB)': item.disk?.free ? (item.disk.free / 1024 / 1024 / 1024 / 1024) : null,
      'Disk Usage (%)': item.disk?.percent ?? null,
    }));
  }, [data]);

  // Don't hide chart while loading if we have previous data
  if (chartData.length === 0 && !loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disk Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Disk Usage (%)</h3>
              <LineChart
                data={chartData}
                dataKey="Disk Usage (%)"
                xAxisKey="timestamp"
                height={250}
                timezone={timezone}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Disk Usage (TB)</h3>
              <AreaChart
                data={chartData}
                dataKey="Disk Used (TB)"
                xAxisKey="timestamp"
                name="Disk Used"
                color="#82ca9d"
                height={250}
                timezone={timezone}
              />
            </div>
      </CardContent>
    </Card>
  );
}

