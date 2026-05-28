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
import { getOrderReportData, getOrderStatus, ApiClientError } from '@/lib/api';
import { copy } from '@/lib/copy';
import { downloadOrderReportPdf } from '@/lib/generate-pdf';
import { orderProgressSteps } from '@/lib/order-steps';
import type { OrderReportData, OrderStatus } from '@/lib/types';
import { truncId } from '@/lib/utils';

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const t = copy.orderStatus;
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [reportData, setReportData] = useState<OrderReportData | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const s = await getOrderStatus(orderId);
        if (!active) return;
        setStatus(s);
        if (s.status === 'completed') {
          const data = await getOrderReportData(orderId);
          if (active) setReportData(data);
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
  const terminal = p?.terminal_links ?? p?.analysis_done ?? 0;
  const total = p?.total_links ?? 0;

  const onDownloadPdf = () => {
    if (!reportData?.report) return;
    setPdfLoading(true);
    try {
      downloadOrderReportPdf(
        { report: reportData.report },
        `linkpulse-${orderId.slice(0, 8)}.pdf`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat PDF');
    } finally {
      setPdfLoading(false);
    }
  };

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
                    <span className="text-gray-600">
                      Progress link ({terminal} / {total})
                    </span>
                  </div>
                  <ProgressBar value={terminal} max={total || 1} />
                </div>
                {(p.paused_links ?? 0) > 0 && (
                  <p className="text-sm text-amber-700">
                    {p.paused_links} link ditunda (captcha) — menunggu resume.
                  </p>
                )}
                <p className="text-xs text-gray-400">{t.progressHint}</p>
              </div>
            )}
            {status.status === 'completed' && status.results && (
              <div className="mt-6">
                <Alert kind="success" title={t.doneTitle}>
                  {status.results.active_count} aktif · {status.results.inactive_count} tidak
                  aktif
                  {(status.results.uncheckable_count ?? status.results.error_count ?? 0) > 0 &&
                    ` · ${status.results.uncheckable_count ?? status.results.error_count} tidak bisa diperiksa`}
                </Alert>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ResultChip label="Aktif" count={status.results.active_count} variant="success" />
                  <ResultChip
                    label="Tidak aktif"
                    count={status.results.inactive_count}
                    variant="warning"
                  />
                  <ResultChip
                    label="Tidak bisa diperiksa"
                    count={
                      status.results.uncheckable_count ?? status.results.error_count ?? 0
                    }
                    variant="error"
                  />
                </div>
                {reportData?.report && (
                  <Button className="mt-4" size="lg" loading={pdfLoading} onClick={onDownloadPdf}>
                    Generate PDF
                  </Button>
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
