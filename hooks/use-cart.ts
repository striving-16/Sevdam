'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product, Variant, CartItem } from '@/types'

function cartKey(productId: string, variantId: string | null | undefined): string {
  return variantId ? `${productId}:${variantId}` : productId
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, variant?: Variant | null, quantity?: number) => void
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, variant = null, quantity = 1) => {
        set((state) => {
          const key = cartKey(product.id, variant?.id)
          const maxStock = variant ? variant.stock : product.stock
          const existing = state.items.find(
            (i) => cartKey(i.product.id, i.variant?.id) === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                cartKey(i.product.id, i.variant?.id) === key
                  ? { ...i, quantity: Math.min(i.quantity + quantity, maxStock) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { product, variant: variant ?? null, quantity: Math.min(quantity, maxStock) },
            ],
          }
        })
      },

      removeItem: (productId, variantId) => {
        const key = cartKey(productId, variantId)
        set((state) => ({
          items: state.items.filter(
            (i) => cartKey(i.product.id, i.variant?.id) !== key
          ),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        const key = cartKey(productId, variantId)
        set((state) => ({
          items: state.items.map((i) =>
            cartKey(i.product.id, i.variant?.id) === key ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'besma-cart-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
