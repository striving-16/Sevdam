'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export function CategoryFilter() {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  const CATS = [
    { label: t.products.allCategories, href: '/products' },
    { label: t.nav.skincare,          href: '/products?category=SKINCARE' },
    { label: t.nav.koreanBeauty,      href: '/products?category=KOREAN_BEAUTY' },
    { label: t.nav.treatments,        href: '/products?category=TREATMENT' },
    { label: t.nav.hairCare,          href: '/products?category=HAIRCARE' },
    { label: t.nav.cosmetics,         href: '/products?category=COSMETICS' },
    { label: t.nav.brands,            href: '/products' },
  ]

  return (
    <section className="border-y border-[#F0EAE0] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">

        <div className={`mb-10 ${isRtl ? 'text-right' : 'text-center'}`}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-light uppercase text-[#78716C]"
            style={{ letterSpacing: isRtl ? 0 : '0.42em' }}
          >
            {t.categories.title}
          </motion.p>
        </div>

        {/* Pill row — scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className={`flex gap-2.5 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center ${isRtl ? 'flex-row-reverse sm:flex-row-reverse' : ''}`}
          style={{ scrollbarWidth: 'none' }}
        >
          {CATS.map((cat, i) => (
            <motion.div
              key={cat.href + cat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <Link
                href={cat.href}
                className="group inline-flex items-center whitespace-nowrap rounded-full border border-[#E8E0D8] bg-white px-5 py-2.5 text-[12px] font-light text-[#78716C] transition-all duration-200 hover:border-[#1C1917] hover:bg-[#1C1917] hover:text-white"
              >
                {cat.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
