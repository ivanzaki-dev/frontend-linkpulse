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
      <div className="flex justify-end mb-4">
        <Link href="/admin/vouchers/new">
          <Button>+ Voucher baru</Button>
        </Link>
      </div>
      <Card className="overflow-x-auto">
        <DataTable>
          <DataTableHead>
            <DataTableHeaderCell>Kode</DataTableHeaderCell>
            <DataTableHeaderCell>Tipe</DataTableHeaderCell>
            <DataTableHeaderCell>Nilai</DataTableHeaderCell>
            <DataTableHeaderCell>Pakai</DataTableHeaderCell>
            <DataTableHeaderCell>Aktif</DataTableHeaderCell>
            <DataTableHeaderCell />
          </DataTableHead>
          <DataTableBody>
            {rows.map((v) => (
              <DataTableRow key={v.id}>
                <DataTableCell>
                  <span className="font-mono text-xs">{v.code}</span>
                </DataTableCell>
                <DataTableCell>{v.type}</DataTableCell>
                <DataTableCell>
                  <span className="tabular-nums">{v.value}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="tabular-nums">
                    {v.used_count}
                    {v.max_uses != null ? ` / ${v.max_uses}` : ''}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <button
                    type="button"
                    className="text-primary-600 min-h-11 inline-flex items-center"
                    onClick={async () => {
                      await updateVoucher(v.id, { active: !v.active });
                      load();
                    }}
                  >
                    {v.active ? 'Ya' : 'Tidak'}
                  </button>
                </DataTableCell>
                <DataTableCell align="right">
                  <Link href={`/admin/vouchers/${v.id}/edit`} className="text-primary-600 min-h-11 inline-flex items-center mr-3">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-error-600 min-h-11 inline-flex items-center"
                    onClick={async () => {
                      if (confirm('Hapus?')) {
                        await deleteVoucher(v.id);
                        load();
                      }
                    }}
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
