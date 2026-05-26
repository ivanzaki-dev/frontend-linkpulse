import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Button, Card, LogoMark } from '@/components/ui';
import { copy } from '@/lib/copy';
import { showDevLinks } from '@/lib/env';

export default function LoginPage() {
  const t = copy.login;
  return (
    <>
      <CustomerHeader />
      <div className="min-h-[60vh] flex items-center justify-center px-6 bg-gray-50">
        <Card className="max-w-sm w-full text-center !p-8">
          <div className="flex justify-center">
            <LogoMark size="lg" />
          </div>
          <h1 className="text-xl font-semibold mt-4">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-2">{t.subtitle}</p>
          {showDevLinks && (
            <Link href="/dev/login" className="block mt-6">
              <Button full>{t.stagingCta}</Button>
            </Link>
          )}
          <p className="text-xs text-gray-400 mt-6">{t.legal}</p>
        </Card>
      </div>
    </>
  );
}
