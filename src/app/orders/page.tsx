'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import {
  Alert,
  Button,
  Card,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui';
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
        <PageHeader title={t.title} />

        {error && (
          <Alert kind="error" className="mt-4">
            {error}
          </Alert>
        )}

        <Card className="mt-6">
          {orders.length === 0 && !error ? (
            <EmptyState title={t.empty} description={t.emptyHint}>
              <Link href="/order/new">
                <Button>{copy.landing.ctaPreview}</Button>
              </Link>
            </EmptyState>
          ) : (
            <>
              <div className="md:hidden space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-lg border border-gray-100 p-4 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs text-gray-500">{fmtDateTime(o.created_at)}</p>
                        <p className="font-mono text-xs text-gray-600 mt-0.5">{truncId(o.id)}</p>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-gray-500">{o.total_shopee_links} link</span>
                      <span className="font-medium tabular-nums">{fmtIDR(Number(o.total_price))}</span>
                    </div>
                    <Link
                      href={`/orders/${o.id}`}
                      className="mt-3 inline-flex min-h-11 items-center text-sm text-primary-600 font-medium"
                    >
                      {t.detail} →
                    </Link>
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                <DataTable>
                  <DataTableHead>
                    <DataTableHeaderCell>Tanggal</DataTableHeaderCell>
                    <DataTableHeaderCell>No. pesanan</DataTableHeaderCell>
                    <DataTableHeaderCell>Link Shopee</DataTableHeaderCell>
                    <DataTableHeaderCell>Total</DataTableHeaderCell>
                    <DataTableHeaderCell>Status</DataTableHeaderCell>
                    <DataTableHeaderCell />
                  </DataTableHead>
                  <DataTableBody>
                    {orders.map((o) => (
                      <DataTableRow key={o.id}>
                        <DataTableCell>{fmtDateTime(o.created_at)}</DataTableCell>
                        <DataTableCell>
                          <span className="font-mono text-xs text-gray-600">{truncId(o.id)}</span>
                        </DataTableCell>
                        <DataTableCell>
                          <span className="tabular-nums">{o.total_shopee_links}</span>
                        </DataTableCell>
                        <DataTableCell>
                          <span className="tabular-nums">{fmtIDR(Number(o.total_price))}</span>
                        </DataTableCell>
                        <DataTableCell>
                          <StatusBadge status={o.status} />
                        </DataTableCell>
                        <DataTableCell align="right">
                          <Link
                            href={`/orders/${o.id}`}
                            className="text-primary-600 hover:underline min-h-11 inline-flex items-center"
                          >
                            {t.detail}
                          </Link>
                        </DataTableCell>
                      </DataTableRow>
                    ))}
                  </DataTableBody>
                </DataTable>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
