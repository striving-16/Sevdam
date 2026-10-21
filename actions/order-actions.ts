'use server'

import { db } from '@/lib/db'
import { orderSchema, type OrderInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { updateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { CartItem, Order, OrderStatus } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

// Restricted shape for customer-facing order lookups (order confirmation,
// /track-order) — deliberately excludes customerName/customerPhone/
// customerAddress so it's safe to return without an auth check.
export type PublicOrder = {
  id: string
  status: OrderStatus
  deliveryType: string
  totalPrice: number
  createdAt: Date
  items: {
    id: string
    quantity: number
    price: number
    variantName: string | null
    product: { name_en: string; name_ar: string; imageUrl: string; slug: string } | null
  }[]
}

const PUBLIC_ORDER_SELECT = {
  id: true,
  status: true,
  deliveryType: true,
  totalPrice: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      quantity: true,
      price: true,
      variantName: true,
      product: { select: { name_en: true, name_ar: true, imageUrl: true, slug: true } },
    },
  },
} as const

export async function placeOrder(
  customerInfo: OrderInput,
  cartItems: CartItem[],
  idempotencyKey?: string
): Promise<{ orderId: string }> {
  const data = orderSchema.parse(customerInfo)

  if (cartItems.length === 0) throw new Error('Cart is empty')

  // If this exact checkout attempt already went through (double-click,
  // retried request after a dropped response, a second tab), replay the
  // existing order instead of creating a duplicate.
  if (idempotencyKey) {
    const existing = await db.order.findUnique({
      where: { idempotencyKey },
      select: { id: true },
    })
    if (existing) return { orderId: existing.id }
  }

  // Re-fetch every product (+ its variants) server-side — price and stock
  // are never trusted from the client's cart.
  const productIds = [...new Set(cartItems.map((i) => i.product.id))]
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  })
  const productById = new Map(products.map((p) => [p.id, p]))

  type ResolvedLine = {
    productId: string
    variantId: string | null
    variantName: string | null
    quantity: number
    price: number
  }

  const lines: ResolvedLine[] = cartItems.map((item) => {
    const product = productById.get(item.product.id)
    if (!product) throw new Error(`"${item.product.name_en}" is no longer available.`)

    if (item.variant) {
      const variant = product.variants.find((v) => v.id === item.variant!.id)
      if (!variant) throw new Error(`The "${item.variant.shadeName}" shade of "${product.name_en}" is no longer available.`)
      if (variant.stock < item.quantity) {
        throw new Error(`"${product.name_en}" (${variant.shadeName}) is out of stock or has insufficient quantity.`)
      }
      return {
        productId: product.id,
        variantId: variant.id,
        variantName: variant.shadeName,
        quantity: item.quantity,
        price: product.price,
      }
    }

    if (product.stock < item.quantity) {
      throw new Error(`"${product.name_en}" is out of stock or has insufficient quantity.`)
    }
    return {
      productId: product.id,
      variantId: null,
      variantName: null,
      quantity: item.quantity,
      price: product.price,
    }
  })

  const totalPrice = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)

  let order
  try {
    order = await db.$transaction(async (tx) => {
      // Authoritative stock check happens HERE, not in the earlier read above.
      // A conditional updateMany (stock >= quantity in the WHERE clause) is
      // what makes this safe under concurrency: Postgres row-locks the target
      // row for the duration of the UPDATE, so two simultaneous checkouts for
      // the last unit serialize naturally — the second transaction's WHERE
      // re-evaluates against the already-decremented value and matches zero
      // rows, which we detect via `count` and roll back on. The earlier read
      // (lines, above) only exists to fail fast with a friendly message in
      // the common, non-racing case and to resolve price/variant identity.
      for (const l of lines) {
        const result = l.variantId
          ? await tx.variant.updateMany({
              where: { id: l.variantId, stock: { gte: l.quantity } },
              data: { stock: { decrement: l.quantity } },
            })
          : await tx.product.updateMany({
              where: { id: l.productId, stock: { gte: l.quantity } },
              data: { stock: { decrement: l.quantity } },
            })

        if (result.count === 0) {
          const product = productById.get(l.productId)
          const label = l.variantName ? `"${product?.name_en}" (${l.variantName})` : `"${product?.name_en}"`
          throw new Error(`${label} just sold out — please remove it from your cart and try again.`)
        }
      }

      const customer = await tx.customer.upsert({
        where: { phone: data.customerPhone },
        create: { name: data.customerName, phone: data.customerPhone, totalOrders: 1 },
        update: { name: data.customerName, totalOrders: { increment: 1 } },
      })

      const created = await tx.order.create({
        data: {
          ...data,
          totalPrice,
          customerId: customer.id,
          idempotencyKey: idempotencyKey ?? null,
          items: {
            create: lines.map((l) => ({
              productId: l.productId,
              variantId: l.variantId,
              variantName: l.variantName,
              quantity: l.quantity,
              price: l.price,
            })),
          },
        },
      })

      return created
    })
  } catch (err) {
    // Two requests with the same idempotency key racing each other: the
    // loser hits the unique-constraint violation (P2002), not a real error —
    // the winner's order already exists, so replay it instead of failing.
    if (idempotencyKey && typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002') {
      const existing = await db.order.findUnique({ where: { idempotencyKey }, select: { id: true } })
      if (existing) return { orderId: existing.id }
    }
    throw err
  }

  updateTag('products')
  revalidatePath('/products')
  revalidatePath('/')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/inventory')
  revalidatePath('/admin/customers')

  return { orderId: order.id }
}

