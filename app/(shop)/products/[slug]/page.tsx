import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProductBySlug, getProducts } from '@/actions/product-actions'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { ProductWhatsAppButton } from '@/components/products/product-whatsapp-button'
import { formatPrice } from '@/lib/utils'
import { getServerT } from '@/lib/i18n/server'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  return { title: `${product.name_en} — Dreamshop`, description: product.description_en }
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

const CATEGORY_LABELS: Record<string, string> = {
  SKINCARE:  'Skincare',
  HAIRCARE:  'Hair Care',
  PERFUMES:  'Perfumes',
  MAKEUP:    'Makeup',
  BODYCARE:  'Body Care',
  MENCARE:   "Men's Care",
  BABYCARE:  'Baby Care',
  TOOLS:     'Beauty Tools',
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [product, { t, dir, locale }] = await Promise.all([getProductBySlug(slug), getServerT()])
  if (!product) notFound()

  const isRtl = dir === 'rtl'
  const isAr  = locale === 'ar'
  const isOutOfStock = product.stock === 0
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const name        = (isAr && product.name_ar)        ? product.name_ar        : product.name_en
  const description = (isAr && product.description_ar) ? product.description_ar : product.description_en

  return (
    <div className="min-h-screen bg-white pt-[104px]" dir={dir}>
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
        <div className={`grid gap-0 lg:grid-cols-[1fr_480px] lg:min-h-[calc(100vh-104px)] ${isRtl ? 'lg:grid-flow-dense' : ''}`}>

          {/* Image */}
          <div className={`relative bg-[#F7F4F0] ${isRtl ? 'lg:col-start-2' : ''}`}>
            <div className="sticky top-[104px]">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <Image
                  src={product.imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {product.isBestseller && (
                  <span className="absolute left-5 top-5 rounded-full bg-[#C9A882] px-3 py-1.5 text-[10px] font-light uppercase tracking-wider text-white">
                    {t.common.bestseller}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className={`flex flex-col justify-between border-[#F0EAE0] px-8 py-12 sm:px-10 lg:border-s lg:py-16 ${isRtl ? 'lg:col-start-1 lg:row-start-1 text-right' : ''}`}>
            <div>
              {/* Breadcrumb */}
              <nav className={`mb-8 flex items-center gap-2 text-[11px] font-light text-[#B8AFA8] ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Link href="/" className="hover:text-[#1C1917]">Home</Link>
                <span>/</span>
                <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-[#1C1917]">{categoryLabel}</Link>
                <span>/</span>
                <span className="text-[#78716C]">{name}</span>
              </nav>

              <p className="mb-3 text-[10px] font-light uppercase text-[#C9A882]" style={{ letterSpacing: isRtl ? 0 : '0.36em' }}>
                {categoryLabel}
              </p>

              <h1 className="font-display text-[clamp(24px,3.5vw,38px)] font-light leading-[1.15] text-[#1C1917]">
                {name}
              </h1>

              {product.brand && (
                <p className="mt-1 text-[13px] font-light text-[#B8AFA8]">{product.brand}</p>
              )}

              <div className={`mt-6 flex items-baseline gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="font-display text-[32px] font-light text-[#1C1917]">
                  {formatPrice(product.price)}
                </span>
              </div>

              {!isOutOfStock && product.stock <= 8 && (
                <p className="mt-2 text-[12px] font-light text-[#C9A882]">
                  Only {product.stock} left in stock
                </p>
              )}

              <p className="mt-6 text-[14px] font-light leading-[1.85] text-[#78716C]">
                {description}
              </p>

              {product.tags && product.tags.length > 0 && (
                <div className={`mt-5 flex flex-wrap gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  {product.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#F5F0EB] px-3 py-1 text-[10px] font-light text-[#78716C]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="my-8 h-px bg-[#F0EAE0]" />

              <AddToCartButton product={product} />
              <ProductWhatsAppButton product={product} className="mt-3" />

              <div className={`mt-8 grid grid-cols-3 gap-3 ${isRtl ? 'text-right' : ''}`}>
                {[
                  { icon: '✓', text: '100% Authentic' },
                  { icon: '↩', text: '30-Day Returns' },
                  { icon: '⚡', text: 'Fast Delivery' },
                ].map((badge) => (
                  <div key={badge.text} className="rounded-xl border border-[#F0EAE0] bg-[#FAFAF8] p-3 text-center">
                    <p className="text-[14px] text-[#C9A882]">{badge.icon}</p>
                    <p className="mt-1 text-[10px] font-light text-[#78716C]">{badge.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-8 border-t border-[#F0EAE0] pt-6 ${isRtl ? 'text-right' : ''}`}>
              <p className="text-[11px] font-light text-[#B8AFA8]">
                SKU: {product.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(product.benefits || product.ingredients || product.usage) && (
        <div className="border-t border-[#F0EAE0] bg-[#FAFAF8]">
          <div className="mx-auto max-w-screen-xl px-5 py-16 sm:px-8 lg:px-12">
            <div className="grid gap-10 md:grid-cols-3">
              {product.benefits && (
                <div className={isRtl ? 'text-right' : ''}>
                  <h3 className="mb-4 text-[10px] font-light uppercase tracking-[0.36em] text-[#C9A882]">Benefits</h3>
                  <p className="text-[13px] font-light leading-[1.85] text-[#78716C]">{product.benefits}</p>
                </div>
              )}
              {product.ingredients && (
                <div className={isRtl ? 'text-right' : ''}>
                  <h3 className="mb-4 text-[10px] font-light uppercase tracking-[0.36em] text-[#C9A882]">Ingredients</h3>
                  <p className="text-[13px] font-light leading-[1.85] text-[#78716C]">{product.ingredients}</p>
                </div>
              )}
              {product.usage && (
                <div className={isRtl ? 'text-right' : ''}>
                  <h3 className="mb-4 text-[10px] font-light uppercase tracking-[0.36em] text-[#C9A882]">How to Use</h3>
                  <p className="text-[13px] font-light leading-[1.85] text-[#78716C]">{product.usage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
