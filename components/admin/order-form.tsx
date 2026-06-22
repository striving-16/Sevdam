'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Minus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createAdminOrder } from '@/actions/order-actions'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

type LineItem = {
  product: Product
  quantity: number
}

const DELIVERY_OPTIONS = [
  { value: 'home',    label: 'Home Delivery'   },
  { value: 'express', label: 'Express Delivery' },
  { value: 'pickup',  label: 'Store Pickup'     },
]

const FIELD = 'h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-light text-neutral-800 outline-none transition focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] placeholder:text-neutral-300'

export function OrderForm({ products }: { products: Product[] }) {
  const router = useRouter()

  const [query, setQuery]           = useState('')
  const [items, setItems]           = useState<LineItem[]>([])
  const [name, setName]             = useState('')
  const [phone, setPhone]           = useState('')
  const [delivery, setDelivery]     = useState('home')
  const [address, setAddress]       = useState('')
  const [pending, startTransition]  = useTransition()

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name_en.toLowerCase().includes(query.toLowerCase()) ||
          (p.brand ?? '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  function addProduct(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
    setQuery('')
  }

  function changeQty(productId: string, delta: number) {
    setItems((prev) =>
      prev
        .map((i) => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    )
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Customer name is required'); return }
    if (!phone.trim()) { toast.error('Customer phone is required'); return }
    if (items.length === 0) { toast.error('Add at least one product'); return }
    if (delivery !== 'pickup' && !address.trim()) { toast.error('Address is required for delivery'); return }

    startTransition(async () => {
      try {
        const { orderId } = await createAdminOrder(
          {
            customerName:    name.trim(),
            customerPhone:   phone.trim(),
            customerAddress: address.trim(),
            deliveryType:    delivery,
          },
          items.map((i) => ({
            productId: i.product.id,
            quantity:  i.quantity,
            price:     i.product.price,
          }))
        )
        toast.success('Order logged')
        router.push(`/admin/orders/${orderId}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to create order')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">

      {/* ── Left: customer + products ── */}
      <div className="space-y-6">

        {/* Customer info */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            Customer Info
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-light text-neutral-500">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className={FIELD} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-light text-neutral-500">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 36234567" type="tel" dir="ltr" className={FIELD} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-light text-neutral-500">Delivery Type</label>
              <select value={delivery} onChange={(e) => setDelivery(e.target.value)} className={FIELD}>
                {DELIVERY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {delivery !== 'pickup' && (
              <div>
                <label className="mb-1.5 block text-[11px] font-light text-neutral-500">Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" className={FIELD} />
              </div>
            )}
          </div>
        </div>

        {/* Product search */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            Products
          </p>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name or brand…"
              className={`${FIELD} pl-9`}
            />
            {filtered.length > 0 && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addProduct(p)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                  >
                    <div>
                      <p className="text-[13px] font-normal text-neutral-800">{p.name_en}</p>
                      <p className="text-[11px] font-light text-neutral-400">
                        {p.brand ? `${p.brand} · ` : ''}{p.category.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-light text-neutral-700">{formatPrice(p.price)}</p>
                      <p className="text-[10px] font-light text-neutral-400">Stock: {p.stock}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected items */}
          {items.length > 0 && (
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 px-4 py-3">
                  {item.product.imageUrl && (
                    <img src={item.product.imageUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-normal text-neutral-800">{item.product.name_en}</p>
                    <p className="text-[11px] font-light text-neutral-400">{formatPrice(item.product.price)} each</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => changeQty(item.product.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                      <Minus size={11} strokeWidth={2} />
                    </button>
                    <span className="w-7 text-center text-[13px] font-light text-neutral-800">{item.quantity}</span>
                    <button type="button" onClick={() => changeQty(item.product.id, +1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                      <Plus size={11} strokeWidth={2} />
                    </button>
                  </div>
                  <p className="w-20 text-right text-[13px] font-light text-neutral-700">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <button type="button" onClick={() => removeItem(item.product.id)} className="ml-1 text-neutral-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {items.length === 0 && (
            <p className="mt-4 text-center text-[12px] font-light text-neutral-400">
              Search and add products above
            </p>
          )}
        </div>

      </div>

      {/* ── Right: summary + submit ── */}
      <div className="lg:sticky lg:top-[80px] lg:self-start">
        <div className="rounded-xl border border-neutral-100 bg-white p-5">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            Order Summary
          </p>

          {items.length === 0 ? (
            <p className="py-6 text-center text-[12px] font-light text-neutral-400">No products added</p>
          ) : (
            <div className="space-y-2.5">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <p className="text-[12px] font-light text-neutral-600 line-clamp-1 max-w-[180px]">
                    {item.product.name_en} ×{item.quantity}
                  </p>
                  <p className="text-[12px] font-light text-neutral-700">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="mt-3 border-t border-neutral-100 pt-3 flex justify-between">
                <p className="text-[13px] font-normal text-neutral-700">Total</p>
                <p className="text-[15px] font-light text-neutral-900">{formatPrice(total)}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={pending || items.length === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3 text-[13px] font-light text-white transition-colors hover:bg-neutral-700 disabled:opacity-40"
          >
            {pending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : 'Log Order'}
          </button>
        </div>
      </div>

    </form>
  )
}
