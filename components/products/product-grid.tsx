import { ProductCard } from '@/components/products/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types'

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[13px] tracking-wide text-neutral-400">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-full rounded-xl" style={{ aspectRatio: '3/4' }} />
          <Skeleton className="h-3 w-1/2 rounded" />
          <Skeleton className="h-3.5 w-3/4 rounded" />
          <Skeleton className="h-3.5 w-1/3 rounded" />
        </div>
      ))}
    </div>
  )
}
