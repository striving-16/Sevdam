export type ProductCategory =
  | 'FOUNDATION'
  | 'CONCEALER'
  | 'PRIMER'
  | 'LIPSTICK'
  | 'LIP_GLOSS'
  | 'LIP_LINER'
  | 'BLUSH'
  | 'EYESHADOW'
  | 'MASCARA'
  | 'EYELINER'
  | 'SETTING_SPRAY'
  | 'HIGHLIGHTER'
  | 'BRONZER'
  | 'POWDER'

export type Variant = {
  id: string
  productId: string
  shadeName: string
  hexColor: string
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
  slug: string
  description?: string | null
  createdAt: Date
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
