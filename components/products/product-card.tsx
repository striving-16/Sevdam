'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import { formatPrice, cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/validations'
import type { Product, Variant } from '@/types'

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
  const stock   = selected ? selected.stock : product.stock
  const soldOut = stock === 0
  const maxSwatches = featured ? 8 : 5

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
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[28px]',
        'bg-[#F3EFE9]',
        'shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_24px_rgba(0,0,0,0.04)]',
        'transition-[transform,box-shadow] duration-500',
        'hover:-translate-y-1 hover:shadow-[0_16px_56px_rgba(0,0,0,0.08)]',
        className,
      )}
    >
      {/* ── Image ─────────────────────────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        tabIndex={-1}
        aria-label={name}
        className={cn(
          'relative block flex-shrink-0 overflow-hidden',
          featured ? 'aspect-[5/6] lg:aspect-[3/4]' : 'aspect-[4/5]',
        )}
      >
        <Image
          src={displayImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes={
            featured
              ? '(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 40vw'
              : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
          }
          loading="lazy"
        />

        {soldOut && (
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <span className="rounded-full bg-white/65 px-3 py-1 text-[7px] font-light uppercase tracking-[0.36em] text-[#7A7A7A] backdrop-blur-sm">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          featured ? 'px-5 pb-6 pt-4' : 'px-3.5 pb-4 pt-3.5',
        )}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Category */}
        <p className="text-[7px] font-light uppercase tracking-[0.44em] text-[#C7A98B]">
          {categoryLabel}
        </p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3
            className={cn(
              'mt-1.5 line-clamp-2 font-display font-light italic leading-[1.25] text-[#111111]',
              'transition-colors duration-200 hover:text-[#C7A98B]',
              featured ? 'text-[clamp(17px,1.7vw,22px)]' : 'text-[clamp(13px,1.2vw,17px)]',
            )}
          >
            {name}
          </h3>
        </Link>

        {/* Price — present but secondary */}
        <p className={cn(
          'mt-1.5 font-light leading-none text-[#9E8E80]',
          featured ? 'text-[14px]' : 'text-[13px]',
        )}>
          {formatPrice(product.price)}
        </p>

        {/* Swatches */}
        {hasVariants && (
          <div className={cn('mt-3 flex flex-wrap items-center', featured ? 'gap-2' : 'gap-1.5')}>
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
                  width:           featured ? 20 : 16,
                  height:          featured ? 20 : 16,
                  backgroundColor: v.hexColor,
                  boxShadow:       selected?.id === v.id
                    ? `0 0 0 2px #F3EFE9, 0 0 0 3.5px ${v.hexColor}`
                    : '0 0 0 0.5px rgba(0,0,0,0.14)',
                  transform:       selected?.id === v.id ? 'scale(1.18)' : 'scale(1)',
                  transition:      'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              />
            ))}
            {product.variants.length > maxSwatches && (
              <span className="text-[9px] font-light text-[#9E8E80]">
                +{product.variants.length - maxSwatches}
              </span>
            )}
          </div>
        )}

        {hasVariants && selected && (
          <p className="mt-1.5 text-[9px] font-light text-[#B0A49A]">{selected.shadeName}</p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to Bag — slim elegant pill */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={cn(
            'mt-3 flex w-full items-center justify-center gap-1.5 rounded-full',
            featured ? 'py-2.5' : 'py-2',
            'text-[8px] font-light uppercase tracking-[0.3em]',
            'ring-1 transition-all duration-300 active:scale-[0.97]',
            soldOut
              ? 'cursor-not-allowed ring-[#E0D8D0] text-[#C4B8B0]'
              : added
              ? 'bg-[#C7A98B] ring-[#C7A98B] text-white'
              : 'bg-[#C7A98B]/[0.07] ring-[#C7A98B]/50 text-[#A8896F] hover:bg-[#C7A98B] hover:ring-[#C7A98B] hover:text-white',
          )}
        >
          {soldOut ? (
            'Sold Out'
          ) : added ? (
            <>
              <Check size={9} strokeWidth={2.5} />
              Added
            </>
          ) : (
            <>
              <ShoppingBag size={9} strokeWidth={1.5} />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </motion.article>
  )
}
