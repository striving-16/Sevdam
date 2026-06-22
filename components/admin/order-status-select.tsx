'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateOrderStatus } from '@/actions/order-actions'
import { ORDER_STATUS_LABELS } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'DELIVERED',
  'CANCELLED',
]

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: OrderStatus
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  function handleChange(status: string) {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status as OrderStatus)
        toast.success(`Order status updated to ${ORDER_STATUS_LABELS[status]}`)
      } catch {
        toast.error('Failed to update order status')
      }
    })
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="h-8 w-[140px] text-[12px] border-neutral-200">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status} className="text-[12px]">
            {ORDER_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
