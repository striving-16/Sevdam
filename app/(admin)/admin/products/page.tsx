import Link from 'next/link'
import { Plus, Pencil, Star } from 'lucide-react'
import { getProducts } from '@/actions/product-actions'
import { DeleteProductButton } from '@/components/admin/delete-product-button'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata = { title: 'Products â€” Admin' }

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Products</h1>
          <p className="mt-1 text-[13px] font-light text-neutral-400">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild className="h-9 rounded-full bg-neutral-900 px-5 text-[12px] font-light text-white hover:bg-neutral-700">
          <Link href="/admin/products/new">
            <Plus size={14} className="mr-1.5" />
            New product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-neutral-100 bg-white py-16 text-center">
          <p className="text-[13px] font-light text-neutral-400">No products yet.</p>
          <Link href="/admin/products/new" className="mt-3 inline-block text-[13px] font-light text-neutral-600 underline underline-offset-2">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-100 hover:bg-transparent">
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
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
              {products.map((product) => (
                <TableRow key={product.id} className="border-neutral-50 hover:bg-neutral-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.imageUrl && (
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-neutral-100">
                          <img src={product.imageUrl} alt={product.name_en} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] font-normal text-neutral-800">{product.name_en}</p>
                        <p className="text-[11px] font-light text-neutral-400">{product.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] font-light text-neutral-400">
                      {product.category.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-[13px] font-light text-neutral-700">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock === 0
                          ? 'text-[12px] font-light text-red-500'
                          : product.stock <= 5
                            ? 'text-[12px] font-light text-amber-600'
                            : 'text-[12px] font-light text-neutral-700'
                      }
                    >
                      {product.stock === 0 ? 'Out of stock' : product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.isBestseller && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
                        <Star size={9} className="fill-amber-500 text-amber-500" />
                        Featured
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg px-3 text-[12px] font-light text-neutral-600 hover:text-neutral-900"
                      >
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil size={13} className="mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteProductButton productId={product.id} productName={product.name_en} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
