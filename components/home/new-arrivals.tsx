'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import { ProductCard } from '@/components/products/product-card'
import { DEMO_NEW_ARRIVALS } from '@/lib/demo-products'
import type { Product } from '@/types'

interface Props {
  products?: Product[]
}

export function NewArrivals({ products }: Props) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const display = (products && products.length > 0 ? products : DEMO_NEW_ARRIVALS).slice(0, 4)

  return (
    <section
      className="bg-[#E7E1DA] px-6 py-24 sm:px-10 sm:py-32 lg:px-14"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C7A98B]"
        >
          Fresh Picks
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7 }}
          className="font-display text-[clamp(34px,5vw,64px)] font-light italic leading-[0.95] text-[#111111]"
        >
          New Drops
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.6 }}
          className="mx-auto mt-4 max-w-[380px] text-[13px] font-light leading-[1.8] text-[#8A8A8A]"
        >
          The latest additions to the Besma Sevdam collection.
        </motion.p>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-2 items-start gap-4 lg:grid-cols-4 lg:gap-5">
          {display.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} mode="editorial" />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-14 flex flex-col items-center gap-4 text-center"
      >
        <Link href="/products" className="btn-pill-dark">
          See All Products →
        </Link>
      </motion.div>
    </section>
  )
}
