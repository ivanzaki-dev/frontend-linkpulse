'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Alert, Button, Card, StatusBadge } from '@/components/ui';
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

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="text-sm text-gray-500 mt-1">No. pesanan {truncId(orderId, 12, 8)}</p>

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
            <div className="mt-3 rounded-lg border border-dashed border-primary-200 bg-primary-50/50 p-4 text-sm text-primary-800">
              {t.paySimHint}
            </div>
            <Button className="mt-4" size="lg" full loading={paying} onClick={pay}>
              {t.paySim}
            </Button>
            <Link href="/order/new" className="block text-center text-sm text-gray-500 mt-2">
              {t.cancel}
            </Link>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">{t.statusLabel}</p>
            <p className="text-lg font-medium mt-1">
              {order?.status ? labelStatus(order.status) : '…'}
            </p>
            <p className="text-sm text-gray-500 mt-4">{t.afterPay}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
