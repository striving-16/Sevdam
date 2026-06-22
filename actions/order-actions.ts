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

export async function placeOrder(
  customerInfo: OrderInput,
  cartItems: CartItem[]
): Promise<{ orderId: string }> {
  const data = orderSchema.parse(customerInfo)

  if (cartItems.length === 0) throw new Error('Cart is empty')

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  // Verify stock availability before creating order
  const stockChecks = await Promise.all(
    cartItems.map((item) =>
      db.product.findUnique({
        where: { id: item.product.id },
        select: { stock: true, name_en: true },
      })
    )
  )

  for (let i = 0; i < cartItems.length; i++) {
    const product = stockChecks[i]
    const item = cartItems[i]
    if (!product || product.stock < item.quantity) {
      throw new Error(
        `"${item.product.name_en}" is out of stock or has insufficient quantity.`
      )
    }
  }

  const order = await db.order.create({
    data: {
      ...data,
      totalPrice,
      items: {
        create: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  })

  // Decrement stock atomically
  await Promise.all(
    cartItems.map((item) =>
      db.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } },
      })
    )
  )

  updateTag('products')
  revalidatePath('/products')
  revalidatePath('/')
  revalidatePath('/admin/orders')

  return { orderId: order.id }
}

export async function getOrders(): Promise<Order[]> {
  return db.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  }) as unknown as Promise<Order[]>
}

export async function getOrderById(id: string): Promise<Order | null> {
  return db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  }) as unknown as Promise<Order | null>
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin()
  await db.order.update({ where: { id }, data: { status } })
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
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

  const order = await db.order.create({
    data: {
      ...customerInfo,
      totalPrice,
      status: 'PENDING',
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
          price:     i.price,
        })),
      },
    },
  })

  await Promise.all(
    items.map((i) =>
      db.product.update({
        where: { id: i.productId },
        data:  { stock: { decrement: i.quantity } },
      })
    )
  )

  revalidatePath('/admin/orders')
  revalidatePath('/admin/inventory')
  revalidatePath('/')
  revalidatePath('/products')

  return { orderId: order.id }
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const trimmed = phone.trim()
  if (!trimmed) return []
  return db.order.findMany({
    where: { customerPhone: { contains: trimmed } },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  }) as unknown as Promise<Order[]>
}
