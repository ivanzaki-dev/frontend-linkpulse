'use client';

import { cn } from '@/lib/utils';

type Props = {
  title: string;
  value: string;
  sub: string;
  changePercent: number;
  onClick?: () => void;
  active?: boolean;
};

export function StatCard({ title, value, sub, changePercent, onClick, active }: Props) {
  const up = changePercent >= 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-left w-full rounded-xl border bg-white p-5 transition-shadow hover:shadow-md',
        active ? 'border-primary-400 ring-2 ring-primary-100' : 'border-gray-100',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="text-xs text-gray-500 uppercase tracking-wide">{title}</div>
      <div className="text-2xl font-semibold mt-2 tabular-nums text-gray-900">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span
          className={cn(
            'font-medium tabular-nums',
            up ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {up ? '+' : ''}
          {changePercent}%
        </span>
        <span className="text-gray-500">{sub}</span>
      </div>
    </button>
  );
}
