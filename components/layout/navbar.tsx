'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion'
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/translations'

const LOCALE_OPTIONS: { code: Locale; native: string }[] = [
  { code: 'en', native: 'EN' },
  { code: 'fr', native: 'FR' },
  { code: 'ar', native: 'ع' },
]

const CATEGORIES = [
  { label: 'Skincare',  href: '/categories/skincare' },
  { label: 'Hair Care', href: '/categories/haircare' },
  { label: 'Perfumes',  href: '/categories/perfumes' },
  { label: 'Makeup',    href: '/categories/makeup' },
  { label: 'Body Care', href: '/categories/bodycare' },
  { label: 'Men Care',  href: '/categories/mencare' },
  { label: 'Baby Care', href: '/categories/babycare' },
  { label: 'Tools',     href: '/categories/tools' },
]

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen]       = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const cartCount = useCart((s) => s.totalItems())
  const { locale, setLocale, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  const bgOpacity = useTransform(scrollY, [0, 60], [0, 0.97])
  const navBg = useMotionTemplate`rgba(250, 250, 248, ${bgOpacity})`
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 20))

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); setCatOpen(false) }, [pathname])

  const closeMenu = useCallback(() => setMobileOpen(false), [])

  const NAV_LINKS = [
    { label: 'Home',    href: '/' },
    { label: 'Shop',    href: '/products' },
    { label: 'Offers',  href: '/offers' },
    { label: 'About',   href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        {/* Announcement bar */}
        <div className="h-8 overflow-hidden bg-[#1C1917] flex items-center">
          <div className="animate-ticker">
            {['Free delivery on orders over 2000 MRU', '100% Authentic products', 'WhatsApp ordering available', 'New arrivals weekly'].flatMap((t, i, a) => [
              <span key={`a${i}`} className="inline-flex items-center whitespace-nowrap px-8 text-[9px] font-light uppercase tracking-[0.22em] text-white/50">{t}</span>,
              <span key={`d${i}`} className="text-white/20 text-[9px]">·</span>,
            ])}
          </div>
        </div>

        {/* Main bar */}
        <motion.header
          style={{ backgroundColor: navBg }}
          className={cn(
            'transition-[border-color,backdrop-filter,box-shadow] duration-500',
            scrolled
              ? 'border-b border-[#E8E0D8]/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(28,25,23,0.04)]'
              : 'border-b border-transparent'
          )}
        >
          <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
            <div className="flex h-[58px] items-center justify-between">

              {/* Brand */}
              <Link href="/" className="flex flex-col leading-none flex-shrink-0">
                <span className="font-display text-[18px] font-light italic tracking-wide text-[#1C1917] hover:opacity-60 transition-opacity duration-300">
                  Dreamshop
                </span>
                <span className="text-[6.5px] font-light uppercase text-[#C9A882]" style={{ letterSpacing: '0.42em' }}>
                  Beauty & Care
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative py-1 text-[11.5px] font-light transition-colors duration-200',
                      pathname === link.href ? 'text-[#1C1917]' : 'text-[#78716C] hover:text-[#1C1917]'
                    )}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-[#C9A882]" />
                    )}
                  </Link>
                ))}

                {/* Categories dropdown */}
                <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                  <button className={cn(
                    'flex items-center gap-1 py-1 text-[11.5px] font-light transition-colors duration-200',
                    pathname.startsWith('/categories') ? 'text-[#1C1917]' : 'text-[#78716C] hover:text-[#1C1917]'
                  )}>
                    Categories
                    <ChevronDown size={11} strokeWidth={1.5} className={cn('transition-transform duration-200', catOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {catOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 overflow-hidden rounded-xl border border-[#E8E0D8] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
                      >
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            className="flex items-center px-4 py-2.5 text-[12px] font-light text-[#1C1917] transition-colors hover:bg-[#F5F0EB]"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* Right */}
              <div className="flex items-center gap-0.5">
                {/* Language */}
                <div className="hidden items-center gap-0.5 lg:flex mr-1">
                  {LOCALE_OPTIONS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className={cn(
                        'px-2 py-1 text-[10px] font-light transition-colors',
                        locale === l.code ? 'text-[#1C1917]' : 'text-[#B8AFA8] hover:text-[#78716C]'
                      )}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>

                <Link href="/products" aria-label="Search" className="rounded-lg p-2.5 text-[#78716C] transition-all hover:bg-[#F5F0EB] hover:text-[#1C1917]">
                  <Search size={16} strokeWidth={1.5} />
                </Link>

                <Link href="/cart" aria-label="Cart" className="relative rounded-lg p-2.5 text-[#78716C] transition-all hover:bg-[#F5F0EB] hover:text-[#1C1917]">
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                        className="absolute right-[5px] top-[5px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#C9A882] text-[8px] font-medium text-white"
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* Hamburger */}
                <button
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  className="lg:hidden ms-1 rounded-lg p-2.5 text-[#78716C] transition-all hover:bg-[#F5F0EB]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={mobileOpen ? 'x' : 'menu'}
                      initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                      transition={{ duration: 0.18 }}
                      className="block"
                    >
                      {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#FAFAF8] overflow-y-auto lg:hidden"
          >
            <div className="flex flex-1 flex-col px-6 pt-[110px] pb-10">
              <nav className="flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.26, delay: 0.04 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center justify-between border-b border-[#F0EAE0] py-4 font-display text-[20px] font-light text-[#1C1917] transition-colors hover:text-[#C9A882]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Categories in mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, delay: 0.26 }}
                >
                  <p className="border-b border-[#F0EAE0] py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-[#C9A882]">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1 py-3">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={closeMenu}
                        className="rounded-lg px-3 py-2.5 text-[13px] font-light text-[#1C1917] hover:bg-[#F5F0EB] transition-colors"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </nav>

              {/* Language */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
                className="mt-6 flex items-center gap-1 border-t border-[#E8E0D8] pt-5"
              >
                <p className="me-3 text-[9px] font-light uppercase tracking-[0.3em] text-[#78716C]">Language</p>
                {LOCALE_OPTIONS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLocale(l.code); closeMenu() }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[11px] font-light transition-all',
                      locale === l.code ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'
                    )}
                  >
                    {l.native}
                  </button>
                ))}
              </motion.div>

              {/* Cart CTA */}
              <motion.div
                className="mt-auto pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.48 }}
              >
                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1917] py-4 text-[11px] font-light uppercase tracking-[0.15em] text-white"
                >
                  <ShoppingBag size={13} strokeWidth={1.5} />
                  View Bag {cartCount > 0 && `(${cartCount})`}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
