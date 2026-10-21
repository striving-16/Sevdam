import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { resolveOrderLines, calculateOrderTotal } from './order-logic.ts'
import type { Product, Variant, CartItem } from '@/types'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name_en: 'Mate Lipstick',
    name_ar: '',
    slug: 'mate-lipstick',
    description_en: '',
    description_ar: '',
    price: 500,
    stock: 10,
    imageUrl: 'https://example.com/img.jpg',
    gallery: [],
    hasVariants: false,
    variants: [],
    category: 'LIPSTICK',
    tags: [],
    isBestseller: false,
    isOffer: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

function makeVariant(overrides: Partial<Variant> = {}): Variant {
  return {
    id: 'v1',
    productId: 'p1',
    shadeName: 'Rose Nude',
    hexColor: '#C7A98B',
    colorSource: 'manual',
    image: null,
    stock: 5,
    sku: null,
    sortOrder: 0,
    ...overrides,
  }
}

function makeCartItem(product: Product, quantity: number, variant: Variant | null = null): CartItem {
  return { product, variant, quantity }
}

describe('resolveOrderLines — price tampering', () => {
  test('ignores a client-tampered price and always uses the server-fetched price', () => {
    const serverProduct = makeProduct({ id: 'p1', price: 500 })
    // Simulate a tampered client cart: same product id, but price mutated
    // client-side to 1 MRU in an attempt to buy a 500 MRU item for nothing.
    const tamperedClientProduct = { ...serverProduct, price: 1 }
    const cartItems = [makeCartItem(tamperedClientProduct, 2)]

    const lines = resolveOrderLines(cartItems, [serverProduct])

    assert.equal(lines[0].price, 500, 'must use server price, not the tampered client price')
    assert.equal(calculateOrderTotal(lines), 1000)
  })

  test('ignores a tampered price on a variant line too', () => {
    const variant = makeVariant({ id: 'v1', stock: 5 })
    const serverProduct = makeProduct({ id: 'p1', price: 500, hasVariants: true, variants: [variant] })
    const tamperedClientProduct = { ...serverProduct, price: 1 }
    const cartItems = [makeCartItem(tamperedClientProduct, 1, variant)]

    const lines = resolveOrderLines(cartItems, [serverProduct])

    assert.equal(lines[0].price, 500)
  })
})

describe('resolveOrderLines — stock validation', () => {
  test('rejects a simple product when quantity exceeds stock', () => {
    const product = makeProduct({ stock: 2 })
    const cartItems = [makeCartItem(product, 3)]

    assert.throws(
      () => resolveOrderLines(cartItems, [product]),
      /out of stock or has insufficient quantity/
    )
  })

  test('allows a simple product when quantity exactly matches stock', () => {
    const product = makeProduct({ stock: 2 })
    const cartItems = [makeCartItem(product, 2)]

    const lines = resolveOrderLines(cartItems, [product])
    assert.equal(lines.length, 1)
  })

  test('rejects a variant when quantity exceeds that variant\'s stock', () => {
    const variant = makeVariant({ id: 'v1', stock: 1 })
    const product = makeProduct({ hasVariants: true, variants: [variant] })
    const cartItems = [makeCartItem(product, 2, variant)]

    assert.throws(
      () => resolveOrderLines(cartItems, [product]),
      /is out of stock or has insufficient quantity/
    )
  })

  test('one variant being low on stock does not block a different variant of the same product', () => {
    const lowStock = makeVariant({ id: 'v1', shadeName: 'Low', stock: 1 })
    const healthyStock = makeVariant({ id: 'v2', shadeName: 'Healthy', stock: 10 })
    const product = makeProduct({ hasVariants: true, variants: [lowStock, healthyStock] })
    const cartItems = [makeCartItem(product, 5, healthyStock)]

    const lines = resolveOrderLines(cartItems, [product])
    assert.equal(lines[0].variantId, 'v2')
    assert.equal(lines[0].quantity, 5)
  })

  test('rejects a product that no longer exists server-side (deleted after being added to cart)', () => {
    const staleClientProduct = makeProduct({ id: 'ghost' })
    const cartItems = [makeCartItem(staleClientProduct, 1)]

    assert.throws(
      () => resolveOrderLines(cartItems, []), // server fetch returns nothing for this id
      /no longer available/
    )
  })

  test('rejects a variant that no longer exists (shade removed after being added to cart)', () => {
    const variant = makeVariant({ id: 'removed-shade' })
    const product = makeProduct({ hasVariants: true, variants: [] }) // shade gone server-side
    const cartItems = [makeCartItem(product, 1, variant)]

    assert.throws(
      () => resolveOrderLines(cartItems, [product]),
      /is no longer available/
    )
  })
})

describe('calculateOrderTotal — cart math', () => {
  test('sums multiple distinct lines correctly', () => {
    const productA = makeProduct({ id: 'a', price: 300 })
    const productB = makeProduct({ id: 'b', price: 750 })
    const lines = resolveOrderLines(
      [makeCartItem(productA, 2), makeCartItem(productB, 1)],
      [productA, productB]
    )
    assert.equal(calculateOrderTotal(lines), 300 * 2 + 750 * 1)
  })

  test('an empty line list totals to zero', () => {
    assert.equal(calculateOrderTotal([]), 0)
  })
})
