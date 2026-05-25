'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { deletePromotion, listPromotions, updatePromotion } from '@/lib/api';
import type { Promotion } from '@/lib/types';

export default function AdminPromotionsPage() {
  const [rows, setRows] = useState<Promotion[]>([]);

  const load = () => listPromotions().then((r) => setRows(r.promotions));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (p: Promotion) => {
    await updatePromotion(p.id, { active: !p.active });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus promosi?')) return;
    await deletePromotion(id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Promosi</h1>
        <Link href="/admin/promotions/new">
          <Button>+ Promosi baru</Button>
        </Link>
      </div>
      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Nama</th>
              <th>Tipe</th>
              <th>Nilai</th>
              <th>Aktif</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="py-2">{p.name}</td>
                <td>{p.type}</td>
                <td>{p.value}</td>
                <td>
                  <button type="button" className="text-primary-600" onClick={() => toggle(p)}>
                    {p.active ? 'Ya' : 'Tidak'}
                  </button>
                </td>
                <td className="py-2 space-x-2">
                  <Link href={`/admin/promotions/${p.id}/edit`} className="text-primary-600">
                    Edit
                  </Link>
                  <button type="button" className="text-error-600" onClick={() => remove(p.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
