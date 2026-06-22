'use client'

import { useState, useTransition } from 'react'
import { Phone, Search, Package, ChevronRight, Loader2 } from 'lucide-react'
import { getOrdersByPhone } from '@/actions/order-actions'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import type { Order } from '@/types'

const DELIVERY_LABELS: Record<string, string> = {
  home:    'Home Delivery',
  express: 'Express Delivery',
  pickup:  'Store Pickup',
}

export default function TrackOrderPage() {
  const [phone, setPhone]     = useState('')
  const [orders, setOrders]   = useState<Order[] | null>(null)
  const [pending, start]      = useTransition()
  const [searched, setSearched] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = phone.trim()
    if (!q) return
    setSearched(false)
    start(async () => {
      const result = await getOrdersByPhone(q)
      setOrders(result)
      setSearched(true)
    })
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-5 pb-24 pt-[120px] sm:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F0EB]">
            <Package size={22} strokeWidth={1.5} className="text-[#C9A882]" />
          </div>
          <h1 className="font-display text-[28px] font-light italic tracking-[-0.01em] text-[#1C1917]">
            Track Your Order
          </h1>
          <p className="mt-2 text-[13px] font-light text-[#78716C]">
            Enter the phone number you used when ordering
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Phone
                size={14}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AFA8]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 36234567"
                dir="ltr"
                className="h-12 w-full rounded-full border border-[#E8E0D8] bg-white pl-10 pr-4 text-[14px] font-light text-[#1C1917] outline-none transition placeholder:text-[#C8C2BA] focus:border-[#C9A882] focus:shadow-[0_0_0_3px_rgba(201,168,130,0.12)]"
              />
            </div>
            <button
              type="submit"
              disabled={pending || !phone.trim()}
              className="flex h-12 items-center gap-2 rounded-full bg-[#1C1917] px-6 text-[13px] font-light text-white transition-colors hover:bg-[#2C2927] disabled:opacity-40"
            >
              {pending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} strokeWidth={1.5} />
              )}
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && orders !== null && (
          orders.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E0D8] bg-white px-8 py-12 text-center">
              <p className="text-[15px] font-light text-[#1C1917]">No orders found</p>
              <p className="mt-1.5 text-[13px] font-light text-[#78716C]">
                Check the number and try again, or contact us on WhatsApp
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[12px] font-light text-[#78716C]">
                {orders.length} order{orders.length !== 1 ? 's' : ''} found
              </p>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )
        )}
      </div>
    </main>
  )
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const statusColor = ORDER_STATUS_COLORS[order.status] ?? 'bg-neutral-50 text-neutral-600 border-neutral-200'
  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E0D8] bg-white">
      {/* Card header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFAF8]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#F5F0EB]">
            <Package size={16} strokeWidth={1.5} className="text-[#C9A882]" />
          </div>
          <div>
            <p className="text-[13px] font-normal text-[#1C1917]">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
            <p className="mt-0.5 text-[11px] font-light text-[#78716C]">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
              {' · '}
              {DELIVERY_LABELS[order.deliveryType] ?? order.deliveryType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-light ${statusColor}`}>
            {statusLabel}
          </span>
          <ChevronRight
            size={15}
            strokeWidth={1.5}
            className={`text-[#B8AFA8] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {/* Expandable items */}
      {open && (
        <div className="border-t border-[#F0EAE0] px-6 pb-5 pt-4">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#B8AFA8]">
            Items
          </p>
          <div className="space-y-2.5">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.product?.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="text-[13px] font-light text-[#1C1917]">
                      {item.product?.name_en ?? 'Product'}
                    </p>
                    <p className="text-[11px] font-light text-[#78716C]">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] font-light text-[#1C1917]">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#F0EAE0] pt-4">
            <p className="text-[12px] font-light text-[#78716C]">Total</p>
            <p className="text-[15px] font-light text-[#1C1917]">{formatPrice(order.totalPrice)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
