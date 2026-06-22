import { DashboardStats } from '@/components/admin/dashboard-stats'
import { getOrders } from '@/actions/order-actions'
import { getProducts } from '@/actions/product-actions'

export const metadata = { title: 'Dashboard â€” Admin' }

export default async function AdminDashboardPage() {
  const [orders, products] = await Promise.all([getOrders(), getProducts()])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Dashboard</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">Overview of your store</p>
      </div>

      <DashboardStats orders={orders} products={products} />

      {/* Recent orders */}
      <div className="mt-10">
        <h2 className="mb-4 text-[13px] font-medium tracking-[0.1em] uppercase text-neutral-500">
          Recent Orders
        </h2>
        <div className="space-y-2">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-4 sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 font-mono text-[12px] text-neutral-500">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
                <span className="truncate text-[13px] font-light text-neutral-700">{order.customerName}</span>
              </div>
              <span className="shrink-0 text-[12px] font-light text-neutral-400">{order.status}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="py-8 text-center text-[13px] font-light text-neutral-400">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
