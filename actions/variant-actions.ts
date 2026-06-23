'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { Variant } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

const variantSchema = z.object({
  shadeName: z.string().min(1, 'Shade name is required').max(100),
  hexColor:  z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex colour (#RRGGBB)'),
  image:     z.string().url().optional().nullable(),
  stock:     z.coerce.number().int().min(0).default(0),
  sku:       z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
})

export type VariantInput = z.infer<typeof variantSchema>

export async function getVariantsByProduct(productId: string): Promise<Variant[]> {
  return db.variant.findMany({
    where: { productId },
    orderBy: { sortOrder: 'asc' },
  }) as unknown as Promise<Variant[]>
}

export async function createVariant(productId: string, input: VariantInput): Promise<Variant> {
  await requireAdmin()
  const data = variantSchema.parse(input)

  // Count existing variants to auto-set sortOrder
  const count = await db.variant.count({ where: { productId } })
  const variant = await db.variant.create({
    data: { ...data, productId, sortOrder: data.sortOrder ?? count },
  })

  // Ensure product is marked as hasVariants = true
  await db.product.update({
    where: { id: productId },
    data: { hasVariants: true },
  })

  revalidatePath(`/products`)
  revalidatePath(`/admin/products/${productId}`)
  return variant as unknown as Variant
}

export async function updateVariant(id: string, input: Partial<VariantInput>): Promise<Variant> {
  await requireAdmin()
  const data = variantSchema.partial().parse(input)
  const variant = await db.variant.update({ where: { id }, data })
  revalidatePath(`/products`)
  return variant as unknown as Variant
}

export async function deleteVariant(id: string): Promise<void> {
  await requireAdmin()
  const variant = await db.variant.findUnique({
    where: { id },
    select: { productId: true },
  })
  if (!variant) return

  await db.variant.delete({ where: { id } })

  // If no variants remain, unset hasVariants
  const remaining = await db.variant.count({ where: { productId: variant.productId } })
  if (remaining === 0) {
    await db.product.update({
      where: { id: variant.productId },
      data: { hasVariants: false },
    })
  }

  revalidatePath(`/products`)
  revalidatePath(`/admin/products/${variant.productId}`)
}

export async function updateVariantStock(id: string, stock: number): Promise<void> {
  await requireAdmin()
  if (stock < 0) throw new Error('Stock cannot be negative')
  await db.variant.update({ where: { id }, data: { stock } })
  revalidatePath('/admin/inventory')
}
