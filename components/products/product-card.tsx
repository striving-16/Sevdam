'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import { formatPrice, cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/validations'
import type { Product, Variant } from '@/types'

/*
  mode="editorial"  → homepage campaign cards — "Discover →" CTA, no add-to-bag
  mode="shop"       → /products grid — "Add to Bag" CTA with cart logic
  featured          → first card in Best Sellers; wider slot, taller image, bigger type
*/
export function ProductCard({
  product,
  index = 0,
  mode = 'shop',
  featured = false,
  className,
}: {
  product: Product
  index?: number
  mode?: 'editorial' | 'shop'
  featured?: boolean
  className?: string
}) {
  const addItem       = useCart((s) => s.addItem)
  const { locale }    = useTranslation()
  const isAr          = locale === 'ar'
  const name          = (isAr && product.name_ar) ? product.name_ar : product.name_en
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const hasVariants  = product.hasVariants && product.variants.length > 0
  const firstVariant = hasVariants ? product.variants[0] : null
  const [selected, setSelected] = useState<Variant | null>(firstVariant)
  const [added,    setAdded]    = useState(false)

  const displayImage = (selected?.image ?? null) || product.imageUrl
  const stock        = selected ? selected.stock : product.stock
  const soldOut      = stock === 0
  const isEditorial  = mode === 'editorial'

  // Max swatches shown on the card
  const maxSwatches = featured ? 8 : 6

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
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group flex flex-col overflow-hidden rounded-[32px]',
        'bg-[#F3EFE9]',
        // Ghost shadow — almost invisible, product is the hero
        'shadow-[0_1px_4px_rgba(0,0,0,0.03),0_6px_28px_rgba(0,0,0,0.045)]',
        'transition-[transform,box-shadow] duration-500',
        'hover:-translate-y-1.5 hover:shadow-[0_20px_70px_rgba(0,0,0,0.09)]',
        className,
      )}
    >
      {/* ─────────────────── IMAGE — the hero ─────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        tabIndex={-1}
        aria-label={name}
        className={cn(
          'relative block flex-shrink-0 overflow-hidden',
          // Mobile always portrait 5:6. Featured desktop upgrades to 3:4 (wider slot)
          featured ? 'aspect-[5/6] lg:aspect-[3/4]' : 'aspect-[5/6]',
        )}
      >
        {/*
          Warm radial spotlight: mimics professional beauty product photography.
          mix-blend-multiply on the Image erases white product backgrounds so the
          product appears to float inside this glow.
        */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 74% 82% at 50% 43%, #E2D5C6 0%, #EDE5D8 38%, #F3EFE9 70%)',
          }}
        />

        {/* scale-[1.06] at rest trims excessive white padding in the source photo */}
        <Image
          src={displayImage}
          alt={name}
          fill
          className="relative scale-[1.06] object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.12]"
          sizes={
            featured
              ? '(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 40vw'
              : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
          }
          loading="lazy"
        />

        {/* Sold out — minimal, elegant */}
        {soldOut && (
          <div className="absolute inset-0 flex items-end justify-center pb-5">
            <span className="rounded-full bg-white/60 px-3.5 py-1.5 text-[7.5px] font-light uppercase tracking-[0.38em] text-[#7A7A7A] backdrop-blur-sm">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* ─────────────────── BODY ─────────────────────────────── */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          featured ? 'px-6 pb-7 pt-5' : 'px-4 pb-5 pt-4',
        )}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Category */}
        <p
          className={cn(
            'font-light uppercase text-[#C7A98B]',
            featured ? 'text-[8.5px] tracking-[0.48em]' : 'text-[7.5px] tracking-[0.42em]',
          )}
        >
          {categoryLabel}
        </p>

        {/* Product name */}
        <Link href={`/products/${product.slug}`}>
          <h3
            className={cn(
              'mt-2 line-clamp-2 font-display font-light italic leading-[1.2] text-[#111111]',
              'transition-colors duration-200 hover:text-[#C7A98B]',
              featured
                ? 'text-[clamp(20px,2vw,30px)]'
                : 'text-[clamp(15px,1.4vw,20px)]',
            )}
          >
            {name}
          </h3>
        </Link>

        {/* Price — must feel strong */}
        <p
          className={cn(
            'mt-2 font-bold leading-none tracking-[0.01em] text-[#111111]',
            featured
              ? 'text-[clamp(22px,2.2vw,28px)]'
              : 'text-[clamp(18px,1.8vw,22px)]',
          )}
        >
          {formatPrice(product.price)}
        </p>

        {/* Shade swatches */}
        {hasVariants && (
          <div className={cn('mt-3.5 flex flex-wrap items-center', featured ? 'gap-2.5' : 'gap-2')}>
            {product.variants.slice(0, maxSwatches).map((v) => (
              <button
                key={v.id}
                type="button"
                title={v.shadeName}
                onClick={(e) => handleShadeClick(e, v)}
                aria-label={v.shadeName}
                aria-pressed={selected?.id === v.id}
                className="flex-shrink-0 rounded-full focus:outline-none"
                style={{
                  width:           featured ? 24 : 20,
                  height:          featured ? 24 : 20,
                  backgroundColor: v.hexColor,
                  boxShadow:       selected?.id === v.id
                    ? `0 0 0 2.5px #F3EFE9, 0 0 0 4px ${v.hexColor}`
                    : '0 0 0 0.5px rgba(0,0,0,0.16)',
                  transform:       selected?.id === v.id ? 'scale(1.2)' : 'scale(1)',
                  transition:      'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              />
            ))}
            {product.variants.length > maxSwatches && (
              <span className="text-[9.5px] font-light text-[#9E8E80]">
                +{product.variants.length - maxSwatches}
              </span>
            )}
          </div>
        )}

        {/* Selected shade label */}
        {hasVariants && selected && (
          <p className="mt-2 text-[9.5px] font-light text-[#9A9A9A]">{selected.shadeName}</p>
        )}

        {/* Push CTA to bottom */}
        <div className="flex-1" />

        {/* CTA */}
        {isEditorial ? (
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              'mt-5 block rounded-full border border-[#C4B9AC] py-3 text-center',
              'text-[9px] font-light uppercase tracking-[0.34em] text-[#111111]',
              'transition-all duration-300',
              'hover:border-[#111111] hover:bg-[#111111] hover:text-white',
            )}
          >
            Discover →
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className={cn(
              'mt-4 w-full rounded-[14px] py-3 text-[9px] font-light uppercase tracking-[0.3em]',
              'transition-all duration-300 active:scale-[0.98]',
              soldOut
                ? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
                : added
                ? 'bg-[#111111] text-white'
                : 'bg-[#C7A98B] text-white hover:bg-[#B8967A]',
            )}
          >
            {soldOut ? 'Sold Out' : added ? '✓ Added to Bag' : 'Add to Bag'}
          </button>
        )}
      </div>
    </motion.article>
  )
}
