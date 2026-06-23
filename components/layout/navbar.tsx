'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { ShoppingBag, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/translations'
import { BrandLogo } from '@/components/ui/brand-logo'

const LOCALE_OPTIONS: { code: Locale; native: string }[] = [
  { code: 'en', native: 'EN' },
  { code: 'fr', native: 'FR' },
  { code: 'ar', native: 'ع'  },
]

const NAV_LEFT  = [
  { label: 'Collection', href: '/products'        },
  { label: 'About',      href: '/about'           },
]
const NAV_RIGHT = [
  { label: 'Our Story',  href: '/about'           },
  { label: 'Contact',    href: '/contact'         },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const cartCount = useCart((s) => s.totalItems())
  const { locale, setLocale, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => { setOpen(false) }, [pathname])

  const closeMenu = useCallback(() => setOpen(false), [])

  return (
    <>
      {/* ── Main nav ─────────────────────────────────────────────────────────── */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_#E2DDD7]'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-screen-xl items-center justify-between px-6 sm:px-10 lg:px-14">

          {/* Left links — desktop */}
          <nav className="hidden flex-1 items-center gap-8 lg:flex" dir={isRtl ? 'rtl' : 'ltr'}>
            {NAV_LEFT.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={cn(
                  'text-[10.5px] font-light uppercase tracking-[0.18em] transition-colors duration-200',
                  pathname === l.href ? 'text-[#C7A98B]' : 'text-[#6B5745] hover:text-[#111111]'
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 transition-opacity hover:opacity-70"
            aria-label="Besma Sevdam — Home"
          >
            <BrandLogo variant="dark" size="md" />
          </Link>

          {/* Right links + icons */}
          <div className="flex flex-1 items-center justify-end gap-8">
            <nav className="hidden items-center gap-8 lg:flex" dir={isRtl ? 'rtl' : 'ltr'}>
              {NAV_RIGHT.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className={cn(
                    'text-[10.5px] font-light uppercase tracking-[0.18em] transition-colors duration-200',
                    pathname === l.href ? 'text-[#C7A98B]' : 'text-[#6B5745] hover:text-[#111111]'
                  )}
                >
                  {l.label}
                </Link>
              ))}

              {/* Language */}
              <div className="flex items-center divide-x divide-[#E2DDD7]">
                {LOCALE_OPTIONS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className={cn(
                      'px-2.5 text-[9.5px] font-light uppercase tracking-[0.1em] transition-colors',
                      locale === l.code ? 'text-[#C7A98B]' : 'text-[#8A8A8A] hover:text-[#111111]'
                    )}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </nav>

            {/* Cart */}
            <Link href="/cart" aria-label="Bag" className="relative text-[#6B5745] transition-colors hover:text-[#111111]">
              <ShoppingBag size={18} strokeWidth={1.25} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -right-1.5 -top-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#C7A98B] text-[7px] font-light text-white"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden text-[#6B5745] transition-colors hover:text-[#111111]"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'x' : 'm'}
                  initial={{ opacity: 0, rotate: -20 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 20 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {open ? <X size={20} strokeWidth={1.25} /> : <Menu size={20} strokeWidth={1.25} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#FDF9F4] lg:hidden"
          >
            {/* Gold thin top line */}
            <div className="h-px bg-[#C7A98B]" />

            <div className="flex flex-1 flex-col justify-between px-8 pb-14 pt-[100px]">
              {/* Brand centered */}
              <div className="mb-10 flex justify-center">
                <BrandLogo variant="dark" size="sm" />
              </div>

              <nav className="flex flex-col items-center gap-1">
                {[...NAV_LEFT, ...NAV_RIGHT].map((l, i) => (
                  <motion.div
                    key={l.href + l.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.06 }}
                    className="w-full"
                  >
                    <Link
                      href={l.href}
                      onClick={closeMenu}
                      className="block w-full border-b border-[#E2DDD7] py-5 text-center font-display text-[32px] font-light italic text-[#111111] transition-colors hover:text-[#C7A98B]"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col items-center gap-5">
                {/* Language */}
                <div className="flex items-center gap-4">
                  {LOCALE_OPTIONS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLocale(l.code); closeMenu() }}
                      className={cn(
                        'text-[10px] font-light uppercase tracking-[0.2em]',
                        locale === l.code ? 'text-[#C7A98B]' : 'text-[#8A8A8A]'
                      )}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className="btn-pill-dark w-full max-w-[280px] text-center"
                >
                  View Bag {cartCount > 0 && `(${cartCount})`}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
