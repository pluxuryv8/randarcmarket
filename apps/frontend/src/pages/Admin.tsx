import React, { useEffect, useState } from 'react';
import RequireAdmin from '../components/RequireAdmin';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const API = import.meta.env.VITE_API_BASE || '/api';

export default function AdminPage() {
  return (
    <RequireAdmin>
      <Dashboard />
    </RequireAdmin>
  );
}

function Dashboard() {
  const [data, setData] = useState<any>(null);
  async function load() { 
    const r = await fetch(`${API}/admin/stats`, { credentials: 'include' }); 
    setData(await r.json()); 
  }
  useEffect(() => { load(); }, []);

  const metrics = data?.metrics || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Admin Dashboard</h1>
        <Button onClick={load}>Refresh</Button>
      </div>

      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-[var(--muted)] text-sm">PID</div>
            <div>{data?.process?.pid}</div>
          </div>
          <div>
            <div className="text-[var(--muted)] text-sm">Uptime (s)</div>
            <div>{Math.round(data?.process?.uptime || 0)}</div>
          </div>
          <div>
            <div className="text-[var(--muted)] text-sm">Heap Used (MB)</div>
            <div>{((data?.process?.memory?.heapUsed || 0) / 1024 / 1024).toFixed(1)}</div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg">Provider metrics</h2>
        <div className="text-sm overflow-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(metrics.filter((m: any) => m.name.includes('provider_')), null, 2)}
          </pre>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg">HTTP metrics</h2>
        <div className="text-sm overflow-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(metrics.filter((m: any) => m.name.includes('http_')), null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
}
