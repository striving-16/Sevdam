import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getProducts } from '@/actions/product-actions'
import { OrderForm } from '@/components/admin/order-form'

export const metadata = { title: 'Log Order â€” Admin' }

export default async function NewOrderPage() {
  const products = await getProducts()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        href="/admin/orders"
        className="mb-6 flex items-center gap-1.5 text-[12px] font-light text-neutral-400 transition-colors hover:text-neutral-700"
      >
        <ChevronLeft size={14} />
        Back to orders
      </Link>

      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Log WhatsApp Order</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">
          Record an order received via WhatsApp to track it in the dashboard
        </p>
      </div>

      <OrderForm products={products} />
    </div>
  )
}
