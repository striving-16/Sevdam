// @ts-nocheck — this script's only use of `playwright` is intentional:
// playwright is deliberately NOT a project dependency (avoids adding an
// unnecessary package for the one opt-in script that needs it). Run with
// Node directly; it still executes correctly even though tsc can't resolve
// the type declarations for a package that isn't installed here.
/**
 * Isolated concurrency regression test for placeOrder's stock-decrement
 * transaction. Creates one throwaway TEST product (stock = 1), fires two
 * simultaneous checkout attempts against it via a real running server, then
 * asserts: final stock is 0 (not negative), and exactly one order exists.
 * Cleans up the test product/order/customer rows afterward regardless of
 * outcome.
 *
 * NOT run as part of `npm test` — it needs Playwright (not a project
 * dependency) and a live server to hit, so it's a deliberate, on-demand
 * script rather than part of the automated suite.
 *
 * This does not touch any real customer/product data — it creates and
 * deletes its own isolated TEST-prefixed rows only.
 *
 * Usage (run only against a target you're authorized to load-test):
 *   npx tsx scripts/test-checkout-concurrency.ts http://localhost:3000
 *   npx tsx scripts/test-checkout-concurrency.ts https://sevdam.vercel.app
 */
import { config } from 'dotenv'
import { chromium } from 'playwright'
import { db } from '../lib/db'

config({ path: '.env.local' })
config()

async function addToCartAndGoToCheckout(context: import('playwright').BrowserContext, base: string, slug: string, name: string, phone: string) {
  const page = await context.newPage()
  await page.goto(`${base}/products/${slug}`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /Add to Bag/i }).click()
  await page.waitForTimeout(400)
  await page.goto(`${base}/checkout`, { waitUntil: 'networkidle' })
  await page.locator('input[placeholder="Your full name"]').fill(name)
  await page.locator('input[placeholder="e.g. 36234567"]').fill(phone)
  await page.getByRole('button', { name: /Store Pickup/i }).click()
  return page
}

async function main() {
  const base = process.argv[2]
  if (!base) {
    console.error('Usage: npx tsx scripts/test-checkout-concurrency.ts <base-url>')
    process.exit(1)
  }

  const stamp = Date.now()
  const product = await db.product.create({
    data: {
      name_en: `TEST Concurrency ${stamp}`, name_ar: '', slug: `test-concurrency-${stamp}`,
      description_en: 'temp', description_ar: '', price: 100, stock: 1,
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', hasVariants: false, category: 'LIPSTICK',
    },
  })

  const browser = await chromium.launch()
  const ctxA = await browser.newContext()
  const ctxB = await browser.newContext()

  try {
    const pageA = await addToCartAndGoToCheckout(ctxA, base, product.slug, 'TEST Racer A', '91111111')
    const pageB = await addToCartAndGoToCheckout(ctxB, base, product.slug, 'TEST Racer B', '92222222')

    console.log('Firing two simultaneous checkout attempts for 1 unit of stock...')
    await Promise.allSettled([
      pageA.getByRole('button', { name: /Place Order/i }).click(),
      pageB.getByRole('button', { name: /Place Order/i }).click(),
    ])
    await pageA.waitForTimeout(3000)
    await pageB.waitForTimeout(3000)

    const finalStock = await db.product.findUnique({ where: { id: product.id }, select: { stock: true } })
    const orders = await db.orderItem.count({ where: { productId: product.id } })

    console.log('Final stock:', finalStock?.stock, '(expected: 0, never negative)')
    console.log('Orders created:', orders, '(expected: exactly 1)')

    const pass = finalStock?.stock === 0 && orders === 1
    console.log(pass ? '\nPASS' : '\nFAIL — investigate before trusting checkout under concurrent load')

    if (!pass) process.exitCode = 1
  } finally {
    await browser.close()
    const items = await db.orderItem.findMany({ where: { productId: product.id }, select: { orderId: true } })
    const orderIds = [...new Set(items.map((i) => i.orderId))]
    await db.orderItem.deleteMany({ where: { orderId: { in: orderIds } } })
    await db.order.deleteMany({ where: { id: { in: orderIds } } })
    await db.customer.deleteMany({ where: { phone: { in: ['91111111', '92222222'] } } })
    await db.product.delete({ where: { id: product.id } })
    console.log('Cleaned up test product/order/customer rows.')
  }
}

main().catch((err) => { console.error('Test script failed:', err); process.exit(1) })
