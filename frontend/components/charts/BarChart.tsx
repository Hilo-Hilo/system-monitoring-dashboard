'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<Record<string, any>>;
  dataKey: string;
  xAxisKey?: string;
  name?: string;
  color?: string;
  height?: number;
}

export function BarChart({ data, dataKey, xAxisKey = 'name', name, color = '#8884d8', height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} name={name || dataKey} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

