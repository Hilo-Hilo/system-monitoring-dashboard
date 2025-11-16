'use client';

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AreaChartProps {
  data: Array<Record<string, any>>;
  dataKey: string;
  xAxisKey?: string;
  name?: string;
  color?: string;
  height?: number;
}

export function AreaChart({ data, dataKey, xAxisKey = 'timestamp', name, color = '#8884d8', height = 300 }: AreaChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ width: '100%', height }}>No data available</div>;
  }

  return (
    <div style={{ width: '100%', height, overflow: 'auto' }}>
      <RechartsAreaChart data={data} width={800} height={height}>
        <defs>
          <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#color${dataKey})`}
          name={name || dataKey}
        />
      </RechartsAreaChart>
    </div>
  );
}

