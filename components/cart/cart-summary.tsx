'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/context'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  subtotal: number
  itemCount: number
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const countLabel = itemCount === 1 ? t.common.item : t.common.items

  return (
    <div className={`rounded-2xl border border-[#F0EAE0] bg-[#FAFAF8] p-6 lg:p-8 ${isRtl ? 'text-right' : ''}`}>
      <h2 className="text-[15px] font-normal text-[#1C1917]">{t.cart.subtotal}</h2>

      <div className="mt-6 space-y-3">
        <div className={`flex justify-between text-[13px] ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className="font-light text-[#78716C]">
            {t.cart.subtotal} ({itemCount} {countLabel})
          </span>
          <span className="font-normal text-[#1C1917]">{formatPrice(subtotal)}</span>
        </div>
        <div className={`flex justify-between text-[13px] ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className="font-light text-[#78716C]">{t.cart.delivery}</span>
          <span className="font-light text-[#78716C]">{t.cart.deliverySub}</span>
        </div>
      </div>

      <Separator className="my-5 bg-[#F0EAE0]" />

      <div className={`flex justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
        <span className="text-[14px] font-normal text-[#1C1917]">{t.cart.total}</span>
        <span className="font-display text-[20px] font-light text-[#1C1917]">{formatPrice(subtotal)}</span>
      </div>

      <Button
        asChild
        className="mt-6 h-12 w-full rounded-full bg-[#1C1917] text-[11px] font-light uppercase tracking-widest text-white hover:bg-[#3D3530]"
      >
        <Link href="/checkout">{t.cart.checkout}</Link>
      </Button>

      <Link
        href="/products"
        className="mt-4 block text-center text-[11px] font-light text-[#78716C] transition-colors hover:text-[#1C1917]"
      >
        {t.cart.continueShopping}
      </Link>
    </div>
  )
}
