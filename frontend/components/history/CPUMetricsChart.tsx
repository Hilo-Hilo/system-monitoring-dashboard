'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';

interface CPUMetricsChartProps {
  data: Array<Record<string, any>>;
  loading?: boolean;
  timezone?: string;
}

export function CPUMetricsChart({ data, loading, timezone = 'UTC' }: CPUMetricsChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      timestamp: item.timestamp,
      'CPU Usage (%)': item.cpu?.percent ?? null,
      'CPU Frequency (GHz)': item.cpu?.freq_current ? (item.cpu.freq_current / 1000) : null,
    }));
  }, [data]);

  // Don't hide chart while loading if we have previous data
  if (chartData.length === 0 && !loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CPU Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          data={chartData}
          dataKey="CPU Usage (%)"
          xAxisKey="timestamp"
          lines={[
            { key: 'CPU Usage (%)', name: 'CPU Usage (%)', color: '#8884d8' },
            { key: 'CPU Frequency (GHz)', name: 'CPU Frequency (GHz)', color: '#82ca9d' },
          ]}
          height={300}
          timezone={timezone}
        />
      </CardContent>
    </Card>
  );
}

