// Was a fixed string-literal union; categories are now admin-managed data
// (see the Category model), so the valid set is determined at runtime, not
// compile time. Kept as a named alias for readability at existing call sites.
export type ProductCategory = string

export type Variant = {
  id: string
  productId: string
  shadeName: string
  hexColor: string
  colorSource: 'manual' | 'suggested'
  image: string | null
  stock: number
  sku: string | null
  sortOrder: number
}

export type Product = {
  id: string
  name_en: string
  name_ar: string
  slug: string
  description_en: string
  description_ar: string
  price: number
  stock: number       // Used when hasVariants = false
  imageUrl: string
  gallery: string[]
  hasVariants: boolean
  coverVariantId?: string | null
  variants: Variant[]
  category: ProductCategory
  brand?: string | null
  tags: string[]
  benefits?: string | null
  ingredients?: string | null
  usage?: string | null
  isBestseller: boolean
  isOffer: boolean
  salePrice?: number | null
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'DELIVERED'
  | 'CANCELLED'

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  variantId?: string | null
  variantName?: string | null
  quantity: number
  price: number
  product?: Product
  variant?: Variant | null
}

export type Order = {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  deliveryType: string
  totalPrice: number
  status: OrderStatus
  createdAt: Date
  customerId?: string | null
  items?: OrderItem[]
}

export type Customer = {
  id: string
  name: string
  phone: string
  totalOrders: number
  createdAt: Date
}

export type StoreCategory = {
  id: string
  name: string
  name_ar: string
  slug: string
  description?: string | null
  image?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export type AdminUser = {
  id: string
  email: string
  role: string
}

export type CartItem = {
  product: Product
  variant: Variant | null
  quantity: number
}
