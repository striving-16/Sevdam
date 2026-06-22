import { formatPrice } from '@/lib/utils'
import type { Order, Product } from '@/types'

interface DashboardStatsProps {
  orders: Order[]
  products: Product[]
}

export function DashboardStats({ orders, products }: DashboardStatsProps) {
  const totalRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), sub: 'All time' },
    { label: 'Pending', value: pendingOrders.toString(), sub: 'Awaiting action' },
    { label: 'Revenue', value: formatPrice(totalRevenue), sub: 'Delivered orders' },
    { label: 'Low Stock', value: lowStock.toString(), sub: `${outOfStock} out of stock` },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-neutral-100 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <p className="text-[11px] font-light tracking-[0.2em] uppercase text-neutral-400">
            {stat.label}
          </p>
          <p className="mt-2 text-[26px] font-extralight text-neutral-900">{stat.value}</p>
          <p className="mt-1 text-[11px] font-light text-neutral-400">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}
