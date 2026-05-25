'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAdminToken } from '@/lib/auth';
import { AdminShell } from '@/components/admin-shell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!isLogin && !getAdminToken()) router.replace('/admin/login');
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
