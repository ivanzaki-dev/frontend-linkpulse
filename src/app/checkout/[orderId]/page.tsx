'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Alert, Button, Card, OrderSummaryCard, PageHeader, StatusBadge } from '@/components/ui';
import { getOrderStatus, payOrderSimulated, ApiClientError } from '@/lib/api';
import { copy, labelStatus } from '@/lib/copy';
import type { OrderStatus } from '@/lib/types';
import { truncId } from '@/lib/utils';

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const t = copy.checkout;
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrderStatus(orderId)
      .then(setOrder)
      .catch((e) => setError(e instanceof ApiClientError ? e.message : t.errorLoad));
  }, [orderId, t.errorLoad]);

  const pay = async () => {
    setPaying(true);
    setError('');
    try {
      await payOrderSimulated(orderId);
      router.push(`/orders/${orderId}`);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t.errorPay);
    } finally {
      setPaying(false);
    }
  };

  const linkCount = order?.progress?.total_links;

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <PageHeader
          title={t.title}
          subtitle={
            <>
              No. pesanan{' '}
              <span className="font-mono text-xs text-gray-600">{truncId(orderId, 12, 8)}</span>
            </>
          }
        />

        {error && (
          <Alert kind="error" className="mt-4">
            {error}
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-5 mt-6">
          <Card>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{t.payTitle}</h3>
              <StatusBadge status={order?.payment_status || 'pending'} />
            </div>
            <div className="mt-3 rounded-lg border-2 border-dashed border-primary-200 bg-primary-50/50 p-4 text-sm text-primary-800">
              {t.paySimHint}
            </div>
            <Button className="mt-4" size="lg" full loading={paying} onClick={pay}>
              {t.paySim}
            </Button>
            <Link
              href="/order/new"
              className="block text-center text-sm text-gray-500 mt-3 min-h-11 leading-[44px]"
            >
              {t.cancel}
            </Link>
          </Card>
          <div className="space-y-4">
            <OrderSummaryCard linkCount={linkCount ?? null} />
            <Card>
              <p className="text-sm text-gray-500">{t.statusLabel}</p>
              <p className="text-lg font-medium mt-1">
                {order?.status ? labelStatus(order.status) : '…'}
              </p>
              <p className="text-sm text-gray-500 mt-4">{t.afterPay}</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
