'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  clearAdminToken,
  emailFromAdminToken,
  getAdminEmail,
  getAdminToken,
} from '@/lib/auth';
import { cn } from '@/lib/utils';
import { AdminPageHeader, LogoMark } from './ui';

const NAV = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: '/admin/orders/new',
    label: 'Buat order',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: '/admin/pricing',
    label: 'Harga',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/promotions',
    label: 'Promosi',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: '/admin/vouchers',
    label: 'Voucher',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
];

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/admin': { title: 'Dashboard', subtitle: 'Statistik bisnis dan ringkasan operasional.' },
  '/admin/orders': { title: 'Orders', subtitle: 'Daftar pesanan customer dan admin.' },
  '/admin/orders/new': { title: 'Buat order gratis', subtitle: 'Preview → order paid tanpa pembayaran.' },
  '/admin/pricing': { title: 'Pengaturan harga', subtitle: 'Harga per link Shopee.' },
  '/admin/promotions': { title: 'Promosi', subtitle: 'Kelola diskon promosi aktif.' },
  '/admin/promotions/new': { title: 'Promosi baru' },
  '/admin/vouchers': { title: 'Voucher', subtitle: 'Kelola kode voucher.' },
  '/admin/vouchers/new': { title: 'Voucher baru' },
};

function resolvePageMeta(pathname: string) {
  if (pathname.match(/^\/admin\/orders\/[^/]+$/) && pathname !== '/admin/orders/new') {
    return { title: 'Detail order' };
  }
  if (pathname.includes('/promotions/') && pathname.endsWith('/edit')) {
    return { title: 'Edit promosi' };
  }
  if (pathname.includes('/vouchers/') && pathname.endsWith('/edit')) {
    return { title: 'Edit voucher' };
  }
  return PAGE_TITLES[pathname] || { title: 'Admin' };
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const meta = resolvePageMeta(pathname);
  const [adminEmail, setAdminEmail] = useState('Admin');

  useEffect(() => {
    setAdminEmail(
      getAdminEmail() || emailFromAdminToken(getAdminToken()) || 'Admin'
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col min-h-screen">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <LogoMark />
          <div>
            <div className="font-semibold text-sm">LinkPulse</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Admin</div>
          </div>
        </div>
        <div
          className="px-4 py-2 text-xs text-gray-500 truncate border-b border-gray-50"
          suppressHydrationWarning
        >
          {adminEmail}
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((n) => {
            const active =
              pathname === n.href ||
              (n.href === '/admin/orders' &&
                pathname.startsWith('/admin/orders') &&
                pathname !== '/admin/orders/new') ||
              (n.href !== '/admin' &&
                n.href !== '/admin/orders' &&
                pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'flex items-center gap-2.5 min-h-11 px-3 rounded-md text-sm transition-colors',
                  active ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className={active ? 'text-primary-600' : 'text-gray-400'}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="m-2 min-h-11 px-3 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-error-600 text-left w-[calc(100%-1rem)] transition-colors"
          onClick={() => {
            clearAdminToken();
            router.push('/admin/login');
          }}
        >
          Keluar
        </button>
      </aside>
      <main className="flex-1 p-8 max-w-6xl">
        <AdminPageHeader title={meta.title} subtitle={meta.subtitle} />
        {children}
      </main>
    </div>
  );
}
