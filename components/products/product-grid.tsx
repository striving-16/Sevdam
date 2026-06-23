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
    <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-5">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} mode="shop" />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-7">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[28px] bg-[#F7F5F2]">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2.5 px-4 pb-5 pt-4">
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-3.5 w-1/3 rounded-full" />
            <Skeleton className="mt-1 h-9 w-full rounded-[14px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
