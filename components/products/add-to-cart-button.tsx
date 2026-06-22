'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  const soldOut = product.stock === 0
  const maxQty = Math.min(product.stock, 10)

  function handleAdd() {
    if (soldOut) return
    addItem(product, quantity)
    setAdded(true)
    toast.success(`${product.name_en} added to cart`, {
      description: `${quantity} × ${formatPrice(product.price)}`,
    })
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      {!soldOut && (
        <div className="flex items-center gap-3">
          <span className="text-[12px] tracking-wide text-neutral-500">Qty</span>
          <div className="flex items-center rounded-lg border border-neutral-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-30"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-[14px] font-light text-neutral-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-30"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Add to cart */}
      <Button
        onClick={handleAdd}
        disabled={soldOut}
        className={`h-12 w-full rounded-full text-[13px] tracking-wide transition-all duration-300 ${
          soldOut
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-neutral-900 text-white hover:bg-neutral-700'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <Check size={14} />
              Added to Cart
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              {soldOut ? 'Sold Out' : 'Add to Cart'}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  )
}
