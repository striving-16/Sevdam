'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import { formatPrice } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/validations'
import type { Product, Variant } from '@/types'

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product
  index?: number
}) {
  const addItem          = useCart((s) => s.addItem)
  const { locale }       = useTranslation()
  const isAr             = locale === 'ar'
  const name             = (isAr && product.name_ar) ? product.name_ar : product.name_en
  const categoryLabel    = CATEGORY_LABELS[product.category] ?? product.category

  const hasVariants  = product.hasVariants && product.variants.length > 0
  const firstVariant = hasVariants ? product.variants[0] : null
  const [selected, setSelected] = useState<Variant | null>(firstVariant)
  const [added, setAdded]       = useState(false)

  const displayImage = (selected?.image ?? null) || product.imageUrl
  const stock        = selected ? selected.stock : product.stock
  const soldOut      = stock === 0

  function handleShadeClick(e: React.MouseEvent, variant: Variant) {
    e.preventDefault()
    e.stopPropagation()
    setSelected(variant)
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-[#F7F5F2] shadow-[0_2px_12px_rgba(0,0,0,0.04),0_8px_40px_rgba(0,0,0,0.07)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_60px_rgba(0,0,0,0.11)]"
    >
      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block flex-shrink-0 overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
        tabIndex={-1}
        aria-label={name}
      >
        {/*
          mix-blend-multiply erases the white product background on our cream
          card. scale-[1.08] by default trims excess white padding in the photo.
        */}
        <Image
          src={displayImage}
          alt={name}
          fill
          className="scale-[1.08] object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.13]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />

        {/* Bestseller badge */}
        {product.isBestseller && !soldOut && (
          <div className="absolute left-3.5 top-3.5 z-10">
            <span
              className="block rounded-full bg-white/80 px-2.5 py-1 text-[7.5px] font-light uppercase backdrop-blur-sm"
              style={{ letterSpacing: '0.22em', color: '#C7A98B' }}
            >
              Bestseller
            </span>
          </div>
        )}

        {/* New badge */}
        {product.isOffer && !soldOut && !product.isBestseller && (
          <div className="absolute right-3.5 top-3.5 z-10">
            <span
              className="block rounded-full bg-[#111111]/80 px-2.5 py-1 text-[7.5px] font-light uppercase text-white backdrop-blur-sm"
              style={{ letterSpacing: '0.18em' }}
            >
              Offer
            </span>
          </div>
        )}

        {/* Sold out overlay */}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <span className="text-[9px] font-light uppercase tracking-[0.32em] text-[#9A9A9A]">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* ── Card body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-4 pb-5 pt-4" dir={isAr ? 'rtl' : 'ltr'}>

        {/* Shade swatches */}
        {hasVariants && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {product.variants.slice(0, 7).map((v) => (
              <button
                key={v.id}
                type="button"
                title={v.shadeName}
                onClick={(e) => handleShadeClick(e, v)}
                aria-label={v.shadeName}
                aria-pressed={selected?.id === v.id}
                className="flex-shrink-0 rounded-full focus:outline-none"
                style={{
                  width:           20,
                  height:          20,
                  backgroundColor: v.hexColor,
                  boxShadow: selected?.id === v.id
                    ? `0 0 0 2px #F7F5F2, 0 0 0 3.5px ${v.hexColor}`
                    : '0 0 0 0.5px rgba(0,0,0,0.15)',
                  transform:   selected?.id === v.id ? 'scale(1.15)' : 'scale(1)',
                  transition:  'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              />
            ))}
            {product.variants.length > 7 && (
              <span className="text-[9px] font-light text-[#9E8E80]">
                +{product.variants.length - 7}
              </span>
            )}
          </div>
        )}

        {/* Category label */}
        <p className="text-[7.5px] font-light uppercase tracking-[0.42em] text-[#C7A98B]">
          {categoryLabel}
        </p>

        {/* Product name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1.5 line-clamp-2 font-display text-[clamp(14px,1.4vw,18px)] font-light italic leading-[1.25] text-[#111111] transition-colors duration-200 hover:text-[#C7A98B]">
            {name}
          </h3>
        </Link>

        {/* Selected shade name */}
        {hasVariants && selected && (
          <p className="mt-1 text-[9.5px] font-light tracking-[0.04em] text-[#9A9A9A]">
            {selected.shadeName}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <p className="mt-3 text-[clamp(17px,1.6vw,21px)] font-semibold leading-none tracking-[0.01em] text-[#111111]">
          {formatPrice(product.price)}
        </p>

        {/* Add to Bag — full width */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={[
            'mt-3 w-full rounded-[14px] py-2.5 text-[9px] font-light uppercase tracking-[0.3em] transition-all duration-300 active:scale-[0.98]',
            soldOut
              ? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
              : added
              ? 'bg-[#111111] text-white'
              : 'bg-[#C7A98B] text-white hover:bg-[#B8967A]',
          ].join(' ')}
        >
          {soldOut ? 'Sold Out' : added ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
      </div>
    </motion.article>
  )
}
