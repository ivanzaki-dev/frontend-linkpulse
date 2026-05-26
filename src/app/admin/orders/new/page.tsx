'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, Card, TextInput } from '@/components/ui';
import {
  adminCreateCompOrder,
  adminCreatePreviewJob,
  adminGetPreviewJob,
} from '@/lib/api';
import { fmtIDR } from '@/lib/utils';

export default function AdminNewOrderPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [urlsText, setUrlsText] = useState('');
  const [previewJobId, setPreviewJobId] = useState('');
  const [status, setStatus] = useState('');
  const [linkCount, setLinkCount] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPreview = async () => {
    setError('');
    setBusy(true);
    setStatus('');
    setLinkCount(null);
    setTotalPrice(null);
    try {
      const youtube_urls = urlsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const out = await adminCreatePreviewJob({
        customer_email: email.trim(),
        youtube_urls,
      });
      setPreviewJobId(out.preview_job_id);
      setStatus(out.status);

      pollRef.current = setInterval(async () => {
        try {
          const job = await adminGetPreviewJob(out.preview_job_id);
          setStatus(job.status);
          if (job.status === 'ready' && job.result && typeof job.result === 'object') {
            const r = job.result as {
              total_shopee_links?: number;
              pricing?: { total_price?: number };
            };
            setLinkCount(r.total_shopee_links ?? null);
            setTotalPrice(r.pricing?.total_price ?? null);
            if (pollRef.current) clearInterval(pollRef.current);
          }
          if (job.status === 'failed') {
            setError(job.error_message || 'Preview gagal');
            if (pollRef.current) clearInterval(pollRef.current);
          }
        } catch {
          /* retry */
        }
      }, 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat preview');
    } finally {
      setBusy(false);
    }
  };

  const createOrder = async () => {
    setError('');
    setBusy(true);
    try {
      const out = await adminCreateCompOrder({
        preview_job_id: previewJobId,
        customer_email: email.trim(),
      });
      router.push(`/admin/orders/${out.order_id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <Link href="/admin/orders" className="text-sm text-primary-600 hover:underline">
        ← Daftar order
      </Link>

      <Card>
        <p className="text-sm text-gray-600">
          Alur sama seperti customer: extract link via preview worker → order otomatis{' '}
          <strong>paid</strong> (gratis).
        </p>
        {error && (
          <Alert kind="error" className="mt-3">
            {error}
          </Alert>
        )}
        <TextInput
          className="mt-4"
          label="Email customer"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block mt-3 text-sm font-medium text-gray-700">
          URL YouTube (satu per baris)
        </label>
        <textarea
          className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <Button className="mt-4" type="button" loading={busy} onClick={startPreview}>
          1. Mulai preview
        </Button>

        {previewJobId && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
            <div>
              Preview: <span className="font-medium">{status}</span>
            </div>
            {linkCount != null && (
              <div>
                {linkCount} link · estimasi {totalPrice != null ? fmtIDR(totalPrice) : '—'}
              </div>
            )}
          </div>
        )}

        <Button
          className="mt-4"
          type="button"
          disabled={status !== 'ready' || !previewJobId}
          loading={busy}
          onClick={createOrder}
        >
          2. Buat order (gratis / paid)
        </Button>
      </Card>
    </div>
  );
}
