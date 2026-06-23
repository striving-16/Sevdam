'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'
import { useCart } from '@/hooks/use-cart'
import { formatPrice, cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/validations'
import type { Product, Variant } from '@/types'

interface Props {
  products: Product[]
}

export function Offers({ products }: Props) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'

  if (products.length === 0) return null

  return (
    <section
      className="bg-[#111111] px-6 py-24 sm:px-10 sm:py-32 lg:px-14"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Gold top hairline */}
      <div
        className="mx-auto mb-16 max-w-screen-xl"
        style={{ height: 1, background: 'linear-gradient(to right, transparent, #C7A98B 35%, #C7A98B 65%, transparent)' }}
      />

      {/* Section header */}
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C7A98B]"
            >
              Limited Time
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.7 }}
              className="font-display text-[clamp(34px,5vw,64px)] font-light italic leading-[0.95] text-white"
            >
              Special Offers
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
              className="font-display text-[13px] italic text-[#C7A98B] underline underline-offset-4 decoration-[#C7A98B]/40 transition-all hover:decoration-[#C7A98B]"
            >
              View all →
            </Link>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-4 lg:gap-5">
          {products.slice(0, 4).map((product, i) => (
            <OfferCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      {/* Gold bottom hairline */}
      <div
        className="mx-auto mt-16 max-w-screen-xl"
        style={{ height: 1, background: 'linear-gradient(to right, transparent, #C7A98B 35%, #C7A98B 65%, transparent)' }}
      />
    </section>
  )
}

function OfferCard({ product, index }: { product: Product; index: number }) {
  const addItem    = useCart((s) => s.addItem)
  const { locale } = useTranslation()
  const isAr       = locale === 'ar'
  const name       = (isAr && product.name_ar) ? product.name_ar : product.name_en
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const hasVariants  = product.hasVariants && product.variants.length > 0
  const firstVariant = hasVariants ? product.variants[0] : null

  const [selected, setSelected] = useState<Variant | null>(firstVariant)
  const [added,    setAdded]    = useState(false)

  const displayImage = (selected?.image ?? null) || product.imageUrl
  const stock        = selected ? selected.stock : product.stock
  const soldOut      = stock === 0

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
      className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-[#1A1A1A] shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] flex-shrink-0 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="absolute inset-0" tabIndex={-1} aria-label={name}>
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, 25vw"
            loading="lazy"
          />
        </Link>

        {/* Floating + */}
        {!soldOut && (
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add to bag"
            className={cn(
              'absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md',
              'transition-all duration-200',
              added
                ? 'bg-[#C7A98B] text-white'
                : 'bg-white/90 text-[#111111] backdrop-blur-sm hover:bg-[#C7A98B] hover:text-white',
            )}
          >
            {added ? <Check size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
          </button>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <span className="text-[9px] font-light uppercase tracking-[0.3em] text-white/70">Sold Out</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        {/* Category */}
        <p className="text-[7.5px] font-light uppercase tracking-[0.42em] text-[#C7A98B]">
          {categoryLabel}
        </p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 font-display text-[clamp(14px,1.4vw,18px)] font-light italic leading-[1.25] text-white transition-colors hover:text-[#C7A98B]">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          {product.salePrice ? (
            <>
              <span className="text-[16px] font-bold tracking-[0.01em] text-[#C7A98B]">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-[11px] font-light text-white/30 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-[16px] font-bold tracking-[0.01em] text-white">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Shade swatches */}
        {hasVariants && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {product.variants.slice(0, 6).map((v) => (
              <button
                key={v.id}
                type="button"
                title={v.shadeName}
                onClick={(e) => { e.preventDefault(); setSelected(v) }}
                aria-label={v.shadeName}
                aria-pressed={selected?.id === v.id}
                className="flex-shrink-0 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none"
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: v.hexColor,
                  boxShadow: selected?.id === v.id
                    ? `0 0 0 1.5px #1A1A1A, 0 0 0 3px ${v.hexColor}`
                    : '0 0 0 0.5px rgba(255,255,255,0.2)',
                  transform: selected?.id === v.id ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}

        {/* Push CTA to bottom */}
        <div className="flex-1" />

        {/* Add to Bag */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={cn(
            'mt-4 w-full rounded-[12px] py-2.5 text-[8.5px] font-light uppercase tracking-[0.28em]',
            'transition-all duration-300 active:scale-[0.98]',
            soldOut
              ? 'cursor-not-allowed bg-white/5 text-white/20'
              : added
              ? 'bg-[#C7A98B] text-white'
              : 'bg-white/10 text-white hover:bg-[#C7A98B]',
          )}
        >
          {soldOut ? 'Sold Out' : added ? '✓ Added' : 'Add to Bag'}
        </button>
      </div>
    </motion.article>
  )
}
