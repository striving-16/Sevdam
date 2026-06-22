'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { hash } from 'bcryptjs'

async function getMyEmail(): Promise<string> {
  const session = await auth()
  if (!session?.user?.email) redirect('/login')
  return session.user.email
}

export async function getAdminUsers() {
  await getMyEmail()
  return db.adminUser.findMany({
    select: { id: true, email: true, role: true },
    orderBy: { email: 'asc' },
  })
}

export type AdminActionResult = { error: string } | { success: true }

export async function createAdminUser(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  await getMyEmail()
  const email    = (formData.get('email')    as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!email || !password)     return { error: 'Email and password are required' }
  if (password.length < 8)     return { error: 'Password must be at least 8 characters' }
  if (!/\S+@\S+\.\S+/.test(email)) return { error: 'Invalid email address' }

  const existing = await db.adminUser.findUnique({ where: { email } })
  if (existing) return { error: 'An admin with this email already exists' }

  const passwordHash = await hash(password, 12)
  await db.adminUser.create({ data: { email, passwordHash } })
  revalidatePath('/admin/accounts')
  return { success: true }
}

export async function deleteAdminUser(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const myEmail = await getMyEmail()
  const id = formData.get('id') as string

  const me = await db.adminUser.findUnique({ where: { email: myEmail } })
  if (me?.id === id) return { error: "You can't delete your own account" }

  const count = await db.adminUser.count()
  if (count <= 1) return { error: 'Cannot delete the last admin account' }

  await db.adminUser.delete({ where: { id } })
  revalidatePath('/admin/accounts')
  return { success: true }
}

export async function changeAdminPassword(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  await getMyEmail()
  const id       = formData.get('id')       as string
  const password = formData.get('password') as string

  if (!password || password.length < 8) return { error: 'Password must be at least 8 characters' }

  const passwordHash = await hash(password, 12)
  await db.adminUser.update({ where: { id }, data: { passwordHash } })
  revalidatePath('/admin/accounts')
  return { success: true }
}
