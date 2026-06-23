'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Truck, Package } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useTranslation } from '@/lib/i18n/context'
import { formatPrice, cn } from '@/lib/utils'
import { whatsAppUrl } from '@/lib/config'

type Mode = 'delivery' | 'pickup'

export function CartDrawer() {
  const isOpen       = useCart((s) => s.isOpen)
  const closeCart    = useCart((s) => s.closeCart)
  const items        = useCart((s) => s.items)
  const updateQty    = useCart((s) => s.updateQuantity)
  const removeItem   = useCart((s) => s.removeItem)
  const totalPrice   = useCart((s) => s.totalPrice())

  const { locale } = useTranslation()
  const isAr = locale === 'ar'

  const [mode,  setMode]  = useState<Mode>('delivery')
  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  const isEmpty     = items.length === 0
  const canConfirm  = !isEmpty && (mode === 'pickup' || (name.trim() !== '' && phone.trim() !== ''))

  function buildMessage() {
    const lines = items.map((item) => {
      const n = (isAr && item.product.name_ar) ? item.product.name_ar : item.product.name_en
      const shade = item.variant ? `\n   Shade: ${item.variant.shadeName}` : ''
      return `• ${n} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}${shade}`
    })
    const body = lines.join('\n')
    const total = `Total: ${formatPrice(totalPrice)}`

    if (mode === 'pickup') {
      return `Hi Besma Sevdam! I'd like to order for pickup:\n\n${body}\n\n${total}`
    }

    const details = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      notes.trim() ? `Notes: ${notes}` : null,
    ].filter(Boolean).join('\n')

    return `Hi Besma Sevdam! I'd like to order:\n\n${body}\n\n${total}\n\nDelivery Details:\n${details}`
  }

  function handleConfirm() {
    if (!canConfirm) return
    window.open(whatsAppUrl(buildMessage()), '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[520px] rounded-t-[32px] bg-[#FDF9F4] shadow-[0_-8px_50px_rgba(0,0,0,0.18)]"
            style={{ maxHeight: '90dvh' }}
          >
            {/* Drag pill */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-[#C7A98B]/25" />
            </div>

            {/* Scrollable area */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90dvh - 20px)' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4 pt-2">
                <h2 className="font-display text-[21px] font-light italic text-[#111111]">
                  {isEmpty ? 'Your Bag' : `My Bag (${items.length})`}
                </h2>
                <button
                  type="button"
                  onClick={closeCart}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111]/5 text-[#6B5745] transition-colors hover:bg-[#111111]/10"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>

              {isEmpty ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <p className="font-display text-[16px] font-light italic text-[#9E8E80]">Your bag is empty</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-5 text-[9.5px] font-light uppercase tracking-[0.28em] text-[#C7A98B] underline underline-offset-4"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="px-4 pb-8">

                  {/* ── Items ──────────────────────────────────────────────── */}
                  <div className="space-y-2.5 border-b border-[#E8E0D6] pb-5">
                    {items.map((item) => {
                      const n = (isAr && item.product.name_ar) ? item.product.name_ar : item.product.name_en
                      const img = item.variant?.image || item.product.imageUrl
                      const key = `${item.product.id}:${item.variant?.id ?? ''}`
                      return (
                        <div key={key} className="flex items-start gap-3 rounded-2xl bg-white/70 p-3">
                          {/* Thumbnail */}
                          <div className="relative h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-xl bg-[#F0EBE4]">
                            <Image src={img} alt={n} fill className="object-cover" sizes="68px" />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
                            <p className="line-clamp-2 text-[12px] font-light leading-[1.4] text-[#111111]">{n}</p>
                            {item.variant && (
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="h-3 w-3 flex-shrink-0 rounded-full"
                                  style={{ backgroundColor: item.variant.hexColor }}
                                />
                                <p className="text-[10px] font-light text-[#9E8E80]">{item.variant.shadeName}</p>
                              </div>
                            )}
                            <p className="text-[12px] font-semibold text-[#C7A98B]">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id, item.variant?.id)}
                              className="text-[#C4B4A8] transition-colors hover:text-[#9E8E80]"
                              aria-label="Remove"
                            >
                              <X size={12} strokeWidth={1.5} />
                            </button>
                            <div className="flex items-center gap-1.5 rounded-full border border-[#E8E0D6] bg-white px-2.5 py-1.5">
                              <button
                                type="button"
                                onClick={() => updateQty(item.product.id, item.variant?.id ?? null, item.quantity - 1)}
                                className="text-[#9E8E80] transition-colors hover:text-[#111111]"
                                aria-label="Decrease"
                              >
                                <Minus size={10} strokeWidth={1.75} />
                              </button>
                              <span className="w-4 text-center text-[11px] font-light text-[#111111]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.product.id, item.variant?.id ?? null, item.quantity + 1)}
                                className="text-[#9E8E80] transition-colors hover:text-[#111111]"
                                aria-label="Increase"
                              >
                                <Plus size={10} strokeWidth={1.75} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* ── Delivery / Pickup toggle ────────────────────────────── */}
                  <div className="mt-5">
                    <p className="mb-3 text-[8.5px] font-light uppercase tracking-[0.38em] text-[#9E8E80]">
                      How would you like your order?
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#EDE5DA] p-1">
                      {(['delivery', 'pickup'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMode(m)}
                          className={cn(
                            'flex items-center justify-center gap-2 rounded-xl py-3 text-[9.5px] font-light uppercase tracking-[0.18em] transition-all duration-200',
                            mode === m
                              ? 'bg-[#111111] text-white shadow-sm'
                              : 'text-[#9E8E80] hover:text-[#6B5745]',
                          )}
                        >
                          {m === 'delivery'
                            ? <Truck size={13} strokeWidth={1.5} />
                            : <Package size={13} strokeWidth={1.5} />
                          }
                          {m === 'delivery' ? 'Delivery' : 'Pick Up'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Mode-specific form ──────────────────────────────────── */}
                  <AnimatePresence mode="wait">
                    {mode === 'delivery' ? (
                      <motion.div
                        key="delivery-form"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="mt-4 space-y-2.5"
                      >
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-[#E8E0D6] bg-white px-4 py-3 text-[13px] font-light text-[#111111] placeholder-[#C4B4A8] outline-none transition-colors focus:border-[#C7A98B]"
                        />
                        <input
                          type="tel"
                          placeholder="Delivery phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-[#E8E0D6] bg-white px-4 py-3 text-[13px] font-light text-[#111111] placeholder-[#C4B4A8] outline-none transition-colors focus:border-[#C7A98B]"
                        />
                        <textarea
                          placeholder="Special instructions (optional)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          className="w-full resize-none rounded-xl border border-[#E8E0D6] bg-white px-4 py-3 text-[13px] font-light text-[#111111] placeholder-[#C4B4A8] outline-none transition-colors focus:border-[#C7A98B]"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pickup-info"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="mt-4 rounded-xl border border-[#E8E0D6] bg-white/60 p-4 text-center"
                      >
                        <p className="text-[11.5px] font-light leading-[1.7] text-[#9E8E80]">
                          We'll prepare your order — just come by to pick it up at our store.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Total + WhatsApp CTA ────────────────────────────────── */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-light uppercase tracking-[0.22em] text-[#9E8E80]">Total</span>
                      <span className="font-display text-[24px] font-light italic text-[#111111]">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={!canConfirm}
                      className={cn(
                        'flex w-full items-center justify-center gap-2.5 rounded-2xl py-4',
                        'text-[10px] font-light uppercase tracking-[0.28em]',
                        'transition-all duration-300 active:scale-[0.98]',
                        canConfirm
                          ? 'bg-[#111111] text-white hover:bg-[#1C1C1C]'
                          : 'cursor-not-allowed bg-[#E8E0D6] text-[#B0A49A]',
                      )}
                    >
                      <WhatsAppIcon />
                      Confirm on WhatsApp
                    </button>

                    {mode === 'delivery' && (!name.trim() || !phone.trim()) && (
                      <p className="text-center text-[10px] font-light text-[#C4B4A8]">
                        Add your name and phone to continue
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
