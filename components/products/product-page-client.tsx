'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { ProductWhatsAppButton } from '@/components/products/product-whatsapp-button'
import { formatPrice } from '@/lib/utils'
import type { Product, Variant } from '@/types'

interface Props {
  product:       Product
  allImages:     string[]
  name:          string
  description:   string
  categoryLabel: string
  isRtl:        boolean
}

export function ProductPageClient({
  product, allImages, name, description,
  categoryLabel, isRtl,
}: Props) {
  const hasVariants   = product.hasVariants && product.variants.length > 0
  const firstVariant  = hasVariants ? product.variants[0] : null

  const [activeImage,    setActiveImage]    = useState(allImages[0] ?? product.imageUrl)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(firstVariant)

  function selectVariant(v: Variant) {
    setSelectedVariant(v)
    if (v.image) setActiveImage(v.image)
  }

  const stockCount = selectedVariant ? selectedVariant.stock : product.stock
  const soldOut    = stockCount === 0

  return (
    <>
      {/* ── Hero grid: gallery + info ─────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl px-0 pt-6 sm:px-0 lg:grid lg:grid-cols-[1fr_480px] lg:min-h-[85vh]">

        {/* ── LEFT: Gallery ─────────────────────────────────────────────────── */}
        <div className={`relative ${isRtl ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="sticky top-[100px]">

            {/* Main image */}
            <div className="relative overflow-hidden bg-[#F5F0EA]" style={{ aspectRatio: '4/5' }}>
              <div className="grain absolute inset-0 z-10 pointer-events-none" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              {product.isBestseller && (
                <span
                  className="absolute left-5 top-5 z-20 rounded-full bg-white/85 px-3.5 py-1.5 text-[8.5px] font-light uppercase backdrop-blur-sm"
                  style={{ letterSpacing: '0.2em', color: '#C9A96E' }}
                >
                  Bestseller
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6" style={{ scrollbarWidth: 'none' }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={[
                      'relative flex-shrink-0 overflow-hidden transition-all duration-200',
                      activeImage === img
                        ? 'ring-1 ring-[#C9A96E] ring-offset-1'
                        : 'opacity-50 hover:opacity-80',
                    ].join(' ')}
                    style={{ width: 64, height: 80 }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Product info ────────────────────────────────────────────── */}
        <div
          className={`flex flex-col border-[#EDE5DA] px-6 py-10 sm:px-10 lg:border-s lg:px-12 lg:py-14 ${isRtl ? 'lg:order-1 text-right' : 'lg:order-2'}`}
        >
          {/* Category */}
          <p
            className="mb-2 text-[8px] font-light uppercase text-[#C9A96E]"
            style={{ letterSpacing: '0.45em' }}
          >
            {categoryLabel}
          </p>

          {/* Name */}
          <h1 className="font-display text-[clamp(26px,3.5vw,44px)] font-light italic leading-[1.1] text-[#1A1714]">
            {name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-[32px] font-light italic text-[#1A1714]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Gold hairline */}
          <div className="my-6 h-px bg-gradient-to-r from-[#C9A96E]/20 via-[#C9A96E] to-[#C9A96E]/20" />

          {/* Description */}
          <p className="text-[13.5px] font-light leading-[1.95] text-[#6B5745]">
            {description}
          </p>

          {/* ── Shade Selector ─────────────────────────────────────────────── */}
          {hasVariants && (
            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-light uppercase tracking-[0.3em] text-[#1A1714]">
                  Shade
                </span>
                <AnimatePresence mode="wait">
                  {selectedVariant && (
                    <motion.span
                      key={selectedVariant.id}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-light italic text-[#C9A96E]"
                    >
                      — {selectedVariant.shadeName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Colour circles */}
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id
                  const outOfStock = v.stock === 0
                  return (
                    <button
                      key={v.id}
                      onClick={() => selectVariant(v)}
                      title={v.shadeName}
                      disabled={outOfStock}
                      aria-label={v.shadeName}
                      aria-pressed={isSelected}
                      className={[
                        'relative flex-shrink-0 rounded-full transition-all duration-200 focus:outline-none',
                        outOfStock ? 'opacity-35 cursor-not-allowed' : 'hover:scale-110',
                      ].join(' ')}
                      style={{
                        width: 26,
                        height: 26,
                        backgroundColor: v.hexColor,
                        boxShadow: isSelected
                          ? `0 0 0 2px white, 0 0 0 3.5px ${v.hexColor}`
                          : '0 0 0 0.75px rgba(0,0,0,0.15)',
                      }}
                    >
                      {outOfStock && (
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.5) 4px, rgba(255,255,255,0.5) 5px)',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Out of stock warning for selected */}
              {selectedVariant?.stock === 0 && (
                <p className="mt-2 text-[11px] font-light italic text-[#9E8E80]">
                  This shade is currently out of stock
                </p>
              )}
            </div>
          )}

          {/* Stock hint */}
          {!soldOut && stockCount <= 5 && (
            <p className="mt-4 text-[11px] font-light italic text-[#C9A96E]">
              Only {stockCount} remaining
            </p>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className={`mt-5 flex flex-wrap gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#EDE5DA] bg-[#FDF9F4] px-3 py-1 text-[9px] font-light uppercase tracking-[0.12em] text-[#9E8E80]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Gold hairline */}
          <div className="my-7 h-px bg-[#EDE5DA]" />

          {/* Add to Bag + WhatsApp */}
          <div className="space-y-3">
            <AddToCartButton product={product} selectedVariant={selectedVariant} />
            <ProductWhatsAppButton product={product} selectedVariant={selectedVariant} />
          </div>

          {/* Trust badges */}
          <div className={`mt-7 grid grid-cols-3 gap-3 ${isRtl ? 'text-right' : ''}`}>
            {[
              { symbol: '✓', text: '100% Authentic' },
              { symbol: '↩', text: '30-Day Returns'  },
              { symbol: '⚡', text: 'Fast Delivery'   },
            ].map((badge) => (
              <div
                key={badge.text}
                className="rounded-xl border border-[#EDE5DA] bg-[#FDF9F4] p-3 text-center"
              >
                <p className="text-[13px] text-[#C9A96E]">{badge.symbol}</p>
                <p className="mt-1 text-[9.5px] font-light text-[#9E8E80]">{badge.text}</p>
              </div>
            ))}
          </div>

          {/* SKU */}
          <p className="mt-6 text-[10px] font-light text-[#C9A96E]/40">
            SKU: {(selectedVariant?.sku ?? product.id.slice(-8)).toUpperCase()}
          </p>
        </div>
      </div>

    </>
  )
}
