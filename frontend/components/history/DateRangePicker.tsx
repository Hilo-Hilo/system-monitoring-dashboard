'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subHours, subDays, subWeeks, subMonths, format } from 'date-fns';

interface DateRangePickerProps {
  startTime: Date;
  endTime: Date;
  onRangeChange: (start: Date, end: Date) => void;
  timezone?: string;
}

// Format date in specified timezone
function formatInTimezone(date: Date, timezone: string, formatStr: string): string {
  if (timezone === 'UTC') {
    return format(date, formatStr);
  }
  
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    
    if (formatStr === "yyyy-MM-dd'T'HH:mm") {
      return `${year}-${month}-${day}T${hour}:${minute}`;
    }
    
    // For other formats, use a simpler approach
    const dateStr = `${year}-${month}-${day} ${hour}:${minute}`;
    return format(new Date(dateStr), formatStr);
  } catch (e) {
    // Fallback to UTC if timezone is invalid
    return format(date, formatStr);
  }
}

// Format date for display in timezone
function formatDateForDisplay(date: Date, timezone: string): string {
  if (timezone === 'UTC') {
    return format(date, 'PPpp');
  }
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  } catch (e) {
    return format(date, 'PPpp');
  }
}

export function DateRangePicker({ startTime, endTime, onRangeChange, timezone = 'UTC' }: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  const presets = [
    { label: 'Last Hour', getRange: () => ({ start: subHours(new Date(), 1), end: new Date() }) },
    { label: 'Last 24 Hours', getRange: () => ({ start: subDays(new Date(), 1), end: new Date() }) },
    { label: 'Last Week', getRange: () => ({ start: subWeeks(new Date(), 1), end: new Date() }) },
    { label: 'Last Month', getRange: () => ({ start: subMonths(new Date(), 1), end: new Date() }) },
  ];

  const handlePreset = (preset: typeof presets[0]) => {
    const { start, end } = preset.getRange();
    onRangeChange(start, end);
    setShowCustom(false);
  };

  const handleCustomStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    if (!isNaN(newStart.getTime())) {
      onRangeChange(newStart, endTime);
    }
  };

  const handleCustomEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    if (!isNaN(newEnd.getTime())) {
      onRangeChange(startTime, newEnd);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => handlePreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
          <Button
            variant={showCustom ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowCustom(!showCustom)}
          >
            Custom Range
          </Button>
        </div>

        {showCustom && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time (UTC)</label>
              <input
                type="datetime-local"
                value={format(startTime, "yyyy-MM-dd'T'HH:mm")}
                onChange={handleCustomStart}
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatDateForDisplay(startTime, timezone)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Time (UTC)</label>
              <input
                type="datetime-local"
                value={format(endTime, "yyyy-MM-dd'T'HH:mm")}
                onChange={handleCustomEnd}
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatDateForDisplay(endTime, timezone)}
              </p>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Showing data from {formatDateForDisplay(startTime, timezone)} to {formatDateForDisplay(endTime, timezone)}
        </div>
      </CardContent>
    </Card>
  );
}

