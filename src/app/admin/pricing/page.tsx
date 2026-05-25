'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Card } from '@/components/ui';
import { getPricingSettings, setPricingSettings, ApiClientError } from '@/lib/api';
import { fmtIDR } from '@/lib/utils';

export default function AdminPricingPage() {
  const [price, setPrice] = useState(2000);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getPricingSettings().then((p) => setPrice(p.pricePerLink));
  }, []);

  const save = async () => {
    try {
      const p = await setPricingSettings(price);
      setPrice(p.pricePerLink);
      setDirty(false);
      setMsg('Harga disimpan di backend.');
    } catch (e) {
      setMsg(e instanceof ApiClientError ? e.message : 'Gagal simpan');
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Pengaturan harga</h1>
      <p className="text-sm text-gray-500 mt-1">Harga per link Shopee — logic pricing di backend.</p>
      <Card className="mt-6">
        <label className="text-sm font-medium">Harga per link (IDR)</label>
        <input
          type="number"
          className="mt-2 w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-xl font-semibold"
          value={price}
          onChange={(e) => {
            setPrice(Number(e.target.value) || 0);
            setDirty(true);
          }}
        />
        <p className="text-xs text-gray-500 mt-2">Pratinjau: {fmtIDR(price)} / link</p>
        <div className="mt-4 flex gap-2">
          <Button onClick={save} disabled={!dirty}>
            Simpan
          </Button>
        </div>
      </Card>
      {msg && (
        <Alert kind="success" className="mt-4">
          {msg}
        </Alert>
      )}
    </div>
  );
}
