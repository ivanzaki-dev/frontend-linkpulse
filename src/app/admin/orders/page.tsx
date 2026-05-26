'use client';

import { useState } from 'react';
import { Alert, Button, Card, TextInput } from '@/components/ui';
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
    <div className="max-w-2xl space-y-4">
      <Card>
        <p className="text-sm text-gray-500">Mark paid manual (bypass payment placeholder)</p>
        <TextInput className="mt-3" label="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        <Button className="mt-3" onClick={markPaid}>
          Mark paid
        </Button>
        {msg && (
          <Alert kind="success" className="mt-3">
            {msg}
          </Alert>
        )}
      </Card>
      <Card>
        <Button variant="secondary" onClick={loadStale}>
          Load stale pool
        </Button>
        <pre className="mt-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 overflow-auto max-h-64 font-mono">
          {JSON.stringify(stale, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
