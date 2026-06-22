'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function ProductSearch({ placeholder }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString())
      const value = e.target.value.trim()

      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="relative max-w-sm">
      <Search
        size={14}
        className={cn(
          'absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-opacity',
          isPending && 'opacity-40'
        )}
      />
      <Input
        type="search"
        placeholder={placeholder ?? 'Search products…'}
        defaultValue={searchParams.get('q') ?? ''}
        onChange={handleChange}
        className="h-10 pl-9 text-[13px] placeholder:text-neutral-400 border-neutral-200 focus-visible:ring-neutral-300"
      />
    </div>
  )
}
