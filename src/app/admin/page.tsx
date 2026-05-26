'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/admin/stat-card';
import { StatsChartModal } from '@/components/admin/stats-chart-modal';
import { Button, Card } from '@/components/ui';
import {
  clearAdminStats,
  getAdminStatsOverview,
  getAdminStatsSeries,
  seedAdminStats,
} from '@/lib/api';
import type { AdminStatsOverview, StatsSeriesPoint } from '@/lib/types';
import { fmtIDR } from '@/lib/utils';

const SEED_ENABLED = process.env.NEXT_PUBLIC_ADMIN_SEED_ENABLED === 'true';

type MetricKey = 'revenue' | 'links' | 'orders';

const METRIC_LABELS: Record<MetricKey, string> = {
  revenue: 'Revenue bulan ini',
  links: 'Link check bulan ini',
  orders: 'Order bulan ini',
};

const CHART_TITLES: Record<MetricKey, string> = {
  revenue: 'Revenue — 12 bulan',
  links: 'Link check — 12 bulan',
  orders: 'Jumlah order — 12 bulan',
};

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminStatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState<MetricKey | null>(null);
  const [chartPoints, setChartPoints] = useState<StatsSeriesPoint[]>([]);
  const [seedMsg, setSeedMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOverview(await getAdminStatsOverview());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openChart = async (metric: MetricKey) => {
    setChartMetric(metric);
    const series = await getAdminStatsSeries(metric, 12);
    setChartPoints(series.points);
  };

  const formatValue = (metric: MetricKey, n: number) => {
    if (metric === 'revenue') return fmtIDR(n);
    return String(Math.round(n));
  };

  const runSeed = async () => {
    const r = await seedAdminStats();
    setSeedMsg(`Data demo ditambahkan: ${r.inserted} order`);
    await load();
  };

  const runClearSeed = async () => {
    const r = await clearAdminStats();
    setSeedMsg(`Data demo dihapus: ${r.deleted} order`);
    await load();
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Memuat statistik…</p>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-3">Ringkasan bisnis</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {(['revenue', 'links', 'orders'] as MetricKey[]).map((key) => {
            const block = overview?.[key];
            if (!block) return null;
            return (
              <StatCard
                key={key}
                title={METRIC_LABELS[key]}
                value={formatValue(key, block.value)}
                sub={block.change_label}
                changePercent={block.change_percent}
                active={chartMetric === key}
                onClick={() => openChart(key)}
              />
            );
          })}
        </div>
      </section>

      {SEED_ENABLED && (
        <Card>
          <p className="text-sm text-gray-600">Data demo untuk grafik (staging saja)</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="secondary" type="button" onClick={runSeed}>
              Muat data demo
            </Button>
            <Button variant="secondary" type="button" onClick={runClearSeed}>
              Hapus data demo
            </Button>
          </div>
          {seedMsg && <p className="text-xs text-gray-500 mt-2">{seedMsg}</p>}
        </Card>
      )}

      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-3">Kelola</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/admin/pricing" className="block">
            <Card className="hover:border-primary-200 transition-colors">
              <div className="text-xs text-gray-500 uppercase">Harga</div>
              <div className="text-sm mt-1 text-primary-600 font-medium">Pengaturan harga per link</div>
            </Card>
          </Link>
          <Link href="/admin/promotions" className="block">
            <Card className="hover:border-primary-200 transition-colors">
              <div className="text-xs text-gray-500 uppercase">Promosi</div>
              <div className="text-sm mt-1 text-primary-600 font-medium">Diskon kampanye</div>
            </Card>
          </Link>
          <Link href="/admin/vouchers" className="block">
            <Card className="hover:border-primary-200 transition-colors">
              <div className="text-xs text-gray-500 uppercase">Voucher</div>
              <div className="text-sm mt-1 text-primary-600 font-medium">Kode voucher</div>
            </Card>
          </Link>
        </div>
      </section>

      {chartMetric && (
        <StatsChartModal
          open={Boolean(chartMetric)}
          title={CHART_TITLES[chartMetric]}
          points={chartPoints}
          valueFormatter={(n) => formatValue(chartMetric, n)}
          onClose={() => setChartMetric(null)}
        />
      )}
    </div>
  );
}
