'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, TextInput } from '@/components/ui';
import { listAdminOrders } from '@/lib/api';
import type { AdminOrderListItem } from '@/lib/types';
import { fmtIDR } from '@/lib/utils';

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-700',
    paid: 'bg-blue-50 text-blue-700',
    processing: 'bg-amber-50 text-amber-800',
    awaiting_payment: 'bg-gray-100 text-gray-700',
    failed: 'bg-red-50 text-red-700',
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<AdminOrderListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await listAdminOrders({ limit: 50, offset: 0, q: search || undefined });
      setRows(r.orders);
      setTotal(r.total);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div className="flex flex-wrap gap-2 items-end">
          <TextInput
            label="Cari invoice / email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-w-[220px]"
          />
          <Button type="button" variant="secondary" onClick={() => setSearch(q.trim())}>
            Cari
          </Button>
        </div>
        <Link href="/admin/orders/new">
          <Button>+ Buat order gratis</Button>
        </Link>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Memuat…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Belum ada order
                  </td>
                </tr>
              )}
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-primary-600 font-medium hover:underline"
                    >
                      {o.invoice_number || o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {o.created_by_admin ? (
                      <>
                        <div>{o.channel_name || o.customer.name || '—'}</div>
                        {o.admin_operator_name && (
                          <div className="text-xs text-gray-500">
                            Admin: {o.admin_operator_name}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>{o.customer.email || '—'}</div>
                        {o.customer.name && (
                          <div className="text-xs text-gray-500">{o.customer.name}</div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">{statusBadge(o.status)}</td>
                  <td className="px-4 py-3 tabular-nums">{o.total_shopee_links}</td>
                  <td className="px-4 py-3 tabular-nums">{fmtIDR(o.total_price)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
          Menampilkan {rows.length} dari {total} order
        </div>
      </Card>
    </div>
  );
}