export async function getOrders(): Promise<Order[]> {
  await requireAdmin()
  return db.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  }) as unknown as Promise<Order[]>
}

/** Admin-only — full customer details. Use `getOrderConfirmation` for public pages. */
export async function getOrderById(id: string): Promise<Order | null> {
  await requireAdmin()
  return db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  }) as unknown as Promise<Order | null>
}

/** Public — safe for the order-confirmation page. No customer name/phone/address. */
export async function getOrderConfirmation(id: string): Promise<PublicOrder | null> {
  return db.order.findUnique({
    where: { id },
    select: PUBLIC_ORDER_SELECT,
  }) as unknown as Promise<PublicOrder | null>
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin()

  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      select: { status: true, items: { select: { productId: true, variantId: true, quantity: true } } },
    })
    if (!order) throw new Error('Order not found')

    const isNewlyCancelled = status === 'CANCELLED' && order.status !== 'CANCELLED'

    await tx.order.update({ where: { id }, data: { status } })

    if (isNewlyCancelled) {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          })
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        }
      }
    }
  })

  updateTag('products')
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
  revalidatePath('/admin/inventory')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function createAdminOrder(
  customerInfo: {
    customerName: string
    customerPhone: string
    customerAddress: string
    deliveryType: string
  },
  items: { productId: string; quantity: number; price: number }[]
): Promise<{ orderId: string }> {
  await requireAdmin()

  if (items.length === 0) throw new Error('Order must have at least one product')

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const order = await db.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone: customerInfo.customerPhone },
      create: { name: customerInfo.customerName, phone: customerInfo.customerPhone, totalOrders: 1 },
      update: { name: customerInfo.customerName, totalOrders: { increment: 1 } },
    })

    const created = await tx.order.create({
      data: {
        ...customerInfo,
        totalPrice,
        status: 'PENDING',
        customerId: customer.id,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity:  i.quantity,
            price:     i.price,
          })),
        },
      },
    })

    for (const i of items) {
      await tx.product.update({
        where: { id: i.productId },
        data:  { stock: { decrement: i.quantity } },
      })
    }

    return created
  })

  revalidatePath('/admin/orders')
  revalidatePath('/admin/inventory')
  revalidatePath('/admin/customers')
  revalidatePath('/')
  revalidatePath('/products')

  return { orderId: order.id }
}

/** Public — used by /track-order. Restricted shape, same reasoning as getOrderConfirmation. */
export async function getOrdersByPhone(phone: string): Promise<PublicOrder[]> {
  const trimmed = phone.trim()
  if (!trimmed) return []
  return db.order.findMany({
    where: { customerPhone: { contains: trimmed } },
    select: PUBLIC_ORDER_SELECT,
    orderBy: { createdAt: 'desc' },
  }) as unknown as Promise<PublicOrder[]>
}
