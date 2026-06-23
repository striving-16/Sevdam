import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getProductById } from '@/actions/product-actions'
import { ProductForm } from '@/components/admin/product-form'
import { VariantManager } from '@/components/admin/variant-manager'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

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
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Edit Product</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">{product.name_en}</p>
      </div>

      <ProductForm product={product} />

      {/* Shade / variant management — shown for all products (admin can enable variants first then add shades) */}
      <div className="mt-12 max-w-2xl">
        <div className="mb-5 border-t border-neutral-100 pt-8">
          <h2 className="text-[16px] font-light tracking-[-0.01em] text-neutral-800">Shades & Variants</h2>
          <p className="mt-1 text-[12px] font-light text-neutral-400">
            Add colour shades with individual stock quantities. Enable &ldquo;Has Shades&rdquo; in the form above to activate variant selection on the product page.
          </p>
        </div>
        <VariantManager productId={product.id} initialVariants={product.variants} />
      </div>
    </div>
  )
}
