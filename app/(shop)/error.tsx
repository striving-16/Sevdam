'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-4 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
        Something went wrong
      </p>
      <h2 className="font-display text-[clamp(24px,3.5vw,38px)] font-light tracking-[-0.01em] text-[#1C1917]">
        Oops — unexpected error.
      </h2>
      <p className="mt-4 max-w-sm text-[14px] font-light leading-[1.85] text-[#78716C]">
        Something didn&apos;t load correctly. Please try again, or contact us on
        WhatsApp if it keeps happening.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-[#1C1917] px-7 py-3 text-[12px] font-light uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#3D3530]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-[12px] font-light uppercase tracking-[0.15em] text-[#78716C] underline-offset-4 hover:underline"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
