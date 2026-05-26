'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, SelectField, TextInput } from '@/components/ui';
import { listVouchers, updateVoucher } from '@/lib/api';
import {
  assertMinActiveMinutes,
  fromIsoToDatetimeLocal,
  toIsoFromDatetimeLocal,
} from '@/lib/validity';

export default function EditVoucherPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState(0);
  const [used, setUsed] = useState(0);
  const [maxUses, setMaxUses] = useState(1);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listVouchers().then((r) => {
      const v = r.vouchers.find((x) => x.id === id);
      if (v) {
        setCode(v.code);
        setType(v.type);
        setValue(Number(v.value));
        setUsed(v.used_count);
        setMaxUses(v.max_uses ?? 1);
        if (v.valid_from) setValidFrom(fromIsoToDatetimeLocal(v.valid_from));
        if (v.valid_until) setValidUntil(fromIsoToDatetimeLocal(v.valid_until));
      }
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      assertMinActiveMinutes(validFrom, validUntil);
      await updateVoucher(id, {
        code,
        type,
        value,
        max_uses: maxUses,
        valid_from: toIsoFromDatetimeLocal(validFrom),
        valid_until: toIsoFromDatetimeLocal(validUntil),
      });
      router.push('/admin/vouchers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan voucher');
    }
  };

  return (
    <div className="max-w-lg">
      <p className="text-sm text-gray-500 mb-4">Sudah dipakai: {used} kali</p>
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <TextInput
            className="md:col-span-2"
            label="Kode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <SelectField label="Tipe" value={type} onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}>
            <option value="percent">Persen</option>
            <option value="fixed">Nominal</option>
          </SelectField>
          <TextInput
            label="Nilai"
            type="number"
            value={String(value)}
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <TextInput
            className="md:col-span-2"
            label="Kuota pemakaian"
            type="number"
            min={1}
            value={String(maxUses)}
            onChange={(e) => setMaxUses(Number(e.target.value))}
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
