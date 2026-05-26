'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, TextInput } from '@/components/ui';
import { listPromotions, updatePromotion } from '@/lib/api';
import {
  assertMinActiveMinutes,
  fromIsoToDatetimeLocal,
  toIsoFromDatetimeLocal,
} from '@/lib/validity';

export default function EditPromotionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listPromotions().then((r) => {
      const p = r.promotions.find((x) => x.id === id);
      if (p) {
        setName(p.name);
        setValue(Number(p.value));
        if (p.valid_from) setValidFrom(fromIsoToDatetimeLocal(p.valid_from));
        if (p.valid_until) setValidUntil(fromIsoToDatetimeLocal(p.valid_until));
      }
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      assertMinActiveMinutes(validFrom, validUntil);
      await updatePromotion(id, {
        name,
        type: 'percent',
        value,
        valid_from: toIsoFromDatetimeLocal(validFrom),
        valid_until: toIsoFromDatetimeLocal(validUntil),
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
          />
          <TextInput
            className="md:col-span-2"
            label="Diskon (%)"
            type="number"
            min={1}
            max={100}
            value={String(value)}
            onChange={(e) => setValue(Number(e.target.value))}
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
