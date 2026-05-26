'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { StatsSeriesPoint } from '@/lib/types';
import { Button } from '@/components/ui';

type Props = {
  open: boolean;
  title: string;
  points: StatsSeriesPoint[];
  valueFormatter: (n: number) => string;
  onClose: () => void;
};

export function StatsChartModal({
  open,
  title,
  points,
  valueFormatter,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">12 bulan terakhir</p>
          </div>
          <Button variant="secondary" type="button" onClick={onClose}>
            Tutup
          </Button>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => valueFormatter(Number(v))} />
              <Tooltip
                formatter={(v) => [valueFormatter(Number(v ?? 0)), 'Nilai']}
                labelFormatter={(l) => `Bulan ${l}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
