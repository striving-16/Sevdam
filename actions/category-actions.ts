'use server'

import { db } from '@/lib/db'
import { categorySchema, type CategoryInput } from '@/lib/validations'
import { validateImageUpload, detectImageType } from '@/lib/image-validation'
import { uploadProductImage, deleteProductImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import type { StoreCategory } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002'
}

// ─── Reads ──────────────────────────────────────────────────────────────────

/** Admin — every category, including inactive ones, for the management UI. */
export async function getCategories(): Promise<StoreCategory[]> {
  try {
    return await db.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }) as unknown as StoreCategory[]
  } catch (err) {
    // New columns (name_ar/image/isActive/sortOrder) may not be migrated yet
    // — fail to an empty list rather than crash every page that needs this.
    Sentry.captureException(err)
    return []
  }
}

/** Public — only active categories, in admin-defined order. Used by navigation, filters, and the product form. */
export async function getActiveCategories(): Promise<StoreCategory[]> {
  try {
    return await db.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }) as unknown as StoreCategory[]
  } catch (err) {
    Sentry.captureException(err)
    return []
  }
}

// ─── Writes ─────────────────────────────────────────────────────────────────

export async function createCategory(input: CategoryInput): Promise<{ error?: string; category?: StoreCategory }> {
  await requireAdmin()
  const data = categorySchema.parse(input)

  try {
    const sortOrder = data.sortOrder || (await db.category.count()) // new categories go to the end by default
    const category = await db.category.create({ data: { ...data, sortOrder } })
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath('/')
    return { category: category as unknown as StoreCategory }
  } catch (err) {
    if (isUniqueConstraintError(err)) return { error: `A category with the slug "${data.slug}" already exists.` }
    throw err
  }
}

export async function updateCategory(id: string, input: CategoryInput): Promise<{ error?: string; category?: StoreCategory }> {
  await requireAdmin()
  const data = categorySchema.parse(input)

  try {
    const category = await db.category.update({ where: { id }, data })
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath('/')
    return { category: category as unknown as StoreCategory }
  } catch (err) {
    if (isUniqueConstraintError(err)) return { error: `A category with the slug "${data.slug}" already exists.` }
    throw err
  }
}

export async function toggleCategoryActive(id: string, isActive: boolean): Promise<void> {
  await requireAdmin()
  await db.category.update({ where: { id }, data: { isActive } })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/')
}

/** Persists a full reorder — `orderedIds` is the complete list in its new order. */
export async function reorderCategories(orderedIds: string[]): Promise<void> {
  await requireAdmin()
  await db.$transaction(
    orderedIds.map((id, index) => db.category.update({ where: { id }, data: { sortOrder: index } }))
  )
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/')
}

/**
 * Safe delete — never orphans products. A category in active use by any
 * product is not deletable until those products are reassigned elsewhere;
 * this returns a clear count rather than silently failing or cascading.
 */
export async function deleteCategory(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const category = await db.category.findUnique({ where: { id } })
  if (!category) return { error: 'Category not found' }

  const productCount = await db.product.count({ where: { category: category.slug } })
  if (productCount > 0) {
    return {
      error: `"${category.name}" is used by ${productCount} product${productCount === 1 ? '' : 's'}. Reassign ${productCount === 1 ? 'it' : 'them'} to a different category first, then delete.`,
    }
  }

  if (category.image) await deleteProductImage(category.image).catch(() => {})
  await db.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/')
  return {}
}

export async function uploadCategoryImageAction(formData: FormData): Promise<string> {
  await requireAdmin()
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')
  const buffer = Buffer.from(await file.arrayBuffer())

  const validation = validateImageUpload(buffer)
  if (!validation.ok) throw new Error(validation.error)

  const detectedType = detectImageType(buffer)!
  const dataUrl = `data:image/${detectedType};base64,${buffer.toString('base64')}`
  return uploadProductImage(dataUrl)
}
