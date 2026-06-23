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
import type { Product, Variant } from '@/types'

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
        <Link href="/products" className="btn-pill-dark">
          View Full Collection →
        </Link>
      </motion.div>
    </section>
  )
}

/* ── Editorial product card ────────────────────────────────────────────────── */
function EditorialCard({ product, index }: { product: Product; index: number }) {
  const addItem  = useCart((s) => s.addItem)
  const { locale } = useTranslation()
  const isAr     = locale === 'ar'
  const name     = (isAr && product.name_ar) ? product.name_ar : product.name_en

  const hasVariants   = product.hasVariants && product.variants.length > 0
  const firstVariant  = hasVariants ? product.variants[0] : null

  const [selected, setSelected] = useState<Variant | null>(firstVariant)
  const [added,    setAdded]    = useState(false)

  const displayImage = (selected?.image ?? null) || product.imageUrl
  const stock        = selected ? selected.stock : product.stock
  const soldOut      = stock === 0

  function handleShadeClick(e: React.MouseEvent, v: Variant) {
    e.preventDefault()
    e.stopPropagation()
    setSelected(v)
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product, selected, 1)
    const shade = selected ? ` — ${selected.shadeName}` : ''
    toast.success(`${name}${shade}`, { description: 'Added to your bag' })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex h-full flex-col"
    >
      <Link href={`/products/${product.slug}`} className="block flex-shrink-0">
        {/* Image container */}
        <div
          className="grain relative overflow-hidden"
          style={{
            aspectRatio: '3/4',
            background: 'radial-gradient(ellipse 80% 70% at 50% 40%, #F0EAE0 0%, #E8E0D4 55%, #DDD5C8 100%)',
          }}
        >
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />

          {product.isBestseller && !soldOut && (
            <div className="absolute left-3 top-3 z-10">
              <span
                className="block rounded-full bg-white/80 px-2.5 py-1 text-[8px] font-light uppercase backdrop-blur-sm"
                style={{ letterSpacing: '0.18em', color: '#C7A98B' }}
              >
                Bestseller
              </span>
            </div>
          )}

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
              <span className="text-[9px] font-light uppercase tracking-[0.3em] text-[#8A8A8A]">
                Sold Out
              </span>
            </div>
          )}

          {!soldOut && (
            <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full transition-all duration-500 group-hover:translate-y-0">
              <button
                onClick={handleAdd}
                className="w-full bg-[#111111]/90 py-3.5 text-[9px] font-light uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-colors hover:bg-[#111111]"
              >
                {added ? '✓ Added' : 'Add to Bag'}
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Shade circles */}
      {hasVariants && (
        <div className="mt-3 flex flex-shrink-0 items-center gap-1.5">
          {product.variants.slice(0, 8).map((v) => (
            <button
              key={v.id}
              title={v.shadeName}
              onClick={(e) => handleShadeClick(e, v)}
              className="relative flex-shrink-0 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none"
              style={{
                width: 14,
                height: 14,
                backgroundColor: v.hexColor,
                boxShadow:
                  selected?.id === v.id
                    ? `0 0 0 1.5px white, 0 0 0 3px ${v.hexColor}`
                    : '0 0 0 0.5px rgba(0,0,0,0.12)',
              }}
              aria-label={v.shadeName}
              aria-pressed={selected?.id === v.id}
            />
          ))}
          {product.variants.length > 8 && (
            <Link
              href={`/products/${product.slug}`}
              className="text-[9px] font-light text-[#8A8A8A] hover:text-[#C7A98B]"
            >
              +{product.variants.length - 8}
            </Link>
          )}
        </div>
      )}

      {/* Card info — stretches to fill remaining height */}
      <div className="mt-3 flex flex-1 flex-col" dir={isAr ? 'rtl' : 'ltr'}>
        <div>
          <p className="text-[8px] font-light uppercase tracking-[0.32em] text-[#C7A98B]">
            Besma Sevdam Beauty
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 font-display text-[clamp(15px,1.5vw,19px)] font-light italic leading-[1.25] text-[#111111] transition-colors hover:text-[#C7A98B]">
              {name}
            </h3>
          </Link>
          {hasVariants && selected && (
            <p className="mt-1 text-[9.5px] font-light tracking-[0.08em] text-[#8A8A8A]">{selected.shadeName}</p>
          )}
        </div>

        {/* Price + quick-add — pinned to card bottom */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="text-[16px] font-medium tracking-[0.02em] text-[#111111]">
            {formatPrice(product.price)}
          </p>
          {!soldOut && (
            <button
              onClick={handleAdd}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#111111] text-white transition-colors hover:bg-[#333333]"
              aria-label="Add to bag"
            >
              <span className="text-[16px] font-light leading-none">+</span>
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
