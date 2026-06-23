'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

export function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCart()
  const { product, variant, quantity } = item
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const variantId = variant?.id ?? null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isRtl ? 8 : -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRtl ? -8 : 8 }}
      transition={{ duration: 0.22 }}
      className="flex gap-4 py-5"
    >
      {/* Image */}
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#F5F0EB]">
        <Image
          src={product.imageUrl}
          alt={product.name_en}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Details */}
      <div className={`flex flex-1 flex-col justify-between ${isRtl ? 'items-end' : ''}`}>
        <div className={`flex w-full items-start justify-between gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={isRtl ? 'text-right' : ''}>
            <p className="text-[13px] font-normal text-[#1C1917] line-clamp-1">{product.name_en}</p>
            {variant && (
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: variant.hexColor }} />
                <span className="text-[11px] font-light text-[#9E8E80]">{variant.shadeName}</span>
              </div>
            )}
            <p className="mt-0.5 text-[13px] font-light text-[#78716C]">{formatPrice(product.price)}</p>
          </div>
          <button
            onClick={() => removeItem(product.id, variantId ?? undefined)}
            aria-label={t.cart.remove}
            className="shrink-0 rounded-md p-1 text-[#78716C] transition-colors hover:text-[#1C1917]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Quantity control */}
        <div className={`flex items-center gap-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => updateQuantity(product.id, variantId, quantity - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E8E0D8] text-[#78716C] transition-colors hover:text-[#1C1917]"
          >
            <Minus size={11} />
          </button>
          <span className="w-8 text-center text-[13px] font-light text-[#1C1917]">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, variantId, quantity + 1)}
            disabled={quantity >= (variant?.stock ?? product.stock)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E8E0D8] text-[#78716C] transition-colors hover:text-[#1C1917] disabled:opacity-30"
          >
            <Plus size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
