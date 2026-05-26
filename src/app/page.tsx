import Link from 'next/link';
import { CustomerHeader } from '@/components/customer-header';
import { Button, Card, LogoMark } from '@/components/ui';
import { copy } from '@/lib/copy';
import { showDevLinks } from '@/lib/env';

const stepIcons = [
  <svg key="1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>,
  <svg key="2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>,
  <svg key="3" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>,
];

export default function LandingPage() {
  const t = copy.landing;
  return (
    <>
      <CustomerHeader />
      <section className="hero-tint">
        <div className="max-w-[1120px] mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-primary-100 text-primary-700 text-xs font-medium shadow-card">
              {t.badge}
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-gray-900 leading-tight">{t.title}</h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-xl">{t.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/order/new">
                <Button size="lg">{t.ctaPreview}</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost">
                  {t.ctaLogin}
                </Button>
              </Link>
            </div>
          </div>
          <Card hoverable>
            <div className="text-sm text-gray-500">{t.sampleTitle}</div>
            <div className="mt-3 space-y-2">
              {[
                { label: 'Video A', links: 9, price: 18000 },
                { label: 'Video B', links: 15, price: 30000 },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="font-medium">{r.label}</span>
                  <span className="text-gray-600 tabular-nums">
                    {r.links} link · Rp {r.price.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xl font-semibold text-right tabular-nums">Total Rp 43.200</div>
          </Card>
        </div>
      </section>

      <section id="cara-kerja" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-[1120px] mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">{t.howTitle}</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {t.steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  {stepIcons[i]}
                </div>
                <div className="mt-1 text-xs font-medium text-primary-600">Langkah {i + 1}</div>
                <h3 className="mt-2 font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="harga" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-[1120px] mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">{t.pricingTitle}</h2>
          <Card className="mt-8 max-w-lg mx-auto text-center">
            <p className="text-3xl font-semibold text-primary-700 tabular-nums">{t.pricingBody}</p>
            <p className="mt-3 text-sm text-gray-600">{t.pricingNote}</p>
            <Link href="/order/new" className="inline-block mt-6">
              <Button>{t.ctaPreview}</Button>
            </Link>
          </Card>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LogoMark />
          <span>© 2026 LinkPulse</span>
        </div>
        {showDevLinks && (
          <>
            <Link href="/dev/login" className="text-xs hover:text-gray-700 min-h-11 inline-flex items-center">
              Masuk mode uji
            </Link>
            {' · '}
            <Link href="/admin/login" className="text-xs hover:text-gray-700 min-h-11 inline-flex items-center">
              Admin
            </Link>
          </>
        )}
      </footer>
    </>
  );
}
