'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Card, TextInput } from '@/components/ui';
import { getPricingSettings, setPricingSettings, ApiClientError } from '@/lib/api';
import { fmtIDR } from '@/lib/utils';

export default function AdminPricingPage() {
  const [price, setPrice] = useState(2000);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getPricingSettings().then((p) => setPrice(p.pricePerLink));
  }, []);

  const save = async () => {
    try {
      const p = await setPricingSettings(price);
      setPrice(p.pricePerLink);
      setDirty(false);
      setMsg('Harga disimpan di backend.');
      setError('');
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Gagal simpan');
      setMsg('');
    }
  };

  return (
    <div className="max-w-xl">
      <Card>
        <TextInput
          label="Harga per link (IDR)"
          type="number"
          value={String(price)}
          onChange={(e) => {
            setPrice(Number(e.target.value) || 0);
            setDirty(true);
          }}
          className="[&_input]:text-xl [&_input]:font-semibold [&_input]:max-w-xs"
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
      {error && (
        <Alert kind="error" className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
}
