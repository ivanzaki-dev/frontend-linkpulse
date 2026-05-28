'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alert, Button, Card } from '@/components/ui';
import {
  adminRequeueOrderLink,
  getAdminOrder,
  getAdminOrderReportData,
  markOrderPaidAdmin,
} from '@/lib/api';
import { downloadOrderReportPdf } from '@/lib/generate-pdf';
import type { AdminOrderDetail } from '@/lib/types';
import { fmtIDR } from '@/lib/utils';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

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
    setPdfLoading(true);
    try {
      const data = await getAdminOrderReportData(id);
      if (!data.report) {
        setMsg('Laporan belum siap');
        return;
      }
      downloadOrderReportPdf(
        { report: data.report },
        `linkpulse-${id.slice(0, 8)}.pdf`
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Laporan belum siap');
    } finally {
      setPdfLoading(false);
    }
  };

  const markPaid = async () => {
    await markOrderPaidAdmin(id);
    setMsg('Order ditandai paid');
    await load();
  };

  const requeueLink = async (linkId: string) => {
    await adminRequeueOrderLink(linkId);
    setMsg('Link di-requeue');
    await load();
  };

  if (loading) return <p className="text-sm text-gray-500">Memuat detail…</p>;
  if (!detail) return <p className="text-sm text-red-600">Order tidak ditemukan</p>;

  const { order, customer, youtube_videos, links_summary, links } = detail;
  const progress =
    links_summary.terminal != null
      ? `${links_summary.terminal} / ${links_summary.total} selesai`
      : `${links_summary.total} link`;

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
            <div className="text-xs text-gray-500 mt-1">Progress: {progress}</div>
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

        <div className="flex flex-wrap gap-2 mt-4">
          {order.payment_status !== 'paid' && (
            <Button type="button" onClick={markPaid}>
              Mark paid
            </Button>
          )}
          {order.status === 'completed' && (
            <Button type="button" variant="secondary" loading={pdfLoading} onClick={downloadReport}>
              Generate PDF
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
          ACTIVE {links_summary.active} · INACTIVE {links_summary.inactive} · UNCHECKABLE{' '}
          {links_summary.uncheckable ?? 0} · paused {links_summary.paused ?? 0} · queued{' '}
          {links_summary.queued ?? 0} · total {links_summary.total}
        </p>
        {links && links.length > 0 && (
          <ul className="mt-3 space-y-2 text-xs max-h-64 overflow-y-auto">
            {links
              .filter((l) => l.capture_status === 'paused' || l.capture_status === 'claimed')
              .map((l) => (
                <li key={l.id} className="flex justify-between gap-2 border-t pt-2">
                  <span>
                    #{l.index} {l.capture_status}{' '}
                    {l.final_status ? `· ${l.final_status}` : ''}
                  </span>
                  {(l.capture_status === 'paused' || l.capture_status === 'claimed') && (
                    <Button type="button" size="sm" variant="ghost" onClick={() => requeueLink(l.id)}>
                      Requeue
                    </Button>
                  )}
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
