'use client';

import Link from 'next/link';
import { labelStatus } from '@/lib/copy';
import { cn, fmtIDR } from '@/lib/utils';
import type { ReactNode } from 'react';

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('spinner', className)}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Memuat"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon({ kind }: { kind: 'info' | 'success' | 'warning' | 'error' }) {
  const paths: Record<string, string> = {
    info: 'M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  };
  const colors: Record<string, string> = {
    info: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
  };
  return (
    <svg className={cn('h-5 w-5 shrink-0', colors[kind])} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[kind]} />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  loading,
  full,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  full?: boolean;
}) {
  const sizes = { sm: 'min-h-11 h-11 px-3 text-sm', md: 'h-11 px-4 text-[15px]', lg: 'h-12 px-5 text-base' };
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-card',
    secondary: 'bg-white text-primary-700 border border-primary-600 hover:bg-primary-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    soft: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
    danger: 'bg-error-600 hover:bg-error-700 text-white',
  };
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors',
        sizes[size],
        variants[variant],
        full && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {loading && <SpinnerIcon className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  hoverable,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-card p-6',
        hoverable && 'transition-shadow hover:shadow-card-hov',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Alert({
  kind = 'info',
  title,
  children,
  className,
}: {
  kind?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const styles = {
    info: 'border-primary-100 bg-primary-50 text-primary-900',
    success: 'border-success-100 bg-success-50 text-success-700',
    warning: 'border-warning-100 bg-warning-50 text-warning-700',
    error: 'border-error-100 bg-error-50 text-error-700',
  };
  return (
    <div className={cn('rounded-lg border px-4 py-3 text-sm flex gap-3', styles[kind], className)} role="alert">
      <AlertIcon kind={kind} />
      <div className="min-w-0 flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        {children}
      </div>
    </div>
  );
}

const statusDot: Record<string, string> = {
  queued: 'bg-gray-400',
  processing: 'bg-warning-600',
  claimed: 'bg-warning-600',
  completed: 'bg-success-600',
  ready: 'bg-success-600',
  failed: 'bg-error-600',
  awaiting_payment: 'bg-primary-600',
  paid: 'bg-success-600',
  pending: 'bg-gray-400',
};

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: 'bg-gray-100 text-gray-700',
    processing: 'bg-warning-50 text-warning-700 border border-warning-100',
    claimed: 'bg-warning-50 text-warning-700 border border-warning-100',
    completed: 'bg-success-50 text-success-700',
    ready: 'bg-success-50 text-success-700',
    failed: 'bg-error-50 text-error-700',
    awaiting_payment: 'bg-primary-50 text-primary-700 border border-primary-200',
    paid: 'bg-success-50 text-success-700',
    pending: 'bg-gray-100 text-gray-600',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        map[status] || map.queued
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', statusDot[status] || statusDot.queued)} aria-hidden />
      {labelStatus(status)}
    </span>
  );
}

export function ResultChip({
  label,
  count,
  variant,
}: {
  label: string;
  count: number;
  variant: 'success' | 'warning' | 'error';
}) {
  const styles = {
    success: 'bg-success-50 text-success-700 border-success-100',
    warning: 'bg-warning-50 text-warning-700 border-warning-100',
    error: 'bg-error-50 text-error-700 border-error-100',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border', styles[variant])}>
      <span className="font-semibold tabular-nums">{count}</span>
      <span className="text-xs opacity-90">{label}</span>
    </span>
  );
}

export function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={cn('h-2 rounded-full bg-gray-100 overflow-hidden', className)}>
      <div
        className="h-full rounded-full bg-primary-600 transition-all duration-300"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}

export type StepState = 'done' | 'active' | 'pending';

