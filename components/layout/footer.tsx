'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import { SOCIAL_LINKS } from '@/lib/config'
import { BrandLogo } from '@/components/ui/brand-logo'

/*
  FOOTER — warm, elegant, brand-centered.
  Not a typical ecommerce footer.
  Centered brand statement + minimal columns.
*/

export function Footer() {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'

  return (
    <footer className="bg-[#111111]" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Thin gold top accent */}
      <div
        className="h-px"
        style={{ background: 'linear-gradient(to right, transparent, #C7A98B 40%, #C7A98B 60%, transparent)' }}
      />

      {/* Main footer content */}
      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 lg:px-14">

        {/* Brand statement — centered hero of the footer */}
        <div className="border-b border-white/[0.06] py-16 text-center">
          {/* Official logo — light variant on dark footer */}
          <div className="flex justify-center">
            <BrandLogo variant="light" size="lg" />
          </div>
          <p className="mx-auto mt-8 max-w-[360px] text-[13px] font-light leading-[1.9] text-white/30">
            Where confidence meets elegance. Every product crafted to make you
            feel extraordinary.
          </p>

          {/* Social icons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {[
              { href: SOCIAL_LINKS.tiktok,   label: 'TikTok',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" /></svg>
              },
              { href: SOCIAL_LINKS.facebook, label: 'Facebook',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              },
              { href: '#', label: 'Instagram',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/30 transition-all duration-300 hover:border-[#C7A98B]/50 hover:text-[#C7A98B]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links row */}
        <div className="py-10">
          <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {[
              { label: 'Collection',  href: '/products'      },
              { label: 'Skincare',    href: '/categories/skincare' },
              { label: 'Makeup',      href: '/categories/makeup'   },
              { label: 'About Us',    href: '/about'         },
              { label: 'Our Story',   href: '/about'         },
              { label: 'Contact',     href: '/contact'       },
              { label: 'Track Order', href: '/track-order'   },
              { label: 'Returns',     href: '/returns'       },
            ].map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="text-[11px] font-light uppercase tracking-[0.15em] text-white/30 transition-colors hover:text-white/70"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.05] pb-8 pt-6 sm:flex-row">
          <p className="text-[10.5px] font-light text-white/20">
            © {new Date().getFullYear()} Besma Sevdam. All rights reserved.
          </p>
          <p className="text-[10.5px] font-light text-white/20">
            Crafted for Elegance
          </p>
        </div>
      </div>

    </footer>
  )
}
