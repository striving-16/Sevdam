'use server'

import { db } from '@/lib/db'
import { categorySchema, type CategoryInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { StoreCategory } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

export async function getCategories(): Promise<StoreCategory[]> {
  return db.category.findMany({
    orderBy: { name: 'asc' },
  }) as Promise<StoreCategory[]>
}

export async function createCategory(input: CategoryInput) {
  await requireAdmin()
  const data = categorySchema.parse(input)
  const category = await db.category.create({ data })
  revalidatePath('/admin/categories')
  return category
}

export async function updateCategory(id: string, input: CategoryInput) {
  await requireAdmin()
  const data = categorySchema.parse(input)
  const category = await db.category.update({ where: { id }, data })
  revalidatePath('/admin/categories')
  return category
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  await db.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
}
