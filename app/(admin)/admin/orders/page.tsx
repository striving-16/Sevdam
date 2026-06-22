import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getOrders } from '@/actions/order-actions'
import { OrdersTable } from '@/components/admin/orders-table'

export const metadata = { title: 'Orders â€” Admin' }

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Orders</h1>
          <p className="mt-1 text-[13px] font-light text-neutral-400">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/orders/new"
          className="flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-5 text-[12px] font-light text-white transition-colors hover:bg-neutral-700"
        >
          <Plus size={13} strokeWidth={2} />
          Log Order
        </Link>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
