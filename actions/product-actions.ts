'use server'

import { db } from '@/lib/db'
import { productSchema, type ProductInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { updateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { uploadProductImage, deleteProductImage } from '@/lib/cloudinary'
import { normalizeHex, FALLBACK_HEX } from '@/lib/color-extraction'
import type { Product } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

const WITH_VARIANTS = {
  variants: { orderBy: { sortOrder: 'asc' as const } },
}

// ─── Shade input type (passed from product form) ──────────────────────────────

export type ShadeInput = {
  id?:          string
  shadeName:    string
  hexColor:     string
  colorSource?: 'manual' | 'suggested'
  stock:        number
  image:        string
  sku?:         string | null
  isCover?:     boolean
}

// ─── Read ─────────────────────────────────────────────────────────────────────

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
        category ? { category } : {},
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
      isBestseller: true,
      OR: [
        { hasVariants: false, stock: { gt: 0 } },
        { hasVariants: true, variants: { some: { stock: { gt: 0 } } } },
      ],
    },
    include: WITH_VARIANTS,
    orderBy: { createdAt: 'desc' },
    take: limit,
  }) as unknown as Promise<Product[]>
}

export async function getOfferProducts(limit = 8): Promise<Product[]> {
  return db.product.findMany({
    where: { isOffer: true },
    include: WITH_VARIANTS,
    orderBy: { updatedAt: 'desc' },
    take: limit,
  }) as unknown as Promise<Product[]>
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return db.product.findMany({
    include: WITH_VARIANTS,
    orderBy: { createdAt: 'desc' },
    take: limit,
  }) as unknown as Promise<Product[]>
}

// ─── Write ────────────────────────────────────────────────────────────────────

/** Picks the cover variant by sortOrder (not array position — createManyAndReturn doesn't guarantee input order). */
function resolveCoverVariantId(shades: ShadeInput[], created: { id: string; sortOrder: number }[]): string | null {
  if (created.length === 0) return null
  const coverIdx = Math.max(0, shades.findIndex((s) => s.isCover))
  return created.find((v) => v.sortOrder === coverIdx)?.id ?? created[0].id
}

export async function createProduct(input: ProductInput, shades: ShadeInput[] = []) {
  await requireAdmin()
  const data = productSchema.parse(input)

  const product = await db.product.create({ data })

  if (shades.length > 0) {
    const created = await db.variant.createManyAndReturn({
      data: shades.map((s, idx) => ({
        productId:   product.id,
        shadeName:   s.shadeName,
        hexColor:    normalizeHex(s.hexColor) ?? FALLBACK_HEX,
        colorSource: s.colorSource ?? 'manual',
        stock:       s.stock     ?? 0,
        image:       s.image     || null,
        sku:         s.sku       || null,
        sortOrder:   idx,
      })),
    })
    await db.product.update({
      where: { id: product.id },
      data: { coverVariantId: resolveCoverVariantId(shades, created) },
    })
  }

  updateTag('products')
  revalidatePath('/products')
  revalidatePath('/')
  revalidatePath('/admin/products')
  return product
}

export async function updateProduct(id: string, input: Partial<ProductInput>, shades?: ShadeInput[]) {
  await requireAdmin()
  const data = productSchema.partial().parse(input)

  const product = await db.product.update({ where: { id }, data })

  if (shades !== undefined) {
    // Replace all variants atomically — clear the cover pointer first since
    // it has a FK to the old variant rows we're about to delete.
    await db.product.update({ where: { id }, data: { coverVariantId: null } })
    await db.variant.deleteMany({ where: { productId: id } })

    if (shades.length > 0) {
      const created = await db.variant.createManyAndReturn({
        data: shades.map((s, idx) => ({
          productId:   id,
          shadeName:   s.shadeName,
          hexColor:    normalizeHex(s.hexColor) ?? FALLBACK_HEX,
          colorSource: s.colorSource ?? 'manual',
          stock:       s.stock     ?? 0,
          image:       s.image     || null,
          sku:         s.sku       || null,
          sortOrder:   idx,
        })),
      })
      await db.product.update({
        where: { id },
        data: { coverVariantId: resolveCoverVariantId(shades, created) },
      })
    }
  }

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

export async function toggleProductOffer(
  productId: string,
  isOffer: boolean,
  salePrice: number | null,
): Promise<void> {
  await requireAdmin()
  await db.product.update({
    where: { id: productId },
    data:  { isOffer, salePrice: isOffer ? salePrice : null },
  })
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/admin/offers')
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
