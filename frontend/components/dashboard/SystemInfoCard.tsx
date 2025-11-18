'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, SystemInfo } from '@/lib/api';
import { formatDistance } from 'date-fns';

export function SystemInfoCard() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await api.metrics.getSystemInfo();
        setInfo(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load system info');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !info) {
    return null; // Hide card on error
  }

  // Format uptime
  const uptimeDuration = formatDistance(0, info.uptime * 1000, { includeSeconds: true });

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">Hostname</span>
            <span className="font-medium">{info.hostname}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">OS</span>
            <span className="font-medium">{info.os} {info.os_release}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Processor</span>
            <span className="font-medium truncate block" title={info.processor}>{info.processor}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Uptime</span>
            <span className="font-medium">{uptimeDuration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

