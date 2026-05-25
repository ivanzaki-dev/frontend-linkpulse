'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, TextInput } from '@/components/ui';
import { createPromotion } from '@/lib/api';

export default function NewPromotionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState(10);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPromotion({ name, type, value, active: true });
    router.push('/admin/promotions');
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Promosi baru</h1>
      <Card className="mt-6">
        <form onSubmit={submit} className="space-y-4">
          <TextInput label="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label className="text-sm font-medium">Tipe</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}
            >
              <option value="percent">Persen (%)</option>
              <option value="fixed">Nominal (Rp)</option>
            </select>
          </div>
          <TextInput label="Nilai" type="number" value={String(value)} onChange={(e) => setValue(Number(e.target.value))} />
          <Button type="submit">Simpan</Button>
        </form>
      </Card>
    </div>
  );
}
