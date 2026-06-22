'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { useTranslation } from '@/lib/i18n/context'
import type { Product } from '@/types'

export function FeaturedProducts({ products }: { products: Product[] }) {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  if (products.length === 0) return null

  return (
    <section className="bg-[#FAFAF8] py-24 sm:py-32">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">

        <div className="mb-14 flex items-end justify-between rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2 text-[10px] font-light uppercase text-[#78716C]"
              style={{ letterSpacing: isRtl ? 0 : '0.4em' }}
            >
              {t.featured.eyebrow}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display text-[clamp(28px,3.5vw,48px)] font-light text-[#1C1917]"
            >
              {t.featured.title}
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-[12px] font-light text-[#78716C] transition-colors hover:text-[#1C1917]"
            >
              {t.featured.viewAll}
              <ArrowRight size={12} className={`transition-transform group-hover:translate-x-0.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center sm:hidden"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border border-[#E8E0D8] px-8 py-3.5 text-[11px] font-light uppercase text-[#78716C] transition-all hover:border-[#C9A882] hover:text-[#1C1917]"
            style={{ letterSpacing: isRtl ? 0 : '0.1em' }}
          >
            {t.featured.viewAll}
            <ArrowRight size={11} className={`group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
