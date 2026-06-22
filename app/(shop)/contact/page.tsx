import Link from 'next/link'
import { MapPin, Clock, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch — we reply on WhatsApp within minutes.',
}

function WhatsAppSVG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

const CONTACT_DETAILS = [
  {
    Icon: MessageCircle,
    label: 'WhatsApp',
    value: '[Your WhatsApp number]',
    sub: 'Fastest way to reach us — we reply within minutes',
  },
  {
    Icon: MapPin,
    label: 'Location',
    value: '[Your location]',
    sub: 'Find us on Google Maps',
  },
  {
    Icon: Clock,
    label: 'Hours',
    value: '[Opening hours]',
    sub: 'Orders via WhatsApp anytime',
  },
]

export default function ContactPage() {
  return (
    <main className="bg-white pt-[100px]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="max-w-xl">
          <p className="mb-4 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
            We&apos;re here for you
          </p>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-light leading-[1.1] tracking-[-0.01em] text-[#1C1917]">
            Say hello.
          </h1>
          <p className="mt-6 text-[14px] font-light leading-[1.9] text-[#78716C]">
            Have a question about a product, need help with your order, or just want to say hi?
            We&apos;re always a message away on WhatsApp.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="mx-auto max-w-screen-xl px-5 pb-24 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">

          {/* WhatsApp CTA */}
          <div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-center gap-3.5 rounded-2xl py-6 text-[14px] font-light text-white transition-all duration-300 hover:brightness-105 active:scale-[0.99]"
              style={{ backgroundColor: '#25D366', boxShadow: '0 4px 32px rgba(37,211,102,0.25)' }}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                <WhatsAppSVG size={22} />
              </span>
              Chat with us on WhatsApp
            </a>

            <p className="mt-4 text-center text-[11px] font-light text-[#B8AFA8]">
              Average response time: under 5 minutes
            </p>

            {/* Contact details */}
            <div className="mt-12 space-y-8">
              {CONTACT_DETAILS.map(({ Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E0D8] bg-[#FAFAF8]">
                    <Icon size={16} strokeWidth={1.5} className="text-[#C9A882]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-light uppercase tracking-[0.24em] text-[#C9A882]">{label}</p>
                    <p className="mt-1 text-[15px] font-light text-[#1C1917]">{value}</p>
                    <p className="mt-0.5 text-[12px] font-light text-[#B8AFA8]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map + social */}
          <div className="flex flex-col gap-8">
            {/* Google Maps embed card */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F0] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              style={{ aspectRatio: '16/9' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
                  <MapPin size={22} strokeWidth={1.5} className="text-[#C9A882]" />
                </div>
                <p className="text-[13px] font-light text-[#1C1917]">View on Google Maps</p>
                <p className="text-[11px] font-light text-[#B8AFA8]">Tap to open in Maps</p>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#E8E0D8] transition-all duration-300 group-hover:ring-[#C9A882]/40" />
            </a>

            {/* Quick links */}
            <div className="rounded-2xl border border-[#F0EAE0] p-7">
              <p className="mb-5 text-[10px] font-light uppercase tracking-[0.32em] text-[#C9A882]">Quick links</p>
              <div className="space-y-3">
                {[
                  { label: 'Track my order', href: '/track-order' },
                  { label: 'Returns & exchanges', href: '/returns' },
                  { label: 'Browse all products', href: '/products' },
                  { label: 'About Us', href: '/about' },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between py-2 text-[13px] font-light text-[#1C1917] transition-colors hover:text-[#C9A882]"
                  >
                    {label}
                    <span className="text-[#E8E0D8]">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
