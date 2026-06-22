import Link from 'next/link'
import { getFeaturedProducts } from '@/actions/product-actions'
import { BestSellers } from '@/components/home/best-sellers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Prices',
  description: 'The best prices on authentic beauty products. Updated daily.',
}

export default async function OffersPage() {
  const products = await getFeaturedProducts(12)

  return (
    <main className="bg-white pt-[100px]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="max-w-xl">
          <p className="mb-4 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
            Always on
          </p>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-light leading-[1.1] tracking-[-0.01em] text-[#1C1917]">
            Best prices,<br />
            <span className="italic">every day.</span>
          </h1>
          <p className="mt-6 text-[14px] font-light leading-[1.9] text-[#78716C]">
            We work directly with distributors to guarantee you the lowest prices
            on authentic products — no compromise on quality, ever.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <Link
              href="/products"
              className="rounded-full bg-[#1C1917] px-7 py-3 text-[12px] font-light uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#3D3530]"
            >
              Shop all products
            </Link>
            <Link
              href="/about"
              className="text-[12px] font-light uppercase tracking-[0.15em] text-[#78716C] underline-offset-4 hover:underline"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust pills ── */}
      <div className="border-y border-[#F0EAE0] bg-[#FAFAF8] py-5">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-light text-[#78716C]">
            {[
              'Lowest price guaranteed',
              '100% authentic products',
              'Fast WhatsApp support',
              '30-day returns',
            ].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#C9A882]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <BestSellers products={products} />

    </main>
  )
}
