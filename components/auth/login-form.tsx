'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    startTransition(async () => {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/admin')
      }
    })
  }

  const FIELD_CLS =
    'h-11 rounded-lg border-neutral-200 bg-white text-[14px] focus-visible:ring-neutral-300'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[12px] font-light tracking-wide text-neutral-600">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@example.com"
          className={FIELD_CLS}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[12px] font-light tracking-wide text-neutral-600">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={FIELD_CLS}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 w-full rounded-full bg-neutral-900 text-[13px] font-light tracking-wide text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 size={13} className="animate-spin" />
            Signing in…
          </span>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
