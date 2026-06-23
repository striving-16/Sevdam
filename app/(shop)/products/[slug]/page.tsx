import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getProducts } from '@/actions/product-actions'
import { getServerT } from '@/lib/i18n/server'
import { formatPrice } from '@/lib/utils'
import { DEMO_PRODUCTS } from '@/lib/demo-products'
import { ProductPageClient } from '@/components/products/product-page-client'
import { CATEGORY_LABELS } from '@/lib/validations'
import type { Metadata } from 'next'

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
  const demoSlugs  = DEMO_PRODUCTS.map((p) => ({ slug: p.slug }))
  const dbSlugs    = dbProducts.map((p) => ({ slug: p.slug }))
  return [...demoSlugs, ...dbSlugs]
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const { dir, locale } = await getServerT()

  const product = await getProductBySlug(slug).catch(() => null)
    ?? DEMO_PRODUCTS.find((p) => p.slug === slug)
    ?? null

  if (!product) notFound()

  const isRtl         = dir === 'rtl'
  const isAr          = locale === 'ar'
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category
  const name          = (isAr && product.name_ar) ? product.name_ar : product.name_en
  const description   = (isAr && product.description_ar) ? product.description_ar : product.description_en

  /* Build full gallery: cover image + gallery images */
  const allImages = [
    product.imageUrl,
    ...product.gallery.filter((g) => g !== product.imageUrl),
  ]

  return (
    <div className="min-h-screen bg-white" dir={dir}>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl px-6 pt-[116px] sm:px-10 lg:px-14">
        <nav className={`flex items-center gap-2 text-[10.5px] font-light text-[#C9A96E]/60 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Link href="/" className="hover:text-[#C9A96E] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-[#C9A96E] transition-colors">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-[#9E8E80]">{name}</span>
        </nav>
      </div>

      {/* ── Client product experience ───────────────────────────────────────── */}
      <ProductPageClient
        product={product}
        allImages={allImages}
        name={name}
        description={description}
        categoryLabel={categoryLabel}
        isRtl={isRtl}
      />

    </div>
  )
}
