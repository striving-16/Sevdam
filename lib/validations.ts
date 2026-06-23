import { z } from 'zod'

export const PRODUCT_CATEGORIES = [
  'SKINCARE',
  'HAIRCARE',
  'PERFUMES',
  'MAKEUP',
  'BODYCARE',
  'MENCARE',
  'BABYCARE',
  'TOOLS',
] as const

export const DELIVERY_TYPES = ['home', 'express', 'pickup'] as const

// ─── Product ─────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name_en:        z.string().min(1, 'English name is required').max(200),
  name_ar:        z.string().default(''),
  slug:           z.string().min(1).regex(/^[a-z0-9-]+$/),
  description_en: z.string().min(1, 'English description is required'),
  description_ar: z.string().default(''),
  price:          z.coerce.number().min(0.01),
  stock:          z.coerce.number().int().min(0).default(0),
  imageUrl:       z.string().min(1, 'Image is required'),
  gallery:        z.array(z.string()).default([]),
  hasVariants:    z.boolean().default(false),
  category:       z.enum(PRODUCT_CATEGORIES).default('SKINCARE'),
  brand:          z.string().optional().nullable(),
  tags:           z.array(z.string()).default([]),
  benefits:       z.string().optional().nullable(),
  ingredients:    z.string().optional().nullable(),
  usage:          z.string().optional().nullable(),
  isBestseller:   z.boolean().default(false),
})

// ─── Order ───────────────────────────────────────────────────────────────────

export const orderSchema = z.object({
  customerName:    z.string().min(2).max(100),
  customerPhone:   z.string().min(6).max(30),
  customerAddress: z.string().default(''),
  deliveryType:    z.enum(DELIVERY_TYPES).default('home'),
})

// ─── Category ────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name:        z.string().min(1).max(100),
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
})

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.email('Invalid email'),
  password: z.string().min(1),
})

// ─── Inferred types ───────────────────────────────────────────────────────────

export type ProductInput  = z.infer<typeof productSchema>
export type OrderInput    = z.infer<typeof orderSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type LoginInput    = z.infer<typeof loginSchema>
