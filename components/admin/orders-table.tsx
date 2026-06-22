import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Order } from '@/types'

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-100 bg-white py-16 text-center">
        <p className="text-[13px] font-light text-neutral-400">No orders yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-100 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-100 hover:bg-transparent">
            {['Order', 'Customer', 'Total', 'Status', 'Date', 'Action'].map((h) => (
              <TableHead
                key={h}
                className="text-[11px] font-medium tracking-[0.1em] uppercase text-neutral-400"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-neutral-50 hover:bg-neutral-50/50">
              <TableCell>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-[13px] font-mono text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  #{order.id.slice(-6).toUpperCase()}
                </Link>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-[13px] font-normal text-neutral-800">{order.customerName}</p>
                  <p className="text-[12px] font-light text-neutral-400">{order.customerPhone}</p>
                </div>
              </TableCell>
              <TableCell className="text-[13px] font-light text-neutral-700">
                {formatPrice(order.totalPrice)}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-light',
                    ORDER_STATUS_COLORS[order.status]
                  )}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </TableCell>
              <TableCell className="text-[12px] font-light text-neutral-400">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
