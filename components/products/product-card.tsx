'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)
  const { locale } = useTranslation()
  const isAr = locale === 'ar'

  const name    = (isAr && product.name_ar) ? product.name_ar : product.name_en
  const soldOut = product.stock === 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product)
    toast.success(name, { description: 'Added to cart' })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl bg-[#F5F2EE]" style={{ aspectRatio: '3/4' }}>
        <Image
          src={product.imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {soldOut && (
            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-neutral-500 backdrop-blur-sm">
              Sold out
            </span>
          )}
          {product.isBestseller && !soldOut && (
            <span className="rounded-md bg-[#1C1917]/80 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white backdrop-blur-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Quick-add */}
        {!soldOut && (
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className={[
              'absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-200',
              added
                ? 'bg-[#1C1917] text-white'
                : 'bg-white text-[#1C1917] hover:bg-[#1C1917] hover:text-white',
              'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0',
              'max-sm:opacity-100 max-sm:translate-y-0',
            ].join(' ')}
          >
            {added
              ? <Check size={11} strokeWidth={2.5} />
              : <Plus size={11} strokeWidth={2.5} />
            }
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 space-y-0.5 px-0.5">
        {product.brand && (
          <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#C9A882]">
            {product.brand}
          </p>
        )}
        <h3 className="line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-[#1C1917] transition-colors group-hover:text-[#78716C]">
          {name}
        </h3>
        <p className="pt-0.5 text-[13px] font-bold text-[#1C1917]">
          {formatPrice(product.price)}
        </p>
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-[10px] font-light text-[#C9A882]">Only {product.stock} left</p>
        )}
      </div>
    </Link>
  )
}
