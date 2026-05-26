'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, SelectField, TextInput } from '@/components/ui';
import { createVoucher } from '@/lib/api';
import {
  assertMinActiveMinutes,
  defaultValidityWindow,
  toIsoFromDatetimeLocal,
} from '@/lib/validity';

export default function NewVoucherPage() {
  const router = useRouter();
  const defaults = useMemo(() => defaultValidityWindow(), []);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState(100);
  const [minLinks, setMinLinks] = useState('');
  const [validFrom, setValidFrom] = useState(defaults.valid_from);
  const [validUntil, setValidUntil] = useState(defaults.valid_until);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      assertMinActiveMinutes(validFrom, validUntil);
      await createVoucher({
        code,
        type,
        value,
        max_uses: maxUses,
        min_links: minLinks ? Number(minLinks) : null,
        valid_from: toIsoFromDatetimeLocal(validFrom),
        valid_until: toIsoFromDatetimeLocal(validUntil),
        active: true,
      });
      router.push('/admin/vouchers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan voucher');
    }
  };

  return (
    <div className="max-w-lg">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <TextInput
            className="md:col-span-2"
            label="Kode"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
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
            required
          />
          <TextInput
            label="Kuota pemakaian"
            type="number"
            min={1}
            value={String(maxUses)}
            onChange={(e) => setMaxUses(Number(e.target.value))}
            required
          />
          <TextInput
            label="Min. link (opsional)"
            type="number"
            min={0}
            value={minLinks}
            onChange={(e) => setMinLinks(e.target.value)}
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
