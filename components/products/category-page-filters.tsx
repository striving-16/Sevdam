'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: '',             label: 'Newest' },
  { value: 'bestsellers', label: 'Best Sellers' },
  { value: 'price-asc',   label: 'Price ↑' },
  { value: 'price-desc',  label: 'Price ↓' },
]

interface Props {
  subcategories: { value: string; label: string }[]
  brands: string[]
  productCount: number
}

export function CategoryPageFilters({ subcategories, brands, productCount }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeSub     = searchParams.get('sub')     ?? ''
  const activeSort    = searchParams.get('sort')    ?? ''
  const activeBrand   = searchParams.get('brand')   ?? ''
  const activeInstock = searchParams.get('instock') ?? ''

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    value ? params.set(key, value) : params.delete(key)
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }))
  }

  function toggle(key: string, value: string) {
    set(key, searchParams.get(key) === value ? '' : value)
  }

  const pill = (active: boolean, gold?: boolean) =>
    cn(
      'flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-light transition-all duration-150 cursor-pointer border',
      active
        ? gold
          ? 'border-[#C9A882] bg-[#C9A882] text-white'
          : 'border-[#1C1917] bg-[#1C1917] text-white'
        : 'border-[#E8E0D8] bg-white text-[#78716C] hover:border-[#C9A882] hover:text-[#1C1917]'
    )

  return (
    <div className="mb-6 space-y-3">
      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => set('sub', '')} className={pill(activeSub === '')}>
            All
          </button>
          {subcategories.map((s) => (
            <button key={s.value} onClick={() => toggle('sub', s.value)} className={pill(activeSub === s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Sort + Brand + Stock row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8AFA8]">
          {productCount} items
        </span>
        <span className="text-[#E8E0D8]">·</span>

        {SORT_OPTIONS.map((o) => (
          <button key={o.value} onClick={() => set('sort', o.value)} className={pill(activeSort === o.value)}>
            {o.label}
          </button>
        ))}

        {brands.length > 0 && (
          <>
            <span className="text-[#E8E0D8]">·</span>
            {brands.map((b) => (
              <button key={b} onClick={() => toggle('brand', b)} className={pill(activeBrand === b, true)}>
                {b}
              </button>
            ))}
          </>
        )}

        <span className="text-[#E8E0D8]">·</span>
        <button onClick={() => toggle('instock', '1')} className={pill(activeInstock === '1')}>
          In Stock
        </button>
      </div>
    </div>
  )
}
