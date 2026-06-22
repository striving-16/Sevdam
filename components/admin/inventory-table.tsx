'use client'

import { useState, useTransition } from 'react'
import { Check, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { updateProductStock } from '@/actions/product-actions'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

function StockCell({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(product.stock))
  const [pending, startTransition] = useTransition()

  function save() {
    const next = parseInt(value, 10)
    if (isNaN(next) || next < 0) {
      toast.error('Invalid stock value')
      return
    }
    startTransition(async () => {
      try {
        await updateProductStock(product.id, next)
        toast.success(`Stock updated to ${next}`)
        setEditing(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Update failed')
      }
    })
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') { setValue(String(product.stock)); setEditing(false) }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
          className="h-8 w-20 rounded-lg border border-neutral-300 bg-white px-2.5 text-center text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400"
        />
        <button
          onClick={save}
          disabled={pending}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          <Check size={12} strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={cn(
        'group flex h-8 min-w-[56px] items-center justify-center gap-1.5 rounded-lg border px-3 text-[13px] font-light transition-all hover:border-neutral-300',
        product.stock === 0
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
          : product.stock <= 5
            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
            : 'border-neutral-100 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
      )}
      title="Click to edit stock"
    >
      {product.stock === 0 && <AlertTriangle size={11} strokeWidth={2} />}
      {product.stock}
    </button>
  )
}

function stockStatus(stock: number) {
  if (stock === 0) return { label: 'Out of stock', cls: 'bg-red-50 text-red-600 border-red-200' }
  if (stock <= 5)  return { label: 'Low stock',    cls: 'bg-amber-50 text-amber-700 border-amber-200' }
  return               { label: 'In stock',     cls: 'bg-green-50 text-green-700 border-green-200' }
}

export function InventoryTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-100">
            {['Product', 'Category', 'Brand', 'Status', 'Stock'].map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const status = stockStatus(product.stock)
            return (
              <tr
                key={product.id}
                className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/40"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {product.imageUrl && (
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <img src={product.imageUrl} alt={product.name_en} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-normal text-neutral-800">{product.name_en}</p>
                      <p className="font-mono text-[10px] text-neutral-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[12px] font-light text-neutral-500">
                    {product.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[12px] font-light text-neutral-500">
                    {product.brand ?? '—'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-light',
                      status.cls
                    )}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <StockCell product={product} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
