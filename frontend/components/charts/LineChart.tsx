'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<Record<string, any>>;
  dataKey: string;
  xAxisKey?: string;
  lines?: Array<{ key: string; name: string; color?: string }>;
  height?: number;
}

export function LineChart({ data, dataKey, xAxisKey = 'timestamp', lines, height = 300 }: LineChartProps) {
  const defaultLines = lines || [{ key: dataKey, name: dataKey, color: '#8884d8' }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
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
    </ResponsiveContainer>
  );
}

