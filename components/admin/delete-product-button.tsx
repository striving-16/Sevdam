'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteProduct } from '@/actions/product-actions'

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return

    startTransition(async () => {
      try {
        await deleteProduct(productId)
        toast.success('Product deleted')
        router.refresh()
      } catch {
        toast.error('Failed to delete product')
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
      className="h-8 rounded-lg px-3 text-[12px] font-light text-red-500 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={13} className="mr-1.5" />
      Delete
    </Button>
  )
}
