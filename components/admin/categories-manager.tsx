'use client'

import { useRef, useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Check, X, Tag, ArrowUp, ArrowDown, Upload, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  reorderCategories,
  uploadCategoryImageAction,
} from '@/actions/category-actions'
import { slugify } from '@/lib/utils'
import type { StoreCategory } from '@/types'

type FormState = {
  name: string
  name_ar: string
  slug: string
  description: string
  image: string
}

const EMPTY_FORM: FormState = { name: '', name_ar: '', slug: '', description: '', image: '' }

function toFormState(cat: StoreCategory): FormState {
  return {
    name: cat.name,
    name_ar: cat.name_ar,
    slug: cat.slug,
    description: cat.description ?? '',
    image: cat.image ?? '',
  }
}

// ── Small image uploader (same pattern as the product form's compact widget) ──

function CategoryImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, startUpload] = useTransition()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    startUpload(async () => {
      try {
        const fd = new FormData()
        fd.append('file', file)
        const url = await uploadCategoryImageAction(fd)
        onChange(url)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed')
      }
    })
  }

  if (value) {
    return (
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        <img src={value} alt="" className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-0.5 top-0.5 rounded-full bg-white/90 p-0.5 text-neutral-600 shadow-sm hover:bg-white"
        >
          <X size={9} />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      disabled={uploading}
      className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600"
    >
      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={13} strokeWidth={1.5} />}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </button>
  )
}

// ── Shared form fields (used by both Add and Edit) ─────────────────────────────

function CategoryFields({
  form,
  onChange,
  autoSlug,
}: {
  form: FormState
  onChange: (patch: Partial<FormState>) => void
  autoSlug: boolean
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex items-center gap-3 sm:col-span-2">
        <CategoryImageUpload value={form.image} onChange={(image) => onChange({ image })} />
        <p className="text-[11px] font-light text-neutral-400">Optional category image</p>
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-light text-neutral-500">Name (English)</label>
        <input
          value={form.name}
          onChange={(e) => {
            const name = e.target.value
            onChange(autoSlug ? { name, slug: slugify(name) } : { name })
          }}
          placeholder="e.g. Skincare"
          required
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-light text-neutral-500">
          Name (Arabic) <span className="text-neutral-400">(optional)</span>
        </label>
        <input
          dir="rtl"
          value={form.name_ar}
          onChange={(e) => onChange({ name_ar: e.target.value })}
          placeholder="اسم الفئة"
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-right text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-light text-neutral-500">Slug</label>
        <input
          value={form.slug}
          onChange={(e) => onChange({ slug: e.target.value })}
          placeholder="e.g. SKINCARE"
          required
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 font-mono text-[12px] text-neutral-800 outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
        />
        <p className="mt-1 text-[10px] font-light text-neutral-400">
          Must exactly match the value stored on products in this category.
        </p>
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-light text-neutral-500">
          Description <span className="text-neutral-400">(optional)</span>
        </label>
        <input
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Short description"
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
        />
      </div>
    </div>
  )
}

// ── Add form ─────────────────────────────────────────────────────────────────

function AddCategoryForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function patch(p: Partial<FormState>) {
    setForm((f) => ({ ...f, ...p }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) return
    setError(null)

    startTransition(async () => {
      const result = await createCategory({
        name: form.name.trim(),
        name_ar: form.name_ar.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image: form.image || null,
        isActive: true,
        sortOrder: 0,
      })
      if (result.error) { setError(result.error); return }
      toast.success(`"${form.name}" created`)
      onDone()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
      <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-500">New Category</p>
      <CategoryFields form={form} onChange={patch} autoSlug />
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending || !form.name.trim() || !form.slug.trim()}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-neutral-900 px-4 text-[12px] font-light text-white transition-colors hover:bg-neutral-700 disabled:opacity-40"
        >
          <Check size={12} strokeWidth={2} />
          {pending ? 'Creating…' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 px-4 text-[12px] font-light text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          <X size={12} strokeWidth={2} />
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Edit row ──────────────────────────────────────────────────────────────────

function EditRow({ category, onDone }: { category: StoreCategory; onDone: () => void }) {
  const [form, setForm] = useState<FormState>(toFormState(category))
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function patch(p: Partial<FormState>) {
    setForm((f) => ({ ...f, ...p }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateCategory(category.id, {
        name: form.name.trim(),
        name_ar: form.name_ar.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image: form.image || null,
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      })
      if (result.error) { setError(result.error); return }
      toast.success('Category updated')
      onDone()
    })
  }

  return (
    <tr className="border-b border-neutral-50 bg-neutral-50/60">
      <td colSpan={6} className="px-5 py-4">
        <form onSubmit={handleSubmit}>
          <CategoryFields form={form} onChange={patch} autoSlug={false} />
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>}
          <div className="mt-3 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={pending}
              className="flex h-7 items-center gap-1 rounded-lg bg-neutral-900 px-3 text-[11px] text-white hover:bg-neutral-700 disabled:opacity-40"
            >
              <Check size={11} strokeWidth={2} />
              {pending ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onDone}
              className="flex h-7 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-[11px] text-neutral-600 hover:bg-neutral-100"
            >
              <X size={11} strokeWidth={2} />
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  )
}

// ── Delete button ─────────────────────────────────────────────────────────────

function DeleteButton({ category }: { category: StoreCategory }) {
  const [confirm, setConfirm] = useState(false)
  const [pending, startTransition] = useTransition()

  if (confirm) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={() =>
            startTransition(async () => {
              const result = await deleteCategory(category.id)
              if (result.error) { toast.error(result.error); setConfirm(false); return }
              toast.success(`"${category.name}" deleted`)
            })
          }
          disabled={pending}
          className="h-7 rounded-lg bg-red-600 px-3 text-[11px] text-white hover:bg-red-700 disabled:opacity-40"
        >
          {pending ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="h-7 rounded-lg border border-neutral-200 px-3 text-[11px] text-neutral-600 hover:bg-neutral-100"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
      title="Delete"
    >
      <Trash2 size={13} strokeWidth={1.5} />
    </button>
  )
}

// ── Active toggle ────────────────────────────────────────────────────────────

function ActiveToggle({ category }: { category: StoreCategory }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await toggleCategoryActive(category.id, !category.isActive)
          toast.success(category.isActive ? 'Hidden from storefront' : 'Now visible on storefront')
        })
      }
      disabled={pending}
      title={category.isActive ? 'Visible — click to hide' : 'Hidden — click to show'}
      className={[
        'flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:opacity-40',
        category.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-neutral-300 hover:bg-neutral-100',
      ].join(' ')}
    >
      {category.isActive ? <Eye size={14} strokeWidth={1.5} /> : <EyeOff size={14} strokeWidth={1.5} />}
    </button>
  )
}

// ── Reorder buttons ──────────────────────────────────────────────────────────

function ReorderButtons({
  index,
  total,
  onMove,
  disabled,
}: {
  index: number
  total: number
  onMove: (direction: -1 | 1) => void
  disabled: boolean
}) {
  return (
    <div className="flex flex-col">
      <button
        onClick={() => onMove(-1)}
        disabled={disabled || index === 0}
        className="rounded text-neutral-300 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-20"
        title="Move up"
      >
        <ArrowUp size={12} strokeWidth={2} />
      </button>
      <button
        onClick={() => onMove(1)}
        disabled={disabled || index === total - 1}
        className="rounded text-neutral-300 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-20"
        title="Move down"
      >
        <ArrowDown size={12} strokeWidth={2} />
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CategoriesManager({ categories: initial }: { categories: StoreCategory[] }) {
  const [categories, setCategories] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [reordering, startReorder] = useTransition()

  function move(index: number, direction: -1 | 1) {
    const next = [...categories]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setCategories(next)
    startReorder(async () => {
      await reorderCategories(next.map((c) => c.id))
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-light text-neutral-400">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex h-8 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-[12px] font-light text-white transition-colors hover:bg-neutral-700"
          >
            <Plus size={13} strokeWidth={2} />
            Add Category
          </button>
        )}
      </div>

      {adding && (
        <AddCategoryForm onDone={() => setAdding(false)} />
      )}

      {categories.length === 0 && !adding ? (
        <div className="rounded-xl border border-neutral-100 bg-white py-16 text-center">
          <Tag size={24} strokeWidth={1} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-[13px] font-light text-neutral-400">No categories yet.</p>
          <button
            onClick={() => setAdding(true)}
            className="mt-3 text-[13px] font-light text-neutral-600 underline underline-offset-2"
          >
            Create the first category
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['', 'Category', 'Slug', 'Description', 'Visible', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) =>
                editingId === cat.id ? (
                  <EditRow key={cat.id} category={cat} onDone={() => setEditingId(null)} />
                ) : (
                  <tr key={cat.id} className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/50">
                    <td className="px-5 py-3.5">
                      <ReorderButtons index={i} total={categories.length} onMove={(dir) => move(i, dir)} disabled={reordering} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {cat.image ? (
                          <img src={cat.image} alt="" className="h-8 w-8 flex-shrink-0 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-300">
                            <Tag size={13} strokeWidth={1.5} />
                          </div>
                        )}
                        <div>
                          <p className="text-[13px] font-normal text-neutral-800">{cat.name}</p>
                          {cat.name_ar && <p className="text-[11px] font-light text-neutral-400" dir="rtl">{cat.name_ar}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] text-neutral-400">{cat.slug}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-light text-neutral-500 line-clamp-1">{cat.description ?? '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <ActiveToggle category={cat} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingId(cat.id)}
                          className="flex h-7 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-[11px] font-light text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <Pencil size={11} strokeWidth={1.5} />
                          Edit
                        </button>
                        <DeleteButton category={cat} />
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
