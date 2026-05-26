'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Card, StatusBadge } from '@/components/ui';
import { listOrders, ApiClientError } from '@/lib/api';
import { copy } from '@/lib/copy';
import type { OrderListItem } from '@/lib/types';
import { fmtDateTime, fmtIDR, truncId } from '@/lib/utils';

export default function OrdersPage() {
  const t = copy.orders;
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listOrders({ limit: 50 })
      .then((r) => setOrders(r.orders))
      .catch((e) => setError(e instanceof ApiClientError ? e.message : t.errorLoad));
  }, [t.errorLoad]);

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        {error && <p className="text-error-600 text-sm mt-2">{error}</p>}
        <Card className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Tanggal</th>
                <th className="pb-2">No. pesanan</th>
                <th className="pb-2">Link Shopee</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50">
                  <td className="py-3">{fmtDateTime(o.created_at)}</td>
                  <td className="py-3 text-xs text-gray-600">{truncId(o.id)}</td>
                  <td className="py-3">{o.total_shopee_links}</td>
                  <td className="py-3">{fmtIDR(Number(o.total_price))}</td>
                  <td className="py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3">
                    <Link href={`/orders/${o.id}`} className="text-primary-600 hover:underline">
                      {t.detail}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !error && (
            <p className="text-center text-gray-500 py-8">{t.empty}</p>
          )}
        </Card>
      </div>
    </>
  );
}
