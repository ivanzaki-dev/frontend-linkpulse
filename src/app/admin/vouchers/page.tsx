'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { deleteVoucher, listVouchers, updateVoucher } from '@/lib/api';
import type { Voucher } from '@/lib/types';

export default function AdminVouchersPage() {
  const [rows, setRows] = useState<Voucher[]>([]);
  const load = () => listVouchers().then((r) => setRows(r.vouchers));
  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Voucher</h1>
        <Link href="/admin/vouchers/new">
          <Button>+ Voucher baru</Button>
        </Link>
      </div>
      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th>Kode</th>
              <th>Tipe</th>
              <th>Nilai</th>
              <th>Pakai</th>
              <th>Aktif</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-gray-50">
                <td className="py-2 font-mono">{v.code}</td>
                <td>{v.type}</td>
                <td>{v.value}</td>
                <td>
                  {v.used_count}
                  {v.max_uses != null ? ` / ${v.max_uses}` : ''}
                </td>
                <td>
                  <button
                    type="button"
                    className="text-primary-600"
                    onClick={async () => {
                      await updateVoucher(v.id, { active: !v.active });
                      load();
                    }}
                  >
                    {v.active ? 'Ya' : 'Tidak'}
                  </button>
                </td>
                <td className="space-x-2">
                  <Link href={`/admin/vouchers/${v.id}/edit`} className="text-primary-600">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-error-600"
                    onClick={async () => {
                      if (confirm('Hapus?')) {
                        await deleteVoucher(v.id);
                        load();
                      }
                    }}
                  >
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
