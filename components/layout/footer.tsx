'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useTranslation, interpolate } from '@/lib/i18n/context'
import { SOCIAL_LINKS } from '@/lib/config'

export function Footer() {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  const SHOP_LINKS = [
    { label: t.footer.skincare, href: '/products?category=SKINCARE' },
    { label: t.footer.perfumes, href: '/products?category=PERFUMES' },
    { label: t.footer.makeup,   href: '/products?category=MAKEUP' },
    { label: t.footer.hair,     href: '/products?category=HAIRCARE' },
  ]

  const INFO_LINKS = [
    { label: t.footer.about,   href: '/about' },
    { label: t.footer.contact, href: '/contact' },
    { label: t.footer.track,   href: '/track-order' },
    { label: t.footer.returns, href: '/returns' },
  ]

  return (
    <footer id="contact" className="bg-[#1C1917]">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 py-20 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className={`lg:col-span-2 ${isRtl ? 'text-right' : ''}`}>
            <div className="mb-6">
              <p className="font-display text-[30px] font-light italic text-white rtl:not-italic">Store</p>
              <p className="mt-0.5 text-[9px] font-light uppercase text-[#C9A882]" style={{ letterSpacing: '0.4em' }}>
                {t.nav.tagline}
              </p>
            </div>
            <p className={`max-w-[280px] text-[13px] font-light leading-[1.85] text-white/35 ${isRtl ? 'max-w-none' : ''}`}>
              {t.footer.tagline}
            </p>
            {/* Social links */}
            <div className={`mt-7 flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/35 transition-all duration-200 hover:border-white/30 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/35 transition-all duration-200 hover:border-white/30 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>

            {/* Google Maps */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2.5 text-[11px] font-light text-white/40 transition-all duration-200 hover:border-[#C9A882]/40 hover:text-[#C9A882] ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <MapPin size={12} strokeWidth={1.5} className="shrink-0" />
              Find us on Google Maps
            </a>

            <div className={`mt-6 h-px w-12 bg-[#C9A882]/30 ${isRtl ? 'ms-auto' : ''}`} />
          </div>

          {/* Shop */}
          <div className={isRtl ? 'text-right' : ''}>
            <p className="mb-6 text-[9px] font-light uppercase text-[#C9A882]" style={{ letterSpacing: '0.38em' }}>
              {t.footer.shopTitle}
            </p>
            <ul className="space-y-3.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-light text-white/40 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className={isRtl ? 'text-right' : ''}>
            <p className="mb-6 text-[9px] font-light uppercase text-[#C9A882]" style={{ letterSpacing: '0.38em' }}>
              {t.footer.infoTitle}
            </p>
            <ul className="space-y-3.5">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-light text-white/40 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] py-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row rtl:sm:flex-row-reverse">
            <p className="text-[11px] font-light text-white/25">
              {interpolate(t.footer.copyright, { year: new Date().getFullYear() })}
            </p>
            <p className="text-[11px] font-light text-white/25">
              {t.footer.sub}
            </p>
          </div>
          <p className="mt-4 text-center text-[9px] font-light tracking-[0.12em] text-white/12">
            Designed &amp; developed for your brand
          </p>
        </div>
      </div>
    </footer>
  )
}
