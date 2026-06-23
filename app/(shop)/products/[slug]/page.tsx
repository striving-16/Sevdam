import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProductBySlug, getProducts } from '@/actions/product-actions'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { ProductWhatsAppButton } from '@/components/products/product-whatsapp-button'
import { formatPrice } from '@/lib/utils'
import { getServerT } from '@/lib/i18n/server'
import type { Metadata } from 'next'
import { DEMO_PRODUCTS } from '@/lib/demo-products'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
    ?? DEMO_PRODUCTS.find((p) => p.slug === slug)
    ?? null
  if (!product) return { title: 'Product not found' }
  return {
    title: `${product.name_en} — Besma Sevdam`,
    description: product.description_en,
  }
}

export async function generateStaticParams() {
  const dbProducts = await getProducts().catch(() => [])
  const demoSlugs = DEMO_PRODUCTS.map((p) => ({ slug: p.slug }))
  const dbSlugs   = dbProducts.map((p) => ({ slug: p.slug }))
  return [...demoSlugs, ...dbSlugs]
}

const CATEGORY_LABELS: Record<string, string> = {
  SKINCARE: 'Skincare',
  HAIRCARE: 'Hair Care',
  PERFUMES: 'Perfumes',
  MAKEUP:   'Makeup',
  BODYCARE: 'Body Care',
  MENCARE:  "Men's Care",
  BABYCARE: 'Baby Care',
  TOOLS:    'Beauty Tools',
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const { t, dir, locale } = await getServerT()

  const product = await getProductBySlug(slug).catch(() => null)
    ?? DEMO_PRODUCTS.find((p) => p.slug === slug)
    ?? null

  if (!product) notFound()

  const isRtl       = dir === 'rtl'
  const isAr        = locale === 'ar'
  const isOutOfStock = product.stock === 0
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const name        = (isAr && product.name_ar)        ? product.name_ar        : product.name_en
  const description = (isAr && product.description_ar) ? product.description_ar : product.description_en

  /* Fallback content for detail sections — always shown */
  const benefits = product.benefits
    ?? `Luxuriously formulated to deliver visible results from the very first use. Our advanced complex nourishes and perfects for a flawless, long-lasting finish that moves with you through the day.`

  const ingredients = product.ingredients
    ?? `Crafted from the finest cosmetic-grade ingredients, rigorously tested for safety and efficacy. Free from parabens, sulfates, and artificial fragrances.`

  const usage = product.usage
    ?? `Apply to clean, prepared skin using the included applicator or a soft brush. Build coverage as desired and set for extended wear. For best results, use as part of your complete Besma Sevdam ritual.`

  return (
    <div className="min-h-screen bg-white" dir={dir}>

      {/* ── Product hero — image + info ─────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl pt-[104px]">
        <div className={`grid lg:grid-cols-[1fr_480px] lg:min-h-[calc(100vh-104px)] ${isRtl ? 'lg:grid-flow-dense' : ''}`}>

          {/* Image */}
          <div className={`relative bg-[#F5F0EA] ${isRtl ? 'lg:col-start-2' : ''}`}>
            <div className="sticky top-[104px]">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                {/* Grain texture */}
                <div className="grain absolute inset-0 z-10 pointer-events-none" />
                <Image
                  src={product.imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {product.isBestseller && (
                  <span
                    className="absolute left-5 top-5 z-20 rounded-full bg-white/85 px-3.5 py-1.5 text-[8.5px] font-light uppercase backdrop-blur-sm"
                    style={{ letterSpacing: '0.2em', color: '#C9A96E' }}
                  >
                    Bestseller
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className={`flex flex-col border-[#EDE5DA] px-8 py-12 sm:px-10 lg:border-s lg:py-16 ${isRtl ? 'lg:col-start-1 lg:row-start-1 text-right' : ''}`}>

            {/* Breadcrumb */}
            <nav className={`mb-8 flex items-center gap-2 text-[11px] font-light text-[#C9A96E]/60 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Link href="/" className="hover:text-[#C9A96E] transition-colors">Home</Link>
              <span className="text-[#EDE5DA]">/</span>
              <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-[#C9A96E] transition-colors">
                {categoryLabel}
              </Link>
              <span className="text-[#EDE5DA]">/</span>
              <span className="text-[#9E8E80]">{name}</span>
            </nav>

            {/* Category label */}
            <p
              className="mb-3 text-[8.5px] font-light uppercase text-[#C9A96E]"
              style={{ letterSpacing: isRtl ? 0 : '0.4em' }}
            >
              {categoryLabel}
            </p>

            {/* Product name */}
            <h1 className="font-display text-[clamp(26px,3.5vw,42px)] font-light italic leading-[1.1] text-[#1A1714]">
              {name}
            </h1>

            {/* Price */}
            <div className={`mt-5 flex items-baseline gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="font-display text-[34px] font-light italic text-[#1A1714]">
                {formatPrice(product.price)}
              </span>
            </div>

            {!isOutOfStock && product.stock <= 8 && (
              <p className="mt-2 text-[12px] font-light text-[#C9A96E]">
                Only {product.stock} remaining
              </p>
            )}

            {/* Gold hairline */}
            <div className="my-7 h-px bg-gradient-to-r from-[#C9A96E]/30 via-[#C9A96E] to-[#C9A96E]/30" />

            {/* Description */}
            <p className="text-[14px] font-light leading-[1.9] text-[#6B5745]">
              {description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className={`mt-5 flex flex-wrap gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#EDE5DA] bg-[#FDF9F4] px-3 py-1 text-[9.5px] font-light text-[#9E8E80]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Gold hairline */}
            <div className="my-7 h-px bg-[#EDE5DA]" />

            {/* CTA buttons */}
            <AddToCartButton product={product} />
            <ProductWhatsAppButton product={product} className="mt-3" />

            {/* Trust badges */}
            <div className={`mt-8 grid grid-cols-3 gap-3 ${isRtl ? 'text-right' : ''}`}>
              {[
                { symbol: '✓', text: '100% Authentic' },
                { symbol: '↩', text: '30-Day Returns' },
                { symbol: '⚡', text: 'Fast Delivery' },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="rounded-xl border border-[#EDE5DA] bg-[#FDF9F4] p-3 text-center"
                >
                  <p className="text-[13px] text-[#C9A96E]">{badge.symbol}</p>
                  <p className="mt-1 text-[9.5px] font-light text-[#9E8E80]">{badge.text}</p>
                </div>
              ))}
            </div>

            {/* SKU */}
            <div className={`mt-8 border-t border-[#EDE5DA] pt-6 ${isRtl ? 'text-right' : ''}`}>
              <p className="text-[10.5px] font-light text-[#C9A96E]/50">
                SKU: {product.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Details — always shown ──────────────────────────────────── */}
      <div className="border-t border-[#EDE5DA] bg-[#FDF9F4]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 sm:px-10 lg:px-14">

          {/* Section label */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C9A96E]">
              The Details
            </p>
            <h2 className="font-display text-[clamp(26px,3.5vw,44px)] font-light italic text-[#1A1714]">
              What Makes It Special
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Benefits */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-[18px] text-[#C9A96E]">◇</span>
                <h3 className="text-[10px] font-light uppercase tracking-[0.36em] text-[#1A1714]">
                  Benefits
                </h3>
              </div>
              <div className="h-px bg-gradient-to-r from-[#C9A96E]/40 to-transparent mb-5" />
              <p className="text-[13.5px] font-light leading-[1.9] text-[#6B5745]">
                {benefits}
              </p>
            </div>

            {/* How to Use */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-[18px] text-[#C9A96E]">◇</span>
                <h3 className="text-[10px] font-light uppercase tracking-[0.36em] text-[#1A1714]">
                  How to Use
                </h3>
              </div>
              <div className="h-px bg-gradient-to-r from-[#C9A96E]/40 to-transparent mb-5" />
              <p className="text-[13.5px] font-light leading-[1.9] text-[#6B5745]">
                {usage}
              </p>
            </div>

            {/* Ingredients */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-[18px] text-[#C9A96E]">◇</span>
                <h3 className="text-[10px] font-light uppercase tracking-[0.36em] text-[#1A1714]">
                  Ingredients
                </h3>
              </div>
              <div className="h-px bg-gradient-to-r from-[#C9A96E]/40 to-transparent mb-5" />
              <p className="text-[13.5px] font-light leading-[1.9] text-[#6B5745]">
                {ingredients}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Brand promise strip ──────────────────────────────────────────────── */}
      <div className="border-t border-[#EDE5DA] bg-white">
        <div className="mx-auto grid max-w-screen-xl grid-cols-2 px-6 py-12 sm:px-10 md:grid-cols-4 lg:px-14">
          {[
            { icon: '✦', headline: 'Cruelty-Free', sub: 'Never tested on animals' },
            { icon: '✦', headline: 'Dermatologist Tested', sub: 'Safe for all skin types' },
            { icon: '✦', headline: 'Premium Formulas', sub: 'Luxury cosmetic-grade ingredients' },
            { icon: '✦', headline: 'Made with Care', sub: 'Crafted with intention, always' },
          ].map((item) => (
            <div key={item.headline} className="border-r border-[#EDE5DA] py-6 pr-6 text-center last:border-r-0">
              <p className="mb-2 text-[13px] text-[#C9A96E]">{item.icon}</p>
              <p className="font-display text-[13px] font-light italic text-[#1A1714]">{item.headline}</p>
              <p className="mt-1 text-[11px] font-light text-[#9E8E80]">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
