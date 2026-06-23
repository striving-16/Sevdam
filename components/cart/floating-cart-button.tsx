'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'

export function FloatingCartButton() {
  const openCart  = useCart((s) => s.openCart)
  const isOpen    = useCart((s) => s.isOpen)
  const cartCount = useCart((s) => s.totalItems())

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          key="floating-cart"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          onClick={openCart}
          aria-label="Open bag"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1917] shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-200 hover:bg-[#3D3530] active:scale-95"
        >
          <ShoppingBag size={20} strokeWidth={1.25} className="text-white" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C7A98B] text-[9px] font-light text-white"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
