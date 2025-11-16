'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

interface LineChartProps {
  data: Array<Record<string, any>>;
  dataKey: string;
  xAxisKey?: string;
  lines?: Array<{ key: string; name: string; color?: string }>;
  height?: number;
}

export function LineChart({ data, dataKey, xAxisKey = 'timestamp', lines, height = 300 }: LineChartProps) {
  const defaultLines = useMemo(() => lines || [{ key: dataKey, name: dataKey, color: '#8884d8' }], [lines, dataKey]);

  if (!data || data.length === 0) {
    return <div style={{ width: '100%', height }}>No data available</div>;
  }

  return (
    <div style={{ width: '100%', height }}>
      <RechartsLineChart data={data} width={800} height={height}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xAxisKey} 
          tickFormatter={(value) => {
            if (typeof value === 'string' && value.includes('T')) {
              return new Date(value).toLocaleTimeString();
            }
            return value;
          }}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(value) => {
            if (typeof value === 'string' && value.includes('T')) {
              return new Date(value).toLocaleString();
            }
            return value;
          }}
        />
        <Legend />
        {defaultLines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color || '#8884d8'}
            name={line.name}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </div>
  );
}

