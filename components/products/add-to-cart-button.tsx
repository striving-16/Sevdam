'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product, Variant } from '@/types'

interface Props {
  product: Product
  selectedVariant?: Variant | null
}

export function AddToCartButton({ product, selectedVariant = null }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded]       = useState(false)
  const addItem = useCart((s) => s.addItem)

  const variant    = selectedVariant
  const stock      = variant ? variant.stock : product.stock
  const soldOut    = stock === 0
  const needsShade = product.hasVariants && !variant
  const maxQty     = Math.min(stock, 10)

  function handleAdd() {
    if (soldOut || needsShade) return
    addItem(product, variant, quantity)
    setAdded(true)
    const shadePart = variant ? ` — ${variant.shadeName}` : ''
    toast.success(`${product.name_en}${shadePart}`, {
      description: `${quantity} × ${formatPrice(product.price)}`,
    })
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      {!soldOut && !needsShade && (
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-light uppercase tracking-[0.18em] text-[#9E8E80]">Qty</span>
          <div className="flex items-center rounded-full border border-[#EDE5DA]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-[#9E8E80] transition-colors hover:text-[#1A1714] disabled:opacity-30"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-[15px] font-light text-[#1A1714]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              className="flex h-10 w-10 items-center justify-center text-[#9E8E80] transition-colors hover:text-[#1A1714] disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>
          {stock <= 5 && stock > 0 && (
            <span className="text-[11px] font-light italic text-[#C9A96E]">
              Only {stock} left
            </span>
          )}
        </div>
      )}

      {/* Add to Bag */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut || needsShade}
        className={[
          'btn-pill-dark w-full flex items-center justify-center gap-2.5',
          (soldOut || needsShade) && 'opacity-40 cursor-not-allowed',
        ].join(' ')}
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2"
            >
              <Check size={14} strokeWidth={2} />
              Added to Bag
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              {soldOut ? 'Sold Out' : needsShade ? 'Select a Shade' : 'Add to Bag'}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
