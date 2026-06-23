'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'
import { MAKEUP_CATEGORIES, CATEGORY_LABELS } from '@/lib/validations'

const FILTERS = [
  { value: '', label: 'All' },
  ...MAKEUP_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
]

export function CategoryFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const active = searchParams.get('category') ?? ''

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => select(f.value)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-[11px] font-light transition-all duration-150',
            active === f.value
              ? 'border-[#1C1917] bg-[#1C1917] text-white'
              : 'border-[#E8E0D8] bg-white text-[#78716C] hover:border-[#C9A882] hover:text-[#1C1917]'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
