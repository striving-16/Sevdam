import { getProducts } from '@/actions/product-actions'
import { InventoryTable } from '@/components/admin/inventory-table'

export const metadata = { title: 'Inventory â€” Admin' }

export default async function AdminInventoryPage() {
  const products = await getProducts()

  const outOfStock  = products.filter((p) => p.stock === 0).length
  const lowStock    = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const totalUnits  = products.reduce((sum, p) => sum + p.stock, 0)

  const sortedProducts = [...products].sort((a, b) => a.stock - b.stock)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Inventory</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">
          Click any stock number to edit it inline
        </p>
      </div>

      {/* Summary row */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Total Units',   value: totalUnits,  cls: 'text-neutral-800' },
          { label: 'Low Stock',     value: lowStock,    cls: lowStock   > 0 ? 'text-amber-600' : 'text-neutral-800' },
          { label: 'Out of Stock',  value: outOfStock,  cls: outOfStock > 0 ? 'text-red-600'   : 'text-neutral-800' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-neutral-100 bg-white px-5 py-4">
            <p className="text-[11px] font-light uppercase tracking-[0.2em] text-neutral-400">{s.label}</p>
            <p className={`mt-1.5 text-[28px] font-extralight ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-neutral-100 bg-white py-16 text-center">
          <p className="text-[13px] font-light text-neutral-400">No products found.</p>
        </div>
      ) : (
        <InventoryTable products={sortedProducts} />
      )}
    </div>
  )
}
