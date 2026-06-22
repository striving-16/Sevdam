import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/product-form'

export const metadata = { title: 'New Product â€” Admin' }

export default function NewProductPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        href="/admin/products"
        className="mb-6 flex items-center gap-1.5 text-[12px] font-light text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        <ChevronLeft size={14} />
        Back to products
      </Link>
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">New Product</h1>
      </div>
      <ProductForm />
    </div>
  )
}
