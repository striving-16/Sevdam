import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { getOrderById } from '@/actions/order-actions'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'
import { getServerT } from '@/lib/i18n/server'
import { interpolate } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Order Confirmed' }

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params
  const [order, { t, dir }] = await Promise.all([getOrderById(id), getServerT()])
  const isRtl = dir === 'rtl'

  if (!order) notFound()

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-[140px]" dir={dir}>
      {/* Success icon */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1917]">
          <Check size={22} strokeWidth={1.5} className="text-white" />
        </div>
        <h1 className="font-display text-[clamp(24px,3.5vw,36px)] font-light text-[#1C1917]">
          {t.orderConfirmation.title}
        </h1>
        <p className="mt-3 text-[14px] font-light leading-relaxed text-[#78716C]">
          {interpolate(t.orderConfirmation.sub, { name: order.customerName })}
        </p>
      </div>

      {/* Order details card */}
      <div className="rounded-2xl border border-[#F0EAE0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">

        <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <p className="text-[10px] font-light uppercase text-[#78716C]" style={{ letterSpacing: isRtl ? 0 : '0.25em' }}>
            {t.orderConfirmation.orderIdLabel}
          </p>
          <p className="font-mono text-[13px] text-[#44403C]">
            #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <p className="text-[10px] font-light uppercase text-[#78716C]" style={{ letterSpacing: isRtl ? 0 : '0.25em' }}>
            {t.orderConfirmation.statusLabel}
          </p>
          <p className="text-[13px] font-light text-[#44403C]">
            {ORDER_STATUS_LABELS[order.status]}
          </p>
        </div>

        <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
          <p className="text-[10px] font-light uppercase text-[#78716C]" style={{ letterSpacing: isRtl ? 0 : '0.25em' }}>
            {t.orderConfirmation.deliveryLabel}
          </p>
          <p className={`text-[13px] font-light text-[#44403C] max-w-[200px] ${isRtl ? 'text-left' : 'text-right'}`}>
            {order.customerAddress}
          </p>
        </div>

        <Separator className="my-5 bg-[#F0EAE0]" />

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div className="space-y-3 mb-5">
            {order.items.map((item) => (
              <div key={item.id} className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={isRtl ? 'text-right' : ''}>
                  <p className="text-[13px] font-light text-[#1C1917]">{item.product?.name_en ?? 'Product'}</p>
                  <p className="text-[12px] font-light text-[#78716C]">{t.orderConfirmation.itemsLabel}: {item.quantity}</p>
                </div>
                <p className="text-[13px] font-light text-[#44403C]">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-4 bg-[#F0EAE0]" />

        <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
          <p className="text-[13px] font-light text-[#78716C]">{t.orderConfirmation.totalLabel}</p>
          <p className="font-display text-[20px] font-light text-[#1C1917]">{formatPrice(order.totalPrice)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <Button
          asChild
          className="flex-1 rounded-full bg-[#1C1917] text-[11px] font-light uppercase text-white hover:bg-[#3D3530]"
          style={{ letterSpacing: isRtl ? 0 : '0.1em' }}
        >
          <Link href="/products">{t.orderConfirmation.continueShopping}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 rounded-full border-[#E8E0D8] text-[11px] font-light uppercase hover:border-[#C9A882]"
          style={{ letterSpacing: isRtl ? 0 : '0.1em' }}
        >
          <Link href="/">{t.orderConfirmation.goHome}</Link>
        </Button>
      </div>
    </div>
  )
}
