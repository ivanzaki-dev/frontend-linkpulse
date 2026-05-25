'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, TextInput } from '@/components/ui';
import { listVouchers, updateVoucher } from '@/lib/api';

export default function EditVoucherPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState(0);
  const [used, setUsed] = useState(0);

  useEffect(() => {
    listVouchers().then((r) => {
      const v = r.vouchers.find((x) => x.id === id);
      if (v) {
        setCode(v.code);
        setType(v.type);
        setValue(Number(v.value));
        setUsed(v.used_count);
      }
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateVoucher(id, { code, type, value });
    router.push('/admin/vouchers');
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Edit voucher</h1>
      <p className="text-sm text-gray-500">Sudah dipakai: {used} kali</p>
      <Card className="mt-4">
        <form onSubmit={submit} className="space-y-4">
          <TextInput label="Kode" value={code} onChange={(e) => setCode(e.target.value)} />
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
