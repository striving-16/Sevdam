'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product, Variant } from '@/types'

interface Props {
  products: Product[]
}

export function Offers({ products }: Props) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'

  if (products.length === 0) return null

  return (
    <section
      className="bg-[#111111] px-6 py-24 sm:px-10 sm:py-32 lg:px-14"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Thin gold top border */}
      <div
        className="mx-auto mb-16 max-w-screen-xl"
        style={{ height: 1, background: 'linear-gradient(to right, transparent, #C7A98B 35%, #C7A98B 65%, transparent)' }}
      />

      {/* Section header */}
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C7A98B]"
            >
              Limited Time
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.7 }}
              className="font-display text-[clamp(34px,5vw,64px)] font-light italic leading-[0.95] text-white"
            >
              Special Offers
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block"
          >
            <Link
              href="/products"
              className="font-display text-[13px] italic text-[#C7A98B] underline underline-offset-4 decoration-[#C7A98B]/40 transition-all hover:decoration-[#C7A98B]"
            >
              View all →
            </Link>
          </motion.div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {products.slice(0, 4).map((product, i) => (
            <OfferCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom gold hairline */}
      <div
        className="mx-auto mt-16 max-w-screen-xl"
        style={{ height: 1, background: 'linear-gradient(to right, transparent, #C7A98B 35%, #C7A98B 65%, transparent)' }}
      />
    </section>
  )
}

function OfferCard({ product, index }: { product: Product; index: number }) {
  const addItem    = useCart((s) => s.addItem)
  const { locale } = useTranslation()
  const isAr       = locale === 'ar'
  const name       = (isAr && product.name_ar) ? product.name_ar : product.name_en

  const hasVariants  = product.hasVariants && product.variants.length > 0
  const firstVariant = hasVariants ? product.variants[0] : null

  const [selected, setSelected] = useState<Variant | null>(firstVariant)
  const [added,    setAdded]    = useState(false)

  const displayImage = (selected?.image ?? null) || product.imageUrl
  const stock        = selected ? selected.stock : product.stock
  const soldOut      = stock === 0

  const discount =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product, selected, 1)
    const shade = selected ? ` — ${selected.shadeName}` : ''
    toast.success(`${name}${shade}`, { description: 'Added to your bag' })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '3/4',
            background: 'radial-gradient(ellipse 80% 70% at 50% 40%, #F0EAE0 0%, #E8E0D4 55%, #DDD5C8 100%)',
          }}
        >
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-contain object-center p-4 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, 25vw"
            loading="lazy"
          />

          {/* Discount badge */}
          {discount && (
            <div className="absolute left-3 top-3 z-10">
              <span className="block rounded-full bg-[#C7A98B] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.15em] text-white">
                -{discount}%
              </span>
            </div>
          )}

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
              <span className="text-[9px] font-light uppercase tracking-[0.3em] text-[#8A8A8A]">Sold Out</span>
            </div>
          )}

          {!soldOut && (
            <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full pb-4 text-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mx-3 bg-white/95 py-3 backdrop-blur-sm">
                <button
                  onClick={handleAdd}
                  className="text-[9.5px] font-light uppercase tracking-[0.22em] text-[#111111] transition-colors hover:text-[#C7A98B]"
                >
                  {added ? '✓ Added' : 'Add to Bag'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Shade circles */}
      {hasVariants && (
        <div className="mt-3 flex items-center gap-1.5">
          {product.variants.slice(0, 6).map((v) => (
            <button
              key={v.id}
              title={v.shadeName}
              onClick={(e) => { e.preventDefault(); setSelected(v) }}
              className="flex-shrink-0 rounded-full transition-transform duration-200 hover:scale-110"
              style={{
                width: 13, height: 13,
                backgroundColor: v.hexColor,
                boxShadow: selected?.id === v.id
                  ? `0 0 0 1.5px #111, 0 0 0 3px ${v.hexColor}`
                  : '0 0 0 0.5px rgba(255,255,255,0.2)',
              }}
              aria-label={v.shadeName}
            />
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-3 space-y-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-[clamp(14px,1.5vw,18px)] font-light italic leading-[1.25] text-white transition-colors hover:text-[#C7A98B]">
            {name}
          </h3>
        </Link>

        {/* Price — original crossed out + sale price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          {product.salePrice ? (
            <>
              <span className="text-[17px] font-light tracking-[0.02em] text-[#C7A98B]">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-[12px] font-light text-white/30 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-[17px] font-light tracking-[0.02em] text-white">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {!soldOut && (
          <button
            onClick={handleAdd}
            className="mt-1.5 block text-[8.5px] font-light uppercase tracking-[0.22em] text-[#C7A98B] underline underline-offset-3 decoration-[#C7A98B]/40 transition-all hover:decoration-[#C7A98B] lg:hidden"
          >
            {added ? '✓ Added' : '+ Add to Bag'}
          </button>
        )}
      </div>
    </motion.article>
  )
}
