'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Alert, Button, Card, StatusBadge } from '@/components/ui';
import { getOrderReport, getOrderStatus, ApiClientError } from '@/lib/api';
import { copy } from '@/lib/copy';
import type { OrderStatus } from '@/lib/types';
import { truncId } from '@/lib/utils';

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const t = copy.orderStatus;
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const s = await getOrderStatus(orderId);
        if (!active) return;
        setStatus(s);
        if (s.status === 'completed') {
          const rep = await getOrderReport(orderId);
          setDownloadUrl(rep.download_url || rep.report_url);
        }
        if (s.status !== 'completed' && s.status !== 'failed') {
          setTimeout(load, 5000);
        }
      } catch (e) {
        setError(e instanceof ApiClientError ? e.message : t.errorLoad);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [orderId, t.errorLoad]);

  const p = status?.progress;

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        <Link href="/orders" className="text-sm text-gray-500">
          {t.back}
        </Link>
        <h1 className="text-3xl font-semibold mt-2">{t.title}</h1>
        <p className="text-sm text-gray-500 mt-1">No. pesanan {truncId(orderId, 12, 8)}</p>

        {error && (
          <Alert kind="error" className="mt-4">
            {error}
          </Alert>
        )}

        {status && (
          <Card className="mt-6">
            <div className="flex gap-3 items-center flex-wrap">
              <StatusBadge status={status.status} />
              <StatusBadge status={status.payment_status} />
            </div>
            {p && status.status !== 'completed' && (
              <div className="mt-6 space-y-2 text-sm">
                <p>{t.progressScreenshots(p.screenshots_done, p.total_links)}</p>
                <p>{t.progressAnalysis(p.analysis_done, p.total_links)}</p>
                <p className="text-xs text-gray-400">{t.progressHint}</p>
              </div>
            )}
            {status.status === 'completed' && status.results && (
              <div className="mt-6">
                <Alert kind="success" title={t.doneTitle}>
                  {t.doneSummary(
                    status.results.active_count,
                    status.results.inactive_count,
                    status.results.error_count
                  )}
                </Alert>
                {downloadUrl && (
                  <a href={downloadUrl} target="_blank" rel="noreferrer" className="inline-block mt-4">
                    <Button size="lg">{t.downloadPdf}</Button>
                  </a>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
