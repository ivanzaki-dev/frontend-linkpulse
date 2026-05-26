'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import {
  Alert,
  Button,
  Card,
  PageHeader,
  ProgressBar,
  ProgressStepper,
  ResultChip,
  StatusBadge,
} from '@/components/ui';
import { getOrderReport, getOrderStatus, ApiClientError } from '@/lib/api';
import { copy } from '@/lib/copy';
import { orderProgressSteps } from '@/lib/order-steps';
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
  const steps = status ? orderProgressSteps(status.status, status.payment_status) : [];

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        <PageHeader
          title={t.title}
          backHref="/orders"
          backLabel={t.back}
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

        {status && (
          <Card className="mt-6">
            <ProgressStepper steps={steps} />
            <div className="flex gap-3 items-center flex-wrap mt-6">
              <StatusBadge status={status.status} />
              <StatusBadge status={status.payment_status} />
            </div>
            {p && status.status !== 'completed' && status.status !== 'failed' && (
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">{t.progressScreenshots(p.screenshots_done, p.total_links)}</span>
                  </div>
                  <ProgressBar value={p.screenshots_done} max={p.total_links} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">{t.progressAnalysis(p.analysis_done, p.total_links)}</span>
                  </div>
                  <ProgressBar value={p.analysis_done} max={p.total_links} />
                </div>
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <ResultChip label="Aktif" count={status.results.active_count} variant="success" />
                  <ResultChip label="Tidak aktif" count={status.results.inactive_count} variant="warning" />
                  <ResultChip label="Perlu dicek" count={status.results.error_count} variant="error" />
                </div>
                {downloadUrl && (
                  <a href={downloadUrl} target="_blank" rel="noreferrer" className="inline-block mt-4">
                    <Button size="lg">{t.downloadPdf}</Button>
                  </a>
                )}
              </div>
            )}
            {status.status === 'failed' && (
              <Alert kind="error" className="mt-6" title={copy.preview.failedTitle}>
                {copy.preview.failedDefault}
              </Alert>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
