import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Button, Card, LogoMark } from '@/components/ui';

export default function LandingPage() {
  return (
    <>
      <CustomerHeader />
      <section className="hero-tint">
        <div className="max-w-[1120px] mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-primary-100 text-primary-700 text-xs font-medium shadow-card">
              Preview via worker · estimasi 30s–2m
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-gray-900 leading-tight">
              Cek link Shopee dari video YouTube Anda — dalam hitungan menit.
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-xl">
              Tempel URL YouTube, kami scan deskripsi & panel video, lalu kirim laporan PDF link
              aktif/tidak aktif.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/order/new">
                <Button size="lg">Mulai Preview gratis</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost">
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
          <Card>
            <div className="text-sm text-gray-500">Contoh hasil Preview</div>
            <div className="mt-3 space-y-2">
              {[
                { label: 'YouTube A', links: 9, price: 18000 },
                { label: 'YouTube B', links: 15, price: 30000 },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="font-medium">{r.label}</span>
                  <span className="text-gray-600">
                    {r.links} link · Rp {r.price.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xl font-semibold text-right">Total Rp 43.200</div>
          </Card>
        </div>
      </section>
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LogoMark />
          <span>© 2026 LinkPulse</span>
        </div>
        <Link href="/dev/login" className="text-xs hover:text-gray-700">
          Dev login
        </Link>
        {' · '}
        <Link href="/admin/login" className="text-xs hover:text-gray-700">
          Admin
        </Link>
      </footer>
    </>
  );
}
