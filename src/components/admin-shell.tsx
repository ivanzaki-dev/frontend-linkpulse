'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminToken } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { LogoMark } from './ui';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/pricing', label: 'Harga' },
  { href: '/admin/promotions', label: 'Promosi' },
  { href: '/admin/vouchers', label: 'Voucher' },
  { href: '/admin/orders', label: 'Orders' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col min-h-screen">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <LogoMark />
          <div>
            <div className="font-semibold text-sm">LinkPulse</div>
            <div className="text-[10px] text-gray-500 uppercase">Admin</div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((n) => {
            const active =
              pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm',
                  active ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="m-2 p-2 text-sm text-gray-500 hover:text-error-600 text-left"
          onClick={() => {
            clearAdminToken();
            router.push('/admin/login');
          }}
        >
          Keluar
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