export function ProgressStepper({
  steps,
}: {
  steps: { label: string; state: StepState }[];
}) {
  return (
    <ol className="flex items-center w-full gap-1 sm:gap-2">
      {steps.map((step, i) => (
        <li key={step.label} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
          <div className="flex flex-col items-center min-w-0 flex-1">
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold border-2',
                step.state === 'done' && 'bg-primary-600 border-primary-600 text-white',
                step.state === 'active' && 'border-primary-600 text-primary-700 bg-primary-50',
                step.state === 'pending' && 'border-gray-200 text-gray-400 bg-white'
              )}
            >
              {step.state === 'done' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span
              className={cn(
                'mt-1.5 text-[11px] sm:text-xs text-center leading-tight',
                step.state === 'active' ? 'font-medium text-gray-900' : 'text-gray-500'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn('h-0.5 flex-1 mx-1 sm:mx-2 mb-5', step.state === 'done' ? 'bg-primary-600' : 'bg-gray-200')}
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel,
  className,
}: {
  title: string;
  subtitle?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
}) {
  return (
    <header className={className}>
      {backHref && (
        <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-900 inline-flex min-h-11 items-center">
          {backLabel || '← Kembali'}
        </Link>
      )}
      <h1 className={cn('text-2xl font-semibold text-gray-900', backHref && 'mt-1')}>{title}</h1>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
    </header>
  );
}

export function EmptyState({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('text-center py-12 px-4', className)}>
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function DataTable({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto -mx-1', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">{children}</tr>
    </thead>
  );
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function DataTableRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tr className={cn('border-b border-gray-50 hover:bg-primary-50/50 transition-colors', className)}>{children}</tr>
  );
}

export function DataTableCell({
  children,
  className,
  align = 'left',
}: {
  children?: ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return <td className={cn('py-3 px-2 first:pl-0 last:pr-0', alignClass, className)}>{children}</td>;
}

export function DataTableHeaderCell({
  children,
  className,
  align = 'left',
}: {
  children?: ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <th className={cn('py-2.5 px-2 first:pl-0 last:pr-0 font-medium text-xs uppercase tracking-wide', alignClass, className)}>
      {children}
    </th>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />;
}

export function SkeletonRow({ cols = 3 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function PricingCard({
  pricing,
  note,
  compact,
}: {
  pricing: {
    price_per_link: number;
    subtotal: number;
    promotion_discount: number;
    voucher_discount: number;
    total_price: number;
    promotion_applied?: string | null;
    voucher_applied?: string | null;
  };
  note?: string;
  compact?: boolean;
}) {
  return (
    <Card className={compact ? '!p-4' : undefined}>
      <h3 className={cn('font-semibold text-gray-900', compact ? 'text-sm' : 'text-base')}>Ringkasan harga</h3>
      <dl className={cn('space-y-2', compact ? 'mt-3 text-sm' : 'mt-4 text-sm')}>
        <div className="flex justify-between">
          <dt className="text-gray-500">Harga per link</dt>
          <dd className="tabular-nums">{fmtIDR(pricing.price_per_link)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className="tabular-nums">{fmtIDR(pricing.subtotal)}</dd>
        </div>
        {pricing.promotion_discount > 0 && (
          <div className="flex justify-between text-success-700">
            <dt>Promo{pricing.promotion_applied ? ` · ${pricing.promotion_applied}` : ''}</dt>
            <dd className="tabular-nums">− {fmtIDR(pricing.promotion_discount)}</dd>
          </div>
        )}
        {pricing.voucher_discount > 0 && (
          <div className="flex justify-between text-success-700">
            <dt>Voucher{pricing.voucher_applied ? ` · ${pricing.voucher_applied}` : ''}</dt>
            <dd className="tabular-nums">− {fmtIDR(pricing.voucher_discount)}</dd>
          </div>
        )}
      </dl>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-baseline">
        <span className="font-medium text-gray-900">Total</span>
        <span className={cn('font-semibold tabular-nums', compact ? 'text-xl' : 'text-2xl')}>
          {fmtIDR(pricing.total_price)}
        </span>
      </div>
      {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
    </Card>
  );
}

export function OrderSummaryCard({
  videoCount,
  linkCount,
  totalPrice,
}: {
  videoCount?: number | null;
  linkCount?: number | null;
  totalPrice?: number | null;
}) {
  return (
    <Card className="!p-4">
      <h3 className="text-sm font-semibold text-gray-900">Ringkasan pesanan</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Video</dt>
          <dd className="tabular-nums">{videoCount ?? '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Link Shopee</dt>
          <dd className="tabular-nums">{linkCount ?? '—'}</dd>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <dt className="font-medium text-gray-900">Total</dt>
          <dd className="font-semibold tabular-nums text-lg">
            {totalPrice != null ? fmtIDR(totalPrice) : '—'}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

const selectClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100';

export function SelectField({
  label,
  className,
  children,
  id,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const uid = id || rest.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={uid} className="block text-sm font-medium text-gray-900 mb-1.5">
          {label}
        </label>
      )}
      <select id={uid} className={selectClass} {...rest}>
        {children}
      </select>
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, className, id, ...rest } = props;
  const uid = id || rest.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={uid} className="block text-sm font-medium text-gray-900 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={uid}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
        {...rest}
      />
    </div>
  );
}

export function LogoMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const px = { sm: 28, md: 36, lg: 48 }[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- used in client shells; static asset
    <img
      src="/logo.png"
      alt="LinkPulse"
      width={px}
      height={px}
      className="shrink-0 rounded-lg object-contain"
    />
  );
}

export function AdminPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6 pb-4 border-b border-gray-100">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </header>
  );
}
