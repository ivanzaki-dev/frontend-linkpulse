'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, SelectField, TextInput } from '@/components/ui';
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
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <TextInput className="md:col-span-2" label="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          <SelectField label="Tipe" value={type} onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}>
            <option value="percent">Persen</option>
            <option value="fixed">Nominal</option>
          </SelectField>
          <TextInput label="Nilai" type="number" value={String(value)} onChange={(e) => setValue(Number(e.target.value))} />
          <div className="md:col-span-2">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
