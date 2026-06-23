'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import { ProductCard } from '@/components/products/product-card'
import { DEMO_FEATURED } from '@/lib/demo-products'
import type { Product } from '@/types'

export function BestSellers({ products }: { products: Product[] }) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const display = (products.length > 0 ? products : DEMO_FEATURED).slice(0, 4)

  return (
    <section
      className="bg-[#F7F5F2] px-6 py-24 sm:px-10 sm:py-32 lg:px-14"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Section header */}
      <div className="mb-16 flex items-end justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C7A98B]"
          >
            Curated For You
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="font-display text-[clamp(34px,5vw,64px)] font-light italic leading-[0.95] text-[#111111]"
          >
            Best Sellers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="mt-4 max-w-[340px] text-[13px] font-light leading-[1.8] text-[#8A8A8A]"
          >
            The formulas our clients return to, season after season.
          </motion.p>
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
            className="font-display text-[13px] italic text-[#C7A98B] underline underline-offset-4 decoration-[#C7A98B]/40 transition-all hover:decoration-[#C7A98B]"
          >
            View all →
          </Link>
        </motion.div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-6 sm:gap-x-5 lg:grid-cols-4">
        {display.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* Mobile view all */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center sm:hidden"
      >
        <Link href="/products" className="btn-pill-dark">
          View Full Collection →
        </Link>
      </motion.div>
    </section>
  )
}
