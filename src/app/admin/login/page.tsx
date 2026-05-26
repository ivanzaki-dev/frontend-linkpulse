'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, ApiClientError, getApiConfigWarning } from '@/lib/api';
import { setAdminEmail, setAdminToken } from '@/lib/auth';
import { Alert, Button, Card, LogoMark, TextInput } from '@/components/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [configWarning, setConfigWarning] = useState<string | null>(null);

  useEffect(() => {
    setConfigWarning(getApiConfigWarning());
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const out = await adminLogin(email, password);
      setAdminToken(out.token);
      setAdminEmail(out.email || email);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Card className="max-w-sm w-full !p-0 overflow-hidden">
        <div className="h-1.5 bg-primary-600" />
        <form className="p-7" onSubmit={submit}>
          <LogoMark size="md" />
          <h1 className="text-xl font-semibold mt-4">Admin LinkPulse</h1>
          <p className="text-sm text-gray-500 mt-1">Email & password dari backend .env</p>
          {configWarning && (
            <Alert kind="error" className="mt-3">
              {configWarning}
            </Alert>
          )}
          {error && (
            <Alert kind="error" className="mt-3">
              {error}
            </Alert>
          )}
          <TextInput className="mt-4" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextInput className="mt-3" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button className="mt-5" full loading={loading} type="submit">
            Masuk
          </Button>
        </form>
      </Card>
    </div>
  );
}
