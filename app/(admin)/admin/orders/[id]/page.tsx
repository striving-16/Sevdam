import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageCircle } from 'lucide-react'
import { getOrderById } from '@/actions/order-actions'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { WHATSAPP_NUMBER } from '@/lib/config'

const DELIVERY_LABELS: Record<string, string> = {
  home:    'Home Delivery',
  express: 'Express Delivery',
  pickup:  'Store Pickup',
}

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Order Detail — Admin' }

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        href="/admin/orders"
        className="mb-6 flex items-center gap-1.5 text-[12px] font-light text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        <ChevronLeft size={14} />
        Back to orders
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-[13px] font-light text-neutral-400">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer info */}
        <div className="rounded-xl border border-neutral-100 bg-white p-6">
          <h2 className="mb-4 text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
            Customer
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-light text-neutral-400">Name</p>
              <p className="mt-0.5 text-[14px] font-light text-neutral-800">{order.customerName}</p>
            </div>
            <div>
              <p className="text-[11px] font-light text-neutral-400">Phone</p>
              <p className="mt-0.5 text-[14px] font-light text-neutral-800">{order.customerPhone}</p>
            </div>
            <div>
              <p className="text-[11px] font-light text-neutral-400">Delivery type</p>
              <p className="mt-0.5 text-[14px] font-light text-neutral-800">
                {DELIVERY_LABELS[order.deliveryType] ?? order.deliveryType}
              </p>
            </div>
            {order.customerAddress && (
              <div>
                <p className="text-[11px] font-light text-neutral-400">Address</p>
                <p className="mt-0.5 text-[14px] font-light text-neutral-800">{order.customerAddress}</p>
              </div>
            )}
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi ${order.customerName}, regarding your order #${order.id.slice(-8).toUpperCase()} — `)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-fit items-center gap-2 rounded-full border border-[#25D366] px-4 py-2.5 text-[13px] font-light text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
          >
            <MessageCircle size={14} strokeWidth={1.5} />
            Contact on WhatsApp
          </a>
        </div>

        {/* Order items */}
        <div className="rounded-xl border border-neutral-100 bg-white p-6">
          <h2 className="mb-4 text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
            Items
          </h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-light text-neutral-800">
                      {item.product?.name_en ?? 'Product'}
                    </p>
                    <p className="text-[12px] font-light text-neutral-400">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[13px] font-light text-neutral-700">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <Separator className="my-3 bg-neutral-100" />
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-normal text-neutral-700">Total</p>
                <p className="text-[15px] font-light text-neutral-900">{formatPrice(order.totalPrice)}</p>
              </div>
            </div>
          ) : (
            <p className="text-[13px] font-light text-neutral-400">No items.</p>
          )}
        </div>
      </div>
    </div>
  )
}
