import { getCategories } from '@/actions/category-actions'
import { CategoriesManager } from '@/components/admin/categories-manager'

export const metadata = { title: 'Categories â€” Admin' }

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Categories</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">
          Manage store categories shown on the frontend
        </p>
      </div>

      <CategoriesManager categories={categories} />
    </div>
  )
}
