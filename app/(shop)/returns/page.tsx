import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Exchanges — Dreamshop',
  description: 'Our 30-day hassle-free return and exchange policy.',
}

const POLICY_SECTIONS = [
  {
    number: '01',
    title: '30-day return window',
    body: 'Changed your mind? You have 30 days from the date of delivery to request a return or exchange. Products must be unused and in original packaging.',
  },
  {
    number: '02',
    title: 'Easy process',
    body: 'Simply send us a WhatsApp message with your order details and the reason for your return. We\'ll guide you through every step — no confusing forms.',
  },
  {
    number: '03',
    title: 'Quick refunds',
    body: 'Once we receive and inspect your return, refunds are processed within 2–3 business days. Exchanges ship as soon as the item is confirmed returned.',
  },
]

const EXCLUDED = [
  'Opened or used beauty products (for hygiene reasons)',
  'Items purchased on final sale',
  'Products damaged due to misuse or improper storage',
]

export default function ReturnsPage() {
  return (
    <main className="bg-white pt-[100px]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="max-w-xl">
          <p className="mb-4 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
            Policy
          </p>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-light leading-[1.1] tracking-[-0.01em] text-[#1C1917]">
            Returns &amp;<br />
            <span className="italic">Exchanges.</span>
          </h1>
          <p className="mt-6 text-[14px] font-light leading-[1.9] text-[#78716C]">
            We want you to love every product you receive. If something isn&apos;t right,
            we make it easy to return or exchange — no hassle, no stress.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#F0EAE0]" />
      </div>

      {/* ── Policy sections ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {POLICY_SECTIONS.map((s) => (
            <div key={s.number}>
              <p className="mb-4 font-display text-[40px] font-light text-[#E8E0D8]">{s.number}</p>
              <h3 className="mb-3 text-[15px] font-normal text-[#1C1917]">{s.title}</h3>
              <p className="text-[13px] font-light leading-[1.85] text-[#78716C]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#F0EAE0]" />
      </div>

      {/* ── Exclusions + CTA ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">

          <div>
            <p className="mb-6 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
              What can&apos;t be returned
            </p>
            <ul className="space-y-4">
              {EXCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] font-light leading-[1.7] text-[#78716C]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C9A882]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#F0EAE0] bg-[#FAFAF8] p-8">
            <p className="mb-2 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
              Start a return
            </p>
            <p className="mb-6 text-[14px] font-light leading-[1.85] text-[#78716C]">
              Ready to return or exchange? Contact us on WhatsApp and we&apos;ll take care of the rest.
            </p>
            <a
              href="https://wa.me/21342631657?text=Hi%2C%20I%20would%20like%20to%20return%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#1C1917] px-7 py-3 text-[12px] font-light uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#3D3530]"
            >
              Contact us on WhatsApp
            </a>
            <p className="mt-5 text-[11px] font-light text-[#B8AFA8]">
              Or email us at{' '}
              <Link href="/contact" className="underline underline-offset-2 hover:text-[#78716C]">
                our contact page
              </Link>
            </p>
          </div>

        </div>
      </section>

    </main>
  )
}
