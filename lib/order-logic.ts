import type { CartItem, Product } from '@/types'

/**
 * Marks an error as safe and meaningful to show a customer verbatim (e.g.
 * "sold out"), as opposed to an unexpected infrastructure failure (a DB
 * connection hiccup, an unhandled Prisma error) whose raw message should
 * never reach the UI. placeOrder's catch block uses this distinction to
 * decide what the customer sees.
 */
export class OrderError extends Error {}

export type ResolvedLine = {
  productId: string
  variantId: string | null
  variantName: string | null
  quantity: number
  price: number
}

/**
 * Turns a client-supplied cart into priced, stock-checked order lines.
 * `products` must be freshly fetched server-side (with variants) — price and
 * stock are always read from here, never from `cartItems`, so a client that
 * tampers with `item.product.price` (or stock) in its own cart state cannot
 * change what gets charged or bypass stock limits. This is a fast-fail check
 * only; the authoritative stock guard lives in the DB transaction, which
 * re-checks under a row lock to stay correct under concurrent checkouts.
 */
export function resolveOrderLines(
  cartItems: CartItem[],
  products: Product[]
): ResolvedLine[] {
  const productById = new Map(products.map((p) => [p.id, p]))

  return cartItems.map((item) => {
    const product = productById.get(item.product.id)
    if (!product) throw new OrderError(`"${item.product.name_en}" is no longer available.`)

    if (item.variant) {
      const variant = product.variants.find((v) => v.id === item.variant!.id)
      if (!variant) throw new OrderError(`The "${item.variant.shadeName}" shade of "${product.name_en}" is no longer available.`)
      if (variant.stock < item.quantity) {
        throw new OrderError(`"${product.name_en}" (${variant.shadeName}) is out of stock or has insufficient quantity.`)
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
      throw new OrderError(`"${product.name_en}" is out of stock or has insufficient quantity.`)
    }
    return {
      productId: product.id,
      variantId: null,
      variantName: null,
      quantity: item.quantity,
      price: product.price,
    }
  })
}

export function calculateOrderTotal(lines: ResolvedLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
}
