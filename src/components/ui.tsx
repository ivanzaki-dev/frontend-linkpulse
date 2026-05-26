'use client';

import { labelStatus } from '@/lib/copy';
import { cn, fmtIDR } from '@/lib/utils';
import type { ReactNode } from 'react';

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
  const sizes = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-4 text-[15px]', lg: 'h-12 px-5 text-base' };
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
      {loading && (
        <svg className="spinner h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-100 shadow-card p-6', className)}>
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
    <div className={cn('rounded-lg border px-4 py-3 text-sm', styles[kind], className)}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: 'bg-gray-100 text-gray-700',
    processing: 'bg-warning-50 text-warning-700 border border-warning-100',
    completed: 'bg-success-50 text-success-700',
    failed: 'bg-error-50 text-error-700',
    awaiting_payment: 'bg-primary-50 text-primary-700 border border-primary-200',
    paid: 'bg-success-50 text-success-700',
    pending: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', map[status] || map.queued)}>
      {labelStatus(status)}
    </span>
  );
}

export function PricingCard({
  pricing,
  note,
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
}) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900">Ringkasan harga</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Harga per link</dt>
          <dd>{fmtIDR(pricing.price_per_link)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal</dt>
          <dd>{fmtIDR(pricing.subtotal)}</dd>
        </div>
        {pricing.promotion_discount > 0 && (
          <div className="flex justify-between text-success-700">
            <dt>Promo{pricing.promotion_applied ? ` · ${pricing.promotion_applied}` : ''}</dt>
            <dd>− {fmtIDR(pricing.promotion_discount)}</dd>
          </div>
        )}
        {pricing.voucher_discount > 0 && (
          <div className="flex justify-between text-success-700">
            <dt>Voucher{pricing.voucher_applied ? ` · ${pricing.voucher_applied}` : ''}</dt>
            <dd>− {fmtIDR(pricing.voucher_discount)}</dd>
          </div>
        )}
      </dl>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-baseline">
        <span className="font-medium text-gray-900">Total</span>
        <span className="text-2xl font-semibold tabular-nums">{fmtIDR(pricing.total_price)}</span>
      </div>
      {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
    </Card>
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

export function LogoMark() {
  return (
    <span className="w-7 h-7 rounded-lg bg-primary-600 text-white grid place-items-center text-xs font-bold">
      LP
    </span>
  );
}
