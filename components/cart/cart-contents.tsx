'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import { CartItem } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { Button } from '@/components/ui/button'

export function CartContents() {
  const { items, totalItems, totalPrice } = useCart()
  const { t, dir } = useTranslation()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag size={40} strokeWidth={1} className="mb-5 text-[#C9A882]/40" />
        <p className="mb-1 text-[18px] font-light text-[#1C1917]">{t.cart.empty}</p>
        <p className="mb-8 text-[13px] font-light text-[#78716C]">{t.cart.emptyDesc}</p>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-[#E8E0D8] px-8 text-[12px] font-light uppercase hover:border-[#C9A882]"
        >
          <Link href="/products">{t.cart.browseCta}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={`grid gap-12 lg:grid-cols-[1fr_360px] ${dir === 'rtl' ? 'rtl' : ''}`}>
      <div className="space-y-0 divide-y divide-[#F0EAE0]">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
      <div>
        <CartSummary subtotal={totalPrice()} itemCount={totalItems()} />
      </div>
    </div>
  )
}
