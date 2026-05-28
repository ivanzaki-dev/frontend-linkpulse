'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import {
  Alert,
  Button,
  Card,
  OrderSummaryCard,
  PageHeader,
  StatusBadge,
} from '@/components/ui';
import { getCheckoutIntent, payCheckoutSimulated, ApiClientError } from '@/lib/api';
import { copy } from '@/lib/copy';
import { fmtIDR, truncId } from '@/lib/utils';
import type { CheckoutIntentResponse } from '@/lib/types';

export default function CheckoutPage() {
  const { orderId: intentId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const t = copy.checkout;
  const [intent, setIntent] = useState<CheckoutIntentResponse | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCheckoutIntent(intentId)
      .then(setIntent)
      .catch((e) => setError(e instanceof ApiClientError ? e.message : t.errorLoad));
  }, [intentId, t.errorLoad]);

  const pay = async () => {
    if (!intent?.checkout_intent_id) return;
    setPaying(true);
    setError('');
    try {
      const result = await payCheckoutSimulated(intent.checkout_intent_id);
      router.push(`/orders/${result.order_id}`);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t.errorPay);
    } finally {
      setPaying(false);
    }
  };

  const linkCount = intent?.quoted_link_count;

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <PageHeader
          title={t.title}
          subtitle={
            <>
              Checkout{' '}
              <span className="font-mono text-xs text-gray-600">
                {truncId(intent?.checkout_intent_id || intentId, 12, 8)}
              </span>
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
              <StatusBadge status={intent?.status === 'paid' ? 'paid' : 'pending'} />
            </div>
            <div className="mt-3 rounded-lg border-2 border-dashed border-primary-200 bg-primary-50/50 p-4 text-sm text-primary-800">
              {t.paySimHint}
            </div>
            {intent?.quoted_total_price != null && (
              <p className="mt-4 text-2xl font-semibold tabular-nums">
                {fmtIDR(intent.quoted_total_price)}
              </p>
            )}
            <Button
              className="mt-4"
              size="lg"
              full
              loading={paying}
              onClick={pay}
              disabled={!intent || intent.status !== 'open'}
            >
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
              <p className="text-sm text-gray-500">{t.afterPay}</p>
              <p className="text-sm text-gray-400 mt-2">
                Setelah bayar, pesanan dibuat otomatis dan diproses worker.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
