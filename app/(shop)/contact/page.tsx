import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { SOCIAL_LINKS, WHATSAPP_NUMBER, whatsAppUrl } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact — Besma Sevdam',
  description: 'Reach us on WhatsApp or follow us on social media. We reply within minutes.',
}

function WhatsAppSVG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

const SOCIALS = [
  {
    label: 'TikTok',
    href: SOCIAL_LINKS.tiktok,
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" /></svg>,
    handle: '@besma.sevdam',
  },
  {
    label: 'Instagram',
    href: SOCIAL_LINKS.instagram,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></svg>,
    handle: '@sevdambeautybs',
  },
  {
    label: 'Snapchat',
    href: SOCIAL_LINKS.snapchat,
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12.166 2C9.315 2 7.037 3.066 5.893 5.01c-.558.95-.765 2.1-.765 3.35 0 .36.028.715.066 1.066l-.014-.002c-.168 0-.39-.027-.65-.086a.88.88 0 0 0-.2-.022c-.44 0-.83.32-.83.73 0 .35.26.66.66.78.072.02.58.18.812.613.12.224.12.48-.02.77-.61 1.257-1.797 2.074-3.12 2.264-.28.04-.48.26-.48.53 0 .26.19.5.46.556.048.01 1.24.27 1.534 1.328.038.136.114.184.25.203.208.028.44.043.688.043.406 0 .852-.05 1.327-.146.637-.13 1.243-.196 1.76-.196.527 0 1.004.082 1.416.245.52.2 1.097.64 1.822.64.687 0 1.26-.415 1.81-.63.42-.162.9-.245 1.43-.245.518 0 1.124.065 1.762.196.474.097.92.147 1.326.147.248 0 .48-.015.688-.043.136-.02.212-.067.25-.203.294-1.058 1.486-1.318 1.534-1.328.27-.056.46-.295.46-.556 0-.27-.2-.49-.48-.53-1.323-.19-2.51-1.007-3.12-2.264-.14-.29-.14-.546-.02-.77.232-.434.74-.593.812-.614.4-.12.66-.43.66-.78 0-.41-.39-.73-.83-.73a.88.88 0 0 0-.2.022c-.26.06-.482.086-.65.086l-.014.002c.038-.35.066-.706.066-1.066 0-1.25-.207-2.4-.765-3.35C14.963 3.066 12.897 2 12.166 2Z" /></svg>,
    handle: '@besme.sevdam',
  },
]

export default function ContactPage() {
  const displayNumber = `+${WHATSAPP_NUMBER.replace(/^(\d{3})(\d{8})$/, '$1 $2')}`

  return (
    <main className="bg-[#FDFAF7] pt-[100px]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="max-w-xl">
          <p className="mb-4 text-[10px] font-light uppercase tracking-[0.45em] text-[#C9A882]">
            We&apos;re here for you
          </p>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-light leading-[1.1] tracking-[-0.01em] text-[#1C1917]">
            Say hello.
          </h1>
          <p className="mt-6 text-[14px] font-light leading-[1.9] text-[#78716C]">
            Have a question about a product, need help with your order, or just want to say hi?
            We&apos;re always a message away.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="mx-auto max-w-screen-xl px-5 pb-28 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Left — WhatsApp + details */}
          <div>
            {/* WhatsApp CTA */}
            <a
              href={whatsAppUrl()}
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

            {/* Contact info */}
            <div className="mt-12 flex items-start gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E0D8] bg-white">
                <MessageCircle size={16} strokeWidth={1.5} className="text-[#C9A882]" />
              </div>
              <div>
                <p className="text-[10px] font-light uppercase tracking-[0.24em] text-[#C9A882]">WhatsApp</p>
                <p className="mt-1 text-[16px] font-light tracking-wide text-[#1C1917]">{displayNumber}</p>
                <p className="mt-0.5 text-[12px] font-light text-[#B8AFA8]">Tap to open WhatsApp — we reply fast</p>
              </div>
            </div>
          </div>

          {/* Right — Social media */}
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-light uppercase tracking-[0.36em] text-[#C9A882]">Follow us</p>

            {SOCIALS.map(({ label, href, icon, handle }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 rounded-2xl border border-[#EDE5DA] bg-white px-6 py-5 transition-all duration-200 hover:border-[#C9A882]/50 hover:shadow-[0_4px_20px_rgba(199,169,139,0.10)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F2EC] text-[#C9A882] transition-colors group-hover:bg-[#C9A882] group-hover:text-white">
                  {icon}
                </div>
                <div>
                  <p className="text-[13px] font-normal text-[#1C1917]">{label}</p>
                  <p className="text-[11px] font-light text-[#B8AFA8]">{handle}</p>
                </div>
                <span className="ml-auto text-[#E0D8D0] transition-colors group-hover:text-[#C9A882]">→</span>
              </a>
            ))}

            {/* Quick links */}
            <div className="mt-2 rounded-2xl border border-[#EDE5DA] p-7">
              <p className="mb-5 text-[10px] font-light uppercase tracking-[0.32em] text-[#C9A882]">Quick links</p>
              <div className="space-y-3">
                {[
                  { label: 'Browse all products',  href: '/products'   },
                  { label: 'Our Story',             href: '/about'      },
                  { label: 'Track my order',        href: '/track-order' },
                  { label: 'Returns & exchanges',   href: '/returns'    },
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
