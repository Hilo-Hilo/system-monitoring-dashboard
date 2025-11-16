'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { api, ProcessInfo } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function ProcessList() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchProcesses = async () => {
      try {
        const response = await api.processes.getAll();
        setProcesses(response.data.processes);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError(err.response?.data?.detail || 'Failed to fetch processes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
    const interval = setInterval(fetchProcesses, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [router]);

  const handleKillProcess = async (pid: number) => {
    if (!confirm(`Are you sure you want to kill process ${pid}?`)) {
      return;
    }

    try {
      await api.processes.kill(pid);
      // Refresh process list
      const response = await api.processes.getAll();
      setProcesses(response.data.processes);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to kill process');
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading processes...</CardContent></Card>;
  }

  if (error) {
    return <Card><CardContent className="p-6 text-destructive">{error}</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Running Processes ({processes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>CPU %</TableHead>
                <TableHead>Memory %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.slice(0, 100).map((proc) => (
                <TableRow key={proc.pid}>
                  <TableCell>{proc.pid}</TableCell>
                  <TableCell className="font-medium">{proc.name}</TableCell>
                  <TableCell>{proc.username}</TableCell>
                  <TableCell>{proc.cpu_percent.toFixed(2)}%</TableCell>
                  <TableCell>{proc.memory_percent.toFixed(2)}%</TableCell>
                  <TableCell>{proc.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleKillProcess(proc.pid)}
                    >
                      Kill
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

