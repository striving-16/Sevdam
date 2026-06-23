'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { DEMO_FEATURED } from '@/lib/demo-products'
import type { Product } from '@/types'

export function BestSellers({ products }: { products: Product[] }) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const display = (products.length > 0 ? products : DEMO_FEATURED).slice(0, 4)

  return (
    <section
      className="bg-[#FDF9F4] px-6 py-24 sm:px-10 sm:py-32 lg:px-14"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Section header */}
      <div className="mb-16 flex items-end justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C9A96E]"
          >
            Curated For You
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="font-display text-[clamp(34px,5vw,64px)] font-light italic leading-[0.95] text-[#1A1714]"
          >
            Best Sellers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="mt-4 max-w-[340px] text-[13px] font-light leading-[1.8] text-[#9E8E80]"
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
            className="font-display text-[13px] italic text-[#C9A96E] underline underline-offset-4 decoration-[#C9A96E]/40 transition-all hover:decoration-[#C9A96E]"
          >
            View all →
          </Link>
        </motion.div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {display.map((product, i) => (
          <EditorialCard key={product.id} product={product} index={i} />
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
        <Link href="/products" className="btn-pill-outline">
          View Full Collection
        </Link>
      </motion.div>
    </section>
  )
}

/* ── Editorial product card ────────────────────────────────────────────────── */
function EditorialCard({ product, index }: { product: Product; index: number }) {
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)
  const { locale } = useTranslation()
  const isAr = locale === 'ar'
  const soldOut = product.stock === 0
  const name = (isAr && product.name_ar) ? product.name_ar : product.name_en

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product)
    toast.success(name, { description: 'Added to your bag' })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div
          className="grain relative overflow-hidden bg-[#F2EBE2]"
          style={{ aspectRatio: '3/4' }}
        >
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />

          {/* Bestseller badge */}
          {product.isBestseller && (
            <div className="absolute left-3 top-3 z-10">
              <span
                className="block rounded-full bg-white/80 px-2.5 py-1 text-[8px] font-light uppercase backdrop-blur-sm"
                style={{ letterSpacing: '0.18em', color: '#C9A96E' }}
              >
                Bestseller
              </span>
            </div>
          )}

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
              <span className="text-[9px] font-light uppercase tracking-[0.3em] text-[#9E8E80]">
                Sold Out
              </span>
            </div>
          )}

          {/* Add to bag — slide up on hover */}
          {!soldOut && (
            <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full pb-5 text-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mx-4 bg-white/90 py-3 backdrop-blur-sm">
                <button
                  onClick={handleAdd}
                  className="text-[9.5px] font-light uppercase tracking-[0.22em] text-[#1A1714] transition-colors hover:text-[#C9A96E]"
                >
                  {added ? '✓ Added to Bag' : 'Add to Bag'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Card info */}
      <div className="mt-4 space-y-1" dir={isAr ? 'rtl' : 'ltr'}>
        <p className="text-[8.5px] font-light uppercase tracking-[0.28em] text-[#C9A96E]">
          Besma Sevdam
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-[clamp(14px,1.5vw,18px)] font-light italic leading-[1.3] text-[#1A1714] transition-colors hover:text-[#C9A96E]">
            {name}
          </h3>
        </Link>
        <p className="text-[11px] font-light text-[#B8AFA8]">
          {product.description_en.slice(0, 55).trimEnd()}…
        </p>
        <p className="font-display text-[clamp(13px,1.4vw,16px)] font-light italic text-[#9E8E80]">
          {formatPrice(product.price)}
        </p>

        {/* Mobile add button */}
        {!soldOut && (
          <button
            onClick={handleAdd}
            className="mt-2 block text-[9px] font-light uppercase tracking-[0.22em] text-[#C9A96E] underline underline-offset-3 decoration-[#C9A96E]/40 transition-all hover:decoration-[#C9A96E] lg:hidden"
          >
            {added ? '✓ Added' : '+ Add to Bag'}
          </button>
        )}
      </div>
    </motion.article>
  )
}
