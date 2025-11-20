'use client';

import { Card, CardContent } from '@/components/ui/card';

interface GaugeChartProps {
  value: number | null | undefined;
  max?: number;
  label?: string;
  unit?: string;
  color?: string;
}

export function GaugeChart({ value, max = 100, label, unit = '%', color }: GaugeChartProps) {
  const safeValue = value ?? 0;
  const percentage = Math.min((safeValue / max) * 100, 100);
  const gaugeColor = color || (percentage > 80 ? '#ef4444' : percentage > 60 ? '#f59e0b' : '#10b981');
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {label && <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>}
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={gaugeColor}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: gaugeColor }}>
                  {safeValue.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">{unit}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

