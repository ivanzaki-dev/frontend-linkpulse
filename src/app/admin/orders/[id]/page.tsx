'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alert, Button, Card } from '@/components/ui';
import { getAdminOrder, getAdminOrderReport, markOrderPaidAdmin } from '@/lib/api';
import type { AdminOrderDetail } from '@/lib/types';
import { fmtIDR } from '@/lib/utils';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setDetail(await getAdminOrder(id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const downloadReport = async () => {
    try {
      const r = await getAdminOrderReport(id);
      const url = r.download_url || r.report_url;
      if (url) window.open(url, '_blank');
      else setMsg('URL laporan tidak tersedia');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Laporan belum siap');
    }
  };

  const markPaid = async () => {
    await markOrderPaidAdmin(id);
    setMsg('Order ditandai paid');
    await load();
  };

  if (loading) return <p className="text-sm text-gray-500">Memuat detail…</p>;
  if (!detail) return <p className="text-sm text-red-600">Order tidak ditemukan</p>;

  const { order, customer, youtube_videos, links_summary, pool } = detail;

  return (
    <div className="space-y-4 max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-primary-600 hover:underline">
        ← Kembali ke daftar order
      </Link>

      {msg && <Alert kind="success">{msg}</Alert>}

      <Card>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-gray-500 uppercase">Invoice</div>
            <div className="font-semibold mt-1">{order.invoice_number || order.id}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase">Status</div>
            <div className="mt-1">
              {order.status} · {order.payment_status}
            </div>
          </div>
          <div>
            {order.created_by_admin ? (
              <>
                <div className="text-xs text-gray-500 uppercase">Nama Admin</div>
                <div className="mt-1">{order.admin_operator_name || '—'}</div>
                <div className="text-xs text-gray-500 uppercase mt-2">User / Channel</div>
                <div className="mt-1">{order.channel_name || customer?.name || '—'}</div>
              </>
            ) : (
              <>
                <div className="text-xs text-gray-500 uppercase">Customer</div>
                <div className="mt-1">{customer?.email || '—'}</div>
                {customer?.name && <div className="text-gray-500">{customer.name}</div>}
              </>
            )}
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase">Total</div>
            <div className="font-semibold mt-1 tabular-nums">{fmtIDR(order.total_price)}</div>
            <div className="text-gray-500 text-xs">{order.total_shopee_links} link Shopee</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-sm space-y-1">
          <div>Subtotal: {fmtIDR(order.subtotal)}</div>
          <div>Diskon: {fmtIDR(order.discount_amount)}</div>
          {order.created_by_admin && (
            <div className="text-amber-700 text-xs">Order komplimen (admin)</div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {order.payment_status !== 'paid' && (
            <Button type="button" onClick={markPaid}>
              Mark paid
            </Button>
          )}
          {order.status === 'completed' && (
            <Button type="button" variant="secondary" onClick={downloadReport}>
              Unduh PDF laporan
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-sm">Video YouTube</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {youtube_videos.map((v) => (
            <li key={v.index}>
              {v.label}: {v.shopee_link_count} link
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="font-medium text-sm">Hasil link</h3>
        <p className="text-sm text-gray-600 mt-1">
          ACTIVE {links_summary.active} · INACTIVE {links_summary.inactive}
          {links_summary.shop_page != null && links_summary.shop_page > 0
            ? ` · SHOP ${links_summary.shop_page}`
            : ''}{' '}
          · ERROR {links_summary.error} · total {links_summary.total}
        </p>
        {pool && (
          <p className="text-xs text-gray-500 mt-2">
            Pool:{' '}
            {pool.pool_status === 'paused' ? (
              <span className="text-amber-700 font-medium">
                paused — menunggu operator (worker)
              </span>
            ) : (
              pool.pool_status
            )}
            {pool.claimed_by ? ` · ${pool.claimed_by}` : ''}
          </p>
        )}
      </Card>
    </div>
  );
}
