import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Product, Variant } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** The shade a product should default to showing — the admin-chosen cover shade, or the first shade if none was set. */
export function getCoverVariant(product: Pick<Product, 'coverVariantId' | 'variants'>): Variant | null {
  if (!product.variants || product.variants.length === 0) return null
  const cover = product.coverVariantId
    ? product.variants.find((v) => v.id === product.coverVariantId)
    : null
  return cover ?? product.variants[0]
}

export function formatPrice(price: number): string {
  return `${Math.round(price).toLocaleString('fr')} MRU`
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
  PREPARING: 'bg-orange-50 text-orange-700 border-orange-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
}

