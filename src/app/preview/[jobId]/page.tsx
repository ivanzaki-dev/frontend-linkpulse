'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Alert, Button, Card, PricingCard, StatusBadge } from '@/components/ui';
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

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        <Link href="/order/new" className="text-sm text-gray-500 hover:text-gray-900">
          {t.back}
        </Link>
        <h1 className="text-3xl font-semibold mt-2">{t.title}</h1>

        {error && (
          <Alert kind="error" className="mt-4">
            {error}
          </Alert>
        )}

        {(status === 'queued' || status === 'claimed' || status === 'loading') && (
          <Card className="mt-6">
            <div className="flex items-center gap-3">
              <svg className="spinner h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div>
                <div className="font-medium">{t.waitingTitle}</div>
                <p className="text-sm text-gray-500">{t.waitingHint}</p>
              </div>
            </div>
          </Card>
        )}

        {status === 'failed' && (
          <Alert kind="error" className="mt-6" title={t.failedTitle}>
            {job?.error?.message || t.failedDefault}
          </Alert>
        )}

        {status === 'ready' && job?.pricing && job?.youtube_videos && (
          <>
            <Alert
              kind="success"
              className="mt-6"
              title={t.doneTitle(job.total_shopee_links ?? 0)}
            >
              {t.doneHint}
            </Alert>
            <div className="grid lg:grid-cols-[1fr_360px] gap-5 mt-5">
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{t.tableVideo}</h3>
                  <StatusBadge status="completed" />
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">{t.tableVideo}</th>
                      <th className="pb-2 text-right">{t.tableLinks}</th>
                      <th className="pb-2 text-right">{t.tableSubtotal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.youtube_videos.map((v) => (
                      <tr key={v.video_id} className="border-b border-gray-50">
                        <td className="py-3">
                          <div className="font-medium">{v.label}</div>
                        </td>
                        <td className="py-3 text-right tabular-nums">{v.shopee_link_count}</td>
                        <td className="py-3 text-right tabular-nums">
                          {fmtIDR(v.shopee_link_count * job.pricing!.price_per_link)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
