'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, Truck, Zap, Store, Loader2 } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { placeOrder } from '@/actions/order-actions'
import { formatPrice } from '@/lib/utils'

type DeliveryType = 'home' | 'express' | 'pickup'

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
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()

  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [delivery, setDelivery] = useState<DeliveryType>('home')
  const [address, setAddress]   = useState('')
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  // Stable for the lifetime of this form (incl. retries) — a fresh key per
  // mount, so a dropped-response retry replays the same order instead of
  // creating a second one, but a brand-new checkout session gets a new key.
  const [idempotencyKey] = useState(() => crypto.randomUUID())

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
    setOrderError(null)

    startTransition(async () => {
      try {
        const { orderId } = await placeOrder(
          {
            customerName: name,
            customerPhone: phone,
            customerAddress: needsAddress ? address : '',
            deliveryType: delivery,
          },
          items,
          idempotencyKey
        )
        clearCart()
        const params = new URLSearchParams({ name, phone })
        if (needsAddress && address.trim()) params.set('address', address.trim())
        router.push(`/order-confirmation/${orderId}?${params.toString()}`)
      } catch (err) {
        setOrderError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    })
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

        {/* Place order */}
        <div className="pt-2">
          {orderError && (
            <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-[12px] font-light text-red-500">
              {orderError}
            </p>
          )}
          <button
            type="button"
            onClick={handleOrder}
            disabled={isPending}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#1D1D1F] py-5 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Placing Order…
              </>
            ) : (
              <>
                <ShoppingBag size={18} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                Place Order
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[10px] font-light text-[#AEAEB2]">
            You&apos;ll get an order number and a link to confirm it on WhatsApp.
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
                    {item.variant && (
                      <span className="font-light text-[#8A8A8E]"> — {item.variant.shadeName}</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] font-light text-[#8A8A8E]">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-[13px] font-light tabular-nums text-[#1D1D1F]">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#E5E5E5] pt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-[12px] font-light text-[#6E6E73]">Total</p>
              <p className="font-display text-[24px] font-light tracking-[-0.02em] text-[#1D1D1F]">
                {formatPrice(total)}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
