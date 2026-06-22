import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Dreamshop',
  description: 'Our story, our values, and our mission to bring the best beauty products to you.',
}

const VALUES = [
  {
    number: '01',
    title: 'Curated with care',
    body: 'Every product on Dreamshop is hand-picked. We test, verify authenticity, and only list what we would use ourselves.',
  },
  {
    number: '02',
    title: '100% authentic',
    body: 'No fakes, no grey-market imports. Every brand we carry is sourced directly from authorised distributors.',
  },
  {
    number: '03',
    title: 'Fast to your door',
    body: 'We deliver across Mauritania — home delivery, express options, or pick up in-store at your convenience.',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-white pt-[100px]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Story */}
          <div>
            <p className="mb-4 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
              Our story
            </p>
            <h1 className="font-display text-[clamp(32px,5vw,56px)] font-light leading-[1.1] tracking-[-0.01em] text-[#1C1917]">
              Beauty,<br />
              <span className="italic">made simple.</span>
            </h1>
            <div className="mt-8 space-y-5 text-[14px] font-light leading-[1.9] text-[#78716C]">
              <p>
                Dreamshop was born from a simple belief — that everyone deserves access to genuinely
                good beauty products, without confusion, without compromise.
              </p>
              <p>
                Based in Mauritania, we started as a small passion project among friends who were
                tired of guessing which products were real, effective, or worth the price. We decided
                to do the work ourselves: research, source, and stand behind every single item we sell.
              </p>
              <p>
                Today we carry skincare, haircare, perfumes, makeup, and more — all curated with
                the same intention we started with. Real products, honest prices, real care.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-[#1C1917] px-7 py-3 text-[12px] font-light uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#3D3530]"
              >
                Shop now
              </Link>
              <Link
                href="/contact"
                className="text-[12px] font-light uppercase tracking-[0.15em] text-[#78716C] underline-offset-4 hover:underline"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-[#F7F4F0]" style={{ aspectRatio: '4/5' }}>
              <Image
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
                alt="Dreamshop — beauty products"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-[#F0EAE0] bg-white px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <p className="font-display text-[28px] font-light italic text-[#1C1917]">Dreamshop</p>
              <p className="mt-0.5 text-[9px] font-light uppercase tracking-[0.38em] text-[#C9A882]">
                Beauty &amp; Wellness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#F0EAE0]" />
      </div>

      {/* ── Values ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <p className="mb-12 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
          What we stand for
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.number}>
              <p className="mb-4 font-display text-[40px] font-light text-[#E8E0D8]">{v.number}</p>
              <h3 className="mb-3 text-[15px] font-normal text-[#1C1917]">{v.title}</h3>
              <p className="text-[13px] font-light leading-[1.85] text-[#78716C]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
