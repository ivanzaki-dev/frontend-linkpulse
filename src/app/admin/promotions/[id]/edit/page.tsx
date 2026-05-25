'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, TextInput } from '@/components/ui';
import { listPromotions, updatePromotion } from '@/lib/api';

export default function EditPromotionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState(0);

  useEffect(() => {
    listPromotions().then((r) => {
      const p = r.promotions.find((x) => x.id === id);
      if (p) {
        setName(p.name);
        setType(p.type);
        setValue(Number(p.value));
      }
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePromotion(id, { name, type, value });
    router.push('/admin/promotions');
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Edit promosi</h1>
      <Card className="mt-6">
        <form onSubmit={submit} className="space-y-4">
          <TextInput label="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          <select className="w-full border rounded-lg px-3 py-2" value={type} onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}>
            <option value="percent">Persen</option>
            <option value="fixed">Nominal</option>
          </select>
          <TextInput label="Nilai" type="number" value={String(value)} onChange={(e) => setValue(Number(e.target.value))} />
          <Button type="submit">Simpan</Button>
        </form>
      </Card>
    </div>
  );
}
