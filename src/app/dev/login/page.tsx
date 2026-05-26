'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerHeader } from '@/components/customer-header';
import { Button, Card, TextInput } from '@/components/ui';
import { setTestUserEmail } from '@/lib/auth';
import { copy } from '@/lib/copy';

export default function DevLoginPage() {
  const router = useRouter();
  const t = copy.devLogin;
  const [email, setEmail] = useState('test@linkpulse.local');

  return (
    <>
      <CustomerHeader />
      <div className="max-w-md mx-auto px-6 py-16">
        <Card>
          <h1 className="text-xl font-semibold">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-2">{t.subtitle}</p>
          <TextInput
            className="mt-4"
            label={t.emailLabel}
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
            {t.submit}
          </Button>
        </Card>
      </div>
    </>
  );
}
