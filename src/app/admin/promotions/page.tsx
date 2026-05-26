'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from '@/components/ui';
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
      <div className="flex justify-end mb-4">
        <Link href="/admin/promotions/new">
          <Button>+ Promosi baru</Button>
        </Link>
      </div>
      <Card className="overflow-x-auto">
        <DataTable>
          <DataTableHead>
            <DataTableHeaderCell>Nama</DataTableHeaderCell>
            <DataTableHeaderCell>Tipe</DataTableHeaderCell>
            <DataTableHeaderCell>Nilai</DataTableHeaderCell>
            <DataTableHeaderCell>Aktif</DataTableHeaderCell>
            <DataTableHeaderCell />
          </DataTableHead>
          <DataTableBody>
            {rows.map((p) => (
              <DataTableRow key={p.id}>
                <DataTableCell>{p.name}</DataTableCell>
                <DataTableCell>{p.type}</DataTableCell>
                <DataTableCell>
                  <span className="tabular-nums">{p.value}</span>
                </DataTableCell>
                <DataTableCell>
                  <button
                    type="button"
                    className="text-primary-600 min-h-11 inline-flex items-center"
                    onClick={() => toggle(p)}
                  >
                    {p.active ? 'Ya' : 'Tidak'}
                  </button>
                </DataTableCell>
                <DataTableCell align="right">
                  <Link href={`/admin/promotions/${p.id}/edit`} className="text-primary-600 min-h-11 inline-flex items-center mr-3">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-error-600 min-h-11 inline-flex items-center"
                    onClick={() => remove(p.id)}
                  >
                    Hapus
                  </button>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </Card>
    </div>
  );
}
