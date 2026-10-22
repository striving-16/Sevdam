import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { getOrderConfirmation, type PublicOrder } from '@/actions/order-actions'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'
import { getServerT } from '@/lib/i18n/server'
import { interpolate } from '@/lib/i18n/translations'
import { whatsAppUrl } from '@/lib/config'
import { getWhatsAppNumber } from '@/actions/settings-actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

const DELIVERY_LABELS: Record<string, string> = {
  home:    'Home Delivery',
  express: 'Express Delivery',
  pickup:  'Store Pickup',
}

function buildConfirmationMessage(
  order: PublicOrder,
  name: string,
  phone: string,
  address: string,
  trackUrl: string,
): string {
  const orderNumber = `#${order.id.slice(-8).toUpperCase()}`

  const productLines = order.items.map((i) => {
    const shade = i.variantName ? ` (${i.variantName})` : ''
    return `• ${i.product?.name_en ?? 'Product'}${shade} x${i.quantity} → ${formatPrice(i.price * i.quantity)}`
  })

  const lines = [
    '🛍️ Order Confirmation',
    '',
    `Order: ${orderNumber}`,
    ...(name  ? [`Name: ${name}`]   : []),
    ...(phone ? [`Phone: ${phone}`] : []),
    '',
    'Products:',
    ...productLines,
    '',
    `Delivery: ${DELIVERY_LABELS[order.deliveryType] ?? order.deliveryType}`,
    ...(order.deliveryType !== 'pickup' && address ? [`Address: ${address}`] : []),
    '',
    `Total: ${formatPrice(order.totalPrice)}`,
    '',
    `Track this order: ${trackUrl}`,
  ]

  return lines.join('\n')
}

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ name?: string; phone?: string; address?: string }>
}

export const metadata: Metadata = { title: 'Order Confirmed' }

export default async function OrderConfirmationPage({ params, searchParams }: Props) {
  const { id } = await params
  const { name = '', phone = '', address = '' } = await searchParams
  const [order, { t, dir }, whatsappNumber] = await Promise.all([getOrderConfirmation(id), getServerT(), getWhatsAppNumber()])
  const isRtl = dir === 'rtl'

  if (!order) notFound()

  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const trackUrl = `${siteUrl}/track-order`
  const waMessage = buildConfirmationMessage(order, name, phone, address, trackUrl)
  const waLink = whatsAppUrl(whatsappNumber, waMessage)

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
          {name ? interpolate(t.orderConfirmation.sub, { name }) : t.orderConfirmation.title}
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
            {DELIVERY_LABELS[order.deliveryType] ?? order.deliveryType}
          </p>
        </div>

        <Separator className="my-5 bg-[#F0EAE0]" />

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div className="space-y-3 mb-5">
            {order.items.map((item) => (
              <div key={item.id} className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={isRtl ? 'text-right' : ''}>
                  <p className="text-[13px] font-light text-[#1C1917]">
                    {item.product?.name_en ?? 'Product'}
                    {item.variantName && (
                      <span className="font-light text-[#9E8E80]"> — {item.variantName}</span>
                    )}
                  </p>
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

      {/* Send on WhatsApp — a real tap, not an auto-open, so iOS Safari never blocks it */}
      {waLink ? (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-2xl py-5 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:brightness-105 active:scale-[0.99]"
          style={{ backgroundColor: '#25D366', boxShadow: '0 4px 24px rgba(37, 211, 102, 0.28)' }}
        >
          <WhatsAppIcon size={19} />
          Send Order on WhatsApp
        </a>
      ) : (
        <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-center text-[13px] text-amber-700">
          WhatsApp sending is temporarily unavailable — your order is saved as {`#${order.id.slice(-8).toUpperCase()}`}. Please contact us directly.
        </p>
      )}

      <p className="mt-4 text-center text-[11px] font-light text-[#78716C]">
        Lost this page?{' '}
        <Link href="/track-order" className="underline underline-offset-2 hover:text-[#1C1917]">
          Track your order
        </Link>{' '}
        any time with your phone number.
      </p>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
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

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}
