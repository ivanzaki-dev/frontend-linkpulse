'use client';

import Link from 'next/link';
import { Button, LogoMark } from './ui';
import { getTestUserEmail } from '@/lib/auth';
import { copy } from '@/lib/copy';

export function CustomerHeader() {
  const email = typeof window !== 'undefined' ? getTestUserEmail() : '';
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-gray-100">
      <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-semibold text-[17px] text-gray-900">LinkPulse</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/orders" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-md">
            {copy.header.history}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-gray-500 truncate max-w-[140px]">{email}</span>
          <Link href="/order/new">
            <Button size="sm">{copy.header.start}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
