'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

const FILTERS = [
  { key: 'all',      label: 'All'       },
  { key: 'SKINCARE', label: 'Skincare'  },
  { key: 'HAIRCARE', label: 'Hair Care' },
  { key: 'PERFUMES', label: 'Perfumes'  },
  { key: 'MAKEUP',   label: 'Makeup'    },
  { key: 'BODYCARE', label: 'Body Care' },
]

export function BestSellers({ products }: { products: Product[] }) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const [active, setActive] = useState('all')

  const filtered = active === 'all'
    ? products.slice(0, 8)
    : products.filter((p) => p.category === active).slice(0, 8)

  const display = filtered.length > 0 ? filtered : products.slice(0, 8)

  return (
    <section className="bg-[#FAFAF8] py-16 sm:py-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
              Our picks
            </p>
            <h2 className="font-display text-[clamp(26px,3.5vw,40px)] font-light italic text-[#1C1917]">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products"
            className="self-start rounded-full border border-[#E8E0D8] bg-white px-6 py-2.5 text-[11px] font-light text-[#1C1917] transition-all hover:border-[#C9A882] hover:shadow-sm sm:self-auto"
          >
            View all products
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={[
                'flex-shrink-0 rounded-full px-4 py-2 text-[11.5px] font-light transition-all duration-200',
                active === f.key
                  ? 'bg-[#1C1917] text-white'
                  : 'border border-[#E8E0D8] bg-white text-[#78716C] hover:border-[#C9A882] hover:text-[#1C1917]',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {display.map((product, i) => (
              <BestSellerCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function BestSellerCard({ product, index }: { product: Product; index: number }) {
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)
  const { locale } = useTranslation()
  const isAr = locale === 'ar'
  const soldOut = product.stock === 0
  const name = (isAr && product.name_ar) ? product.name_ar : product.name_en

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product)
    toast.success(name, { description: 'Added to cart' })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl border border-[#F0EAE0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-[#F5F2EE]" style={{ aspectRatio: '3/4' }}>
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          {product.isBestseller && !soldOut && (
            <span className="absolute left-2.5 top-2.5 rounded-md bg-[#1C1917]/75 px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
              Bestseller
            </span>
          )}
          {soldOut && (
            <span className="absolute left-2.5 top-2.5 rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-neutral-500 backdrop-blur-sm">
              Sold out
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        {product.brand && (
          <p className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#C9A882]">
            {product.brand}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-[#1C1917] transition-colors hover:text-[#78716C]">
            {name}
          </h3>
        </Link>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="text-[13px] font-bold text-[#1C1917]">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={soldOut ? 'Sold out' : 'Add to cart'}
            className={[
              'flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-medium transition-all duration-200 shrink-0',
              soldOut
                ? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
                : added
                  ? 'bg-[#1C1917] text-white'
                  : 'bg-[#1C1917] text-white hover:bg-black active:scale-95',
            ].join(' ')}
          >
            {added
              ? <><Check size={10} strokeWidth={2.5} /> Added</>
              : <><Plus size={10} strokeWidth={2.5} /> Add</>
            }
          </button>
        </div>
      </div>
    </motion.article>
  )
}
