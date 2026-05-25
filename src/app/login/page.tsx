import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Button, Card, LogoMark } from '@/components/ui';

export default function LoginPage() {
  return (
    <>
      <CustomerHeader />
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <Card className="max-w-sm w-full text-center">
          <LogoMark />
          <h1 className="text-xl font-semibold mt-4">Masuk ke LinkPulse</h1>
          <p className="text-sm text-gray-500 mt-2">Better Auth (Google) menyusul. Gunakan Dev login untuk staging.</p>
          <Link href="/dev/login" className="block mt-6">
            <Button full>Dev login staging</Button>
          </Link>
        </Card>
      </div>
    </>
  );
}
