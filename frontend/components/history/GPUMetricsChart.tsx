'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';

interface GPUMetricsChartProps {
  data: Array<Record<string, any>>;
  loading?: boolean;
  timezone?: string;
}

export function GPUMetricsChart({ data, loading, timezone = 'UTC' }: GPUMetricsChartProps) {
  const gpuCharts = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Extract all unique GPU indices from the data
    const gpuIndices = new Set<number>();
    data.forEach((item) => {
      if (item.gpu && Array.isArray(item.gpu)) {
        item.gpu.forEach((gpu: any) => {
          if (gpu.index !== undefined) {
            gpuIndices.add(gpu.index);
          }
        });
      }
    });

    if (gpuIndices.size === 0) return [];

    // Create chart data for each GPU
    return Array.from(gpuIndices).map((gpuIndex) => {
      const chartData = data.map((item) => {
        const gpu = item.gpu && Array.isArray(item.gpu) 
          ? item.gpu.find((g: any) => g.index === gpuIndex)
          : null;

        return {
          timestamp: item.timestamp,
          'GPU Utilization (%)': gpu?.utilization ?? null,
          'GPU Temperature (°C)': gpu?.temperature ?? null,
          'GPU Memory (%)': gpu?.memory_percent ?? null,
        };
      }).filter(item => 
        item['GPU Utilization (%)'] !== null || 
        item['GPU Temperature (°C)'] !== null ||
        item['GPU Memory (%)'] !== null
      );

      // Get GPU name from first data point
      const firstGpu = data.find((item) => {
        const gpu = item.gpu && Array.isArray(item.gpu) 
          ? item.gpu.find((g: any) => g.index === gpuIndex)
          : null;
        return gpu !== null;
      });
      const gpuName = firstGpu?.gpu?.find((g: any) => g.index === gpuIndex)?.name || `GPU ${gpuIndex}`;

      return { gpuIndex, gpuName, chartData };
    });
  }, [data]);

  // Don't hide chart while loading if we have previous data
  if (gpuCharts.length === 0 && !loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GPU Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gpuCharts.map(({ gpuIndex, gpuName, chartData }) => (
          <div key={gpuIndex}>
            <h3 className="text-sm font-medium mb-2">{gpuName}</h3>
            <LineChart
              data={chartData}
              dataKey="GPU Utilization (%)"
              xAxisKey="timestamp"
              lines={[
                { key: 'GPU Utilization (%)', name: 'Utilization (%)', color: '#8884d8' },
                { key: 'GPU Temperature (°C)', name: 'Temperature (°C)', color: '#ff7300' },
                { key: 'GPU Memory (%)', name: 'Memory (%)', color: '#82ca9d' },
              ]}
              height={250}
              timezone={timezone}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

