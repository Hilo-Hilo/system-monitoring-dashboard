'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: Array<Record<string, any>>;
  dataKey: string;
  xAxisKey?: string;
  name?: string;
  color?: string;
  height?: number;
}

export function BarChart({ data, dataKey, xAxisKey = 'name', name, color = '#8884d8', height = 300 }: BarChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ width: '100%', height }}>No data available</div>;
  }

  return (
    <div style={{ width: '100%', height, overflow: 'auto' }}>
      <RechartsBarChart data={data} width={800} height={height}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} name={name || dataKey} />
      </RechartsBarChart>
    </div>
  );
}

