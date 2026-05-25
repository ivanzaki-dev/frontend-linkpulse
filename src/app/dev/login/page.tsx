'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerHeader } from '@/components/customer-header';
import { Button, Card, TextInput } from '@/components/ui';
import { setTestUserEmail } from '@/lib/auth';

export default function DevLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('test@linkpulse.local');

  return (
    <>
      <CustomerHeader />
      <div className="max-w-md mx-auto px-6 py-16">
        <Card>
          <h1 className="text-xl font-semibold">Dev login (staging)</h1>
          <p className="text-sm text-gray-500 mt-2">
            Backend menerima header <code className="text-xs bg-gray-100 px-1 rounded">X-Test-User-Email</code>{' '}
            di non-production.
          </p>
          <TextInput
            className="mt-4"
            label="Test user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            className="mt-4"
            full
            onClick={() => {
              setTestUserEmail(email);
              router.push('/order/new');
            }}
          >
            Simpan & lanjut
          </Button>
        </Card>
      </div>
    </>
  );
}
