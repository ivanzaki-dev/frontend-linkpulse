'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, TextInput } from '@/components/ui';
import { createPromotion } from '@/lib/api';
import {
  assertMinActiveMinutes,
  defaultValidityWindow,
  toIsoFromDatetimeLocal,
} from '@/lib/validity';

export default function NewPromotionPage() {
  const router = useRouter();
  const defaults = useMemo(() => defaultValidityWindow(), []);
  const [name, setName] = useState('');
  const [value, setValue] = useState(10);
  const [validFrom, setValidFrom] = useState(defaults.valid_from);
  const [validUntil, setValidUntil] = useState(defaults.valid_until);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      assertMinActiveMinutes(validFrom, validUntil);
      await createPromotion({
        name,
        type: 'percent',
        value,
        valid_from: toIsoFromDatetimeLocal(validFrom),
        valid_until: toIsoFromDatetimeLocal(validUntil),
        active: true,
      });
      router.push('/admin/promotions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan promosi');
    }
  };

  return (
    <div className="max-w-lg">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <TextInput
            className="md:col-span-2"
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextInput
            className="md:col-span-2"
            label="Diskon (%)"
            type="number"
            min={1}
            max={100}
            value={String(value)}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
          <TextInput
            className="md:col-span-2"
            label="Berlaku dari"
            type="datetime-local"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            required
          />
          <TextInput
            className="md:col-span-2"
            label="Berlaku sampai"
            type="datetime-local"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
          {error && (
            <p className="md:col-span-2 text-sm text-error-600" role="alert">
              {error}
            </p>
          )}
          <div className="md:col-span-2">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
