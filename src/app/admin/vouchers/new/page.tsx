'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, SelectField, TextInput } from '@/components/ui';
import { createVoucher } from '@/lib/api';

export default function NewVoucherPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState(10);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVoucher({ code, type, value, active: true });
    router.push('/admin/vouchers');
  };

  return (
    <div className="max-w-lg">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <TextInput className="md:col-span-2" label="Kode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
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
