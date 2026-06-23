'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import { SOCIAL_LINKS, whatsAppUrl } from '@/lib/config'
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
          <div className="mt-8 flex items-center justify-center gap-3">
            {[
              {
                href: SOCIAL_LINKS.tiktok, label: 'TikTok',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" /></svg>,
              },
              {
                href: SOCIAL_LINKS.instagram, label: 'Instagram',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></svg>,
              },
              {
                href: SOCIAL_LINKS.snapchat, label: 'Snapchat',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M12.166 2C9.315 2 7.037 3.066 5.893 5.01c-.558.95-.765 2.1-.765 3.35 0 .36.028.715.066 1.066l-.014-.002c-.168 0-.39-.027-.65-.086a.88.88 0 0 0-.2-.022c-.44 0-.83.32-.83.73 0 .35.26.66.66.78.072.02.58.18.812.613.12.224.12.48-.02.77-.61 1.257-1.797 2.074-3.12 2.264-.28.04-.48.26-.48.53 0 .26.19.5.46.556.048.01 1.24.27 1.534 1.328.038.136.114.184.25.203.208.028.44.043.688.043.406 0 .852-.05 1.327-.146.637-.13 1.243-.196 1.76-.196.527 0 1.004.082 1.416.245.52.2 1.097.64 1.822.64.687 0 1.26-.415 1.81-.63.42-.162.9-.245 1.43-.245.518 0 1.124.065 1.762.196.474.097.92.147 1.326.147.248 0 .48-.015.688-.043.136-.02.212-.067.25-.203.294-1.058 1.486-1.318 1.534-1.328.27-.056.46-.295.46-.556 0-.27-.2-.49-.48-.53-1.323-.19-2.51-1.007-3.12-2.264-.14-.29-.14-.546-.02-.77.232-.434.74-.593.812-.614.4-.12.66-.43.66-.78 0-.41-.39-.73-.83-.73a.88.88 0 0 0-.2.022c-.26.06-.482.086-.65.086l-.014.002c.038-.35.066-.706.066-1.066 0-1.25-.207-2.4-.765-3.35C14.963 3.066 12.897 2 12.166 2Z" /></svg>,
              },
              {
                href: whatsAppUrl(), label: 'WhatsApp',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>,
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
