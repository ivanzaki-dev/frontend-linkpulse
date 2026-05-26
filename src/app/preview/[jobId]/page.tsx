'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  PageHeader,
  PricingCard,
  SkeletonRow,
  StatusBadge,
} from '@/components/ui';
import { createOrder, getPreviewJob, ApiClientError } from '@/lib/api';
import { copy } from '@/lib/copy';
import type { PreviewJob } from '@/lib/types';
import { fmtIDR } from '@/lib/utils';

export default function PreviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const t = copy.preview;
  const [job, setJob] = useState<PreviewJob | null>(null);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const poll = useCallback(async () => {
    try {
      const data = await getPreviewJob(jobId);
      setJob(data);
      setError('');
      return data.status;
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t.errorLoad);
      return 'error';
    }
  }, [jobId, t.errorLoad]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const status = await poll();
      if (!active) return;
      if (status === 'queued' || status === 'claimed') {
        setTimeout(run, 4000);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [poll]);

  const checkout = async () => {
    if (!job?.preview_job_id) return;
    setCheckoutLoading(true);
    try {
      const order = await createOrder({ preview_job_id: job.preview_job_id });
      router.push(`/checkout/${order.order_id}`);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t.errorOrder);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const status = job?.status || 'loading';
  const loadingState = status === 'queued' || status === 'claimed' || status === 'loading';

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        <PageHeader title={t.title} backHref="/order/new" backLabel={t.back} />

        {error && (
          <Alert kind="error" className="mt-4">
            {error}
          </Alert>
        )}

        {loadingState && (
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">{t.waitingTitle}</div>
                <p className="text-sm text-gray-500 mt-1">{t.waitingHint}</p>
              </div>
              <StatusBadge status={status === 'loading' ? 'queued' : status} />
            </div>
            <DataTable>
              <DataTableHead>
                <DataTableHeaderCell>{t.tableVideo}</DataTableHeaderCell>
                <DataTableHeaderCell align="right">{t.tableLinks}</DataTableHeaderCell>
                <DataTableHeaderCell align="right">{t.tableSubtotal}</DataTableHeaderCell>
              </DataTableHead>
              <DataTableBody>
                <SkeletonRow cols={3} />
                <SkeletonRow cols={3} />
                <SkeletonRow cols={3} />
              </DataTableBody>
            </DataTable>
          </Card>
        )}

        {status === 'failed' && (
          <div className="mt-6 space-y-4">
            <Alert kind="error" title={t.failedTitle}>
              {job?.error?.message || t.failedDefault}
            </Alert>
            <Link href="/order/new">
              <Button variant="secondary">{t.retry}</Button>
            </Link>
          </div>
        )}

        {status === 'ready' && job?.pricing && job?.youtube_videos && (
          <>
            <Alert kind="success" className="mt-6" title={t.doneTitle(job.total_shopee_links ?? 0)}>
              {t.doneHint}
            </Alert>
            <div className="grid lg:grid-cols-[1fr_360px] gap-5 mt-5">
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{t.tableVideo}</h3>
                  <StatusBadge status="completed" />
                </div>
                <DataTable>
                  <DataTableHead>
                    <DataTableHeaderCell>{t.tableVideo}</DataTableHeaderCell>
                    <DataTableHeaderCell align="right">{t.tableLinks}</DataTableHeaderCell>
                    <DataTableHeaderCell align="right">{t.tableSubtotal}</DataTableHeaderCell>
                  </DataTableHead>
                  <DataTableBody>
                    {job.youtube_videos.map((v) => (
                      <DataTableRow key={v.video_id}>
                        <DataTableCell>
                          <div className="font-medium">{v.label}</div>
                        </DataTableCell>
                        <DataTableCell align="right">
                          <span className="tabular-nums">{v.shopee_link_count}</span>
                        </DataTableCell>
                        <DataTableCell align="right">
                          <span className="tabular-nums">
                            {fmtIDR(v.shopee_link_count * job.pricing!.price_per_link)}
                          </span>
                        </DataTableCell>
                      </DataTableRow>
                    ))}
                  </DataTableBody>
                </DataTable>
                <Link href="/order/new" className="inline-block mt-4">
                  <Button variant="ghost" size="sm">
                    {t.editUrls}
                  </Button>
                </Link>
              </Card>
              <div className="space-y-4">
                <PricingCard pricing={job.pricing} note={t.pricingNote} />
                <Button size="lg" full loading={checkoutLoading} onClick={checkout}>
                  {t.checkout}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
