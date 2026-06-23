'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Tag, Loader2, Check } from 'lucide-react'
import { toggleProductOffer, getProducts } from '@/actions/product-actions'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { useEffect } from 'react'
import Image from 'next/image'

export default function AdminOffersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getProducts().then((p) => { setProducts(p); setLoading(false) })
  }, [])

  function handleToggle(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  const onOffer = products.filter((p) => p.isOffer)
  const others  = products.filter((p) => !p.isOffer)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Offers</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">
          Mark products as "on offer" with a sale price — they appear in the Offers section on your homepage.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="animate-spin text-neutral-300" />
        </div>
      ) : (
        <>
          {/* Active offers */}
          {onOffer.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
                Active Offers — {onOffer.length}
              </p>
              <div className="space-y-2">
                {onOffer.map((p) => (
                  <OfferRow key={p.id} product={p} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          )}

          {/* All other products */}
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              All Products
            </p>
            <div className="space-y-2">
              {others.map((p) => (
                <OfferRow key={p.id} product={p} onToggle={handleToggle} />
              ))}
            </div>
          </div>

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-24 text-center">
              <Tag size={28} strokeWidth={1} className="mb-3 text-neutral-300" />
              <p className="text-[14px] font-light text-neutral-500">No products yet</p>
              <p className="mt-1 text-[12px] font-light text-neutral-400">
                Add products first, then mark them as offers here
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function OfferRow({
  product,
  onToggle,
}: {
  product: Product
  onToggle: (updated: Product) => void
}) {
  const [isPending, start] = useTransition()
  const [saleInput, setSaleInput] = useState(
    product.salePrice ? String(Math.round(product.salePrice)) : ''
  )

  const discount =
    product.isOffer && product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null

  function toggle() {
    if (!product.isOffer) {
      const sale = saleInput ? Number(saleInput) : null
      if (sale !== null && (isNaN(sale) || sale <= 0 || sale >= product.price)) {
        toast.error('Sale price must be lower than the original price')
        return
      }
      start(async () => {
        await toggleProductOffer(product.id, true, sale)
        onToggle({ ...product, isOffer: true, salePrice: sale })
        toast.success(`${product.name_en} added to offers`)
      })
    } else {
      start(async () => {
        await toggleProductOffer(product.id, false, null)
        onToggle({ ...product, isOffer: false, salePrice: null })
        toast.success(`${product.name_en} removed from offers`)
      })
    }
  }

  return (
    <div className={[
      'flex items-center gap-4 rounded-xl border px-4 py-3 transition-all',
      product.isOffer
        ? 'border-amber-200 bg-amber-50/50'
        : 'border-neutral-100 bg-white hover:border-neutral-200',
    ].join(' ')}>
      {/* Thumbnail */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name_en} className="h-full w-full object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-normal text-neutral-800">{product.name_en}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className={['text-[12px] font-light', product.isOffer ? 'text-neutral-400 line-through' : 'text-neutral-600'].join(' ')}>
            {formatPrice(product.price)}
          </span>
          {product.isOffer && product.salePrice && (
            <span className="text-[12px] font-medium text-amber-700">
              {formatPrice(product.salePrice)}
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-medium text-white">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Sale price input — only visible when not yet an offer */}
      {!product.isOffer && (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={saleInput}
            onChange={(e) => setSaleInput(e.target.value)}
            placeholder="Sale price"
            className="h-8 w-28 rounded-lg border border-neutral-200 px-2.5 text-[12px] font-light text-neutral-700 focus:border-amber-400 focus:outline-none"
            min={1}
            max={product.price - 1}
          />
          <span className="text-[10px] text-neutral-400">MRU</span>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        disabled={isPending}
        className={[
          'flex h-8 items-center gap-1.5 rounded-full px-4 text-[12px] font-light transition-all',
          isPending ? 'opacity-50 cursor-not-allowed' : '',
          product.isOffer
            ? 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            : 'bg-neutral-900 text-white hover:bg-neutral-700',
        ].join(' ')}
      >
        {isPending ? (
          <Loader2 size={11} className="animate-spin" />
        ) : product.isOffer ? (
          'Remove offer'
        ) : (
          <>
            <Tag size={11} />
            Add offer
          </>
        )}
      </button>
    </div>
  )
}
