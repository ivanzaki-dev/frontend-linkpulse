'use client';

import { useState } from 'react';
import { Button, Card, TextInput } from '@/components/ui';
import { listStalePool, markOrderPaidAdmin } from '@/lib/api';

export default function AdminOrdersPage() {
  const [orderId, setOrderId] = useState('');
  const [msg, setMsg] = useState('');
  const [stale, setStale] = useState<unknown[]>([]);

  const markPaid = async () => {
    const out = await markOrderPaidAdmin(orderId.trim());
    setMsg(`Order ${out.order_id} → ${out.status}`);
  };

  const loadStale = async () => {
    const r = await listStalePool();
    setStale(r.stale);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Orders ops</h1>
      <Card className="mt-6">
        <p className="text-sm text-gray-500">Mark paid manual (bypass payment placeholder)</p>
        <TextInput className="mt-3" label="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        <Button className="mt-3" onClick={markPaid}>
          Mark paid
        </Button>
        {msg && <p className="text-sm text-success-700 mt-2">{msg}</p>}
      </Card>
      <Card className="mt-4">
        <Button variant="secondary" onClick={loadStale}>
          Load stale pool
        </Button>
        <pre className="mt-3 text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
          {JSON.stringify(stale, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
