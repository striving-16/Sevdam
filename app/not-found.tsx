import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <p className="text-[11px] font-light tracking-[0.35em] uppercase text-neutral-400 mb-4">404</p>
      <h1 className="text-[36px] font-extralight tracking-[-0.02em] text-neutral-900 mb-3">
        Page not found
      </h1>
      <p className="text-[14px] font-light text-neutral-500 mb-10 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="rounded-full bg-neutral-900 px-8 text-[13px] font-light text-white hover:bg-neutral-700">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
