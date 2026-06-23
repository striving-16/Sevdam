import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { whatsAppUrl } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Our Story — Besma Sevdam',
  description: 'The story behind Besma Sevdam — a luxury beauty brand born from passion, elegance, and love for authentic makeup.',
}

const VALUES = [
  {
    number: '01',
    title: 'Authenticity First',
    body: 'Every product we carry is sourced and verified. We only sell what we believe in — no shortcuts, no compromises.',
  },
  {
    number: '02',
    title: 'Crafted for You',
    body: 'From the packaging to the formula, everything is chosen to elevate your daily ritual and make you feel extraordinary.',
  },
  {
    number: '03',
    title: 'Always Here',
    body: 'We reply on WhatsApp within minutes. Real people, real care — because you deserve more than a chatbot.',
  },
]

export default function OurStoryPage() {
  return (
    <main className="bg-[#FDFAF7] pt-[100px]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">

          {/* Story text */}
          <div>
            <p className="mb-4 text-[10px] font-light uppercase tracking-[0.45em] text-[#C9A882]">
              Our Story
            </p>
            <h1 className="font-display text-[clamp(34px,5vw,60px)] font-light leading-[1.08] tracking-[-0.01em] text-[#1C1917]">
              Born from<br />
              <span className="italic">a love for beauty.</span>
            </h1>
            <div className="mt-8 space-y-5 text-[14px] font-light leading-[1.9] text-[#78716C]">
              <p>
                Besma Sevdam was born from a simple but powerful belief — that every woman
                deserves makeup that is beautiful, authentic, and made for her.
              </p>
              <p>
                I started this brand because I couldn't find what I was looking for:
                products that felt luxurious without being inaccessible, that were honest about
                what they do, and that came with real care and support.
              </p>
              <p>
                So I built it myself. Every product in our collection is hand-selected,
                personally tested, and chosen because it belongs in a beauty ritual —
                not just on a shelf.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-[#1C1917] px-7 py-3 text-[12px] font-light uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#3D3530]"
              >
                Shop the Collection
              </Link>
              <a
                href={whatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-light uppercase tracking-[0.15em] text-[#78716C] underline-offset-4 hover:underline"
              >
                Say Hello
              </a>
            </div>
          </div>

          {/* Founder image */}
          <div className="relative">
            <div
              className="relative overflow-hidden rounded-[28px] bg-[#F0EAE2]"
              style={{ aspectRatio: '4/5' }}
            >
              {/*
                Replace the src below with the actual founder image URL.
                Upload it via Cloudinary or admin panel and paste the URL here.
              */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="h-24 w-24 rounded-full bg-[#E2D8CC]" />
                <p className="text-[11px] font-light tracking-[0.2em] text-[#B8AFA8] uppercase">
                  Founder Portrait
                </p>
              </div>
            </div>

            {/* Floating name badge */}
            <div className="absolute -bottom-5 -right-4 rounded-2xl border border-[#F0EAE0] bg-white px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
              <p className="font-display text-[22px] font-light italic text-[#1C1917]">Besma</p>
              <p className="mt-0.5 text-[9px] font-light uppercase tracking-[0.38em] text-[#C9A882]">
                Founder &amp; Creator
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#EDE5DA]" />
      </div>

      {/* ── Values ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <p className="mb-12 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
          What we stand for
        </p>
        <div className="grid gap-10 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.number}>
              <p className="mb-4 font-display text-[44px] font-light text-[#EDE5DA]">{v.number}</p>
              <h3 className="mb-3 text-[15px] font-normal text-[#1C1917]">{v.title}</h3>
              <p className="text-[13px] font-light leading-[1.85] text-[#78716C]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="bg-[#1C1917] py-20">
        <div className="mx-auto max-w-screen-xl px-5 text-center sm:px-8 lg:px-12">
          <p className="mb-4 text-[10px] font-light uppercase tracking-[0.45em] text-[#C9A882]">
            Ready?
          </p>
          <h2 className="font-display text-[clamp(28px,4vw,48px)] font-light italic text-white">
            Discover your next favourite.
          </h2>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-full border border-[#C9A882] px-8 py-3.5 text-[11px] font-light uppercase tracking-[0.25em] text-[#C9A882] transition-all duration-300 hover:bg-[#C9A882] hover:text-white"
          >
            Browse Collection
          </Link>
        </div>
      </section>

    </main>
  )
}
