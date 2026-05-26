'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { getPricingSettings, listPromotions, listVouchers } from '@/lib/api';
import { fmtIDR } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [price, setPrice] = useState(2000);
  const [promoCount, setPromoCount] = useState(0);
  const [voucherCount, setVoucherCount] = useState(0);

  useEffect(() => {
    getPricingSettings().then((p) => setPrice(p.pricePerLink));
    listPromotions().then((r) => setPromoCount(r.promotions.filter((p) => p.active).length));
    listVouchers().then((r) => setVoucherCount(r.vouchers.filter((v) => v.active).length));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Kelola harga, promo, voucher, dan pesanan.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <div className="text-xs text-gray-500 uppercase">Harga per link</div>
          <div className="text-3xl font-semibold mt-2 text-primary-700">{fmtIDR(price)}</div>
          <Link href="/admin/pricing">
            <Button variant="ghost" size="sm" className="mt-3">
              Ubah
            </Button>
          </Link>
        </Card>
        <Card>
          <div className="text-xs text-gray-500 uppercase">Promo aktif</div>
          <div className="text-3xl font-semibold mt-2">{promoCount}</div>
          <Link href="/admin/promotions">
            <Button variant="ghost" size="sm" className="mt-3">
              Kelola
            </Button>
          </Link>
        </Card>
        <Card>
          <div className="text-xs text-gray-500 uppercase">Voucher aktif</div>
          <div className="text-3xl font-semibold mt-2">{voucherCount}</div>
          <Link href="/admin/vouchers">
            <Button variant="ghost" size="sm" className="mt-3">
              Kelola
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
