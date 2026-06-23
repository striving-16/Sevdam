import { Suspense } from 'react'
import { getProducts } from '@/actions/product-actions'
import { ProductGrid, ProductGridSkeleton } from '@/components/products/product-grid'
import { ProductSearch } from '@/components/products/product-search'
import { CategoryFilter } from '@/components/products/category-filter'
import { getServerT } from '@/lib/i18n/server'
import { DEMO_PRODUCTS } from '@/lib/demo-products'
import type { Product } from '@/types'

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>
}

export const metadata = { title: 'Collection — Besma Sevdam' }

export default async function ProductsPage({ searchParams }: Props) {
  const { q, category } = await searchParams
  const { t, dir } = await getServerT()
  const isRtl = dir === 'rtl'

  let products: Product[] = []
  try {
    products = await getProducts(q, category)
  } catch {
    /* DB not connected — show demo products */
    products = DEMO_PRODUCTS.filter((p) => {
      if (q) {
        const query = q.toLowerCase()
        return p.name_en.toLowerCase().includes(query) || p.tags.some((tag) => tag.includes(query))
      }
      if (category) return p.category === category.toUpperCase()
      return true
    })
  }

  return (
    <div className="mx-auto max-w-screen-xl px-5 pb-24 pt-[120px] sm:px-8" dir={dir}>
      {/* Header */}
      <div className={`mb-10 ${isRtl ? 'text-right' : ''}`}>
        <p
          className="mb-2 text-[8.5px] font-light uppercase text-[#C9A96E]"
          style={{ letterSpacing: isRtl ? 0 : '0.5em' }}
        >
          {t.products.eyebrow}
        </p>
        <h1 className="font-display text-[clamp(30px,4vw,54px)] font-light italic leading-[1.05] text-[#1A1714]">
          The Full Collection
        </h1>
        <p className="mt-3 max-w-[400px] text-[13px] font-light leading-[1.8] text-[#9E8E80]">
          Every product crafted with uncompromising quality and feminine elegance.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <ProductSearch placeholder={t.products.searchPlaceholder} />
        <Suspense>
          <CategoryFilter />
        </Suspense>
      </div>

      {/* Results count */}
      {(q || category) && (
        <p className={`mb-5 text-[12px] font-light text-[#78716C] ${isRtl ? 'text-right' : ''}`}>
          {products.length} product{products.length !== 1 ? 's' : ''}
          {q ? ` for "${q}"` : ''}
          {category ? ` in ${category.replace('_', ' ').toLowerCase()}` : ''}
        </p>
      )}

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  )
}
