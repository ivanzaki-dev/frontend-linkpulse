'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerHeader } from '@/components/customer-header';
import { Alert, Button, Card, TextInput } from '@/components/ui';
import { createPreviewJob, ApiClientError } from '@/lib/api';
import { copy } from '@/lib/copy';

type Row = { id: string; url: string; label: string };

export default function NewOrderPage() {
  const router = useRouter();
  const t = copy.order;
  const [rows, setRows] = useState<Row[]>([{ id: '1', url: '', label: '' }]);
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const valid = rows.filter((r) => r.url.trim()).length;
  const max = 20;

  const add = () => {
    if (rows.length < max) setRows([...rows, { id: String(Date.now()), url: '', label: '' }]);
  };

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const youtube_urls = rows.map((r) => r.url.trim()).filter(Boolean);
      const labels = rows.map((r, i) => r.label.trim() || `Video ${String.fromCharCode(65 + i)}`);
      const out = await createPreviewJob({
        youtube_urls,
        labels,
        voucher_code: voucher.trim() || undefined,
      });
      router.push(`/preview/${out.preview_job_id}`);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t.errorCreate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomerHeader />
      <div className="max-w-[820px] mx-auto px-6 py-10 pb-32">
        <h1 className="text-3xl font-semibold text-gray-900">{t.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>

        {error && (
          <Alert kind="error" className="mt-4">
            {error}
          </Alert>
        )}

        <Card className="mt-6">
          <div className="flex justify-between mb-4">
            <span className="font-medium">{t.videos}</span>
            <span className="text-sm text-gray-500">
              {valid} / {max}
            </span>
          </div>
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={r.id} className="grid gap-2 sm:grid-cols-2">
                <TextInput
                  placeholder="https://www.youtube.com/watch?v=…"
                  value={r.url}
                  onChange={(e) =>
                    setRows(rows.map((x) => (x.id === r.id ? { ...x, url: e.target.value } : x)))
                  }
                />
                <TextInput
                  placeholder={`Nama video (opsional) · Video ${String.fromCharCode(65 + i)}`}
                  value={r.label}
                  onChange={(e) =>
                    setRows(rows.map((x) => (x.id === r.id ? { ...x, label: e.target.value } : x)))
                  }
                />
              </div>
            ))}
          </div>
          <Button variant="soft" size="sm" className="mt-4" onClick={add} disabled={rows.length >= max}>
            {t.addVideo}
          </Button>
        </Card>

        <Card className="mt-4">
          <TextInput
            label={t.voucherLabel}
            value={voucher}
            onChange={(e) => setVoucher(e.target.value.toUpperCase())}
            placeholder="LAUNCH10"
          />
          <p className="text-xs text-gray-500 mt-2">{t.voucherHint}</p>
        </Card>

        <Alert kind="info" className="mt-4" title={t.infoTitle}>
          {t.infoBody}
        </Alert>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-4 px-6">
          <div className="max-w-[820px] mx-auto flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {valid === 0 ? t.footerNone : t.footerReady(valid)}
            </span>
            <Button disabled={valid === 0 || loading} loading={loading} onClick={submit}>
              {t.submit}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
