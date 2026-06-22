'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, Truck, Zap, Store } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { WHATSAPP_NUMBER } from '@/lib/config'

type DeliveryType = 'home' | 'express' | 'pickup'

function formatMRU(price: number): string {
  return `${Math.round(price).toLocaleString('fr')} MRU`
}

function WhatsAppSVG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function buildMessage(
  name: string,
  phone: string,
  delivery: DeliveryType,
  address: string,
  items: Array<{ product: { name_en: string; price: number }; quantity: number }>,
  total: number
): string {
  const deliveryLabel: Record<DeliveryType, string> = {
    home: 'Home Delivery',
    express: 'Express Delivery',
    pickup: 'Store Pickup',
  }

  const productLines = items.map(
    (i) => `• ${i.product.name_en} x${i.quantity} → ${formatMRU(i.product.price * i.quantity)}`
  )

  const lines = [
    '🛍️ New Order — Dreamshop',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    '',
    'Products:',
    ...productLines,
    '',
    `Delivery: ${deliveryLabel[delivery]}`,
    ...(delivery !== 'pickup' && address.trim() ? [`Address: ${address.trim()}`] : []),
    '',
    `Total: ${formatMRU(total)}`,
  ]

  return lines.join('\n')
}

const DELIVERY_OPTIONS: { key: DeliveryType; label: string; sub: string; Icon: React.ElementType }[] = [
  { key: 'home',    label: 'Home Delivery',   sub: 'Standard',  Icon: Truck },
  { key: 'express', label: 'Express Delivery', sub: 'Next day',  Icon: Zap   },
  { key: 'pickup',  label: 'Store Pickup',     sub: 'Free',      Icon: Store },
]

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-light uppercase tracking-[0.2em] text-[#8A8A8E]">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-[10px] font-light text-red-400">{error}</p>
      )}
    </div>
  )
}

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart()

  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [delivery, setDelivery] = useState<DeliveryType>('home')
  const [address, setAddress]   = useState('')
  const [errors, setErrors]     = useState<Record<string, string>>({})

  const total        = totalPrice()
  const needsAddress = delivery !== 'pickup'

  function clearError(key: string) {
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim())   e.name  = 'Required'
    if (!phone.trim())  e.phone = 'Required'
    if (needsAddress && !address.trim()) e.address = 'Required for delivery'
    return e
  }

  function handleOrder() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    const msg = buildMessage(name, phone, delivery, address, items, total)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    clearCart()
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F7]">
          <ShoppingBag size={24} strokeWidth={1} className="text-[#BCBCBC]" />
        </div>
        <p className="text-[15px] font-light text-[#1D1D1F]">Your cart is empty</p>
        <p className="mt-1.5 text-[12px] font-light text-[#8A8A8E]">Add some products before checking out</p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center rounded-full bg-[#1D1D1F] px-8 py-3.5 text-[11px] font-light uppercase tracking-widest text-white transition-all duration-300 hover:bg-black"
        >
          Browse products
        </Link>
      </div>
    )
  }

  const inputClass = (err?: string) =>
    [
      'h-12 w-full rounded-xl border bg-white px-4 text-[14px] font-light text-[#1D1D1F]',
      'outline-none transition-all duration-200 placeholder:text-[#D1D1D6]',
      'focus:border-[#1D1D1F] focus:shadow-[0_0_0_3px_rgba(29,29,31,0.06)]',
      err ? 'border-red-300' : 'border-[#E5E5E5]',
    ].join(' ')

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-14">

      {/* ── FORM COLUMN ── */}
      <div className="space-y-6">

        <Field label="Full Name" error={errors.name}>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); clearError('name') }}
            placeholder="Your full name"
            className={inputClass(errors.name)}
          />
        </Field>

        <Field label="Phone Number" error={errors.phone}>
          <input
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clearError('phone') }}
            placeholder="e.g. 36234567"
            type="tel"
            dir="ltr"
            className={inputClass(errors.phone)}
          />
        </Field>

        <Field label="Delivery Type">
          <div className="grid grid-cols-3 gap-2.5">
            {DELIVERY_OPTIONS.map(({ key, label, sub, Icon }) => {
              const active = delivery === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDelivery(key)}
                  className={[
                    'flex flex-col items-center gap-2.5 rounded-xl border p-4 text-center transition-all duration-200 select-none',
                    active
                      ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white shadow-[0_6px_20px_rgba(0,0,0,0.14)]'
                      : 'border-[#E5E5E5] bg-white text-[#6E6E73] hover:border-[#C7C7CC]',
                  ].join(' ')}
                >
                  <Icon size={17} strokeWidth={1.5} />
                  <div>
                    <p className="text-[11px] font-normal leading-snug">{label}</p>
                    <p className={`mt-0.5 text-[9px] font-light ${active ? 'text-white/55' : 'text-[#AEAEB2]'}`}>
                      {sub}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </Field>

        <AnimatePresence>
          {needsAddress && (
            <motion.div
              key="address-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <Field label="Delivery Address" error={errors.address}>
                <input
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); clearError('address') }}
                  placeholder="Your full delivery address"
                  className={inputClass(errors.address)}
                />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp order button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleOrder}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-5 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:brightness-105 active:scale-[0.99]"
            style={{
              backgroundColor: '#25D366',
              boxShadow: '0 4px 24px rgba(37, 211, 102, 0.28)',
            }}
          >
            <span className="transition-transform duration-300 group-hover:scale-110">
              <WhatsAppSVG size={19} />
            </span>
            Order on WhatsApp
          </button>
          <p className="mt-3 text-center text-[10px] font-light text-[#AEAEB2]">
            You'll be redirected to WhatsApp to confirm your order.
          </p>
        </div>

      </div>

      {/* ── ORDER SUMMARY COLUMN ── */}
      <div className="order-first lg:order-last lg:sticky lg:top-[124px] lg:self-start">
        <div className="rounded-2xl bg-[#F5F5F7] p-6">

          <p className="mb-5 text-[10px] font-light uppercase tracking-[0.28em] text-[#8A8A8E]">
            Order Summary
          </p>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-normal leading-snug text-[#1D1D1F] line-clamp-2">
                    {item.product.name_en}
                  </p>
                  <p className="mt-0.5 text-[11px] font-light text-[#8A8A8E]">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-[13px] font-light tabular-nums text-[#1D1D1F]">
                  {formatMRU(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#E5E5E5] pt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-[12px] font-light text-[#6E6E73]">Total</p>
              <p className="font-display text-[24px] font-light tracking-[-0.02em] text-[#1D1D1F]">
                {formatMRU(total)}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
