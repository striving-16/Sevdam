'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { DEMO_NEW_ARRIVALS } from '@/lib/demo-products'
import type { Product, Variant } from '@/types'

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
          Just Arrived
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7 }}
          className="font-display text-[clamp(34px,5vw,64px)] font-light italic leading-[0.95] text-[#111111]"
        >
          New Arrivals
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.6 }}
          className="mx-auto mt-4 max-w-[380px] text-[13px] font-light leading-[1.8] text-[#8A8A8A]"
        >
          The latest additions to our collection — luxury beauty innovations worth discovering.
        </motion.p>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {display.map((product, i) => (
            <ArrivalCard key={product.id} product={product} index={i} />
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
        <Link href="/products" className="btn-pill-outline">
          See All New Arrivals
        </Link>
        <p className="text-[11px] font-light text-[#C7A98B]">
          New collections dropping every month
        </p>
      </motion.div>
    </section>
  )
}

/* ── New Arrival card ────────────────────────────────────────────────────── */
function ArrivalCard({ product, index }: { product: Product; index: number }) {
  const addItem    = useCart((s) => s.addItem)
  const { locale } = useTranslation()
  const isAr       = locale === 'ar'
  const name       = (isAr && product.name_ar) ? product.name_ar : product.name_en

  const hasVariants  = product.hasVariants && product.variants.length > 0
  const firstVariant = hasVariants ? product.variants[0] : null

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

  const categoryLabel =
    product.category === 'SKINCARE' ? 'Skincare'
    : product.category === 'TOOLS' ? 'Beauty Tools'
    : 'Makeup'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="grain relative overflow-hidden"
          style={{
            aspectRatio: '2/3',
            background: 'radial-gradient(ellipse 80% 70% at 50% 38%, #F2EBE1 0%, #E8E0D4 55%, #DDD5C8 100%)',
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

          {/* NEW badge */}
          <div className="absolute right-3 top-3 z-10">
            <span
              className="block rounded-full bg-[#111111]/80 px-2.5 py-1 text-[8px] font-light uppercase text-white backdrop-blur-sm"
              style={{ letterSpacing: '0.18em' }}
            >
              New
            </span>
          </div>

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
        <div className="mt-3 flex items-center gap-1.5">
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

      {/* Info */}
      <div className="mt-3 space-y-1" dir={isAr ? 'rtl' : 'ltr'}>
        <p className="text-[8px] font-light uppercase tracking-[0.32em] text-[#C7A98B]">
          {categoryLabel}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-[clamp(14px,1.5vw,18px)] font-light italic leading-[1.25] text-[#111111] transition-colors hover:text-[#C7A98B]">
            {name}
          </h3>
        </Link>
        {hasVariants && selected && (
          <p className="text-[9.5px] font-light tracking-[0.08em] text-[#8A8A8A]">{selected.shadeName}</p>
        )}

        {/* Price — prominent, luxury */}
        <p className="pt-1 text-[16px] font-light tracking-[0.02em] text-[#111111]">
          {formatPrice(product.price)}
        </p>

        {!soldOut && (
          <button
            onClick={handleAdd}
            className="mt-2 w-full rounded-full border border-[#111111] py-2.5 text-[9px] font-light uppercase tracking-[0.22em] text-[#111111] transition-all hover:bg-[#111111] hover:text-white lg:hidden"
          >
            {added ? '✓ Added' : 'Add to Bag'}
          </button>
        )}
      </div>
    </motion.article>
  )
}
