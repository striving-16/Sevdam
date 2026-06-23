'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product, Variant } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)

  const hasVariants    = product.hasVariants && product.variants.length > 0
  const firstVariant   = hasVariants ? product.variants[0] : null
  const [selected, setSelected]   = useState<Variant | null>(firstVariant)
  const [added, setAdded]         = useState(false)

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
    toast.success(`${product.name_en}${shade}`, { description: 'Added to your bag' })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <article className="group">
      {/* ── Image ────────────────────────────────────────────────────────────── */}
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="grain relative overflow-hidden bg-[#F2EBE2]"
          style={{ aspectRatio: '3/4' }}
        >
          <Image
            src={displayImage}
            alt={product.name_en}
            fill
            className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />

          {/* Badges */}
          {product.isBestseller && !soldOut && (
            <div className="absolute left-3 top-3 z-10">
              <span
                className="block rounded-full bg-white/85 px-2.5 py-1 text-[8px] font-light uppercase backdrop-blur-sm"
                style={{ letterSpacing: '0.2em', color: '#C9A96E' }}
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

          {/* Add to bag — hover reveal */}
          {!soldOut && (
            <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={handleAdd}
                className="w-full bg-white/90 py-3 text-[9.5px] font-light uppercase tracking-[0.22em] text-[#1A1714] backdrop-blur-sm transition-colors hover:text-[#C9A96E]"
              >
                {added ? '✓ Added to Bag' : 'Add to Bag'}
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* ── Shade circles ────────────────────────────────────────────────────── */}
      {hasVariants && (
        <div className="mt-3 flex items-center gap-1.5">
          {product.variants.slice(0, 8).map((v) => (
            <button
              key={v.id}
              title={v.shadeName}
              onClick={(e) => handleShadeClick(e, v)}
              className="relative flex-shrink-0 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none"
              style={{
                width: 16,
                height: 16,
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
              className="text-[9px] font-light text-[#9E8E80] hover:text-[#C9A96E]"
            >
              +{product.variants.length - 8}
            </Link>
          )}
        </div>
      )}

      {/* ── Info ─────────────────────────────────────────────────────────────── */}
      <div className="mt-2.5 space-y-0.5">
        <p className="text-[8.5px] font-light uppercase tracking-[0.28em] text-[#C9A96E]">
          Besma Sevdam
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-[clamp(13px,1.4vw,17px)] font-light italic leading-[1.3] text-[#1A1714] transition-colors hover:text-[#C9A96E]">
            {product.name_en}
          </h3>
        </Link>
        {hasVariants && selected && (
          <p className="text-[10px] font-light text-[#9E8E80]">{selected.shadeName}</p>
        )}
        <p className="font-display text-[clamp(12px,1.3vw,15px)] font-light italic text-[#9E8E80]">
          {formatPrice(product.price)}
        </p>

        {/* Mobile add */}
        {!soldOut && (
          <button
            onClick={handleAdd}
            className="mt-1.5 block text-[9px] font-light uppercase tracking-[0.22em] text-[#C9A96E] underline underline-offset-3 decoration-[#C9A96E]/40 lg:hidden"
          >
            {added ? '✓ Added' : '+ Add to Bag'}
          </button>
        )}
      </div>
    </article>
  )
}
