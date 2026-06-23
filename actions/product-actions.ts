'use server'

import { db } from '@/lib/db'
import { productSchema, type ProductInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { updateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { uploadProductImage, deleteProductImage } from '@/lib/cloudinary'
import type { Product } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

const WITH_VARIANTS = {
  variants: { orderBy: { sortOrder: 'asc' as const } },
}

export async function getProducts(search?: string, category?: string): Promise<Product[]> {
  return db.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name_en: { contains: search, mode: 'insensitive' } },
                { description_en: { contains: search, mode: 'insensitive' } },
                { tags: { has: search.toLowerCase() } },
              ],
            }
          : {},
        category ? { category: category as Product['category'] } : {},
      ],
    },
    include: WITH_VARIANTS,
    orderBy: { createdAt: 'desc' },
  }) as unknown as Promise<Product[]>
}

export async function getProductById(id: string): Promise<Product | null> {
  return db.product.findUnique({
    where: { id },
    include: WITH_VARIANTS,
  }) as unknown as Promise<Product | null>
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return db.product.findUnique({
    where: { slug },
    include: WITH_VARIANTS,
  }) as unknown as Promise<Product | null>
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return db.product.findMany({
    where: {
      OR: [
        { hasVariants: false, stock: { gt: 0 } },
        { hasVariants: true, variants: { some: { stock: { gt: 0 } } } },
      ],
    },
    include: WITH_VARIANTS,
    orderBy: [{ isBestseller: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  }) as unknown as Promise<Product[]>
}

export async function createProduct(input: ProductInput) {
  await requireAdmin()
  const data = productSchema.parse(input)
  const product = await db.product.create({ data })
  updateTag('products')
  revalidatePath('/products')
  revalidatePath('/')
  revalidatePath('/admin/products')
  return product
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  await requireAdmin()
  const data = productSchema.partial().parse(input)
  const product = await db.product.update({ where: { id }, data })
  updateTag('products')
  revalidatePath('/products')
  revalidatePath(`/products/${product.slug}`)
  revalidatePath('/')
  revalidatePath('/admin/products')
  return product
}

export async function updateProductGallery(id: string, gallery: string[]): Promise<void> {
  await requireAdmin()
  await db.product.update({ where: { id }, data: { gallery } })
  revalidatePath('/products')
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')
  if (product.imageUrl) await deleteProductImage(product.imageUrl).catch(() => {})
  await db.product.delete({ where: { id } })
  updateTag('products')
  revalidatePath('/products')
  revalidatePath('/')
  revalidatePath('/admin/products')
}

export async function updateProductStock(id: string, stock: number) {
  await requireAdmin()
  if (stock < 0) throw new Error('Stock cannot be negative')
  await db.product.update({ where: { id }, data: { stock } })
  revalidatePath('/admin/inventory')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function uploadProductImageAction(formData: FormData): Promise<string> {
  await requireAdmin()
  const file = formData.get('file') as File
  if (!file || file.size === 0) throw new Error('No file provided')
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`
  return uploadProductImage(dataUrl)
}
