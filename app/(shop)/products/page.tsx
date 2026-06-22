import { Suspense } from 'react'
import { getProducts } from '@/actions/product-actions'
import { ProductGrid, ProductGridSkeleton } from '@/components/products/product-grid'
import { ProductSearch } from '@/components/products/product-search'
import { CategoryFilter } from '@/components/products/category-filter'
import { getServerT } from '@/lib/i18n/server'

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>
}

export const metadata = { title: 'Products — Dreamshop' }

export default async function ProductsPage({ searchParams }: Props) {
  const { q, category } = await searchParams
  const { t, dir } = await getServerT()
  const isRtl = dir === 'rtl'

  const products = await getProducts(q, category)

  return (
    <div className="mx-auto max-w-screen-xl px-5 pb-24 pt-[120px] sm:px-8" dir={dir}>
      {/* Header */}
      <div className={`mb-8 ${isRtl ? 'text-right' : ''}`}>
        <p className="mb-1.5 text-[10px] font-light uppercase text-[#C9A882]" style={{ letterSpacing: isRtl ? 0 : '0.4em' }}>
          {t.products.eyebrow}
        </p>
        <h1 className="font-display text-[clamp(24px,3.5vw,38px)] font-light italic text-[#1C1917]">
          {t.products.title}
        </h1>
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
