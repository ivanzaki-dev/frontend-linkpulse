'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, TextInput } from '@/components/ui';
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
      <h1 className="text-2xl font-semibold">Voucher baru</h1>
      <Card className="mt-6">
        <form onSubmit={submit} className="space-y-4">
          <TextInput label="Kode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
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
