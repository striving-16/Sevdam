import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Admin Login' }

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect('/admin')

  return (
    <div className="w-full max-w-[380px] px-6">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-light tracking-[0.35em] uppercase text-neutral-400 mb-2">
          Admin
        </p>
        <h1 className="text-[24px] font-extralight tracking-[-0.02em] text-neutral-900">
          Admin access
        </h1>
      </div>
      <LoginForm />
    </div>
  )
}
